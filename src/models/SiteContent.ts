import mongoose from 'mongoose';

const SiteContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);
