import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { storage } from '../lib/storage';
import { MapPinIcon, HeartIcon, ShareIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import Map, { Marker } from 'react-map-gl';

const DEMO_POSTS = [
  {
    id: '1',
    caption: '🚨 Safety First! Important flood safety tips:\n\n1. Stay informed about weather updates\n2. Keep emergency contacts handy\n3. Prepare an emergency kit\n4. Know your evacuation route\n5. Keep important documents waterproof',
    hashtags: ['#SafetyFirst', '#FloodPreparedness', '#CommunitySupport'],
    created_at: '2025-05-25T10:00:00Z',
    media_url: 'https://images.pexels.com/photos/1200547/pexels-photo-1200547.jpeg',
    location: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: '2',
    caption: '🎯 Fundraising Goal: $10,000 for Emergency Response Equipment\n\nHelp us upgrade our community emergency response capabilities! Every donation counts.',
    hashtags: ['#CommunityFundraising', '#EmergencyPreparedness'],
    created_at: '2025-05-24T15:30:00Z',
    donation_goal: 10000,
    donation_current: 5600
  },
  {
    id: '3',
    caption: '📦 Food Drive Success! Thank you to everyone who contributed to our emergency food bank. Together we collected over 1000 pounds of non-perishable items!',
    hashtags: ['#FoodDrive', '#CommunitySupport', '#Gratitude'],
    created_at: '2025-05-23T09:15:00Z',
    media_url: 'https://images.pexels.com/photos/6590920/pexels-photo-6590920.jpeg'
  }
];

export default function CommunityHub() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    caption: '',
    hashtags: ''
  });
  const [files, setFiles] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    zoom: 12
  });
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const savedPosts = storage.getPosts();
    if (savedPosts.length === 0) {
      DEMO_POSTS.forEach(post => storage.savePost(post));
      setPosts(DEMO_POSTS);
    } else {
      setPosts(savedPosts);
    }
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
        hashtags: newPost.hashtags.split(' ').filter(tag => tag.startsWith('#')),
        created_at: new Date().toISOString()
      });

      setPosts(prev => [post, ...prev]);
      toast.success('Post created successfully!');
      setNewPost({ caption: '', hashtags: '' });
      setFiles([]);
      document.getElementById('createPost')?.close();
    } catch (error) {
      toast.error('Failed to create post. Please try again.');
    }
  };

  const handleDonate = (post) => {
    setSelectedPost(post);
    setShowDonationModal(true);
  };

  const submitDonation = (amount) => {
    const updatedPosts = posts.map(post => {
      if (post.id === selectedPost.id) {
        return {
          ...post,
          donation_current: (post.donation_current || 0) + amount
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    storage.updatePosts(updatedPosts);
    setShowDonationModal(false);
    toast.success(`Thank you for your donation of $${amount}!`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Community Hub</h1>
          <button 
            onClick={() => document.getElementById('createPost')?.showModal()}
            className="btn bg-primary-600 hover:bg-primary-500 text-white"
          >
            Create Post
          </button>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              {post.media_url && (
                <img
                  src={post.media_url}
                  alt=""
                  className="w-full h-[400px] object-cover"
                />
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-semibold">GB</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">GuardianBot</h3>
                    <p className="text-sm text-gray-400">{format(new Date(post.created_at), 'MMM d, yyyy')}</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 whitespace-pre-line">{post.caption}</p>
                
                {post.donation_goal && (
                  <div className="mb-6 bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Raised: ${post.donation_current || 0}</span>
                      <span>Goal: ${post.donation_goal}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${(post.donation_current / post.donation_goal) * 100}%` }}
                      ></div>
                    </div>
                    <button
                      onClick={() => handleDonate(post)}
                      className="mt-4 btn bg-primary-600 hover:bg-primary-500 text-white w-full flex items-center justify-center gap-2"
                    >
                      <HeartIcon className="w-5 h-5" />
                      Donate Now
                    </button>
                  </div>
                )}

                {post.location && (
                  <div className="mb-6 rounded-lg overflow-hidden h-48">
                    <Map
                      {...viewport}
                      onMove={evt => setViewport(evt.viewport)}
                      mapStyle="mapbox://styles/mapbox/dark-v10"
                      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    >
                      <Marker
                        latitude={post.location.lat}
                        longitude={post.location.lng}
                      >
                        <MapPinIcon className="h-6 w-6 text-primary-500" />
                      </Marker>
                    </Map>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-600/20 text-primary-400 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                  <div className="flex gap-6">
                    <button className="text-gray-400 hover:text-primary-400 flex items-center gap-2">
                      <HeartIcon className="w-5 h-5" />
                      <span>Like</span>
                    </button>
                    <button className="text-gray-400 hover:text-primary-400 flex items-center gap-2">
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                      <span>Comment</span>
                    </button>
                    <button className="text-gray-400 hover:text-primary-400 flex items-center gap-2">
                      <ShareIcon className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <dialog id="createPost" className="modal bg-gray-800 rounded-lg p-6 max-w-xl w-full">
        <h2 className="text-xl font-semibold text-white mb-4">Create a Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Caption</label>
            <textarea
              className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 text-white"
              rows={3}
              value={newPost.caption}
              onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Hashtags</label>
            <input
              type="text"
              className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 text-white"
              value={newPost.hashtags}
              onChange={(e) => setNewPost({ ...newPost, hashtags: e.target.value })}
              placeholder="#community #safety"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Media</label>
            <div {...getRootProps()} className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer">
              <input {...getInputProps()} />
              <p className="text-gray-400">Drag & drop a photo or video, or click to select</p>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => document.getElementById('createPost')?.close()}
              className="btn bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </button>
            <button type="submit" className="btn bg-primary-600 hover:bg-primary-500 text-white">
              Post
            </button>
          </div>
        </form>
      </dialog>

      {showDonationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Make a Donation</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => submitDonation(amount)}
                  className="btn bg-primary-600/20 hover:bg-primary-600/30 text-primary-400"
                >
                  ${amount}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowDonationModal(false)}
              className="btn bg-gray-700 hover:bg-gray-600 text-white w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}