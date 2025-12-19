'use client';

import { useEffect, useState } from 'react';
import { Card, Title, Text, Grid, AreaChart } from '@tremor/react';
import { useRouter } from 'next/navigation';

type DashboardStats = {
  totalSignups: number;
  totalCustomers: number;
  totalCourses: number;
  totalLessons: number;
  recentSignups: number;
  activeUsers: number;
  statsByDate: Array<{
    date: string;
    signups: number;
    enrollments: number;
  }>;
};

type ApiResponse = {
  data?: DashboardStats;
  error?: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/admin/dashboard', {
          credentials: 'include', // Include cookies for auth
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const result: ApiResponse = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch dashboard data');
        }
        
        if (!result.data) {
          throw new Error('No data received from server');
        }
        
        setStats(result.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        
        if (errorMessage.includes('401') || errorMessage.includes('403')) {
          // Redirect to login if unauthorized
          router.push('/login');
          return;
        }
        
        setError(`Failed to load dashboard data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [router]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">No data available. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <Title className="text-2xl font-bold text-gray-900">Admin Dashboard</Title>
        <Text className="text-gray-600">Overview of your platform's performance</Text>
      </div>

      <Grid numItemsMd={2} numItemsLg={4} className="gap-4 md:gap-6">
        <StatCard 
          title="Total Users" 
          value={formatNumber(stats.totalSignups)}
          description="All registered users"
          icon={<UsersIcon />}
        />
        <StatCard 
          title="Active Users" 
          value={formatNumber(stats.activeUsers)}
          description="Active in last 7 days"
          icon={<ActivityIcon />}
        />
        <StatCard 
          title="Total Courses" 
          value={formatNumber(stats.totalCourses)}
          description="Published courses"
          icon={<BookOpenIcon />}
        />
        <StatCard 
          title="Total Lessons" 
          value={formatNumber(stats.totalLessons)}
          description="Published lessons"
          icon={<DocumentTextIcon />}
        />
      </Grid>

      {stats.statsByDate.length > 0 && (
        <div className="mt-8">
          <Card className="p-4 md:p-6">
            <div className="mb-4">
              <Title>User Growth (Last 30 Days)</Title>
              <Text>Track new signups and enrollments over time</Text>
            </div>
            <div className="h-80">
              <AreaChart
                data={stats.statsByDate}
                categories={['signups', 'enrollments']}
                index="date"
                colors={['indigo', 'fuchsia']}
                valueFormatter={(value: number) => value.toLocaleString()}
                yAxisWidth={60}
                showAnimation={true}
                showLegend={true}
                showGridLines={true}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
};

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card className="h-full p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start">
        {icon && (
          <div className="flex-shrink-0 p-3 mr-4 bg-blue-50 rounded-lg text-blue-600">
            {icon}
          </div>
        )}
        <div>
          <Text className="text-sm font-medium text-gray-500">{title}</Text>
          <h3 className="mt-1 text-2xl font-semibold text-gray-900">{value}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Card>
  );
}

// Simple icon components (you can replace these with your preferred icon library)
function UsersIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function DocumentTextIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
