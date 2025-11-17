import PaginationControls from "@/components/products/PaginationControls";
import StocksTable from "@/components/products/StocksTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Variant from "@/types/variant";
import { useNavigation, useTable, useUpdate } from "@refinedev/core";
import { ArrowLeft } from "lucide-react";
import React from "react";

export const StockList = () => {
  const { list } = useNavigation();
  const updateMutation = useUpdate();
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    result: resultVariant,
    tableQuery: tableQueryVariant,
    currentPage: currentPageVariant,
    setCurrentPage: setCurrentPageVariant,
    pageCount: pageCountVariant,
    sorters: sortersVariant,
    setSorters: setSortersVariant,
  } = useTable<Variant>({
    resource: "variant",
    pagination: { currentPage: 1, pageSize: 10 },
    sorters: { initial: [{ field: "id", order: "asc" }] },
  });

  const onPreviousVariant = () =>
    currentPageVariant > 1 && setCurrentPageVariant(currentPageVariant - 1);

  const onNextVariant = () =>
    currentPageVariant < pageCountVariant &&
    setCurrentPageVariant(currentPageVariant + 1);

  const onPageVariant = (page: number) => setCurrentPageVariant(page);

  const getSorterVariant = (field: string) =>
    sortersVariant?.find((s) => s.field === field)?.order;

  const onSortVariant = (field: string) => {
    const sorter = getSorterVariant(field);
    setSortersVariant(
      sorter === "desc"
        ? []
        : [{ field, order: sorter === "asc" ? "desc" : "asc" }]
    );
  };

  const handleUpdateStock = async (
    variantId: string | number,
    newQuantity: number
  ) => {
    setUpdateLoading(true);
    setError(null);
    try {
      await updateMutation.mutateAsync({
        resource: "variant/stock",
        id: `${variantId}`,
        values: { stock: newQuantity },
      });

      await tableQueryVariant?.refetch();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      setError(errorMessage);
      console.error("Erreur mise à jour stock:", err);
      throw err;
    } finally {
      setUpdateLoading(false);
    }
  };

  const variants = resultVariant?.data || [];
  const isLoading = tableQueryVariant?.isLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => list("product")}>
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Gestion des stocks</h1>
            <p className="text-sm text-muted-foreground">
              Surveillez vos niveaux de stock et ajustez les quantités depuis
              une vue homogène.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 text-red-800">
          <CardContent className="py-4">{error}</CardContent>
        </Card>
      )}

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Niveaux de stock</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : variants.length > 0 ? (
            <StocksTable
              data={variants}
              onSort={onSortVariant}
              getSorter={getSorterVariant}
              onUpdateStock={handleUpdateStock}
              loading={updateLoading}
            />
          ) : (
            <div className="flex justify-center items-center h-40 text-muted-foreground">
              Aucune variante trouvée
            </div>
          )}
        </CardContent>
        {variants.length > 0 && (
          <CardFooter className="justify-end">
            <PaginationControls
              currentPage={currentPageVariant}
              pageCount={pageCountVariant}
              onPrevious={onPreviousVariant}
              onNext={onNextVariant}
              onPage={onPageVariant}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default StockList;
