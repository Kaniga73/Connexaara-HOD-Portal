import api from "./axiosInstance";

/**
 * POST /batches
 * Creates a new batch (HOD only).
 *
 * @param {{ name: string, startYear: number, endYear: number, currentSemester: number }} data
 */
export async function createBatch(data) {
  const response = await api.post("/batches", data);
  return response.data;
}

/**
 * GET /batches
 * Returns a paginated list of batches.
 *
 * @param {{ page?: number, limit?: number, search?: string, isPassedOut?: boolean }} params
 */
export async function getBatches(params = {}) {
  const response = await api.get("/batches", { params });
  return response.data; // { data: [...], meta: { total, page, limit } }
}

/**
 * GET /batches/:id
 * Returns complete details of a single batch including tutor info, etc.
 *
 * @param {string} id
 */
export async function getBatchById(id) {
  const response = await api.get(`/batches/${id}`);
  return response.data;
}

/**
 * GET /batches/available-tutors
 * Returns active staff not currently tutoring any active batch.
 */
export async function getAvailableTutors() {
  const response = await api.get("/batches/available-tutors");
  return response.data; // array of staff objects
}

/**
 * PATCH /batches/:id/assign-tutor
 * Assigns a tutor to a batch.
 *
 * @param {string} id
 * @param {string} staffId
 */
export async function assignTutor(id, staffId) {
  const response = await api.patch(`/batches/${id}/assign-tutor`, { staffId });
  return response.data; // { message: "Tutor assigned successfully" }
}

/**
 * PATCH /batches/:id/promote
 * Increments currentSemester by 1.
 *
 * @param {string} id
 */
export async function promoteBatch(id) {
  const response = await api.patch(`/batches/${id}/promote`);
  return response.data; // Returns updated batch
}

/**
 * PATCH /batches/:id/passout
 * Marks a batch as passed out (irreversible).
 *
 * @param {string} id
 */
export async function passoutBatch(id) {
  const response = await api.patch(`/batches/${id}/passout`);
  return response.data; // { message: "Batch marked as passed out successfully" }
}
