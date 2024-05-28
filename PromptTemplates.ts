import {ChatOpenAI} from '@langchain/openai'
import {ChatPromptTemplate} from '@langchain/core/prompts'
const model=new ChatOpenAI({apiKey:process.env.OPEN_API_KEY,model:'gpt-3.5-turbo',temperature:0.7})

async function madeTemplate(){
    const prompt =ChatPromptTemplate.fromTemplate('write a short description for the following product:{product_name}')
    const wholePrompt=await prompt.format({product_name:'bicycle'})

    //connecting the model with a chain
    const chain=prompt.pipe(model)
    const reponse=await chain.invoke({product_name:'bicycle'})
    console.log(reponse.content)
}
madeTemplate()