import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useSelect } from "@refinedev/core";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export const CreateProduct = () => {
  const { onFinish, mutation } = useForm({
    action: "create",
    resource: "product",
  });

  const { options } = useSelect({
    resource: "category",
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );
    onFinish({
      ...data,
    });
  };

  const [isActive, setIsActive] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input type="text" id="title" name="title" required />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input type="text" id="slug" name="slug" required />
          </div>

          <div>
            <Label htmlFor="descriptionHtml">Description</Label>
            <Textarea
              id="descriptionHtml"
              name="descriptionHtml"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="seoTitle">seoTitle</Label>
            <Input type="text" id="seoTitle" name="seoTitle" required />
          </div>

          <div>
            <Label htmlFor="seoDescription">seoDescription</Label>
            <Textarea
              id="seoDescription"
              name="seoDescription"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue>Select a category for product</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Label htmlFor="isActive">isActive</Label>
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(Boolean(checked))}
            ></Checkbox>
            <input type="hidden" name="isActive" value={String(isActive)} />
          </div>

          {mutation.isSuccess && (
            <span className="text-green-600 text-sm">
              Successfully submitted!
            </span>
          )}

          <Button type="submit" className="w-full gap-2">
            <PlusCircle className="w-4 h-4" />
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
