import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Product from "@/types/product";
import Variant from "@/types/variant";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useForm, useSelect } from "@refinedev/core";
import { Plus, PlusCircle, Trash2 } from "lucide-react";
import React, { useState } from "react";

export const CreateProduct: React.FC = () => {
  const [isActive, setIsActive] = useState<CheckedState>(false);
  const [valuesProduct, setValuesProduct] = useState<Product>({} as Product);
  const [valuesVariant, setValuesVariant] = useState<Variant>({} as Variant);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [creatingNewProduct, setCreatingNewProduct] = useState(false);
  const [attributes, setAttributes] = useState(
    [] as { key: string; value: string }[]
  );

  const { onFinish: onFinishProduct } = useForm({
    action: "create",
    resource: "product",
  });
  const { onFinish: onFinishVariant } = useForm({
    action: "create",
    resource: "variant",
  });
  const { options } = useSelect({
    resource: "product",
    optionLabel: "title",
    optionValue: "id",
    pagination: { currentPage: 1, pageSize: -1 },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let productId: string = "";
    if (creatingNewProduct) {
      const res = await Promise.resolve(onFinishProduct(valuesProduct));
      if (res) {
        productId = String(res.data);
      }
    }
    const attributesObj =
      attributes && attributes.length > 0
        ? JSON.stringify(
            attributes.reduce((acc, cur) => {
              if (cur.key && cur.key.trim() !== "") acc[cur.key] = cur.value;
              return acc;
            }, {} as Record<string, string>)
          )
        : null;

    onFinishVariant({
      productId: creatingNewProduct
        ? Number(productId)
        : Number(selectedProduct),
      sku: valuesVariant.sku || "",
      attributesJson: attributesObj ? JSON.stringify(attributesObj) : null,
      priceAmount: valuesVariant.priceAmount || 0,
      weightGrams: valuesVariant.weightGrams || 0,
      barcode: valuesVariant.barcode || "",
      isActive: isActive === true,
      quantity: valuesVariant.quantity || 0,
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <Select
          value={selectedProduct}
          onValueChange={(v) => setSelectedProduct(v)}
          disabled={creatingNewProduct}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Produits</SelectLabel>
              {options?.map((opt) => (
                <SelectItem key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          type="button"
          onClick={() => setCreatingNewProduct((p) => !p)}
          variant={creatingNewProduct ? "destructive" : "outline"}
        >
          <Plus className="w-4 h-4 mr-2" />
          {creatingNewProduct
            ? "Annuler le nouveau produit"
            : "Créer un nouveau produit"}
        </Button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {creatingNewProduct && (
          <>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={valuesProduct.title || ""}
                onChange={(e) =>
                  setValuesProduct({ ...valuesProduct, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                type="text"
                id="slug"
                name="slug"
                value={valuesProduct.slug || ""}
                onChange={(e) =>
                  setValuesProduct({ ...valuesProduct, slug: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="descriptionHtml">Description</Label>
              <Textarea
                id="descriptionHtml"
                name="descriptionHtml"
                rows={3}
                value={valuesProduct.descriptionHtml || ""}
                onChange={(e) =>
                  setValuesProduct({
                    ...valuesProduct,
                    descriptionHtml: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="seoTitle">seoTitle</Label>
              <Input
                type="text"
                id="seoTitle"
                name="seoTitle"
                value={valuesProduct.seoTitle || ""}
                onChange={(e) =>
                  setValuesProduct({
                    ...valuesProduct,
                    seoTitle: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="seoDescription">seoDescription</Label>
              <Textarea
                id="seoDescription"
                name="seoDescription"
                rows={2}
                value={valuesProduct.seoDescription || ""}
                onChange={(e) =>
                  setValuesProduct({
                    ...valuesProduct,
                    seoDescription: e.target.value,
                  })
                }
              />
            </div>
            {/* <div>
              <Label htmlFor="category">Category</Label>
              <CategorySelect
                name="categories"
                defaultValue={valuesProduct.categories || []}
                allowEmpty
                onValueChange={(v) =>
                  setValuesProduct({ ...valuesProduct, categories: v })
                }
              />
            </div> */}
          </>
        )}

        <input type="hidden" name="productId" value={selectedProduct || ""} />

        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            name="sku"
            value={valuesVariant.sku || ""}
            onChange={(e) =>
              setValuesVariant({ ...valuesVariant, sku: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="weightGrams">Weight (g)</Label>
          <Input
            type="number"
            id="weightGrams"
            name="weightGrams"
            value={valuesVariant.weightGrams || 0}
            onChange={(e) =>
              setValuesVariant({
                ...valuesVariant,
                weightGrams: Number(e.target.value),
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            type="text"
            id="barcode"
            name="barcode"
            value={valuesVariant.barcode || ""}
            onChange={(e) =>
              setValuesVariant({
                ...valuesVariant,
                barcode: e.target.value,
              })
            }
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              type="number"
              id="quantity"
              name="quantity"
              value={valuesVariant.quantity || 0}
              onChange={(e) =>
                setValuesVariant({
                  ...valuesVariant,
                  quantity: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="priceAmount">Price</Label>
            <Input
              type="number"
              step="0.01"
              id="priceAmount"
              name="priceAmount"
              value={valuesVariant.priceAmount || 0}
              onChange={(e) =>
                setValuesVariant({
                  ...valuesVariant,
                  priceAmount: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Label htmlFor="isActive">isActive</Label>
          <Checkbox
            id="isActive"
            checked={isActive === true}
            onCheckedChange={(checked) => setIsActive(checked)}
          />
          <input type="hidden" name="isActive" value={String(isActive)} />
        </div>

        <Button type="submit" className="w-full gap-2">
          <PlusCircle className="w-4 h-4" />
          Créer
        </Button>
      </form>
    </div>
  );
};
