const User = require('../models/user.model');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// server/controllers/analyze.controller.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const Analysis = require('../models/analysis.model');
const fileUploadService = require('../services/fileUpload.service');

// @desc    Analyze image
// @route   POST /api/analyze/image
// @access  Private
exports.analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const startTime = Date.now();
    
    // Upload to S3 or other storage
    const fileUrl = await fileUploadService.uploadFile(req.file);
    
    // Create analysis record
    const analysis = await Analysis.create({
      user: req.user._id,
      fileType: 'image',
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      fileSize: req.file.size,
      status: 'processing'
    });
    
    // Send to AI service for processing (async)
    axios.post(`${config.aiServiceUrl}/predict/image`, {
      imageUrl: fileUrl,
      analysisId: analysis._id
    })
    .then(async (aiResponse) => {
      // Update analysis with results
      const processingTime = Date.now() - startTime;
      
      await Analysis.findByIdAndUpdate(analysis._id, {
        status: 'completed',
        processingTime,
        results: aiResponse.data.results,
        metadata: aiResponse.data.metadata
      });
    })
    .catch(async (error) => {
      console.error('AI Service error:', error);
      await Analysis.findByIdAndUpdate(analysis._id, {
        status: 'failed',
        errorMessage: 'Failed to process image'
      });
    });
    
    // Delete local file
    fs.unlinkSync(req.file.path);
    
    res.status(202).json({
      success: true,
      message: 'Image uploaded and processing started',
      analysisId: analysis._id
    });
    
  } catch (error) {
    console.error('Analyze image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Analyze video
// @route   POST /api/analyze/video
// @access  Private
exports.analyzeVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a video'
      });
    }

    const startTime = Date.now();
    
    // Upload to S3 or other storage
    const fileUrl = await fileUploadService.uploadFile(req.file);
    
    // Create analysis record
    const analysis = await Analysis.create({
      user: req.user._id,
      fileType: 'video',
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      fileSize: req.file.size,
      status: 'processing'
    });
    
    // Send to AI service for processing (async)
    axios.post(`${config.aiServiceUrl}/predict/video`, {
      videoUrl: fileUrl,
      analysisId: analysis._id
    })
    .then(async (aiResponse) => {
      // Update analysis with results
      const processingTime = Date.now() - startTime;
      
      await Analysis.findByIdAndUpdate(analysis._id, {
        status: 'completed',
        processingTime,
        results: aiResponse.data.results,
        metadata: aiResponse.data.metadata
      });
    })
    .catch(async (error) => {
      console.error('AI Service error:', error);
      await Analysis.findByIdAndUpdate(analysis._id, {
        status: 'failed',
        errorMessage: 'Failed to process video'
      });
    });
    
    // Delete local file
    fs.unlinkSync(req.file.path);
    
    res.status(202).json({
      success: true,
      message: 'Video uploaded and processing started',
      analysisId: analysis._id
    });
    
  } catch (error) {
    console.error('Analyze video error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get analysis history
// @route   GET /api/analyze/history
// @access  Private
exports.getAnalysisHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const query = { user: req.user._id };
    
    // Filter by file type if specified
    if (req.query.fileType) {
      query.fileType = req.query.fileType;
    }
    
    // Filter by status if specified
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Count total documents
    const total = await Analysis.countDocuments(query);
    
    // Get paginated results
    const analyses = await Analysis.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .select('fileType fileName fileUrl status results.isHarmful results.confidenceScore processingTime createdAt');
    
    res.status(200).json({
      success: true,
      count: analyses.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total
      },
      data: analyses
    });
    
  } catch (error) {
    console.error('Get analysis history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get specific analysis report
// @route   GET /api/analyze/report/:id
// @access  Private
exports.getAnalysisReport = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }
    
    // Check if user owns the analysis or is admin
    if (analysis.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this analysis'
      });
    }
    
    res.status(200).json({
      success: true,
      data: analysis
    });
    
  } catch (error) {
    console.error('Get analysis report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// server/controllers/stats.controller.js
const Analysis = require('../models/analysis.model');

// @desc    Get overview statistics
// @route   GET /api/stats/overview
// @access  Private
exports.getOverview = async (req, res) => {
  try {
    // Get total number of analyses for the user
    const totalAnalyses = await Analysis.countDocuments({ user: req.user._id });
    
    // Get harmful content analyses
    const harmfulAnalyses = await Analysis.countDocuments({ 
      user: req.user._id,
      'results.isHarmful': true
    });
    
    // Get analysis by type
    const imageAnalyses = await Analysis.countDocuments({ 
      user: req.user._id,
      fileType: 'image'
    });
    
    const videoAnalyses = await Analysis.countDocuments({ 
      user: req.user._id,
      fileType: 'video'
    });
    
    // Get analysis by status
    const completedAnalyses = await Analysis.countDocuments({ 
      user: req.user._id,
      status: 'completed'
    });
    
    const failedAnalyses = await Analysis.countDocuments({ 
      user: req.user._id,
      status: 'failed'
    });
    
    // Get average processing time
    const averageProcessingTime = await Analysis.aggregate([
      { $match: { user: req.user._id, status: 'completed' } },
      { $group: { _id: null, average: { $avg: '$processingTime' } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalAnalyses,
        harmfulAnalyses,
        harmfulPercentage: totalAnalyses > 0 ? (harmfulAnalyses / totalAnalyses * 100).toFixed(2) : 0,
        imageAnalyses,
        videoAnalyses,
        completedAnalyses,
        failedAnalyses,
        averageProcessingTime: averageProcessingTime.length > 0 ? 
          Math.round(averageProcessingTime[0].average) : 0
      }
    });
    
  } catch (error) {
    console.error('Get overview stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get trend statistics over time
// @route   GET /api/stats/trends
// @access  Private
exports.getTrends = async (req, res) => {
  try {
    // Default timeframe: last 30 days
    const days = parseInt(req.query.days, 10) || 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get analyses grouped by day
    const dailyAnalyses = await Analysis.aggregate([
      { 