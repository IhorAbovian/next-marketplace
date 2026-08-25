"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface Category {
  id: string;
  name: string;
  children: Array<{
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
  }>;
}

interface FormState {
  image: File | null;
  preview: string | null;
  title: string;
  description: string;
  price: string;
  categoryId: string;
  isLoading: boolean;
}

interface CreateListingFormProps {
  categories: Category[];
}

export default function CreateListingForm({
  categories,
}: CreateListingFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    image: null,
    preview: null,
    title: "",
    description: "",
    price: "",
    categoryId: "",
    isLoading: false,
  });

  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [selectedSubcategoryName, setSelectedSubcategoryName] =
    useState<string>("");
  const selectedParent = categories.find((cat) => cat.id === selectedParentId);

  const handleImageSelect = (file: File) => {
    setForm((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        preview: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      image: null,
      preview: null,
    }));
  };

  const handleCategoryChange = (value: string | null) => {
    if (value) {
      const selectedCat = categories.find((cat) => cat.id === value);
      setSelectedParentId(value);
      setSelectedCategoryName(selectedCat?.name || "");
      setForm((prev) => ({ ...prev, categoryId: "" }));
      setSelectedSubcategoryName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.image) {
      toast.add({
        type: "error",
        title: "Error",
        description: "Please select an image",
      });
      return;
    }

    if (!form.title.trim()) {
      toast.add({
        type: "error",
        title: "Error",
        description: "Please enter a title",
      });
      return;
    }

    if (!form.price.trim()) {
      toast.add({
        type: "error",
        title: "Error",
        description: "Please enter a price",
      });
      return;
    }

    if (!form.categoryId) {
      toast.add({
        type: "error",
        title: "Error",
        description: "Please select a category",
      });
      return;
    }

    setForm((prev) => ({ ...prev, isLoading: true }));

    try {
      // Upload image
      const imageFormData = new FormData();
      imageFormData.append("file", form.image);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: imageFormData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image");
      }

      const { url } = await uploadRes.json();

      // Create listing
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("imageUrl", url);
      formData.append("categoryId", form.categoryId);

      const listingRes = await fetch("/api/listings/create", {
        method: "POST",
        body: formData,
      });

      if (!listingRes.ok) {
        const errorData = await listingRes.json();
        throw new Error(errorData.error || "Failed to create listing");
      }

      toast.add({
        type: "success",
        title: "Success",
        description: "Listing created successfully",
      });

      router.push("/profile?tab=listings");
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.add({
        type: "error",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setForm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-8 space-y-6"
        >
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Photo *
            </label>
            <ImageUpload
              onImageSelect={handleImageSelect}
              preview={form.preview || undefined}
              onRemove={handleRemoveImage}
            />
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <Input
              name="title"
              type="text"
              placeholder="Enter listing title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              disabled={form.isLoading}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter listing description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              disabled={form.isLoading}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price *
            </label>
            <Input
              name="price"
              type="number"
              placeholder="Enter price"
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, price: e.target.value }))
              }
              disabled={form.isLoading}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category *
            </label>
            <Select
              value={selectedParentId}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger name="category">
                {selectedCategoryName ? (
                  <span>{selectedCategoryName}</span>
                ) : (
                  <SelectValue placeholder="Select category" />
                )}
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          {selectedParent && selectedParent.children.length > 0 && (
            <div>
              <label
                htmlFor="subcategory"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subcategory *
              </label>
              <Select
                value={form.categoryId}
                onValueChange={(value) => {
                  if (value) {
                    const selectedSubcat = selectedParent?.children.find(
                      (c) => c.id === value,
                    );
                    setForm((prev) => ({ ...prev, categoryId: value }));
                    setSelectedSubcategoryName(selectedSubcat?.name || "");
                  }
                }}
              >
                <SelectTrigger name="subcategory">
                  {selectedSubcategoryName ? (
                    <span>{selectedSubcategoryName}</span>
                  ) : (
                    <SelectValue placeholder="Select subcategory" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {selectedParent.children.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id}>
                      {subcat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* If no subcategories, use parent */}
          {selectedParent && selectedParent.children.length === 0 && (
            <input
              type="hidden"
              value={form.categoryId || selectedParentId}
              onChange={() => {}}
            />
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={form.isLoading}>
            {form.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Listing"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
