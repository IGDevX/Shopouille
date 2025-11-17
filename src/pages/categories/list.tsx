import PaginationControls from "@/components/products/PaginationControls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const { edit, create } = useNavigation();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Catégories</h1>
          <p className="text-muted-foreground text-sm">
            Structurez vos produits grâce à des catégories et sous-catégories.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => create?.("category")}
        >
          Nouvelle catégorie
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Liste des catégories</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              Chargement...
            </div>
          ) : !result?.data || result.data.length === 0 ? (
            <div className="flex justify-center items-center h-40 text-muted-foreground">
              Aucune catégorie
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead className="w-1/2 text-left">Nom</TableHead>
                    <TableHead className="w-1/4 text-left">Parente</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {result.data.map((category) => (
                    <TableRow key={String(category.id)}>
                      <TableCell className="whitespace-nowrap">
                        {String(category.id)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap max-w-[180px] truncate">
                        {category.name}
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
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
          )}
        </CardContent>
        {result?.data?.length ? (
          <CardFooter className="justify-end">
            <PaginationControls
              currentPage={currentPage}
              pageCount={pageCount}
              onPrevious={onPrevious}
              onNext={onNext}
              onPage={onPage}
            />
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
};

export default ListCategories;
