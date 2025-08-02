import Link from "next/link";
import AuthButton from "../AuthButton/AuthButton";


export default function Header() {
  return (
    <header className="bg-card-background border-b border-card-border">
      <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg">
          Афиша Саарланда
        </Link>
        <div>
          {/* Этот компонент у нас уже есть из старого проекта */}
          <AuthButton />
        </div>
      </nav>
    </header>
  );
}