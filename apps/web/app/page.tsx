import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Healthcare EDI Parser & Validator</h1>
      <p>Upload 837, 835, or 834 files and get parse, validation, and AI guidance.</p>
      <Link href="/upload">Go to Upload</Link>
    </main>
  );
}
