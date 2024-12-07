"use client";

import { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import { Edit, Trash2, Plus } from "lucide-react";
import { Spinner } from "./ui/spinner";

type Medication = {
  med_id: string;
  name: string;
  supplier: string;
  price: number;
  stock_quantity: number;
};

export default function MedicationManagement() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [editMedication, setEditMedication] = useState<Medication | null>(null);
  const [requestMedication, setRequestMedication] = useState({
    name: "",
    supplier: "",
    price: "",
    stock_quantity: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch medications on component mount
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch("/api/medications");
        const data = await response.json();
        setMedications(data);
      } catch (error) {
        console.error("Failed to fetch medications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();
  }, []);

  // Filter medications based on search term
  const filteredMedications = medications.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete action
  const handleDelete = async (med_id: string) => {
    try {
      const response = await fetch(`/api/medications/${med_id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMedications(medications.filter((med) => med.med_id !== med_id));
      }
    } catch (error) {
      console.error("Failed to delete medication:", error);
    }
  };

  // Rest of the existing methods remain the same...
  const handleEdit = (medication: Medication) => {
    setIsEditing(true);
    setEditMedication(medication);
  };

  const handleSave = async () => {
    if (editMedication) {
      try {
        const response = await fetch(
          `/api/medications/${editMedication.med_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editMedication),
          }
        );

        if (response.ok) {
          const updatedMedications = medications.map((med) =>
            med.med_id === editMedication.med_id ? editMedication : med
          );
          setMedications(updatedMedications);
          setIsEditing(false);
          setEditMedication(null);
        }
      } catch (error) {
        console.error("Failed to update medication:", error);
      }
    }
  };

  const handleRequest = async () => {
    try {
      const response = await fetch("/api/medications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...requestMedication,
          price: Number(requestMedication.price),
          stock_quantity: 0,
        }),
      });

      if (response.ok) {
        const newMedication = await response.json();
        setMedications([...medications, newMedication]);
        setIsRequesting(false);
        setRequestMedication({
          name: "",
          supplier: "",
          price: "",
          stock_quantity: "",
        });
      }
    } catch (error) {
      console.error("Failed to request medication:", error);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Medication
  ) => {
    if (editMedication) {
      setEditMedication({
        ...editMedication,
        [field]: e.target.value,
      });
    }
  };

  const handleRequestChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Omit<Medication, "med_id">
  ) => {
    setRequestMedication({
      ...requestMedication,
      [field]: e.target.value,
    });
  };

  if (isLoading) {
    return <Spinner className="h-20 w-20 mx-auto mt-52" />;
  }
  return (
    <div className="space-y-4">
      {/* Existing search and request button code remains the same */}
      <div className="flex justify-between items-center">
        <Input
          type="search"
          placeholder="Search medications..."
          className="w-full sm:max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => setIsRequesting(true)}>
          <Plus className="mr-2 h-4 w-4" /> Request Medication
        </Button>
      </div>

      {/* Request Medication Dialog remains the same */}
      <Dialog open={isRequesting} onOpenChange={setIsRequesting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Medication</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Name"
              value={requestMedication.name}
              onChange={(e) => handleRequestChange(e, "name")}
            />
            <Input
              type="text"
              placeholder="Supplier"
              value={requestMedication.supplier}
              onChange={(e) => handleRequestChange(e, "supplier")}
            />
            <Input
              type="number"
              placeholder="Price"
              value={requestMedication.price}
              onChange={(e) => handleRequestChange(e, "price")}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleRequest}>Request</Button>
            <Button variant="outline" onClick={() => setIsRequesting(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Existing Edit section remains the same */}
      {isEditing && editMedication && (
        <div className="border p-4 rounded-md space-y-3">
          <h3 className="text-lg font-semibold">Edit Medication</h3>
          <Input
            type="text"
            placeholder="Name"
            value={editMedication.name}
            onChange={(e) => handleEditChange(e, "name")}
          />
          <Input
            type="text"
            placeholder="Supplier"
            value={editMedication.supplier}
            onChange={(e) => handleEditChange(e, "supplier")}
          />
          <Input
            type="number"
            placeholder="Price"
            value={editMedication.price}
            onChange={(e) => handleEditChange(e, "price")}
          />
          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Updated Table with Request Stock button */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock Quantity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedications.map((medication) => (
              <TableRow key={medication.med_id}>
                <TableCell className="font-medium">
                  {medication.med_id}
                </TableCell>
                <TableCell>{medication.name}</TableCell>
                <TableCell>{medication.supplier}</TableCell>
                <TableCell>${medication.price}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      medication.stock_quantity > 0
                        ? "bg-green-300 text-black"
                        : "bg-red-300 text-black"
                    }`}
                  >
                    {medication.stock_quantity}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(medication)}
                    >
                      <Edit className="h-4 w-4 text-yellow-400" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(medication.med_id)}
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
