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
  href?: string;
}

export interface ExperienceToolGroup {
  category: string;
  tools: string[];
}

export interface ProfessionalExperience {
  role: string;
  company: string;
  sector: string;
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

export const educationEntries = [
  'Certificaciones',
  'Cursos',
  'Formación académica',
];

export const contactMethods: ContactMethod[] = [
  { label: 'Correo electrónico', value: '[Enlace pendiente]' },
  { label: 'GitHub', value: '[Enlace pendiente]' },
  { label: 'LinkedIn', value: '[Enlace pendiente]' },
];

export const pulqueLabsExperience: ProfessionalExperience = {
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


