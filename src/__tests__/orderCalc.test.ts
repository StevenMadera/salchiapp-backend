import { describe, it, expect } from '@jest/globals';

function calculateSubtotal(basePrice: number, customIngredients: { price: number }[], qty: number) {
  const customTotal = customIngredients.reduce((sum, ing) => sum + ing.price, 0);
  return (basePrice + customTotal) * qty;
}

function calculateTotal(subtotal: number, deliveryFee: number, taxRate: number) {
  const tax = subtotal * taxRate;
  return subtotal + deliveryFee + tax;
}

describe('Order calculation', () => {
  it('sin ingredientes', () => {
    const subtotal = calculateSubtotal(100, [], 2);
    expect(subtotal).toBe(200);
    const total = calculateTotal(subtotal, 50, 0.16);
    expect(total).toBeCloseTo(282);
  });

  it('con ingredientes', () => {
    const subtotal = calculateSubtotal(100, [{ price: 10 }, { price: 5 }], 2);
    expect(subtotal).toBe(230);
    const total = calculateTotal(subtotal, 50, 0.16);
    expect(total).toBeCloseTo(316.8);
  });

  it('con descuento', () => {
    const subtotal = calculateSubtotal(100, [], 2) - 20;
    expect(subtotal).toBe(180);
    const total = calculateTotal(subtotal, 50, 0.16);
    expect(total).toBeCloseTo(258.8);
  });
});
