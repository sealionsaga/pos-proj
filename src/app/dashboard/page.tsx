'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import type { SalesSummary } from '../../types';
import Nav from '../../components/Nav';

export default function Dashboard() {
  const summary = useQuery(api.transactions.getSalesSummary) as SalesSummary | undefined;

  if (!summary) return <div>Loading...</div>;

  return (
    <div>
      <Nav />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${summary.totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary.totalSales}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Best Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {summary.bestSelling.slice(0, 3).map((item: { productId: string; count: number }, index: number) => (
                  <li key={index}>Product {item.productId}: {item.count} sold</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
