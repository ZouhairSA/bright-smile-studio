import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  date?: string;
  service?: string;
}

const Appointment = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    "Consultation générale",
    "Blanchiment dentaire",
    "Orthodontie",
    "Implants dentaires",
    "Chirurgie buccale",
    "Pédodontie",
    "Urgence dentaire",
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Le nom complet est requis";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Le nom doit contenir au moins 2 caractères";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est requise";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide";
    }

    // Phone validation
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Veuillez entrer un numéro de téléphone français valide";
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = "Veuillez sélectionner une date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "La date ne peut pas être dans le passé";
      }
    }

    // Service validation
    if (!formData.service) {
      newErrors.service = "Veuillez sélectionner un service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Form is valid - in a real app, this would send to PHP backend
      setIsSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

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
                Demande envoyée !
              </h1>
              <p className="text-muted-foreground mb-8">
                Merci {formData.fullName.split(" ")[0]} ! Votre demande de rendez-vous a été 
                enregistrée. Nous vous contacterons rapidement pour confirmer votre rendez-vous.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>
                Nouvelle demande
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
              Rendez-vous
            </span>
            <h1 className="section-title mt-2 text-4xl md:text-5xl">
              Prenez rendez-vous en ligne
            </h1>
            <p className="section-subtitle mt-4">
              Remplissez le formulaire ci-dessous et nous vous contacterons pour confirmer votre rendez-vous.
            </p>
          </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-dental">
                <h2 className="font-display text-2xl font-semibold mb-6">
                  Formulaire de demande
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
                      Téléphone <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? "error" : ""}`}
                      placeholder="06 12 34 56 78"
                    />
                    {errors.phone && (
                      <p className="form-error">{errors.phone}</p>
                    )}
                  </div>

                  {/* Service */}
                  <div>
                    <label htmlFor="service" className="form-label">
                      Service souhaité <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={`form-input ${errors.service ? "error" : ""}`}
                    >
                      <option value="">Sélectionner un service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className="form-error">{errors.service}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label htmlFor="date" className="form-label">
                      Date souhaitée <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`form-input ${errors.date ? "error" : ""}`}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.date && (
                      <p className="form-error">{errors.date}</p>
                    )}
                  </div>

                  {/* Time */}
                  <div>
                    <label htmlFor="time" className="form-label">
                      Heure préférée
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">Pas de préférence</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-6">
                  <label htmlFor="message" className="form-label">
                    Message (optionnel)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="form-input resize-none"
                    placeholder="Décrivez brièvement le motif de votre consultation..."
                  />
                </div>

                <div className="mt-8">
                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    <Calendar className="w-5 h-5" />
                    Envoyer la demande
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Hours */}
              <div className="bg-card rounded-xl p-6 shadow-dental">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">
                    Horaires d'ouverture
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lundi - Vendredi</span>
                    <span className="font-medium text-foreground">9h00 - 19h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Samedi</span>
                    <span className="font-medium text-foreground">9h00 - 13h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimanche</span>
                    <span className="font-medium text-foreground">Fermé</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <h3 className="font-display text-lg font-semibold mb-3">
                  À savoir
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Confirmation par email sous 24h</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Merci de prévoir votre carte vitale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>En cas d'empêchement, prévenez-nous 24h avant</span>
                  </li>
                </ul>
              </div>

              {/* Emergency */}
              <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Urgence dentaire ?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pour les urgences, appelez-nous directement :
                </p>
                <a
                  href="tel:+33123456789"
                  className="inline-flex items-center gap-2 text-accent font-bold text-lg hover:underline"
                >
                  01 23 45 67 89
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Appointment;
