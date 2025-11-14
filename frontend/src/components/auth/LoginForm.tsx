'use client'
import React, { useState, useCallback } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/router';
import { AtSignIcon, LockIcon, EyeIcon, EyeOffIcon, ShieldIcon, GoogleIcon, TwitterIcon, LoadingSpinner } from '@/components/auth/icons';
import { LoginPayload, LoginResponse } from '@/types/auth';
import { LoginFormErrors } from '@/types/errorForms';
import AuthService from '@/services/auth.service';
import { useAuth } from '@/context/AuthProvider';


const LoginForm: React.FC = () => {

  const router = useRouter();
  const { setToken, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginPayload>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleInputChange = useCallback((field: keyof LoginPayload, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  }, [errors]);

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const payload: LoginPayload = {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      };

      const response = await AuthService.login(payload);
      console.log("Login Response:", response);

      if (response.token && response.user) {
        // Update Auth Context
        setToken(response.token);
        setUser(response.user);

        console.log("✅ Login successful");
        console.log("Token in localStorage:", localStorage.getItem("token"));
        console.log("Token in axios headers:", api.defaults.headers.common["Authorization"]);

        // Use replace instead of push to prevent back button issues
        await router.replace("/dashboard");
      } else {
        console.error("❌ Login failed: invalid response structure", response);
        setErrors({ general: 'Invalid response from server. Please try again.' });
        setIsLoading(false);
      }

    } catch (err: any) {
      const errorMessage = err.response?.data?.message ||
          err.response?.data?.error ||
          'Login failed. Please check your credentials and try again.';

      setErrors({ general: errorMessage });
      console.error('Login error:', err);
      setIsLoading(false);
    }
  };


  return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex">
        {/* Left side - Image/Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
              <ShieldIcon />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-center">Welcome to GIS Sinia</h1>
            <p className="text-xl text-center text-white/90 max-w-md leading-relaxed">
              Access your geospatial dashboard and continue your mapping journey with secure, reliable authentication.
            </p>
            <div className="mt-12 flex space-x-2">
              {[...Array(5)].map((_, i) => (
                  <div
                      key={i}
                      className="w-2 h-2 bg-white/40 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
              ))}
            </div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                  <ShieldIcon />
                </div>
                <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  GIS Sinia
                </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Geospatial Platform</span>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldIcon />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Access your secure geospatial account
              </p>
            </div>

            {/* Error Message */}
            {errors.general && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700 dark:text-red-400 text-sm">{errors.general}</span>
                  </div>
                </div>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
               Let's Getting Start
              </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                    <AtSignIcon />
                  </div>
                  <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                          errors.email
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      disabled={isLoading}
                  />
                </div>
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                    <LockIcon />
                  </div>
                  <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your password"
                      className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                          errors.password
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      disabled={isLoading}
                  />
                  <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                      id="remember-me"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                      disabled={isLoading}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <a
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg disabled:cursor-not-allowed"
              >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner />
                      Signing in...
                    </div>
                ) : (
                    'Sign in to your account'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <a
                    href="/register"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                >
                  Create account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginForm;
