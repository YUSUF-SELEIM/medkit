"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Truck, ShoppingCart } from "lucide-react";
import { Spinner } from "./ui/spinner";

// Types for Orders and Medication Order Details
type Order = {
  order_id: string;
  order_date: Date;
  status: string;
  pharmacist_id: string;
  supplier: string;
  Medication_Order_Detail?: MedicationOrderDetail[];
};

type Medication = {
  med_id: string;
  name: string;
  supplier: string;
  price: number;
  stock_quantity: number;
};

type MedicationOrderDetail = {
  order_id: string;
  med_id: string;
  ordered_quantity: number;
  Medication?: Medication;
};

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedications, setSelectedMedications] = useState<{
    [key: string]: number;
  }>({});

  // Fetch orders and medications on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, medicationsResponse] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/medications"),
        ]);

        const ordersData = await ordersResponse.json();
        const medicationsData = await medicationsResponse.json();

        setOrders(ordersData);
        console.log("order Data:", ordersData);
        setMedications(medicationsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle medication selection for order
  const handleMedicationSelect = (medId: string, quantity: number) => {
    setSelectedMedications((prev) => ({
      ...prev,
      [medId]: quantity,
    }));
  };

  // Create new order
  const handleCreateOrder = async () => {
    try {
      // Prepare order details
      const orderDetails = Object.entries(selectedMedications)
        .filter(([, quantity]) => quantity > 0)
        .map(([medId, quantity]) => ({
          med_id: medId,
          ordered_quantity: quantity,
        }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          supplier: orderDetails[0]
            ? medications.find((m) => m.med_id === orderDetails[0].med_id)
                ?.supplier || "Unknown"
            : "Unknown",
          status: "Pending",
          Medication_Order_Detail: orderDetails,
        }),
      });

      if (response.ok) {
        const newOrder = await response.json();
        setOrders([...orders, newOrder]);
        setIsCreatingOrder(false);
        setSelectedMedications({});
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const handleCompleteOrder = async (order: Order) => {
    try {
      // Validate order details
      if (
        !order.Medication_Order_Detail ||
        order.Medication_Order_Detail.length === 0
      ) {
        console.error("No medication details found in the order");
        return;
      }

      // Process each medication in the order
      const updatedMedications = await Promise.all(
        order.Medication_Order_Detail.map(async (detail) => {
          // Ensure we have medication details
          const medication =
            detail.Medication ||
            medications.find((m) => m.med_id === detail.med_id);

          if (!medication) {
            console.error(`Medication not found for ID: ${detail.med_id}`);
            return null;
          }

          // Calculate new stock quantity
          const newStockQuantity =
            medication.stock_quantity + detail.ordered_quantity;

          try {
            // Update medication stock
            console.log("Updating stock for medication:", detail.med_id);
            const response = await fetch(`/api/medications/${detail.med_id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`, // if needed
              },
              body: JSON.stringify({
                med_id: medication.med_id,
                name: medication.name,
                supplier: medication.supplier,
                price: medication.price,
                stock_quantity: newStockQuantity,
              }),
            });

            if (!response.ok) {
              throw new Error(
                `Failed to update stock for medication ${detail.med_id}`
              );
            }

            // Return updated medication
            return { ...medication, stock_quantity: newStockQuantity };
          } catch (error) {
            console.error(
              `Error updating stock for medication ${detail.med_id}:`,
              error
            );
            return null;
          }
        })
      );

      // Update order status
      const orderUpdateResponse = await fetch(`/api/orders/${order.order_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization
        },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (!orderUpdateResponse.ok) {
        throw new Error("Failed to update order status");
      }

      // Update local state
      setMedications((prevMedications) =>
        prevMedications.map(
          (med) =>
            updatedMedications.find(
              (updated) => updated?.med_id === med.med_id
            ) || med
        )
      );

      // Remove completed order
      setOrders((prevOrders) =>
        prevOrders.filter((o) => o.order_id !== order.order_id)
      );

      // Removed alert
    } catch (error) {
      console.error("Failed to complete order:", error);
      // Removed alert
    }
  };

  if (isLoading) {
    return <Spinner className="h-20 w-20 mx-auto mt-52" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreatingOrder(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Order
        </Button>
      </div>

      {/* Create Order Dialog */}
      <Dialog open={isCreatingOrder} onOpenChange={setIsCreatingOrder}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Order Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((medication) => (
                <TableRow key={medication.med_id}>
                  <TableCell>{medication.name}</TableCell>
                  <TableCell>{medication.supplier}</TableCell>
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
                  <TableCell>${medication.price}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={selectedMedications[medication.med_id] || 0}
                      onChange={(e) =>
                        handleMedicationSelect(
                          medication.med_id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleCreateOrder}>
              <Truck className="mr-2 h-4 w-4" /> Place Order
            </Button>
            <Button variant="outline" onClick={() => setIsCreatingOrder(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Orders Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>
                  {new Date(order.order_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.supplier}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "Pending"
                        ? "bg-yellow-300 text-black"
                        : "bg-red-300 text-black"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                {order.status !== "Completed" && (
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCompleteOrder(order)}
                    >
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.length === 0 && (
          <div className="flex my-12 space-y-4 flex-col items-center justify-center w-full">
            <Truck className="h-24 w-24" />
            <p className="text-lg font-semibold text-gray-600">
              No Pending Prescriptions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
