import React, { useEffect, useState } from 'react';
import { db } from '../../utils/firebaseConfig';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { Button, Offcanvas, Form, Container, Table, Spinner } from 'react-bootstrap';
import axios from 'axios'; // For HTTP requests to Cloudinary

const ManageSouvenir = () => {
  const [souvenirs, setSouvenirs] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [currentSouvenir, setCurrentSouvenir] = useState({ name: '', description: '', image: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setLoading] = useState(false);

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

  const handleShow = (souvenir = null) => {
    if (souvenir) {
      setCurrentSouvenir(souvenir);
      setIsEdit(true);
    } else {
      setCurrentSouvenir({ name: '', description: '', image: '' });
      setIsEdit(false);
    }
    setShowOffcanvas(true);
  };

  const handleClose = () => setShowOffcanvas(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (currentSouvenir.image instanceof File) {
  //     currentSouvenir.image = await uploadImageToCloudinary(currentSouvenir.image);
  //   }

  //   if (isEdit) {
  //     const updates = {};
  //     updates[`/souvenirs/${currentSouvenir.id}`] = currentSouvenir;
  //     await update(ref(db), updates);
  //   } else {
  //     await push(ref(db, 'souvenirs/'), currentSouvenir);
  //   }
  //   handleClose();
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentSouvenir.image instanceof File) {
        currentSouvenir.image = await uploadImageToCloudinary(currentSouvenir.image);
      }

      if (isEdit) {
        const updates = {};
        updates[`/souvenirs/${currentSouvenir.id}`] = currentSouvenir;
        await update(ref(db), updates);
      } else {
        await push(ref(db, 'souvenirs/'), currentSouvenir);
      }
    } catch (error) {
      alert('Error occurred:', error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin menghapus suvenir ini?");
    
    if (confirmDelete) {
      await remove(ref(db, `/souvenirs/${id}`));
    }
  };

  return (
    <Container>
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
      <h1 className="my-4">Admin Suvenir</h1>
      <Button variant="primary" onClick={() => handleShow()}>
        Tambah Suvenir
      </Button>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Gambar</th>
            <th>Nama</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {souvenirs.map(souvenir => (
            <tr key={souvenir.id}>
              <td><img src={souvenir.image} alt={souvenir.name} style={{ width: '100px' }} /></td>
              <td>{souvenir.name}</td>
              <td>{souvenir.description}</td>
              <td>
                <Button variant="warning" onClick={() => handleShow(souvenir)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(souvenir.id)}>Hapus</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end" style={{zIndex:"1041"}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? 'Edit' : 'Tambah'} Suvenir</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Suvenir</Form.Label>
              <Form.Control
                type="text"
                value={currentSouvenir.name}
                onChange={(e) => setCurrentSouvenir({ ...currentSouvenir, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentSouvenir.description}
                onChange={(e) => setCurrentSouvenir({ ...currentSouvenir, description: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gambar</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setCurrentSouvenir({ ...currentSouvenir, image: e.target.files[0] })}
                required={!isEdit}
              />
              {isEdit && <img src={currentSouvenir.image} alt={currentSouvenir.name} style={{ width: '100%', marginTop: '10px' }} />}
            </Form.Group>

            <Button variant="primary" type="submit">
              {isEdit ? 'Simpan Perubahan' : 'Tambahkan'}
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default ManageSouvenir;
