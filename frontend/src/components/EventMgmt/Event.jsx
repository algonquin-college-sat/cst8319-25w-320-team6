import React from 'react';
import './Event.css';

const Event = ({ event, onEdit, onDelete }) => {
  if (!event) return null;

  return (
    <div className="event-card">
      {event.imageUrl && (
        <div className="event-image">
          <img src={event.imageUrl} alt={event.name} />
        </div>
      )}
      <div className="event-content">
        <div className="event-header">
          <h2 className="event-title">{event.name}</h2>
          <div className="event-actions">
            <button
              className="action-button edit-button"
              onClick={() => onEdit(event)}
            >
              Edit
            </button>
            <button
              className="action-button delete-button"
              onClick={() => onDelete(event._id)}
            >
              Delete
            </button>
          </div>
        </div>
        <p className="event-description">{event.description}</p>
        <div className="event-details">
          <div className="event-info">
            <span className="event-time">🕒 {event.time}</span>
            <span className="event-place">📍 {event.place}</span>
          </div>
          <div className="event-pricing">
            <div className="price-container">
              <span className="price-label">Public:</span>
              <span className="price-value">{event.pricePublic}</span>
            </div>
            <div className="price-container">
              <span className="price-label">Member:</span>
              <span className="price-value">{event.priceMember}</span>
            </div>
          </div>
          {event.isMemberOnly && (
            <div className="member-only-badge">Members Only</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Event;