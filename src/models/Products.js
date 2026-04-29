import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  // Image details sabse upar kyunki ye upload process ka main part hai
  imageUrl: { 
    type: String, 
    required: [true, "Product image is mandatory"] 
  },
  imageFileId: { 
    type: String, 
    required: [true, "ImageKit File ID is required for management"] 
  },
  
  // Product details
  title: { 
    type: String, 
    required: [true, "Please provide a product title"],
    trim: true 
  },
  price: { 
    type: Number, 
    required: [true, "Original price is required"] 
  },
  discountPrice: { 
    type: Number,
    default: 0
  },
  
  // Status management
  isSoldOut: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true // Isse 'createdAt' aur 'updatedAt' apne aap mil jayenge
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);