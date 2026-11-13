/* Escenario ficticio. Las referencias normativas requieren validación con copia autorizada. */
window.SGI_SEED = {
  sites: [
    { id: "norte", name: "Planta Norte" },
    { id: "sur", name: "Centro Sur" }
  ],
  processes: [
    { id: "documental", name: "Gestión documental", site: "norte", owner: "Camila Rojas" },
    { id: "produccion", name: "Control de producción", site: "norte", owner: "Diego Méndez" },
    { id: "ambiente", name: "Gestión ambiental", site: "norte", owner: "Sofía Paredes" },
    { id: "sst", name: "Seguridad y salud", site: "norte", owner: "Valentina Ortiz" },
    { id: "emergencias", name: "Preparación ante emergencias", site: "sur", owner: "Gabriel Ruiz" },
    { id: "auditoria", name: "Auditoría interna", site: "sur", owner: "Lucía Torres" }
  ],
  requirements: [
    {
      id: "REQ-01", standard: "ISO 9001", edition: "2026", clause: "7.5",
      title: "Información documentada",
      description: "¿Cómo se identifica la revisión que se debe usar y se conserva la versión anterior?",
      keywords: ["documentos", "control documental", "vigencia", "historial", "procedimiento", "versiones"],
      process: "documental", control: "Revisión y aprobación antes de publicar", indicator: "Documentos revisados dentro del plazo",
      owner: "Camila Rojas", site: "norte", evidence: ["DOC-01"],
      source: "https://www.iso.org/standard/9001",
      applicability: "Aplicable en el escenario ficticio de Planta Norte. Referencia ilustrativa pendiente de contraste con la edición autorizada."
    },
    {
      id: "REQ-02", standard: "ISO 9001", edition: "2026", clause: "8.7",
      title: "Tratamiento de salidas no conformes",
      description: "¿Cómo se evita que un lote observado se libere antes de evaluar su condición?",
      keywords: ["producción", "calidad", "lote", "rechazo", "producto", "reprocesos", "segregación"],
      process: "produccion", control: "Segregación y autorización de disposición del lote", indicator: "Unidades reprocesadas por cada 100",
      owner: "Diego Méndez", site: "norte", evidence: ["DOC-02"],
      source: "https://www.iso.org/standard/9001",
      applicability: "Aplicable en el escenario ficticio a lotes de Planta Norte. Referencia ilustrativa pendiente de contraste con la edición autorizada."
    },
    {
      id: "REQ-03", standard: "ISO 9001", edition: "2026", clause: "9.2",
      title: "Auditoría interna",
      description: "¿Dónde se registra el alcance, el criterio y la evidencia examinada durante una auditoría?",
      keywords: ["auditoría", "programa", "muestreo", "hallazgo", "evaluación"],
      process: "auditoria", control: "Programa y revisión de resultados de auditoría", indicator: "Auditorías realizadas frente al programa",
      owner: "Lucía Torres", site: "sur", evidence: ["DOC-07"],
      source: "https://www.iso.org/standard/9001",
      applicability: "Aplicable en el escenario ficticio a las auditorías internas de Centro Sur. Referencia ilustrativa pendiente de contraste con la edición autorizada."
    },
    {
      id: "REQ-04", standard: "ISO 14001", edition: "2026", clause: "6.1.2",
      title: "Aspectos e impactos ambientales",
      description: "¿Qué aspectos se identificaron en el proceso y cómo se evaluó su importancia?",
      keywords: ["ambiente", "impacto", "aspectos", "residuos", "consumo", "matriz"],
      process: "ambiente", control: "Reevaluación de aspectos ante cambios operativos", indicator: "Aspectos revisados en el periodo",
      owner: "Sofía Paredes", site: "norte", evidence: ["DOC-03"],
      source: "https://www.iso.org/standard/14001",
      applicability: "Aplicable en el escenario ficticio al proceso ambiental de Planta Norte. Referencia ilustrativa pendiente de contraste con la edición autorizada."
    },
    {
      id: "REQ-05", standard: "ISO 14001", edition: "2026", clause: "8.1",
      title: "Controles ambientales en la operación",
      description: "¿Qué evidencia muestra que los residuos se separaron y se controló su almacenamiento?",
      keywords: ["ambiente", "residuos", "desechos", "segregación", "almacenamiento", "inspección", "desperdicios"],
      process: "ambiente", control: "Inspección de puntos de acopio y registro de peso", indicator: "Kilogramos de desperdicio por cada 100 unidades",
      owner: "Sofía Paredes", site: "norte", evidence: ["DOC-04", "DOC-08"],
      source: "https://www.iso.org/standard/14001",
      applicability: "Aplicable en el escenario ficticio a los puntos de acopio de Planta Norte. Referencia ilustrativa pendiente de contraste con la edición autorizada."
    },
    {
      id: "REQ-06", standard: "ISO 45001", edition: "2018", clause: "8.1.2",
      title: "Controles para reducir el riesgo en tareas críticas",
      description: "¿Cómo se comprueba el aislamiento de energías antes de una intervención de mantenimiento?",
      keywords: ["seguridad", "sst", "peligro", "riesgo", "energía", "bloqueo", "mantenimiento"],
      process: "sst", control: "Verificación de bloqueo y energía cero", indicator: "Intervenciones verificadas antes de iniciar",
      owner: "Valentina Ortiz", site: "norte", evidence: ["DOC-05"],
      source: "https://www.iso.org/standard/45001",
      applicability: "Aplicable en el escenario ficticio a mantenimiento en Planta Norte. Referencia ilustrativa pendiente de contraste con la edición autorizada y su enmienda aplicable."
    },
    {
      id: "REQ-07", standard: "ISO 45001", edition: "2018", clause: "8.2",
      title: "Preparación y respuesta ante emergencias",
      description: "¿Qué registro muestra cuándo se ensayó la evacuación y qué aspectos quedaron por corregir?",
      keywords: ["emergencias", "evacuación", "simulacro", "brigada", "seguridad", "sst"],
      process: "emergencias", control: "Simulacro y revisión de la respuesta", indicator: "Simulacros con acta revisada",
      owner: "Gabriel Ruiz", site: "sur", evidence: [],
      source: "https://www.iso.org/standard/45001",
      applicability: "Aplicable en el escenario ficticio a Centro Sur. El acta del periodo falta. Referencia ilustrativa pendiente de contraste con la edición autorizada y su enmienda aplicable."
    }
  ],
  documents: [
    {
      id: "DOC-01", title: "Procedimiento de control documental", type: "Procedimiento",
      process: "documental", site: "norte", owner: "Camila Rojas",
      versions: [
        {
          version: "2.1", date: "2026-10-20", uploaded: "2026-10-21", status: "Vigente", by: "Lucía Torres",
          notes: "Revisión aprobada. Se incorporó confirmación de recepción de cambios en campo.",
          content: "Procedimiento interno PR-SGI-01 · Revisión 2.1\n\nLa persona responsable propone el cambio y documenta su motivo. Coordinación SGI valida y aprueba la revisión. Al publicarla, retira la versión anterior de las vistas operativas y conserva el historial.\n\nPara cambios que afectan a campo se registra la recepción por cada responsable de turno."
        },
        {
          version: "2.0", date: "2026-07-13", uploaded: "2026-07-15", status: "Histórica", by: "Lucía Torres",
          notes: "Sustituida por la revisión 2.1.",
          content: "Procedimiento interno PR-SGI-01 · Revisión 2.0\n\nCoordinación SGI valida los cambios, publica la nueva versión y archiva la revisión sustituida. La jefatura de turno recibe el aviso de publicación por el canal interno."
        }
      ]
    },
    {
      id: "DOC-02", title: "Registro de segregación de lote L-104", type: "Registro",
      process: "produccion", site: "norte", owner: "Diego Méndez",
      versions: [
        {
          version: "1.0", date: "2026-10-14", uploaded: "2026-10-15", status: "Vigente", by: "Diego Méndez",
          notes: "Registro verificado para el lote indicado.",
          content: "Lote L-104 · Línea 2 · Turno mañana\n\nSe inmovilizaron 14 piezas con variación dimensional en el punto de cuarentena. Producción registró el bloqueo y Calidad autorizó revisar el material antes de cualquier liberación.\n\nEste registro cubre un lote de la muestra."
        }
      ]
    },
    {
      id: "DOC-03", title: "Matriz de aspectos ambientales", type: "Matriz",
      process: "ambiente", site: "norte", owner: "Sofía Paredes",
      versions: [
        {
          version: "3.0", date: "2026-09-22", uploaded: "2026-09-23", status: "Vigente", by: "Sofía Paredes",
          notes: "Revisión de la zona de almacenamiento y de los residuos de embalaje.",
          content: "Planta Norte · Producción y almacenamiento\n\nAspecto observado: recortes y embalajes de producción. Impacto considerado: incremento de material enviado a disposición. Criterios internos: frecuencia, magnitud y posibilidad de control.\n\nControles asignados: puntos diferenciados de acopio, inspección y registro de peso."
        }
      ]
    },
    {
      id: "DOC-04", title: "Inspección de puntos de acopio", type: "Inspección",
      process: "ambiente", site: "norte", owner: "Sofía Paredes",
      versions: [
        {
          version: "1.1", date: "2026-10-26", uploaded: "2026-10-27", status: "Vigente", by: "Sofía Paredes",
          notes: "Se incorporó la revisión de identificación visible del contenedor A-03.",
          content: "Inspección de acopio · Planta Norte · 26 de octubre de 2026\n\nSe verificaron tres puntos. A-01 y A-02 contaban con separación e identificación visible. A-03 requirió sustituir el rótulo deteriorado. El encargado del área registró el cambio en la misma jornada.\n\nLa muestra corresponde a la zona de producción."
        },
        {
          version: "1.0", date: "2026-10-26", uploaded: "2026-10-26", status: "Histórica", by: "Sofía Paredes",
          notes: "Captura original antes de incorporar la confirmación de reposición del rótulo.",
          content: "Inspección de acopio · Captura inicial\n\nA-01 y A-02 con identificación visible. A-03 con rótulo deteriorado. Se notificó al encargado de producción para verificar la reposición."
        }
      ]
    },
    {
      id: "DOC-05", title: "Verificación de aislamiento de energía", type: "Lista de verificación",
      process: "sst", site: "norte", owner: "Valentina Ortiz",
      versions: [
        {
          version: "1.0", date: "2026-10-28", uploaded: "2026-10-29", status: "Vigente", by: "Valentina Ortiz",
          notes: "Evidencia de una intervención de mantenimiento programada.",
          content: "Intervención MT-47 · Equipo mezclador 02\n\nEl equipo de mantenimiento registró las fuentes de energía, el aislamiento aplicado y la comprobación previa a la intervención. La responsable SST firmó la revisión al inicio del trabajo.\n\nEste registro no cubre intervenciones distintas de MT-47."
        }
      ]
    },
    {
      id: "DOC-06", title: "Plan de simulacro de Centro Sur", type: "Plan",
      process: "emergencias", site: "sur", owner: "Gabriel Ruiz",
      versions: [
        {
          version: "1.0", date: "2026-11-03", uploaded: "2026-11-04", status: "En revisión", by: "Gabriel Ruiz",
          notes: "Borrador sujeto a revisión por la brigada.",
          content: "Plan de simulacro · Centro Sur\n\nSe propone observar el tiempo de evacuación, verificar el conteo en el punto de encuentro y registrar las incidencias.\n\nEste plan describe la preparación. El acta de ejecución y la evaluación posterior deben registrarse tras el ejercicio."
        }
      ]
    },
    {
      id: "DOC-07", title: "Informe de auditoría interna de Centro Sur", type: "Informe",
      process: "auditoria", site: "sur", owner: "Lucía Torres",
      versions: [
        {
          version: "1.0", date: "2026-10-30", uploaded: "2026-10-31", status: "Vigente", by: "Lucía Torres",
          notes: "Informe emitido. El seguimiento de hallazgos se conserva en el módulo de acciones.",
          content: "Informe de auditoría · AUD-03 · Centro Sur\n\nMuestra: programa de auditorías del trimestre, registros de entrevistas y planificación del simulacro. Se identificó un acta de simulacro pendiente de completar.\n\nLa emisión del informe cierra la actividad de auditoría. El seguimiento del hallazgo continúa abierto."
        }
      ]
    },
    {
      id: "DOC-08", title: "Consolidado de peso de residuos", type: "Registro",
      process: "ambiente", site: "norte", owner: "Sofía Paredes",
      versions: [
        {
          version: "1.0", date: "2026-10-31", uploaded: "2026-11-02", status: "Vigente", by: "Sofía Paredes",
          notes: "Consolidado de mediciones internas de octubre.",
          content: "Consolidado ambiental · Planta Norte · Octubre de 2026\n\nSe registraron 120 kg de recortes y embalajes sobre 800 unidades de producción, equivalentes a 15 kg por cada 100 unidades. La serie de pesajes diarios fue contrastada con el volumen de producción del mismo periodo."
        }
      ]
    }
  ],
  tasks: [
    { id: "SEG-01", title: "Adjuntar el acta del simulacro", type: "Actividad interna", process: "emergencias", site: "sur", owner: "Gabriel Ruiz", days: -4, status: "Pendiente", evidence: "" },
    { id: "SEG-02", title: "Revisar segregación en el acopio", type: "Control interno", process: "ambiente", site: "norte", owner: "Sofía Paredes", days: 2, status: "En curso", evidence: "DOC-04" },
    { id: "SEG-03", title: "Conciliar el registro de pesos del mes", type: "Control interno", process: "ambiente", site: "norte", owner: "Sofía Paredes", days: 5, status: "Pendiente", evidence: "" },
    { id: "SEG-04", title: "Confirmar recepción del procedimiento en campo", type: "Actividad interna", process: "documental", site: "norte", owner: "Camila Rojas", days: 7, status: "En curso", evidence: "" },
    { id: "SEG-05", title: "Validar aislamiento en intervención MT-47", type: "Control interno", process: "sst", site: "norte", owner: "Valentina Ortiz", days: -11, status: "Completada", evidence: "DOC-05" },
    { id: "SEG-06", title: "Evaluar los aspectos ante cambios de proceso", type: "Actividad interna", process: "ambiente", site: "norte", owner: "Sofía Paredes", days: 16, status: "Pendiente", evidence: "" },
    { id: "SEG-07", title: "Emitir informe de auditoría interna", type: "Actividad interna", process: "auditoria", site: "sur", owner: "Lucía Torres", days: -12, status: "Completada", evidence: "DOC-07" }
  ],
  audits: [
    { id: "AUD-01", title: "Auditoría integrada de Planta Norte", type: "Interna", site: "norte", scope: "Gestión documental, ambiente y mantenimiento", owner: "Lucía Torres", days: 2, status: "En curso", criteria: ["REQ-01", "REQ-04", "REQ-05", "REQ-06"] },
    { id: "AUD-02", title: "Muestreo de control de lotes", type: "Interna", site: "norte", scope: "Producción, segregación y disposición de lotes", owner: "Camila Rojas", days: 12, status: "Programada", criteria: ["REQ-02"] },
    {
      id: "AUD-03", title: "Auditoría interna de Centro Sur", type: "Interna", site: "sur",
      scope: "Programa de auditoría y preparación ante emergencias", owner: "Lucía Torres",
      days: -13, dueDate: "2026-10-30", status: "Cerrada", criteria: ["REQ-03", "REQ-07"],
      sample: "Programa trimestral, registros de entrevistas y planificación del simulacro. Informe DOC-07, versión 1.0.",
      result: "El informe fue emitido. Quedó abierto el hallazgo HAL-02 por falta del acta de ejecución y de la evaluación del simulacro."
    }
  ],
  findings: [
    {
      id: "HAL-01", audit: "AUD-01", requirement: "REQ-05", title: "Identificación de contenedor A-03",
      observation: "La inspección del 26 de octubre encontró un rótulo deteriorado en el contenedor A-03.",
      classification: "No conformidad menor", cause: "La lista de inspección no indicaba cuándo sustituir un rótulo ilegible.",
      correction: "Sustituir el rótulo de A-03.", action: "Incluir un criterio de legibilidad en la revisión periódica y comunicarlo a los turnos.",
      owner: "Sofía Paredes", days: 4, stage: "Por verificar",
      criterion: "Tres inspecciones semanales consecutivas sin contenedores con rótulo ilegible.",
      execution: "Se sustituyó el rótulo y se comunicó el criterio. El cambio de rótulo consta en DOC-04, revisión 1.1.",
      executionDate: "2026-10-26", executionDocument: "DOC-04", executionDocumentVersion: "1.1",
      evidence: "DOC-04", evidenceVersion: "1.1",
      observationPeriod: "Tres semanas desde la ejecución",
      verification: "", verifier: "Lucía Torres",
      history: [
        { stage: "Abierto", date: "2026-10-26", actor: "Lucía Torres", note: "Hallazgo registrado a partir de la inspección de acopio." },
        { stage: "Por verificar", date: "2026-10-26", actor: "Sofía Paredes", note: "Acción ejecutada. Inicia el periodo de observación.", document: "DOC-04", version: "1.1" }
      ]
    },
    {
      id: "HAL-02", audit: "AUD-03", requirement: "REQ-07", title: "Acta de simulacro sin evidencia disponible",
      observation: "La muestra de Centro Sur contiene el plan de simulacro, pero el acta de ejecución y la evaluación posterior no están disponibles.",
      classification: "No conformidad menor", cause: "", correction: "",
      action: "Confirmar la realización del ejercicio y registrar evidencia con fecha, responsable y evaluación.",
      owner: "Gabriel Ruiz", days: -4, stage: "Abierto",
      criterion: "Acta revisada con observaciones, responsables y fecha del ejercicio, localizable durante la consulta de auditoría.",
      execution: "", verification: "", verifier: "Lucía Torres",
      history: [{ stage: "Abierto", date: "2026-10-30", actor: "Lucía Torres", note: "Hallazgo registrado al revisar la muestra de Centro Sur." }]
    },
    {
      id: "HAL-03", audit: "AUD-01", requirement: "REQ-01", title: "Confirmación de cambios en el turno de campo",
      observation: "En la muestra inicial faltaba confirmación de que un turno recibió el cambio documental.",
      classification: "Oportunidad de mejora", cause: "El aviso de publicación no incluía confirmación de recepción.",
      correction: "Confirmar con el turno que recibió la instrucción actualizada.",
      action: "Registrar la recepción de cambios que afecten el trabajo de campo.",
      owner: "Camila Rojas", days: 9, stage: "En ejecución",
      criterion: "Cada turno afectado confirma la recepción en las dos próximas revisiones aplicables.",
      execution: "", verification: "", verifier: "Lucía Torres"
    }
  ],
  metrics: [
    {
      id: "IND-01", title: "Reprocesos", unit: "%", baseline: 5.6, goal: 3, direction: "down",
      description: "Unidades reprocesadas por cada 100 unidades terminadas. Fuente del escenario: registros mensuales de producción.",
      values: [5.6, 5.1, 4.9, 4.4, 3.9, 3.4]
    },
    {
      id: "IND-02", title: "Desperdicio", unit: "kg / 100 u.", baseline: 22, goal: 14, direction: "down",
      description: "Kilogramos de recortes y embalajes por cada 100 unidades terminadas. Fuente del escenario: pesajes y producción del mismo periodo.",
      values: [22, 21, 19, 18, 17, 15]
    },
    {
      id: "IND-03", title: "Interrupciones", unit: "h / mes", baseline: 13, goal: 7, direction: "down",
      description: "Horas de interrupciones no planificadas durante el mes. Fuente del escenario: bitácora de operación.",
      values: [13, 11, 12, 10, 8, 7]
    },
    {
      id: "IND-04", title: "Tiempo para abrir evidencia", unit: "min", baseline: 18, goal: 4, direction: "down",
      description: "Mediana de minutos transcurridos entre la pregunta de auditoría y la apertura de una evidencia pertinente. Fuente del escenario: simulaciones mensuales.",
      values: [18, 14, 11, 9, 6, 4]
    }
  ]
};
