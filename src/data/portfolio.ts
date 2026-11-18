export interface SkillGroup {
  name: string;
  items: string[];
}

export interface PortfolioProject {
  number: number;
  title: string;
  description: string;
  technologies: string[];
  href?: string;
}

export interface ContactMethod {
  label: string;
  value: string;
  href: string;
  icon: 'email' | 'github' | 'linkedin';
  external?: boolean;
}

export interface EducationEntry {
  level: string;
  institution: string;
  program: string;
  period: string;
  status?: string;
}

export interface PortfolioCertification {
  issuer: string;
  name: string;
  holder: string;
  issuedAt: string;
  expiration: string;
  topics: string[];
  image: string;
  credentialUrl?: string;
}

export interface ExperienceToolGroup {
  category: string;
  tools: string[];
}

export interface ProfessionalExperience {
  eyebrow?: string;
  role: string;
  company: string;
  sector?: string;
  period: string;
  introduction: string;
  responsibilities: string[];
  toolGroups: ExperienceToolGroup[];
}

export const skillGroups: SkillGroup[] = [
  {
    name: 'Lenguajes y procesamiento',
    items: ['Python', 'SQL', 'PySpark', 'Pandas', 'NumPy'],
  },
  {
    name: 'Plataformas y cloud',
    items: ['Databricks', 'Snowflake', 'AWS', 'Azure'],
  },
  {
    name: 'Bases de datos',
    items: ['SQL Server', 'MySQL', 'PostgreSQL', 'MongoDB'],
  },
  {
    name: 'Arquitectura y transformación',
    items: [
      'Data Lake',
      'Data Warehouse',
      'dbt',
      'ETL/ELT',
      'Arquitectura Medallion (Bronze/Silver/Gold)',
      'Data Quality',
      'Modelado dimensional',
    ],
  },
  {
    name: 'Desarrollo e ingeniería',
    items: ['Git', 'GitHub', 'CI/CD', 'Docker'],
  },
  {
    name: 'BI y visualización',
    items: ['Power BI', 'Matplotlib'],
  },
];

export const projects: PortfolioProject[] = [1, 2, 3].map((number) => ({
  number,
  title: '[Título pendiente]',
  description: '[Descripción del proyecto pendiente.]',
  technologies: ['[Pendientes]'],
}));

export const educationEntries: EducationEntry[] = [
  {
    level: 'Formación universitaria',
    institution: 'Universidad Autónoma del Estado de Hidalgo (UAEH)',
    program: 'Licenciatura en Ciencias Computacionales',
    period: '2017 – 2023',
    status: 'Titulado',
  },
  {
    level: 'Bachillerato',
    institution: 'Bachillerato Tecnológico Industrial y de Servicios No. 59 (CBTIS 59)',
    program: 'Carrera Técnica en Programación',
    period: '2014 – 2017',
  },
];

export const certifications: PortfolioCertification[] = [
  {
    issuer: 'Databricks Academy',
    name: 'Academy Accreditation - Databricks Fundamentals',
    holder: 'Carlos Daniel Martínez López',
    issuedAt: '3 de abril de 2026',
    expiration: 'No expira',
    topics: ['Databricks', 'Data Intelligence Platform', 'Data Management Platforms'],
    image: '/images/certifications/databricks-fundamentals.png',
  },
];

export const contactMethods: ContactMethod[] = [
  {
    label: 'Correo electrónico',
    value: 'charlie.martinez14@outlook.com',
    href: 'mailto:charlie.martinez14@outlook.com',
    icon: 'email',
  },
  {
    label: 'GitHub',
    value: 'github.com/charlidev',
    href: 'https://github.com/charlidev',
    icon: 'github',
    external: true,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/carlosmtz1498',
    href: 'https://www.linkedin.com/in/carlosmtz1498/',
    icon: 'linkedin',
    external: true,
  },
];

export const pulqueLabsExperience: ProfessionalExperience = {
  eyebrow: 'PRÁCTICAS PROFESIONALES',
  role: 'Practicante de Desarrollo Web',

  company: 'PulqueLabs',
  sector: 'Agencia digital',
  period: 'Agosto 2022 – Diciembre 2022',

  introduction:
    'Participación en proyectos de desarrollo y mantenimiento web, colaborando en la implementación de soluciones digitales y la atención de requerimientos de clientes.',
  responsibilities: [
    'Desarrollo y mantenimiento de sitios web mediante WordPress, incluyendo modificaciones e instalación de plantillas.',
    'Elaboración de wireframes para propuestas y nuevos proyectos web.',
    'Desarrollo de ajustes y modificaciones utilizando HTML, JavaScript y PHP.',
    'Administración del almacenamiento del hosting mediante IONOS.',
    'Validación de requerimientos de clientes y apoyo durante el desarrollo de los proyectos.',
  ],
  toolGroups: [
    {
      category: 'Desarrollo web',
      tools: ['WordPress', 'PHP', 'JavaScript', 'HTML'],
    },
    {
      category: 'Hosting',
      tools: ['IONOS'],
    },
    {
      category: 'Diseño y gestión',
      tools: ['Figma', 'Slack', 'ClickUp', 'Google Presentaciones'],
    },
  ],
};

export const gerdauCorsaExperience: ProfessionalExperience = {
  role: 'Becario Analista de Logística',
  company: 'Gerdau Corsa',
  period: '2021–2023',
  introduction:
    'Participé en el análisis y seguimiento de operaciones de transporte de carga, procesando información de unidades y transportistas para generar reportes y tableros de control. Utilicé datos provenientes de archivos Excel y plataformas de rastreo GPS para analizar recorridos, entregas y actividad operativa de las unidades.',
  responsibilities: [
    'Procesamiento y organización de archivos Excel para generar reportes sobre la operación de transporte, incluyendo la cantidad de unidades por línea transportista y la carga entregada a clientes.',
    'Extracción y análisis de información de plataformas de rastreo GPS para consultar viajes realizados por unidad, puntos de origen y destino, y tiempos de recorrido.',
    'Elaboración de reportes y tableros de seguimiento utilizando Microsoft Excel y Power BI para visualizar información de la operación logística.',
    'Seguimiento de indicadores relacionados con la actividad de las unidades de transporte y las entregas de carga.',
    'Participación en reuniones de seguimiento con líneas transportistas para revisar aspectos operativos del servicio de transporte y medidas de seguridad en planta.',
    'Seguimiento a las líneas transportistas para verificar que mantuvieran activos sus dispositivos GPS, de acuerdo con los requisitos establecidos para su contratación.',
  ],
  toolGroups: [
    {
      category: 'Análisis y reportes',
      tools: ['Microsoft Excel'],
    },
    {
      category: 'Visualización de datos',
      tools: ['Power BI'],
    },
    {
      category: 'Seguimiento de transporte',
      tools: ['Plataforma de rastreo GPS'],
    },
  ],
};

export const professionalExperiences: ProfessionalExperience[] = [
  gerdauCorsaExperience,
  pulqueLabsExperience,
];


