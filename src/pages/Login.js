import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Login = () => {
    const email = 'maharaniekaofc@gmail.com';
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate(`/${process.env.REACT_APP_ADMIN_URL}`);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 120px)' }}>
            <Row>
                <Col>
                <h2 className="text-center mb-4">Admin</h2>
                <Form onSubmit={handleSignIn}>
                    <Form.Group controlId="formBasicPassword">
                    <Form.Control
                        type="password"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </Form.Group>
                    <Button variant="red" type="submit" className="mt-3 w-100 text-white">
                    Login
                    </Button>
                </Form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
