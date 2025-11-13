import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Product from "@/types/product";
import { PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import CategorySelect from "./CategorySelect";

type MutationLike = {
  isSuccess?: boolean;
};

type ProductFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  mutation?: MutationLike;
  defaultValues?: Partial<Product> | null;
  submitLabel?: string;
  productMode?: "create" | "existing";
  selectedProductId?: string | number | null;
};

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  mutation,
  defaultValues = null,
  submitLabel = "Submit",
  productMode = "create",
  selectedProductId = null,
}) => {
  const [isActive, setIsActive] = useState<boolean>(
    defaultValues?.isActive ?? true
  );

  const [attributes, setAttributes] = useState<
    Array<{ key: string; value: string }>
  >([]);
  useEffect(() => {
    setIsActive(defaultValues?.isActive ?? true);

    const raw = defaultValues?.attributesJson;
    if (!raw) {
      setAttributes([]);
      return;
    }
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (parsed && typeof parsed === "object") {
        const entries = Object.entries(parsed).map(([k, v]) => ({
          key: k,
          value: v == null ? "" : String(v),
        }));
        setAttributes(entries);
      } else {
        setAttributes([]);
      }
    } catch {
      setAttributes([]);
    }
  }, [defaultValues]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {defaultValues ? "Edit Product" : "Create Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {productMode !== "existing" && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={defaultValues?.title}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  type="text"
                  id="slug"
                  name="slug"
                  defaultValue={defaultValues?.slug}
                  required
                />
              </div>

              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  type="text"
                  id="sku"
                  name="sku"
                  defaultValue={defaultValues?.sku}
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="descriptionHtml">Description</Label>
            <Textarea
              id="descriptionHtml"
              name="descriptionHtml"
              rows={3}
              defaultValue={defaultValues?.descriptionHtml}
              required
            />
          </div>

          <div>
            <Label htmlFor="seoTitle">seoTitle</Label>
            <Input
              type="text"
              id="seoTitle"
              name="seoTitle"
              defaultValue={defaultValues?.seoTitle}
            />
          </div>

          <div>
            <Label htmlFor="seoDescription">seoDescription</Label>
            <Textarea
              id="seoDescription"
              name="seoDescription"
              rows={2}
              defaultValue={defaultValues?.seoDescription}
            />
          </div>

          <div>
            <Label htmlFor="attributesJson">Attributes (key / value)</Label>
            <div className="space-y-2">
              {attributes.map((a, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    placeholder="key"
                    value={a.key}
                    onChange={(e) => {
                      const next = [...attributes];
                      next[idx] = { ...next[idx], key: e.target.value };
                      setAttributes(next);
                    }}
                  />
                  <Input
                    placeholder="value"
                    value={a.value}
                    onChange={(e) => {
                      const next = [...attributes];
                      next[idx] = { ...next[idx], value: e.target.value };
                      setAttributes(next);
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      setAttributes((prev) => prev.filter((_, i) => i !== idx))
                    }
                    aria-label={`Remove attribute ${a.key || idx}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div>
                <Button
                  type="button"
                  onClick={() =>
                    setAttributes((prev) => [...prev, { key: "", value: "" }])
                  }
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Add attribute
                </Button>
              </div>
            </div>

            <input
              type="hidden"
              name="attributesJson"
              value={
                attributes && attributes.length > 0
                  ? JSON.stringify(
                      attributes.reduce((acc, cur) => {
                        if (cur.key && cur.key.trim() !== "")
                          acc[cur.key] = cur.value;
                        return acc;
                      }, {} as Record<string, string>)
                    )
                  : ""
              }
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <CategorySelect
              name="categories"
              defaultValue={
                defaultValues?.categories
                  ? String(defaultValues.categories)
                  : undefined
              }
              allowEmpty
            />
            {productMode === "existing" && (
              <input
                type="hidden"
                name="productId"
                value={selectedProductId ?? ""}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                defaultValue={defaultValues?.quantity?.toString?.()}
              />
            </div>
            <div>
              <Label htmlFor="priceAmount">Price</Label>
              <Input
                type="number"
                step="0.01"
                id="priceAmount"
                name="priceAmount"
                defaultValue={defaultValues?.priceAmount?.toString?.()}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Label htmlFor="isActive">isActive</Label>
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(Boolean(checked))}
            />
            <input type="hidden" name="isActive" value={String(isActive)} />
          </div>

          {mutation?.isSuccess && (
            <span className="text-green-600 text-sm">
              Successfully submitted!
            </span>
          )}

          <Button type="submit" className="w-full gap-2">
            <PlusCircle className="w-4 h-4" />
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
