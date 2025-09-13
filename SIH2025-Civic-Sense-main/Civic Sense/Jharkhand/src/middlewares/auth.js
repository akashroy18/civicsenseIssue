import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

// 🔥 Helper: sign token includes id & role (so frontend can route)
function signToken(id, role) {
  return jwt.sign({ id, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

// 🔥 EXPORT: helper to send token & user safely
export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role);
  const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role, photoUrl: user.photoUrl };
  res.status(statusCode).json({ status: 'success', token, user: safeUser });
};

// Protect middleware
export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new AppError('You are not logged in.', 401));
  const decoded = jwt.verify(token, env.jwtSecret);
  const currentUser = await User.findById(decoded.id).select('+password');
  if (!currentUser) return next(new AppError('The user no longer exists.', 401));
  req.user = currentUser;
  next();
});

// 🔥 UPDATE: role-based restriction middleware
export const restrictTo = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) return next(new AppError('You do not have permission.', 403));
  next();
};
