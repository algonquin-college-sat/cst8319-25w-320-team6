import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Event from '../components/EventMgmt/Event';
import './EventManagePage.css';
import BaseURL from "../config";

const EventManagePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BaseURL}/api/event/readEvent`);
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle event deletion
  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${BaseURL}/api/event/deleteEvent/${eventId}`);
        setEvents(events.filter(event => event._id !== eventId));
      } catch (err) {
        setError('Failed to delete event');
      }
    }
  };

  // Handle event edit
  const handleEdit = (event) => {
    // TODO: Implement edit functionality
    console.log('Edit event:', event);
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="event-manage-page">
      <h1>Event Management</h1>
      <div className="events-grid">
        {events.map((event) => (
          <Event
            key={event._id}
            event={event}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default EventManagePage;
