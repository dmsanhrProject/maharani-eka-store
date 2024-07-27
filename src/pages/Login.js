import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Login = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  // 123
  const encryptedPassword = 'U2FsdGVkX18bbTS4CgJzutvdDN7ogWQGuu4KrDxgnZo=';

  // AdminMHS#5678
  // const encryptedPassword = 'U2FsdGVkX1/ndNr5+XMzkUpgpMJbsyHlufhQUwcgHpE=';
  const secretKey = 'MHSsuperS3cretP4s$to#pen';

  const handleLogin = (e) => {
    e.preventDefault();
    const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, secretKey).toString(CryptoJS.enc.Utf8);

    if (password === decryptedPassword) {
      setIsAuthenticated(true);
      navigate('/admin');
    } else {
      alert('Password salah');
      const ssk = 'MHSsuperS3cretP4s$to#pen';
      const pass = '123';
      
      const encPass = CryptoJS.AES.encrypt(pass, ssk).toString();
      console.log('Encrypted Password:', encPass);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;