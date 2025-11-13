import {
  ChartColumnStacked,
  Monitor,
  NotebookText,
  Package,
  Warehouse,
} from "lucide-react";

export const tabs = [
  {
    title: "Products",
    url: "#",
    icon: Package,
    isActive: true,
    items: [
      {
        title: "Mes Produits",
        url: "/admin/product/list",
      },
      {
        title: "Créer un produit",
        url: "/admin/product/create",
      },
    ],
  },
  {
    title: "Categories",
    url: "#",
    icon: ChartColumnStacked,
    isActive: false,
    items: [
      {
        title: "My categories",
        url: "/admin/category/list",
      },
      {
        title: "Create a category",
        url: "/admin/category/create",
      },
    ],
  },
  {
    title: "Stock",
    url: "#",
    icon: Warehouse,
    isActive: false,
    items: [
      {
        title: "List",
        url: "/admin/stock/list",
      },
    ],
  },
  {
    title: "Personaliser mon site",
    url: "/admin/personalization",
    icon: Monitor,
    isActive: false,
  },
  {
    title: "Journal",
    url: "#",
    icon: NotebookText,
    isActive: false,
    items: [
      {
        title: "List",
        url: "/admin/journal/list",
      },
    ],
  },
];
