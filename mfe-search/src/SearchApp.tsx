import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  category?: string;
  description?: string;
}

const allProducts: Product[] = [
  { id: 1, title: "Scooter", price: 299, category: "Vehicles", description: "Electric scooter with long battery life" },
  { id: 2, title: "Headphones", price: 199, category: "Electronics", description: "Wireless noise-canceling headphones" },
  { id: 3, title: "Laptop", price: 999, category: "Electronics", description: "High-performance laptop for work and gaming" },
  { id: 4, title: "Smartphone", price: 699, category: "Electronics", description: "Latest model with advanced camera" },
  { id: 5, title: "Bicycle", price: 399, category: "Vehicles", description: "Mountain bike with 21-speed gears" },
  { id: 6, title: "Camera", price: 549, category: "Electronics", description: "Professional DSLR camera" },
  { id: 7, title: "Watch", price: 249, category: "Accessories", description: "Smartwatch with fitness tracking" },
  { id: 8, title: "Keyboard", price: 89, category: "Electronics", description: "Mechanical keyboard with RGB lighting" },
];

export const SearchApp = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("relevance");

  const categories = ["all", "Electronics", "Vehicles", "Accessories"];

  useEffect(() => {
    filterProducts();
  }, [query, selectedCategory, priceRange, sortBy]);

  const filterProducts = () => {
    let filtered = allProducts.filter((product) => {
      const matchesQuery =
        query === "" ||
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesQuery && matchesCategory && matchesPrice;
    });

    // Sort results
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setResults(filtered);
  };

  const handleAddToCart = (product: Product) => {
    window.dispatchEvent(
      new CustomEvent("mfe:add", { detail: product })
    );
  };

  const handleAddToWishlist = (product: Product) => {
    window.dispatchEvent(
      new CustomEvent("mfe:wishlist:add", { detail: product })
    );
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h2>Search Products</h2>

      {/* Search Bar */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            fontSize: 16,
            border: "2px solid #ddd",
            borderRadius: 8,
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {/* Filters Sidebar */}
        <div style={{ width: 250, flexShrink: 0 }}>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Filters</h3>

            {/* Category Filter */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
                Category
              </label>
              {categories.map((cat) => (
                <div key={cat} style={{ marginBottom: 8 }}>
                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{ marginRight: 8 }}
                    />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                style={{ width: "100%" }}
              />
            </div>

            {/* Sort By */}
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                }}
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 16, color: "#666" }}>
            {results.length} {results.length === 1 ? "result" : "results"} found
          </div>

          {results.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
              <p style={{ fontSize: 18 }}>No products found</p>
              <p>Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 20,
              }}
            >
              {results.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: 16,
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h3 style={{ margin: "0 0 8px 0", fontSize: 18 }}>
                    {product.title}
                  </h3>
                  <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: 14, flex: 1 }}>
                    {product.description}
                  </p>
                  <p
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#28a745",
                    }}
                  >
                    ${product.price}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleAddToCart(product)}
                      style={{
                        flex: 1,
                        padding: 8,
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product)}
                      style={{
                        padding: 8,
                        backgroundColor: "white",
                        color: "#dc3545",
                        border: "1px solid #dc3545",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                      title="Add to Wishlist"
                    >
                      ♥
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
