(() => {
  "use strict";

  const icons = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    list: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
    file: '<path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10Zm0 0v7h7M8 14h8m-8 3h5"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18m-13 5h2m4 0h2"/>',
    clipboard: '<rect x="5" y="5" width="14" height="16" rx="2"/><rect x="9" y="3" width="6" height="4" rx="1" fill="var(--icon-fill, transparent)"/><path d="M9 12h6m-6 4h6"/>',
    chart: '<path d="M4 4v16h16M8 15l4-4 3 2 5-6"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.2 9a3 3 0 0 1 5.8 1c0 1.7-3 2.2-3 4m0 3h.01"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    "arrow-right": '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    "arrow-left": '<path d="M20 12H5m6 6-6-6 6-6"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    external: '<path d="M13 5h6v6m0-6-9 9m7-1v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    alert: '<path d="M10.2 4.5 3.1 18a1.6 1.6 0 0 0 1.4 2.4h15a1.6 1.6 0 0 0 1.4-2.4L13.8 4.5a2 2 0 0 0-3.6 0ZM12 9v4m0 3h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shield: '<path d="M12 3 4 6v5c0 5 3 8 8 10 5-2 8-5 8-10V6l-8-3Zm-4 9 3 3 5-6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    history: '<path d="M4 10a8 8 0 1 1 1.7 7.7M4 5v5h5m3-3v5l3 2"/>',
    edit: '<path d="m14 6 4 4m-13 9 4-.9L20 7l-3-3L6 15l-1 4Z"/>',
    link: '<path d="m10 14 4-4m-6 7-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0m2 6a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-1 1"/>',
    building: '<path d="M4 20V7l8-4v17m0-12h8v12M2 20h20M7 9h2m-2 4h2m-2 4h2m6-5h2m-2 4h2"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>',
    upload: '<path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4"/>',
    award: '<circle cx="12" cy="8" r="5"/><path d="m8.5 12-2 8 5.5-3 5.5 3-2-8"/><path d="m10 8 1.3 1.3L14 7"/>',
    leaf: '<path d="M20 4c0 9-3 15-9 15a6 6 0 0 1-6-6c0-6 6-9 15-9ZM4 20l10-10"/>',
    helmet: '<path d="M3 16h18v3H3zm2 0v-3a7 7 0 0 1 4-6m6 0a7 7 0 0 1 4 6v3M9 12V5h6v7"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 19v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-14a3 3 0 0 1 0 6m2 3a4 4 0 0 1 3 4v1"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M3 10h18"/>',
    cycle: '<path d="M4 11a8 8 0 0 1 14-5l2 3m0-5v5h-5m5 4a8 8 0 0 1-14 5l-2-3m0 5v-5h5"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
  };

  const navGroups = [
    { title: "Espacio de trabajo", links: [
      ["index", "Inicio", "grid"],
      ["resumen", "Resumen general", "chart", "index.html?vista=resumen"],
      ["requisitos", "Matriz de requisitos", "list"],
      ["procesos", "Procesos y sedes", "layers"],
      ["documentos", "Documentos y evidencias", "file"],
      ["obligaciones", "Obligaciones y alertas", "bell"]
    ] },
    { title: "Evaluación y mejora", links: [
      ["auditorias", "Auditorías", "calendar"],
      ["hallazgos", "Hallazgos y acciones", "clipboard"],
      ["indicadores", "Indicadores", "chart"]
    ] },
    { title: "Soporte", links: [["ayuda", "Guía de uso", "help"]] }
  ];

  const links = navGroups.flatMap(group => group.links);
  const app = document.getElementById("app");
  const page = document.body.dataset.page;
  const mobileNavigation = matchMedia("(width < 705px)");
  const query = new URLSearchParams(location.search);
  const catalog = window.SGI_CATALOG;
  const selectedStandard = page === "index" ? catalog.find(standard => standard.number === query.get("norma")) : null;
  const activePage = page === "index" && query.get("vista") === "resumen" && !selectedStandard ? "resumen" : page;
  const storeKey = "control-sgi-workspace-v1";
  const dataKeys = ["sites", "processes", "requirements", "documents", "tasks", "audits", "findings", "metrics"];
  const dateFormat = new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short", year: "numeric" });
  const numberFormat = new Intl.NumberFormat("es-EC", { maximumFractionDigits: 2 });
  const labels = { "ISO 9001": "Calidad", "ISO 14001": "Gestión ambiental", "ISO 45001": "Seguridad y salud" };
  let storageAvailable = true;
  let storageSnapshot = null;
  let storageRecovered = false;
  let saveConflict = false;
  let state;

  function localISO(date = new Date()) {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
      .map((part, index) => index ? String(part).padStart(2, "0") : part).join("-");
  }

  function validISO(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T12:00:00`);
    return !Number.isNaN(parsed.valueOf()) && localISO(parsed) === value;
  }

  function validState(value) {
    if (!value || !validISO(value.baseDate) || !dataKeys.every(key =>
      Array.isArray(value[key]) && value[key].every(item => item && typeof item.id === "string"))) return false;
    const stringList = items => Array.isArray(items) && items.every(item => typeof item === "string");
    return value.requirements.every(item => stringList(item.evidence) && stringList(item.keywords)) &&
      value.documents.every(item => Array.isArray(item.versions) && item.versions.every(version =>
        version && typeof version.version === "string")) &&
      value.audits.every(item => stringList(item.criteria)) &&
      value.metrics.every(item => Array.isArray(item.values) && item.values.length > 0 &&
        item.values.every(Number.isFinite)) &&
      value.findings.every(item => item.history === undefined ||
        (Array.isArray(item.history) && item.history.every(change => change && typeof change === "object")));
  }

  function demoState() {
    const demo = JSON.parse(JSON.stringify(window.SGI_SEED));
    demo.baseDate = localISO();
    return demo;
  }

  function workspaceFrom(snapshot) {
    if (snapshot === null) return null;
    try {
      const parsed = JSON.parse(snapshot);
      return validState(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  function refreshFromStorage(snapshot) {
    const workspace = workspaceFrom(snapshot);
    storageSnapshot = snapshot;
    storageRecovered = snapshot !== null && !workspace;
    const next = workspace || demoState();
    if (state) Object.assign(state, next);
    else state = next;
  }

  function persist() {
    saveConflict = false;
    try {
      const latest = localStorage.getItem(storeKey);
      storageAvailable = true;
      // This catches edits already saved in another tab. Reading and writing are separate operations.
      if (latest !== storageSnapshot) {
        refreshFromStorage(latest);
        saveConflict = true;
        return false;
      }
      const snapshot = JSON.stringify(state);
      localStorage.setItem(storeKey, snapshot);
      storageSnapshot = snapshot;
      storageRecovered = false;
      return true;
    } catch {
      storageAvailable = false;
      return false;
    }
  }

  try {
    refreshFromStorage(localStorage.getItem(storeKey));
    if (storageSnapshot === null) persist();
  } catch {
    storageAvailable = false;
    state = demoState();
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, character =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }

  function icon(name, className = "") {
    return `<svg class="icon ${esc(className)}" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.list}</svg>`;
  }

  function badge(label, tone = "neutral") {
    const allowed = ["neutral", "success", "warning", "danger", "info"];
    return `<span class="badge ${allowed.includes(tone) ? tone : "neutral"}">${esc(label)}</span>`;
  }

  function date(value) {
    return validISO(value) ? dateFormat.format(new Date(`${value}T12:00:00`)) : "Sin fecha";
  }

  function addDays(days) {
    if (!Number.isFinite(Number(days)) || days === "" || days == null) return "";
    const value = new Date(`${state.baseDate}T12:00:00`);
    value.setDate(value.getDate() + Number(days));
    return localISO(value);
  }

  function dateOrdinal(value) {
    return Date.parse(`${value}T00:00:00Z`) / 86400000;
  }

  function dayOffset(value) {
    return validISO(value) ? dateOrdinal(value) - dateOrdinal(state.baseDate) : NaN;
  }

  function daysRemaining(days) {
    return dayOffset(addDays(days)) - dayOffset(localISO());
  }

  function taskStatus(task) {
    if (task.status === "Completada") return { label: "Completada", tone: "success" };
    const days = daysRemaining(task.days);
    if (days < 0) return { label: "Vencida", tone: "danger" };
    if (days <= 7) return { label: "Próxima a vencer", tone: "warning" };
    return { label: task.status, tone: task.status === "En curso" ? "info" : "neutral" };
  }

  function linkTo(target, params = {}) {
    const search = new URLSearchParams(params).toString();
    return `${target}.html${search ? `?${search}` : ""}`;
  }

  function standardLink(requirement, panel) {
    const standard = catalog.find(item =>
      `ISO ${item.number}` === requirement.standard && item.edition === requirement.edition);
    const chapter = standard?.chapters[requirement.clause.split(".")[0]];
    if (!chapter?.clauses.includes(requirement.clause)) return "";
    return linkTo("index", {
      norma: standard.number, clausula: requirement.clause, ficha: requirement.id,
      ...(panel ? { panel } : {})
    });
  }

  function button(label, href, options = {}) {
    const { kind = "secondary", symbol = "", end = false } = options;
    const content = `${symbol && !end ? icon(symbol) : ""}<span>${esc(label)}</span>${symbol && end ? icon(symbol) : ""}`;
    return `<a class="button button-${kind}" href="${esc(href)}">${content}</a>`;
  }

  function heading({ eyebrow, title, description, actions = "" }) {
    return `<header class="page-heading">
      <div class="page-title">${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ""}
      <h1>${esc(title)}</h1>${description ? `<p class="page-description">${esc(description)}</p>` : ""}</div>
      ${actions ? `<div class="page-actions">${actions}</div>` : ""}
    </header>`;
  }

  function empty(title, text, action = "") {
    return `<div class="empty-state">${icon("search")}<h2>${esc(title)}</h2><p>${esc(text)}</p>${action}</div>`;
  }

  function cardHeader(title, subtitle = "", actions = "") {
    return `<header class="card-header"><div><h2 class="card-title">${esc(title)}</h2>${subtitle ? `<p class="card-subtitle">${esc(subtitle)}</p>` : ""}</div>${actions}</header>`;
  }

  function toast(message) {
    const notice = document.getElementById("toast");
    notice.textContent = message;
    notice.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { notice.hidden = true; }, 4500);
  }

  function commit(message) {
    const saved = persist();
    render();
    if (saved) toast(message);
    else if (saveConflict) toast("El espacio cambió en otra pestaña. Se cargó la versión más reciente. Vuelve a aplicar tu cambio.");
    else toast("Cambio disponible en esta pestaña. El navegador impidió el guardado local.");
    return saved;
  }

  function field(label, control) {
    return `<label class="field"><span>${esc(label)}</span>${control}</label>`;
  }

  function option(value, label, selected = "") {
    return `<option value="${esc(value)}"${value === selected ? " selected" : ""}>${esc(label)}</option>`;
  }

  function createId(prefix, entries) {
    const highest = entries.reduce((max, entry) => Math.max(max,
      Number(entry.id.startsWith(`${prefix}-`) ? entry.id.slice(prefix.length + 1) : 0) || 0), 0);
    return `${prefix}-${String(highest + 1).padStart(3, "0")}`;
  }

  function latestVersion(doc) {
    return doc?.versions.find(version => version.status === "Vigente");
  }

  function hasEvidence(task) {
    return Boolean(latestVersion(state.documents.find(doc => doc.id === task.evidence)));
  }

  function documentCoverage(req) {
    return req.evidence.some(id => latestVersion(state.documents.find(doc => doc.id === id)));
  }

  function siteName(id) { return state.sites.find(site => site.id === id)?.name || "Sede sin asignar"; }
  function processName(id) { return state.processes.find(process => process.id === id)?.name || "Proceso sin asignar"; }
  function relativeDate(days) { return date(addDays(days)); }
  function number(value) { return numberFormat.format(value); }

  function kpi({ label, value, note, symbol, kind, href }) {
    return `<a class="kpi-card" href="${esc(href)}">
      <span class="kpi-icon ${kind}">${icon(symbol)}</span>
      <span class="kpi-label">${esc(label)}</span>
      <strong class="kpi-value">${esc(value)}</strong>
      <span class="kpi-note">${esc(note)}</span>
    </a>`;
  }

  function dashboard() {
    const covered = state.requirements.filter(documentCoverage).length;
    const total = state.requirements.length;
    const missing = state.tasks.filter(task => !hasEvidence(task)).length;
    const late = state.tasks.filter(task => taskStatus(task).label === "Vencida");
    const soon = state.tasks.filter(task => taskStatus(task).label === "Próxima a vencer");
    const toVerify = state.findings.filter(finding => finding.stage === "Por verificar").length;
    const attention = [...late, ...soon].sort((a, b) => a.days - b.days).slice(0, 4);
    const coverage = total ? Math.round(100 * covered / total) : 0;
    const upcomingAudits = state.audits.filter(audit => audit.status !== "Cerrada").sort((a, b) => a.days - b.days).slice(0, 3);
    const standards = Object.entries(labels).map(([standard, label]) => {
      const requirements = state.requirements.filter(req => req.standard === standard);
      const count = requirements.filter(documentCoverage).length;
      const percent = requirements.length ? Math.round(count / requirements.length * 100) : 0;
      return `<div class="status-row">
        <div class="status-copy"><a href="${esc(linkTo("requisitos", { norma: standard }))}"><strong>${standard}</strong></a><span>${label}</span></div>
        <div class="progress-track" role="progressbar" aria-label="${standard}, cobertura documental" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"><span class="progress-bar" style="width:${percent}%"></span></div>
        <span class="progress-value">${count}/${requirements.length}</span>
      </div>`;
    }).join("");
    return `
      ${heading({ eyebrow: "Sistema integrado de gestión", title: "Resumen del SGI", description: "Consulta evidencias, anticipa vencimientos y da seguimiento a la mejora.", actions: button("Ver obligaciones", "obligaciones.html", { symbol: "calendar" }) })}
      <section class="dashboard-hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <div class="hero-kicker">${icon("search")} Consulta de auditoría</div>
          <h2 id="hero-title">Del requisito a la evidencia</h2>
          <p>Busca por cláusula, proceso o pregunta. Abre el control y la evidencia que lo respalda.</p>
          <form class="hero-actions" action="requisitos.html" method="get" role="search" aria-label="Consulta de auditoría">
            <label class="sr-only" for="hero-query">Pregunta o cláusula</label>
            <input class="input" id="hero-query" name="q" placeholder="Ej. Control de residuos" required>
            <button class="button button-primary" type="submit">Buscar ${icon("arrow-right")}</button>
          </form>
        </div>
        <div class="hero-visual">
          <div class="hero-trace" aria-hidden="true">
            <div class="trace-step">${icon("list")}<span>Requisito</span></div>
            <div class="trace-step">${icon("shield")}<span>Control</span></div>
            <div class="trace-step">${icon("file")}<span>Evidencia</span></div>
          </div>
          <a class="hero-matrix-link" href="requisitos.html">Explorar matriz ${icon("arrow-right")}</a>
        </div>
      </section>
      <section class="kpi-grid" aria-label="Indicadores del resumen">
        ${kpi({ label: "Cobertura documental", value: `${coverage}%`, note: `${covered} de ${total} requisitos con evidencia vigente`, symbol: "shield", kind: "success", href: "requisitos.html" })}
        ${kpi({ label: "Por vencer", value: soon.length, note: "Plazos de los próximos 7 días", symbol: "clock", kind: "warning", href: "obligaciones.html?estado=proximas" })}
        ${kpi({ label: "Evidencias faltantes", value: missing, note: "Actividades sin evidencia vigente", symbol: "file", kind: "danger", href: "obligaciones.html?estado=faltantes" })}
        ${kpi({ label: "Eficacia por verificar", value: toVerify, note: "Acciones ejecutadas por evaluar", symbol: "target", kind: "info", href: "hallazgos.html?estado=Por+verificar" })}
      </section>
      <div class="dashboard-grid">
        <section class="card" aria-label="Cobertura por norma">
          ${cardHeader("Cobertura por norma", "Requisitos con al menos una evidencia vigente", button("Ver matriz", "requisitos.html", { kind: "ghost", symbol: "arrow-right", end: true }))}
          <div class="card-body status-list">${standards}</div>
        </section>
        <section class="card">
          ${cardHeader("Requiere atención", "Actividades vencidas o próximas a vencer", button("Ver todas", "obligaciones.html", { kind: "ghost", symbol: "arrow-right", end: true }))}
          <div class="card-body stack">
            ${attention.map(task => {
              const status = taskStatus(task);
              return `<a class="list-item" href="${esc(linkTo("obligaciones", { id: task.id }))}">
                <span class="list-icon ${status.tone}">${icon(status.tone === "danger" ? "alert" : "clock")}</span>
                <span class="list-copy"><strong class="list-title">${esc(task.title)}</strong><span class="list-meta">${esc(task.owner)} · ${relativeDate(task.days)}</span></span>
                ${badge(status.label, status.tone)}
              </a>`;
            }).join("") || '<p class="muted">Sin vencimientos que requieran atención.</p>'}
          </div>
        </section>
      </div>
      <section class="card dashboard-audits">
        ${cardHeader("Próximas auditorías", "Programa de auditoría del espacio de demostración", button("Ver auditorías", "auditorias.html", { kind: "ghost", symbol: "arrow-right", end: true }))}
        <div class="card-body grid grid-3">
          ${upcomingAudits.map(audit => `<a class="list-item" href="${esc(linkTo("auditorias", { id: audit.id }))}">
            <span class="list-icon info">${icon("calendar")}</span>
            <span class="list-copy"><strong class="list-title">${esc(audit.title)}</strong><span class="list-meta">${esc(siteName(audit.site))} · ${relativeDate(audit.days)}</span></span>${icon("chevron")}
          </a>`).join("") || '<p class="muted">Sin auditorías activas.</p>'}
        </div>
      </section>`;
  }

  function help() {
    return `
      ${heading({ eyebrow: "Soporte", title: "Guía de uso", description: "Consulta la trazabilidad y administra los datos de la demostración." })}
      <div class="grid grid-2">
        <section class="card">
          ${cardHeader("Cómo responder a una pregunta de auditoría")}
          <div class="card-body">
            <ol class="detail-list">
              <li>Escribe la pregunta, una cláusula o palabras clave en la matriz. Puedes filtrar por norma y sede.</li>
              <li>Abre el requisito y consulta el proceso, el responsable y el control asociado.</li>
              <li>Abre el registro de evidencia. Comprueba la fecha, el responsable y la versión. Selecciona una versión anterior en el historial.</li>
              <li>Si falta evidencia, registra una actividad con responsable y fecha en Obligaciones y alertas.</li>
            </ol>
            ${button("Abrir matriz", "requisitos.html", { symbol: "arrow-right", end: true })}
          </div>
        </section>
        <section class="card">
          ${cardHeader("Alcance de esta versión")}
          <div class="card-body">
            <p>Los registros y resultados incluidos son ficticios. La cobertura indica qué requisitos tienen al menos una evidencia vigente vinculada. Consulta la edición y la aplicabilidad real con el responsable SGI antes de usar una referencia en una auditoría.</p>
            <p>Esta edición HTML guarda cambios en este navegador. Usa el mismo navegador, perfil y carpeta para continuar. Los datos del paquete están disponibles para quien tenga acceso a los archivos. Usa datos ficticios para evaluar los flujos.</p>
            <p>Si el navegador restringe el guardado desde archivos locales, sirve la carpeta con un servidor estático local y vuelve a abrir el índice. Cada perfil y dirección de apertura mantiene su propio espacio de almacenamiento.</p>
          </div>
        </section>
        <section class="card">
          ${cardHeader("Fuentes normativas", "Catálogos oficiales para consultar la edición y el estado de publicación")}
          <div class="card-body stack">
            ${catalog.map(standard => `<a class="list-item" href="${esc(standard.source)}" target="_blank" rel="noopener noreferrer">
              <span class="list-icon success">${icon("file")}</span><span class="list-copy"><strong class="list-title">ISO ${esc(standard.number)}:${esc(standard.edition)}</strong><span class="list-meta">${esc(standard.name)}</span></span>${icon("external")}
            </a>`).join("")}
          </div>
        </section>
        <section class="card">
          ${cardHeader("Copia local", "Descarga los datos de este navegador en JSON.")}
          <div class="card-body">
            <button type="button" class="button button-secondary" id="export-data">${icon("download")} Descargar copia</button>
          </div>
        </section>
      </div>`;
  }

  function exportData() {
    const file = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `control-sgi-${localISO()}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function shell() {
    const current = selectedStandard ? `ISO ${selectedStandard.number}` : links.find(([key]) => key === activePage)?.[1];
    const pending = state.tasks.filter(task => ["Vencida", "Próxima a vencer"].includes(taskStatus(task).label)).length;
    return `
      <a class="skip-link" href="#content">Saltar al contenido</a>
      <div class="app-shell">
        <aside class="sidebar" id="sidebar">
          <button class="sidebar-close icon-button" type="button" aria-label="Cerrar menú">${icon("x")}</button>
          <a class="brand" href="index.html" aria-label="Control SGI, inicio">
            <span class="brand-mark">${icon("layers")}</span>
            <span class="brand-name">Control <strong>SGI</strong><small>Sistema integrado de gestión</small></span>
          </a>
          <nav aria-label="Navegación principal">
            ${navGroups.map(group => `<div class="nav-group"><p class="nav-label">${group.title}</p>
              ${group.links.map(([key, label, symbol, href = `${key}.html`]) => `
                <a class="nav-link" href="${href}"${!selectedStandard && activePage === key ? ' aria-current="page"' : ""}>
                  <span class="nav-icon">${icon(symbol)}</span><span class="nav-text">${label}</span>
                </a>
                ${key === "index" && selectedStandard ? `<div class="nav-standards">
                  ${catalog.map(standard => `<a class="nav-standard" href="${esc(linkTo("index", { norma: standard.number }))}"
                    ${standard === selectedStandard ? 'aria-current="page"' : ""}>ISO ${esc(standard.number)}</a>`).join("")}
                </div>` : ""}`).join("")}
            </div>`).join("")}
          </nav>
          <div class="sidebar-footer">
            <div class="workspace-card"><span class="workspace-avatar">${icon("building")}</span><span><strong>Espacio de demostración</strong><small>Datos ficticios · edición local</small></span></div>
          </div>
        </aside>
        <button type="button" class="scrim" aria-label="Cerrar menú" tabindex="-1"></button>
        <div class="app-main">
          <header class="topbar">
            <button class="mobile-toggle icon-button" type="button" aria-controls="sidebar" aria-expanded="false" aria-label="Abrir menú">${icon("menu")}</button>
            <a class="top-brand" href="index.html" aria-label="Dynadrill, inicio"><img src="assets/dynadrill.png" width="500" height="500" alt="Dynadrill"></a>
            <span class="topbar-divider" aria-hidden="true"></span>
            <div class="breadcrumbs"><span>Control SGI</span>${icon("chevron")}<strong>${esc(current)}</strong></div>
            <div class="top-actions">
              <form class="global-search" action="requisitos.html" method="get" role="search" aria-label="Buscar en la matriz">
                ${icon("search")}<label class="sr-only" for="global-query">Buscar requisito</label>
                <input id="global-query" name="q" placeholder="Buscar requisito…" required>
              </form>
              <a class="icon-button compact-search" href="requisitos.html" aria-label="Buscar requisitos">${icon("search")}</a>
              <a class="icon-button bell-link" href="obligaciones.html" aria-label="Obligaciones y alertas (${pending})">${icon("bell")}${pending ? '<span class="notification-dot" aria-hidden="true"></span>' : ""}</a>
              <span class="demo-label">Datos ficticios</span>
            </div>
          </header>
          <main id="content" class="content" tabindex="-1"></main>
        </div>
      </div>
      <div id="toast" class="toast" role="status" hidden></div>`;
  }

  function toggleMenu(open) {
    open = mobileNavigation.matches && open;
    document.body.classList.toggle("sidebar-open", open);
    const button = document.querySelector(".mobile-toggle");
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    const sidebar = document.querySelector(".sidebar");
    const main = document.querySelector(".app-main");
    sidebar.inert = mobileNavigation.matches && !open;
    main.inert = open;
    document.querySelector(".skip-link").inert = open;
    if (open) requestAnimationFrame(() => {
      if (document.body.classList.contains("sidebar-open")) sidebar.querySelector('[aria-current="page"]')?.focus();
    });
  }

  function bindShell() {
    const menuButton = document.querySelector(".mobile-toggle");
    function closeMenu() {
      toggleMenu(false);
      menuButton.focus();
    }
    menuButton.addEventListener("click", () => toggleMenu(!document.body.classList.contains("sidebar-open")));
    document.querySelector(".scrim").addEventListener("click", closeMenu);
    document.querySelector(".sidebar-close").addEventListener("click", closeMenu);
    document.addEventListener("keydown", event => {
      if (!document.body.classList.contains("sidebar-open")) return;
      if (event.key === "Escape") closeMenu();
      if (event.key !== "Tab") return;
      const menuLinks = [...document.querySelectorAll(".sidebar button, .sidebar a")];
      const first = menuLinks[0];
      const last = menuLinks.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    mobileNavigation.addEventListener("change", () => {
      const active = document.activeElement;
      const fromSidebar = active?.closest(".sidebar");
      const focusSidebar = active === menuButton || active?.classList.contains("sidebar-close");
      toggleMenu(false);
      if (mobileNavigation.matches && fromSidebar) menuButton.focus();
      if (!mobileNavigation.matches && focusSidebar) {
        document.querySelector('.sidebar [aria-current="page"]')?.focus();
      }
    });
    toggleMenu(false);
  }

  function render() {
    const main = document.getElementById("content");
    const modules = [window.SGI_RECORDS, window.SGI_TRACKING, window.SGI_AUDITS];
    const selected = modules.find(module => typeof module?.[page] === "function");
    let body;
    if (selected) body = selected[page](ctx);
    else if (page === "ayuda") body = help();
    else if (selectedStandard) body = window.SGI_STANDARDS.workspace(ctx, selectedStandard);
    else if (activePage === "resumen") body = dashboard();
    else body = window.SGI_STANDARDS.home(ctx, catalog);
    const notices = [
      !storageAvailable && "El almacenamiento está bloqueado. Los cambios de esta sesión podrían perderse al navegar.",
      storageRecovered && "La copia local está incompleta o dañada. Se abrió el escenario de demostración. Guardar un cambio reemplazará la copia dañada."
    ].filter(Boolean);
    main.innerHTML = `${notices.map(notice => `<p class="notice warning" role="status">${esc(notice)}</p>`).join("")}${body}`;
    if (selected) selected.bind?.(ctx, page);
    if (selectedStandard) window.SGI_STANDARDS.revealSelection(main);
    if (page === "ayuda") main.querySelector("#export-data").addEventListener("click", exportData);
    const pending = state.tasks.filter(task => ["Vencida", "Próxima a vencer"].includes(taskStatus(task).label)).length;
    const bell = document.querySelector(".bell-link");
    bell.setAttribute("aria-label", `Obligaciones y alertas (${pending})`);
    if (pending && !bell.querySelector(".notification-dot")) bell.insertAdjacentHTML("beforeend", '<span class="notification-dot" aria-hidden="true"></span>');
    if (!pending) bell.querySelector(".notification-dot")?.remove();
  }

  const ctx = {
    state, esc, icon, badge, heading, cardHeader, empty, button, siteName, processName, date, relativeDate,
    query, persist, render, commit, toast, addDays, dayOffset, daysRemaining, taskStatus, hasEvidence,
    documentCoverage, latestVersion, linkTo, standardLink, field, option, createId, number, localISO
  };
  if (selectedStandard) document.title = `ISO ${selectedStandard.number}:${selectedStandard.edition} · Control SGI`;
  else if (activePage === "resumen") document.title = "Resumen general · Control SGI";
  app.innerHTML = shell();
  bindShell();
  render();
  addEventListener("storage", event => {
    if ((event.key !== storeKey && event.key !== null) || document.querySelector("dialog[open]")) return;
    try {
      const latest = localStorage.getItem(storeKey);
      if (latest !== storageSnapshot) {
        refreshFromStorage(latest);
        storageAvailable = true;
        render();
      }
    } catch {
      // Keep the current view when this browser no longer exposes local storage.
    }
  });
})();
