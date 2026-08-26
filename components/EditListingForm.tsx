"use client";

import { useState, useEffect } from "react";
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
import { Loader2, X } from "lucide-react";
import { toast } from "@/components/ui/toast";
import Image from "next/image";
import { editListing } from "@/lib/actions";

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

interface ListingImage {
  url: string;
}

interface ListingWithCategory {
  id: string;
  title: string;
  description: string;
  price: number;
  images: ListingImage[];
  category: {
    id: string;
    name: string;
    parent?: { id: string; name: string } | null;
  };
}

interface FormState {
  image: File | null;
  preview: string | null;
  title: string;
  description: string;
  price: string;
  categoryId: string;
  isLoading: boolean;
  imageRemoved: boolean;
}

interface EditListingFormProps {
  listing: ListingWithCategory;
  categories: Category[];
}

export default function EditListingForm({
  listing,
  categories,
}: EditListingFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    image: null,
    preview: null,
    title: listing.title,
    description: listing.description,
    price: String(listing.price),
    categoryId: listing.category.id,
    isLoading: false,
    imageRemoved: false,
  });

  const [selectedParentId, setSelectedParentId] = useState<string>(
    listing.category.parent?.id || "",
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    listing.category.parent?.name || "",
  );
  const [selectedSubcategoryName, setSelectedSubcategoryName] =
    useState<string>(listing.category.name);

  const selectedParent = categories.find((cat) => cat.id === selectedParentId);

  useEffect(() => {
    // Auto-select parent if listing has a subcategory
    if (listing.category.parent) {
      setSelectedParentId(listing.category.parent.id);
      setSelectedCategoryName(listing.category.parent.name);
    }
  }, [listing]);

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
      imageRemoved: true,
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
      let imageUrl: string | undefined;

      // Upload new image if selected
      if (form.image) {
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
        imageUrl = url;
      } else if (form.imageRemoved) {
        // If image was removed, pass empty string to delete it
        imageUrl = "";
      }

      // Call editListing Server Action with only changed fields
      await editListing(listing.id, {
        title: form.title,
        description: form.description,
        price: form.price,
        categoryId: form.categoryId,
        imageUrl: imageUrl,
      });

      toast.add({
        type: "success",
        title: "Success",
        description: "Listing updated successfully",
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
        <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-8 space-y-6"
        >
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Photo
            </label>
            {form.preview ? (
              <ImageUpload
                onImageSelect={handleImageSelect}
                preview={form.preview}
                onRemove={handleRemoveImage}
              />
            ) : form.imageRemoved ? (
              <ImageUpload
                onImageSelect={handleImageSelect}
                preview={undefined}
                onRemove={handleRemoveImage}
              />
            ) : listing.images && listing.images.length > 0 ? (
              <div className="relative">
                <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={listing.images[0].url}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  {/* X button in corner - always visible */}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  preview={undefined}
                  onRemove={handleRemoveImage}
                />
              </div>
            ) : (
              <ImageUpload
                onImageSelect={handleImageSelect}
                preview={undefined}
                onRemove={handleRemoveImage}
              />
            )}
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
                Updating...
              </>
            ) : (
              "Update Listing"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
