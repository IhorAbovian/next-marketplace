import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { Toaster } from "@/components/ui/toast";

export const metadata = {
  title: "My Next Marketplace",
  description: "Demo marketplace built with Next.js + shadcn/ui",
};

export default async function RootLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams?: Promise<{ q?: string; category?: string }>;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <Header searchParams={searchParams} />

        <main>{children}</main>
        <Toaster />

        <Footer />
      </body>
    </html>
  );
}
