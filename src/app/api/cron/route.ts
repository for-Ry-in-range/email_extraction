import { inngest } from "../../../../inngest/client";

export async function GET() {
    try {
        await inngest.send({
          name: "myfunc/send-summary"
        });
        console.log("Cron worked")
        return new Response("Successful!", { status: 200 });
    } catch (error) {
        console.error("Error:", error)
        return new Response("Error occured", {status: 500})
    }
}
