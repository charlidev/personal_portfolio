import type { OlistProjectCopy, ProjectLocale } from './olistProject';

const repository = 'https://github.com/charlidev/Data_Engineering_Portfolio';
const projectPath = 'Project_05_Ferreteria';
const fileUrl = (path: string) => `${repository}/blob/master/${projectPath}/${path}`;

const catalogCode = `fake = Faker('es_MX')
Faker.seed(42)
random.seed(42)`;

const clientCode = `def generar_clientes(cantidad):
    clientes = []
    for i in range(1, cantidad + 1):
        nombre = fake.name()
        if random.random() < 0.20:
            nombre = nombre.lower()
        elif random.random() < 0.05:
            nombre = nombre + " _*"

        rfc = fake.rfc()
        if random.random() < 0.15:
            rfc = ""

        clientes.append({
            "id_cliente": i,
            "nombre": nombre,
            "rfc": rfc,
            "fecha_registro": str(fake.date_this_decade())
        })
    return clientes`;

const csvCode = `def guardar_csv(nombre_archivo, datos, campos):
    ruta_completa = os.path.join(OUTPUT_DIR, nombre_archivo)
    with open(ruta_completa, 'w', newline='', encoding='utf-8') as archivo:
        escritor = csv.DictWriter(archivo, fieldnames=campos)
        escritor.writeheader()
        escritor.writerows(datos)
    print(f"Archivo guardado exitosamente: {ruta_completa}")`;

const transactionCode = `def cargar_estado():
    if os.path.exists(ESTADO_FILE):
        with open(ESTADO_FILE, 'r') as f:
            return json.load(f)
    return {
        "ultimo_id_orden": 0,
        "ultimo_id_detalle": 0,
        "ultimo_id_factura": 0,
        "ultimo_id_movimiento": 0
    }

def guardar_estado(estado):
    with open(ESTADO_FILE, 'w') as f:
        json.dump(estado, f)`;

const transactionIdsCode = `id_orden_actual = estado["ultimo_id_orden"]
id_detalle_actual = estado["ultimo_id_detalle"]
id_factura_actual = estado["ultimo_id_factura"]

for _ in range(num_ordenes):
    id_orden_actual += 1
    id_cliente = random.choice(clientes)['id_cliente']

estado["ultimo_id_orden"] = id_orden_actual
estado["ultimo_id_detalle"] = id_detalle_actual
estado["ultimo_id_factura"] = id_factura_actual

guardar_estado(estado_actual)`;

const bronzeCode = `df_stream = (spark.readStream
    .format("cloudFiles")
    .option("cloudFiles.format", "csv")
    .option("cloudFiles.inferColumnTypes", "true")
    .option("cloudFiles.schemaLocation", ruta_schema)
    .option("pathGlobFilter", filtro_archivos)
    .option("header", "true")
    .load(ruta_origen)
)

(df_stream.writeStream
    .format("delta")
    .option("checkpointLocation", ruta_checkpoint)
    .outputMode("append")
    .trigger(availableNow=True)
    .toTable(tabla_destino)
)`;

const silverCode = `df = df.dropDuplicates()
df = df.withColumn("fecha_carga_plata", current_timestamp())

tabla_delta = DeltaTable.forName(spark, tabla_destino)
(tabla_delta.alias("destino")
 .merge(
     df.alias("origen"),
     f"destino.{llave_primaria} = origen.{llave_primaria}"
 )
 .whenMatchedUpdateAll()
 .whenNotMatchedInsertAll()
 .execute()
)`;

const goldCode = `CREATE OR REPLACE TABLE gold_ventas_maestra AS
SELECT
    o.id_orden,
    d.id_detalle,
    o.fecha_hora AS fecha_venta,
    YEAR(o.fecha_hora) AS anio_venta,
    MONTH(o.fecha_hora) AS mes_venta,
    c.nombre AS nombre_cliente,
    e.nombre AS nombre_empleado,
    p.id_producto,
    p.descripcion AS nombre_producto,
    sub.nombre AS nombre_subcategoria,
    cat.nombre AS nombre_categoria,
    d.cantidad,
    d.precio_unitario_aplicado AS precio_unitario,
    (d.cantidad * d.precio_unitario_aplicado) AS monto_total_linea
FROM ferreteria_\${env}.silver.ordenes_venta o
JOIN ferreteria_\${env}.silver.ordenes_venta_detalle d
    ON o.id_orden = d.id_orden
LEFT JOIN ferreteria_\${env}.silver.productos p
    ON d.id_producto = p.id_producto
LEFT JOIN ferreteria_\${env}.silver.subcategorias sub
    ON p.id_subcategoria = sub.id_subcategoria
LEFT JOIN ferreteria_\${env}.silver.categorias cat
    ON sub.id_categoria = cat.id_categoria
LEFT JOIN ferreteria_\${env}.silver.clientes c
    ON o.id_cliente = c.id_cliente
LEFT JOIN ferreteria_\${env}.silver.empleados e
    ON o.id_empleado = e.id_empleado;`;

const es: OlistProjectCopy = {
  backToProjects: 'Volver a proyectos',
  eyebrow: 'CASO DE ESTUDIO · INGENIERÍA DE DATOS',
  title: 'Ferretería — Data Lakehouse',
  subtitle: 'Pipeline incremental de datos para ventas, inventario y gestión de proveedores.',
  summaryTitle: 'Resumen del Proyecto',
  summary: 'Implementación de un pipeline de datos para una operación de ferretería, utilizando Python, Azure Data Lake Storage Gen2 y Azure Databricks.',
  technicalSummary: 'La solución simula el comportamiento de un sistema empresarial mediante la generación de catálogos y transacciones, la ingesta de archivos CSV con Auto Loader, la limpieza de múltiples entidades y la actualización incremental de registros mediante Delta MERGE. La arquitectura Medallion organiza el procesamiento en Bronze, Silver y Gold, preparando información para el análisis de ventas, movimientos de inventario y compras a proveedores.',
  technologyLabel: 'Tecnologías',
  technologies: ['Python', 'Faker', 'Azure Data Lake Storage Gen2', 'Azure Databricks', 'PySpark', 'Auto Loader', 'Delta Lake', 'Unity Catalog', 'MERGE / Upsert'],
  tabs: ['Arquitectura', 'Componentes', 'Flujo de trabajo', 'Código', 'Resultados'],
  architectureTitle: 'Arquitectura del Data Lakehouse',
  architectureLayers: [
    { eyebrow: 'BRONZE · DATA INGESTION', title: 'Bronze — Ingesta de datos', description: 'Recepción de archivos CSV generados por la simulación de la operación empresarial en Azure Data Lake Storage Gen2.', bullets: ['7 catálogos maestros y 4 entidades transaccionales (11 entidades en total).', 'Databricks Auto Loader usa cloudFiles, inferencia de tipos, schema location y checkpoints.', 'La lectura se procesa con trigger availableNow; no es streaming continuo en tiempo real.', 'La escritura Delta se realiza en modo append.'] },
    { eyebrow: 'SILVER · DATA TRANSFORMATION', title: 'Silver — Transformación', description: 'Limpieza y normalización de las entidades ingeridas en Bronze, con una carga inicial y actualizaciones mediante Delta MERGE.', bullets: ['Normaliza nombres de columnas y texto, trata RFC y acentos, convierte fechas y reemplaza nulos de texto.', 'Elimina duplicados exactos y agrega fecha_carga_plata.', 'La configuración del proceso contiene 11 entidades y sus llaves primarias.', 'MERGE actualiza registros coincidentes e inserta nuevos; no implementa SCD Type 2 ni historial de cambios.'] },
    { eyebrow: 'GOLD · BUSINESS ANALYTICS', title: 'Gold — Analítica de negocio', description: 'Tablas analíticas integradas construidas a partir de entidades Silver mediante joins y cálculos derivados.', bullets: ['gold_ventas_maestra: detalle de venta, dimensiones de tiempo, cliente, empleado y producto.', 'gold_movimientos_stock: movimientos de inventario y atributos del producto.', 'gold_compras_proveedores: proveedor, producto y cálculos de margen.', 'Se presentan como tablas analíticas; no se afirma que formen un esquema estrella formal.'] },
  ],
  diagramTitle: 'Flujo de arquitectura del Data Lakehouse',
  diagramDescription: 'Los generadores producen archivos CSV de catálogos y transacciones. Los archivos pasan por ADLS Gen2, Auto Loader y las capas Bronze, Silver y Gold de Databricks.',
  ferreteriaDiagramLabels: {
    source: 'Generadores Python',
    localFiles: 'Archivos CSV locales',
    catalogGroupTitle: 'Catálogos',
    transactionGroupTitle: 'Transacciones',
    catalogSources: ['Productos', 'Clientes', 'Categorías', 'Subcategorías', 'Proveedores', 'Sucursales', 'Empleados'],
    transactionSources: ['Órdenes de venta', 'Detalle de órdenes', 'Facturas', 'Movimientos de inventario'],
    adls: 'Azure Data Lake Storage Gen2 · archivos CSV',
    autoLoader: 'Databricks Auto Loader · cloudFiles',
    bronze: 'Bronze · Delta',
    silver: 'Silver · limpieza y Delta MERGE',
    gold: 'Gold · tablas analíticas',
    silverOps: ['Normalización de texto', 'Conversión de fechas', 'Limpieza de nulos', 'Deduplicación', 'Delta MERGE'],
    goldOutputs: ['Ventas · gold_ventas_maestra', 'Inventario · gold_movimientos_stock', 'Proveedores · gold_compras_proveedores'],
    unityCatalogTitle: 'Unity Catalog · ambientes configurados en notebook',
    environments: ['ferreteria_dev', 'ferreteria_test', 'ferreteria_prod'],
  },
  componentsTitle: 'Componentes de la solución',
  components: [
    { title: 'Generación de catálogos', description: 'generar_catalogos.py · Python, Faker, CSV y variables de entorno.', bullets: ['Genera datos sintéticos con configuración regional mexicana es_MX.', 'Crea productos, clientes, categorías, subcategorías, proveedores, sucursales y empleados.', 'Las semillas Faker.seed(42) y random.seed(42) permiten repetir la generación.', 'Introduce intencionalmente valores inconsistentes, como campos vacíos, nombres con otro formato y espacios adicionales; no son datos reales.'], code: ['generar_catalogos.py'] },
    { title: 'Generación incremental de transacciones', description: 'generar_transacciones.py · Python, Faker, CSV y estado JSON.', bullets: ['Lee los catálogos y el estado previo de identificadores.', 'Genera órdenes, detalles, facturas y movimientos de inventario.', 'Guarda transacciones en archivos CSV con timestamp y actualiza estado_incremental.json.', 'El estado conserva los últimos IDs de órdenes, detalles, facturas y movimientos para continuar la generación.'], code: ['generar_transacciones.py', 'estado_incremental.json'] },
    { title: 'Transferencia a ADLS Gen2', description: 'subir_a_adls.py · Python y Azure Storage Data Lake SDK.', bullets: ['Recorre directorios locales y detecta archivos CSV.', 'Replica las rutas relativas en el almacenamiento remoto.', 'Mantiene los catálogos en su ubicación local después de cargarlos.', 'Mueve las transacciones a la carpeta de procesados después de una carga satisfactoria. No se muestran conexiones ni identificadores internos.'], code: ['subir_a_adls.py'] },
    { title: 'Ingesta Bronze', description: 'notebooks/01_bronze_ingesta_autoloader.ipynb · Databricks, PySpark, Auto Loader y Delta Lake.', bullets: ['Widgets env y carpeta seleccionan el ambiente y el origen.', 'Diferencia catálogos estáticos de archivos transaccionales mediante patrones de nombres.', 'Usa cloudFiles, inferencia de tipos, schema location y checkpoints por ambiente y entidad.', 'El trigger availableNow procesa los archivos disponibles y finaliza; no representa streaming continuo.'], code: ['notebooks/01_bronze_ingesta_autoloader.ipynb'] },
    { title: 'Transformaciones Silver', description: 'notebooks/02_silver_transformacion.ipynb · PySpark, Delta Lake y DeltaTable MERGE.', bullets: ['Define 11 entidades con sus llaves primarias: categorias, clientes, empleados, productos, proveedores, subcategorias, sucursales, ordenes_venta, ordenes_venta_detalle, facturas y movimientos_inventario.', 'Normaliza columnas, texto, RFC y fechas; limpia nulos y elimina duplicados exactos.', 'Agrega fecha_carga_plata como timestamp de auditoría.', 'Crea la tabla con overwrite si no existe; de lo contrario, actualiza coincidencias e inserta filas nuevas con MERGE.'], code: ['notebooks/02_silver_transformacion.ipynb'] },
    { title: 'Tablas analíticas Gold', description: 'notebooks/03_gold_reportes.ipynb · SQL sobre tablas Silver.', bullets: ['gold_ventas_maestra integra órdenes, detalles, productos, subcategorías, categorías, clientes y empleados; calcula monto_total_linea.', 'gold_movimientos_stock integra movimientos y datos del producto.', 'gold_compras_proveedores integra productos y proveedores y calcula márgenes.', 'El código de ventas mostrado no incluye una dimensión explícita de sucursal en la salida.'], code: ['notebooks/03_gold_reportes.ipynb'] },
    { title: 'Gobierno y ambientes', description: 'notebooks/00_Init_Enviroments.ipynb · configuración de Unity Catalog.', bullets: ['Declara los catálogos ferreteria_dev, ferreteria_test y ferreteria_prod.', 'Define esquemas Bronze, Silver y Gold para cada catálogo.', 'Incluye instrucciones de permisos sobre Gold en producción para un grupo de analistas.', 'La configuración está declarada en el notebook; no se afirma que los ambientes estén desplegados y validados.'], code: ['notebooks/00_Init_Enviroments.ipynb'] },
  ],
  workflowTitle: 'Proceso de Datos Paso a Paso',
  workflowIntro: 'El flujo refleja el orden de ejecución documentado en scripts y notebooks. No se presenta como una orquestación automática.',
  workflow: [
    { title: 'Generación de catálogos', file: 'generar_catalogos.py', description: 'Genera los siete catálogos maestros —productos, clientes, categorías, subcategorías, proveedores, sucursales y empleados— y los exporta como CSV.' },
    { title: 'Generación incremental de transacciones', file: 'generar_transacciones.py', description: 'Lee catálogos y el estado incremental, continúa los identificadores y genera órdenes, detalles, facturas cuando corresponde y movimientos de inventario. Escribe CSV con timestamp y persiste el nuevo estado.' },
    { title: 'Transferencia a ADLS Gen2', file: 'subir_a_adls.py', description: 'Sube catálogos y transacciones conservando rutas relativas. Tras una carga satisfactoria, archiva localmente las transacciones.' },
    { title: 'Inicialización de ambientes', file: 'notebooks/00_Init_Enviroments.ipynb', description: 'Declara catálogos de Unity Catalog para dev, test y prod, cada uno con esquemas Bronze, Silver y Gold. El parámetro env dirige el procesamiento.' },
    { title: 'Ingesta en Bronze', file: 'notebooks/01_bronze_ingesta_autoloader.ipynb', description: 'Selecciona ambiente, carpeta y entidades; Auto Loader lee los CSV, usa schema locations y checkpoints, y escribe Delta con availableNow.' },
    { title: 'Transformación y Upsert en Silver', file: 'notebooks/02_silver_transformacion.ipynb', description: 'Limpia las tablas Bronze, normaliza texto y fechas, reemplaza nulos de texto, elimina duplicados, registra fecha_carga_plata y crea o actualiza la tabla mediante Delta MERGE.' },
    { title: 'Construcción de tablas Gold', file: 'notebooks/03_gold_reportes.ipynb', description: 'Integra entidades Silver mediante joins y crea gold_ventas_maestra, gold_movimientos_stock y gold_compras_proveedores con datos analíticos y cálculos derivados.' },
  ],
  workflowNote: 'Los scripts y notebooks describen los pasos del proceso, pero el repositorio no demuestra que estén orquestados automáticamente.',
  codeTitle: 'Implementación del Data Lakehouse',
  codeExamples: [
    { layer: 'GENERACIÓN DE DATOS', file: 'generar_catalogos.py', title: 'Datos sintéticos reproducibles', description: 'Faker usa configuración regional mexicana y semillas fijas. Los fragmentos muestran la generación de clientes, la simulación deliberada de inconsistencias y la exportación CSV.', code: catalogCode, language: 'python', url: fileUrl('generar_catalogos.py'), supportingCode: [{ title: 'Generación sintética e inconsistencias', code: clientCode, language: 'python' }, { title: 'Exportación CSV', code: csvCode, language: 'python' }] },
    { layer: 'GENERACIÓN INCREMENTAL', file: 'generar_transacciones.py', title: 'Continuidad del estado', description: 'El script recupera los identificadores almacenados, genera nuevas transacciones y persiste el estado para continuar en la siguiente ejecución.', code: transactionCode, language: 'python', url: fileUrl('generar_transacciones.py'), supportingCode: [{ title: 'Incremento de identificadores de órdenes', code: transactionIdsCode, language: 'python' }] },
    { layer: 'BRONZE', file: 'notebooks/01_bronze_ingesta_autoloader.ipynb', title: 'Ingesta con Auto Loader', description: 'Fragmento fiel de lectura y escritura del notebook. Las rutas físicas se representan mediante variables genéricas; el trigger availableNow procesa los archivos disponibles.', code: bronzeCode, language: 'python', url: fileUrl('notebooks/01_bronze_ingesta_autoloader.ipynb') },
    { layer: 'SILVER', file: 'notebooks/02_silver_transformacion.ipynb', title: 'Deduplicación y Delta MERGE', description: 'La carga inicial crea la tabla cuando no existe. En ejecuciones posteriores, MERGE actualiza las llaves coincidentes e inserta las nuevas; no implementa CDC completo ni SCD Type 2.', code: silverCode, language: 'python', url: fileUrl('notebooks/02_silver_transformacion.ipynb') },
    { layer: 'GOLD', file: 'notebooks/03_gold_reportes.ipynb', title: 'Integración analítica de ventas', description: 'Fragmento del SQL que une órdenes y detalles con productos, categorías, clientes y empleados, y calcula el monto por línea.', code: goldCode, language: 'sql', url: fileUrl('notebooks/03_gold_reportes.ipynb') },
  ],
  resultsTitle: 'Resultados del Proyecto',
  resultCards: [
    { title: 'Cobertura de datos', description: 'Estas cifras describen la estructura configurada en los scripts y notebooks; no representan mediciones de ejecuciones exitosas en los tres ambientes.', bullets: ['7 entidades de catálogos', '4 entidades transaccionales', '11 entidades contempladas en Silver', '3 capas Medallion: Bronze, Silver y Gold', '3 ambientes declarados en la configuración', '3 tablas analíticas Gold'] },
    { title: 'Productos analíticos', description: 'Las tablas Gold integran entidades Silver para explorar operaciones de ventas, inventario y proveedores.', bullets: ['gold_ventas_maestra', 'gold_movimientos_stock', 'gold_compras_proveedores'] },
    { title: 'Capacidades de ingeniería', description: 'Capacidades presentes en los scripts y notebooks del proyecto.', bullets: ['Generación de fuentes de datos sintéticas e inconsistencias controladas', 'Generación incremental de transacciones', 'Checkpoints por ambiente y entidad en Auto Loader', 'Limpieza reutilizada para múltiples tablas', 'Delta MERGE / Upsert', 'Aislamiento lógico mediante catálogos de Unity Catalog', 'Trazabilidad con timestamp de carga'] },
  ],
  domainsTitle: 'Salidas analíticas',
  domains: [
    { title: 'Ventas · gold_ventas_maestra', description: 'Integra órdenes, detalles, producto, cliente y empleado con atributos temporales.', bullets: ['Orden y detalle', 'Fecha de venta y campos de año, mes, semana y día', 'Cliente y empleado', 'Producto, categoría y subcategoría', 'Cantidad y precio unitario', 'Monto total por línea', '¿Qué productos generan más ingresos?', '¿Cómo se distribuyen las ventas por categoría?', 'La salida mostrada no incluye explícitamente sucursal.'] },
    { title: 'Inventario · gold_movimientos_stock', description: 'Relaciona movimientos con información de producto y jerarquía de categorías.', bullets: ['Movimiento y fecha', 'Tipo de movimiento', 'Producto, categoría y subcategoría', 'Cantidad', '¿Cómo se distribuyen los movimientos?', '¿Qué productos concentran más movimientos?', '¿Qué tipos de movimiento predominan?'] },
    { title: 'Proveedores · gold_compras_proveedores', description: 'Relaciona proveedores con productos y cálculos de margen.', bullets: ['Proveedor y días de crédito', 'Producto, SKU, marca y categoría', 'Precio de compra y precio de venta', 'Margen de ganancia y margen porcentual', '¿Qué proveedores participan?', '¿Cuál es el margen por producto?', '¿Cómo se distribuyen los márgenes entre categorías?'] },
  ],
  limitationsTitle: 'Alcance actual',
  limitations: ['El flujo está documentado en scripts y notebooks; no se afirma una orquestación de punta a punta.', 'No se presenta CI/CD ni una automatización del proceso completo.', 'No se implementan SCD Type 2, CDC completo, cuarentena ni un framework automatizado de Data Quality.', 'Los tres ambientes y permisos aparecen declarados en un notebook; no se afirma que estén desplegados o verificados.', 'Las cifras describen estructura del código, no volumen de datos ni ejecuciones exitosas.', 'No se afirma que exista un dashboard Power BI terminado.'],
  roadmapTitle: 'Mejoras futuras',
  roadmap: ['Orquestación de la ejecución completa.', 'Automatización del flujo de generación y entrega de archivos.', 'Mayor robustez ante archivos repetidos.', 'Validación automatizada de llaves y relaciones.', 'Reglas de Data Quality con métricas de aceptación.', 'Cuarentena de registros inválidos.', 'Auditoría integral de cargas y transformaciones.', 'Monitoreo de ejecuciones.', 'Pruebas unitarias e integración.', 'CI/CD con promoción entre ambientes.', 'SCD Type 2 para dimensiones históricas.', 'Dashboard Power BI conectado a Gold.'],
  repositoryUrl: `${repository}/tree/master/${projectPath}`,
  repositoryLinkLabel: 'Ver repositorio del proyecto en GitHub',
  languageSwitchLabel: 'Cambiar idioma a inglés',
  projectNavigationLabel: 'Navegación del proyecto',
  footer: 'Hecho con cariño by Carlos Martinez',
};

const en: OlistProjectCopy = {
  backToProjects: 'Back to projects',
  eyebrow: 'CASE STUDY · DATA ENGINEERING',
  title: 'Hardware Retail — Data Lakehouse',
  subtitle: 'Incremental data pipeline for sales, inventory, and supplier management.',
  summaryTitle: 'Project Summary',
  summary: 'Implementation of a data pipeline for a hardware retail operation using Python, Azure Data Lake Storage Gen2, and Azure Databricks.',
  technicalSummary: 'The solution simulates an enterprise system by generating catalogs and transactions, ingesting CSV files with Auto Loader, cleaning multiple entities, and incrementally updating records with Delta MERGE. The Medallion architecture organizes processing into Bronze, Silver, and Gold layers to prepare information for sales, inventory movement, and supplier purchase analysis.',
  technologyLabel: 'Technologies',
  technologies: ['Python', 'Faker', 'Azure Data Lake Storage Gen2', 'Azure Databricks', 'PySpark', 'Auto Loader', 'Delta Lake', 'Unity Catalog', 'MERGE / Upsert'],
  tabs: ['Architecture', 'Components', 'Workflow', 'Code', 'Results'],
  architectureTitle: 'Data Lakehouse Architecture',
  architectureLayers: [
    { eyebrow: 'BRONZE · DATA INGESTION', title: 'Bronze — Data Ingestion', description: 'Receives CSV files generated by the simulated business operation in Azure Data Lake Storage Gen2.', bullets: ['7 master catalogs and 4 transactional entities (11 entities in total).', 'Databricks Auto Loader uses cloudFiles, type inference, schema locations, and checkpoints.', 'The availableNow trigger processes available files and terminates; it is not continuous real-time streaming.', 'Delta writes use append mode.'] },
    { eyebrow: 'SILVER · DATA TRANSFORMATION', title: 'Silver — Transformation', description: 'Cleans and normalizes entities ingested into Bronze, with an initial load and updates through Delta MERGE.', bullets: ['Normalizes column names and text, handles RFC values and accents, converts dates, and replaces null text values.', 'Removes exact duplicates and adds fecha_carga_plata.', 'The process configuration contains 11 entities and their primary keys.', 'MERGE updates matching records and inserts new ones; it does not implement SCD Type 2 or change history.'] },
    { eyebrow: 'GOLD · BUSINESS ANALYTICS', title: 'Gold — Business Analytics', description: 'Integrated analytical tables built from Silver entities through joins and derived calculations.', bullets: ['gold_ventas_maestra: sales details, time attributes, customer, employee, and product.', 'gold_movimientos_stock: inventory movements and product attributes.', 'gold_compras_proveedores: supplier, product, and margin calculations.', 'They are presented as analytical tables; no formal star schema is claimed.'] },
  ],
  diagramTitle: 'Data Lakehouse Architecture Flow',
  diagramDescription: 'Python generators create catalog and transaction CSV files. Files move through ADLS Gen2, Auto Loader, and Databricks Bronze, Silver, and Gold layers.',
  ferreteriaDiagramLabels: {
    source: 'Python generators',
    localFiles: 'Local CSV files',
    catalogGroupTitle: 'Catalogs',
    transactionGroupTitle: 'Transactions',
    catalogSources: ['Products', 'Customers', 'Categories', 'Subcategories', 'Suppliers', 'Branches', 'Employees'],
    transactionSources: ['Sales orders', 'Order details', 'Invoices', 'Inventory movements'],
    adls: 'Azure Data Lake Storage Gen2 · CSV files',
    autoLoader: 'Databricks Auto Loader · cloudFiles',
    bronze: 'Bronze · Delta',
    silver: 'Silver · cleansing and Delta MERGE',
    gold: 'Gold · analytical tables',
    silverOps: ['Text normalization', 'Date conversion', 'Null handling', 'Deduplication', 'Delta MERGE'],
    goldOutputs: ['Sales · gold_ventas_maestra', 'Inventory · gold_movimientos_stock', 'Suppliers · gold_compras_proveedores'],
    unityCatalogTitle: 'Unity Catalog · environments configured in notebook',
    environments: ['ferreteria_dev', 'ferreteria_test', 'ferreteria_prod'],
  },
  componentsTitle: 'Solution Components',
  components: [
    { title: 'Catalog generation', description: 'generar_catalogos.py · Python, Faker, CSV, and environment variables.', bullets: ['Generates synthetic data with the Mexican es_MX locale.', 'Creates products, customers, categories, subcategories, suppliers, branches, and employees.', 'Faker.seed(42) and random.seed(42) make generation reproducible.', 'Intentionally introduces inconsistent values such as blanks, differently formatted names, and extra spaces; these are not real records.'], code: ['generar_catalogos.py'] },
    { title: 'Incremental transaction generation', description: 'generar_transacciones.py · Python, Faker, CSV, and JSON state.', bullets: ['Reads the catalogs and previous identifier state.', 'Generates sales orders, details, invoices, and inventory movements.', 'Writes timestamped transaction CSV files and updates estado_incremental.json.', 'The state stores the latest order, detail, invoice, and movement IDs to continue generation.'], code: ['generar_transacciones.py', 'estado_incremental.json'] },
    { title: 'ADLS Gen2 transfer', description: 'subir_a_adls.py · Python and the Azure Storage Data Lake SDK.', bullets: ['Walks local directories and detects CSV files.', 'Replicates relative paths in remote storage.', 'Keeps catalogs in their local location after upload.', 'Moves transactions to the processed folder after a successful upload. Connection strings and internal identifiers are not shown.'], code: ['subir_a_adls.py'] },
    { title: 'Bronze ingestion', description: 'notebooks/01_bronze_ingesta_autoloader.ipynb · Databricks, PySpark, Auto Loader, and Delta Lake.', bullets: ['env and folder widgets select the environment and source.', 'Distinguishes static catalogs from transactional files using filename patterns.', 'Uses cloudFiles, type inference, schema locations, and checkpoints by environment and entity.', 'The availableNow trigger processes available files and terminates; it is not continuous streaming.'], code: ['notebooks/01_bronze_ingesta_autoloader.ipynb'] },
    { title: 'Silver transformations', description: 'notebooks/02_silver_transformacion.ipynb · PySpark, Delta Lake, and DeltaTable MERGE.', bullets: ['Defines 11 entities and primary keys: categorias, clientes, empleados, productos, proveedores, subcategorias, sucursales, ordenes_venta, ordenes_venta_detalle, facturas, and movimientos_inventario.', 'Normalizes columns, text, RFC values, and dates; handles nulls and removes exact duplicates.', 'Adds fecha_carga_plata as an audit timestamp.', 'Creates the table with overwrite when absent; otherwise updates matching records and inserts new rows through MERGE.'], code: ['notebooks/02_silver_transformacion.ipynb'] },
    { title: 'Gold analytical tables', description: 'notebooks/03_gold_reportes.ipynb · SQL over Silver tables.', bullets: ['gold_ventas_maestra joins orders, details, products, subcategories, categories, customers, and employees; it calculates monto_total_linea.', 'gold_movimientos_stock combines inventory movements and product data.', 'gold_compras_proveedores joins products and suppliers and calculates margins.', 'The shown sales output does not include an explicit branch dimension.'], code: ['notebooks/03_gold_reportes.ipynb'] },
    { title: 'Governance and environments', description: 'notebooks/00_Init_Enviroments.ipynb · Unity Catalog configuration.', bullets: ['Declares ferreteria_dev, ferreteria_test, and ferreteria_prod catalogs.', 'Defines Bronze, Silver, and Gold schemas for each catalog.', 'Includes permission statements for an analyst group on production Gold.', 'This configuration is declared in a notebook; the environments are not claimed to be deployed or validated.'], code: ['notebooks/00_Init_Enviroments.ipynb'] },
  ],
  workflowTitle: 'Data Process Step by Step',
  workflowIntro: 'The workflow follows the execution sequence documented in the scripts and notebooks. It is not presented as automatic orchestration.',
  workflow: [
    { title: 'Generate catalogs', file: 'generar_catalogos.py', description: 'Generates seven master catalogs—products, customers, categories, subcategories, suppliers, branches, and employees—and exports them as CSV files.' },
    { title: 'Generate incremental transactions', file: 'generar_transacciones.py', description: 'Reads catalogs and the incremental state, continues identifiers, and generates orders, details, invoices when applicable, and inventory movements. It writes timestamped CSV files and saves the updated state.' },
    { title: 'Transfer to ADLS Gen2', file: 'subir_a_adls.py', description: 'Uploads catalogs and transactions while preserving relative paths. After a successful upload, transaction files are archived locally.' },
    { title: 'Initialize environments', file: 'notebooks/00_Init_Enviroments.ipynb', description: 'Declares Unity Catalog catalogs for dev, test, and prod, each with Bronze, Silver, and Gold schemas. The env parameter directs processing.' },
    { title: 'Ingest into Bronze', file: 'notebooks/01_bronze_ingesta_autoloader.ipynb', description: 'Selects the environment, folder, and entities; Auto Loader reads CSV files, uses schema locations and checkpoints, and writes Delta with availableNow.' },
    { title: 'Transform and upsert into Silver', file: 'notebooks/02_silver_transformacion.ipynb', description: 'Cleans Bronze tables, normalizes text and dates, replaces null text values, removes duplicates, records fecha_carga_plata, and creates or updates tables through Delta MERGE.' },
    { title: 'Build Gold tables', file: 'notebooks/03_gold_reportes.ipynb', description: 'Joins Silver entities and creates gold_ventas_maestra, gold_movimientos_stock, and gold_compras_proveedores with analytical data and derived calculations.' },
  ],
  workflowNote: 'The scripts and notebooks document the processing steps, but the repository does not demonstrate automatic orchestration.',
  codeTitle: 'Data Lakehouse Implementation',
  codeExamples: [
    { layer: 'DATA GENERATION', file: 'generar_catalogos.py', title: 'Reproducible synthetic data', description: 'Faker uses the Mexican locale and fixed seeds. The snippets show customer generation, intentional input inconsistencies, and CSV export.', code: catalogCode, language: 'python', url: fileUrl('generar_catalogos.py'), supportingCode: [{ title: 'Synthetic generation and inconsistencies', code: clientCode, language: 'python' }, { title: 'CSV export', code: csvCode, language: 'python' }] },
    { layer: 'INCREMENTAL GENERATION', file: 'generar_transacciones.py', title: 'Continuing the state', description: 'The script restores stored identifiers, generates new transactions, and saves the state for the next run.', code: transactionCode, language: 'python', url: fileUrl('generar_transacciones.py'), supportingCode: [{ title: 'Incrementing order identifiers', code: transactionIdsCode, language: 'python' }] },
    { layer: 'BRONZE', file: 'notebooks/01_bronze_ingesta_autoloader.ipynb', title: 'Auto Loader ingestion', description: 'Faithful excerpt of notebook reads and writes. Physical paths are represented by generic variables; availableNow processes the available files.', code: bronzeCode, language: 'python', url: fileUrl('notebooks/01_bronze_ingesta_autoloader.ipynb') },
    { layer: 'SILVER', file: 'notebooks/02_silver_transformacion.ipynb', title: 'Deduplication and Delta MERGE', description: 'The initial load creates a table if it does not exist. Later runs update matching keys and insert new rows; this is not full CDC or SCD Type 2.', code: silverCode, language: 'python', url: fileUrl('notebooks/02_silver_transformacion.ipynb') },
    { layer: 'GOLD', file: 'notebooks/03_gold_reportes.ipynb', title: 'Integrated sales analytics', description: 'SQL excerpt joining orders and details with products, categories, customers, and employees, and calculating the line amount.', code: goldCode, language: 'sql', url: fileUrl('notebooks/03_gold_reportes.ipynb') },
  ],
  resultsTitle: 'Project Results',
  resultCards: [
    { title: 'Data coverage', description: 'These figures describe the structure configured in the scripts and notebooks; they are not measurements of successful runs in all three environments.', bullets: ['7 catalog entities', '4 transactional entities', '11 entities defined in Silver', '3 Medallion layers: Bronze, Silver, and Gold', '3 environments declared in configuration', '3 Gold analytical tables'] },
    { title: 'Analytical outputs', description: 'Gold tables integrate Silver entities to explore sales, inventory, and supplier operations.', bullets: ['gold_ventas_maestra', 'gold_movimientos_stock', 'gold_compras_proveedores'] },
    { title: 'Engineering capabilities', description: 'Capabilities present in the project scripts and notebooks.', bullets: ['Synthetic data sources and controlled inconsistencies', 'Incremental transaction generation', 'Auto Loader checkpoints by environment and entity', 'Reusable cleaning logic for multiple tables', 'Delta MERGE / Upsert', 'Logical isolation through Unity Catalog catalogs', 'Load timestamp traceability'] },
  ],
  domainsTitle: 'Analytical outputs',
  domains: [
    { title: 'Sales · gold_ventas_maestra', description: 'Combines orders, details, products, customers, and employees with time attributes.', bullets: ['Order and detail', 'Sale date and year, month, week, and day fields', 'Customer and employee', 'Product, category, and subcategory', 'Quantity and unit price', 'Line amount', 'Which products generate more revenue?', 'How are sales distributed by category?', 'The shown output does not explicitly include a branch.'] },
    { title: 'Inventory · gold_movimientos_stock', description: 'Relates inventory movements to product information and category hierarchy.', bullets: ['Movement and date', 'Movement type', 'Product, category, and subcategory', 'Quantity', 'How are inventory movements distributed?', 'Which products have more movements?', 'Which movement types are most common?'] },
    { title: 'Suppliers · gold_compras_proveedores', description: 'Relates suppliers to products and margin calculations.', bullets: ['Supplier and credit days', 'Product, SKU, brand, and category', 'Purchase and sale prices', 'Profit and percentage margins', 'Which suppliers participate?', 'What is the margin by product?', 'How are margins distributed across categories?'] },
  ],
  limitationsTitle: 'Current scope',
  limitations: ['The flow is documented in scripts and notebooks; end-to-end orchestration is not claimed.', 'The complete process is not presented as CI/CD or automated.', 'SCD Type 2, full CDC, quarantine, and an automated Data Quality framework are not implemented.', 'The three environments and permissions are declared in a notebook; deployment and verification are not claimed.', 'Figures describe code structure, not data volume or successful executions.', 'A completed Power BI dashboard is not claimed.'],
  roadmapTitle: 'Future improvements',
  roadmap: ['Orchestrate the complete execution.', 'Automate data generation and file delivery.', 'Improve resilience to repeated files.', 'Automate key and relationship validation.', 'Add Data Quality rules with acceptance metrics.', 'Quarantine invalid records.', 'Add end-to-end load and transformation auditing.', 'Monitor executions.', 'Add unit and integration tests.', 'Add CI/CD promotion between environments.', 'Implement SCD Type 2 for historical dimensions.', 'Build a Power BI dashboard connected to Gold.'],
  repositoryUrl: `${repository}/tree/master/${projectPath}`,
  repositoryLinkLabel: 'View project repository on GitHub',
  languageSwitchLabel: 'Cambiar idioma a español',
  projectNavigationLabel: 'Project navigation',
  footer: 'Made with care by Carlos Martinez',
};

export const ferreteriaProjectCopy: Record<ProjectLocale, OlistProjectCopy> = { es, en };
