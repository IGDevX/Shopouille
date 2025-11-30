import PaginationControls from "@/components/products/PaginationControls";
import VariantsTable from "@/components/products/VariantsTable";
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant={"outline"} size={"icon"} onClick={() => list("product")}>
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Variantes du produit</h1>
            <p className="text-muted-foreground text-sm">
              Visualisez et gérez les déclinaisons associées.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => productId && edit("product", productId)}
          disabled={!productId}
        >
          Modifier le produit
        </Button>
      </div>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Variantes</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {resultVariant?.data?.length ? (
            <VariantsTable
              data={resultVariant.data}
              onSort={onSortVariant}
              getSorter={getSorterVariant}
              edit={edit}
              onDelete={onDeleteVariant}
            />
          ) : (
            <div className="flex justify-center items-center h-40">
              No variants found
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end">
          <PaginationControls
            currentPage={currentPageVariant}
            pageCount={pageCountVariant}
            onPrevious={onPreviousVariant}
            onNext={onNextVariant}
            onPage={onPageVariant}
          />
        </CardFooter>
      </Card>
    </div>
  );
};
