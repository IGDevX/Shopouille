import { useOne } from "@refinedev/core";

export const ShowProduct = () => {
  const {
    result,
    query: { isLoading },
  } = useOne({ resource: "products", id: 123 });

  if (isLoading) return <h1>Loading...</h1>;
  return <div>Product name : {result?.name}</div>;
};
