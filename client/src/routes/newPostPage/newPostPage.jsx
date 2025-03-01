import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState(""); // Description field
  const [images, setImages] = useState([]); // Uploaded images
  const [error, setError] = useState(""); // Error message state
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for submission

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error messages
    setIsSubmitting(true); // Set loading state

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Basic Form Validation
    if (!inputs.title || !inputs.price || !inputs.address || !inputs.city) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });

      navigate("/" + res.data.id); // Redirect to the new post
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>

            {/* Price */}
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" required />
            </div>

            {/* Address */}
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>

            {/* Description */}
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>

            {/* City */}
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required />
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input id="bedroom" name="bedroom" type="number" min={1} required />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input id="bathroom" name="bathroom" type="number" min={1} required />
            </div>

            {/* Latitude & Longitude */}
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" required />
            </div>

            {/* Type & Property Selection */}
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type" required>
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select name="property" required>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            {/* Additional Fields */}
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input id="income" name="income" type="text" placeholder="Income Policy" />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input id="size" name="size" type="number" min={0} required />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus</label>
              <input id="bus" name="bus" type="number" min={0} />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input id="restaurant" name="restaurant" type="number" min={0} />
            </div>

            {/* Submit Button */}
            <button className="sendButton" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add"}
            </button>

            {/* Error Message Display */}
            {error && <span className="error">{error}</span>}
          </form>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt={`Uploaded-${index}`} />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dqgbu8jsc",
            uploadPreset: "LocNation",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
