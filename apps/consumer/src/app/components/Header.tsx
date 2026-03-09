'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:block">SocialHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/feed" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Explore
            </Link>
            <Link href="/reels" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Reels
            </Link>
            <Link href="/stories" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Stories
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-3">
            <Link 
              href="/feed" 
              className="block py-2 text-slate-600 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link 
              href="/reels" 
              className="block py-2 text-slate-600 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reels
            </Link>
            <Link 
              href="/stories" 
              className="block py-2 text-slate-600 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Stories
            </Link>
            <Link 
              href="/login" 
              className="block py-2 text-slate-600 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="block py-2 text-indigo-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
