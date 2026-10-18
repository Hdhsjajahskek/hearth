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
    <div className="fixed bottom-0 left-0 right-0 bg-[#14100C] border-t border-[#1F1813] z-50">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-2">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full text-[10px] font-mono transition-colors ${
                isActive ? 'text-[#FF6B1A]' : 'text-[#7A6F65] hover:text-[#F5EFE7]'
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