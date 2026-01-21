import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { LogIn, Eye, EyeOff } from "lucide-react";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBase = useMemo(() => import.meta.env.BASE_URL, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Veuillez entrer un email valide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setServerError(null);

      try {
        const fd = new FormData();
        fd.append("email", formData.email.trim());
        fd.append("password", formData.password);

        const res = await fetch(`${apiBase}backend/login.php`, {
          method: "POST",
          body: fd,
          credentials: "include",
        });

        const data = (await res.json()) as {
          success: boolean;
          message?: string;
          user?: { id: number; full_name: string; email: string; role?: string };
        };

        if (!data.success) {
          setServerError(data.message || "Identifiants incorrects.");
          return;
        }

        // Store user for a simple "Espace patient" page (academic demo).
        if (data.user) {
          localStorage.setItem("bss_user", JSON.stringify(data.user));
        }

        if (data.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } catch {
        setServerError("Erreur réseau. Veuillez réessayer.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError(null);
  };

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-dental-xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Connexion
                </h1>
                <p className="text-muted-foreground text-sm mt-2">
                  Accédez à votre espace patient
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {serverError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {serverError}
                  </div>
                )}
                {/* Email */}
                <div>
                  <label htmlFor="email" className="form-label">
                    Adresse email
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

                {/* Password */}
                <div>
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-input pr-12 ${errors.password ? "error" : ""}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="form-error">{errors.password}</p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <a
                    href="#"
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Connexion..." : "Se connecter"}
                </Button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Pas encore de compte ?{" "}
                  <Link
                    to="/register"
                    className="text-primary font-medium hover:underline"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
