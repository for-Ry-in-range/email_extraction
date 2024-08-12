import { inngest } from "../../../../inngest/client";


export async function POST(req: Request) {
  const chunks = [];
  if (req.body != null) {
    const reader = req.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
    }
  }
  const data = Buffer.concat(chunks).toString();
  try {
    const jsonData = JSON.parse(data);
    await inngest.send({
      name: "myfunc/send.anth",
      data: jsonData
    })

    return new Response('', { status: 200 }); // Return empty response for success
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return new Response('Invalid JSON data', { status: 400 }); // Handle parsing errors
  }
}