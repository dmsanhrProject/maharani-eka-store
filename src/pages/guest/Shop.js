import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../utils/firebaseConfig';
import ItemCard from '../../components/ItemCard';
import { Form, Row, Col, InputGroup, FormControl, Button, ButtonGroup, Accordion, Offcanvas, Dropdown, DropdownButton } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const Shop = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    genders: [],
    brands: [],
    categories: []
  });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest'); // Default sorting: newest
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [dropdownTitle, setDropdownTitle] = useState('Terbaru');
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const location = useLocation();

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
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery.toLowerCase());
    } else {
      setSearch('');
    }
  }, [location.search]);

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev };
      if (checked) {
        newFilters[name].push(value);
      } else {
        newFilters[name] = newFilters[name].filter(item => item !== value);
      }
      return newFilters;
    });
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleSortChanges = (value, title) => {
    setSort(value);
    setDropdownTitle(title);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyPriceFilter = () => {
    const { min, max } = priceFilter;
    setPriceRange({
      min: min === '' ? 0 : parseFloat(min),
      max: max === '' ? Infinity : parseFloat(max)
    });
  };

  const applyFilterAndClose = () => {
    applyPriceFilter();
    handleClose();    
  };

  const filteredItems = items.filter(item => {
    const genderMatch = filters.genders.length === 0 || filters.genders.includes(item.gender);
    const brandMatch = filters.brands.length === 0 || filters.brands.includes(item.brand);
    const categoryMatch = filters.categories.length === 0 || filters.categories.includes(item.category);
    const searchMatch = item.name.toLowerCase().includes(search);
    const priceMatch = item.price >= priceRange.min && item.price <= priceRange.max;
    return genderMatch && brandMatch && categoryMatch && searchMatch && priceMatch;
  });

  // Create a map from brandId to brandName for efficient lookups
  const brandMap = brands.reduce((acc, brand) => {
    acc[brand.id] = brand.name;
    return acc;
  }, {});

  const sortedItems = filteredItems.sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt); // Assuming createdAt exists
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt); // Assuming createdAt exists
      case 'brand-az':
        return brandMap[a.brand].localeCompare(brandMap[b.brand]);
      case 'brand-za':
        return brandMap[b.brand].localeCompare(brandMap[a.brand]);
      default:
        return 0;
    }
  });

  return (
    <div className="container shop-page mt-md-4 mt-0">
      <Row>
        <Col md={3} className='d-md-block d-none'>
          <h4 className='border-bottom m-0 py-4'>Filter</h4>
          <Form className='filter-element'>
            <Accordion defaultActiveKey={['0']} alwaysOpen>
              <Accordion.Item eventKey="0" className='rounded-0 accordion-item-filter'>
                <Accordion.Header className='py-3'>Gender</Accordion.Header>
                <Accordion.Body>
                  <Form.Check 
                    type="checkbox" 
                    label="Pria" 
                    name="genders" 
                    value="Pria" 
                    onChange={handleFilterChange} 
                  />
                  <Form.Check 
                    type="checkbox" 
                    label="Wanita" 
                    name="genders" 
                    value="Wanita" 
                    onChange={handleFilterChange} 
                  />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1" className='rounded-0 accordion-item-filter'>
                <Accordion.Header className='py-3'>Kategori</Accordion.Header>
                <Accordion.Body>
                  {categories.map(category => (
                    <Form.Check 
                      key={category.id} 
                      type="checkbox" 
                      label={category.name} 
                      name="categories" 
                      value={category.id} 
                      onChange={handleFilterChange} 
                    />
                  ))}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2" className='rounded-0 accordion-item-filter'>
                <Accordion.Header className='py-3'>Brand</Accordion.Header>
                <Accordion.Body>
                  {brands.map(brand => (
                    <Form.Check 
                      key={brand.id} 
                      type="checkbox" 
                      label={brand.name} 
                      name="brands" 
                      value={brand.id} 
                      onChange={handleFilterChange} 
                    />
                  ))}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3" className='rounded-0 accordion-item-filter'>
                <Accordion.Header className='py-3'>Harga</Accordion.Header>
                <Accordion.Body>
                  <InputGroup className="mb-1">
                    <FormControl
                      type="number"
                      placeholder="Min"
                      name="min"
                      value={priceFilter.min}
                      onChange={handlePriceChange}
                    />
                    <FormControl
                      type="number"
                      placeholder="Max"
                      name="max"
                      value={priceFilter.max}
                      onChange={handlePriceChange}
                    />
                  </InputGroup>
                  <Button className='w-100 btn-sm btn-red' onClick={applyPriceFilter}>Terapkan</Button>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Form>
        </Col>
        <Col md={9}>
          <Row>
            <Col className='d-md-none d-block my-3'>
              <div className="filter-mobile btn-group btn-group-sm w-100" role="group" aria-label="Basic example">
                <button className="btn btn-outline-red text-red rounded-start" style={{width:"50%"}} onClick={handleShow}>Filter</button>
                <DropdownButton
                  as={ButtonGroup}
                  className="dropdown-sort btn btn-outline-red text-red shadow-none py-0 rounded-end"
                  style={{width:"50%"}}
                  title={dropdownTitle}
                  align="end"
                  size="sm"
                >
                  <Dropdown.Item onClick={() => handleSortChanges('newest', 'Terbaru')}>Terbaru</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChanges('oldest', 'Terlama')}>Terlama</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChanges('price-asc', 'Termurah')}>Termurah</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChanges('price-desc', 'Termahal')}>Termahal</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChanges('brand-az', 'Brand A-Z')}>Brand A-Z</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChanges('brand-za', 'Brand Z-A')}>Brand Z-A</Dropdown.Item>
                </DropdownButton>
              </div>
            </Col>
            <Col sm={4} className='ms-auto d-md-block d-none'>
              <div className='d-flex justify-content-between align-items-center py-4' style={{width:'100%'}}>
                <h5 className="mb-0 me-2">Urutkan</h5>
                <Form.Control as="select" className='shadow-none' value={sort} onChange={handleSortChange}>
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="price-asc">Termurah</option>
                  <option value="price-desc">Termahal</option>
                  <option value="brand-az">Brand A-Z</option>
                  <option value="brand-za">Brand Z-A</option>
                </Form.Control>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className='col-12 d-block d-md-none'>
              <h4 className='pb-2 ps-2 pe-5 mb-4 border-bottom' style={{width:'fit-content'}}>Produk</h4>
            </Col>
            {sortedItems.map(item => (
              <Col key={item.id} md={3} className="mb-4 item-card col-6">
                <ItemCard item={item} brandName={brandMap[item.brand]} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Offcanvas show={show} onHide={handleClose} placement='end' style={{width:'100vw'}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='pb-5 pt-0'>
          <Form className='filter-element'>
              <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0" className='rounded-0 accordion-item-filter'>
                  <Accordion.Header className='py-3'>Gender</Accordion.Header>
                  <Accordion.Body>
                    <Form.Check 
                      type="checkbox" 
                      label="Pria" 
                      name="genders" 
                      value="Pria" 
                      checked={filters.genders.includes("Pria")}
                      onChange={handleFilterChange} 
                    />
                    <Form.Check 
                      type="checkbox" 
                      label="Wanita" 
                      name="genders" 
                      value="Wanita" 
                      checked={filters.genders.includes("Wanita")}
                      onChange={handleFilterChange} 
                    />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" className='rounded-0 accordion-item-filter'>
                  <Accordion.Header className='py-3'>Kategori</Accordion.Header>
                  <Accordion.Body>
                    {categories.map(category => (
                      <Form.Check 
                        key={category.id} 
                        type="checkbox" 
                        label={category.name} 
                        name="categories" 
                        value={category.id} 
                        checked={filters.categories.includes(category.id)}
                        onChange={handleFilterChange} 
                      />
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" className='rounded-0 accordion-item-filter'>
                  <Accordion.Header className='py-3'>Brand</Accordion.Header>
                  <Accordion.Body>
                    {brands.map(brand => (
                      <Form.Check 
                        key={brand.id} 
                        type="checkbox" 
                        label={brand.name} 
                        name="brands" 
                        value={brand.id} 
                        checked={filters.brands.includes(brand.id)}
                        onChange={handleFilterChange} 
                      />
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3" className='rounded-0 accordion-item-filter'>
                  <Accordion.Header className='py-3'>Harga</Accordion.Header>
                  <Accordion.Body>
                    <InputGroup className="mb-1">
                      <FormControl
                        type="number"
                        placeholder="Min"
                        name="min"
                        value={priceFilter.min}
                        onChange={handlePriceChange}
                      />
                      <FormControl
                        type="number"
                        placeholder="Max"
                        name="max"
                        value={priceFilter.max}
                        onChange={handlePriceChange}
                      />
                    </InputGroup>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
          </Form>
        </Offcanvas.Body>
        <div className='p-3 bg-white position-absolute' style={{bottom:'0',width:'100vw'}}>
          <Button className='w-100 btn-sm btn-red' onClick={applyFilterAndClose}>Terapkan</Button>
        </div>
      </Offcanvas>
    </div>
  );
};

export default Shop;