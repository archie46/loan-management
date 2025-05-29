// src/api/auth.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to get auth headers
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

// Auth
export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error('Login failed');

  return response.json(); // returns token and role
}

// Users
export const getUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/users`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Add User
export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users`, userData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add user:", error);
    throw error;
  }
};

// Update User
export const updateUser = async (userId,userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/users/${userId}`, userData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};

// Loans
export const getLoans = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/loans`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Add Loan
export const addLoan = async (loanData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/loans`, loanData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add loan:", error);
    throw error;
  }
};


// Update Loan
export const updateLoan = async (loanId,loanData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/loans/${loanId}`, loanData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update loan:", error);
    throw error;
  }
};


// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user with ID ${id}:`, error);
    throw error;
  }
};

// Delete user by ID
export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error);
    throw error;
  }
};

// Get users by role
export const getUsersByRole = async (role) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/role/${role}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch users by role ${role}:`, error);
    throw error;
  }
};

// Get current logged-in user's profile
export const getMyProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch current user profile:", error);
    throw error;
  }
};

// Get loan by ID
export const getLoanById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/loans/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch loan with ID ${id}:`, error);
    throw error;
  }
};


// Delete loan by ID
export const deleteLoan = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/loans/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error(`Failed to delete loan with ID ${id}:`, error);
    throw error;
  }
};


// --- USER FUNCTIONS ---

// Apply for a loan
export const applyForLoan = async (loanData) => {
  const response = await axios.post(`${API_BASE_URL}/api/loan-requests/apply`, loanData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Cancel a loan request
export const cancelLoanRequest = async (requestId, username) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/loan-requests/cancel`,
    null,
    {
      params: { requestId, username },
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

// Get user's loan requests (with optional status)
export const getUserLoanRequests = async (userId, status = '') => {
  const response = await axios.get(`${API_BASE_URL}/api/loan-requests/user/${userId}`, {
    params: status ? { status } : {},
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Get user's loan requests (with optional status)
export const getUserLoanRepayments = async (userId, status = '') => {
  const params = { userId };
  if (status) params.status = status;

  const response = await axios.get(`${API_BASE_URL}/api/finance/loanRepayments`, {
    params,
    headers: getAuthHeaders(),
  });

  return response.data;
};


// --- MANAGER FUNCTIONS ---

// Get manager's assigned loan requests
export const getManagerLoanRequests = async (managerId, status = '') => {
  const response = await axios.get(`${API_BASE_URL}/api/loan-requests/manager/${managerId}`, {
    params: status ? { status } : {},
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Approve a loan request
export const approveLoanRequest = async (approvalData) => {
  const response = await axios.post(`${API_BASE_URL}/api/loan-requests/manager/approve`, approvalData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Reject a loan request
export const rejectLoanRequest = async (rejectionData) => {
  const response = await axios.post(`${API_BASE_URL}/api/loan-requests/manager/reject`, rejectionData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};


// Disburse a loan (generate repayment schedule)
export const disburseLoan = async (loanRequestId) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/finance/disburse/${loanRequestId}`,
    null,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get repayment schedule for a loan request
export const getRepaymentSchedule = async (loanRequestId) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/finance/repayments/${loanRequestId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Mark a repayment as paid
export const markRepaymentAsPaid = async (repaymentId) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/finance/repayments/${repaymentId}/mark-paid`,
    null,
    { headers: getAuthHeaders() }
  );
  return response.data;
};


// Mark a repayment as paid
export const getAllLoanRequests = async (status) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/finance/loanRequests`,
    
    {  params: status ? { status } : {},
      headers: getAuthHeaders() }
  );
  return response.data;
};
