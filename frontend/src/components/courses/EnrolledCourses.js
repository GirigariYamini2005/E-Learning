import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnrolledCourses } from '../../services/api';
import { FiBookOpen, FiArrowRight } from 'react-icons/fi';

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEnrolledCourses()
      .then(res => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading enrolled courses...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📖 My Enrolled Courses</h1>
        <p>Continue learning from where you left off</p>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No enrolled courses yet</h3>
          <p>Explore our course catalog and enroll in courses that interest you!</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/courses')}>
            <FiBookOpen /> Browse Courses
          </button>
        </div>
      ) : (
        <div className="enrolled-grid">
          {courses.map(course => (
            <div key={course._id} className="enrolled-card">
              <div className={`enrolled-card-thumb ${course.difficulty?.toLowerCase() || 'beginner'}`}>
                {course.thumbnail || '📖'}
              </div>
              <div className="enrolled-card-body">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="enrolled-card-meta">
                  <span className={`course-badge badge-${course.difficulty?.toLowerCase() || 'beginner'}`}>
                    {course.difficulty || 'Beginner'}
                  </span>
                  <span className="course-category">{course.category}</span>
                </div>
                <div className="enrolled-card-topics">
                  <FiBookOpen style={{ color: 'var(--text-light)', fontSize: '0.85rem' }} />
                  <span>{course.topics?.length || 0} Topics</span>
                </div>
                <div className="enrolled-card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    Continue Learning <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
