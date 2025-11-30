import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import AdminPage from "./components/layout/admin/AdminPage";
import { ClientLayout } from "./components/layout/client/ClientLayout";
import { ClientRoutes } from "./components/layout/client/ClientRoutes";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { CustomThemeProvider } from "./components/theme/CustomThemeProvider";
import { dataProvider } from "./providers/data-provider";
import { resourcesRouter } from "./utils/resources-router";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <Refine
            dataProvider={dataProvider}
            notificationProvider={useNotificationProvider()}
            routerProvider={routerProvider}
            resources={resourcesRouter}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: "5Ha9uf-6iEwAt-QjLCxs",
            }}
          >
            <CustomThemeProvider>
              <Routes>
                <Route path="/admin/*" element={<AdminPage />} />
                <Route
                  path="/*"
                  element={
                    <ClientLayout>
                      <ClientRoutes />
                    </ClientLayout>
                  }
                />
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </CustomThemeProvider>
          </Refine>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
