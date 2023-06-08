import 'dotenv/config'
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseChatMessage, HumanChatMessage, SystemChatMessage } from "langchain/schema"
import { AgentExecutor, ZeroShotAgent, Agent } from "langchain/agents";
import { ChatPromptTemplate, PromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "langchain/prompts";
import { BingSerpAPI, Tool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { LLMChain } from "langchain/chains";

export class openaiif {
    private readonly chat: ChatOpenAI;
    private readonly systemChatMessage: SystemChatMessage;
    private readonly tools: Tool[];
    private readonly prompt: PromptTemplate;
    private executor: AgentExecutor = null;
    private readonly chatPromptTemplate = null;
    private readonly agent: Agent;
    constructor(system_setting: string) {
        this.chat = new ChatOpenAI({
            temperature: 0.9,
        });
        this.systemChatMessage = new SystemChatMessage(system_setting)
        this.tools = [
            new BingSerpAPI(process.env.BING_API_KEY, { setLang: "JP" }),
            new Calculator(),
        ];
        this.prompt = ZeroShotAgent.createPrompt(this.tools, {
            prefix: 'あなたはアシスタントは役に立ち、クリエイティブで、賢く、非常にフレンドリー、そして、以下のツールを利用することができます。',
            suffix: `開始!ここからの会話は全て日本語で行われる。沢山の"Args"を使いましょう。`,
        });
        this.chatPromptTemplate = ChatPromptTemplate.fromPromptMessages([
            new SystemMessagePromptTemplate(this.prompt),
            HumanMessagePromptTemplate.fromTemplate(`{input}
            これはあなたの以前の回答です。（でも私は一切見ていません！あなたが最終回答として返すものしか見ていません）
            {agent_scratchpad}`),
        ]);
        const llmChain = new LLMChain({
            prompt: this.chatPromptTemplate,
            llm: new ChatOpenAI({}),
        });

        this.agent = new ZeroShotAgent({
            llmChain,
            allowedTools: this.tools.map((tool) => tool.name),
        });
    }

    private async reqeustUsingLangChain(message: string): Promise<BaseChatMessage> {
        var array: Array<BaseChatMessage> = [this.systemChatMessage, new HumanChatMessage(message)];
        var ret = await this.chat.call(array);
        return ret;
    }

    public async reqeustUsingLangChainToolBing(input: string): Promise<string> {
        if (input.match(/#.+\n/)) {
            const messageArray : Array<string> = input.split('#');
            if (0 == messageArray[0].trim().length && 4 < messageArray.length ) {
                return (await this.reqeustUsingLangChainPlain(input)).text;
            }
        }
        if (this.executor == null) {
            this.executor = AgentExecutor.fromAgentAndTools({ agent: this.agent, tools: this.tools })
        }
        const response = await this.executor.run(
            input
        );
        return response;
    }
    public async reqeustUsingLangChainPlain(message: string): Promise<BaseChatMessage> {
        if (message.match(/#.+\n/)) {
            const messageArray : Array<string> = message.split('#');
            if (0 == messageArray[0].trim().length && 4 < messageArray.length ) {
                var array: Array<BaseChatMessage> = [new SystemChatMessage(`${messageArray[1].trim()}\n${messageArray[2].trim()}\nそして、あなたはアシスタントは役に立ち、クリエイティブで、賢く、非常にフレンドリーです。`), new HumanChatMessage(messageArray[3])];
                var ret = await this.chat.call(array);
                return ret;
            }else{
                return await this.reqeustUsingLangChain(message);
            }
        } else {
            return await this.reqeustUsingLangChain(message);
        }
    }
}
