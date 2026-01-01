import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import useAuth from '../hooks/useAuth';
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter email and password');
            return;
        }

        const { error } = await login(email, password);
        if (!error) {
            navigate('/');
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white">
            {/* Left Side - Hero/Branding */}
            <div className="hidden lg:flex w-1/2 bg-brand-primary items-center justify-center relative overflow-hidden">
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-light rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-secondary rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-brand-tertiary rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="z-10 text-white text-center p-12 max-w-lg">
                    <div className="flex justify-center mb-6">
                        <Logo className="w-20 h-20 text-white" variant="light" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">SyncSpace</h1>
                    <p className="text-xl text-brand-light/90 font-light leading-relaxed">
                        Bring your team together.
                        <br />
                        Communicate, collaborate, and create in one shared space.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <div className="flex justify-center lg:justify-start mb-6 lg:hidden">
                            <Logo className="w-12 h-12" />
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">Sign in to SyncSpace</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            We suggest using the <strong>email address you use at work.</strong>
                        </p>
                    </div>

                    {/* Form */}
                    <div className="mt-8">
                        {/* Social Logins */}
                        <div className="grid grid-cols-1 gap-3 mb-6">
                            <button type="button" className="w-full inline-flex justify-center items-center py-2.5 px-4 border-2 border-gray-200 rounded-full shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200">
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Sign in with Google
                            </button>
                            <button type="button" className="w-full inline-flex justify-center items-center py-2.5 px-4 border-2 border-gray-200 rounded-full shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200">
                                <svg className="h-5 w-5 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.1 1.88-2.61 5.75.1 6.85-.6 1.75-1.5 3.43-2.15 4.36zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                Sign in with Apple
                            </button>
                        </div>
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500 font-medium">OR</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email address</label>
                                <div className="mt-1">
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} id="email" name="email" type="email" placeholder="name@work-email.com" autoComplete="email" required className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 transition-all duration-200" />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700">Password</label>
                                <div className="mt-1">
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password" placeholder="YOUR PASSWORD" autoComplete="current-password" required className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 transition-all duration-200" />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                                </div>
                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-brand-primary hover:opacity-80">Forgot password?</Link>
                                </div>
                            </div>

                            {/* Submit */}
                            <div>
                                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                New to SyncSpace? <Link to="/signup" className="font-bold text-brand-primary hover:underline">Create an account</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
