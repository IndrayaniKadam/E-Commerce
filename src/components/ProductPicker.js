import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ProductManagment.css';  // Custom CSS file for styling

const ProductPicker = ({ onSelectProduct, onClose }) => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch products based on search and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      if (search.trim() === '') return;
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('https://stageapi.monkcommerce.app/task/products/search', {
          headers: {
            'x-api-key': '72njgfa948d9aS7gs5',
          },
          params: {
            search,
            page,
            limit: 10,
          },
        });

        const fetchedProducts = response.data || [];
        setProducts(prevProducts => {
          const productIds = prevProducts.map(product => product.id);
          const newProducts = fetchedProducts.filter(product => !productIds.includes(product.id));
          return [...prevProducts, ...newProducts];
        });

        setHasMore(fetchedProducts.length > 0);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, page]);

  // Handle product search
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setProducts([]);
    setPage(1);
  };

  // Load more products for pagination
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Handle variant selection
  const handleVariantSelect = (variantId) => {
    setSelectedVariants(prevSelected =>
      prevSelected.includes(variantId)
        ? prevSelected.filter(id => id !== variantId)
        : [...prevSelected, variantId]
    );
  };

  const isVariantSelected = (variantId) => selectedVariants.includes(variantId);

  // Handle product click to select a product
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedVariants([]);  // Reset variants for the selected product
  };

  // Add the selected product and its variants
  const handleAddProduct = () => {
    if (selectedProduct && selectedVariants.length > 0) {
      const selectedProductData = {
        ...selectedProduct,
        variants: selectedVariants.map(variantId => selectedProduct.variants.find(variant => variant.id === variantId)),
      };

      // Pass the selected product and variants back to parent component
      onSelectProduct(selectedProduct, selectedProductData.variants);

      // Clear selection after adding
      setSelectedProduct(null);
      setSelectedVariants([]);
      setSearch('');  // Reset search
    }
  };

  return (
    <div className="product-picker">
      <input
        type="text"
        placeholder="Search for a product"
        value={search}
        onChange={handleSearchChange}
        className="product-search-input"
      />

      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      <ul className="product-list">
        {products && products.length > 0 ? (
          products.map((product) => (
            <li key={product.id}>
              <div onClick={() => handleProductClick(product)}>
                <img src={product.image?.src} alt={product.title} width={50} />
                <span>{product.title}</span>
              </div>

              {selectedProduct && selectedProduct.id === product.id && product.variants && product.variants.length > 0 && (
                <ul className="variant-list">
                  {product.variants.map(variant => (
                    <li key={variant.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={isVariantSelected(variant.id)}
                          onChange={() => handleVariantSelect(variant.id)}
                        />
                        {variant.title} - ${variant.price}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))
        ) : (
          !loading && <p>No products found</p>
        )}
      </ul>

      {hasMore && !loading && (
        <button onClick={handleLoadMore} className="load-more-btn">
          Load More
        </button>
      )}

      <div className="product-picker-actions">
        <button onClick={handleAddProduct} disabled={!selectedProduct || selectedVariants.length === 0}>
          Add Product
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ProductPicker;
