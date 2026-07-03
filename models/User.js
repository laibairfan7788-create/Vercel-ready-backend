// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
//   createdAt: { type: Date, default: Date.now }
// });

// UserSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// UserSchema.methods.comparePassword = async function(password) {
//   return await bcrypt.compare(password, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'editor', 'manager'],
    default: 'user'
  },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Correct pre-save hook (async/await, no `next`)
UserSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (err) {
    throw new Error('Password hashing failed');
  }
});

// ✅ Compare password method
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);