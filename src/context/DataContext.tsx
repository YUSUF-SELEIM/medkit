"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

// Types for Inventory and Supplier
type Inventory = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: string;
  expiration: string;
  supplier: string;
};

type Supplier = {
  id: string;
  supplierName: string;
  contactNumber: string;
  medications: { name: string; quantity: number }[];
  date: string;
};

// DataContext Type to hold functions and state for suppliers and inventory
type DataContextType = {
  inventory: Inventory[];
  suppliers: Supplier[];
  addInventory: (item: Inventory) => void;
  addSupplier: (supplier: Supplier) => void;
  deleteInventory: (id: string) => void;
  deleteSupplier: (id: string) => void;
  updateInventoryQuantity: (name: string, quantity: number) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// DataProvider Component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedInventory = localStorage.getItem("inventory");
    const savedSuppliers = localStorage.getItem("suppliers");

    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers));
    }
  }, []);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
  }, [inventory, suppliers]);

  // Function to add inventory
  const addInventory = (item: Inventory) => {
    setInventory((prev) => [...prev, item]);
  };

  // Function to add a new supplier
  const addSupplier = (supplier: Supplier) => {
    setSuppliers((prev) => [...prev, supplier]);
  };

  // Function to delete inventory by ID
  const deleteInventory = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  // Function to delete supplier by ID
  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
  };

  // Function to update inventory quantity based on medication name
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
        suppliers,
        addInventory,
        addSupplier,
        deleteInventory,
        deleteSupplier,
        updateInventoryQuantity,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to access the DataContext
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
