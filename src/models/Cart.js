import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  // Kis user ka cart hai?
  userId: { 
    type: String, // Agar Clerk/Auth use kar rahe ho toh String, varna ObjectId
    required: true,
    unique: true 
  },
  // Cart ke andar kaunse products hain?
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', // 'Product' model se connect karega
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        default: 1 
      }
    }
  ]
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);