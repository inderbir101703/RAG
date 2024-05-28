import {ChatOpenAI} from '@langchain/openai'
import {ChatPromptTemplate} from '@langchain/core/prompts'
import {StructuredOutputParser} from 'langchain/output_parsers'
const model=new ChatOpenAI({apiKey:process.env.OPEN_API_KEY,model:'gpt-3.5-turbo',temperature:0.7})



async function madeTemplate(){
    const prompt =ChatPromptTemplate.fromTemplate('write a short description for the following product:{product_name}')
    const wholePrompt=await prompt.format({product_name:'bicycle'})

    //connecting the model with a chain
    const chain=prompt.pipe(model)
    const reponse=await chain.invoke({product_name:'bicycle'})
    console.log(reponse.content)
}

async function fromMessages() {
    const prompt=ChatPromptTemplate.fromMessages([['system','write a short description on the following product {product_name}'],['human','product_name']])
    const chain=prompt.pipe(model)
    const response = await chain.invoke({'product_name':'hero honda splendor'})
    console.log(response.content)
    
}

async function structuredMessaged(){
    const prompt=ChatPromptTemplate.fromTemplate('extract the following information from the prompt.formatting instructions:{format_instructions} phrase:{phrase}')
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        name:'the name of the person',
        likes:'what the person likes'
    })
    const chain=prompt.pipe(model).pipe(parser)
    const response =await chain.invoke({phrase:'kalesh likes dragon fruit',format_instructions:parser.getFormatInstructions()})
    console.log(response)
}
structuredMessaged()