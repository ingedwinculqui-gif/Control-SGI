(() => {
  "use strict";

  const taskStates = ["Pendiente", "En curso", "Completada"];
  const taskTypes = ["Actividad interna", "Control interno", "Obligación"];
  const filters = [
    ["todas", "Todas"],
    ["proximas", "Próximas a vencer"],
    ["vencidas", "Vencidas"],
    ["faltantes", "Sin evidencia vigente"],
    ["completadas", "Completadas"]
  ];
  const metricIcons = ["layers", "target", "clock", "file"];

  function normalize(value) {
    return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  function matchesStatus(ctx, task, filter) {
    const status = ctx.taskStatus(task).label;
    if (filter === "proximas") return status === "Próxima a vencer";
    if (filter === "vencidas") return status === "Vencida";
    if (filter === "faltantes") return !ctx.hasEvidence(task);
    if (filter === "completadas") return status === "Completada";
    return true;
  }

  function evidenceStatus(ctx, task) {
    if (ctx.hasEvidence(task)) return ctx.badge("Evidencia vigente", "success");
    return task.evidence ? ctx.badge("Sin versión vigente", "warning") : ctx.badge("Evidencia faltante", "danger");
  }

  function actionButton(ctx, label, symbol, attributes) {
    return `<button type="button" class="button button-primary" ${attributes}>${ctx.icon(symbol)} ${label}</button>`;
  }

  function taskCard(ctx, task) {
    const status = ctx.taskStatus(task);
    const href = ctx.linkTo("obligaciones", { id: task.id });
    return `<article class="record-card">
      <div class="record-meta">${ctx.esc(task.id)} · ${ctx.esc(task.type)}</div>
      <h2 class="card-title"><a class="text-link" href="${ctx.esc(href)}">${ctx.esc(task.title)}</a></h2>
      <p>${ctx.esc(ctx.processName(task.process))} · ${ctx.esc(ctx.siteName(task.site))}</p>
      <div class="record-meta">
        <span>${ctx.esc(task.owner)}</span><span>${ctx.esc(ctx.relativeDate(task.days))}</span>
      </div>
      <div class="record-meta">${ctx.badge(status.label, status.tone)}${evidenceStatus(ctx, task)}</div>
      ${ctx.button("Ver actividad", href, { kind: "ghost", symbol: "arrow-right", end: true })}
    </article>`;
  }

  function taskDialog(ctx) {
    return `<dialog class="dialog" id="task-dialog" aria-labelledby="task-dialog-title">
      <div class="dialog-inner">
        <header class="dialog-header">
          <div><h2 id="task-dialog-title">Nueva actividad</h2><p class="muted">Los cambios se guardan en este navegador.</p></div>
          <button type="button" class="icon-button" data-task-close aria-label="Cerrar formulario">${ctx.icon("x")}</button>
        </header>
        <form class="form-grid" id="task-form">
          <input type="hidden" name="id"><input type="hidden" name="requirement">
          <p class="notice info full" id="task-requirement-hint" hidden></p>
          <div class="full">${ctx.field("Título", '<input class="input" name="title" required maxlength="120" autofocus>')}</div>
          ${ctx.field("Tipo", `<select class="select" name="type">${taskTypes.map(type => ctx.option(type, type)).join("")}</select>`)}
          ${ctx.field("Responsable", '<input class="input" name="owner" required maxlength="80">')}
          ${ctx.field("Sede", `<select class="select" name="site" required>${ctx.option("", "Selecciona una sede")}${ctx.state.sites.map(site => ctx.option(site.id, site.name)).join("")}</select>`)}
          ${ctx.field("Proceso", '<select class="select" name="process" required></select>')}
          ${ctx.field("Fecha límite", '<input class="input" name="due" type="date" required>')}
          ${ctx.field("Estado de la actividad", `<select class="select" name="status">${taskStates.map(status => ctx.option(status, status)).join("")}</select>`)}
          <div class="full">${ctx.field("Documento de evidencia", '<select class="select" name="evidence"></select>')}</div>
          <div class="form-actions">
            <button type="button" class="button button-secondary" data-task-close>Cancelar</button>
            <button type="submit" class="button button-primary">${ctx.icon("check")} Guardar actividad</button>
          </div>
        </form>
      </div>
    </dialog>`;
  }

  function taskDetail(ctx, task) {
    const { esc, state } = ctx;
    const status = ctx.taskStatus(task);
    const document = state.documents.find(item => item.id === task.evidence);
    const current = ctx.latestVersion(document);
    const requirement = state.requirements.find(item => item.id === task.requirement);
    const standard = requirement && ctx.standardLink(requirement, "actividades");
    const entries = [
      ["Tipo", task.type], ["Sede", ctx.siteName(task.site)], ["Proceso", ctx.processName(task.process)],
      ["Responsable", task.owner], ["Fecha límite", ctx.relativeDate(task.days)], ["Estado registrado", task.status]
    ];
    const docLink = document && ctx.linkTo("documentos", { id: document.id, ...(current ? { v: current.version } : {}) });
    return `${ctx.heading({
      eyebrow: `Seguimiento · ${task.id}`,
      title: task.title,
      description: "Consulta el plazo, la ejecución y la evidencia asociada.",
      actions: ctx.button("Volver a obligaciones", "obligaciones.html", { symbol: "arrow-left" }) + actionButton(ctx, "Editar actividad", "edit", "data-task-edit")
    })}
    <div class="detail-grid">
      <div class="detail-main">
        <section class="card">
          ${ctx.cardHeader("Datos de seguimiento", "", ctx.badge(status.label, status.tone))}
          <div class="card-body"><dl class="detail-list">
            ${entries.map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join("")}
            ${requirement ? `<div><dt>Requisito relacionado</dt><dd><a class="text-link" href="${esc(ctx.linkTo("requisitos", { id: requirement.id }))}">${esc(requirement.id)} · ${esc(requirement.title)}</a>
              ${standard ? `<br><a class="text-link" href="${esc(standard)}#gestion">Ver plan del requisito</a>` : ""}</dd></div>` : ""}
          </dl></div>
        </section>
      </div>
      <aside class="detail-aside">
        <section class="card">
          ${ctx.cardHeader("Evidencia", "", evidenceStatus(ctx, task))}
          <div class="card-body stack">
            ${document ? `<p><strong>${esc(document.title)}</strong></p>
              <p class="muted">${current ? `Versión ${esc(current.version)} · ${esc(ctx.date(current.date))}` : "El documento vinculado carece de una versión vigente."}</p>
              ${ctx.button("Abrir evidencia", docLink, { symbol: "file" })}` :
              '<p class="muted">Vincula un documento de evidencia al editar la actividad.</p>'}
          </div>
        </section>
      </aside>
    </div>${taskDialog(ctx)}`;
  }

  function obligaciones(ctx) {
    const id = ctx.query.get("id");
    if (id) {
      const task = ctx.state.tasks.find(item => item.id === id);
      return task ? taskDetail(ctx, task) :
        ctx.heading({ eyebrow: "Seguimiento", title: "Actividad no encontrada" }) +
        ctx.empty("No se encontró la actividad", "Comprueba el identificador o vuelve al listado.",
          ctx.button("Volver a obligaciones", "obligaciones.html", { symbol: "arrow-left" }));
    }

    const initialFilter = ctx.query.get("estado");
    return `${ctx.heading({
      eyebrow: "Seguimiento",
      title: "Obligaciones y alertas",
      description: "Asigna responsables, revisa fechas límite y vincula la evidencia de cada actividad.",
      actions: actionButton(ctx, "Nueva actividad", "plus", "data-task-create")
    })}
    <div class="filters">
      ${ctx.field("Buscar", '<input class="input" id="task-search" type="search" placeholder="Actividad, sede o responsable…">')}
      ${ctx.field("Estado", `<select class="select" id="task-status">${filters.map(([value, label]) => ctx.option(value, label, initialFilter)).join("")}</select>`)}
      ${ctx.field("Sede", `<select class="select" id="task-site">${ctx.option("", "Todas las sedes")}${ctx.state.sites.map(site => ctx.option(site.id, site.name)).join("")}</select>`)}
    </div>
    <p class="muted" id="task-count" aria-live="polite"></p>
    <div class="record-grid" id="task-results"></div>
    ${taskDialog(ctx)}`;
  }

  function bindTaskDialog(ctx) {
    const dialog = document.querySelector("#task-dialog");
    if (!dialog) return;
    const form = dialog.querySelector("#task-form");
    const fields = form.elements;
    const { state, option } = ctx;
    const newButton = document.querySelector("[data-task-create]");
    const editButton = document.querySelector("[data-task-edit]");

    function refreshEvidence(selected = "") {
      const documents = state.documents.filter(doc =>
        doc.site === fields.site.value && doc.process === fields.process.value && ctx.latestVersion(doc));
      const oldDocument = state.documents.find(doc => doc.id === selected);
      const legacy = oldDocument && !documents.some(doc => doc.id === selected)
        ? option(oldDocument.id, `${oldDocument.title} (vínculo anterior)`, selected) : "";
      fields.evidence.innerHTML = option("", "Sin evidencia vinculada", selected) + legacy +
        documents.map(doc => option(doc.id, `${doc.id} · ${doc.title}`, selected)).join("");
    }

    function refreshProcess(selected = "") {
      fields.process.innerHTML = option("", "Selecciona un proceso", selected) +
        state.processes.filter(process => process.site === fields.site.value)
          .map(process => option(process.id, process.name, selected)).join("");
    }

    function open(task) {
      const requirementId = task ? task.requirement : ctx.query.get("requisito");
      const linked = state.requirements.find(item => item.id === requirementId);
      form.reset();
      dialog.querySelector("#task-dialog-title").textContent = task ? "Editar actividad" : "Nueva actividad";
      const hint = dialog.querySelector("#task-requirement-hint");
      hint.hidden = !linked;
      if (linked) hint.textContent = `Sede y proceso vinculados al requisito ${linked.id}.`;
      fields.id.value = task?.id || "";
      fields.requirement.value = task?.requirement || linked?.id || "";
      fields.title.value = task?.title || (linked ? `Obtener evidencia — ${linked.title}` : "");
      fields.type.value = task?.type || taskTypes[0];
      fields.owner.value = task?.owner || linked?.owner || "";
      fields.site.value = linked?.site || task?.site || "";
      fields.site.disabled = Boolean(linked);
      fields.process.disabled = Boolean(linked);
      fields.due.value = task ? ctx.addDays(task.days) : ctx.localISO();
      fields.status.value = task?.status || taskStates[0];
      refreshProcess(linked?.process || task?.process || "");
      refreshEvidence(task?.evidence || "");
      dialog.showModal();
    }

    fields.site.addEventListener("change", () => { refreshProcess(); refreshEvidence(); });
    fields.process.addEventListener("change", () => refreshEvidence());
    form.querySelectorAll("input[required]").forEach(input => {
      input.addEventListener("input", () => input.setCustomValidity(""));
    });
    dialog.querySelectorAll("[data-task-close]").forEach(button => button.addEventListener("click", () => dialog.close()));
    newButton?.addEventListener("click", () => open(null));
    editButton?.addEventListener("click", () => open(state.tasks.find(item => item.id === ctx.query.get("id"))));
    form.addEventListener("submit", event => {
      event.preventDefault();
      for (const input of [fields.title, fields.owner]) {
        if (!input.value.trim()) input.setCustomValidity("Completa este campo.");
      }
      const days = ctx.dayOffset(fields.due.value);
      if (!Number.isFinite(days)) fields.due.setCustomValidity("Indica una fecha válida.");
      if (!form.reportValidity()) return;

      const existing = state.tasks.find(item => item.id === fields.id.value);
      const evidence = state.documents.find(doc => doc.id === fields.evidence.value);
      if (fields.evidence.value && fields.evidence.value !== existing?.evidence &&
        (!evidence || evidence.site !== fields.site.value || evidence.process !== fields.process.value || !ctx.latestVersion(evidence))) {
        return;
      }
      const next = {
        id: existing?.id || ctx.createId("SEG", state.tasks),
        title: fields.title.value.trim(),
        type: fields.type.value,
        owner: fields.owner.value.trim(),
        site: fields.site.value,
        process: fields.process.value,
        days,
        status: fields.status.value,
        evidence: fields.evidence.value,
        requirement: fields.requirement.value
      };
      if (existing) Object.assign(existing, next);
      else state.tasks.push(next);
      dialog.close();
      ctx.commit(existing ? "Actividad actualizada." : `Actividad ${next.id} registrada.`);
      const focus = existing ? document.querySelector("[data-task-edit]") :
        document.querySelector(`#task-results a[href="${ctx.linkTo("obligaciones", { id: next.id })}"]`);
      (focus || document.querySelector("[data-task-create]"))?.focus();
    });
    if (newButton && ctx.query.get("nuevo") === "1" && !window.SGI_TRACKING.openedFromRequirement) {
      window.SGI_TRACKING.openedFromRequirement = true;
      open(null);
    }
  }

  function bindTaskFilters(ctx) {
    const results = document.querySelector("#task-results");
    if (!results) return;
    const search = document.querySelector("#task-search");
    const status = document.querySelector("#task-status");
    const site = document.querySelector("#task-site");
    const count = document.querySelector("#task-count");

    function refresh() {
      const words = normalize(search.value).split(/\s+/).filter(Boolean);
      const matches = ctx.state.tasks.filter(task => {
        const terms = normalize([task.id, task.title, task.owner, ctx.processName(task.process), ctx.siteName(task.site)].join(" "));
        return words.every(word => terms.includes(word)) && matchesStatus(ctx, task, status.value) &&
          (!site.value || task.site === site.value);
      }).sort((a, b) => (a.status === "Completada") - (b.status === "Completada") || a.days - b.days);
      count.textContent = `${matches.length} ${matches.length === 1 ? "actividad" : "actividades"}`;
      results.innerHTML = matches.length ? matches.map(task => taskCard(ctx, task)).join("") :
        ctx.empty("Sin actividades", "Cambia la búsqueda o los filtros para ver otros resultados.");
    }

    search.addEventListener("input", refresh);
    status.addEventListener("change", refresh);
    site.addEventListener("change", refresh);
    refresh();
  }

  function metricChart(ctx, metric) {
    const values = metric.values;
    const max = Math.max(1, ...values, metric.baseline, metric.goal);
    const points = values.map((value, index) => [14 + index * (292 / Math.max(1, values.length - 1)), 100 - (76 * value / max)]);
    const line = points.map(point => point.join(",")).join(" ");
    const targetY = 100 - 76 * metric.goal / max;
    const labels = values.map((value, index) => `Mes ${index + 1}, ${ctx.number(value)} ${metric.unit}`).join(". ");
    return `<svg class="sparkline" viewBox="0 0 320 118" role="img" aria-label="${ctx.esc(labels)}">
      <line x1="14" y1="100" x2="306" y2="100" stroke="#d9e4d8"/>
      <polygon points="14,100 ${line} 306,100" fill="#e5eedc"/>
      <line x1="14" y1="${targetY}" x2="306" y2="${targetY}" stroke="#ac812e" stroke-width="1.5" stroke-dasharray="4 5"/>
      <polyline points="${line}" fill="none" stroke="#367650" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
      ${points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#367650" stroke="#fff" stroke-width="1.5"/>`).join("")}
      <text x="14" y="115" fill="#506359" font-size="11">Mes 1</text>
      <text x="306" y="115" text-anchor="end" fill="#506359" font-size="11">Mes ${values.length}</text>
    </svg>`;
  }

  function metricCard(ctx, metric, index) {
    const current = metric.values.at(-1);
    const goalReached = metric.direction === "down" ? current <= metric.goal : current >= metric.goal;
    const value = number => `${ctx.number(number)} ${ctx.esc(metric.unit)}`;
    return `<section class="card">
      ${ctx.cardHeader(metric.title, `Piloto · Mes ${metric.values.length}`,
        `<span class="kpi-icon success">${ctx.icon(metricIcons[index % metricIcons.length])}</span>`)}
      <div class="card-body stack">
        <div><strong class="kpi-value">${value(current)}</strong> ${ctx.badge(goalReached ? "Meta alcanzada" : "Meta por alcanzar", goalReached ? "success" : "warning")}</div>
        ${metricChart(ctx, metric)}
        <dl class="detail-list">
          <div><dt>Línea base</dt><dd>${value(metric.baseline)}</dd></div>
          <div><dt>Meta</dt><dd>${value(metric.goal)}</dd></div>
        </dl>
        <p class="muted">${ctx.esc(metric.description || "Fuente: datos ficticios del ejemplo.")}</p>
      </div>
    </section>`;
  }

  function indicadores(ctx) {
    return `${ctx.heading({
      eyebrow: "Evaluación y mejora", title: "Indicadores del SGI",
      description: "Compara los resultados mensuales del piloto con la línea base y las metas."
    })}
    <p class="notice info">${ctx.icon("chart")} Escenario ficticio de seis meses. La línea punteada indica la meta.</p>
    <div class="grid grid-2">${ctx.state.metrics.map((metric, index) => metricCard(ctx, metric, index)).join("")}</div>`;
  }

  function bind(ctx, page) {
    if (page !== "obligaciones") return;
    bindTaskFilters(ctx);
    bindTaskDialog(ctx);
  }

  window.SGI_TRACKING = { obligaciones, indicadores, bind };
})();
