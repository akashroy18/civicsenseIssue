import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ['pothole', 'streetlight', 'garbage', 'water', 'electricity', 'other'],
      default: 'other'
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    status: { 
      type: String, 
      enum: ['pending', 'in review', 'in progress', 'resolved'], 
      default: 'pending' 
    },
    imageUrl: { type: String, default: '' }, // Cloudinary URL string
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true, index: '2dsphere' }, // [lng, lat]
      address: { type: String, default: '' }
    },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedDepartment: { type: String, default: '' }
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
