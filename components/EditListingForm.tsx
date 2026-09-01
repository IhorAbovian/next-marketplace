"use client";

import { startTransition, useState, useEffect, useRef } from "react";
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
import type { Prisma } from "@/generated/prisma/client";
import type { CategoryWithChildren } from "@/lib/data";
import { useActionState } from "react";

export type ListingWithCategory = Prisma.ListingGetPayload<{
  include: {
    images: true;
    category: {
      include: {
        parent: true;
      };
    };
  };
}>;

type EditListingFormProps = {
  listing: ListingWithCategory;
  categories: CategoryWithChildren[];
};

export default function EditListingForm({
  listing,
  categories,
}: EditListingFormProps) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(editListing, null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description || "");
  const [price, setPrice] = useState(String(listing.price));
  const [categoryId, setCategoryId] = useState(listing.category.id);

  const [selectedParentId, setSelectedParentId] = useState<string>(
    listing.category.parent?.id || "",
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    listing.category.parent?.name || "",
  );
  const [selectedSubcategoryName, setSelectedSubcategoryName] =
    useState<string>(listing.category.name);

  const selectedParent = categories.find((cat) => cat.id === selectedParentId);
  const handledStateRef = useRef<typeof state>(null);

  useEffect(() => {
    if (!state || handledStateRef.current === state) return;
    handledStateRef.current = state;

    if (state.error) {
      toast.add({
        type: "error",
        title: "Error",
        description: state.error,
      });
    }

    if (state.success) {
      toast.add({
        type: "success",
        title: "Success",
        description: "Listing updated successfully",
      });

      router.push("/profile?tab=listings");
    }
  }, [state, router]);

  const handleImageSelect = (file: File) => {
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageRemoved(true);
  };

  const handleCategoryChange = (value: string | null) => {
    if (value) {
      const selectedCat = categories.find((cat) => cat.id === value);
      setSelectedParentId(value);
      setSelectedCategoryName(selectedCat?.name || "");
      setCategoryId("");
      setSelectedSubcategoryName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Capture the form before any await — React nulls out currentTarget once
    // the synthetic event is released after the handler yields.
    const form = e.currentTarget;

    if (!title.trim()) {
      toast.add({
        type: "error",
        title: "Error",
        description: "Please enter a title",
      });
      return;
    }

    if (!price.trim()) {
      toast.add({
        type: "error",
        title: "Error",
        description: "Please enter a price",
      });
      return;
    }

    const finalCategoryId = categoryId || selectedParentId;

    if (!finalCategoryId) {
      toast.add({
        type: "error",
        title: "Error",
        description: "Please select a category",
      });
      return;
    }

    try {
      let imageUrl: string | undefined;

      // Upload new image if selected
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image");
        }

        const { url } = await uploadRes.json();
        imageUrl = url;
      } else if (imageRemoved) {
        // If image was removed, pass empty string to delete it
        imageUrl = "";
      }

      const formData = new FormData(form);
      formData.set("listingId", listing.id);
      formData.set("title", title);
      formData.set("description", description);
      formData.set("price", price);
      formData.set("categoryId", finalCategoryId);
      if (imageUrl !== undefined) {
        formData.set("imageUrl", imageUrl);
      }

      startTransition(() => {
        action(formData);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.add({
        type: "error",
        title: "Error",
        description: errorMessage,
      });
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
            {imagePreview ? (
              <ImageUpload
                onImageSelect={handleImageSelect}
                preview={imagePreview}
                onRemove={handleRemoveImage}
              />
            ) : imageRemoved ? (
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isPending}
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
                value={categoryId}
                onValueChange={(value) => {
                  if (value) {
                    const selectedSubcat = selectedParent?.children.find(
                      (c) => c.id === value,
                    );
                    setCategoryId(value);
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

          {/* Submit Button */}
          <Button type="submit" disabled={isPending}>
            {isPending ? (
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
