import CategorySelect from "@/components/form/CategorySelect";
import { Button } from "@/components/ui/button";
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" required />
      </div>

      <div className="flex flex-col gap-y-2">
        <Label htmlFor="parent_id">Parent category</Label>
        <CategorySelect
          name="parent_id"
          placeholder="Choose parent (optional)"
          allowEmpty
        />
      </div>

      {mutation.isSuccess && (
        <div className="text-green-600">Created successfully</div>
      )}

      <Button type="submit">Create</Button>
    </form>
  );
};

export default CreateCategory;
