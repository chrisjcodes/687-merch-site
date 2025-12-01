import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint is called by a cron job to deactivate shops
// that have passed their activeUntil date
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron job using a secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find all shops that are:
    // 1. Currently live
    // 2. Have activationMode set to 'scheduled'
    // 3. Have an activeUntil date that has passed
    const shopsToDeactivate = await prisma.dropShop.findMany({
      where: {
        isLive: true,
        activationMode: 'scheduled',
        activeUntil: {
          lte: now,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        activeUntil: true,
      },
    });

    if (shopsToDeactivate.length === 0) {
      return NextResponse.json({
        message: 'No shops to deactivate',
        deactivated: 0,
      });
    }

    // Deactivate all shops that have passed their activeUntil date
    const result = await prisma.dropShop.updateMany({
      where: {
        id: {
          in: shopsToDeactivate.map((shop) => shop.id),
        },
      },
      data: {
        isLive: false,
      },
    });

    console.log(
      `Deactivated ${result.count} shops:`,
      shopsToDeactivate.map((s) => `${s.name} (${s.slug})`)
    );

    return NextResponse.json({
      message: `Deactivated ${result.count} shops`,
      deactivated: result.count,
      shops: shopsToDeactivate.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        activeUntil: s.activeUntil,
      })),
    });
  } catch (error) {
    console.error('Error in deactivate-shops cron:', error);
    return NextResponse.json(
      { error: 'Failed to run deactivation cron' },
      { status: 500 }
    );
  }
}
