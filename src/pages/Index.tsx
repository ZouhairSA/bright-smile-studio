import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { 
  Calendar, 
  Shield, 
  Award, 
  Heart, 
  Sparkles, 
  Stethoscope, 
  ChevronRight,
  Phone,
  Star
} from "lucide-react";
import heroImage from "@/assets/hero-dental.jpg";
import dentistImage from "@/assets/dentist-portrait.jpg";

const Index = () => {
  const services = [
    {
      icon: Stethoscope,
      title: "Consultation",
      description: "Bilan complet de votre santé bucco-dentaire avec un plan de traitement personnalisé.",
    },
    {
      icon: Sparkles,
      title: "Blanchiment",
      description: "Retrouvez un sourire éclatant grâce à nos techniques de blanchiment professionnelles.",
    },
    {
      icon: Shield,
      title: "Orthodontie",
      description: "Alignement dentaire discret avec des solutions adaptées à tous les âges.",
    },
    {
      icon: Heart,
      title: "Implants",
      description: "Remplacement de dents manquantes avec des implants durables et naturels.",
    },
  ];

  const stats = [
    { value: "15+", label: "Années d'expérience" },
    { value: "5000+", label: "Patients satisfaits" },
    { value: "98%", label: "Taux de satisfaction" },
    { value: "24h", label: "Urgences disponibles" },
  ];

  const testimonials = [
    {
      name: "Marie Dupont",
      text: "Un cabinet moderne et une équipe vraiment à l'écoute. Je recommande vivement !",
      rating: 5,
    },
    {
      name: "Pierre Martin",
      text: "Excellent suivi orthodontique pour ma fille. Résultats impressionnants.",
      rating: 5,
    },
    {
      name: "Sophie Leroy",
      text: "Professionnalisme et douceur. Plus de peur du dentiste !",
      rating: 5,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Cabinet dentaire moderne"
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-slide-up">
            <span className="inline-block px-4 py-2 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm">
              ✨ Cabinet Dentaire à Paris
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              Votre sourire,
              <br />
              notre priorité
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Nous offrons des soins dentaires d'excellence dans un environnement 
              moderne et chaleureux. Prenez rendez-vous dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="accent" size="xl" asChild>
                <Link to="/appointment">
                  <Calendar className="w-5 h-5" />
                  Prendre Rendez-vous
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/services">
                  Découvrir nos services
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Stats Card */}
        <div className="hidden lg:block absolute bottom-12 right-12 bg-card/95 backdrop-blur-md rounded-2xl p-6 shadow-dental-xl animate-slide-in-right">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Urgences dentaires</p>
              <p className="font-display text-xl font-bold text-foreground">01 23 45 67 89</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Disponible 7j/7 pour les urgences</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-2">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={dentistImage}
                alt="Dr. Sophie Martin"
                className="rounded-2xl shadow-dental-xl w-full max-w-md mx-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-8 h-8" />
                  <div>
                    <p className="font-bold text-lg">15 ans</p>
                    <p className="text-sm opacity-90">d'expertise</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                À propos de nous
              </span>
              <h2 className="section-title mt-2">
                Dr. Sophie Martin
              </h2>
              <p className="section-subtitle mb-6">
                Chirurgien-dentiste diplômée de l'Université Paris Descartes, je mets mon 
                expertise au service de votre santé bucco-dentaire depuis plus de 15 ans.
              </p>
              <p className="text-muted-foreground mb-8">
                Notre cabinet allie technologie de pointe et approche humaine pour vous 
                offrir les meilleurs soins dans un cadre rassurant. Votre confort et votre 
                bien-être sont au cœur de notre pratique.
              </p>
              <Button variant="default" size="lg" asChild>
                <Link to="/about">
                  En savoir plus
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-muted tooth-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Nos Services
            </span>
            <h2 className="section-title mt-2">
              Des soins complets pour toute la famille
            </h2>
            <p className="section-subtitle mx-auto">
              Découvrez notre gamme complète de soins dentaires adaptés à tous vos besoins.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="service-card group"
              >
                <div className="icon-container service-icon mb-4">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="default" size="lg" asChild>
              <Link to="/services">
                Voir tous nos services
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Témoignages
            </span>
            <h2 className="section-title mt-2">
              Ce que disent nos patients
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 shadow-dental card-hover"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                <p className="font-medium text-foreground">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 tooth-pattern opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Prêt à transformer votre sourire ?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-xl mx-auto">
            Prenez rendez-vous dès maintenant et découvrez notre approche personnalisée des soins dentaires.
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

export default Index;
