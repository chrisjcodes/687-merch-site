import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: customerId } = await params;

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true, name: true, email: true, company: true }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get query parameters for pagination and search
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortBy = searchParams.get('sortBy') || 'lastOrderedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Get total count for pagination
    let totalCountResult;
    if (search) {
      [totalCountResult] = await prisma.$queryRaw`
        SELECT COUNT(*)::int as total
        FROM item_templates it
        JOIN products p ON it."productId" = p.id
        WHERE it."customerId" = ${customerId} 
          AND it."isActive" = true
          AND (
            it.name ILIKE ${`%${search}%`} OR 
            it.description ILIKE ${`%${search}%`} OR 
            p.name ILIKE ${`%${search}%`}
          )
      `;
    } else {
      [totalCountResult] = await prisma.$queryRaw`
        SELECT COUNT(*)::int as total
        FROM item_templates it
        JOIN products p ON it."productId" = p.id
        WHERE it."customerId" = ${customerId} 
          AND it."isActive" = true
      `;
    }
    const totalCount = totalCountResult?.total || 0;

    // Get items with related data using raw SQL
    let items;
    if (search) {
      if (sortBy === 'timesOrdered' && sortOrder === 'asc') {
        items = await prisma.$queryRaw`
          SELECT 
            it.id,
            it.name,
            it.description,
            it."timesOrdered",
            it."lastOrderedAt",
            it."createdAt",
            it."updatedAt",
            p.id as product_id,
            p.name as product_name,
            p.sku as product_sku,
            p."availableSizes",
            pv.id as variant_id,
            pv.name as variant_name,
            pv.sku as variant_sku,
            pv."colorHex",
            (
              SELECT COALESCE(SUM(ji.quantity), 0)::int 
              FROM job_items ji 
              WHERE ji."itemTemplateId" = it.id
            ) as total_quantity_ordered,
            (
              SELECT json_agg(
                json_build_object(
                  'jobId', j.id,
                  'status', j.status,
                  'quantity', ji.quantity,
                  'orderedAt', ji."createdAt"
                )
                ORDER BY ji."createdAt" DESC
              )
              FROM job_items ji
              JOIN jobs j ON ji."jobId" = j.id
              WHERE ji."itemTemplateId" = it.id
              LIMIT 10
            ) as recent_orders
          FROM item_templates it
          JOIN products p ON it."productId" = p.id
          LEFT JOIN product_variants pv ON it."variantId" = pv.id
          WHERE it."customerId" = ${customerId}
            AND it."isActive" = true
            AND (
              it.name ILIKE ${`%${search}%`} OR 
              it.description ILIKE ${`%${search}%`} OR 
              p.name ILIKE ${`%${search}%`}
            )
          ORDER BY it."timesOrdered" ASC, it."lastOrderedAt" DESC NULLS LAST
          OFFSET ${page * pageSize}
          LIMIT ${pageSize}
        `;
      } else if (sortBy === 'timesOrdered' && sortOrder === 'desc') {
        items = await prisma.$queryRaw`
          SELECT 
            it.id,
            it.name,
            it.description,
            it."timesOrdered",
            it."lastOrderedAt",
            it."createdAt",
            it."updatedAt",
            p.id as product_id,
            p.name as product_name,
            p.sku as product_sku,
            p."availableSizes",
            pv.id as variant_id,
            pv.name as variant_name,
            pv.sku as variant_sku,
            pv."colorHex",
            (
              SELECT COALESCE(SUM(ji.quantity), 0)::int 
              FROM job_items ji 
              WHERE ji."itemTemplateId" = it.id
            ) as total_quantity_ordered,
            (
              SELECT json_agg(
                json_build_object(
                  'jobId', j.id,
                  'status', j.status,
                  'quantity', ji.quantity,
                  'orderedAt', ji."createdAt"
                )
                ORDER BY ji."createdAt" DESC
              )
              FROM job_items ji
              JOIN jobs j ON ji."jobId" = j.id
              WHERE ji."itemTemplateId" = it.id
              LIMIT 10
            ) as recent_orders
          FROM item_templates it
          JOIN products p ON it."productId" = p.id
          LEFT JOIN product_variants pv ON it."variantId" = pv.id
          WHERE it."customerId" = ${customerId}
            AND it."isActive" = true
            AND (
              it.name ILIKE ${`%${search}%`} OR 
              it.description ILIKE ${`%${search}%`} OR 
              p.name ILIKE ${`%${search}%`}
            )
          ORDER BY it."timesOrdered" DESC, it."lastOrderedAt" DESC NULLS LAST
          OFFSET ${page * pageSize}
          LIMIT ${pageSize}
        `;
      } else if (sortOrder === 'asc') {
        items = await prisma.$queryRaw`
          SELECT 
            it.id,
            it.name,
            it.description,
            it."timesOrdered",
            it."lastOrderedAt",
            it."createdAt",
            it."updatedAt",
            p.id as product_id,
            p.name as product_name,
            p.sku as product_sku,
            p."availableSizes",
            pv.id as variant_id,
            pv.name as variant_name,
            pv.sku as variant_sku,
            pv."colorHex",
            (
              SELECT COALESCE(SUM(ji.quantity), 0)::int 
              FROM job_items ji 
              WHERE ji."itemTemplateId" = it.id
            ) as total_quantity_ordered,
            (
              SELECT json_agg(
                json_build_object(
                  'jobId', j.id,
                  'status', j.status,
                  'quantity', ji.quantity,
                  'orderedAt', ji."createdAt"
                )
                ORDER BY ji."createdAt" DESC
              )
              FROM job_items ji
              JOIN jobs j ON ji."jobId" = j.id
              WHERE ji."itemTemplateId" = it.id
              LIMIT 10
            ) as recent_orders
          FROM item_templates it
          JOIN products p ON it."productId" = p.id
          LEFT JOIN product_variants pv ON it."variantId" = pv.id
          WHERE it."customerId" = ${customerId}
            AND it."isActive" = true
            AND (
              it.name ILIKE ${`%${search}%`} OR 
              it.description ILIKE ${`%${search}%`} OR 
              p.name ILIKE ${`%${search}%`}
            )
          ORDER BY 
            it."lastOrderedAt" ASC NULLS LAST,
            it."timesOrdered" DESC
          OFFSET ${page * pageSize}
          LIMIT ${pageSize}
        `;
      } else {
        items = await prisma.$queryRaw`
          SELECT 
            it.id,
            it.name,
            it.description,
            it."timesOrdered",
            it."lastOrderedAt",
            it."createdAt",
            it."updatedAt",
            p.id as product_id,
            p.name as product_name,
            p.sku as product_sku,
            p."availableSizes",
            pv.id as variant_id,
            pv.name as variant_name,
            pv.sku as variant_sku,
            pv."colorHex",
            (
              SELECT COALESCE(SUM(ji.quantity), 0)::int 
              FROM job_items ji 
              WHERE ji."itemTemplateId" = it.id
            ) as total_quantity_ordered,
            (
              SELECT json_agg(
                json_build_object(
                  'jobId', j.id,
                  'status', j.status,
                  'quantity', ji.quantity,
                  'orderedAt', ji."createdAt"
                )
                ORDER BY ji."createdAt" DESC
              )
              FROM job_items ji
              JOIN jobs j ON ji."jobId" = j.id
              WHERE ji."itemTemplateId" = it.id
              LIMIT 10
            ) as recent_orders
          FROM item_templates it
          JOIN products p ON it."productId" = p.id
          LEFT JOIN product_variants pv ON it."variantId" = pv.id
          WHERE it."customerId" = ${customerId}
            AND it."isActive" = true
            AND (
              it.name ILIKE ${`%${search}%`} OR 
              it.description ILIKE ${`%${search}%`} OR 
              p.name ILIKE ${`%${search}%`}
            )
          ORDER BY 
            it."lastOrderedAt" DESC NULLS LAST,
            it."timesOrdered" DESC
          OFFSET ${page * pageSize}
          LIMIT ${pageSize}
        `;
      }
    } else {
      if (sortBy === 'timesOrdered' && sortOrder === 'desc') {
        items = await prisma.$queryRaw`
          SELECT 
            it.id,
            it.name,
            it.description,
            it."timesOrdered",
            it."lastOrderedAt",
            it."createdAt",
            it."updatedAt",
            p.id as product_id,
            p.name as product_name,
            p.sku as product_sku,
            p."availableSizes",
            pv.id as variant_id,
            pv.name as variant_name,
            pv.sku as variant_sku,
            pv."colorHex",
            (
              SELECT COALESCE(SUM(ji.quantity), 0)::int 
              FROM job_items ji 
              WHERE ji."itemTemplateId" = it.id
            ) as total_quantity_ordered,
            (
              SELECT json_agg(
                json_build_object(
                  'jobId', j.id,
                  'status', j.status,
                  'quantity', ji.quantity,
                  'orderedAt', ji."createdAt"
                )
                ORDER BY ji."createdAt" DESC
              )
              FROM job_items ji
              JOIN jobs j ON ji."jobId" = j.id
              WHERE ji."itemTemplateId" = it.id
              LIMIT 10
            ) as recent_orders
          FROM item_templates it
          JOIN products p ON it."productId" = p.id
          LEFT JOIN product_variants pv ON it."variantId" = pv.id
          WHERE it."customerId" = ${customerId}
            AND it."isActive" = true
          ORDER BY it."timesOrdered" DESC, it."lastOrderedAt" DESC NULLS LAST
          OFFSET ${page * pageSize}
          LIMIT ${pageSize}
        `;
      } else if (sortBy === 'timesOrdered' && sortOrder === 'asc') {
        items = await prisma.$queryRaw`
          SELECT 
            it.id,
            it.name,
            it.description,
            it."timesOrdered",
            it."lastOrderedAt",
            it."createdAt",
            it."updatedAt",
            p.id as product_id,
            p.name as product_name,
            p.sku as product_sku,
            p."availableSizes",
            pv.id as variant_id,
            pv.name as variant_name,
            pv.sku as variant_sku,
            pv."colorHex",
            (
              SELECT COALESCE(SUM(ji.quantity), 0)::int 
              FROM job_items ji 
              WHERE ji."itemTemplateId" = it.id
            ) as total_quantity_ordered,
            (
              SELECT json_agg(
                json_build_object(
                  'jobId', j.id,
                  'status', j.status,
                  'quantity', ji.quantity,
                  'orderedAt', ji."createdAt"
                )
                ORDER BY ji."createdAt" DESC
              )
              FROM job_items ji
              JOIN jobs j ON ji."jobId" = j.id
              WHERE ji."itemTemplateId" = it.id
              LIMIT 10
            ) as recent_orders
          FROM item_templates it
          JOIN products p ON it."productId" = p.id
          LEFT JOIN product_variants pv ON it."variantId" = pv.id
          WHERE it."customerId" = ${customerId}
            AND it."isActive" = true
          ORDER BY it."timesOrdered" ASC, it."lastOrderedAt" DESC NULLS LAST
          OFFSET ${page * pageSize}
          LIMIT ${pageSize}
        `;
      } else if (sortOrder === 'asc') {
        items = await prisma.$queryRaw`
          SELECT 
            it.id,
            it.name,
            it.description,
            it."timesOrdered",
            it."lastOrderedAt",
            it."createdAt",
            it."updatedAt",
            p.id as product_id,
            p.name as product_name,
            p.sku as product_sku,
            p."availableSizes",
            pv.id as variant_id,
            pv.name as variant_name,
            pv.sku as variant_sku,
            pv."colorHex",
            (
              SELECT COALESCE(SUM(ji.quantity), 0)::int 
              FROM job_items ji 
              WHERE ji."itemTemplateId" = it.id
            ) as total_quantity_ordered,
            (
              SELECT json_agg(
                json_build_object(
                  'jobId', j.id,
                  'status', j.status,
                  'quantity', ji.quantity,
                  'orderedAt', ji."createdAt"
                )
                ORDER BY ji."createdAt" DESC
              )
              FROM job_items ji
              JOIN jobs j ON ji."jobId" = j.id
              WHERE ji."itemTemplateId" = it.id
              LIMIT 10
            ) as recent_orders
          FROM item_templates it
          JOIN products p ON it."productId" = p.id
          LEFT JOIN product_variants pv ON it."variantId" = pv.id
          WHERE it."customerId" = ${customerId}
            AND it."isActive" = true
          ORDER BY 
            it."lastOrderedAt" ASC NULLS LAST,
            it."timesOrdered" DESC,
            it."createdAt" DESC
          OFFSET ${page * pageSize}
          LIMIT ${pageSize}
        `;
      } else {
        items = await prisma.$queryRaw`
          SELECT 
            it.id,
            it.name,
            it.description,
            it."timesOrdered",
            it."lastOrderedAt",
            it."createdAt",
            it."updatedAt",
            p.id as product_id,
            p.name as product_name,
            p.sku as product_sku,
            p."availableSizes",
            pv.id as variant_id,
            pv.name as variant_name,
            pv.sku as variant_sku,
            pv."colorHex",
            (
              SELECT COALESCE(SUM(ji.quantity), 0)::int 
              FROM job_items ji 
              WHERE ji."itemTemplateId" = it.id
            ) as total_quantity_ordered,
            (
              SELECT json_agg(
                json_build_object(
                  'jobId', j.id,
                  'status', j.status,
                  'quantity', ji.quantity,
                  'orderedAt', ji."createdAt"
                )
                ORDER BY ji."createdAt" DESC
              )
              FROM job_items ji
              JOIN jobs j ON ji."jobId" = j.id
              WHERE ji."itemTemplateId" = it.id
              LIMIT 10
            ) as recent_orders
          FROM item_templates it
          JOIN products p ON it."productId" = p.id
          LEFT JOIN product_variants pv ON it."variantId" = pv.id
          WHERE it."customerId" = ${customerId}
            AND it."isActive" = true
          ORDER BY 
            it."lastOrderedAt" DESC NULLS LAST,
            it."timesOrdered" DESC,
            it."createdAt" DESC
          OFFSET ${page * pageSize}
          LIMIT ${pageSize}
        `;
      }
    }

    // Transform the data to match the expected API format
    const transformedItems = items.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      timesOrdered: item.timesOrdered,
      totalQuantityOrdered: item.total_quantity_ordered,
      lastOrderedAt: item.lastOrderedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      product: {
        id: item.product_id,
        name: item.product_name,
        sku: item.product_sku,
        availableSizes: item.availableSizes,
      },
      variant: item.variant_id ? {
        id: item.variant_id,
        name: item.variant_name,
        sku: item.variant_sku,
        colorHex: item.colorHex,
      } : null,
      lastJob: item.recent_orders && item.recent_orders.length > 0 ? {
        id: item.recent_orders[0].jobId,
        status: item.recent_orders[0].status,
        createdAt: item.recent_orders[0].orderedAt,
      } : null,
      recentOrders: item.recent_orders || [],
    }));

    // Calculate summary statistics using raw SQL
    const [summaryResult] = await prisma.$queryRaw`
      SELECT 
        COUNT(it.id)::int as total_items,
        COALESCE(SUM(it."timesOrdered"), 0)::int as total_orders_count,
        (
          SELECT COALESCE(SUM(ji.quantity), 0)::int 
          FROM job_items ji
          JOIN item_templates it2 ON ji."itemTemplateId" = it2.id
          WHERE it2."customerId" = ${customerId} AND it2."isActive" = true
        ) as total_quantity_ordered
      FROM item_templates it
      WHERE it."customerId" = ${customerId} AND it."isActive" = true
    `;

    // Get most popular items using raw SQL
    const popularItems = await prisma.$queryRaw`
      SELECT 
        it.id,
        it.name,
        it."timesOrdered",
        it."lastOrderedAt",
        p.name as product_name
      FROM item_templates it
      JOIN products p ON it."productId" = p.id
      WHERE it."customerId" = ${customerId} AND it."isActive" = true
      ORDER BY it."timesOrdered" DESC, it."lastOrderedAt" DESC NULLS LAST
      LIMIT 5
    `;

    return NextResponse.json({
      customer,
      items: transformedItems,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
      summary: {
        totalItems: summaryResult.total_items,
        totalOrdersCount: summaryResult.total_orders_count,
        totalQuantityOrdered: summaryResult.total_quantity_ordered,
        popularItems: popularItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          timesOrdered: item.timesOrdered,
          lastOrderedAt: item.lastOrderedAt,
          product: { name: item.product_name }
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching customer items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}