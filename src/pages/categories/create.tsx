import CategorySelect from "@/components/form/CategorySelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@refinedev/core";
import React from "react";

export const CreateCategory: React.FC = () => {
  const { onFinish, mutation } = useForm({
    action: "create",
    resource: "category",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (data.parent_id === "") {
      delete data.parent_id;
    }
    onFinish({ ...data });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nouvelle catégorie</h1>
        <p className="text-muted-foreground text-sm">
          Organisez votre catalogue avec des catégories hiérarchisées.
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
              <Input id="name" name="name" type="text" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_id">Catégorie parente</Label>
              <CategorySelect
                name="parent_id"
                placeholder="Choisir (optionnel)"
                allowEmpty
              />
            </div>

            {mutation.isSuccess && (
              <div className="text-green-600 text-sm">Créée avec succès</div>
            )}

            <Button type="submit" className="w-full">
              Créer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCategory;
