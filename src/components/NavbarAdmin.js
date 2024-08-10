import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Container, Nav, Navbar } from "react-bootstrap";

function NavbarAdmin() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <Navbar expand="md" className="bg-body-tertiary admin-navs">
      <Container>
        <Navbar.Brand href="/">Maharani Eka Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className='a-navlink me-3 mb-2 mb-md-0' to="/resty">Dashboard</Link>
            <Link className='a-navlink me-3 mb-2 mb-md-0' to="/resty/manage-categories">Kategori</Link>
            <Link className='a-navlink me-3 mb-2 mb-md-0' to="/resty/manage-brands">Brand</Link>
            <Link className='a-navlink me-3 mb-2 mb-md-0' to="/resty/manage-items">Produk</Link>
            <Link className='a-navlink me-3 mb-2 mb-md-0' to="/resty/manage-souvenir">Souvenir</Link>
          </Nav>
            <Button variant='danger' size='sm' className='ms-auto mb-2 mb-md-0' onClick={handleLogout}>Log Out</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarAdmin;