import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../../services/api';
import { FiSearch } from 'react-icons/fi';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    getCourses()
      .then(res => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                       c.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.difficulty === filter;
    return matchSearch && matchFilter;
  });

  const categories = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📚 Explore Courses</h1>
        <p>Discover courses tailored to your learning goals</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No courses found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="courses-grid">
          {filtered.map(course => (
            <div
              key={course._id}
              className="course-card"
              onClick={() => navigate(`/courses/${course._id}`)}
            >
              <div className={`course-card-thumb ${course.difficulty.toLowerCase()}`}>
                {course.thumbnail || '📖'}
              </div>
              <div className="course-card-body">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-card-meta">
                  <span className={`course-badge badge-${course.difficulty.toLowerCase()}`}>
                    {course.difficulty}
                  </span>
                  <span className="course-category">{course.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
