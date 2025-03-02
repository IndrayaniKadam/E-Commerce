import React, { useState } from 'react';
import ProductPicker from './ProductPicker';
import './styles/ProductManagment.css';  // Custom CSS file for styling

const ProductManagement = () => {
  const [products, setProducts] = useState([]);  // To keep track of added products
  const [showProductPicker, setShowProductPicker] = useState(false);  // To toggle the product picker modal
  const [selectedIndex, setSelectedIndex] = useState(null);  // To track which product row is being edited

  // Add a new product row
  const handleAddProduct = () => {
    setProducts([...products, { 
      id: products.length + 1, 
      name: '', 
      discount: '', 
      discountType: '% off', 
      variants: [], 
      showVariants: false  // New property to toggle variants visibility
    }]);
  };

  // Handle discount changes for the selected product
  const handleDiscountChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index].discount = value;
    setProducts(updatedProducts);
  };

  // Handle discount type changes for the selected product
  const handleDiscountTypeChange = (index, type) => {
    const updatedProducts = [...products];
    updatedProducts[index].discountType = type;
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

  // Handle removing a variant from a product
  const handleRemoveVariant = (productIndex, variantIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].variants = updatedProducts[productIndex].variants.filter((_, i) => i !== variantIndex);
    setProducts(updatedProducts);
  };

  // Toggle the visibility of variants
  const toggleVariantsVisibility = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].showVariants = !updatedProducts[index].showVariants;
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

          {/* Input for discount value */}
          <input
            type="text"
            placeholder="Discount Value"
            className="discount-input"
            value={product.discount}
            onChange={(e) => handleDiscountChange(index, e.target.value)}  // Update discount input
          />

          {/* Dropdown for discount type */}
          <div className="discount-container">
            <select
              value={product.discountType}
              onChange={(e) => handleDiscountTypeChange(index, e.target.value)}
              className="discount-type-dropdown"
            >
              <option value="% off">% off</option>
              <option value="flat">Flat</option>
            </select>
          </div>

          <button
            className="remove-product-btn"
            onClick={() => handleRemoveProduct(index)}
          >
            X
          </button>

          {/* Button to toggle variants visibility */}
          <button
            className="variant-toggle-btn"
            onClick={() => toggleVariantsVisibility(index)}
          >
            {product.showVariants ? 'Hide Variants' : 'Show Variants'}
          </button>

          {/* Display selected variants conditionally */}
          {product.showVariants && (
            <div className="variants-container">
              {product.variants?.length > 0 ? (  // Use optional chaining to safely access length
                product.variants.map((variant, variantIndex) => (
                  <div key={variantIndex} className="variant-box">
                    <div className="variant-item">
                      <span>{product.name} {variant.title}</span>
                    </div>

                    {/* Input for variant discount */}
                    <input
                      type="text"
                      placeholder="Add Discount"
                      className="variant-discount-input"
                      value={variant.discount || ''}
                      onChange={(e) => {
                        const updatedProducts = [...products];
                        updatedProducts[index].variants[variantIndex].discount = e.target.value;
                        setProducts(updatedProducts);
                      }}
                    />

                    {/* Dropdown for variant discount type */}
                    <select
                      value={variant.discountType || '% off'}
                      onChange={(e) => {
                        const updatedProducts = [...products];
                        updatedProducts[index].variants[variantIndex].discountType = e.target.value;
                        setProducts(updatedProducts);
                      }}
                      className="discount-type-dropdown"
                    >
                      <option value="% off">% off</option>
                      <option value="flat">Flat</option>
                    </select>

                    {/* Remove Variant Button */}
                    <button
                      className="remove-variant-btn"
                      onClick={() => handleRemoveVariant(index, variantIndex)}
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <span>No Variants</span>
              )}
            </div>
          )}
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
