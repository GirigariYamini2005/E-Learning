import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getCourse, getQuizzesByCourse } from '../../services/api';
import { FiArrowLeft, FiArrowRight, FiEdit3 } from 'react-icons/fi';

const ContentViewer = () => {
  const { courseId, topicIndex, subtopicIndex } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const tIdx = parseInt(topicIndex);
  const sIdx = parseInt(subtopicIndex);

  useEffect(() => {
    Promise.all([getCourse(courseId), getQuizzesByCourse(courseId)])
      .then(([courseRes, quizRes]) => {
        setCourse(courseRes.data);
        setQuizzes(quizRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div><p className="loading-text">Loading content...</p></div>;
  }

  if (!course) {
    return <div className="page-container"><div className="empty-state"><h3>Content not found</h3></div></div>;
  }

  const topic = course.topics[tIdx];
  const subtopic = topic?.subtopics[sIdx];

  if (!subtopic) {
    return <div className="page-container"><div className="empty-state"><h3>Subtopic not found</h3></div></div>;
  }

  // Navigation logic
  const getPrev = () => {
    if (sIdx > 0) return { t: tIdx, s: sIdx - 1 };
    if (tIdx > 0) {
      const prevTopic = course.topics[tIdx - 1];
      return { t: tIdx - 1, s: prevTopic.subtopics.length - 1 };
    }
    return null;
  };

  const getNext = () => {
    if (sIdx < topic.subtopics.length - 1) return { t: tIdx, s: sIdx + 1 };
    if (tIdx < course.topics.length - 1) return { t: tIdx + 1, s: 0 };
    return null;
  };

  const prev = getPrev();
  const next = getNext();

  // Check if there's a quiz for the current subtopic
  const quiz = quizzes.find(q => q.topicIndex === tIdx && q.subtopicIndex === sIdx);

  // Check if this is the last subtopic in the topic (show topic quiz)
  const isLastInTopic = sIdx === topic.subtopics.length - 1;
  const topicQuizzes = quizzes.filter(q => q.topicIndex === tIdx);

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          <FiArrowLeft /> Back to Course
        </button>
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
          {course.title} &gt; {topic.title} &gt; {subtopic.title}
        </div>
      </div>

      <div className="content-viewer">
        <ReactMarkdown>{subtopic.content}</ReactMarkdown>

        <div className="content-nav">
          <div>
            {prev && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => navigate(`/courses/${courseId}/learn/${prev.t}/${prev.s}`)}
              >
                <FiArrowLeft /> Previous
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {isLastInTopic && topicQuizzes.length > 0 && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate(`/quiz/${topicQuizzes[0]._id}`)}
              >
                <FiEdit3 /> Take Quiz
              </button>
            )}
            {quiz && !isLastInTopic && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate(`/quiz/${quiz._id}`)}
              >
                <FiEdit3 /> Take Quiz
              </button>
            )}
            {next && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/courses/${courseId}/learn/${next.t}/${next.s}`)}
              >
                Next <FiArrowRight />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentViewer;
