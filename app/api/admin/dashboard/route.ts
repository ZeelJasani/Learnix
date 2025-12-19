import { NextResponse } from 'next/server';
import { adminGetDashboardStats } from '@/app/data/admin/admin-get-dashboard-state';
import { requireAdmin } from "@/app/data/admin/require-admin";

export async function GET() {
  try {
    await requireAdmin();
    const stats = await adminGetDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in GET /api/admin/dashboard:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to fetch dashboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    );
  }
}

// Add CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}
