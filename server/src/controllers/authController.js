const AuthService = require('../services/authService');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await AuthService.register({ name, email, password, role });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user & return JWT
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
