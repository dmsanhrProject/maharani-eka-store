import React, { useState, useEffect } from 'react';
import { ref, set, remove, update, onValue, push } from 'firebase/database';
import { Button, Table, Form } from 'react-bootstrap';
import { db } from '../../utils/firebaseConfig';

const ManageBrands = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState('');
  const [editBrand, setEditBrand] = useState(null);

  useEffect(() => {
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

  const handleAddBrand = async () => {
    if (!newBrand.trim()) return;

    const brandsRef = ref(db, 'brands');
    const newBrandRef = push(brandsRef);
    await set(newBrandRef, { name: newBrand });

    setNewBrand('');
  };

  const handleEditBrand = async () => {
    if (!editBrand || !editBrand.name.trim()) return;

    if (window.confirm('Are you sure you want to save changes to this brand?')) {
      await update(ref(db, `brands/${editBrand.id}`), { name: editBrand.name });

      setEditBrand(null);
    }
  };

  const handleDeleteBrand = async (id) => {
    if (window.confirm('Konfirmasi hapusan brand')) {
      await remove(ref(db, `brands/${id}`));
    }
  };

  return (
    <div className="container mt-4">
      <h1>Manage Brands</h1>

      <Form>
        <Form.Group controlId="formNewBrand">
          <Form.Label>New Brand</Form.Label>
          <Form.Control
            type="text"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            placeholder="Enter brand name"
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddBrand} className="mt-2">Add Brand</Button>
      </Form>

      {editBrand && (
        <Form className="mt-4">
          <Form.Group controlId="formEditBrand">
            <Form.Label>Edit Brand</Form.Label>
            <Form.Control
              type="text"
              value={editBrand.name}
              onChange={(e) => setEditBrand(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter brand name"
            />
          </Form.Group>
          <Button variant="primary" onClick={handleEditBrand} className="mt-2">Save Changes</Button>
        </Form>
      )}

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {brands.map(brand => (
            <tr key={brand.id}>
              <td>{brand.name}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => setEditBrand(brand)}>Edit</Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDeleteBrand(brand.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageBrands;
