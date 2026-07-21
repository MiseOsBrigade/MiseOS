export const aiTaxonomy = {
  capability: [
    { id: "ANI", status: "current" },
    { id: "AGI", status: "theoretical" },
    { id: "ASI", status: "hypothetical" }
  ],
  functionalDepth: [
    "Reactive Machines",
    "Limited Memory",
    "Theory of Mind (experimental)",
    "Self-Aware AI (conceptual)"
  ],
  paradigms: ["Predictive", "Generative", "Agentic", "Multimodal", "Causal", "Neurosymbolic"],
  learningMethods: ["Supervised", "Unsupervised", "Self-supervised", "Semi-supervised", "Reinforcement Learning", "RLHF"],
  architectures: ["Transformer", "CNN", "GAN", "Diffusion", "Reasoning", "SLM", "VLM", "MoE", "RAG", "Planning", "Multi-agent"],
  domains: ["NLP", "Computer Vision", "Robotics", "Expert Systems", "Fuzzy Logic", "Planning", "Code Intelligence"]
} as const;
