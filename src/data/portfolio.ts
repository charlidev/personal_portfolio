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

export interface PortfolioCourse {
  platform: string;
  name: string;
  type?: string;
  issuedAt: string;
  expiration?: string;
  image: string;
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
    items: ['Databricks', 'Snowflake', 'AWS', 'Azure', 'SAP Business Data Cloud'],
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

export const academyCourses: PortfolioCourse[] = [
  {
    name: 'SQL Analytics on Databricks',
    platform: 'Databricks Academy',
    type: 'Knowledge Badge',
    issuedAt: '5 de julio de 2026',
    expiration: 'No expira',
    image: '/images/courses/sql-analytics-on-databricks.png',
  },
  {
    name: 'SQL Programming and Procedural Logic',
    platform: 'Databricks Academy',
    type: 'Knowledge Badge',
    issuedAt: '5 de julio de 2026',
    expiration: 'No expira',
    image: '/images/courses/sql-programming-procedural-logic.png',
  },
  {
    name: 'Data Modeling Strategies',
    platform: 'Databricks Academy',
    type: 'Knowledge Badge',
    issuedAt: '5 de julio de 2026',
    expiration: 'No expira',
    image: '/images/courses/data-modeling-strategies.png',
  },
  {
    name: 'DevOps Essentials for Data Engineering',
    platform: 'Databricks Academy',
    type: 'Knowledge Badge',
    issuedAt: '7 de octubre de 2026',
    expiration: 'No expira',
    image: '/images/courses/devops-data-eng.png',
  },
  {
    name: 'Build Data Pipelines with Lakeflow Spark Declarative Pipelines',
    platform: 'Databricks Academy',
    type: 'Knowledge Badge',
    issuedAt: '5 de octubre de 2026',
    expiration: 'No expira',
    image: '/images/courses/lakeflow-sdp.png',
  },
  {
    name: 'Deploy Workloads with Lakeflow Jobs',
    platform: 'Databricks Academy',
    type: 'Knowledge Badge',
    issuedAt: '27 de septiembre de 2026',
    expiration: 'No expira',
    image: '/images/courses/lakeflow-jobs.png',
  },
  {
    name: 'Snowflake University Platform Skills Badge',
    platform: 'Snowflake',
    issuedAt: '26 de junio de 2026',
    expiration: 'No expira',
    image: '/images/courses/snowflake-platform.png',
  },
  {
    name: 'AI/BI for Data Analysts',
    platform: 'Databricks Academy',
    type: 'Knowledge Badge',
    issuedAt: '1 de julio de 2026',
    expiration: 'No expira',
    image: '/images/courses/databricks-aibi.png',
  },
  {
    name: 'Data Ingestion with Lakeflow Connect',
    platform: 'Databricks Academy',
    type: 'Knowledge Badge',
    issuedAt: '21 de septiembre de 2026',
    expiration: 'No expira',
    image: '/images/courses/lakeflow-connect.png',
  },
  {
    name: 'Introducing SAP Business Data Cloud',
    platform: 'SAP Learning',
    type: 'Course Completion - Beginner Level',
    issuedAt: '28 de septiembre de 2026',
    image: '/images/courses/sap-bdc-introduction.png',
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

export const expertosBackOficceExperience: ProfessionalExperience = {
  role: 'Analista de Datos',
  company: 'Expertos de Back Oficce',
  period: '2023 - 2025',
  introduction:
    'Participación en el análisis y procesamiento de información operativa de distintas áreas de la organización, mediante la consolidación, clasificación y actualización de registros en Excel y Bases de Datos SQL. Elaboración de reportes estadísticos, indicadores operativos y presentaciones ejecutivas para facilitar el seguimiento de la disponibilidad de infraestructura de videovigilancia y las incidencias reportadas en las operaciones logísticas.',
  responsibilities: [
    'Extracción y procesamiento de reportes de la plataforma de administración de videovigilancia para analizar el estado operativo de las cámaras, clasificando los dispositivos activos e inactivos.',
    'Consolidación de información sobre disponibilidad de cámaras mediante tablas de Excel y elaboración de reportes ejecutivos para responsables de área y mandos gerenciales.',
    'Registro y clasificación de incidencias reportadas por transportistas mediante llamadas telefónicas, estructurando la información por identificador, motivo de la queja y área involucrada.',
    'Análisis de incidencias logísticas mediante la agrupación y contabilización de reportes por área operativa, incluyendo báscula, patio de chatarra y seguridad intramuros.',
    'Desarrollo y actualización de reportes gráficos en Excel para visualizar la distribución de incidencias y comunicar resultados a los responsables de las áreas mediante tableros de Power BI.',
    'Mantenimiento y actualización recurrente de registros operativos provenientes de distintas fuentes, realizando actividades de organización, clasificación, depuración y preparación de datos para su posterior análisis.',
  ],
  toolGroups: [
    {
      category: 'Análisis y reportes',
      tools: ['Microsoft Excel', 'Power BI'],
    },
    {
      category: 'Fuentes de información y monitoreo',
      tools: ['Plataforma ExaqVision', 'UNIGIS'],
    },
    {
      category: 'Lenguajes de programación',
      tools: ['SQL', 'Python'],
    },
  ],
};

export const professionalExperiences: ProfessionalExperience[] = [
  expertosBackOficceExperience,
  gerdauCorsaExperience,
  pulqueLabsExperience,
];


