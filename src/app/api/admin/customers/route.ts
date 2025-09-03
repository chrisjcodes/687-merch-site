import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    // Build search condition
    let searchCondition = {};
    if (search) {
      searchCondition = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
        ]
      };
    }

    // Get customers with aggregated data using raw SQL for better performance
    let customers;
    if (search) {
      customers = await prisma.$queryRaw`
        SELECT 
          c.id,
          c.name,
          c.email,
          c.company,
          c."createdAt",
          COALESCE(job_stats.total_orders, 0)::int as "totalOrders",
          COALESCE(item_stats.total_items, 0)::int as "totalItems",
          job_stats.last_order_at as "lastOrderAt"
        FROM customers c
        LEFT JOIN (
          SELECT 
            "customerId",
            COUNT(*)::int as total_orders,
            MAX("createdAt") as last_order_at
          FROM jobs 
          GROUP BY "customerId"
        ) job_stats ON c.id = job_stats."customerId"
        LEFT JOIN (
          SELECT 
            "customerId",
            COUNT(*)::int as total_items
          FROM item_templates 
          WHERE "isActive" = true
          GROUP BY "customerId"
        ) item_stats ON c.id = item_stats."customerId"
        WHERE (
          c.name ILIKE ${`%${search}%`} OR 
          c.email ILIKE ${`%${search}%`} OR 
          c.company ILIKE ${`%${search}%`}
        )
        ORDER BY 
          job_stats.last_order_at DESC NULLS LAST,
          c."createdAt" DESC
        OFFSET ${page * pageSize}
        LIMIT ${pageSize}
      `;
    } else {
      customers = await prisma.$queryRaw`
        SELECT 
          c.id,
          c.name,
          c.email,
          c.company,
          c."createdAt",
          COALESCE(job_stats.total_orders, 0)::int as "totalOrders",
          COALESCE(item_stats.total_items, 0)::int as "totalItems",
          job_stats.last_order_at as "lastOrderAt"
        FROM customers c
        LEFT JOIN (
          SELECT 
            "customerId",
            COUNT(*)::int as total_orders,
            MAX("createdAt") as last_order_at
          FROM jobs 
          GROUP BY "customerId"
        ) job_stats ON c.id = job_stats."customerId"
        LEFT JOIN (
          SELECT 
            "customerId",
            COUNT(*)::int as total_items
          FROM item_templates 
          WHERE "isActive" = true
          GROUP BY "customerId"
        ) item_stats ON c.id = item_stats."customerId"
        ORDER BY 
          job_stats.last_order_at DESC NULLS LAST,
          c."createdAt" DESC
        OFFSET ${page * pageSize}
        LIMIT ${pageSize}
      `;
    }

    // Get total count for pagination
    let totalCountResult;
    if (search) {
      [totalCountResult] = await prisma.$queryRaw`
        SELECT COUNT(*)::int as total
        FROM customers c
        WHERE (
          c.name ILIKE ${`%${search}%`} OR 
          c.email ILIKE ${`%${search}%`} OR 
          c.company ILIKE ${`%${search}%`}
        )
      `;
    } else {
      [totalCountResult] = await prisma.$queryRaw`
        SELECT COUNT(*)::int as total
        FROM customers c
      `;
    }
    const totalCount = totalCountResult?.total || 0;

    return NextResponse.json({
      customers,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}