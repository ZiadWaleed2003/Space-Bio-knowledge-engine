from langgraph.graph import StateGraph , START , END
from langsmith import traceable
import logging
from typing import Optional , TypedDict , List


class GraphState(TypedDict):

    user_prompt : str

    # still figuring out the rest of the members of the state



class MainGraph():

    def __init__(self):
        pass



    # func to build the graph
    def build_graph(self):
        "yeah I'm just connecting the nodes here"

    # entry point 
    def entry_node(self , state : GraphState):
        "under construction ma booyyy"


    # router node 
    def router_node(self , state : GraphState):

        "router graph just to figure out are we gonna continue to convo or go into the retriever branch"


    # post router conditional 
    def post_router_conditional_node(self , state:  GraphState):

        "taking the action based on the response from the router"


    # chatting back with the user
    def generate_responses(self , state : GraphState):
        "man u already know the desc here"


    # rewrite the query for better retrieval
    def query_rewriter_node(self , state : GraphState):
        ""

    # the myth the legend the tool itself (The retriever)
    def retriever_node(self , state: GraphState):
        "a retriever node that should search the vec DB"

    # ReRanker Node
    def reranker_node(self , state : GraphState):
        "a node to use the reranker tool"


    # post reranker conditional node
    def post_reranker_conditional_node(self , state: GraphState):
        "it should check if we got any returned relevant results or not then decide what to actually do"

    # TODO : I'm supposed to continue the rest of this graph but there's somethings need to be finished 1st 
    # but yeah I guess this the boilerplate 

    
    