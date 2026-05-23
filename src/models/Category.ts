import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "Practice Questions" },
  icon: { type: String, default: "BookOpen" },
  color: { type: String, default: "bg-primary-50 border-primary-200" },
  active: { type: Boolean, default: true },
  subCategories: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
