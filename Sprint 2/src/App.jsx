import React, { useState, useEffect } from 'react';
import EventList from './EventList';
import EventDetails from './EventDetails';

const mockEvents = [
  {
    id: 1,
    title: "Tech Talk: AI in Healthcare",
    date: "2025-10-15",
    time: "14:00",
    location: "Main Auditorium",
    category: "Technology",
    organization: "Computer Science Club",
    description: "Join us for an insightful discussion on AI applications in modern healthcare.",
    ticketType: "free"
  },
  {
    id: 2,
    title: "Basketball Tournament Finals",
    date: "2025-10-12",
    time: "18:00",
    location: "Sports Complex",
    category: "Sports",
    organization: "Sports Association",
    description: "Championship game of the inter-faculty basketball tournament.",
    ticketType: "paid"
  },
  {
    id: 3,
    title: "Live Jazz Night",
    date: "2025-10-20",
    time: "19:30",
    location: "Music Hall",
    category: "Entertainment",
    organization: "Music Society",
    description: "An evening of live jazz performances by student musicians.",
    ticketType: "free"
  },
  {
    id: 4,
    title: "Career Fair 2025",
    date: "2025-10-18",
    time: "10:00",
    location: "Convention Center",
    category: "Career",
    organization: "Career Services",
    description: "Meet top employers and explore internship opportunities.",
    ticketType: "free"
  },
  {
    id: 5,
    title: "Hackathon 24hrs",
    date: "2025-10-25",
    time: "09:00",
    location: "Engineering Building",
    category: "Technology",
    organization: "Computer Science Club",
    description: "24-hour coding challenge with amazing prizes.",
    ticketType: "paid"
  },
  {
    id: 6,
    title: "Poetry Slam",
    date: "2025-10-14",
    time: "20:00",
    location: "Arts Center",
    category: "Academic",
    organization: "Literary Club",
    description: "Express yourself through spoken word poetry.",
    ticketType: "free"
  }
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    category: '',
    organization: ''
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      date: '',
      category: '',
      organization: ''
    });
  };

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filters.category === '' || event.category === filters.category;
    const matchesOrganization = filters.organization === '' || event.organization === filters.organization;

    let matchesDate = true;
    if (filters.date === 'upcoming') {
      const today = new Date('2025-10-06');
      const eventDate = new Date(event.date);
      matchesDate = eventDate >= today;
    } else if (filters.date === 'thisWeek') {
      const today = new Date('2025-10-06');
      const weekFromNow = new Date('2025-10-06');
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      const eventDate = new Date(event.date);
      matchesDate = eventDate >= today && eventDate <= weekFromNow;
    }

    return matchesSearch && matchesCategory && matchesOrganization && matchesDate;
  });

  if (selectedEvent) {
    return <EventDetails event={selectedEvent} setSelectedEvent={setSelectedEvent} />;
  }

  return (
    <EventList 
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filters={filters}
      handleFilterChange={handleFilterChange}
      handleClearFilters={handleClearFilters}
      filteredEvents={filteredEvents}
      scrollY={scrollY}
      setSelectedEvent={setSelectedEvent}
    />
  );
}
