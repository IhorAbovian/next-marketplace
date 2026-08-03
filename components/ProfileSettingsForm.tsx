"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileSettingsFormProps {
  userId: string;
  initialName: string | null;
  initialPhone: string | null;
}

export default function ProfileSettingsForm({
  userId,
  initialName,
  initialPhone,
}: ProfileSettingsFormProps) {
  const [name, setName] = useState(initialName || "");
  const [phone, setPhone] = useState(initialPhone || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Success - data saved
        console.log("Profile updated successfully");
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <Input
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
        />
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
}
