import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDelete, useNavigation, useTable } from "@refinedev/core";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";

export const ListProducts = () => {
  const {
    result,
    tableQuery,
    currentPage,
    setCurrentPage,
    pageCount,
    sorters,
    setSorters,
  } = useTable({
    resource: "product",
    pagination: { currentPage: 1, pageSize: 10 },
    sorters: { initial: [{ field: "id", order: "asc" }] },
  });

  const isLoading = tableQuery?.isLoading;
  const { edit } = useNavigation();
  const deleteMutation = useDelete();

  const onPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onNext = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onPage = (page: number) => {
    setCurrentPage(page);
  };

  const getSorter = (field: string) => {
    const sorter = sorters?.find((sorter) => sorter.field === field);
    if (sorter) {
      return sorter.order;
    }
  };

  const onDelete = (id?: number | string) => {
    if (id === undefined) return;
    if (!confirm("Delete this product ?")) return;

    deleteMutation.mutate(
      {
        resource: "product",
        id,
      },
      {
        onSuccess: () => {
          tableQuery?.refetch();
        },
        onError: (error) => {
          console.error("Delete failed", error);
        },
      }
    );
  };

  const onSort = (field: string) => {
    const sorter = getSorter(field);
    setSorters(
      sorter === "desc"
        ? []
        : [
            {
              field,
              order: sorter === "asc" ? "desc" : "asc",
            },
          ]
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">Loading...</div>
    );
  }

  if (!result?.data) {
    return (
      <div className="flex justify-center items-center h-40">No data found</div>
    );
  }

  return (
    <div className="w-full max-w-full px-2 sm:px-6 mx-auto">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Products</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          <div className="w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => onSort("id")}
                    className="cursor-pointer select-none whitespace-nowrap"
                  >
                    ID{" "}
                    {getSorter("id") === "asc" && (
                      <ArrowUp className="inline w-4 h-4" />
                    )}
                    {getSorter("id") === "desc" && (
                      <ArrowDown className="inline w-4 h-4" />
                    )}
                  </TableHead>
                  <TableHead
                    onClick={() => onSort("title")}
                    className="cursor-pointer select-none whitespace-nowrap"
                  >
                    Title{" "}
                    {getSorter("title") === "asc" && (
                      <ArrowUp className="inline w-4 h-4" />
                    )}
                    {getSorter("title") === "desc" && (
                      <ArrowDown className="inline w-4 h-4" />
                    )}
                  </TableHead>
                  <TableHead
                    onClick={() => onSort("slug")}
                    className="cursor-pointer select-none whitespace-nowrap"
                  >
                    Slug{" "}
                    {getSorter("slug") === "asc" && (
                      <ArrowUp className="inline w-4 h-4" />
                    )}
                    {getSorter("slug") === "desc" && (
                      <ArrowDown className="inline w-4 h-4" />
                    )}
                  </TableHead>
                  <TableHead
                    onClick={() => onSort("isActive")}
                    className="cursor-pointer select-none whitespace-nowrap"
                  >
                    IsActive{" "}
                    {getSorter("isActive") === "asc" && (
                      <ArrowUp className="inline w-4 h-4" />
                    )}
                    {getSorter("isActive") === "desc" && (
                      <ArrowDown className="inline w-4 h-4" />
                    )}
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.data.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="whitespace-nowrap">
                      {product.id}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[180px] truncate">
                      {product.title}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[200px] truncate">
                      {product.slug}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Checkbox checked={product.isActive} disabled></Checkbox>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit"
                          onClick={() => {
                            if (product.id !== undefined) {
                              edit("product", product.id);
                            }
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          aria-label="Delete"
                          onClick={() => onDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onPrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              {currentPage - 1 > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPage(currentPage - 1)}
                >
                  {currentPage - 1}
                </Button>
              )}
              <span className="font-bold px-2">{currentPage}</span>
              {currentPage + 1 <= pageCount && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPage(currentPage + 1)}
                >
                  {currentPage + 1}
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onNext}
              disabled={currentPage === pageCount}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
