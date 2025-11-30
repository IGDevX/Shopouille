import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
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
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="mx-auto mt-6 flex max-w-4xl flex-col gap-2">
        <h1 className="text-2xl font-semibold">
          Conditions Générales de Vente
        </h1>
        <p className="text-sm text-muted-foreground">
          Retrouvez l'ensemble de nos engagements et modalités de vente mis à
          jour le {new Date().toLocaleDateString("fr-FR")}.
        </p>
      </div>

      <Card className="mx-auto max-w-4xl overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-1">
            <CardTitle>Mentions légales</CardTitle>
            <CardDescription>
              Toutes les informations essentielles relatives à nos CGV.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {cgvContent ? (
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: formatContent(cgvContent) }}
            />
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Le contenu des CGV n'est pas encore disponible.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
