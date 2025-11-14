'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

type MenuItem = {
  label: string;
  href: string;
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Menu items data
  const menuItems: MenuItem[] = [
    { label: 'Documentation', href: '/docs' },
  ];



  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside or pressing Escape
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setMenuOpen(false);
    }
  }, []);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setMenuOpen(false);
      buttonRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleClickOutside, handleEscapeKey]);

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <header role="banner">
        <nav
          className={`fixed z-50 w-full transition-all duration-300 ${
            isScrolled
              ? 'bg-white/90 backdrop-blur-lg border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-700'
              : 'bg-transparent'
          }`}
          aria-label="Main navigation"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <Link
                href="/"
                aria-label="GIS Map Sinia Home"
                className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-transform hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      GIS Sinia
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Geospatial Platform</span>
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <ul className="flex items-center space-x-8">
                  {menuItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 relative group"
                      >
                        {item.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center space-x-4 border-l border-gray-200 dark:border-gray-700 pl-8">
                  <Link
                    href="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                ref={buttonRef}
                onClick={toggleMenu}
                aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
                aria-expanded={menuOpen}
                aria-controls="main-menu"
                className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="w-6 h-6 relative">
                  <span className={`absolute top-1 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 top-3' : ''}`}></span>
                  <span className={`absolute top-3 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 top-3' : ''}`}></span>
                </div>
              </button>
            </div>

            {/* Mobile Navigation */}
            <div
              ref={menuRef}
              id="main-menu"
              className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                menuOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-4 pointer-events-none'
              }`}
            >
              <div className="px-4 py-6 space-y-6">
                <ul className="space-y-4">
                  {menuItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 transition-colors duration-200"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <Link
                    href="/login"
                    className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 transition-colors duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Hero Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Advanced Geospatial Platform
                  </span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Transform Your{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Spatial Data
                  </span>{' '}
                  Into Insights
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl">
                  Powerful GIS mapping platform that enables you to visualize, analyze, and share
                  geospatial data with unprecedented clarity and precision.
                </p>


                <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Real-time Data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Global Coverage</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual - Map Preview */}
              <div className="relative">
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-blue-500/10 border border-gray-200 dark:border-gray-700 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  {/* Mock Map Interface */}
                  <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                    {/* Map Grid */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px'
                    }}></div>

                    {/* Map Controls */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      <div className="bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg">
                        <div className="flex space-x-1">
                          {['+', '-'].map((item) => (
                            <button key={item} className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded">
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Map Layers Panel */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg w-48">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span className="text-sm font-medium">Base Map</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="text-sm font-medium">Satellite</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span className="text-sm font-medium">Terrain</span>
                        </div>
                      </div>
                    </div>

                    {/* Location Marker */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                        <div className="absolute inset-0 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-2xl opacity-50 rotate-12"></div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-200 dark:bg-green-800 rounded-2xl opacity-50 -rotate-12"></div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
