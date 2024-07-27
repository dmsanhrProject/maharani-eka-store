// src/pages/admin/ManageItems.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app, { db, storage } from '../../utils/firebaseConfig';

const ManageItems = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    link_tokped: '',
    link_shopee: '',
    category: '',
    sub_category: '',
    images: [],
  });

  const [editItemId, setEditItemId] = useState(null);
  const [editItem, setEditItem] = useState({ ...newItem });
  const [newImages, setNewImages] = useState([]);
  const [editImages, setEditImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'items'));
    const itemsData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setItems(itemsData);
  };

  const fetchCategories = async () => {
    const categorySnapshot = await getDocs(collection(db, 'categories'));
    const categoryData = categorySnapshot.docs.map((doc) => doc.data());
    setCategories(categoryData);

    // Fetch subcategories for the selected category
    if (categoryData.length > 0) {
      fetchSubCategories(categoryData[0].id); // Fetch subcategories for the first category by default
    }
  };

  const fetchSubCategories = async (categoryId) => {
    const subCategorySnapshot = await getDocs(collection(db, 'categories', categoryId, 'subcategories'));
    const subCategoryData = subCategorySnapshot.docs.map((doc) => doc.data());
    setSubCategories(subCategoryData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));

    // Fetch subcategories when category changes
    if (name === 'category') {
      fetchSubCategories(value);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({ ...prev, [name]: value }));

    // Fetch subcategories when category changes
    if (name === 'category') {
      fetchSubCategories(value);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    setEditImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setEditImagePreviews(previews);
  };

  const handleRemoveImagePreview = (index, isEdit = false) => {
    if (isEdit) {
      setEditImagePreviews(prev => prev.filter((_, i) => i !== index));
      setEditImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
      setNewImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadImages = async (images) => {
    const urls = await Promise.all(
      images.map((image) => {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            () => {},
            (error) => {
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      })
    );

    return urls;
  };

  const handleAddItem = async () => {
    const imageUrls = await uploadImages(newImages);
    await addDoc(collection(db, 'items'), { ...newItem, images: imageUrls });
    fetchItems();
    setNewItem({ name: '', price: '', description: '', link_tokped: '', link_shopee: '', category: '', sub_category: '', images: [] });
    setNewImages([]);
    setNewImagePreviews([]);
  };

  const handleUpdateItem = async (id) => {
    const imageUrls = editImages.length > 0 ? await uploadImages(editImages) : editItem.images;
    await updateDoc(doc(db, 'items', id), { ...editItem, images: imageUrls });
    fetchItems();
    setEditItemId(null);
    setEditImages([]);
    setEditImagePreviews([]);
  };

  const handleDeleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
    fetchItems();
  };

  const startEdit = (item) => {
    setEditItemId(item.id);
    setEditItem(item);
  };

  return (
    <div className="container">
      <h1>Manage Items</h1>
      <div className="mb-4">
        <h2>Add New Item</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" name="name" value={newItem.name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="text" className="form-control" name="price" value={newItem.price} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" name="description" value={newItem.description} onChange={handleChange}></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Link Tokopedia</label>
            <input type="text" className="form-control" name="link_tokped" value={newItem.link_tokped} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Link Shopee</label>
            <input type="text" className="form-control" name="link_shopee" value={newItem.link_shopee} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select className="form-select" name="category" value={newItem.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Sub Category</label>
            <select className="form-select" name="sub_category" value={newItem.sub_category} onChange={handleChange}>
              <option value="">Select Sub Category</option>
              {subCategories.map(subCategory => (
                <option key={subCategory.id} value={subCategory.id}>{subCategory.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Images</label>
            <input type="file" className="form-control" name="images" multiple onChange={handleImageChange} />
            <div className="mt-2">
              {newImagePreviews.map((preview, index) => (
                <div key={index} className="d-inline-block position-relative">
                  <img src={preview} alt={`preview-${index}`} style={{ width: '50px', marginRight: '10px' }} />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    style={{ margin: '5px' }}
                    onClick={() => handleRemoveImagePreview(index)}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleAddItem}>Add Item</button>
        </form>
      </div>
      <div>
        <h2>Items List</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Link Tokopedia</th>
              <th>Link Shopee</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {editItemId === item.id ? (
                  <>
                    <td><input type="text" className="form-control" name="name" value={editItem.name} onChange={handleEditChange} /></td>
                    <td><input type="text" className="form-control" name="price" value={editItem.price} onChange={handleEditChange} /></td>
                    <td><textarea className="form-control" name="description" value={editItem.description} onChange={handleEditChange}></textarea></td>
                    <td><input type="text" className="form-control" name="link_tokped" value={editItem.link_tokped} onChange={handleEditChange} /></td>
                    <td><input type="text" className="form-control" name="link_shopee" value={editItem.link_shopee} onChange={handleEditChange} /></td>
                    <td>
                      <select className="form-select" name="category" value={editItem.category} onChange={handleEditChange}>
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select className="form-select" name="sub_category" value={editItem.sub_category} onChange={handleEditChange}>
                        <option value="">Select Sub Category</option>
                        {subCategories.map(subCategory => (
                          <option key={subCategory.id} value={subCategory.id}>{subCategory.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input type="file" className="form-control" name="images" multiple onChange={handleEditImageChange} />
                      <div className="mt-2">
                        {editImagePreviews.map((preview, index) => (
                          <div key={index} className="d-inline-block position-relative">
                            <img src={preview} alt={`preview-${index}`} style={{ width: '50px', marginRight: '10px' }} />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0"
                              style={{ margin: '5px' }}
                              onClick={() => handleRemoveImagePreview(index, true)}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-success" onClick={() => handleUpdateItem(item.id)}>Save</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setEditItemId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.description}</td>
                    <td><a href={item.link_tokped} target="_blank" rel="noopener noreferrer">Tokopedia</a></td>
                    <td><a href={item.link_shopee} target="_blank" rel="noopener noreferrer">Shopee</a></td>
                    <td>{item.category}</td>
                    <td>{item.sub_category}</td>
                    <td>
                      {item.images.map((image, index) => (
                        <img key={index} src={image} alt={`item-${index}`} style={{ width: '50px', marginRight: '10px' }} />
                      ))}
                    </td>
                    <td>
                      <button type="button" className="btn btn-primary" onClick={() => startEdit(item)}>Edit</button>
                      <button type="button" className="btn btn-danger" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageItems;
