import { useEffect, useState } from 'react';
import { adminLogin, getDashboard, updateService } from '../api.js';

const fmt = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [login, setLogin] = useState({ email: '', password: '' });
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('bookings');
  const [error, setError] = useState('');

  const load = () => getDashboard().then(setData).catch((e) => {
    setError(e.message);
    localStorage.removeItem('adminToken');
    setLoggedIn(false);
  });

  useEffect(() => { if (loggedIn) load(); }, [loggedIn]);

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await adminLogin(login);
      localStorage.setItem('adminToken', token);
      setError('');
      setLoggedIn(true);
    } catch (err) { setError(err.message); }
  };

  const logout = () => { localStorage.removeItem('adminToken'); setLoggedIn(false); setData(null); };

  const savePrice = async (e, service) => {
    e.preventDefault();
    const price = new FormData(e.target).get('price');
    await updateService(service._id, { price });
    load();
  };

  if (!loggedIn) {
    return (
      <section className="section narrow">
        <h1>Admin login</h1>
        <form onSubmit={submitLogin} className="form">
          <label>Email<input type="email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} required /></label>
          <label>Password<input type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} required /></label>
          <button className="btn">Log in</button>
          {error && <p className="error">{error}</p>}
        </form>
      </section>
    );
  }

  if (!data) return <section className="section narrow"><p>Loading</p></section>;

  return (
    <section className="section admin">
      <div className="admin-head">
        <h1>Dashboard</h1>
        <button className="btn btn-small" onClick={logout}>Log out</button>
      </div>
      <div className="stats">
        <div><strong>&#8377;{data.revenue.toLocaleString('en-IN')}</strong><span>Revenue</span></div>
        <div><strong>{data.paidCount}</strong><span>Paid bookings</span></div>
        <div><strong>{data.messages.length}</strong><span>Messages</span></div>
      </div>
      <div className="tabs">
        {['bookings', 'messages', 'services'].map((t) => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div className="table-wrap"><table>
          <thead><tr><th>Client</th><th>Session</th><th>Date</th><th>Format</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>{data.bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.name}<br /><small>{b.email}</small></td>
              <td>{b.service?.title}</td><td>{fmt(b.date)}</td><td>{b.mode}</td>
              <td>&#8377;{b.amount}</td><td className={`status ${b.status}`}>{b.status}</td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      {tab === 'messages' && data.messages.map((m) => (
        <article className="msg" key={m._id}>
          <strong>{m.name}</strong> <small>{m.email} | {fmt(m.createdAt)}</small>
          <p>{m.message}</p>
        </article>
      ))}

      {tab === 'services' && data.services.map((s) => (
        <form className="price-row" key={s._id} onSubmit={(e) => savePrice(e, s)}>
          <span>{s.title}</span>
          <input name="price" type="number" min="1" defaultValue={s.price} />
          <button className="btn btn-small">Save price</button>
        </form>
      ))}
    </section>
  );
}
