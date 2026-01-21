import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  message?: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Le nom est requis";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Veuillez entrer un email valide";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitted(false); // Reset in case of error

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message + (formData.subject ? `\n\nSujet: ${formData.subject}` : ''));

      const response = await fetch('/bright-smile-studio/backend/contact.php', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include', // Include session cookie if user is logged in
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        // Handle validation errors from backend
        if (data.errors) {
          const backendErrors: FormErrors = {};
          if (data.errors.name) backendErrors.fullName = data.errors.name;
          if (data.errors.email) backendErrors.email = data.errors.email;
          if (data.errors.message) backendErrors.message = data.errors.message;
          setErrors(backendErrors);
        } else {
          alert(data.message || 'Erreur lors de l\'envoi du message.');
        }
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      content: "+212 6 12 34 56 78",
      link: "tel:+212612345678",
    },
    {
      icon: Mail,
      title: "Email",
      content: "contact@brightsmilestudio.ma",
      link: "mailto:contact@brightsmilestudio.ma",
    },
    {
      icon: MapPin,
      title: "Adresse",
      content: "123 Boulevard Mohammed V, Casablanca 20000, Maroc",
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Horaires",
      content: "Lun-Ven: 9h-19h | Sam: 9h-13h",
      link: null,
    },
  ];

  if (isSubmitted) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Message envoyé !
              </h1>
              <p className="text-muted-foreground mb-8">
                Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>
                Envoyer un autre message
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Contact
            </span>
            <h1 className="section-title mt-2 text-4xl md:text-5xl">
              Contactez-nous
            </h1>
            <p className="section-subtitle mt-4">
              Une question ? Besoin d'informations ? N'hésitez pas à nous contacter.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold">
                Nos coordonnées
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <h3 className="font-display text-lg font-semibold mb-4">
                  Notre localisation
                </h3>
                <div className="bg-muted rounded-xl overflow-hidden h-64 flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      Carte Google Maps<br />
                      <span className="text-xs">(Intégration à venir avec PHP)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-dental">
                <h2 className="font-display text-2xl font-semibold mb-6">
                  Envoyez-nous un message
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="form-label">
                      Nom complet <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`form-input ${errors.fullName ? "error" : ""}`}
                      placeholder="Jean Dupont"
                    />
                    {errors.fullName && (
                      <p className="form-error">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="form-label">
                      Adresse email <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? "error" : ""}`}
                      placeholder="jean.dupont@email.com"
                    />
                    {errors.email && (
                      <p className="form-error">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="form-label">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+212 6 12 34 56 78"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="form-label">
                      Sujet
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">Sélectionner un sujet</option>
                      <option value="question">Question générale</option>
                      <option value="rdv">Prise de rendez-vous</option>
                      <option value="devis">Demande de devis</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-6">
                  <label htmlFor="message" className="form-label">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`form-input resize-none ${errors.message ? "error" : ""}`}
                    placeholder="Votre message..."
                  />
                  {errors.message && (
                    <p className="form-error">{errors.message}</p>
                  )}
                </div>

                <div className="mt-8">
                  <Button type="submit" size="lg">
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
