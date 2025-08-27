import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { uploadVideo } from '../app/videoSlice';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { showLoader, hideLoader } from '../app/loaderSlice';

const Upload = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'upload',
    category: 'Entertainment',
    videoFile: null,
    videoLink: '',
    previewUrl: '',
  });

  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showLoader());
    const timeout = setTimeout(() => {
      dispatch(hideLoader());
    }, 800);
    return () => clearTimeout(timeout);
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, videoFile: file, previewUrl }));
  };

  const handleInputFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      handleFileChange(file);
    } else {
      toast.error('Only video files are allowed');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // ✅ consistent key

    const videoData = {
      id: uuidv4(),
      title: form.title,
      description: form.description,
      category: form.category,
      type: form.type,
      url:
        form.type === 'upload'
          ? form.previewUrl
          : form.videoLink.startsWith('http')
          ? form.videoLink
          : `https://${form.videoLink}`,
      uploadedBy: currentUser?.name || 'Anonymous', // ✅ consistent field
      uploadedAt: new Date().toISOString(),
    };

    dispatch(uploadVideo(videoData));

    setForm({
      title: '',
      description: '',
      type: 'upload',
      category: 'Entertainment',
      videoFile: null,
      videoLink: '',
      previewUrl: '',
    });

    toast.success('Video uploaded successfully!');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-10">
      <div className="upload-page max-w-2xl mx-auto mt-12 border w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border-gray-800 dark:border-white">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center text-[#1c1c1c] dark:text-white">
            Upload Video
          </h2>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Video Title"
            required
            className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
          />

          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Video Description"
            required
            className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
          >
            <option value="Entertainment">Entertainment</option>
            <option value="Web">Web</option>
            <option value="Islamic">Islamic</option>
            <option value="Education">Education</option>
            <option value="News">News</option>
          </select>

          <div className="flex flex-col gap-2">
            <label className="text-[#1c1c1c] dark:text-white">
              <input
                type="radio"
                name="type"
                value="upload"
                checked={form.type === 'upload'}
                onChange={handleChange}
                className="mr-2"
              />
              Upload from device
            </label>
            <label className="text-[#1c1c1c] dark:text-white">
              <input
                type="radio"
                name="type"
                value="link"
                checked={form.type === 'link'}
                onChange={handleChange}
                className="mr-2"
              />
              Add streaming link
            </label>
          </div>

          {form.type === 'upload' ? (
            <>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`w-full px-4 py-8 border-2 border-dashed rounded-md text-center cursor-pointer ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-400 dark:border-white'
                }`}
              >
                <p className="text-[#1c1c1c] dark:text-white mb-2">
                  Drag & Drop your video here or click to upload
                </p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleInputFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer text-blue-600 dark:text-blue-300 underline"
                >
                  Browse Files
                </label>
              </div>
              {form.previewUrl && (
                <video src={form.previewUrl} controls className="rounded-md w-full mt-2" />
              )}
            </>
          ) : (
            <input
              type="url"
              name="videoLink"
              value={form.videoLink}
              onChange={handleChange}
              placeholder="Paste YouTube, Twitch, etc."
              required
              className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
            />
          )}

          <button
            type="submit"
            className="bg-[#1c1c1c] text-white dark:bg-white dark:text-[#1c1c1c] px-6 py-2 rounded-md hover:opacity-90 transition"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
