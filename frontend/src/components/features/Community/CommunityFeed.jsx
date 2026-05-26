import React, { useState, useEffect } from 'react';

export default function CommunityFeed({ token, currentUser }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishError, setPublishError] = useState('');

  const [postToDelete, setPostToDelete] = useState(null);

  const currentUserId = currentUser?._id || currentUser?.id || 'unknown';

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (data && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          setPosts([]);
        }
      }
    } catch (error) {
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsSubmitting(true);
    setPublishError('');

    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newPost, category: 'milestone' })
      });

      const data = await res.json();

      if (res.ok) {
        setPosts(prevPosts => [data, ...(Array.isArray(prevPosts) ? prevPosts : [])]);
        setNewPost('');
      } else {
        setPublishError(data.message || 'Server rejected the post. Check backend routes.');
      }
    } catch (error) {
      setPublishError('Network error: The backend server might not be running or the route is missing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prevPosts =>
          prevPosts.map(post => post._id === postId ? { ...post, likes: data.likes } : post)
        );
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const executeDelete = async () => {
    const postId = postToDelete;
    setPostToDelete(null);
    if (!postId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      }
    } catch (error) {
      console.error('Network error deleting post:', error);
    }
  };

  const safePosts = Array.isArray(posts) ? posts : [];

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif mb-2">The Collective</h2>
          <p className="opacity-60 text-sm">Anonymous wins, shared momentum. What did you conquer today?</p>
        </div>

        <form onSubmit={handlePostSubmit} className="border p-6 relative overflow-hidden" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
          {publishError && (
            <div className="mb-4 p-3 text-xs border border-red-500 text-red-500 bg-red-500/10 rounded relative z-10 font-mono">
              <strong>ERROR:</strong> {publishError}
            </div>
          )}

          <svg className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none" width="150" height="150" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="20" cy="50" r="3" />
            <circle cx="80" cy="30" r="3" />
            <circle cx="60" cy="80" r="3" />
            <line x1="20" y1="50" x2="80" y2="30" />
            <line x1="20" y1="50" x2="60" y2="80" />
            <line x1="80" y1="30" x2="60" y2="80" />
          </svg>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            maxLength={280}
            placeholder="Share a milestone or focus win..."
            className="w-full bg-transparent border-none outline-none resize-none h-20 text-sm relative z-10 placeholder-current placeholder-opacity-40"
            style={{ color: 'var(--text-primary)' }}
          />
          <div className="flex justify-between items-center mt-2 relative z-10">
            <span className="text-xs opacity-40">{newPost.length}/280</span>
            <button
              type="submit"
              disabled={isSubmitting || !newPost.trim()}
              className="px-6 py-2 text-xs uppercase tracking-widest font-medium transition border disabled:opacity-50 cursor-pointer hover:opacity-80"
              style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', borderColor: 'var(--text-primary)' }}
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>

        <div className="space-y-4 pb-12">
          {isLoading ? (
            <div className="text-center opacity-50 py-10 text-sm animate-pulse">Syncing collective...</div>
          ) : safePosts.length === 0 ? (
            <div className="text-center opacity-50 py-10 text-sm">It's quiet. Be the first to share a win.</div>
          ) : (
            safePosts.map((post) => {
              const postLikes = Array.isArray(post?.likes) ? post.likes : [];
              const hasLiked = postLikes.includes(currentUserId);
              const postAuthorId = typeof post?.user === 'object' ? post.user?._id : post?.user;
              const isOwner = postAuthorId === currentUserId;

              return (
                <div key={post?._id || Math.random()} className="border p-6 animate-fade-in group relative" style={{ borderColor: 'var(--border-subtle)' }}>
                  {isOwner && (
                    <button
                      onClick={() => setPostToDelete(post._id)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity text-red-500 cursor-pointer p-2"
                      title="Delete Post"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  )}

                  <p className="text-sm leading-relaxed mb-4 pr-6">{post?.content || "Empty content"}</p>

                  <div className="flex justify-between items-center text-xs opacity-60">
                    <span className="uppercase tracking-widest">
                      {isOwner ? "You (Seeker)" : "Seeker"} • {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
                    </span>

                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-1.5 transition cursor-pointer ${hasLiked ? 'opacity-100 font-bold' : 'hover:opacity-100'}`}
                      style={{ color: hasLiked ? 'var(--text-primary)' : 'inherit' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      {postLikes.length}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {postToDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" style={{ position: 'fixed' }}>
          <div className="p-8 border w-full max-w-sm animate-fade-in shadow-2xl" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
            <h3 className="font-serif text-2xl mb-2">Delete Log?</h3>
            <p className="text-sm opacity-60 mb-8 leading-relaxed">Remove this milestone from the Collective? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setPostToDelete(null)}
                className="flex-1 py-3 text-xs uppercase tracking-widest font-medium transition border cursor-pointer hover:opacity-70"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 py-3 text-xs uppercase tracking-widest font-medium transition border cursor-pointer hover:bg-red-600 hover:text-white hover:border-red-600"
                style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', borderColor: 'var(--text-primary)' }}
              >
                Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}