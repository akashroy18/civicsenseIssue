import AppError from '../utils/AppError.js';


// 404 handler
export function notFound(_req, _res, next) {
next(new AppError('Route not found', 404));
}


// Global error handler
export function globalError(err, _req, res, _next) {
console.error('[error]', err);
const statusCode = err.statusCode || 500;
res.status(statusCode).json({
status: err.status || 'error',
message: err.message || 'Something went wrong',
});
}