import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type Category from "@/types/category";
import type { Product } from "@/types/product";
import { useList } from "@refinedev/core";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";
import { PageContent } from "../personalization/components/ContentTab";
import { Link } from "react-router";

const accentColors = [
  "bg-green-100",
  "bg-amber-100",
  "bg-yellow-50",
  "bg-orange-100",
  "bg-rose-100",
  "bg-blue-100",
];

const stripHtml = (html?: string) =>
  html
    ? html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

const getProductDescription = (product: Product) => {
  const content =
    product.seoDescription?.trim() || stripHtml(product.descriptionHtml);

  if (!content) {
    return "Description disponible prochainement.";
  }

  return content.length > 120 ? `${content.slice(0, 120)}…` : content;
};

export const HomePage = () => {
  const {
    result: { data },
  } = useList({
    resource: "page-content",
  });

  const { result: categoriesResult, query: categoriesQuery } =
    useList<Category>({
      resource: "category",
      pagination: {
        pageSize: 50,
      },
      sorters: [{ field: "name", order: "asc" }],
    });

  const categories = categoriesResult?.data ?? [];
  const isLoadingCategories = categoriesQuery?.isLoading;

  const {
    result: productsResult,
    query: {
      isLoading: isLoadingProducts,
      isError: isErrorProducts,
      isFetching: isFetchingProducts,
    } = {},
  } = useList<Product>({
    resource: "product",
    pagination: {
      pageSize: 4,
    },
    sorters: [{ field: "title", order: "asc" }],
  });

  const products = productsResult?.data ?? [];

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
      <div className="w-full max-w-full px-4 sm:px-6 mx-auto">
        <div className="w-full max-w-7xl mx-auto space-y-8 py-8">
          {/* Category Filters */}
          <section className="flex flex-wrap gap-2 items-center justify-center text-center">
            {isLoadingCategories ? (
              <span className="text-xs font-medium uppercase text-muted-foreground">
                Chargement des catégories…
              </span>
            ) : categories.length === 0 ? (
              <span className="text-xs font-medium uppercase text-muted-foreground">
                Aucune catégorie disponible
              </span>
            ) : (
              categories.map((category, index) => {
                const variant = index === 0 ? "default" : "outline";

                return (
                  <Button
                    key={String(category.id ?? category.name)}
                    variant={variant}
                    size="sm"
                    className="text-xs font-medium uppercase"
                    asChild
                  >
                    <Link
                      to={
                        category.id !== undefined
                          ? `/catalogue?categoryId=${encodeURIComponent(
                              String(category.id)
                            )}`
                          : "/catalogue"
                      }
                    >
                      {category.name}
                    </Link>
                  </Button>
                );
              })
            )}
          </section>

          {/* Main Title */}
          <section className="text-center py-8">
            <h1
              className="text-4xl sm:text-5xl font-bold uppercase tracking-tight whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formatContent(homeTitle) }}
            />
          </section>

          {/* Products Grid */}
          <section>
            {isLoadingProducts || isFetchingProducts ? (
              <div className="flex justify-center items-center h-64">
                <Spinner className="text-primary" />
              </div>
            ) : isErrorProducts ? (
              <Card>
                <CardContent className="py-10 text-center space-y-2">
                  <p className="text-lg font-semibold">
                    Impossible de charger les produits
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Veuillez réessayer plus tard.
                  </p>
                </CardContent>
              </Card>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center space-y-2">
                  <p className="text-lg font-semibold">
                    Aucun produit disponible pour le moment
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Revenez bientôt pour découvrir notre sélection.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/catalogue/${product.id}`}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-primary rounded-3xl"
                  >
                    <Card className="overflow-hidden flex flex-col transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                      <CardHeader className="p-0">
                        <div
                          className={`${
                            accentColors[index % accentColors.length]
                          } h-52 relative flex items-center justify-center`}
                        >
                          <Badge
                            variant="default"
                            className="absolute top-3 left-3 uppercase text-xs font-semibold"
                          >
                            {product.slug}
                          </Badge>
                          <div className="w-32 h-40 bg-white/50 rounded-lg shadow-md" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 flex flex-col gap-4 flex-1">
                        <div className="space-y-2">
                          <CardTitle className="text-xl font-bold uppercase tracking-tight">
                            {product.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {getProductDescription(product)}
                          </p>
                        </div>
                        <div className="mt-auto flex items-center justify-between text-sm font-semibold uppercase text-primary">
                          <span>Voir le produit</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
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
