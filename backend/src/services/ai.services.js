import { ChatGoogle } from "@langchain/google/node";
import { HumanMessage,SystemMessage,AIMessage } from "@langchain/core/messages";
import { tool ,createAgent} from 'langchain'
import { internetSearch } from "./internetSearch.js";
import { sendEmail } from "./mail.services.js";
import * as z from 'zod'

const geminiModel = new ChatGoogle({
   model: "gemini-3.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

const internetSerachTool = tool(
    internetSearch,{
        name:'internetSearch',
        description:'use this tool for latest information from internet',
        schema:z.object({
            query:z.string().describe('the search query to look up on the internet')
        })
    }
)

const emailSendTool = tool(
    sendEmail,
    {
        name: 'sendMail',
        description: 'Send an email to the recipient',
        schema: z.object({
            to: z.string().email(),
            subject: z.string(),
            html: z.string().describe('HTML email body'),
            text: z.string().optional().describe('Plain text email body')
        })
    }
)
 
const agent = createAgent({
    model: geminiModel,
    tools: [internetSerachTool,emailSendTool],
    systemPrompt: `
        You are Nexo AI, an intelligent AI assistant.

        Rules:
        1. Answer normal questions directly.
        2. For current or latest information, ALWAYS use internetSearch.
        3. For today's date, current news, latest technology updates,
           live information and recent events, use internetSearch.
        4. Never guess current information.
        5. After searching, summarize the results clearly.
        6. If search fails, inform the user.
        7. When a user say to sending email u can used emailSendTool 
        When sending an email:
- Generate a suitable subject and email body.
- Use sendMail with to, subject, html and text.
- Never claim success without tool confirmation.
- Ask for missing recipient information.
    `
})


export async function genrateResponse(messages){

    const res = await agent.invoke({
        messages:
        messages.map((msg=>{
        if(msg.role == 'user'){
            return new HumanMessage(msg.content)
        }else if(msg.role == 'ai'){
            return new AIMessage(msg.content)
        }
    }))
    })


    
return res.messages[res.messages.length - 1].content
}




export async function genrateChatTitle(message) {

   const respones = await geminiModel.invoke([
     new SystemMessage(`
        You are a chat title generator.

        Your task is to generate a short and meaningful title
        based on the user's first message.

        Rules:
        - Generate a title of 3 to 4 words.
        - Keep the title simple and descriptive.
        - Do not use quotes.
        - Do not add explanations.
        - Do not use prefixes like "Title:".
        - Return only the title.

        `),

      new HumanMessage({
    content: message
})
   ])

   return respones.content

}
