import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { createSendToken } from '../middlewares/auth.js';


export const signup = catchAsync(async (req, res, next) => {
const { name, email, password, role } = req.body;
if (!name || !email || !password) return next(new AppError('Name, email, and password are required.', 400));


const exists = await User.findOne({ email });
if (exists) return next(new AppError('Email already in use.', 400));


const user = await User.create({ name, email, password, role });
createSendToken(user, 201, res);
});


export const login = catchAsync(async (req, res, next) => {
const { email, password } = req.body;
if (!email || !password) return next(new AppError('Please provide email and password.', 400));


const user = await User.findOne({ email }).select('+password');
if (!user) return next(new AppError('Invalid credentials.', 401));


const correct = await user.correctPassword(password);
if (!correct) return next(new AppError('Invalid credentials.', 401));


createSendToken(user, 200, res);
});