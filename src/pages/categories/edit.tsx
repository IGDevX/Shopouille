import CategorySelect from "@/components/form/CategorySelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@refinedev/core";
import React from "react";

export const EditCategory: React.FC = () => {
  const { onFinish, formLoading, query } = useForm({
    action: "edit",
    resource: "category",
  });

  const record = query?.data?.data;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (data.parent_id === "") delete data.parent_id;
    onFinish(data);
  };

  if (formLoading)
    return (
      <div className="flex justify-center items-center h-40">Chargement...</div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Modifier la catégorie</h1>
        <p className="text-muted-foreground text-sm">
          Ajustez le nom ou la hiérarchie pour garder un catalogue cohérent.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" name="name" defaultValue={record?.name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_id">Catégorie parente</Label>
              <CategorySelect
                name="parent_id"
                defaultValue={String(record?.parentId ?? "")}
                allowEmpty
              />
            </div>

            <Button type="submit" className="w-full">
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;
