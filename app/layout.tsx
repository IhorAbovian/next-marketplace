import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "My Next Marketplace",
  description: "Demo marketplace built with Next.js + shadcn/ui",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    select: {
      id: true,
      name: true,
      slug: true,
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <Header categories={categories} />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
