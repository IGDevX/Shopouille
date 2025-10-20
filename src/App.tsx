import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter } from "react-router";
import "./App.css";
import Page from "./components/layout/Page";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
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
            <Page />

            <Toaster />
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
