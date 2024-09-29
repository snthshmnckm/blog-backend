const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({ username, password: hashedPassword });
    const savedUser = await newUser.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user' });
  }
};

// User login and JWT generation
exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.header('Authorization', token).json({ token });
};

