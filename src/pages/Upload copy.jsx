import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadVideo } from '../app/videoSlice';
import { v4 as uuidv4 } from 'uuid';

const Upload = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'upload',
    videoFile: null,
    videoLink: '',
    previewUrl: '',
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, videoFile: file, previewUrl }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem('user'));

    const videoData = {
      id: uuidv4(),
      title: form.title,
      description: form.description,
      type: form.type,
      url: form.type === 'upload' ? form.previewUrl : form.videoLink,
      uploader: currentUser?.username || 'Anonymous',
    };

    dispatch(uploadVideo(videoData));
    setForm({
      title: '',
      description: '',
      type: 'upload',
      videoFile: null,
      videoLink: '',
      previewUrl: '',
    });
    alert('Video uploaded successfully!');
  };

  return (
    <div className="upload-page">
      <form className="upload-form" onSubmit={handleSubmit}>
        <h2>Upload Video</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={handleChange}
          required
        />

        <div className="upload-options">
          <label>
            <input
              type="radio"
              name="type"
              value="upload"
              checked={form.type === 'upload'}
              onChange={handleChange}
            />
            Upload from device
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="link"
              checked={form.type === 'link'}
              onChange={handleChange}
            />
            Add streaming link
          </label>
        </div>

        {form.type === 'upload' ? (
          <>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            {form.previewUrl && (
              <video src={form.previewUrl} controls className="video-preview" />
            )}
          </>
        ) : (
          <input
            type="url"
            name="videoLink"
            placeholder="Paste YouTube, Twitch, etc."
            value={form.videoLink}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Upload;
