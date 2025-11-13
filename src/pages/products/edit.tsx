import { Button } from "@/components/ui/button";
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
    <>
      <div className="flex items-center gap-8">
        <Button
          variant={"outline"}
          size={"icon"}
          className="my-6"
          onClick={() => list("product")}
        >
          <ArrowLeft />
        </Button>
        <h1>Modifier un produit</h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" defaultValue={record.title ?? ""} />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={record.slug ?? ""} />
        </div>

        <div>
          <Label htmlFor="descriptionHtml">Description (HTML)</Label>
          <Textarea
            id="descriptionHtml"
            name="descriptionHtml"
            defaultValue={record.descriptionHtml ?? ""}
            rows={6}
          />
        </div>

        <div>
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input
            id="seoTitle"
            name="seoTitle"
            defaultValue={record.seoTitle ?? ""}
          />
        </div>

        <div>
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
    </>
  );
};
