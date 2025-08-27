// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/userSlice';
import { toggleTheme } from '../app/themeSlice';
import { Sun, Moon, Menu, X } from 'lucide-react';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showNavbar, setShowNavbar] = useState(true);
  //   const [theme, setTheme] = useState(() => {
  //   return localStorage.getItem('theme') || 'light';
  // });

  const theme = useSelector((state) => state.theme.mode);

  const [menuOpen, setMenuOpen] = useState(false);



  //  useEffect(() => {
  //   document.documentElement.classList.toggle('dark', theme === 'dark');
  //   localStorage.setItem('theme', theme);
  // }, [theme]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="text-xl font-bold dark:text-gray-300 text-primary">
          You Stream
        </Link>

        {/* Center: Nav links (hidden on small screens) */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700 dark:text-gray-200">
          {currentUser && <Link to="/">Home</Link>}
          {currentUser && <Link to="/explore">Explore</Link>}
          {currentUser && <Link to="/upload">Upload</Link>}
          {currentUser && <Link to="/dashboard">Dashboard</Link>}
        </nav>

        {/* Right: Theme toggle & Auth */}
        <div className="flex items-center gap-4">
          {/* Theme Switch */}
          {/* <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="text-gray-600 dark:text-gray-300"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button> */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="text-gray-600 dark:text-gray-300"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Desktop Auth Buttons */}
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="hidden md:block px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Logout
            </button>
          ) : (
            <div className="hidden md:flex gap-3 text-sm">
              <Link to="/signin" className="text-gray-600 dark:text-gray-300">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Signup
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col   bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow px-4 pb-4 space-y-3">
          {currentUser && (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/explore" onClick={() => setMenuOpen(false)}>
                Explore
              </Link>

              <Link to="/upload" onClick={() => setMenuOpen(false)}>
                Upload
              </Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="text-red-600"
              >
                Logout
              </button>
            </>
          )}
          {!currentUser && (
            <>
              <Link to="/signin" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
