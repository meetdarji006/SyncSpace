
import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { toast } from 'sonner';

const VideoRoom = ({ channelId, socket, isVideoOn, isAudioOn, onLeave }) => {
    const [peers, setPeers] = useState([]);
    const [stream, setStream] = useState(null);
    const userVideo = useRef();
    const peersRef = useRef([]);

    useEffect(() => {
        // Request media access
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(currentStream => {
            setStream(currentStream);
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }

            // Join the call after getting stream
            socket.emit("join_call", channelId);

            // Listen for list of existing users in the call
            socket.on("all_users_in_call", users => {
                const peersArr = [];
                users.forEach(userId => {
                    const peer = createPeer(userId, socket.id, currentStream);
                    peersRef.current.push({
                        peerID: userId,
                        peer,
                    });
                    peersArr.push({
                        peerID: userId,
                        peer
                    });
                });
                setPeers(peersArr);
            });

            // Listen for new user joining
            socket.on("user_joined_call", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.callerID);
                if (!item) {
                    const peer = addPeer(payload.signal, payload.callerID, currentStream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    });
                    setPeers(users => [...users, { peerID: payload.callerID, peer }]);
                }
            });

            // Listen for answer from existing user
            socket.on("receiving_returned_signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                if (item) {
                    item.peer.signal(payload.signal);
                }
            });

            // Listen for user leaving
            socket.on("user_left_call", id => {
                const item = peersRef.current.find(p => p.peerID === id);
                if (item) {
                    item.peer.destroy();
                }
                const newPeers = peersRef.current.filter(p => p.peerID !== id);
                peersRef.current = newPeers;
                setPeers(newPeers);
            });
        }).catch(err => {
            console.error("Failed to get media stream", err);
            toast.error("Failed to access camera/microphone");
            onLeave();
        });

        return () => {
            // Cleanup
            socket.emit('leave_call', channelId);
            socket.off("all_users_in_call");
            socket.off("user_joined_call");
            socket.off("receiving_returned_signal");
            socket.off("user_left_call");

            // Stop tracks
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // Destroy all peers
            peersRef.current.forEach(({ peer }) => {
                peer.destroy();
            });
        };
    }, []); // Only run once on mount

    // Toggle tracks if props change
    useEffect(() => {
        if (stream) {
            stream.getVideoTracks().forEach(track => track.enabled = isVideoOn);
            stream.getAudioTracks().forEach(track => track.enabled = isAudioOn);
        }
    }, [isVideoOn, isAudioOn, stream]);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socket.emit("sending_signal", { userToSignal, callerID, signal });
        });

        peer.on("error", err => console.error("Peer error:", err));

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socket.emit("returning_signal", { signal, callerID, id: socket.id });
        });

        peer.on("error", err => console.error("Peer error:", err));

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-95 flex flex-col p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-lg font-semibold">Channel Call</h2>
                <div className="flex items-center gap-4">
                    <div className="bg-gray-800 rounded-lg px-3 py-1 text-white text-sm">
                        {peers.length + 1} Participants
                    </div>
                    <button onClick={onLeave} className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors">
                        Leave Call
                    </button>
                </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                <div className="relative rounded-xl overflow-hidden bg-gray-800 aspect-video shadow-lg border-2 border-brand-primary">
                    <video ref={userVideo} muted autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">You</div>
                </div>

                {peers.map(({ peerID, peer }) => (
                    <VideoCard key={peerID} peer={peer} username={peerID.slice(0, 5)} />
                ))}
            </div>

            {/* Controls */}
            <div className="h-16 flex items-center justify-center gap-4 mt-4">
                {/* Could add mute/video toggle buttons that call parent callbacks here if we want controls inside the modal */}
            </div>
        </div>
    );
};

// Sub-component for individual peer video
const VideoCard = ({ peer, username }) => {
    const ref = useRef();

    useEffect(() => {
        peer.on("stream", stream => {
            if (ref.current) {
                ref.current.srcObject = stream;
            }
        });
    }, [peer]);

    return (
        <div className="relative rounded-xl overflow-hidden bg-gray-800 aspect-video shadow-lg">
            <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">User {username}</div>
        </div>
    );
};

export default VideoRoom;
