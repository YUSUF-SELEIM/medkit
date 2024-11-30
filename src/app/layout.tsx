import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { DataProvider } from '@/context/DataContext';  // Import the DataProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PharmaDash',
  description: 'Manage your pharmacy inventory and customers',
};

// Define the route names and paths
const routes = [
  { name: 'Home', path: '/' },
  { name: 'Inventory', path: '/inventory' },
  { name: 'Customers', path: '/customers' },
  { name: 'Suppliers', path: '/suppliers' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                {/* Pass the routes array to the Header */}
                <Header routes={routes} />
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
