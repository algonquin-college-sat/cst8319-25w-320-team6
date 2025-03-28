import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Event from '../components/EventMgmt/Event';
import EventForm from '../components/EventMgmt/EventForm';
import './EventManagePage.css';
import BaseURL from "../config";

const EventManagePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

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
    setEditingEvent(event);
  };

  // Handle event update
  const handleUpdate = async (eventData) => {
    try {
      const response = await axios.patch(
        `${BaseURL}/api/event/updateEvent/${editingEvent._id}`,
        eventData
      );
      setEvents(events.map(event =>
        event._id === editingEvent._id ? response.data : event
      ));
      setEditingEvent(null);
    } catch (err) {
      setError('Failed to update event');
    }
  };

  // Handle event creation
  const handleCreate = async (eventData) => {
    try {
      const response = await axios.post(`${BaseURL}/api/event/addEvent`, eventData);
      setEvents([...events, response.data]);
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create event');
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="event-manage-page">
      <div className="page-header">
        <h1>Event Management</h1>
        <button
          className="create-event-button"
          onClick={() => setShowCreateForm(true)}
        >
          Create Event
        </button>
      </div>
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
      {showCreateForm && (
        <EventForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      {editingEvent && (
        <EventForm
          initialData={editingEvent}
          onSubmit={handleUpdate}
          onCancel={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
};

export default EventManagePage;
