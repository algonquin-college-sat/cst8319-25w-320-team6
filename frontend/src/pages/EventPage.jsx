import React, { useState, useEffect, useContext } from "react";
import EventList from "../components/Event/EventList";
import AddEditEventForm from "../components/Event/AddEditEventForm";
import EventDetailModal from "../components/Event/EventDetailModal";
import { fetchEvents } from "../components/Event/FetchEvent";
import "../components/Event/Event.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext, ROLES } from "../UserContext";
import ConfirmModal from "../components/ConfirmModal.jsx";

const EventPage = () => {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    const fetchAndSetEvents = async () => {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    };

    fetchAndSetEvents();
  }, []);

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDetailsModal(false);
    setCurrentEvent(null);
  };

  const handleSaveEvent = async (event) => {
    try {
      if (currentEvent && currentEvent._id) {
        const updateUrl = `http://localhost:3000/api/event/updateEvent/${currentEvent._id}`;
        await axios.patch(updateUrl, event);
        setEvents(events.map((e) => (e._id === event._id ? event : e)));
      } else {
        await axios.post("http://localhost:3000/api/event/addEvent", event);
        setEvents([...events, event]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = (id) => {
    setEventToDelete(id);
    setConfirmModalOpen(true);
  };

  const handleViewDetails = (event) => {
    setCurrentEvent(event);
    setShowDetailsModal(true);
  };

  const confirmDeleteEvent = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/event/deleteEvent/${eventToDelete}`);
      setEvents(events.filter((e) => e._id !== eventToDelete));
      setConfirmModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const currentDate = new Date();
  const upcomingEvents = events
    .filter((event) => new Date(event.time) > currentDate)
    .sort((a, b) => new Date(a.time) - new Date(b.time));
  const pastEvents = events
    .filter((event) => new Date(event.time) <= currentDate)
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 4);

  return (
    <div className="event-page">
      {user?.roles.includes(ROLES.ADMIN) && (
        <button className="add-event-button" onClick={handleAddEvent}>
          Add Event
        </button>
      )}
      <section>
        <h2>Upcoming Events</h2>
        <EventList
          events={upcomingEvents.map((event) => ({ ...event, time: event.time.toString() }))}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onViewDetails={handleViewDetails}
          user={user}
        />
      </section>
      <section className="past-events-section">
        <h2>Past Events</h2>
        <EventList
          events={pastEvents.map((event) => ({ ...event, time: event.time.toString() }))}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onViewDetails={handleViewDetails}
          hideActions={true}
          user={user}
        />
        <Link to="/past-events" className="more-link">
          See All Past Events
        </Link>
      </section>

      {showModal && (
        <div className="add_edit_event_modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <AddEditEventForm event={currentEvent} onSave={handleSaveEvent} onCancel={handleCloseModal} />
          </div>
        </div>
      )}
      {showDetailsModal && <EventDetailModal event={currentEvent} onClose={handleCloseModal} />}
      <ConfirmModal
        title="Confirm Delete"
        text="Are you sure you want to delete this event? Please type 'DELETE' to confirm."
        open={confirmModalOpen}
        onConfirm={confirmDeleteEvent}
        onClose={() => setConfirmModalOpen(false)}
        confirmWord="DELETE"
      />
    </div>
  );
};

export default EventPage;
