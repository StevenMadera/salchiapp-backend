import { Router } from 'express';
import Cart from '../models/Cart';
import MenuItem from '../models/MenuItem';
import Ingredient from '../models/Ingredient';

const router = Router();

// Añadir item al carrito
router.post('/add', async (req, res) => {
  try {
    const { itemId, qty, customIngredients, cartId } = req.body;
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) return res.status(404).json({ error: 'MenuItem not found' });

    let customIngredientsData = [];
    let customIngredientsTotal = 0;
    if (customIngredients && customIngredients.length) {
      customIngredientsData = await Ingredient.find({ _id: { $in: customIngredients } });
      customIngredientsTotal = customIngredientsData.reduce((sum, ing) => sum + ing.price, 0);
    }

  const subtotal = ((menuItem as any).basePrice + customIngredientsTotal) * qty;

    let cart = await Cart.findById(cartId);
    if (!cart) {
      cart = new Cart({ items: [] });
    }
    cart.items.push({ item: itemId, qty, customIngredients, subtotal });
    await cart.save();
    res.json({ cart });
  } catch (err) {
  res.status(500).json({ error: (err as Error).message });
  }
});


// Obtener carrito actual
router.get('/', async (req, res) => {
  try {
    const { cartId } = req.query;
    if (!cartId) return res.status(400).json({ error: 'cartId required' });
    const cart = await Cart.findById(cartId).populate({
      path: 'items.item',
      model: 'MenuItem'
    }).populate({
      path: 'items.customIngredients',
      model: 'Ingredient'
    });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
