import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from './UserContext';
import './RegistrationForm.css';

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const { username, email, password } = Object.fromEntries(formData) as {
        username: string;
        email: string;
        password: string;
      };

      if (!stripe || !elements) {
        alert('Stripe not loaded');
        return;
      }

      // Step 1: Ask backend to create payment intent
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose: 'registration' }),
      });
      const { clientSecret } = await res.json();
      console.log('clientSecret:', clientSecret);

      // Step 2: Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(
            CardElement
          )! as unknown as StripeCardElement,
        },
      });

      if (result.error || result.paymentIntent?.status !== 'succeeded') {
        alert('Payment failed: ' + result.error?.message);
        return;
      }

      // Step 3: Submit user info and paymentIntentId
      const signupRes = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          paymentIntentId: result.paymentIntent.id,
        }),
      });

      if (signupRes.status === 409) {
        alert('Username already taken');
        return;
      }

      if (!signupRes.ok) {
        throw new Error(`Signup error: ${signupRes.status}`);
      }

      const user = (await signupRes.json()) as User['user'];
      alert(`Registered ${user.username} (id ${user.userid})`);
      navigate('/sign-in');
    } catch (err) {
      alert(`Registration error: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="registration-container">
      {' '}
      <div className="slogan">
        <h3 className="slogan1">Create Your Account</h3>
        <h3 className="slogan2">
          Gain unlimited lifetime access to personalize your exam experience!
        </h3>
      </div>
      <span className="grey">
        Study with high quality learning tools that help you learn faster,
        retain longer, and score higher. You will become a confident candidate,
        subscribe and start today!
      </span>
      <h2 className="registration-title">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input name="username" required />
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input name="email" type="email" required />
          <label className="form-label">Password </label>{' '}
          <input name="password" type="password" required />
          <label className="form-label">
            Payment Information
            <div className="card-element-container">
              <CardElement />
            </div>
          </label>{' '}
        </div>
        <button className="pay-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Pay & Register'}
        </button>
      </form>
    </div>
  );
}
