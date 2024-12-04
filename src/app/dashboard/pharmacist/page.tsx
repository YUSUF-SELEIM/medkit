"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, PlusCircle } from "lucide-react";
import { useDataContext } from "@/context/DataContext"; // Import useDataContext

export default function SuppliersPage() {
  const { suppliers, deleteSupplier, addInventory, inventory, updateInventoryQuantity } = useDataContext();
  const router = useRouter();

  const handleAccept = (id: string, medications: { name: string; quantity: number }[]) => {
    medications.forEach((medication) => {
      // Check if the medication already exists in the inventory
      const existingMedication = inventory.find(item => item.name === medication.name);

      if (existingMedication) {
        // If the medication exists, update its quantity
        const updatedQuantity = existingMedication.quantity + medication.quantity;

        // Update the inventory by modifying the existing medication's quantity
        updateInventoryQuantity(medication.name, updatedQuantity);
      } else {
        // If the medication doesn't exist, add it to the inventory
        addInventory({
          id: `${medication.name}-${new Date().toISOString()}`,
          name: medication.name,
          quantity: medication.quantity,
          price: 0, // Set price to 0 or based on your logic
          status: "In Stock",
          expiration: "",
          supplier: id,
        });
      }
    });

    // After updating the inventory, delete the supplier
    deleteSupplier(id);

    // Ensure the updated inventory is saved to localStorage
    localStorage.setItem("inventory", JSON.stringify(inventory));
  };

  const handleReject = (id: string) => {
    // Logic to reject the supplier (just removes the supplier from the context)
    deleteSupplier(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supplier List</h2>
        <Button onClick={() => router.push("/dashboard/pharmacist/suppliers/add")}>
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
                <TableCell>{supplier.supplierName}</TableCell>
                <TableCell>{supplier.contactNumber}</TableCell>
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
                <TableCell>{supplier.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button onClick={() => handleAccept(supplier.id, supplier.medications)} variant="outline" className="text-green-600" size="sm">
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                    <Button onClick={() => handleReject(supplier.id)} variant="outline" className="text-red-600" size="sm">
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
  );
}
