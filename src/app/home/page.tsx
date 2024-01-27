import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-10 bg-black">
      <h1 className="text-white">
        Home Page
        <br />
        <Link href="/login">Login</Link>
      </h1>
    </div>
  );
}
