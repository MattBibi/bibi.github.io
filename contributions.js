(() => {
  'use strict';
  const grid = document.getElementById('contributions');
  const caption = document.getElementById('activity-caption');
  const tooltip = document.getElementById('contribution-tooltip');
  const countLabel = tooltip.querySelector('strong');
  const dateLabel = tooltip.querySelector('span');
  const dateFormat = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  let cells = [];

  function hideTooltip() { tooltip.hidden = true; }
  function showTooltip(cell) {
    if (!cell || cell.disabled) return;
    const count = Number(cell.dataset.count);
    countLabel.textContent = `${count.toLocaleString()} ${count === 1 ? 'contribution' : 'contributions'}`;
    dateLabel.textContent = dateFormat.format(new Date(`${cell.dataset.date}T12:00:00Z`));
    tooltip.hidden = false;
    const rect = cell.getBoundingClientRect();
    const tip = tooltip.getBoundingClientRect();
    const left = Math.max(12, Math.min(document.documentElement.clientWidth - tip.width - 12, rect.left + rect.width / 2 - tip.width / 2));
    const below = rect.top - tip.height - 10 < 8;
    tooltip.dataset.placement = below ? 'below' : 'above';
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${below ? rect.bottom + 10 : rect.top - tip.height - 10}px`;
    tooltip.style.setProperty('--tooltip-arrow', `${Math.max(12, Math.min(tip.width - 12, rect.left + rect.width / 2 - left))}px`);
  }
  function focusCell(cell) {
    cells.forEach(candidate => { candidate.tabIndex = candidate === cell ? 0 : -1; });
    cell.focus({ preventScroll: true });
    showTooltip(cell);
  }
  grid.addEventListener('pointerover', event => {
    const cell = event.target.closest('button.contribution');
    if (cell) showTooltip(cell); else hideTooltip();
  });
  grid.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') hideTooltip(); });
  grid.addEventListener('focusin', event => showTooltip(event.target.closest('button.contribution')));
  grid.addEventListener('focusout', event => { if (!grid.contains(event.relatedTarget)) hideTooltip(); });
  grid.addEventListener('click', event => { const cell = event.target.closest('button.contribution'); if (cell) focusCell(cell); });
  grid.addEventListener('keydown', event => {
    const index = cells.indexOf(event.target);
    if (index < 0) return;
    if (event.key === 'Escape') { hideTooltip(); return; }
    let next = index;
    if (event.key === 'ArrowLeft') next = Math.max(0, index - 7);
    else if (event.key === 'ArrowRight') next = Math.min(cells.length - 1, index + 7);
    else if (event.key === 'ArrowUp') next = index % 7 > 0 ? index - 1 : index;
    else if (event.key === 'ArrowDown') next = index % 7 < 6 ? Math.min(cells.length - 1, index + 1) : index;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = cells.length - 1;
    else return;
    event.preventDefault();
    focusCell(cells[next]);
  });
  document.addEventListener('pointerdown', event => { if (!grid.contains(event.target)) hideTooltip(); });
  window.addEventListener('scroll', hideTooltip, { passive: true });
  window.addEventListener('resize', hideTooltip);

  function render(days) {
    cells = [];
    const fragments = days.map(day => {
      if (!day.date || !Number.isInteger(day.count) || day.count < 0) {
        const empty = document.createElement('span');
        empty.className = 'contribution future-day';
        empty.setAttribute('aria-hidden', 'true');
        return empty;
      }
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'contribution';
      cell.dataset.level = String(Math.max(0, Math.min(4, day.level)));
      cell.dataset.count = String(day.count);
      cell.dataset.date = day.date;
      cell.tabIndex = -1;
      const date = dateFormat.format(new Date(`${day.date}T12:00:00Z`));
      cell.setAttribute('aria-label', `${day.count} ${day.count === 1 ? 'contribution' : 'contributions'} on ${date}`);
      cells.push(cell);
      return cell;
    });
    if (!cells.length) throw new Error('No verified daily contribution counts');
    cells[cells.length - 1].tabIndex = 0;
    grid.replaceChildren(...fragments);
  }
  grid.setAttribute('aria-busy', 'true');
  grid.replaceChildren(...Array.from({ length: 147 }, () => {
    const cell = document.createElement('span');
    cell.className = 'contribution future-day';
    cell.setAttribute('aria-hidden', 'true');
    return cell;
  }));
  caption.textContent = 'Loading public activity…';
  fetch('assets/contributions.json', { cache: 'no-cache' }).then(response => {
    if (!response.ok) throw new Error('Calendar unavailable');
    return response.json();
  }).then(data => {
    if (!Array.isArray(data.days) || data.days.length !== 147) throw new Error('Invalid calendar');
    render(data.days);
    caption.textContent = `Updated ${data.updated}`;
    grid.setAttribute('aria-busy', 'false');
  }).catch(() => {
    caption.textContent = 'Public activity is temporarily unavailable';
    grid.setAttribute('aria-busy', 'false');
  });
})();
