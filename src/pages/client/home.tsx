import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronDown, ShoppingBag } from "lucide-react";
import { useList } from "@refinedev/core";
import { PageContent } from "../personalization/components/ContentTab";

// Fake data
const featuredProducts = [
  {
    id: 1,
    name: "Pistache",
    price: "26,90 €",
    quantity: "20 Shakers",
    rating: 4.5,
    reviews: 19,
    isNew: true,
    imageColor: "bg-green-100",
  },
  {
    id: 2,
    name: "Choco. Hazelnut.",
    price: "26,90 €",
    quantity: "20 Shakers",
    rating: 4.8,
    reviews: 24,
    isNew: true,
    imageColor: "bg-amber-100",
  },
  {
    id: 3,
    name: "Vanilla.",
    price: "26,90 €",
    quantity: "20 Shakers",
    rating: 4.7,
    reviews: 31,
    isNew: true,
    imageColor: "bg-yellow-50",
  },
  {
    id: 4,
    name: "Café Latte.",
    price: "26,90 €",
    quantity: "20 Shakers",
    rating: 4.6,
    reviews: 18,
    isNew: true,
    imageColor: "bg-orange-100",
  },
];

const categories = [
  { name: "SLIMMING CURES.", active: false, variant: "secondary" as const },
  { name: "PLANT PROTEINS.", active: true, variant: "default" as const },
  { name: "LIGHT RANGE.", active: false, variant: "outline" as const },
  { name: "SNACK RANGE.", active: false, variant: "outline" as const },
  { name: "PROTEINS & SPORT.", active: false, variant: "outline" as const },
  { name: "ORIGINAL RANGE.", active: false, variant: "outline" as const },
  {
    name: "LARGE FORMAT & DISCOVERY PACKS.",
    active: false,
    variant: "outline" as const,
  },
];

export const HomePage = () => {
  const {
    result: { data },
  } = useList({
    resource: "page-content",
  });

  const homeTitle =
    data && data.length > 0
      ? data.find((page) => (page as PageContent).type === "home")?.content
      : null;

  const formatContent = (text: string | null | undefined): string => {
    if (!text) return "";
    return text.replace(/\n/g, "<br />");
  };

  return (
    <div className="w-full">
      {/* Top Banner - Primary Color */}
      <div className="w-full bg-primary text-primary-foreground py-2 text-center text-sm font-medium">
        ← Hugo is gay →
      </div>

      <div className="w-full max-w-full px-4 sm:px-6 mx-auto">
        <div className="w-full max-w-7xl mx-auto space-y-8 py-8">
          {/* Category Filters */}
          <section className="flex flex-wrap gap-2 items-center">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={category.active ? "default" : category.variant}
                size="sm"
                className="text-xs font-medium uppercase"
              >
                {category.name}
                {category.variant === "outline" && (
                  <ChevronDown className="ml-1 h-3 w-3" />
                )}
              </Button>
            ))}
          </section>

          {/* Main Title */}
          <section className="text-center py-8">
            <h1
              className="text-4xl sm:text-5xl font-bold uppercase tracking-tight whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formatContent(homeTitle) }}
            />
          </section>

          {/* Products Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-0 relative">
                  {/* Product Image Area */}
                  <div
                    className={`${product.imageColor} h-64 relative flex items-center justify-center`}
                  >
                    {/* New Badge */}
                    {product.isNew && (
                      <Badge
                        variant="default"
                        className="absolute top-3 left-3 uppercase text-xs font-bold"
                      >
                        Nouveau.
                      </Badge>
                    )}
                    {/* Placeholder for product image */}
                    <div className="w-32 h-40 bg-white/50 rounded-lg shadow-md" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <CardTitle className="text-lg font-bold">
                    {product.name}
                  </CardTitle>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">{product.price}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.quantity}
                    </p>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.reviews} avis
                    </span>
                  </div>
                  {/* Add to Basket Button - Primary Color */}
                  <Button className="w-full uppercase font-medium" size="lg">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Ajouter au panier
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Features Section with Secondary Color */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <ShoppingBag className="h-5 w-5 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">Large sélection</CardTitle>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Star className="h-5 w-5 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">Qualité garantie</CardTitle>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Livraison rapide</CardTitle>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Paiement sécurisé</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};
