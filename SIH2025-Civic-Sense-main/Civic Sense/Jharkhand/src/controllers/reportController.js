import Report from '../models/Report.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

// Create report (protected)
export const createReport = catchAsync(async (req, res, next) => {
  const { title, description, category, priority, address, lat, lng, assignedDepartment } = req.body;
  if (!title || !lat || !lng) return next(new AppError('title, lat, lng are required.', 400));

  let imageUrl = '';
  if (req.file) {
    const uploadRes = await uploadBufferToCloudinary(req.file.buffer, 'reports');
    imageUrl = uploadRes.secure_url;
  }

  const report = await Report.create({
    title,
    description,
    category,
    priority,
    imageUrl,
    reporter: req.user._id,
    assignedDepartment,
    location: { type: 'Point', coordinates: [Number(lng), Number(lat)], address }
  });

  res.status(201).json({ status: 'success', data: { report } });
});

// Get reports (role-based)
export const getReports = catchAsync(async (req, res) => {
  const { status, category, priority, department, nearLng, nearLat, maxDistance = 2000 } = req.query;

  const filter = {};

  // Citizens only see their own reports
  if (req.user.role !== 'admin') {
    filter.reporter = req.user._id;
  } else {
    // Admins can filter by status, category, priority, department
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (department) filter.assignedDepartment = department;
  }

  let query = Report.find(filter).populate('reporter', 'name email');

  if (nearLng && nearLat) {
    query = query.where('location').near({
      center: { type: 'Point', coordinates: [Number(nearLng), Number(nearLat)] },
      maxDistance: Number(maxDistance),
      spherical: true
    });
  }

  const reports = await query.sort('-createdAt');
  res.json({ status: 'success', results: reports.length, data: { reports } });
});

// Get report by ID
export const getReportById = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id).populate('reporter', 'name email');
  if (!report) return next(new AppError('Report not found', 404));

  // Citizens can only access their own report
  if (req.user.role !== 'admin' && report.reporter._id.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to view this report', 403));
  }

  res.json({ status: 'success', data: { report } });
});

// Update status / assigned department (role-based)
export const updateReportStatus = catchAsync(async (req, res, next) => {
  const { status, assignedDepartment } = req.body;
  const allowed = ['pending', 'in review', 'in-progress', 'resolved'];
  if (status && !allowed.includes(status)) return next(new AppError('Invalid status', 400));

  const report = await Report.findById(req.params.id);
  if (!report) return next(new AppError('Report not found', 404));

  // Citizens cannot update reports they don't own
  if (req.user.role !== 'admin' && report.reporter.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to update this report', 403));
  }

  if (status) report.status = status;
  if (assignedDepartment && req.user.role === 'admin') {
    // Only admin can assign department
    report.assignedDepartment = assignedDepartment;
  }

  await report.save();
  res.json({ status: 'success', data: { report } });
});

// Delete report (admin only)
export const deleteReport = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete reports', 403));
  }

  const report = await Report.findByIdAndDelete(req.params.id);
  if (!report) return next(new AppError('Report not found', 404));

  res.json({ status: 'success', data: null });
});
