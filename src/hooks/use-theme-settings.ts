import { useOne } from "@refinedev/core";
import { useState, useEffect } from "react";

interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
}

const DEFAULT_PRIMARY = "#313647";
const DEFAULT_SECONDARY = "#435663";
const STORAGE_KEY = "shopouille-theme-settings";

/**
 * Récupère les couleurs depuis le localStorage
 */
const getStoredTheme = (): ThemeSettings | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to parse theme from localStorage", error);
  }
  return null;
};

/**
 * Sauvegarde les couleurs dans le localStorage
 */
const storeTheme = (theme: ThemeSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch (error) {
    console.warn("Failed to store theme in localStorage", error);
  }
};

export const useThemeSettings = () => {
  // Charge immédiatement depuis localStorage pour éviter le blink
  const [cachedTheme, setCachedTheme] = useState<ThemeSettings | null>(
    getStoredTheme
  );

  const {
    result,
    query: { isLoading, isError, refetch },
  } = useOne<ThemeSettings>({
    resource: "theme-settings",
    id: "default",
    queryOptions: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  });

  // Met à jour le cache quand les données arrivent de l'API
  useEffect(() => {
    if (result) {
      const themeData = {
        primaryColor: result.primaryColor,
        secondaryColor: result.secondaryColor,
      };
      storeTheme(themeData);
      setCachedTheme(themeData);
    }
  }, [result]);

  // Utilise les données de l'API si disponibles, sinon le cache, sinon les valeurs par défaut
  const primaryColor =
    result?.primaryColor || cachedTheme?.primaryColor || DEFAULT_PRIMARY;
  const secondaryColor =
    result?.secondaryColor || cachedTheme?.secondaryColor || DEFAULT_SECONDARY;

  return {
    primaryColor,
    secondaryColor,
    isLoading,
    isError,
    refetch,
  };
};
