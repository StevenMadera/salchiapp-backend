# Configuración y verificación de pagos PayPal Sandbox

## 1. Claves Sandbox
- Agrega en `backend/.env`:
  - PAYPAL_CLIENT_ID=your_sandbox_client_id
  - PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
  - PAYPAL_MODE=sandbox

## 2. Pasos para prueba
1. Inicia el backend (`npm run dev`).
2. Inicia el frontend (`ionic serve`).
3. Crea un pedido y usa el botón PayPal en la app.
4. Realiza el pago en la ventana de PayPal Sandbox.
5. Verifica en la base de datos que el pedido tiene `payment.status = 'paid'` y el estado general es `processing`.

## 3. Logs de verificación
- Revisa la respuesta del endpoint `/api/payments/capture`.
- Verifica los detalles en el campo `payment.details` del modelo Order.

## 4. Prueba E2E Cypress
- Flujo:
  1. Crear pedido
  2. Iniciar pago (stub approval/capture)
  3. Verificar que el pedido está pagado

## 5. Referencias
- [PayPal Sandbox](https://developer.paypal.com/docs/api-basics/sandbox/)
- [PayPal JS SDK](https://developer.paypal.com/docs/checkout/)
