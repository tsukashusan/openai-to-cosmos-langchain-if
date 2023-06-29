import 'dotenv/config'
import { app, HttpRequest, HttpResponseInit, InvocationContext, input, output, trigger} from "@azure/functions";
import "../lib/openai.mjs";
import { openaiif } from "../lib/openai.mjs";
import { v4 as uuidv4 } from 'uuid';

type requestMessage = {
    id: string,
    message: string
}

const cosmosDBIn = input.generic(
    {
        type: 'cosmosdb',
        databaseName: process.env.COSMOS_DATABASE_NAME,
        containerName : process.env.COSMOS_COLLECTIONS_NAME,
        sqlQuery : "SELECT * FROM c WHERE c.userid = {id}"
    }
);
const cosmosDBOut = output.generic(
     {
        type: 'cosmosdb',
        databaseName: process.env.COSMOS_DATABASE_NAME,
        containerName : process.env.COSMOS_COLLECTIONS_NAME,
        createIfNotExists : true,
        partitionKey : "/userid"
    }
);

export async function HttpExamplePlain(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const aoai : openaiif = new openaiif(process.env.GPT_SYSTEM_SETTING);
    const reqText : requestMessage = JSON.parse(await request.text());
    const r = await aoai.reqeustUsingLangChainPlain(reqText.message);
    const rjson = {id : uuidv4(), userid: reqText.id, message : r};
    var a = context.extraInputs.get(cosmosDBIn);
    console.log(a);
    context.extraOutputs.set(cosmosDBOut, JSON.stringify(rjson))
    return {
        jsonBody : {message : r.text}
    };
};

export async function HttpExampleLangChain(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const aoai : openaiif = new openaiif(process.env.GPT_SYSTEM_SETTING);
    const reqText : requestMessage = JSON.parse(await request.text());
    const r = await aoai.reqeustUsingLangChainToolBing(reqText.message);
    const rjson = {id : uuidv4(), userid: reqText.id, message : r};
    var a = context.extraInputs.get(cosmosDBIn);
    console.log(a);
    context.extraOutputs.set(cosmosDBOut, JSON.stringify(rjson))
    console.log(r)
    return {
        jsonBody : {message : r}
    };
};

export async function HttpExampleLangChainSQL(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const aoai : openaiif = new openaiif(process.env.GPT_SYSTEM_SETTING);
    const reqText : requestMessage = JSON.parse(await request.text());
    const r = await aoai.reqeustUsingLangChainSQL(reqText.message);
    const rjson = {id : uuidv4(), userid: reqText.id, message : r};
    //var a = context.extraInputs.get(cosmosDBIn);
    //console.log(a);
    //context.extraOutputs.set(cosmosDBOut, JSON.stringify(rjson))
    console.log(r)
    return {
        jsonBody : {message : r}
    };
};

app.generic('HttpExamplePlain', {
    trigger: trigger.generic({
        type: 'httpTrigger',
        methods: ['POST']
    }),
    extraInputs :  [cosmosDBIn],
    extraOutputs : [cosmosDBOut],
    return: output.generic({
        type: 'http'
    }),
    handler: HttpExamplePlain
});

app.generic('HttpExampleLangChain', {
    trigger: trigger.generic({
        type: 'httpTrigger',
        methods: ['POST']
    }),
    extraInputs :  [cosmosDBIn],
    extraOutputs : [cosmosDBOut],
    return: output.generic({
        type: 'http'
    }),
    handler: HttpExampleLangChain
});

app.generic('langsql', {
    trigger: trigger.generic({
        type: 'httpTrigger',
        methods: ['POST']
    }),
    extraInputs :  [cosmosDBIn],
    extraOutputs : [cosmosDBOut],
    return: output.generic({
        type: 'http'
    }),
    handler: HttpExampleLangChainSQL
});
