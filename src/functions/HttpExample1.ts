import 'dotenv/config'
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import "../lib/openai.mjs";
import { openaiif } from "../lib/openai.mjs";
type requestMessage = {
    msg: string
}
export async function HttpExample1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const aoai : openaiif = new openaiif(process.env['GPT_SYSTEM_SETTING']);
    const reqText : requestMessage = JSON.parse(await request.text());
    const r = await aoai.reqeustUsingLangChain(reqText.msg);
    return { 
        jsonBody : {message : r.text}
    };
};

app.http('HttpExample1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: HttpExample1
});
