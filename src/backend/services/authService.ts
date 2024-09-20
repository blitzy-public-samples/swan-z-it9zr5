import { sign, verify } from 'jwt';
import { hash, compare } from 'bcrypt';
import { User } from '../models/User';
import { AuthError } from '../utils/errors';
import { JwtPayload } from 'jwt';
import { UserService } from './userService';
import { config } from '../config';

const JWT_SECRET = config.JWT_SECRET;
const JWT_EXPIRATION = config.JWT_EXPIRATION;
const REFRESH_TOKEN_EXPIRATION = config.REFRESH_TOKEN_EXPIRATION;

class AuthService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(email: string, password: string, name: string): Promise<User> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new AuthError('User with this email already exists');
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await this.userService.create({ email, password: hashedPassword, name });

    return newUser;
  }

  async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new AuthError('Invalid email or password');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthError('Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async logout(userId: string): Promise<void> {
    // TODO: Implement token blacklisting or user's token version update
    // This is a placeholder implementation
    console.log(`Logging out user: ${userId}`);
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const payload = verify(refreshToken, JWT_SECRET) as JwtPayload;
      
      // TODO: Check if token is blacklisted or user's token version is valid
      
      const newAccessToken = this.generateAccessToken(payload.userId);
      return newAccessToken;
    } catch (error) {
      throw new AuthError('Invalid refresh token');
    }
  }

  verifyToken(token: string): JwtPayload {
    try {
      const payload = verify(token, JWT_SECRET) as JwtPayload;
      return payload;
    } catch (error) {
      throw new AuthError('Invalid token');
    }
  }

  private generateAccessToken(userId: string): string {
    return sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  private generateRefreshToken(userId: string): string {
    return sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
  }
}

export default AuthService;