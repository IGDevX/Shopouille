import { AppSidebar } from "@/components/layout/admin/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import CreateCategory from "@/pages/categories/create";
import EditCategory from "@/pages/categories/edit";
import ListCategories from "@/pages/categories/list";
import { ShowHomeAdmin } from "@/pages/home-admin/show";
import { PersonalizationPage } from "@/pages/personalization";
import { CreateProduct } from "@/pages/products/create";
import { EditProduct } from "@/pages/products/edit";
import { ListProducts } from "@/pages/products/list";
import { ShowProduct } from "@/pages/products/show";
import { EditVariant } from "@/pages/variants/edit";
import { Route, Routes } from "react-router";
import { AdminHeader } from "./AdminHeader";

export default function AdminPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader />

        {/* Routes admin */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Routes>
            <Route path="/" element={<ShowHomeAdmin />} />

            <Route path="product/list" element={<ListProducts />} />
            <Route path="product/create" element={<CreateProduct />} />
            <Route path="product/edit/:id" element={<EditProduct />} />
            <Route path="product/show/:id" element={<ShowProduct />} />

            <Route path="variant/edit/:id" element={<EditVariant />} />

            <Route path="personalization" element={<PersonalizationPage />} />

            <Route path="category/list" element={<ListCategories />} />
            <Route path="category/create" element={<CreateCategory />} />
            <Route path="category/edit/:id" element={<EditCategory />} />

            <Route
              path="*"
              element={<div className="p-4">Page admin non trouvée</div>}
            />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
