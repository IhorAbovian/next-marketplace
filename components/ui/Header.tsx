import Link from "next/link";
import SearchBar from "@/components/ui/SearchBar";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-6">
        <Link href="/" className="font-bold text-2xl whitespace-nowrap">
          Marketplace
        </Link>

        <div className="flex-1">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/register" className="hover:underline">
            Register
          </Link>
          <span>or</span>
          <Link href="/login" className="hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
