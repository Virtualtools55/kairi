import mongoose from 'mongoose';

const SliderSchema = new mongoose.Schema({
  imageUrl: { 
    type: String, 
    required: true 
  },
  imageFileId: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    trim: true 
  },
  subtitle: { 
    type: String, 
    trim: true 
  },
  priority: { 
    type: Number, 
    default: 0 // स्लाइडर का क्रम सेट करने के लिए
  }
}, { timestamps: true });

export default mongoose.models.Slider || mongoose.model('Slider', SliderSchema);