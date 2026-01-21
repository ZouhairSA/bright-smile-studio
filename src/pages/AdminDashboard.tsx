import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

type StoredUser = {
  id: number;
  full_name: string;
  email: string;
  role?: string;
};

type AdminUserRow = {
  id: number;
  full_name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
};

type AdminAppointmentRow = {
  id: number;
  user_id: number | null;
  user_full_name: string | null;
  user_email: string | null;
  name: string;
  email: string;
  phone: string;
  appointment_date: string;
  message: string | null;
};

type AdminContactRow = {
  id: number;
  user_id: number | null;
  user_full_name: string | null;
  user_email: string | null;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

const STORAGE_KEY = "bss_user";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const apiBase = useMemo(() => import.meta.env.BASE_URL, []);

  const [me, setMe] = useState<StoredUser | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [appointments, setAppointments] = useState<AdminAppointmentRow[]>([]);
  const [contacts, setContacts] = useState<AdminContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Simple local state for "add user" form
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"user" | "admin">("user");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      navigate("/login", { replace: true });
      return;
    }
    try {
      const parsed = JSON.parse(raw) as StoredUser;
      setMe(parsed);
      if (parsed.role !== "admin") {
        navigate("/dashboard", { replace: true });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [uRes, aRes, cRes] = await Promise.all([
        fetch(`${apiBase}backend/admin/users.php`, { credentials: "include" }),
        fetch(`${apiBase}backend/admin/appointments.php`, { credentials: "include" }),
        fetch(`${apiBase}backend/admin/contacts.php`, { credentials: "include" }),
      ]);

      // If the session is not admin, backend returns 403.
      if ([uRes, aRes, cRes].some(r => r.status === 403)) {
        setError("Accès refusé. Connectez-vous avec un compte administrateur.");
        return;
      }

      const uData = (await uRes.json()) as { success: boolean; users?: AdminUserRow[]; message?: string };
      const aData = (await aRes.json()) as { success: boolean; appointments?: AdminAppointmentRow[]; message?: string };
      const cData = (await cRes.json()) as { success: boolean; contacts?: AdminContactRow[]; message?: string };

      if (!uData.success || !aData.success || !cData.success) {
        setError("Erreur lors du chargement des données admin.");
        return;
      }

      setUsers(uData.users || []);
      setAppointments(aData.appointments || []);
      setContacts(cData.contacts || []);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      await loadData();
    };

    load();
  }, [apiBase]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch(`${apiBase}backend/logout.php`, { method: "POST", credentials: "include" });
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setIsLoggingOut(false);
      navigate("/", { replace: true });
    }
  };

  const postAdminForm = async (endpoint: string, formData: FormData) => {
    const res = await fetch(`${apiBase}${endpoint}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = (await res.json()) as { success: boolean; message?: string };
    if (!data.success) {
      throw new Error(data.message || "Erreur serveur");
    }
  };

  // Users CRUD
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword) return;

    const fd = new FormData();
    fd.append("action", "create");
    fd.append("full_name", newUserName.trim());
    fd.append("email", newUserEmail.trim());
    fd.append("password", newUserPassword);
    fd.append("role", newUserRole);

    try {
      await postAdminForm("backend/admin/users.php", fd);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("user");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de l'utilisateur.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    const fd = new FormData();
    fd.append("action", "delete");
    fd.append("id", String(id));

    try {
      await postAdminForm("backend/admin/users.php", fd);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression de l'utilisateur.");
    }
  };

  const handleEditUser = async (user: AdminUserRow) => {
    const newName = window.prompt("Nom complet", user.full_name) ?? user.full_name;
    const newEmail = window.prompt("Email", user.email) ?? user.email;
    const newRole = window.prompt("Rôle (user/admin)", user.role) ?? user.role;
    const normalizedRole = newRole === "admin" ? "admin" : "user";

    const fd = new FormData();
    fd.append("action", "update");
    fd.append("id", String(user.id));
    fd.append("full_name", newName);
    fd.append("email", newEmail);
    fd.append("role", normalizedRole);

    try {
      await postAdminForm("backend/admin/users.php", fd);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour de l'utilisateur.");
    }
  };

  // Appointments CRUD (edit/delete via prompts for simplicité académique)
  const handleDeleteAppointment = async (id: number) => {
    if (!window.confirm("Supprimer ce rendez-vous ?")) return;
    const fd = new FormData();
    fd.append("action", "delete");
    fd.append("id", String(id));
    try {
      await postAdminForm("backend/admin/appointments.php", fd);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression du rendez-vous.");
    }
  };

  const handleEditAppointment = async (appt: AdminAppointmentRow) => {
    const name = window.prompt("Nom", appt.name) ?? appt.name;
    const email = window.prompt("Email", appt.email) ?? appt.email;
    const phone = window.prompt("Téléphone", appt.phone) ?? appt.phone;
    const date = window.prompt("Date (YYYY-MM-DD HH:MM)", appt.appointment_date.slice(0, 16)) ??
      appt.appointment_date.slice(0, 16);
    const message = window.prompt("Message", appt.message ?? "") ?? appt.message ?? "";

    const fd = new FormData();
    fd.append("action", "update");
    fd.append("id", String(appt.id));
    fd.append("name", name);
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("appointment_date", date);
    fd.append("message", message);

    try {
      await postAdminForm("backend/admin/appointments.php", fd);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du rendez-vous.");
    }
  };

  // Contacts CRUD
  const handleDeleteContact = async (id: number) => {
    if (!window.confirm("Supprimer ce message de contact ?")) return;
    const fd = new FormData();
    fd.append("action", "delete");
    fd.append("id", String(id));
    try {
      await postAdminForm("backend/admin/contacts.php", fd);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression du message.");
    }
  };

  const handleEditContact = async (c: AdminContactRow) => {
    const name = window.prompt("Nom", c.name) ?? c.name;
    const email = window.prompt("Email", c.email) ?? c.email;
    const message = window.prompt("Message", c.message) ?? c.message;

    const fd = new FormData();
    fd.append("action", "update");
    fd.append("id", String(c.id));
    fd.append("name", name);
    fd.append("email", email);
    fd.append("message", message);

    try {
      await postAdminForm("backend/admin/contacts.php", fd);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du message.");
    }
  };

  return (
    <Layout>
      <section className="section-padding bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-dental">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">
                    Dashboard Administrateur
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {me?.full_name ? (
                      <>
                        Connecté en tant que <span className="font-medium text-foreground">{me.full_name}</span> (admin)
                      </>
                    ) : (
                      "Espace d'administration"
                    )}
                  </p>
                </div>

                <Button variant="secondary" onClick={handleLogout} disabled={isLoggingOut}>
                  {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
                </Button>
              </div>

              {error && (
                <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {loading ? (
                <p className="mt-8 text-muted-foreground">Chargement...</p>
              ) : (
                <div className="mt-8 space-y-10">
                  {/* Users */}
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      Utilisateurs ({users.length})
                    </h2>
                    <form onSubmit={handleCreateUser} className="mt-4 flex flex-wrap gap-3 items-end">
                      <input
                        type="text"
                        placeholder="Nom complet"
                        className="form-input max-w-xs"
                        value={newUserName}
                        onChange={e => setNewUserName(e.target.value)}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="form-input max-w-xs"
                        value={newUserEmail}
                        onChange={e => setNewUserEmail(e.target.value)}
                      />
                      <input
                        type="password"
                        placeholder="Mot de passe"
                        className="form-input max-w-xs"
                        value={newUserPassword}
                        onChange={e => setNewUserPassword(e.target.value)}
                      />
                      <select
                        className="form-input max-w-[140px]"
                        value={newUserRole}
                        onChange={e => setNewUserRole(e.target.value as "user" | "admin")}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <Button type="submit" size="sm">
                        Ajouter
                      </Button>
                    </form>
                    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/60">
                          <tr className="text-left">
                            <th className="p-3">ID</th>
                            <th className="p-3">Nom</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Rôle</th>
                            <th className="p-3">Créé le</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(u => (
                            <tr key={u.id} className="border-t border-border">
                              <td className="p-3">{u.id}</td>
                              <td className="p-3">{u.full_name}</td>
                              <td className="p-3">{u.email}</td>
                              <td className="p-3">{u.role}</td>
                              <td className="p-3">{u.created_at}</td>
                              <td className="p-3 text-right space-x-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditUser(u)}
                                >
                                  Modifier
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteUser(u.id)}
                                >
                                  Supprimer
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Appointments */}
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      Rendez-vous ({appointments.length})
                    </h2>
                    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/60">
                          <tr className="text-left">
                            <th className="p-3">ID</th>
                            <th className="p-3">User</th>
                            <th className="p-3">Nom</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Téléphone</th>
                            <th className="p-3">Date</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map(a => (
                            <tr key={a.id} className="border-t border-border">
                              <td className="p-3">{a.id}</td>
                              <td className="p-3">
                                {a.user_id ? `${a.user_full_name ?? "—"} (#${a.user_id})` : "—"}
                              </td>
                              <td className="p-3">{a.name}</td>
                              <td className="p-3">{a.email}</td>
                              <td className="p-3">{a.phone}</td>
                              <td className="p-3">{a.appointment_date}</td>
                              <td className="p-3 text-right space-x-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditAppointment(a)}
                                >
                                  Modifier
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteAppointment(a.id)}
                                >
                                  Supprimer
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Astuce: `user_id` est rempli seulement si l'utilisateur était connecté lors de la demande.
                    </p>
                  </div>

                  {/* Contacts */}
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      Messages de contact ({contacts.length})
                    </h2>
                    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/60">
                          <tr className="text-left">
                            <th className="p-3">ID</th>
                            <th className="p-3">User</th>
                            <th className="p-3">Nom</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Créé le</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.map(c => (
                            <tr key={c.id} className="border-t border-border">
                              <td className="p-3">{c.id}</td>
                              <td className="p-3">
                                {c.user_id ? `${c.user_full_name ?? "—"} (#${c.user_id})` : "—"}
                              </td>
                              <td className="p-3">{c.name}</td>
                              <td className="p-3">{c.email}</td>
                              <td className="p-3">{c.created_at}</td>
                              <td className="p-3 text-right space-x-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditContact(c)}
                                >
                                  Modifier
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteContact(c.id)}
                                >
                                  Supprimer
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;

