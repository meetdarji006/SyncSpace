import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Sidebar from '../components/Dashboard/Sidebar';
import useAuth from '../hooks/useAuth';
import api from '../utils/api';
import { toast } from 'sonner';
import { io } from 'socket.io-client';

import MessageInput from '../components/Dashboard/MessageInput';
import VideoRoom from '../components/Dashboard/VideoRoom';

const Dashboard = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const organizationId = state?.organizationId;

    const [organization, setOrganization] = useState(null);
    const [channels, setChannels] = useState([]);
    const [activeChannelId, setActiveChannelId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [socket, setSocket] = useState(null);


    // Direct Message State
    const [members, setMembers] = useState([]);
    const [activeMemberId, setActiveMemberId] = useState(null);
    const [viewMode, setViewMode] = useState('channel'); // 'channel' | 'dm'

    // Video Call State
    const [activeCall, setActiveCall] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);

    const messagesEndRef = useRef(null);

    // Redirect if no organization selected
    useEffect(() => {
        if (!organizationId) {
            navigate('/select-organization');
        }
    }, [organizationId, navigate]);

    // Initialize Socket
    useEffect(() => {
        const newSocket = io("http://localhost:5000"); // Matches server PORT
        setSocket(newSocket);

        if (user) {
            newSocket.emit('join_user', user.id);
        }

        return () => newSocket.close();
    }, [user]); // Re-run if user changes (though it shouldn't really in this context)

    // Fetch Organization, Channels, and Members
    useEffect(() => {
        if (organizationId && user) {
            fetchDashboardData();
        }
    }, [organizationId, user]);

    // Fetch Messages when Active Channel Changes or Active Member Changes
    useEffect(() => {
        if (socket) {
            // Channel Chat
            if (viewMode === 'channel' && activeChannelId) {
                fetchChannelMessages(activeChannelId);
                socket.emit('join_channel', activeChannelId);

                socket.off('receive_message'); // Clean previous listener specific to channel
                socket.on('receive_message', (message) => {
                    if (message.channelId === activeChannelId) {
                        setMessages((prev) => {
                            if (prev.some(m => m.id === message.id)) return prev;
                            return [...prev, message];
                        });
                    }
                });

                return () => {
                    socket.emit('leave_channel', activeChannelId);
                    socket.off('receive_message');
                }
            }
            // Direct Message Chat
            else if (viewMode === 'dm' && activeMemberId) {
                fetchDirectMessages(activeMemberId);

                // We don't join/leave room for DM, we are joined to our user room permanently.
                // But we need to listen for DMs.
                // Wait, global listener for DMs or scoped?
                // The socket "join_user" is global.
                // We should listen to 'receive_direct_message' globally, but only update `messages` if it matches activeMemberId

                socket.off('receive_direct_message');
                socket.on('receive_direct_message', (message) => {
                    if ((message.senderId === activeMemberId && message.receiverId === user.id) ||
                        (message.senderId === user.id && message.receiverId === activeMemberId)) {
                        setMessages((prev) => {
                            if (prev.some(m => m.id === message.id)) return prev;
                            return [...prev, message];
                        });
                    } else {
                        // Optional: Show notification for other DMs
                        if (message.receiverId === user.id) {
                            toast.info(`New message from ${message.senderName || 'User'}`);
                        }
                    }
                });

                return () => {
                    socket.off('receive_direct_message');
                }
            }
        }
    }, [activeChannelId, activeMemberId, viewMode, socket, user?.id]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [orgRes, channelsRes, membersRes] = await Promise.all([
                api.get(`/organizations/${organizationId}`),
                api.get(`/channels/organization/${organizationId}`),
                api.get(`/organizations/${organizationId}/members`)
            ]);
            setOrganization(orgRes.data);
            setChannels(channelsRes.data);
            setMembers(membersRes.data.filter(m => m.userId !== user.id));

            if (channelsRes.data.length > 0) {
                setActiveChannelId(channelsRes.data[0].id);
                setViewMode('channel');
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const fetchChannelMessages = async (channelId) => {
        setMessagesLoading(true);
        try {
            const response = await api.get(`/channels/${channelId}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to load messages", error);
        } finally {
            setMessagesLoading(false);
        }
    }

    const fetchDirectMessages = async (otherUserId) => {
        setMessagesLoading(true);
        try {
            const response = await api.get(`/direct-messages`, {
                params: { userId: user.id, otherUserId }
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to load direct messages", error);
        } finally {
            setMessagesLoading(false);
        }
    }


    const handleSendMessage = async (content, attachmentUrl = null, attachmentType = null) => {
        if ((!content || !content.trim()) && !attachmentUrl) return;

        try {
            if (viewMode === 'channel' && activeChannelId) {
                await api.post('/channels/message', {
                    channelId: activeChannelId,
                    userId: user.id,
                    content: content,
                    attachmentUrl,
                    attachmentType
                });
            } else if (viewMode === 'dm' && activeMemberId) {
                await api.post('/direct-messages', {
                    senderId: user.id,
                    receiverId: activeMemberId,
                    content: content,
                    attachmentUrl,
                    attachmentType
                });
            }
            // MessageInput clears itself.
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message");
        }
    };

    const handleCreateChannel = async (parentChannelId = null) => {
        const channelName = prompt(parentChannelId ? "Enter sub-channel name:" : "Enter channel name:");
        if (!channelName) return;
        try {
            await api.post('/channels', {
                name: channelName,
                organizationId,
                userId: user.id,
                parentChannelId
            });
            toast.success("Channel created");
            fetchDashboardData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to create channel");
        }
    }

    const handleSelectChannel = (channelId) => {
        setActiveChannelId(channelId);
        setViewMode('channel');
        setActiveMemberId(null);
    }

    const handleSelectMember = (memberId) => {
        setActiveMemberId(memberId);
        setViewMode('dm');
        setActiveChannelId(null);
    }

    const activeChannel = channels.find(c => c.id === activeChannelId);
    const activeMember = members.find(m => m.userId === activeMemberId);
    const chatTitle = viewMode === 'channel' ? `#${activeChannel?.name || 'select-channel'}` : `@${activeMember?.name || 'User'}`;

    if (loading && !organization) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return (
        <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                organization={organization}
                channels={channels}
                activeChannelId={activeChannelId}
                setActiveChannelId={handleSelectChannel}
                onCreateChannel={handleCreateChannel}
                members={members}
                activeMemberId={activeMemberId}
                onSelectMember={handleSelectMember}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50/30">
                {/* Header */}
                <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        {viewMode === 'dm' && activeMember?.avatarUrl &&
                            <img src={activeMember.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                        }

                        <h3 className="font-extrabold text-xl tracking-tight">{chatTitle}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                        {viewMode === 'channel' && activeChannelId && (
                            <button
                                onClick={() => setActiveCall(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-secondary transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                <span>Join Call</span>
                            </button>
                        )}
                    </div>
                </header>

                {/* Messages List Area */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col">
                    {messagesLoading ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary"></div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-brand-primary/5 rounded-2xl flex items-center justify-center mb-6 text-brand-primary">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {viewMode === 'channel' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    )}
                                </svg>
                            </div>
                            <h4 className="text-2xl font-bold mb-2 tracking-tight">Welcome to {chatTitle}!</h4>
                            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                                {viewMode === 'channel' ? `This is the beginning of the ${chatTitle} channel.` : `This is the beginning of your conversation with ${activeMember?.name || 'User'}.`}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((msg) => {
                                const isMe = msg.senderId === user.id;
                                return (
                                    <div key={msg.id} className={`flex gap-3 mb-4 group ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary shadow-sm shrink-0 text-white flex items-center justify-center font-bold text-xs mt-1 overflow-hidden">
                                            {msg.senderAvatar ? <img src={msg.senderAvatar} alt="" className="w-full h-full object-cover" /> : (
                                                msg.senderName
                                                    ? msg.senderName.slice(0, 1).toUpperCase()
                                                    : (msg.senderId ? msg.senderId.slice(0, 1).toUpperCase() : 'U')
                                            )}
                                        </div>
                                        <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                <span className="font-bold text-xs text-gray-700">
                                                    {isMe ? 'You' : (msg.senderName || `User ${msg.senderId?.slice(0, 4)}`)}
                                                </span>
                                                <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed break-words markdown-body ${isMe
                                                ? 'bg-brand-primary text-white rounded-tr-none markdown-inverse'
                                                : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none markdown-regular'
                                                }`}>

                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.content}
                                                </ReactMarkdown>
                                                {msg.attachmentUrl && (
                                                    <div className="mt-2">
                                                        {msg.attachmentType?.startsWith('image/') ? (
                                                            <img
                                                                src={msg.attachmentUrl}
                                                                alt="attachment"
                                                                className="max-w-[300px] max-h-[300px] rounded-lg border border-gray-200/20"
                                                            />
                                                        ) : (
                                                            <a
                                                                href={msg.attachmentUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`flex items-center gap-2 p-2 rounded bg-opacity-10 ${isMe ? 'bg-white text-white' : 'bg-gray-100 text-gray-700'} hover:underline`}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                                <span className="text-sm truncate max-w-[200px]">Attachment</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Message Input Area */}
                <div className="p-6 pt-0 shrink-0">
                    <MessageInput
                        onSendMessage={handleSendMessage}
                        placeholder={`Message ${chatTitle || '...'}`}
                    />
                </div>

            </div>

            {activeCall && socket && (
                <VideoRoom
                    channelId={activeChannelId}
                    socket={socket}
                    isVideoOn={isVideoOn}
                    isAudioOn={isAudioOn}
                    onLeave={() => setActiveCall(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;
