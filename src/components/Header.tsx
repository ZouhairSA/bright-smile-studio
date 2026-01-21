import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Accueil" },
    { path: "/about", label: "À propos" },
    { path: "/services", label: "Services" },
    { path: "/appointment", label: "Rendez-vous" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
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
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-foreground">
                Cabinet Dentaire
              </span>
              <span className="text-xs text-muted-foreground">Dr. Jihane  ouaanda</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+212612345678"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+212 6 12 34 56 78</span>
            </a>
            <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Connexion
            </Link>
            <Link
              to="/appointment"
              className="btn-accent text-sm"
            >
              Prendre RDV
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              <Link
                to="/login"
                className="px-4 py-3 text-foreground hover:bg-muted rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="px-4 py-3 text-foreground hover:bg-muted rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Inscription
              </Link>
              <Link
                to="/appointment"
                className="mx-4 mt-2 btn-accent text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Prendre RDV
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
