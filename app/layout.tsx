import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export const metadata = {
  title: "My Next Marketplace",
  description: "Demo marketplace built with Next.js + shadcn/ui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
