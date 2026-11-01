import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../api.js';

const long = {
  'sound-healing': 'Shweta guides you through sound healing and guided meditation in online and offline sessions. Bowls and vibration help your system soften, while chakra alignment brings you back to centre.',
  'feminine-embodiment': 'Using sound bowls, journaling and an understanding of the women\'s body, this work helps you balance the Shiv and Shakti within you and feel at home in your own body.',
  'inner-child-healing': 'You journal your inner child out, then move through rhythmic dancing and music. It is a playful, honest way to release old patterns and make space for joy.',
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getServices().then(setServices).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="section narrow">
      <h1>Services</h1>
      {error && <p className="error">{error}</p>}
      {services.map((s) => (
        <article className="service" key={s._id}>
          <h2>{s.title}</h2>
          <p>{long[s.slug] || s.summary}</p>
          <ul>{s.details.map((d) => <li key={d}>{d}</li>)}</ul>
          <p className="price">&#8377;{s.price.toLocaleString('en-IN')} &nbsp;|&nbsp; {s.duration}</p>
          <Link to={`/book?service=${s._id}`} className="btn">Book this session</Link>
        </article>
      ))}
    </section>
  );
}
