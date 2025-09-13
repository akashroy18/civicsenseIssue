import Report from '../models/Report.js';
import catchAsync from '../utils/catchAsync.js';

// 📊 Get aggregated insights
export const getInsights = catchAsync(async (req, res) => {
  // Group by category
  const byCategory = await Report.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $project: { _id: 0, category: "$_id", count: 1 } },
    { $sort: { count: -1 } }
  ]);

  // Group by location.address (fallback if no address: "Unknown")
  const byLocation = await Report.aggregate([
    { $group: { _id: { $ifNull: ["$location.address", "Unknown"] }, count: { $sum: 1 } } },
    { $project: { _id: 0, location: "$_id", count: 1 } },
    { $sort: { count: -1 } }
  ]);

  res.json({
    status: "success",
    data: { byCategory, byLocation }
  });
});
