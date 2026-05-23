import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }, // Optional now
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // For Question Bank
  subCategory: { type: String },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // Index of the correct option
  explanation: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  topic: { type: String },
  imageUrl: { type: String },
  randomize: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);

