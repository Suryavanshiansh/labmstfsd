(() => {
  const access = window.AccessOS;
  const grants = {
    Admin: ['viewPosts', 'createPosts', 'editPosts', 'deletePosts', 'manageUsers', 'changeRoles', 'viewActivity', 'manageSettings'],
    Viewer: ['viewPosts', 'searchPosts'],
  };
  access.can = (permission) => Boolean(access.state.role && grants[access.state.role]?.includes(permission));
  access.pageAllowed = (page) => ({ Dashboard: true, Posts: access.can('viewPosts'), Users: access.can('manageUsers'), Activity: access.can('viewActivity'), Roles: access.can('manageSettings'), Settings: true })[page] === true;
  access.permissionNotice = () => access.showDialog('permission');
})();
