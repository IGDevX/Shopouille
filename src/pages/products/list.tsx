import PaginationControls from "@/components/products/PaginationControls";
import ProductsTable from "@/components/products/ProductsTable";
import { Spinner } from "@/components/ui/spinner";
import Product from "@/types/product";
import { useDelete, useNavigation, useTable } from "@refinedev/core";

export const ListProducts = () => {
  const { edit, show } = useNavigation();
  const deleteMutation = useDelete();

  const {
    result: resultProduct,
    tableQuery: tableQueryProduct,
    currentPage: currentPageProducts,
    setCurrentPage: setCurrentPageProducts,
    pageCount: pageCountProducts,
    sorters: sortersProduct,
    setSorters: setSortersProduct,
  } = useTable<Product>({
    resource: "product",
    pagination: { currentPage: 1, pageSize: 10 },
    sorters: { initial: [{ field: "id", order: "asc" }] },
  });

  const onPreviousProducts = () =>
    currentPageProducts > 1 && setCurrentPageProducts(currentPageProducts - 1);
  const onNextProducts = () =>
    currentPageProducts < pageCountProducts &&
    setCurrentPageProducts(currentPageProducts + 1);
  const onPageProducts = (page: number) => setCurrentPageProducts(page);

  const getSorterProduct = (field: string) =>
    sortersProduct?.find((s) => s.field === field)?.order;
  const onSortProduct = (field: string) => {
    const sorter = getSorterProduct(field);
    setSortersProduct(
      sorter === "desc"
        ? []
        : [{ field, order: sorter === "asc" ? "desc" : "asc" }]
    );
  };

  const onDeleteProduct = (id?: number | string) => {
    if (id === undefined) return;
    if (!confirm("Delete this product ?")) return;
    deleteMutation.mutate(
      { resource: "product", id },
      { onSuccess: () => tableQueryProduct?.refetch() }
    );
  };

  if (tableQueryProduct?.isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-2 sm:px-6 mx-auto">
      {resultProduct?.data?.length ? (
        <>
          <ProductsTable
            data={resultProduct.data}
            onSort={onSortProduct}
            getSorter={getSorterProduct}
            edit={edit}
            show={show}
            onDelete={onDeleteProduct}
          />
          <PaginationControls
            currentPage={currentPageProducts}
            pageCount={pageCountProducts}
            onPrevious={onPreviousProducts}
            onNext={onNextProducts}
            onPage={onPageProducts}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-40">
          No products found
        </div>
      )}
    </div>
  );
};
