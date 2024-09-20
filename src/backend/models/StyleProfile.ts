import mongoose, { Document, Model } from 'mongoose';
import { User } from './User';
import { StyleLines } from '../../shared/constants/index';

export interface IStylePreference {
  styleLine: string;
  preferenceScore: number;
}

export interface IStyleProfile extends Document {
  user: mongoose.Types.ObjectId;
  quizResponses: object;
  preferences: IStylePreference[];
  createdAt: Date;
  updatedAt: Date;
  calculateStylePreferences(): IStylePreference[];
  getTopStyleLines(n: number): string[];
}

const stylePreferenceSchema = new mongoose.Schema({
  styleLine: {
    type: String,
    enum: Object.values(StyleLines),
    required: true,
  },
  preferenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

const styleProfileSchema = new mongoose.Schema<IStyleProfile>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    quizResponses: {
      type: Object,
      required: true,
    },
    preferences: [stylePreferenceSchema],
  },
  { timestamps: true }
);

styleProfileSchema.methods.calculateStylePreferences = function(): IStylePreference[] {
  // TODO: Implement the logic to calculate style preferences based on quiz responses
  // This is a placeholder implementation
  const preferences: IStylePreference[] = Object.values(StyleLines).map(styleLine => ({
    styleLine,
    preferenceScore: Math.random() * 100,
  }));
  
  return preferences.sort((a, b) => b.preferenceScore - a.preferenceScore);
};

styleProfileSchema.methods.getTopStyleLines = function(n: number): string[] {
  return this.preferences
    .sort((a, b) => b.preferenceScore - a.preferenceScore)
    .slice(0, n)
    .map(pref => pref.styleLine);
};

styleProfileSchema.pre('save', async function(next) {
  if (this.isModified('quizResponses')) {
    this.preferences = this.calculateStylePreferences();
  }
  next();
});

export const StyleProfile: Model<IStyleProfile> = mongoose.model<IStyleProfile>('StyleProfile', styleProfileSchema);