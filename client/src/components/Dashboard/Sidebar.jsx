import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Logo from "../Logo";

function Sidebar({ activeChannel ,setActiveChannel }) {

    const channels = ['general', 'design-team', 'engineering', 'marketing', 'random'];
    const directMessages = ['Sarah Miller', 'John Doe', 'SyncBot (AI)', 'Dave Wilson'];

    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="w-64 bg-brand-primary shrink-0 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                    <Logo className="w-6 h-6 text-white" variant="light" />
                    <h2 className="text-white font-bold text-lg tracking-tight">SyncSpace</h2>
                </div>
                <svg className="w-4 h-4 text-white/50 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            <div className="flex-1 overflow-y-auto pt-4">
                {/* Channels Section */}
                <div className="px-4 mb-6">
                    <div className="flex items-center justify-between text-white/50 text-xs font-bold uppercase tracking-wider mb-2">
                        <span>Channels</span>
                        <button className="hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-0.5">
                        {channels.map((channel) => (
                            <button
                                key={channel}
                                onClick={() => setActiveChannel(channel)}
                                className={`w-full text-left px-2 py-1.5 rounded text-sm transition-all flex items-center gap-2 ${activeChannel === channel
                                    ? 'bg-brand-secondary text-white font-semibold'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <span className="opacity-50">#</span>
                                {channel}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Direct Messages Section */}
                <div className="px-4 mb-6">
                    <div className="flex items-center justify-between text-white/50 text-xs font-bold uppercase tracking-wider mb-2">
                        <span>Direct Messages</span>
                        <button className="hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-0.5">
                        {directMessages.map((name) => (
                            <button
                                key={name}
                                className="w-full text-left px-2 py-1.5 rounded text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Profile Area */}
            <div className="p-4 bg-brand-primary/50 border-t border-white/10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                        {user?.email?.[0].toUpperCase()}
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
