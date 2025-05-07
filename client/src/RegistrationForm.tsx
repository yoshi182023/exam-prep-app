import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from './UserContext';

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

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
          card: elements.getElement(CardElement)!,
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
    <div className="container">
      <h2 className="text-xl font-bold">Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input name="username" required className="block border" />
        </label>
        <label>
          Email
          <input name="email" type="email" required className="block border" />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            className="block border"
          />
        </label>
        <label className="block mt-4">
          Card Info
          <div className="border p-2 rounded">
            <CardElement />
          </div>
        </label>
        <button
          disabled={isLoading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {isLoading ? 'Processing...' : 'Pay & Register'}
        </button>
      </form>
    </div>
  );
}
