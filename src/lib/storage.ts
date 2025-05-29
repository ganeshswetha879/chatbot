// Simple storage utility using localStorage
export const storage = {
  getIssues: () => {
    const issues = localStorage.getItem('issues');
    return issues ? JSON.parse(issues) : [];
  },
  
  saveIssue: (issue) => {
    const issues = storage.getIssues();
    const newIssue = {
      ...issue,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    issues.push(newIssue);
    localStorage.setItem('issues', JSON.stringify(issues));
    return newIssue;
  },

  getChatMessages: () => {
    const messages = localStorage.getItem('chat_messages');
    return messages ? JSON.parse(messages) : [];
  },

  saveChatMessage: (message) => {
    const messages = storage.getChatMessages();
    messages.push({
      ...message,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    });
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  },

  getPosts: () => {
    const posts = localStorage.getItem('community_posts');
    return posts ? JSON.parse(posts) : [];
  },

  savePost: (post) => {
    const posts = storage.getPosts();
    const newPost = {
      ...post,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    posts.unshift(newPost);
    localStorage.setItem('community_posts', JSON.stringify(posts));
    return newPost;
  },

  updatePosts: (posts) => {
    localStorage.setItem('community_posts', JSON.stringify(posts));
  }
};