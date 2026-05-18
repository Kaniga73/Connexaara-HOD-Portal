import api from "./axiosInstance";

/**
 * POST /staff
 * Creates a new staff member (HOD scoped — college + department auto-applied by backend).
 *
 * @param {{ name: string, email: string, isTutor: boolean }} data
 */
export async function createStaff(data) {
  const response = await api.post("/staff", data);
  return response.data;
}

/**
 * GET /staff
 * Returns a paginated list of staff members.
 *
 * @param {{ page?: number, limit?: number, search?: string, isActive?: boolean }} params
 */
export async function getStaff(params = {}) {
  const response = await api.get("/staff", { params });
  return response.data; // { data: [...], meta: { total, page, limit } }
}

/**
 * GET /staff/:id
 * Returns full details of a single staff member.
 *
 * @param {string} id
 */
export async function getStaffById(id) {
  const response = await api.get(`/staff/${id}`);
  return response.data;
}

/**
 * PATCH /staff/:id
 * Updates editable fields (all optional).
 *
 * @param {string} id
 * @param {{ name?: string, email?: string, isTutor?: boolean }} data
 */
export async function updateStaff(id, data) {
  const response = await api.patch(`/staff/${id}`, data);
  return response.data;
}

/**
 * PATCH /staff/:id/deactivate
 * Soft-deletes (deactivates) a staff member. No body needed.
 *
 * @param {string} id
 */
export async function deactivateStaff(id) {
  const response = await api.patch(`/staff/${id}/deactivate`);
  return response.data; // { message: "Staff member deactivated" }
}

/**
 * PATCH /staff/:id/activate
 * Re-activates a previously deactivated staff member. No body needed.
 *
 * @param {string} id
 */
export async function activateStaff(id) {
  const response = await api.patch(`/staff/${id}/activate`);
  return response.data; // { message: "Staff member activated" }
}
