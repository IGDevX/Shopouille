export type Category = {
  id: number | string;
  name: string;
  parent?: Category;
};

export default Category;
