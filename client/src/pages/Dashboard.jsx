import { useState } from 'react';
import Sidebar from '../components/Dashboard/Sidebar';

const Dashboard = () => {
    const [activeChannel, setActiveChannel] = useState('general');
    
    return (
        <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <Sidebar activeChannel={activeChannel} setActiveChannel={setActiveChannel} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50/30">
                {/* Header */}
                <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <h3 className="font-extrabold text-xl tracking-tight">#{activeChannel}</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 py-1.5 px-4 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white transition-all"
                            />
                            <svg className="w-4 h-4 absolute right-3 top-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center hover:bg-brand-primary/20 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Messages List Area (Empty Placeholder) */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-brand-primary/5 rounded-2xl flex items-center justify-center mb-6 text-brand-primary">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h4 className="text-2xl font-bold mb-2 tracking-tight">Welcome to #{activeChannel}!</h4>
                    <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                        This is the beginning of the #{activeChannel} channel. Use it to collaborate, share updates, and sync with your team.
                    </p>
                    <button className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-lg shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all transform hover:scale-105">
                        Post first message
                    </button>
                </div>

                {/* Message Input Area */}
                <div className="p-6 pt-0 shrink-0">
                    <div className="bg-white border-2 border-gray-200 rounded-xl focus-within:border-brand-primary/40 transition-all shadow-sm">
                        <div className="p-1 border-b border-gray-100 flex items-center gap-1">
                            {['B', 'I', 'S', '<>', 'List'].map((btn) => (
                                <button key={btn} className="w-8 h-8 rounded hover:bg-gray-100 text-gray-500 font-bold text-xs">
                                    {btn}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder={`Message #${activeChannel}`}
                            className="w-full p-4 text-sm focus:outline-none placeholder:text-gray-400"
                        />
                        <div className="p-2 flex items-center justify-between bg-gray-50/50 rounded-b-xl border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <button className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-500 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                                <button className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-500 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            </div>
                            <button className="bg-brand-primary/10 text-brand-primary p-2 rounded-lg hover:bg-brand-primary hover:text-white transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
