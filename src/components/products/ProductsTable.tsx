import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types/product";
import { ArrowDown, ArrowUp, Eye, Pencil, Trash2 } from "lucide-react";
import React from "react";

type ProductsTableProps = {
  data: Product[];
  onSort: (field: string) => void;
  getSorter: (field: string) => "asc" | "desc" | undefined;
  edit: (...args: unknown[]) => void;
  show: (...args: unknown[]) => void;
  onDelete: (id?: Product["id"]) => void;
};

export const ProductsTable: React.FC<ProductsTableProps> = ({
  data,
  onSort,
  getSorter,
  edit,
  show,
  onDelete,
}) => {
  const productColumns: { key: keyof Product; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "title", label: "Titre" },
    { key: "slug", label: "Slug" },
    { key: "descriptionHtml", label: "Description" },
    { key: "seoTitle", label: "Titre SEO" },
    { key: "seoDescription", label: "Description SEO" },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            {productColumns.map(({ key, label }) => {
              const headClass =
                key === "title"
                  ? "cursor-pointer select-none whitespace-nowrap w-48"
                  : "cursor-pointer select-none whitespace-nowrap w-12";

              return (
                <TableHead
                  key={key}
                  onClick={() => onSort(key)}
                  className={headClass}
                >
                  {label}
                  {getSorter(key) === "asc" && (
                    <ArrowUp className="inline w-4 h-4" />
                  )}
                  {getSorter(key) === "desc" && (
                    <ArrowDown className="inline w-4 h-4" />
                  )}
                </TableHead>
              );
            })}

            <TableHead className="whitespace-nowrap text-right w-32">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((product: Product) => (
            <TableRow key={String(product.id)}>
              {productColumns.map(({ key }) => {
                const cellClass =
                  key === "title"
                    ? "whitespace-nowrap truncate text-left w-48"
                    : "whitespace-nowrap truncate text-left";

                return (
                  <TableCell key={key as string} className={cellClass}>
                    {String(product[key])}
                  </TableCell>
                );
              })}

              {/* TODO: ajouter les catégories */}

              <TableCell className="whitespace-nowrap text-right w-32">
                <div className="inline-flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit"
                    onClick={() => {
                      if (product.id !== undefined) {
                        show("product", product.id);
                      }
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
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
  );
};

export default ProductsTable;
