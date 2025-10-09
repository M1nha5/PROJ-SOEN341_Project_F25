import React from 'react';

export default function EventDetails({ event, setSelectedEvent }) {
return (
<div style={{
minHeight: '100vh',
background: '#0f1729',
padding: '60px 40px',
position: 'relative',
fontFamily: "'Space Grotesk', sans-serif"
}}>
<div style={{
maxWidth: '900px',
margin: '0 auto',
position: 'relative',
zIndex: 1
}}>
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

<div style={{
background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%)',
border: '3px solid transparent',
borderRadius: '25px',
padding: '50px',
boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
position: 'relative',
transform: 'rotate(-0.5deg)',
backgroundImage: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%), linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
backgroundOrigin: 'border-box',
backgroundClip: 'padding-box, border-box'
}}>
<h1 style={{
fontFamily: "'Archivo Black', sans-serif",
background: 'linear-gradient(135deg, #3b82f6 0%, #84cc16 100%)',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent',
fontSize: '3rem',
marginBottom: '30px',
letterSpacing: '-2px',
textTransform: 'uppercase'
}}>{event.title}</h1>

<div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '2px solid rgba(6, 182, 212, 0.3)' }}>
<span style={{
padding: '8px 16px',
background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
color: 'white',
borderRadius: '25px',
fontSize: '0.9rem',
fontWeight: '700',
textTransform: 'uppercase',
letterSpacing: '1px',
display: 'inline-block'
}}>{event.category}</span>
</div>

<div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '2px solid rgba(6, 182, 212, 0.3)' }}>
{[
{ label: '📅 Date:', value: event.date },
{ label: '🕐 Time:', value: event.time },
{ label: '📍 Location:', value: event.location },
{ label: '🏢 Organization:', value: event.organization }
].map((item, i) => (
<div key={i} style={{ display: 'flex', marginBottom: '15px' }}>
<strong style={{ color: '#3b82f6', minWidth: '170px', fontWeight: '700', fontSize: '1.1rem' }}>{item.label}</strong>
<span style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1.1rem' }}>{item.value}</span>
</div>
))}
</div>

<div style={{ marginBottom: '30px' }}>
<h3 style={{ color: '#06b6d4', marginBottom: '15px', fontSize: '1.6rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</h3>
<p style={{ color: '#e2e8f0', lineHeight: '1.8', fontSize: '1.1rem', fontWeight: '500' }}>{event.description}</p>
</div>

<div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
<button style={{
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
}}>Save to Calendar</button>
<button style={{
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
}}>Claim Ticket</button>
</div>
</div>
</div>
</div>
);
}