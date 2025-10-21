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
        title: "List",
        url: "/products/list",
      },
      {
        title: "Create",
        url: "/products/create",
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
        title: "List",
        url: "/categories/list",
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
        url: "/stock/list",
      },
    ],
  },
  {
    title: "Mon site",
    url: "#",
    icon: Monitor,
    isActive: false,
    items: [
      {
        title: "List",
        url: "/pages/show",
      },
    ],
  },
  {
    title: "Journal",
    url: "#",
    icon: NotebookText,
    isActive: false,
    items: [
      {
        title: "List",
        url: "/journal/list",
      },
    ],
  },
];
