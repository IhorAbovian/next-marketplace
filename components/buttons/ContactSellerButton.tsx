"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { createOrFindChat } from "@/lib/actions";
import type { Chat } from "@/generated/prisma/browser";

type ContactSellerButtonProps = {
  listingId: Chat["listingId"];
  sellerId: Chat["sellerId"];
  className?: string;
};

export default function ContactSellerButton({
  listingId,
  sellerId,
  className = "",
}: ContactSellerButtonProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleContactSeller = async () => {
    if (!session?.user) {
      router.push("/sign-in");
      return;
    }

    const chat = await createOrFindChat(listingId, sellerId);
    router.push(`/messages?chat=${chat.id}`);
  };

  return (
    <Button className={className} onClick={handleContactSeller}>
      Contact Seller
    </Button>
  );
}
