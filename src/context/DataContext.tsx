"use"
import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the types for Inventory, Customer, and Supplier
type Inventory = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: string;
  expiration: string;
  supplier: string;
};

type Customer = {
  id: string;
  customerName: string;
  medicationPurchased: string;
  quantity: number;
  totalPrice: number;
};

type Supplier = {
  id: string;
  supplierName: string;
  contactNumber: string;
  medications: { name: string; quantity: number }[];  // Medications with quantities
  date: string;
};

// Define the context type
type DataContextType = {
  inventory: Inventory[];
  customers: Customer[];
  suppliers: Supplier[];
  addInventory: (item: Inventory) => void;
  addCustomer: (customer: Customer) => void;
  addSupplier: (supplier: Supplier) => void;
  deleteInventory: (id: string) => void;
  deleteCustomer: (id: string) => void;
  deleteSupplier: (id: string) => void;
  updateInventoryQuantity: (name: string, quantity: number) => void;  // Update inventory function
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const addInventory = (item: Inventory) => {
    setInventory((prev) => [...prev, item]);
  };

  const addCustomer = (customer: Customer) => {
    setCustomers((prev) => [...prev, customer]);
  };

  const addSupplier = (supplier: Supplier) => {
    setSuppliers((prev) => [...prev, supplier]);
  };

  const deleteInventory = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
  };

  const updateInventoryQuantity = (name: string, quantity: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.name === name
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        inventory,
        customers,
        suppliers,
        addInventory,
        addCustomer,
        addSupplier,
        deleteInventory,
        deleteCustomer,
        deleteSupplier,
        updateInventoryQuantity, // Provide the update function
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
