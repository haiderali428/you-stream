import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import Upload from './pages/Upload';
import WatchVideo from './pages/WatchVideo';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ import
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const isLoading = useSelector((state) => state.loader.isLoading);

  return (
    <>
      {isLoading && <Loader />}

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ✅ Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watch/:id"
          element={
            <ProtectedRoute>
              <WatchVideo />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
