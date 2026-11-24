import type { OlistProjectCopy, ProjectLocale } from './olistProject';

const root = 'https://github.com/charlidev/Data_Engineering_Portfolio/tree/master/Project_02_Retail_Transactions';
const sqlUrl = `${root}/Snowflake/SQL/02_Retail_Transactions.sql`;
const databricksReadmeUrl = `${root}/Databricks/README.md`;
const databricksNotebookUrl = `${root}/Databricks/Python/Retail_Transactions.ipynb`;
const snowparkNotebookUrl = `${root}/Snowflake/Python_Snowpark/02_Retail_Transactions.ipynb`;

const sql = {
  bronze: `COPY INTO RETAIL_TRANSACTIONS.BRONZE.RAW_DATA
FROM @RETAIL_TRANSACTIONS.BRONZE.STG_RAW_DATA
FILES = ('Retail_Transaction_Dataset.csv')
FILE_FORMAT = (FORMAT_NAME = 'RETAIL_TRANSACTIONS.BRONZE.CSV_GENERIC_FORMAT')
ON_ERROR = CONTINUE;`,
  silver: `CREATE OR REPLACE TABLE RETAIL_TRANSACTIONS.SILVER.CLEANED_RETAIL_DATA AS
SELECT
    TRY_TO_NUMBER(TRIM(CUSTOMER_ID)) AS CUSTOMER_ID,
    UPPER(TRIM(PRODUCT_ID)) AS PRODUCT_ID,
    TRY_TO_NUMBER(TRIM(QUANTITY)) AS QUANTITY,
    TRY_TO_DOUBLE(PRICE) AS PRICE,
    TO_TIMESTAMP(TRANSACTION_DATE,'MM/DD/YYYY HH24:MI') AS TRANSACTION_TIMESTAMP,
    COALESCE(UPPER(TRIM(PAYMENT_METHOD)), 'UNKNOWN') AS PAYMENT_METHOD,
    TRIM(STORE_LOCATION) AS FULL_ADDRESS,
    COALESCE(
        REGEXP_SUBSTR(STORE_LOCATION, ' ([A-Z]{2}) [0-9]{5}$', 1, 1, 'e'), 'UNKNOWN'
    ) AS STORE_STATE,
    UPPER(TRIM(PRODUCT_CATEGORY)) AS PRODUCT_CATEGORY,
    COALESCE(TRY_TO_DOUBLE(DISCOUNT_APPLIED), 0) AS DISCOUNT_PERCENT,
    TRY_TO_DOUBLE(TOTAL_AMOUNT) AS TOTAL_AMOUNT,
    CURRENT_TIMESTAMP() AS LOAD_TIMESTAMP
FROM RETAIL_TRANSACTIONS.BRONZE.RAW_DATA
WHERE
    CUSTOMER_ID IS NOT NULL
    AND TRANSACTION_TIMESTAMP IS NOT NULL
    AND TOTAL_AMOUNT IS NOT NULL;`,
  profitability: `CREATE OR REPLACE VIEW RETAIL_TRANSACTIONS.GOLD.VW_RENTABILIDAD_POR_CATEGORIA AS
SELECT
    PRODUCT_CATEGORY,
    SUM(TOTAL_AMOUNT) AS TOTAL_REVENUE,
    AVG(DISCOUNT_PERCENT) AS AVG_DISCOUNT_PERCENT
FROM RETAIL_TRANSACTIONS.SILVER.CLEANED_RETAIL_DATA
GROUP BY PRODUCT_CATEGORY
ORDER BY PRODUCT_CATEGORY DESC;`,
  pyspark: `df_silver_clean = df_silver.select(
    F.trim(F.col("CustomerID")).cast(IntegerType()).alias("CustomerID"),
    F.upper(F.trim(F.col("ProductID"))).alias("ProductID"),
    F.trim(F.col("Quantity")).cast(IntegerType()).alias("Quantity"),
    F.col("Price").cast(FloatType()).alias("Price"),
    F.to_timestamp(F.col("TransactionDate"), "M/d/yyyy H:mm").alias("TRANSACTION_TIMESTAMP"),
    F.coalesce(F.upper(F.trim(F.col("PaymentMethod"))), F.lit('UNKNOWN')).alias("PAYMENT_METHOD"),
    F.trim(F.col("StoreLocation")).alias("FULL_ADDRESS"),
    F.coalesce(
        F.regexp_extract(F.col("StoreLocation"), r' ([A-Z]{2}) [0-9]{5}$', 1),
        F.lit('UNKNOWN')
    ).alias("Store_State"),
    F.upper(F.trim(F.col("ProductCategory"))).alias("PRODUCT_CATEGORY"),
    F.col("DiscountApplied").cast(FloatType()).alias("DISCOUNT_PERCENT"),
    F.col("TotalAmount").cast(FloatType()).alias("TOTAL_AMOUNT"),
    F.current_timestamp().alias("LOAD_TIMESTAMP")
).filter(
    F.col("CustomerID").isNotNull() &
    F.col("TRANSACTION_TIMESTAMP").isNotNull()
)

df_silver_clean.write.format("delta") \\
    .mode("overwrite") \\
    .option("overwriteSchema", "true") \\
    .saveAsTable("retail_transactions.silver.cleaned_retail_data_py")`,
  snowpark: `df_gold.group_by("PRODUCT_CATEGORY").agg([
    F.sum("TOTAL_AMOUNT").alias("TOTAL_REVENUE"),
    F.avg("DISCOUNT_PERCENT").alias("AVG_DISCOUNT_PERCENT")
]).sort(F.col("PRODUCT_CATEGORY").desc()
).create_or_replace_view("RETAIL_TRANSACTIONS.GOLD.VW_RENTABILIDAD_PORCATEGORIA_PY")`,
};

const es: OlistProjectCopy = {
  backToProjects: 'Volver a proyectos',
  eyebrow: 'CASO DE ESTUDIO · ANALYTICS ENGINEERING',
  title: 'Retail Transactions Analytics',
  subtitle: 'De los datos transaccionales a los indicadores de negocio mediante Snowflake, Databricks y Power BI.',
  summaryTitle: 'Resumen del proyecto',
  summary: 'Este proyecto implementa una solución analítica para procesar un dataset sintético de 100,000 transacciones retail y transformar los registros en indicadores de negocio. La implementación principal usa Snowflake y arquitectura Medallion para cargar un CSV, normalizar transacciones y construir siete vistas de negocio.',
  technicalSummary: 'Como alternativas del mismo caso de negocio, incluye una implementación con PySpark en Azure Databricks y otra con Snowpark Python dentro de Snowflake. Las vistas se orientan a rentabilidad por categoría, rendimiento geográfico, tendencias temporales, métodos de pago, descuentos, productos y tamaño de canasta.',
  technologyLabel: 'Tecnologías',
  technologies: ['Analytics Engineering', 'Snowflake', 'Databricks', 'SQL', 'PySpark', 'Snowpark', 'Power BI'],
  tabs: ['Arquitectura', 'Componentes', 'Flujo de trabajo', 'Código', 'Resultados'],
  architectureTitle: 'Arquitectura de la solución analítica',
  architectureLayers: [
    { eyebrow: '01 · BRONZE', title: 'Bronze — Raw Data', description: 'Recepción en Snowflake de Retail_Transaction_Dataset.csv desde un Internal Stage.', bullets: ['File Format CSV_GENERIC_FORMAT y carga mediante COPY INTO.', 'La tabla RAW_DATA declara inicialmente las columnas como VARCHAR.', 'Las conversiones y validaciones se realizan durante Silver.'] },
    { eyebrow: '02 · SILVER', title: 'Silver — Data Cleansing', description: 'CLEANED_RETAIL_DATA estandariza y tipa los campos utilizados en el análisis comercial.', bullets: ['TRIM, UPPER, TRY_TO_NUMBER, TRY_TO_DOUBLE y TO_TIMESTAMP.', 'COALESCE para campos opcionales y REGEXP_SUBSTR para extraer STORE_STATE.', 'Filtra registros sin CUSTOMER_ID, TRANSACTION_TIMESTAMP o TOTAL_AMOUNT y agrega LOAD_TIMESTAMP.'] },
    { eyebrow: '03 · GOLD', title: 'Gold — Business Insights', description: 'Siete vistas de negocio en el SQL principal, cada una orientada a una pregunta analítica.', bullets: ['VW_RENTABILIDAD_POR_CATEGORIA · VW_RENDIMIENTO_GEOGRAFICO.', 'VW_TENDENCIA_VS_ESTACIONALIDAD · VW_METODO_PAGO_ANALISIS.', 'VW_EFECTIVIDAD_DESCUENTO · VW_RANKING_PRODUCTS · VW_KPI_CANASTA_PROMEDIO.'] },
  ],
  diagramTitle: 'Flujo principal · Snowflake SQL',
  diagramDescription: 'La implementación principal conecta la ingesta CSV, las capas Medallion, siete vistas de negocio y el consumo analítico. Databricks y Snowpark son implementaciones alternativas del mismo caso, no etapas posteriores de este flujo.',
  retailDiagramLabels: {
    source: 'Retail CSV',
    stage: 'Snowflake Internal Stage',
    copyInto: 'COPY INTO',
    bronze: 'Bronze · RAW_DATA',
    silver: 'Silver · CLEANED_RETAIL_DATA',
    gold: 'Gold · Business Views',
    goldViews: ['VW_RENTABILIDAD_POR_CATEGORIA', 'VW_RENDIMIENTO_GEOGRAFICO', 'VW_TENDENCIA_VS_ESTACIONALIDAD', 'VW_METODO_PAGO_ANALISIS', 'VW_EFECTIVIDAD_DESCUENTO', 'VW_RANKING_PRODUCTS', 'VW_KPI_CANASTA_PROMEDIO'],
    powerBi: 'Power BI · consumo analítico',
    alternativesTitle: 'Implementaciones alternativas del mismo caso',
    databricksTitle: 'Databricks · PySpark',
    databricksBullets: ['CSV desde Unity Catalog Volumes.', 'Bronze y Silver en tablas Delta; transformaciones con DataFrames de PySpark.', 'Siete resultados analíticos guardados como tablas Delta mediante overwrite.'],
    snowparkTitle: 'Snowpark Python',
    snowparkBullets: ['Lectura del CSV desde un Internal Stage con Snowpark.', 'Transformación Silver y agregaciones mediante group_by y agg.', 'Siete vistas analíticas Gold creadas dentro de Snowflake.'],
  },
  componentsTitle: 'Componentes de la solución',
  components: [
    { title: 'Dataset de transacciones', description: 'Retail_Transaction_Dataset.csv · datos sintéticos documentados en el README con 100,000 registros.', bullets: ['Customer_ID, Product_ID, Quantity y Price.', 'Transaction_Date, Payment_Method y Store_Location.', 'Product_Category, Discount_Applied y Total_Amount.', 'Representa un conjunto de práctica, no transacciones reales de una empresa.'], code: ['Retail_Transaction_Dataset.csv'] },
    { title: 'Snowflake Storage e Ingesta', description: '02_Retail_Transactions.sql · configuración de base, esquemas e ingesta desde Internal Stage.', bullets: ['Database RETAIL_TRANSACTIONS y esquemas BRONZE, SILVER y GOLD.', 'CSV_GENERIC_FORMAT y stage STG_RAW_DATA.', 'RAW_DATA recibe el archivo mediante COPY INTO.', 'La página no recomienda ACCOUNTADMIN ni muestra credenciales.'], code: ['Snowflake/SQL/02_Retail_Transactions.sql'] },
    { title: 'Transformaciones SQL Silver', description: 'CLEANED_RETAIL_DATA convierte los campos de texto y prepara las dimensiones comerciales.', bullets: ['Conversión de números, métricas y fecha; normalización de textos.', 'Tratamiento de nulos con COALESCE y extracción de STORE_STATE desde FULL_ADDRESS.', 'Filtrado de registros críticos inválidos y timestamp de carga.'], code: ['CLEANED_RETAIL_DATA'] },
    { title: 'Gold Business Views', description: 'Siete vistas SQL que organizan indicadores para el consumo analítico.', bullets: ['Rentabilidad por categoría y rendimiento geográfico.', 'Tendencia temporal y métodos de pago.', 'Efectividad de descuentos, ranking de productos y tamaño promedio de canasta.', 'VW_RANKING_PRODUCTS está definida en el script SQL; no se afirma que su consulta se haya ejecutado correctamente.'], code: ['RETAIL_TRANSACTIONS.GOLD'] },
    { title: 'Databricks / PySpark', description: 'Retail_Transactions.ipynb · alternativa implementada en Azure Databricks con Unity Catalog.', bullets: ['Lee el CSV desde un Volume con DataFrameReader y opciones de encabezado, delimitador, comillas, escape y multiline.', 'Aplica transformaciones Silver con PySpark y persiste Bronze/Silver en Delta.', 'Genera siete resultados Gold como tablas Delta usando overwrite; no es una carga incremental.'], code: ['Databricks/Python/Retail_Transactions.ipynb'] },
    { title: 'Snowpark Python', description: '02_Retail_Transactions.ipynb · alternativa Python ejecutada dentro de Snowflake.', bullets: ['Obtiene la sesión activa y lee el archivo desde Internal Stage.', 'Transforma datos con Snowpark, session.read, session.table, group_by y agg.', 'Genera siete vistas analíticas Gold; no es una fase posterior a Snowflake SQL.'], code: ['Snowflake/Python_Snowpark/02_Retail_Transactions.ipynb'] },
  ],
  workflowTitle: 'Proceso de datos paso a paso',
  workflowIntro: 'Flujo principal documentado en Snowflake/SQL/02_Retail_Transactions.sql.',
  workflow: [
    { title: 'Preparación del dataset', file: 'Retail_Transaction_Dataset.csv', description: 'Revisar columnas, tipos, fechas, métodos de pago, ubicaciones, categorías y métricas comerciales.' },
    { title: 'Configuración de Snowflake', file: '02_Retail_Transactions.sql', description: 'Crear RETAIL_TRANSACTIONS, los esquemas BRONZE, SILVER y GOLD, el File Format y el Internal Stage.' },
    { title: 'Ingesta a Bronze', file: 'COPY INTO', description: 'Leer el archivo desde Internal Stage y cargar RAW_DATA conservando inicialmente los campos como VARCHAR.' },
    { title: 'Transformación Silver', file: 'CLEANED_RETAIL_DATA', description: 'Limpiar y convertir campos, normalizar métodos de pago, extraer el estado, tratar nulos, filtrar registros críticos y registrar LOAD_TIMESTAMP.' },
    { title: 'Construcción de Gold', file: 'Business Views', description: 'Definir siete vistas para rentabilidad, geografía, tendencias, métodos de pago, descuentos, ranking de productos y tamaño de canasta.' },
    { title: 'Validación de resultados', file: 'Consultas SQL', description: 'Consultar las vistas Gold para verificar sus resultados. No se presentan métricas de ejecución en esta página.' },
    { title: 'Consumo analítico', file: 'Power BI', description: 'El modelo de proyecto conecta la preparación de datos con la capa de Business Intelligence; no se describen visualizaciones no verificadas.' },
  ],
  workflowNote: 'Databricks/PySpark y Snowpark Python son implementaciones alternativas de la misma lógica de negocio. No son pasos posteriores del pipeline Snowflake SQL.',
  workflowAlternatives: {
    title: 'Otras implementaciones del caso',
    items: [
      { name: 'Databricks · PySpark', description: 'Replica la transformación con DataFrames y tablas Delta. Las salidas se escriben con overwrite.' },
      { name: 'Snowpark Python', description: 'Replica las transformaciones y agregaciones dentro de Snowflake y crea vistas analíticas Gold.' },
    ],
  },
  codeTitle: 'Implementación de la solución analítica',
  codeExamples: [
    { layer: 'BRONZE · SNOWFLAKE SQL', file: 'Snowflake/SQL/02_Retail_Transactions.sql', title: 'Carga Bronze con COPY INTO', description: 'Fragmento del script que carga el CSV desde el Internal Stage con el File Format configurado.', code: sql.bronze, language: 'sql', url: sqlUrl },
    { layer: 'SILVER · SNOWFLAKE SQL', file: 'Snowflake/SQL/02_Retail_Transactions.sql', title: 'Limpieza y tipado de Silver', description: 'Convierte los campos VARCHAR a tipos numéricos y timestamp, normaliza texto, completa nulos y extrae STORE_STATE.', code: sql.silver, language: 'sql', url: sqlUrl },
    { layer: 'GOLD · SNOWFLAKE SQL', file: 'Snowflake/SQL/02_Retail_Transactions.sql', title: 'Agregación de rentabilidad por categoría', description: 'Agrupa por categoría y calcula ingresos y descuento promedio.', code: sql.profitability, language: 'sql', url: sqlUrl },
    { layer: 'SILVER · PYSPARK / DELTA', file: 'Databricks/Python/Retail_Transactions.ipynb', title: 'Transformación Silver con PySpark', description: 'Muestra casteos, limpieza de strings, normalización de fechas, extracción del estado con regexp y escritura en Delta con overwrite.', code: sql.pyspark, language: 'python', url: databricksNotebookUrl },
    { layer: 'GOLD · SNOWPARK PYTHON', file: 'Snowflake/Python_Snowpark/02_Retail_Transactions.ipynb', title: 'Agregación Snowpark por categoría', description: 'Usa group_by y agg en Snowpark para calcular TOTAL_REVENUE y AVG_DISCOUNT_PERCENT dentro de Snowflake.', code: sql.snowpark, language: 'python', url: snowparkNotebookUrl },
  ],
  resultsTitle: 'Resultados y Business Insights',
  resultCards: [
    { title: 'Cobertura documentada', description: 'Cifras de cobertura y artefactos descritos en los README y scripts; no son métricas de ejecución verificadas en esta revisión.', bullets: ['100,000 registros sintéticos documentados.', '3 capas Medallion: Bronze, Silver y Gold.', '7 vistas definidas en el SQL principal.', '7 salidas analíticas Gold en Databricks y 7 vistas Gold en Snowpark.'] },
    { title: 'Business Insights', description: 'Siete análisis de negocio definidos por las vistas y agregaciones del proyecto.', bullets: ['Rentabilidad por categoría.', 'Rendimiento geográfico.', 'Tendencia temporal.', 'Métodos de pago.', 'Descuentos, ranking de productos y tamaño promedio de canasta.'] },
    { title: 'Capacidades analíticas', description: 'Preparación de transacciones para explorar indicadores comerciales mediante herramientas de BI.', bullets: ['Transformación y normalización de dimensiones geográficas y temporales.', 'Agregaciones comerciales y comparación entre categorías.', 'Análisis de descuentos sin afirmar causalidad.', 'Ranking de productos y cantidad promedio por categoría.', 'Preparación de datasets para consumo analítico.'] },
  ],
  domainsTitle: 'Consultas analíticas',
  retailInsights: {
    title: 'Siete perspectivas de negocio',
    items: [
      { title: 'Rentabilidad por categoría', view: 'VW_RENTABILIDAD_POR_CATEGORIA', metrics: ['TOTAL_REVENUE', 'AVG_DISCOUNT_PERCENT'], question: '¿Qué ingresos y descuentos promedio presenta cada categoría?' },
      { title: 'Rendimiento geográfico', view: 'VW_RENDIMIENTO_GEOGRAFICO', metrics: ['STORE_STATE', 'TOTAL_REVENUE', 'TRANSACTIONS_QTY'], question: '¿Cómo se distribuye la actividad comercial por estado?' },
      { title: 'Tendencia temporal', view: 'VW_TENDENCIA_VS_ESTACIONALIDAD', metrics: ['TRANSACTION_DAY', 'TRANSACTION_MONTH', 'TOTAL_REVENUE'], question: '¿Cómo evoluciona el ingreso a través del tiempo?' },
      { title: 'Métodos de pago', view: 'VW_METODO_PAGO_ANALISIS', metrics: ['PAYMENT_METHOD', 'TOTAL_REVENUE', 'AVG_TICKET_VALUE'], question: '¿Qué ingresos y ticket promedio se observan por método de pago?' },
      { title: 'Efectividad del descuento', view: 'VW_EFECTIVIDAD_DESCUENTO', metrics: ['DISCOUNT_RANGE', 'TOTAL_UNITS_SOLD'], question: '¿Cómo se distribuyen las unidades vendidas entre rangos de descuento? La vista no demuestra causalidad.' },
      { title: 'Ranking de productos', view: 'VW_RANKING_PRODUCTS', metrics: ['PRODUCT_ID', 'TOTAL_QTY_SOLD', 'TOTAL_REVENUE'], question: '¿Qué productos concentran más unidades e ingresos? La vista está definida en el script; no se reporta ejecución verificada.' },
      { title: 'Tamaño promedio de canasta', view: 'VW_KPI_CANASTA_PROMEDIO', metrics: ['PRODUCT_CATEGORY', 'AVG_BASKET_SIZE'], question: '¿Cuál es la cantidad promedio de unidades por categoría?' },
    ],
  },
  limitationsTitle: 'Alcance y limitaciones',
  limitations: ['El dataset es sintético; las 100,000 filas son una cifra documentada, no un conteo ejecutado en esta revisión.', 'El README de Snowflake menciona ocho vistas y RFM; el SQL revisado define siete vistas y no contiene una vista RFM.', 'Las implementaciones PySpark y Snowpark usan overwrite para sus tablas Bronze/Silver o salidas Delta; no se presentan como incrementales.', 'La definición SQL de VW_RANKING_PRODUCTS está incluida entre las siete vistas; no se afirma que todas las sentencias se hayan ejecutado exitosamente.'],
  roadmapTitle: 'Mejoras futuras',
  roadmap: ['Corregir y validar las definiciones SQL.', 'Incorporar pruebas de calidad automatizadas y deduplicación adicional.', 'Agregar cargas incrementales y CDC.', 'Implementar orquestación y fortalecer auditoría.', 'Documentar un modelo dimensional formal.', 'Unificar convenciones entre SQL, PySpark y Snowpark.', 'Fortalecer la conexión entre Gold y el modelo de BI; documentar medidas y relaciones.'],
  repositoryUrl: root,
  repositoryLinkLabel: 'Ver repositorio del proyecto en GitHub',
  evidence: {
    title: 'Documentación de las implementaciones',
    description: 'Archivos fuente consultados para esta página.',
    links: [{ label: 'README de Databricks', url: databricksReadmeUrl }],
  },
  languageSwitchLabel: 'Cambiar idioma a inglés',
  projectNavigationLabel: 'Navegación del proyecto',
  footer: 'Hecho con cariño by Carlos Martinez',
};

const en: OlistProjectCopy = {
  backToProjects: 'Back to projects',
  eyebrow: 'CASE STUDY · ANALYTICS ENGINEERING',
  title: 'Retail Transactions Analytics',
  subtitle: 'From transaction data to business indicators with Snowflake, Databricks, and Power BI.',
  summaryTitle: 'Project overview',
  summary: 'This project implements an analytics solution for a synthetic dataset of 100,000 retail transactions, transforming records into business indicators. The primary implementation uses Snowflake and a Medallion architecture to load a CSV, standardize transactions, and build seven business views.',
  technicalSummary: 'Two alternative implementations cover the same business case: PySpark on Azure Databricks and Snowpark Python in Snowflake. The views support analysis of category profitability, geographic performance, time trends, payment methods, discounts, products, and basket size.',
  technologyLabel: 'Technologies',
  technologies: ['Analytics Engineering', 'Snowflake', 'Databricks', 'SQL', 'PySpark', 'Snowpark', 'Power BI'],
  tabs: ['Architecture', 'Components', 'Workflow', 'Code', 'Results'],
  architectureTitle: 'Analytics solution architecture',
  architectureLayers: [
    { eyebrow: '01 · BRONZE', title: 'Bronze — Raw Data', description: 'Snowflake receives Retail_Transaction_Dataset.csv from an Internal Stage.', bullets: ['CSV_GENERIC_FORMAT and loading with COPY INTO.', 'RAW_DATA initially declares its columns as VARCHAR.', 'Type conversion and validation happen in Silver.'] },
    { eyebrow: '02 · SILVER', title: 'Silver — Data Cleansing', description: 'CLEANED_RETAIL_DATA standardizes and types the fields used in commercial analysis.', bullets: ['TRIM, UPPER, TRY_TO_NUMBER, TRY_TO_DOUBLE, and TO_TIMESTAMP.', 'COALESCE for optional values and REGEXP_SUBSTR to extract STORE_STATE.', 'Filters records without CUSTOMER_ID, TRANSACTION_TIMESTAMP, or TOTAL_AMOUNT and adds LOAD_TIMESTAMP.'] },
    { eyebrow: '03 · GOLD', title: 'Gold — Business Insights', description: 'Seven business views are defined in the main SQL script, each focused on an analytical question.', bullets: ['VW_RENTABILIDAD_POR_CATEGORIA · VW_RENDIMIENTO_GEOGRAFICO.', 'VW_TENDENCIA_VS_ESTACIONALIDAD · VW_METODO_PAGO_ANALISIS.', 'VW_EFECTIVIDAD_DESCUENTO · VW_RANKING_PRODUCTS · VW_KPI_CANASTA_PROMEDIO.'] },
  ],
  diagramTitle: 'Primary flow · Snowflake SQL',
  diagramDescription: 'The primary implementation connects CSV ingestion, Medallion layers, seven business views, and analytics consumption. Databricks and Snowpark are alternative implementations of the same case, not later stages in this flow.',
  retailDiagramLabels: {
    source: 'Retail CSV',
    stage: 'Snowflake Internal Stage',
    copyInto: 'COPY INTO',
    bronze: 'Bronze · RAW_DATA',
    silver: 'Silver · CLEANED_RETAIL_DATA',
    gold: 'Gold · Business Views',
    goldViews: ['VW_RENTABILIDAD_POR_CATEGORIA', 'VW_RENDIMIENTO_GEOGRAFICO', 'VW_TENDENCIA_VS_ESTACIONALIDAD', 'VW_METODO_PAGO_ANALISIS', 'VW_EFECTIVIDAD_DESCUENTO', 'VW_RANKING_PRODUCTS', 'VW_KPI_CANASTA_PROMEDIO'],
    powerBi: 'Power BI · analytics consumption',
    alternativesTitle: 'Alternative implementations of the same case',
    databricksTitle: 'Databricks · PySpark',
    databricksBullets: ['CSV from Unity Catalog Volumes.', 'Bronze and Silver Delta tables; DataFrame transformations with PySpark.', 'Seven analytical outputs saved as Delta tables using overwrite.'],
    snowparkTitle: 'Snowpark Python',
    snowparkBullets: ['Reads the CSV from an Internal Stage with Snowpark.', 'Silver transformations and aggregations with group_by and agg.', 'Seven Gold analytical views created inside Snowflake.'],
  },
  componentsTitle: 'Solution components',
  components: [
    { title: 'Transaction dataset', description: 'Retail_Transaction_Dataset.csv · synthetic data documented in the README with 100,000 records.', bullets: ['Customer_ID, Product_ID, Quantity, and Price.', 'Transaction_Date, Payment_Method, and Store_Location.', 'Product_Category, Discount_Applied, and Total_Amount.', 'A practice dataset, not real transactions from a company.'], code: ['Retail_Transaction_Dataset.csv'] },
    { title: 'Snowflake storage and ingestion', description: '02_Retail_Transactions.sql · database, schemas, and ingestion from an Internal Stage.', bullets: ['RETAIL_TRANSACTIONS database and BRONZE, SILVER, and GOLD schemas.', 'CSV_GENERIC_FORMAT and STG_RAW_DATA stage.', 'COPY INTO loads the file into RAW_DATA.', 'The page does not recommend ACCOUNTADMIN or show credentials.'], code: ['Snowflake/SQL/02_Retail_Transactions.sql'] },
    { title: 'SQL Silver transformations', description: 'CLEANED_RETAIL_DATA converts text fields and prepares commercial dimensions.', bullets: ['Numeric and date conversion; text normalization.', 'Null handling with COALESCE and STORE_STATE extraction from FULL_ADDRESS.', 'Filters invalid critical records and adds a load timestamp.'], code: ['CLEANED_RETAIL_DATA'] },
    { title: 'Gold Business Views', description: 'Seven SQL views organize indicators for analytics consumption.', bullets: ['Category profitability and geographic performance.', 'Time trends and payment methods.', 'Discount effectiveness, product ranking, and average basket size.', 'VW_RANKING_PRODUCTS is defined in the SQL script; successful execution is not claimed.'], code: ['RETAIL_TRANSACTIONS.GOLD'] },
    { title: 'Databricks / PySpark', description: 'Retail_Transactions.ipynb · an Azure Databricks alternative using Unity Catalog.', bullets: ['Reads CSV from a Volume with DataFrameReader and header, delimiter, quote, escape, and multiline options.', 'Applies Silver transformations with PySpark and persists Bronze/Silver in Delta.', 'Generates seven Gold outputs as Delta tables using overwrite; this is not incremental loading.'], code: ['Databricks/Python/Retail_Transactions.ipynb'] },
    { title: 'Snowpark Python', description: '02_Retail_Transactions.ipynb · a Python alternative running inside Snowflake.', bullets: ['Gets the active session and reads the file from an Internal Stage.', 'Transforms data with Snowpark, session.read, session.table, group_by, and agg.', 'Creates seven Gold analytical views; this is not a phase after Snowflake SQL.'], code: ['Snowflake/Python_Snowpark/02_Retail_Transactions.ipynb'] },
  ],
  workflowTitle: 'Data process step by step',
  workflowIntro: 'Primary flow documented in Snowflake/SQL/02_Retail_Transactions.sql.',
  workflow: [
    { title: 'Prepare the dataset', file: 'Retail_Transaction_Dataset.csv', description: 'Review columns, types, dates, payment methods, locations, categories, and commercial metrics.' },
    { title: 'Configure Snowflake', file: '02_Retail_Transactions.sql', description: 'Create RETAIL_TRANSACTIONS, the BRONZE, SILVER, and GOLD schemas, the File Format, and the Internal Stage.' },
    { title: 'Ingest into Bronze', file: 'COPY INTO', description: 'Read the file from the Internal Stage and load RAW_DATA, initially keeping the fields as VARCHAR.' },
    { title: 'Transform Silver', file: 'CLEANED_RETAIL_DATA', description: 'Clean and convert fields, normalize payment methods, extract the state, handle nulls, filter invalid critical records, and record LOAD_TIMESTAMP.' },
    { title: 'Build Gold', file: 'Business Views', description: 'Define seven views for profitability, geography, trends, payment methods, discounts, product ranking, and basket size.' },
    { title: 'Validate results', file: 'SQL queries', description: 'Query the Gold views to check their results. This page does not report execution metrics.' },
    { title: 'Analytics consumption', file: 'Power BI', description: 'The project connects data preparation with the Business Intelligence layer; unverified visuals are not described.' },
  ],
  workflowNote: 'Databricks/PySpark and Snowpark Python are alternative implementations of the same business logic. They are not later steps in the Snowflake SQL pipeline.',
  workflowAlternatives: {
    title: 'Other implementations of the case',
    items: [
      { name: 'Databricks · PySpark', description: 'Replicates transformations with DataFrames and Delta tables. Outputs use overwrite.' },
      { name: 'Snowpark Python', description: 'Replicates transformations and aggregations inside Snowflake and creates Gold analytical views.' },
    ],
  },
  codeTitle: 'Analytics solution implementation',
  codeExamples: [
    { layer: 'BRONZE · SNOWFLAKE SQL', file: 'Snowflake/SQL/02_Retail_Transactions.sql', title: 'Bronze load with COPY INTO', description: 'Script excerpt loading the CSV from the Internal Stage with the configured File Format.', code: sql.bronze, language: 'sql', url: sqlUrl },
    { layer: 'SILVER · SNOWFLAKE SQL', file: 'Snowflake/SQL/02_Retail_Transactions.sql', title: 'Silver cleansing and typing', description: 'Converts VARCHAR fields to numeric and timestamp types, normalizes text, handles nulls, and extracts STORE_STATE.', code: sql.silver, language: 'sql', url: sqlUrl },
    { layer: 'GOLD · SNOWFLAKE SQL', file: 'Snowflake/SQL/02_Retail_Transactions.sql', title: 'Category profitability aggregation', description: 'Groups by category and calculates revenue and average discount.', code: sql.profitability, language: 'sql', url: sqlUrl },
    { layer: 'SILVER · PYSPARK / DELTA', file: 'Databricks/Python/Retail_Transactions.ipynb', title: 'Silver transformations with PySpark', description: 'Shows casts, string cleanup, date normalization, state extraction with regexp, and Delta overwrite.', code: sql.pyspark, language: 'python', url: databricksNotebookUrl },
    { layer: 'GOLD · SNOWPARK PYTHON', file: 'Snowflake/Python_Snowpark/02_Retail_Transactions.ipynb', title: 'Snowpark category aggregation', description: 'Uses group_by and agg to calculate TOTAL_REVENUE and AVG_DISCOUNT_PERCENT inside Snowflake.', code: sql.snowpark, language: 'python', url: snowparkNotebookUrl },
  ],
  resultsTitle: 'Results and Business Insights',
  resultCards: [
    { title: 'Documented coverage', description: 'Coverage figures and artifacts documented in the READMEs and scripts; these are not execution metrics verified in this review.', bullets: ['100,000 documented synthetic records.', '3 Medallion layers: Bronze, Silver, and Gold.', '7 views defined in the primary SQL script.', '7 Gold analytical outputs in Databricks and 7 Gold views in Snowpark.'] },
    { title: 'Business Insights', description: 'Seven business analyses defined by the project views and aggregations.', bullets: ['Category profitability.', 'Geographic performance.', 'Time trends.', 'Payment methods.', 'Discounts, product ranking, and average basket size.'] },
    { title: 'Analytics capabilities', description: 'Preparing transactions to explore commercial indicators with BI tools.', bullets: ['Transforming and normalizing geographic and time dimensions.', 'Commercial aggregations and category comparisons.', 'Discount analysis without causal claims.', 'Product ranking and average quantity by category.', 'Preparing datasets for analytics consumption.'] },
  ],
  domainsTitle: 'Analytical queries',
  retailInsights: {
    title: 'Seven business perspectives',
    items: [
      { title: 'Category profitability', view: 'VW_RENTABILIDAD_POR_CATEGORIA', metrics: ['TOTAL_REVENUE', 'AVG_DISCOUNT_PERCENT'], question: 'What revenue and average discount does each category show?' },
      { title: 'Geographic performance', view: 'VW_RENDIMIENTO_GEOGRAFICO', metrics: ['STORE_STATE', 'TOTAL_REVENUE', 'TRANSACTIONS_QTY'], question: 'How is commercial activity distributed by state?' },
      { title: 'Time trends', view: 'VW_TENDENCIA_VS_ESTACIONALIDAD', metrics: ['TRANSACTION_DAY', 'TRANSACTION_MONTH', 'TOTAL_REVENUE'], question: 'How does revenue change over time?' },
      { title: 'Payment methods', view: 'VW_METODO_PAGO_ANALISIS', metrics: ['PAYMENT_METHOD', 'TOTAL_REVENUE', 'AVG_TICKET_VALUE'], question: 'What revenue and average ticket value are observed by payment method?' },
      { title: 'Discount effectiveness', view: 'VW_EFECTIVIDAD_DESCUENTO', metrics: ['DISCOUNT_RANGE', 'TOTAL_UNITS_SOLD'], question: 'How are units sold distributed across discount ranges? The view does not demonstrate causality.' },
      { title: 'Product ranking', view: 'VW_RANKING_PRODUCTS', metrics: ['PRODUCT_ID', 'TOTAL_QTY_SOLD', 'TOTAL_REVENUE'], question: 'Which products account for more units and revenue? The view is defined in the script; execution is not verified.' },
      { title: 'Average basket size', view: 'VW_KPI_CANASTA_PROMEDIO', metrics: ['PRODUCT_CATEGORY', 'AVG_BASKET_SIZE'], question: 'What is the average quantity of units by category?' },
    ],
  },
  limitationsTitle: 'Scope and limitations',
  limitations: ['The dataset is synthetic; 100,000 rows are documented, not counted in an execution during this review.', 'The Snowflake README mentions eight views and RFM; the reviewed SQL defines seven views and contains no RFM view.', 'The PySpark and Snowpark implementations use overwrite for Bronze/Silver tables or Delta outputs; they are not presented as incremental.', 'The VW_RANKING_PRODUCTS SQL definition is included among the seven views; successful execution of every statement is not claimed.'],
  roadmapTitle: 'Future improvements',
  roadmap: ['Correct and validate SQL definitions.', 'Add automated data quality tests and additional deduplication controls.', 'Add incremental loads and CDC.', 'Implement orchestration and strengthen auditing.', 'Document a formal dimensional model.', 'Align conventions across SQL, PySpark, and Snowpark.', 'Strengthen the connection between Gold and the BI model; document measures and relationships.'],
  repositoryUrl: root,
  repositoryLinkLabel: 'View the project repository on GitHub',
  evidence: {
    title: 'Implementation references',
    description: 'Source files reviewed for this page.',
    links: [{ label: 'Databricks README', url: databricksReadmeUrl }],
  },
  languageSwitchLabel: 'Switch language to Spanish',
  projectNavigationLabel: 'Project navigation',
  footer: 'Made with care by Carlos Martinez',
};

export const retailTransactionsProjectCopy: Record<ProjectLocale, OlistProjectCopy> = { es, en };
