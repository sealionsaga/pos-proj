import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <header className="w-full p-4 bg-white shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">POS App</h1>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <SignedOut>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome to POS App</h2>
            <p className="mb-8">Please sign in to access the application.</p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Sign In
              </button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
            <p className="mb-8">Access your POS application.</p>
            <div className="space-x-4">
              <Link href="/dashboard">
                <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                  Dashboard
                </button>
              </Link>
              <Link href="/products">
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  Products Management
                </button>
              </Link>
              <Link href="/pos">
                <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                  POS Terminal
                </button>
              </Link>
            </div>
          </div>
        </SignedIn>
      </main>
    </div>
  );
}
