import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Our Pharmacy",
  description: "Your trusted online pharmacy service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-primary text-primary-foreground">
          <nav className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                Our Pharmacy
              </Link>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/login/patient" className="hover:underline">
                    Patient Login
                  </Link>
                </li>
                <li>
                  <Link href="/register/patient" className="hover:underline">
                    Patient Register
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="bg-muted mt-12">
          <div className="container mx-auto px-4 py-6 text-center">
            <p>&copy; 2023 Our Pharmacy. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
