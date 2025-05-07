// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { UserProvider } from './UserContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(
  'pk_test_51RK0muP7epSyF7rUXZV3EeQTyit7U4MdRSAMmxro3C1sCmAv5Mz8wt7dJoiAVwV0BDtWtLRCiS6cFlegv821Fn1q00viT15oGU'
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {' '}
    <Elements stripe={stripePromise}>
      <UserProvider>
        <App />{' '}
      </UserProvider>{' '}
    </Elements>
  </React.StrictMode>
);
