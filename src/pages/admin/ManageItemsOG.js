import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, remove, onValue, update, push } from 'firebase/database';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import app, { db } from '../../utils/firebaseConfig';

const ManageItems = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    tokpedLink: '',
    shopeeLink: '',
    category: '',
    subcategory: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);

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
    fetchItems();
  }, [db]);

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;

    const itemsRef = ref(db, 'items');
    const newItemRef = push(itemsRef);
    await set(newItemRef, newItem);
    setNewItem({
      name: '',
      price: '',
      description: '',
      tokpedLink: '',
      shopeeLink: '',
      category: '',
      subcategory: '',
      images: []
    });
    setImagePreviews([]);
    setShowAddModal(false);
  };

  const handleEditItem = async () => {
    if (!editItem || !editItem.id) return;

    await update(ref(db, `items/${editItem.id}`), editItem);
    setShowEditModal(false);
    setEditItem(null);
  };

  const handleDeleteItem = async (id) => {
    await remove(ref(db, `items/${id}`));
  };

  const handleShowDetail = (item) => {
    setViewItem(item);
    setShowDetailModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewItem(prev => ({
      ...prev,
      images: files.map(file => URL.createObjectURL(file))
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

  const handleSelectCategory = (categoryId) => {
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    setSubCategories(selectedCategory?.subcategories ? Object.keys(selectedCategory.subcategories).map(subId => ({
      id: subId,
      ...selectedCategory.subcategories[subId]
    })) : []);
  };

  return (
    <div className="container mt-4">
      <h1>Manage Items</h1>

      <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Item</Button>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Link</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{categories.find(cat => cat.id === item.category)?.name || 'N/A'}</td>
              <td>{subCategories.find(sub => sub.id === item.subcategory)?.name || 'N/A'}</td>
              <td>
                <a href={item.tokpedLink} target="_blank" rel="noopener noreferrer">Tokopedia</a> | 
                <a href={item.shopeeLink} target="_blank" rel="noopener noreferrer">Shopee</a>
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

      {/* Add Item Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formItemName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
              />
            </Form.Group>
            <Form.Group controlId="formItemPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Enter item price"
              />
            </Form.Group>
            <Form.Group controlId="formItemDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter item description"
              />
            </Form.Group>
            <Form.Group controlId="formItemTokpedLink">
              <Form.Label>Tokopedia Link</Form.Label>
              <Form.Control
                type="text"
                value={newItem.tokpedLink}
                onChange={(e) => setNewItem(prev => ({ ...prev, tokpedLink: e.target.value }))}
                placeholder="Enter Tokopedia link"
              />
            </Form.Group>
            <Form.Group controlId="formItemShopeeLink">
              <Form.Label>Shopee Link</Form.Label>
              <Form.Control
                type="text"
                value={newItem.shopeeLink}
                onChange={(e) => setNewItem(prev => ({ ...prev, shopeeLink: e.target.value }))}
                placeholder="Enter Shopee link"
              />
            </Form.Group>
            <Form.Group controlId="formItemCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={newItem.category}
                onChange={(e) => {
                  setNewItem(prev => ({ ...prev, category: e.target.value }));
                  handleSelectCategory(e.target.value);
                }}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemSubcategory">
              <Form.Label>Subcategory</Form.Label>
              <Form.Control
                as="select"
                value={newItem.subcategory}
                onChange={(e) => setNewItem(prev => ({ ...prev, subcategory: e.target.value }))}
              >
                <option value="">Select Subcategory</option>
                {subCategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemImages">
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleImageChange}
              />
              <div className="mt-2">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="d-inline-block me-2">
                    <img src={img} alt={`preview-${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    <Button variant="danger" size="sm" onClick={() => handleRemoveImage(index)} className="mt-2">Remove</Button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddItem}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Item Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editItem && (
            <Form>
              <Form.Group controlId="formEditItemName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editItem.name}
                  onChange={(e) => setEditItem(prev => ({ ...prev, name: e.target.value }))}
                />
              </Form.Group>
              <Form.Group controlId="formEditItemPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={editItem.price}
                  onChange={(e) => setEditItem(prev => ({ ...prev, price: e.target.value }))}
                />
              </Form.Group>
              <Form.Group controlId="formEditItemDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  value={editItem.description}
                  onChange={(e) => setEditItem(prev => ({ ...prev, description: e.target.value }))}
                />
              </Form.Group>
              <Form.Group controlId="formEditItemTokpedLink">
                <Form.Label>Tokopedia Link</Form.Label>
                <Form.Control
                  type="text"
                  value={editItem.tokpedLink}
                  onChange={(e) => setEditItem(prev => ({ ...prev, tokpedLink: e.target.value }))}
                />
              </Form.Group>
              <Form.Group controlId="formEditItemShopeeLink">
                <Form.Label>Shopee Link</Form.Label>
                <Form.Control
                  type="text"
                  value={editItem.shopeeLink}
                  onChange={(e) => setEditItem(prev => ({ ...prev, shopeeLink: e.target.value }))}
                />
              </Form.Group>
              <Form.Group controlId="formEditItemCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={editItem.category}
                  onChange={(e) => {
                    setEditItem(prev => ({ ...prev, category: e.target.value }));
                    handleSelectCategory(e.target.value);
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formEditItemSubcategory">
                <Form.Label>Subcategory</Form.Label>
                <Form.Control
                  as="select"
                  value={editItem.subcategory}
                  onChange={(e) => setEditItem(prev => ({ ...prev, subcategory: e.target.value }))}
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formEditItemImages">
                <Form.Label>Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <div className="mt-2">
                  {editItem.images && editItem.images.map((img, index) => (
                    <div key={index} className="d-inline-block me-2">
                      <img src={img} alt={`preview-${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                      <Button variant="danger" size="sm" onClick={() => handleRemoveImage(index)} className="mt-2">Remove</Button>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditItem}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Detail Item Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewItem && (
            <div>
              <h5>Name: {viewItem.name}</h5>
              <p>Price: {viewItem.price}</p>
              <p>Description: {viewItem.description}</p>
              <p>Tokopedia Link: <a href={viewItem.tokpedLink} target="_blank" rel="noopener noreferrer">{viewItem.tokpedLink}</a></p>
              <p>Shopee Link: <a href={viewItem.shopeeLink} target="_blank" rel="noopener noreferrer">{viewItem.shopeeLink}</a></p>
              <p>Category: {categories.find(c => c.id === viewItem.category)?.name || 'N/A'}</p>
              <p>Subcategory: {subCategories.find(sc => sc.id === viewItem.subcategory)?.name || 'N/A'}</p>
              <div>
                <h6>Images</h6>
                {viewItem.images && viewItem.images.map((img, index) => (
                  <div key={index} className="d-inline-block me-2">
                    <img src={img} alt={`detail-${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageItems;
