import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link href="/" aria-label="Logo" title="Logo">
      <div className="relative h-12 3xl:h-20 w-32 3xl:w-48">
        <Image
          src="/logo.svg"
          alt="Logo"
          fill
          sizes="128px"
          className="object-contain"
          priority
          quality={100}
        />
      </div>
    </Link>
  );
}

export default Logo;
