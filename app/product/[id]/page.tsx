import Image from "next/image";
import { products } from "@/lib/data";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === id);
  
  if (!product) return <p>Product not found - ID: {id}</p>;
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col">
        <div className="relative w-60 h-96 bg-gray-100 rounded-lg mb-4">
          <Image src={product.image} alt={product.title} fill className="object-cover rounded-lg" unoptimized />
        </div>
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-gray-600 mb-4">{product.location}</p>
        <p className="text-3xl font-bold text-blue-600 mb-4">${product.price}</p>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
          Contact Seller
        </button>
      </div>
    </div>
  );
}