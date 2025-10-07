# Space Biology Knowledge Engine

### A project for the NASA Space Apps Cairo Hackathon 2025

Our project is an AI-powered dashboard designed to unlock the insights hidden within 608 NASA bioscience research papers, enabling scientists, managers, and mission planners to explore decades of research through an intuitive, conversational interface.

**[Challenge Link](https://www.spaceappschallenge.org/2025/challenges/build-a-space-biology-knowledge-engine/?tab=details)**

---

## Table of Contents
- [The Challenge](#the-challenge)
- [Our Solution](#our-solution)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)

---

## The Challenge

NASA has generated a vast trove of knowledge from decades of in-space biology experiments. This information is critical for future missions, but it's difficult for researchers and mission planners to navigate and synthesize. The challenge is to build a tool that can summarize this collection of studies and allow users to interactively explore the impacts and results.

---

## Our Solution

We solve this problem by building an advanced **Agentic RAG (Retrieval-Augmented Generation)** system with a multi-agent framework. Our solution provides two primary interfaces for exploration:

1.  **Interactive Knowledge Map:** A visual, graph-based representation of the research topics and their corresponding papers. This allows users to get a high-level overview and visually navigate to papers of interest.
2.  **Persona-Driven Chatbot:** A powerful conversational AI that allows for deep dives into specific research papers. The core of our solution is a multi-agent system that tailors its responses based on the user's persona:
    * **The Scientist:** Focuses on providing detailed data, methodology, and experimental results.
    * **The Manager:** Delivers high-level summaries, identifies research progress, and points out knowledge gaps for investment opportunities.
    * **The Mission Architect:** Extracts actionable insights, safety concerns, and risks relevant to mission planning.

This approach ensures that every user gets precisely the information they need, in the format they need it.

---

## Key Features

-   **Advanced RAG Pipeline:** Utilizes Hybrid Search (Vector + Keyword) and a Cross-Encoder Re-ranker for highly relevant document retrieval.
-   **Multi-Agent Framework:** Built with LangGraph, our system intelligently routes user queries to the appropriate persona-based agent (Scientist, Manager, or Mission Architect).
-   **Interactive Graph UI:** A visual entry point to the knowledge base, allowing users to explore connections between research papers.
-   **Metadata-Aware Filtering:** Chunks are indexed with section-specific metadata (e.g., "Results," "Conclusion"), allowing agents to perform highly targeted searches.
-   **Factually Grounded Answers:** All responses are generated based on the content of the retrieved documents, minimizing hallucinations and ensuring accuracy.

---

## System Architecture

Our RAG pipeline is designed for accuracy and modularity. The user's query goes through several stages of refinement and routing to ensure the best possible context is provided to the final generative agent.

*This diagram represents our core logical flow.*
<img src="https://github.com/user-attachments/assets/e0e8c1a8-026a-4c9e-bd00-53dd307d22d6" alt="RAG system">

---
  
