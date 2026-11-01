import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getServices, createOrder, verifyPayment } from '../api.js';

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function Book() {
  const [params] = useSearchParams();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ serviceId: params.get('service') || '', name: '', email: '', date: '', mode: 'online', note: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getServices().then((list) => {
      setServices(list);
      setForm((f) => ({ ...f, serviceId: f.serviceId || list[0]?._id || '' }));
    }).catch((e) => setStatus({ type: 'error', text: e.message }));
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const selected = services.find((s) => s._id === form.serviceId);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus({ type: '', text: '' });
    try {
      if (!(await loadRazorpay())) throw new Error('Payment window could not load. Check your connection.');
      const { order, keyId } = await createOrder(form);
      new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Sitaraah Wellness',
        description: selected?.title,
        prefill: { name: form.name, email: form.email },
        theme: { color: '#B66F55' },
        handler: async (response) => {
          try {
            const result = await verifyPayment(response);
            setStatus({ type: 'success', text: result.message });
          } catch (err) {
            setStatus({ type: 'error', text: err.message });
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      }).open();
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
    setBusy(false);
  };

  return (
    <section className="section narrow">
      <h1>Book a session</h1>
      <form onSubmit={submit} className="form">
        <label>Session
          <select name="serviceId" value={form.serviceId} onChange={change}>
            {services.map((s) => <option key={s._id} value={s._id}>{s.title} - &#8377;{s.price}</option>)}
          </select>
        </label>
        <label>Your name<input name="name" value={form.name} onChange={change} required /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={change} required /></label>
        <label>Preferred date and time<input type="datetime-local" name="date" value={form.date} onChange={change} required /></label>
        <label>Format
          <select name="mode" value={form.mode} onChange={change}>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </label>
        <label>Anything we should know (optional)<textarea name="note" rows="3" maxLength="500" value={form.note} onChange={change} /></label>
        <button className="btn" disabled={busy}>{busy ? 'Please wait' : `Pay${selected ? ` \u20B9${selected.price}` : ''} and book`}</button>
        {status.text && <p className={status.type}>{status.text}</p>}
        <p className="note">Payments are processed securely by Razorpay. Card details never reach our server.</p>
      </form>
    </section>
  );
}
