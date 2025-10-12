import React, { useState, useEffect, useRef } from 'react';

/* ---------------------- Mock Data (with capacity) ----------------------- */
const initialEvents = [
  {
    id: 1,
    title: "Tech Talk: AI in Healthcare",
    date: "2025-10-15",
    time: "14:00",
    location: "Main Auditorium",
    category: "Technology",
    organization: "Computer Science Club",
    description: "Join us for an insightful discussion on AI applications in modern healthcare.",
    ticketType: "free",
    capacity: 120
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
    ticketType: "paid",
    capacity: 300
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
    ticketType: "free",
    capacity: 200
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
    ticketType: "free",
    capacity: 1000
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
    ticketType: "paid",
    capacity: 250
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
    ticketType: "free",
    capacity: 150
  }
];

/* ---------------------- Helpers ----------------------- */
const genTicketCode = (eventId) =>
  `EV${eventId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;

const downloadFile = (filename, content, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

/* ====================== QR Scanner Component ====================== */
function QRScanner({ onDetected, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const setup = async () => {
      try {
        setSupported('BarcodeDetector' in window);
        if ('BarcodeDetector' in window) {
          // @ts-ignore
          detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          scanLoop();
        }
      } catch (e) {
        setError('Camera access failed. Check permissions or use the Upload Image option.');
      }
    };
    setup();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scanLoop = async () => {
    rafRef.current = requestAnimationFrame(scanLoop);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const detector = detectorRef.current;
    if (!video || !canvas || !detector) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;

    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);

    try {
      const barcodes = await detector.detect(canvas);
      if (barcodes && barcodes.length) {
        const raw = barcodes[0].rawValue || barcodes[0].rawValue === '' ? barcodes[0].rawValue : barcodes[0].rawValue;
        if (raw) {
          onDetected(String(raw));
        }
      }
    } catch (err) {
      // ignore frame errors; continue scanning
    }
  };

  const handleUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!('BarcodeDetector' in window)) {
        setError('This browser does not support in-page QR decoding. Open the camera or paste the code manually.');
        return;
      }
      const img = new Image();
      img.onload = async () => {
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const detector = detectorRef.current;
        const codes = await detector.detect(canvas);
        if (codes && codes.length) {
          onDetected(String(codes[0].rawValue));
        } else {
          setError('No QR code detected in image.');
        }
      };
      img.src = URL.createObjectURL(file);
    } catch (e2) {
      setError('Failed to process image.');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div style={{ background: '#0b1220', borderRadius: 16, padding: 16, border: '1px solid #334155', width: 720, maxWidth: '95vw' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ color: 'white', margin: 0 }}>QR Scanner</h3>
          <button onClick={onClose} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #475569', background: 'transparent', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Close</button>
        </div>

        <div style={{ position: 'relative', background: '#0f172a', borderRadius: 12, overflow: 'hidden', border: '1px solid #334155' }}>
          <video ref={videoRef} style={{ width: '100%', display: 'block' }} playsInline muted />
          {/* scanning guide */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{
              position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
              width: '60%', maxWidth: 420, aspectRatio: '1/1', border: '2px solid rgba(59,130,246,0.9)', borderRadius: 12,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)'
            }} />
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ color: '#9ca3af' }}>Or upload QR image:</label>
          <input type="file" accept="image/*" onChange={handleUpload} style={{ color: 'white' }} />
          {!supported && <span style={{ color: '#fbbf24', marginLeft: 8 }}>Note: BarcodeDetector not supported; camera may not decode. Paste code manually if needed.</span>}
        </div>

        {error && <div style={{ marginTop: 10, color: '#f87171' }}>{error}</div>}

        {/* hidden offscreen canvas for decoding frames */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}

/* ---------------------- App ----------------------- */
export default function App() {
  const [events, setEvents] = useState(initialEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ date: '', category: '', organization: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  // Organizer state
  const [organizerMode, setOrganizerMode] = useState(false);
  const [orgTab, setOrgTab] = useState('create'); // 'create' | 'analytics' | 'tools'
  const [attendeesByEvent, setAttendeesByEvent] = useState({}); // { [eventId]: [{id,name,email,ticketCode,checkedIn}] }
  const [analyticsEventId, setAnalyticsEventId] = useState(null);
  const [toolsEventId, setToolsEventId] = useState(null);
  const [ticketModal, setTicketModal] = useState(null); // {event, ticketCode}
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ---------------------- Filters ----------------------- */
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ date: '', category: '', organization: '' });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      searchTerm === '' ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filters.category === '' || event.category === filters.category;
    const matchesOrganization = filters.organization === '' || event.organization === filters.organization;

    let matchesDate = true;
    if (filters.date === 'upcoming') {
      const today = new Date(); today.setHours(0,0,0,0);
      const eventDate = new Date(event.date);
      matchesDate = eventDate >= today;
    } else if (filters.date === 'thisWeek') {
      const today = new Date(); today.setHours(0,0,0,0);
      const weekFromNow = new Date(today); weekFromNow.setDate(weekFromNow.getDate() + 7);
      const eventDate = new Date(event.date);
      matchesDate = eventDate >= today && eventDate <= weekFromNow;
    }

    return matchesSearch && matchesCategory && matchesOrganization && matchesDate;
  });

  /* ---------------------- Ticketing (Claim + Save to Calendar) ----------------------- */
  const saveToCalendar = (ev) => {
    const dtStart = `${ev.date.replace(/-/g, '')}T${ev.time.replace(':','')}00`;
    const dtEnd = dtStart;
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//CampusEvents//EN','BEGIN:VEVENT',
      `UID:${crypto?.randomUUID?.() || Math.random().toString(36)}`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z')}`,
      `DTSTART:${dtStart}`,`DTEND:${dtEnd}`,
      `SUMMARY:${ev.title}`,`LOCATION:${ev.location}`,`DESCRIPTION:${ev.description}`,
      'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    downloadFile(`${ev.title.replace(/\s+/g,'_')}.ics`, ics, 'text/calendar');
  };

  const claimTicket = (ev, name = 'Guest', email = '') => {
    // capacity guard (optional)
    const issued = (attendeesByEvent[ev.id] || []).length;
    if (ev.capacity && issued >= ev.capacity) {
      alert('Event at capacity. Cannot issue more tickets.');
      return;
    }
    const ticketCode = genTicketCode(ev.id);
    setAttendeesByEvent(prev => {
      const list = prev[ev.id] ? [...prev[ev.id]] : [];
      list.push({ id: ticketCode, name, email, ticketCode, checkedIn: false });
      return { ...prev, [ev.id]: list };
    });
    setTicketModal({ event: ev, ticketCode });
  };

  const remainingCapacity = (ev) => {
    const issued = (attendeesByEvent[ev.id] || []).length;
    return Math.max(0, (ev.capacity ?? 0) - issued);
  };

  /* ---------------------- Organizer: Create Event ----------------------- */
  const [createForm, setCreateForm] = useState({
    title: '', description: '', date: '', time: '',
    location: '', category: 'Technology', organization: '', ticketType: 'free', capacity: 100
  });

  const createEvent = (e) => {
    e.preventDefault();
    const nextId = Math.max(0, ...events.map(x => x.id)) + 1;
    const newEvent = { id: nextId, ...createForm };
    setEvents(prev => [...prev, newEvent]);
    setCreateForm({
      title: '', description: '', date: '', time: '',
      location: '', category: 'Technology', organization: '', ticketType: 'free', capacity: 100
    });
    if (!analyticsEventId) setAnalyticsEventId(nextId);
    if (!toolsEventId) setToolsEventId(nextId);
  };

  /* ---------------------- Organizer: Analytics ----------------------- */
  const analyticsFor = (eventId) => {
    const ev = events.find(e => e.id === Number(eventId));
    if (!ev) return null;
    const list = attendeesByEvent[eventId] || [];
    const issued = list.length;
    const checkedIn = list.filter(a => a.checkedIn).length;
    const cap = ev.capacity ?? 0;
    const remaining = Math.max(0, cap - issued);
    const attendanceRate = issued === 0 ? 0 : Math.round((checkedIn / issued) * 100);
    return { ev, issued, checkedIn, remaining, cap, attendanceRate };
  };

  /* ---------------------- Organizer: Tools (CSV + Validate + Scanner) ----------------------- */
  const exportCSV = (eventId) => {
    const list = attendeesByEvent[eventId] || [];
    const header = ['ticketCode', 'name', 'email', 'checkedIn'];
    const rows = list.map(a => [a.ticketCode, a.name || '', a.email || '', a.checkedIn ? 'yes' : 'no']);
    const csv = [header.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const ev = events.find(e => e.id === Number(eventId));
    downloadFile(`${(ev?.title || 'attendees').replace(/\s+/g,'_')}.csv`, csv, 'text/csv');
  };

  const [validateInput, setValidateInput] = useState('');
  const validateTicket = (eventId) => {
    const list = attendeesByEvent[eventId] || [];
    const idx = list.findIndex(a => a.ticketCode.trim() === validateInput.trim());
    if (idx === -1) {
      alert('❌ Ticket not found for this event.');
      return;
    }
    if (list[idx].checkedIn) {
      alert('⚠️ Already checked in.');
      return;
    }
    const updated = [...list];
    updated[idx] = { ...updated[idx], checkedIn: true };
    setAttendeesByEvent(prev => ({ ...prev, [eventId]: updated }));
    alert('✅ Ticket validated. Welcome!');
    setValidateInput('');
  };

  const onQRDetected = (text) => {
    setValidateInput(text);
    if (toolsEventId) {
      // small delay so UI shows the value, then validate
      setTimeout(() => validateTicket(toolsEventId), 100);
    }
    setScannerOpen(false);
  };

  /* ---------------------- Selected Event Full View ----------------------- */
  if (selectedEvent) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f1729', padding: '60px 40px', position: 'relative', fontFamily: "'Space Grotesk', sans-serif" }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => setSelectedEvent(null)}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer',
              marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '1px',
              boxShadow: '0 5px 20px rgba(139, 92, 246, 0.4)', transition: 'all 0.3s ease'
            }}
          >← Back to Events</button>

          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%)',
            border: '3px solid transparent', borderRadius: '25px', padding: '50px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)', position: 'relative',
            transform: 'rotate(-0.5deg)',
            backgroundImage: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%), linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
            backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box'
          }}>
            <h1 style={{
              fontFamily: "'Archivo Black', sans-serif',
              background: 'linear-gradient(135deg, #3b82f6 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontSize: '3rem', marginBottom: '30px', letterSpacing: '-2px', textTransform: 'uppercase'
            }}>{selectedEvent.title}</h1>

            <div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '2px solid rgba(6, 182, 212, 0.3)' }}>
              <span style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                color: 'white', borderRadius: '25px', fontSize: '0.9rem',
                fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block'
              }}>{selectedEvent.category}</span>
            </div>

            <div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '2px solid rgba(6, 182, 212, 0.3)' }}>
              {[
                { label: '📅 Date:', value: selectedEvent.date },
                { label: '🕐 Time:', value: selectedEvent.time },
                { label: '📍 Location:', value: selectedEvent.location },
                { label: '🏢 Organization:', value: selectedEvent.organization },
                { label: '🎫 Capacity:', value: selectedEvent.capacity }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', marginBottom: '15px' }}>
                  <strong style={{ color: '#3b82f6', minWidth: '170px', fontWeight: '700', fontSize: '1.1rem' }}>{item.label}</strong>
                  <span style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1.1rem' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#06b6d4', marginBottom: '15px', fontSize: '1.6rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</h3>
              <p style={{ color: '#e2e8f0', lineHeight: '1.8', fontSize: '1.1rem', fontWeight: '500' }}>{selectedEvent.description}</p>
              <p style={{ color: '#93c5fd', marginTop: 12 }}>
                Remaining capacity: <strong>{remainingCapacity(selectedEvent)}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
              <button
                onClick={() => saveToCalendar(selectedEvent)}
                style={{
                  flex: 1, padding: '15px 25px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '1px',
                  boxShadow: '0 5px 20px rgba(16, 185, 129, 0.4)', transition: 'all 0.3s ease'
                }}
              >Save to Calendar</button>

              <button
                onClick={() => claimTicket(selectedEvent)}
                style={{
                  flex: 1, padding: '15px 25px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '1px',
                  boxShadow: '0 5px 20px rgba(59, 130, 246, 0.4)', transition: 'all 0.3s ease'
                }}
              >Claim Ticket</button>
            </div>
          </div>
        </div>

        {/* Simple ticket modal */}
        {ticketModal && ticketModal.event.id === selectedEvent.id && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ background: '#0b1220', borderRadius: 16, padding: 24, border: '1px solid #334155', width: 480 }}>
              <h3 style={{ color: 'white', marginBottom: 8 }}>Your Ticket</h3>
              <p style={{ color: '#93c5fd', marginBottom: 16 }}>{ticketModal.event.title}</p>
              <div style={{
                background: '#111827', padding: 16, borderRadius: 12,
                border: '1px dashed #475569', color: '#e2e8f0', fontFamily: 'monospace'
              }}>
                Ticket Code: <strong>{ticketModal.ticketCode}</strong>
              </div>
              <p style={{ color: '#9ca3af', marginTop: 10 }}>
                Use this code at check-in. (QR version should encode this exact text.)
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button
                  onClick={() => { navigator.clipboard?.writeText(ticketModal.ticketCode); }}
                  style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: '#3b82f6', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                >Copy Code</button>
                <button
                  onClick={() => setTicketModal(null)}
                  style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #475569', background: 'transparent', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                >Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---------------------- Main (List + Organizer Mode) ----------------------- */
  return (
    <div style={{ minHeight: '100vh', background: '#0f1729', fontFamily: "'Space Grotesk', sans-serif', color: 'white', position: 'relative' }}>
      {/* Glow blobs */}
      <div style={{
        position: 'fixed', width: '500px', height: '500px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '50%', top: '-200px', right: '-200px', filter: 'blur(80px)', opacity: '0.25', zIndex: 0, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', width: '400px', height: '400px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        borderRadius: '50%', bottom: '-150px', left: '-150px', filter: 'blur(80px)', opacity: '0.25', zIndex: 0, pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Banner */}
        <div style={{ width: '100%', height: '500px', position: 'relative', overflow: 'hidden', background: '#1e293b' }}>
          <div style={{ display: 'flex', width: '300%', height: '100%', animation: 'bannerSlide 18s infinite ease-in-out' }}>
            {[ // three slides
              { src: "https://th.bing.com/th/id/OIP.9KjdfveGzS5bxpBlgZdGRwHaEJ?w=322&h=180&c=7&r=0&o=7&cb=12&dpr=2&pid=1.7&rm=3" },
              { src: "https://i.imgur.com/YsKZz3N.png" },
              { src: "https://i.imgur.com/I2iG3nJ.jpeg" }
            ].map((s, i) => (
              <div key={i} style={{ width: '33.333%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img
                  src={s.src}
                  alt={`Event ${i+1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';
                  }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)' }} />
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 2, width: '90%' }}>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif", fontSize: '4rem', marginBottom: '15px',
              fontWeight: '900', letterSpacing: '-2px', textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #fff 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textShadow: '3px 3px 15px rgba(0, 0, 0, 0.8)'
            }}>Welcome to Campus Events</h2>
            <p style={{ fontSize: '1.4rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)', color: 'white' }}>
              Discover amazing experiences
            </p>
            {/* Organizer mode switch */}
            <div style={{ marginTop: 18 }}>
              <button
                onClick={() => setOrganizerMode(v => !v)}
                style={{ padding: '10px 16px', borderRadius: 12, border: 'none', background: organizerMode ? '#10b981' : '#3b82f6', color: 'white', fontWeight: 800, cursor: 'pointer' }}
              >
                {organizerMode ? 'Organizer Mode: ON' : 'Organizer Mode: OFF'}
              </button>
            </div>
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

        {/* Title */}
        <div style={{ padding: '80px 60px', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Archivo Black', sans-serif", fontSize: '5rem', marginBottom: '20px',
            fontWeight: '900', letterSpacing: '-3px', textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            transform: 'rotate(-1deg)', display: 'inline-block', textAlign: 'center', width: '100%'
          }}>Campus Events & Ticketing</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#06b6d4', textAlign: 'center', width: '100%' }}>
            Discover and attend amazing events on campus
          </p>
        </div>

        {/* Search & Filters */}
        <div style={{ padding: '40px 60px', background: 'rgba(20, 27, 45, 0.8)', backdropFilter: 'blur(10px)', borderTop: '3px solid #3b82f6', borderBottom: '3px solid #8b5cf6' }}>
          <input
            type="text"
            placeholder="Search events by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '20px 25px', fontSize: '1.1rem', fontWeight: '600',
              border: '3px solid #3b82f6', borderRadius: '15px', background: 'rgba(15, 23, 41, 0.9)',
              color: 'white', marginBottom: '30px', fontFamily: "'Space Grotesk', sans-serif", transition: 'all 0.3s ease'
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
            {[
              { label: 'Date', key: 'date', options: ['All Dates', 'Upcoming', 'This Week'] },
              { label: 'Category', key: 'category', options: ['All Categories', 'Technology', 'Career', 'Entertainment', 'Sports', 'Academic'] },
              { label: 'Organization', key: 'organization', options: ['All Organizations', 'Computer Science Club', 'Career Services', 'Music Society', 'Literary Club', 'Sports Association'] }
            ].map(filter => (
              <div key={filter.key}>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '10px', color: '#3b82f6', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{filter.label}</label>
                <select
                  value={filters[filter.key]}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value === filter.options[0] ? '' : e.target.value)}
                  style={{
                    width: '100%', padding: '15px 20px', fontSize: '1rem', fontWeight: '600',
                    border: '3px solid #8b5cf6', borderRadius: '12px', background: 'rgba(15, 23, 41, 0.9)',
                    color: 'white', cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", transition: 'all 0.3s ease'
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
              e.currentTarget.style.background = 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)';
              e.currentTarget.style.transform = 'translateY(-3px) rotate(-2deg)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(234, 88, 12, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
              e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(249, 115, 22, 0.4)';
            }}
            style={{
              padding: '15px 35px', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem',
              fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase',
              letterSpacing: '1px', boxShadow: '0 5px 20px rgba(249, 115, 22, 0.4)', transition: 'all 0.3s ease'
            }}
          >
            Clear All Filters
          </button>
        </div>

        {/* Organizer Mode Panel */}
        {organizerMode && (
          <div style={{ padding: '30px 60px', borderTop: '1px solid #334155', borderBottom: '1px solid #334155', background: '#0b1220' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              {['create','analytics','tools'].map(t => (
                <button
                  key={t}
                  onClick={() => setOrgTab(t)}
                  style={{
                    padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                    border: orgTab === t ? '2px solid #3b82f6' : '1px solid #334155',
                    background: orgTab === t ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: 'white', fontWeight: 700, textTransform: 'capitalize'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Create */}
            {orgTab === 'create' && (
              <form onSubmit={createEvent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {[
                  { k:'title', p:'Title' },
                  { k:'description', p:'Description' },
                  { k:'date', p:'Date', type:'date' },
                  { k:'time', p:'Time', type:'time' },
                  { k:'location', p:'Location' },
                  { k:'organization', p:'Organization' },
                ].map(f => (
                  <input
                    key={f.k}
                    type={f.type || 'text'}
                    placeholder={f.p}
                    value={createForm[f.k]}
                    onChange={(e)=>setCreateForm(s=>({...s,[f.k]:e.target.value}))}
                    required={['title','date','time','location'].includes(f.k)}
                    style={{ padding: 12, borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                  />
                ))}
                <select
                  value={createForm.category}
                  onChange={(e)=>setCreateForm(s=>({...s, category:e.target.value}))}
                  style={{ padding: 12, borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                >
                  {['Technology','Career','Entertainment','Sports','Academic'].map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={createForm.ticketType}
                  onChange={(e)=>setCreateForm(s=>({...s, ticketType:e.target.value}))}
                  style={{ padding: 12, borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                >
                  {['free','paid'].map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="number"
                  min={0}
                  placeholder="Capacity"
                  value={createForm.capacity}
                  onChange={(e)=>setCreateForm(s=>({...s, capacity:Number(e.target.value)}))}
                  style={{ padding: 12, borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                />
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
                  <button type="submit" style={{ padding: '12px 16px', borderRadius: 10, border: 'none', background: '#10b981', color: 'white', fontWeight: 800, cursor: 'pointer' }}>
                    Create Event
                  </button>
                </div>
              </form>
            )}

            {/* Analytics */}
            {orgTab === 'analytics' && (
              <div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ color: '#9ca3af' }}>Event:</span>
                  <select
                    value={analyticsEventId ?? ''}
                    onChange={(e)=>setAnalyticsEventId(Number(e.target.value))}
                    style={{ padding: 10, borderRadius: 10, background: '#0f172a', color: 'white', border: '1px solid #334155' }}
                  >
                    <option value="" disabled>Select event</option>
                    {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                  </select>
                </div>
                {analyticsEventId && (() => {
                  const a = analyticsFor(analyticsEventId);
                  if (!a) return null;
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
                      <Stat label="Capacity" value={a.cap} />
                      <Stat label="Tickets Issued" value={a.issued} />
                      <Stat label="Checked-in" value={a.checkedIn} />
                      <Stat label="Remaining" value={a.remaining} />
                      <div style={{ gridColumn: '1 / -1', background: '#0f172a', border: '1px solid #334155', borderRadius: 12, padding: 16 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 8 }}>Attendance Rate</div>
                        <div style={{ height: 14, borderRadius: 7, background: '#111827', overflow: 'hidden' }}>
                          <div style={{ width: `${a.attendanceRate}%`, height: '100%', background: '#3b82f6' }} />
                        </div>
                        <div style={{ color: 'white', marginTop: 8, fontWeight: 700 }}>{a.attendanceRate}%</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Tools */}
            {orgTab === 'tools' && (
              <div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ color: '#9ca3af' }}>Event:</span>
                  <select
                    value={toolsEventId ?? ''}
                    onChange={(e)=>setToolsEventId(Number(e.target.value))}
                    style={{ padding: 10, borderRadius: 10, background: '#0f172a', color: 'white', border: '1px solid #334155' }}
                  >
                    <option value="" disabled>Select event</option>
                    {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                  </select>
                  <button
                    onClick={()=> toolsEventId && exportCSV(toolsEventId)}
                    style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: '#3b82f6', color: 'white', fontWeight: 800, cursor: 'pointer' }}
                  >Export Attendees (CSV)</button>
                  <button
                    onClick={() => setScannerOpen(true)}
                    style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: '#10b981', color: 'white', fontWeight: 800, cursor: 'pointer' }}
                  >Open Camera Scanner</button>
                </div>

                {/* Manual validator */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, maxWidth: 640 }}>
                  <input
                    placeholder="Paste or scan ticket code here"
                    value={validateInput}
                    onChange={(e)=>setValidateInput(e.target.value)}
                    style={{ padding: 12, borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                  />
                  <button
                    onClick={()=> toolsEventId && validateTicket(toolsEventId)}
                    style={{ padding: '12px 16px', borderRadius: 10, border: 'none', background: '#10b981', color: 'white', fontWeight: 800, cursor: 'pointer' }}
                  >Validate</button>
                </div>

                <p style={{ color: '#9ca3af', marginTop: 10 }}>
                  The camera scanner uses the browser’s BarcodeDetector API (Chrome/Edge/Android). If unsupported, upload a QR image or paste the decoded code.
                </p>

                {/* Quick attendee table preview */}
                {toolsEventId && (
                  <div style={{ marginTop: 16, background: '#0f172a', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ padding: 12, borderBottom: '1px solid #334155', color: '#93c5fd', fontWeight: 700 }}>
                      Attendees ({(attendeesByEvent[toolsEventId]||[]).length})
                    </div>
                    <div style={{ maxHeight: 260, overflow: 'auto' }}>
                      {(attendeesByEvent[toolsEventId] || []).map(a => (
                        <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr', gap: 8, padding: 10, borderBottom: '1px solid #1f2937', color: 'white' }}>
                          <div>{a.name || 'Guest'}</div>
                          <div style={{ color: '#9ca3af' }}>{a.email || '-'}</div>
                          <div style={{ fontFamily: 'monospace' }}>{a.ticketCode}</div>
                          <div style={{ color: a.checkedIn ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{a.checkedIn ? 'IN' : 'PENDING'}</div>
                        </div>
                      ))}
                      {(attendeesByEvent[toolsEventId] || []).length === 0 && (
                        <div style={{ padding: 12, color: '#9ca3af' }}>No attendees yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Events Grid */}
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
                    borderRadius: '20px', padding: '30px', position: 'relative', overflow: 'hidden',
                    transform: `rotate(${idx % 2 === 0 ? '-1deg' : '1deg'}) translateY(${Math.max(0, scrollY / 50 - idx * 2)}px)`,
                    transition: 'all 0.4s ease', cursor: 'pointer', border: '3px solid transparent',
                    backgroundImage: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%), linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
                    backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', opacity: 1
                  }}
                >
                  <h3 style={{
                    fontFamily: "'Archivo Black', sans-serif",
                    background: 'linear-gradient(135deg, #3b82f6 0%, #84cc16 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    marginBottom: '20px', fontSize: '1.8rem', letterSpacing: '-1px', textTransform: 'uppercase'
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

                  <p style={{ color: '#e2e8f0', lineHeight: '1.7', marginBottom: '12px', fontWeight: '500' }}>{event.description}</p>
                  <p style={{ color: '#93c5fd', marginBottom: 16, fontWeight: 600 }}>
                    Remaining: {remainingCapacity(event)} / {event.capacity}
                  </p>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <span style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', color: 'white', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{event.category}</span>
                    <span style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', color: 'white', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{event.ticketType === 'free' ? 'FREE' : 'PAID'}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)';
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(37, 99, 235, 0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(59, 130, 246, 0.4)';
                      }}
                      style={{
                        flex: 1, padding: '15px 25px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                        color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '700',
                        cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px',
                        boxShadow: '0 5px 20px rgba(59, 130, 246, 0.4)', transition: 'all 0.3s ease'
                      }}
                    >View Details</button>

                    <button
                      onClick={() => claimTicket(event)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(5, 150, 105, 0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(16, 185, 129, 0.4)';
                      }}
                      style={{
                        flex: 1, padding: '15px 25px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '700',
                        cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px',
                        boxShadow: '0 5px 20px rgba(16, 185, 129, 0.4)', transition: 'all 0.3s ease'
                      }}
                    >Save/Claim</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Camera QR Scanner Modal */}
    {scannerOpen && (
      <QRScanner
        onDetected={onQRDetected}
        onClose={() => setScannerOpen(false)}
      />
    )}
  );
}

/* ---------------------- Small UI piece ----------------------- */
function Stat({ label, value }) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, padding: 16 }}>
      <div style={{ color: '#9ca3af' }}>{label}</div>
      <div style={{ color: 'white', fontSize: 24, fontWeight: 800 }}>{value}</div>
    </div>
  );
}


