import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { StyleProfile } from './StyleProfile';

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  styleProfile: mongoose.Types.ObjectId;
  roles: string[];
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    styleProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StyleProfile',
    },
    roles: {
      type: [String],
      default: ['user'],
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Cascade delete for associated StyleProfile
userSchema.pre('remove', async function(next) {
  try {
    await StyleProfile.deleteOne({ _id: this.styleProfile });
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const User: UserModel = mongoose.model<IUser, UserModel>('User', userSchema);