import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@refinedev/core";
import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";

export const EditProduct = () => {
  const { onFinish, mutation, query } = useForm({
    action: "edit",
    resource: "product",
  });

  const record = query?.data?.data;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );
    onFinish({
      ...data,
    });
  };

  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (record?.isActive !== undefined) {
      setIsActive(Boolean(record.isActive));
    }
  }, [record]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Edit Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              defaultValue={record?.title}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              type="text"
              id="slug"
              name="slug"
              defaultValue={record?.slug}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="descriptionHtml"
              rows={3}
              defaultValue={record?.descriptionHtml}
              required
            />
          </div>

          <div>
            <Label htmlFor="seoTitle">seoTitle</Label>
            <Input
              type="text"
              id="seoTitle"
              name="seoTitle"
              defaultValue={record?.seoTitle}
              required
            />
          </div>

          <div>
            <Label htmlFor="seoDescription">seoDescription</Label>
            <Textarea
              id="seoDescription"
              name="seoDescription"
              rows={3}
              defaultValue={record?.seoDescription}
              required
            />
          </div>

          <div className="flex gap-3">
            <Label htmlFor="isActive">isActive</Label>
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(Boolean(checked))}
            ></Checkbox>
            <input type="hidden" name="isActive" value={String(isActive)} />
          </div>

          {mutation.isSuccess && (
            <span className="text-green-600 text-sm">
              Successfully submitted!
            </span>
          )}

          <Button type="submit" className="w-full gap-2">
            <Save className="w-4 h-4" />
            Edit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
