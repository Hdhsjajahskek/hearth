'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Brief' },
    { href: '/inbox', label: 'Inbox' },
    { href: '/leads', label: 'Leads' },
    { href: '/books', label: 'Books' },
    { href: '/search', label: 'Search' },
  ]

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full flex items-center p-2 w-full max-w-md">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 text-sm font-sans font-medium transition-all duration-300 ${
                isActive 
                  ? 'text-[#FF6B1A] bg-[#FF6B1A]/10 rounded-full' 
                  : 'text-[#8A8F98] hover:text-[#1A1A1A]'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}