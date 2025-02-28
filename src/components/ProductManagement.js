import React, { useState } from 'react';
import ProductPicker from './ProductPicker';
import './styles/ProductManagment.css';  // Custom CSS file for styling

const ProductManagement = () => {
  const [products, setProducts] = useState([]);  // To keep track of added products
  const [showProductPicker, setShowProductPicker] = useState(false);  // To toggle the product picker modal
  const [selectedIndex, setSelectedIndex] = useState(null);  // To track which product row is being edited

  // Add a new product row
  const handleAddProduct = () => {
    setProducts([...products, { id: products.length + 1, name: '', discount: '', variants: [] }]);
  };

  // Handle discount changes for the selected product
  const handleDiscountChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index].discount = value;
    setProducts(updatedProducts);
  };

  // Handle product selection from the ProductPicker
  const handleProductSelect = (product, selectedVariants) => {
    const updatedProducts = [...products];
    updatedProducts[selectedIndex].name = product.title;  // Set the selected product's title
    updatedProducts[selectedIndex].variants = selectedVariants;  // Add selected variants
    setProducts(updatedProducts);
    setShowProductPicker(false);  // Close the product picker modal
  };

  // Open the product picker for the selected row
  const openProductPicker = (index) => {
    setSelectedIndex(index);  // Track the index of the product being edited
    setShowProductPicker(true);  // Open the product picker modal
  };

  // Handle removing a product row
  const handleRemoveProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <div className="product-management">
      <h2>Product Management</h2>

      {/* Table header for product list */}
      <div className="product-header">
        <span>Product</span>
        <span>Discount</span>
        
      </div>

      {/* Iterate over products and display each row */}
      {products.map((product, index) => (
        <div key={product.id} className="product-row">
          <span>{index + 1}. </span>

          {/* Input for the product name (read-only) */}
          <input
            type="text"
            placeholder="Select Product"
            className="product-input"
            value={product.name}
            readOnly
            onClick={() => openProductPicker(index)}  // Open product picker on click
          />

          {/* Input for discount */}
          <input
            type="text"
            placeholder="Enter Discount"
            className="discount-input"
            value={product.discount}
            onChange={(e) => handleDiscountChange(index, e.target.value)}  // Update discount input
          />

          {/* Display selected variants */}
          <div className="variants-list">
            {product.variants?.length > 0 ? (  // Use optional chaining to safely access length
              product.variants.map((variant, idx) => (
                <div key={idx} className="variant-item">
                  {variant.title} (SKU: {variant.sku})
                </div>
              ))
            ) : (
              <span>No Variants</span>
            )}
          </div>

          {/* Button to remove the product row */}
          <button
            className="remove-product-btn"
            onClick={() => handleRemoveProduct(index)}
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add product button */}
      <button onClick={handleAddProduct} className="add-product-btn">
        Add Product
      </button>

      {/* Show Product Picker Modal */}
      {showProductPicker && (
        <ProductPicker
          onSelectProduct={handleProductSelect}
          onClose={() => setShowProductPicker(false)}  // Close modal on cancel
        />
      )}
    </div>
  );
};

export default ProductManagement;
