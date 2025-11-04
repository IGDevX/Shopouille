import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Building } from "lucide-react";
import { ThemeTab } from "./components/ThemeTab";
import { ContentTab } from "./components/ContentTab";

export const PersonalizationPage = () => {
  return (
    <div className="w-full max-w-full px-2 sm:px-6 mx-auto">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Personnalisation</h1>
          <p className="text-muted-foreground">
            Personnalisez l'apparence de votre boutique
          </p>
        </div>

        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="w-fit">
            <TabsTrigger value="theme" className="gap-2">
              <Clock className="h-4 w-4" />
              Thème
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <Building className="h-4 w-4" />
              Contenu
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="theme" className="mt-0">
              <ThemeTab />
            </TabsContent>

            <TabsContent value="content" className="mt-0">
              <ContentTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
