import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Login = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  // 123
  // const encryptedPassword = 'U2FsdGVkX1+359QcjSx28xybmS2iHNDsboEQpI0C1Mc=';

  //pass
  const encryptedPassword = "U2FsdGVkX1+V7O8ANZYrcbdCP1Lansoyjr2KIwC/3OQ=";

  const handleLogin = (e) => {
    e.preventDefault();
    const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8);

    if (password === decryptedPassword) {
      setIsAuthenticated(true);
      navigate(`/${process.env.REACT_APP_ADMIN_URL}`);
    } else {
      alert('Password salah');
      // const ssk = secretKey;
      // const pass = '123';
      
      // const encPass = CryptoJS.AES.encrypt(pass, ssk).toString();
      // console.log('Encrypted Password:', encPass);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 120px)' }}>
      <Row>
        <Col>
          <h2 className="text-center mb-4">Admin</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="red" type="submit" className="mt-3 w-100 text-white">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;