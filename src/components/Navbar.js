import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, FormControl, Button, Offcanvas } from 'react-bootstrap';
import logoW from "../assets/LOGO.jpg";

const Nav4 = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery === "" || searchQuery === null ) {
      navigate(`/shop`);
    } else {
      navigate(`/shop?search=${searchQuery}`);
    }
  };

  return (
    <div className="sticky-md-top">
        <Navbar bg="white" expand="md" className="nav-main shadow-none">
            <Container>
                <Navbar.Brand href="/" className='d-flex align-items-center py-md-2 p-0'>
                    <img src={logoW} alt=""/>
                    <h2 className="text-red mb-0 ms-3 ps-3 pt-1 border-start border-red font-logo d-none d-md-block">Maharani Eka</h2>
                    <h4 className="text-red mb-0 pt-1 font-logo d-block d-md-none">Maharani Eka</h4>
                </Navbar.Brand>
                <i className="bi bi-list text-red d-block d-md-none" style={{fontSize:'30px',padding:"4px 12px"}} onClick={handleShow}></i>
                <Navbar.Collapse id="main-navs">
                    <div className="search-and-icons w-100">
                        <Form className="d-flex p-1 my-2 my-md-0 bg-white ms-auto rounded-3 border border-red" onSubmit={handleSearchSubmit}>
                            <FormControl
                                type="search"
                                placeholder="Cari Produk"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="border-0"
                            />
                            <Button type="submit" className="border-0 btn-red rounded-2">
                                <i className="bi bi-search mx-2 text-white"></i>
                            </Button>
                        </Form>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Navbar bg="white" className="nav-main pt-0 pb-2 d-md-flex d-none shadow-none border-bottom border-1">
            <Container>
                <Nav className="ms-auto mb-2 mb-lg-0 bottom-nav1">
                    <Nav.Link as={Link} className="text-red" to="/">Home</Nav.Link>
                    <Nav.Link as={Link} className="text-red" to="/shop">Shop</Nav.Link>
                    <Nav.Link as={Link} className="text-red" to="/reseller">Reseller</Nav.Link>
                    <Nav.Link as={Link} className="text-red" to="/contact">Contact</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
        <Navbar bg="white" className="nav-main nav-search pt-0 mb-0 d-md-none d-flex shadow-none" sticky="top">
            <Container>
                <Form className="w-100 d-flex p-1 mb-2 bg-white rounded-3 border border-1 border-red" onSubmit={handleSearchSubmit}>
                    <FormControl
                        type="search"
                        placeholder="Cari Produk"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="border-0 shadow-none outline-none text-dark"
                        size='sm'
                    />
                    <Button type="submit" className="border-0 btn-red btn-sm rounded-2">
                        <i className="bi bi-search mx-2 text-white"></i>
                    </Button>
                </Form>
            </Container>
        </Navbar>
        <Offcanvas show={show} onHide={handleClose} placement='end' style={{width:'100vw'}}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className='text-red font-logo pt-1' style={{fontSize:'26px'}}>Maharani Eka</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Nav className="mb-2 mb-lg-0 flex-column border-top">
                    <Nav.Link as={Link} to="/" className='py-4 border-bottom text-dark' style={{fontSize:"30px"}} onClick={handleClose}>Home</Nav.Link>
                    <Nav.Link as={Link} to="/shop" className='py-4 border-bottom text-dark' style={{fontSize:"30px"}} onClick={handleClose}>Shop</Nav.Link>
                    <Nav.Link as={Link} to="/reseller" className='py-4 border-bottom text-dark' style={{fontSize:"30px"}} onClick={handleClose}>Reseller</Nav.Link>
                    <Nav.Link as={Link} to="/contact" className='py-4 border-bottom text-dark' style={{fontSize:"30px"}} onClick={handleClose}>Contact</Nav.Link>
                </Nav>
            </Offcanvas.Body>
        </Offcanvas>
    </div>
  );
};

export default Nav4;
