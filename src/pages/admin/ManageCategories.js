import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, remove, update, onValue, push } from 'firebase/database';
import { Button, Table, Form } from 'react-bootstrap';
import { db } from '../../utils/firebaseConfig';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState(null);

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

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    if (window.confirm('Are you sure you want to add this category?')) {
      const categoriesRef = ref(db, 'categories');
      const newCategoryRef = push(categoriesRef);
      await set(newCategoryRef, { name: newCategory });

      setNewCategory('');
    }
  };

  const handleEditCategory = async () => {
    if (!editCategory || !editCategory.name.trim()) return;

    if (window.confirm('Are you sure you want to save changes to this category?')) {
      await update(ref(db, `categories/${editCategory.id}`), { name: editCategory.name });

      setEditCategory(null);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Konfirmasi hapusan kategori')) {
      await remove(ref(db, `categories/${id}`));
    }
  };

  return (
    <div className="container mt-4">
      <h1>Manage Categories</h1>

      <Form>
        <Form.Group controlId="formNewCategory">
          <Form.Label>New Category</Form.Label>
          <Form.Control
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddCategory} className="mt-2">Add Category</Button>
      </Form>

      {editCategory && (
        <Form className="mt-4">
          <Form.Group controlId="formEditCategory">
            <Form.Label>Edit Category</Form.Label>
            <Form.Control
              type="text"
              value={editCategory.name}
              onChange={(e) => setEditCategory(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter category name"
            />
          </Form.Group>
          <Button variant="primary" onClick={handleEditCategory} className="mt-2">Save Changes</Button>
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
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => setEditCategory(category)}>Edit</Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDeleteCategory(category.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageCategories;
