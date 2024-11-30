"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

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
  medicationSupplied: string;
  date: string;
  quantity: number;
};

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
