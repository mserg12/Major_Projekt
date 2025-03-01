import { useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom"; // Hook for managing query parameters in the URL

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams(); // Manage URL search parameters
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "", // Get 'type' from URL or default to empty
    city: searchParams.get("city") || "", // Get 'city' from URL or default to empty
    property: searchParams.get("property") || "", // Get 'property' from URL or default to empty
    minPrice: searchParams.get("minPrice") || "", // Get 'minPrice' from URL or default to empty
    maxPrice: searchParams.get("maxPrice") || "", // Get 'maxPrice' from URL or default to empty
    bedroom: searchParams.get("bedroom") || "", // Get 'bedroom' from URL or default to empty
  });

  // Handle input changes and update query state
  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value, // Update specific query field
    });
  };

  // Update URL search parameters when filtering
  const handleFilter = () => {
    setSearchParams(query); // Apply filter settings to the URL
  };

  return (
    <div className="filter">
      <h1>
        Search results for <b>{searchParams.get("city")}</b>
      </h1>

      {/* Location Input Field */}
      <div className="top">
        <div className="item">
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City Location"
            onChange={handleChange}
            defaultValue={query.city}
          />
        </div>
      </div>

      {/* Filter Options */}
      <div className="bottom">
        {/* Property Type Selection */}
        <div className="item">
          <label htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
          >
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        {/* Property Category Selection */}
        <div className="item">
          <label htmlFor="property">Property</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
          >
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>

        {/* Minimum Price Input */}
        <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Any"
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>

        {/* Maximum Price Input */}
        <div className="item">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="text"
            id="maxPrice"
            name="maxPrice"
            placeholder="Any"
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>

        {/* Bedroom Count Input */}
        <div className="item">
          <label htmlFor="bedroom">Bedroom</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="Any"
            onChange={handleChange}
            defaultValue={query.bedroom}
          />
        </div>

        {/* Search Button */}
        <button onClick={handleFilter}>
          <img src="/search.png" alt="Search" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
