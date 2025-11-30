import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Nouveau produit
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Configurez un produit ou ajoutez une variante à partir d&apos;un
          catalogue existant via une interface plus claire, inspirée des
          onglets de personnalisation.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-3">
            <CardTitle>Source du produit</CardTitle>
            <p className="text-muted-foreground text-sm">
              Sélectionnez un produit existant ou créez-en un nouveau avant de
              définir la variante.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <Label className="mb-2 inline-block">Catalogue</Label>
              <Select
                value={selectedProduct}
                onValueChange={(v) => setSelectedProduct(v)}
                disabled={creatingNewProduct}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un produit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Produits</SelectLabel>
                    {options?.map((opt) => (
                      <SelectItem
                        key={String(opt.value)}
                        value={String(opt.value)}
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={() => {
                setCreatingNewProduct((p) => !p);
                if (creatingNewProduct) {
                  setValuesProduct({} as Product);
                }
              }}
              variant={creatingNewProduct ? "destructive" : "outline"}
              className="w-full lg:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              {creatingNewProduct
                ? "Annuler le nouveau produit"
                : "Créer un nouveau produit"}
            </Button>
          </CardContent>
        </Card>

        {creatingNewProduct && (
          <Card>
            <CardHeader>
              <CardTitle>Informations produit</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
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
              <div className="space-y-2">
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
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="descriptionHtml">Description</Label>
                <Textarea
                  id="descriptionHtml"
                  name="descriptionHtml"
                  rows={4}
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
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
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
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  name="seoDescription"
                  rows={3}
                  value={valuesProduct.seoDescription || ""}
                  onChange={(e) =>
                    setValuesProduct({
                      ...valuesProduct,
                      seoDescription: e.target.value,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        <input type="hidden" name="productId" value={selectedProduct || ""} />

        <Card>
          <CardHeader>
            <CardTitle>Configuration de la variante</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="barcode">Code-barres</Label>
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
            <div className="space-y-2">
              <Label htmlFor="weightGrams">Poids (g)</Label>
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
            <div className="space-y-2">
              <Label htmlFor="priceAmount">Prix</Label>
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
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité</Label>
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
            <div className="space-y-2">
              <Label htmlFor="isActive">Statut</Label>
              <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
                <Checkbox
                  id="isActive"
                  checked={isActive === true}
                  onCheckedChange={(checked) => setIsActive(checked)}
                />
                <span className="text-sm text-muted-foreground">
                  {isActive ? "Visible en boutique" : "Masqué"}
                </span>
              </div>
              <input type="hidden" name="isActive" value={String(isActive)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attributs personnalisés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {attributes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Ajoutez des paires clé / valeur pour enrichir la fiche
                  produit.
                </p>
              )}
              {attributes.map((a, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center"
                >
                  <Input
                    placeholder="Clé (ex: couleur)"
                    value={a.key}
                    onChange={(e) => {
                      const next = [...attributes];
                      next[idx] = { ...next[idx], key: e.target.value };
                      setAttributes(next);
                    }}
                  />
                  <Input
                    placeholder="Valeur (ex: bleu)"
                    value={a.value}
                    onChange={(e) => {
                      const next = [...attributes];
                      next[idx] = { ...next[idx], value: e.target.value };
                      setAttributes(next);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setAttributes((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setAttributes((prev) => [...prev, { key: "", value: "" }])
              }
              className="w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Ajouter un attribut
            </Button>

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
          </CardContent>
        </Card>

        <Button type="submit" className="w-full gap-2">
          <PlusCircle className="w-4 h-4" />
          Créer
        </Button>
      </form>
    </div>
  );
};
