import React, { useState, useEffect } from 'react';
import { 
  LogOut, PlusCircle, Clock, AlertTriangle, ChevronLeft, 
  Wrench, CheckCircle, MapPin, Trash2, Filter, Info, RefreshCw
} from 'lucide-react';

// --- INDEPENDENT CSS FOR EACH SCREEN ---
const loginStyles = {
  wrapper: { height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' },
  card: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '20px', width: '90%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' },
  roleBtn: (isSelected) => ({ 
    flex: 1, padding: '10px', cursor: 'pointer', borderRadius: '8px', 
    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0', 
    background: isSelected ? '#eff6ff' : '#fff', fontWeight: 'bold', transition: 'all 0.2s' 
  }),
  error: { color: '#ef4444', fontSize: '13px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'left' }
};

const studentStyles = {
  wrapper: { minHeight: '100vh', width: '100vw', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column' },
  nav: { backgroundColor: '#ffffff', height: '70px', padding: '0 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #bae6fd' },
  accent: '#0369a1'
};

const technicianStyles = {
  wrapper: { minHeight: '100vh', width: '100vw', backgroundColor: '#fdf2f8', display: 'flex', flexDirection: 'column' },
  nav: { backgroundColor: '#ffffff', height: '70px', padding: '0 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fbcfe8' },
  card: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #fce7f3', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  accent: '#be185d'
};

const adminStyles = {
  wrapper: { minHeight: '100vh', width: '100vw', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' },
  nav: { backgroundColor: '#1e293b', height: '70px', padding: '0 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' },
  statCard: (color) => ({ flex: '1 1 250px', backgroundColor: '#fff', padding: '25px', borderRadius: '16px', borderLeft: '6px solid ' + color, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }),
  accent: '#2563eb'
};

const MITSApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('student'); 
  const [view, setView] = useState('dashboard');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // DYNAMIC STATE WITH PERSISTENCE
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('mits_data');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'TKT-2024-001', category: 'Electrical', location: 'Block A Room 204', priority: 'HIGH', status: 'IN PROGRESS', time: '18h 32m', desc: 'Ceiling fan is making a loud noise.' },
      { id: 'TKT-2024-002', category: 'Plumbing', location: 'Block B Room 108', priority: 'MEDIUM', status: 'RESOLVED', time: '2h 15m', desc: 'Washroom tap leaking.' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mits_data', JSON.stringify(complaints));
  }, [complaints]);

  if (!isLoggedIn) return <LoginPage selectedRole={role} setRole={setRole} onLoginSuccess={() => setIsLoggedIn(true)} />;

  return (
    <>
      {role === 'student' && <StudentScreen view={view} setView={setView} complaints={complaints} setComplaints={setComplaints} onLogout={() => setIsLoggedIn(false)} />}
      {role === 'technician' && <TechnicianScreen view={view} setView={setView} complaints={complaints} setComplaints={setComplaints} selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} onLogout={() => setIsLoggedIn(false)} />}
      {role === 'admin' && <AdminScreen complaints={complaints} setComplaints={setComplaints} onLogout={() => setIsLoggedIn(false)} />}
    </>
  );
};

// --- LOGIN PAGE ---
const LoginPage = ({ selectedRole, setRole, onLoginSuccess }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  
  // FIX: Generate initial CAPTCHA inside useState lazy initializer
  const [generatedCaptcha, setGeneratedCaptcha] = useState(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 5; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    return res;
  });
  
  const [error, setError] = useState('');

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 5; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedCaptcha(res);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!id || !password) {
      setError('ID and Password are required.');
      return;
    }
    if (captchaInput.toUpperCase() !== generatedCaptcha) {
      setError('Invalid CAPTCHA code.');
      refreshCaptcha();
      return;
    }
    onLoginSuccess();
  };

  return (
    <div style={loginStyles.wrapper}>
      <div style={loginStyles.card}>
        <div style={{ width: '60px', height: '60px', backgroundColor: '#f1f5f9', margin: '0 auto 15px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>LOGO</div>
        <h2 style={{ marginBottom: '25px' }}>Maintenance Issue Tracking System</h2>
        <form onSubmit={handleLogin}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Email / Registration ID</label>
            <input style={{ width: '100%', padding: '12px', marginTop: '5px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Enter email or ID" value={id} onChange={(e) => setId(e.target.value)} />
            
            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Password</label>
            <input type="password" style={{ width: '100%', padding: '12px', marginTop: '5px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>CAPTCHA</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
              <div style={{ flex: 1, background: '#f8fafc', padding: '10px', textAlign: 'center', borderRadius: '8px', border: '1px dashed #cbd5e1', fontWeight: 'bold', letterSpacing: '8px', fontSize: '18px' }}>{generatedCaptcha}</div>
              <button type="button" onClick={refreshCaptcha} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><RefreshCw size={20}/></button>
            </div>
            <input style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="Enter code" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} />
          </div>

          {error && <div style={loginStyles.error}>{error}</div>}

          <div style={{ display: 'flex', gap: '8px', marginBottom: '25px' }}>
            {['Student', 'Technician', 'Admin'].map(r => (
              <button key={r} type="button" onClick={() => setRole(r.toLowerCase())} style={loginStyles.roleBtn(selectedRole === r.toLowerCase())}>{r}</button>
            ))}
          </div>
          <button type="submit" style={{ width: '100%', padding: '15px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>LOGIN</button>
        </form>
      </div>
    </div>
  );
};

// --- STUDENT PORTAL ---
const StudentScreen = ({ view, setView, complaints, setComplaints, onLogout }) => {
  const [form, setForm] = useState({ category: 'Electrical', block: 'Block A', room: 'A-204', desc: '' });

  const handleRaiseIssue = (e) => {
    e.preventDefault();
    const newIssue = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category: form.category,
      location: `${form.block} Room ${form.room}`,
      status: 'NEW',
      time: '48h 00m',
      desc: form.desc
    };
    setComplaints([newIssue, ...complaints]);
    setView('dashboard');
  };

  if (view === 'report') return (
    <div style={studentStyles.wrapper}>
      <nav style={studentStyles.nav}>
        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>MITS Portal</div>
        <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: studentStyles.accent, fontWeight: 'bold', cursor: 'pointer' }}>← BACK</button>
      </nav>
      <main style={{ padding: '40px 5%' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', padding: '35px', borderRadius: '20px', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }}>
          <h2>Report New Issue</h2>
          <form onSubmit={handleRaiseIssue}>
            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Issue Category</label>
            <select style={{ width: '100%', padding: '12px', marginTop: '5px', marginBottom: '20px' }} value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
              <option>Electrical</option><option>Plumbing</option><option>WiFi</option>
            </select>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
               <div style={{ flex: 1 }}>
                 <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Hostel Block</label>
                 <input style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} value={form.block} onChange={(e) => setForm({...form, block: e.target.value})} />
               </div>
               <div style={{ flex: 1 }}>
                 <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Room Number</label>
                 <input style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} value={form.room} onChange={(e) => setForm({...form, room: e.target.value})} />
               </div>
            </div>
            <textarea style={{ width: '100%', height: '120px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} placeholder="Describe the problem..." required value={form.desc} onChange={(e) => setForm({...form, desc: e.target.value})} />
            <button type="submit" style={{ width: '100%', padding: '15px', marginTop: '25px', background: studentStyles.accent, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>SUBMIT TICKET</button>
          </form>
        </div>
      </main>
    </div>
  );

  return (
    <div style={studentStyles.wrapper}>
      <nav style={studentStyles.nav}>
        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>MITS Student Portal</div>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LOGOUT</button>
      </nav>
      <main style={{ padding: '40px 5%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2 style={{ margin: 0 }}>My Issues</h2>
          <button onClick={() => setView('report')} style={{ padding: '12px 24px', background: studentStyles.accent, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+ REPORT NEW ISSUE</button>
        </div>
        <div style={{ backgroundColor: '#fff', borderRadius: '15px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr style={{ textAlign: 'left' }}><th style={{ padding: '15px' }}>Ticket ID</th><th style={{ padding: '15px' }}>Category</th><th style={{ padding: '15px' }}>Status</th></tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}><td style={{ padding: '15px', fontWeight: 'bold' }}>{c.id}</td><td style={{ padding: '15px' }}>{c.category}</td><td style={{ padding: '15px' }}><span style={{ color: c.status === 'RESOLVED' ? '#16a34a' : '#2563eb', fontWeight: 'bold' }}>{c.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

// --- TECHNICIAN PORTAL ---
const TechnicianScreen = ({ view, setView, complaints, setComplaints, selectedTicket, setSelectedTicket, onLogout }) => {
  const updateStatus = (id, next) => setComplaints(complaints.map(c => c.id === id ? { ...c, status: next } : c));

  if (view === 'details' && selectedTicket) return (
    <div style={technicianStyles.wrapper}>
      <nav style={technicianStyles.nav}><div style={{ fontWeight: 'bold', fontSize: '20px' }}>Technician Workspace</div><button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: technicianStyles.accent, fontWeight: 'bold', cursor: 'pointer' }}>← BACK</button></nav>
      <main style={{ padding: '40px 5%' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '35px', borderRadius: '20px', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>{selectedTicket.id} | {selectedTicket.category}</h2>
          <p style={{ fontWeight: 'bold', color: '#64748b' }}><MapPin size={16}/> {selectedTicket.location}</p>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', margin: '20px 0' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Issue Description</h4>
            <p>{selectedTicket.desc}</p>
          </div>
          <button onClick={() => { updateStatus(selectedTicket.id, 'RESOLVED'); setView('dashboard'); }} style={{ width: '100%', padding: '15px', background: technicianStyles.accent, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>MARK RESOLVED</button>
        </div>
      </main>
    </div>
  );

  return (
    <div style={technicianStyles.wrapper}>
      <nav style={technicianStyles.nav}><div style={{ fontWeight: 'bold', fontSize: '20px' }}>MITS Technician</div><button onClick={onLogout} style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>LOGOUT</button></nav>
      <main style={{ padding: '40px 5%' }}>
        <h2>Assigned Tasks</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {complaints.filter(c => c.status !== 'RESOLVED').map(t => (
            <div key={t.id} style={technicianStyles.card}>
              <h4 style={{ color: technicianStyles.accent }}>{t.id}</h4>
              <p style={{ fontWeight: 'bold' }}>{t.category}</p>
              <button onClick={() => { setSelectedTicket(t); setView('details'); }} style={{ width: '100%', padding: '10px', background: technicianStyles.accent, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>VIEW DETAILS</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// --- ADMIN PORTAL ---
const AdminScreen = ({ complaints, onLogout }) => (
  <div style={adminStyles.wrapper}>
    <nav style={adminStyles.nav}><div style={{ fontWeight: 'bold', fontSize: '20px' }}>Admin Dashboard</div><button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>LOGOUT</button></nav>
    <main style={{ padding: '40px 5%' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={adminStyles.statCard('#3b82f6')}><p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#64748b' }}>OPEN TICKETS</p><h2 style={{ fontSize: '32px', margin: '4px 0' }}>{complaints.filter(c => c.status !== 'RESOLVED').length}</h2></div>
        <div style={adminStyles.statCard('#ef4444')}><p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#64748b' }}>SLA BREACHES</p><h2 style={{ fontSize: '32px', margin: '4px 0' }}>1</h2></div>
      </div>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9' }}><tr><th style={{ padding: '15px', textAlign: 'left' }}>Ticket</th><th style={{ padding: '15px', textAlign: 'left' }}>Status</th></tr></thead>
          <tbody>
            {complaints.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}><td style={{ padding: '15px' }}>{t.id}</td><td style={{ padding: '15px', fontWeight: 'bold' }}>{t.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  </div>
);

export default MITSApp;