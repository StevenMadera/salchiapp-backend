import { Router } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import User from '../models/User';

const router = Router();

// Coordenadas fijas de la fábrica
const FACTORY_COORDS = { lat: 19.4326, lng: -99.1332 };
const DELIVERY_FEE = 50;
const TAX_RATE = 0.16;

// Crear orden pendiente de pago
router.post('/', async (req, res) => {
  try {
    const { cartId, userId, addressCoords } = req.body;
    const cart = await Cart.findById(cartId);
    if (!cart || !cart.items.length) return res.status(400).json({ error: 'Cart is empty or not found' });

    // Calcular subtotal
    const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + DELIVERY_FEE + tax;

    // Crear orden
    const order = new Order({
      user: userId,
      items: cart.items.map(i => ({ menuItem: i.item, quantity: i.qty })),
      total,
      status: 'pending_payment',
      origin: FACTORY_COORDS,
      destination: addressCoords
    });
    await order.save();
    res.json({ orderId: order._id, amount: total });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});


// Consultar orden por ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
