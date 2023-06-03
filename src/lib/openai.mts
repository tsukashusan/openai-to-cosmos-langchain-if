import 'dotenv/config'
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseChatMessage, HumanChatMessage, SystemChatMessage } from "langchain/schema"

export class openaiif{
    private readonly chat : ChatOpenAI;
    private readonly systemChatMessage : SystemChatMessage;
    constructor(system_setting : string) {
        this.chat = new ChatOpenAI({
            temperature: 0.9,
          });
        this.systemChatMessage = new SystemChatMessage(system_setting)
    }

    public async reqeustUsingLangChain(message: string) : Promise<BaseChatMessage>{
        var array : Array<BaseChatMessage> = [this.systemChatMessage, new HumanChatMessage(message)];
        var ret = await this.chat.call(array);
        return ret;
    }
}