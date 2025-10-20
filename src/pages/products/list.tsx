import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMany, useNavigation, useTable } from "@refinedev/core";
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
    tableQuery: { isLoading },
    currentPage,
    setCurrentPage,
    pageCount,
    sorters,
    setSorters,
  } = useTable({
    resource: "products",
    pagination: { currentPage: 1, pageSize: 10 },
    sorters: { initial: [{ field: "id", order: "asc" }] },
  });

  const { result: categories } = useMany({
    resource: "categories",
    ids: result?.data.map((product) => product.category?.id) ?? [],
  });

  const { edit } = useNavigation();

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
                    onClick={() => onSort("name")}
                    className="cursor-pointer select-none whitespace-nowrap"
                  >
                    Name{" "}
                    {getSorter("name") === "asc" && (
                      <ArrowUp className="inline w-4 h-4" />
                    )}
                    {getSorter("name") === "desc" && (
                      <ArrowDown className="inline w-4 h-4" />
                    )}
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Category</TableHead>
                  <TableHead
                    onClick={() => onSort("material")}
                    className="cursor-pointer select-none whitespace-nowrap"
                  >
                    Material{" "}
                    {getSorter("material") === "asc" && (
                      <ArrowUp className="inline w-4 h-4" />
                    )}
                    {getSorter("material") === "desc" && (
                      <ArrowDown className="inline w-4 h-4" />
                    )}
                  </TableHead>
                  <TableHead
                    onClick={() => onSort("price")}
                    className="cursor-pointer select-none whitespace-nowrap"
                  >
                    Price{" "}
                    {getSorter("price") === "asc" && (
                      <ArrowUp className="inline w-4 h-4" />
                    )}
                    {getSorter("price") === "desc" && (
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
                      {product.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[160px] truncate">
                      {
                        categories?.data?.find(
                          (category) => category.id == product.category?.id
                        )?.title
                      }
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[200px] truncate">
                      {product.material}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {product.price}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit"
                          onClick={() => {
                            if (product.id !== undefined) {
                              edit("products", product.id);
                            }
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete"
                          disabled
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
