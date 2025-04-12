import Logo from "./Logo";

function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-screen h-20 3xl:h-28 bg-white shadow-sm flex items-center"
      aria-label="Header"
      role="banner"
    >
      <div className="ml-8 md:ml-20">
        <Logo />
      </div>
    </header>
  );
}

export default Header;
