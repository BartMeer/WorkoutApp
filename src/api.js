const backendUrl = import.meta.env.VITE_BACKEND_URL;

export async function fetchWorkouts() {
  try {
    const response = await fetch(`${backendUrl}/workout`);
    if (!response.ok) {
      throw new Error("Failed to fetch workouts");
    }
    return await response.json();
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

// api.js
export async function fetchExercisesByWorkoutId(id) {
  const res = await fetch(`${backendUrl}/workout/${id}/exercises`);
  if (!res.ok) throw new Error("Failed to fetch exercises");
  return await res.json();
}
