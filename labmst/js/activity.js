(() => {
  const access = window.AccessOS;
  const { state } = access;
  access.renderActivity = () => {
    const filters = ['All activity', 'Users', 'Posts', 'Permissions', 'Security'];
    const items = state.activity.filter((item) => (state.activityFilter === 'All activity' || item.type === state.activityFilter) && `${item.user} ${item.action} ${item.object}`.toLowerCase().includes(state.query.toLowerCase()));
    return `${access.pageHead('WORKSPACE HISTORY', 'Activity', 'A transparent record of changes across your workspace.', '<span class="live"><i></i> LIVE LOG</span>')}
      <div class="toolbar"><div class="tabs" role="tablist" aria-label="Filter activity">${filters.map((item) => `<button class="tab ${state.activityFilter === item ? 'active' : ''}" role="tab" aria-selected="${state.activityFilter === item}" data-activity-filter="${item}">${item}</button>`).join('')}</div><span class="results-count">Today · ${items.length} events</span></div>
      <section class="panel audit-panel"><div class="audit-date"><span>MONDAY, SEPTEMBER 29</span><span>${items.length} EVENTS</span></div>${items.map((item) => `<div class="audit-entry">${access.avatar(item.initials, item.color, true)}<div class="activity-copy"><p><strong>${access.escape(item.user)}</strong> ${access.escape(item.action)} <b>${access.escape(item.object)}</b></p><span class="activity-time">${access.escape(item.time)} <i></i> ${access.escape(item.type)}</span></div></div>`).join('') || access.empty('No activity here', 'Try another activity filter.')}</section><p class="prototype-note">${access.icon('shield', 14)} Activity is visible to workspace administrators.</p>`;
  };
})();
