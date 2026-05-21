import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }, // Optional, helpful for context
  notes: { type: String }, // Optional, for future use if users want to add notes to bookmarked questions
  createdAt: { type: Date, default: Date.now },
});

// Ensure a user can only bookmark a specific question once
BookmarkSchema.index({ userId: 1, questionId: 1 }, { unique: true });

export default mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);
