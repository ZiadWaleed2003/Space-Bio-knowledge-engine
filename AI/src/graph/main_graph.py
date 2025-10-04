from langgraph.graph import StateGraph , START , END
from langsmith import traceable
import logging
from typing import Optional , TypedDict , List

from src.clients import get_router_llm , get_langsmith_client , get_query_rewriter , get_main_llm


class GraphState(TypedDict):

    user_prompt : str
    user_persona : str
    agent_persona : str
    router_answer : str
    response : str


    # still figuring out the rest of the members of the state



class MainGraph():

    def __init__(self):
        self.router_llm = get_router_llm()
        self.graph = self.build_graph()
        self.rewriter_llm = get_query_rewriter()
        
        pass



    # func to build the graph
    traceable(tags="Building Graph Node")
    def build_graph(self):
        "yeah I'm just connecting the nodes here"

        builder = StateGraph(GraphState)

        builder.add_node("router_node",self.router_node)
        builder.add_node("generate_response_node" , self.generate_responses)
        builder.add_node("query_rewriter_node",self.query_rewriter_node)
        builder.add_node("retriever_node",self.retriever_node)


        builder.add_conditional_edges("router_node",
                                      self.post_router_conditional_node,{
                                          True : "query_rewriter_node",
                                          False: "generate_response_node"
                                      })
        

        
        
        builder.add_edge(START , "router_node")
        builder.add_edge("query_rewriter_node" , "retriever_node")
        builder.add_edge("retriever_node" , END) # tmp at end for now
        builder.add_edge("generate_response_node",END)
        
        # Compile and return the graph
        graph = builder.compile()
        return graph
        


    # router node 
    @traceable(tags=["Router Node"])
    def router_node(self , state : GraphState):
        "router graph just to figure out are we gonna continue to convo or go into the retriever branch"
        logging.info(f"[ROUTER NODE] Received user prompt: {state.get('user_prompt')}")
        
        if state.get('user_prompt'):
            prompt = "".join([
                "System Prompt :",
                f"{self._sys_prompt_for_router()}",
                "user_prompt : ",
                state.get('user_prompt')
            ])

            logging.info("[ROUTER NODE] Invoking LLM for routing decision...")
            response = self.router_llm.invoke(prompt)
            logging.info(f"[ROUTER NODE] Router decision: {response.content}")
            return {'router_answer': response.content}
        
        logging.warning("[ROUTER NODE] No user prompt found, defaulting to CONTINUE_CONVERSATION")
        return {'router_answer' : "CONTINUE_CONVERSATION"}

    # post router conditional 
    @traceable(tags=["Post Router Conditional"])
    def post_router_conditional_node(self , state:  GraphState):
        "taking the action based on the response from the router"
        if state.get('router_answer'):
            router_decision = state.get('router_answer').strip()
            logging.info(f"[POST ROUTER CONDITIONAL] Router decision: {router_decision}")
            
            if router_decision == "CONTINUE_CONVERSATION":
                logging.info("[POST ROUTER CONDITIONAL] Routing to generate_response_node")
                return False
            elif router_decision == "USE_RETRIEVAL":
                logging.info("[POST ROUTER CONDITIONAL] Routing to query_rewriter_node")
                return True
            else:
                # Default to conversation if unexpected response
                logging.warning(f"[POST ROUTER CONDITIONAL] Unexpected decision '{router_decision}', defaulting to conversation")
                return False
        
        logging.warning("[POST ROUTER CONDITIONAL] No router answer found, defaulting to conversation")
        return False

    # chatting back with the user
    @traceable(tags=["Generate Responses"])
    def generate_responses(self , state : GraphState):
        "man u already know the desc here"
        logging.info("[GENERATE RESPONSE] Generating response for user...")

        prompt = "".join([
            "You are a helpful AI assistant specializing in space biology and NASA research.\n",
            "Respond to the user's query in a friendly and informative manner.\n\n",
            f"User Query: {state.get('user_prompt')}"
        ])

        response = self.router_llm.invoke(prompt)
        logging.info(f"[GENERATE RESPONSE] Response generated: {response.content[:100]}...")

        return {'response': response.content}


    def sys_prompt_rewriter(self):

        prompt = prompt = "".join([
                        "You are a specialized Query Augmentation AI, a core component of a NASA research engine. Your sole function is to rewrite user queries into a format that is highly optimized for semantic search against a vector database of scientific papers.\n\n",
                        "**Core Objective:**\n",
                        "Transform a user's potentially short, conversational, or ambiguous query into a detailed, descriptive, and context-rich statement. This new query should be ideal for converting into a vector that can precisely locate relevant information within a corpus of NASA space biology research.\n\n",
                        "**Operational Principles:**\n",
                        "1.  **Identify Core Intent:** First, analyze the user's query to understand the fundamental question or topic they are interested in.\n",
                        "2.  **Enrich with Context:** Expand the query by adding relevant technical context and scientific terminology common in space bioscience. Think about the implicit context (e.g., \"spaceflight,\" \"microgravity,\" \"radiation\") and make it explicit.\n",
                        "3.  **From Keywords to Concepts:** Convert simple keywords or short phrases into comprehensive, descriptive statements. The rewritten query should feel like a sentence taken from the abstract of a research paper.\n",
                        "4.  **Specify Information Type:** If possible, add phrases that clarify the type of information being sought, such as \"A study of the mechanisms of...\", \"An analysis of the effects on...\", \"A summary of the methodologies for...\", or \"Key findings regarding...\".\n",
                        "5.  **Preserve Original Meaning:** This is your most important constraint. The rewritten query MUST be a direct, logical expansion of the user's original intent. You must not introduce new, unrelated topics or alter the fundamental question.\n\n",
                        "**Input/Output Format:**\n",
                        "You will receive a single line of text: the [USER QUERY].\n",
                        "You will output ONLY the rewritten query as a single, clean string. Do not include any preambles, explanations, or labels like \"Rewritten Query:\".\n\n",
                        "---\n",
                        "**Examples:**\n\n",
                        "**Example 1:**\n",
                        "- **[USER QUERY]:** effects on bone density\n",
                        "- **[REWRITTEN QUERY]:** Detailed analysis of the physiological and molecular effects of microgravity and long-duration spaceflight on bone density, skeletal demineralization, and structural integrity in astronauts and animal models.\n\n",
                        "**Example 2:**\n",
                        "- **[USER QUERY]:** how does radiation affect cells?\n",
                        "- **[REWRITTEN QUERY]:** An exploration of the cellular and molecular mechanisms of damage caused by cosmic and solar radiation, including impacts on DNA integrity, oxidative stress, and cellular repair pathways in biological organisms.\n\n",
                        "**Example 3:**\n",
                        "- **[USER QUERY]:** what did they learn about muscles?\n",
                        "- **[REWRITTEN QUERY]:** A summary of key findings and conclusions from research into muscle atrophy, loss of muscle mass, and changes in muscle fiber composition resulting from exposure to microgravity during space missions."
                    ])

        return prompt

    # rewrite the query for better retrieval
    @traceable(tags=["Query Rewriter Node"])
    def query_rewriter_node(self , state : GraphState):
        "reWriting the query from the user for better searching"

        if state.get('user_prompt'):
            user_prompt = state.get('user_prompt')
            sys_prompt  = self.sys_prompt_rewriter()

            prompt = f"{sys_prompt}\n and the user prompt is {user_prompt}"

            result = self.rewriter_llm.invoke(prompt)
            return {'rewriter_response' : result.content}
    

    

    # the myth the legend the tool itself (The retriever)
    @traceable(tags=["Retriever Node"])
    def retriever_node(self , state: GraphState):
        "a retriever node that should search the vec DB"

    # ReRanker Node
    @traceable(tags=["ReRanker Node"])
    def reranker_node(self , state : GraphState):
        "a node to use the reranker tool"


    # post reranker conditional node
    @traceable(tags=["Post ReRanker Conditional"])
    def post_reranker_conditional_node(self , state: GraphState):
        "it should check if we got any returned relevant results or not then decide what to actually do"

    # orch node
    @traceable(tags=["Orchestrator Node"])
    def orch_node(self , state:GraphState):
        "just some simple node taking the user query and determine the persona to decide which agent"

    # post orch node
    @traceable(tags=["Post Orchestrator Conditional"])
    def post_orch_condition_agent(self , state : GraphState):

        "the conditional node"


    # Main Agent Node
    @traceable(tags=["Main Agent Node"])
    def main_agent_node(self , state : GraphState):

        "we should just create an instance with the right persona"


    @traceable(tags=["Run Graph"])
    def run_graph(self , user_prompt):
        "Execute the graph with the given user prompt"
        logging.info(f"[RUN GRAPH] Starting graph execution with prompt: {user_prompt}")

        initial_state = {"user_prompt" : user_prompt}

        final_state = self.graph.invoke(initial_state)
        
        logging.info(f"[RUN GRAPH] Graph execution completed. Final state: {final_state}")
        return final_state


    def _sys_prompt_for_router(self):

        prompt = "".join([
            "You are a routing agent responsible for determining whether a user's query requires retrieving information from a knowledge base or can be handled through normal conversation.\n\n",
            
            "## Your Task:\n",
            "Analyze the user's prompt and decide:\n",
            "1. **USE_RETRIEVAL**: If the query asks for specific facts, data, research findings, technical information, or references that would benefit from searching a knowledge base.\n",
            "2. **CONTINUE_CONVERSATION**: If the query is conversational, asks for clarification, contains greetings, or can be answered based on general knowledge without needing specific retrieval.\n\n",
            
            "## Examples of queries requiring RETRIEVAL:\n",
            "- 'What are the effects of microgravity on muscle atrophy?'\n",
            "- 'Find research about space radiation impact on DNA'\n",
            "- 'What experiments were conducted on the ISS in 2023?'\n",
            "- 'Tell me about NASA's Mars mission findings'\n\n",
            
            "## Examples of queries for NORMAL CONVERSATION:\n",
            "- 'Hello, how are you?'\n",
            "- 'Can you explain that in simpler terms?'\n",
            "- 'Thank you for the information'\n",
            "- 'What do you mean by that?'\n",
            "- 'I don't understand'\n\n",
            
            "## Response Format:\n",
            "Respond with ONLY one of these two options:\n",
            "- 'USE_RETRIEVAL' - if the query needs knowledge base search\n",
            "- 'CONTINUE_CONVERSATION' - if it's a conversational query\n\n",
            
            "Do not provide any explanation, just the routing decision.",
            "also if the user asked about any info about you tell him that you are his Nasa Ai assistant to help him summarize research papers or discuss them and make the world a better place "
        ])

        return prompt


    
    
if __name__ == "__main__":
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

    try : 
        logging.info("=" * 50)
        logging.info("Initializing MainGraph...")
        gph = MainGraph()
        logging.info("MainGraph initialized successfully!")
        
        prompt = "Hey is there any research paper talking about space microbiology ?"
        logging.info("=" * 50)
        result = gph.run_graph(prompt)
        
        logging.info("=" * 50)
        logging.info("Graph execution completed successfully!")
        print(f"\n\nFinal Result: {result.get('rewriter_response')}")

    except Exception as e:

        logging.error(f"Error happened: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()

