import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }
  return session;
}

export async function requireAdminSession() {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  return session;
}

export async function requireCustomerSession() {
  const session = await requireAuth();
  if (session.user.role !== "CUSTOMER") {
    throw new Error("Customer access required");
  }
  if (!session.user.customerId) {
    throw new Error("Customer profile not found");
  }
  return session;
}

export async function getCustomerJobs(customerId: string) {
  return await prisma.job.findMany({
    where: { customerId },
    include: {
      items: true,
      _count: {
        select: { items: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getJobForCustomer(jobId: string, customerId: string) {
  const job = await prisma.job.findFirst({
    where: { 
      id: jobId,
      customerId 
    },
    include: {
      items: true,
      events: true,
      customer: true
    }
  });
  
  if (!job) {
    throw new Error("Job not found");
  }
  
  return job;
}

export async function createReorderJob(originalJobId: string, customerId: string, reorderData: {
  sizeBreakdown: any;
  dueDate?: Date;
  notes?: string;
}) {
  const originalJob = await getJobForCustomer(originalJobId, customerId);
  
  const newJob = await prisma.job.create({
    data: {
      customerId,
      status: "QUEUED",
      dueDate: reorderData.dueDate,
      notes: reorderData.notes,
      items: {
        create: originalJob.items.map(item => ({
          productSku: item.productSku,
          variant: item.variant,
          printSpec: item.printSpec,
          qty: Object.values(reorderData.sizeBreakdown).reduce((total: number, qty: any) => total + (parseInt(qty) || 0), 0),
          sizeBreakdown: reorderData.sizeBreakdown
        }))
      },
      events: {
        create: {
          type: "reorder.requested",
          payload: {
            originalJobId,
            requestedBy: customerId,
            sizeBreakdown: reorderData.sizeBreakdown
          }
        }
      }
    },
    include: {
      items: true,
      events: true
    }
  });
  
  return newJob;
}