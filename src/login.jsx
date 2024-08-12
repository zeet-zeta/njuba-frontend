import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios.post('http://localhost:7001/api/login', { username, password })
      .then(response => {
        if (!response.data.success) {
          setError(response.data.message);
          return;
        }
        console.log('Login successful');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error:', error);
        setError('网络错误！');
      })
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
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
          <button type="submit" className="btn-login">登录</button>
        </form>
        <div className="register-link">
          <Link to="/register">没有账号，注册一个</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;