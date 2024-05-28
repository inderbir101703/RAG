import {ChatOpenAI,OpenAIEmbeddings} from '@langchain/openai'
import {ChatPromptTemplate} from '@langchain/core/prompts'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'
 import {Chroma} from '@langchain/community/vectorstores/chroma'

const model=new ChatOpenAI({apiKey:process.env.OPEN_API_KEY,model:'gpt-3.5-turbo',temperature:0.7})

const ques='what does renault and publicis did together?'
async function main(){
//loader
const loader=new CheerioWebBaseLoader('https://www.publicissapient.com/work/how-a-leading-health-insurer-improved-health-outcomes')
const secondLoader=new CheerioWebBaseLoader('https://www.publicissapient.com/work/how-renault-accelerated-ev-adoption-with-p2p-charging')
const doc=await loader.load()
const secDoc=await secondLoader.load()
const fDoc=[...doc,...secDoc]

//split the docs
const splitter=new RecursiveCharacterTextSplitter({
    chunkSize:200,
    chunkOverlap:20
})

const sdocs=await splitter.splitDocuments(fDoc)

    //store the sata
    const vectorStore= await Chroma.fromDocuments(sdocs,new OpenAIEmbeddings({apiKey:process.env.OPEN_API_KEY}),
    {collectionName:'books',url:'http://localhost:8000'})
  await vectorStore.addDocuments(sdocs)

    //retrieve the data
const retriever=vectorStore.asRetriever({k:2})

const docs=await retriever._getRelevantDocuments(ques)
const resultdocs=docs.map(result=>result.pageContent)

//build template
const template=ChatPromptTemplate.fromMessages([['system','answers the queations based on following context {context}'],['user','{input}']])
const chain=template.pipe(model)
const response=await chain.invoke({input:ques,context:resultdocs})
console.log(response.content)

}
main()