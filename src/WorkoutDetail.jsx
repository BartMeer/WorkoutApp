import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchExercisesByWorkoutId } from "./api";

export default function WorkoutDetail() {
  const { id } = useParams();
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refs = useRef([]);

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef(null);
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);

  useEffect(() => {
    fetchExercisesByWorkoutId(id)
      .then((data) => {
        setExercises(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!loading && exercises.length > 0) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((sec) => sec + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [loading, exercises.length]);

  useEffect(() => {
    const el = refs.current[currentIndex];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentIndex]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const nextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      clearInterval(timerRef.current);
      setIsWorkoutFinished(true);
    }
  };

  const prevExercise = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const progressPercent =
    exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;

  const WorkoutCompleteScreen = () => (
    <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Workout Complete! 🎉
        </h2>
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total Time</span>
            <span className="text-2xl font-bold text-orange-500">
              {formatTime(secondsElapsed)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Exercises Completed</span>
            <span className="text-2xl font-bold text-orange-500">
              {exercises.length}
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors"
          >
            Return to Workouts
          </Link>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setSecondsElapsed(0);
              setIsWorkoutFinished(false);
            }}
            className="block w-full bg-gray-100 text-gray-800 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading workout...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/"
            className="block w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="fixed top-0 left-0 w-full z-30 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="text-orange-500 font-medium hover:text-orange-600 transition-colors flex items-center"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </Link>
            <div className="flex flex-col items-center">
              <div className="bg-gray-900 text-orange-400 font-mono text-lg px-4 py-2 rounded-lg shadow-lg animate-pulseGlow">
                {formatTime(secondsElapsed)}
              </div>
            </div>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="fixed top-16 left-0 w-full bg-gray-100 h-1.5 z-30">
        <div
          className="bg-orange-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Exercise timeline */}
      <main className="pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ol
          className="space-y-4 sm:space-y-6 overflow-y-auto px-1"
          style={{ maxHeight: "calc(100vh - 280px)" }}
        >
          {exercises.map((ex, idx) => {
            const isCurrent = idx === currentIndex;
            const isPast = idx < currentIndex;

            return (
              <li
                key={idx}
                ref={(el) => (refs.current[idx] = el)}
                className={`relative group px-6 py-4 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? "bg-white border-l-4 border-orange-500 shadow-lg"
                    : isPast
                    ? "bg-gray-50 border-l-4 border-gray-300 shadow-sm opacity-60"
                    : "bg-gray-50"
                } ${idx > currentIndex ? "opacity-60 scale-95" : ""}`}
              >
                <div
                  className={`absolute -left-2 top-4 w-4 h-4 rounded-full transition ${
                    isCurrent
                      ? "bg-orange-500 animate-ping-slow"
                      : isPast
                      ? "bg-gray-300"
                      : "bg-gray-300"
                  }`}
                />
                <div className="pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2
                      className={`font-bold text-lg ${
                        isCurrent
                          ? "text-gray-800"
                          : isPast
                          ? "text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {ex.name}
                    </h2>
                    {ex.reps && (
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          isCurrent
                            ? "bg-orange-100 text-orange-600"
                            : isPast
                            ? "bg-gray-100 text-gray-500"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {ex.reps} reps
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-sm mb-3 ${
                      isCurrent
                        ? "text-gray-600"
                        : isPast
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {ex.description}
                  </p>
                  {ex.link && (
                    <a
                      href={ex.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center text-sm transition-colors ${
                        isCurrent
                          ? "text-orange-500 hover:text-orange-600"
                          : isPast
                          ? "text-gray-400 hover:text-gray-500"
                          : "text-orange-500 hover:text-orange-600"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Watch Tutorial
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg px-4 py-4 flex justify-between items-center max-w-7xl mx-auto z-30">
        <button
          onClick={prevExercise}
          disabled={currentIndex === 0}
          className={`flex-1 mr-2 py-3 rounded-xl font-semibold text-base transition ${
            currentIndex === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700"
          }`}
        >
          ← Previous
        </button>
        <button
          onClick={nextExercise}
          disabled={isWorkoutFinished}
          className={`flex-1 ml-2 py-3 rounded-xl font-semibold text-base transition ${
            isWorkoutFinished
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700"
          }`}
        >
          {isWorkoutFinished ? "Done" : "Next →"}
        </button>
      </nav>

      {/* Show completion screen when workout is finished */}
      {isWorkoutFinished && <WorkoutCompleteScreen />}

      {/* Custom animations */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            text-shadow: 0 0 5px #fb923c, 0 0 10px #fb923c, 0 0 20px #f97316;
          }
          50% {
            text-shadow: 0 0 10px #f97316, 0 0 20px #f97316, 0 0 30px #ea580c;
          }
        }
        .animate-pulseGlow {
          animation: pulseGlow 2s infinite;
        }
        @keyframes pingSlow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-slow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
