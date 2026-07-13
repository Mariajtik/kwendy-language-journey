/**
 * Textos legais — Termos de Uso e Política de Privacidade da Kwendi.
 * Editar livremente; secções renderizadas por LegalModal.
 */

export type LegalSection = { titulo: string; paragrafos: string[] };
export type LegalDoc = {
  titulo: string;
  versao: string;
  atualizado: string;
  intro: string;
  seccoes: LegalSection[];
};

export const TERMOS: LegalDoc = {
  titulo: "Termos de Uso",
  versao: "1.0",
  atualizado: "Julho de 2026",
  intro:
    "Bem-vindo à Kwendi. Ao usar a aplicação, aceitas os termos abaixo. Se não concordares, por favor não uses o serviço.",
  seccoes: [
    {
      titulo: "1. Sobre o serviço",
      paragrafos: [
        "A Kwendi é uma aplicação educativa para aprender Umbundu e explorar a cultura angolana. O conteúdo é fornecido para fins de aprendizagem e entretenimento.",
      ],
    },
    {
      titulo: "2. Conta e Modo Furtivo",
      paragrafos: [
        "Podes usar a Kwendi criando uma conta ou em Modo Furtivo (acesso temporário de 7 dias sem conta).",
        "És responsável por manter as tuas credenciais em segurança. Se estiveres em Modo Furtivo, tens a opção de guardar o progresso associando o dispositivo a uma conta antes dos 7 dias.",
      ],
    },
    {
      titulo: "3. Conduta do utilizador",
      paragrafos: [
        "É proibido publicar conteúdo ofensivo, ilegal, discriminatório, spam ou que viole direitos de terceiros na Comunidade.",
        "Publicações são moderadas automaticamente e podem ser removidas sem aviso.",
      ],
    },
    {
      titulo: "4. Propriedade intelectual",
      paragrafos: [
        "Todo o conteúdo da app (áudios, imagens, lições, curiosidades) pertence à Kwendi ou é usado com autorização. Não é permitida a redistribuição sem consentimento.",
      ],
    },
    {
      titulo: "5. Compras e Premium",
      paragrafos: [
        "Itens virtuais (diamantes, chamas congeladas) não são reembolsáveis e não têm valor monetário fora da app.",
      ],
    },
    {
      titulo: "6. Limitação de responsabilidade",
      paragrafos: [
        "A Kwendi é fornecida no estado em que se encontra. Fazemos o possível para manter o serviço estável, mas não garantimos disponibilidade ininterrupta.",
      ],
    },
    {
      titulo: "7. Alterações",
      paragrafos: [
        "Podemos atualizar estes termos periodicamente. Alterações significativas serão comunicadas na app.",
      ],
    },
    {
      titulo: "8. Contacto",
      paragrafos: [
        "Para questões, usa a opção Enviar feedback nas Definições > Sobre.",
      ],
    },
  ],
};

export const PRIVACIDADE: LegalDoc = {
  titulo: "Política de Privacidade",
  versao: "1.0",
  atualizado: "Julho de 2026",
  intro:
    "Levamos a tua privacidade a sério. Este documento explica que dados recolhemos e como os usamos.",
  seccoes: [
    {
      titulo: "1. Dados que recolhemos",
      paragrafos: [
        "Conta: email, nome, foto de perfil opcional.",
        "Progresso: XP, diamantes, sequência diária, lições completadas.",
        "Comunidade: publicações, comentários e reações que crias.",
        "Técnicos: identificador anónimo de dispositivo para Modo Furtivo, versão da app, idioma.",
      ],
    },
    {
      titulo: "2. Como usamos os dados",
      paragrafos: [
        "Para operar a app, personalizar a tua experiência, guardar progresso entre dispositivos e melhorar as lições.",
        "Nunca vendemos os teus dados a terceiros.",
      ],
    },
    {
      titulo: "3. Armazenamento e segurança",
      paragrafos: [
        "Os dados são armazenados em infraestrutura Lovable Cloud com políticas de acesso por linha (RLS) — cada utilizador só acede aos seus próprios dados.",
        "As passwords nunca são acessíveis pela equipa; são geridas pelo serviço de autenticação.",
      ],
    },
    {
      titulo: "4. Os teus direitos",
      paragrafos: [
        "Podes editar o teu perfil, apagar publicações e apagar a conta em Definições > Conta.",
        "Ao apagar a conta, o progresso, publicações e dados pessoais são removidos.",
      ],
    },
    {
      titulo: "5. Cookies e analytics",
      paragrafos: [
        "A Kwendi usa armazenamento local para lembrar preferências. Não usamos cookies de rastreamento publicitário.",
      ],
    },
    {
      titulo: "6. Menores",
      paragrafos: [
        "A Kwendi é adequada a maiores de 13 anos. Utilizadores mais novos devem ter supervisão de um responsável.",
      ],
    },
    {
      titulo: "7. Contacto",
      paragrafos: [
        "Para exercer direitos de privacidade ou dúvidas, usa Enviar feedback nas Definições > Sobre.",
      ],
    },
  ],
};

export type Developer = {
  nome: string;
  papel: string;
  bio: string;
};

export const DEVELOPERS: Developer[] = [
  {
    nome: "Alessandra Pinto",
    papel: "UI/UX Designer & Front-end Developer",
    bio: "Instituto Politécnico Privado Lucrécio dos Santos · 13.ª Classe · GSI.",
  },
  {
    nome: "Maria Baptista",
    papel: "Back-end Developer & DB Integration",
    bio: "Instituto Politécnico Privado Lucrécio dos Santos · 13.ª Classe · GSI.",
  },
  {
    nome: "Josemar Treia",
    papel: "Database Architect & Data Modeler",
    bio: "Instituto Politécnico Privado Lucrécio dos Santos · 13.ª Classe · GSI.",
  },
];