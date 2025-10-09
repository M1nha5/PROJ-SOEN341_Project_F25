
import React from 'react';

export default function EventList({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  handleFilterChange, 
  handleClearFilters,
  filteredEvents,
  scrollY,
  setSelectedEvent
}) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1729',
      fontFamily: "'Space Grotesk', sans-serif",
      color: 'white',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed',
        width: '500px',
        height: '500px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '50%',
        top: '-200px',
        right: '-200px',
        filter: 'blur(80px)',
        opacity: '0.25',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        width: '400px',
        height: '400px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        borderRadius: '50%',
        bottom: '-150px',
        left: '-150px',
        filter: 'blur(80px)',
        opacity: '0.25',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '100%',
          height: '500px',
          position: 'relative',
          overflow: 'hidden',
          background: '#1e293b'
        }}>
          <div style={{
            display: 'flex',
            width: '300%',
            height: '100%',
            animation: 'bannerSlide 18s infinite ease-in-out'
          }}>
            <div style={{
              width: '33.333%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img 
                src="https://th.bing.com/th/id/OIP.9KjdfveGzS5bxpBlgZdGRwHaEJ?w=322&h=180&c=7&r=0&o=7&cb=12&dpr=2&pid=1.7&rm=3" 
                alt="Event 1"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)'
              }} />
            </div>
            <div style={{
              width: '33.333%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img 
                src="https://i.imgur.com/YsKZz3N.png" 
                alt="Event 2"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)'
              }} />
            </div>
            <div style={{
              width: '33.333%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img 
                src="https://i.imgur.com/I2iG3nJ.jpeg" 
                alt="Event 3"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)'
              }} />
            </div>
          </div>
          <div style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 2,
            width: '90%'
          }}>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: '4rem',
              marginBottom: '15px',
              fontWeight: '900',
              letterSpacing: '-2px',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #fff 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '3px 3px 15px rgba(0, 0, 0, 0.8)'
            }}>Welcome to Campus Events</h2>
            <p style={{
              fontSize: '1.4rem',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
              color: 'white'
            }}>Discover amazing experiences</p>
          </div>
          <style>{`
            @keyframes bannerSlide {
              0%, 30% { transform: translateX(0); }
              33%, 63% { transform: translateX(-33.333%); }
              66%, 96% { transform: translateX(-66.666%); }
              100% { transform: translateX(0); }
            }
          `}</style>
        </div>

        <div style={{
          padding: '80px 60px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: '5rem',
            marginBottom: '20px',
            fontWeight: '900',
            letterSpacing: '-3px',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: 'rotate(-1deg)',
            display: 'inline-block',
            width: '100%'
          }}>Campus Events & Ticketing</h1>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#06b6d4',
            width: '100%'
          }}>Discover and attend amazing events on campus</p>
        </div>

        <div style={{
          padding: '40px 60px',
          background: 'rgba(20, 27, 45, 0.8)',
          backdropFilter: 'blur(10px)',
          borderTop: '3px solid #3b82f6',
          borderBottom: '3px solid #8b5cf6'
        }}>
          <input
            type="text"
            placeholder="Search events by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '20px 25px',
              fontSize: '1.1rem',
              fontWeight: '600',
              border: '3px solid #3b82f6',
              borderRadius: '15px',
              background: 'rgba(15, 23, 41, 0.9)',
              color: 'white',
              marginBottom: '30px',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'all 0.3s ease'
            }}
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '25px'
          }}>
            {[
              { label: 'Date', key: 'date', options: ['All Dates', 'Upcoming', 'This Week'] },
              { label: 'Category', key: 'category', options: ['All Categories', 'Technology', 'Career', 'Entertainment', 'Sports', 'Academic'] },
              { label: 'Organization', key: 'organization', options: ['All Organizations', 'Computer Science Club', 'Career Services', 'Music Society', 'Literary Club', 'Sports Association'] }
            ].map(filter => (
              <div key={filter.key}>
                <label style={{
                  display: 'block',
                  fontWeight: '700',
                  marginBottom: '10px',
                  color: '#3b82f6',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>{filter.label}</label>
                <select
                  value={filters[filter.key]}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value === filter.options[0] ? '' : e.target.value)}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: '3px solid #8b5cf6',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 41, 0.9)',
                    color: 'white',
                    cursor: 'pointer',
                    fontFamily: "'Space Grotesk', sans-serif",
                    transition: 'all 0.3s ease'
                  }}
                >
                  {filter.options.map(opt => (
                    <option key={opt} value={opt === filter.options[0] ? '' : opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={handleClearFilters}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)';
              e.target.style.transform = 'translateY(-3px) rotate(-2deg)';
              e.target.style.boxShadow = '0 15px 40px rgba(234, 88, 12, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
              e.target.style.transform = 'translateY(0) rotate(0deg)';
              e.target.style.boxShadow = '0 5px 20px rgba(249, 115, 22, 0.4)';
            }}
            style={{
              padding: '15px 35px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 5px 20px rgba(249, 115, 22, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            Clear All Filters
          </button>
        </div>

        <div style={{ padding: '60px' }}>
          <div style={{
            marginBottom: '40px',
            fontSize: '1.5rem',
            color: '#06b6d4',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </div>

          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 40px', color: '#06b6d4' }}>
              <p style={{ fontSize: '1.8rem', marginBottom: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>No events found</p>
              <p style={{ fontSize: '1.2rem', color: '#cbd5e1', fontWeight: '500' }}>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '40px'
            }}>
              {filteredEvents.map((event, idx) => (
                <div
                  key={event.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%)',
                    borderRadius: '20px',
                    padding: '30px',
                    position: 'relative',
                    overflow: 'hidden',
                    transform: rotate(${idx % 2 === 0 ? '-1deg' : '1deg'}) translateY(${Math.max(0, scrollY / 50 - idx * 2)}px),
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                    border: '3px solid transparent',
                    backgroundImage: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%), linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    opacity: 1
                  }}
                >
                  <h3 style={{
                    fontFamily: "'Archivo Black', sans-serif",
                    background: 'linear-gradient(135deg, #3b82f6 0%, #84cc16 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '20px',
                    fontSize: '1.8rem',
                    letterSpacing: '-1px',
                    textTransform: 'uppercase'
                  }}>{event.title}</h3>

                  <div style={{ marginBottom: '20px' }}>
                    {[
                      { icon: '📅', label: 'Date:', value: event.date },
                      { icon: '🕐', label: 'Time:', value: event.time },
                      { icon: '📍', label: 'Location:', value: event.location },
                      { icon: '🏢', label: 'Org:', value: event.organization }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#cbd5e1', fontSize: '1rem', fontWeight: '500' }}>
                        <strong style={{ color: '#06b6d4', marginRight: '10px', minWidth: '100px', fontWeight: '700' }}>{item.icon} {item.label}</strong>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <p style={{ color: '#e2e8f0', lineHeight: '1.7', marginBottom: '20px', fontWeight: '500' }}>{event.description}</p>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <span style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      color: 'white',
                      borderRadius: '25px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>{event.category}</span>
                    <span style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      color: 'white',
                      borderRadius: '25px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>{event.ticketType === 'free' ? 'FREE' : 'PAID'}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)';
                        e.target.style.transform = 'translateY(-3px) scale(1.05)';
                        e.target.style.boxShadow = '0 15px 40px rgba(37, 99, 235, 0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)';
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = '0 5px 20px rgba(59, 130, 246, 0.4)';
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
                    >View Details</button>
                    <button 
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                        e.target.style.transform = 'translateY(-3px) scale(1.05)';
                        e.target.style.boxShadow = '0 15px 40px rgba(5, 150, 105, 0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = '0 5px 20px rgba(16, 185, 129, 0.4)';
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
                    >Save Event</button>
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