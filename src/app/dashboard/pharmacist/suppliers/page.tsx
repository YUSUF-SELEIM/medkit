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
import { useDataContext } from '@/context/DataContext' // Import useDataContext

export default function SuppliersPage() {
  const { suppliers, deleteSupplier } = useDataContext() // Access suppliers and deleteSupplier from context
  const router = useRouter()

  const handleAccept = (id: string) => {
    // Logic to accept supply and update inventory
    deleteSupplier(id) // Remove the supplier from context
  }

  const handleReject = (id: string) => {
    // Logic to reject supply
    deleteSupplier(id) // Remove the supplier from context
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supplier List</h2>
        <Button onClick={() => router.push('/dashboard/pharmacist/suppliers/add')}>
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
              <TableHead>Medications Supplied</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.id}</TableCell>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                
                {/* Small Medications Sub-table */}
                <TableCell>
                  <div className="overflow-x-auto max-w-xs">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medication</TableHead>
                          <TableHead>Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {supplier.medications.map((medication, index) => (
                          <TableRow key={index}>
                            <TableCell>{medication.name}</TableCell>
                            <TableCell>{medication.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TableCell>

                <TableCell>{supplier.supply_date}</TableCell>

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
