'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/feed', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/explore', label: 'Explore', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { href: '/create', label: 'Create', icon: 'M12 4v16m8-8H4', highlight: true },
  { href: '/reels', label: 'Reels', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { href: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function BottomNav() {
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    if (href === '/feed') return pathname === '/feed' || pathname === '/';
    return pathname.startsWith(href);
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.href);
          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center w-12 h-12 -mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${
                active ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
