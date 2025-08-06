import React, { useState, useEffect } from 'react';
import { courseAPI, authAPI } from '../services/api';
import { Plus, Edit, Trash2, BookOpen, Users, DollarSign, Play, UserMinus, RefreshCcw } from 'lucide-react';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [adminStats, setAdminStats] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    totalEnrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    videos: [''],
  });
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    email: '',
    resetPassword: false,
  });

  useEffect(() => {
    fetchCourses();
    fetchAdminStats();
    fetchStudents();
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

  const fetchStudents = async () => {
    try {
      const response = await authAPI.getAllStudents();
      setStudents(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch students' });
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response = await authAPI.getAdminStats();
      setAdminStats(response.data);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      // Don't show error message for stats as it's not critical
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStudentInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setStudentFormData({
      ...studentFormData,
      [e.target.name]: value,
    });
  };

  const handleVideoChange = (index, value) => {
    const newVideos = [...formData.videos];
    newVideos[index] = value;
    setFormData({ ...formData, videos: newVideos });
  };

  const addVideoField = () => {
    setFormData({
      ...formData,
      videos: [...formData.videos, ''],
    });
  };

  const removeVideoField = (index) => {
    const newVideos = formData.videos.filter((_, i) => i !== index);
    setFormData({ ...formData, videos: newVideos });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      videos: [''],
    });
    setEditingCourse(null);
  };

  const openModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price.toString(),
        videos: course.videos.length > 0 ? course.videos : [''],
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const openStudentModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setStudentFormData({
        name: student.name,
        email: student.email,
        resetPassword: false,
      });
    } else {
      setEditingStudent(null);
      setStudentFormData({
        name: '',
        email: '',
        resetPassword: false,
      });
    }
    setShowStudentModal(true);
  };

  const closeStudentModal = () => {
    setShowStudentModal(false);
    setEditingStudent(null);
    setStudentFormData({
      name: '',
      email: '',
      resetPassword: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = {
        ...formData,
        price: parseFloat(formData.price),
        videos: formData.videos.filter(video => video.trim() !== ''),
      };

      if (editingCourse) {
        await courseAPI.updateCourse(editingCourse._id, courseData);
        setMessage({ type: 'success', text: 'Course updated successfully' });
      } else {
        await courseAPI.createCourse(courseData);
        setMessage({ type: 'success', text: 'Course created successfully' });
      }

      fetchCourses();
      fetchAdminStats(); // Refresh stats after course changes
      closeModal();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to save course' 
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await courseAPI.deleteCourse(courseId);
      setMessage({ type: 'success', text: 'Course deleted successfully' });
      fetchCourses();
      fetchAdminStats(); // Refresh stats after course deletion
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete course' 
      });
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingStudent) {
        const response = await authAPI.updateStudent(editingStudent._id, studentFormData);
        setMessage({ type: 'success', text: response.data.message });
      }

      fetchStudents();
      fetchAdminStats(); // Refresh stats after student changes
      closeStudentModal();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update student' 
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      await authAPI.deleteStudent(studentId);
      setMessage({ type: 'success', text: 'Student deleted successfully' });
      fetchStudents();
      fetchAdminStats(); // Refresh stats after student deletion
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete student' 
      });
    }
  };

  return (
    <div className="bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage courses, platform content and users</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Courses</p>
              <p className="text-2xl font-bold text-blue-900">{courses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Total Students</p>
              <p className="text-2xl font-bold text-green-900">{adminStats.totalStudents.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-900">${adminStats.totalRevenue}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Total Videos</p>
              <p className="text-2xl font-bold text-orange-900">
                {courses.reduce((sum, course) => sum + (course.videos?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Course Management</h2>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Course</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Videos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {course.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {course.description?.substring(0, 100)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      ${course.price}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {course.videos?.length || 0} videos
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal(course)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {courses.length === 0 && !loading && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new course.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Student Management */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Student Management</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {student.purchasedCourses?.length || 0} courses
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      ${student.purchasedCourses?.reduce((sum, course) => sum + (course.price || 0), 0).toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openStudentModal(student)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Edit Student"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteStudent(student._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Student"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {students.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students</h3>
              <p className="mt-1 text-sm text-gray-500">
                No students have registered yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URLs
                  </label>
                  {formData.videos.map((video, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="url"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter video URL"
                        value={video}
                        onChange={(e) => handleVideoChange(index, e.target.value)}
                      />
                      {formData.videos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVideoField(index)}
                          className="ml-2 px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addVideoField}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Video URL
                  </button>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Student: {editingStudent?.name}
              </h3>
              
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={studentFormData.name}
                    onChange={handleStudentInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={studentFormData.email}
                    onChange={handleStudentInputChange}
                  />
                </div>

                {editingStudent?.purchasedCourses?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enrolled Courses
                    </label>
                    <div className="bg-gray-50 p-3 rounded-md">
                      {editingStudent.purchasedCourses.map((course, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm text-gray-700">{course.title}</span>
                          <span className="text-sm font-medium text-gray-900">${course.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeStudentModal}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
