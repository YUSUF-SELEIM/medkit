import { Header } from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle, DollarSign, Package } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Low Stock Medications</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground text-yellow-600" />
          </CardHeader>
          <CardContent>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/inventory/paracetamol" className="text-sm hover:underline">
                  Paracetamol: 5 units
                </Link>
              </li>
              <li>
                <Link href="/inventory/ibuprofen" className="text-sm hover:underline">
                  Ibuprofen: 3 units
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-500">Near Expiry Medications</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground text-red-500" />
          </CardHeader>
          <CardContent>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/inventory/aspirin" className="text-sm hover:underline">
                  Aspirin: <span className="text-red-500">Exp. 01/01/2025</span>
                </Link>
              </li>
              <li>
                <Link href="/inventory/amoxicillin" className="text-sm hover:underline">
                  Amoxicillin: <span className="text-red-500">Exp. 01/01/2025</span>
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-500">Total Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$10,000</div>
            <p className="text-xs text-muted-foreground text-green-500">+20.1% from last month</p>
            <div className="mt-4 h-[60px]">
              {/* We'll add a chart here later */}
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  )
}

