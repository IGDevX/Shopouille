import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router";
import { Settings, Menu } from "lucide-react";
import chatLogo from "../../../../public/logo.png";
import { cn } from "@/lib/utils";

export function ClientNavbar() {
  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "z-50",
        "w-full",
        "border-b",
        "border-border",
        "bg-background/95",
        "backdrop-blur",
        "supports-backdrop-filter:bg-background/60"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo et liens à gauche */}
        <div className="flex items-center gap-8 md:gap-12">
          <Link to="/" className="flex items-center h-full">
            <img src={chatLogo} alt="Shopouille logo" className="h-8 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/cgv"
              className={cn(
                "text-sm",
                "font-medium",
                "text-muted-foreground",
                "transition-colors",
                "hover:text-foreground",
                "whitespace-nowrap"
              )}
            >
              CGV
            </Link>
            <Link
              to="/contact"
              className={cn(
                "text-sm",
                "font-medium",
                "text-muted-foreground",
                "transition-colors",
                "hover:text-foreground",
                "whitespace-nowrap"
              )}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Bouton back-office à droite */}
        <div className="flex items-center">
          {/* Menu mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                aria-label="Menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  to="/cgv"
                  className={cn(
                    "text-sm",
                    "font-medium",
                    "text-muted-foreground",
                    "transition-colors",
                    "hover:text-foreground"
                  )}
                >
                  CGV
                </Link>
                <Link
                  to="/contact"
                  className={cn(
                    "text-sm",
                    "font-medium",
                    "text-muted-foreground",
                    "transition-colors",
                    "hover:text-foreground"
                  )}
                >
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Bouton back-office */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-9 w-9 shrink-0"
            aria-label="Accéder au back-office"
          >
            <Link
              to="/admin/products/list"
              className="flex items-center justify-center"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

