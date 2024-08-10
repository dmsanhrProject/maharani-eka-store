import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center d-flex flex-column justify-content-center align-items-center" style={{ height: 'calc(100vh - 120px)' }}>
        <h1 className="display-1">404</h1>
        <p className="lead">Halaman Tidak Ditemukan</p>
        <Link to="/" className="btn btn-outline-red-ts rounded-0 hero-button text-red py-3 px-5 mt-3">Beranda <i className="ms-2 bi bi-arrow-right"></i></Link>
    </div>
  );
};

export default NotFound;
