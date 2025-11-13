import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import Variant from "@/types/variant";
import { useForm } from "@refinedev/core";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const EditVariant: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [attributes, setAttributes] = useState(
    [] as { key: string; value: string }[]
  );
  const { id } = useParams();
  const { query, onFinish } = useForm<Variant>({
    action: "edit",
    resource: "variant",
    id: id,
  });

  const variant: Variant | undefined = query?.data?.data;

  useEffect(() => {
    if (!variant) return;
    setIsActive(Boolean(variant.isActive));
    try {
      const attrs = variant.attributesJson
        ? JSON.parse(variant.attributesJson)
        : null;
      if (attrs && typeof attrs === "object") {
        setAttributes(
          Object.entries(attrs).map(([k, v]) => ({
            key: k,
            value: String(v ?? ""),
          }))
        );
      } else {
        setAttributes([]);
      }
    } catch {
      console.warn("Can't parse attributes JSON");
      setAttributes([]);
    }
  }, [variant]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!variant) {
      alert("Variant non chargé");
      return;
    }

    // Build attributes object
    const attributesObj =
      attributes && attributes.length > 0
        ? attributes.reduce((acc, cur) => {
            if (cur.key && cur.key.trim() !== "") acc[cur.key] = cur.value;
            return acc;
          }, {} as Record<string, string>)
        : null;

    const formData = new FormData(e.currentTarget);
    const payload = {
      productId: variant.id,
      sku: String(formData.get("sku") ?? ""),
      attributesJson: attributesObj ? JSON.stringify(attributesObj) : null,
      priceAmount: Number(formData.get("priceAmount") ?? 0),
      weightGrams: Number(formData.get("weightGrams") ?? 0),
      barcode: String(formData.get("barcode") ?? ""),
      isActive,
      quantity: Number(formData.get("quantity") ?? 0),
    };

    onFinish(payload);
  };

  if (!variant) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-8">
        <Button
          variant={"outline"}
          size={"icon"}
          className="my-6"
          onClick={() => globalThis.history.back()}
        >
          <ArrowLeft />
        </Button>
        <h1>Modifier un variant de produit</h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            name="sku"
            placeholder="Taper le Stock Keeping Unit du produit"
            defaultValue={variant.sku}
          />
        </div>

        <div>
          <Label htmlFor="priceAmount">Prix</Label>
          <Input
            id="priceAmount"
            name="priceAmount"
            type={"number"}
            placeholder="Saisir le prix du/des produits"
            defaultValue={variant.priceAmount}
          />
        </div>

        <div>
          <Label htmlFor="weightGrams">Poids (g)</Label>
          <Input
            id="weightGrams"
            name="weightGrams"
            type={"number"}
            placeholder="Saisir le poids du produit"
            defaultValue={variant.weightGrams}
          />
        </div>

        <div>
          <Label htmlFor="barcode">Code Barre</Label>
          <Input
            id="barcode"
            name="barcode"
            placeholder="Saisir le code barre du produit"
            defaultValue={variant.barcode}
          />
        </div>

        <div>
          <Label htmlFor="quantity">Quantité</Label>
          <Input
            id="quantity"
            name="quantity"
            type={"number"}
            placeholder="Saisir le nombre de produits"
            defaultValue={variant.quantity}
          />
        </div>

        <div>
          <Label htmlFor="attributesJson">Attributs (type / valeur)</Label>
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

        <Button type="submit">Submit</Button>
      </form>
    </>
  );
};
