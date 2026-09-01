"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

type ProfileTabsProps = {
  activeTab: string;
};

export default function ProfileTabs({ activeTab }: ProfileTabsProps) {
  const tabs = [
    { id: "info", label: "Profile Info" },
    { id: "listings", label: "My Listings" },
    { id: "favorites", label: "Favorites" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/profile?tab=${tab.id}`}
              className={`block px-4 py-3 rounded text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
