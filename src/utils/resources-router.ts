export const resourcesRouter = [
  {
    name: "home-admin",
    list: "/admin",
  },
  {
    name: "product",
    list: "/admin/product/list",
    create: "/admin/product/create",
    edit: "/admin/product/edit/:id",
    show: "/admin/product/show/:id",
  },
  {
    name: "variant",
    edit: "/admin/variant/edit/:id",
  },
  {
    name: "stock",
    edit: "/admin/stock/list",
  },
  {
    name: "category",
    list: "/admin/category/list",
    create: "/admin/category/create",
    edit: "/admin/category/edit/:id",
  },
  {
    name: "theme-settings",
  },
  {
    name: "page-content",
    list: "/admin/page-content",
    edit: "/admin/page-content/:id",
  },
];
