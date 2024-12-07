/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Package } from "lucide-react";
import {
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Cell,
  Legend,
  Pie,
} from "recharts";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export function PharmacyDashboardMetrics() {
  const [monthlyRevenue, setMonthlyRevenue] = useState<any>(null);
  const [patientsServed, setPatientsServed] = useState<any>(null);
  const [inventoryValue, setInventoryValue] = useState<any>(null);

  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(true);

  useEffect(() => {
    // Fetch all dashboard metrics
    Promise.all([
      fetch("/api/total-revenue")
        .then((res) => res.json())
        .then((data) => {
          setMonthlyRevenue(data);
          setLoadingRevenue(false);
        }),
      fetch("/api/patients-served")
        .then((res) => res.json())
        .then((data) => {
          setPatientsServed(data);
          setLoadingPatients(false);
        }),
      fetch("/api/inventory-value")
        .then((res) => res.json())
        .then((data) => {
          setInventoryValue(data);
          setLoadingInventory(false);
        }),
    ]).catch((error) => {
      console.error("Dashboard metrics fetch error:", error);
    });
  }, []);

  return (
    <div className="grid gap-4 grid-cols-2">
      {/* <Card className="h-[230px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Low Stock Medications
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loadingLowStock ? (
            <Spinner className="mx-auto w-12 h-12 mt-12" />
          ) : (
            <ul className="mt-2 space-y-1">
              {lowStockMedications?.map((med) => (
                <li key={med.med_id}>
                  <Link
                    href={`/inventory/${med.name.toLowerCase()}`}
                    className="text-sm hover:underline"
                  >
                    {med.name}: {med.stock_quantity} units
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card> */}

      <Card className="row-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loadingRevenue ? (
            <Spinner className="mx-auto w-12 h-12 mt-40" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                ${monthlyRevenue?.totalRevenue.toFixed(2) || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                Total revenue across all prescriptions
              </p>
              <div className="h-[340px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={monthlyRevenue?.medicationBreakdown || []}
                      dataKey="revenue"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {monthlyRevenue?.medicationBreakdown?.map(
                        (entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(210, 70%, ${50 + index * 10}%)`}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="h-[230px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Patients Served (Weekly)
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loadingPatients ? (
            <Spinner className="mx-auto w-12 h-12 mt-12" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {patientsServed?.totalPatients}
              </div>
              <p className="text-xs text-muted-foreground">
                +{patientsServed?.growthRate}% from last week
              </p>
              <div className="h-[80px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientsServed?.patientData || []}>
                    <Line type="monotone" dataKey="patients" stroke="#8884d8" />
                    <XAxis dataKey="name" />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="h-[230px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loadingInventory ? (
            <Spinner className="mx-auto w-12 h-12 mt-12" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                ${inventoryValue?.totalValue.toFixed(2) || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                {inventoryValue?.uniqueProducts} unique products
              </p>
              <div className="mt-4 h-[80px] w-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-md relative">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                  {inventoryValue?.capacityPercentage.toFixed(0) || 0}% capacity
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
