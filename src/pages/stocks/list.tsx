import PaginationControls from "@/components/products/PaginationControls";
import StocksTable from "@/components/products/StocksTable";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Variant from "@/types/variant";
import { useNavigation, useTable, useUpdate } from "@refinedev/core";
import { ArrowLeft } from "lucide-react";
import React, { useMemo } from "react";

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
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      setError(errorMessage);
      console.error("Erreur mise à jour stock:", err);
      throw err;
    } finally {
      setUpdateLoading(false);
    }
  };

  const variants = resultVariant?.data || [];
  const isLoading = tableQueryVariant?.isLoading;

  // Summary stats
  const LOW_STOCK_THRESHOLD = 10;
  const stats = useMemo(() => {
    let totalStock = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const v of variants) {
      const q = Number(v.quantity ?? 0);
      totalStock += q;
      if (q <= 0) outOfStockCount++;
      else if (q <= LOW_STOCK_THRESHOLD) lowStockCount++;
    }

    return { totalStock, lowStockCount, outOfStockCount };
  }, [variants]);

  return (
    <div className="w-full max-w-full px-2 sm:px-6 mx-auto">
      {/* Summary blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border border-white bg-transparent rounded-md">
          <div className="text-sm text-gray-500">Stock total</div>
          <div className="text-2xl font-semibold text-white-900">{stats.totalStock}</div>
        </div>

        <div className="p-4 border border-white bg-transparent rounded-md">
          <div className="text-sm text-gray-500">Articles à stock faible (≤ {LOW_STOCK_THRESHOLD})</div>
          <div className="text-2xl font-semibold text-orange-600">{stats.lowStockCount}</div>
        </div>

        <div className="p-4 border border-white bg-transparent rounded-md">
          <div className="text-sm text-gray-500">Ruptures de stock</div>
          <div className="text-2xl font-semibold text-red-600">{stats.outOfStockCount}</div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      )}

      {!isLoading && variants.length > 0 ? (
        <>
          <StocksTable
            data={variants}
            onSort={onSortVariant}
            getSorter={getSorterVariant}
            onUpdateStock={handleUpdateStock}
            loading={updateLoading}
          />

          <PaginationControls
            currentPage={currentPageVariant}
            pageCount={pageCountVariant}
            onPrevious={onPreviousVariant}
            onNext={onNextVariant}
            onPage={onPageVariant}
          />
        </>
      ) : (
        !isLoading && (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Aucune variante trouvée</p>
          </div>
        )
      )}
    </div>
  );
};

export default StockList;