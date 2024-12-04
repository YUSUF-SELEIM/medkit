"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, Plus } from "lucide-react";

const medicationsList = ["Aspirin", "Paracetamol", "Ibuprofen", "Amoxicillin"];

type Medication = {
  name: string;
  quantity: string;
};

type Customer = {
  id: string;
  customerName: string;
  medications: Medication[];
  totalPrice: number;
};

type CustomerManagementProps = {
  initialCustomers?: Customer[];
  onAddCustomer?: (customer: Customer) => void;
  onUpdateCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
};

export default function CustomerManagement({
  initialCustomers = [],
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}: CustomerManagementProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    customerName: "",
    medications: [{ name: "", quantity: "" }],
  });

  // Calculate medication price
  const getMedicationPrice = (medication: string) => {
    switch (medication) {
      case "Aspirin":
        return 5;
      case "Paracetamol":
        return 3;
      case "Ibuprofen":
        return 4;
      case "Amoxicillin":
        return 8;
      default:
        return 0;
    }
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete action
  const handleDelete = (id: string) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
    onDeleteCustomer?.(id);
  };

  // Handle edit action
  const handleEdit = (customer: Customer) => {
    setIsEditing(true);
    setEditCustomer(customer);
  };

  // Calculate total price
  const calculateTotalPrice = (medications: Medication[]) => {
    return medications.reduce((total, medication) => {
      const price = getMedicationPrice(medication.name);
      return total + price * Number(medication.quantity);
    }, 0);
  };

  // Handle save after edit
  const handleSave = () => {
    if (editCustomer) {
      const updatedCustomer = {
        ...editCustomer,
        totalPrice: calculateTotalPrice(editCustomer.medications),
      };
      const updatedCustomers = customers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      );
      setCustomers(updatedCustomers);
      onUpdateCustomer?.(updatedCustomer);
      setIsEditing(false);
      setEditCustomer(null);
    }
  };

  // Handle add new customer
  const handleAdd = () => {
    const customerToAdd = {
      id: `CUST-${Date.now()}`,
      ...newCustomer,
      totalPrice: calculateTotalPrice(newCustomer.medications),
    } as Customer;

    const updatedCustomers = [...customers, customerToAdd];
    setCustomers(updatedCustomers);
    onAddCustomer?.(customerToAdd);

    // Reset new customer form
    setNewCustomer({
      customerName: "",
      medications: [{ name: "", quantity: "" }],
    });
    setIsAdding(false);
  };

  // Handle changes in edit form
  const handleEditChange = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    if (editCustomer) {
      const updatedMedications = [...editCustomer.medications];
      updatedMedications[index][field] = value;
      setEditCustomer({
        ...editCustomer,
        medications: updatedMedications,
      });
    }
  };

  // Handle changes in add form
  const handleAddChange = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    const updatedMedications = [...newCustomer.medications];
    updatedMedications[index][field] = value;
    setNewCustomer({
      ...newCustomer,
      medications: updatedMedications,
    });
  };

  // Add medication in edit mode
  const handleEditAddMedication = () => {
    if (editCustomer) {
      setEditCustomer({
        ...editCustomer,
        medications: [...editCustomer.medications, { name: "", quantity: "" }],
      });
    }
  };

  // Add medication in add mode
  const handleAddNewMedication = () => {
    setNewCustomer({
      ...newCustomer,
      medications: [...newCustomer.medications, { name: "", quantity: "" }],
    });
  };

  // Remove medication in edit mode
  const handleEditRemoveMedication = (index: number) => {
    if (editCustomer) {
      const updatedMedications = editCustomer.medications.filter(
        (_, i) => i !== index
      );
      setEditCustomer({
        ...editCustomer,
        medications: updatedMedications,
      });
    }
  };

  // Remove medication in add mode
  const handleAddRemoveMedication = (index: number) => {
    const updatedMedications = newCustomer.medications.filter(
      (_, i) => i !== index
    );
    setNewCustomer({
      ...newCustomer,
      medications: updatedMedications,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          type="search"
          placeholder="Search customers..."
          className="w-full sm:max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Customer Name"
                value={newCustomer.customerName}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    customerName: e.target.value,
                  })
                }
              />

              {/* Medications Section */}
              {newCustomer.medications.map((medication, index) => (
                <div key={index} className="space-y-2">
                  <Select
                    onValueChange={(value) =>
                      handleAddChange(index, "name", value)
                    }
                    value={medication.name}
                  >
                    <SelectTrigger>
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
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={medication.quantity}
                    onChange={(e) =>
                      handleAddChange(index, "quantity", e.target.value)
                    }
                  />
                  {newCustomer.medications.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddRemoveMedication(index)}
                    >
                      Remove Medication
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddNewMedication}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAdd}>Add</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Customer Dialog */}
      <Dialog
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditing(false);
            setEditCustomer(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editCustomer && (
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Customer Name"
                value={editCustomer.customerName}
                onChange={(e) =>
                  setEditCustomer({
                    ...editCustomer,
                    customerName: e.target.value,
                  })
                }
              />

              {/* Medications Section */}
              {editCustomer.medications.map((medication, index) => (
                <div key={index} className="space-y-2">
                  <Select
                    onValueChange={(value) =>
                      handleEditChange(index, "name", value)
                    }
                    value={medication.name}
                  >
                    <SelectTrigger>
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
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={medication.quantity}
                    onChange={(e) =>
                      handleEditChange(index, "quantity", e.target.value)
                    }
                  />
                  {editCustomer.medications.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleEditRemoveMedication(index)}
                    >
                      Remove Medication
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleEditAddMedication}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Medication
              </Button>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Medications</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.customerName}</TableCell>
                <TableCell>
                  {customer.medications.map((med, index) => (
                    <div key={index}>
                      {med.name} ({med.quantity})
                    </div>
                  ))}
                </TableCell>
                <TableCell>${customer.totalPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(customer)}
                    >
                      <Edit className="h-4 w-4 text-yellow-400" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(customer.id)}
                    >
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
  );
}
