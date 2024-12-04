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
import { Edit, Trash2, Plus } from "lucide-react";

type Medication = {
  name: string;
  quantity: number;
};

type Supplier = {
  id: string;
  name: string;
  contact: string;
  medications: Medication[];
  supply_date: string;
};

type SupplierManagementProps = {
  initialSuppliers?: Supplier[];
  onAddSupplier?: (supplier: Supplier) => void;
  onUpdateSupplier?: (supplier: Supplier) => void;
  onDeleteSupplier?: (id: string) => void;
};

export default function SupplierManagement({
  initialSuppliers = [],
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
}: SupplierManagementProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    medications: [{ name: "", quantity: 0 }],
    supply_date: "",
  });

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete action
  const handleDelete = (id: string) => {
    const updatedSuppliers = suppliers.filter((supplier) => supplier.id !== id);
    setSuppliers(updatedSuppliers);
    onDeleteSupplier?.(id);
  };

  // Handle edit action
  const handleEdit = (supplier: Supplier) => {
    setIsEditing(true);
    setEditSupplier(supplier);
  };

  // Handle save after edit
  const handleSave = () => {
    if (editSupplier) {
      const updatedSuppliers = suppliers.map((supplier) =>
        supplier.id === editSupplier.id ? editSupplier : supplier
      );
      setSuppliers(updatedSuppliers);
      onUpdateSupplier?.(editSupplier);
      setIsEditing(false);
      setEditSupplier(null);
    }
  };

  // Handle add new supplier
  const handleAdd = () => {
    const supplierToAdd = {
      ...newSupplier,
      id: `SUP-${Date.now()}`, // Generate a temporary ID
    } as Supplier;

    const updatedSuppliers = [...suppliers, supplierToAdd];
    setSuppliers(updatedSuppliers);
    onAddSupplier?.(supplierToAdd);

    // Reset new supplier form
    setNewSupplier({
      name: "",
      contact: "",
      medications: [{ name: "", quantity: 0 }],
      supply_date: "",
    });
    setIsAdding(false);
  };

  // Handle changes in edit form
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Supplier
  ) => {
    if (editSupplier) {
      setEditSupplier({
        ...editSupplier,
        [field]: e.target.value,
      });
    }
  };

  // Handle changes in add form
  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Supplier
  ) => {
    setNewSupplier({
      ...newSupplier,
      [field]: e.target.value,
    });
  };

  // Handle adding medication in edit mode
  const handleEditAddMedication = () => {
    if (editSupplier) {
      setEditSupplier({
        ...editSupplier,
        medications: [...editSupplier.medications, { name: "", quantity: 0 }],
      });
    }
  };

  // Handle adding medication in add mode
  const handleAddNewMedication = () => {
    setNewSupplier({
      ...newSupplier,
      medications: [...newSupplier.medications, { name: "", quantity: 0 }],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          type="search"
          placeholder="Search suppliers..."
          className="w-full sm:max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Name"
                value={newSupplier.name}
                onChange={(e) => handleAddChange(e, "name")}
              />
              <Input
                type="text"
                placeholder="Contact"
                value={newSupplier.contact}
                onChange={(e) => handleAddChange(e, "contact")}
              />
              <Input
                type="date"
                placeholder="Supply Date"
                value={newSupplier.supply_date}
                onChange={(e) => handleAddChange(e, "supply_date")}
              />

              {/* Medications Section */}
              {newSupplier.medications.map((medication, index) => (
                <div key={index} className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Medication Name"
                    value={medication.name}
                    onChange={(e) => {
                      const updatedMedications = [...newSupplier.medications];
                      updatedMedications[index].name = e.target.value;
                      setNewSupplier({
                        ...newSupplier,
                        medications: updatedMedications,
                      });
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={medication.quantity}
                    onChange={(e) => {
                      const updatedMedications = [...newSupplier.medications];
                      updatedMedications[index].quantity = parseInt(
                        e.target.value,
                        10
                      );
                      setNewSupplier({
                        ...newSupplier,
                        medications: updatedMedications,
                      });
                    }}
                  />
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

      {/* Edit Supplier Dialog */}
      <Dialog
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditing(false);
            setEditSupplier(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          {editSupplier && (
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Name"
                value={editSupplier.name}
                onChange={(e) => handleEditChange(e, "name")}
              />
              <Input
                type="text"
                placeholder="Contact"
                value={editSupplier.contact}
                onChange={(e) => handleEditChange(e, "contact")}
              />
              <Input
                type="date"
                placeholder="Supply Date"
                value={editSupplier.supply_date}
                onChange={(e) => handleEditChange(e, "supply_date")}
              />

              {/* Medications Section */}
              {editSupplier.medications.map((medication, index) => (
                <div key={index} className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Medication Name"
                    value={medication.name}
                    onChange={(e) => {
                      const updatedMedications = [...editSupplier.medications];
                      updatedMedications[index].name = e.target.value;
                      setEditSupplier({
                        ...editSupplier,
                        medications: updatedMedications,
                      });
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={medication.quantity}
                    onChange={(e) => {
                      const updatedMedications = [...editSupplier.medications];
                      updatedMedications[index].quantity = parseInt(
                        e.target.value,
                        10
                      );
                      setEditSupplier({
                        ...editSupplier,
                        medications: updatedMedications,
                      });
                    }}
                  />
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
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Supply Date</TableHead>
              <TableHead>Medications</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.id}</TableCell>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>{supplier.supply_date}</TableCell>
                <TableCell>
                  {supplier.medications.map((med, index) => (
                    <div key={index}>
                      {med.name} ({med.quantity})
                    </div>
                  ))}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(supplier)}
                    >
                      <Edit className="h-4 w-4 text-yellow-400" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(supplier.id)}
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
