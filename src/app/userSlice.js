import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      const foundUser = allUsers.find(
        (user) => user.email === action.payload.email
      );

      state.currentUser = foundUser || {
        name: action.payload.name,
        email: action.payload.email,
      };

      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    },

    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('currentUser');
    },

    updateUser: (state, action) => {
      if (!state.currentUser) return;

      const oldEmail = state.currentUser.email; // store old email before updating

      // Update currentUser
      state.currentUser = {
        ...state.currentUser,
        ...action.payload,
      };
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));

      // Update in users list using old email
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = allUsers.map((user) =>
        user.email === oldEmail
          ? { ...user, ...action.payload }
          : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    },

    deleteUser: (state) => {
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      const filtered = allUsers.filter(
        (user) => user.email !== state.currentUser?.email
      );
      localStorage.setItem('users', JSON.stringify(filtered));
      localStorage.removeItem('currentUser');
      state.currentUser = null;
    },
  },
});

export const { login, logout, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
