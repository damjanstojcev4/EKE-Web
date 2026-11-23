const words = ["Engage.", "Empower.", "Transform."];

export default function HeroHeadline() {
  return (
    <h1 className="hero-title hero-title-animated">
      <span className="sr-only">
        Education That Engage. Empower. Transform.
      </span>
      <span aria-hidden="true" className="hero-heading-visual">
        <span className="hero-heading-line">Education That</span>
        <span className="hero-heading-line hero-heading-middle">
          <span className="hero-word-window">
              {words.map((word) => (
                <span className="hero-word" key={word}>
                  {word}
                </span>
              ))}
          </span>
        </span>
      </span>
    </h1>
  );
}
