import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function Nav() {
  return (
    <nav className="bg-white shadow p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
          <Link href="/products" className="text-gray-700 hover:text-gray-900">Products</Link>
          <Link href="/cart" className="text-gray-700 hover:text-gray-900">Cart</Link>
          <Link href="/transactions" className="text-gray-700 hover:text-gray-900">Transactions</Link>
        </div>
        <UserButton />
      </div>
    </nav>
  );
}
