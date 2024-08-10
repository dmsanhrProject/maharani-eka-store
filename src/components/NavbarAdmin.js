import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavbarAdmin() {
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarAdmin;