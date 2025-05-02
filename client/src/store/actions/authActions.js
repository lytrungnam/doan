// src/store/actions/authActions.js
import axios from 'axios';
import { setAlert } from './uiActions';

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    if (localStorage.token) {
      // Set Auth Token in Headers
      axios.defaults.headers.common['x-auth-token'] = localStorage.token;
    }

    const res = await axios.get('/api/auth/user');

    dispatch({
      type: 'USER_LOADED',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'AUTH_ERROR'
    });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/auth/register', formData, config);

    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: res.data
    });

    dispatch(loadUser());
    dispatch(setAlert('Đăng ký thành công!', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: 'REGISTER_FAIL',
      payload: errors
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth/login', body, config);

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: 'LOGIN_FAIL',
      payload: errors
    });
  }
};

// Logout
export const logout = () => (dispatch) => {
  dispatch({ type: 'LOGOUT' });
  dispatch(setAlert('Đã đăng xuất', 'success'));
};

// src/store/actions/contentActions.js
import axios from 'axios';
import { setAlert, setLoading } from './uiActions';

// Get All Analyses
export const getAnalyses = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const res = await axios.get('/api/analyze/history');

    dispatch({
      type: 'GET_ANALYSES',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'ANALYSIS_ERROR',
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Không thể tải lịch sử phân tích', 'error'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Get Analysis by ID
export const getAnalysisById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const res = await axios.get(`/api/analyze/report/${id}`);

    dispatch({
      type: 'GET_ANALYSIS',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'ANALYSIS_ERROR',
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Không thể tải báo cáo phân tích', 'error'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Analyze Image
export const analyzeImage = (formData) => async (dispatch) => {
  try {
    dispatch({ type: 'START_ANALYSIS' });
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const res = await axios.post('/api/analyze/image', formData, config);

    dispatch({
      type: 'ANALYSIS_COMPLETE',
      payload: res.data
    });

    dispatch(setAlert('Phân tích hình ảnh hoàn tất', 'success'));
  } catch (err) {
    dispatch({
      type: 'ANALYSIS_ERROR',
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Lỗi khi phân tích hình ảnh', 'error'));
  }
};

// Analyze Video
export const analyzeVideo = (formData) => async (dispatch) => {
  try {
    dispatch({ type: 'START_ANALYSIS' });
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const res = await axios.post('/api/analyze/video', formData, config);

    dispatch({
      type: 'ANALYSIS_COMPLETE',
      payload: res.data
    });

    dispatch(setAlert('Phân tích video hoàn tất', 'success'));
  } catch (err) {
    dispatch({
      type: 'ANALYSIS_ERROR',
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Lỗi khi phân tích video', 'error'));
  }
};

// Get Dashboard Stats
export const getStats = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const res = await axios.get('/api/stats/overview');

    dispatch({
      type: 'GET_STATS',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'ANALYSIS_ERROR',
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(setAlert('Không thể tải thống kê', 'error'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Clear Current Analysis
export const clearCurrent = () => {
  return { type: 'CLEAR_CURRENT' };
};

// src/store/actions/uiActions.js

// Set Alert
export const setAlert = (msg, severity, timeout = 5000) => (dispatch) => {
  const id = Math.random().toString(36).substr(2, 9);
  
  dispatch({
    type: 'SET_ALERT',
    payload: { msg, severity, id }
  });

  setTimeout(() => 
    dispatch({ 
      type: 'REMOVE_ALERT' 
    }), 
    timeout
  );
};

// Toggle Sidebar
export const toggleSidebar = () => ({
  type: 'TOGGLE_SIDEBAR'
});

// Set Loading State
export const setLoading = (isLoading) => ({
  type: 'SET_LOADING',
  payload: isLoading
});