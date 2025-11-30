import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type Category from "@/types/category";
import { Product } from "@/types/product";
import { CrudFilters, useList } from "@refinedev/core";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router";

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

  return content.length > 140 ? `${content.slice(0, 140)}…` : content;
};

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryParam = searchParams.get("categoryId");
  const selectedCategoryId = selectedCategoryParam
    ? (selectedCategoryParam as Category["id"])
    : null;
  const searchParam = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState(searchParam);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const filters: CrudFilters = [
    {
      field: "q",
      operator: "eq",
      value: searchParam.trim(),
    },
  ];
  if (selectedCategoryId) {
    filters.push({
      field: "categoryId",
      operator: "eq",
      value: String(selectedCategoryId),
    });
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    const trimmedValue = searchInput.trim();

    if (trimmedValue) {
      nextParams.set("q", trimmedValue);
    } else {
      nextParams.delete("q");
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleSearchReset = () => {
    setSearchInput("");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("q");
    setSearchParams(nextParams, { replace: true });
  };

  const handleCategorySelect = (categoryId: Category["id"] | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (categoryId === null) {
      nextParams.delete("categoryId");
    } else {
      nextParams.set("categoryId", String(categoryId));
    }
    setSearchParams(nextParams, { replace: true });
  };
  const {
    result,
    query: { isLoading, isError, isFetching },
  } = useList<Product>({
    resource: "product/search",
    sorters: [{ field: "title", order: "asc" }],
    pagination: {
      pageSize: 50,
    },
    filters,
  });

  const products = result?.data ?? [];

  const {
    result: categoriesResult,
    query: { isLoading: isLoadingCategories } = {},
  } = useList<Category>({
    resource: "category",
    pagination: { pageSize: 50 },
    sorters: [{ field: "name", order: "asc" }],
  });

  const categories = categoriesResult?.data ?? [];

  return (
    <div className="w-full">
      <div className="w-full max-w-full px-4 sm:px-6 mx-auto">
        <div className="w-full max-w-7xl mx-auto space-y-8 py-8">
          <section className="text-center space-y-3 py-4">
            <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight">
              La collection Shopouille
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Découvrez l&apos;ensemble de nos produits. Une sélection pensée
              pour répondre à toutes vos envies bien-être, gourmandise et
              performance.
            </p>
          </section>

          <section className="max-w-2xl mx-auto w-full">
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={handleSearchSubmit}
            >
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Rechercher un produit"
                className="flex-1"
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:w-auto">
                <Button type="submit" className="w-full sm:flex-initial">
                  Rechercher
                </Button>
                {searchParam && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSearchReset}
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
            </form>
          </section>

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
              <>
                <Button
                  key="all"
                  variant={selectedCategoryId === null ? "default" : "outline"}
                  size="sm"
                  className="text-xs font-medium uppercase"
                  onClick={() => handleCategorySelect(null)}
                >
                  Toutes les catégories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={String(category.id ?? category.name)}
                    variant={
                      selectedCategoryId !== null &&
                      String(selectedCategoryId) === String(category.id)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="text-xs font-medium uppercase"
                    onClick={() =>
                      handleCategorySelect(
                        selectedCategoryId !== null &&
                          String(selectedCategoryId) === String(category.id)
                          ? null
                          : category.id
                      )
                    }
                  >
                    {category.name}
                  </Button>
                ))}
              </>
            )}
          </section>

          <section>
            {isLoading || isFetching ? (
              <div className="flex justify-center items-center h-64">
                <Spinner className="text-primary" />
              </div>
            ) : isError ? (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </div>
    </div>
  );
};
