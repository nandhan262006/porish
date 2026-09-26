import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-8">
      <div className="thin-rule mx-6 md:mx-10" />
      <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row md:px-10">
        <Image
          src="/logo.png"
          alt="Phorish Shoots"
          width={112}
          height={37}
          className="h-9 w-auto"
        />
        <p className="eyebrow">Documentary | Candid | Editorial | Filmy</p>
        <a
          href="https://www.instagram.com/phorish_shoots/"
          target="_blank"
          rel="noreferrer"
          className="nav-link"
        >
          Instagram ↗
        </a>
      </div>
    </footer>
  );
}
