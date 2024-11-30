"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Home, Package, Users, Truck, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Suppliers', href: '/suppliers', icon: Truck },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const NavItems = () => (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>PharmaDash</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-2 p-4">
            <NavItems />
          </nav>
        </SheetContent>
      </Sheet>
      <nav className="hidden md:flex flex-col w-64 space-y-2 p-4 bg-background border-r">
        <div className="text-2xl font-bold mb-6 px-4 text-blue-800">PharmaDash</div>
        <NavItems />
      </nav>
    </>
  )
}

