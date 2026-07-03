
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// // ============ REGISTER ============
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // ✅ Validate required fields
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide name, email and password'
//       });
//     }

//     // ✅ Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already registered'
//       });
//     }

//     // ✅ Create user (password will be hashed by pre-save hook)
//     const user = new User({
//       name,
//       email,
//       password,
//       role: role || 'user'
//     });

//     await user.save();

//     // ✅ Return user data (without password)
//     const userData = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       createdAt: user.createdAt
//     };

//     res.status(201).json({
//       success: true,
//       user: userData
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Registration failed'
//     });
//   }
// };

// // ============ LOGIN ============
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // ✅ Validate
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide email and password'
//       });
//     }

//     // ✅ Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // ✅ Compare password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // ✅ Generate token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // ✅ Return user + token
//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Login failed'
//     });
//   }
// };
// ============ GET CURRENT USER ============
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ============ REGISTER ============
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'user'
    });

    await user.save();

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// ============ LOGIN ============
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

// ============ GET CURRENT USER ============
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};