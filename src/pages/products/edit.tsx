import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import Product from "@/types/product";
import { useForm, useNavigation } from "@refinedev/core";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useParams } from "react-router";

export const EditProduct: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { list } = useNavigation();

  const { onFinish, query } = useForm<Product>({
    action: "edit",
    resource: "product",
    id: id,
  });

  const record = query?.data?.data ?? null;

  if (!record || query?.isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Partial<Product> = {
      title: String(fd.get("title") ?? ""),
      slug: String(fd.get("slug") ?? ""),
      descriptionHtml: String(fd.get("descriptionHtml") ?? ""),
      seoTitle: String(fd.get("seoTitle") ?? ""),
      seoDescription: String(fd.get("seoDescription") ?? ""),
    };
    onFinish(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => list("product")}
          >
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Modifier un produit</h1>
            <p className="text-muted-foreground text-sm">
              Mettez à jour les informations essentielles avant publication.
            </p>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informations principales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" defaultValue={record.title ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={record.slug ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descriptionHtml">Description (HTML)</Label>
              <Textarea
                id="descriptionHtml"
                name="descriptionHtml"
                defaultValue={record.descriptionHtml ?? ""}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                name="seoTitle"
                defaultValue={record.seoTitle ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Input
                id="seoDescription"
                name="seoDescription"
                defaultValue={record.seoDescription ?? ""}
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
