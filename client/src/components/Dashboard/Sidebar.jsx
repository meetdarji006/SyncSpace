import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Logo from "../Logo";

function Sidebar({
    organization,
    channels = [],
    activeChannelId,
    setActiveChannelId,
    onCreateChannel,
    members = [],
    activeMemberId,
    onSelectMember
}) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleSwitchOrg = () => {
        navigate('/select-organization');
    }

    return (
        <div className="w-64 bg-brand-primary shrink-0 flex flex-col">
            <div
                onClick={handleSwitchOrg}
                className="p-4 border-b border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors"
                title="Switch Organization"
            >
                <div className="flex items-center gap-2 max-w-[85%]">
                    <Logo className="w-6 h-6 text-white shrink-0" variant="light" />
                    <h2 className="text-white font-bold text-lg tracking-tight truncate">
                        {organization?.name || 'SyncSpace'}
                    </h2>
                </div>
                <svg className="w-4 h-4 text-white/50 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
            </div>

            <div className="flex-1 overflow-y-auto pt-4 no-scrollbar">
                {/* Channels Section */}
                <div className="px-4 mb-6">
                    <div className="flex items-center justify-between text-white/50 text-xs font-bold uppercase tracking-wider mb-2">
                        <span>Channels</span>
                        <button
                            onClick={() => onCreateChannel(null)}
                            className="hover:text-white transition-colors"
                            title="Create Channel"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-0.5">
                        {channels.filter(c => !c.parentChannelId).length === 0 ? (
                            <p className="text-white/30 text-xs px-2 italic">No channels yet.</p>
                        ) : (
                            channels.filter(c => !c.parentChannelId).map((parent) => {
                                // Determine if this parent should be expanded
                                const activeChannel = channels.find(c => c.id === activeChannelId);
                                const isExpanded = activeChannelId === parent.id || (activeChannel?.parentChannelId === parent.id);
                                const subChannels = channels.filter(c => c.parentChannelId === parent.id);
                                const hasSubChannels = subChannels.length > 0;

                                return (
                                    <div key={parent.id} className="mb-1">
                                        <div className="group flex items-center justify-between w-full text-left px-2 py-1.5 rounded text-sm transition-all hover:bg-white/5">
                                            <button
                                                onClick={() => setActiveChannelId(parent.id)}
                                                className={`flex-1 flex items-center gap-2 truncate ${activeChannelId === parent.id ? 'text-white font-semibold' : 'text-white/70'}`}
                                            >
                                                <span className="opacity-50">#</span>
                                                {parent.name}
                                                {hasSubChannels && (
                                                    <svg className={`w-3 h-3 text-white/30 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onCreateChannel(parent.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-white transition-opacity"
                                                title="Create Sub-channel"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Sub-channels with Transition */}
                                        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded && hasSubChannels ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                            <div className="overflow-hidden">
                                                <div className="ml-4 space-y-0.5 border-l border-white/10 pl-2 mt-0.5 pb-1">
                                                    {subChannels.map(sub => (
                                                        <button
                                                            key={sub.id}
                                                            onClick={() => setActiveChannelId(sub.id)}
                                                            className={`w-full text-left px-2 py-1 rounded text-xs transition-all flex items-center gap-2 ${activeChannelId === sub.id
                                                                ? 'bg-brand-secondary text-white font-semibold'
                                                                : 'text-white/60 hover:bg-white/10 hover:text-white'
                                                                }`}
                                                        >
                                                            <span className="opacity-50">•</span>
                                                            {sub.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Direct Messages Section */}
                <div className="px-4 mb-6">
                    <div className="flex items-center justify-between text-white/50 text-xs font-bold uppercase tracking-wider mb-2">
                        <span>Members</span>
                    </div>
                    <div className="space-y-0.5">
                        {members.length === 0 ? (
                            <p className="text-white/30 text-xs px-2 italic">No members found.</p>
                        ) : (
                            members.map(member => (
                                <button
                                    key={member.userId}
                                    onClick={() => onSelectMember(member.userId)}
                                    className={`w-full text-left px-2 py-1.5 rounded text-sm transition-all flex items-center gap-2 ${activeMemberId === member.userId
                                            ? 'bg-white/10 text-white font-semibold'
                                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div className="w-5 h-5 rounded bg-brand-secondary/50 flex items-center justify-center text-[10px] text-white overflow-hidden shrink-0">
                                        {member.avatarUrl ? <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" /> : (member.name?.[0] || 'U')}
                                    </div>
                                    <span className="truncate flex-1">{member.name || 'User'}</span>
                                    {member.role === 'owner' && <span className="text-[9px] bg-white/20 px-1 rounded text-white/70">Owner</span>}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* User Profile Area */}
            <div className="p-4 bg-brand-primary/50 border-t border-white/10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                        {user?.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            user?.email?.[0].toUpperCase()
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-bold truncate">{user?.email?.split('@')[0]}</p>
                        <p className="text-white/50 text-xs truncate">Active</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Sidebar
