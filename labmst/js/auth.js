(() => {
  const access = window.AccessOS || (window.AccessOS = {});
  const keys = { session: 'accessos.session', users: 'accessos.users', posts: 'accessos.posts', activity: 'accessos.activity' };
  const initialUsers = [
    { id: 1, name: 'Ansh Suryavanshi', email: 'ansh@example.com', role: 'Admin', status: 'Active', last: '2 min ago', initials: 'AS', color: '' },
    { id: 2, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Viewer', status: 'Active', last: '18 min ago', initials: 'RS', color: 'rose' },
    { id: 3, name: 'Priya Singh', email: 'priya@example.com', role: 'Viewer', status: 'Active', last: '1 hour ago', initials: 'PS', color: 'blue' },
    { id: 4, name: 'Maya Chen', email: 'maya@example.com', role: 'Viewer', status: 'Invited', last: 'Never', initials: 'MC', color: 'gold' },
  ];
  const initialPosts = [
    { id: 1, title: 'Security guidelines for Q4', excerpt: 'A few important updates to how we protect customer and company data this quarter.', author: 'Ansh Suryavanshi', date: 'Sep 24, 2026', status: 'Published', pinned: true, modified: 'Today, 10:32 AM' },
    { id: 2, title: 'Company announcement', excerpt: 'We are bringing the product and operations teams together for our autumn planning week.', author: 'Ansh Suryavanshi', date: 'Sep 22, 2026', status: 'Published', pinned: true, modified: 'Today, 10:14 AM' },
    { id: 3, title: 'Product launch checklist', excerpt: 'The final review list for next month’s workspace release.', author: 'Priya Singh', date: 'Sep 19, 2026', status: 'Draft', pinned: false, modified: 'Yesterday, 4:18 PM' },
    { id: 4, title: 'August team notes', excerpt: 'Highlights, decisions, and follow-ups from the monthly team meeting.', author: 'Rahul Sharma', date: 'Sep 02, 2026', status: 'Archived', pinned: false, modified: 'Sep 03, 2026' },
  ];
  const initialActivity = [
    { id: 1, user: 'Ansh Suryavanshi', initials: 'AS', color: '', action: 'created', object: 'Company announcement', time: '10:32 AM', type: 'Posts' },
    { id: 2, user: 'Rahul Sharma', initials: 'RS', color: 'rose', action: 'viewed', object: 'Security guidelines for Q4', time: '10:28 AM', type: 'Posts' },
    { id: 3, user: 'Ansh Suryavanshi', initials: 'AS', color: '', action: 'changed Rahul Sharma’s role', object: 'Viewer → Admin', time: '10:21 AM', type: 'Permissions' },
    { id: 4, user: 'Ansh Suryavanshi', initials: 'AS', color: '', action: 'published', object: 'Security guidelines for Q4', time: '9:54 AM', type: 'Posts' },
    { id: 5, user: 'Priya Singh', initials: 'PS', color: 'blue', action: 'signed in from a new device', object: 'Chrome · macOS', time: '9:16 AM', type: 'Security' },
  ];
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? structuredClone(fallback); }
    catch { return structuredClone(fallback); }
  };
  access.keys = keys;
  access.state = {
    role: JSON.parse(localStorage.getItem(keys.session) || 'null'),
    page: location.hash === '#roles' ? 'Roles' : (document.body.dataset.page || 'Dashboard'),
    query: '', userFilter: 'All', postFilter: 'All posts', activityFilter: 'All activity', dialog: null,
    users: read(keys.users, initialUsers), posts: read(keys.posts, initialPosts), activity: read(keys.activity, initialActivity),
  };
  access.save = (key, value) => localStorage.setItem(keys[key], JSON.stringify(value));
  access.signIn = (role) => { access.state.role = role; localStorage.setItem(keys.session, JSON.stringify(role)); location.href = 'pages/dashboard.html'; };
  access.signOut = () => { localStorage.removeItem(keys.session); location.href = '../index.html'; };
  access.initialUsers = initialUsers;
  access.addActivity = (action, object, type = 'Posts') => {
    const user = access.state.role === 'Admin' ? initialUsers[0] : initialUsers[1];
    access.state.activity.unshift({ id: Date.now(), user: user.name, initials: user.initials, color: user.color, action, object, time: 'Just now', type });
    access.save('activity', access.state.activity);
  };
})();
