import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeTakenSeconds: { type: Number, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: { type: Number },
    isCorrect: { type: Boolean },
    timeSpentSeconds: { type: Number }
  }],
  weakTopics: [{ type: String }],
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Result || mongoose.model('Result', ResultSchema);
