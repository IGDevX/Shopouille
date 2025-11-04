import { useState, useEffect } from "react";
import { useOne, useUpdate, useNotification } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
}

const predefinedPalettes: ColorPalette[] = [
  { name: "Émeraude", primary: "#10b981", secondary: "#3b82f6" },
  { name: "Violet", primary: "#8b5cf6", secondary: "#ec4899" },
  { name: "Orange", primary: "#f59e0b", secondary: "#eab308" },
  { name: "Rose", primary: "#ec4899", secondary: "#ef4444" },
  { name: "Indigo", primary: "#6366f1", secondary: "#8b5cf6" },
];

export const ThemeTab = () => {
  const { open } = useNotification();
  const [primaryColor, setPrimaryColor] = useState("#10b981");
  const [secondaryColor, setSecondaryColor] = useState("#3b82f6");

  const {
    result,
    query: { isLoading },
  } = useOne({
    resource: "theme-settings",
    id: "default",
  });

  const { mutate: updateTheme } = useUpdate();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (result) {
      setPrimaryColor(result.primaryColor || "#10b981");
      setSecondaryColor(result.secondaryColor || "#3b82f6");
    }
  }, [result]);

  const handlePaletteSelect = (palette: ColorPalette) => {
    setPrimaryColor(palette.primary);
    setSecondaryColor(palette.secondary);
  };

  const handlePublish = () => {
    setIsUpdating(true);

    updateTheme(
      {
        resource: "theme-settings",
        id: "default",
        values: {
          primaryColor,
          secondaryColor,
        },
      },
      {
        onSuccess: () => {
          setIsUpdating(false);
          open?.({
            type: "success",
            message: "Thème mis à jour avec succès",
          });
        },
        onError: () => {
          setIsUpdating(false);
          open?.({
            type: "error",
            message: "Erreur lors de la mise à jour du thème",
          });
        },
      }
    );
  };

  const handleReset = () => {
    if (result) {
      setPrimaryColor(result.primaryColor || "#10b981");
      setSecondaryColor(result.secondaryColor || "#3b82f6");
    } else {
      setPrimaryColor("#10b981");
      setSecondaryColor("#3b82f6");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">Chargement...</div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Couleurs du thème</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="primary-color">Couleur principale</Label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded border-2 border-gray-200 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
                onClick={() => {
                  const input = document.getElementById(
                    "primary-color"
                  ) as HTMLInputElement;
                  input?.click();
                }}
              />
              <Input
                id="primary-color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-32"
              />
              <Input
                type="text"
                value={primaryColor.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    setPrimaryColor(value);
                  }
                }}
                className="w-24"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary-color">Couleur secondaire</Label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded border-2 border-gray-200 cursor-pointer"
                style={{ backgroundColor: secondaryColor }}
                onClick={() => {
                  const input = document.getElementById(
                    "secondary-color"
                  ) as HTMLInputElement;
                  input?.click();
                }}
              />
              <Input
                id="secondary-color"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-32"
              />
              <Input
                type="text"
                value={secondaryColor.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    setSecondaryColor(value);
                  }
                }}
                className="w-24"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Palette prédéfinie</Label>
            <div className="grid grid-cols-5 gap-3">
              {predefinedPalettes.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => handlePaletteSelect(palette)}
                  className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex gap-1">
                    <div
                      className="w-8 h-8 rounded border border-gray-200"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div
                      className="w-8 h-8 rounded border border-gray-200"
                      style={{ backgroundColor: palette.secondary }}
                    />
                  </div>
                  <span className="text-xs text-center">{palette.name}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu en direct</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg overflow-hidden bg-white">
            <div
              className="h-16 flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: primaryColor }}
            >
              ShopifyFD
            </div>
            <div className="p-4 space-y-3">
              <div className="h-32 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              <Button
                className="mt-4"
                style={{
                  backgroundColor: secondaryColor,
                  color: "white",
                }}
              >
                Acheter maintenant
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handlePublish}
              className="flex-1"
              disabled={isUpdating}
              style={{
                backgroundColor: primaryColor,
                color: "white",
              }}
            >
              {isUpdating ? "Publication..." : "Publier les modifications"}
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
