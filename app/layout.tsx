import type { Metadata } from "next";
import { Outfit, Poppins } from "next/font/google";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aashutosh Kothi Ice Cream | The Taste of Satisfaction",
  description: "Premium ice cream brand, experience the taste of satisfaction with Aashutosh Kothi.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-scrollbar">
      <body
        className={`${outfit.variable} ${poppins.variable} font-outfit antialiased bg-[#FFF8F5]`}
      >
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
