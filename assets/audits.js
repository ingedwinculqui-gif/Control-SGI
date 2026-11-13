(function () {
  'use strict';

  const auditStates = ['Programada', 'En curso', 'Cerrada'];
  const findingStages = ['Abierto', 'En ejecución', 'Por verificar', 'Eficaz', 'Reabierto'];
  const auditTypes = ['Interna', 'Externa', 'Certificación', 'Seguimiento'];
  const classifications = ['No conformidad mayor', 'No conformidad menor', 'Observación', 'Oportunidad de mejora'];
  const severity = {
    Programada: 'info', 'En curso': 'warning', Cerrada: 'success',
    Abierto: 'danger', 'En ejecución': 'info', 'Por verificar': 'warning',
    Eficaz: 'success', Reabierto: 'danger'
  };
  const transitions = {
    Abierto: [{ stage: 'En ejecución', label: 'Iniciar acción', icon: 'clock' }],
    'En ejecución': [{ stage: 'Por verificar', label: 'Registrar ejecución', icon: 'check' }],
    'Por verificar': [
      { stage: 'Eficaz', label: 'Registrar eficacia', icon: 'check' },
      { stage: 'Reabierto', label: 'Registrar ineficacia', icon: 'alert' }
    ],
    Eficaz: [{ stage: 'Reabierto', label: 'Reabrir hallazgo', icon: 'history' }],
    Reabierto: [{ stage: 'En ejecución', label: 'Reanudar acción', icon: 'clock' }]
  };
  const auditURL = 'auditorias.html';
  const findingURL = 'hallazgos.html';

  function link(page, id) {
    return page + '?id=' + encodeURIComponent(id);
  }

  function badge(ctx, label) {
    return ctx.badge(label, severity[label] || 'neutral');
  }

  function button(ctx, label, style, action, icon, id, stage) {
    return '<button type="button" class="button button-' + style + '" data-audit-action="' + action +
      '"' + (id ? ' data-record-id="' + ctx.esc(id) + '"' : '') +
      (stage ? ' data-next-stage="' + ctx.esc(stage) + '"' : '') +
      '>' + ctx.icon(icon) + '<span>' + ctx.esc(label) + '</span></button>';
  }

  function options(ctx, values, selected) {
    return values.map(function (entry) {
      const value = Array.isArray(entry) ? entry[0] : entry;
      const label = Array.isArray(entry) ? entry[1] : entry;
      return ctx.option(value, label, selected);
    }).join('');
  }

  function filters(ctx, states, siteEnabled, placeholder) {
    return '<form class="filters" data-audit-filters role="search" aria-label="Filtrar registros">' +
      '<label class="field"><span>Buscar</span><input class="input" type="search" name="text" placeholder="' +
      ctx.esc(placeholder) + '"></label>' +
      '<label class="field"><span>Estado</span><select class="select" name="stage">' +
      options(ctx, [['', 'Todos los estados']].concat(states), '') + '</select></label>' +
      (siteEnabled ? '<label class="field"><span>Sede</span><select class="select" name="site">' +
      options(ctx, [['', 'Todas las sedes']].concat(ctx.state.sites.map(function (site) {
        return [site.id, site.name];
      })), '') + '</select></label>' : '') + '</form>';
  }

  function empty(ctx, text, hidden) {
    return '<p class="empty-state"' + (hidden ? ' data-audit-empty hidden' : '') + '>' + ctx.esc(text) + '</p>';
  }

  function auditCard(ctx, audit) {
    const findings = ctx.state.findings.filter(function (finding) { return finding.audit === audit.id; });
    const remaining = findings.filter(function (finding) { return finding.stage !== 'Eficaz'; }).length;
    const site = ctx.siteName(audit.site);
    const name = ctx.esc(audit.title);
    const search = [audit.id, audit.title, audit.scope, audit.owner, audit.type, site].join(' ');
    return '<article class="card record-card" data-audit-row data-search="' + ctx.esc(search) +
      '" data-stage="' + ctx.esc(audit.status) + '" data-site="' + ctx.esc(audit.site) + '">' +
      '<div class="card-header"><div><div class="record-meta">' + ctx.esc(audit.id) + ' · ' +
      ctx.esc(audit.type) + '</div><h2 class="card-title"><a class="text-link" href="' +
      link(auditURL, audit.id) + '">' + name + '</a></h2></div>' + badge(ctx, audit.status) + '</div>' +
      '<div class="card-body stack"><p>' + ctx.esc(audit.scope) + '</p><div class="record-meta">' +
      ctx.icon('calendar') + ctx.esc(recordDate(ctx, audit)) + ' · ' + ctx.esc(site) + '</div>' +
      '<div class="record-meta">' + ctx.esc(audit.owner) + ' · ' + remaining + ' de ' + findings.length +
      ' hallazgos por resolver</div><a class="button button-ghost button-small" href="' +
      link(auditURL, audit.id) + '">Ver auditoría' + ctx.icon('arrow-right') + '</a></div></article>';
  }

  function recordDate(ctx, record) {
    return record.dueDate ? ctx.date(record.dueDate) : ctx.relativeDate(record.days);
  }

  function renderAudits(ctx) {
    const selected = ctx.query.get('id');
    const audit = ctx.state.audits.find(function (record) { return record.id === selected; });
    if (audit) return renderAuditDetail(ctx, audit);
    const heading = ctx.heading({
      title: 'Auditorías',
      description: 'Consulta el programa, los criterios evaluados y los hallazgos de cada auditoría.',
      actions: button(ctx, 'Nueva auditoría', 'primary', 'new-audit', 'plus')
    });
    return heading + (selected ? empty(ctx, 'La auditoría solicitada no está disponible.') : '') +
      filters(ctx, auditStates, true, 'Buscar por auditoría o responsable') +
      '<div class="record-grid">' + ctx.state.audits.map(function (record) {
        return auditCard(ctx, record);
      }).join('') + '</div>' +
      empty(ctx, 'No hay auditorías que coincidan con los filtros.', ctx.state.audits.length > 0);
  }

  function listItem(ctx, title, meta, href, icon, tail) {
    return '<div class="list-item"><span class="list-icon">' + ctx.icon(icon) + '</span>' +
      '<div class="list-copy"><a class="list-title text-link" href="' + href + '">' +
      ctx.esc(title) + '</a>' + (meta ? '<p class="list-meta">' + ctx.esc(meta) + '</p>' : '') +
      '</div>' + (tail || '') + '</div>';
  }

  function item(ctx, label, value) {
    return '<div><dt>' + ctx.esc(label) + '</dt><dd>' + ctx.esc(value || 'Por registrar') + '</dd></div>';
  }

  function section(ctx, title, content, subtitle) {
    return '<section class="card"><div class="card-header"><div><h2 class="card-title">' +
      ctx.esc(title) + '</h2>' + (subtitle ? '<p class="card-subtitle">' + ctx.esc(subtitle) + '</p>' : '') +
      '</div></div><div class="card-body stack">' + content + '</div></section>';
  }

  function renderAuditDetail(ctx, audit) {
    const auditFindings = ctx.state.findings.filter(function (finding) { return finding.audit === audit.id; });
    const criteria = (audit.criteria || []).map(function (id) {
      return ctx.state.requirements.find(function (requirement) { return requirement.id === id; });
    }).filter(Boolean);
    const title = ctx.heading({
      eyebrow: audit.id,
      title: audit.title,
      description: audit.scope,
      actions: button(ctx, 'Editar auditoría', 'secondary', 'edit-audit', 'edit', audit.id) +
        button(ctx, 'Nuevo hallazgo', 'primary', 'new-finding', 'plus', audit.id)
    });
    const criteriaItems = criteria.length ? criteria.map(function (requirement) {
      return listItem(ctx, requirement.title, [requirement.standard, requirement.edition, 'Cláusula ' +
        requirement.clause].join(' · '), link('requisitos.html', requirement.id), 'clipboard');
    }).join('') : empty(ctx, 'Aún no se han vinculado criterios a esta auditoría.');
    const findingItems = auditFindings.length ? auditFindings.map(function (finding) {
      return listItem(ctx, finding.title, finding.id + ' · ' + finding.classification,
        link(findingURL, finding.id), 'alert', badge(ctx, finding.stage));
    }).join('') : empty(ctx, 'Aún no hay hallazgos vinculados a esta auditoría.');
    const record = '<dl class="detail-list">' + item(ctx, 'Estado', audit.status) +
      item(ctx, 'Tipo', audit.type) + item(ctx, 'Sede', ctx.siteName(audit.site)) +
      item(ctx, 'Fecha programada', recordDate(ctx, audit)) +
      item(ctx, 'Responsable', audit.owner) + '</dl>';
    const sample = '<dl class="detail-list">' + item(ctx, 'Muestra', audit.sample) +
      item(ctx, 'Resultados', audit.result) + '</dl>';
    return '<a class="text-link" href="' + auditURL + '">Volver al programa</a>' + title +
      '<div class="detail-grid"><div class="detail-main stack">' +
      section(ctx, 'Criterios evaluados', criteriaItems) + section(ctx, 'Hallazgos', findingItems) +
      section(ctx, 'Muestra y resultados', sample) + '</div><aside class="detail-aside">' +
      section(ctx, 'Datos de la auditoría', record) + '</aside></div>';
  }

  function findingCard(ctx, finding) {
    const audit = ctx.state.audits.find(function (record) { return record.id === finding.audit; });
    const search = [finding.id, finding.title, finding.classification, finding.owner,
      finding.observation, audit && audit.title].join(' ');
    return '<article class="card record-card" data-audit-row data-search="' + ctx.esc(search) +
      '" data-stage="' + ctx.esc(finding.stage) + '">' +
      '<div class="card-header"><div><div class="record-meta">' + ctx.esc(finding.id) + ' · ' +
      ctx.esc(finding.classification) + '</div><h2 class="card-title"><a class="text-link" href="' +
      link(findingURL, finding.id) + '">' + ctx.esc(finding.title) + '</a></h2></div>' +
      badge(ctx, finding.stage) + '</div><div class="card-body stack"><p>' +
      ctx.esc(finding.observation) + '</p><div class="record-meta">' + ctx.esc(finding.owner) +
      ' · ' + ctx.icon('calendar') + ctx.esc(recordDate(ctx, finding)) + '</div>' +
      '<a class="button button-ghost button-small" href="' + link(findingURL, finding.id) +
      '">Ver hallazgo' + ctx.icon('arrow-right') + '</a></div></article>';
  }

  function renderFindings(ctx) {
    const selected = ctx.query.get('id');
    const finding = ctx.state.findings.find(function (record) { return record.id === selected; });
    if (finding) return renderFindingDetail(ctx, finding);
    const auditId = ctx.query.get('audit');
    const audit = ctx.state.audits.find(function (record) { return record.id === auditId; });
    const records = audit ? ctx.state.findings.filter(function (record) {
      return record.audit === audit.id;
    }) : ctx.state.findings;
    return ctx.heading({
      title: 'Hallazgos y acciones',
      description: audit ? 'Hallazgos de ' + audit.title + '.' :
        'Da seguimiento a la causa, la acción correctiva y su verificación de eficacia.',
      actions: button(ctx, 'Nuevo hallazgo', 'primary', 'new-finding', 'plus', audit && audit.id)
    }) + (selected ? empty(ctx, 'El hallazgo solicitado no está disponible.') : '') +
      (audit ? '<a class="text-link" href="' + findingURL + '">Ver todos los hallazgos</a>' : '') +
      filters(ctx, findingStages, false, 'Buscar por hallazgo o responsable') +
      '<div class="record-grid">' + records.map(function (record) {
        return findingCard(ctx, record);
      }).join('') + '</div>' + empty(ctx, 'No hay hallazgos que coincidan con los filtros.', records.length > 0);
  }

  function evidenceLink(ctx, id, version) {
    const document = ctx.state.documents.find(function (record) { return record.id === id; });
    if (!document) return id ? empty(ctx, 'El documento ' + id + ' no está disponible.') : '';
    if (version && !document.versions.some(function (entry) { return entry.version === version; })) {
      return empty(ctx, 'La versión ' + version + ' de ' + id + ' no está disponible.');
    }
    const url = link('documentos.html', document.id) + (version ? '&amp;v=' + encodeURIComponent(version) : '');
    const meta = document.id + (version ? ' · Versión ' + version : ' · Versión por confirmar');
    return listItem(ctx, document.title, meta, url, 'file');
  }

  function renderFindingDetail(ctx, finding) {
    const audit = ctx.state.audits.find(function (record) { return record.id === finding.audit; });
    const requirement = ctx.state.requirements.find(function (record) { return record.id === finding.requirement; });
    const choices = transitions[finding.stage] || [];
    const heading = ctx.heading({
      eyebrow: finding.id,
      title: finding.title,
      description: finding.classification,
      actions: button(ctx, 'Editar hallazgo', 'secondary', 'edit-finding', 'edit', finding.id) +
        choices.map(function (transition, index) {
          return button(ctx, transition.label, index ? 'secondary' : 'primary', 'transition',
            transition.icon, finding.id, transition.stage);
        }).join('')
    });
    const observation = '<dl class="detail-list">' + item(ctx, 'Condición observada', finding.observation) +
      item(ctx, 'Evidencia objetiva', finding.objectiveEvidence) + '</dl>' +
      evidenceLink(ctx, finding.evidence, finding.evidenceVersion);
    const plan = '<dl class="detail-list">' + item(ctx, 'Corrección inmediata', finding.correction) +
      item(ctx, 'Análisis de causa', finding.cause) + item(ctx, 'Acción correctiva', finding.action) + '</dl>';
    const execution = '<dl class="detail-list">' + item(ctx, 'Registro de ejecución', finding.execution) +
      item(ctx, 'Fecha de ejecución', finding.executionDate && ctx.date(finding.executionDate)) +
      item(ctx, 'Responsable', finding.executor || finding.owner) + '</dl>' +
      evidenceLink(ctx, finding.executionDocument, finding.executionDocumentVersion);
    const verification = '<dl class="detail-list">' + item(ctx, 'Criterio de eficacia', finding.criterion) +
      item(ctx, 'Periodo observado', finding.observationPeriod) + item(ctx, 'Verificador', finding.verifier) +
      item(ctx, 'Fecha de verificación', finding.verificationDate && ctx.date(finding.verificationDate)) +
      item(ctx, 'Muestra o evidencia de verificación', finding.verificationEvidence) +
      item(ctx, 'Resultado', finding.verification || 'Pendiente de verificación') + '</dl>' +
      evidenceLink(ctx, finding.verificationDocument, finding.verificationDocumentVersion);
    const summary = badge(ctx, finding.stage) + '<dl class="detail-list">' +
      item(ctx, 'Responsable', finding.owner) + item(ctx, 'Plazo de la acción', recordDate(ctx, finding)) +
      item(ctx, 'Sede', audit && ctx.siteName(audit.site)) +
      item(ctx, 'Proceso', requirement && ctx.processName(requirement.process)) +
      (finding.reopenReason ? item(ctx, 'Motivo de reapertura', finding.reopenReason) : '') + '</dl>';
    const trace = (audit ? listItem(ctx, audit.title, audit.id, link(auditURL, audit.id), 'clipboard') : '') +
      (requirement ? listItem(ctx, requirement.title, [requirement.standard, requirement.edition,
        'Cláusula ' + requirement.clause].join(' · '), link('requisitos.html', requirement.id), 'link') : '');
    return '<a class="text-link" href="' + findingURL + '">Volver a hallazgos</a>' + heading +
      '<div class="detail-grid"><div class="detail-main stack">' +
      section(ctx, 'Hallazgo y evidencia objetiva', observation) + section(ctx, 'Plan de acción', plan) +
      section(ctx, 'Ejecución de la acción', execution) + section(ctx, 'Verificación de eficacia', verification) +
      section(ctx, 'Historial de cambios', history(ctx, finding)) + '</div><aside class="detail-aside stack">' +
      section(ctx, 'Seguimiento', summary) + section(ctx, 'Registros vinculados',
        trace || empty(ctx, 'No hay registros vinculados.')) + '</aside></div>';
  }

  function history(ctx, finding) {
    if (!finding.history || !finding.history.length) {
      return empty(ctx, 'Las transiciones que registres aparecerán aquí.');
    }
    const latestFirst = finding.history.slice().reverse().sort(function (a, b) {
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
    return '<ol class="timeline">' + latestFirst.map(function (change) {
      const date = change.date ? ctx.date(change.date) : '';
      const details = change.details || [];
      const detailList = details.length ? '<dl class="detail-list">' + details.map(function (detail) {
        return item(ctx, detail.label, detail.value);
      }).join('') + '</dl>' : '';
      return '<li class="timeline-item"><div>' + badge(ctx, change.stage) +
        '<p class="list-meta">' + ctx.esc([date, change.actor].filter(Boolean).join(' · ')) +
        '</p><p>' + ctx.esc(change.note) + '</p>' + detailList +
        evidenceLink(ctx, change.document, change.version) + '</div></li>';
    }).join('') + '</ol>';
  }

  function field(ctx, label, name, value, config) {
    const settings = config || {};
    const required = settings.required ? ' required' : '';
    const disabled = settings.disabled ? ' disabled' : '';
    let control;
    if (settings.options) {
      control = '<select class="select" name="' + name + '"' + required + disabled + '>' +
        options(ctx, settings.options, value) + '</select>';
    } else if (settings.long) {
      control = '<textarea class="input" name="' + name + '" rows="3" maxlength="1000"' + required + disabled + '>' +
        ctx.esc(value || '') + '</textarea>';
    } else {
      control = '<input class="input" type="' + (settings.type || 'text') + '" name="' + name +
        '" value="' + ctx.esc(value || '') + '" maxlength="160"' + required + disabled + '>';
    }
    return ctx.field(label, control);
  }

  function formDate(ctx, record) {
    return record.dueDate || (Number.isFinite(record.days) ? ctx.addDays(record.days) : ctx.localISO());
  }

  function auditFields(ctx, audit) {
    const availableTypes = audit.type && !auditTypes.includes(audit.type) ? auditTypes.concat(audit.type) : auditTypes;
    const criteria = ctx.state.requirements.map(function (requirement) {
      const checked = (audit.criteria || []).includes(requirement.id) ? ' checked' : '';
      return '<label><input type="checkbox" name="criteria" value="' + ctx.esc(requirement.id) + '"' +
        checked + '> ' + ctx.esc([requirement.standard, requirement.title, ctx.siteName(requirement.site)].join(' · ')) + '</label>';
    }).join('');
    return '<div class="form-grid">' +
      field(ctx, 'Nombre de auditoría', 'title', audit.title, { required: true }) +
      field(ctx, 'Tipo', 'type', audit.type, { options: availableTypes }) +
      field(ctx, 'Sede', 'site', audit.site, { options: ctx.state.sites.map(function (site) {
        return [site.id, site.name];
      }), required: true }) +
      field(ctx, 'Responsable', 'owner', audit.owner, { required: true }) +
      field(ctx, 'Fecha programada', 'dueDate', formDate(ctx, audit), { type: 'date', required: true }) +
      field(ctx, 'Estado', 'status', audit.status, { options: auditStates }) + '</div>' +
      field(ctx, 'Alcance', 'scope', audit.scope, { long: true, required: true }) +
      '<fieldset class="field"><legend>Criterios evaluados</legend>' + criteria + '</fieldset>' +
      field(ctx, 'Muestra', 'sample', audit.sample, { long: true }) +
      field(ctx, 'Resultados', 'result', audit.result, { long: true });
  }

  function requirementOptions(ctx, auditId) {
    const audit = ctx.state.audits.find(function (record) { return record.id === auditId; });
    const available = ctx.state.requirements.filter(function (requirement) {
      return audit && requirement.site === audit.site &&
        (!audit.criteria || !audit.criteria.length || audit.criteria.includes(requirement.id));
    }).map(function (requirement) {
      return [requirement.id, requirement.standard + ' · ' + requirement.title];
    });
    return [['', 'Selecciona un requisito']].concat(available);
  }

  function documentOptions(ctx, requirementId, existing) {
    const requirement = ctx.state.requirements.find(function (entry) { return entry.id === requirementId; });
    const scoped = ctx.state.documents.filter(function (document) {
      return requirement && document.site === requirement.site && document.process === requirement.process;
    });
    const choices = [['', 'Sin documento vinculado']].concat(scoped.flatMap(function (document) {
      return document.versions.map(function (version) {
        return [
          JSON.stringify([document.id, version.version]),
          document.title + ' · ' + version.version + ' (' + version.status + ')'
        ];
      });
    }));
    if (existing && !choices.some(function (option) { return option[0] === existing; })) {
      const [id, version] = JSON.parse(existing);
      const document = ctx.state.documents.find(function (entry) { return entry.id === id; });
      const label = [document ? document.title : id, version ? 'Versión ' + version : 'Versión por confirmar',
        'Vínculo previo'].join(' · ');
      choices.push([existing, label]);
    }
    return choices;
  }

  function documentValue(record, key) {
    return record[key] ? JSON.stringify([record[key], record[key + 'Version'] || '']) : '';
  }

  function documentField(ctx, label, name, record, key) {
    const existing = documentValue(record, key);
    return field(ctx, label, name, existing, { options: documentOptions(ctx, record.requirement, existing) });
  }

  function setDocument(ctx, values, key, encoded, requirementId, existing) {
    if (!documentOptions(ctx, requirementId, existing).some(function (option) { return option[0] === encoded; })) {
      return false;
    }
    const [document, version] = encoded ? JSON.parse(encoded) : ['', ''];
    values[key] = document;
    values[key + 'Version'] = version;
    return true;
  }

  function findingFields(ctx, finding) {
    const availableClasses = finding.classification && !classifications.includes(finding.classification) ?
      classifications.concat(finding.classification) : classifications;
    const lockedPlan = ['Por verificar', 'Eficaz'].includes(finding.stage);
    return '<div class="form-grid">' +
      field(ctx, 'Auditoría', 'audit', finding.audit, {
        required: true,
        disabled: Boolean(finding.id),
        options: [['', 'Selecciona una auditoría']].concat(ctx.state.audits.map(function (audit) {
          return [audit.id, audit.id + ' · ' + audit.title];
        }))
      }) +
      field(ctx, 'Requisito evaluado', 'requirement', finding.requirement, {
        required: true, disabled: Boolean(finding.id), options: requirementOptions(ctx, finding.audit)
      }) +
      field(ctx, 'Título del hallazgo', 'title', finding.title, { required: true }) +
      field(ctx, 'Clasificación', 'classification', finding.classification, { options: availableClasses }) +
      field(ctx, 'Responsable', 'owner', finding.owner, { required: true }) +
      field(ctx, 'Plazo de la acción', 'dueDate', formDate(ctx, finding), { type: 'date', required: true }) +
      '</div>' + field(ctx, 'Condición observada', 'observation', finding.observation, { long: true, required: true }) +
      field(ctx, 'Referencia de la evidencia objetiva', 'objectiveEvidence', finding.objectiveEvidence, { long: true }) +
      documentField(ctx, 'Documento y versión de evidencia', 'evidenceReference', finding, 'evidence') +
      field(ctx, 'Corrección inmediata', 'correction', finding.correction, { long: true }) +
      field(ctx, 'Análisis de causa', 'cause', finding.cause, { long: true }) +
      field(ctx, 'Acción correctiva', 'action', finding.action, { long: true, disabled: lockedPlan }) +
      field(ctx, 'Criterio de eficacia', 'criterion', finding.criterion, { long: true, disabled: lockedPlan });
  }

  function transitionFields(ctx, finding, stage) {
    if (stage === 'En ejecución') {
      return field(ctx, 'Acción correctiva', 'action', finding.action, { long: true, required: true }) +
        field(ctx, 'Responsable de la acción', 'owner', finding.owner, { required: true });
    }
    if (stage === 'Por verificar') {
      return field(ctx, 'Fecha de ejecución', 'executionDate', ctx.localISO(), { type: 'date', required: true }) +
        field(ctx, 'Responsable de la ejecución', 'executor', finding.owner, { required: true }) +
        field(ctx, 'Resultado y evidencia de ejecución', 'execution', '', { long: true, required: true }) +
        documentField(ctx, 'Documento y versión de ejecución', 'executionReference', finding, 'executionDocument') +
        field(ctx, 'Criterio de eficacia', 'criterion', finding.criterion, { long: true, required: true });
    }
    const fields = field(ctx, 'Fecha de verificación', 'verificationDate', ctx.localISO(), { type: 'date', required: true }) +
      field(ctx, 'Verificador', 'verifier', finding.verifier, { required: true });
    if (finding.stage === 'Eficaz') {
      return fields + field(ctx, 'Motivo de reapertura y evidencia', 'reopenReason', '', { long: true, required: true });
    }
    return fields + field(ctx, 'Criterio de eficacia', 'criterion', finding.criterion,
      { long: true, required: !finding.criterion, disabled: Boolean(finding.criterion) }) +
      field(ctx, 'Periodo observado', 'observationPeriod', finding.observationPeriod, { required: true }) +
      field(ctx, 'Muestra o evidencia de verificación', 'verificationEvidence', '', { long: true, required: true }) +
      documentField(ctx, 'Documento y versión de verificación', 'verificationReference', finding, 'verificationDocument') +
      field(ctx, stage === 'Eficaz' ? 'Resultado de eficacia' : 'Resultado y motivo de reapertura',
        'verification', '', { long: true, required: true });
  }

  function modal(ctx, title, fields, save, bindForm) {
    const dialog = document.createElement('dialog');
    dialog.className = 'dialog';
    dialog.setAttribute('aria-labelledby', 'audit-dialog-title');
    dialog.innerHTML = '<div class="dialog-inner"><div class="dialog-header"><h2 id="audit-dialog-title">' +
      ctx.esc(title) + '</h2><button type="button" class="icon-button" aria-label="Cerrar" data-close-audit>' +
      ctx.icon('x') + '</button></div><form class="stack" data-audit-form>' + fields +
      '<p class="notice" role="alert" data-form-error hidden></p>' +
      '<div class="form-actions"><button type="button" class="button button-secondary" data-close-audit>Cancelar</button>' +
      '<button class="button button-primary" type="submit">Guardar</button></div></form></div>';
    document.body.append(dialog);
    const form = dialog.querySelector('form');
    const error = form.querySelector('[data-form-error]');
    const trigger = document.activeElement;
    dialog.addEventListener('close', function () {
      dialog.remove();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    });
    dialog.querySelectorAll('[data-close-audit]').forEach(function (control) {
      control.addEventListener('click', function () { dialog.close(); });
    });
    if (bindForm) bindForm(form);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      for (const input of form.querySelectorAll('input[required]:not(:disabled), textarea[required]:not(:disabled)')) {
        if (!input.value.trim()) {
          error.hidden = false;
          error.textContent = 'Completa los campos obligatorios.';
          input.focus();
          return;
        }
      }
      const issue = save(new FormData(form));
      if (issue) {
        error.hidden = false;
        error.textContent = issue;
        return;
      }
      dialog.close();
      ctx.commit('Cambios guardados en este navegador.');
    });
    dialog.showModal();
  }

  function read(data, names) {
    return Object.fromEntries(names.map(function (name) {
      return [name, String(data.get(name) || '').trim()];
    }));
  }

  function saveRecord(records, current, data, id) {
    if (current.id) Object.assign(current, data);
    else records.push(Object.assign({ id }, current, data));
  }

  function editAudit(ctx, current) {
    modal(ctx, current.id ? 'Editar auditoría' : 'Nueva auditoría', auditFields(ctx, current), function (data) {
      const values = read(data, ['title', 'type', 'site', 'owner', 'dueDate', 'status', 'scope', 'sample', 'result']);
      values.criteria = data.getAll('criteria');
      const related = ctx.state.findings.filter(function (finding) { return finding.audit === current.id; });
      if (related.length && values.site !== current.site) {
        return 'Conserva la sede de las auditorías con hallazgos vinculados.';
      }
      if (related.some(function (finding) { return !values.criteria.includes(finding.requirement); })) {
        return 'Conserva los criterios que ya tienen hallazgos vinculados.';
      }
      if (values.criteria.some(function (id) {
        return !ctx.state.requirements.some(function (requirement) {
          return requirement.id === id && requirement.site === values.site;
        });
      })) return 'Selecciona criterios que correspondan a la sede de la auditoría.';
      if (values.status === 'Cerrada' && (!values.sample || !values.result)) {
        return 'Registra la muestra y los resultados antes de cerrar la auditoría.';
      }
      values.days = ctx.dayOffset(values.dueDate);
      if (!Number.isFinite(values.days)) return 'Indica una fecha programada válida.';
      saveRecord(ctx.state.audits, current, values, ctx.createId('AUD', ctx.state.audits));
      return '';
    });
  }

  function editFinding(ctx, current) {
    modal(ctx, current.id ? 'Editar hallazgo' : 'Nuevo hallazgo', findingFields(ctx, current), function (data) {
      const values = read(data, Array.from(data.keys()));
      values.audit = current.id ? current.audit : values.audit;
      values.requirement = current.id ? current.requirement : values.requirement;
      const audit = ctx.state.audits.find(function (record) { return record.id === values.audit; });
      const allowed = requirementOptions(ctx, values.audit).some(function (pair) {
        return pair[0] && pair[0] === values.requirement;
      });
      if (!audit || !allowed) return 'Elige un requisito que corresponda a la auditoría.';
      if (!setDocument(ctx, values, 'evidence', values.evidenceReference, values.requirement,
        documentValue(current, 'evidence'))) {
        return 'Elige un documento de la sede y el proceso del requisito evaluado.';
      }
      delete values.evidenceReference;
      values.days = ctx.dayOffset(values.dueDate);
      if (!Number.isFinite(values.days)) return 'Indica un plazo válido para la acción.';
      if (!current.id) {
        values.stage = 'Abierto';
        values.history = [{ stage: 'Abierto', date: ctx.localISO(), actor: values.owner, note: 'Hallazgo registrado.' }];
        if (!audit.criteria || !audit.criteria.length) audit.criteria = [values.requirement];
      }
      saveRecord(ctx.state.findings, current, values, ctx.createId('HAL', ctx.state.findings));
      return '';
    }, function (form) {
      const { audit, requirement, evidenceReference } = form.elements;
      function updateEvidence() {
        const selected = evidenceReference.value;
        evidenceReference.innerHTML = options(ctx, documentOptions(ctx, requirement.value), selected);
      }
      audit.addEventListener('change', function () {
        const previous = requirement.value;
        requirement.innerHTML = options(ctx, requirementOptions(ctx, audit.value), previous);
        updateEvidence();
      });
      requirement.addEventListener('change', updateEvidence);
    });
  }

  function changeStage(ctx, finding, stage) {
    const choices = transitions[finding.stage] || [];
    const choice = choices.find(function (entry) { return entry.stage === stage; });
    if (!choice) return;
    modal(ctx, choice.label, transitionFields(ctx, finding, stage), function (data) {
      const values = read(data, Array.from(data.keys()));
      const now = ctx.localISO();
      if ((values.executionDate && values.executionDate > now) ||
          (values.verificationDate && values.verificationDate > now)) {
        return 'La fecha registrada no puede ser posterior a hoy.';
      }
      if (values.verificationDate && finding.executionDate && values.verificationDate < finding.executionDate) {
        return 'La fecha de verificación debe ser igual o posterior a la ejecución.';
      }
      if (values.reopenReason && finding.verificationDate && values.verificationDate < finding.verificationDate) {
        return 'La fecha de reapertura debe ser igual o posterior a la última verificación.';
      }
      if (Object.hasOwn(values, 'executionReference')) {
        if (!setDocument(ctx, values, 'executionDocument', values.executionReference, finding.requirement,
          documentValue(finding, 'executionDocument'))) {
          return 'Elige un documento de ejecución de la sede y el proceso del requisito evaluado.';
        }
        delete values.executionReference;
      }
      if (Object.hasOwn(values, 'verificationReference')) {
        if (!setDocument(ctx, values, 'verificationDocument', values.verificationReference, finding.requirement,
          documentValue(finding, 'verificationDocument'))) {
          return 'Elige un documento de verificación de la sede y el proceso del requisito evaluado.';
        }
        delete values.verificationReference;
      }
      const past = (finding.history || []).slice();
      const note = values.reopenReason || values.verification || values.execution || values.action;
      const actor = values.verifier || values.executor || values.owner;
      const date = values.verificationDate || values.executionDate || now;
      const event = { stage, date, actor, note };
      if (stage === 'Por verificar') {
        event.document = values.executionDocument;
        event.version = values.executionDocumentVersion;
        event.details = [{ label: 'Criterio de eficacia', value: values.criterion }];
      }
      if (values.verification) {
        event.document = values.verificationDocument;
        event.version = values.verificationDocumentVersion;
        event.details = [
          { label: 'Criterio de eficacia', value: values.criterion || finding.criterion },
          { label: 'Periodo observado', value: values.observationPeriod },
          { label: 'Muestra o evidencia', value: values.verificationEvidence }
        ];
      }
      if (values.reopenReason) {
        values.reopenedDate = values.verificationDate;
        values.reopenedBy = values.verifier;
        delete values.verificationDate;
        delete values.verifier;
      }
      if (stage === 'En ejecución' && finding.stage === 'Reabierto') {
        if (finding.execution && !past.some(function (entry) {
          return entry.stage === 'Por verificar' && entry.note === finding.execution;
        })) {
          past.push({
            stage: 'Por verificar', date: finding.executionDate, actor: finding.executor || finding.owner,
            note: finding.execution, document: finding.executionDocument, version: finding.executionDocumentVersion
          });
        }
        Object.assign(finding, {
          executionDate: '', executor: '', execution: '', executionDocument: '', executionDocumentVersion: '',
          verificationDate: '', verifier: '', verification: '', verificationDocument: '',
          verificationDocumentVersion: '', observationPeriod: '', verificationEvidence: '',
          reopenReason: '', reopenedDate: '', reopenedBy: ''
        });
      }
      Object.assign(finding, values, { stage });
      finding.history = past.concat(event);
      return '';
    });
  }

  function normalize(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function bindFilters(content) {
    const form = content.querySelector('[data-audit-filters]');
    if (!form) return;
    const rows = Array.from(content.querySelectorAll('[data-audit-row]'));
    const emptyState = content.querySelector('[data-audit-empty]');
    const update = function () {
      const tokens = normalize(form.elements.text.value).split(/\s+/).filter(Boolean);
      const stage = form.elements.stage.value;
      const site = form.elements.site ? form.elements.site.value : '';
      rows.forEach(function (row) {
        const haystack = normalize(row.dataset.search);
        row.hidden = !tokens.every(function (token) { return haystack.includes(token); }) ||
          Boolean(stage && row.dataset.stage !== stage) || Boolean(site && row.dataset.site !== site);
      });
      if (emptyState) emptyState.hidden = rows.some(function (row) { return !row.hidden; });
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', function (event) { event.preventDefault(); update(); });
  }

  function bind(ctx, page) {
    if (page !== 'auditorias' && page !== 'hallazgos') return;
    const content = document.getElementById('content');
    bindFilters(content);
    content.querySelectorAll('[data-audit-action]').forEach(function (control) {
      control.addEventListener('click', function () {
        const id = control.dataset.recordId;
        const action = control.dataset.auditAction;
        if (action === 'new-audit') {
          editAudit(ctx, {});
        } else if (action === 'edit-audit') {
          const audit = ctx.state.audits.find(function (record) { return record.id === id; });
          if (audit) editAudit(ctx, audit);
        } else if (action === 'new-finding') {
          editFinding(ctx, { audit: id });
        } else {
          const finding = ctx.state.findings.find(function (record) { return record.id === id; });
          if (finding && action === 'edit-finding') editFinding(ctx, finding);
          if (finding && action === 'transition') changeStage(ctx, finding, control.dataset.nextStage);
        }
      });
    });
  }

  window.SGI_AUDITS = { auditorias: renderAudits, hallazgos: renderFindings, bind };
}());
