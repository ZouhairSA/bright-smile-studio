import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6 text-primary-foreground"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2C8 2 5 5 4 9c-1 4 0 8 1 12 .5 2 2 3 4 2 1-.5 2-2 3-4 1 2 2 3.5 3 4 2 1 3.5 0 4-2 1-4 2-8 1-12-1-4-4-7-8-7z" />
                </svg>
              </div>
              <span className="font-display text-xl font-bold">Cabinet Dentaire</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Votre santé bucco-dentaire est notre priorité. Nous offrons des soins dentaires 
              de qualité dans un environnement moderne et accueillant.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Liens Rapides</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                Accueil
              </Link>
              <Link to="/about" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                À propos
              </Link>
              <Link to="/services" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                Nos Services
              </Link>
              <Link to="/appointment" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                Prendre Rendez-vous
              </Link>
              <Link to="/contact" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Nos Services</h3>
            <nav className="flex flex-col gap-3">
              <span className="text-primary-foreground/70 text-sm">Consultation dentaire</span>
              <span className="text-primary-foreground/70 text-sm">Orthodontie</span>
              <span className="text-primary-foreground/70 text-sm">Blanchiment dentaire</span>
              <span className="text-primary-foreground/70 text-sm">Implants dentaires</span>
              <span className="text-primary-foreground/70 text-sm">Chirurgie buccale</span>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Contact</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70 text-sm">
                  123 Avenue des Champs-Élysées<br />75008 Paris, France
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+33123456789" className="text-primary-foreground/70 text-sm hover:text-primary transition-colors">
                  01 23 45 67 89
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:contact@cabinet-dentaire.fr" className="text-primary-foreground/70 text-sm hover:text-primary transition-colors">
                  contact@cabinet-dentaire.fr
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-primary-foreground/70 text-sm">
                  <p>Lun - Ven: 9h00 - 19h00</p>
                  <p>Sam: 9h00 - 13h00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © {currentYear} Cabinet Dentaire. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-primary-foreground/50 text-sm hover:text-primary transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-primary-foreground/50 text-sm hover:text-primary transition-colors">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
