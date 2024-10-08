import React, { useState, useEffect } from 'react';
import { ref, set, remove, update, push, onValue } from 'firebase/database';
import { Row, Col, Button, ButtonGroup, Form, Offcanvas, Card, Badge, Spinner } from 'react-bootstrap';
import { db } from '../../utils/firebaseConfig';
import axios from 'axios';

const ManageItems = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    discount: 0,
    description: '',
    tiktokLink: '',
    shopeeLink: '',
    category: '',
    brand: '',
    gender: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setLoading] = useState(false);

  function formatRupiah(number) {
    return number.toLocaleString('id-ID');
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesRef = ref(db, 'categories');
      onValue(categoriesRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const formattedCategories = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setCategories(formattedCategories);
        }
      });
    };

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

    const fetchItems = async () => {
      const itemsRef = ref(db, 'items');
      onValue(itemsRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const formattedItems = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setItems(formattedItems);
        }
      });
    };    

    fetchCategories();
    fetchBrands();
    fetchItems();
  }, [db]);

  const uploadImageToCloudinary = async (file) => {
    const url = 'https://api.cloudinary.com/v1_1/drhujpp7h/image/upload';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'cngs0yzd');

    try {
      const response = await axios.post(url, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;
    
    setLoading(true);
    
    try {
      // Upload images and get URLs
      const imageUrls = await Promise.all(
        newItem.images.map(file => uploadImageToCloudinary(file))
      );
    
      const itemsRef = ref(db, 'items');
      const newItemRef = push(itemsRef);
      const newItemWithTimestamp = {
        ...newItem,
        images: imageUrls,
        createdAt: new Date().toISOString() // Add current timestamp
      };
    
      await set(newItemRef, newItemWithTimestamp);
    
      setNewItem({
        name: '',
        price: '',
        discount: '',
        description: '',
        tiktokLink: '',
        shopeeLink: '',
        category: '',
        brand: '',
        gender: '',
        images: []
      });
    } catch (error) {
      alert('Error adding item:', error);
    } finally {
      setImagePreviews([]);
      setShowAddModal(false);
      setLoading(false);
    }    
  };
  

  const handleEditItem = async () => {
    if (!editItem || !editItem.id) return;

    // Upload images and get URLs
    const imageUrls = await Promise.all(
      editItem.images.map(file => uploadImageToCloudinary(file))
    );

    await update(ref(db, `items/${editItem.id}`), { ...editItem, images: imageUrls });
    setShowEditModal(false);
    setEditItem(null);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Yakin produk dihapus?')) {
      await remove(ref(db, `items/${id}`));
    }
  };

  const handleShowDetail = (item) => {
    setViewItem(item);
    setShowDetailModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewItem(prev => ({
      ...prev,
      images: files
    }));
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setNewItem(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const startEditItem = (item) => {
    setEditItem(item);
    setShowEditModal(true);
  };

  // Fungsi untuk menangani perubahan input pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filter item berdasarkan nama atau brand
  const filteredItems = items.filter(item => {
    const brandName = brands.find(brand => brand.id === item.brand)?.name.toLowerCase() || '';
    const itemName = item.name.toLowerCase();
    return itemName.includes(searchTerm) || brandName.includes(searchTerm);
  });

  return (
    <div className="container mt-4 admin-page">
      <div className={`${isLoading ? 'd-flex' : 'd-none'} justify-content-center align-items-center`}
        style={{
          position:"absolute",
          top:"0",
          right:"0",
          width:"100vw",
          height:"100vh",
          backgroundColor:"#00000054",
          zIndex:"1042"
        }}
      >
        <Spinner animation="border" />
      </div>


      <h1>Manage Product</h1>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Product</Button>
      <Row className="mt-4">
        <Col className='col-12'>
          <Form className="mb-4">
            <Form.Group controlId="search">
              <Form.Control
                type="text"
                placeholder="Cari nama atau brand"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Form>
        </Col>
        {filteredItems.map(item => (
          <Col sm={4} md={3} lg={2} key={item.id} className="mb-4 col-6">
            <Card 
              style={{ cursor: 'pointer',overflow:'hidden'}} 
              onClick={() => handleShowDetail(item)}
            >
              <div className='w-100 d-flex justify-content-between align-items-start' style={{marginBottom:"-21px",zIndex:'99'}}>
                <Badge bg={item.gender === 'Wanita' ? 'pink' : 'primary'} className='rounded-1' style={{width:"fit-content"}}>
                  {item.gender === 'Wanita' ? 'W' : 'P'}
                </Badge>
                <Badge bg='discount' className={item.discount === '0' || item.discount === 0 ? 'd-none' : 'd-block'} style={{backgroundColor:'#f6d3d6'}}>
                  -
                  {(((parseInt(item.price) - parseInt(item.discount)) / parseInt(item.price)) * 100).toFixed(0)}
                  %
                </Badge>
              </div>
              
              {/* <Badge bg={item.gender === 'Wanita' ? 'pink' : 'primary'} className='rounded-1' style={{marginBottom:"-21px",zIndex:'99',width:"fit-content"}}>
                {item.gender === 'Wanita' ? 'W' : 'P'}
              </Badge> */}
              {item.images.length > 0 && (
                <Card.Img 
                  variant="top" 
                  src={item.images[0]} 
                  alt={item.name} 
                  style={{ height: '150px', objectFit: 'cover' }}
                />
              )}
              <Card.Body className="pt-1 px-2 px-sm-3 pb-2 pb-sm-3">
                <Card.Title>
                  {brands.find(brand => brand.id === item.brand)?.name || 'N/A'}
                </Card.Title>
                <Card.Subtitle className="pb-2 text-secondary text-truncate">{item.name}</Card.Subtitle>
                
                <p className={item.discount === '0' || item.discount === 0 ? '' : 'text-red'}>Rp{item.discount === '0' || item.discount === 0 ? formatRupiah(parseInt(item.price)) : formatRupiah(parseInt(item.discount))}</p>
                
                {/* <Card.Text>
                  Rp.{formatRupiah(parseInt(item.price))}
                </Card.Text> */}
                <ButtonGroup size="sm" className='w-100' style={{zIndex:'99'}}>
                  <Button variant="outline-warning" onClick={(e) => {e.stopPropagation(); startEditItem(item)}}>edit</Button>
                  <Button variant="outline-danger" onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}>hapus</Button>
                </ButtonGroup>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Product Modal */}
      <Offcanvas show={showAddModal} onHide={() => setShowAddModal(false)} placement='end' className='admin-canvas-add-items'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Product</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group controlId="formItemName">
              <Form.Label className="mb-0 mt-2">Nama Produk</Form.Label>
              <Form.Control size="sm"
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
              />
            </Form.Group>
            <Form.Group controlId="formItemPrice">
              <Form.Label className="mb-0 mt-2">Harga</Form.Label>
              <Form.Control size="sm"
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Enter item price"
              />
            </Form.Group>
            <Form.Group controlId="formItemDiscount">
              <Form.Label className="mb-0 mt-2 text-danger">Harga Diskon</Form.Label>
              <Form.Control size="sm" className='border-danger'
                type="number"
                value={newItem.discount}
                onChange={(e) => setNewItem(prev => ({ ...prev, discount: e.target.value }))}
                placeholder="Enter item discount price"
              />
              <small>Tulis <span className='text-danger'>0</span> jika tidak ada diskon</small>
            </Form.Group>
            <Form.Group controlId="formItemDescription">
              <Form.Label className="mb-0 mt-2">Deskripsi</Form.Label>
              <Form.Control size="sm"
                as="textarea"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter item description"
              />
            </Form.Group>
            <Form.Group controlId="formItemTiktokLink">
              <Form.Label className="mb-0 mt-2">TikTok Link</Form.Label>
              <Form.Control size="sm"
                type="text"
                value={newItem.tiktokLink}
                onChange={(e) => setNewItem(prev => ({ ...prev, tiktokLink: e.target.value }))}
                placeholder="Enter TikTok link"
              />
            </Form.Group>
            <Form.Group controlId="formItemShopeeLink">
              <Form.Label className="mb-0 mt-2">Shopee Link</Form.Label>
              <Form.Control size="sm"
                type="text"
                value={newItem.shopeeLink}
                onChange={(e) => setNewItem(prev => ({ ...prev, shopeeLink: e.target.value }))}
                placeholder="Enter Shopee link"
              />
            </Form.Group>
            <Form.Group controlId="formItemCategory">
              <Form.Label className="mb-0 mt-2">Ketegori</Form.Label>
              <Form.Control size="sm"
                as="select"
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemBrand">
              <Form.Label className="mb-0 mt-2">Brand</Form.Label>
              <Form.Control size="sm"
                as="select"
                value={newItem.brand}
                onChange={(e) => setNewItem(prev => ({ ...prev, brand: e.target.value }))}
              >
                <option value="">Select brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemGender">
              <Form.Label className="mb-0 mt-2">Gender</Form.Label>
              <Form.Control size="sm"
                as="select"
                value={newItem.gender}
                onChange={(e) => setNewItem(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="">Select gender</option>
                <option value="Pria">Pria</option>
                <option value="Wanita">Wanita</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemImages">
              <Form.Label className="mb-0 mt-2">Gambar</Form.Label>
              <Form.Control size="sm"
                type="file" 
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <small>Gambar pertama akan dijadikan thumbnail</small>
              <div className="image-previews mt-2 w-100 d-flex flex-wrap align-items-start">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview d-flex align-items-start" style={{width:'24%',marginRight:'1%'}}>
                    <img src={preview} alt="Preview" className="img-thumbnail" style={{width:'100%',height:'auto'}} />
                    <Button variant="danger" size="sm" style={{marginLeft:'-100%', fontSize:'8px'}} onClick={() => handleRemoveImage(index)}>X</Button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Form>
          <Button variant="primary" className='w-100 mt-3' onClick={handleAddItem}>Add Product</Button>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Edit Item Modal */}
      <Offcanvas show={showEditModal} onHide={() => setShowEditModal(false)} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Edit Item</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group controlId="formItemName">
              <Form.Label className="mb-0 mt-2">Nama Produk</Form.Label>
              <Form.Control size="sm"
                type="text"
                value={editItem?.name || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
              />
            </Form.Group>
            <Form.Group controlId="formItemPrice">
              <Form.Label className="mb-0 mt-2">Harga</Form.Label>
              <Form.Control size="sm"
                type="number"
                value={editItem?.price || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Enter item price"
              />
            </Form.Group>
            <Form.Group controlId="formItemDiscount">
              <Form.Label className="mb-0 mt-2 text-danger">Harga Diskon</Form.Label>
              <Form.Control size="sm" className='border-danger'
                type="number"
                value={editItem?.discount || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, discount: e.target.value }))}
                placeholder="Enter item discount price"
              />
              <small>Tulis <span className='text-danger'>0</span> jika tidak ada diskon</small>
            </Form.Group>
            <Form.Group controlId="formItemDescription">
              <Form.Label className="mb-0 mt-2">Deskripsi</Form.Label>
              <Form.Control size="sm"
                as="textarea"
                value={editItem?.description || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter item description"
              />
            </Form.Group>
            <Form.Group controlId="formItemTiktokLink">
              <Form.Label className="mb-0 mt-2">TikTok Link</Form.Label>
              <Form.Control size="sm"
                type="text"
                value={editItem?.tiktokLink || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, tiktokLink: e.target.value }))}
                placeholder="Enter TikTok link"
              />
            </Form.Group>
            <Form.Group controlId="formItemShopeeLink">
              <Form.Label className="mb-0 mt-2">Shopee Link</Form.Label>
              <Form.Control size="sm"
                type="text"
                value={editItem?.shopeeLink || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, shopeeLink: e.target.value }))}
                placeholder="Enter Shopee link"
              />
            </Form.Group>
            <Form.Group controlId="formItemCategory">
              <Form.Label className="mb-0 mt-2">Kategori</Form.Label>
              <Form.Control size="sm"
                as="select"
                value={editItem?.category || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemBrand">
              <Form.Label className="mb-0 mt-2">Brand</Form.Label>
              <Form.Control size="sm"
                as="select"
                value={editItem?.brand || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, brand: e.target.value }))}
              >
                <option value="">Select brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemGender">
              <Form.Label className="mb-0 mt-2">Gender</Form.Label>
              <Form.Control size="sm"
                as="select"
                value={editItem?.gender || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="">Select gender</option>
                <option value="Pria">Pria</option>
                <option value="Wanita">Wanita</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemImages">
              <Form.Label className="mb-0 mt-2">Gambar</Form.Label>
              <Form.Control size="sm"
                type="file"
                multiple
                onChange={(e) => setEditItem(prev => ({ ...prev, images: Array.from(e.target.files) }))}
              />
              <div className="image-previews mt-2 w-100 d-flex flex-wrap align-items-start">
                {editItem?.images.map((preview, index) => (
                  <div key={index} className="image-preview d-flex align-items-start" style={{width:'24%',marginRight:'1%'}}>
                    <img src={preview} alt="Preview" className="img-thumbnail" style={{width:'100%',height:'auto'}} />
                    <Button variant="danger" size="sm" style={{marginLeft:'-100%', fontSize:'8px'}} onClick={() => handleRemoveImage(index)}>X</Button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Form>
          <Button variant="primary" className='w-100 mt-2' onClick={handleEditItem}>Save Changes</Button>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Detail Item offcanvas */}
      <Offcanvas show={showDetailModal} onHide={() => setShowDetailModal(false)} placement='end' className='admin-canvas-detail-items'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Item Detail</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {viewItem && (
            <table>
              <tr>
                <td><b>{viewItem.name}</b></td>
              </tr>
              <tr>
                <td>Harga</td>
                <td>:</td>
                <td>Rp.{formatRupiah(parseInt(viewItem.price))}</td>
              </tr>
              <tr>
                <td>Harga Diskon</td>
                <td>:</td>
                <td>Rp.{formatRupiah(parseInt(viewItem.discount))}</td>
              </tr>
              <tr>
                <td>Deskripsi</td>
                <td>:</td>
                <td>{viewItem.description}</td>
              </tr>
              <tr>
                <td>TikTok Link</td>
                <td>:</td>
                <td><a href={viewItem.tiktokLink} target="_blank" rel="noopener noreferrer">{viewItem.tiktokLink}</a></td>
              </tr>
              <tr>
                <td>Shopee Link</td>
                <td>:</td>
                <td><a href={viewItem.shopeeLink} target="_blank" rel="noopener noreferrer">{viewItem.shopeeLink}</a></td>
              </tr>
              <tr>
                <td>kategori</td>
                <td>:</td>
                <td>{categories.find(cat => cat.id === viewItem.category)?.name || 'N/A'}</td>
              </tr>
              <tr>
                <td>Brand</td>
                <td>:</td>
                <td>{brands.find(brand => brand.id === viewItem.brand)?.name || 'N/A'}</td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>:</td>
                <td>{viewItem.gender || 'N/A'}</td>
              </tr>
              <tr>
                <td>Dibuat pada</td>
                <td>:</td>
                <td>{new Date(viewItem.createdAt).toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className="image-previews w-100 d-flex flex-wrap align-items-start">
                    {viewItem.images && viewItem.images.map((img, index) => (
                      <img key={index} src={img} alt={`Item ${index}`} className="img-thumbnail" style={{width:'24%', height:'auto', marginRight:'1%'}}/>
                    ))}
                  </div>
                </td>
              </tr>
            </table>
          )}
        </Offcanvas.Body>
      </Offcanvas>

    </div>
  );
};

export default ManageItems;

