"use client";
import { inngest } from "../inngest/client";
import "../src/app/globals.css";
import { useState } from "react";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export default function CreateInbox() {
  const [promptValue, setPromptValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [nameEmail, setNameEmail] = useState<[string, string][]>([])
  const { isLoaded, user } = useUser()
  const [isStart, setIsStart] = useState(true)

  const createInbox = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (nameValue != "" && promptValue != "") {
      if (user) {
        if (~isLoaded && user.primaryEmailAddress) {
          try {
            await fetch('https://emailextraction-for-ry-in-ranges-projects.vercel.app/api/create_inbox', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: nameValue,
                prompt: promptValue,
                send_to: user.primaryEmailAddress.emailAddress
              })
            })
            const result = await fetch('https://emailextraction-for-ry-in-ranges-projects.vercel.app/api/get_inboxes')
            const inboxes = await result.json()
            let tempNameEmail: [string, string][] = []
            Object.entries(inboxes).forEach(([key, value]: [string, any]) => {
              if (value.name && value.cloudmailin) {
                tempNameEmail = tempNameEmail.concat([[value.name, value.cloudmailin]])
              }
            })
            setNameEmail(tempNameEmail)
            window.location.reload();
          } catch(error) {
            console.error("Error:", error)
          }
        }
      }
    }
  }

  const updateEmails = async () => {
    try {
      const result = await fetch('https://emailextraction-for-ry-in-ranges-projects.vercel.app/api/get_inboxes')
      const inboxes = await result.json()
      let tempNameEmail: [string, string][] = []
      Object.entries(inboxes).forEach(([key, value]: [string, any]) => {
        if (value.name && value.cloudmailin) {
          tempNameEmail = tempNameEmail.concat([[value.name, value.cloudmailin]])
        }
      })
      setNameEmail(tempNameEmail)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (isStart) {
      updateEmails()
      setIsStart(false)
    }
  }, [isStart])

  return (
    <>
      <br/>
      <br/>

      <h1 className="text-orange-500 text-3xl font-semibold">Create inbox</h1>

      <p className="leading-7 [&:not(:first-child)]:mt-6 text-gray-500">Setup an inbox to process incoming emails</p>

      <br/>

      <Label className="font-bold">Name</Label> 
      <Input style={{ maxWidth: '700px' }} placeholder="e.g. Investment newsletters inbox" value={nameValue} onChange={(e) => setNameValue(e.target.value)}/>

      <br/>

      <Label htmlFor="prompt" className="font-bold">Extract command (prompt)</Label>
      <Textarea id="prompt" value={promptValue} onChange={(e) => setPromptValue(e.target.value)}/>
      <Label htmlFor="prompt" className="leading-7 [&:not(:first-child)]:mt-6 text-gray-500">
        This is the AI prompt that will be used to extract information from the incoming emails
      </Label>
      <br/>
      <br/>
      <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded" onClick={createInbox}>Create inbox</button>
      <br/>
      <br/>
      <hr></hr>
      <br/>
      <p className="font-bold">Email addresses for your inboxes:</p>
      <ul>
        <br/>
        {nameEmail.map((name) => (
          <li key={name[1]}>{name[0]}: <a href={`mailto:460d6ee3760a17630822+${name[1]}@cloudmailin.net`} className="italic text-gray-500">460d6ee3760a17630822+{name[1]}@cloudmailin.net</a></li>
        ))}
      </ul>
    </>
  );
}
