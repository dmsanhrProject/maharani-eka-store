import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, remove, update, push, onValue } from 'firebase/database';
import { Modal, Button, Table, Form, Offcanvas } from 'react-bootstrap';
import app, { db } from '../../utils/firebaseConfig';
import axios from 'axios'; // For HTTP requests to Cloudinary

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
    description: '',
    tiktokLink: '',
    shopeeLink: '',
    category: '',
    brand: '',
    gender: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);

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
    const url = 'https://api.cloudinary.com/v1_1/drhujpp7h/image/upload'; // Replace with your Cloudinary URL
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'cngs0yzd'); // Replace with your upload preset

    try {
      const response = await axios.post(url, formData);
      return response.data.secure_url; // URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;
  
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
      description: '',
      tiktokLink: '',
      shopeeLink: '',
      category: '',
      brand: '',
      gender: '',
      images: []
    });
    setImagePreviews([]);
    setShowAddModal(false);
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

  return (
    <div className="container mt-4 admin-page">
      <h1>Manage Product</h1>

      <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Product</Button>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Gender</th>
            <th>Link</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              {/* <td>{item.price}</td> */}
              <td>Rp.{formatRupiah(parseInt(item.price))}</td>
              <td>{categories.find(cat => cat.id === item.category)?.name || 'N/A'}</td>
              <td>{brands.find(brand => brand.id === item.brand)?.name || 'N/A'}</td>
              <td>{item.gender || 'N/A'}</td>
              <td>
                <a href={item.tiktokLink} target="_blank" rel="noopener noreferrer" className='btn btn-sm btn-dark mx-1'>TikTok</a>
                <a href={item.shopeeLink} target="_blank" rel="noopener noreferrer" className='btn btn-sm btn-warning mx-1 text-white' style={{backgroundColor:'#ff8100'}}>Shopee</a>
              </td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleShowDetail(item)}>Detail</Button>
                <Button variant="warning" size="sm" className="ms-2" onClick={() => startEditItem(item)}>Edit</Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDeleteItem(item.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Product Modal */}
      <Offcanvas show={showAddModal} onHide={() => setShowAddModal(false)} placement='end' className='admin-canvas-add-items'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Product</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group controlId="formItemName">
              <Form.Label>Name</Form.Label>
              <Form.Control size="sm"
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
              />
            </Form.Group>
            <Form.Group controlId="formItemPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control size="sm"
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Enter item price"
              />
            </Form.Group>
            <Form.Group controlId="formItemDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control size="sm"
                as="textarea"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter item description"
              />
            </Form.Group>
            <Form.Group controlId="formItemTiktokLink">
              <Form.Label>TikTok Link</Form.Label>
              <Form.Control size="sm"
                type="text"
                value={newItem.tiktokLink}
                onChange={(e) => setNewItem(prev => ({ ...prev, tiktokLink: e.target.value }))}
                placeholder="Enter TikTok link"
              />
            </Form.Group>
            <Form.Group controlId="formItemShopeeLink">
              <Form.Label>Shopee Link</Form.Label>
              <Form.Control size="sm"
                type="text"
                value={newItem.shopeeLink}
                onChange={(e) => setNewItem(prev => ({ ...prev, shopeeLink: e.target.value }))}
                placeholder="Enter Shopee link"
              />
            </Form.Group>
            <Form.Group controlId="formItemCategory">
              <Form.Label>Category</Form.Label>
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
              <Form.Label>Brand</Form.Label>
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
              <Form.Label>Gender</Form.Label>
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
              <Form.Label>Images</Form.Label>
              <Form.Control size="sm"
                type="file"
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
              <Form.Label>Name</Form.Label>
              <Form.Control size="sm"
                type="text"
                value={editItem?.name || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
              />
            </Form.Group>
            <Form.Group controlId="formItemPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control size="sm"
                type="number"
                value={editItem?.price || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Enter item price"
              />
            </Form.Group>
            <Form.Group controlId="formItemDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control size="sm"
                as="textarea"
                value={editItem?.description || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter item description"
              />
            </Form.Group>
            <Form.Group controlId="formItemTiktokLink">
              <Form.Label>TikTok Link</Form.Label>
              <Form.Control size="sm"
                type="text"
                value={editItem?.tiktokLink || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, tiktokLink: e.target.value }))}
                placeholder="Enter TikTok link"
              />
            </Form.Group>
            <Form.Group controlId="formItemShopeeLink">
              <Form.Label>Shopee Link</Form.Label>
              <Form.Control size="sm"
                type="text"
                value={editItem?.shopeeLink || ''}
                onChange={(e) => setEditItem(prev => ({ ...prev, shopeeLink: e.target.value }))}
                placeholder="Enter Shopee link"
              />
            </Form.Group>
            <Form.Group controlId="formItemCategory">
              <Form.Label>Category</Form.Label>
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
              <Form.Label>Brand</Form.Label>
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
              <Form.Label>Gender</Form.Label>
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
              <Form.Label>Images</Form.Label>
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
                <td>Description</td>
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
                <td>Category</td>
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
                <td>Created At</td>
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
