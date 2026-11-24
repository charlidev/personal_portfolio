import {
  academyCourses,
  certifications,
  contactMethods,
  educationEntries,
  professionalExperiences,
  projects,
  skillGroups,
} from '../data/portfolio';

export type Locale = 'es' | 'en';

const englishDates: Record<string, string> = {
  '3 de abril de 2026': 'April 3, 2026',
  '14 de enero de 2025': 'January 14, 2025',
  '14 de enero de 2028': 'January 14, 2028',
  '5 de julio de 2026': 'July 5, 2026',
  '7 de octubre de 2026': 'October 7, 2026',
  '5 de octubre de 2026': 'October 5, 2026',
  '27 de septiembre de 2026': 'September 27, 2026',
  '26 de junio de 2026': 'June 26, 2026',
  '1 de julio de 2026': 'July 1, 2026',
  '21 de septiembre de 2026': 'September 21, 2026',
  '28 de septiembre de 2026': 'September 28, 2026',
  'No expira': 'Does not expire',
};

const englishExperiences = [
  {
    role: 'Project Lead',
    period: 'July 2025 – October 2025',
    introduction:
      'Coordination of technology projects involving the migration of microservice pipelines to AWS and process automation using Microsoft tools and RPA.',
    responsibilities: [
      'Coordinated and monitored projects involving the migration of microservice pipelines from on-premises environments to AWS.',
      'Gathered and analyzed project requirements to identify needs and follow up on initiatives.',
      'Organized project coordination and follow-up meetings.',
      'Coordinated with external providers to follow up on activities and deliverables.',
      'Automated processes using Power Automate and SharePoint.',
      'Performed basic administration of RPA solutions using Automation Anywhere.',
    ],
    toolGroups: ['Cloud', 'Automation & RPA'],
  },
  {
    role: 'Data Analyst',
    period: '2023–2025',
    introduction:
      'Analyzed and processed operational information from multiple areas of the organization by consolidating, classifying, and updating records in Excel and SQL databases. Prepared statistical reports, operational indicators, and executive presentations to support monitoring of video surveillance infrastructure availability and incidents reported in logistics operations.',
    responsibilities: [
      'Extracted and processed reports from the video surveillance management platform to assess camera operating status and classify active and inactive devices.',
      'Consolidated camera availability information in Excel tables and prepared executive reports for area leads and management.',
      'Recorded and classified incidents reported by carriers by phone, structuring information by identifier, complaint reason, and area involved.',
      'Analyzed logistics incidents by grouping and counting reports by operational area, including the weighbridge, scrap yard, and on-site security.',
      'Developed and updated Excel charts to show incident distribution and shared results with area leads through Power BI dashboards.',
      'Maintained and regularly updated operational records from multiple sources by organizing, classifying, cleaning, and preparing data for further analysis.',
    ],
    toolGroups: ['Analysis & Reporting', 'Information Sources & Monitoring', 'Programming Languages'],
  },
  {
    role: 'Logistics Analyst Intern',
    period: '2021–2023',
    introduction:
      'Supported the analysis and monitoring of freight transportation operations by processing information about vehicles and carriers to prepare reports and dashboards. Used data from Excel files and GPS tracking platforms to analyze routes, deliveries, and vehicle activity.',
    responsibilities: [
      'Processed and organized Excel files to report on transportation operations, including vehicle counts by carrier and freight delivered to customers.',
      'Extracted and analyzed information from GPS tracking platforms to review trips by vehicle, origin and destination points, and travel times.',
      'Prepared operational tracking reports and dashboards using Microsoft Excel and Power BI to visualize logistics information.',
      'Tracked indicators related to transportation vehicle activity and freight deliveries.',
      'Participated in follow-up meetings with carriers to review transportation service operations and on-site safety measures.',
      'Followed up with carriers to verify that their GPS devices remained active, as required for contracting.',
    ],
    toolGroups: ['Analysis & Reporting', 'Data Visualization', 'Transportation Tracking'],
  },
  {
    eyebrow: 'PROFESSIONAL INTERNSHIP',
    role: 'Web Development Intern',
    sector: 'Digital agency',
    period: 'August 2022 – December 2022',
    introduction:
      'Contributed to web development and maintenance projects, collaborating on digital solutions and responding to client requirements.',
    responsibilities: [
      'Developed and maintained websites with WordPress, including modifications and theme installation.',
      'Created wireframes for proposals and new web projects.',
      'Implemented adjustments and updates using HTML, JavaScript, and PHP.',
      'Managed hosting storage through IONOS.',
      'Validated client requirements and supported project development.',
    ],
    toolGroups: ['Web Development', 'Hosting', 'Design & Project Management'],
  },
];

const english = {
  languageName: 'English',
  documentTitle: 'Portfolio | Data Engineering',
  description:
    'Professional portfolio of Carlos Martinez, with a focus on data analysis and data engineering.',
  navigationLabel: 'Primary navigation',
  menuOpen: 'Open navigation menu',
  menuClose: 'Close navigation menu',
  switchLanguage: 'Cambiar idioma a español',
  switchLabel: 'ES',
  navigation: ['Home', 'Experience', 'Skills', 'Projects', 'Certifications & Education', 'Contact'],
  heroEyebrow: 'DATA ENGINEERING',
  heroDescription:
    'With a background in Computer Science and a focus on Data Engineering, I build data ingestion, transformation, and quality projects using Python, SQL, and cloud technologies. I am interested in building reliable pipelines that support analysis and decision-making.',
  heroProjects: 'View projects',
  heroContact: 'Get in touch',
  sections: {
    experienceEyebrow: 'Career history', experience: 'Experience',
    skillsEyebrow: 'Tools', skills: 'Skills',
    projectsEyebrow: 'TECHNICAL PORTFOLIO', projects: 'Projects',
    educationEyebrow: 'Learning', education: 'Certifications & Education',
    contactEyebrow: "Let's talk", contact: 'Contact',
  },
  experienceResponsibilities: 'Responsibilities',
  experienceTools: 'Technologies & Tools',
  skills: ['Languages & Processing', 'Platforms & Cloud', 'Databases', 'Architecture & Transformation', 'Development & Engineering', 'BI & Visualization'],
  projectPrefix: 'Project',
  olistProjectTitle: 'Olist Data Pipeline',
  olistProjectDescription:
    'Data pipeline for Olist developed with PySpark and Databricks. It includes ingestion of nine datasets with Auto Loader into Bronze, cleaning and deduplication in Silver, and five aggregated data marts in Gold.',
  olistProjectTechnologies: ['Python', 'PySpark', 'Databricks', 'Auto Loader', 'Delta Lake', 'ADLS Gen2'],
  marketingProjectTitle: 'CRM Marketing Data Pipeline',
  marketingProjectDescription:
    'Marketing data pipeline built on a Medallion architecture with Azure Databricks and PySpark. It combines incremental ingestion with Auto Loader, data quality rules using DLT Expectations, and dimensional modeling, with automated deployment through Databricks Asset Bundles and GitHub Actions.',
  marketingProjectTechnologies: [
    'Azure Databricks',
    'PySpark',
    'Delta Live Tables (DLT)',
    'Auto Loader',
    'DLT Expectations',
    'Databricks Asset Bundles',
    'GitHub Actions',
  ],
  aiJobImpactProjectTitle: 'AI Job Impact Analysis',
  aiJobImpactProjectDescription:
    "Snowflake analytics pipeline exploring AI's impact on employment. It follows a Medallion architecture, ingests data from an Internal Stage, and transforms it with SQL and Snowpark to analyze salaries, automation risk, and productivity.",
  aiJobImpactProjectTechnologies: [
    'Snowflake',
    'SQL',
    'Snowpark',
    'Medallion Architecture',
    'Internal Stage',
    'COPY INTO',
  ],
  projectTitle: '[Title pending]',
  projectDescription: '[Project description pending.]',
  pendingTechnologies: '[Pending]',
  technologies: 'Technologies:',
  viewProject: 'View project',
  viewRepository: 'View repository',
  projectPagePending: 'Individual project page pending',
  education: 'Education',
  university: 'University education',
  highSchool: 'High school',
  degree: "Bachelor's Degree in Computer Science",
  diploma: 'Technical Diploma in Programming',
  graduated: 'Graduated',
  certifications: 'Certifications',
  credentialHolder: 'Credential holder',
  issuedOn: 'Issued on',
  validity: 'Validity',
  associatedKnowledge: 'Related knowledge',
  courses: 'Courses',
  pauseAutoplay: 'Pause autoplay',
  resumeAutoplay: 'Resume autoplay',
  previousCourses: 'Previous courses',
  nextCourses: 'Next courses',
  courseCarousel: 'Databricks Academy courses',
  courseCarouselRole: 'carousel',
  courseCardRole: 'course card',
  course: 'Course',
  selectCourseGroup: 'Select course group',
  showCourseGroup: 'Show group',
  email: 'Email',
  contactEyebrow: "Let's talk",
  footer: 'Made with care by Carlos Martinez',
};

export const spanish = {
  languageName: 'Español',
  documentTitle: 'Portafolio | Ingeniería de Datos',
  description: 'Portafolio profesional de Ingeniería de Datos. Contenido en preparación.',
  navigationLabel: 'Navegación principal',
  menuOpen: 'Abrir menú de navegación',
  menuClose: 'Cerrar menú de navegación',
  switchLanguage: 'Change language to English',
  switchLabel: 'EN',
  navigation: ['Inicio', 'Experiencia', 'Habilidades', 'Proyectos', 'Certificaciones y formación', 'Contacto'],
  heroEyebrow: 'INGENIERÍA DE DATOS',
  heroDescription:
    'Con formación en Ciencias Computacionales y enfoque en Ingeniería de Datos, desarrollo proyectos de ingesta, transformación y calidad de datos con Python, SQL y tecnologías cloud. Me interesa construir pipelines confiables que faciliten el análisis y la toma de decisiones.',
  heroProjects: 'Ver proyectos',
  heroContact: 'Contactar',
  sections: {
    experienceEyebrow: 'Trayectoria', experience: 'Experiencia',
    skillsEyebrow: 'Herramientas', skills: 'Habilidades',
    projectsEyebrow: 'PORTAFOLIO TÉCNICO', projects: 'Proyectos',
    educationEyebrow: 'Aprendizaje', education: 'Formación y certificaciones',
    contactEyebrow: 'Conversemos', contact: 'Contacto',
  },
  experienceResponsibilities: 'Responsabilidades',
  experienceTools: 'Tecnologías y herramientas',
  skills: ['Lenguajes y procesamiento', 'Plataformas y cloud', 'Bases de datos', 'Arquitectura y transformación', 'Desarrollo e ingeniería', 'BI y visualización'],
  projectPrefix: 'Proyecto',
  olistProjectTitle: 'Olist Data Pipeline',
  olistProjectDescription:
    'Pipeline de ingeniería de datos desarrollada con PySpark y Databricks para estructurar nueve datasets de Olist en capas Bronze, Silver y Gold, generando cinco marts analíticos.',
  olistProjectTechnologies: ['Python', 'PySpark', 'Databricks', 'Auto Loader', 'Delta Lake', 'ADLS Gen2'],
  projectTitle: '[Título pendiente]',
  projectDescription: '[Descripción del proyecto pendiente.]',
  pendingTechnologies: '[Pendientes]',
  technologies: 'Tecnologías:',
  viewProject: 'Ver proyecto',
  viewRepository: 'Ver repositorio',
  projectPagePending: 'Página individual pendiente',
  education: 'Formación académica',
  university: 'Formación universitaria',
  highSchool: 'Bachillerato',
  degree: 'Licenciatura en Ciencias Computacionales',
  diploma: 'Carrera Técnica en Programación',
  graduated: 'Titulado',
  certifications: 'Certificaciones',
  credentialHolder: 'Titular',
  issuedOn: 'Fecha de emisión',
  validity: 'Vigencia',
  associatedKnowledge: 'Conocimientos asociados',
  courses: 'Cursos',
  pauseAutoplay: 'Pausar reproducción automática',
  resumeAutoplay: 'Reanudar reproducción automática',
  previousCourses: 'Cursos anteriores',
  nextCourses: 'Cursos siguientes',
  courseCarousel: 'Cursos de Databricks Academy',
  courseCarouselRole: 'carrusel',
  courseCardRole: 'tarjeta de curso',
  course: 'Curso',
  selectCourseGroup: 'Seleccionar grupo de cursos',
  showCourseGroup: 'Mostrar grupo',
  email: 'Correo electrónico',
  contactEyebrow: 'Conversemos',
  footer: 'Hecho con cariño by Carlos Martinez',
};

export type PortfolioCopy = typeof spanish;
export const getCopy = (locale: Locale): PortfolioCopy => locale === 'en' ? english : spanish;

export const getPortfolioData = (locale: Locale) => {
  if (locale === 'es') return { professionalExperiences, skillGroups, projects, educationEntries, certifications, academyCourses, contactMethods };

  return {
    professionalExperiences: professionalExperiences.map((experience, index) => {
      const translated = englishExperiences[index];
      return {
        ...experience,
        ...translated,
        responsibilities: translated.responsibilities,
        toolGroups: experience.toolGroups.map((group, groupIndex) => ({
          ...group,
          category: translated.toolGroups[groupIndex] ?? group.category,
        })),
      };
    }),
    skillGroups: skillGroups.map((group, index) => ({ ...group, name: english.skills[index] })),
    projects: projects.map((project, index) => ({
      ...project,
      detailUrl: index === 0 ? '/en/projects/olist/' : index === 1 ? '/en/projects/crm-marketing/' : index === 2 ? '/en/projects/ai-job-impact/' : project.detailUrl,
      title: index === 0
        ? english.olistProjectTitle
        : index === 1
          ? english.marketingProjectTitle
          : index === 2
            ? english.aiJobImpactProjectTitle
            : english.projectTitle,
      description: index === 0
        ? english.olistProjectDescription
        : index === 1
          ? english.marketingProjectDescription
          : index === 2
            ? english.aiJobImpactProjectDescription
            : english.projectDescription,
      technologies: index === 0
        ? english.olistProjectTechnologies
        : index === 1
          ? english.marketingProjectTechnologies
          : index === 2
            ? english.aiJobImpactProjectTechnologies
            : [english.pendingTechnologies],
    })),
    educationEntries: educationEntries.map((entry, index) => ({
      ...entry,
      level: index === 0 ? english.university : english.highSchool,
      program: index === 0 ? english.degree : english.diploma,
      status: entry.status ? english.graduated : undefined,
    })),
    certifications: certifications.map((certification) => ({
      ...certification,
      issuedAt: englishDates[certification.issuedAt] ?? certification.issuedAt,
      expiration: englishDates[certification.expiration] ?? certification.expiration,
    })),
    academyCourses: academyCourses.map((course) => ({
      ...course,
      issuedAt: englishDates[course.issuedAt] ?? course.issuedAt,
      expiration: course.expiration ? englishDates[course.expiration] ?? course.expiration : undefined,
    })),
    contactMethods: contactMethods.map((contact) => ({
      ...contact,
      label: contact.icon === 'email' ? english.email : contact.label,
    })),
  };
};
