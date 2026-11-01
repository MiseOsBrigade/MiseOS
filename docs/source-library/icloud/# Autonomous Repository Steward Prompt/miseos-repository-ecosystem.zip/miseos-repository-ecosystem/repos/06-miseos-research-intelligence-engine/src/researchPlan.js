export function buildResearchPlan(topic) {
  return [
    `Search primary sources for ${topic}`,
    `Search academic literature for ${topic}`,
    `Cross-check current web sources for ${topic}`,
    `Separate verified facts, inference, and uncertainty for ${topic}`
  ];
}
