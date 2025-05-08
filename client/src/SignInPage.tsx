import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';

import './SignIn.css';

export default function SignInPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        setError(error || 'failed');
        return;
      }

      const user = await res.json();
      setUser(user);
      navigate('/wrong-answers');
    } catch (err) {
      alert(`Error signing in: ${err}`);
    }
  }

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-sm w-full">
        <h2 className="form-header">Log in</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label className="form-label">Username</label>

          <input
            required
            name="username"
            type="text"
            className="block border border-gray-600 rounded p-2 h-8 w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Sign in
        </button>
      </form>
      <p className="form-footer">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="register-link">
          Register here
        </Link>
      </p>
    </div>
  );
}
