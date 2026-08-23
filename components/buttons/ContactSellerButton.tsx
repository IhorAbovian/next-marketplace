"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface ContactSellerButtonProps {
  className?: string;
}

export default function ContactSellerButton({
  className = "",
}: ContactSellerButtonProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleContactSeller = () => {
    if (!session?.user) {
      router.push("/sign-in");
      return;
    }

    // TODO: Implement contact seller functionality
    // This could open a modal, navigate to messages, etc.
  };

  return (
    <Button className={className} onClick={handleContactSeller}>
      Contact Seller
    </Button>
  );
}
