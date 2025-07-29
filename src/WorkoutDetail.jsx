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
    if (!loading && exercises.length > 0 && !isWorkoutFinished) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((sec) => sec + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [loading, exercises.length, isWorkoutFinished]);

  useEffect(() => {
    const el = refs.current[currentIndex];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentIndex]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-40 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="w-24 h-24 bg-orange-950 bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-100 mb-4">
          Workout Complete! 🎉
        </h2>
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">Total Time</span>
            <span className="text-2xl font-bold text-orange-400">
              {formatTime(secondsElapsed)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Exercises Completed</span>
            <span className="text-2xl font-bold text-orange-400">
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
            className="block w-full bg-gray-700 text-gray-300 py-4 rounded-xl font-semibold text-lg hover:bg-gray-600 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg font-medium">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="w-24 h-24 bg-red-950 bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-red-400"
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
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link
            to="/"
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors block"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top bar */}
      <header className="fixed top-0 left-0 w-full z-30 bg-gray-900 shadow-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="text-orange-400 font-semibold hover:text-orange-500 transition-colors flex items-center"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <div className="bg-orange-950 bg-opacity-30 text-orange-400 font-mono text-lg px-4 py-2 rounded-lg shadow-inner animate-pulse mx-auto">
              {formatTime(secondsElapsed)}
            </div>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="fixed top-16 left-0 w-full bg-gray-800 h-1.5 z-30">
        <div
          className="bg-orange-400 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Exercises list */}
      <main className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-y-auto max-h-[90vh]">
        <ol className="space-y-4 sm:space-y-6">
          {exercises.map((ex, idx) => {
            const isCurrent = idx === currentIndex;
            const isPast = idx < currentIndex;
            return (
              <li
                key={idx}
                ref={(el) => (refs.current[idx] = el)}
                className={`relative group rounded-xl border border-gray-700 p-6 transition-shadow duration-300 ${
                  isCurrent
                    ? "bg-gray-800 border-orange-500 shadow-lg"
                    : isPast
                    ? "bg-gray-800 border-gray-700 opacity-70"
                    : "bg-gray-900 border-gray-700 opacity-60"
                } cursor-pointer`}
                tabIndex={0}
                onClick={() => setCurrentIndex(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setCurrentIndex(idx);
                }}
              >
                <div
                  className={`absolute -left-3 top-6 w-5 h-5 rounded-full transition-colors ${
                    isCurrent
                      ? "bg-orange-400 animate-ping-slow"
                      : isPast
                      ? "bg-orange-600"
                      : "bg-gray-600"
                  }`}
                  aria-hidden="true"
                ></div>

                <h3 className="text-orange-400 text-xl font-semibold mb-2">
                  {ex.name}
                </h3>
                <p className="text-gray-300">{ex.description}</p>

                <div className="mt-4 flex space-x-6 text-gray-400 font-mono text-sm">
                  <div>
                    <strong>Sets:</strong> {ex.sets}
                  </div>
                  <div>
                    <strong>Reps:</strong> {ex.reps}
                  </div>
                  {ex.weight && (
                    <div>
                      <strong>Weight:</strong> {ex.weight} kg
                    </div>
                  )}
                  {ex.rest && (
                    <div>
                      <strong>Rest:</strong> {ex.rest} sec
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </main>

      {/* Controls */}
      {!isWorkoutFinished && (
        <footer className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 flex justify-between px-6 py-4 max-w-7xl mx-auto">
          <button
            onClick={prevExercise}
            disabled={currentIndex === 0}
            className={`px-5 py-3 rounded-lg font-semibold text-lg transition-colors ${
              currentIndex === 0
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-gray-900 hover:bg-orange-600"
            }`}
          >
            Previous
          </button>
          <button
            onClick={nextExercise}
            className="px-5 py-3 rounded-lg bg-orange-500 text-gray-900 font-semibold text-lg hover:bg-orange-600 transition-colors"
          >
            {currentIndex === exercises.length - 1 ? "Finish" : "Next"}
          </button>
        </footer>
      )}

      {/* Finished screen */}
      {isWorkoutFinished && <WorkoutCompleteScreen />}
    </div>
  );
}
