"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { getUnreadMessageCount } from "@/lib/actions";

const POLL_INTERVAL_MS = 10000;

type MessagesNavLinkProps = {
  initialUnreadCount: number;
};

export default function MessagesNavLink({
  initialUnreadCount,
}: MessagesNavLinkProps) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const count = await getUnreadMessageCount();
      setUnreadCount(count);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Link
      href="/messages"
      aria-label="Messages"
      className="relative text-gray-700 hover:text-black"
    >
      <FaEnvelope size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
