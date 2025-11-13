import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelect } from "@refinedev/core";
import React, { useEffect, useState } from "react";

type CategorySelectProps = {
  name?: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  allowEmpty?: boolean; // if true, user can select no value (None)
};

export const CategorySelect: React.FC<CategorySelectProps> = ({
  name = "category",
  defaultValue = undefined,
  placeholder = "Select a category for the product",
  allowEmpty = false,
}) => {
  const { options } = useSelect({
    resource: "category",
    optionLabel: "name",
    optionValue: "id",
  });

  const [selected, setSelected] = useState<string | undefined>(() =>
    defaultValue == null ? undefined : String(defaultValue)
  );

  // if options arrive and no selected value, set the first option as default (unless allowEmpty)
  useEffect(() => {
    if (!allowEmpty && selected == null && options && options.length > 0) {
      setSelected(String(options[0].value));
    }
  }, [options, selected, allowEmpty]);

  return (
    <div>
      <Select value={selected} onValueChange={(v: string) => setSelected(v)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {allowEmpty && (
              <SelectItem key="__none" value="none">
                None
              </SelectItem>
            )}
            {options?.map((option) => (
              <SelectItem
                key={String(option.value)}
                value={String(option.value)}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {/* hidden input so native form submission includes the category */}
      <input type="hidden" name={name} value={selected ?? ""} />
    </div>
  );
};

export default CategorySelect;
