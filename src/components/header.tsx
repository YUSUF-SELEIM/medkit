import Link from 'next/link'
import { UserCircle } from 'lucide-react'
import { ModeToggle } from './mode-toggle'

export function Header() {
  return (
    <header className="flex items-center justify-end p-4 bg-background border-b">
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <Link href="/profile">
          <UserCircle className="h-6 w-6" />
          <span className="sr-only">Profile</span>
        </Link>
      </div>
    </header>
  )
}

