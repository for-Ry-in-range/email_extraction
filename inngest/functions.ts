import { inngest } from "./client";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from 'resend'

const resend = new Resend('re_NHYRNKnP_ExRzxqMXKHUUm5P5nY9tapT5');

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sendToAnth = inngest.createFunction(
  { id: "send-anth" },
  { event: "myfunc/send.anth" },
  async ({ event, step }) => { 
    try {
      const data = event.data
      const afterPlus = data.envelope.to.split('+').slice(1); // Getting the part after the +
      const withoutDomain = afterPlus[0].split('@')[0]
      const inbox = await prisma.inbox.findUnique({
        where: { cloudmailin: withoutDomain },
      });
      if (inbox) {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const msg = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1024,
          messages: [
            {"role": "user", "content": `You are reading an email with the subject: ${data.headers.subject}\n\`\`\`html\n${data.plain}\n\`\`\`\nExtract the following information: \n<blockquote>\n${inbox.prompt}\n</blockquote>\nIf no information can be extracted, please respond with "No information detected."`}
          ]
        });
        
        await prisma.inbox.update({
          where: { cloudmailin: withoutDomain },
          data: {
            extracted: inbox.extracted + "\n" + (msg.content[0] as { type: string; text: string }).text
          }
        });
      }
      return { event, body: "done" };
    } catch(error) {
      console.error("Error", error)
      return { event, body: "error"}
    }
  }
);


export const sendSummary = inngest.createFunction(
  { id: "send-summary" },
  { event: "myfunc/send-summary" },
  async ({event, step}) => {
    const inboxes = await prisma.inbox.findMany();
    for (const inbox of inboxes) {
      if (inbox.extracted != "") {
        try {
          await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: inbox.send_to,
            subject: 'Your Daily AI Extraction',
            html: `<p>${inbox.extracted}</p>`
          });
        }
        catch(error){
          console.error("Emailing Error:", error)
        }
        try {
          await prisma.inbox.update({
            where: { cloudmailin: inbox.cloudmailin },
            data: {
              extracted: ""
            }
          });
        } catch(error) {
          console.error("Error:", error)
        }
      }
    }
    
    return { event, body: "done" };
  }
)


export const createInbox = inngest.createFunction(
  {id: "create-inbox"},
  {event: "myfunc/create-inbox"},
  async ({event, step}) => {
    const data = event.data
    try {
      const new_inbox = await prisma.inbox.create({
        data: {
          name: data.name,
          prompt: data.prompt,
          extracted: "",
          send_to: data.send_to
        }
      })
      return new_inbox.cloudmailin
    } catch (error) {
      console.error("Error:", error)
      return "Error";
    }
  }
)
