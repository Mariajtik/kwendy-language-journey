/**
 * TermsScreen — public Terms of Use page.
 * Public, no-login route to satisfy homepage/policy verification.
 */
import { Link } from "react-router-dom";
import { TERMOS } from "@/data/legal";
import RouteSeo from "@/components/seo/RouteSeo";

const TermsScreen = () => {
  const doc = TERMOS;
  return (
    <>
      <RouteSeo
        title="Termos de Uso — Kwendi"
        description="Termos de Uso da aplicação Kwendi para aprender Umbundu."
        path="/terms"
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
            <Link to="/privacy" className="text-primary font-semibold hover:underline">
              Política de Privacidade
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

export default TermsScreen;