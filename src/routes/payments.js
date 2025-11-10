const express = require('express');
const router = express.Router();
const { client } = require('../services/paypalClient');
const Order = require('../models/Order').default;

// Crear pago
router.post('/create', async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const request = new (require('@paypal/checkout-server-sdk').orders.OrdersCreateRequest)();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: order.total.toString()
      }
    }],
    application_context: {
      return_url: 'https://yourapp.com/paypal-success',
      cancel_url: 'https://yourapp.com/paypal-cancel'
    }
  });

  try {
    const response = await client().execute(request);
    const approvalUrl = response.result.links.find(l => l.rel === 'approve').href;
    await Order.findByIdAndUpdate(orderId, {
      'payment.paypalOrderId': response.result.id,
      'payment.status': 'pending',
      'payment.details': response.result
    });
    res.json({ orderID: response.result.id, approvalUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Capturar pago
router.post('/capture', async (req, res) => {
  const { orderId, paypalOrderId, test } = req.body;
  if (test) {
    // Modo test: simular pago exitoso
    await Order.findByIdAndUpdate(orderId, {
      'payment.status': 'paid',
      'payment.details': { test: true, paypalOrderId }
    });
    return res.json({ status: 'paid', capture: { test: true } });
  }
  const captureRequest = new (require('@paypal/checkout-server-sdk').orders.OrdersCaptureRequest)(paypalOrderId);
  captureRequest.requestBody({});

  try {
    const capture = await client().execute(captureRequest);
    await Order.findByIdAndUpdate(orderId, {
      'payment.status': 'paid',
      'payment.details': capture.result
    });
    res.json({ status: 'paid', capture });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
