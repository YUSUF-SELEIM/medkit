"use client";
import { Inter } from "next/font/google";
import "../../app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { DataProvider } from "@/context/DataContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found, redirecting to login");
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch user data:", errorData);
          throw new Error(response.statusText);
        }

        const data = await response.json();
        console.log("Fetched user data:", data); // Log the user data
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);
  console.log(user);
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
              <div className="flex-1 flex flex-col overflow-hidden">
                {user && <Header user={user} />}
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
