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

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: string;
  expiration: string;
  supplier: string;
};

type InventoryManagementProps = {
  initialInventory?: InventoryItem[];
  onAddInventory?: (item: InventoryItem) => void;
  onUpdateInventory?: (item: InventoryItem) => void;
  onDeleteInventory?: (id: string) => void;
};

export default function InventoryManagement({
  initialInventory = [],
  onAddInventory,
  onUpdateInventory,
  onDeleteInventory,
}: InventoryManagementProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    price: "",
    status: "In Stock",
    expiration: "",
    supplier: "",
  });

  // Filter inventory based on search term
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete action
  const handleDelete = (id: string) => {
    const updatedInventory = inventory.filter((item) => item.id !== id);
    setInventory(updatedInventory);
    onDeleteInventory?.(id);
  };

  // Handle edit action
  const handleEdit = (item: InventoryItem) => {
    setIsEditing(true);
    setEditItem(item);
  };

  // Handle save after edit
  const handleSave = () => {
    if (editItem) {
      const updatedInventory = inventory.map((item) =>
        item.id === editItem.id ? editItem : item
      );
      setInventory(updatedInventory);
      onUpdateInventory?.(editItem);
      setIsEditing(false);
      setEditItem(null);
    }
  };

  // Handle add new item
  const handleAdd = () => {
    const itemToAdd = {
      ...newItem,
      id: `ID-${Date.now()}`, // Generate a temporary ID
      quantity: Number(newItem.quantity),
      price: Number(newItem.price),
    } as InventoryItem;

    const updatedInventory = [...inventory, itemToAdd];
    setInventory(updatedInventory);
    onAddInventory?.(itemToAdd);

    // Reset new item form
    setNewItem({
      name: "",
      quantity: "",
      price: "",
      status: "In Stock",
      expiration: "",
      supplier: "",
    });
    setIsAdding(false);
  };

  // Handle changes in edit form
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof InventoryItem
  ) => {
    if (editItem) {
      setEditItem({
        ...editItem,
        [field]: e.target.value,
      });
    }
  };

  // Handle changes in add form
  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof InventoryItem
  ) => {
    setNewItem({
      ...newItem,
      [field]: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          type="search"
          placeholder="Search medications..."
          className="w-full sm:max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Name"
                value={newItem.name}
                onChange={(e) => handleAddChange(e, "name")}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={(e) => handleAddChange(e, "quantity")}
              />
              <Input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) => handleAddChange(e, "price")}
              />
              <Input
                type="text"
                placeholder="Status"
                value={newItem.status}
                onChange={(e) => handleAddChange(e, "status")}
              />
              <Input
                type="date"
                placeholder="Expiration"
                value={newItem.expiration}
                onChange={(e) => handleAddChange(e, "expiration")}
              />
              <Input
                type="text"
                placeholder="Supplier"
                value={newItem.supplier}
                onChange={(e) => handleAddChange(e, "supplier")}
              />
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

      {/* Edit Item Dialog */}
      <Dialog
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditing(false);
            setEditItem(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Name"
                value={editItem.name}
                onChange={(e) => handleEditChange(e, "name")}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={editItem.quantity}
                onChange={(e) => handleEditChange(e, "quantity")}
              />
              <Input
                type="number"
                placeholder="Price"
                value={editItem.price}
                onChange={(e) => handleEditChange(e, "price")}
              />
              <Input
                type="text"
                placeholder="Status"
                value={editItem.status}
                onChange={(e) => handleEditChange(e, "status")}
              />
              <Input
                type="date"
                placeholder="Expiration"
                value={editItem.expiration}
                onChange={(e) => handleEditChange(e, "expiration")}
              />
              <Input
                type="text"
                placeholder="Supplier"
                value={editItem.supplier}
                onChange={(e) => handleEditChange(e, "supplier")}
              />
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
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === "In Stock"
                        ? "bg-green-300 text-black"
                        : "bg-yellow-300 text-black"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>{item.expiration}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4 text-yellow-400" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
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
