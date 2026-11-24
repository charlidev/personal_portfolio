import type { OlistProjectCopy, ProjectLocale } from './olistProject';

const repository = 'https://github.com/charlidev/AI_Job_Impact_Analysis_Snowflake_Data_Pipeline';
const sqlUrl = `${repository}/blob/main/AI_IMPACT.sql`;

const code = {
  stage: `CREATE OR REPLACE FILE FORMAT AI_IMPACT_DB.BRONZE.CSV_GENERIC_FORMAT
    TYPE = 'CSV'
    FIELD_DELIMITER = ','
    SKIP_HEADER = 1
    FIELD_OPTIONALLY_ENCLOSED_BY = '"'
    NULL_IF = ('NULL', 'null', '')
    EMPTY_FIELD_AS_NULL = TRUE;

CREATE OR REPLACE STAGE AI_IMPACT_DB.BRONZE.STG_RAW_DATA
    DIRECTORY = (ENABLE = TRUE)
    FILE_FORMAT = AI_IMPACT_DB.BRONZE.CSV_GENERIC_FORMAT;`,
  bronze: `CREATE OR REPLACE TABLE AI_IMPACT_DB.BRONZE.RAW_AI_DATA (
    Employee_ID VARCHAR,
    Age VARCHAR,
    Gender VARCHAR,
    Education_Level VARCHAR,
    Industry VARCHAR,
    Job_Role VARCHAR,
    Years_Experience VARCHAR
);

COPY INTO AI_IMPACT_DB.BRONZE.RAW_AI_DATA
FROM @AI_IMPACT_DB.BRONZE.STG_RAW_DATA
FILES = ('ai_job_impact.csv')
FILE_FORMAT = (
    FORMAT_NAME = 'AI_IMPACT_DB.BRONZE.CSV_GENERIC_FORMAT'
)
ON_ERROR = 'CONTINUE';`,
  silver: `CREATE OR REPLACE TABLE AI_IMPACT_DB.SILVER.CLEANED_AI_DATA AS
SELECT
    TRIM(Employee_ID):: VARCHAR AS Employee_ID,
    CAST(Age AS INT) AS Age,
    TRIM(Gender):: VARCHAR AS Gender,
    CAST(Years_Experience AS INT) AS Years_Experience,
    CASE
        WHEN UPPER(TRIM(Upskilling_Required)) = 'YES' THEN TRUE
        ELSE FALSE
    END AS Upskilling_Required_Bool,
    CAST(Salary_Before_AI AS NUMBER(10,2)) AS Salary_Before_AI,
    CAST(Salary_After_AI AS NUMBER(10,2)) AS Salary_After_AI,
    CASE
        WHEN UPPER(TRIM(Remote_Work)) = 'YES' THEN TRUE
        ELSE FALSE
    END AS Remote_Work_Bool,
    CAST(Productivity_Change_Pct AS FLOAT) AS Productivity_Change_Pct,
    CURRENT_TIMESTAMP() AS Load_Timestamp
FROM AI_IMPACT_DB.BRONZE.RAW_AI_DATA;`,
  gold: `CREATE OR REPLACE VIEW AI_IMPACT_DB.GOLD.VW_SALARY_IMPACT_BY_INDUSTRY AS
SELECT
    Industry,
    ROUND(AVG(Salary_Before_AI), 2) AS Avg_Salary_Before,
    ROUND(AVG(Salary_After_AI), 2) AS Avg_Salary_After,
    ROUND(AVG(Salary_After_AI - Salary_Before_AI), 2) AS Net_Change,
    ROUND(AVG((Salary_After_AI - Salary_Before_AI) / Salary_Before_AI) * 100, 2) AS Pct_Change
FROM AI_IMPACT_DB.SILVER.CLEANED_AI_DATA
GROUP BY Industry;

CREATE OR REPLACE VIEW AI_IMPACT_DB.GOLD.VW_EDUCATION_RISK_PROFILE AS
SELECT Education_Level, Automation_Risk, COUNT(*) AS Employee_Count
FROM AI_IMPACT_DB.SILVER.CLEANED_AI_DATA
GROUP BY Education_Level, Automation_Risk;

CREATE OR REPLACE VIEW AI_IMPACT_DB.GOLD.VW_PRODUCTIVITY_VS_SATISFACTION AS
SELECT Job_Role,
    ROUND(AVG(Productivity_Change_Pct), 2) AS Avg_Productivity_Gain,
    ROUND(AVG(Job_Satisfaction), 2) AS Avg_Satisfaction
FROM AI_IMPACT_DB.SILVER.CLEANED_AI_DATA
GROUP BY Job_Role;`,
  snowpark: `from snowflake.snowpark.context import get_active_session
from snowflake.snowpark import functions as F

session = get_active_session()
file_path = "@AI_IMPACT_DB.BRONZE.STG_RAW_DATA/ai_job_impact.csv"
df_bronze = session.read.options({
    "field_delimiter": ",",
    "skip_header": 1
}).csv(file_path)

df_gold = session.table("AI_IMPACT_DB.SILVER.CLEANED_AI_DATA_PY")
salary_impact = df_gold.group_by("Industry").agg(
    F.round(F.avg("Salary_Before_AI"), 2).alias("Avg_Pre_AI"),
    F.round(F.avg("Salary_After_AI"), 2).alias("Avg_Post_AI")
).with_column(
    "Net_Change",
    F.col("Avg_Post_AI") - F.col("Avg_Pre_AI")
)`,
};

const evidenceFiles = [
  { file: '1.png', labelEs: 'Abrir img/1.png', labelEn: 'Open img/1.png' },
  { file: '2.png', labelEs: 'Abrir img/2.png', labelEn: 'Open img/2.png' },
  { file: '3.png', labelEs: 'Abrir img/3.png', labelEn: 'Open img/3.png' },
  { file: '4.png', labelEs: 'Abrir img/4.png', labelEn: 'Open img/4.png' },
  { file: '5.png', labelEs: 'Abrir img/5.png', labelEn: 'Open img/5.png' },
];

export const aiJobImpactCopy: Record<ProjectLocale, OlistProjectCopy> = {
  es: {
    backToProjects: 'Volver a proyectos',
    eyebrow: 'CASO DE ESTUDIO · INGENIERÍA DE DATOS',
    title: 'AI Job Impact Analysis — Snowflake Data Pipeline',
    subtitle: 'Pipeline analítico en Snowflake para estudiar el impacto de la inteligencia artificial en salarios, automatización y productividad laboral.',
    summaryTitle: 'Resumen del proyecto',
    summary: 'Flujo de ingeniería de datos en Snowflake para analizar información sobre el impacto de la inteligencia artificial en distintas industrias y roles laborales.',
    technicalSummary: 'La implementación principal usa SQL y una arquitectura Medallion: Internal Stage, Bronze con datos originales VARCHAR, Silver con limpieza y tipado, y tres vistas Gold orientadas a preguntas de negocio. El README describe un dataset de 2,000 registros. El notebook de Snowpark Python es una implementación complementaria con DataFrames; no es un job orquestado ni una ejecución automatizada.',
    technologyLabel: 'Tecnologías',
    technologies: ['Snowflake', 'Snowflake SQL', 'Snowpark Python', 'Internal Stage', 'File Format', 'COPY INTO', 'Medallion Architecture', 'Data Cleansing', 'Business Insights'],
    tabs: ['Arquitectura', 'Componentes', 'Flujo de trabajo', 'Código', 'Resultados'],
    architectureTitle: 'Arquitectura del Pipeline',
    architectureLayers: [
      { eyebrow: 'LANDING ZONE', title: 'Landing Zone — Internal Stage', description: 'Almacenamiento interno en Snowflake para el CSV original ai_job_impact.csv.', bullets: ['Stage: STG_RAW_DATA.', 'File Format: CSV_GENERIC_FORMAT, definido en Bronze.', 'CSV con encabezado, delimitador y tratamiento de campos vacíos configurados.'] },
      { eyebrow: '01 / MEDALLION', title: 'Bronze — Raw Data', description: 'Carga inicial desde Internal Stage a RAW_AI_DATA.', bullets: ['COPY INTO con FILE_FORMAT.', 'Las 17 columnas se conservan como VARCHAR.', 'ON_ERROR = CONTINUE permite continuar la carga ante errores de archivo; no garantiza integridad completa.'] },
      { eyebrow: '02 / MEDALLION', title: 'Silver — Data Cleansing', description: 'Preparación tipada de los registros para habilitar consultas analíticas.', bullets: ['TRIM() limpia espacios en columnas de texto.', 'CAST convierte campos numéricos a tipos nativos.', 'CASE normaliza YES/NO a Boolean y agrega Load_Timestamp.', 'El SQL no implementa expectativas, cuarentena ni deduplicación.'] },
      { eyebrow: '03 / MEDALLION', title: 'Gold — Business Insights', description: 'Tres vistas SQL agregadas sobre CLEANED_AI_DATA.', bullets: ['Impacto salarial por industria.', 'Perfil de riesgo de automatización por educación.', 'Productividad y satisfacción laboral por rol.'] },
    ],
    diagramTitle: 'Flujo principal en Snowflake y ruta complementaria Snowpark',
    diagramDescription: 'El CSV pasa por un Internal Stage y COPY INTO hacia Bronze, luego se limpia y tipa en Silver y genera tres vistas Gold. Una ruta separada muestra el notebook Snowpark Python, que lee datos y calcula agregaciones con DataFrames.',
    aiDiagramLabels: { source: 'Archivo de origen', stage: 'STG_RAW_DATA', bronze: 'BRONZE', silver: 'SILVER', gold: 'GOLD', fileFormat: 'File Format · CSV_GENERIC_FORMAT', rawTable: 'RAW_AI_DATA', cleanTable: 'CLEANED_AI_DATA', views: ['VW_SALARY_IMPACT_BY_INDUSTRY', 'VW_EDUCATION_RISK_PROFILE', 'VW_PRODUCTIVITY_VS_SATISFACTION'], notebook: 'Notebook Snowpark', dataframe: 'Snowpark DataFrame', aggregations: 'Agregaciones' },
    aiWorkflowLabels: { stage: 'Internal Stage', copy: 'COPY INTO', bronze: 'Bronze · RAW_AI_DATA', cleansing: 'SQL Cleansing', silver: 'Silver · CLEANED_AI_DATA', views: 'Business Views', analysis: 'Analysis', session: 'Snowflake Session', dataframe: 'Snowpark DataFrame', transformations: 'Transformaciones', aggregates: 'Agregaciones', sqlRoute: 'RUTA PRINCIPAL · SNOWFLAKE SQL', notebookRoute: 'RUTA COMPLEMENTARIA · SNOWPARK PYTHON' },
    workflowDiagramTitle: 'Rutas de procesamiento',
    workflowDiagramDescription: 'La ruta principal va desde Internal Stage a COPY INTO, Bronze, limpieza SQL, Silver, vistas de negocio y análisis. Debajo aparece la ruta complementaria Snowflake Session, Snowpark DataFrame, transformaciones y agregaciones.',
    componentsTitle: 'Componentes de la solución',
    components: [
      { title: 'Fuente de datos', description: 'AI Job Impact Dataset · ai_job_impact.csv', bullets: ['El README describe 2,000 registros; no se verificó el conteo ejecutando una carga.', 'Campos: Employee_ID, Age, Gender, Education_Level, Industry, Job_Role, Years_Experience, AI_Adoption_Level, Automation_Risk, Upskilling_Required, Salary_Before_AI, Salary_After_AI, Job_Status, Work_Hours_Per_Week, Remote_Work, Job_Satisfaction y Productivity_Change_Pct.'] },
      { title: 'Almacenamiento Snowflake', description: 'AI_IMPACT_DB', bullets: ['Esquemas BRONZE, SILVER y GOLD.', 'Internal Stage STG_RAW_DATA y File Format CSV_GENERIC_FORMAT.', 'Separa el archivo original del procesamiento SQL.'] },
      { title: 'Ingesta Bronze', description: 'AI_IMPACT.sql', bullets: ['Crea RAW_AI_DATA con 17 columnas VARCHAR.', 'COPY INTO lee el archivo desde el Internal Stage con el File Format definido.', 'ON_ERROR = CONTINUE no equivale a una validación completa de calidad.'], code: ['RAW_AI_DATA', 'COPY INTO', 'VARCHAR'] },
      { title: 'Transformación Silver', description: 'CLEANED_AI_DATA', bullets: ['TRIM limpia valores de texto.', 'Age y Years_Experience pasan a INT; salarios a NUMBER(10,2); productividad a FLOAT.', 'CASE convierte Upskilling_Required y Remote_Work a booleanos.', 'Añade CURRENT_TIMESTAMP() como Load_Timestamp.'], code: ['Age', 'Years_Experience', 'Salary_Before_AI', 'Salary_After_AI', 'Upskilling_Required_Bool', 'Remote_Work_Bool', 'Productivity_Change_Pct'] },
      { title: 'Vistas analíticas Gold', description: 'Tres vistas SQL sobre CLEANED_AI_DATA.', bullets: ['VW_SALARY_IMPACT_BY_INDUSTRY: promedios salariales, cambio neto y porcentual.', 'VW_EDUCATION_RISK_PROFILE: Education_Level, Automation_Risk y Employee_Count.', 'VW_PRODUCTIVITY_VS_SATISFACTION: promedios por Job_Role.'] },
      { title: 'Notebook Snowpark Python', description: 'AI_IMPACT.ipynb · implementación complementaria.', bullets: ['Obtiene una sesión activa con get_active_session().', 'Usa session.read para leer desde el Stage y session.table para leer tablas.', 'Realiza transformaciones y agregaciones con DataFrames Snowpark.', 'No se presenta como job, despliegue ni proceso orquestado.'], code: ['get_active_session()', 'session.read', 'session.table', 'group_by()', 'agg()', 'with_column()'] },
      { title: 'Evidencia del proyecto', description: 'El README enlaza cinco capturas originales de configuración y procesamiento.', bullets: ['No están disponibles como archivos locales en este checkout; se ofrecen enlaces a los originales en GitHub.'] },
    ],
    workflowTitle: 'Proceso de Datos Paso a Paso',
    workflowIntro: 'El flujo principal corresponde al script Snowflake SQL. El notebook Snowpark aparece aparte como una ruta complementaria, no como una orquestación del proceso.',
    workflow: [
      { title: 'Preparar el contexto', file: 'AI_IMPACT.sql', description: 'Definir la base de datos y el warehouse de trabajo en Snowflake, sin asumir que se requiere un rol administrativo.' },
      { title: 'Configurar almacenamiento', file: 'AI_IMPACT.sql', description: 'Crear AI_IMPACT_DB, los esquemas Bronze, Silver y Gold, el File Format y el Internal Stage.' },
      { title: 'Cargar a Bronze', file: 'AI_IMPACT.sql', description: 'Depositar ai_job_impact.csv en STG_RAW_DATA y ejecutar COPY INTO para cargarlo en RAW_AI_DATA como VARCHAR.', bullets: ['La lectura usa el File Format del Stage.', 'ON_ERROR = CONTINUE controla el comportamiento ante errores de carga; no representa validación completa.', 'No es una carga streaming, incremental ni automatizada.'] },
      { title: 'Transformar a Silver', file: 'AI_IMPACT.sql', description: 'Crear CLEANED_AI_DATA con TRIM, conversiones CAST, normalización YES/NO a Boolean y CURRENT_TIMESTAMP().' },
      { title: 'Construir vistas Gold', file: 'AI_IMPACT.sql', description: 'Crear las tres vistas agregadas para consultas de negocio.' },
      { title: 'Explorar los análisis', description: 'Consultar las vistas para revisar cambios salariales por industria, perfiles de riesgo por educación y productividad frente a satisfacción por rol. No se atribuyen resultados ni conclusiones sin consultar los datos.' },
      { title: 'Procesamiento complementario con Snowpark', file: 'AI_IMPACT.ipynb', description: 'Obtener una sesión activa, leer el Stage con Snowpark, crear DataFrames de procesamiento y calcular tres agregaciones analíticas.', bullets: ['La libreta representa una alternativa de implementación en Python.', 'Sus agregaciones Gold son DataFrames mostrados en la libreta, no las mismas vistas SQL Gold.'] },
    ],
    workflowNote: 'La ruta SQL con COPY INTO y el notebook Snowpark son artefactos distintos. El repositorio no define orquestación end-to-end ni ejecución automatizada.',
    codeTitle: 'Implementación del Pipeline',
    codeExamples: [
      { layer: 'Landing', file: 'AI_IMPACT.sql', title: 'Internal Stage y File Format', description: 'Configura lectura CSV y un Internal Stage para almacenar el archivo original.', code: code.stage, language: 'sql', url: sqlUrl },
      { layer: 'Bronze', file: 'AI_IMPACT.sql', title: 'Carga inicial como VARCHAR', description: 'Fragmento parcial de RAW_AI_DATA y carga mediante COPY INTO. La tabla del repositorio incluye 17 columnas.', code: code.bronze, language: 'sql', url: sqlUrl },
      { layer: 'Silver', file: 'AI_IMPACT.sql', title: 'Limpieza y conversión de tipos', description: 'Ejemplos del SELECT que crea CLEANED_AI_DATA con texto limpio, campos numéricos, booleanos y timestamp.', code: code.silver, language: 'sql', url: sqlUrl },
      { layer: 'Gold', file: 'AI_IMPACT.sql', title: 'Vistas de Business Insights', description: 'Tres vistas que agrupan salarios por industria, riesgo por educación y productividad/satisfacción por rol.', code: code.gold, language: 'sql', url: sqlUrl },
      { layer: 'Snowpark Python · complementario', file: 'AI_IMPACT.ipynb', title: 'DataFrames y agregaciones', description: 'Fragmentos de la libreta con sesión activa, lectura Stage, lectura de tabla Silver Python y agregación salarial Snowpark.', code: code.snowpark, language: 'python', url: `${repository}/blob/main/AI_IMPACT.ipynb` },
    ],
    resultsTitle: 'Resultados del Proyecto',
    resultCards: [
      { title: 'Cobertura descrita', description: 'Las cantidades siguientes se documentan en README y en el script SQL; no se verificaron mediante una ejecución de Snowflake en esta tarea.', bullets: ['Dataset descrito: 2,000 registros', '3 capas Medallion: Bronze, Silver y Gold', '1 Internal Stage · 1 tabla Bronze · 1 tabla Silver', '3 vistas analíticas Gold'] },
      { title: 'Preguntas de negocio', description: 'Vistas agregadas que permiten explorar estas preguntas; no se presentan conclusiones numéricas del dataset.', bullets: ['3 vistas Gold'] },
      { title: 'Transformación y preparación', description: 'Separación entre archivo original, tabla tipada para análisis y vistas agregadas.', bullets: ['Almacenamiento inicial en VARCHAR.', 'TRIM para limpiar strings y conversiones numéricas con CAST.', 'Normalización de indicadores YES/NO a Boolean.', 'Registro de Load_Timestamp en Silver.'] },
    ],
    domainsTitle: 'Vistas de negocio',
    domains: [
      { title: 'Impacto salarial por industria', description: '¿Cómo varían los promedios salariales antes y después de IA entre industrias?', bullets: ['VW_SALARY_IMPACT_BY_INDUSTRY', 'Industry', 'Avg_Salary_Before · Avg_Salary_After', 'Net_Change · Pct_Change'] },
      { title: 'Riesgo de automatización y educación', description: '¿Cómo se distribuye Automation_Risk entre niveles educativos?', bullets: ['VW_EDUCATION_RISK_PROFILE', 'Education_Level', 'Automation_Risk · Employee_Count'] },
      { title: 'Productividad y satisfacción', description: '¿Cómo se relacionan las métricas agregadas entre roles laborales?', bullets: ['VW_PRODUCTIVITY_VS_SATISFACTION', 'Job_Role', 'Avg_Productivity_Gain', 'Avg_Satisfaction'] },
    ],
    limitationsTitle: 'Alcance actual',
    limitations: ['El flujo principal está definido como SQL ejecutable en Snowflake.', 'Internal Stage y COPY INTO no representan ingesta streaming ni automatizada.', 'No se implementa orquestación end-to-end ni CI/CD.', 'No hay suite de pruebas automatizadas ni expectativas de calidad.', 'No se implementan cuarentena, CDC ni SCD.', 'No hay dashboard Power BI implementado.', 'No se verificó aquí una ejecución exitosa end-to-end.'],
    roadmapTitle: 'Mejoras futuras',
    roadmap: ['Automatizar la ingesta y orquestación.', 'Agregar validaciones de calidad, auditoría y monitoreo.', 'Evaluar cargas incrementales.', 'Incorporar pruebas automatizadas de transformaciones y CI/CD.', 'Ampliar el modelo analítico a partir de las vistas Gold.', 'Desarrollar visualizaciones para explorar los tres análisis.'],
    evidence: { title: 'Evidencia del repositorio', description: 'El README referencia estas capturas para documentar Stage, Bronze, Silver y Gold. Son enlaces a los archivos originales de GitHub; no se copiaron ni se interpretaron como imágenes locales.', links: evidenceFiles.map((item) => ({ label: item.labelEs, url: `${repository}/blob/main/img/${item.file}` })) },
    repositoryUrl: repository,
    repositoryLinkLabel: 'Ver repositorio en GitHub',
    languageSwitchLabel: 'Cambiar idioma a inglés',
    projectNavigationLabel: 'Navegación del proyecto',
    footer: 'Hecho con cariño by Carlos Martinez',
  },
  en: {
    backToProjects: 'Back to projects',
    eyebrow: 'CASE STUDY · DATA ENGINEERING',
    title: 'AI Job Impact Analysis — Snowflake Data Pipeline',
    subtitle: 'An analytical Snowflake pipeline for studying AI’s impact on salaries, automation, and labor productivity.',
    summaryTitle: 'Project Overview',
    summary: 'A Snowflake data engineering flow for analyzing information about AI’s impact across industries and job roles.',
    technicalSummary: 'The primary implementation uses SQL and a Medallion architecture: Internal Stage, Bronze with original VARCHAR data, Silver with cleansing and typing, and three Gold views for business questions. The README describes a 2,000-record dataset. The Snowpark Python notebook is a complementary DataFrame implementation; it is not an orchestrated job or automated run.',
    technologyLabel: 'Technologies',
    technologies: ['Snowflake', 'Snowflake SQL', 'Snowpark Python', 'Internal Stage', 'File Format', 'COPY INTO', 'Medallion Architecture', 'Data Cleansing', 'Business Insights'],
    tabs: ['Architecture', 'Components', 'Workflow', 'Code', 'Results'],
    architectureTitle: 'Pipeline Architecture',
    architectureLayers: [
      { eyebrow: 'LANDING ZONE', title: 'Landing Zone — Internal Stage', description: 'Snowflake internal storage for the original ai_job_impact.csv file.', bullets: ['Stage: STG_RAW_DATA.', 'File Format: CSV_GENERIC_FORMAT, defined in Bronze.', 'CSV header, delimiter, and empty-field handling are configured.'] },
      { eyebrow: '01 / MEDALLION', title: 'Bronze — Raw Data', description: 'Initial load from the Internal Stage into RAW_AI_DATA.', bullets: ['COPY INTO uses FILE_FORMAT.', 'All 17 columns are retained as VARCHAR.', 'ON_ERROR = CONTINUE can continue past file errors; it does not guarantee full record integrity.'] },
      { eyebrow: '02 / MEDALLION', title: 'Silver — Data Cleansing', description: 'Typed records prepared for analytical queries.', bullets: ['TRIM() removes spaces from text columns.', 'CAST converts numeric fields to native types.', 'CASE normalizes YES/NO to Boolean and adds Load_Timestamp.', 'The SQL does not implement expectations, quarantine, or deduplication.'] },
      { eyebrow: '03 / MEDALLION', title: 'Gold — Business Insights', description: 'Three aggregated SQL views over CLEANED_AI_DATA.', bullets: ['Salary impact by industry.', 'Automation risk profile by education.', 'Productivity and job satisfaction by role.'] },
    ],
    diagramTitle: 'Snowflake main flow and complementary Snowpark route',
    diagramDescription: 'The CSV passes through an Internal Stage and COPY INTO to Bronze, is cleaned and typed in Silver, and produces three Gold views. A separate route shows the Snowpark Python notebook reading data and calculating DataFrame aggregations.',
    aiDiagramLabels: { source: 'Source file', stage: 'STG_RAW_DATA', bronze: 'BRONZE', silver: 'SILVER', gold: 'GOLD', fileFormat: 'File Format · CSV_GENERIC_FORMAT', rawTable: 'RAW_AI_DATA', cleanTable: 'CLEANED_AI_DATA', views: ['VW_SALARY_IMPACT_BY_INDUSTRY', 'VW_EDUCATION_RISK_PROFILE', 'VW_PRODUCTIVITY_VS_SATISFACTION'], notebook: 'Snowpark notebook', dataframe: 'Snowpark DataFrame', aggregations: 'Aggregations' },
    aiWorkflowLabels: { stage: 'Internal Stage', copy: 'COPY INTO', bronze: 'Bronze · RAW_AI_DATA', cleansing: 'SQL Cleansing', silver: 'Silver · CLEANED_AI_DATA', views: 'Business Views', analysis: 'Analysis', session: 'Snowflake Session', dataframe: 'Snowpark DataFrame', transformations: 'Transformations', aggregates: 'Aggregations', sqlRoute: 'MAIN ROUTE · SNOWFLAKE SQL', notebookRoute: 'COMPLEMENTARY ROUTE · SNOWPARK PYTHON' },
    workflowDiagramTitle: 'Processing routes',
    workflowDiagramDescription: 'The main route runs from Internal Stage to COPY INTO, Bronze, SQL cleansing, Silver, business views, and analysis. Below is the complementary Snowflake Session, Snowpark DataFrame, transformations, and aggregations route.',
    componentsTitle: 'Solution Components',
    components: [
      { title: 'Data source', description: 'AI Job Impact Dataset · ai_job_impact.csv', bullets: ['The README describes 2,000 records; this count was not verified by running a load.', 'Fields: Employee_ID, Age, Gender, Education_Level, Industry, Job_Role, Years_Experience, AI_Adoption_Level, Automation_Risk, Upskilling_Required, Salary_Before_AI, Salary_After_AI, Job_Status, Work_Hours_Per_Week, Remote_Work, Job_Satisfaction, and Productivity_Change_Pct.'] },
      { title: 'Snowflake storage', description: 'AI_IMPACT_DB', bullets: ['BRONZE, SILVER, and GOLD schemas.', 'Internal Stage STG_RAW_DATA and File Format CSV_GENERIC_FORMAT.', 'Separates the original file from SQL processing.'] },
      { title: 'Bronze ingestion', description: 'AI_IMPACT.sql', bullets: ['Creates RAW_AI_DATA with 17 VARCHAR columns.', 'COPY INTO reads from the Internal Stage using its File Format.', 'ON_ERROR = CONTINUE is not a complete data quality validation.'], code: ['RAW_AI_DATA', 'COPY INTO', 'VARCHAR'] },
      { title: 'Silver transformation', description: 'CLEANED_AI_DATA', bullets: ['TRIM cleans text values.', 'Age and Years_Experience become INT; salaries NUMBER(10,2); productivity FLOAT.', 'CASE converts Upskilling_Required and Remote_Work to Boolean.', 'Adds CURRENT_TIMESTAMP() as Load_Timestamp.'], code: ['Age', 'Years_Experience', 'Salary_Before_AI', 'Salary_After_AI', 'Upskilling_Required_Bool', 'Remote_Work_Bool', 'Productivity_Change_Pct'] },
      { title: 'Gold analytical views', description: 'Three SQL views over CLEANED_AI_DATA.', bullets: ['VW_SALARY_IMPACT_BY_INDUSTRY: salary averages and net/percentage change.', 'VW_EDUCATION_RISK_PROFILE: Education_Level, Automation_Risk, and Employee_Count.', 'VW_PRODUCTIVITY_VS_SATISFACTION: averages by Job_Role.'] },
      { title: 'Snowpark Python notebook', description: 'AI_IMPACT.ipynb · complementary implementation.', bullets: ['Gets an active session with get_active_session().', 'Uses session.read for the Stage and session.table for tables.', 'Transforms and aggregates data with Snowpark DataFrames.', 'It is not presented as a job, deployment, or orchestrated process.'], code: ['get_active_session()', 'session.read', 'session.table', 'group_by()', 'agg()', 'with_column()'] },
      { title: 'Project evidence', description: 'The README links five original screenshots of setup and processing.', bullets: ['They are not available as local files in this checkout; links point to the originals on GitHub.'] },
    ],
    workflowTitle: 'Data Process Step by Step',
    workflowIntro: 'The main flow is the Snowflake SQL script. The Snowpark notebook is shown separately as a complementary route, not as process orchestration.',
    workflow: [
      { title: 'Prepare the context', file: 'AI_IMPACT.sql', description: 'Set the Snowflake database and warehouse context without assuming an administrative role is generally required.' },
      { title: 'Configure storage', file: 'AI_IMPACT.sql', description: 'Create AI_IMPACT_DB, Bronze/Silver/Gold schemas, the File Format, and the Internal Stage.' },
      { title: 'Load Bronze', file: 'AI_IMPACT.sql', description: 'Place ai_job_impact.csv in STG_RAW_DATA and run COPY INTO to load RAW_AI_DATA as VARCHAR.', bullets: ['The read uses the Stage File Format.', 'ON_ERROR = CONTINUE governs load error handling; it is not complete validation.', 'This is not streaming, incremental, or automated ingestion.'] },
      { title: 'Transform to Silver', file: 'AI_IMPACT.sql', description: 'Create CLEANED_AI_DATA with TRIM, CAST conversions, YES/NO to Boolean normalization, and CURRENT_TIMESTAMP().' },
      { title: 'Build Gold views', file: 'AI_IMPACT.sql', description: 'Create three aggregated views for business queries.' },
      { title: 'Explore the analyses', description: 'Query the views to review salary changes by industry, automation risk by education, and productivity against satisfaction by role. No data values or conclusions are asserted without querying the dataset.' },
      { title: 'Complementary Snowpark processing', file: 'AI_IMPACT.ipynb', description: 'Get an active session, read the Stage with Snowpark, create processing DataFrames, and calculate three analytical aggregations.', bullets: ['The notebook is an alternative Python implementation route.', 'Its Gold aggregations are displayed DataFrames, not the same SQL Gold views.'] },
    ],
    workflowNote: 'The SQL COPY INTO route and Snowpark notebook are distinct artifacts. The repository does not define end-to-end orchestration or automated execution.',
    codeTitle: 'Pipeline Implementation',
    codeExamples: [
      { layer: 'Landing', file: 'AI_IMPACT.sql', title: 'Internal Stage and File Format', description: 'Configures CSV reading and an Internal Stage for the original file.', code: code.stage, language: 'sql', url: sqlUrl },
      { layer: 'Bronze', file: 'AI_IMPACT.sql', title: 'Initial VARCHAR load', description: 'Partial RAW_AI_DATA definition and COPY INTO load. The repository table has 17 columns.', code: code.bronze, language: 'sql', url: sqlUrl },
      { layer: 'Silver', file: 'AI_IMPACT.sql', title: 'Cleansing and type conversion', description: 'Examples from the SELECT that creates CLEANED_AI_DATA with cleaned text, numeric fields, booleans, and a timestamp.', code: code.silver, language: 'sql', url: sqlUrl },
      { layer: 'Gold', file: 'AI_IMPACT.sql', title: 'Business Insights views', description: 'Three views group salaries by industry, risk by education, and productivity/satisfaction by role.', code: code.gold, language: 'sql', url: sqlUrl },
      { layer: 'Complementary Snowpark Python', file: 'AI_IMPACT.ipynb', title: 'DataFrames and aggregations', description: 'Notebook excerpts with an active session, Stage read, Python Silver table read, and Snowpark salary aggregation.', code: code.snowpark, language: 'python', url: `${repository}/blob/main/AI_IMPACT.ipynb` },
    ],
    resultsTitle: 'Project Results',
    resultCards: [
      { title: 'Documented coverage', description: 'These quantities come from the README and SQL artifacts; they were not verified by running Snowflake in this task.', bullets: ['Dataset described: 2,000 records', '3 Medallion layers: Bronze, Silver, and Gold', '1 Internal Stage · 1 Bronze table · 1 Silver table', '3 Gold analytical views'] },
      { title: 'Business questions', description: 'Aggregated views make these questions explorable; no numeric dataset conclusions are presented.', bullets: ['3 Gold views'] },
      { title: 'Data transformation and preparation', description: 'Separation between original files, an analytically typed table, and aggregated views.', bullets: ['Initial VARCHAR storage.', 'TRIM for text and CAST for numeric conversions.', 'YES/NO indicators normalized to Boolean.', 'Load_Timestamp recorded in Silver.'] },
    ],
    domainsTitle: 'Business views',
    domains: [
      { title: 'Salary impact by industry', description: 'How do average salaries before and after AI vary across industries?', bullets: ['VW_SALARY_IMPACT_BY_INDUSTRY', 'Industry', 'Avg_Salary_Before · Avg_Salary_After', 'Net_Change · Pct_Change'] },
      { title: 'Automation risk and education', description: 'How is Automation_Risk distributed across education levels?', bullets: ['VW_EDUCATION_RISK_PROFILE', 'Education_Level', 'Automation_Risk · Employee_Count'] },
      { title: 'Productivity and satisfaction', description: 'How do the aggregate measures relate across job roles?', bullets: ['VW_PRODUCTIVITY_VS_SATISFACTION', 'Job_Role', 'Avg_Productivity_Gain', 'Avg_Satisfaction'] },
    ],
    limitationsTitle: 'Current scope',
    limitations: ['The primary flow is defined as SQL scripts for Snowflake.', 'Internal Stage and COPY INTO are not streaming or automated ingestion.', 'No end-to-end orchestration or CI/CD is implemented.', 'There is no automated test suite or quality expectations.', 'Quarantine, CDC, and SCD are not implemented.', 'No Power BI dashboard is implemented.', 'A successful end-to-end run was not verified here.'],
    roadmapTitle: 'Future improvements',
    roadmap: ['Automate ingestion and orchestration.', 'Add data quality validation, auditing, and monitoring.', 'Evaluate incremental loads.', 'Add automated transformation tests and CI/CD.', 'Expand the analytical model from the Gold views.', 'Build visualizations to explore the three analyses.'],
    evidence: { title: 'Repository evidence', description: 'The README references these screenshots for Stage, Bronze, Silver, and Gold. These links open the original GitHub files; no local images were copied or interpreted.', links: evidenceFiles.map((item) => ({ label: item.labelEn, url: `${repository}/blob/main/img/${item.file}` })) },
    repositoryUrl: repository,
    repositoryLinkLabel: 'View repository on GitHub',
    languageSwitchLabel: 'Switch language to Spanish',
    projectNavigationLabel: 'Project navigation',
    footer: 'Made with care by Carlos Martinez',
  },
};
