import PaginationControls from "@/components/products/PaginationControls";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Category from "@/types/category";
import { useDelete, useNavigation, useTable } from "@refinedev/core";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";

export const ListCategories: React.FC = () => {
  // typer useTable pour éviter les casts
  const { result, tableQuery, currentPage, setCurrentPage, pageCount } =
    useTable<Category>({
      resource: "category",
      pagination: { currentPage: 1, pageSize: 10 },
    });

  const isLoading = tableQuery?.isLoading;
  const { edit } = useNavigation();
  const deleteMutation = useDelete();

  const onPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const onNext = () => {
    if (currentPage < pageCount) setCurrentPage(currentPage + 1);
  };
  const onPage = (p: number) => setCurrentPage(p);

  const onDelete = (id?: number | string) => {
    if (id === undefined) return;
    if (!confirm("Delete this category ?")) return;
    deleteMutation.mutate(
      { resource: "category", id },
      {
        onSuccess: () => {
          tableQuery?.refetch();
        },
      }
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">Loading...</div>
    );
  if (!result?.data || result.data.length === 0)
    return <div className="flex justify-center items-center h-40">No data</div>;

  return (
    <div className="w-full max-w-full px-2 sm:px-6 mx-auto">
      <CardContent className="p-2 sm:p-4">
        <div className="w-full">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead className="w-1/2 text-left">Name</TableHead>
                <TableHead className="w-1/4 text-left">Parent</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* plus besoin de cast si useTable est typé */}
              {result.data.map((category) => (
                <TableRow key={String(category.id)}>
                  <TableCell className="whitespace-nowrap">
                    {String(category.id)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap max-w-[180px] truncate">
                    {category.name}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {/* affichage propre si pas de parent */}
                    {category.parent?.name ?? "-"}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit"
                        onClick={() => edit("category", category.id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Delete"
                        onClick={() => onDelete(category.id)}
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

        <PaginationControls
          currentPage={currentPage}
          pageCount={pageCount}
          onPrevious={onPrevious}
          onNext={onNext}
          onPage={onPage}
        />
      </CardContent>
    </div>
  );
};

export default ListCategories;
