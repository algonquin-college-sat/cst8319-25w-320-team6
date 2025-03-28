import React, { useState } from 'react';
import axios from 'axios';
import './EventForm.css';
import BaseURL from '../../config';

const EventForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    time: '',
    place: '',
    pricePublic: '',
    priceMember: '',
    isMemberOnly: false,
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setUploadError(null);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      setUploading(true);
      const response = await axios.post(`${BaseURL}/api/event/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      setUploadError('Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalFormData = { ...formData };

      if (imageFile) {
        const imageUrl = await uploadImage();
        finalFormData.imageUrl = imageUrl;
      }

      onSubmit(finalFormData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? 'Edit Event' : 'Create New Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Event Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="text"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="place">Place</label>
            <input
              type="text"
              id="place"
              name="place"
              value={formData.place}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pricePublic">Public Price</label>
            <input
              type="text"
              id="pricePublic"
              name="pricePublic"
              value={formData.pricePublic}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="priceMember">Member Price</label>
            <input
              type="text"
              id="priceMember"
              name="priceMember"
              value={formData.priceMember}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Event Image</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {imageFile && (
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="preview-image"
                  />
                </div>
              )}
              {formData.imageUrl && !imageFile && (
                <div className="image-preview">
                  <img
                    src={formData.imageUrl}
                    alt="Current"
                    className="preview-image"
                  />
                </div>
              )}
              {uploading && <div className="upload-status">Uploading...</div>}
              {uploadError && <div className="upload-error">{uploadError}</div>}
            </div>
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="isMemberOnly"
                checked={formData.isMemberOnly}
                onChange={handleChange}
              />
              Members Only Event
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={uploading}
            >
              {initialData ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm; 