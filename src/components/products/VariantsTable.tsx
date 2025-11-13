import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Variant } from "@/types/variant";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import React, { useMemo } from "react";

type VariantsTableProps = {
  data: Variant[];
  onSort: (field: keyof Variant | string) => void;
  getSorter: (field: keyof Variant | string) => "asc" | "desc" | undefined;
  edit: (...args: any[]) => void;
  onDelete: (id?: Variant["id"]) => void;
};

// Colonnes dynamiques du type Variant (sauf attributesJson)
const variantColumns: { key: keyof Variant; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "sku", label: "SKU" },
  { key: "priceAmount", label: "Prix (€)" },
  { key: "weightGrams", label: "Poids (g)" },
  { key: "barcode", label: "Code-barres" },
  { key: "quantity", label: "Quantité" },
  { key: "isActive", label: "Actif" },
];

export const VariantsTable: React.FC<VariantsTableProps> = ({
  data,
  onSort,
  getSorter,
  edit,
  onDelete,
}) => {
  const parseAttributes = (attr: Variant["attributesJson"]) => {
    if (!attr) return {};
    try {
      const parsed = JSON.parse(attr);
      return typeof parsed === "object" && parsed !== null
        ? parsed
        : { value: parsed };
    } catch {
      return { value: attr };
    }
  };

  // Récupération des clés des attributs dynamiques
  const attributeKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const variant of data) {
      const attrs = parseAttributes(variant.attributesJson);
      Object.keys(attrs).forEach((k) => keys.add(k));
    }
    return Array.from(keys);
  }, [data]);

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            {variantColumns.map(({ key, label }) => (
              <TableHead
                key={key}
                onClick={() => onSort(key)}
                className="cursor-pointer select-none whitespace-nowrap text-left"
              >
                {label}
                {getSorter(key) === "asc" && (
                  <ArrowUp className="inline w-4 h-4 ml-1" />
                )}
                {getSorter(key) === "desc" && (
                  <ArrowDown className="inline w-4 h-4 ml-1" />
                )}
              </TableHead>
            ))}

            {/* Colonnes dynamiques depuis attributesJson */}
            {attributeKeys.map((key) => (
              <TableHead
                key={key}
                className="whitespace-nowrap text-left min-w-[120px] capitalize"
              >
                {key}
              </TableHead>
            ))}

            <TableHead className="whitespace-nowrap text-right w-32">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((variant) => {
            const attributes = parseAttributes(variant.attributesJson);
            return (
              <TableRow key={String(variant.id)}>
                {variantColumns.map(({ key }) => (
                  <TableCell
                    key={key as string}
                    className="whitespace-nowrap text-left truncate"
                  >
                    {key === "isActive" ? (
                      <Checkbox checked={Boolean(variant[key])} disabled />
                    ) : key === "priceAmount" ? (
                      `${variant[key]}€`
                    ) : (
                      String(variant[key])
                    )}
                  </TableCell>
                ))}

                {attributeKeys.map((key) => (
                  <TableCell
                    key={key}
                    className="whitespace-nowrap min-w-[120px] max-w-[160px] truncate text-left"
                  >
                    {attributes[key] ?? ""}
                  </TableCell>
                ))}

                <TableCell className="whitespace-nowrap text-right w-32">
                  <div className="inline-flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit"
                      onClick={() =>
                        variant.id !== undefined && edit("variant", variant.id)
                      }
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => onDelete(variant.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default VariantsTable;
