// src/store/reducers/authReducer.js
const initialAuthState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };
  
  const authReducer = (state = initialAuthState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case 'USER_LOADED':
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          user: payload
        };
      case 'REGISTER_SUCCESS':
      case 'LOGIN_SUCCESS':
        localStorage.setItem('token', payload.token);
        return {
          ...state,
          ...payload,
          isAuthenticated: true,
          loading: false
        };
      case 'AUTH_ERROR':
      case 'LOGIN_FAIL':
      case 'REGISTER_FAIL':
      case 'LOGOUT':
        localStorage.removeItem('token');
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
          error: payload
        };
      case 'CLEAR_ERROR':
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
  
  // src/store/reducers/contentReducer.js
  const initialContentState = {
    analyses: [],
    currentAnalysis: null,
    loading: false,
    error: null,
    stats: {
      totalAnalyses: 0,
      safeContent: 0,
      harmfulContent: 0,
      categoryBreakdown: []
    }
  };
  
  const contentReducer = (state = initialContentState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case 'GET_ANALYSES':
        return {
          ...state,
          analyses: payload,
          loading: false
        };
      case 'GET_ANALYSIS':
        return {
          ...state,
          currentAnalysis: payload,
          loading: false
        };
      case 'START_ANALYSIS':
        return {
          ...state,
          loading: true
        };
      case 'ANALYSIS_COMPLETE':
        return {
          ...state,
          analyses: [payload, ...state.analyses],
          currentAnalysis: payload,
          loading: false
        };
      case 'ANALYSIS_ERROR':
        return {
          ...state,
          error: payload,
          loading: false
        };
      case 'CLEAR_CURRENT':
        return {
          ...state,
          currentAnalysis: null
        };
      case 'GET_STATS':
        return {
          ...state,
          stats: payload
        };
      default:
        return state;
    }
  };
  
  export default contentReducer;
  
  // src/store/reducers/uiReducer.js
  const initialUiState = {
    sidebarOpen: true,
    alert: null,
    loading: false
  };
  
  const uiReducer = (state = initialUiState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case 'TOGGLE_SIDEBAR':
        return {
          ...state,
          sidebarOpen: !state.sidebarOpen
        };
      case 'SET_ALERT':
        return {
          ...state,
          alert: payload
        };
      case 'REMOVE_ALERT':
        return {
          ...state,
          alert: null
        };
      case 'SET_LOADING':
        return {
          ...state,
          loading: payload
        };
      default:
        return state;
    }
  };
  
  export default uiReducer;