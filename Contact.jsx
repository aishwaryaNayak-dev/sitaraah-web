import { useState } from 'react';
import { sendMessage, INSTAGRAM_URL, EMAIL } from '../api.js';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const result = await sendMessage(form);
      setStatus({ type: 'success', text: result.message });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  };

  return (
    <section className="section narrow">
      <h1>Contact</h1>
      <p>Write to us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or find us on <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>.</p>
      <form onSubmit={submit} className="form">
        <label>Your name<input name="name" value={form.name} onChange={change} required /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={change} required /></label>
        <label>Message<textarea name="message" rows="5" maxLength="1000" value={form.message} onChange={change} required /></label>
        <button className="btn">Send message</button>
        {status.text && <p className={status.type}>{status.text}</p>}
      </form>
    </section>
  );
}
