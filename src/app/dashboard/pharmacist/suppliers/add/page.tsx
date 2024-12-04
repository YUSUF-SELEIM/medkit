"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDataContext } from "@/context/DataContext"; // Correct import

type Medication = {
  name: string;
  quantity: number;
};

export default function AddSupplierPage() {
  const router = useRouter();
  const { addSupplier } = useDataContext(); // Access the context's addSupplier function
  const [supplier, setSupplier] = useState({
    name: "",
    contact: "",
    medications: [{ name: "", quantity: 0 }],
    supply_date: "",
  });

  // Handle changes to supplier fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;
    if (name === "medication_name" && index !== undefined) {
      const updatedMedications = [...supplier.medications];
      updatedMedications[index].name = value;
      setSupplier({ ...supplier, medications: updatedMedications });
    } else if (name === "medication_quantity" && index !== undefined) {
      const updatedMedications = [...supplier.medications];
      updatedMedications[index].quantity = parseInt(value, 10);
      setSupplier({ ...supplier, medications: updatedMedications });
    } else {
      setSupplier({ ...supplier, [name]: value });
    }
  };

  // Handle adding new medication input fields
  const handleAddMedication = () => {
    setSupplier({
      ...supplier,
      medications: [...supplier.medications, { name: "", quantity: 0 }],
    });
  };

  // Handle removing a medication input field
  const handleRemoveMedication = (index: number) => {
    const updatedMedications = supplier.medications.filter((_, i) => i !== index);
    setSupplier({ ...supplier, medications: updatedMedications });
  };

  // Handle submitting the form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier = { id: Date.now().toString(), ...supplier };
    addSupplier(newSupplier); // Add the new supplier to the context
    console.log("New supplier:", newSupplier);
    router.push("/dashboard/pharmacist/suppliers"); // Navigate back to the suppliers page after adding
  };

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Supplier</h1>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <Label htmlFor="name">Supplier Name</Label>
          <Input
            id="name"
            name="name"
            value={supplier.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="contact">Contact Number</Label>
          <Input
            id="contact"
            name="contact"
            value={supplier.contact}
            onChange={handleChange}
            required
          />
        </div>

        {/* Medications Section */}
        <div>
          <Label>Medications Supplied</Label>
          {supplier.medications.map((medication, index) => (
            <div key={index} className="space-y-2">
              <div>
                <Label htmlFor={`medication_name_${index}`}>Medication Name</Label>
                <Input
                  id={`medication_name_${index}`}
                  name="medication_name"
                  value={medication.name}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`medication_quantity_${index}`}>Quantity</Label>
                <Input
                  id={`medication_quantity_${index}`}
                  name="medication_quantity"
                  type="number"
                  value={medication.quantity}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="text-red-600"
                onClick={() => handleRemoveMedication(index)}
              >
                Remove Medication
              </Button>
            </div>
          ))}
          <Button type="button" onClick={handleAddMedication}>
            Add Medication
          </Button>
        </div>

        <div>
          <Label htmlFor="supply_date">Supply Date</Label>
          <Input
            id="supply_date"
            name="supply_date"
            type="date"
            value={supplier.supply_date}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Add Supplier
        </Button>
      </form>
    </div>
  );
}
