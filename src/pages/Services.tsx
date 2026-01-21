import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Sparkles, 
  Shield, 
  Heart, 
  Scissors, 
  Baby,
  Calendar,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Stethoscope,
      title: "Consultation et Diagnostic",
      description: "Un examen complet de votre santé bucco-dentaire avec un plan de traitement personnalisé adapté à vos besoins.",
      features: [
        "Examen clinique approfondi",
        "Radiographie numérique",
        "Dépistage des caries et maladies parodontales",
        "Plan de traitement personnalisé",
      ],
      price: "À partir de 25€",
    },
    {
      icon: Sparkles,
      title: "Blanchiment Dentaire",
      description: "Retrouvez un sourire éclatant grâce à nos techniques de blanchiment professionnelles et sécurisées.",
      features: [
        "Blanchiment en cabinet",
        "Kit de blanchiment à domicile",
        "Résultats durables",
        "Techniques sans douleur",
      ],
      price: "À partir de 350€",
    },
    {
      icon: Shield,
      title: "Orthodontie",
      description: "Alignement dentaire discret avec des solutions modernes adaptées à tous les âges.",
      features: [
        "Appareils traditionnels",
        "Gouttières invisibles",
        "Orthodontie pour adultes",
        "Suivi personnalisé",
      ],
      price: "Devis personnalisé",
    },
    {
      icon: Heart,
      title: "Implants Dentaires",
      description: "Remplacement de dents manquantes avec des implants durables et à l'aspect naturel.",
      features: [
        "Implants en titane",
        "Chirurgie mini-invasive",
        "Prothèses sur implants",
        "Garantie à vie sur l'implant",
      ],
      price: "À partir de 1200€",
    },
    {
      icon: Scissors,
      title: "Chirurgie Buccale",
      description: "Interventions chirurgicales réalisées avec expertise et dans le respect de votre confort.",
      features: [
        "Extraction de dents de sagesse",
        "Greffes osseuses",
        "Chirurgie parodontale",
        "Régénération tissulaire",
      ],
      price: "Selon intervention",
    },
    {
      icon: Baby,
      title: "Pédodontie",
      description: "Soins dentaires adaptés aux enfants dans une ambiance ludique et rassurante.",
      features: [
        "Première visite dès 3 ans",
        "Prévention des caries",
        "Scellement des sillons",
        "Éducation à l'hygiène",
      ],
      price: "À partir de 30€",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Nos Services
            </span>
            <h1 className="section-title mt-2 text-4xl md:text-5xl">
              Des soins dentaires complets pour toute la famille
            </h1>
            <p className="section-subtitle mt-4">
              Découvrez notre gamme de services dentaires utilisant les dernières technologies 
              pour des résultats optimaux.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl shadow-dental overflow-hidden card-hover"
              >
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Service Info */}
                  <div className="md:col-span-2 p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="icon-container flex-shrink-0">
                        <service.icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                          {service.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div className="ml-20 grid sm:grid-cols-2 gap-3 mt-6">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Price & CTA */}
                  <div className="bg-muted p-8 flex flex-col justify-center items-center text-center">
                    <p className="text-sm text-muted-foreground mb-2">Tarif</p>
                    <p className="font-display text-2xl font-bold text-foreground mb-4">
                      {service.price}
                    </p>
                    <Button variant="default" asChild>
                      <Link to="/appointment">
                        Prendre RDV
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Info */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">
              Prise en charge et remboursements
            </h2>
            <p className="section-subtitle mx-auto mt-4 mb-8">
              Nous travaillons avec toutes les mutuelles et proposons des facilités de paiement 
              pour rendre les soins accessibles à tous.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl p-6 shadow-dental">
                <h3 className="font-display text-lg font-semibold mb-2">Sécurité Sociale</h3>
                <p className="text-sm text-muted-foreground">
                  Conventionné secteur 1 pour les soins de base
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-dental">
                <h3 className="font-display text-lg font-semibold mb-2">Mutuelles</h3>
                <p className="text-sm text-muted-foreground">
                  Partenaire de toutes les complémentaires santé
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-dental">
                <h3 className="font-display text-lg font-semibold mb-2">Facilités</h3>
                <p className="text-sm text-muted-foreground">
                  Paiement en plusieurs fois sans frais possible
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Une question sur nos services ?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-xl mx-auto">
            Contactez-nous pour obtenir un devis personnalisé ou prendre rendez-vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="xl" asChild>
              <Link to="/appointment">
                <Calendar className="w-5 h-5" />
                Prendre Rendez-vous
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
