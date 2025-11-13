import PaginationControls from "@/components/products/PaginationControls";
import VariantsTable from "@/components/products/VariantsTable";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Variant from "@/types/variant";
import { useDelete, useNavigation, useTable } from "@refinedev/core";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router";

export const ShowProduct = () => {
  const { id: productId } = useParams<{ id?: string }>();

  const { edit, list } = useNavigation();
  const deleteMutation = useDelete();

  const {
    result: resultVariant,
    tableQuery: tableQueryVariant,
    currentPage: currentPageVariant,
    setCurrentPage: setCurrentPageVariant,
    pageCount: pageCountVariant,
    sorters: sortersVariant,
    setSorters: setSortersVariant,
  } = useTable<Variant>({
    resource: "variant/product",
    pagination: { currentPage: 1, pageSize: 10 },
    sorters: { initial: [{ field: "id", order: "asc" }] },
    filters: {
      initial: [
        { field: "productId", operator: "eq", value: Number(productId) },
      ],
    },
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

  const onDeleteVariant = (id?: number | string) => {
    if (id === undefined) return;
    if (!confirm("Delete this variant ?")) return;
    deleteMutation.mutate(
      { resource: "variant", id },
      { onSuccess: () => tableQueryVariant?.refetch() }
    );
  };

  if (tableQueryVariant?.isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-2 sm:px-6 mx-auto">
      <div className="flex items-center gap-8">
        <Button
          variant={"outline"}
          size={"icon"}
          className="my-6"
          onClick={() => list("product")}
        >
          <ArrowLeft></ArrowLeft>
        </Button>
        <h1>Product Title</h1>
      </div>
      {resultVariant?.data?.length ? (
        <>
          <VariantsTable
            data={resultVariant.data}
            onSort={onSortVariant}
            getSorter={getSorterVariant}
            edit={edit}
            onDelete={onDeleteVariant}
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
        <div className="flex justify-center items-center h-40">
          No variants found
        </div>
      )}
    </div>
  );
};
