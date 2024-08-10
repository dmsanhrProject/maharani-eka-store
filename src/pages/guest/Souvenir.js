import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../utils/firebaseConfig';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Footer from '../../components/Footer';
import { WA_NUMBER } from '../../utils/VarGlobe';

function generateWhatsAppURL(product) {
  const message = `💎 Halo Maharani Eka! 💎

Saya tertarik dengan 
*suvenir custom ${product}* 

Bisa tolong berikan informasi detail lebih lanjut?
Terima kasih banyak! 🙏😊`;
  return `https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${encodeURIComponent(message)}`;
}

const Souvenir = () => {

    const [souvenirs, setSouvenirs] = useState([]);

    useEffect(() => {
        const souvenirsRef = ref(db, 'souvenirs/');
        onValue(souvenirsRef, (snapshot) => {
        const data = snapshot.val();
        const souvenirList = data ? Object.keys(data).map(key => ({
            id: key,
            ...data[key],
        })) : [];
        setSouvenirs(souvenirList);
        });
    }, []);

  return (
    <div className="seller-page pt-3">
      <Container style={{minHeight:'100vh'}}>
        <Row>
          <Col>
            <h1 className='text-center'>Suvenir Khusus!</h1>
            <p className="text-center text-secondary">
              Buat Suvenir Kustom untuk Kenangan yang Abadi dan Berkesan
            </p>
          </Col>
        </Row>
        <Row className="mt-3 mt-md-5">
            {souvenirs.map(souvenir => ( 
                <Col key={souvenir.id} sm={4} md={4} className='col-6'>
                    <Card style={{
                        aspectRatio:"1",
                        width:"100%",
                        height:"auto",
                        backgroundImage: `url(${souvenir.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}>
                        <Card.Body>
                            <Card.Title>{souvenir.name}</Card.Title>
                            <Card.Text>{souvenir.description}</Card.Text>
                            <Button className="btn btn-red rounded-0 hero-button text-white py-2 px-3"
                                as="a" href={generateWhatsAppURL(souvenir.name)} target="_blank"
                            >Hubungi Kami !</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
      </Container>
      <Footer/>
    </div>
  );
};

export default Souvenir;
