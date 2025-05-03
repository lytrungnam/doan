const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

module.exports = router;

// server/routes/analyze.routes.js
const express = require('express');
const router = express.Router();
const { 
  analyzeImage, 
  analyzeVideo, 
  getAnalysisHistory, 
  getAnalysisReport 
} = require('../controllers/analyze.controller');
const upload = require('../middlewares/upload.middleware');

router.post('/image', upload.single('image'), analyzeImage);
router.post('/video', upload.single('video'), analyzeVideo);
router.get('/history', getAnalysisHistory);
router.get('/report/:id', getAnalysisReport);

module.exports = router;

// server/routes/stats.routes.js
const express = require('express');
const router = express.Router();
const { 
  getOverview, 
  getTrends, 
  getCategories 
} = require('../controllers/stats.controller');
const { adminMiddleware } = require('../middlewares/auth.middleware');

router.get('/overview', getOverview);
router.get('/trends', getTrends);
router.get('/categories', getCategories);

module.exports = router;

// server/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const { 
  getSettings, 
  updateSettings, 
  getUsers, 
  updateUser, 
  deleteUser 
} = require('../controllers/admin.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

// All admin routes require admin privileges
router.use(adminMiddleware);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;