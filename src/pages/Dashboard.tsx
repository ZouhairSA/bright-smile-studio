import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Phone, Mail, MessageSquare } from "lucide-react";

type StoredUser = {
  id: number;
  full_name: string;
  email: string;
};

type Appointment = {
  id: number;
  name: string;
  email: string;
  phone: string;
  appointment_date: string;
  message: string | null;
};

const STORAGE_KEY = "bss_user";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const apiBase = useMemo(() => import.meta.env.BASE_URL, []);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      navigate("/login", { replace: true });
      return;
    }
    try {
      const parsedUser = JSON.parse(raw) as StoredUser;
      setUser(parsedUser);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!user?.email) return;

    const loadAppointments = async () => {
      setLoadingAppointments(true);
      try {
        const response = await fetch(
          `${apiBase}backend/user_appointments.php?email=${encodeURIComponent(user.email)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = (await response.json()) as {
          success: boolean;
          appointments?: Appointment[];
          message?: string;
        };

        if (data.success && data.appointments) {
          setAppointments(data.appointments);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous:", error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    loadAppointments();
  }, [user?.email, apiBase]);

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

              {appointments.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Historique de vos rendez-vous ({appointments.length})
                  </h2>
                  <div className="space-y-4">
                    {appointments.map((appointment) => {
                      const appointmentDate = new Date(appointment.appointment_date);
                      const formattedDate = appointmentDate.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                      const formattedTime = appointmentDate.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <div
                          key={appointment.id}
                          className="rounded-xl border border-border bg-background p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                <h3 className="font-display text-lg font-semibold text-foreground">
                                  Rendez-vous #{appointment.id}
                                </h3>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {formattedDate} à {formattedTime}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Phone className="w-4 h-4" />
                                  <span>{appointment.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Mail className="w-4 h-4" />
                                  <span>{appointment.email}</span>
                                </div>
                                {appointment.message && (
                                  <div className="flex items-start gap-2 text-muted-foreground mt-3 pt-3 border-t border-border">
                                    <MessageSquare className="w-4 h-4 mt-0.5" />
                                    <span className="flex-1">{appointment.message}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  appointmentDate >= new Date()
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {appointmentDate >= new Date() ? "À venir" : "Passé"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!loadingAppointments && appointments.length === 0 && (
                <div className="mt-8 rounded-xl border border-border bg-background p-8 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Vous n'avez pas encore de rendez-vous enregistré.
                  </p>
                  <Button asChild className="mt-4">
                    <Link to="/appointment">Prendre un rendez-vous</Link>
                  </Button>
                </div>
              )}

              {loadingAppointments && (
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground">Chargement de vos rendez-vous...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;

