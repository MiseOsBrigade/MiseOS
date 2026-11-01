import type { EcosystemComponent, MiseOSEcosystemModel } from './types.js';

const component = (id: string, label: string, description: string, recordKinds: readonly string[]): EcosystemComponent => ({ id, label, description, recordKinds });

export const MISEOS_THREE_LAYER_MODEL: MiseOSEcosystemModel = {
  schema: 'miseos.ecosystem.three-layer.v1',
  category: 'Character-Native Agent Operations',
  positioning: 'MiseOS turns character intellectual property into a governed workforce of useful digital agents and gives communities and organizations a platform for building with them.',
  strategicPrinciple: 'identity + capability + authority + evidence',
  layers: [
    {
      id: 'character-ip', order: 1, name: 'Character IP', surface: 'Approachable and emotional',
      question: 'Who is this character, and why should people care?',
      purpose: 'Create recognition, emotional connection, cultural relevance and a human-understandable interface.',
      strategicRole: 'Attention and attachment',
      components: [
        component('character-cards','Character cards','Collectible and operational identity surfaces',['character_card']),
        component('storyworld','Comics, animation and lore','Narrative context and worldbuilding',['story','comic','animation','lore']),
        component('interactive','Games and interactive experiences','Playable discovery and learning',['game','interactive_experience']),
        component('collectibles','Digital and physical collectibles','Ownership and fandom surfaces',['digital_collectible','physical_collectible']),
        component('education','Educational content','Role-based learning through characters',['lesson','guide','course']),
        component('social','Social storytelling','Community-facing narrative distribution',['social_post','campaign'])
      ]
    },
    {
      id: 'agent-utility', order: 2, name: 'Agent Utility', surface: 'Operational and defensible',
      question: 'What can this agent do, what is it permitted to do, and how can its work be trusted?',
      purpose: 'Transform character identity into governable, measurable and verifiable digital labor.',
      strategicRole: 'Practical value and software defensibility',
      components: [
        component('capabilities','Capabilities and commands','Typed operations exposed by the agent',['capability','command']),
        component('tools-memory','Tools and contextual memory','Connected execution resources and governed context',['tool','memory']),
        component('workflow','Workflow responsibilities and handoffs','Composable work, dependencies and agent coordination',['workflow','handoff']),
        component('authority','Permissions and approvals','Explicit authority boundaries and human control',['permission','approval_policy']),
        component('proof','Proof gates and audit trails','Evidence-backed execution and traceability',['proof_gate','attestation','audit_event']),
        component('performance','Performance metrics','Observable quality, reliability and outcome measures',['metric','evaluation'])
      ]
    },
    {
      id: 'participation-economy', order: 3, name: 'Participation Economy', surface: 'Ecosystem and value creation',
      question: 'How can people participate, contribute and create value within the ecosystem?',
      purpose: 'Enable governed publishing, contribution, deployment, licensing and commercial expansion.',
      strategicRole: 'Distribution, contribution and economic expansion',
      components: [
        component('marketplace','Brigade marketplace','Discover and acquire agents, workflows, tools and skills',['marketplace_listing']),
        component('publishing','Agent and workflow publishing','Package and distribute reusable operating assets',['agent_release','workflow_release']),
        component('reputation','Contributor reputation and certification','Evidence-based trust for builders and operators',['reputation_record','certification']),
        component('rewards','Usage rewards and revenue sharing','Compensate verified contribution and adoption',['reward_policy','revenue_share']),
        component('licensing','Licensing and subscriptions','Commercial rights and recurring access',['license','subscription']),
        component('deployment','Enterprise and configurable Brigades','Customer-defined governed workforces',['deployment','brigade_configuration'])
      ]
    }
  ],
  transitions: [
    { from:'character-ip', to:'agent-utility', mechanism:'Bind a canonical character identity to a versioned agent definition.', requiredEvidence:['character identity record','capability manifest','authority policy'] },
    { from:'agent-utility', to:'participation-economy', mechanism:'Publish only verified agents and workflows through governed distribution.', requiredEvidence:['successful proof gates','audit trail','performance baseline','license'] },
    { from:'participation-economy', to:'character-ip', mechanism:'Feed verified usage, community contribution and outcomes back into the storyworld.', requiredEvidence:['attributed contribution','approved canon event','rights clearance'] }
  ],
  activationLoop: ['Discover a character','Understand its role','Deploy its capabilities','Verify its work','Improve its performance','Publish or combine workflows','Participate in the ecosystem'],
  marketEntry: ['Meet the agent','Watch the agent work','Inspect the proof','Assemble a Brigade','Join the ecosystem']
};
