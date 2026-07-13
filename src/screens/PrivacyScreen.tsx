/**
 * PrivacyScreen — public privacy policy page.
 * Public route required by Google OAuth verification. Renders PRIVACIDADE
 * doc from src/data/legal.ts. No login required.
 */
import { Link } from "react-router-dom";
import { PRIVACIDADE } from "@/data/legal";
import RouteSeo from "@/components/seo/RouteSeo";

const PrivacyScreen = () => {
  const doc = PRIVACIDADE;
  return (
    <>
      <RouteSeo
        title="Política de Privacidade — Kwendi"
        description="Política de Privacidade do Kwendi: que dados recolhemos, como os usamos e os teus direitos."
        path="/privacy"
      />
      <main className="app-shell bg-background min-h-[100dvh] px-5 py-8 max-w-2xl mx-auto">
        <nav className="mb-6 text-sm">
          <Link to="/" className="text-primary font-semibold hover:underline">
            ← Kwendi
          </Link>
        </nav>
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-foreground">{doc.titulo}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Versão {doc.versao} · {doc.atualizado}
          </p>
          <p className="mt-4 text-foreground leading-relaxed">{doc.intro}</p>
        </header>
        <article className="space-y-5">
          {doc.seccoes.map((s) => (
            <section key={s.titulo}>
              <h2 className="font-extrabold text-foreground mb-2 text-lg">
                {s.titulo}
              </h2>
              {s.paragrafos.map((p, i) => (
                <p
                  key={i}
                  className="text-sm text-muted-foreground leading-relaxed mb-2"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
        <footer className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground">
          <p>
            <Link to="/terms" className="text-primary font-semibold hover:underline">
              Termos de Uso
            </Link>
            {" · "}
            <Link to="/features" className="text-primary font-semibold hover:underline">
              Sobre a app
            </Link>
          </p>
          <p className="mt-2">© 2026 Kwendi</p>
        </footer>
      </main>
    </>
  );
};

export default PrivacyScreen;