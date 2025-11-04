import { Card, CardContent } from "@/components/ui/card";
import { useList } from "@refinedev/core";
import { PageContent } from "../personalization/components/ContentTab";

export const CGVPage = () => {
  const {
    result: { data },
    query: { isLoading },
  } = useList({
    resource: "page-content",
  });

  const cgvContent =
    data && data.length > 0
      ? data.find((page) => (page as PageContent).type === "cgv")?.content
      : null;

  const formatContent = (text: string | null | undefined): string => {
    if (!text) return "";
    return text.replace(/\n/g, "<br />");
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-full px-2 sm:px-6 mx-auto">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center items-center h-40">
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-2 sm:px-6 mx-auto">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Conditions Générales de Vente</h1>
          <p className="text-muted-foreground">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        {cgvContent ? (
          <Card>
            <CardContent className="pt-6">
              <div
                className="prose prose-sm max-w-none whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formatContent(cgvContent) }}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Le contenu des CGV n'est pas encore disponible.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
