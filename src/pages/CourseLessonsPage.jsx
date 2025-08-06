import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { Play, CheckCircle, ArrowLeft, Clock, BookOpen, ChevronRight, ExternalLink } from 'lucide-react';

const CourseLessonsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [videoLoadError, setVideoLoadError] = useState(false);

  useEffect(() => {
    fetchCourseLessons();
  }, [courseId]);

  useEffect(() => {
    // Reset video error state when video changes
    setVideoLoadError(false);
  }, [currentVideoIndex]);

  const fetchCourseLessons = async () => {
    try {
      const response = await courseAPI.getCourseLessons(courseId);
      setCourse(response.data);
      
      // Load completed lessons from localStorage
      const savedProgress = localStorage.getItem(`course_${courseId}_progress`);
      if (savedProgress) {
        setCompletedLessons(new Set(JSON.parse(savedProgress)));
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to fetch course lessons' 
      });
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = (lessonIndex) => {
    const newCompletedLessons = new Set(completedLessons);
    newCompletedLessons.add(lessonIndex);
    setCompletedLessons(newCompletedLessons);
    
    // Save progress to localStorage
    localStorage.setItem(
      `course_${courseId}_progress`, 
      JSON.stringify([...newCompletedLessons])
    );
  };

  const getVideoId = (url) => {
    // Extract video ID from YouTube URL for embedding
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getGoogleDriveId = (url) => {
    // Extract file ID from Google Drive URL
    // Format: https://drive.google.com/file/d/FILE_ID/view
    const regExp = /\/file\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(regExp);
    if (match) return match[1];
    
    // Alternative pattern: https://drive.google.com/open?id=FILE_ID
    const regExp2 = /[?&]id=([a-zA-Z0-9-_]+)/;
    const match2 = url.match(regExp2);
    if (match2) return match2[1];
    
    // Pattern for direct share links: https://docs.google.com/document/d/FILE_ID/
    const regExp3 = /\/d\/([a-zA-Z0-9-_]+)/;
    const match3 = url.match(regExp3);
    return match3 ? match3[1] : null;
  };

  const isYouTubeUrl = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const isGoogleDriveUrl = (url) => {
    return url.includes('drive.google.com') || url.includes('docs.google.com');
  };

  const getEmbedUrl = (url) => {
    if (isYouTubeUrl(url)) {
      const videoId = getVideoId(url);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    
    if (isGoogleDriveUrl(url)) {
      const fileId = getGoogleDriveId(url);
      return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
    }
    
    return url;
  };

  const getVideoSourceType = (url) => {
    if (isYouTubeUrl(url)) return 'YouTube';
    if (isGoogleDriveUrl(url)) return 'Google Drive';
    return 'Direct Video';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Course not found</h3>
        <p className="mt-1 text-gray-500">
          You may not have access to this course or it doesn't exist.
        </p>
        <button
          onClick={() => navigate('/my-courses')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  const currentVideo = course.videos[currentVideoIndex];
  const progress = Math.round((completedLessons.size / course.videos.length) * 100);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/my-courses')}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to My Courses
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
                <div className="flex items-center text-sm text-gray-600">
                  <span>{completedLessons.size}/{course.videos.length} lessons completed</span>
                  <span className="mx-2">•</span>
                  <span>{progress}% complete</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-sm text-gray-600">Progress:</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4`}>
          <div className={`p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video bg-black">
                {currentVideo ? (
                  isYouTubeUrl(currentVideo) ? (
                    <iframe
                      src={getEmbedUrl(currentVideo)}
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      title={`Lesson ${currentVideoIndex + 1}`}
                      onError={() => setVideoLoadError(true)}
                    />
                  ) : isGoogleDriveUrl(currentVideo) ? (
                    videoLoadError ? (
                      <div className="flex items-center justify-center h-full text-white">
                        <div className="text-center p-6">
                          <ExternalLink className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="mb-4">This video cannot be embedded due to privacy settings.</p>
                          <a
                            href={currentVideo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in Google Drive
                          </a>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        src={getEmbedUrl(currentVideo)}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        title={`Lesson ${currentVideoIndex + 1}`}
                        onError={() => setVideoLoadError(true)}
                      />
                    )
                  ) : (
                    <video
                      src={currentVideo}
                      controls
                      className="w-full h-full"
                      onEnded={() => markLessonComplete(currentVideoIndex)}
                      onError={() => setVideoLoadError(true)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>No video available</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Lesson {currentVideoIndex + 1}: Video Lesson
                  </h2>
                  
                  {completedLessons.has(currentVideoIndex) ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => markLessonComplete(currentVideoIndex)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">
                  This is lesson {currentVideoIndex + 1} of {course.videos.length} in the course "{course.title}".
                  {currentVideo && (
                    <span className="block text-sm text-gray-500 mt-1">
                      Video source: {getVideoSourceType(currentVideo)}
                      {isGoogleDriveUrl(currentVideo) && (
                        <span className="block text-xs text-gray-400 mt-1">
                          Note: Google Drive videos must be shared publicly to be embedded
                        </span>
                      )}
                    </span>
                  )}
                </p>
                
                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentVideoIndex(Math.max(0, currentVideoIndex - 1))}
                    disabled={currentVideoIndex === 0}
                    className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  
                  <button
                    onClick={() => setCurrentVideoIndex(Math.min(course.videos.length - 1, currentVideoIndex + 1))}
                    disabled={currentVideoIndex === course.videos.length - 1}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Course Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-gray-900">Course Content</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {course.videos.length} lessons
                </p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {course.videos.map((video, index) => (
                  <div
                    key={index}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      index === currentVideoIndex ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                    }`}
                    onClick={() => setCurrentVideoIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          completedLessons.has(index) 
                            ? 'bg-green-100 text-green-600' 
                            : index === currentVideoIndex
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {completedLessons.has(index) ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Lesson {index + 1}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {Math.floor(Math.random() * 15) + 5} min
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Progress */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Your Progress</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Completion</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Lessons completed:</span>
                      <span>{completedLessons.size}/{course.videos.length}</span>
                    </div>
                  </div>
                  
                  {progress === 100 && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-sm font-medium text-green-800">
                        Congratulations! 🎉
                      </div>
                      <div className="text-xs text-green-600">
                        You've completed this course!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLessonsPage;
