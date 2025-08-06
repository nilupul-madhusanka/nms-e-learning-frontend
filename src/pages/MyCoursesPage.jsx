import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { Play, BookOpen, Clock, CheckCircle } from 'lucide-react';

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await courseAPI.getMyCourses();
      const coursesWithProgress = response.data.map(course => {
        // Get progress from localStorage
        const savedProgress = localStorage.getItem(`course_${course._id}_progress`);
        const completedLessons = savedProgress ? JSON.parse(savedProgress) : [];
        const progress = course.videos?.length > 0 
          ? Math.round((completedLessons.length / course.videos.length) * 100)
          : 0;
        
        return {
          ...course,
          progress,
          completedLessons: completedLessons.length
        };
      });
      setCourses(coursesWithProgress);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to fetch your courses' 
      });
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-2">Continue learning with your enrolled courses</p>
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
          <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">No courses enrolled</h3>
          <p className="mt-2 text-gray-500 mb-6">
            You haven't enrolled in any courses yet. Start learning today!
          </p>
          <Link
            to="/courses"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium inline-flex items-center"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Browse Courses
          </Link>
        </div>
      ) : (
        <>
          {/* Progress Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{courses.length}</div>
                <div className="text-gray-600">Enrolled Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {courses.reduce((sum, course) => sum + (course.completedLessons || 0), 0)}
                </div>
                <div className="text-gray-600">Completed Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {courses.reduce((sum, course) => sum + (course.videos?.length || 0), 0)}
                </div>
                <div className="text-gray-600">Total Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {courses.length > 0 ? Math.round(
                    courses.reduce((sum, course) => sum + (course.progress || 0), 0) / courses.length
                  ) : 0}%
                </div>
                <div className="text-gray-600">Average Progress</div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const progress = course.progress; // Real progress from localStorage
              const completedLessons = course.completedLessons; // Real completed lessons count
              
              return (
                <div key={course._id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  {/* Course Image Placeholder */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-40 rounded-t-lg flex items-center justify-center relative">
                    <BookOpen className="h-12 w-12 text-white opacity-80" />
                    
                    {/* Progress Badge */}
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                      {progress}% Complete
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{completedLessons}/{course.videos?.length || 0} lessons</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Play className="h-4 w-4 mr-1" />
                        {course.videos?.length || 0} lessons
                      </div>
                      
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {`${Math.floor(Math.random() * 16) + 5} hours`}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        to={`/course/${course._id}/lessons`}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center transition-colors"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {progress === 0 ? 'Start Learning' : 'Continue Learning'}
                      </Link>
                      
                      {progress === 100 && (
                        <div className="flex items-center justify-center text-green-600 text-sm font-medium">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Course Completed!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Learning Tips */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Tips</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Set a Schedule</h3>
                  <p className="text-gray-600 text-sm">
                    Dedicate specific times for learning to build a consistent habit.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Practice Regularly</h3>
                  <p className="text-gray-600 text-sm">
                    Apply what you learn through practice exercises and projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyCoursesPage;
