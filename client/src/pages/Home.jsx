import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Home = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-brand-light font-sans text-brand-primary selection:bg-brand-tertiary selection:text-white">
            {/* Navbar - Modern Glass Effect */}
            <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-brand-primary/90 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <Logo className="w-8 h-8" variant={scrolled ? "light" : "dark"} />
                            <span className={`text-2xl font-bold tracking-tight transition-colors ${scrolled ? 'text-white' : 'text-brand-primary'}`}>
                                SyncSpace
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            {['Features', 'Enterprise', 'Resources'].map((item) => (
                                <a key={item} href={`#${item.toLowerCase()}`} className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-300 hover:text-white' : 'text-brand-secondary hover:text-brand-primary'}`}>
                                    {item}
                                </a>
                            ))}
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className={`text-sm font-semibold transition-all ${scrolled ? 'text-white hover:text-gray-200' : 'text-brand-primary hover:text-brand-secondary'}`}>
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg ${scrolled ? 'bg-white text-brand-primary hover:bg-gray-100' : 'bg-brand-primary text-white hover:bg-brand-primary/90'}`}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Modern Clean Layout */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-gradient-to-br from-brand-secondary/20 to-brand-tertiary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-gradient-to-tr from-brand-tertiary/20 to-brand-secondary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-secondary text-sm font-medium mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-secondary"></span>
                        </span>
                        New: AI-powered study groups are here
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-brand-primary mb-8 max-w-4xl leading-tight">
                        Your campus, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-tertiary">digitally reimagined.</span>
                    </h1>

                    <p className="text-xl text-brand-tertiary max-w-2xl mb-12 leading-relaxed">
                        The all-in-one workspace for students. Organize your assignments, collaborate in real-time, and share resources without the chaos.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link to="/signup" className="px-8 py-4 rounded-xl bg-brand-primary text-white font-bold text-lg shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:shadow-brand-primary/30 hover:-translate-y-1 transition-all duration-300">
                            Create Free Orginization
                        </Link>

                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="mt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                    <div className="relative rounded-2xl bg-brand-primary p-2 shadow-2xl ring-1 ring-black/5">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 w-1/3 h-1 bg-gradient-to-r from-transparent via-brand-tertiary/50 to-transparent blur-sm"></div>
                        <div className="rounded-xl overflow-hidden bg-white border border-brand-primary/10 aspect-[16/9] shadow-inner">
                            {/* Mock UI Header */}
                            <div className="h-10 border-b border-gray-100 bg-gray-50/50 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                                </div>
                                <div className="h-5 w-64 bg-white border border-gray-200 rounded-md ml-4"></div>
                            </div>
                            {/* Detailed Dashboard UI */}
                            <div className="flex h-full font-sans text-brand-primary">
                                {/* Sidebar Navigation */}
                                <div className="w-16 bg-brand-primary hidden sm:flex flex-col items-center py-6 gap-6 shrink-0">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer text-white">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-brand-secondary text-white flex items-center justify-center shadow-lg cursor-pointer border border-white/10">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer text-white">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    </div>
                                </div>

                                {/* Channel List */}
                                <div className="w-56 bg-[#f8f9fa] border-r border-[#e9ecef] hidden md:flex flex-col">
                                    <div className="p-4 border-b border-[#e9ecef]">
                                        <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                                            <span>Physics 101</span>
                                            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </h3>
                                    </div>
                                    <div className="flex-1 p-3 space-y-6 overflow-y-auto">
                                        <div>
                                            <p className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Channels</p>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-brand-light/50 text-brand-primary font-medium cursor-pointer">
                                                    <span className="text-gray-400">#</span> general
                                                </div>
                                                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer transition-colors">
                                                    <span className="text-gray-400">#</span> homework-help
                                                </div>
                                                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer transition-colors">
                                                    <span className="text-gray-400">#</span> exams
                                                    <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 rounded-full">1</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Direct Messages</p>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer transition-colors">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Sarah J.
                                                </div>
                                                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer transition-colors">
                                                    <div className="w-2 h-2 rounded-full bg-gray-300"></div> Mike T.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Chat Area */}
                                <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                                    {/* Chat Header */}
                                    <div className="h-14 border-b border-[#e9ecef] flex items-center justify-between px-6 shrink-0 z-10 bg-white/95 backdrop-blur-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 font-light text-lg">#</span>
                                            <h3 className="font-bold text-gray-800">general</h3>
                                            <span className="text-xs text-gray-400 ml-2 pt-0.5">Physics 101 Discussion</span>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                    U{i}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 p-6 space-y-6 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:20px_20px]">
                                        <div className="opacity-60 text-center text-xs text-gray-400 my-4">Today</div>

                                        <div className="flex gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-sm shrink-0 text-white flex items-center justify-center font-bold text-sm">LJ</div>
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-bold text-sm text-gray-900">Lisa Johnson</span>
                                                    <span className="text-[10px] text-gray-400">10:42 AM</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                    Hey everyone! Just uploaded the notes from today's lecture. Let me know if you can't access them.
                                                </p>
                                                <div className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-brand-light/50 border border-brand-primary/5 rounded-lg text-xs font-medium text-brand-primary hover:bg-brand-light transition-colors cursor-pointer">
                                                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0111.414 2.586L15 6.172A2 2 0 0115.586 7.586V15a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                                                    Lecture_03_Forces.pdf
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm shrink-0 text-white flex items-center justify-center font-bold text-sm">MD</div>
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-bold text-sm text-gray-900">Mark Davis</span>
                                                    <span className="text-[10px] text-gray-400">10:45 AM</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                    Thanks Lisa! This is super helpful.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-4 border-t border-[#e9ecef] bg-white">
                                        <div className="flex items-center gap-2 p-2 bg-[#f8f9fa] border border-[#e9ecef] rounded-xl">
                                            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
                                            <div className="h-4 w-px bg-gray-300 mx-1"></div>
                                            <span className="text-sm text-gray-400 ml-1">Message #general</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bento Grid Features */}
            <div id="features" className="py-32 px-6 lg:px-8 bg-white text-brand-primary">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20">
                        <h2 className="text-4xl font-bold tracking-tight mb-4">Designed for the modern student.</h2>
                        <p className="text-xl text-brand-tertiary max-w-2xl">Everything you need to survive the semester, packed into one beautiful interface.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
                        {/* Large Card */}
                        <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-brand-primary p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10 shadow-inner">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">Subject Channels</h3>
                                    <p className="text-brand-tertiary text-lg font-medium leading-relaxed">Keep your physics homework separate from your literature essays. Organized chaos is still organized.</p>
                                </div>
                                <div className="mt-8 rounded-2xl bg-brand-primary/50 border border-white/10 p-5 backdrop-blur-md shadow-lg">
                                    <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider mb-3 ml-2">Active Channels</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 border border-white/5 hover:bg-white/15 transition-colors cursor-pointer group/item">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                                                <span className="font-mono text-sm text-gray-100 font-medium"># physics-101</span>
                                            </div>
                                            <span className="text-[10px] bg-brand-secondary/30 text-brand-secondary px-2 py-0.5 rounded-full border border-brand-secondary/20">2 new</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group/item text-gray-400 hover:text-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-gray-600 group-hover/item:bg-gray-500 transition-colors"></div>
                                                <span className="font-mono text-sm font-medium"># literature-202</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group/item text-gray-400 hover:text-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-gray-600 group-hover/item:bg-gray-500 transition-colors"></div>
                                                <span className="font-mono text-sm font-medium"># campus-events</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tall Card */}
                        <div className="md:col-span-1 md:row-span-2 rounded-3xl bg-brand-light p-8 relative overflow-hidden group hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center mb-6 text-brand-secondary">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-brand-primary">Real-time Chat</h3>
                            <p className="text-brand-tertiary mb-6">Don't wait for emails. Get answers instantly.</p>
                            <div className="space-y-4 mt-auto">
                                {/* Message 1 */}
                                <div className="flex gap-3 items-end">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 shadow-sm shrink-0"></div>
                                    <div className="p-3 rounded-2xl bg-white shadow-sm border border-gray-100 rounded-bl-none max-w-[85%]">
                                        <p className="text-xs text-brand-primary leading-relaxed font-medium">Has anyone finished the Lab 3 formatting?</p>
                                    </div>
                                </div>
                                {/* Message 2 (Self) */}
                                <div className="flex gap-3 items-end justify-end">
                                    <div className="p-3 rounded-2xl bg-brand-primary text-white shadow-md rounded-br-none max-w-[85%]">
                                        <p className="text-xs leading-relaxed">Just submitted! Make sure to check page 4.</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-brand-secondary shadow-sm shrink-0 flex items-center justify-center text-[10px] text-white font-bold">ME</div>
                                </div>
                                {/* Typing Indicator */}
                                <div className="flex gap-2 items-center text-gray-400 ml-11">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    </div>
                                    <span className="text-[10px] font-medium">Alex is typing...</span>
                                </div>
                            </div>
                        </div>

                        {/* Wide Card */}
                        <div className="md:col-span-1 md:row-span-1 rounded-3xl bg-brand-tertiary/10 p-6 group hover:bg-brand-tertiary/20 transition-colors flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-md">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-primary">Resource Sharing</h3>
                            </div>

                            <div className="space-y-3 flex-1">
                                {/* File Item 1 */}
                                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60 border border-white/50 backdrop-blur-sm shadow-sm transition-transform group-hover:scale-105 group-hover:bg-white/80">
                                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0111.414 2.586L15 6.172A2 2 0 0115.586 7.586V15a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-700 truncate">Calculus_Notes.pdf</p>
                                        <p className="text-[10px] text-gray-500">2.4 MB • Just now</p>
                                    </div>
                                    <div className="w-4 h-4 rounded-full border border-green-500 flex items-center justify-center shrink-0">
                                        <svg className="w-2.5 h-2.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                </div>

                                {/* File Item 2 */}
                                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/40 border border-white/30 backdrop-blur-sm shadow-sm opacity-80 transition-transform group-hover:scale-105 group-hover:bg-white/60 delay-75">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-700 truncate">Lab_Diagram.png</p>
                                        <p className="text-[10px] text-gray-500">4.1 MB • 2m ago</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-brand-secondary mt-3 font-medium text-right group-hover:text-brand-primary transition-colors">Drag & drop supported</p>
                        </div>

                        {/* Small Card */}
                        <div className="md:col-span-1 md:row-span-1 rounded-3xl bg-brand-secondary text-white p-8 flex flex-col justify-between group overflow-hidden relative shadow-lg hover:shadow-xl transition-shadow">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none group-hover:bg-white/20 transition-colors"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-primary/20 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <h3 className="text-5xl font-black mb-1 tracking-tighter shadow-black drop-shadow-lg">100%</h3>
                                    <p className="font-bold text-brand-light/90 uppercase tracking-widest text-xs">Free for students</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                            </div>

                            <div className="relative z-10 mt-4">
                                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-[95%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                </div>
                                <p className="text-[10px] text-brand-light/70 mt-2 text-right">0 hidden fees</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 px-6 lg:px-8 bg-brand-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to streamline your studies?</h2>
                    <p className="text-brand-tertiary text-lg mb-10 max-w-2xl mx-auto">Join the platform built by students, for students. No credit card required, ever.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup" className="px-8 py-4 rounded-full bg-white text-brand-primary font-bold shadow-lg hover:scale-105 transition-transform">
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-brand-primary border-t border-white/5 pt-16 pb-8 text-brand-tertiary">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <span className="text-2xl font-bold text-white tracking-tight">SyncSpace</span>
                            <p className="mt-4 text-sm">Making collaboration easier for everyone.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <p>&copy; 2024 SyncSpace Example. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
