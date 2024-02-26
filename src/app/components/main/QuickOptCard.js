/* 
    Cards property should be an array of objects
    Each card object should have an image (img), title text (title), description text (description), button text (btn), and a callback function for the button (action)
*/

import Image from "next/image";

export default function QuickOptCards({ cards }) {
  return (
    <section className="quickopt-container">
      {cards.map((c) => (
        <Card key={c.title} card={c} />
      ))}
    </section>
  );
}

function Card({ card }) {
  return (
    <div className="quickopt-card">
      <Image src={card.img} alt="illustration" />
      <p className="title">{card.title}</p>
      <p className="description">{card.description}</p>
      <button
        onClick={card.action}
        className="secondary-btn hover scale"
        style={{ fontSize: "1em" }}
      >
        {card.btn}
      </button>
    </div>
  );
}
