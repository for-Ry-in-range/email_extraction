"use client"
import './globals.css';
import RootLayout from "./layout";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export default function App() {
  return (
    <RootLayout/>
  );
}
