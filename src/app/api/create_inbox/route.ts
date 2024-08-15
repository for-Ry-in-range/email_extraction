import { inngest } from "../../../../inngest/client";
import { IncomingMessage } from 'http';

export async function POST(req: Request) {
    if (req.headers.get('Content-Type') === 'application/json') {
        const requestBody = await req.text();
        const parsedBody = JSON.parse(requestBody);
        if (parsedBody) {
            await inngest.send({
                name: "myfunc/create-inbox",
                data: {
                    name: parsedBody.name,
                    prompt: parsedBody.prompt,
                    send_to: parsedBody.send_to
                }
            });
        } else {
            console.error("Missing data in request body");
        }
    }
}
