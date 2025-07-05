import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for now, can switch to Geist later
import "./globals.css";
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IJIDeals - Your Social E-commerce Platform",
  description: "A multi-vendor e-commerce platform with social features, inspired by X.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen bg-black text-white">
              {/* Left Sidebar (Navigation) */}
              <Sidebar />

              {/* Main Content Area */}
              <main className="flex-1 p-4">
                {children}
              </main>

              {/* Right Sidebar (Trends, Suggestions) */}
              <RightSidebar />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
