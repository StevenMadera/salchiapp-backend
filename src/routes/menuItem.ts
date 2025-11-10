import { Router } from 'express';
import MenuItem from '../models/MenuItem';
import path from 'path';
import { exec } from 'child_process';

const router = Router();

// Endpoint para ejecutar el seed
router.post('/seed', async (req, res) => {
  try {
    // Ejecuta el script seed.ts usando ts-node
    exec(`npx ts-node ${path.resolve(__dirname, '../seed.ts')}`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: stderr || error.message });
      }
      res.json({ success: true, output: stdout });
    });
  } catch (err) {
  res.status(500).json({ error: (err as Error).message });
  }
});

// Crear MenuItem
router.post('/', async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(400).json({ error: 'Error creating MenuItem', details: err });
  }
});

// Leer todos los MenuItems

// Endpoint GET /api/menu
router.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching MenuItems', details: err });
  }
});



// Actualizar MenuItem por id
router.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'MenuItem not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating MenuItem', details: err });
  }
});

// Eliminar MenuItem por id
router.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MenuItem.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'MenuItem not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting MenuItem', details: err });
  }
});

export default router;
