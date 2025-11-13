import { CGVPage } from "@/pages/client/cgv";
import { ContactPage } from "@/pages/client/contact";
import { HomePage } from "@/pages/client/home";
import { Route, Routes } from "react-router";

export function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/cgv" element={<CGVPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}
