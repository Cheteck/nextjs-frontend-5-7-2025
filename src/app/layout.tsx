import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import ToastContainer from '../components/ToastContainer';
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
            <div className="flex min-h-screen relative">
              {/* Background Effects */}
              <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
              </div>

              {/* Left Sidebar (Navigation) */}
              <Sidebar />

              {/* Main Content Area */}
              <main className="flex-1 ml-72 mr-80 min-h-screen relative z-10">
                <div className="max-w-2xl mx-auto border-x border-gray-800/50 min-h-screen glass">
                  {children}
                </div>
              </main>

              {/* Right Sidebar (Trends, Suggestions) */}
              <RightSidebar />

              {/* Toast Container */}
              <ToastContainer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}