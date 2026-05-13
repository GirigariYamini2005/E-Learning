import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, enrollCourse, getQuizzesByCourse } from '../../services/api';
import { FiChevronDown, FiBookOpen, FiEdit3, FiCheckCircle } from 'react-icons/fi';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    Promise.all([getCourse(id), getQuizzesByCourse(id)])
      .then(([courseRes, quizRes]) => {
        setCourse(courseRes.data);
        setQuizzes(quizRes.data);
        setExpandedTopics({ 0: true });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    try {
      await enrollCourse(id);
      setEnrolled(true);
    } catch (err) {
      if (err.response?.data?.message === 'Already enrolled.') {
        setEnrolled(true);
      }
    }
  };

  const toggleTopic = (index) => {
    setExpandedTopics(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const findQuiz = (topicIdx, subtopicIdx) => {
    return quizzes.find(q => q.topicIndex === topicIdx && q.subtopicIndex === subtopicIdx);
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div><p className="loading-text">Loading course...</p></div>;
  }

  if (!course) {
    return <div className="page-container"><div className="empty-state"><h3>Course not found</h3></div></div>;
  }

  const totalSubtopics = course.topics.reduce((sum, t) => sum + t.subtopics.length, 0);

  return (
    <div className="page-container">
      <div className="course-detail">
        <div>
          <div className="course-content">
            <div className="course-hero">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{course.thumbnail || '📖'}</div>
              <h1>{course.title}</h1>
              <p>{course.description}</p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <span className={`course-badge badge-${course.difficulty.toLowerCase()}`}>{course.difficulty}</span>
                <span className="course-badge" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>{course.category}</span>
              </div>
            </div>

            <div className="topic-list">
              <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>📋 Course Content</h2>
              {course.topics.map((topic, tIdx) => (
                <div key={tIdx} className="topic-item">
                  <div className="topic-header" onClick={() => toggleTopic(tIdx)}>
                    <h3>{topic.title}</h3>
                    <span className={`topic-toggle ${expandedTopics[tIdx] ? 'open' : ''}`}>
                      <FiChevronDown />
                    </span>
                  </div>
                  {expandedTopics[tIdx] && (
                    <ul className="subtopic-list">
                      {topic.subtopics.map((sub, sIdx) => (
                        <li
                          key={sIdx}
                          className="subtopic-item"
                          onClick={() => navigate(`/courses/${id}/learn/${tIdx}/${sIdx}`)}
                        >
                          <span className="subtopic-icon"><FiBookOpen /></span>
                          {sub.title}
                        </li>
                      ))}
                      {findQuiz(tIdx, topic.subtopics.length - 1) && (
                        <li
                          className="subtopic-item"
                          style={{ color: 'var(--secondary)' }}
                          onClick={() => navigate(`/quiz/${findQuiz(tIdx, topic.subtopics.length - 1)._id}`)}
                        >
                          <span className="subtopic-icon" style={{ borderColor: 'var(--secondary)' }}>
                            <FiEdit3 />
                          </span>
                          Take Quiz — {topic.title}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="course-sidebar">
          <div className="sidebar-card">
            <h3>Course Info</h3>
            <div className="sidebar-stat">
              <span className="label">Topics</span>
              <span className="value">{course.topics.length}</span>
            </div>
            <div className="sidebar-stat">
              <span className="label">Subtopics</span>
              <span className="value">{totalSubtopics}</span>
            </div>
            <div className="sidebar-stat">
              <span className="label">Quizzes</span>
              <span className="value">{quizzes.length}</span>
            </div>
            <div className="sidebar-stat">
              <span className="label">Difficulty</span>
              <span className="value">{course.difficulty}</span>
            </div>
            <button
              className={`btn ${enrolled ? 'btn-success' : 'btn-primary'} btn-lg`}
              style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
              onClick={handleEnroll}
              disabled={enrolled}
            >
              {enrolled ? <><FiCheckCircle /> Enrolled</> : 'Enroll Now'}
            </button>
          </div>

          {quizzes.length > 0 && (
            <div className="sidebar-card">
              <h3>📝 Quizzes</h3>
              {quizzes.map((quiz, idx) => (
                <div
                  key={quiz._id}
                  className="subtopic-item"
                  style={{ padding: '0.6rem 0', borderTop: idx > 0 ? '1px solid var(--border-light)' : 'none' }}
                  onClick={() => navigate(`/quiz/${quiz._id}`)}
                >
                  <span className="subtopic-icon" style={{ borderColor: 'var(--secondary)' }}>
                    <FiEdit3 />
                  </span>
                  {quiz.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
