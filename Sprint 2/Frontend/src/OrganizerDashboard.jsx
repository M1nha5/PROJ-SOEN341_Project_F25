import React, { useState, useEffect } from 'react';

const mockEvents = [
  { id: 1, title: "Tech Talk: AI in Healthcare", date: "2025-10-15", time: "14:00", location: "Main Auditorium", category: "Technology", organization: "Computer Science Club", description: "Join us for an insightful discussion on AI applications in modern healthcare.", ticketType: "free" },
  { id: 2, title: "Basketball Tournament Finals", date: "2025-10-12", time: "18:00", location: "Sports Complex", category: "Sports", organization: "Sports Association", description: "Championship game of the inter-faculty basketball tournament.", ticketType: "paid" },
  { id: 3, title: "Live Jazz Night", date: "2025-10-20", time: "19:30", location: "Music Hall", category: "Entertainment", organization: "Music Society", description: "An evening of live jazz performances by student musicians.", ticketType: "free" },
  { id: 4, title: "Career Fair 2025", date: "2025-10-18", time: "10:00", location: "Convention Center", category: "Career", organization: "Career Services", description: "Meet top employers and explore internship opportunities.", ticketType: "free" },
  { id: 5, title: "Hackathon 24hrs", date: "2025-10-25", time: "09:00", location: "Engineering Building", category: "Technology", organization: "Computer Science Club", description: "24-hour coding challenge with amazing prizes.", ticketType: "paid" },
  { id: 6, title: "Poetry Slam", date: "2025-10-14", time: "20:00", location: "Arts Center", category: "Academic", organization: "Literary Club", description: "Express yourself through spoken word poetry.", ticketType: "free" }
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ date: '', category: '', organization: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ date: '', category: '', organization: '' });
  };

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch =
      searchTerm === '' ||
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
    return (
      <div style={{ minHeight: '100vh', background: '#0f1729', padding: '60px 40px', position: 'relative', fontFamily: "'Space Grotesk', sans-serif" }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => setSelectedEvent(null)}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              marginBottom: '40px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 5px 20px rgba(139, 92, 246, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            ← Back to Events
          </button>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%)',
              border: '3px solid transparent',
              borderRadius: '25px',
              padding: '50px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              transform: 'rotate(-0.5deg)',
              backgroundImage:
                'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%), linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}
          >
            <h1
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                background: 'linear-gradient(135deg, #3b82f6 0%, #84cc16 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '3rem',
                marginBottom: '30px',
                letterSpacing: '-2px',
                textTransform: 'uppercase'
              }}
            >
              {selectedEvent.title}
            </h1>

            <div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '2px solid rgba(6, 182, 212, 0.3)' }}>
              <span
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  color: 'white',
                  borderRadius: '25px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'inline-block'
                }}
              >
                {selectedEvent.category}
              </span>
            </div>

            <div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '2px solid rgba(6, 182, 212, 0.3)' }}>
              {[
                { label: '📅 Date:', value: selectedEvent.date },
                { label: '🕐 Time:', value: selectedEvent.time },
                { label: '📍 Location:', value: selectedEvent.location },
                { label: '🏢 Organization:', value: selectedEvent.organization }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', marginBottom: '15px' }}>
                  <strong style={{ color: '#3b82f6', minWidth: '170px', fontWeight: '700', fontSize: '1.1rem' }}>{item.label}</strong>
                  <span style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1.1rem' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3
                style={{
                  color: '#06b6d4',
                  marginBottom: '15px',
                  fontSize: '1.6rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                Description
              </h3>
              <p style={{ color: '#e2e8f0', lineHeight: '1.8', fontSize: '1.1rem', fontWeight: '500' }}>{selectedEvent.description}</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '15px 25px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 5px 20px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                Save to Calendar
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '15px 25px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 5px 20px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                Claim Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1729', fontFamily: "'Space Grotesk', sans-serif", color: 'white', position: 'relative' }}>
      {/* background blobs */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: '50%', top: '-200px', right: '-200px', filter: 'blur(80px)', opacity: '0.25', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: '400px', height: '400px', background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', borderRadius: '50%', bottom: '-150px', left: '-150px', filter: 'blur(80px)', opacity: '0.25', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Banner + Title omitted for brevity — leave exactly as you provided */}
        {/* SEARCH + FILTERS */}
        {/* … same as your code … */}

        <div style={{ padding: '60px' }}>
          <div style={{ marginBottom: '40px', fontSize: '1.5rem', color: '#06b6d4', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </div>

          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 40px', color: '#06b6d4' }}>
              <p style={{ fontSize: '1.8rem', marginBottom: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>No events found</p>
              <p style={{ fontSize: '1.2rem', color: '#cbd5e1', fontWeight: '500' }}>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
              {filteredEvents.map((event, idx) => (
                <div
                  key={event.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%)',
                    borderRadius: '20px',
                    padding: '30px',
                    position: 'relative',
                    overflow: 'hidden',
                    transform: `rotate(${idx % 2 === 0 ? '-1deg' : '1deg'}) translateY(${Math.max(0, scrollY / 50 - idx * 2)}px)`,
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                    border: '3px solid transparent',
                    backgroundImage:
                      'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%), linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    opacity: 1
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Archivo Black', sans-serif",
                      background: 'linear-gradient(135deg, #3b82f6 0%, #84cc16 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '20px',
                      fontSize: '1.8rem',
                      letterSpacing: '-1px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {event.title}
                  </h3>

                  <div style={{ marginBottom: '20px' }}>
                    {[
                      { icon: '📅', label: 'Date:', value: event.date },
                      { icon: '🕐', label: 'Time:', value: event.time },
                      { icon: '📍', label: 'Location:', value: event.location },
                      { icon: '🏢', label: 'Org:', value: event.organization }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#cbd5e1', fontSize: '1rem', fontWeight: '500' }}>
                        <strong style={{ color: '#06b6d4', marginRight: '10px', minWidth: '100px', fontWeight: '700' }}>
                          {item.icon} {item.label}
                        </strong>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <p style={{ color: '#e2e8f0', lineHeight: '1.7', marginBottom: '20px', fontWeight: '500' }}>{event.description}</p>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <span style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', color: 'white', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {event.category}
                    </span>
                    <span style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', color: 'white', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {event.ticketType === 'free' ? 'FREE' : 'PAID'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)';
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(37, 99, 235, 0.8)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(59, 130, 246, 0.4)';
                      }}
                      style={{
                        flex: 1,
                        padding: '15px 25px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 5px 20px rgba(59, 130, 246, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      View Details
                    </button>

                    <button
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(5, 150, 105, 0.8)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(16, 185, 129, 0.4)';
                      }}
                      style={{
                        flex: 1,
                        padding: '15px 25px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 5px 20px rgba(16, 185, 129, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Save Event
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
}

