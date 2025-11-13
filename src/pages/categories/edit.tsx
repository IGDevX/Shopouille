import CategorySelect from "@/components/form/CategorySelect";
import { Button } from "@/components/ui/button";
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

  if (formLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={record?.name} required />
      </div>

      <div className="flex flex-col gap-y-2">
        <Label htmlFor="parent_id">Parent category</Label>
        <CategorySelect
          name="parent_id"
          defaultValue={String(record?.parentId ?? "")}
          allowEmpty
        />
      </div>

      <Button type="submit">Save</Button>
    </form>
  );
};

export default EditCategory;
