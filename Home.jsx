import { Link } from 'react-router-dom';
import { Moons } from '../App.jsx';

const offerings = [
  { to: '/services', title: 'Sound Healing', text: 'Bowls, vibration and guided meditation, online or in person.', img: '/images/bowl.jpg' },
  { to: '/services', title: 'Feminine Embodiment', text: 'Journaling, sound and a deeper understanding of your body.', img: '/images/linen.jpg' },
  { to: '/services', title: 'Inner Child Healing', text: 'Journaling, music and rhythmic dance to release what you carry.', img: '/images/seated.jpg' },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <img src="/images/logo-emblem.png" alt="" className="hero-emblem" />
        <h1>Sitaraah</h1>
        <p className="hero-sub">Wellness</p>
        <Moons />
        <p className="hero-line">Reconnect with your body, mind and soul.</p>
        <Link to="/book" className="btn">Book a session</Link>
      </section>

      <section className="section">
        <h2>Ways to heal</h2>
        <div className="grid3">
          {offerings.map((o) => (
            <Link to={o.to} key={o.title} className="tile">
              <img src={o.img} alt="" />
              <h3>{o.title}</h3>
              <p>{o.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="split">
          <img src="/images/hero-deck.jpg" alt="Yoga mats on a forest deck" />
          <div>
            <h2>Routine to Rhythm</h2>
            <p>Our affirmation cards help you shape a daily routine that moves in rhythm with your own body.</p>
            <Link to="/cards" className="btn btn-light">Meet the cards</Link>
          </div>
        </div>
      </section>
    </>
  );
}
