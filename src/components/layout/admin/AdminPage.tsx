import { AppSidebar } from "@/components/layout/admin/sidebar/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { CreateProduct } from "@/pages/products/create";
import { EditProduct } from "@/pages/products/edit";
import { ListProducts } from "@/pages/products/list";
import { PersonalizationPage } from "@/pages/personalization";
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
            <Route path="products/list" element={<ListProducts />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="personalization" element={<PersonalizationPage />} />
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

