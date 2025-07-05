import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
});

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
    <html lang="en" className={inter.variable}>
      <body className="bg-black text-white font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen">
              {/* Left Sidebar (Navigation) */}
              <Sidebar />

              {/* Main Content Area */}
              <main className="flex-1 ml-72 mr-80 min-h-screen">
                <div className="max-w-2xl mx-auto border-x border-gray-800/50 min-h-screen bg-black/50 backdrop-blur-sm">
                  {children}
                </div>
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