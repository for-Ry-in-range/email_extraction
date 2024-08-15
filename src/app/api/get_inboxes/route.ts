import { currentUser } from '@clerk/nextjs/server';
let prisma: any;

async function initializePrisma() {
  if (typeof window === 'undefined') { // Ensure this runs in a Node.js environment
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
}

export async function GET() {
  try {
    await initializePrisma();
    const user = await currentUser();
    if (!user) {
        return new Response('Not signed in', { status: 400 });
    }
    let rows
    if (user.primaryEmailAddress) {
    rows = await prisma.inbox.findMany({
      where: {
        send_to: {
          equals: user.primaryEmailAddress.emailAddress,
        },
      },
    });
    }
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error in GET function:", error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
