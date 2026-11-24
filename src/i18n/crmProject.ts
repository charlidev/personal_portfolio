import type { OlistProjectCopy, ProjectLocale } from './olistProject';

const repository = 'https://github.com/charlidev/Project_08_Marketing/blob/master';

const sharedCode = {
  bronze: `@dlt.table(name="bronze_crm_marketing")
def bronze_crm_marketing():
    spark = SparkSession.builder.getOrCreate()
    return (
        spark.readStream.format("cloudFiles")
        .option("cloudFiles.format", "csv")
        .option("cloudFiles.inferColumnTypes", "true")
        .option("header", "true")
        .load(ruta_adls)  # storage path omitted
        .withColumn("ingestion_timestamp", current_timestamp())
        .withColumn("source_file", F.col("_metadata.file_path"))
    )`,
  silver: `@dlt.expect_or_drop("ingreso_valido", "Income IS NOT NULL AND Income >= 0")
@dlt.expect_or_drop("edad_logica", "Age >= 18 AND Age <= 100")
@dlt.expect_or_drop("gasto_positivo", "MntTotal >= 0")
def silver_crm_marketing():
    df_bronze = dlt.read_stream("bronze_crm_marketing")
    return df_bronze.dropDuplicates()`,
  gold: `@dlt.view(name="silver_with_id")
def silver_with_id():
    return (
        dlt.read("silver_crm_marketing")
        .withColumn("Customer_ID", F.md5(F.to_json(F.struct("*"))))
    )

@dlt.table(name="dim_clientes")
def dim_clientes():
    return (
        dlt.read("silver_with_id")
        .withColumn("Total_Dependents", F.col("Kidhome") + F.col("Teenhome"))
        .select("Customer_ID", "Age", "Income", "Total_Dependents", ...)
    )`,
  workflow: ['jobs:', '  unit-tests:', '    name: "Run Unit Tests & Coverage"', '    steps:', '      - name: Run pytest with coverage', '        run: |', '          pytest tests/ --cov=src/dlt_pipeline --cov-report=term-missing', '', '  deploy:', '    name: "Deploy Bundle"', '    needs: unit-tests', '    steps:', '      - name: Deploy Databricks Bundle', '        run: |', '          databricks bundle deploy --target ${{ env.TARGET }}'].join('\n'),
  target: ['if [[ "${{ github.ref_name }}" == "main" || "${{ github.ref_name }}" == "master" ]]; then', '  echo "TARGET=prod" >> $GITHUB_ENV', 'elif [[ "${{ github.ref_name }}" == "test" ]]; then', '  echo "TARGET=test" >> $GITHUB_ENV', 'else', '  echo "TARGET=dev" >> $GITHUB_ENV', 'fi'].join('\n'),
};

export const crmProjectCopy: Record<ProjectLocale, OlistProjectCopy> = {
  es: {
    backToProjects: 'Volver a proyectos',
    eyebrow: 'CASO DE ESTUDIO · INGENIERÍA DE DATOS',
    title: 'CRM Marketing — Data Engineering Pipeline',
    subtitle: 'Pipeline de ingeniería de datos para análisis de clientes, compras y campañas de marketing.',
    summaryTitle: 'Resumen del proyecto',
    summary: 'Pipeline de marketing sobre Azure Databricks que organiza la transformación de datos mediante la arquitectura Medallion.',
    technicalSummary: 'La solución usa PySpark, Delta Live Tables y ADLS Gen2 para procesar datos en Bronze, aplicar reglas de calidad en Silver y construir un modelo dimensional en Gold con una dimensión y dos tablas de hechos. La página describe el código y los artefactos del repositorio; no afirma que el pipeline se haya ejecutado integralmente en Databricks.',
    technologyLabel: 'Tecnologías',
    technologies: ['Azure Databricks', 'PySpark', 'Delta Live Tables (DLT)', 'Auto Loader', 'Delta Lake', 'Unity Catalog', 'Databricks Asset Bundles', 'GitHub Actions', 'PyTest', 'Power BI'],
    tabs: ['Arquitectura', 'Componentes', 'Flujo de trabajo', 'Código', 'Resultados'],
    architectureTitle: 'Arquitectura del Pipeline',
    architectureLayers: [
      { title: 'Bronze — Ingesta', description: 'Lectura de archivos CSV desde ADLS Gen2 mediante Auto Loader.', bullets: ['cloudFiles con inferencia de tipos y encabezado CSV.', 'Agrega ingestion_timestamp y el origen de archivo desde _metadata.file_path.', 'Publica la tabla bronze_crm_marketing.'] },
      { title: 'Silver — Calidad', description: 'Transformación streaming desde la tabla Bronze.', bullets: ['Elimina duplicados exactos con dropDuplicates().', 'Aplica tres reglas con dlt.expect_or_drop.', 'Los registros que incumplen las reglas se descartan; el código no implementa cuarentena.'] },
      { title: 'Gold — Modelo dimensional', description: 'Construcción de una dimensión y dos tablas de hechos.', bullets: ['Genera Customer_ID mediante MD5 sobre la representación JSON del registro.', 'Publica dim_clientes, fact_compras y fact_campanias.', 'Customer_ID es una clave calculada desde el registro, no un identificador natural.'] },
    ],
    diagramTitle: 'Flujo de arquitectura y CI/CD',
    diagramDescription: 'Los datos de ADLS Gen2 ingresan por Auto Loader a Bronze, pasan por tres reglas de calidad en Silver y generan en Gold una dimensión y dos tablas de hechos. En paralelo, GitHub Actions ejecuta PyTest antes del despliegue con Databricks Asset Bundles.',
    crmDiagramLabels: { source: 'ADLS Gen2 Landing', ingestion: 'Auto Loader', bronze: 'BRONZE · Delta', silver: 'SILVER · DLT', gold: 'GOLD · Delta', dimension: 'dim_clientes', purchaseFact: 'fact_compras', campaignFact: 'fact_campanias', github: 'GitHub', ci: 'GitHub Actions', tests: 'PyTest · local Spark', deploy: 'DAB · deploy' },
    componentsTitle: 'Componentes de la solución',
    components: [
      { title: 'Fuente de datos', description: 'Archivos CSV de marketing en ADLS Gen2.', bullets: ['La ruta física y los identificadores de almacenamiento no se muestran.', 'La ingestión se realiza con Auto Loader.'] },
      { title: 'Ingesta Bronze', description: 'src/dlt_pipeline/01_bronze.py', bullets: ['PySpark, Auto Loader y Delta Live Tables.', 'Lee CSV con cloudFiles e inferColumnTypes.', 'Agrega ingestion_timestamp y source_file.'], code: ['bronze_crm_marketing'] },
      { title: 'Calidad Silver', description: 'src/dlt_pipeline/02_silver.py', bullets: ['Lee Bronze mediante dlt.read_stream y elimina duplicados exactos.', 'expect_or_drop descarta filas que incumplen las reglas.', 'No hay cuarentena, métricas o alertas implementadas en este flujo.'], code: ['ingreso_valido: Income IS NOT NULL AND Income >= 0', 'edad_logica: Age >= 18 AND Age <= 100', 'gasto_positivo: MntTotal >= 0'] },
      { title: 'Modelo Gold', description: 'src/dlt_pipeline/03_gold.py', bullets: ['La vista silver_with_id calcula Customer_ID con MD5 del JSON del registro.', 'Una dimensión de clientes y dos hechos analíticos.', 'Total_Dependents se calcula como Kidhome + Teenhome.'], code: ['dim_clientes', 'fact_compras', 'fact_campanias'] },
      { title: 'Configuración del bundle', description: 'databricks.yml', bullets: ['Declara un pipeline serverless y no continuo.', 'Catálogo marketing y esquemas marketing_schema_dev, marketing_schema_test y marketing_schema_prod.', 'Los targets están definidos en configuración; no se afirma que estén desplegados o validados.'] },
      { title: 'Pruebas y CI/CD', description: '.github/workflows/deploy.yml · tests/test_transformations.py', bullets: ['GitHub Actions usa Python 3.10, PyTest, PySpark y Databricks CLI.', 'Dos pruebas unitarias: generación de Customer_ID y fórmula Total_Dependents.', 'El job de despliegue depende de que termine el job de pruebas.', 'Son pruebas unitarias con Spark local; no son pruebas de integración DLT.'], code: ['requirements-test.txt', 'pytest-cov'] },
      { title: 'Modelo Power BI', description: 'dashboard/dashboard_marketing.pbip', bullets: ['El modelo semántico referencia la dimensión y ambas tablas de hechos.', 'Incluye dos relaciones por Customer_ID y medidas DAX.', 'El modelo apunta al esquema de producción; la página del reporte no contiene visualizaciones configuradas.'] },
    ],
    workflowTitle: 'Proceso de datos paso a paso',
    workflowIntro: 'El recorrido resume lo definido por los archivos del repositorio. No representa una ejecución integral confirmada.',
    workflow: [
      { title: 'Recepción de archivos', description: 'Los CSV de CRM se ubican en la zona landing de ADLS Gen2.' },
      { title: 'Ingesta en Bronze', file: 'src/dlt_pipeline/01_bronze.py', description: 'Auto Loader lee los CSV, infiere los tipos y registra la fecha de ingesta y el archivo de origen.' },
      { title: 'Reglas de calidad en Silver', file: 'src/dlt_pipeline/02_silver.py', description: 'Lee en streaming, elimina duplicados exactos y descarta filas que no satisfacen las tres expectativas.' },
      { title: 'Generación de clave', file: 'src/dlt_pipeline/03_gold.py', description: 'La vista silver_with_id calcula Customer_ID con MD5 aplicado al JSON de cada registro.' },
      { title: 'Construcción del modelo Gold', description: 'El código define dim_clientes y los hechos fact_compras y fact_campanias.', bullets: ['dim_clientes: Customer_ID, Age, Income, Total_Dependents, marital_*, education_* y Customer_Days.', 'fact_compras: Recency, MntTotal, gastos por categoría y compras por canal.', 'fact_campanias: AcceptedCmp1–5, AcceptedCmpOverall, Response y Complain.'] },
      { title: 'Pruebas unitarias', file: 'tests/test_transformations.py', description: 'GitHub Actions ejecuta PyTest con Spark local antes del despliegue.', bullets: ['Comprueba la generación de Customer_ID.', 'Comprueba el cálculo de Total_Dependents.', 'No incluye pruebas de integración de Delta Live Tables.'] },
      { title: 'Despliegue configurado', file: 'databricks.yml', description: 'Si las pruebas terminan correctamente, el workflow llama a Databricks CLI para desplegar el bundle al target asociado a la rama.', bullets: ['main/master → prod; test → test; otras ramas → dev.', 'La configuración describe los targets y el flujo; no confirma despliegues ejecutados.'] },
    ],
    workflowNote: 'El modelo Power BI está configurado para consultar producción, pero su página aún no contiene visualizaciones. El repositorio no acredita una ejecución end-to-end del pipeline.',
    codeTitle: 'Implementación del Pipeline',
    codeExamples: [
      { layer: 'Bronze', file: 'src/dlt_pipeline/01_bronze.py', title: 'Ingesta con Auto Loader', description: 'Lectura de CSV con inferencia de tipos, metadatos de ingesta y archivo de origen. Se omite la ruta física del almacenamiento.', code: sharedCode.bronze, url: `${repository}/src/dlt_pipeline/01_bronze.py` },
      { layer: 'Silver', file: 'src/dlt_pipeline/02_silver.py', title: 'Reglas de calidad', description: 'Las expectativas descartan registros que no cumplen las condiciones; no configuran una cuarentena.', code: sharedCode.silver, url: `${repository}/src/dlt_pipeline/02_silver.py` },
      { layer: 'Gold', file: 'src/dlt_pipeline/03_gold.py', title: 'Identificador y dimensión de clientes', description: 'Customer_ID se deriva del JSON del registro y Total_Dependents suma Kidhome y Teenhome.', code: sharedCode.gold, url: `${repository}/src/dlt_pipeline/03_gold.py` },
      { layer: 'CI/CD', file: '.github/workflows/deploy.yml', title: 'Pruebas antes del despliegue', description: 'El job de deploy declara una dependencia del job unit-tests.', code: sharedCode.workflow, language: 'yaml', url: `${repository}/.github/workflows/deploy.yml`, supportingCode: [{ title: 'Selección del target por rama', code: sharedCode.target, language: 'bash' }] },
      { layer: 'Configuración', file: 'databricks.yml', title: 'Targets declarados para el bundle', description: 'Fragmento de configuración del catálogo, esquemas y modo de desarrollo por target.', code: ['bundle:', '  name: crm_marketing_pipeline', 'resources:', '  pipelines:', '    crm_dlt_pipeline:', '      target: "marketing_schema_${bundle.target}"', '      catalog: "marketing"', '      continuous: false', '      serverless: true', 'targets:', '  dev:', '    default: true', '    resources:', '      pipelines:', '        crm_dlt_pipeline:', '          development: true', '  test:', '    resources:', '      pipelines:', '        crm_dlt_pipeline:', '          development: true', '  prod:', '    resources:', '      pipelines:', '        crm_dlt_pipeline:', '          development: false'].join('\n'), language: 'yaml', url: `${repository}/databricks.yml`, supportingCode: [{ title: 'Pruebas unitarias incluidas', code: ['test_silver_customer_id_generation', 'test_dim_clientes_dependents'].join('\n'), language: 'python' }] },
    ],
    resultsTitle: 'Resultados del proyecto',
    resultCards: [
      { title: 'Arquitectura definida', description: 'Componentes descritos por el código y los archivos de configuración.', bullets: ['3 capas Medallion', '3 reglas expect_or_drop', '1 dimensión y 2 tablas de hechos'] },
      { title: 'Modelo dimensional', description: 'Objetos analíticos definidos en Gold.', bullets: ['dim_clientes', 'fact_compras', 'fact_campanias'] },
      { title: 'Pruebas y automatización', description: 'El repositorio define pruebas unitarias y una secuencia de CI/CD.', bullets: ['2 pruebas con Spark local', 'PyTest antes del despliegue', 'Sin pruebas de integración DLT'] },
    ],
    domainsTitle: '',
    limitationsTitle: '',
    limitations: [],
    semanticModel: {
      title: 'Modelo semántico de Power BI',
      description: 'El proyecto incluye un archivo PBIP con relaciones y medidas DAX. La página del reporte no tiene visualizaciones configuradas, por lo que no se presenta como un dashboard terminado.',
      relations: ['dim_clientes[Customer_ID] → fact_compras[Customer_ID]', 'dim_clientes[Customer_ID] → fact_campanias[Customer_ID]'],
      measureGroups: [
        { title: 'Perfil de clientes', measures: ['Total Clientes', 'Ingreso Promedio', 'Edad Promedio', 'Antigüedad Promedio (Días)', 'Dependientes Promedio'] },
        { title: 'Campañas', measures: ['Tasa Respuesta Última Campaña', 'Tasa Aceptación Cmp1–Cmp5', 'Campañas Aceptadas Promedio', 'Clientes Multirespuesta', 'Clientes con Quejas'] },
        { title: 'Compras y canales', measures: ['Gasto Total', 'Gasto Promedio por Cliente', 'Gasto Vinos', 'Gasto Frutas', 'Compras Web', 'Compras Catálogo', 'Compras Tienda'] },
        { title: 'Análisis RFM', measures: ['R - Recency Promedio (Días)', 'F - Total Compras (Frecuencia)', 'M - Valor Monetario Total', 'M - Valor Monetario Promedio'] },
      ],
    },
    roadmapTitle: 'Siguientes mejoras',
    roadmap: ['Ampliar las pruebas unitarias de transformaciones.', 'Agregar pruebas de integración para el pipeline DLT.', 'Evaluar cuarentena para registros que incumplen las reglas.', 'Incorporar auditoría, métricas y alertas de errores.', 'Fortalecer la gobernanza con Unity Catalog.', 'Ejecutar y documentar la validación de los tres ambientes.', 'Completar las visualizaciones del reporte Power BI.', 'Dar seguimiento a cambios en los registros y clientes.'],
    languageSwitchLabel: 'Cambiar idioma a inglés',
    projectNavigationLabel: 'Navegación del proyecto',
    footer: 'Hecho con cariño by Carlos Martinez',
  },
  en: {
    backToProjects: 'Back to projects',
    eyebrow: 'CASE STUDY · DATA ENGINEERING',
    title: 'CRM Marketing — Data Engineering Pipeline',
    subtitle: 'A data engineering pipeline for customer, purchase, and marketing campaign analysis.',
    summaryTitle: 'Project Overview',
    summary: 'A marketing data pipeline on Azure Databricks that organizes transformations with a Medallion architecture.',
    technicalSummary: 'The solution uses PySpark, Delta Live Tables, and ADLS Gen2 to process data in Bronze, apply quality rules in Silver, and build a Gold dimensional model with one dimension and two fact tables. This page describes repository code and artifacts; it does not claim an end-to-end Databricks run.',
    technologyLabel: 'Technologies',
    technologies: ['Azure Databricks', 'PySpark', 'Delta Live Tables (DLT)', 'Auto Loader', 'Delta Lake', 'Unity Catalog', 'Databricks Asset Bundles', 'GitHub Actions', 'PyTest', 'Power BI'],
    tabs: ['Architecture', 'Components', 'Workflow', 'Code', 'Results'],
    architectureTitle: 'Pipeline Architecture',
    architectureLayers: [
      { title: 'Bronze — Ingestion', description: 'Reads CSV files from ADLS Gen2 using Auto Loader.', bullets: ['cloudFiles with type inference and CSV headers.', 'Adds ingestion_timestamp and source file from _metadata.file_path.', 'Publishes bronze_crm_marketing.'] },
      { title: 'Silver — Quality', description: 'Streaming transformation from the Bronze table.', bullets: ['Removes exact duplicates with dropDuplicates().', 'Applies three rules with dlt.expect_or_drop.', 'Rows that fail are dropped; the code does not implement quarantine.'] },
      { title: 'Gold — Dimensional model', description: 'Builds one dimension and two fact tables.', bullets: ['Generates Customer_ID with MD5 over the record JSON representation.', 'Publishes dim_clientes, fact_compras, and fact_campanias.', 'Customer_ID is derived from the record, not a natural key.'] },
    ],
    diagramTitle: 'Architecture and CI/CD flow',
    diagramDescription: 'ADLS Gen2 data enters Bronze through Auto Loader, passes three quality rules in Silver, and produces one dimension and two fact tables in Gold. Separately, GitHub Actions runs PyTest before deployment with Databricks Asset Bundles.',
    crmDiagramLabels: { source: 'ADLS Gen2 Landing', ingestion: 'Auto Loader', bronze: 'BRONZE · Delta', silver: 'SILVER · DLT', gold: 'GOLD · Delta', dimension: 'dim_clientes', purchaseFact: 'fact_compras', campaignFact: 'fact_campanias', github: 'GitHub', ci: 'GitHub Actions', tests: 'PyTest · local Spark', deploy: 'DAB · deploy' },
    componentsTitle: 'Solution Components',
    components: [
      { title: 'Data source', description: 'Marketing CSV files in ADLS Gen2.', bullets: ['Physical paths and storage identifiers are omitted.', 'Ingestion uses Auto Loader.'] },
      { title: 'Bronze ingestion', description: 'src/dlt_pipeline/01_bronze.py', bullets: ['PySpark, Auto Loader, and Delta Live Tables.', 'Reads CSV with cloudFiles and inferColumnTypes.', 'Adds ingestion_timestamp and source_file.'], code: ['bronze_crm_marketing'] },
      { title: 'Silver data quality', description: 'src/dlt_pipeline/02_silver.py', bullets: ['Reads Bronze with dlt.read_stream and removes exact duplicates.', 'expect_or_drop drops rows that fail the rules.', 'This flow does not implement quarantine, metrics, or alerts.'], code: ['ingreso_valido: Income IS NOT NULL AND Income >= 0', 'edad_logica: Age >= 18 AND Age <= 100', 'gasto_positivo: MntTotal >= 0'] },
      { title: 'Gold model', description: 'src/dlt_pipeline/03_gold.py', bullets: ['The silver_with_id view calculates Customer_ID with MD5 over the record JSON.', 'One customer dimension and two analytical facts.', 'Total_Dependents is calculated as Kidhome + Teenhome.'], code: ['dim_clientes', 'fact_compras', 'fact_campanias'] },
      { title: 'Bundle configuration', description: 'databricks.yml', bullets: ['Declares a serverless, non-continuous pipeline.', 'Catalog marketing and schemas marketing_schema_dev, marketing_schema_test, and marketing_schema_prod.', 'Targets are declared in configuration; this does not claim they were deployed or validated.'] },
      { title: 'Testing and CI/CD', description: '.github/workflows/deploy.yml · tests/test_transformations.py', bullets: ['GitHub Actions uses Python 3.10, PyTest, PySpark, and Databricks CLI.', 'Two unit tests: Customer_ID generation and the Total_Dependents formula.', 'The deploy job depends on the test job.', 'These are local Spark unit tests, not DLT integration tests.'], code: ['requirements-test.txt', 'pytest-cov'] },
      { title: 'Power BI model', description: 'dashboard/dashboard_marketing.pbip', bullets: ['The semantic model references the dimension and both fact tables.', 'Includes two Customer_ID relationships and DAX measures.', 'The model points to the production schema; the report page has no configured visuals.'] },
    ],
    workflowTitle: 'Data Process Step by Step',
    workflowIntro: 'This sequence summarizes what repository files define. It does not represent a confirmed end-to-end run.',
    workflow: [
      { title: 'Receive source files', description: 'CRM CSV files are placed in the ADLS Gen2 landing zone.' },
      { title: 'Bronze ingestion', file: 'src/dlt_pipeline/01_bronze.py', description: 'Auto Loader reads CSV files, infers types, and records ingestion time and source file.' },
      { title: 'Silver quality rules', file: 'src/dlt_pipeline/02_silver.py', description: 'Streams data, removes exact duplicates, and drops rows that fail the three expectations.' },
      { title: 'Generate the key', file: 'src/dlt_pipeline/03_gold.py', description: 'The silver_with_id view calculates Customer_ID with MD5 applied to each record JSON.' },
      { title: 'Build the Gold model', description: 'The code defines dim_clientes and the fact tables fact_compras and fact_campanias.', bullets: ['dim_clientes: Customer_ID, Age, Income, Total_Dependents, marital_*, education_*, and Customer_Days.', 'fact_compras: Recency, MntTotal, category spend, and channel purchases.', 'fact_campanias: AcceptedCmp1–5, AcceptedCmpOverall, Response, and Complain.'] },
      { title: 'Run unit tests', file: 'tests/test_transformations.py', description: 'GitHub Actions runs PyTest with local Spark before deployment.', bullets: ['Checks Customer_ID generation.', 'Checks the Total_Dependents calculation.', 'Does not include Delta Live Tables integration tests.'] },
      { title: 'Configured deployment', file: 'databricks.yml', description: 'After tests finish successfully, the workflow calls Databricks CLI to deploy the bundle to the branch-associated target.', bullets: ['main/master → prod; test → test; other branches → dev.', 'Configuration describes targets and flow; it does not confirm completed deployments.'] },
    ],
    workflowNote: 'The Power BI model is configured to query production, but its report page has no visuals yet. The repository does not confirm an end-to-end pipeline run.',
    codeTitle: 'Pipeline Implementation',
    codeExamples: [
      { layer: 'Bronze', file: 'src/dlt_pipeline/01_bronze.py', title: 'Auto Loader ingestion', description: 'CSV ingestion with type inference, ingestion metadata, and source file. The physical storage path is omitted.', code: sharedCode.bronze, url: `${repository}/src/dlt_pipeline/01_bronze.py` },
      { layer: 'Silver', file: 'src/dlt_pipeline/02_silver.py', title: 'Data quality rules', description: 'Expectations drop records that fail conditions; they do not configure a quarantine.', code: sharedCode.silver, url: `${repository}/src/dlt_pipeline/02_silver.py` },
      { layer: 'Gold', file: 'src/dlt_pipeline/03_gold.py', title: 'Customer identifier and dimension', description: 'Customer_ID is derived from the record JSON and Total_Dependents adds Kidhome and Teenhome.', code: sharedCode.gold, url: `${repository}/src/dlt_pipeline/03_gold.py` },
      { layer: 'CI/CD', file: '.github/workflows/deploy.yml', title: 'Tests before deployment', description: 'The deploy job depends on the unit-tests job.', code: sharedCode.workflow, language: 'yaml', url: `${repository}/.github/workflows/deploy.yml`, supportingCode: [{ title: 'Target selection by branch', code: sharedCode.target, language: 'bash' }] },
      { layer: 'Configuration', file: 'databricks.yml', title: 'Bundle targets', description: 'Configuration excerpt for the catalog, schemas, and development mode by target.', code: ['bundle:', '  name: crm_marketing_pipeline', 'resources:', '  pipelines:', '    crm_dlt_pipeline:', '      target: "marketing_schema_${bundle.target}"', '      catalog: "marketing"', '      continuous: false', '      serverless: true', 'targets:', '  dev:', '    default: true', '    resources:', '      pipelines:', '        crm_dlt_pipeline:', '          development: true', '  test:', '    resources:', '      pipelines:', '        crm_dlt_pipeline:', '          development: true', '  prod:', '    resources:', '      pipelines:', '        crm_dlt_pipeline:', '          development: false'].join('\n'), language: 'yaml', url: `${repository}/databricks.yml`, supportingCode: [{ title: 'Included unit tests', code: ['test_silver_customer_id_generation', 'test_dim_clientes_dependents'].join('\n'), language: 'python' }] },
    ],
    resultsTitle: 'Project Results',
    resultCards: [
      { title: 'Defined architecture', description: 'Components represented in repository code and configuration.', bullets: ['3 Medallion layers', '3 expect_or_drop rules', '1 dimension and 2 fact tables'] },
      { title: 'Dimensional model', description: 'Gold objects defined by the project.', bullets: ['dim_clientes', 'fact_compras', 'fact_campanias'] },
      { title: 'Testing and automation', description: 'The repository defines unit tests and a CI/CD sequence.', bullets: ['2 local Spark unit tests', 'PyTest before deployment', 'No DLT integration tests'] },
    ],
    domainsTitle: '',
    limitationsTitle: '',
    limitations: [],
    semanticModel: {
      title: 'Power BI semantic model',
      description: 'The project includes a PBIP file with relationships and DAX measures. The report page has no configured visuals, so it is not presented as a finished dashboard.',
      relations: ['dim_clientes[Customer_ID] → fact_compras[Customer_ID]', 'dim_clientes[Customer_ID] → fact_campanias[Customer_ID]'],
      measureGroups: [
        { title: 'Customer profile', measures: ['Total Clientes', 'Ingreso Promedio', 'Edad Promedio', 'Antigüedad Promedio (Días)', 'Dependientes Promedio'] },
        { title: 'Campaigns', measures: ['Tasa Respuesta Última Campaña', 'Tasa Aceptación Cmp1–Cmp5', 'Campañas Aceptadas Promedio', 'Clientes Multirespuesta', 'Clientes con Quejas'] },
        { title: 'Purchases and channels', measures: ['Gasto Total', 'Gasto Promedio por Cliente', 'Gasto Vinos', 'Gasto Frutas', 'Compras Web', 'Compras Catálogo', 'Compras Tienda'] },
        { title: 'RFM analysis', measures: ['R - Recency Promedio (Días)', 'F - Total Compras (Frecuencia)', 'M - Valor Monetario Total', 'M - Valor Monetario Promedio'] },
      ],
    },
    roadmapTitle: 'Next improvements',
    roadmap: ['Expand transformation unit tests.', 'Add integration tests for the DLT pipeline.', 'Evaluate quarantine for records that fail expectations.', 'Add auditing, metrics, and error alerts.', 'Strengthen governance with Unity Catalog.', 'Run and document validation in all three environments.', 'Complete the Power BI report visuals.', 'Track changes in records and customers.'],
    languageSwitchLabel: 'Switch language to Spanish',
    projectNavigationLabel: 'Project navigation',
    footer: 'Made with care by Carlos Martinez',
  },
};
