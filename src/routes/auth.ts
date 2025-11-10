import { Router } from 'express';
import { verifyJwt } from '../services/supabaseAuth';
import mongoose from 'mongoose';
import User from '../models/User';
const router = Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const user = new User({ email, password });
    await user.save();
    res.json({ _id: user._id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working!' });
});
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1] || '';
  const user = verifyJwt(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });
  res.json({ user });
});



export default router;