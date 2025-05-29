import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { storage } from '../lib/storage';

export default function CommunityHub() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    caption: '',
    hashtags: ''
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setPosts(storage.getPosts());
  }, []);

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'video/*': ['.mp4', '.mov']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const post = storage.savePost({
        caption: newPost.caption,
        hashtags: newPost.hashtags.split(' ').filter(tag => tag.startsWith('#'))
      });

      setPosts(prev => [post, ...prev]);
      toast.success('Post created successfully!');
      setNewPost({ caption: '', hashtags: '' });
      setFiles([]);
    } catch (error) {
      toast.error('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Community Hub</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Caption</label>
            <textarea
              className="input mt-1"
              rows={3}
              value={newPost.caption}
              onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hashtags</label>
            <input
              type="text"
              className="input mt-1"
              value={newPost.hashtags}
              onChange={(e) => setNewPost({ ...newPost, hashtags: e.target.value })}
              placeholder="#community #safety"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Media</label>
            <div {...getRootProps()} className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
              <input {...getInputProps()} />
              <p>Drag & drop a photo or video, or click to select</p>
            </div>
            {files.length > 0 && (
              <ul className="mt-2">
                {files.map((file) => (
                  <li key={file.name} className="text-sm text-gray-600">{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Create Post
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow">
            {post.media_url && (
              <img
                src={post.media_url}
                alt=""
                className="w-full h-64 object-cover rounded-t-lg"
              />
            )}
            <div className="p-6">
              <p className="text-gray-900 mb-2">{post.caption}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-800 text-sm px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                <div className="flex gap-4">
                  <button className="hover:text-primary-600">Like</button>
                  <button className="hover:text-primary-600">Comment</button>
                  <button className="hover:text-primary-600">Share</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}