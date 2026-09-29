(() => {
  const access = window.AccessOS;
  const { state } = access;
  const pages = ['Dashboard', 'Users', 'Posts', 'Activity', 'Settings', 'Roles'];
  const slug = (page) => page.toLowerCase();
  access.icon = (name, size = 18) => {
    const paths = { grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>', users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>', file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>', activity: '<path d="M3 12h4l3-9 4 18 3-9h4"/>', settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l1.4-1.1-1.4-2.4-1.7.6a8 8 0 0 0-1.7-1L15.2 5h-2.8l-.3 1.9a8 8 0 0 0-1.7 1l-1.7-.6-1.4 2.4 1.4 1.1a7 7 0 0 0 0 2l-1.4 1.1 1.4 2.4 1.7-.6a8 8 0 0 0 1.7 1l.3 1.9h2.8l.3-1.9a8 8 0 0 0 1.7-1l1.7.6 1.4-2.4-1.4-1.1A7 7 0 0 0 19 12Z"/>', shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>', search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>', bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>', plus: '<path d="M12 5v14M5 12h14"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>', lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>', pin: '<path d="m16 3 5 5-4 1-4 4-1 4-2-2-4 4-1-1 4-4-2-2 4-1 4-4z"/>', close: '<path d="m18 6-12 12M6 6l12 12"/>', eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>', logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>', check: '<path d="m5 12 4 4L19 6"/>', menu: '<path d="M4 6h16M4 12h16M4 18h16"/>' };
    return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.grid}</svg>`;
  };
  access.escape = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  access.avatar = (initials, color = '', small = false) => `<span class="avatar ${color} ${small ? 'small' : ''}" aria-hidden="true">${access.escape(initials)}</span>`;
  access.pageHead = (kicker, title, description, action = '') => `<header class="page-heading"><div><div class="page-title-kicker">${kicker}</div><h1>${title}</h1><p>${description}</p></div>${action ? `<div class="head-actions">${action}</div>` : ''}</header>`;
  access.empty = (title, description, action = '') => `<div class="empty-state"><span class="empty-icon">${access.icon('file', 19)}</span><strong>${title}</strong><p>${description}</p>${action}</div>`;
  access.toast = (message) => {
    let root = document.querySelector('#toast-root');
    if (!root) { root = document.createElement('div'); root.id = 'toast-root'; document.body.append(root); }
    root.innerHTML = `<div class="toast" role="status"><span class="toast-symbol">${access.icon('check', 13)}</span>${access.escape(message)}<button class="icon-button" aria-label="Dismiss notification" data-action="dismiss-toast">${access.icon('close', 14)}</button></div>`;
    clearTimeout(access.toastTimer);
    access.toastTimer = setTimeout(() => root.remove(), 3000);
  };
  access.refresh = () => { const main = document.querySelector('#content-wrap'); if (main) { main.innerHTML = renderPage(); wirePage(); } };

  const links = { Dashboard: 'dashboard.html', Users: 'users.html', Posts: 'posts.html', Activity: 'activity.html', Settings: 'settings.html', Roles: 'settings.html#roles' };
  function pageLink(page) { return links[page]; }
  function status(value) { return `<span class="status ${value.toLowerCase()}">${value}</span>`; }
  function activityItem(item, compact = false) { return `<div class="activity-item">${access.avatar(item.initials, item.color, true)}<div class="activity-copy"><p><strong>${access.escape(item.user)}</strong> ${access.escape(item.action)} <b>${access.escape(item.object)}</b></p><span class="activity-time">${access.escape(item.time)} <i></i> ${access.escape(item.type)}</span></div></div>`; }
  function navItems() { return ['Dashboard', ...(access.can('manageUsers') ? ['Users'] : []), 'Posts', ...(access.can('viewActivity') ? ['Activity'] : []), 'Settings', ...(access.can('manageSettings') ? ['Roles'] : [])]; }
  function renderDashboard() {
    const admin = state.role === 'Admin';
    const posts = state.posts.filter((item) => item.status === 'Published' && `${item.title} ${item.excerpt}`.toLowerCase().includes(state.query.toLowerCase()));
    const published = state.posts.filter((item) => item.status === 'Published');
    const users = state.users;
    const metrics = [['TOTAL USERS', users.length === 4 ? 4 : 20 + users.length, '+8% this month', 'users'], ['ADMINS', users.filter((user) => user.role === 'Admin').length === 1 ? 3 : users.filter((user) => user.role === 'Admin').length, 'Workspace owners', 'shield'], ['VIEWERS', users.filter((user) => user.role === 'Viewer').length === 3 ? 4 : users.filter((user) => user.role === 'Viewer').length, 'Read-only members', 'eye'], ['TOTAL POSTS', 0 + state.posts.length, '+12% this month', 'file']];
    const badge = `<span class="badge ${admin ? '' : 'viewer'}"><i></i>${state.role.toUpperCase()}</span>`;
    const heading = access.pageHead(admin ? 'WORKSPACE OVERVIEW' : 'YOUR WORKSPACE', admin ? 'Good morning, Ansh' : 'Welcome back, Rahul', admin ? 'Here’s what’s happening across your workspace.' : 'A clear view of what’s new in your workspace.', `<div class="dashboard-meta">${badge}${admin ? '' : '<span class="readonly-chip">Read-only access</span>'}</div>`);
    if (admin) return `${heading}<section class="metric-grid" aria-label="Workspace statistics">${metrics.map(([label, value, note, icon], index) => `<article class="metric-card"><div class="metric-top">${label}<span class="metric-icon">${access.icon(icon, 16)}</span></div><strong class="metric-value">${value}</strong><span class="metric-note">↗ ${note}</span><span class="metric-index">/ 0${index + 1}</span></article>`).join('')}</section><section class="dashboard-grid"><div class="panel section-panel"><div class="panel-heading"><div><span class="panel-overline">MAKE SOMETHING HAPPEN</span><h2>Quick actions</h2></div><span class="panel-index">04</span></div><div class="quick-list"><button class="quick-action" data-action="add-user"><span class="quick-icon">${access.icon('users', 16)}</span><span class="quick-text"><strong>Add a member</strong><small>Invite someone to your workspace</small></span>${access.icon('arrow', 15)}</button><button class="quick-action" data-action="post-form"><span class="quick-icon blue">${access.icon('plus', 16)}</span><span class="quick-text"><strong>Create a post</strong><small>Share an update with your team</small></span>${access.icon('arrow', 15)}</button><a class="quick-action" href="${pageLink('Roles')}"><span class="quick-icon gold">${access.icon('shield', 16)}</span><span class="quick-text"><strong>Manage permissions</strong><small>Review access across roles</small></span>${access.icon('arrow', 15)}</a><a class="quick-action" href="${pageLink('Activity')}"><span class="quick-icon rose">${access.icon('activity', 16)}</span><span class="quick-text"><strong>View activity</strong><small>See recent workspace changes</small></span>${access.icon('arrow', 15)}</a></div></div><div class="panel section-panel"><div class="panel-heading"><div><span class="panel-overline">THE LATEST</span><h2>Recent activity</h2></div><a class="inline-link" href="${pageLink('Activity')}">View all →</a></div>${state.activity.slice(0, 4).map((item) => activityItem(item, true)).join('')}</div></section><section class="panel mini-posts"><div class="panel-heading"><div><span class="panel-overline">PUBLISHED CONTENT</span><h2>Recent posts</h2></div><a class="inline-link" href="${pageLink('Posts')}">All posts →</a></div>${published.slice(0, 3).map((post) => `<div class="mini-post-row"><span class="post-marker"></span><button class="mini-post-title" data-open-post="${post.id}"><strong>${access.escape(post.title)}</strong><small>${access.escape(post.author)} · ${post.date}</small></button>${status(post.status)}</div>`).join('') || access.empty('No published posts', 'Published updates will appear here.')}</section>`;
    return `${heading}<div class="read-only-banner"><div><span class="read-only-icon">${access.icon('file', 17)}</span><span><strong>Your team, in the loop.</strong><small>${published.length} updates published for your workspace</small></span></div><span class="read-only-tag">READ ONLY</span></div><section class="viewer-layout"><div class="panel viewer-posts"><div class="panel-heading"><div><span class="panel-overline">LATEST FROM YOUR TEAM</span><h2>Recent posts</h2></div><a class="inline-link" href="${pageLink('Posts')}">Browse all →</a></div>${posts.map((post) => `<article class="post-article"><div class="article-meta"><span>${access.avatar(post.author.split(' ').map((part) => part[0]).slice(0, 2).join(''), '', true)} ${access.escape(post.author)}</span><span>${post.date}</span></div><button class="article-title" data-open-post="${post.id}">${post.pinned ? '⌖ ' : ''}${access.escape(post.title)}</button><p class="article-summary">${access.escape(post.excerpt)}</p><button class="article-more" data-open-post="${post.id}">Read update →</button></article>`).join('') || access.empty('Nothing published yet', 'When your team shares an update, it will show up here.')}</div><aside class="viewer-rail"><div class="panel pinned-panel"><span class="panel-overline">PINNED FOR YOU</span>${published.filter((post) => post.pinned).map((post) => `<button class="pinned-item" data-open-post="${post.id}">${access.escape(post.title)}<span>${post.date}</span></button>`).join('')}</div><div class="access-card"><span class="access-card-icon">${access.icon('shield', 17)}</span><strong>Read-only access</strong><p>You can read and search workspace posts. An admin can help with anything else.</p><button data-action="permission">About permissions →</button></div></aside></section>`;
  }
  function renderRoles() {
    const admin = ['View posts', 'Create posts', 'Edit posts', 'Delete posts', 'Manage users', 'Change roles', 'View activity', 'Manage settings'];
    const viewer = ['View posts', 'Search posts'];
    const card = (role, capabilities, accent, detail) => `<section class="panel role-card ${accent}-card"><div class="role-card-top"><span class="role-symbol">${access.icon(accent === 'admin' ? 'shield' : 'eye', 19)}</span><span class="role-kind">${role.toUpperCase()}</span><span class="role-scope">${accent === 'admin' ? 'Elevated access' : 'Limited access'}</span></div><h2>${role}</h2><h3>${accent === 'admin' ? 'Full workspace control' : 'Read-only workspace access'}</h3><p>${detail}</p><div class="permission-heading"><span>PERMISSIONS</span><span>${capabilities.length} ENABLED</span></div><ul class="permission-list">${(accent === 'admin' ? admin : [...viewer, ...admin.slice(1)]).map((item) => `<li><span class="perm-${capabilities.includes(item) ? 'check' : 'off'}">${capabilities.includes(item) ? '✓' : '×'}</span>${item}${capabilities.includes(item) ? '' : '<span class="admin-only">ADMIN ONLY</span>'}</li>`).join('')}</ul></section>`;
    return `${access.pageHead('ACCESS CONTROL', 'Roles & permissions', 'Understand exactly what each role can do in this workspace.')}<div class="role-grid">${card('Admin', admin, 'admin', 'For people responsible for the workspace and its members.')}${card('Viewer', viewer, 'viewer', 'For people who need visibility into published team updates.')}</div><section class="panel policy-note"><span class="policy-note-icon">${access.icon('lock', 18)}</span><div><strong>Permissions are enforced by role</strong><p>Changing a member’s role immediately changes which workspace tools are available to them.</p></div></section><p class="prototype-note">UI permissions are demonstrative. Production authorization must be enforced server-side.</p>`;
  }
  function renderSettings() {
    const admin = state.role === 'Admin';
    const setting = (icon, title, detail, action = '') => `<div class="setting-row"><span class="setting-row-icon">${access.icon(icon, 16)}</span><span class="setting-copy"><strong>${title}</strong><small>${detail}</small></span>${action ? `<button class="button secondary setting-action" data-setting="${action}">${action === 'users' ? 'Manage users' : action === 'roles' ? 'Manage roles' : 'Update'}</button>` : '<input type="checkbox" checked aria-label="Enable notification">'}</div>`;
    return `${access.pageHead('PREFERENCES', 'Settings', 'Manage your account and workspace preferences.')}<div class="settings-layout"><nav class="settings-nav" aria-label="Settings sections"><a class="selected" href="#profile">${access.icon('users', 16)} Profile</a><a href="#security">${access.icon('lock', 16)} Security</a>${admin ? `<a href="#workspace">${access.icon('grid', 16)} Workspace</a><a href="#roles">${access.icon('shield', 16)} Role management</a>` : ''}<a href="#notifications">${access.icon('bell', 16)} Notifications</a></nav><div class="settings-sections"><section class="panel settings-section" id="profile"><div class="settings-title"><div><span class="panel-overline">YOUR ACCOUNT</span><h2>Profile</h2></div><button class="button secondary" data-action="save-profile">Save changes</button></div><div class="settings-profile">${access.avatar(admin ? 'AS' : 'RS', admin ? '' : 'rose')}<span class="settings-profile-copy"><strong>${admin ? 'Ansh Suryavanshi' : 'Rahul Sharma'}</strong><span>Profile photo</span></span><button class="text-link" data-action="photo">Change photo</button></div><div class="settings-form"><div class="settings-field"><label>Full name</label><input value="${admin ? 'Ansh Suryavanshi' : 'Rahul Sharma'}"></div><div class="settings-field"><label>Email address</label><input type="email" value="${admin ? 'ansh@example.com' : 'rahul@example.com'}"></div><div class="settings-field"><label>Workspace role</label><input readonly value="${state.role} · ${admin ? 'Full workspace access' : 'Read-only access'}"></div></div></section><section class="panel settings-section" id="security"><div class="settings-title"><div><span class="panel-overline">ACCOUNT PROTECTION</span><h2>Security</h2></div></div>${setting('lock', 'Password', 'Last changed 28 days ago', 'password')}${setting('shield', 'Two-factor authentication', 'Add an extra layer of protection', 'twofactor')}</section>${admin ? `<section class="panel settings-section" id="workspace"><div class="settings-title"><div><span class="panel-overline">ADMINISTRATOR</span><h2>Workspace</h2></div></div>${setting('users', 'Member access', 'Review members and assigned roles', 'users')}${setting('shield', 'Role permissions', 'Review capabilities for Admins and Viewers', 'roles')}</section>` : ''}<section class="panel settings-section" id="notifications"><div class="settings-title"><div><span class="panel-overline">STAY INFORMED</span><h2>Notifications</h2></div></div>${setting('bell', 'Workspace updates', 'Get notified when new posts are published')}${setting('activity', 'Security alerts', 'Sign-ins and account security changes')}</section></div></div><p class="prototype-note">Changes in this prototype are stored only for the current session.</p>`;
  }
  function renderPage() {
    if (state.page === 'Users') return access.renderUsers();
    if (state.page === 'Posts') return access.renderPosts();
    if (state.page === 'Activity') return access.renderActivity();
    if (state.page === 'Roles') return renderRoles();
    if (state.page === 'Settings') return renderSettings();
    return renderDashboard();
  }
  function renderShell() {
    const user = state.role === 'Admin' ? access.initialUsers[0] : access.initialUsers[1];
    const nav = navItems();
    document.body.className = `workspace-page ${state.role.toLowerCase()}`;
    document.querySelector('#app').innerHTML = `<div class="shell"><button class="mobile-scrim" id="mobile-scrim" aria-label="Close navigation" hidden></button><aside class="sidebar" id="sidebar" aria-label="Main navigation"><a class="side-brand" href="${pageLink('Dashboard')}"><span class="brand-mark">${access.icon('shield', 17)}</span><span>access<span class="brand-light">os</span></span></a><div class="workspace-switch"><span class="workspace-initial">N</span><span class="workspace-name">Northstar Studio<small>Workspace</small></span><span class="workspace-chevron">⌄</span></div><div class="nav-section-label">WORKSPACE</div><nav class="side-nav">${nav.map((item) => `<a class="nav-link ${state.page === item ? 'active' : ''}" href="${pageLink(item)}">${access.icon(({ Dashboard: 'grid', Users: 'users', Posts: 'file', Activity: 'activity', Settings: 'settings', Roles: 'shield' })[item], 17)}<span>${item}</span>${item === 'Activity' ? '<span class="nav-count">5</span>' : ''}</a>`).join('')}</nav><div class="sidebar-spacer"></div><div class="role-panel ${state.role === 'Viewer' ? 'viewer' : ''}"><span class="role-panel-icon">${access.icon(state.role === 'Admin' ? 'shield' : 'eye', 16)}</span><span class="role-panel-text"><strong>${state.role.toUpperCase()}</strong><small>${state.role === 'Admin' ? 'Full workspace access' : 'Read-only access'}</small></span><i class="role-dot"></i></div><div class="profile-row">${access.avatar(user.initials, user.color)}<span class="profile-copy"><strong>${user.name}</strong><span>${user.email}</span></span><button class="icon-button" aria-label="Sign out" data-action="logout">${access.icon('logout', 17)}</button></div></aside><main class="shell-main"><header class="topbar"><button class="icon-button mobile-menu" id="mobile-open" aria-label="Open navigation">${access.icon('menu', 19)}</button><div class="breadcrumbs"><span>Northstar Studio</span><span class="crumb-divider">/</span><strong>${state.page}</strong></div><div class="top-actions"><label class="global-search">${access.icon('search', 16)}<input id="global-search" type="search" aria-label="Search workspace" placeholder="Search anything..." value="${access.escape(state.query)}"><kbd>⌘ K</kbd></label><button class="icon-button notification" aria-label="Notifications" data-action="notifications">${access.icon('bell', 18)}</button><span class="top-divider"></span>${access.avatar(user.initials, user.color, true)}</div></header><div class="content-wrap" id="content-wrap">${renderPage()}</div><footer class="shell-footer"><span>AccessOS · Workspace access, made clear.</span><span>Prototype environment</span></footer></main></div>`;
    wirePage();
  }
  access.showDialog = (type, data = null, message = '') => { state.dialog = { type, data, message }; renderDialog(); };
  function renderDialog() {
    const { type, data, message } = state.dialog;
    let body = '';
    if (type === 'permission') body = `<span class="modal-symbol permission">${access.icon('lock', 21)}</span><span class="eyebrow">ACCESS RESTRICTION</span><h2 id="dialog-title">Admin permission required</h2><p class="modal-copy">${access.escape(message || 'Your account has read-only access to this workspace. An administrator can help you with this action.')}</p><div class="modal-actions"><button class="button primary" data-dialog-close>Got it</button></div>`;
    if (type === 'delete-post' || type === 'delete-user') body = `<span class="modal-symbol">${access.icon('close', 20)}</span><span class="eyebrow">CONFIRM REMOVAL</span><h2 id="dialog-title">${type === 'delete-post' ? 'Delete this post?' : 'Remove this member?'}</h2><p class="modal-copy">${type === 'delete-post' ? `“${access.escape(data.title)}” will be permanently removed. This action cannot be undone.` : `Remove ${access.escape(data.name)} from this workspace? This action cannot be undone.`}</p><div class="modal-actions"><button class="button secondary" data-dialog-close>Cancel</button><button class="button danger" data-dialog-confirm>Confirm</button></div>`;
    if (type === 'post-form' || type === 'add-user' || type === 'edit-user') {
      const post = type === 'post-form';
      body = `<span class="eyebrow">${post ? 'WORKSPACE CONTENT' : 'WORKSPACE MEMBERS'}</span><h2 id="dialog-title">${post ? (data ? 'Edit post' : 'Create a post') : (data ? 'Edit member' : 'Invite a member')}</h2><p class="modal-copy">${post ? 'Share an update with your workspace.' : 'Add a teammate to your workspace.'}</p><form class="modal-form" id="dialog-form">${post ? `<div class="modal-field"><label for="title">Title</label><input id="title" name="title" required value="${access.escape(data?.title || '')}" placeholder="Give your post a clear title"></div><div class="modal-field"><label for="excerpt">Summary</label><textarea id="excerpt" name="excerpt" rows="4">${access.escape(data?.excerpt || '')}</textarea></div><div class="modal-field"><label for="status">Visibility</label><select id="status" name="status"><option ${data?.status === 'Draft' || !data ? 'selected' : ''}>Draft</option><option ${data?.status === 'Published' ? 'selected' : ''}>Published</option></select></div>` : `<div class="modal-field"><label for="member-name">Full name</label><input id="member-name" name="name" required value="${access.escape(data?.name || '')}"></div><div class="modal-field"><label for="member-email">Email address</label><input id="member-email" name="email" type="email" required value="${access.escape(data?.email || '')}"></div><div class="modal-field"><label for="member-role">Role</label><select id="member-role" name="role"><option ${data?.role !== 'Admin' ? 'selected' : ''}>Viewer</option><option ${data?.role === 'Admin' ? 'selected' : ''}>Admin</option></select></div>`}<div class="modal-actions"><button type="button" class="button secondary" data-dialog-close>Cancel</button><button class="button primary" type="submit">${post ? (data ? 'Save changes' : 'Create post') : (data ? 'Save member' : 'Send invite')}</button></div></form>`;
    }
    if (type === 'post-detail') body = `<span class="eyebrow">${data.status.toUpperCase()} · ${access.escape(data.date)}</span><h2 id="dialog-title">${access.escape(data.title)}</h2><p class="dialog-post-meta">By ${access.escape(data.author)} · ${access.escape(data.modified)}</p><p class="modal-body-copy">${access.escape(data.excerpt || 'No additional details were added to this post.')}</p><div class="modal-actions"><button class="button secondary" data-dialog-close>Close</button></div>`;
    if (type === 'post-actions') body = `<span class="eyebrow">POST ACTIONS</span><h2 id="dialog-title">${access.escape(data.title)}</h2><div class="action-menu-list">${[['edit', 'Edit post'], ['duplicate', 'Duplicate'], [data.status === 'Published' ? 'unpublish' : 'publish', data.status === 'Published' ? 'Unpublish post' : 'Publish post'], ['pin', data.pinned ? 'Unpin post' : 'Pin post'], ['archive', 'Archive'], ['delete', 'Delete post']].map(([action, label]) => `<button data-post-action="${action}" class="${action === 'delete' ? 'danger-text' : ''}">${label}</button>`).join('')}</div>`;
    const root = document.querySelector('#dialog-root');
    root.innerHTML = `<div class="modal-backdrop" id="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button class="icon-button modal-close" aria-label="Close dialog" data-dialog-close>${access.icon('close', 17)}</button>${body}</section></div>`;
    root.querySelector('[data-dialog-close]').focus();
    root.querySelector('#modal-backdrop').addEventListener('click', (event) => { if (event.target.id === 'modal-backdrop') closeDialog(); });
    root.querySelector('#dialog-form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      if (type === 'post-form') access.savePost(form, data);
      else saveUser(form, data);
      closeDialog();
    });
  }
  function saveUser(form, existing = null) {
    const name = String(form.get('name')).trim();
    const email = String(form.get('email')).trim();
    const role = String(form.get('role'));
    if (existing) Object.assign(existing, { name, email, role });
    else state.users.push({ id: Date.now(), name, email, role, status: 'Invited', last: 'Never', initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(), color: 'gold' });
    access.save('users', state.users);
    access.addActivity(existing ? 'updated member' : 'invited', name, 'Users');
    access.toast(existing ? 'Member details updated' : `${name} invited`);
    access.refresh();
  }
  function closeDialog() { state.dialog = null; document.querySelector('#dialog-root').innerHTML = ''; }
  function wirePage() {
    const content = document.querySelector('#content-wrap');
    content?.querySelectorAll('[data-user-filter]').forEach((button) => button.addEventListener('click', () => { state.userFilter = button.dataset.userFilter; access.refresh(); }));
    content?.querySelectorAll('[data-post-filter]').forEach((button) => button.addEventListener('click', () => { state.postFilter = button.dataset.postFilter; access.refresh(); }));
    content?.querySelectorAll('[data-activity-filter]').forEach((button) => button.addEventListener('click', () => { state.activityFilter = button.dataset.activityFilter; access.refresh(); }));
    content?.querySelectorAll('[data-user-menu]').forEach((button) => button.addEventListener('click', () => { state.menu = state.menu === Number(button.dataset.userMenu) ? null : Number(button.dataset.userMenu); access.refresh(); }));
    content?.querySelectorAll('[data-user-action]').forEach((button) => button.addEventListener('click', () => { const user = state.users.find((item) => item.id === Number(button.dataset.id)); access.updateUser(user, button.dataset.userAction); }));
    content?.querySelectorAll('[data-post-menu]').forEach((button) => button.addEventListener('click', () => access.showDialog('post-actions', state.posts.find((post) => post.id === Number(button.dataset.postMenu)))));
    content?.querySelectorAll('[data-post-action="edit"]').forEach((button) => button.addEventListener('click', () => access.updatePost(state.posts.find((post) => post.id === Number(button.dataset.id)), 'edit')));
    content?.querySelectorAll('[data-open-post]').forEach((button) => button.addEventListener('click', () => {
      const post = state.posts.find((item) => item.id === Number(button.dataset.openPost));
      if (post && post.status === 'Published') access.addActivity('viewed', post.title);
      access.showDialog('post-detail', post);
    }));
    content?.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (action === 'add-user') access.showDialog('add-user');
      if (action === 'post-form') access.showDialog('post-form');
      if (action === 'permission') access.permissionNotice();
      if (action === 'notifications') access.toast('You’re all caught up');
      if (action === 'save-profile') access.toast('Profile changes saved');
      if (action === 'photo') access.toast('Avatar upload is not enabled in this prototype');
    }));
    content?.querySelectorAll('[data-setting]').forEach((button) => button.addEventListener('click', () => {
      if (button.dataset.setting === 'users') location.href = pageLink('Users');
      else if (button.dataset.setting === 'roles') location.href = pageLink('Roles');
      else access.showDialog('permission', null, 'Password updates are managed by your identity provider.');
    }));
    document.querySelector('#global-search')?.addEventListener('input', (event) => { const input = event.target; state.query = input.value; access.refresh(); const nextInput = document.querySelector('#global-search'); nextInput.focus(); nextInput.setSelectionRange(input.selectionStart, input.selectionStart); });
  }
  function showLogin() {
    document.body.className = 'login-page';
    document.querySelector('#login-form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.querySelector('#email').value.trim();
      const password = document.querySelector('#password').value;
      const error = document.querySelector('#login-error');
      if (!/^\S+@\S+\.\S+$/.test(email) || !password) { error.textContent = 'Enter a valid work email and password to continue.'; error.hidden = false; return; }
      const button = document.querySelector('#login-submit');
      button.disabled = true;
      button.innerHTML = '<span class="button-spinner"></span> Signing in...';
      setTimeout(() => access.signIn(document.querySelector('#role-select').value), 450);
    });
    document.querySelector('#role-select')?.addEventListener('change', (event) => { document.querySelector('#email').value = event.target.value === 'Admin' ? 'ansh@example.com' : 'rahul@example.com'; });
    document.querySelector('#toggle-password')?.addEventListener('click', (event) => { const password = document.querySelector('#password'); password.type = password.type === 'password' ? 'text' : 'password'; event.currentTarget.setAttribute('aria-label', password.type === 'password' ? 'Show password' : 'Hide password'); event.currentTarget.textContent = password.type === 'password' ? 'Show' : 'Hide'; });
    document.querySelector('[data-action="forgot"]')?.addEventListener('click', () => access.toast('Contact your workspace administrator to reset your password.'));
  }
  if (document.body.dataset.page === 'login') { showLogin(); return; }
  if (!state.role) { access.signOut(); return; }
  if (!access.pageAllowed(state.page)) { location.href = pageLink('Dashboard'); return; }
  renderShell();
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-action="logout"]')) access.signOut();
    if (event.target.closest('[data-action="dismiss-toast"]')) document.querySelector('#toast-root')?.remove();
    if (event.target.closest('[data-dialog-close]')) closeDialog();
    if (event.target.closest('[data-dialog-confirm]')) {
      const { type, data } = state.dialog;
      if (type === 'delete-post') { state.posts = state.posts.filter((post) => post.id !== data.id); access.save('posts', state.posts); access.addActivity('deleted', data.title); access.toast('Post deleted'); }
      else { state.users = state.users.filter((user) => user.id !== data.id); access.save('users', state.users); access.addActivity('removed', data.name, 'Users'); access.toast('Member removed'); }
      closeDialog(); access.refresh();
    }
    const postAction = event.target.closest('[data-post-action]');
    if (postAction) {
      const post = state.dialog.data;
      const action = postAction.dataset.postAction;
      closeDialog();
      access.updatePost(post, action);
    }
    if (event.target.closest('[data-action="notifications"]')) access.toast('You’re all caught up');
  });
  document.querySelector('#mobile-open')?.addEventListener('click', () => { document.querySelector('#sidebar').classList.add('open'); document.querySelector('#mobile-scrim').hidden = false; });
  document.querySelector('#mobile-scrim')?.addEventListener('click', () => { document.querySelector('#sidebar').classList.remove('open'); document.querySelector('#mobile-scrim').hidden = true; });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.dialog) closeDialog();
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.querySelector('#global-search')?.focus(); }
  });
})();
