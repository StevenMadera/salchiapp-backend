import express, { Request, Response } from 'express';
const router = express.Router();
import { client } from '../services/paypalClient';
import Order from '../models/Order';

// Crear pago
router.post('/create', async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const OrdersCreateRequest = require('@paypal/checkout-server-sdk').orders.OrdersCreateRequest;
  const request = new OrdersCreateRequest();
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
    const approvalUrl = response.result.links.find((l: any) => l.rel === 'approve').href;
    await Order.findByIdAndUpdate(orderId, {
      'payment.paypalOrderId': response.result.id,
      'payment.status': 'pending',
      'payment.details': response.result
    });
    res.json({ orderID: response.result.id, approvalUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Capturar pago
router.post('/capture', async (req: Request, res: Response) => {
  const { orderId, paypalOrderId, test } = req.body;
  if (test) {
    // Modo test: simular pago exitoso
    await Order.findByIdAndUpdate(orderId, {
      'payment.status': 'paid',
      'payment.details': { test: true, paypalOrderId }
    });
    return res.json({ status: 'paid', capture: { test: true } });
  }
  const OrdersCaptureRequest = require('@paypal/checkout-server-sdk').orders.OrdersCaptureRequest;
  const captureRequest = new OrdersCaptureRequest(paypalOrderId);
  captureRequest.requestBody({});

  try {
    const capture = await client().execute(captureRequest);
    await Order.findByIdAndUpdate(orderId, {
      'payment.status': 'paid',
      'payment.details': capture.result
    });
    res.json({ status: 'paid', capture });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export = router;
