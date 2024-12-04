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
import { PlusCircle, Trash2 } from 'lucide-react'
import { useDataContext } from '@/context/DataContext' // adjust the import as per your structure

export default function CustomersPage() {
  const { customers, addCustomer, deleteCustomer } = useDataContext()

  const router = useRouter()

  // Handle delete action
  const handleDelete = (id: string) => {
    deleteCustomer(id)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer List</h2>
        <Button onClick={() => router.push('/customers/add')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Customer
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Medication Purchased</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.customerName}</TableCell>
                <TableCell>{customer.medicationPurchased}</TableCell>
                <TableCell>{customer.quantity}</TableCell>
                <TableCell>${customer.totalPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleDelete(customer.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
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
