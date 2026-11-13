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
    async ({ to, subject, html, text }) => {

        console.log("sendMail tool called:", to)

        const result = await sendEmail({
            to,
            subject,
            html,
            text
        })

        console.log("sendMail result:", result)

        return result
    },
    {
        name: 'sendMail',
        description: 'Actually send an email using the recipient email address, subject and email body.',
        schema: z.object({
            to: z.string().email(),
            subject: z.string(),
            html: z.string(),
            text: z.string().optional()
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
EMAIL RULES:

1. When the user explicitly asks to send an email, you MUST call sendMail.
2. Never pretend that an email was sent.
3. Generate a suitable subject and email body.
4. If recipient email is missing, ask the user for it.
5. Wait for the sendMail tool result.
6. Only say email sent successfully if the tool returns success: true.
7. If the tool fails, explain the error.
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
