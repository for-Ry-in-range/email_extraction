"use client"
import React from 'react'; // Import the 'React' namespace from the 'react' package
import {
  ClerkProvider,
  SignInButton,
  SignedIn, 
  SignedOut, 
  UserButton,
} from '@clerk/nextjs';
import CreateInbox from "@/components/createInbox";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


export default function RootLayout({
  children,
}: {
  children?: React.ReactNode; // Make children optional
}) {
  return (
    <html>
      <body>
        <ClerkProvider>
          <main className="min-h-screen flex-col justify-between p-24">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>

              <CreateInbox/>
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
