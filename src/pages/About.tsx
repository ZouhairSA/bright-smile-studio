import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Heart, Shield, Users, CheckCircle2, Calendar } from "lucide-react";
import dentistImage from "@/assets/dentist-portrait.jpg";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Bienveillance",
      description: "Une approche humaine et à l'écoute pour des soins en toute confiance.",
    },
    {
      icon: Shield,
      title: "Excellence",
      description: "Des techniques de pointe et une formation continue pour les meilleurs soins.",
    },
    {
      icon: Users,
      title: "Accessibilité",
      description: "Des soins de qualité accessibles à tous, avec des solutions de financement.",
    },
  ];

  const qualifications = [
    "Doctorat en Chirurgie Dentaire - Université Paris Descartes",
    "Spécialisation en Orthodontie - Faculté de Médecine de Paris",
    "Certificat en Implantologie Avancée",
    "Formation continue en Dentisterie Esthétique",
    "Membre de l'Association Dentaire Française",
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              À propos
            </span>
            <h1 className="section-title mt-2 text-4xl md:text-5xl">
              Une équipe passionnée à votre service
            </h1>
            <p className="section-subtitle mt-4">
              Découvrez notre cabinet et notre engagement pour votre santé bucco-dentaire.
            </p>
          </div>
        </div>
      </section>

      {/* Doctor Profile */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <img
                src={dentistImage}
                alt="Dr. Sophie Martin"
                className="rounded-2xl shadow-dental-xl w-full max-w-md"
              />
            </div>
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Votre Dentiste
              </span>
              <h2 className="section-title mt-2">
                Dr. Sophie Martin
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Chirurgien-dentiste diplômée, passionnée par mon métier depuis plus de 15 ans.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Après mes études à l'Université Paris Descartes, j'ai perfectionné ma pratique 
                à travers diverses spécialisations, notamment en orthodontie et en implantologie. 
                Mon objectif est d'offrir à chaque patient des soins personnalisés et de qualité, 
                dans un environnement où il se sent en confiance.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Je crois fermement que la prévention et l'éducation sont les clés d'une bonne 
                santé bucco-dentaire. C'est pourquoi je prends le temps d'expliquer chaque 
                traitement et de répondre à toutes vos questions.
              </p>

              {/* Qualifications */}
              <div className="bg-muted rounded-xl p-6 mb-8">
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Qualifications et Diplômes
                </h3>
                <ul className="space-y-3">
                  {qualifications.map((qual, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Notre Mission
            </span>
            <h2 className="section-title mt-2">
              Des soins dentaires d'excellence pour tous
            </h2>
            <p className="section-subtitle mx-auto mt-4">
              Notre mission est de rendre les soins dentaires de qualité accessibles à tous, 
              en combinant expertise technique et approche humaine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-8 text-center shadow-dental card-hover"
              >
                <div className="icon-container mx-auto mb-6">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cabinet */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Notre Cabinet
            </span>
            <h2 className="section-title mt-2">
              Un environnement moderne et accueillant
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted rounded-xl p-8">
              <h3 className="font-display text-xl font-semibold mb-4">
                Équipements de pointe
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Radiographie numérique 3D</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Scanner intra-oral</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Laser dentaire</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Système de stérilisation avancé</span>
                </li>
              </ul>
            </div>
            <div className="bg-muted rounded-xl p-8">
              <h3 className="font-display text-xl font-semibold mb-4">
                Confort patient
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Fauteuils ergonomiques</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Ambiance relaxante</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Accessibilité PMR</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Salle d'attente confortable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Rencontrez notre équipe
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-xl mx-auto">
            Prenez rendez-vous pour une première consultation et découvrez notre approche personnalisée.
          </p>
          <Button variant="accent" size="xl" asChild>
            <Link to="/appointment">
              <Calendar className="w-5 h-5" />
              Prendre Rendez-vous
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default About;
