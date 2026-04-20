import logo from "../../assets/brand/logo.png";

export default function Logo({ className="max-w-[120px] dark:brightness-110 transition-all", alt = "Logo", onClick, href }) {
  const img = (
    <img
      src={logo}
      alt={alt}
      className={`object-contain cursor-pointer ${className}`}
    />
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {img}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="inline-block">
      {img}
    </button>
  );
}
