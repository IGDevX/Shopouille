import { CGVPage } from "@/pages/client/cgv";
import { CatalogPage } from "@/pages/client/catalog";
import { ContactPage } from "@/pages/client/contact";
import { ProductPage } from "@/pages/client/product";
import { HomePage } from "@/pages/client/home";
import { Route, Routes } from "react-router";

export function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/catalogue" element={<CatalogPage />} />
      <Route path="/catalogue/:productId" element={<ProductPage />} />
      <Route path="/cgv" element={<CGVPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}
