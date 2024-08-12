import React, { useState } from 'react';
import axios from 'axios';
import './css/register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致！');
      return;
    }

    axios.post('http://localhost:7001/api/register', { username, password })
      .then(response => {
        if (!response.data.success) {
          setError(response.data.message);
          return;
        }
        console.log('Registration successful');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error:', error);
        setError('网络错误！');
      });
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h2>NJUba</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名：</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>密码：</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>确认密码：</label>
            <input
              id="password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-register">注册</button>
        </form>
      </div>
    </div>
  );
};

export default Register;