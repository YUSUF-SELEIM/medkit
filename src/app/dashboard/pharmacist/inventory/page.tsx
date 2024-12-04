// InventoryPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { useDataContext } from "@/context/DataContext";

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<any>(null); // Holds the item being edited
  const { inventory, deleteInventory, updateInventory } = useDataContext(); // updateInventory function from context

  const router = useRouter();

  // Filter inventory based on search term
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteInventory(id);
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setEditItem(item); // Set the item to be edited
  };

  const handleSave = () => {
    if (editItem) {
      updateInventory(editItem); // Update the existing item in the context
      setIsEditing(false);
      setEditItem(null); // Clear the form
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditItem({
      ...editItem,
      [field]: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
              <h2 className="text-2xl font-bold">Inventory List</h2>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      
        <Input
          type="search"
          placeholder="Search medications..."
          className="w-full sm:max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => router.push("/dashboard/pharmacist/inventory/add")}>
          Add Medication
        </Button>
      </div>

      {/* Edit Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Medication</h3>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Name"
                value={editItem.name}
                onChange={(e) => handleChange(e, "name")}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={editItem.quantity}
                onChange={(e) => handleChange(e, "quantity")}
              />
              <Input
                type="number"
                placeholder="Price"
                value={editItem.price}
                onChange={(e) => handleChange(e, "price")}
              />
              <Input
                type="text"
                placeholder="Status"
                value={editItem.status}
                onChange={(e) => handleChange(e, "status")}
              />
              <Input
                type="date"
                placeholder="Expiration"
                value={editItem.expiration}
                onChange={(e) => handleChange(e, "expiration")}
              />
              <Input
                type="text"
                placeholder="Supplier"
                value={editItem.supplier}
                onChange={(e) => handleChange(e, "supplier")}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.expiration}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      variant="outline"
                      className="text-red-600"
                      size="sm"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
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
