import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useSelect } from "@refinedev/core";
import { Save } from "lucide-react";
import React from "react";

export const EditProduct = () => {
  const { onFinish, mutation, query } = useForm({
    action: "edit",
    resource: "products",
  });

  const record = query?.data?.data;

  const { options } = useSelect({
    resource: "categories",
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );
    onFinish({
      ...data,
      price: Number(data.price).toFixed(2),
      category: { id: Number(data.category) },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Edit Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              defaultValue={record?.name}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={record?.description}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              name="price"
              step=".01"
              min="0"
              defaultValue={record?.price}
              required
            />
          </div>

          <div>
            <Label htmlFor="material">Material</Label>
            <Input
              type="text"
              id="material"
              name="material"
              defaultValue={record?.material}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              name="category"
              required
              defaultValue={record?.category?.id?.toString()}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {mutation.isSuccess && (
            <span className="text-green-600 text-sm">
              Successfully submitted!
            </span>
          )}

          <Button type="submit" className="w-full gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
