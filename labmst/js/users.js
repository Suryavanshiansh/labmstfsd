(() => {
  const access = window.AccessOS;
  const { state } = access;
  const esc = (value) => access.escape(value);
  const avatar = (...args) => access.avatar(...args);
  const roleBadge = (role) => `<span class="role-label ${role.toLowerCase()}">${role}</span>`;
  const statusBadge = (status) => `<span class="status ${status.toLowerCase()}">${status}</span>`;
  access.renderUsers = () => {
    const users = state.users.filter((user) => {
      const matches = `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(state.query.toLowerCase());
      return matches && (state.userFilter === 'All' || user.role === state.userFilter.slice(0, -1));
    });
    const filters = ['All', 'Admins', 'Viewers'];
    return `${access.pageHead('PEOPLE & ACCESS', 'Users', 'Manage workspace members and their access levels.', '<button class="button primary" data-action="add-user">+ Add user</button>')}
      <div class="toolbar"><div class="tabs" role="tablist" aria-label="Filter users">${filters.map((item, index) => `<button class="tab ${state.userFilter === item ? 'active' : ''}" role="tab" aria-selected="${state.userFilter === item}" data-user-filter="${item}">${item}<span class="tab-count">${[24, 3, 21][index]}</span></button>`).join('')}</div><span class="results-count">Showing ${users.length} members</span></div>
      <section class="panel table-panel"><div class="table-wrap"><table class="data-table users-table"><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Last active</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>
      ${users.map((user) => `<tr><td><div class="user-cell">${avatar(user.initials, user.color)}<span><strong>${esc(user.name)}</strong><a href="mailto:${esc(user.email)}">${esc(user.email)}</a></span></div></td><td>${roleBadge(user.role)}</td><td>${statusBadge(user.status)}</td><td class="last-active">${esc(user.last)}</td><td class="row-actions"><button class="icon-button" aria-label="Actions for ${esc(user.name)}" data-user-menu="${user.id}">•••</button>${state.menu === user.id ? `<div class="row-menu"><button data-user-action="edit" data-id="${user.id}">Edit user</button><button data-user-action="role" data-id="${user.id}">Change role to ${user.role === 'Admin' ? 'Viewer' : 'Admin'}</button><button data-user-action="deactivate" data-id="${user.id}">${user.status === 'Active' ? 'Deactivate' : 'Reactivate'}</button><button class="delete-option" data-user-action="delete" data-id="${user.id}">Remove user</button></div>` : ''}</td></tr>`).join('')}
      </tbody></table>${users.length ? '' : access.empty('No members found', 'Try adjusting your search or member filter.')}</div><div class="table-footer"><span>Workspace members</span><span>Showing ${users.length} members</span></div></section><p class="prototype-note">${access.icon('lock', 13)} Role changes take effect immediately in this prototype.</p>`;
  };
  access.updateUser = (user, action) => {
    if (action === 'role') {
      const previous = user.role;
      user.role = previous === 'Admin' ? 'Viewer' : 'Admin';
      access.addActivity(`changed ${user.name}’s role`, `${previous} → ${user.role}`, 'Permissions');
      access.toast(`${user.name} is now a ${user.role.toLowerCase()}`);
    } else if (action === 'deactivate') {
      user.status = user.status === 'Active' ? 'Deactivated' : 'Active';
      access.addActivity(`${user.status.toLowerCase()} ${user.name}`, 'Workspace access', 'Users');
      access.toast(`${user.name} ${user.status.toLowerCase()}`);
    } else if (action === 'delete') {
      access.showDialog('delete-user', user);
      return;
    } else {
      access.showDialog('edit-user', user);
      return;
    }
    access.save('users', state.users);
    access.refresh();
  };
})();
