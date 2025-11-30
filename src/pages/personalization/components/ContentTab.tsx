import { useState, useEffect } from "react";
import { useList, useUpdate, useNotification } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PageType = "home" | "cgv" | "contact";

export interface PageContent {
  id: string;
  type: string;
  content: string;
}

const pageTitles: Record<PageType, string> = {
  home: "Titre de la page d'accueil",
  cgv: "Conditions Générales de Vente (CGV)",
  contact: "Page Contact",
};

export const ContentTab = () => {
  const { open } = useNotification();
  const [activePage, setActivePage] = useState<PageType>("home");
  const [contentMap, setContentMap] = useState<Record<PageType, string>>({
    home: "",
    cgv: "",
    contact: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    result: { data },
    query: { isLoading },
  } = useList({
    resource: "page-content",
  });

  const { mutate: updatePage } = useUpdate();

  useEffect(() => {
    if (data) {
      const map: Record<PageType, string> = {
        home: "",
        cgv: "",
        contact: "",
      };
      data.forEach((page) => {
        const pageContent = page as PageContent;
        if (pageContent.type in map) {
          map[pageContent.type as PageType] = pageContent.content ?? "";
        }
      });
      setContentMap(map);
    }
  }, [data]);

  const handleContentChange = (pageType: PageType, content: string) => {
    setContentMap((prev) => ({
      ...prev,
      [pageType]: content,
    }));
  };

  const handleSubmit = async () => {
    if (!data) return;

    const updates = data
      .map((page) => {
        const pageContent = page as PageContent;
        const newContent = contentMap[pageContent.type as PageType];
        if (newContent !== undefined && newContent !== pageContent.content) {
          return {
            id: pageContent.id,
            values: { content: newContent },
          };
        }
        return null;
      })
      .filter((update) => update !== null) as Array<{
      id: string;
      values: { content: string };
    }>;

    if (updates.length === 0) {
      return;
    }

    setIsUpdating(true);

    try {
      await Promise.all(
        updates.map(
          (update) =>
            new Promise<void>((resolve, reject) => {
              updatePage(
                {
                  resource: "page-content",
                  id: update.id,
                  values: update.values,
                },
                {
                  onSuccess: () => resolve(),
                  onError: () => reject(),
                }
              );
            })
        )
      );

      open?.({
        type: "success",
        message: "Contenu mis à jour avec succès",
      });
    } catch {
      open?.({
        type: "error",
        message: "Erreur lors de la mise à jour du contenu",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">Chargement...</div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Édition du contenu</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activePage}
            onValueChange={(value) => setActivePage(value as PageType)}
            className="w-full"
          >
            <TabsList className="w-full justify-start">
              <TabsTrigger value="home">Titre d'accueil</TabsTrigger>
              <TabsTrigger value="cgv">CGV</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value={activePage} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`content-${activePage}`}>
                  {pageTitles[activePage]}
                </Label>
                <Textarea
                  id={`content-${activePage}`}
                  value={contentMap[activePage]}
                  onChange={(e) =>
                    handleContentChange(activePage, e.target.value)
                  }
                  placeholder={`Saisissez le contenu de ${pageTitles[
                    activePage
                  ].toLowerCase()}...`}
                  className={
                    activePage === "home"
                      ? "min-h-[100px] font-mono text-sm"
                      : "min-h-[400px] font-mono text-sm"
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {activePage === "home"
                    ? "Saisissez le titre qui apparaîtra sur la page d'accueil."
                    : "Vous pouvez utiliser du HTML ou du Markdown pour formater le contenu."}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Sauvegarde..." : "Sauvegarder tout"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
