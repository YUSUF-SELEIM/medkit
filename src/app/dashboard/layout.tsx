'use client';
import { Inter } from "next/font/google";
import "../../app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { DataProvider } from "@/context/DataContext"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check for the token in localStorage
    const token = localStorage.getItem("token");

    // If no token is found, redirect to login page
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap everything with DataProvider */}
        <DataProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col h-screen md:flex-row">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4">
                  {children}
                </main>
              </div>
            </div>
          </ThemeProvider>
        </DataProvider>
      </body>
    </html>
  );
}
