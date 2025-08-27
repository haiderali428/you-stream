// Dashboard.jsx
import { useSelector, useDispatch } from "react-redux";
import { deleteVideo, updateVideosUploader } from "../app/videoSlice";
import { deleteUser, updateUser } from "../app/userSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { showLoader, hideLoader } from "../app/loaderSlice";

const getEmbedUrl = (url) => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const Dashboard = () => {
  const videos = useSelector((state) => state.videos.videos);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: "", email: "" });

  useEffect(() => {
    dispatch(showLoader());
    const timeout = setTimeout(() => {
      dispatch(hideLoader());
    }, 800);
    return () => clearTimeout(timeout);
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setProfile({
        name: currentUser.name || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

const handleProfileSave = (e) => {
  e.preventDefault();

  // 1. Get existing videos from localStorage
  let data = JSON.parse(localStorage.getItem("videos")) || [];

  // 2. Update uploadedBy for all items that belong to *old* currentUser name
  data = data.map((item) =>
    item.uploadedBy === currentUser?.name
      ? { ...item, uploadedBy: profile.name } // replace old with new
      : item
  );

  // 3. Save updated videos back
  localStorage.setItem("videos", JSON.stringify(data));

  // 4. Update redux user state
  dispatch(updateUser(profile));
  // 5. Update videos uploader info
  dispatch(updateVideosUploader({ oldName: currentUser?.name, newName: profile.name, email: profile.email }));

  toast.success("Profile updated!");
};


  const handleUserDelete = () => {
    // 1. Delete all videos uploaded by the current user
    videos.forEach((video) => {
      if (video.uploadedBy === currentUser?.name) {
        dispatch(deleteVideo(video.id));
      }
    });

    // 2. Delete user account
    dispatch(deleteUser());
    toast.success("Account and uploaded videos deleted!");
    navigate("/signup");
  };

  const handleDelete = (id) => {
    dispatch(deleteVideo(id));
    toast.success("Video deleted!");
  };

  const handlePlayVideo = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-10">
      <div className="max-w-6xl mx-auto mt-20 px-2 space-y-10">
        {/* Profile Section */}
        <div className="w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1c1c1c] dark:text-white mb-4">
            Update Profile
          </h2>
          <form
            onSubmit={handleProfileSave}
            className="grid md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-[#1c1c1c] dark:text-white mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[#1c1c1c] dark:text-white mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="md:col-span-2 flex gap-4 mt-2 flex-wrap">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Profile
              </button>
              <button
                type="button"
                onClick={handleUserDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete User Account
              </button>
            </div>
          </form>
        </div>

        {/* Uploaded Videos */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-[#1c1c1c] dark:text-white">
            My Uploaded Videos
          </h2>

          {videos.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No videos uploaded yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => {
                // 👇 Always use currentUser.name if this user uploaded the video
                const uploader =
                  video.uploadedBy === currentUser?.name ||
                  video.uploadedBy === currentUser?.oldName
                    ? currentUser?.name
                    : video.uploadedBy;

                return (
                  <div
                    key={video.id}
                    className="border border-gray-300 dark:border-white p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer"
                  >
                    <div
                      className="mb-3 cursor-pointer"
                      onClick={() => handlePlayVideo(video.id)}
                    >
                      {video.type === "upload" ? (
                        <video
                          src={video.url}
                          className="w-full h-48 rounded-md object-cover"
                          muted
                          loop
                          autoPlay
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
                    <h3 className="text-lg font-semibold text-[#1c1c1c] dark:text-white">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Category:{" "}
                      <span className="italic font-medium">
                        {video.category || "Uncategorized"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Uploaded by: {uploader || "Anonymous"}
                    </p>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
