import { inngest } from "../../../../inngest/client";
import { IncomingMessage } from 'http';

export async function POST(req: Request) {
    let parsedBody: any = null;
    if (req.headers.get('Content-Type') === 'application/json') {
        let body = '';
        (req as any).on('data', (chunk: { toString: () => string; }) => {
            body += chunk.toString();
        });
        (req as any).on('end', () => {
            parsedBody = JSON.parse(body);
        });
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
