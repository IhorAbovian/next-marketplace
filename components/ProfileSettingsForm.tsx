"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

import { updateProfile } from "@/lib/actions";

interface ProfileSettingsFormProps {
  userId: string;
  initialName: string | null;
  initialPhone: string | null;
  initialAvatar?: string | null;
}

export default function ProfileSettingsForm({
  initialName,
  initialPhone,
  initialAvatar,
}: ProfileSettingsFormProps) {
  const [name, setName] = useState(initialName || "");
  const [phone, setPhone] = useState(initialPhone || "");
  const [avatar, setAvatar] = useState(initialAvatar || null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = useCallback(async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("/api/avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAvatar(data.url);
        toast.add({
          type: "success",
          title: "Success",
          description: "Avatar uploaded successfully",
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.add({
        type: "error",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload avatar",
      });
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate phone if provided
    if (phone && !isValidPhoneNumber(phone)) {
      toast.add({
        type: "error",
        title: "Error",
        description: "Please enter a valid phone number",
      });
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append("phone", phone);

    try {
      await updateProfile(formData);

      toast.add({
        type: "success",
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatar || ""} alt={name || "User"} />
            <AvatarFallback className="text-2xl">
              {name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center cursor-pointer transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarUpload(file);
              }}
              className="hidden"
            />
            <Camera className="w-4 h-4 text-white" />
          </label>
        </div>
      </div>

      {uploading && (
        <p className="text-sm text-gray-500 text-center">Loading...</p>
      )}

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
        <PhoneInput
          name="phone"
          value={phone}
          onChange={setPhone}
          placeholder="Phone (optional)"
          defaultCountry="CA"
        />
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
}
