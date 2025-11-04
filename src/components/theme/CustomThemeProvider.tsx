import { PropsWithChildren, useEffect } from "react";
import { useThemeSettings } from "@/hooks/use-theme-settings";
import { isLightColor } from "@/lib/color-utils";

export function CustomThemeProvider({ children }: PropsWithChildren) {
  const { primaryColor, secondaryColor } = useThemeSettings();

  useEffect(() => {
    const root = document.documentElement;

    if (primaryColor) {
      root.style.setProperty("--primary", primaryColor);
      root.style.setProperty(
        "--primary-foreground",
        isLightColor(primaryColor) ? "#000000" : "#ffffff"
      );
    }

    if (secondaryColor) {
      root.style.setProperty("--secondary", secondaryColor);
      root.style.setProperty(
        "--secondary-foreground",
        isLightColor(secondaryColor) ? "#000000" : "#ffffff"
      );
    }
  }, [primaryColor, secondaryColor]);

  return <>{children}</>;
}
