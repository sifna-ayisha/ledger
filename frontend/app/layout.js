import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { DashboardProvider } from "@/context/DashboardContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Personal Ledger",
  description: "Personal sales, expense, balance, analytics and report tracking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <DashboardProvider>{children}</DashboardProvider>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
