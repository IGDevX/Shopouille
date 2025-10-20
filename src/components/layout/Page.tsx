import { AppSidebar } from "@/components/layout/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CreateProduct } from "@/pages/products/create";
import { EditProduct } from "@/pages/products/edit";
import { ListProducts } from "@/pages/products/list";
import { Route, Routes } from "react-router";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Routes>
            <Route path="/products/list" element={<ListProducts />} />
            <Route path="/products/create" element={<CreateProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
