const Logo = ({ size = "text-2xl", onClick }) => (
  <span
    onClick={onClick}
    data-testid="logo-link"
    className={`inline-flex items-baseline font-display ${size} font-black tracking-tighter select-none cursor-pointer`}
  >
    <span className="text-white">RH</span>
    <span className="text-accent">11</span>
    <span className="ml-1.5 inline-block h-1.5 w-1.5 self-center bg-accent animate-pulse" aria-hidden="true" />
  </span>
);

export default Logo;
