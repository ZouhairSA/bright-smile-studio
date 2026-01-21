import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

type StoredUser = {
  id: number;
  full_name: string;
  email: string;
};

const STORAGE_KEY = "bss_user";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const apiBase = useMemo(() => import.meta.env.BASE_URL, []);

  useEffect(() => {
    // For an academic project, we store the last logged-in user locally
    // to display a simple "Espace patient" page after login.
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      navigate("/login", { replace: true });
      return;
    }
    try {
      setUser(JSON.parse(raw) as StoredUser);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch(`${apiBase}backend/logout.php`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setIsLoggingOut(false);
      navigate("/", { replace: true });
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <section className="section-padding bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-dental">
              <h1 className="font-display text-3xl font-bold text-foreground">
                Espace patient
              </h1>
              <p className="text-muted-foreground mt-2">
                Bienvenue <span className="font-medium text-foreground">{user.full_name}</span>.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-background p-5">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Informations
                  </h2>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Email:</span> {user.email}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">ID:</span> {user.id}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-5">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Actions rapides
                  </h2>
                  <div className="mt-4 flex flex-col gap-3">
                    <Button asChild size="lg">
                      <Link to="/appointment">Prendre un rendez-vous</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/contact">Contacter le cabinet</Link>
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-6">
                Note: cette page est une interface simple pour le projet universitaire (session PHP + affichage côté client).
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;

