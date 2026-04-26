import { Upload, Search, Package } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Surplus",
    desc: "Penyedia mengunggah info makanan: foto, jumlah, batas waktu, dan lokasi pengambilan.",
    accent: "primary",
  },
  {
    icon: Search,
    title: "Match & Klaim",
    desc: "Penerima terdekat mendapat notifikasi real-time dan dapat langsung mengklaim makanan.",
    accent: "warm",
  },
  {
    icon: Package,
    title: "Pickup & Nikmati",
    desc: "Ambil makanan di lokasi yang ditentukan, lalu beri rating untuk membangun kepercayaan.",
    accent: "primary",
  },
];

export const HowItWorks = () => {
  return (
    <section id="cara-kerja" className="container py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Cara Kerja</span>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">Tiga langkah sederhana</h2>
        <p className="mt-4 text-muted-foreground md:text-lg">
          Dari surplus ke meja yang membutuhkan — prosesnya cepat, aman, dan transparan.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="group relative rounded-3xl border border-border bg-card p-7 shadow-soft hover:shadow-card transition-all hover:-translate-y-1"
          >
            <div className="absolute top-7 right-7 font-display text-5xl font-extrabold text-primary/5">
              0{i + 1}
            </div>
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              s.accent === "warm" ? "bg-accent/15 text-accent" : "bg-primary-soft text-primary"
            }`}>
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
