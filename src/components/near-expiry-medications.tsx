import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Package } from "lucide-react";

export function NearExpiryMedications() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-red-500">
          Near Expiry Medications
        </CardTitle>
        <Package className="h-4 w-4 text-muted-foreground text-red-500" />
      </CardHeader>
      <CardContent>
        <ul className="mt-2 space-y-1">
          <li>
            <Link href="/inventory/aspirin" className="text-sm hover:underline">
              Aspirin: <span className="text-red-500">Exp. 01/01/2025</span>
            </Link>
          </li>
          <li>
            <Link
              href="/inventory/amoxicillin"
              className="text-sm hover:underline"
            >
              Amoxicillin: <span className="text-red-500">Exp. 01/01/2025</span>
            </Link>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
