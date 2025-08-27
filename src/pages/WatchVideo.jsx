import React, { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../app/loaderSlice';

// Extract YouTube embed link
const getEmbedUrl = (url) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const WatchVideo = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux videos
  const reduxVideos = useSelector((state) => state.videos.videos);

  // Current logged in user
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Anonymous' };

  // Dummy fallback videos
  const dummyVideos = [
    {
      id: 'dummy-1',
      title: 'Context API crash course with 2 projects',
      type: 'youtube',
      category: 'Web',
      url: 'https://youtu.be/JQVBGtZMqgU',
      uploader: 'Chai Aur Code',
    },
    {
      id: 'dummy-2',
      title: 'Context api with local storage | project',
      type: 'youtube',
      category: 'Web',
      url: 'https://youtu.be/6KQeopPE36I',
      uploader: 'Chai Aur Code',
    },
    {
      id: 'dummy-3',
      title: '4 Shadi Karna Kyun Zaruri Hain | Mufti Tariq Masood',
      type: 'upload',
      category: 'Islamic',
      url: 'https://yourserver.com/videos/mufti.mp4',
      uploader: 'Mufti Tariq Masood',
    },
  ];

  // Merge all videos
  const allVideos = [
    ...reduxVideos.map((v) => ({
      ...v,
      uploader: v.uploader || currentUser.name || 'You',
      category: v.category || 'General',
    })),
    ...dummyVideos,
  ];

  // Priority 1: from location.state
  let video = location.state?.video;
  // Priority 2: from allVideos by ID
  if (!video) {
    video = allVideos.find((v) => v.id === id);
  }

  // Related videos (same category, exclude current)
  const relatedVideos = allVideos.filter(
    (v) => v.id !== id && v.category === video?.category
  );

  // Loader effect
  useEffect(() => {
    dispatch(showLoader());
    const timeout = setTimeout(() => dispatch(hideLoader()), 800);
    return () => clearTimeout(timeout);
  }, [dispatch]);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-red-500 text-lg font-semibold">Video not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 mt-14">
        
        {/* Main Video Section */}
        <div className="col-span-12 lg:col-span-9">
          <div className="mb-6">
            {video.type?.toLowerCase() === 'upload' ? (
              <video
                src={video.url}
                controls
                className="w-full h-[360px] rounded object-cover"
              />
            ) : (
              <iframe
                src={getEmbedUrl(video.url)}
                title={video.title}
                className="w-full h-[360px] rounded"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          <h1 className="text-2xl font-bold mb-4 text-[#1c1c1c] dark:text-white">
            {video.title}
          </h1>

          {video.description && (
            <p className="text-gray-700 dark:text-gray-300 mb-2">{video.description}</p>
          )}

          <div className="flex items-center justify-between">
            <small className="text-gray-600 dark:text-gray-400">
              Uploaded by: {video.uploader || 'Unknown'}
            </small>
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2 py-1 rounded">
              {video.category || 'General'}
            </span>
          </div>
        </div>

        {/* Related Videos */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <h2 className="text-xl font-semibold text-[#1c1c1c] dark:text-white mb-2">Related Videos</h2>
          {relatedVideos.length > 0 ? (
            relatedVideos.map((relVid) => (
              <Link
                to={`/watch/${relVid.id}`}
                key={relVid.id}
                state={{ video: relVid }}
                className="flex gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded transition"
              >
                <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden">
                  {relVid.type.toLowerCase() === 'upload' ? (
                    <video src={relVid.url} className="w-full h-full object-cover" />
                  ) : (
                    <iframe
                      src={getEmbedUrl(relVid.url)}
                      title={relVid.title}
                      className="w-full h-full pointer-events-none"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1c1c1c] dark:text-white line-clamp-2">
                    {relVid.title}
                  </p>
                  <small className="text-xs text-gray-500 dark:text-gray-400">
                    {relVid.uploader}
                  </small>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No related videos found</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default WatchVideo;
