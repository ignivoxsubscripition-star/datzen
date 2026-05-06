'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/utils/auth';
import { signupSchema, type SignupInput } from '@/lib/validations/auth';
import { PasswordStrengthUI } from '@/components/auth/PasswordStrengthUI';
import { cn } from '@/lib/utils';

export default function SignupPage() {
    // ── UI state ──────────────────────────────────────────────────────────────
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // ── Form setup ────────────────────────────────────────────────────────────
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
        mode: 'onChange', // Enable live validation
    });

    const passwordValue = watch('password', '');
    const termsAccepted = watch('terms', false);

    // ── Handle form submit ────────────────────────────────────────────────────
    const onSubmit = async (data: SignupInput) => {
        setServerError(null);
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                setServerError(result?.message ?? 'Registration failed. Please check your details and try again.');
                return;
            }

            // ── Redirect to login on success ──────────────────────────────────
            router.push('/login');
        } catch {
            setServerError('Unable to reach the server. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen flex w-full bg-slate-50 relative">
            {/* Home Link */}
            <Link href="/" className="absolute top-6 left-6 md:top-10 md:left-10 z-50 group flex items-center gap-3 transition-opacity hover:opacity-80">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-slate-200/50 lg:border-white/10 text-slate-600 lg:text-white transition-colors group-hover:bg-white/20">
                    <ArrowLeft className="h-5 w-5" />
                </div>
                <span className="font-bold text-slate-600 lg:text-white tracking-wide">Back to Home</span>
            </Link>

            {/* Left Side - Branding & Visuals (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/20 via-slate-900 to-slate-900" />
                <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-lg"
                >
                    <div className="mb-8">
                        <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                            <Lock className="h-8 w-8 text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                            Start Building with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Future-Ready Security</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            Create your account today and get access to the most advanced risk intelligence platform.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">24/7</div>
                            <div>
                                <div className="text-white font-bold">Real-time Monitoring</div>
                                <div className="text-slate-400 text-sm">Always-on protection for your business</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[420px] pt-16 md:pt-0"
                >
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create an account</h2>
                        <p className="text-slate-600">Enter your details to get started with DATZEN.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>

                        {/* ── Error Banner ─────────────────────────────────── */}
                        {serverError && (
                            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl" role="alert">
                                <span className="mt-0.5 shrink-0">⚠️</span>
                                <span>{serverError}</span>
                            </div>
                        )}

                        {/* Inputs */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700" htmlFor="name">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        {...register('name')}
                                        type="text"
                                        id="name"
                                        placeholder="John Doe"
                                        disabled={loading}
                                        aria-invalid={!!errors.name}
                                        aria-describedby={errors.name ? "name-error" : undefined}
                                        className={cn(
                                            "w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all placeholder:text-slate-400 text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed",
                                            errors.name ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        )}
                                    />
                                </div>
                                {errors.name && (
                                    <p id="name-error" className="text-xs text-red-500 font-medium ml-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700" htmlFor="email">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        {...register('email')}
                                        type="email"
                                        id="email"
                                        placeholder="john@company.com"
                                        disabled={loading}
                                        aria-invalid={!!errors.email}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                        className={cn(
                                            "w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all placeholder:text-slate-400 text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed",
                                            errors.email ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        )}
                                    />
                                </div>
                                {errors.email && (
                                    <p id="email-error" className="text-xs text-red-500 font-medium ml-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        placeholder="Create a password"
                                        disabled={loading}
                                        onFocus={() => setIsPasswordFocused(true)}
                                        onBlur={() => setIsPasswordFocused(false)}
                                        aria-invalid={!!errors.password}
                                        aria-describedby={errors.password ? "password-error" : undefined}
                                        className={cn(
                                            "w-full pl-10 pr-10 py-3 rounded-xl border outline-none transition-all placeholder:text-slate-400 text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed",
                                            errors.password ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                
                                <PasswordStrengthUI password={passwordValue} isFocused={isPasswordFocused} />
                                
                                {errors.password && (
                                    <p id="password-error" className="text-xs text-red-500 font-medium ml-1 mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-3">
                                <input 
                                    {...register('terms')}
                                    type="checkbox" 
                                    id="terms" 
                                    className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                />
                                <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
                                    I agree to the <a href="#" className="font-medium text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-blue-600 hover:underline">Privacy Policy</a>
                                </label>
                            </div>
                        </div>

                        {/* ── Submit Button ─────────────────────────────────── */}
                        <Button
                            type="submit"
                            disabled={loading || !termsAccepted}
                            className="w-full py-6 text-lg font-bold shadow-lg shadow-blue-500/20 rounded-xl group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>

                        <div className="text-center text-sm text-slate-600">
                            Already have an account?{' '}
                            <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">
                                Log in
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
