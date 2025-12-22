import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const ForgotPassword = () => {
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
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Reset Password</h1>
                    <p className="text-xl text-brand-light/90 font-light leading-relaxed">
                        Don't worry, it happens to the best of us.
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
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">Forgot your password?</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="mt-8">
                        <form action="#" method="POST" className="space-y-6">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email address</label>
                                <div className="mt-1">
                                    <input id="email" name="email" type="email" placeholder="name@work-email.com" autoComplete="email" required className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 transition-all duration-200" />
                                </div>
                            </div>

                            {/* Submit */}
                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-200">
                                    Send Reset Link
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Remember your password? <Link to="/login" className="font-bold text-brand-primary hover:underline">Back to Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
