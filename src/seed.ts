import mongoose from 'mongoose';
import Ingredient from './models/Ingredient';
import MenuItem from './models/MenuItem';

const ingredientsData = [
  { name: 'Salchicha', price: 10, type: 'protein', stock: 100 },
  { name: 'Queso', price: 5, type: 'cheese', stock: 100 },
  { name: 'Salsa Rosada', price: 2, type: 'sauce', stock: 100 },
  { name: 'Salsa BBQ', price: 2, type: 'sauce', stock: 100 },
  { name: 'Pollo', price: 12, type: 'protein', stock: 100 },
  { name: 'Carne', price: 15, type: 'protein', stock: 100 },
  { name: 'Salsa de Queso', price: 3, type: 'sauce', stock: 100 },
  { name: 'Tocineta', price: 8, type: 'protein', stock: 100 }
];

import { Types } from 'mongoose';

const menuItemsData: Array<{
  name: string;
  description: string;
  basePrice: number;
  ingredients: Types.ObjectId[];
  imageUrl: string;
  isCustomizable: boolean;
}> = [
  {
    name: 'Salchipapa Clásica',
    description: 'Salchipapa tradicional con salchicha y papas.',
    basePrice: 20,
    ingredients: [],
    imageUrl: 'https://i.imgur.com/1.jpg',
    isCustomizable: true
  },
  {
    name: 'Salchipapa Queso',
    description: 'Salchipapa con extra queso.',
    basePrice: 22,
    ingredients: [],
    imageUrl: 'https://i.imgur.com/2.jpg',
    isCustomizable: true
  },
  {
    name: 'Salchipapa BBQ',
    description: 'Salchipapa con salsa BBQ.',
    basePrice: 21,
    ingredients: [],
    imageUrl: 'https://i.imgur.com/3.jpg',
    isCustomizable: true
  },
  {
    name: 'Salchipapa Pollo',
    description: 'Salchipapa con pollo.',
    basePrice: 23,
    ingredients: [],
    imageUrl: 'https://i.imgur.com/4.jpg',
    isCustomizable: true
  },
  {
    name: 'Salchipapa Carne',
    description: 'Salchipapa con carne.',
    basePrice: 24,
    ingredients: [],
    imageUrl: 'https://i.imgur.com/5.jpg',
    isCustomizable: true
  },
  {
    name: 'Salchipapa Tocineta',
    description: 'Salchipapa con tocineta.',
    basePrice: 25,
    ingredients: [],
    imageUrl: 'https://i.imgur.com/6.jpg',
    isCustomizable: true
  },
  {
    name: 'Salchipapa Mixta',
    description: 'Salchipapa con todo.',
    basePrice: 28,
    ingredients: [],
    imageUrl: 'https://i.imgur.com/7.jpg',
    isCustomizable: true
  },
  {
    name: 'Salchipapa Especial',
    description: 'Salchipapa especial de la casa.',
    basePrice: 30,
    ingredients: [],
    imageUrl: 'https://i.imgur.com/8.jpg',
    isCustomizable: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    await Ingredient.deleteMany({});
    await MenuItem.deleteMany({});

    const ingredients = await Ingredient.insertMany(ingredientsData);
    console.log('Ingredientes insertados:', ingredients.length);

    for (let item of menuItemsData) {
      item.ingredients = ingredients.map((i: any) => i._id);
    }
    const menuResult = await MenuItem.insertMany(menuItemsData);
    console.log('MenuItems insertados:', menuResult.length);
    console.log('Primer MenuItem:', menuResult[0]);

    // Mostrar nombres de colecciones
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log('Colecciones en la DB:', collections.map(c => c.name));
    } else {
      console.log('No se pudo acceder a mongoose.connection.db');
    }

    mongoose.disconnect();
    console.log('Seed completed');
  } catch (err) {
    console.error('Error en el seed:', err);
    mongoose.disconnect();
  }
}

if (require.main === module) {
  seed();
}
