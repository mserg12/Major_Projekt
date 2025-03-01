import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import "./searchBar.scss"; // Import SCSS file for styling

function SearchBar() {
  const [query, setQuery] = useState({
    type: "rent", // Default search type
    city: "", // City input
    minPrice: "", // Minimum price input
    maxPrice: "", // Maximum price input
  });

  const navigate = useNavigate(); // Navigation hook

  // Function to validate user input
  const validate = () => {
    if (!query.city.trim()) {
      window.alert("The city field cannot be empty.");
      return false;
    }

    if (query.minPrice !== "" && query.maxPrice !== "" && Number(query.minPrice) > Number(query.maxPrice)) {
      window.alert("Minimum price cannot be greater than maximum price.");
      return false;
    }

    return true;
  };

  // Handle input changes
  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload

    if (!validate()) return; // Stop navigation if validation fails

    navigate(
      `/list?type=rent&city=${encodeURIComponent(query.city)}&minPrice=${query.minPrice || 0}&maxPrice=${query.maxPrice || 0}`
    ); // Redirect to the listing page with search filters
  };

  return (
    <div className="searchBar">
      <form onSubmit={handleSubmit}>
        {/* City input field */}
        <input
          type="text"
          name="city"
          placeholder="City"
          value={query.city}
          onChange={handleChange}
        />

        {/* Minimum price input */}
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          value={query.minPrice}
          onChange={handleChange}
        />

        {/* Maximum price input */}
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          value={query.maxPrice}
          onChange={handleChange}
        />

        {/* Search button */}
        <button type="submit">
          <img src="/search.png" alt="Search" />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;