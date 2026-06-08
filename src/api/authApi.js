import API from './axios';

// ─── Register ──────────────────────────────────────────────────────────────
export const registerUser = async (userData) => {
  const { data } = await API.post('/register', {
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: userData.password,
  });
  return data;
};

// ─── Login ─────────────────────────────────────────────────────────────────
export const loginUser = async (credentials) => {
  const { data } = await API.post('/login', {
    email: credentials.email,
    password: credentials.password,
  });
  return data;
};

// ─── Auth Data Helpers ─────────────────────────────────────────────────────
export const saveAuthData = (authData) => {
  localStorage.setItem('groceriaToken', authData.token);
  localStorage.setItem('groceriaUser', JSON.stringify({
    _id: authData._id,
    name: authData.name,
    email: authData.email,
    phone: authData.phone,
    role: authData.role,
    address: authData.address || '',
  }));
};

export const clearAuthData = () => {
  localStorage.removeItem('groceriaToken');
  localStorage.removeItem('groceriaUser');
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('groceriaUser');
    return user ? JSON.parse(user) : null;
  } catch { return null; }
};

export const isAuthenticated = () => {
  return !!(getStoredUser() && localStorage.getItem('groceriaToken'));
};

// ─── Profile ───────────────────────────────────────────────────────────────
export const updateUserProfile = async (userData) => {
  const { data } = await API.put('/profile', userData);
  return data;
};

// ─── Forgot Password — sends email with reset link ─────────────────────────
export const forgotPasswordApi = async (email) => {
  const { data } = await API.post('/forgot-password', { email });
  return data;
};

// ─── OTP Flow ─────────────────────────────────────────────────────────────
export const sendOtpApi = async (email) => {
  const { data } = await API.post('/send-otp', { email });
  return data;
};

export const verifyOtpApi = async (email, otp) => {
  const { data } = await API.post('/verify-otp', { email, otp });
  return data;
};

export const resetPasswordWithOtpApi = async (email, otp, newPassword) => {
  const { data } = await API.post('/reset-password-otp', { email, otp, newPassword });
  return data;
};

// ─── Reset Password via body token (step-based flow) ──────────────────────
export const resetPasswordApi = async (token, password) => {
  const { data } = await API.post('/reset-password', { token, password });
  return data;
};

// ─── Reset Password via URL token (email link flow) ───────────────────────
export const resetPasswordByTokenApi = async (token, password) => {
  const { data } = await API.post(`/reset-password/${token}`, { password });
  return data;
};

// ─── Admin ─────────────────────────────────────────────────────────────────
export const adminGetUsers = async () => {
  const { data } = await API.get('/admin/users');
  return data;
};

export const adminUpdateUserRole = async (id, role) => {
  const { data } = await API.put(`/admin/user/${id}/role`, { role });
  return data;
};

export const adminDeleteUser = async (id) => {
  const { data } = await API.delete(`/admin/user/${id}`);
  return data;
};
