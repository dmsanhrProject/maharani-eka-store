import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Spinner, Badge } from 'react-bootstrap';
import { ref, get } from "firebase/database";
import { db } from '../../utils/firebaseConfig';
import Footer from '../../components/Footer';
import { WA_NUMBER } from '../../utils/VarGlobe';

import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const ShopDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(true);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  const toggleShowMore = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => { 
    const itemRef = ref(db, `items/${id}`);

    get(itemRef).then((snapshot) => {
      if (snapshot.exists()) {
        const itemData = snapshot.val();
        setItem(itemData);
        // Ambil data brand berdasarkan brandId
        const brandRef = ref(db, `brands/${itemData.brand}`);
        return get(brandRef);
      } else {
        throw new Error("Item tidak ditemukan");
      }
    }).then((brandSnapshot) => {
      if (brandSnapshot.exists()) {
        setBrandName(brandSnapshot.val().name);
      } else {
        console.log("Brand tidak ditemukan");
      }
      setLoading(false);
    }).catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        // Mendapatkan line-height dan menghitung tinggi maksimum untuk 3 baris
        const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
        const maxHeight = lineHeight * 3;

        if (element.scrollHeight > maxHeight) {
          setIsTruncated(true);
        } else {
          setIsTruncated(false);
        }
      }
    };

    if (!loading && item) {
      checkTruncation();
    }
  }, [item, loading]);

  function formatRupiah(number) {
    return number.toLocaleString('id-ID');
  }

  function generateWhatsAppURL() {
    const message = `🛍 Halo Maharani Eka! 🛍 
Saya tertarik dengan produk

_*${brandName}*_
*${item.name}* 

Bisa tolong berikan informasi lebih lanjut mengenai
- detail produk
- ketersediaan stok
- serta promo / diskon 

Terima kasih banyak! 🙏😊`;
    return `https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${encodeURIComponent(message)}`;
  }

  if (loading) {
    return <Col className='col-12 d-flex justify-content-center my-5 py-5'><Spinner animation="border" /></Col>;
  }

  if (!item) {
    return <p>Item tidak ditemukan</p>;
  }

  const images = item.images.map(imageUrl => ({
    original: imageUrl,
    thumbnail: imageUrl,
  }));
  
  return (
    <div>
      <Container style={{minHeight:"calc(100vh - 120px)"}} className='pt-2 pt-sm-3'>
        <Row>
          <Col sm={6} className={`image-product-col ${item.images.length > 1 ? `multi-image` : `one-image`}`}>
            <Image src={item.images[0]} fluid className='image-single' />
            <ImageGallery
              items={images} 
              infinite={false} 
              showFullscreenButton={false}
              showPlayButton={false}
            />
          </Col>
          <Col sm={6}>
            <div className='p-1 p-md-5'>
              <h3>{brandName}</h3>
              <h2 className='fw-normal'>{item.name}</h2>
              
              <h3 className='text-red'>Rp{item.discount === '0' || item.discount === 0 ? formatRupiah(parseInt(item.price)) : formatRupiah(parseInt(item.discount))}</h3>
              <h6 className={`text-strip-discount text-grey fw-normal ${item.discount === '0' || item.discount === 0 ? `d-none` : `d-block`}`}>
                <Badge bg='discount' className='me-1'>{(((parseInt(item.price) - parseInt(item.discount)) / parseInt(item.price)) * 100).toFixed(0)}%</Badge>
                Rp{formatRupiah(parseInt(item.price))}
              </h6>
              
              <p ref={textRef} className={isExpanded ? 'mb-1' : 'truncated-desc mb-1'} style={{fontSize:"16px", lineHeight:"20px", whiteSpace:"pre-line"}}>
                {item.description}
              </p>
              {isTruncated && (
                <h6 onClick={toggleShowMore} className='cursor-pointer text-red fw-bold' style={{fontSize:'16px'}}>
                  {isExpanded ? 'Lihat Lebih Sedikit' : 'Lihat Selengkapnya'}
                </h6>
              )}

              <hr/>
              <a href={item.shopeeLink} target="_blank" rel="noopener noreferrer" className='w-100 mb-3 btn btn-shopee rounded-1'>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50" style={{marginTop:'-8px',fill:"white",marginRight:"4px"}}>
                  <path d="M 25 1 C 19.672869 1 15.604123 5.9531422 15.166016 12 L 5.0585938 12 C 3.9235937 12 2.999376 12.980995 3.0625 14.113281 L 4.7871094 44.285156 C 4.9365844 46.922145 7.1369035 49 9.7773438 49 L 40.222656 49 C 42.863851 49 45.063433 46.921831 45.212891 44.285156 L 46.9375 14.115234 C 47.002643 12.982141 46.076406 12 44.941406 12 L 34.833984 12 C 34.395877 5.9531422 30.327131 1 25 1 z M 25 3 C 29.036936 3 32.408924 6.8867916 32.835938 12 L 17.164062 12 C 17.591075 6.8867916 20.963064 3 25 3 z M 5.0585938 14 L 15.832031 14 A 1.0001 1.0001 0 0 0 16.158203 14 L 33.832031 14 A 1.0001 1.0001 0 0 0 34.158203 14 L 44.941406 14 L 43.216797 44.171875 C 43.126254 45.7692 41.823461 47 40.222656 47 L 9.7773438 47 C 8.177784 47 6.8737281 45.768887 6.7832031 44.171875 L 5.0585938 14.001953 L 5.0585938 14 z M 25.074219 18.001953 C 20.760219 18.001953 17.507812 20.689906 17.507812 24.253906 C 17.507812 28.283906 21.2555 29.653328 24.5625 30.861328 C 28.5665 32.324328 30.998047 33.441516 30.998047 36.603516 C 30.998047 39.045516 28.267156 41.033203 24.910156 41.033203 C 21.155156 41.033203 17.973406 38.291672 17.941406 38.263672 L 16.826172 39.90625 C 17.638172 40.56425 20.921156 43.007812 24.910156 43.007812 C 29.430156 43.007813 32.972703 40.194516 32.970703 36.603516 C 32.970703 31.833516 28.864234 30.330813 25.240234 29.007812 C 21.657234 27.696812 19.480469 26.724906 19.480469 24.253906 C 19.480469 21.775906 21.833219 19.976562 25.074219 19.976562 C 27.235219 19.976562 29.115719 20.794703 30.136719 21.345703 C 30.308719 21.437703 30.761672 21.709906 31.013672 21.878906 L 32.035156 20.216797 C 31.801156 20.064797 28.921219 18.001953 25.074219 18.001953 z"></path>
                </svg>
                Buka Shopee
              </a>
              <br />
              <a href={item.tiktokLink} target="_blank" rel="noopener noreferrer" className='w-100 mb-3 btn btn-tiktok rounded-1'>
                <i className="bi bi-tiktok" style={{marginRight:"4px"}}></i>
                Buka TikTok Shop
              </a>
              <br />
              <a href={generateWhatsAppURL()} target="_blank" rel="noopener noreferrer" className='w-100 mb-3 btn btn-whatsapp rounded-1'>
                <i className="bi bi-whatsapp" style={{marginRight:"4px"}}></i>
                Hubungi Kami
              </a>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default ShopDetail;
