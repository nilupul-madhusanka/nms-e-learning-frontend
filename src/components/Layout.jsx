import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, BookOpen, LogOut, User, Home, ShoppingCart, Play } from 'lucide-react';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-xl font-bold text-blue-600"
                onClick={closeMenu}
              >
                <BookOpen className="h-8 w-8" />
                <span>EduLearn</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {isStudent && (
                    <>
                      <Link 
                        to="/courses" 
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Browse Courses</span>
                      </Link>
                      <Link 
                        to="/my-courses" 
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                      >
                        <Play className="h-4 w-4" />
                        <span>My Courses</span>
                      </Link>
                    </>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{user?.name}</span>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={closeMenu}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={closeMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {isStudent && (
                    <>
                      <Link 
                        to="/courses" 
                        className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                        onClick={closeMenu}
                      >
                        Browse Courses
                      </Link>
                      <Link 
                        to="/my-courses" 
                        className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                        onClick={closeMenu}
                      >
                        My Courses
                      </Link>
                    </>
                  )}
                  
                  <div className="px-3 py-2 border-t mt-2 pt-2">
                    <p className="text-gray-700 text-sm mb-2">Welcome, {user?.name}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Link 
                    to="/login" 
                    className="block w-full text-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium border"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-medium"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
