import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateVideoSlides, getCourses } from '../../services/api';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVideo, FiLoader } from 'react-icons/fi';

const SLIDE_DURATION = 6000; // 6 seconds per slide

const VideoGenerator = () => {
  const [topic, setTopic] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedTopic, setGeneratedTopic] = useState('');

  // Slideshow player state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    getCourses()
      .then(res => setCourses(res.data))
      .catch(() => {});
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => {
      if (prev < slides.length - 1) return prev + 1;
      setIsPlaying(false);
      return prev;
    });
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : 0));
    setProgress(0);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying && slides.length > 0) {
      const startTime = Date.now();
      progressRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100));
      }, 50);

      timerRef.current = setTimeout(() => {
        nextSlide();
      }, SLIDE_DURATION);

      return () => {
        clearTimeout(timerRef.current);
        clearInterval(progressRef.current);
      };
    }
  }, [isPlaying, currentSlide, slides.length, nextSlide]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setSlides([]);
    setCurrentSlide(0);
    setIsPlaying(false);
    setProgress(0);

    try {
      const res = await generateVideoSlides(topic.trim(), selectedCourseId || undefined);
      setSlides(res.data.slides);
      setGeneratedTopic(res.data.topic);
      setIsPlaying(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate video. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (currentSlide === slides.length - 1 && !isPlaying) {
      setCurrentSlide(0);
      setProgress(0);
    }
    setIsPlaying(prev => !prev);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="page-container" style={{ maxWidth: '960px' }}>
      <div className="page-header">
        <h1><FiVideo style={{ marginRight: 8, verticalAlign: 'middle' }} /> AI Video Generator</h1>
        <p>Generate educational slideshow videos from any topic using AI</p>
      </div>

      {/* Generation Form */}
      <div className="video-gen-form">
        <form onSubmit={handleGenerate}>
          <div className="video-gen-inputs">
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Topic</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Introduction to Neural Networks"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                maxLength={200}
                disabled={loading}
              />
            </div>
            <div className="form-group" style={{ width: '220px', marginBottom: 0 }}>
              <label>Course (optional)</label>
              <select
                className="form-input"
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                disabled={loading}
              >
                <option value="">None</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button className="btn btn-primary btn-lg" type="submit" disabled={loading || !topic.trim()}>
                {loading ? <><FiLoader className="spin-icon" /> Generating...</> : <><FiVideo /> Generate</>}
              </button>
            </div>
          </div>
        </form>
        {loading && (
          <div className="video-gen-status">
            <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }}></div>
            <span>Generating slides with AI... This may take a minute.</span>
          </div>
        )}
        {error && <div className="error-message" style={{ marginTop: '1rem' }}>{error}</div>}
      </div>

      {/* Slideshow Player */}
      {slides.length > 0 && (
        <div className="slideshow-player">
          <div className="slideshow-title-bar">
            <span className="ai-badge">✨ AI Generated</span>
            <span className="slideshow-topic">{generatedTopic}</span>
          </div>

          <div className="slideshow-viewport">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`slideshow-slide ${idx === currentSlide ? 'active' : ''} ${idx < currentSlide ? 'prev' : ''}`}
              >
                <div className="slide-image-container">
                  {slide.imageUrl ? (
                    <img src={slide.imageUrl} alt={slide.title} className="slide-image" />
                  ) : (
                    <div className="slide-image-placeholder">
                      <span>🎨</span>
                      <p>Image unavailable</p>
                    </div>
                  )}
                  <div className="slide-overlay">
                    <div className="slide-number">Slide {idx + 1} of {slides.length}</div>
                    <h2 className="slide-title">{slide.title}</h2>
                    <p className="slide-description">{slide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="slideshow-progress-bar">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`progress-segment ${idx < currentSlide ? 'completed' : ''} ${idx === currentSlide ? 'current' : ''}`}
                onClick={() => goToSlide(idx)}
              >
                <div
                  className="progress-segment-fill"
                  style={{
                    width: idx < currentSlide ? '100%' : idx === currentSlide ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="slideshow-controls">
            <button className="slide-ctrl-btn" onClick={prevSlide} disabled={currentSlide === 0}>
              <FiSkipBack />
            </button>
            <button className="slide-ctrl-btn play-btn" onClick={togglePlay}>
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
            <button className="slide-ctrl-btn" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
              <FiSkipForward />
            </button>
            <span className="slide-counter">{currentSlide + 1} / {slides.length}</span>
          </div>

          {/* Slide Thumbnails */}
          <div className="slideshow-thumbnails">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`slide-thumb ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
              >
                {slide.imageUrl ? (
                  <img src={slide.imageUrl} alt={slide.title} />
                ) : (
                  <div className="thumb-placeholder">🎨</div>
                )}
                <span className="thumb-label">{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
