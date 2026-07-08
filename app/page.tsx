import ProductCard from "@/components/cards/ProductCard";

export default function HomePage() {
  return (
    <main className="container max-w-7xl mx-auto px-4 pt-8">
      <h1 className="text-xl font-medium mb-4">Homepage Gallery</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        <ProductCard
          id="1"
          title="Product 1"
          price={1000}
          image="https://placehold.co/400x300"
          location="Canada"
        />
        <ProductCard
          id="2"
          title="Product 2"
          price={1000}
          image="https://placehold.co/400x300"
          location="Canada"
        />
        <ProductCard
          id="3"
          title="Product 3"
          price={1000}
          image="https://placehold.co/400x300"
          location="Canada"
        />
        <ProductCard
          id="1"
          title="Product 1"
          price={1000}
          image="https://placehold.co/400x300"
          location="Canada"
        />
        <ProductCard
          id="1"
          title="Product 1"
          price={1000}
          image="https://placehold.co/400x300"
          location="Canada"
        />
      </div>
    </main>
  );
}
