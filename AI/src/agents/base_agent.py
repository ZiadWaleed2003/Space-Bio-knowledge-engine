from src.agents.sys_prompts import CONFIG as PROMPTS_CONFIG
from src.clients import get_main_llm


class BaseAgent:
    """Base agent class with configurable system prompts based on agent type."""

    def __init__(self, agent_type: str):
        """
        Initialize the base agent with a specific type.
        
        Args:
            agent_type: Type of agent ('scientist', 'manager', or 'mission_architect')
        """
        if agent_type not in PROMPTS_CONFIG:
            raise ValueError(
                f"Invalid agent type: {agent_type}. "
                f"Must be one of {list(PROMPTS_CONFIG.keys())}"
            )
        
        self.agent_type = agent_type
        self.llm = get_main_llm()
        self.system_prompt = PROMPTS_CONFIG[agent_type]
     
    def invoke(self, user_prompt: str) -> str:
        """
        Invoke the agent with a user prompt.
        
        Args:
            user_prompt: The user's input message
            
        Returns:
            The agent's response
        """
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        response = self.llm.invoke(messages)
        return response.content


