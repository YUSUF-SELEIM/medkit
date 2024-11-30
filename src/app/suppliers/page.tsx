"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Check, X, PlusCircle } from 'lucide-react'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'PharmaCo', contact: '123-456-7890', medication: 'Paracetamol', date: '2023-12-01', quantity: 1000 },
    { id: 2, name: 'MediSupply', contact: '987-654-3210', medication: 'Ibuprofen', date: '2023-12-05', quantity: 500 },
    // Add more sample data as needed
  ])

  const handleAccept = (id: number) => {
    // Logic to accept supply and update inventory
    setSuppliers(suppliers.filter(supplier => supplier.id !== id))
  }

  const handleReject = (id: number) => {
    // Logic to reject supply
    setSuppliers(suppliers.filter(supplier => supplier.id !== id))
  }

  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supplier List</h2>
        <Button onClick={() => router.push('/suppliers/add')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Supplier
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Supplier Name</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Medication Supplied</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.id}</TableCell>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>{supplier.medication}</TableCell>
                <TableCell>{supplier.date}</TableCell>
                <TableCell>{supplier.quantity}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button onClick={() => handleAccept(supplier.id)} variant="outline" className='text-green-600' size="sm">
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                    <Button onClick={() => handleReject(supplier.id)} variant="outline" className='text-red-600' size="sm">
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

