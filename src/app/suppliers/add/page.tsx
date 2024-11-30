"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AddSupplierPage() {
  const router = useRouter()
  const [supplier, setSupplier] = useState({
    name: '',
    contact: '',
    medication: '',
    quantity: '',
    supply_date: '', // New field for date
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('New supplier:', supplier)
    router.push('/suppliers')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value })
  }

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Supplier</h1>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <Label htmlFor="name">Supplier Name</Label>
          <Input id="name" name="name" value={supplier.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="contact">Contact Number</Label>
          <Input id="contact" name="contact" value={supplier.contact} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="medication">Medication Supplied</Label>
          <Input id="medication" name="medication" value={supplier.medication} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" value={supplier.quantity} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="supply_date">Supply Date</Label>
          <Input id="supply_date" name="supply_date" type="date" value={supplier.supply_date} onChange={handleChange} required />
        </div>
        <Button type="submit" className="w-full md:w-auto">Add Supplier</Button>
      </form>
    </div>
  )
}
