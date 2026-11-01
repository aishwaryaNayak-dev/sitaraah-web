import { INSTAGRAM_URL } from '../api.js';

export default function Cards() {
  return (
    <section className="section narrow">
      <div className="split">
        <img src="/images/hands.jpg" alt="Hands in prayer" />
        <div>
          <h1>Routine to Rhythm</h1>
          <p>Sitaraah's affirmation cards are built around one idea: your routine should move in rhythm with your own body.</p>
          <p>Draw a card each morning, read it slowly and let it set the tone for your day.</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="btn">Buy now</a>
          <p className="note">You will be taken to our Instagram page to place your order.</p>
        </div>
      </div>
    </section>
  );
}
