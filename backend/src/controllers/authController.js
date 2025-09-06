import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";

// Validation rules
export const signupValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("firstName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters"),
  body("lastName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters")
];

export const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

// Signup controller
export const signup = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { email, password, username, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email 
          ? "Email already registered" 
          : "Username already taken"
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      username,
      firstName,
      lastName
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration"
    });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated"
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login"
    });
  }
};

// Logout controller
export const logout = async (req, res) => {
  try {
    // Since we're using JWT, logout is handled client-side by removing the token
    // This endpoint is mainly for logging purposes or future token blacklisting
    res.json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during logout"
    });
  }
};

// Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error retrieving user profile"
    });
  }
};
