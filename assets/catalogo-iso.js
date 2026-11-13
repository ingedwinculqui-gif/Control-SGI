/* Índice de navegación de los capítulos 4 a 10. Las etiquetas son resúmenes editoriales. */
(() => {
  const chapter = (title, labels) => ({ title, clauses: Object.keys(labels), clauseTitles: labels });

  window.SGI_CATALOG = [
    {
      number: "9001",
      edition: "2026",
      name: "Calidad",
      subtitle: "Sistema de gestión de la calidad",
      icon: "award",
      source: "https://www.iso.org/standard/9001",
      indexSource: "https://cdn.standards.iteh.ai/samples/iso/iso-9001-2026/fcc8a937d6bf42e1a47101de14d8fe6b/iso-9001-2026.pdf",
      chapters: {
        "4": chapter("Contexto de la organización", {
          "4.1": "Entorno y condiciones de la organización", "4.2": "Necesidades de las partes interesadas",
          "4.3": "Alcance del sistema de calidad", "4.4": "Sistema de calidad y sus procesos"
        }),
        "5": chapter("Liderazgo", {
          "5.1": "Compromiso de la dirección", "5.1.1": "Responsabilidad de la dirección",
          "5.1.2": "Enfoque en el cliente", "5.2": "Política de calidad", "5.3": "Asignación de funciones y autoridad"
        }),
        "6": chapter("Planificación", {
          "6.1": "Gestión de riesgos y oportunidades", "6.1.1": "Identificación de riesgos y oportunidades",
          "6.1.2": "Tratamiento de riesgos", "6.1.3": "Aprovechamiento de oportunidades",
          "6.2": "Objetivos de calidad y planes", "6.3": "Cambios planificados"
        }),
        "7": chapter("Apoyo", {
          "7.1": "Recursos del sistema", "7.1.1": "Recursos necesarios", "7.1.2": "Personal",
          "7.1.3": "Infraestructura de trabajo", "7.1.4": "Condiciones para operar",
          "7.1.5": "Medios de seguimiento y medición", "7.1.6": "Conocimiento de la organización",
          "7.2": "Competencias del personal", "7.3": "Conciencia sobre la calidad", "7.4": "Comunicaciones",
          "7.5": "Información documentada", "7.5.1": "Documentación del sistema",
          "7.5.2": "Elaboración y revisión de documentos", "7.5.3": "Control de documentos y registros"
        }),
        "8": chapter("Operación", {
          "8.1": "Controles para planificar y operar", "8.2": "Requisitos de productos y servicios",
          "8.2.1": "Interacción con clientes", "8.2.2": "Identificación de requisitos",
          "8.2.3": "Revisión previa de requisitos", "8.2.4": "Cambios a los requisitos acordados",
          "8.3": "Diseño y desarrollo", "8.3.1": "Proceso de diseño", "8.3.2": "Plan del diseño",
          "8.3.3": "Datos de entrada para el diseño", "8.3.4": "Verificación y control del diseño",
          "8.3.5": "Entregables del diseño", "8.3.6": "Modificaciones del diseño",
          "8.4": "Suministro externo", "8.4.1": "Gestión de proveedores externos", "8.4.2": "Alcance del control externo",
          "8.4.3": "Instrucciones a proveedores", "8.5": "Producción y prestación del servicio",
          "8.5.1": "Condiciones controladas de producción y servicio", "8.5.2": "Identificación y trazabilidad",
          "8.5.3": "Bienes de clientes y proveedores", "8.5.4": "Preservación de las salidas",
          "8.5.5": "Seguimiento después de la entrega", "8.5.6": "Cambios de producción o servicio",
          "8.6": "Autorización de la entrega", "8.7": "Tratamiento de salidas no conformes"
        }),
        "9": chapter("Evaluación del desempeño", {
          "9.1": "Medición y evaluación de resultados", "9.1.1": "Plan de seguimiento",
          "9.1.2": "Percepción del cliente", "9.1.3": "Análisis de resultados", "9.2": "Auditoría interna",
          "9.2.1": "Ejecución de auditorías", "9.2.2": "Programación de auditorías",
          "9.3": "Revisión de la dirección", "9.3.1": "Revisión del sistema",
          "9.3.2": "Información para la revisión", "9.3.3": "Decisiones de la revisión"
        }),
        "10": chapter("Mejora", {
          "10.1": "Mejora continua del sistema", "10.2": "No conformidades y corrección de sus causas"
        })
      }
    },
    {
      number: "14001",
      edition: "2026",
      name: "Medio Ambiente",
      subtitle: "Sistema de gestión ambiental",
      icon: "leaf",
      source: "https://www.iso.org/standard/14001",
      indexSource: "https://cdn.standards.iteh.ai/samples/iso/iso-14001-2026/9fc2e01750dc48af88aee0e06c487c2b/iso-14001-2026.pdf",
      chapters: {
        "4": chapter("Contexto de la organización", {
          "4.1": "Entorno y condiciones ambientales", "4.2": "Necesidades de las partes interesadas",
          "4.3": "Alcance del sistema ambiental", "4.4": "Sistema de gestión ambiental"
        }),
        "5": chapter("Liderazgo", {
          "5.1": "Compromiso de la dirección", "5.2": "Política ambiental", "5.3": "Asignación de funciones y autoridad"
        }),
        "6": chapter("Planificación", {
          "6.1": "Gestión de riesgos y oportunidades", "6.1.1": "Preparación de la planificación",
          "6.1.2": "Aspectos e impactos ambientales", "6.1.3": "Obligaciones de cumplimiento",
          "6.1.4": "Determinación de riesgos y oportunidades", "6.1.5": "Acciones planificadas",
          "6.2": "Objetivos y planes ambientales", "6.2.1": "Definición de objetivos",
          "6.2.2": "Planes para alcanzar los objetivos", "6.3": "Cambios planificados"
        }),
        "7": chapter("Apoyo", {
          "7.1": "Recursos del sistema", "7.2": "Competencias del personal", "7.3": "Conciencia ambiental",
          "7.4": "Comunicaciones", "7.4.1": "Gestión de la comunicación", "7.4.2": "Intercambio de información interna",
          "7.4.3": "Intercambio de información externa", "7.5": "Información documentada",
          "7.5.1": "Documentación del sistema", "7.5.2": "Elaboración y revisión de documentos", "7.5.3": "Control de documentos y registros"
        }),
        "8": chapter("Operación", {
          "8.1": "Controles ambientales en la operación", "8.2": "Preparación y respuesta ante emergencias"
        }),
        "9": chapter("Evaluación del desempeño", {
          "9.1": "Medición y evaluación de resultados", "9.1.1": "Plan de seguimiento",
          "9.1.2": "Evaluación de obligaciones aplicables", "9.2": "Auditoría interna",
          "9.2.1": "Ejecución de auditorías", "9.2.2": "Programación de auditorías",
          "9.3": "Revisión de la dirección", "9.3.1": "Revisión del sistema",
          "9.3.2": "Información para la revisión", "9.3.3": "Decisiones de la revisión"
        }),
        "10": chapter("Mejora", {
          "10.1": "Mejora continua del sistema", "10.2": "No conformidades y corrección de sus causas"
        })
      }
    },
    {
      number: "45001",
      edition: "2018",
      amendment: "Amd 1:2024",
      amendmentSource: "https://www.iso.org/standard/88428.html",
      name: "Seguridad y Salud en el Trabajo",
      subtitle: "Sistema de gestión de seguridad y salud en el trabajo",
      icon: "helmet",
      source: "https://www.iso.org/standard/45001",
      indexSource: "https://cdn.standards.iteh.ai/samples/63787/d11ebcad88d1415cb6c60ded136e0e03/ISO-45001-2018.pdf",
      supplementalIndexSource: "https://committee.iso.org/sites/tc283/home/projects/published/published/faq.html",
      chapters: {
        "4": chapter("Contexto de la organización", {
          "4.1": "Entorno y condiciones de la organización", "4.2": "Necesidades de trabajadores y otras partes",
          "4.3": "Alcance del sistema de SST", "4.4": "Sistema de gestión de SST"
        }),
        "5": chapter("Liderazgo y participación", {
          "5.1": "Compromiso de la dirección", "5.2": "Política de SST", "5.3": "Asignación de funciones y autoridad",
          "5.4": "Consulta y participación de trabajadores"
        }),
        "6": chapter("Planificación", {
          "6.1": "Gestión de riesgos y oportunidades", "6.1.1": "Preparación de la planificación",
          "6.1.2": "Peligros, riesgos y oportunidades", "6.1.2.1": "Identificación de peligros",
          "6.1.2.2": "Evaluación de riesgos de SST y del sistema", "6.1.2.3": "Evaluación de oportunidades de SST y del sistema",
          "6.1.3": "Requisitos legales y otros compromisos", "6.1.4": "Acciones planificadas",
          "6.2": "Objetivos y planes de SST", "6.2.1": "Definición de objetivos", "6.2.2": "Planes para alcanzar los objetivos"
        }),
        "7": chapter("Apoyo", {
          "7.1": "Recursos del sistema", "7.2": "Competencias del personal", "7.3": "Conciencia sobre SST",
          "7.4": "Comunicaciones", "7.4.1": "Gestión de la comunicación", "7.4.2": "Intercambio de información interna",
          "7.4.3": "Intercambio de información externa", "7.5": "Información documentada",
          "7.5.1": "Documentación del sistema", "7.5.2": "Elaboración y revisión de documentos", "7.5.3": "Control de documentos y registros"
        }),
        "8": chapter("Operación", {
          "8.1": "Controles para planificar y operar", "8.1.1": "Aplicación de controles operativos",
          "8.1.2": "Eliminación de peligros y reducción del riesgo", "8.1.3": "Control de cambios",
          "8.1.4": "Adquisición de bienes y servicios", "8.1.4.1": "Compras con criterios de SST",
          "8.1.4.2": "Gestión de contratistas", "8.1.4.3": "Control de procesos externalizados",
          "8.2": "Preparación y respuesta ante emergencias"
        }),
        "9": chapter("Evaluación del desempeño", {
          "9.1": "Medición y evaluación de resultados", "9.1.1": "Plan de seguimiento",
          "9.1.2": "Evaluación de obligaciones aplicables", "9.2": "Auditoría interna",
          "9.2.1": "Ejecución de auditorías", "9.2.2": "Programación de auditorías", "9.3": "Revisión de la dirección"
        }),
        "10": chapter("Mejora", {
          "10.1": "Oportunidades de mejora", "10.2": "Incidentes, no conformidades y acciones correctivas",
          "10.3": "Mejora continua del sistema"
        })
      }
    },
    {
      number: "37001",
      edition: "2025",
      name: "Antisoborno",
      subtitle: "Sistema de gestión antisoborno",
      icon: "shield",
      source: "https://www.iso.org/standard/37001",
      indexSource: "https://cdn.standards.iteh.ai/samples/85816/d19d9b16e3f2479ab6e21c58d374e268/ISO-37001-2025.pdf",
      chapters: {
        "4": chapter("Contexto de la organización", {
          "4.1": "Entorno y condiciones de la organización", "4.2": "Necesidades de las partes interesadas",
          "4.3": "Alcance del sistema antisoborno", "4.4": "Sistema de gestión antisoborno", "4.5": "Evaluación del riesgo de soborno"
        }),
        "5": chapter("Liderazgo", {
          "5.1": "Compromiso institucional", "5.1.1": "Órgano de gobierno", "5.1.2": "Responsabilidad de la alta dirección",
          "5.1.3": "Cultura de prevención del soborno", "5.2": "Política antisoborno", "5.3": "Asignación de funciones y autoridad",
          "5.3.1": "Responsabilidades de gestión", "5.3.2": "Función antisoborno", "5.3.3": "Delegación de decisiones"
        }),
        "6": chapter("Planificación", {
          "6.1": "Gestión de riesgos y oportunidades", "6.2": "Objetivos y planes antisoborno", "6.3": "Cambios planificados"
        }),
        "7": chapter("Apoyo", {
          "7.1": "Recursos del sistema", "7.2": "Competencias", "7.2.1": "Competencias necesarias", "7.2.2": "Proceso de empleo",
          "7.3": "Conciencia sobre el soborno", "7.3.1": "Sensibilización del personal", "7.3.2": "Capacitación del personal",
          "7.3.3": "Capacitación de socios de negocio", "7.3.4": "Programas de sensibilización y capacitación",
          "7.4": "Comunicaciones", "7.5": "Información documentada", "7.5.1": "Documentación del sistema",
          "7.5.2": "Elaboración y revisión de documentos", "7.5.3": "Control de documentos y registros"
        }),
        "8": chapter("Operación", {
          "8.1": "Controles para planificar y operar", "8.2": "Debida diligencia", "8.3": "Controles financieros",
          "8.4": "Controles no financieros", "8.5": "Controles de entidades vinculadas y socios",
          "8.6": "Compromisos de prevención del soborno", "8.7": "Regalos, hospitalidad, donaciones y beneficios",
          "8.8": "Respuesta ante controles insuficientes", "8.9": "Canales para comunicar inquietudes",
          "8.10": "Investigación y respuesta al soborno"
        }),
        "9": chapter("Evaluación del desempeño", {
          "9.1": "Medición y evaluación de resultados", "9.2": "Auditoría interna", "9.2.1": "Ejecución de auditorías",
          "9.2.2": "Programación de auditorías", "9.2.3": "Procedimientos y controles de auditoría",
          "9.2.4": "Independencia de la evaluación", "9.3": "Revisión de la dirección", "9.3.1": "Revisión del sistema",
          "9.3.2": "Información para la revisión", "9.3.3": "Decisiones de la revisión", "9.4": "Revisión por la función antisoborno"
        }),
        "10": chapter("Mejora", {
          "10.1": "Mejora continua del sistema", "10.2": "No conformidades y corrección de sus causas"
        })
      }
    }
  ];
})();
