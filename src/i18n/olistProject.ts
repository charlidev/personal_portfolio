export type ProjectLocale = 'es' | 'en';

export type ContentCard = {
  eyebrow?: string;
  title: string;
  description: string;
  bullets: string[];
  code?: string[];
};

export type WorkflowStep = {
  title: string;
  file?: string;
  description: string;
  bullets?: string[];
};

export type CodeExample = {
  layer: string;
  file: string;
  title: string;
  description: string;
  code: string;
  url: string;
  language?: 'python' | 'yaml' | 'bash' | 'dax' | 'sql';
  supportingCode?: { title: string; code: string; language: 'python' | 'yaml' | 'bash' | 'dax' | 'sql' }[];
};

export type OlistProjectCopy = {
  backToProjects: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  summaryTitle: string;
  summary: string;
  technicalSummary: string;
  technologyLabel: string;
  technologies: string[];
  tabs: string[];
  architectureTitle: string;
  architectureLayers: ContentCard[];
  diagramTitle: string;
  diagramDescription: string;
  diagramLabels?: { source: string; landing: string; autoLoader: string; bronze: string; silver: string; gold: string; audit: string; outputs: string[] };
  crmDiagramLabels?: { source: string; ingestion: string; bronze: string; silver: string; gold: string; dimension: string; purchaseFact: string; campaignFact: string; github: string; ci: string; tests: string; deploy: string };
  aiDiagramLabels?: { source: string; stage: string; bronze: string; silver: string; gold: string; fileFormat: string; rawTable: string; cleanTable: string; views: string[]; notebook: string; dataframe: string; aggregations: string };
  aiWorkflowLabels?: { stage: string; copy: string; bronze: string; cleansing: string; silver: string; views: string; analysis: string; session: string; dataframe: string; transformations: string; aggregates: string; sqlRoute: string; notebookRoute: string };
  workflowDiagramTitle?: string;
  workflowDiagramDescription?: string;
  componentsTitle: string;
  components: ContentCard[];
  workflowTitle: string;
  workflowIntro: string;
  workflow: WorkflowStep[];
  workflowNote: string;
  codeTitle: string;
  codeExamples: CodeExample[];
  resultsTitle: string;
  resultCards: ContentCard[];
  domainsTitle: string;
  domains?: ContentCard[];
  limitationsTitle: string;
  limitations: string[];
  roadmapTitle: string;
  roadmap: string[];
  semanticModel?: { title: string; description: string; relations: string[]; measureGroups: { title: string; measures: string[] }[] };
  repositoryUrl?: string;
  repositoryLinkLabel?: string;
  evidence?: { title: string; description: string; links: { label: string; url: string }[] };
  languageSwitchLabel: string;
  projectNavigationLabel: string;
  footer: string;
};

const sharedCode = {
  bronze: `df = spark.readStream.format("cloudFiles") \\
    .option("cloudFiles.format", dataset["format"]) \\
    .option("cloudFiles.schemaLocation", f"{checkpoint_path}/_schema") \\
    .option("header", dataset["has_header"]) \\
    .load(source_path)

df_enriched = df \\
    .withColumn("_ingestion_timestamp", current_timestamp()) \\
    .withColumn("_source_file", col("_metadata.file_path"))

query = df_enriched.writeStream.format("delta") \\
    .option("checkpointLocation", checkpoint_path) \\
    .option("mergeSchema", "true") \\
    .trigger(availableNow=True) \\
    .table(f"{env_catalog}.bronze.raw_{table_name}")`,
  silver: `df_clean = df_raw.withColumn(
    "order_purchase_timestamp", col("order_purchase_timestamp").cast("timestamp")
).withColumn(
    "order_approved_at", col("order_approved_at").cast("timestamp")
).withColumn(
    "order_delivered_carrier_date", col("order_delivered_carrier_date").cast("timestamp")
).withColumn(
    "order_delivered_customer_date", col("order_delivered_customer_date").cast("timestamp")
).withColumn(
    "order_estimated_delivery_date", col("order_estimated_delivery_date").cast("timestamp")
).dropDuplicates(["order_id"])

df_silver = df_clean.withColumn("_silver_timestamp", current_timestamp())
df_silver.write.format("delta") \\
    .mode("overwrite") \\
    .option("mergeSchema", "true") \\
    .saveAsTable(f"{env_catalog}.silver.orders")`,
  generic: `tables_config = {
    "order_items": {
        "timestamps": ["shipping_limit_date"],
        "doubles": ["price", "freight_value"],
        "pk": ["order_id", "order_item_id"]
    },
    "order_payments": {
        "timestamps": [],
        "doubles": ["payment_value"],
        "pk": ["order_id", "payment_sequential"]
    },
    "order_reviews": {
        "timestamps": ["review_creation_date", "review_answer_timestamp"],
        "doubles": [],
        "pk": ["review_id"]
    }
}`,
  gold: `df_orders = spark.table(f"{env_catalog}.silver.orders")
df_items = spark.table(f"{env_catalog}.silver.order_items")
df_products = spark.table(f"{env_catalog}.silver.products")
df_customers = spark.table(f"{env_catalog}.silver.customers")

df_joined = df_orders.filter(col("order_status") == "delivered") \\
    .join(df_items, "order_id", "inner") \\
    .join(df_products, "product_id", "left") \\
    .join(df_customers, "customer_id", "left")

df_mart = df_joined.groupBy(
    col("order_purchase_timestamp").cast("date").alias("sale_date"),
    col("product_category_name"),
    col("customer_state")
).agg(
    count("order_item_id").alias("total_items_sold"),
    sum("price").alias("total_revenue"),
    sum("freight_value").alias("total_freight")
)`,
};

export const olistProjectCopy: Record<ProjectLocale, OlistProjectCopy> = {
  es: {
    backToProjects: 'Volver a proyectos',
    eyebrow: 'CASO DE ESTUDIO · INGENIERÍA DE DATOS',
    title: 'Olist — Data Engineering Pipeline',
    subtitle: 'Ingesta, transformación y preparación de datos analíticos sobre el conjunto de datos de comercio electrónico Olist.',
    summaryTitle: 'Resumen del Proyecto',
    summary: 'Pipeline de datos para procesar nueve datasets de Olist mediante una arquitectura Medallion en Azure Databricks.',
    technicalSummary: 'La implementación incorpora archivos CSV desde Azure Data Lake Storage Gen2 con Auto Loader, conserva datos de origen en Bronze, aplica limpieza técnica en Silver y construye cinco data marts agregados en Gold. Esta página describe el código y los artefactos del repositorio; no implica una ejecución integral validada en Databricks.',
    technologyLabel: 'Tecnologías',
    technologies: ['Python', 'PySpark', 'Azure Databricks', 'Auto Loader', 'Delta Lake', 'ADLS Gen2'],
    tabs: ['Arquitectura', 'Componentes', 'Flujo de trabajo', 'Código', 'Resultados'],
    architectureTitle: 'Arquitectura del Pipeline',
    architectureLayers: [
      { title: 'Bronze — Data Ingestion', description: 'Ingesta de nueve datasets CSV de Olist.', bullets: ['Databricks Auto Loader (cloudFiles) sobre Spark Structured Streaming.', 'Checkpoints y ubicación de esquemas.', 'Trigger availableNow y escritura en tablas Delta.', 'Metadatos técnicos _ingestion_timestamp y _source_file.'] },
      { title: 'Silver — Data Transformation', description: 'Limpieza técnica de las tablas de origen.', bullets: ['Conversión de tipos de datos.', 'Tratamiento seleccionado de valores nulos.', 'Deduplicación mediante llaves configuradas y reglas por dataset.', 'Persistencia en tablas Delta.'] },
      { title: 'Gold — Analytical Data Marts', description: 'Cinco procesos analíticos basados en datos Silver.', bullets: ['Joins entre tablas Silver.', 'Agregaciones orientadas a dominios de negocio.', 'Escritura de resultados en tablas Delta.'] },
    ],
    diagramTitle: 'Flujo de arquitectura',
    diagramDescription: 'Archivos CSV de Olist pasan por ADLS Gen2 y Auto Loader hacia las capas Bronze, Silver y Gold. Bronze también registra la auditoría de ingesta; Gold alimenta cinco data marts.',
    diagramLabels: { source: 'Olist CSV Files', landing: 'ADLS Gen2 Landing', autoLoader: 'Databricks Auto Loader', bronze: 'BRONZE · Delta', silver: 'SILVER · Delta', gold: 'GOLD · Delta', audit: 'ingestion_audit_log', outputs: ['Sales', 'Logistics', 'Payments', 'Customer Satisfaction', 'Seller Performance'] },
    componentsTitle: 'Componentes de la solución',
    components: [
      { title: 'Fuentes de datos', description: 'Archivos CSV de Olist en Azure Data Lake Storage Gen2.', bullets: ['Nueve datasets de origen.', 'Configuración centralizada en config/ingestion_metadata.json.'], code: ['customers', 'orders', 'products', 'geolocation', 'order_items', 'order_payments', 'order_reviews', 'sellers', 'category_translation'] },
      { title: 'Ingesta', description: 'src/bronze/ingest_to_bronze.py', bullets: ['Databricks Auto Loader y Spark Structured Streaming.', 'Checkpoints y Schema Location.', 'Trigger availableNow y escritura Delta.', 'Metadatos técnicos y registro básico de auditoría.'] },
      { title: 'Transformaciones Silver', description: 'Scripts de limpieza y reglas por tabla.', bullets: ['Conversión de fechas y números.', 'Tratamiento seleccionado de valores nulos.', 'Deduplicación por llaves configuradas.', 'Escritura en modo overwrite.'], code: ['src/silver/clean_orders.py', 'src/silver/clean_products.py', 'src/silver/generic_rules_for_any_table.py'] },
      { title: 'Data Marts Gold', description: 'Cinco scripts generan conjuntos analíticos por dominio.', bullets: ['Cada proceso realiza joins y agregaciones sobre tablas Silver.'], code: ['mart_sales_performance.py', 'mart_logistics_performance.py', 'mart_payment_behavior.py', 'mart_customer_satisfaction.py', 'mart_seller_performance.py'] },
      { title: 'Auditoría', description: 'Registro básico del proceso de ingesta.', bullets: ['Tabla ingestion_audit_log.', 'Identificador de ejecución y tabla procesada.', 'Estado y tiempos registrados.', 'Mensaje de error cuando corresponde.', 'No constituye un sistema integral de observabilidad.'] },
      { title: 'Automatización', description: 'Sincronización de código con Databricks Repos.', bullets: ['GitHub Actions utiliza Databricks CLI.', 'El workflow existente sincroniza cambios en master.', 'No implementa todavía pruebas automáticas ni promoción integral entre ambientes.'] },
    ],
    workflowTitle: 'Proceso de Datos Paso a Paso',
    workflowIntro: 'El repositorio documenta scripts y notebooks para recorrer estas etapas. No se presentan como una ejecución orquestada automática.',
    workflow: [
      { title: 'Exploración de datos', file: 'notebooks/exploration/Discover-EDA.ipynb', description: 'Inspección inicial de los datasets.', bullets: ['Revisión de esquemas y conteo de registros.', 'Consulta de muestras y análisis de valores nulos.', 'Identificación de duplicados exactos.'] },
      { title: 'Configuración de fuentes', file: 'config/ingestion_metadata.json', description: 'Define los nueve datasets, formatos, patrones de archivos y ruta de aterrizaje.' },
      { title: 'Ingesta a Bronze', file: 'src/bronze/ingest_to_bronze.py', description: 'Auto Loader lee los archivos disponibles, gestiona esquemas y checkpoints, agrega metadatos, escribe Delta y registra una auditoría básica.' },
      { title: 'Limpieza en Silver', description: 'Los scripts de transformación convierten tipos, tratan ciertos valores nulos, deduplican y escriben tablas Silver.' },
      { title: 'Construcción de Data Marts', description: 'Cinco scripts Gold realizan joins, filtros de negocio y agregaciones para producir los data marts.' },
      { title: 'Auditoría del proceso', description: 'La tabla ingestion_audit_log permite consultar los estados reportados de las cargas.' },
      { title: 'Preparación para consumo analítico', description: 'Los data marts Gold quedan orientados a análisis y consumo posteriores.', bullets: ['dashboard/dashboard.pbix está en desarrollo; no es un dashboard terminado.'] },
    ],
    workflowNote: 'El orden describe el proceso de trabajo documentado. El repositorio no demuestra que las etapas se ejecuten de forma automática de extremo a extremo.',
    codeTitle: 'Implementación del Pipeline',
    codeExamples: [
      { layer: 'Bronze', file: 'src/bronze/ingest_to_bronze.py', title: 'Ingesta con Auto Loader', description: 'Lectura cloudFiles con schema location, metadatos técnicos y escritura streaming Delta con checkpoint y trigger availableNow.', code: sharedCode.bronze, url: 'https://github.com/charlidev/Project_06_Olist/blob/master/src/bronze/ingest_to_bronze.py' },
      { layer: 'Silver', file: 'src/silver/clean_orders.py', title: 'Limpieza y deduplicación', description: 'Conversión de timestamps, deduplicación por order_id, marca temporal de capa y persistencia Delta.', code: sharedCode.silver, url: 'https://github.com/charlidev/Project_06_Olist/blob/master/src/silver/clean_orders.py' },
      { layer: 'Silver', file: 'src/silver/generic_rules_for_any_table.py', title: 'Reglas configurables por tabla', description: 'La configuración declara columnas timestamp, columnas double y llaves para deduplicar cada tabla.', code: sharedCode.generic, url: 'https://github.com/charlidev/Project_06_Olist/blob/master/src/silver/generic_rules_for_any_table.py' },
      { layer: 'Gold', file: 'src/gold/mart_sales_performance.py', title: 'Construcción del Data Mart de ventas', description: 'Lectura de tablas Silver, joins, filtro de órdenes delivered y agregaciones por fecha, categoría y estado del cliente.', code: sharedCode.gold, url: 'https://github.com/charlidev/Project_06_Olist/blob/master/src/gold/mart_sales_performance.py' },
    ],
    resultsTitle: 'Resultados del Proyecto',
    resultCards: [
      { title: 'Cobertura de datos', description: 'Cobertura definida en el código y los artefactos del repositorio.', bullets: ['9 datasets de origen', '3 capas Medallion', '5 data marts analíticos'] },
      { title: 'Dominios analíticos', description: 'Cinco data marts definidos por el código del proyecto.', bullets: [] },
      { title: 'Preparación de datos', description: 'Operaciones contempladas en la exploración y las transformaciones.', bullets: ['Inspección de esquemas y profiling de nulos.', 'Identificación de duplicados exactos.', 'Conversión de tipos y deduplicación por llaves configuradas.'] },
    ],
    domainsTitle: 'Dominios analíticos',
    domains: [
      { title: 'Sales', description: 'Métricas de venta', bullets: ['total_items_sold', 'total_revenue', 'total_freight'] },
      { title: 'Logistics', description: 'Métricas logísticas', bullets: ['total_orders', 'avg_delivery_days', 'total_delayed_orders'] },
      { title: 'Payments', description: 'Métricas de pagos', bullets: ['total_transactions', 'total_volume', 'avg_installments'] },
      { title: 'Customer Satisfaction', description: 'Métricas de satisfacción', bullets: ['total_reviews', 'avg_review_score', 'negative_reviews'] },
      { title: 'Seller Performance', description: 'Métricas de desempeño de vendedores', bullets: ['items_dispatched', 'total_revenue', 'total_freight_managed'] },
    ],
    limitationsTitle: 'Estado actual y limitaciones',
    limitations: ['La revisión disponible del proyecto fue estática.', 'No se ha verificado una ejecución exitosa integral en Databricks.', 'El dashboard de Power BI está en desarrollo.', 'Los procesos Silver y Gold utilizan escritura en modo overwrite.', 'El profiling exploratorio no equivale a validación automatizada de calidad.'],
    roadmapTitle: 'Mejoras futuras',
    roadmap: ['CDC.', 'SCD Type 2.', 'Reglas automatizadas de Data Quality.', 'Cuarentena de registros inválidos.', 'Observabilidad y monitoreo integral.', 'Aislamiento operativo completo de ambientes.', 'CI/CD con pruebas y promoción entre ambientes.', 'Modelo dimensional completo.', 'Finalización del dashboard de Power BI.', 'Validación de las rutas físicas de ingesta.'],
    languageSwitchLabel: 'Switch language to English',
    projectNavigationLabel: 'Navegación del proyecto',
    footer: 'Hecho con cariño by Carlos Martinez',
  },
  en: {
    backToProjects: 'Back to projects',
    eyebrow: 'CASE STUDY · DATA ENGINEERING',
    title: 'Olist — Data Engineering Pipeline',
    subtitle: 'Data ingestion, transformation, and preparation for analytics using the Olist e-commerce dataset.',
    summaryTitle: 'Project Overview',
    summary: 'A data pipeline that processes nine Olist datasets through a Medallion architecture on Azure Databricks.',
    technicalSummary: 'The implementation ingests CSV files from Azure Data Lake Storage Gen2 with Auto Loader, retains source data in Bronze, applies technical cleaning in Silver, and builds five aggregated data marts in Gold. This page describes repository code and artifacts; it does not imply a verified end-to-end Databricks run.',
    technologyLabel: 'Technologies',
    technologies: ['Python', 'PySpark', 'Azure Databricks', 'Auto Loader', 'Delta Lake', 'ADLS Gen2'],
    tabs: ['Architecture', 'Components', 'Workflow', 'Code', 'Results'],
    architectureTitle: 'Pipeline Architecture',
    architectureLayers: [
      { title: 'Bronze — Data Ingestion', description: 'Ingestion of nine Olist CSV datasets.', bullets: ['Databricks Auto Loader (cloudFiles) on Spark Structured Streaming.', 'Checkpoints and schema location.', 'availableNow trigger and Delta table writes.', 'Technical metadata _ingestion_timestamp and _source_file.'] },
      { title: 'Silver — Data Transformation', description: 'Technical cleaning of source tables.', bullets: ['Data type conversion.', 'Selected null handling.', 'Deduplication with configured keys and dataset-specific rules.', 'Persistence to Delta tables.'] },
      { title: 'Gold — Analytical Data Marts', description: 'Five analytics processes based on Silver data.', bullets: ['Joins across Silver tables.', 'Business-domain aggregations.', 'Writes results to Delta tables.'] },
    ],
    diagramTitle: 'Architecture flow',
    diagramDescription: 'Olist CSV files pass through ADLS Gen2 and Auto Loader into Bronze, Silver, and Gold. Bronze also records ingestion audit events; Gold feeds five data marts.',
    diagramLabels: { source: 'Olist CSV Files', landing: 'ADLS Gen2 Landing', autoLoader: 'Databricks Auto Loader', bronze: 'BRONZE · Delta', silver: 'SILVER · Delta', gold: 'GOLD · Delta', audit: 'ingestion_audit_log', outputs: ['Sales', 'Logistics', 'Payments', 'Customer Satisfaction', 'Seller Performance'] },
    componentsTitle: 'Solution Components',
    components: [
      { title: 'Data Sources', description: 'Olist CSV files in Azure Data Lake Storage Gen2.', bullets: ['Nine source datasets.', 'Centralized configuration in config/ingestion_metadata.json.'], code: ['customers', 'orders', 'products', 'geolocation', 'order_items', 'order_payments', 'order_reviews', 'sellers', 'category_translation'] },
      { title: 'Ingestion', description: 'src/bronze/ingest_to_bronze.py', bullets: ['Databricks Auto Loader and Spark Structured Streaming.', 'Checkpoints and schema location.', 'availableNow trigger and Delta writes.', 'Technical metadata and basic audit logging.'] },
      { title: 'Silver Transformations', description: 'Cleaning scripts and table-specific rules.', bullets: ['Date, timestamp, and number conversion.', 'Selected null handling.', 'Deduplication with configured keys.', 'overwrite write mode.'], code: ['src/silver/clean_orders.py', 'src/silver/clean_products.py', 'src/silver/generic_rules_for_any_table.py'] },
      { title: 'Gold Data Marts', description: 'Five scripts produce analytical datasets by domain.', bullets: ['Each process joins and aggregates Silver tables.'], code: ['mart_sales_performance.py', 'mart_logistics_performance.py', 'mart_payment_behavior.py', 'mart_customer_satisfaction.py', 'mart_seller_performance.py'] },
      { title: 'Audit', description: 'Basic ingestion process logging.', bullets: ['ingestion_audit_log table.', 'Run identifier and processed table.', 'Recorded status and timestamps.', 'Error message when applicable.', 'This is not a full observability system.'] },
      { title: 'Automation', description: 'Code synchronization with Databricks Repos.', bullets: ['GitHub Actions uses Databricks CLI.', 'The existing workflow syncs changes on master.', 'It does not yet implement automated tests or end-to-end environment promotion.'] },
    ],
    workflowTitle: 'Data Process Step by Step',
    workflowIntro: 'The repository documents scripts and notebooks for these stages. They are not presented as an automatically orchestrated run.',
    workflow: [
      { title: 'Data Exploration', file: 'notebooks/exploration/Discover-EDA.ipynb', description: 'Initial inspection of the datasets.', bullets: ['Schema review and record counts.', 'Sample queries and null analysis.', 'Identification of exact duplicates.'] },
      { title: 'Source Configuration', file: 'config/ingestion_metadata.json', description: 'Defines the nine datasets, formats, file patterns, and landing path.' },
      { title: 'Ingestion to Bronze', file: 'src/bronze/ingest_to_bronze.py', description: 'Auto Loader reads available files, manages schemas and checkpoints, adds metadata, writes Delta, and records a basic audit entry.' },
      { title: 'Silver Cleaning', description: 'Transformation scripts convert types, handle selected nulls, deduplicate records, and write Silver tables.' },
      { title: 'Data Mart Construction', description: 'Five Gold scripts perform joins, business filters, and aggregations to produce the data marts.' },
      { title: 'Process Audit', description: 'The ingestion_audit_log table can be queried to review reported load statuses.' },
      { title: 'Preparation for Analytics', description: 'Gold data marts are prepared for later analysis and consumption.', bullets: ['dashboard/dashboard.pbix is under development; it is not a finished dashboard.'] },
    ],
    workflowNote: 'The sequence describes the documented workflow. The repository does not demonstrate that all stages run automatically end to end.',
    codeTitle: 'Pipeline Implementation',
    codeExamples: [
      { layer: 'Bronze', file: 'src/bronze/ingest_to_bronze.py', title: 'Auto Loader ingestion', description: 'cloudFiles read with schema location, technical metadata, and Delta streaming output with checkpoint and availableNow trigger.', code: sharedCode.bronze, url: 'https://github.com/charlidev/Project_06_Olist/blob/master/src/bronze/ingest_to_bronze.py' },
      { layer: 'Silver', file: 'src/silver/clean_orders.py', title: 'Cleaning and deduplication', description: 'Timestamp conversion, deduplication by order_id, layer timestamp, and Delta persistence.', code: sharedCode.silver, url: 'https://github.com/charlidev/Project_06_Olist/blob/master/src/silver/clean_orders.py' },
      { layer: 'Silver', file: 'src/silver/generic_rules_for_any_table.py', title: 'Configurable table rules', description: 'The configuration declares timestamp columns, double columns, and deduplication keys for each table.', code: sharedCode.generic, url: 'https://github.com/charlidev/Project_06_Olist/blob/master/src/silver/generic_rules_for_any_table.py' },
      { layer: 'Gold', file: 'src/gold/mart_sales_performance.py', title: 'Sales data mart construction', description: 'Silver table reads, joins, delivered-order filter, and aggregations by date, category, and customer state.', code: sharedCode.gold, url: 'https://github.com/charlidev/Project_06_Olist/blob/master/src/gold/mart_sales_performance.py' },
    ],
    resultsTitle: 'Project Results',
    resultCards: [
      { title: 'Data Coverage', description: 'Coverage defined by repository code and artifacts.', bullets: ['9 source datasets', '3 Medallion layers', '5 analytical data marts'] },
      { title: 'Analytical Domains', description: 'Five data marts defined by the project code.', bullets: [] },
      { title: 'Data Preparation', description: 'Operations represented in exploration and transformation code.', bullets: ['Schema inspection and null profiling.', 'Identification of exact duplicates.', 'Type conversion and deduplication with configured keys.'] },
    ],
    domainsTitle: 'Analytical Domains',
    domains: [
      { title: 'Sales', description: 'Sales metrics', bullets: ['total_items_sold', 'total_revenue', 'total_freight'] },
      { title: 'Logistics', description: 'Logistics metrics', bullets: ['total_orders', 'avg_delivery_days', 'total_delayed_orders'] },
      { title: 'Payments', description: 'Payment metrics', bullets: ['total_transactions', 'total_volume', 'avg_installments'] },
      { title: 'Customer Satisfaction', description: 'Customer satisfaction metrics', bullets: ['total_reviews', 'avg_review_score', 'negative_reviews'] },
      { title: 'Seller Performance', description: 'Seller performance metrics', bullets: ['items_dispatched', 'total_revenue', 'total_freight_managed'] },
    ],
    limitationsTitle: 'Current Status and Limitations',
    limitations: ['The available project review was static.', 'A successful end-to-end Databricks run has not been verified.', 'The Power BI dashboard is under development.', 'Silver and Gold processes currently use overwrite mode.', 'Exploratory profiling is not automated data quality validation.'],
    roadmapTitle: 'Future Improvements',
    roadmap: ['CDC.', 'SCD Type 2.', 'Automated Data Quality rules.', 'Quarantine for invalid records.', 'End-to-end observability and monitoring.', 'Full operational environment isolation.', 'CI/CD with tests and environment promotion.', 'Complete dimensional model.', 'Finish the Power BI dashboard.', 'Validate physical ingestion paths.'],
    languageSwitchLabel: 'Cambiar idioma a español',
    projectNavigationLabel: 'Project navigation',
    footer: 'Made with care by Carlos Martinez',
  },
};
