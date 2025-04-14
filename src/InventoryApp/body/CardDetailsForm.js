import React from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { Button, Form } from 'antd';
import './CardDetailsForm.css'; // Add custom CSS for styling

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': {
        color: '#a0aec0',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CustomCardForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment('your_client_secret_here', {
      payment_method: {
        card: cardNumberElement,
      },
    });

    if (error) {
      console.error('Payment failed:', error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded!');
    }
  };

  return (
    <Form onFinish={handleSubmit} className="custom-card-form">
      <Form.Item label="Card Number" name="cardNumber">
        <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
      </Form.Item>

      <Form.Item label="Expiry Date" name="expiryDate">
        <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
      </Form.Item>

      <Form.Item label="CVC" name="cvc">
        <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
      </Form.Item>

      <Button type="primary" htmlType="submit" disabled={!stripe}>
        Pay Now
      </Button>
    </Form>
  );
};

export default CustomCardForm;