import { User, IUser } from '../models/User';
import { StyleProfile, IStyleProfile } from '../models/StyleProfile';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { JWT_SECRET } from '../config/env';

export const createUser = async (userData: { email: string; password: string; name: string }): Promise<{ user: IUser; token: string }> => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new User({
    ...userData,
    password: hashedPassword,
  });

  await newUser.save();

  const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1d' });

  return { user: newUser, token };
};

export const authenticateUser = async (email: string, password: string): Promise<{ user: IUser; token: string }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

  return { user, token };
};

export const getUserById = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export const updateUserProfile = async (userId: string, updateData: Partial<IUser>): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export const updateUserStyleProfile = async (userId: string, styleProfileData: Partial<IStyleProfile>): Promise<IStyleProfile> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  let styleProfile = await StyleProfile.findOne({ user: userId });
  if (!styleProfile) {
    styleProfile = new StyleProfile({ user: userId, ...styleProfileData });
  } else {
    Object.assign(styleProfile, styleProfileData);
  }

  await styleProfile.save();
  user.styleProfile = styleProfile._id;
  await user.save();

  return styleProfile;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await StyleProfile.findOneAndDelete({ user: userId });
  await User.findByIdAndDelete(userId);

  // TODO: Implement cleanup of related data (orders, custom designs, etc.)
};