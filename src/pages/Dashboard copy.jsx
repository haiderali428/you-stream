import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, login } from '../app/userSlice';
import { deleteVideo } from '../app/videoSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);
  const videos = useSelector((state) => state.videos.videos);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const userVideos = videos.filter(
    (video) => video.uploader === currentUser?.username
  );

  const handleSave = () => {
    const updatedUser = { ...currentUser, username, email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch(login(updatedUser));
    toast.success('Profile updated!');
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('user');
    // Added A local storage Remove videos logic on delete account
    localStorage.removeItem('videos');
    dispatch(logout());
    toast.success('Account deleted');
    navigate('/');
  };

  const handleDeleteVideo = (id) => {
    dispatch(deleteVideo(id));
    toast.success('Video deleted');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-section profile-section">
        <h2>User Profile</h2>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="profile-buttons">
          <button onClick={handleSave}>Save Changes</button>
          <button className="delete" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>

      <div className="dashboard-section uploads-section">
        <h2>My Uploads</h2>
        {userVideos.length > 0 ? (
          <div className="video-grid">
            {userVideos.map((video) => (
              <div className="video-card" key={video.id}>
                <div className="thumb-wrapper">
                  {video.type === 'upload' ? (
                    <video src={video.url} muted controls className="thumb" />
                  ) : (
                    <iframe
                      src={video.url}
                      className="thumb"
                      title={video.title}
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                <div className="video-info">
                  <h4>{video.title}</h4>
                  <p>Type: {video.type === 'upload' ? 'File' : 'Link'}</p>
                  <button onClick={() => handleDeleteVideo(video.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No uploads yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
