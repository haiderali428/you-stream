import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // <-- added dispatch
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { showLoader, hideLoader } from '../app/loaderSlice'; // <-- import actions

const getEmbedUrl = (url) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const Explore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // <-- init dispatch
  const userVideos = useSelector((state) => state.videos.videos);
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Anonymous' };

  useEffect(() => {
    dispatch(showLoader());
    const timeout = setTimeout(() => {
      dispatch(hideLoader());
    }, 800);
    return () => clearTimeout(timeout);
  }, [dispatch]); // <-- show/hide loader on mount

  const dummyVideos = [
    {
      id: uuidv4(),
      title: 'Context API crash course with 2 projects',
      description: 'Visit https://chaicode.com for all related materials, community help, source code etc.',
      type: 'YouTube',
      category: 'Web',
      url: 'https://youtu.be/JQVBGtZMqgU?si=ozFxMkVcy2iAsp1C',
      uploader: 'Chai Aur Code',
    },
    {
      id: uuidv4(),
      title: 'Context api with local storage | project',
      description: 'Visit https://chaicode.com for all related materials, community help, source code etc.',
      type: 'YouTube',
      category: 'Web',
      url: 'https://youtu.be/6KQeopPE36I?si=ut2P-I4LPbRv9f-X',
      uploader: 'Chai Aur Code',
    },
    {
      id: uuidv4(),
      title: '4 Shadi Karna Kyun Zaruri Hain | Mufti Tariq Masood',
      description: '',
      type: 'upload',
      category: 'Islamic',
      url: 'https://youtu.be/e-tmNQaWvwk?si=AmrrqcOumIiJ5_f2',
      uploader: 'Mufti Tariq Masood',
    },
    {
      id: uuidv4(),
      title: 'Natasha Baig Ne Faisal Ramay Ka Bura Haal Kar Diya | Imran Ashraf | Mazaq Raat',
      description: 'Welcome to the sensational world of Mazaq Raat Season 2!',
      type: 'upload',
      category: 'Entertainment',
      url: 'https://youtu.be/2QS3S0AB29A?si=o52D6yb0NfsiIInR',
      uploader: 'Entertainment Hub',
    },
  ];

  const allVideos = [
    ...userVideos.map((v) => ({
      ...v,
      uploader: currentUser.name || 'You',
      category: v.category || 'Web',
    })),
    ...dummyVideos,
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredVideos = allVideos.filter((video) => {
    const titleMatch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = video.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || descriptionMatch;

    const matchesType =
      typeFilter === 'all' || video.type?.toLowerCase() === typeFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === 'all' || video.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleVideoClick = (video) => {
    navigate(`/watch/${video.id}`, { state: { video } });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-10">
       
      <div className="max-w-6xl mx-auto mt-20">
          <div className="mb-6 grid  md:grid-cols-4 grid-cols-1  w-full  items-center justify-end gap-4">
            <div></div>
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full    px-4 py-2 rounded border dark:bg-gray-700 dark:text-white "
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full  px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="upload">Upload</option>
            <option value="youtube">YouTube</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full  px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="web">Web</option>
            <option value="entertainment">Entertainment</option>
            <option value="islamic">Islamic</option>
          </select>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8 dark:text-white text-black">
          Explore Videos
        </h1>

       
        {filteredVideos.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No matching videos found.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="border border-gray-300 dark:border-white  p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                <div className="mb-3">
                  {video.type?.toLowerCase() === 'upload' ? (
                    <video
                      src={video.url}
                      muted
                      autoPlay
                      loop
                      controls={false}
                      className="w-full h-48 rounded-md object-cover"
                    />
                  ) : (
                    <iframe
                      src={getEmbedUrl(video.url)}
                      title={video.title}
                      className="w-full h-48 rounded-md pointer-events-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                <h3 className="text-lg font-semibold dark:text-white text-black">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Category: <span className="font-medium">{video.category}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Uploaded by: <span className="font-medium">{video.uploader}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
