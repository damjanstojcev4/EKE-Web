const words = ["People", "Ideas", "Communities", "People"];

export default function HeroHeadline() {
  return (
    <h1 className="hero-title hero-title-animated">
      <span className="sr-only">
        Learning That Moves People, Ideas and Communities Forward
      </span>
      <span aria-hidden="true" className="hero-heading-visual">
        <span className="hero-heading-line">Learning That</span>
        <span className="hero-heading-line hero-heading-middle">
          <span>Moves</span>{" "}
          <span className="hero-word-window">
            <span className="hero-word-track">
              {words.map((word, index) => (
                <span className="hero-word" key={`${word}-${index}`}>
                  {word}
                </span>
              ))}
            </span>
          </span>
        </span>
        <span className="hero-heading-line">Forward</span>
      </span>
    </h1>
  );
}
