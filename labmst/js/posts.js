(() => {
  const access = window.AccessOS;
  const { state } = access;
  const status = (value) => `<span class="status ${value.toLowerCase()}">${value}</span>`;
  access.renderPosts = () => {
    const admin = state.role === 'Admin';
    const selectedStatus = { Published: 'Published', Drafts: 'Draft', Archived: 'Archived' }[state.postFilter];
    const posts = state.posts.filter((post) => (admin || post.status === 'Published') && (!selectedStatus || post.status === selectedStatus) && `${post.title} ${post.excerpt} ${post.author}`.toLowerCase().includes(state.query.toLowerCase()));
    const filters = admin ? ['All posts', 'Published', 'Drafts', 'Archived'] : ['All posts'];
    return `${access.pageHead(admin ? 'CONTENT MANAGEMENT' : 'TEAM UPDATES', admin ? 'Posts' : 'Workspace posts', admin ? 'Create, publish, and organize workspace updates.' : 'Read updates shared by your team.', admin ? '<button class="button primary" data-action="post-form">+ Create post</button>' : '<span class="readonly-chip">Read-only access</span>')}
      <div class="posts-toolbar"><div class="tabs" role="tablist" aria-label="Filter posts">${filters.map((item) => `<button class="tab ${state.postFilter === item ? 'active' : ''}" role="tab" aria-selected="${state.postFilter === item}" data-post-filter="${item}">${item}</button>`).join('')}</div><span class="results-count">${posts.length} posts</span></div>
      <section class="panel table-panel"><div class="table-wrap"><table class="data-table posts-table"><thead><tr><th>Post</th><th>Status</th><th>Author</th><th>Last modified</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>
      ${posts.map((post) => `<tr><td class="post-cell"><button class="post-title" data-open-post="${post.id}">${post.pinned ? '⌖ ' : ''}${access.escape(post.title)}</button><span class="post-date">${access.escape(post.date)}</span></td><td>${status(post.status)}</td><td class="post-author">${access.escape(post.author)}</td><td class="last-active">${access.escape(post.modified)}</td><td class="row-actions">${admin ? `<button class="tiny-action" data-post-action="edit" data-id="${post.id}">Edit</button><button class="icon-button" aria-label="More actions for ${access.escape(post.title)}" data-post-menu="${post.id}">•••</button>` : `<button class="icon-button" aria-label="Read ${access.escape(post.title)}" data-open-post="${post.id}">→</button>`}</td></tr>`).join('')}
      </tbody></table>${posts.length ? '' : access.empty('No posts found', admin ? 'Create your first post to get the conversation started.' : 'Nothing has been published yet.', admin ? '<button class="button primary" data-action="post-form">+ Create post</button>' : '')}</div><div class="table-footer"><span>${admin ? 'Workspace content' : 'Published workspace content'}</span><span>${posts.length} posts</span></div></section>`;
  };
  access.savePost = (form, post = null) => {
    const values = { title: String(form.get('title')).trim(), excerpt: String(form.get('excerpt')).trim(), status: String(form.get('status')), author: state.role === 'Admin' ? 'Ansh Suryavanshi' : 'Rahul Sharma', date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), modified: 'Just now' };
    if (post) {
      Object.assign(post, values);
      access.addActivity('updated', post.title);
      access.toast('Post changes saved');
    } else {
      state.posts.unshift({ id: Date.now(), ...values, pinned: false });
      access.addActivity('created', values.title);
      access.toast('Post created');
    }
    access.save('posts', state.posts);
    access.refresh();
  };
  access.updatePost = (post, action) => {
    if (action === 'edit') return access.showDialog('post-form', post);
    if (action === 'delete') return access.showDialog('delete-post', post);
    if (action === 'duplicate') {
      state.posts.unshift({ ...post, id: Date.now(), title: `${post.title} (copy)`, status: 'Draft', pinned: false, modified: 'Just now' });
      access.addActivity('duplicated', post.title);
      access.toast('Draft duplicated');
    } else if (action === 'pin') {
      post.pinned = !post.pinned;
      access.addActivity(post.pinned ? 'pinned' : 'unpinned', post.title);
      access.toast(post.pinned ? 'Post pinned' : 'Post unpinned');
    } else if (action === 'publish' || action === 'unpublish') {
      post.status = action === 'publish' ? 'Published' : 'Draft';
      post.modified = 'Just now';
      access.addActivity(action === 'publish' ? 'published' : 'unpublished', post.title);
      access.toast(action === 'publish' ? 'Post published' : 'Post moved to drafts');
    } else {
      post.status = 'Archived';
      post.pinned = false;
      post.modified = 'Just now';
      access.addActivity('archived', post.title);
      access.toast('Post archived');
    }
    access.save('posts', state.posts);
    access.refresh();
  };
})();
