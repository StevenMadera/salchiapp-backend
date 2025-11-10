# Guía para cambiar de PayPal a PayU

## Endpoints principales PayU sandbox
- Crear pago: `POST https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi`
- Parámetros clave: `merchantId`, `accountId`, `referenceCode`, `description`, `value`, `currency`, `buyerEmail`, etc.

## Mapeo de endpoints
- `/api/payments/create`: Enviar datos del pedido a PayU y recibir URL de aprobación.
- `/api/payments/capture`: Confirmar pago y actualizar estado del pedido.

## Pasos para migrar
1. Instala el SDK o usa la REST API de PayU.
2. Cambia la lógica en los controladores de backend para usar los endpoints y parámetros de PayU.
3. Actualiza el frontend para abrir la URL de aprobación de PayU.
4. Configura las claves sandbox en `.env`:
   - `PAYU_API_KEY`, `PAYU_API_LOGIN`, `PAYU_MERCHANT_ID`, etc.

## Ejemplo de payload para crear pago
```json
{
  "language": "es",
  "command": "SUBMIT_TRANSACTION",
  "merchant": {
    "apiKey": "<API_KEY>",
    "apiLogin": "<API_LOGIN>"
  },
  "transaction": {
    "order": {
      "accountId": "<ACCOUNT_ID>",
      "referenceCode": "ORDER123",
      "description": "Pago pedido",
      "language": "es",
      "signature": "<SIGNATURE>",
      "buyer": { "emailAddress": "test@correo.com" },
      "additionalValues": {
        "TX_VALUE": { "value": 100, "currency": "USD" }
      }
    },
    "type": "AUTHORIZATION_AND_CAPTURE",
    "paymentMethod": "VISA",
    "paymentCountry": "CO"
  },
  "test": true
}
```

## Referencias
- [PayU Sandbox Docs](https://developers.payulatam.com/latam/en/sandbox.html)
- [API Reference](https://developers.payulatam.com/latam/en/api.html)
