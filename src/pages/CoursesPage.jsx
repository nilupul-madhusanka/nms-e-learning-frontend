import React, { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';
import { ShoppingCart, Play, Clock, DollarSign, BookOpen, Star } from 'lucide-react';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAllCourses();
      setCourses(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch courses' });
    } finally {
      setLoading(false);
    }
  };

  const buyCourse = async (courseId) => {
    setPurchasing(courseId);
    try {
      await courseAPI.buyCourse(courseId);
      setMessage({ type: 'success', text: 'Course purchased successfully!' });
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course._id === courseId 
            ? { ...course, isPurchased: true }
            : course
        )
      );
      // Redirect to "My Courses" page after successful purchase
      window.location.href = '/my-courses';
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to purchase course' 
      });
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Courses</h1>
        <p className="text-gray-600 mt-2">Discover and enroll in courses to advance your skills</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No courses available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Courses will appear here once they are added by administrators.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              {/* Course Image Placeholder */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 rounded-t-lg flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white opacity-80" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                    <span className="text-gray-600 text-sm ml-2">(4.8)</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <Play className="h-4 w-4 mr-1" />
                    {course.videos?.length || 0} lessons
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {Math.floor(Math.random() * 10) + 5}h total
                  </div>
                  
                  <div className="text-2xl font-bold text-blue-600">
                    ${course.price}
                  </div>
                </div>

                <button
                  onClick={() => buyCourse(course._id)}
                  disabled={purchasing === course._id}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {purchasing === course._id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Enroll Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Features Section */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Why Choose Our Courses?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">HD Video Content</h3>
            <p className="text-gray-600">
              High-quality video lessons that you can watch anytime, anywhere.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Lifetime Access</h3>
            <p className="text-gray-600">
              Once purchased, you have lifetime access to all course materials.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Expert Instructors</h3>
            <p className="text-gray-600">
              Learn from industry professionals with years of experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
