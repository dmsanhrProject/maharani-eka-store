import React from 'react';
import { Container, Row, Col, Card} from 'react-bootstrap';

const Contact = () => {
  return (
    <Container className='my-5 contact-page'>
      <Row>
        <Col>
          <h1 className='text-center'>Hubungi Kami</h1>
          <p className="text-center mb-5 text-secondary">
            Kami di sini untuk membantu Anda!
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={4} className='col-12 mb-4'>
          <a href='mailto:admin@maharanieka.com'>
            <Card className='h-100 shadow-sm border-0 rounded-0 flex-row'>
              <div className='h-100 bg-red ratio-1 text-white d-flex flex-center'>
                <i className="bi bi-envelope-at fs-1"></i>
              </div>
              <Card.Body className=''>
                <Card.Title className=''>Email Kami</Card.Title>
                <Card.Text>
                  <p className='text-primary m-0'>admin@maharanieka.com</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </a>
        </Col>
        <Col md={4} className='col-12 mb-4'>
          <a href='https://wa.me/628883734052' target='_blank' rel='noopener noreferrer'>
            <Card className='h-100 shadow-sm border-0 rounded-0 flex-row'>
              <div className='h-100 bg-wa ratio-1 text-white d-flex flex-center'>
                <i className="bi bi-whatsapp fs-1"></i>
              </div>
              <Card.Body className=''>
                <Card.Title className=''>WhatsApp</Card.Title>
                <Card.Text>
                  <p className='text-primary m-0'>+62 888-3734-052</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </a>
        </Col>
        <Col md={4} className='col-12 mb-4'>
          <a href='https://instagram.com/maharaniefashion' target='_blank' rel='noopener noreferrer'>
            <Card className='h-100 shadow-sm border-0 rounded-0 flex-row'>
              <div className='h-100 bg-ig ratio-1 text-white d-flex flex-center'>
                <i className="bi bi-instagram fs-1"></i>
              </div>
              <Card.Body className=''>
                <Card.Title className=''>Instagram</Card.Title>
                <Card.Text>
                  <p className='text-primary m-0'>@maharaniefashion</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </a>
        </Col>
      </Row>
      <Row>
        <Col md={6} className='mb-4'>
          <a href='https://shopee.co.id/maharaniefashion' target='_blank' rel='noopener noreferrer'>
            <Card className='h-100 shadow-sm border-0 rounded-0 flex-row'>
              <div className='h-100 bg-shopee ratio-1 text-white d-flex flex-center'>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50" style={{fill:"white"}}>
                  <path d="M 25 1 C 19.672869 1 15.604123 5.9531422 15.166016 12 L 5.0585938 12 C 3.9235937 12 2.999376 12.980995 3.0625 14.113281 L 4.7871094 44.285156 C 4.9365844 46.922145 7.1369035 49 9.7773438 49 L 40.222656 49 C 42.863851 49 45.063433 46.921831 45.212891 44.285156 L 46.9375 14.115234 C 47.002643 12.982141 46.076406 12 44.941406 12 L 34.833984 12 C 34.395877 5.9531422 30.327131 1 25 1 z M 25 3 C 29.036936 3 32.408924 6.8867916 32.835938 12 L 17.164062 12 C 17.591075 6.8867916 20.963064 3 25 3 z M 5.0585938 14 L 15.832031 14 A 1.0001 1.0001 0 0 0 16.158203 14 L 33.832031 14 A 1.0001 1.0001 0 0 0 34.158203 14 L 44.941406 14 L 43.216797 44.171875 C 43.126254 45.7692 41.823461 47 40.222656 47 L 9.7773438 47 C 8.177784 47 6.8737281 45.768887 6.7832031 44.171875 L 5.0585938 14.001953 L 5.0585938 14 z M 25.074219 18.001953 C 20.760219 18.001953 17.507812 20.689906 17.507812 24.253906 C 17.507812 28.283906 21.2555 29.653328 24.5625 30.861328 C 28.5665 32.324328 30.998047 33.441516 30.998047 36.603516 C 30.998047 39.045516 28.267156 41.033203 24.910156 41.033203 C 21.155156 41.033203 17.973406 38.291672 17.941406 38.263672 L 16.826172 39.90625 C 17.638172 40.56425 20.921156 43.007812 24.910156 43.007812 C 29.430156 43.007813 32.972703 40.194516 32.970703 36.603516 C 32.970703 31.833516 28.864234 30.330813 25.240234 29.007812 C 21.657234 27.696812 19.480469 26.724906 19.480469 24.253906 C 19.480469 21.775906 21.833219 19.976562 25.074219 19.976562 C 27.235219 19.976562 29.115719 20.794703 30.136719 21.345703 C 30.308719 21.437703 30.761672 21.709906 31.013672 21.878906 L 32.035156 20.216797 C 31.801156 20.064797 28.921219 18.001953 25.074219 18.001953 z"></path>
                </svg>
              </div>
              <Card.Body className=''>
                <Card.Title className=''>Shopee</Card.Title>
                <Card.Text>
                  <p className='text-primary m-0'>Maharani Fashion di Shopee</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </a>
        </Col>
        <Col md={6} className='mb-4'>
          <a href='https://www.tiktok.com/@maharaniefashion/shop' target='_blank' rel='noopener noreferrer'>
            <Card className='h-100 shadow-sm border-0 rounded-0 flex-row'>
              <div className='h-100 bg-tiktok ratio-1 text-white d-flex flex-center'>
                <i className="bi bi-tiktok fs-1"></i>
              </div>
              <Card.Body className=''>
                <Card.Title className=''>TikTok Shop</Card.Title>
                <Card.Text>
                  <p className='text-primary m-0'>Maharani Fashion di TikTok Shop</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
