import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ProductManagment.css'; // Corrected typo

const ProductPicker = ({ onSelectProduct, onClose }) => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setProducts([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleVariantSelect = (variantId) => {
    setSelectedVariants(prevSelected =>
      prevSelected.includes(variantId)
        ? prevSelected.filter(id => id !== variantId)
        : [...prevSelected, variantId]
    );
  };

  const isVariantSelected = (variantId) => selectedVariants.includes(variantId);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedVariants([]);
  };

  const handleAddProduct = () => {
    if (selectedProduct && selectedVariants.length > 0) {
      const selectedProductData = {
        ...selectedProduct,
        variants: selectedVariants.map(variantId => selectedProduct.variants.find(variant => variant.id === variantId)),
      };

      onSelectProduct(selectedProduct, selectedProductData.variants);

      setSelectedProduct(null);
      setSelectedVariants([]);
      setSearch('');
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
              <div className={`product-item ${selectedProduct && selectedProduct.id === product.id ? 'selected' : ''}`} onClick={() => handleProductClick(product)}>
                <img src={product.image?.src} alt={product.title} className="product-image" />
                <span className="product-title">{product.title}</span>
              </div>

              {selectedProduct && selectedProduct.id === product.id && product.variants && product.variants.length > 0 && (
                <ul className="variant-list">
                  {product.variants.map(variant => (
                    <li key={variant.id} className="variant-item">
                      <label className="variant-label">
                        <input
                          type="checkbox"
                          checked={isVariantSelected(variant.id)}
                          onChange={() => handleVariantSelect(variant.id)}
                        />
                        <span className="variant-title">{variant.title}</span>
                        <span className="variant-price">${variant.price}</span>
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
        <button onClick={handleAddProduct} disabled={!selectedProduct || selectedVariants.length === 0} className="add-product-btn">
          Add Product
        </button>
        <button onClick={onClose} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default ProductPicker;
