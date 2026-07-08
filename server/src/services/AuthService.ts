import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';

export class AuthService {
  /**
   * Register a new user
   */
  public static async register(data: any) {
    const { firstName, lastName, email, password } = data;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // 2. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    // 4. Generate token
    const token = generateToken(newUser._id, newUser.role);

    // 5. Format return object to exclude password hash
    const userToReturn = {
      _id: newUser._id,
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    };

    return { user: userToReturn, token };
  }

  /**
   * Login an existing user
   */
  public static async login(data: any) {
    const { email, password } = data;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // 3. Generate token
    const token = generateToken(user._id, user.role);

    // 4. Format return object
    const userToReturn = {
      _id: user._id,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    return { user: userToReturn, token };
  }

  /**
   * Get a user by their ID (for the /me endpoint)
   */
  public static async getUserById(id: string) {
    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
