import { inngest } from "../../../../inngest/client";

export async function POST() {
    try {
        await inngest.send({
          name: "myfunc/send-summary"
        });
        return new Response("Successful!", { status: 200 });
    } catch (error) {
        console.error("Error:", error)
        return new Response("Error occured", {status: 500})
    }
}
