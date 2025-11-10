describe('PayPal Payment Flow', () => {
  it('should create order, initiate payment, stub capture, and verify paid', () => {
    cy.request('POST', '/api/orders', { user: 'test', items: [{ menuItem: '1', quantity: 1 }], total: 10 })
      .then((orderRes) => {
        const orderId = orderRes.body._id;
        cy.request('POST', '/api/payments/create', { orderId })
          .then((payRes) => {
            expect(payRes.body.orderID).to.exist;
            // Simular aprobación y captura
            cy.intercept('POST', '/api/payments/capture', {
              status: 'paid',
              capture: { id: 'FAKE_PAYPAL_CAPTURE' }
            }).as('captureStub');
            cy.request('POST', '/api/payments/capture', { orderId, paypalOrderId: payRes.body.orderID })
              .then((capRes) => {
                expect(capRes.body.status).to.eq('paid');
                cy.request(`/api/orders/${orderId}`).then((orderCheck) => {
                  expect(orderCheck.body.payment.status).to.eq('paid');
                });
              });
          });
      });
  });
});
