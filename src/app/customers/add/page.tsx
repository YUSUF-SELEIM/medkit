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
import { useDataContext } from '../../../context/DataContext'

const medicationsList = ['Aspirin', 'Paracetamol', 'Ibuprofen', 'Amoxicillin']

export default function AddCustomerPage() {
  const { addCustomer } = useDataContext() // Use context to add customer
  const router = useRouter()
  
  const [customer, setCustomer] = useState({
    customerName: '',
    medications: [{ name: '', quantity: '' }],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Calculate total price based on quantity (assumed a simple price lookup, modify as needed)
    const totalPrice = customer.medications.reduce((total, medication) => {
      const price = getMedicationPrice(medication.name) // Implement this function based on your needs
      return total + price * Number(medication.quantity)
    }, 0)

    const newCustomer = {
      ...customer,
      totalPrice, // Add totalPrice to the customer object
    }

    // Add customer to context
    addCustomer(newCustomer)

    // Redirect to customer list page
    router.push('/customers')
  }

  const handleChange = (index: number, field: string, value: string) => {
    const updatedMedications = [...customer.medications]
    updatedMedications[index][field] = value
    setCustomer({ ...customer, medications: updatedMedications })
  }

  const addMedicationField = () => {
    setCustomer({
      ...customer,
      medications: [...customer.medications, { name: '', quantity: '' }],
    })
  }

  const removeMedicationField = (index: number) => {
    const updatedMedications = customer.medications.filter((_, i) => i !== index)
    setCustomer({ ...customer, medications: updatedMedications })
  }

  const getMedicationPrice = (medication: string) => {
    switch (medication) {
      case 'Aspirin':
        return 5
      case 'Paracetamol':
        return 3
      case 'Ibuprofen':
        return 4
      case 'Amoxicillin':
        return 8
      default:
        return 0
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <Label htmlFor="name">Customer Name</Label>
          <Input
            id="name"
            name="name"
            value={customer.customerName}
            onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
            required
          />
        </div>
        {customer.medications.map((medication, index) => (
          <div key={index} className="space-y-2">
            <div>
              <Label htmlFor={`medication-${index}`}>Medication</Label>
              <Select
                onValueChange={(value) => handleChange(index, 'name', value)}
                value={medication.name}
              >
                <SelectTrigger id={`medication-${index}`}>
                  <SelectValue placeholder="Select Medication" />
                </SelectTrigger>
                <SelectContent>
                  {medicationsList.map((med) => (
                    <SelectItem key={med} value={med}>
                      {med}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor={`quantity-${index}`}>Quantity</Label>
              <Input
                id={`quantity-${index}`}
                name={`quantity-${index}`}
                type="number"
                value={medication.quantity}
                onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                required
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => removeMedicationField(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addMedicationField} className="w-full md:w-auto mr-3">
          Add Another Medication
        </Button>
        <Button type="submit" className="w-full md:w-auto">
          Add Customer
        </Button>
      </form>
    </div>
  )
}
