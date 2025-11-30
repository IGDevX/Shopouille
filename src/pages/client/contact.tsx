import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContent } from "@/pages/personalization/components/ContentTab";
import { useList } from "@refinedev/core";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export const ContactPage = () => {
  const {
    result: { data },
    query: { isLoading },
  } = useList({
    resource: "page-content",
  });

  const contactContent =
    data && data.length > 0
      ? data.find((page) => (page as PageContent).type === "contact")?.content
      : null;

  const formatContent = (text: string | null | undefined): string => {
    if (!text) return "";
    return text.replace(/\n/g, "<br />");
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'envoi du formulaire
    alert("Votre message a été envoyé avec succès !");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-2">
        <h1 className="text-2xl font-semibold">Contactez-nous</h1>
        <p className="text-sm text-muted-foreground">
          Nous vous accompagnons du lundi au vendredi pour répondre à toutes vos
          questions.
        </p>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
                <CardDescription>
                  Choisissez le canal qui vous convient le mieux.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <Spinner />
                  </div>
                ) : contactContent ? (
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: formatContent(contactContent),
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-muted-foreground">
                          contact@shopouille.fr
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Téléphone</p>
                        <p className="text-sm text-muted-foreground">
                          +33 1 23 45 67 89
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Adresse</p>
                        <p className="text-sm text-muted-foreground">
                          123 Rue de la République
                          <br />
                          75001 Paris, France
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Partagez votre demande, nous revenons vers vous rapidement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Votre nom"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Objet de votre message"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Votre message..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="w-full sm:w-auto">
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
