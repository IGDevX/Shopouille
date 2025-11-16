import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Variant } from "@/types/variant";
import { ArrowDown, ArrowUp, Check, X } from "lucide-react";

type StocksTableProps = {
  data: Variant[];
  onSort: (field: keyof Variant | string) => void;
  getSorter: (field: keyof Variant | string) => "asc" | "desc" | undefined;
  onUpdateStock: (variantId: string | number, newQuantity: number) => Promise<void>;
  loading?: boolean;
};

const stockColumns: { key: string; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "sku", label: "SKU" },
]; // quantity handled separately (placed after attributes)

export const StocksTable: React.FC<StocksTableProps> = ({
  data,
  onSort,
  getSorter,
  onUpdateStock,
  loading = false,
}) => {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [savingId, setSavingId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (variant: Variant) => {
    setEditingId(variant.id);
    setEditValue(variant.quantity ?? 0);
    setError(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue(0);
    setError(null);
  };

  const handleSave = async (variantId: string | number) => {
    setSavingId(variantId);
    try {
      await onUpdateStock(variantId, editValue);
      setEditingId(null);
      setEditValue(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
    } finally {
      setSavingId(null);
    }
  };

  const parseAttributes = (attr: Variant["attributesJson"]) => {
    if (!attr) return "—";
    try {
      const parsed = JSON.parse(attr);
      if (typeof parsed === "object" && parsed !== null) {
        return Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join(" | ");
      }
      return String(parsed);
    } catch {
      return String(attr);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {/* ID, SKU */}
              {stockColumns.map(({ key, label }) => (
                <TableHead
                  key={key}
                  onClick={() => onSort(key)}
                  className="cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {getSorter(key) === "asc" && <ArrowUp className="w-4 h-4" />}
                    {getSorter(key) === "desc" && <ArrowDown className="w-4 h-4" />}
                  </div>
                </TableHead>
              ))}

              {/* Attributs JSON */}
              <TableHead>Attributs</TableHead>

              {/* Stock (avant dernière colonne) */}
              <TableHead
                onClick={() => onSort("quantity")}
                className="cursor-pointer select-none"
              >
                <div className="flex items-center gap-1">
                  Stock
                  {getSorter("quantity") === "asc" && <ArrowUp className="w-4 h-4" />}
                  {getSorter("quantity") === "desc" && <ArrowDown className="w-4 h-4" />}
                </div>
              </TableHead>

              {/* Actions */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((variant) => {
              const attributesDisplay = parseAttributes(variant.attributesJson);
              const isEditing = editingId === variant.id;
              const isSaving = savingId === variant.id;

              return (
                <TableRow key={String(variant.id)}>
                  {/* ID */}
                  <TableCell className="whitespace-nowrap">{variant.id}</TableCell>

                  {/* SKU */}
                  <TableCell className="whitespace-nowrap">{variant.sku}</TableCell>

                  {/* Attributs JSON */}
                  <TableCell className="text-sm max-w-xs truncate">
                    {attributesDisplay}
                  </TableCell>

                  {/* Stock (éditable) */}
                  <TableCell className="whitespace-nowrap">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        min={0}
                        className="w-28"
                        autoFocus
                        disabled={isSaving}
                      />
                    ) : (
                      <span className="font-semibold">{variant.quantity}</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSave(variant.id!)}
                            disabled={isSaving || loading}
                            className="gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Valider
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSaving || loading}
                            aria-label="Annuler"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(variant)}
                          disabled={loading}
                        >
                          Éditer
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StocksTable;