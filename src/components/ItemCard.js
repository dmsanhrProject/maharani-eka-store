import React from 'react';
import { Card, Badge} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item, brandName }) => {
  const navigate = useNavigate();

  function formatRupiah(number) {
    return number.toLocaleString('id-ID');
  }

  const handleClick = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <Card className='h-100 border-0 shadow-sm rounded-0' onClick={handleClick} style={{cursor:"pointer"}}>
      <Card.Img variant="top" className='rounded-0' src={item.images[0]} />
      <h6 className='text-center bg-red mb-0 py-1 px-3 text-white text-truncate text-uppercase' style={{borderTopLeftRadius:'100%',borderTopRightRadius:'100%',marginTop:'-26px'}}>{brandName}</h6>
      <Card.Body>
        <Card.Text className='text-truncate text-muted card-title-name'>{item.name}</Card.Text>
        <Card.Title className='card-title-price'>
          Rp{item.discount === 0 || item.discount === '0' ? formatRupiah( parseInt(item.price)) : formatRupiah( parseInt(item.discount))}
        </Card.Title>
        <Card.Text style={{fontSize:'12px'}} className={item.discount === 0 || item.discount === '0' ? 'd-none' : 'd-block'}>
          {/* Rp{formatRupiah( parseInt(item.discount))} */}
          
          <span className='text-strip-discount text-grey'>Rp{formatRupiah( parseInt(item.price))}</span> 
          <Badge bg='discount' className='ms-1 p-1'>{(((parseInt(item.price) - parseInt(item.discount)) / parseInt(item.price)) * 100).toFixed(0)}%</Badge>
        
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ItemCard;
