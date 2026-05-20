import mongoose from 'mongoose';

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  active: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  tags: [{ type: String }],
  // New fields
  negativeMarking: { type: Number, default: 0 },       // marks deducted per wrong ans (e.g. 0.25)
  passingMarks: { type: Number, default: 0 },           // minimum marks to pass
  totalMarks: { type: Number, default: 0 },             // total marks for the exam
  randomQuestionOrder: { type: Boolean, default: false },
  scheduledAt: { type: Date },                          // for scheduled exams
  instructions: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Exam || mongoose.model('Exam', ExamSchema);
