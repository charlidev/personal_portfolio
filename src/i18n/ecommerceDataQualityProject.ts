import type { OlistProjectCopy, ProjectLocale } from './olistProject';

const repository = 'https://github.com/charlidev/snowflake-data-quality-ecommerce';
const sqlUrl = `${repository}/blob/main/tratamiento.sql`;
const sourceTable = 'AMAZON_AND_ECOMMERCE_WEBSITES_PRODUCT_VIEWS_AND_PURCHASES.DATAFEEDS.PRODUCT_VIEWS_AND_PURCHASES';

const code = {
  profiling: `SELECT
    COUNT(*) AS total_filas,
    SUM(IFF(SITE IS NULL, 1, 0)) AS null_site,
    SUM(IFF(COUNTRY IS NULL, 1, 0)) AS null_country,
    SUM(IFF(YEAR IS NULL, 1, 0)) AS null_year,
    SUM(IFF(MONTH IS NULL, 1, 0)) AS null_month,
    SUM(IFF(PRODUCT IS NULL, 1, 0)) AS null_product
FROM ${sourceTable};`,
  clean: `CREATE OR REPLACE VIEW CARLOS_SANDBOX.DATAFEEDS.VW_DATASET_CLEAN AS
SELECT
    SITE,
    COUNTRY,
    YEAR,
    MONTH,
    PRODUCT,
    COALESCE(TITLE, 'NO TITLE') AS TITLE,
    COALESCE(BRAND, 'UNKNOWN') AS BRAND,
    COALESCE(MAIN_CATEGORY, 'UNKNOWN') AS MAIN_CATEGORY,
    COALESCE(SUB_CATEGORY, 'UNKNOWN') AS SUB_CATEGORY,
    COALESCE(ESTIMATED_VIEWS, 0) AS ESTIMATED_VIEWS,
    COALESCE(ESTIMATED_PURCHASES, 0) AS ESTIMATED_PURCHASES
FROM ${sourceTable};`,
  dedup: `CREATE OR REPLACE VIEW CARLOS_SANDBOX.DATAFEEDS.VW_DATASET_DEDUP AS
SELECT
    SITE,
    COUNTRY,
    YEAR,
    MONTH,
    PRODUCT,
    ANY_VALUE(TITLE) AS TITLE,
    ANY_VALUE(BRAND) AS BRAND,
    ANY_VALUE(MAIN_CATEGORY) AS MAIN_CATEGORY,
    ANY_VALUE(SUB_CATEGORY) AS SUB_CATEGORY,
    SUM(ESTIMATED_VIEWS) AS ESTIMATED_VIEWS,
    SUM(ESTIMATED_PURCHASES) AS ESTIMATED_PURCHASES
FROM CARLOS_SANDBOX.DATAFEEDS.VW_DATASET_CLEAN
GROUP BY SITE, COUNTRY, YEAR, MONTH, PRODUCT;`,
  final: `CREATE OR REPLACE VIEW CARLOS_SANDBOX.DATAFEEDS.VW_DATASET_FINAL AS
SELECT
    SITE,
    COUNTRY,
    YEAR,
    MONTH,
    PRODUCT,
    TITLE,
    BRAND,
    MAIN_CATEGORY,
    SUB_CATEGORY,
    ESTIMATED_VIEWS,
    CASE
        WHEN ESTIMATED_PURCHASES > ESTIMATED_VIEWS
            THEN ESTIMATED_VIEWS
        ELSE ESTIMATED_PURCHASES
    END AS ESTIMATED_PURCHASES,
    CASE
        WHEN ESTIMATED_PURCHASES > ESTIMATED_VIEWS
            THEN 1
        ELSE 0
    END AS IS_ANOMALY
FROM CARLOS_SANDBOX.DATAFEEDS.VW_DATASET_DEDUP;`,
  materialization: `CREATE OR REPLACE TABLE CARLOS_SANDBOX.DATAFEEDS.DATASET_FINAL AS
SELECT *
FROM CARLOS_SANDBOX.DATAFEEDS.VW_DATASET_FINAL;`,
};

const es: OlistProjectCopy = {
  backToProjects: 'Volver a proyectos',
  eyebrow: 'CASO DE ESTUDIO · DATA QUALITY',
  title: 'E-commerce Data Quality Pipeline',
  subtitle: 'Limpieza, deduplicación y control de anomalías en datos de e-commerce con Snowflake.',
  summaryTitle: 'Resumen del Proyecto',
  summary: 'Implementación de un proceso de calidad de datos con Snowflake SQL que transforma información compartida desde Snowflake Marketplace en una tabla analítica consistente.',
  technicalSummary: 'El proceso conserva la fuente original, identifica valores nulos, estandariza atributos, consolida duplicados lógicos y aplica reglas de negocio para corregir anomalías sin perder trazabilidad.',
  technologyLabel: 'Tecnologías',
  technologies: ['Snowflake', 'SQL', 'Snowflake Marketplace', 'Data Profiling', 'Data Cleansing', 'Deduplication', 'Business Rules'],
  tabs: ['Arquitectura', 'Componentes', 'Flujo de trabajo', 'Código', 'Resultados'],
  architectureTitle: 'Arquitectura del proceso de Data Quality',
  architectureLayers: [
    { eyebrow: 'SOURCE · READ ONLY', title: 'RAW — Source Data', description: 'Dataset agregado compartido desde Snowflake Marketplace, conservado como fuente original de solo lectura.', bullets: [`Origen: ${sourceTable}.`, 'Incluye sitio, país, año, mes, producto y métricas ESTIMATED_VIEWS y ESTIMATED_PURCHASES.', 'La fuente compartida no se modifica ni se materializa como una tabla RAW local en este proceso.'] },
    { eyebrow: '01 · STANDARDIZATION', title: 'CLEAN — Standardization', description: 'Vista VW_DATASET_CLEAN que sustituye nulos descriptivos y de métricas, manteniendo los atributos de negocio.', bullets: ['TITLE → NO TITLE; BRAND → UNKNOWN.', 'MAIN_CATEGORY y SUB_CATEGORY → UNKNOWN.', 'ESTIMATED_VIEWS y ESTIMATED_PURCHASES → 0.', 'Las reglas se aplican en una vista sin alterar la fuente original.'] },
    { eyebrow: '02 · LOGICAL DEDUPLICATION', title: 'DEDUP — Logical Deduplication', description: 'Vista VW_DATASET_DEDUP que consolida filas correspondientes a la misma entidad lógica.', bullets: ['Llave lógica: SITE + COUNTRY + YEAR + MONTH + PRODUCT.', 'ANY_VALUE() conserva un valor descriptivo representativo.', 'SUM() agrega ESTIMATED_VIEWS y ESTIMATED_PURCHASES.', 'No usa ROW_NUMBER() ni se limita a duplicados exactos.'] },
    { eyebrow: '03 · BUSINESS RULES', title: 'FINAL — Correction & Materialization', description: 'VW_DATASET_FINAL corrige la relación entre compras y vistas y marca los registros corregidos.', bullets: ['Si ESTIMATED_PURCHASES supera ESTIMATED_VIEWS, CASE limita compras al número de vistas.', 'IS_ANOMALY = 1 identifica la corrección; 0 indica que no fue necesaria.', 'La vista se materializa en la tabla persistente DATASET_FINAL.', 'No se modifica la fuente de Marketplace.'] },
  ],
  diagramTitle: 'Flujo de arquitectura de Data Quality',
  diagramDescription: 'La fuente compartida se transforma mediante vistas SQL de limpieza, deduplicación y reglas de negocio antes de materializar DATASET_FINAL. Las consultas laterales validan las etapas.',
  ecommerceDiagramLabels: {
    marketplace: 'Snowflake Marketplace · fuente compartida',
    raw: 'RAW · fuente de solo lectura',
    clean: 'CLEAN · VW_DATASET_CLEAN',
    dedup: 'DEDUP · VW_DATASET_DEDUP',
    finalView: 'VISTA FINAL · VW_DATASET_FINAL',
    finalTable: 'DATASET_FINAL · tabla materializada',
    validationTitle: 'Consultas de validación SQL',
    validationStages: ['Perfilado de RAW', 'Revisión de nulos en CLEAN', 'Validación de llave en DEDUP', 'Revisión de anomalías en FINAL', 'Conteo y controles de calidad de la tabla'],
    cleanOps: ['COALESCE', 'Estandarización de texto', 'Tratamiento de nulos'],
    dedupOps: ['Llave de negocio', 'ANY_VALUE', 'SUM'],
    finalOps: ['CASE', 'Corrección de anomalías', 'IS_ANOMALY'],
  },
  componentsTitle: 'Componentes de la solución',
  components: [
    { title: 'Fuente de datos', description: 'Snowflake Marketplace · Product Views and Purchases.', bullets: [`Origen compartido: ${sourceTable}.`, 'Campos: SITE, COUNTRY, YEAR, MONTH, PRODUCT, TITLE, BRAND, MAIN_CATEGORY, SUB_CATEGORY, ESTIMATED_VIEWS y ESTIMATED_PURCHASES.', 'Los datos se consultan desde Marketplace; el repositorio no contiene una copia del dataset original.'] },
    { title: 'Data Profiling', description: 'tratamiento.sql · perfilado antes de las transformaciones.', bullets: ['Consulta el conteo total y los nulos por columna mediante COUNT(*) e IFF.', 'Inspecciona atributos, dimensiones de negocio y métricas.', 'Compara RAW y CLEAN, y busca duplicados lógicos y anomalías.', 'No se presentan cantidades ni porcentajes porque no se ejecutó la consulta en Snowflake.'], code: ['tratamiento.sql'] },
    { title: 'Data Cleansing', description: 'Vista VW_DATASET_CLEAN con COALESCE y reglas explícitas para nulos.', bullets: ['TITLE → NO TITLE.', 'BRAND, MAIN_CATEGORY y SUB_CATEGORY → UNKNOWN.', 'ESTIMATED_VIEWS y ESTIMATED_PURCHASES → 0.', 'Conserva SITE, COUNTRY, YEAR, MONTH y PRODUCT; RAW permanece intacta.'], code: ['VW_DATASET_CLEAN', 'COALESCE'] },
    { title: 'Deduplicación lógica', description: 'Vista VW_DATASET_DEDUP, agrupada por la llave de negocio.', bullets: ['SITE + COUNTRY + YEAR + MONTH + PRODUCT.', 'GROUP BY agrupa registros de la misma entidad lógica.', 'ANY_VALUE() selecciona atributos descriptivos representativos.', 'SUM() agrega las métricas de visitas y compras.'], code: ['VW_DATASET_DEDUP', 'GROUP BY', 'ANY_VALUE', 'SUM'] },
    { title: 'Reglas de negocio', description: 'Vista VW_DATASET_FINAL y corrección trazable de anomalías.', bullets: ['Regla: ESTIMATED_PURCHASES no debe superar ESTIMATED_VIEWS.', 'CASE limita las compras a las vistas cuando se detecta la condición.', 'IS_ANOMALY = 1 identifica registros corregidos; 0 identifica los demás.', 'La corrección se aplica a la vista derivada y no modifica la fuente original.'], code: ['VW_DATASET_FINAL', 'IS_ANOMALY'] },
    { title: 'Materialización y consumo', description: 'DATASET_FINAL · tabla persistente creada desde VW_DATASET_FINAL.', bullets: ['El SQL materializa el resultado con CREATE OR REPLACE TABLE.', 'Incluye consultas posteriores para validar conteos, nulos y anomalías.', 'El repositorio contiene dashboard.pbix; no se inspeccionó su contenido y no se afirma que sea un dashboard terminado.'], code: ['DATASET_FINAL', 'dashboard.pbix'] },
  ],
  workflowTitle: 'Proceso de Datos Paso a Paso',
  workflowIntro: 'Secuencia de consultas y vistas SQL documentada en tratamiento.sql. No se presenta como un proceso automatizado u orquestado.',
  workflow: [
    { title: 'Acceso a los datos', file: 'Snowflake Marketplace', description: 'Consultar el dataset Product Views and Purchases compartido en modo de solo lectura.' },
    { title: 'Perfilado inicial', file: 'tratamiento.sql', description: 'Contar filas, revisar valores nulos por columna, inspeccionar métricas y explorar duplicados lógicos.' },
    { title: 'Crear VW_DATASET_CLEAN', file: 'tratamiento.sql', description: 'Aplicar COALESCE a textos y métricas para estandarizar nulos, sin modificar RAW.' },
    { title: 'Detectar duplicados lógicos', file: 'tratamiento.sql', description: 'Agrupar CLEAN por SITE, COUNTRY, YEAR, MONTH y PRODUCT, e inspeccionar las claves con más de una fila.' },
    { title: 'Consolidar en VW_DATASET_DEDUP', file: 'tratamiento.sql', description: 'Usar ANY_VALUE() para atributos descriptivos y SUM() para métricas; después consultar la vista para comprobar la unicidad de la llave lógica.' },
    { title: 'Corregir y marcar anomalías', file: 'tratamiento.sql', description: 'En VW_DATASET_FINAL, limitar ESTIMATED_PURCHASES a ESTIMATED_VIEWS cuando las compras sean mayores y registrar IS_ANOMALY.' },
    { title: 'Materializar y validar resultados', file: 'tratamiento.sql', description: 'Crear DATASET_FINAL y ejecutar las consultas de validación de filas, nulos, anomalías restantes y registros corregidos.' },
  ],
  workflowNote: 'El repositorio documenta una secuencia de operaciones SQL manuales. No demuestra automatización, cargas incrementales ni orquestación.',
  codeTitle: 'Implementación de Data Quality',
  codeExamples: [
    { layer: 'PROFILE', file: 'tratamiento.sql', title: 'Conteo de nulos por columna', description: 'Fragmento real del perfilado inicial para contar filas y nulos en los atributos principales. El archivo incluye más columnas en la consulta completa.', code: code.profiling, language: 'sql', url: sqlUrl },
    { layer: 'CLEAN', file: 'tratamiento.sql', title: 'Limpieza con COALESCE', description: 'Fragmento fiel de la vista que estandariza los campos descriptivos y métricas nulas, leyendo directamente la fuente Marketplace.', code: code.clean, language: 'sql', url: sqlUrl },
    { layer: 'DEDUP', file: 'tratamiento.sql', title: 'Deduplicación por llave lógica', description: 'Agrupa por la llave SITE, COUNTRY, YEAR, MONTH y PRODUCT; ANY_VALUE conserva atributos representativos y SUM agrega las métricas.', code: code.dedup, language: 'sql', url: sqlUrl },
    { layer: 'FINAL', file: 'tratamiento.sql', title: 'Corrección trazable de anomalías', description: 'Aplica la regla conservadora con CASE y añade IS_ANOMALY para conservar el indicador de corrección.', code: code.final, language: 'sql', url: sqlUrl },
    { layer: 'MATERIALIZATION', file: 'tratamiento.sql', title: 'Materialización de DATASET_FINAL', description: 'Crea la tabla persistente desde VW_DATASET_FINAL para consultas posteriores.', code: code.materialization, language: 'sql', url: sqlUrl },
  ],
  resultsTitle: 'Resultados del Proyecto',
  resultCards: [
    { title: 'Etapas del proceso', description: 'Conteos de estructura documentados en el SQL; no representan métricas de ejecución.', bullets: ['1 fuente compartida de Marketplace', '3 vistas de transformación: CLEAN, DEDUP y FINAL', '1 tabla final materializada', '4 etapas conceptuales: RAW, CLEAN, DEDUP y FINAL'] },
    { title: 'Controles de calidad', description: 'Reglas y consultas presentes en tratamiento.sql.', bullets: ['Perfilado de nulos por columna', 'Estandarización de textos y tratamiento de métricas nulas', 'Detección y consolidación de duplicados lógicos por llave de negocio', 'Detección de compras superiores a vistas', 'Corrección mediante CASE e indicador IS_ANOMALY'] },
    { title: 'Resultado analítico', description: 'DATASET_FINAL es la tabla persistente que se crea desde VW_DATASET_FINAL.', bullets: ['Atributos descriptivos y métricas estandarizados por las reglas implementadas', 'Duplicados lógicos consolidados', 'Regla de anomalía aplicada en la vista final', 'Trazabilidad de correcciones mediante IS_ANOMALY', 'Preparada en el SQL para consultas analíticas'] },
  ],
  domainsTitle: 'Validaciones SQL',
  limitationsTitle: 'Alcance actual',
  limitations: ['El SQL define consultas y transformaciones; no demuestra una ejecución automatizada u orquestada.', 'No se proporcionan resultados numéricos de profiling, duplicados o anomalías.', 'La fuente Marketplace es compartida y de solo lectura; el repositorio no incluye el dataset original.', 'El archivo dashboard.pbix existe, pero no se inspeccionó su contenido ni se afirma que sea un reporte terminado.'],
  roadmapTitle: 'Mejoras futuras',
  roadmap: ['Automatizar la ejecución de las consultas SQL.', 'Orquestar las etapas del proceso.', 'Crear una suite de pruebas de calidad.', 'Monitorear las anomalías.', 'Añadir auditoría de ejecuciones.', 'Validar reglas de negocio adicionales.', 'Evaluar una evolución hacia cargas incrementales.', 'Documentar el modelo analítico.', 'Inspeccionar y validar visualmente el archivo Power BI.'],
  repositoryUrl: repository,
  repositoryLinkLabel: 'Ver repositorio del proyecto en GitHub',
  languageSwitchLabel: 'Cambiar idioma a inglés',
  projectNavigationLabel: 'Navegación del proyecto',
  validationQueries: {
    title: 'Consultas de validación',
    items: ['Conteo de nulos en RAW y CLEAN.', 'Detección de duplicados lógicos antes y después de VW_DATASET_DEDUP.', 'Conteo de anomalías en VW_DATASET_DEDUP y comprobación de anomalías restantes en VW_DATASET_FINAL.', 'Conteo de registros marcados con IS_ANOMALY = 1.', 'Comparación de filas entre VW_DATASET_FINAL y DATASET_FINAL, más una consulta de nulos y anomalías en la tabla.'],
  },
  footer: 'Hecho con cariño by Carlos Martinez',
};

const en: OlistProjectCopy = {
  backToProjects: 'Back to projects',
  eyebrow: 'CASE STUDY · DATA QUALITY',
  title: 'E-commerce Data Quality Pipeline',
  subtitle: 'Data cleansing, deduplication, and anomaly control for e-commerce data with Snowflake.',
  summaryTitle: 'Project Summary',
  summary: 'Implementation of a data quality process with Snowflake SQL that transforms information shared from Snowflake Marketplace into a consistent analytical table.',
  technicalSummary: 'The process preserves the original source, profiles null values, standardizes attributes, consolidates logical duplicates, and applies business rules to correct anomalies while keeping traceability.',
  technologyLabel: 'Technologies',
  technologies: ['Snowflake', 'SQL', 'Snowflake Marketplace', 'Data Profiling', 'Data Cleansing', 'Deduplication', 'Business Rules'],
  tabs: ['Architecture', 'Components', 'Workflow', 'Code', 'Results'],
  architectureTitle: 'Data Quality Process Architecture',
  architectureLayers: [
    { eyebrow: 'SOURCE · READ ONLY', title: 'RAW — Source Data', description: 'Aggregated dataset shared through Snowflake Marketplace and retained as a read-only original source.', bullets: [`Source: ${sourceTable}.`, 'Includes site, country, year, month, product, and ESTIMATED_VIEWS and ESTIMATED_PURCHASES metrics.', 'The shared source is not modified or materialized as a local RAW table in this process.'] },
    { eyebrow: '01 · STANDARDIZATION', title: 'CLEAN — Standardization', description: 'VW_DATASET_CLEAN replaces descriptive and metric nulls while preserving business attributes.', bullets: ['TITLE → NO TITLE; BRAND → UNKNOWN.', 'MAIN_CATEGORY and SUB_CATEGORY → UNKNOWN.', 'ESTIMATED_VIEWS and ESTIMATED_PURCHASES → 0.', 'Rules are applied in a view without changing the original source.'] },
    { eyebrow: '02 · LOGICAL DEDUPLICATION', title: 'DEDUP — Logical Deduplication', description: 'VW_DATASET_DEDUP consolidates rows that represent the same logical entity.', bullets: ['Logical key: SITE + COUNTRY + YEAR + MONTH + PRODUCT.', 'ANY_VALUE() retains a representative descriptive value.', 'SUM() aggregates ESTIMATED_VIEWS and ESTIMATED_PURCHASES.', 'It does not use ROW_NUMBER() or only remove exact duplicates.'] },
    { eyebrow: '03 · BUSINESS RULES', title: 'FINAL — Correction & Materialization', description: 'VW_DATASET_FINAL corrects the relationship between purchases and views and flags corrected records.', bullets: ['When ESTIMATED_PURCHASES exceeds ESTIMATED_VIEWS, CASE limits purchases to the view count.', 'IS_ANOMALY = 1 identifies a correction; 0 means no correction was needed.', 'The view is materialized into the persistent DATASET_FINAL table.', 'The Marketplace source is not modified.'] },
  ],
  diagramTitle: 'Data Quality Architecture Flow',
  diagramDescription: 'The shared source is transformed through SQL views for cleansing, deduplication, and business rules before DATASET_FINAL is materialized. Side queries validate each stage.',
  ecommerceDiagramLabels: {
    marketplace: 'Snowflake Marketplace · shared source',
    raw: 'RAW · read-only source',
    clean: 'CLEAN · VW_DATASET_CLEAN',
    dedup: 'DEDUP · VW_DATASET_DEDUP',
    finalView: 'FINAL VIEW · VW_DATASET_FINAL',
    finalTable: 'DATASET_FINAL · materialized table',
    validationTitle: 'SQL validation queries',
    validationStages: ['RAW profiling', 'CLEAN null checks', 'DEDUP key checks', 'FINAL anomaly checks', 'Table count & quality checks'],
    cleanOps: ['COALESCE', 'Text standardization', 'Null handling'],
    dedupOps: ['Business key', 'ANY_VALUE', 'SUM'],
    finalOps: ['CASE', 'Anomaly correction', 'IS_ANOMALY'],
  },
  componentsTitle: 'Solution Components',
  components: [
    { title: 'Data source', description: 'Snowflake Marketplace · Product Views and Purchases.', bullets: [`Shared source: ${sourceTable}.`, 'Fields: SITE, COUNTRY, YEAR, MONTH, PRODUCT, TITLE, BRAND, MAIN_CATEGORY, SUB_CATEGORY, ESTIMATED_VIEWS, and ESTIMATED_PURCHASES.', 'The data is queried from Marketplace; the repository does not contain a copy of the original dataset.'] },
    { title: 'Data Profiling', description: 'tratamiento.sql · profiling before transformation.', bullets: ['Counts total rows and nulls per column using COUNT(*) and IFF.', 'Inspects business attributes, dimensions, and metrics.', 'Compares RAW and CLEAN and checks logical duplicates and anomalies.', 'No row counts or percentages are shown because the query was not run in Snowflake.'], code: ['tratamiento.sql'] },
    { title: 'Data Cleansing', description: 'VW_DATASET_CLEAN applies COALESCE and explicit null rules.', bullets: ['TITLE → NO TITLE.', 'BRAND, MAIN_CATEGORY, and SUB_CATEGORY → UNKNOWN.', 'ESTIMATED_VIEWS and ESTIMATED_PURCHASES → 0.', 'Preserves SITE, COUNTRY, YEAR, MONTH, and PRODUCT; RAW remains unchanged.'], code: ['VW_DATASET_CLEAN', 'COALESCE'] },
    { title: 'Logical deduplication', description: 'VW_DATASET_DEDUP groups rows by the business key.', bullets: ['SITE + COUNTRY + YEAR + MONTH + PRODUCT.', 'GROUP BY groups records for the same logical entity.', 'ANY_VALUE() selects representative descriptive attributes.', 'SUM() aggregates views and purchases.'], code: ['VW_DATASET_DEDUP', 'GROUP BY', 'ANY_VALUE', 'SUM'] },
    { title: 'Business rules', description: 'VW_DATASET_FINAL and traceable anomaly correction.', bullets: ['Rule: ESTIMATED_PURCHASES should not exceed ESTIMATED_VIEWS.', 'CASE caps purchases at views when the condition is met.', 'IS_ANOMALY = 1 identifies corrected records; 0 identifies the others.', 'The correction is applied to a derived view and does not modify the original source.'], code: ['VW_DATASET_FINAL', 'IS_ANOMALY'] },
    { title: 'Materialization and consumption', description: 'DATASET_FINAL · persistent table created from VW_DATASET_FINAL.', bullets: ['The SQL materializes the result with CREATE OR REPLACE TABLE.', 'Subsequent queries validate counts, nulls, and anomalies.', 'The repository contains dashboard.pbix; its contents were not inspected, and it is not claimed to be a completed dashboard.'], code: ['DATASET_FINAL', 'dashboard.pbix'] },
  ],
  workflowTitle: 'Data Process Step by Step',
  workflowIntro: 'Sequence of SQL queries and views documented in tratamiento.sql. It is not presented as an automated or orchestrated process.',
  workflow: [
    { title: 'Access the data', file: 'Snowflake Marketplace', description: 'Query the read-only Product Views and Purchases dataset shared from Marketplace.' },
    { title: 'Initial profiling', file: 'tratamiento.sql', description: 'Count rows, review nulls by column, inspect metrics, and explore logical duplicates.' },
    { title: 'Create VW_DATASET_CLEAN', file: 'tratamiento.sql', description: 'Apply COALESCE to text and metric fields to standardize nulls without changing RAW.' },
    { title: 'Detect logical duplicates', file: 'tratamiento.sql', description: 'Group CLEAN by SITE, COUNTRY, YEAR, MONTH, and PRODUCT, then inspect keys with multiple rows.' },
    { title: 'Consolidate into VW_DATASET_DEDUP', file: 'tratamiento.sql', description: 'Use ANY_VALUE() for descriptive attributes and SUM() for metrics, then query the view to check business-key uniqueness.' },
    { title: 'Correct and flag anomalies', file: 'tratamiento.sql', description: 'In VW_DATASET_FINAL, cap ESTIMATED_PURCHASES at ESTIMATED_VIEWS when purchases exceed views and record IS_ANOMALY.' },
    { title: 'Materialize and validate results', file: 'tratamiento.sql', description: 'Create DATASET_FINAL and run validation queries for rows, nulls, remaining anomalies, and corrected records.' },
  ],
  workflowNote: 'The repository documents a manual sequence of SQL operations. It does not demonstrate automation, incremental loads, or orchestration.',
  codeTitle: 'Data Quality Implementation',
  codeExamples: [
    { layer: 'PROFILE', file: 'tratamiento.sql', title: 'Null counts by column', description: 'Real excerpt from the initial profile that counts rows and nulls in key attributes. The full file includes additional columns in the query.', code: code.profiling, language: 'sql', url: sqlUrl },
    { layer: 'CLEAN', file: 'tratamiento.sql', title: 'Cleansing with COALESCE', description: 'Faithful excerpt from the view that standardizes descriptive fields and null metrics, reading directly from the Marketplace source.', code: code.clean, language: 'sql', url: sqlUrl },
    { layer: 'DEDUP', file: 'tratamiento.sql', title: 'Deduplication by logical key', description: 'Groups by SITE, COUNTRY, YEAR, MONTH, and PRODUCT; ANY_VALUE retains representative attributes and SUM aggregates the metrics.', code: code.dedup, language: 'sql', url: sqlUrl },
    { layer: 'FINAL', file: 'tratamiento.sql', title: 'Traceable anomaly correction', description: 'Applies the conservative rule with CASE and adds IS_ANOMALY to retain a correction indicator.', code: code.final, language: 'sql', url: sqlUrl },
    { layer: 'MATERIALIZATION', file: 'tratamiento.sql', title: 'Materialize DATASET_FINAL', description: 'Creates the persistent table from VW_DATASET_FINAL.', code: code.materialization, language: 'sql', url: sqlUrl },
  ],
  resultsTitle: 'Project Results',
  resultCards: [
    { title: 'Process stages', description: 'Structural counts documented in the SQL; they are not execution metrics.', bullets: ['1 shared Marketplace source', '3 transformation views: CLEAN, DEDUP, and FINAL', '1 materialized final table', '4 conceptual stages: RAW, CLEAN, DEDUP, and FINAL'] },
    { title: 'Data quality controls', description: 'Rules and queries present in tratamiento.sql.', bullets: ['Null profiling by column', 'Text standardization and null metric handling', 'Detection and consolidation of logical duplicates by business key', 'Detection of purchases exceeding views', 'Correction with CASE and IS_ANOMALY indicator'] },
    { title: 'Analytical result', description: 'DATASET_FINAL is the persistent table created from VW_DATASET_FINAL.', bullets: ['Descriptive attributes and metrics standardized by the implemented rules', 'Logical duplicates consolidated', 'Anomaly rule applied in the final view', 'Correction traceability through IS_ANOMALY', 'Prepared in SQL for analytical queries'] },
  ],
  domainsTitle: 'Validation queries',
  limitationsTitle: 'Current scope',
  limitations: ['SQL defines queries and transformations; automated or orchestrated execution is not demonstrated.', 'No numeric profiling, duplicate, or anomaly results are provided.', 'The Marketplace source is shared and read-only; the repository does not include the original dataset.', 'dashboard.pbix exists, but its contents were not inspected and it is not claimed to be a finished report.'],
  roadmapTitle: 'Future improvements',
  roadmap: ['Automate SQL query execution.', 'Orchestrate process stages.', 'Build a data quality test suite.', 'Monitor anomalies.', 'Add execution auditing.', 'Validate additional business rules.', 'Evaluate incremental processing.', 'Document the analytical model.', 'Inspect and visually validate the Power BI file.'],
  repositoryUrl: repository,
  repositoryLinkLabel: 'View project repository on GitHub',
  languageSwitchLabel: 'Cambiar idioma a español',
  projectNavigationLabel: 'Project navigation',
  validationQueries: {
    title: 'Validation queries',
    items: ['Count nulls in RAW and CLEAN.', 'Detect logical duplicates before and after VW_DATASET_DEDUP.', 'Count anomalies in VW_DATASET_DEDUP and check remaining anomalies in VW_DATASET_FINAL.', 'Count records marked IS_ANOMALY = 1.', 'Compare row counts between VW_DATASET_FINAL and DATASET_FINAL, then check nulls and anomalies in the table.'],
  },
  footer: 'Made with care by Carlos Martinez',
};

export const ecommerceDataQualityProjectCopy: Record<ProjectLocale, OlistProjectCopy> = { es, en };
