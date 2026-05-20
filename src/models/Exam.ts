import mongoose from 'mongoose';

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  active: { type: Boolean, default: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },

});

export default mongoose.models.Exam || mongoose.model('Exam', ExamSchema);
