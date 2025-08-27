import { createSlice } from '@reduxjs/toolkit';

const savedVideos = JSON.parse(localStorage.getItem('videos')) || [];

const videoSlice = createSlice({
  name: 'videos',
  initialState: { videos: savedVideos },
  reducers: {
    uploadVideo: (state, action) => {
      const v = action.payload;
      const videoWithUploader = {
        ...v,
        // Keep both name + email for display + reliable ownership
        uploadedBy: v.uploadedBy ?? v.uploader ?? 'Anonymous',
        uploadedByEmail: v.uploadedByEmail ?? v.uploaderEmail ?? v.email ?? null,
      };
      state.videos.push(videoWithUploader);
      localStorage.setItem('videos', JSON.stringify(state.videos));
    },

    deleteVideo: (state, action) => {
      const updatedVideos = state.videos.filter((v) => v.id !== action.payload);
      state.videos = updatedVideos;
      localStorage.setItem('videos', JSON.stringify(updatedVideos));
    },

  updateVideosUploader: (state, action) => {
  const { oldName, newName, email } = action.payload;

  state.videos = state.videos.map((v) => {
    console.log(state.videos)
    // Match by email (preferred) or oldName if no email was stored
    if (
      (email && v.uploadedByEmail === email) ||
      (!v.uploadedByEmail && v.uploadedBy === oldName)
    ) {
      return {
        ...v,
        uploadedBy: newName, // replace with latest name
      };
    }
    return v;
  });

    localStorage.setItem('videos', JSON.stringify(state.videos));
  },

    // 🔥 Bulk delete by uploader
    deleteVideosByUploader: (state, action) => {
      const { email, name } = action.payload || {};
      const updatedVideos = state.videos.filter((v) => {
        // Prefer email (stable). Fall back to name for older records.
        const emailMatch = email ? v.uploadedByEmail === email : false;
        const nameMatch = name ? (v.uploadedBy === name || v.uploader === name) : false;
        return !(emailMatch || (!v.uploadedByEmail && nameMatch));
      });
      state.videos = updatedVideos;
      localStorage.setItem('videos', JSON.stringify(updatedVideos));
    },
  },
});

export const { uploadVideo, deleteVideo, deleteVideosByUploader, updateVideosUploader  } = videoSlice.actions;
export default videoSlice.reducer;
