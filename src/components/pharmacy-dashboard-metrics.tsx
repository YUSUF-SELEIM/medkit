"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle, DollarSign, Users, Package } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
];

const patientData = [
  { name: "Mon", patients: 50 },
  { name: "Tue", patients: 80 },
  { name: "Wed", patients: 120 },
  { name: "Thu", patients: 90 },
  { name: "Fri", patients: 110 },
  { name: "Sat", patients: 70 },
  { name: "Sun", patients: 40 },
];

export function PharmacyDashboardMetrics() {
  return (
    <div className="grid gap-4 grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Low Stock Medications
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ul className="mt-2 space-y-1">
            <li>
              <Link
                href="/inventory/paracetamol"
                className="text-sm hover:underline"
              >
                Paracetamol: 5 units
              </Link>
            </li>
            <li>
              <Link
                href="/inventory/ibuprofen"
                className="text-sm hover:underline"
              >
                Ibuprofen: 3 units
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$28,000</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
          <div className="h-[80px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <Bar dataKey="sales" fill="#8884d8" />
                <XAxis dataKey="name" />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Patients Served (Weekly)
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">560</div>
          <p className="text-xs text-muted-foreground">+5% from last week</p>
          <div className="h-[80px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientData}>
                <Line type="monotone" dataKey="patients" stroke="#8884d8" />
                <XAxis dataKey="name" />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$125,000</div>
          <p className="text-xs text-muted-foreground">230 unique products</p>
          <div className="mt-4 h-[80px] w-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-md relative">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
              75% capacity
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
