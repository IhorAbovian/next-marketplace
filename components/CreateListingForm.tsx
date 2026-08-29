"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { createListing } from "@/lib/actions";
import {
  createListingSchema,
  type CreateListingInput,
} from "@/lib/schemas/listing.schema";

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

interface CreateListingFormProps {
  categories: Category[];
}

export default function CreateListingForm({
  categories,
}: CreateListingFormProps) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [selectedSubcategoryName, setSelectedSubcategoryName] =
    useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<CreateListingInput>({
    resolver: zodResolver(createListingSchema),
    mode: "onBlur",
  });

  const categoryId = watch("categoryId");
  const selectedParent = categories.find((cat) => cat.id === selectedParentId);

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
  };

  const handleCategoryChange = (value: string | null) => {
    if (value) {
      const selectedCat = categories.find((cat) => cat.id === value);
      setSelectedParentId(value);
      setSelectedCategoryName(selectedCat?.name || "");
      setValue("categoryId", "");
      setSelectedSubcategoryName("");
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!imageFile) {
      toast.add({
        type: "error",
        title: "Error",
        description: "Please select an image",
      });
      return;
    }

    try {
      // Upload image
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

      // Create listing
      const result = await createListing({
        ...data,
        imageUrl: url,
      });

      if (result.error) {
        toast.add({
          type: "error",
          title: "Error",
          description: result.error,
        });
        return;
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
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-lg shadow p-8 space-y-6"
        >
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Photo *
            </label>
            <ImageUpload
              onImageSelect={handleImageSelect}
              preview={imagePreview || undefined}
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
              {...register("title")}
              type="text"
              placeholder="Enter listing title"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
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
              {...register("description")}
              placeholder="Enter listing description"
              disabled={isSubmitting}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
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
              {...register("price")}
              type="number"
              placeholder="Enter price"
              step="0.01"
              disabled={isSubmitting}
            />
            {errors.price && (
              <p className="text-sm text-red-600 mt-1">
                {errors.price.message}
              </p>
            )}
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
                    setValue("categoryId", value);
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
              {errors.categoryId && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          )}

          {/* If no subcategories, use parent */}
          {selectedParent && selectedParent.children.length === 0 && (
            <input
              type="hidden"
              value={categoryId || selectedParentId}
              onChange={() => {}}
            />
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
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
