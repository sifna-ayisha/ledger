import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { DashboardProvider } from "@/context/DashboardContext";

export const metadata = {
  title: "Personal Ledger",
  description: "Personal sales, expense, balance, analytics and report tracking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <DashboardProvider>{children}</DashboardProvider>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
