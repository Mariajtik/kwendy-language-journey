/**
 * SignupFlow.tsx
 * ---------------
 * Multi-step sign-up inspired by Duolingo's onboarding.
 * Steps:
 *  1. Username
 *  2. Email
 *  3. Password
 *  4. Learning motivation (optional)
 *  5. Level selection
 * After step 5 → success message.
 */

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Upload } from "lucide-react";
import logoImg from "@/assets/logo.jpg";
import avatarImg from "@/assets/avatar.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Angolan provinces shown as quick-pick chips */
const PROVINCES = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando", "Cuando Cubango",
  "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla",
  "Icolo e Bengo", "Luanda", "Lunda Norte", "Lunda Sul", "Malanje",
  "Moxico", "Moxico Leste", "Namibe", "Uíge", "Zaire",
];

/** World countries with flag emojis (for the "Outro" option) */
const COUNTRIES: { name: string; flag: string }[] = [
  { name: "Afeganistão", flag: "🇦🇫" }, { name: "África do Sul", flag: "🇿🇦" },
  { name: "Albânia", flag: "🇦🇱" }, { name: "Alemanha", flag: "🇩🇪" },
  { name: "Andorra", flag: "🇦🇩" }, { name: "Angola", flag: "🇦🇴" },
  { name: "Antígua e Barbuda", flag: "🇦🇬" }, { name: "Arábia Saudita", flag: "🇸🇦" },
  { name: "Argélia", flag: "🇩🇿" }, { name: "Argentina", flag: "🇦🇷" },
  { name: "Arménia", flag: "🇦🇲" }, { name: "Austrália", flag: "🇦🇺" },
  { name: "Áustria", flag: "🇦🇹" }, { name: "Azerbaijão", flag: "🇦🇿" },
  { name: "Bahamas", flag: "🇧🇸" }, { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Barbados", flag: "🇧🇧" }, { name: "Barém", flag: "🇧🇭" },
  { name: "Bélgica", flag: "🇧🇪" }, { name: "Belize", flag: "🇧🇿" },
  { name: "Benim", flag: "🇧🇯" }, { name: "Bielorrússia", flag: "🇧🇾" },
  { name: "Bolívia", flag: "🇧🇴" }, { name: "Bósnia e Herzegovina", flag: "🇧🇦" },
  { name: "Botsuana", flag: "🇧🇼" }, { name: "Brasil", flag: "🇧🇷" },
  { name: "Brunei", flag: "🇧🇳" }, { name: "Bulgária", flag: "🇧🇬" },
  { name: "Burquina Faso", flag: "🇧🇫" }, { name: "Burundi", flag: "🇧🇮" },
  { name: "Butão", flag: "🇧🇹" }, { name: "Cabo Verde", flag: "🇨🇻" },
  { name: "Camarões", flag: "🇨🇲" }, { name: "Camboja", flag: "🇰🇭" },
  { name: "Canadá", flag: "🇨🇦" }, { name: "Catar", flag: "🇶🇦" },
  { name: "Cazaquistão", flag: "🇰🇿" }, { name: "Chade", flag: "🇹🇩" },
  { name: "Chile", flag: "🇨🇱" }, { name: "China", flag: "🇨🇳" },
  { name: "Chipre", flag: "🇨🇾" }, { name: "Colômbia", flag: "🇨🇴" },
  { name: "Comores", flag: "🇰🇲" }, { name: "Congo", flag: "🇨🇬" },
  { name: "Coreia do Norte", flag: "🇰🇵" }, { name: "Coreia do Sul", flag: "🇰🇷" },
  { name: "Costa do Marfim", flag: "🇨🇮" }, { name: "Costa Rica", flag: "🇨🇷" },
  { name: "Croácia", flag: "🇭🇷" }, { name: "Cuba", flag: "🇨🇺" },
  { name: "Dinamarca", flag: "🇩🇰" }, { name: "Djibuti", flag: "🇩🇯" },
  { name: "Dominica", flag: "🇩🇲" }, { name: "Egito", flag: "🇪🇬" },
  { name: "El Salvador", flag: "🇸🇻" }, { name: "Emirados Árabes Unidos", flag: "🇦🇪" },
  { name: "Equador", flag: "🇪🇨" }, { name: "Eritreia", flag: "🇪🇷" },
  { name: "Eslováquia", flag: "🇸🇰" }, { name: "Eslovénia", flag: "🇸🇮" },
  { name: "Espanha", flag: "🇪🇸" }, { name: "Estados Unidos", flag: "🇺🇸" },
  { name: "Estónia", flag: "🇪🇪" }, { name: "Essuatíni", flag: "🇸🇿" },
  { name: "Etiópia", flag: "🇪🇹" }, { name: "Fiji", flag: "🇫🇯" },
  { name: "Filipinas", flag: "🇵🇭" }, { name: "Finlândia", flag: "🇫🇮" },
  { name: "França", flag: "🇫🇷" }, { name: "Gabão", flag: "🇬🇦" },
  { name: "Gâmbia", flag: "🇬🇲" }, { name: "Gana", flag: "🇬🇭" },
  { name: "Geórgia", flag: "🇬🇪" }, { name: "Granada", flag: "🇬🇩" },
  { name: "Grécia", flag: "🇬🇷" }, { name: "Guatemala", flag: "🇬🇹" },
  { name: "Guiana", flag: "🇬🇾" }, { name: "Guiné", flag: "🇬🇳" },
  { name: "Guiné Equatorial", flag: "🇬🇶" }, { name: "Guiné-Bissau", flag: "🇬🇼" },
  { name: "Haiti", flag: "🇭🇹" }, { name: "Holanda", flag: "🇳🇱" },
  { name: "Honduras", flag: "🇭🇳" }, { name: "Hungria", flag: "🇭🇺" },
  { name: "Iémen", flag: "🇾🇪" }, { name: "Ilhas Marshall", flag: "🇲🇭" },
  { name: "Ilhas Salomão", flag: "🇸🇧" }, { name: "Índia", flag: "🇮🇳" },
  { name: "Indonésia", flag: "🇮🇩" }, { name: "Irão", flag: "🇮🇷" },
  { name: "Iraque", flag: "🇮🇶" }, { name: "Irlanda", flag: "🇮🇪" },
  { name: "Islândia", flag: "🇮🇸" }, { name: "Israel", flag: "🇮🇱" },
  { name: "Itália", flag: "🇮🇹" }, { name: "Jamaica", flag: "🇯🇲" },
  { name: "Japão", flag: "🇯🇵" }, { name: "Jordânia", flag: "🇯🇴" },
  { name: "Kuwait", flag: "🇰🇼" }, { name: "Laos", flag: "🇱🇦" },
  { name: "Lesoto", flag: "🇱🇸" }, { name: "Letónia", flag: "🇱🇻" },
  { name: "Líbano", flag: "🇱🇧" }, { name: "Libéria", flag: "🇱🇷" },
  { name: "Líbia", flag: "🇱🇾" }, { name: "Liechtenstein", flag: "🇱🇮" },
  { name: "Lituânia", flag: "🇱🇹" }, { name: "Luxemburgo", flag: "🇱🇺" },
  { name: "Macedónia do Norte", flag: "🇲🇰" }, { name: "Madagáscar", flag: "🇲🇬" },
  { name: "Malásia", flag: "🇲🇾" }, { name: "Malawi", flag: "🇲🇼" },
  { name: "Maldivas", flag: "🇲🇻" }, { name: "Mali", flag: "🇲🇱" },
  { name: "Malta", flag: "🇲🇹" }, { name: "Marrocos", flag: "🇲🇦" },
  { name: "Maurícia", flag: "🇲🇺" }, { name: "Mauritânia", flag: "🇲🇷" },
  { name: "México", flag: "🇲🇽" }, { name: "Mianmar", flag: "🇲🇲" },
  { name: "Micronésia", flag: "🇫🇲" }, { name: "Moçambique", flag: "🇲🇿" },
  { name: "Moldávia", flag: "🇲🇩" }, { name: "Mónaco", flag: "🇲🇨" },
  { name: "Mongólia", flag: "🇲🇳" }, { name: "Monténégro", flag: "🇲🇪" },
  { name: "Namíbia", flag: "🇳🇦" }, { name: "Nauru", flag: "🇳🇷" },
  { name: "Nepal", flag: "🇳🇵" }, { name: "Nicarágua", flag: "🇳🇮" },
  { name: "Níger", flag: "🇳🇪" }, { name: "Nigéria", flag: "🇳🇬" },
  { name: "Noruega", flag: "🇳🇴" }, { name: "Nova Zelândia", flag: "🇳🇿" },
  { name: "Omã", flag: "🇴🇲" }, { name: "Palau", flag: "🇵🇼" },
  { name: "Panamá", flag: "🇵🇦" }, { name: "Papua-Nova Guiné", flag: "🇵🇬" },
  { name: "Paquistão", flag: "🇵🇰" }, { name: "Paraguai", flag: "🇵🇾" },
  { name: "Peru", flag: "🇵🇪" }, { name: "Polónia", flag: "🇵🇱" },
  { name: "Portugal", flag: "🇵🇹" }, { name: "Quénia", flag: "🇰🇪" },
  { name: "Quirguistão", flag: "🇰🇬" }, { name: "Quiribati", flag: "🇰🇮" },
  { name: "Reino Unido", flag: "🇬🇧" }, { name: "República Centro-Africana", flag: "🇨🇫" },
  { name: "República Checa", flag: "🇨🇿" }, { name: "República Democrática do Congo", flag: "🇨🇩" },
  { name: "República Dominicana", flag: "🇩🇴" }, { name: "Roménia", flag: "🇷🇴" },
  { name: "Ruanda", flag: "🇷🇼" }, { name: "Rússia", flag: "🇷🇺" },
  { name: "Samoa", flag: "🇼🇸" }, { name: "Santa Lúcia", flag: "🇱🇨" },
  { name: "São Cristóvão e Neves", flag: "🇰🇳" }, { name: "São Marino", flag: "🇸🇲" },
  { name: "São Tomé e Príncipe", flag: "🇸🇹" }, { name: "São Vicente e Granadinas", flag: "🇻🇨" },
  { name: "Seicheles", flag: "🇸🇨" }, { name: "Senegal", flag: "🇸🇳" },
  { name: "Serra Leoa", flag: "🇸🇱" }, { name: "Sérvia", flag: "🇷🇸" },
  { name: "Singapura", flag: "🇸🇬" }, { name: "Síria", flag: "🇸🇾" },
  { name: "Somália", flag: "🇸🇴" }, { name: "Sri Lanka", flag: "🇱🇰" },
  { name: "Sudão", flag: "🇸🇩" }, { name: "Sudão do Sul", flag: "🇸🇸" },
  { name: "Suécia", flag: "🇸🇪" }, { name: "Suíça", flag: "🇨🇭" },
  { name: "Suriname", flag: "🇸🇷" }, { name: "Tailândia", flag: "🇹🇭" },
  { name: "Taiwan", flag: "🇹🇼" }, { name: "Tajiquistão", flag: "🇹🇯" },
  { name: "Tanzânia", flag: "🇹🇿" }, { name: "Timor-Leste", flag: "🇹🇱" },
  { name: "Togo", flag: "🇹🇬" }, { name: "Tonga", flag: "🇹🇴" },
  { name: "Trindade e Tobago", flag: "🇹🇹" }, { name: "Tunísia", flag: "🇹🇳" },
  { name: "Turcomenistão", flag: "🇹🇲" }, { name: "Turquia", flag: "🇹🇷" },
  { name: "Tuvalu", flag: "🇹🇻" }, { name: "Ucrânia", flag: "🇺🇦" },
  { name: "Uganda", flag: "🇺🇬" }, { name: "Uruguai", flag: "🇺🇾" },
  { name: "Usbequistão", flag: "🇺🇿" }, { name: "Vanuatu", flag: "🇻🇺" },
  { name: "Vaticano", flag: "🇻🇦" }, { name: "Venezuela", flag: "🇻🇪" },
  { name: "Vietname", flag: "🇻🇳" }, { name: "Zâmbia", flag: "🇿🇲" },
  { name: "Zimbabué", flag: "🇿🇼" },
];

/** Slide-in animation variants for each step */
const slideVariants = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 },
};

const SignupFlow = () => {
  const navigate = useNavigate();

  /* Current step index (0-based) */
  const [step, setStep] = useState(0);

  /* Form data stored across all steps */
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [origin, setOrigin] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [motivation, setMotivation] = useState("");
  const [level, setLevel] = useState("");
  const [source, setSource] = useState("");
  const [chokwe, setChokwe] = useState("");
  const [dailyGoal, setDailyGoal] = useState("");

  /* Profile photo — defaults to Kwendi logo */
  const [photo, setPhoto] = useState<string>(logoImg);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Handle uploaded image file → preview as base64 */
  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* Whether the flow is complete */
  const [done, setDone] = useState(false);

  /** Move to next step, or finish */
  const next = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else setDone(true);
  };

  /** Move back one step */
  const back = () => {
    if (step > 0) setStep(step - 1);
    else navigate(-1);
  };

  /* Total number of steps for the progress bar */
  const totalSteps = 9;

  /* ---- SUCCESS SCREEN ---- */
  if (done) {
    return (
      <motion.div
        className="app-shell flex flex-col items-center justify-center px-6"
        style={{ minHeight: "100dvh" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "hsl(var(--primary))" }}
        >
          <Check className="w-10 h-10" style={{ color: "hsl(var(--primary-foreground))" }} />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2 text-center">
          Conta criada com sucesso!
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Bem-vindo/a ao Kwendi {username}!
        </p>
        <button className="btn-duo btn-duo-primary max-w-xs" onClick={() => navigate("/home")}>
          Começar a aprender
        </button>
      </motion.div>
    );
  }

  return (
    <div
      className="app-shell flex flex-col px-6 py-6"
      style={{ minHeight: "100dvh" }}
    >
      {/* ---- HEADER: Back button + progress bar ---- */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={back} className="p-1" aria-label="Voltar">
          <ArrowLeft className="w-6 h-6 text-muted-foreground" />
        </button>
        {/* Progress bar */}
        <div className="flex-1 h-3 rounded-full" style={{ background: "hsl(var(--muted))" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "hsl(var(--primary))" }}
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* ---- STEP CONTENT (animated) ---- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {/* Step 0: Username */}
          {step === 0 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Como podemos te chamar?
              </h2>
              <p className="text-muted-foreground mb-6">
                Escolha um nome de usuário e uma foto de perfil.
              </p>

              {/* Profile photo preview */}
              <div className="flex flex-col items-center mb-6">
                <img
                  src={photo}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover shadow-lg mb-3"
                  style={{ border: "3px solid hsl(var(--primary))" }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary"
                >
                  <Upload className="w-4 h-4" />
                  Carregar foto
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickFile}
                />
              </div>

              {/* Default avatar choices */}
              <p className="text-xs text-muted-foreground mb-2 text-center">
                Ou escolha uma das opções:
              </p>
              <div className="flex justify-center gap-4 mb-6">
                {[
                  { src: logoImg, label: "Logo Kwendi" },
                  { src: avatarImg, label: "Modo furtivo" },
                ].map((opt) => {
                  const selected = photo === opt.src;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setPhoto(opt.src)}
                      className="flex flex-col items-center gap-1"
                      aria-label={opt.label}
                    >
                      <img
                        src={opt.src}
                        alt={opt.label}
                        className="w-14 h-14 rounded-full object-cover"
                        style={{
                          border: selected
                            ? "3px solid hsl(var(--primary))"
                            : "3px solid hsl(var(--muted))",
                        }}
                      />
                      <span className="text-[10px] text-muted-foreground">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <input
                className="input-duo mb-6"
                placeholder="Nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Qual é o seu email?
              </h2>
              <p className="text-muted-foreground mb-6">Usaremos para recuperar sua conta.</p>
              <input
                className="input-duo mb-6"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Crie uma senha
              </h2>
              <p className="text-muted-foreground mb-6">Mínimo 6 caracteres.</p>
              <input
                className="input-duo mb-6"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}

          {/* Step 3: Origin (province or country) */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                De onde és?
              </h2>
              <p className="text-muted-foreground mb-6">
                Escolhe a tua província. Se não fores de Angola, escolhe "Outro".
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {PROVINCES.map((opt) => {
                  const selected = origin === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setOrigin(opt);
                        setOriginCountry("");
                      }}
                      className={`btn-duo text-sm py-3 ${selected ? "btn-duo-primary" : "btn-duo-outline"}`}
                    >
                      {opt}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setOrigin("Outro")}
                  className={`btn-duo text-sm py-3 col-span-2 ${origin === "Outro" ? "btn-duo-primary" : "btn-duo-outline"}`}
                >
                  Outro (fora de Angola)
                </button>
              </div>

              {origin === "Outro" && (
                <div className="mb-2">
                  <Select
                    value={originCountry}
                    onValueChange={(v) => setOriginCountry(v)}
                  >
                    <SelectTrigger className="w-full h-12 rounded-2xl border-2 text-base">
                      <SelectValue placeholder="Seleciona o teu país" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          <span className="mr-2">{c.flag}</span>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {/* Step 4: Motivation (optional) */}
          {step === 4 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                O que te motiva a aprender?
              </h2>
              <p className="text-muted-foreground mb-6">Escolhe a opção que mais combina contigo.</p>
              <div className="flex flex-col gap-3">
                {[
                  "Conectar com as minhas raízes",
                  "Curiosidade cultural",
                  "Comunicar com a família",
                  "Viagem a Angola",
                ].map((opt) => (
                  <button
                    key={opt}
                    className={`btn-duo ${motivation === opt ? "btn-duo-primary" : "btn-duo-outline"}`}
                    onClick={() => setMotivation(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 5: Source — Como soube da Kwendi? */}
          {step === 5 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Como você soube da Kwendi?
              </h2>
              <p className="text-muted-foreground mb-6">Ajuda-nos a chegar a mais pessoas.</p>
              <div className="flex flex-col gap-3">
                {[
                  "App Play Store",
                  "Facebook ou Instagram",
                  "YouTube",
                  "Busca do Google",
                  "TikTok",
                  "Outro",
                ].map((opt) => (
                  <button
                    key={opt}
                    className={`btn-duo ${source === opt ? "btn-duo-primary" : "btn-duo-outline"}`}
                    onClick={() => setSource(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 6: Level */}
          {step === 6 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Qual é o seu nível?
              </h2>
              <p className="text-muted-foreground mb-6">Selecione o que melhor te descreve.</p>
              <div className="flex flex-col gap-3">
                {["Iniciante", "Intermediário", "Avançado"].map((opt) => (
                  <button
                    key={opt}
                    className={`btn-duo ${level === opt ? "btn-duo-primary" : "btn-duo-outline"}`}
                    onClick={() => setLevel(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 7: Umbundu knowledge */}
          {step === 7 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Quanto você entende de Umbundu?
              </h2>
              <p className="text-muted-foreground mb-6">Para adaptarmos as lições a ti.</p>
              <div className="flex flex-col gap-3">
                {[
                  "Não sei nada de Umbundu",
                  "Conheço algumas palavras comuns",
                  "Consigo ter conversas simples",
                  "Consigo falar de assuntos variados",
                  "Consigo falar sobre a maioria dos assuntos em detalhes",
                ].map((opt) => (
                  <button
                    key={opt}
                    className={`btn-duo ${chokwe === opt ? "btn-duo-primary" : "btn-duo-outline"} text-sm`}
                    onClick={() => setChokwe(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 8: Daily goal */}
          {step === 8 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Qual vai ser a sua meta diária?
              </h2>
              <p className="text-muted-foreground mb-6">Podes mudar quando quiseres.</p>
              <div className="flex flex-col gap-3">
                {[
                  "3 minutos / dia",
                  "10 minutos / dia",
                  "15 minutos / dia",
                  "30 minutos / dia",
                ].map((opt) => (
                  <button
                    key={opt}
                    className={`btn-duo ${dailyGoal === opt ? "btn-duo-primary" : "btn-duo-outline"}`}
                    onClick={() => setDailyGoal(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ---- CONTINUE BUTTON ---- */}
      <div className="pt-4 pb-2">
        <button className="btn-duo btn-duo-primary" onClick={next}>
          {step === totalSteps - 1 ? "Vou cumprir a meta" : "Continuar"}
        </button>
      </div>
    </div>
  );
};

export default SignupFlow;
