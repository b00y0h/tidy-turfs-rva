'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🌿</span>
            <div>
              <span className="text-xl font-bold text-green-700">TidyTurfs</span>
              <span className="text-xl font-bold text-green-500"> RVA</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 font-medium transition">
              Home
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-green-600 font-medium transition">
              Services
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium transition">
              About
            </Link>
            <Link 
              href="/contact" 
              className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition shadow-md"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="/" className="block text-gray-700 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/services" className="block text-gray-700 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>
              Services
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link 
              href="/contact" 
              className="block bg-green-600 text-white px-6 py-2 rounded-full font-semibold text-center hover:bg-green-700 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
