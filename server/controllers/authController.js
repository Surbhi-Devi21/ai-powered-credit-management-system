import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

/**
 * @desc    Register a new shop owner account
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerOwner = async (req, res, next) => {
  try {
    const { name, email, phone, password, businessName, businessCategory, currency } = req.body;

    // Check if email is already registered
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      res.status(400);
      throw new Error('An account with this email address already exists.');
    }

    // Check if phone number is already registered
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      res.status(400);
      throw new Error('An account with this phone number already exists.');
    }

    // Create user in database (pre-save hook will automatically hash the password)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      businessName,
      businessCategory: businessCategory || 'kirana',
      currency: currency || 'INR',
    });

    if (user) {
      // Generate JWT token
      const token = generateToken(user._id, user.role);

      res.status(201).json({
        success: true,
        message: 'Shop Owner account created successfully.',
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            businessName: user.businessName,
            businessCategory: user.businessCategory,
            currency: user.currency,
            role: user.role,
            createdAt: user.createdAt,
          },
          token,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user registration data.');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate shop owner and retrieve JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginOwner = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly query for the user including the hidden password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password credentials.');
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error('Your account has been deactivated. Please contact support.');
    }

    // Compare password with hashed bcrypt string
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password credentials.');
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          businessName: user.businessName,
          businessCategory: user.businessCategory,
          currency: user.currency,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged-in shop owner profile
 * @route   GET /api/v1/auth/me
 * @access  Private (Protected by JWT)
 */
export const getOwnerProfile = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update shop owner profile details
 * @route   PUT /api/v1/auth/profile
 * @access  Private (Protected by JWT)
 */
export const updateOwnerProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User profile not found.');
    }

    const { name, phone, businessName, businessCategory, currency } = req.body;

    // Check phone uniqueness if phone is changing
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        res.status(400);
        throw new Error('Phone number is already associated with another account.');
      }
      user.phone = phone;
    }

    if (name) user.name = name;
    if (businessName) user.businessName = businessName;
    if (businessCategory) user.businessCategory = businessCategory;
    if (currency) user.currency = currency;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Shop profile updated successfully.',
      data: {
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          businessName: updatedUser.businessName,
          businessCategory: updatedUser.businessCategory,
          currency: updatedUser.currency,
          role: updatedUser.role,
          updatedAt: updatedUser.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change shop owner password
 * @route   PUT /api/v1/auth/change-password
 * @access  Private (Protected by JWT)
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Retrieve user including current password hash
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      res.status(404);
      throw new Error('User profile not found.');
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(400);
      throw new Error('Current password does not match our records.');
    }

    // Set new password (pre-save hook will hash it automatically)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please use your new password next time.',
    });
  } catch (error) {
    next(error);
  }
};
