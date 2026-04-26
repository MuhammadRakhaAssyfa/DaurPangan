import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sprout, Store, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { providerTypes, type ProviderType } from "@/lib/mock-data";
import { useAuth, type Role } from "@/lib/auth";

interface AuthFormProps {
  mode: "login" | "register";
}

type Step = "role" | "providerType" | "details";

export const AuthForm = ({ mode }: AuthFormProps) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialRole = (params.get("role") as Role) || "recipient";
  const [role, setRole] = useState<Role>(initialRole);
  const [providerType, setProviderType] = useState<ProviderType | null>(null);

  // Step machine — login has only "details"
  const initialStep: Step = mode === "login" ? "details" : "role";
  const [step, setStep] = useState<Step>(initialStep);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleNext = () => {
    if (role === "provider") setStep("providerType");
    else setStep("details");
  };

  const handleProviderTypeNext = () => {
    if (!providerType) {
      toast.error("Pilih tipe penyedia terlebih dahulu");
      return;
    }
    setStep("details");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRole: Role = mode === "register" ? role : (params.get("role") as Role) || "recipient";
    login({
      name: name || email.split("@")[0] || "Pengguna",
      email: email || "demo@daurpangan.id",
      role: finalRole,
      providerType: finalRole === "provider" ? providerType ?? "restoran" : undefined,
    });
    toast.success(mode === "login" ? "Selamat datang kembali!" : "Akun berhasil dibuat!");
    navigate(finalRole === "provider" ? "/provider/dashboard" : "/recipient");
  };

  return (
    <div className="min-h-screen flex bg-gradient-soft">
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-hero p-12">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-80 w-80 rounded-full bg-primary-glow/40 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between text-primary-foreground">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/15 backdrop-blur">
              <Sprout className="h-5 w-5" />
            </span>
            DaurPangan
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight">
              Selamatkan makanan,
              <br />selamatkan bumi.
            </h2>
            <p className="mt-4 max-w-md opacity-85">
              Bergabunglah dengan ribuan orang baik yang telah menyelamatkan lebih dari 12 ton makanan tahun ini.
            </p>
          </div>
          <p className="text-sm opacity-70">© DaurPangan · Indonesia</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 font-display font-bold mb-8">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground">
              <Sprout className="h-5 w-5" />
            </span>
            DaurPangan
          </Link>

          {mode === "register" && step !== "role" && (
            <button
              onClick={() => setStep(step === "details" && role === "provider" ? "providerType" : "role")}
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali
            </button>
          )}

          <h1 className="font-display text-3xl font-bold">
            {mode === "login" && "Masuk ke akun"}
            {mode === "register" && step === "role" && "Buat akun baru"}
            {mode === "register" && step === "providerType" && "Tipe penyedia"}
            {mode === "register" && step === "details" && "Lengkapi data Anda"}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {mode === "login" && "Senang bertemu lagi! Lanjutkan misi Anda."}
            {mode === "register" && step === "role" && "Pilih peran Anda di DaurPangan."}
            {mode === "register" && step === "providerType" &&
              "Beri tahu kami jenis penyedia Anda agar penerima mudah mengenali."}
            {mode === "register" && step === "details" &&
              (role === "provider" ? "Akun penyedia siap dalam beberapa detik." : "Akun penerima siap dalam beberapa detik.")}
          </p>

          {/* Step 1 — role */}
          {mode === "register" && step === "role" && (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {([
                  { id: "provider", label: "Penyedia", icon: Store, desc: "Bagikan surplus" },
                  { id: "recipient", label: "Penerima", icon: Users, desc: "Cari makanan" },
                ] as const).map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "rounded-2xl border-2 p-4 text-left transition-all",
                      role === r.id
                        ? "border-primary bg-primary-soft shadow-soft"
                        : "border-border hover:border-primary/40 bg-card",
                    )}
                  >
                    <r.icon className={cn("h-5 w-5", role === r.id ? "text-primary" : "text-muted-foreground")} />
                    <p className="mt-2 font-semibold text-sm">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </button>
                ))}
              </div>
              <Button onClick={handleRoleNext} variant="hero" size="lg" className="mt-6 w-full font-semibold">
                Lanjutkan
              </Button>
            </>
          )}

          {/* Step 2 — provider type */}
          {mode === "register" && step === "providerType" && (
            <>
              <div className="mt-6 grid gap-3">
                {providerTypes.map((p) => {
                  const active = providerType === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setProviderType(p.id)}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all",
                        active
                          ? "border-primary bg-primary-soft shadow-soft"
                          : "border-border hover:border-primary/40 bg-card",
                      )}
                    >
                      <span className="text-2xl leading-none mt-0.5" aria-hidden>{p.emoji}</span>
                      <div className="min-w-0">
                        <p className={cn("font-semibold text-sm", active && "text-primary")}>{p.label}</p>
                        <p className="text-xs text-muted-foreground">{p.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <Button onClick={handleProviderTypeNext} variant="hero" size="lg" className="mt-6 w-full font-semibold">
                Lanjutkan
              </Button>
            </>
          )}

          {/* Step 3 — details (also for login) */}
          {step === "details" && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {role === "provider" ? "Nama bisnis / penyedia" : "Nama lengkap"}
                  </Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Kata sandi</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full font-semibold">
                {mode === "login" ? "Masuk" : "Daftar Sekarang"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>Belum punya akun?{" "}
                <Link to="/auth/register" className="font-semibold text-primary hover:underline">Daftar</Link>
              </>
            ) : (
              <>Sudah punya akun?{" "}
                <Link to="/auth/login" className="font-semibold text-primary hover:underline">Masuk</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
