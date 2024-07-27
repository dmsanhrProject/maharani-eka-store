import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavbarAdmin() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary admin-navs">
      <Container>
        <Navbar.Brand href="/">Maharani Eka Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className='a-navlink me-3' to="/admin">Dashboard</Link>
            <Link className='a-navlink me-3' to="/admin/manage-categories">Kategori</Link>
            <Link className='a-navlink me-3' to="/admin/manage-brands">Brand</Link>
            <Link className='a-navlink me-3' to="/admin/manage-items">Produk</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarAdmin;