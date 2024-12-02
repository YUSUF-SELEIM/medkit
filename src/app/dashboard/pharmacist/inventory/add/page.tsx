"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

export default function AddMedicationPage() {
  const router = useRouter()
  const [medication, setMedication] = useState({
    name: '',
    quantity: '',
    price: '',
    expiration: '',
    supplier: '',
    status: '', // New field for stock status
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('New medication:', medication)
    router.push('/inventory')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMedication({ ...medication, [e.target.name]: e.target.value })
  }

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Medication</h1>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <Label htmlFor="name">Medication Name</Label>
          <Input id="name" name="name" value={medication.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" value={medication.quantity} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" value={medication.price} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="expiration">Expiration Date</Label>
          <Input id="expiration" name="expiration" type="date" value={medication.expiration} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="supplier">Supplier</Label>
          <Input id="supplier" name="supplier" value={medication.supplier} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="status">Stock Status</Label>
          <Select
            onValueChange={(value) => setMedication({ ...medication, status: value })}
            value={medication.status}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="medium">Medium Stock</SelectItem>
              <SelectItem value="high">High Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full md:w-auto">Add Medication</Button>
      </form>
    </div>
  )
}
