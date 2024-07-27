import React, { useEffect, useState }  from 'react';
import { Link } from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import { ref, onValue } from 'firebase/database';
import { db } from '../../utils/firebaseConfig';
import Footer from '../../components/Footer';
import model from '../../assets/model.png';
import bag from '../../assets/bag32.jpg';
import wallet from '../../assets/clutch32.jpg';
import ItemCard from '../../components/ItemCard';

const Home = () => {

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const productsRef = ref(db, 'items');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the data object into an array and sort by createdDate descending
        const productsArray = Object.keys(data).map(key => ({
          ...data[key],
          id: key,
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Set the first 6 products to state
        setProducts(productsArray.slice(0, 6));
      }
    });

    const fetchBrands = async () => {
      const brandsRef = ref(db, 'brands');
      onValue(brandsRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const formattedBrands = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setBrands(formattedBrands);
        }
      });
    };
    fetchBrands();
  }, []);

  const brandMap = brands.reduce((acc, brand) => {
    acc[brand.id] = brand.name;
    return acc;
  }, {});

  return (
    <div>
      <div className="container-fluid bg-light">
        <Container>
          <Row>
             <Col className='col-12 col-md-6 main-hero'>
                <div className='h-100 d-flex flex-column justify-content-center align-items-start'>
                  <h5 className='text-dark mb-3'>Temukan Gaya Terbaikmu</h5>
                  <h1 className='text-dark mb-5'>Koleksi fashion terbaru dari brand terbaik, <span className='text-red'>Hanya untukmu.</span></h1>
                  <Link to="/shop" className="btn btn-outline-red-ts rounded-0 hero-button text-red py-3 px-4 mt-5">Belanja Sekarang <i className="ms-3 bi bi-arrow-right"></i></Link>
                </div>
             </Col>
             <Col className='col-md-6 d-none d-md-block pt-5'>
               <img src={model} alt="" className='w-100'/>
             </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row className='py-5 my-4'>
          <Col className='col-6 col-sm-6 col-md-3 mb-4 mb-md-0 d-flex justify-content-center'>
            <div className='d-flex flex-column flex-sm-row align-items-center'>
              <i className="bi bi-truck fs-1 me-sm-4"></i>
              <div className='d-flex flex-column align-items-center align-items-sm-start'>
                <h5 className='mb-0'>Gratis Ongkir</h5>
                <p className='mb-0 text-secondary text-center text-md-start' style={{fontSize:'14px'}}>Gratis pengiriman pesanan</p>
              </div>
            </div>
          </Col>
          <Col className='col-6 col-sm-6 col-md-3 mb-4 mb-md-0 d-flex justify-content-center'>
            <div className='d-flex flex-column flex-sm-row align-items-center'>
              <i className="bi bi-clock fs-1 me-sm-4"></i>
              <div className='d-flex flex-column align-items-center align-items-sm-start'>
                <h5 className='mb-0'>Dukungan 24/7</h5>
                <p className='mb-0 text-secondary' style={{fontSize:'14px'}}>Layanan sepanjang hari</p>
              </div>
            </div>
          </Col>
          <Col className='col-6 col-sm-6 col-md-3 mb-4 mb-md-0 d-flex justify-content-center'>
            <div className='d-flex flex-column flex-sm-row align-items-center'>
              <i className="bi bi-coin fs-1 me-sm-4"></i>
              <div className='d-flex flex-column align-items-center align-items-sm-start'>
                <h5 className='mb-0'>Garansi Kembali</h5>
                <p className='mb-0 text-secondary' style={{fontSize:'14px'}}>Penggantian produk rusak</p>
              </div>
            </div>
          </Col>
          <Col className='col-6 col-sm-6 col-md-3 mb-4 mb-md-0 d-flex justify-content-center'>
            <div className='d-flex flex-column flex-sm-row align-items-center'>
              <i className="bi bi-tags fs-1 me-sm-4"></i>
              <div className='d-flex flex-column align-items-center align-items-sm-start'>
                <h5 className='mb-0'>Promo & Diskon</h5>
                <p className='mb-0 text-secondary' style={{fontSize:'14px'}}>Penawaran spesial khusus</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row className='mb-5 pt-3'>
          <h2 className='text-center'><i className="me-2 bi bi-dash-lg"></i> Produk Terbaru! <i className="ms-2 bi bi-dash-lg"></i></h2>
          <h6 className='text-center text-secondary fw-normal'>Dapatkan Produk Favoritmu</h6>
        </Row>
        <Row className='shop-page product-show-home'>
          {products.map((item) => (
            <Col key={item.id} className='col-6 col-md-25 mb-4 item-card'>
              <ItemCard item={item} brandName={brandMap[item.brand]} />
            </Col>
          ))}
        </Row>
        <Row className='mb-5'>
          <Col className='col-12 d-flex justify-content-center mb-5 mt-3'>
            <Link to="/shop" className="btn btn-red rounded-0 hero-button text-white py-3 px-4">Jelajahi Semua! <i className="ms-3 bi bi-arrow-right"></i></Link>
          </Col>
        </Row>
        <Row className='my-5 pt-3'>
          <h2 className='text-center'><i className="me-2 bi bi-dash-lg"></i> Kategori Favorit! <i className="ms-2 bi bi-dash-lg"></i></h2>
          <h6 className='text-center text-secondary fw-normal'>Pilihan Terbaik Untuk Anda</h6>
        </Row>
        <Row className='pb-5'>
          <Col className='col-12'>
            <div className='d-flex flex-column flex-sm-row mb-5 shadow shadow-1' style={{width:"100%"}}>
              <img src={bag} alt="" style={{objectFit:"cover",maxHeight:"372px"}} className='w-100 w-sm-50 '/>
              <div className='w-100 w-sm-50 bg-white p-3 p-sm-1 p-md-5 d-flex flex-column justify-content-center align-items-end flex-1'>
                <div>
                  <h1 className='text-end category-name text-red'>Tas</h1>
                  <h6 className='text-end category-sub'>Koleksi Tas Terbaru untuk Segala Kebutuhan</h6>
                </div>
                <Link to="/shop" className="ms-auto mt-2 mt-sm-5 btn btn-red rounded-0 hero-button text-white py-3 px-4">Temukan Pilihanmu! <i className="ms-0 ms-md-3 bi bi-arrow-right"></i></Link>
              </div>
            </div>
          </Col>
          <Col className='col-12'>
            <div className='d-flex flex-column-reverse flex-sm-row mb-5 shadow shadow-1' style={{width:"100%"}}>
              <div className='w-100 w-sm-50 bg-white p-3 p-sm-1 p-md-5 d-flex flex-column justify-content-center align-items-start flex-1'>
                <div>
                  <h1 className='category-name text-red'>Dompet</h1>
                  <h6 className='category-sub'>Simpanan Aman dengan Sentuhan Elegan</h6>
                </div>
                <Link to="/shop" className="mt-2 mt-sm-5 btn btn-red rounded-0 hero-button text-white py-3 px-4">Temukan Pilihanmu! <i className="ms-0 ms-md-3 bi bi-arrow-right"></i></Link>
              </div>
              <img src={wallet} alt="" style={{objectFit:"cover",maxHeight:"372px"}} className='w-100 w-sm-50 '/>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer></Footer>
    </div>
  );
};

export default Home;