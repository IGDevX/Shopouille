import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Product } from "@/types/product";
import type Variant from "@/types/variant";
import { useList, useOne } from "@refinedev/core";
import {
  ArrowLeft,
  Beer,
  CheckCircle2,
  Droplets,
  Leaf,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { useState, useEffect, useMemo } from "react";

const fallbackDescription =
  "La description de ce produit sera bientôt disponible. Revenez très vite !";

const mockImageUrl =
  "https://boutique.breizh-odyssee.bzh/2012-thickbox_default/coreff-blonde.jpg";

type ProductTab = "advantages" | "ingredients" | "usage";

const accentColors = [
  "bg-green-100",
  "bg-amber-100",
  "bg-yellow-50",
  "bg-orange-100",
  "bg-rose-100",
  "bg-blue-100",
];

export const ProductPage = () => {
  const { productId } = useParams<{ productId?: string }>();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<ProductTab>("advantages");

  const {
    query: { isLoading, isError, isFetching },
    result,
  } = useOne<Product>({
    resource: "product",
    id: productId ?? "",
    queryOptions: {
      enabled: Boolean(productId),
    },
  });

  const {
    result: variantsResult,
    query: { isLoading: isLoadingVariants },
  } = useList<Variant>({
    resource: "variant/product",
    filters: [{ field: "productId", operator: "eq", value: productId ?? "" }],
    pagination: { pageSize: 50 },
    sorters: [{ field: "priceAmount", order: "asc" }],
    queryOptions: {
      enabled: Boolean(productId),
    },
  });

  const variants = useMemo(
    () => variantsResult?.data ?? [],
    [variantsResult?.data]
  );

  // Auto-select first variant
  useEffect(() => {
    if (variants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(String(variants[0].id));
    }
  }, [variants, selectedVariantId]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleQuantityInput = (value: string) => {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue) || numericValue < 1) {
      setQuantity(1);
      return;
    }
    setQuantity(Math.floor(numericValue));
  };

  const selectedVariant = useMemo(
    () => variants.find((variant) => String(variant.id) === selectedVariantId),
    [variants, selectedVariantId]
  );

  const variantAccentIndex = useMemo(() => {
    if (!selectedVariant) return 0;
    const index = variants.findIndex(
      (variant) => String(variant.id) === selectedVariantId
    );
    return index >= 0 ? index % accentColors.length : 0;
  }, [variants, selectedVariant, selectedVariantId]);

  const formatPrice = (price?: number) =>
    typeof price === "number"
      ? new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 2,
        }).format(price / 100)
      : "Prix sur demande";

  const displayPrice = useMemo(() => {
    if (!selectedVariant?.priceAmount) return "Prix sur demande";
    const total = selectedVariant.priceAmount * quantity;
    return formatPrice(total);
  }, [selectedVariant?.priceAmount, quantity]);

  const parseAttributes = (attributesJson?: string) => {
    if (!attributesJson) return {};
    try {
      return JSON.parse(attributesJson) as Record<string, string>;
    } catch {
      return {};
    }
  };

  if (!productId) {
    return (
      <div className="w-full px-4 sm:px-6 mx-auto py-10">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-lg font-semibold">
              Produit introuvable sans identifiant
            </p>
            <Button asChild variant="secondary">
              <Link to="/catalogue">Retour au catalogue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || isFetching || isLoadingVariants) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="text-primary" />
      </div>
    );
  }

  if (isError || !result) {
    return (
      <div className="w-full px-4 sm:px-6 mx-auto py-10">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-lg font-semibold">
              Ce produit n&apos;est plus disponible
            </p>
            <p className="text-sm text-muted-foreground">
              Il a peut-être été retiré du catalogue ou l&apos;identifiant est
              incorrect.
            </p>
            <Button asChild variant="secondary">
              <Link to="/catalogue">Retour au catalogue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const product = result;
  const attributes = selectedVariant
    ? parseAttributes(selectedVariant.attributesJson)
    : {};
  const tabList: Array<{ id: ProductTab; label: string }> = [
    { id: "advantages", label: "Avantages" },
    { id: "ingredients", label: "Ingrédients" },
    { id: "usage", label: "Utilisation" },
  ];
  const ingredientList = [
    "Eau de source filtrée",
    "Malts d'orge caramélisés",
    "Houblons bretons sélectionnés",
    "Levures artisanales",
  ];
  const usageSteps = [
    "Servir entre 6 °C et 8 °C pour révéler tous les arômes.",
    "Verser doucement en inclinant le verre pour préserver la mousse.",
    "Accompagner de tapas, fromages affinés ou desserts chocolatés.",
  ];
  const qualityBadges = [
    { icon: Beer, label: "Brassage artisanal" },
    { icon: Leaf, label: "Ingrédients naturels" },
    { icon: Droplets, label: "Sans additif" },
    { icon: CheckCircle2, label: "Vegan friendly" },
    { icon: Package, label: "Made in France" },
  ];
  const heroHighlights = [
    {
      icon: Beer,
      title: "Houblon breton",
      description: "Profil malté, notes caramélisées",
    },
    {
      icon: Leaf,
      title: "Ingrédients naturels",
      description: "Sans arômes artificiels ni conservateurs",
    },
    {
      icon: Package,
      title: "Brassage local",
      description: "Production artisanale en petite série",
    },
  ];
  const renderTabContent = () => {
    switch (activeTab) {
      case "ingredients":
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Une recette courte et lisible, pensée pour mettre en valeur les
              céréales françaises et le travail de fermentation.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
              {ingredientList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        );
      case "usage":
        return (
          <div className="space-y-4 text-muted-foreground">
            {usageSteps.map((step) => (
              <p key={step}>{step}</p>
            ))}
          </div>
        );
      default:
        return (
          <div className="space-y-4 text-muted-foreground">
            <p>{product.seoDescription?.trim() || fallbackDescription}</p>
            <p>
              Brassée en petite série, cette cuvée développe des notes de
              caramel et de noisette, équilibrées par une amertume légère et une
              finale sèche.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="px-2">
            <Link to="/catalogue" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au catalogue
            </Link>
          </Button>
        </div>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            <div
              className={`${accentColors[variantAccentIndex]} rounded-2xl overflow-hidden aspect-square flex items-center justify-center transition-colors`}
            >
              <img
                src={mockImageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => {
                const accentIndex =
                  (variantAccentIndex + i + 1) % accentColors.length;
                return (
                  <div
                    key={i}
                    className={`${accentColors[accentIndex]} rounded-lg aspect-square cursor-pointer hover:opacity-80 transition-opacity`}
                  />
                );
              })}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge variant="secondary" className="uppercase text-xs">
                {product.slug}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {product.title}
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                {product.seoDescription?.trim() || fallbackDescription}
              </p>
            </div>

            {/* Price */}
            {selectedVariant && (
              <div className="py-4 border-y">
                <p className="text-3xl font-bold">
                  {formatPrice(selectedVariant.priceAmount)}
                </p>
                {selectedVariant.weightGrams && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedVariant.weightGrams}g
                  </p>
                )}
              </div>
            )}

            {/* Features */}
            <div className="space-y-3">
              {heroHighlights.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Variants Selection */}
            {variants.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Format :{" "}
                  {Object.entries(attributes)
                    .map(([, value]) => value)
                    .join(", ") || "Standard"}
                </Label>
                <RadioGroup
                  value={selectedVariantId ?? ""}
                  onValueChange={(val) => setSelectedVariantId(val)}
                  className="flex flex-wrap gap-3"
                >
                  {variants.map((variant) => {
                    const variantAttrs = parseAttributes(
                      variant.attributesJson
                    );
                    const label =
                      Object.values(variantAttrs).join(" ") || variant.sku;
                    return (
                      <div key={variant.id}>
                        <RadioGroupItem
                          value={String(variant.id)}
                          id={`variant-${variant.id}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`variant-${variant.id}`}
                          className="flex items-center justify-center px-4 py-2 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50 transition-colors"
                        >
                          <span className="text-sm font-medium">{label}</span>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            {/* Quantity & CTA */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <Label htmlFor="quantity" className="font-semibold">
                  Quantité
                </Label>
                <div className="flex items-center border rounded-lg">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    className="px-3 py-2 hover:bg-muted"
                    aria-label="Réduire la quantité"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) =>
                      handleQuantityInput(event.target.value)
                    }
                    className="w-16 text-center border-x py-2"
                  />
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    className="px-3 py-2 hover:bg-muted"
                    aria-label="Augmenter la quantité"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button asChild size="lg" className="w-full">
                <Link
                  to={`/contact?product=${encodeURIComponent(
                    product.slug
                  )}&variant=${encodeURIComponent(
                    selectedVariant?.sku ?? ""
                  )}&quantity=${quantity}`}
                  className="inline-flex items-center gap-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Ajouter au panier - {displayPrice}
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Livraison sous 5 à 7 jours ouvrés
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 space-y-8">
          <div className="border-b">
            <div
              className="flex gap-8"
              role="tablist"
              aria-label="Détails produit"
            >
              {tabList.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-8">
            {product.descriptionHtml && activeTab === "advantages" ? (
              <article
                className="prose prose-lg max-w-none prose-headings:font-semibold prose-p:text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: product.descriptionHtml,
                }}
              />
            ) : (
              renderTabContent()
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center pt-4">
              {qualityBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="space-y-2">
                  <div className="flex justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
