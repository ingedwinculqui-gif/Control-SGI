(() => {
  "use strict";

  const phases = [
    { id: "planificar", label: "Planificar", icon: "target", chapters: ["4", "5", "6"] },
    { id: "hacer", label: "Hacer", icon: "file", chapters: ["7", "8"] },
    { id: "verificar", label: "Verificar", icon: "check-circle", chapters: ["9"] },
    { id: "actuar", label: "Actuar", icon: "cycle", chapters: ["10"] }
  ];

  const access = [
    { id: "documentos", label: "Información documentada", icon: "file" },
    { id: "evidencias", label: "Evidencias / Registros", icon: "folder" },
    { id: "responsables", label: "Responsables", icon: "people" },
    { id: "actividades", label: "Actividades / Plan", icon: "calendar" },
    { id: "indicadores", label: "Indicadores y seguimiento", icon: "chart" },
    { id: "evaluacion", label: "Evaluación del cumplimiento", icon: "check-circle" },
    { id: "mejora", label: "Acciones de mejora", icon: "target" },
    { id: "opciones", label: "Más opciones", icon: "more" }
  ];

  function home(ctx, catalog) {
    return `
      <div class="standards-home">
        ${ctx.heading({
          eyebrow: "Control SGI",
          title: "Normas del sistema",
          description: "Selecciona la norma que deseas gestionar.",
          actions: ctx.button("Resumen general", "index.html?vista=resumen", { symbol: "chart" })
        })}
        <div class="standard-cards">
          ${catalog.map(standard => `
            <a class="standard-card" href="${ctx.esc(ctx.linkTo("index", { norma: standard.number }))}">
              <span class="standard-card-icon">${ctx.icon(standard.icon)}</span>
              <div class="standard-card-copy">
                <strong>ISO ${ctx.esc(standard.number)}</strong>
                <h2>${ctx.esc(standard.name)}</h2>
                <span class="standard-edition">Edición ${ctx.esc(standard.edition)}</span>
              </div>
              <span class="standard-card-arrow">${ctx.icon("arrow-right")}</span>
            </a>`).join("")}
        </div>
        <section class="card audit-entry" aria-labelledby="audit-entry-title">
          <div class="audit-entry-copy">
            <h2 id="audit-entry-title">Consulta de auditoría</h2>
            <p>Busca un requisito y abre el control y la evidencia vinculados.</p>
          </div>
          <form class="audit-entry-search" action="requisitos.html" method="get" role="search" aria-label="Consulta de auditoría">
            <label class="sr-only" for="home-query">Pregunta, cláusula o palabra clave</label>
            <input class="input" id="home-query" name="q" placeholder="Ej. Control de residuos" required>
            <button class="button button-primary" type="submit">Buscar ${ctx.icon("arrow-right")}</button>
          </form>
        </section>
      </div>`;
  }

  function viewLink(ctx, standard, params = {}, fragment = "") {
    return ctx.esc(ctx.linkTo("index", { norma: standard.number, ...params }) + fragment);
  }

  function selection(ctx, standard) {
    const requestedClause = ctx.query.get("clausula");
    const clauseChapter = requestedClause?.split(".")[0];
    const requestedPhase = phases.find(item => item.id === ctx.query.get("etapa"));
    const requestedChapter = ctx.query.get("capitulo");
    const chapter = Object.hasOwn(standard.chapters, requestedChapter) ? requestedChapter
      : standard.chapters[clauseChapter]?.clauses?.includes(requestedClause) ? clauseChapter
      : (requestedPhase?.chapters.find(id => standard.chapters[id]) || Object.keys(standard.chapters)[0]);
    const phase = phases.find(item => item.chapters.includes(chapter));
    const clauses = standard.chapters[chapter].clauses;
    const clause = clauses.includes(requestedClause) ? requestedClause : clauses[0];
    const records = ctx.state.requirements.filter(req => req.standard === `ISO ${standard.number}` && req.edition === standard.edition);
    const choices = records.filter(req => req.clause === clause);
    const record = choices.find(req => req.id === ctx.query.get("ficha")) || choices[0];
    const panel = access.find(item => item.id === ctx.query.get("panel"))?.id;
    return { chapter, phase, clause, clauses, records, choices, record, panel };
  }

  function cycle(ctx, standard, current) {
    return `
      <nav class="phva-cycle" aria-label="Ciclo PHVA">
        ${phases.map(phase => `
          <a class="phva-sector phva-${phase.id}" href="${viewLink(ctx, standard, { etapa: phase.id }, "#capitulos")}"
            ${phase === current.phase ? 'aria-current="true"' : ""}>
            ${ctx.icon(phase.icon)}<span class="phva-label">${phase.label}</span>
          </a>`).join("")}
        <div class="phva-center"><strong>PHVA</strong><small>Mejora continua</small></div>
      </nav>
      <nav class="card chapter-card" id="capitulos" tabindex="-1" aria-label="Capítulos de ${current.phase.label}">
        <h2 class="chapter-header">${ctx.icon("list")} Capítulos de ${current.phase.label}</h2>
        ${current.phase.chapters.filter(id => standard.chapters[id]).map(id => `
          <a class="chapter-link" href="${viewLink(ctx, standard, { capitulo: id }, "#capitulo")}"
            ${id === current.chapter ? 'aria-current="true"' : ""}>
            <span class="chapter-number">${id}</span><span>${ctx.esc(standard.chapters[id].title)}</span>${ctx.icon("chevron")}
          </a>`).join("")}
      </nav>`;
  }

  function clauseNavigation(ctx, standard, current) {
    const chosen = current.clause?.split(".") || [];
    const rows = [];
    for (let depth = 2; depth <= Math.max(2, chosen.length + 1); depth++) {
      const parent = depth === 2 ? current.chapter : chosen.slice(0, depth - 1).join(".");
      const group = current.clauses.filter(value => value.split(".").length === depth && value.startsWith(parent + "."));
      if (!group.length) continue;
      const branch = chosen.slice(0, depth).join(".");
      rows.push(`
        <nav class="clause-scroll" aria-label="${depth === 2 ? "Cláusulas del capítulo" : `Subcláusulas de ${ctx.esc(parent)}`}">
          <div class="clause-list">
            ${group.map(value => `
              <a class="clause-link" href="${viewLink(ctx, standard, { clausula: value }, "#capitulo")}"
                aria-label="Cláusula ${ctx.esc(value)}"${value === branch ? ' aria-current="true"' : ""}>${ctx.esc(value)}</a>`).join("")}
          </div>
        </nav>`);
    }
    return rows.join("");
  }

  function documentTable(ctx, record) {
    const documents = record?.evidence.map(id => ctx.state.documents.find(doc => doc.id === id)).filter(Boolean) || [];
    return `
      <section class="card associated-documents" id="documentos-asociados" tabindex="-1" aria-labelledby="associated-title">
        <header class="associated-header">
          <h2 id="associated-title">${ctx.icon("folder")} Documentos asociados${documents.length ? ` <span>(${documents.length})</span>` : ""}</h2>
          ${record ? ctx.button("Vincular documento", ctx.linkTo("requisitos", { id: record.id }) + "#evidencias", { symbol: "plus" }) : ""}
        </header>
        ${documents.length ? `<p class="table-scroll-hint">Desliza la tabla para ver todas las columnas. ${ctx.icon("arrow-right")}</p>` : ""}
        <div class="table-wrap" tabindex="0" role="region" aria-label="Tabla desplazable de documentos asociados">
          <table>
            <thead><tr><th scope="col">Documento</th><th scope="col">Código</th><th scope="col">Versión</th>
              <th scope="col">Fecha</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>
            <tbody>
              ${documents.map(doc => {
                const version = ctx.latestVersion(doc) || doc.versions[0];
                const link = ctx.linkTo("documentos", { id: doc.id, ...(version ? { v: version.version } : {}), desde: record.id });
                const tone = version?.status === "Vigente" ? "success" : "warning";
                return `<tr><td><strong>${ctx.esc(doc.title)}</strong></td><td>${ctx.esc(doc.id)}</td>
                  <td>${ctx.esc(version?.version || "—")}</td><td>${version ? ctx.date(version.date) : "—"}</td>
                  <td>${ctx.badge(version?.status || "Sin versión", tone)}</td>
                  <td><div class="document-actions">
                    <a class="text-link" href="${ctx.esc(link)}" aria-label="Abrir ${ctx.esc(doc.title)}">${ctx.icon("file")} Abrir</a>
                    <a class="text-link" href="${ctx.esc(link)}#historial" aria-label="Historial de ${ctx.esc(doc.title)}">${ctx.icon("history")} Historial</a>
                  </div></td></tr>`;
              }).join("") || `<tr><td class="standard-empty" colspan="6">${record ? "Sin documentos vinculados a esta ficha." : "Configura la ficha SGI para asociar documentos."}</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>`;
  }

  function recordLinks(ctx, entries, page, empty) {
    if (!entries.length) return `<p class="muted">${empty}</p>`;
    return `<ul class="context-links">${entries.map(entry =>
      `<li><a class="text-link" href="${ctx.esc(ctx.linkTo(page, { id: entry.id }))}">${ctx.esc(entry.title)}</a></li>`).join("")}</ul>`;
  }

  function contextBody(ctx, standard, current) {
    const { record, panel } = current;
    if (panel === "opciones") {
      return `
        ${record ? ctx.button("Ver ficha y control", ctx.linkTo("requisitos", { id: record.id }), { symbol: "shield" }) : ""}
        ${ctx.button("Consultar matriz SGI", ctx.linkTo("requisitos", { norma: `ISO ${standard.number}` }), { symbol: "list" })}
        <a class="text-link" href="${ctx.esc(standard.source)}" target="_blank" rel="noopener noreferrer">Catálogo oficial ISO ${ctx.icon("external")}</a>`;
    }
    if (!record) return '<p class="muted">Esta cláusula aún no tiene una ficha SGI configurada.</p>';
    switch (panel) {
      case "evidencias":
        return `${ctx.button("Consultar evidencias y registros", ctx.linkTo("requisitos", { id: record.id }) + "#evidencias", { symbol: "folder" })}
          ${ctx.button("Ver documentos asociados", "#documentos-asociados", { symbol: "file" })}`;
      case "responsables":
        return `<dl class="detail-list">
          <div><dt>Responsable</dt><dd>${ctx.esc(record.owner)}</dd></div>
          <div><dt>Sede</dt><dd>${ctx.esc(ctx.siteName(record.site))}</dd></div>
          <div><dt>Proceso</dt><dd><a class="text-link" href="${ctx.esc(ctx.linkTo("procesos", { id: record.process }))}">${ctx.esc(ctx.processName(record.process))}</a></dd></div>
        </dl>`;
      case "actividades":
        return `${recordLinks(ctx, ctx.state.tasks.filter(task => task.requirement === record.id), "obligaciones", "Sin actividades vinculadas a esta ficha.")}
          ${ctx.button("Nueva actividad vinculada", ctx.linkTo("obligaciones", { nuevo: 1, requisito: record.id }), { symbol: "plus" })}`;
      case "indicadores":
        return `<p>${record.indicator ? ctx.esc(record.indicator) : "Sin indicador registrado en la ficha."}</p>
          ${ctx.button("Ver indicadores generales", "indicadores.html", { symbol: "chart" })}`;
      case "evaluacion":
        return `<p>${ctx.badge("Evaluación formal pendiente", "warning")}</p>
          ${recordLinks(ctx, ctx.state.audits.filter(audit => audit.criteria.includes(record.id)), "auditorias", "Sin auditorías vinculadas a esta ficha.")}`;
      case "mejora":
        return recordLinks(ctx, ctx.state.findings.filter(finding => finding.requirement === record.id), "hallazgos", "Sin acciones de mejora vinculadas a esta ficha.");
      default:
        return "";
    }
  }

  function requirementAccess(ctx, standard, current) {
    const { record, clause, panel } = current;
    const selected = access.find(item => item.id === panel && item.id !== "documentos");
    return `
      <section class="card requirement-actions" id="gestion" tabindex="-1" aria-labelledby="management-title">
        <h2 class="standard-panel-heading" id="management-title">${ctx.icon("clipboard")} Gestión del requisito</h2>
        ${record ? "" : '<p class="standard-empty">Cláusula sin ficha SGI configurada.</p>'}
        <div class="requirement-action-grid">
          ${access.map(item => {
            const enabled = record || ["documentos", "opciones"].includes(item.id);
            const content = `<span class="requirement-action-icon">${ctx.icon(item.icon)}</span>
              <strong>${item.label}</strong>${enabled ? "" : "<small>Pendiente</small>"}`;
            if (!enabled) return `<span class="requirement-action" aria-disabled="true">${content}</span>`;
            const href = item.id === "documentos" ? "#documentos-asociados"
              : viewLink(ctx, standard, { clausula: clause, ...(record ? { ficha: record.id } : {}), panel: item.id }, "#gestion");
            return `<a class="requirement-action" href="${href}"${item.id === panel ? ' aria-current="true"' : ""}>${content}</a>`;
          }).join("")}
        </div>
        ${selected ? `<div class="requirement-context">
          <h3>${selected.label}</h3>${contextBody(ctx, standard, current)}
        </div>` : ""}
      </section>`;
  }

  function workspace(ctx, standard) {
    const current = selection(ctx, standard);
    const covered = current.records.filter(ctx.documentCoverage).length;
    return `
      <div class="standard-workspace">
        <header class="standard-heading">
          <div class="standard-identity">
            <span class="standard-mark">${ctx.icon(standard.icon)}</span>
            <div class="standard-heading-copy">
              <h1>ISO ${ctx.esc(standard.number)}:${ctx.esc(standard.edition)}</h1>
              <p>${ctx.esc(standard.subtitle)}${standard.amendment ? ` · ${ctx.esc(standard.amendment)}` : ""}</p>
            </div>
          </div>
          <a class="standard-summary" href="${ctx.esc(ctx.linkTo("requisitos", { norma: `ISO ${standard.number}` }))}">
            <span class="standard-summary-icon">${ctx.icon("chart")}</span>
            <span class="standard-summary-copy">
              <small>${current.records.length ? "Fichas con evidencia vigente" : "Matriz SGI"}</small>
              <strong>${current.records.length ? `${covered} de ${current.records.length}` : "Sin fichas configuradas"}</strong>
            </span>
            ${ctx.icon("chevron")}
          </a>
        </header>
        <div class="standard-layout">
          <div class="standard-navigation">${cycle(ctx, standard, current)}</div>
          <div class="standard-main">
            <section class="chapter-detail" id="capitulo" tabindex="-1" aria-labelledby="chapter-title">
              <h2 id="chapter-title">Capítulo ${current.chapter} <span>${ctx.esc(standard.chapters[current.chapter].title)}</span></h2>
              ${clauseNavigation(ctx, standard, current)}
              ${current.choices.length > 1 ? `<nav class="requirement-scope" aria-label="Seleccionar ficha SGI">
                ${current.choices.map(record => `<a class="button button-secondary" href="${viewLink(ctx, standard, { clausula: current.clause, ficha: record.id }, "#gestion")}"
                  ${record === current.record ? 'aria-current="true"' : ""}>${ctx.esc(ctx.siteName(record.site))} · ${ctx.esc(record.id)}</a>`).join("")}
              </nav>` : ""}
            </section>
            ${requirementAccess(ctx, standard, current)}
            ${documentTable(ctx, current.record)}
          </div>
        </div>
      </div>`;
  }

  function revealSelection(container) {
    for (const row of container.querySelectorAll(".clause-scroll")) {
      const active = row.querySelector('[aria-current="true"]');
      if (!active) continue;
      const bounds = row.getBoundingClientRect();
      const item = active.getBoundingClientRect();
      if (item.right > bounds.right) row.scrollLeft += item.right - bounds.right + 4;
    }
  }

  window.SGI_STANDARDS = { home, workspace, revealSelection };
})();
