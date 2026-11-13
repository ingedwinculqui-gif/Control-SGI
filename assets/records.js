(() => {
  "use strict";

  const standards = window.SGI_CATALOG.map(item => `ISO ${item.number}`);
  const stopWords = new Set("a al ante como con cual cuales cuando de del donde e el en es esta este fue hay la las lo los me mi nos o para por que quien se si sin sobre su sus un una y".split(" "));

  function normalized(text) {
    return String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function tokens(text) {
    return (normalized(text).match(/[a-z0-9]+(?:\.[0-9]+)*/g) || [])
      .filter(word => !stopWords.has(word) && word.length > 1);
  }

  function rank(requirement, query, ctx) {
    const terms = tokens(query);
    if (!terms.length) return 0;
    const key = tokens([requirement.id, requirement.standard, requirement.edition, requirement.clause, requirement.title,
      ...requirement.keywords].join(" "));
    const context = tokens([requirement.description, requirement.control, requirement.owner,
      requirement.indicator, ctx.siteName(requirement.site), ctx.processName(requirement.process)].join(" "));
    const match = (word, term) => word === term || (term.length > 4 && word.length > 4 &&
      /^[a-z]+$/.test(term) && /^[a-z]+$/.test(word) && word.slice(0, Math.min(word.length, term.length) - 1) === term.slice(0, Math.min(word.length, term.length) - 1));
    return terms.reduce((score, term) => score +
      (key.some(word => match(word, term)) ? 3 : context.some(word => match(word, term)) ? 1 : 0), 0);
  }

  function back(ctx, page, label) {
    return ctx.button(label, ctx.linkTo(page), { kind: "ghost", symbol: "arrow-left" });
  }

  function searchInput(ctx, name, label, value = "", placeholder = "") {
    return ctx.field(label, `<input class="input" type="search" name="${name}" value="${ctx.esc(value)}" placeholder="${ctx.esc(placeholder)}">`);
  }

  function select(ctx, name, label, values, selected, all) {
    return ctx.field(label, `<select class="select" name="${name}">${ctx.option("", all, selected)}${values.map(([value, text]) => ctx.option(value, text, selected)).join("")}</select>`);
  }

  function searchButton(ctx) {
    return `<button class="button button-secondary" type="submit">${ctx.icon("search")} Buscar</button>`;
  }

  function metadata(ctx, values) {
    return `<dl class="detail-list">${values.map(([label, value]) =>
      `<div><dt>${ctx.esc(label)}</dt><dd>${ctx.esc(value)}</dd></div>`).join("")}</dl>`;
  }

  function documentListLink(ctx, doc, version) {
    return `<a class="list-item" href="${ctx.esc(ctx.linkTo("documentos", { id: doc.id, ...(version ? { v: version.version } : {}) }))}">
      <span class="list-icon success">${ctx.icon("file")}</span>
      <span class="list-copy"><strong class="list-title">${ctx.esc(doc.title)}</strong>
      <span class="list-meta">${ctx.esc(doc.id)} · ${ctx.esc(doc.owner)}${version ? ` · v${ctx.esc(version.version)} · ${ctx.date(version.date)}` : ""}</span></span>
      ${version ? ctx.badge(version.status, versionTone(version.status)) : ctx.badge("Sin vigente", "warning")}${ctx.icon("chevron")}
    </a>`;
  }

  function requirementDetail(ctx, req) {
    const docs = req.evidence.map(id => ctx.state.documents.find(doc => doc.id === id)).filter(Boolean);
    const status = ctx.documentCoverage(req);
    const related = ctx.state.findings.filter(finding => finding.requirement === req.id);
    const validSource = /^https:\/\/www\.iso\.org\/standard\/[0-9]+$/.test(req.source);
    const standard = ctx.standardLink(req);
    return `
      ${back(ctx, "requisitos", "Volver a la matriz")}
      ${ctx.heading({ eyebrow: `${req.id} · ${req.standard}:${req.edition} · Cláusula ilustrativa ${req.clause}`, title: req.title,
        description: req.description, actions: status ? ctx.badge("Con evidencia vigente", "success") : ctx.badge("Falta evidencia vigente", "danger") })}
      <div class="detail-grid">
        <div class="detail-main stack">
          <section class="card">
            ${ctx.cardHeader("Aplicación en la operación", "Proceso, responsable y control para este alcance")}
            <div class="card-body">${metadata(ctx, [["Sede", ctx.siteName(req.site)], ["Proceso", ctx.processName(req.process)],
              ["Responsable", req.owner], ["Control", req.control], ["Indicador", req.indicator]])}</div>
          </section>
          <section class="card" id="evidencias">
            ${ctx.cardHeader("Evidencias vinculadas", "Abre el registro para ver contenido, fechas e historial",
              `<button class="button button-secondary" type="button" data-open="link-evidence">${ctx.icon("link")} Vincular evidencia</button>`)}
            <div class="card-body stack">
              ${docs.map(doc => documentListLink(ctx, doc, ctx.latestVersion(doc))).join("")}
              ${!status ? `<div class="notice warning"><p>Este requisito no tiene una versión vigente vinculada.</p>
              ${ctx.button("Registrar actividad de seguimiento", ctx.linkTo("obligaciones", { nuevo: 1, requisito: req.id }), { symbol: "plus" })}</div>` : ""}
            </div>
          </section>
        </div>
        <div class="detail-aside stack">
          <section class="card">
            ${ctx.cardHeader("Alcance y fuente")}
            <div class="card-body stack"><p>${ctx.esc(req.applicability)}</p>
              ${validSource ? `<a class="text-link" href="${ctx.esc(req.source)}" target="_blank" rel="noopener noreferrer">Abrir catálogo oficial ISO ${ctx.icon("external")}</a>` : ""}
              ${standard ? ctx.button(`Gestionar en ${req.standard}`, standard, { kind: "ghost", symbol: "layers" }) : ""}
              ${ctx.button("Ver proceso", ctx.linkTo("procesos", { id: req.process }), { kind: "ghost", symbol: "arrow-right", end: true })}
            </div>
          </section>
          ${related.length ? `<section class="card">${ctx.cardHeader("Hallazgos relacionados")}
            <div class="card-body stack">${related.map(finding => `<a class="text-link" href="${ctx.esc(ctx.linkTo("hallazgos", { id: finding.id }))}">${ctx.esc(finding.id)} · ${ctx.esc(finding.title)}</a>`).join("")}</div>
          </section>` : ""}
        </div>
      </div>
      <dialog class="dialog" id="link-evidence" aria-labelledby="link-title">
        <form class="dialog-inner" id="link-form" data-id="${ctx.esc(req.id)}">
          <div class="dialog-header"><div><h2 id="link-title">Vincular evidencia</h2><p class="muted">${ctx.esc(req.title)}</p></div>
          <button class="icon-button" type="button" data-close aria-label="Cerrar">${ctx.icon("x")}</button></div>
          ${select(ctx, "document", "Registro", ctx.state.documents.filter(doc => doc.site === req.site && doc.process === req.process && !req.evidence.includes(doc.id) && ctx.latestVersion(doc)).map(doc => [doc.id, `${doc.id} · ${doc.title}`]), "", "Selecciona una evidencia vigente del proceso")}
          <p class="form-error" data-error role="alert" hidden></p>
          <div class="form-actions"><button class="button button-ghost" type="button" data-close>Cancelar</button><button class="button button-primary" type="submit">Vincular</button></div>
        </form>
      </dialog>`;
  }

  function requisitos(ctx) {
    const id = ctx.query.get("id");
    if (id) {
      const requirement = ctx.state.requirements.find(entry => entry.id === id);
      return requirement ? requirementDetail(ctx, requirement) :
        ctx.empty("Requisito no encontrado", "Comprueba el identificador en la matriz.", back(ctx, "requisitos", "Volver a la matriz"));
    }
    const q = ctx.query.get("q")?.trim() || "";
    const standard = ctx.query.get("norma") || "";
    const site = ctx.query.get("sede") || "";
    const process = ctx.query.get("proceso") || "";
    const requestedStandard = normalized(q).match(/\b(?:iso\s+)?(9001|14001|45001|37001)\b/)?.[1];
    const requestedClause = tokens(q).find(term => /^\d+\.\d+(?:\.\d+)*$/.test(term));
    const results = ctx.state.requirements.filter(req =>
      (!standard || req.standard === standard) && (!site || req.site === site) &&
      (!process || req.process === process) &&
      (!requestedStandard || req.standard === `ISO ${requestedStandard}`) &&
      (!requestedClause || req.clause === requestedClause))
      .map(req => ({ req, score: q ? rank(req, q, ctx) : 1 }))
      .filter(result => result.score > 0).sort((a, b) => b.score - a.score);
    return `
      ${ctx.heading({ eyebrow: "Trazabilidad", title: "Matriz de requisitos", description: "Localiza la aplicación operativa y la evidencia vinculada. Las referencias de cláusula son ilustrativas." })}
      <section class="card">
        <form class="filters" action="requisitos.html" method="get" role="search" aria-label="Filtros de requisitos">
          ${searchInput(ctx, "q", "Pregunta, palabra clave o cláusula", q, "Ej. ¿Qué evidencia hay de los residuos?")}
          ${select(ctx, "norma", "Norma", standards.map(value => [value, value]), standard, "Todas")}
          ${select(ctx, "sede", "Sede", ctx.state.sites.map(item => [item.id, item.name]), site, "Todas")}
          ${process ? `<input type="hidden" name="proceso" value="${ctx.esc(process)}">` : ""}${searchButton(ctx)}
        </form>
      </section>
      <section class="card results-card">
        ${ctx.cardHeader(`Resultados · ${results.length}`, q ? `Coincidencias para «${q}»` : process ? ctx.processName(process) : "Requisitos y evidencias del escenario de demostración",
          q || site || standard || process ? ctx.button("Limpiar filtros", "requisitos.html", { kind: "ghost" }) : "")}
        ${results.length ? `<p class="table-scroll-hint">Desliza la tabla para ver todas las columnas. ${ctx.icon("arrow-right")}</p>
        <div class="table-wrap" tabindex="0" aria-label="Tabla desplazable de requisitos"><table>
          <thead><tr><th scope="col">Requisito</th><th scope="col">Referencia</th><th scope="col">Proceso y responsable</th><th scope="col">Evidencia</th></tr></thead>
          <tbody>${results.map(({ req }) => {
            const covered = ctx.documentCoverage(req);
            return `<tr>
              <td><a class="table-title" href="${ctx.esc(ctx.linkTo("requisitos", { id: req.id }))}">${ctx.esc(req.title)}</a><span class="table-meta">${ctx.esc(req.id)} · ${ctx.esc(ctx.siteName(req.site))}</span></td>
              <td>${ctx.badge(req.standard, "info")}<span class="table-meta">Ed. ${ctx.esc(req.edition)} · § ${ctx.esc(req.clause)}</span></td>
              <td><strong>${ctx.esc(ctx.processName(req.process))}</strong><span class="table-meta">${ctx.esc(req.owner)}</span></td>
              <td>${ctx.badge(covered ? "Vigente vinculada" : "Faltante", covered ? "success" : "danger")}</td>
            </tr>`;
          }).join("")}</tbody>
        </table></div>` : ctx.empty("Sin coincidencias", "Prueba con un término del control, otra cláusula o una sede distinta.")}
      </section>`;
  }

  function procesos(ctx) {
    const current = ctx.query.get("id");
    const site = ctx.query.get("sede") || "";
    const visible = ctx.state.processes.filter(item => (!current || current === item.id) && (!site || site === item.site));
    return `
      ${current ? back(ctx, "procesos", "Volver a procesos") : ""}
      ${ctx.heading({ eyebrow: "Operación", title: current && visible[0] ? visible[0].name : "Procesos y sedes",
        description: "Consulta quién responde por el proceso y qué requisitos y registros tiene vinculados." })}
      ${current ? "" : `<div class="tab-bar" aria-label="Filtrar por sede">
        ${[["", "Todas las sedes"], ...ctx.state.sites.map(item => [item.id, item.name])].map(([id, label]) =>
          `<a class="tab-link" ${id === site ? 'aria-current="true"' : ""} href="${ctx.esc(ctx.linkTo("procesos", id ? { sede: id } : {}))}">${ctx.esc(label)}</a>`).join("")}
      </div>`}
      ${visible.length ? `<div class="record-grid">${visible.map(process => {
        const requirements = ctx.state.requirements.filter(req => req.process === process.id);
        const docs = ctx.state.documents.filter(doc => doc.process === process.id);
        return `<article class="record-card">
          <div class="record-meta">${ctx.badge(ctx.siteName(process.site), "info")}</div>
          <h2>${ctx.esc(process.name)}</h2><p class="muted">${ctx.esc(process.owner)}</p>
          ${metadata(ctx, [["Requisitos", requirements.length], ["Con evidencia vigente", requirements.filter(ctx.documentCoverage).length], ["Registros", docs.length]])}
          <div class="form-actions">
          ${ctx.button("Ver requisitos", ctx.linkTo("requisitos", { proceso: process.id }), { symbol: "arrow-right", end: true })}
          ${ctx.button("Ver registros", ctx.linkTo("documentos", { proceso: process.id }), { kind: "ghost", symbol: "file" })}
          </div>
        </article>`;
      }).join("")}</div>` : ctx.empty("Proceso no encontrado", "Consulta los procesos de todas las sedes.", back(ctx, "procesos", "Ver procesos"))}`;
  }

  function versionTone(status) {
    return status === "Vigente" ? "success" : status === "En revisión" ? "warning" : "neutral";
  }

  function input(ctx, name, label, value = "", attributes = "") {
    return ctx.field(label, `<input class="input" name="${name}" value="${ctx.esc(value)}" ${attributes}>`);
  }

  function documentForm(ctx, doc) {
    const processOptions = ctx.state.processes.map(process => [process.id, `${ctx.siteName(process.site)} · ${process.name}`]);
    return `<dialog class="dialog" id="document-editor" aria-labelledby="document-editor-title">
      <form class="dialog-inner" id="document-form"${doc ? ` data-id="${ctx.esc(doc.id)}"` : ""}>
        <div class="dialog-header"><div><h2 id="document-editor-title">${doc ? "Registrar versión" : "Registrar documento o evidencia"}</h2>
        <p class="muted">${doc ? ctx.esc(doc.title) : "Usa un registro ficticio para probar el flujo."}</p></div>
        <button class="icon-button" type="button" data-close aria-label="Cerrar">${ctx.icon("x")}</button></div>
        <div class="form-grid">
          ${doc ? "" : `${input(ctx, "title", "Título", "", 'required maxlength="160"')}
          ${select(ctx, "type", "Tipo", ["Procedimiento", "Registro", "Matriz", "Informe", "Acta", "Otro"].map(value => [value, value]), "Registro", "Seleccionar tipo")}
          ${select(ctx, "process", "Proceso y sede", processOptions, "", "Seleccionar proceso")}
          ${input(ctx, "owner", "Responsable del registro", "", 'required maxlength="100"')}`}
          ${input(ctx, "version", "Versión", doc ? "" : "1.0", 'required maxlength="24" placeholder="Ej. 1.2"')}
          ${input(ctx, "date", "Fecha de ejecución o vigencia", ctx.localISO(), 'type="date" required')}
          ${input(ctx, "by", "Autor o revisor", "", 'required maxlength="100"')}
          ${select(ctx, "status", "Estado", [["En revisión", "En revisión"], ["Vigente", "Vigente"]], "En revisión", "Seleccionar estado")}
        </div>
        ${ctx.field("Motivo o notas de la versión", '<textarea class="input" name="notes" rows="2" maxlength="1000" required></textarea>')}
        ${ctx.field("Contenido del registro", '<textarea class="input" name="content" rows="6" maxlength="20000" required></textarea>')}
        <p class="form-error" data-error role="alert" hidden></p>
        <div class="form-actions"><button class="button button-ghost" type="button" data-close>Cancelar</button><button class="button button-primary" type="submit">Guardar versión</button></div>
      </form>
    </dialog>`;
  }

  function documentDetail(ctx, doc) {
    const selected = ctx.query.get("v");
    const version = selected ? doc.versions.find(item => item.version === selected) : ctx.latestVersion(doc) || doc.versions[0];
    const related = ctx.state.requirements.filter(req => req.evidence.includes(doc.id));
    const origin = related.find(req => req.id === ctx.query.get("desde"));
    const standard = origin && ctx.standardLink(origin);
    return `
      ${standard ? ctx.button(`Volver a ${origin.standard}`, standard + "#documentos-asociados", { kind: "ghost", symbol: "arrow-left" })
        : back(ctx, "documentos", "Volver a documentos")}
      ${ctx.heading({ eyebrow: `${doc.id} · ${doc.type}`, title: doc.title, description: `${ctx.siteName(doc.site)} · ${ctx.processName(doc.process)}`,
        actions: `<button type="button" class="button button-secondary" data-open="document-editor">${ctx.icon("plus")} Registrar versión</button>` })}
      <div class="detail-grid">
        <div class="detail-main stack">
          <section class="card">
            ${ctx.cardHeader(version ? `Versión ${version.version}` : "Versión no encontrada", version ? "Contenido del registro seleccionado" : "Abre una versión disponible en el historial",
              version ? ctx.badge(version.status, versionTone(version.status)) : "")}
            <div class="card-body stack">
              ${version ? `${metadata(ctx, [["Responsable del registro", doc.owner], ["Autor o revisor", version.by],
                ["Ejecución o vigencia", ctx.date(version.date)], ["Fecha de carga", ctx.date(version.uploaded)], ["Notas", version.notes]])}
                <article class="document-content" aria-label="Contenido de la evidencia">${ctx.esc(version.content)}</article>
                <button class="button button-secondary" type="button" data-download="${ctx.esc(version.version)}" data-document="${ctx.esc(doc.id)}">${ctx.icon("download")} Descargar contenido</button>` : ""}
            </div>
          </section>
          ${related.length ? `<section class="card">${ctx.cardHeader("Requisitos que enlazan este registro")}
          <div class="card-body stack">${related.map(req => `<a class="text-link" href="${ctx.esc(ctx.linkTo("requisitos", { id: req.id }))}">${ctx.esc(req.id)} · ${ctx.esc(req.title)}</a>`).join("")}</div></section>` : ""}
        </div>
        <section class="card detail-aside" id="historial">
          ${ctx.cardHeader("Historial de versiones", "Selecciona la revisión que quieres consultar")}
          <div class="card-body timeline">
            ${doc.versions.map(item => `<a class="timeline-item list-item" href="${ctx.esc(ctx.linkTo("documentos", { id: doc.id, v: item.version, ...(origin ? { desde: origin.id } : {}) }))}"${item === version ? ' aria-current="true"' : ""}>
              <span class="list-icon ${versionTone(item.status)}">${ctx.icon("history")}</span>
              <span class="list-copy"><strong class="list-title">Versión ${ctx.esc(item.version)}</strong><span class="list-meta">${ctx.date(item.date)} · ${ctx.esc(item.by)}</span>${ctx.badge(item.status, versionTone(item.status))}</span>
            </a>`).join("")}
          </div>
        </section>
      </div>
      ${documentForm(ctx, doc)}`;
  }

  function documentos(ctx) {
    const id = ctx.query.get("id");
    if (id) {
      const doc = ctx.state.documents.find(item => item.id === id);
      return doc ? documentDetail(ctx, doc) : ctx.empty("Documento no encontrado", "Comprueba el código del registro.", back(ctx, "documentos", "Ver documentos"));
    }
    const q = ctx.query.get("q")?.trim() || "";
    const site = ctx.query.get("sede") || "";
    const process = ctx.query.get("proceso") || "";
    const list = ctx.state.documents.filter(doc => (!site || site === doc.site) && (!process || process === doc.process) &&
      (!q || normalized([doc.id, doc.title, doc.type, doc.owner, ctx.processName(doc.process)].join(" ")).includes(normalized(q))));
    return `
      ${ctx.heading({ eyebrow: "Información documentada", title: "Documentos y evidencias", description: "Abre el registro vigente o consulta una versión del historial.",
        actions: `<button type="button" class="button button-primary" data-open="document-editor">${ctx.icon("plus")} Registrar documento</button>` })}
      <section class="card"><form class="filters" action="documentos.html" method="get" role="search" aria-label="Filtros documentales">
        ${searchInput(ctx, "q", "Buscar registros", q, "Título, responsable o código")}
        ${select(ctx, "sede", "Sede", ctx.state.sites.map(item => [item.id, item.name]), site, "Todas las sedes")}
        ${process ? `<input type="hidden" name="proceso" value="${ctx.esc(process)}">` : ""}${searchButton(ctx)}
      </form></section>
      <section class="card results-card">
        ${ctx.cardHeader(`Registros · ${list.length}`, process ? ctx.processName(process) : "", q || site || process ? ctx.button("Limpiar filtros", "documentos.html", { kind: "ghost" }) : "")}
        <div class="card-body stack">
          ${list.map(doc => documentListLink(ctx, doc, ctx.latestVersion(doc))).join("") ||
            ctx.empty("Sin registros", "Prueba con otro nombre, código o sede.")}
        </div>
      </section>
      ${documentForm(ctx)}`;
  }

  function formValues(form) {
    return Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, value.trim()]));
  }

  function showError(form, message) {
    const element = form.querySelector("[data-error]");
    element.textContent = message;
    element.hidden = false;
  }

  function bind(ctx) {
    const main = document.getElementById("content");
    main.querySelectorAll("[data-open]").forEach(button => button.addEventListener("click", () =>
      document.getElementById(button.dataset.open)?.showModal()));
    main.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
    main.querySelector("#link-form")?.addEventListener("submit", event => {
      event.preventDefault();
      const form = event.currentTarget;
      const requirement = ctx.state.requirements.find(req => req.id === form.dataset.id);
      const doc = ctx.state.documents.find(item => item.id === formValues(form).document);
      if (!doc || doc.site !== requirement.site || doc.process !== requirement.process || !ctx.latestVersion(doc) || requirement.evidence.includes(doc.id)) {
        return showError(form, "Selecciona un registro vigente del mismo proceso y sede que aún no esté vinculado.");
      }
      requirement.evidence.push(doc.id);
      form.closest("dialog").close();
      ctx.commit("Evidencia vinculada.");
      main.querySelector('[data-open="link-evidence"]')?.focus();
    });
    main.querySelector("#document-form")?.addEventListener("submit", event => {
      event.preventDefault();
      const form = event.currentTarget;
      const values = formValues(form);
      const previous = ctx.state.documents.find(doc => doc.id === form.dataset.id);
      const process = ctx.state.processes.find(item => item.id === values.process);
      if ((!previous && (!process || !values.title || !values.owner || !values.type)) ||
        !values.version || !values.by || !values.notes || !values.content ||
        !Number.isFinite(ctx.dayOffset(values.date)) || !["Vigente", "En revisión"].includes(values.status)) {
        return showError(form, "Completa los campos y selecciona un proceso y un estado válidos.");
      }
      if (previous?.versions.some(item => item.version === values.version)) {
        return showError(form, "Esta versión ya existe. Usa un identificador de versión diferente.");
      }
      if (values.status === "Vigente" && values.date > ctx.localISO()) {
        return showError(form, "Una versión con fecha futura debe registrarse en revisión.");
      }
      const doc = previous || {
        id: ctx.createId("DOC", ctx.state.documents), title: values.title, type: values.type,
        process: process.id, site: process.site, owner: values.owner, versions: []
      };
      if (values.status === "Vigente") {
        doc.versions.filter(item => item.status === "Vigente").forEach(item => { item.status = "Histórica"; });
      }
      doc.versions.unshift({
        version: values.version, date: values.date, uploaded: ctx.localISO(), status: values.status,
        by: values.by, notes: values.notes, content: values.content
      });
      if (!previous) ctx.state.documents.push(doc);
      form.closest("dialog").close();
      const saved = ctx.commit("Versión registrada.");
      if (saved) {
        const origin = ctx.state.requirements.find(req => req.id === ctx.query.get("desde") && req.evidence.includes(doc.id));
        location.assign(ctx.linkTo("documentos", { id: doc.id, v: values.version, ...(origin ? { desde: origin.id } : {}) }));
      }
    });
    main.querySelector("[data-download]")?.addEventListener("click", event => {
      const { document: id, download: version } = event.currentTarget.dataset;
      const record = ctx.state.documents.find(item => item.id === id);
      const entry = record?.versions.find(item => item.version === version);
      if (!entry) return;
      const url = URL.createObjectURL(new Blob([entry.content], { type: "text/plain;charset=utf-8" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${id}-v${version.replace(/[^a-zA-Z0-9._-]/g, "_")}.txt`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  window.SGI_RECORDS = { requisitos, procesos, documentos, bind };
})();
