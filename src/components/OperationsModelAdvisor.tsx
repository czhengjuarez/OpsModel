import { useState } from 'react';
import { ChevronRight, Users, BarChart3, Eye, CheckCircle, ArrowLeft, Building2, TrendingUp, RotateCcw } from 'lucide-react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from '../lib/utils';

const OperationsModelAdvisor = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    companySize: '',
    designTeamSize: '',
    existingOpsStructure: '',
    organizationComplexity: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const steps = [
    'Quick Assessment',
    'Recommendation',
    'Detailed Analysis'
  ];

  const models = {
    "no-dedicated-ops": {
      name: "No Dedicated DesignOps Needed",
      structure: "Unified Operations with Design responsibilities distributed among designers and design managers",
      bestFor: "Small design teams (under 10 people) where dedicated ops roles would be overhead",
      pros: [
        "No additional overhead or specialized roles needed",
        "Designers stay connected to operational realities",
        "Unified ops can handle design tools and basic processes",
        "Design managers can handle team-specific operational needs",
        "Cost-effective approach for smaller teams"
      ],
      cons: [
        "Design-specific expertise may be limited in unified ops",
        "Designers spend time on ops tasks instead of design work",
        "May struggle with design system governance at scale",
        "Less specialized knowledge of design tools and processes",
        "Risk of design needs being deprioritized in unified ops"
      ]
    },
    "unified": {
      name: "Unified Product Operations",
      structure: "Design Ops + Product Ops + Research Ops + Content Ops under single Product Operations leader",
      bestFor: "Teams with 10+ designers in small to mid-size companies with centralized product development",
      pros: [
        "Holistic product development view across all functions",
        "Streamlined tool procurement and vendor management",
        "Efficient resource allocation and capacity shifting",
        "Reduced coordination overhead with single point of contact",
        "Cross-functional process optimization"
      ],
      cons: [
        "Potential loss of specialized domain expertise",
        "Risk of competing priorities between functions",
        "Less clear career advancement paths for specialists",
        "Possible cultural misalignment between functions",
        "May prioritize efficiency over craft quality"
      ]
    },
    "design-centered": {
      name: "Design-Centered Operations",
      structure: "Design Ops + Research Ops + Content Ops under Design Leadership",
      description: "Distributed operations across multiple product teams with central coordination. Suitable for large organizations (100+ designers) with multiple product lines but need for consistency.",
      bestFor: "Design-forward companies with mature design organizations (25+ designers)",
      pros: [
        "Strong user-experience alignment across functions",
        "Preserves design thinking and creative processes",
        "Maintains specialized domain expertise",
        "Natural collaboration between related functions",
        "Quality-focused approach over pure efficiency"
      ],
      cons: [
        "Limited organizational influence outside design",
        "Potential resource competition with other departments",
        "Requires coordination with separate product/engineering ops",
        "May face scaling challenges during rapid growth",
        "Risk of disconnect from broader business operations"
      ]
    },
    "hybrid": {
      name: "Hybrid Embedded Model",
      structure: "Mix of centralized shared services and embedded discipline-specific functions",
      bestFor: "Mid-size organizations balancing efficiency and specialization",
      pros: [
        "Balanced approach combining efficiency and expertise",
        "Centralized functions achieve economies of scale",
        "Embedded functions provide specialized support",
        "Flexible adaptation based on organizational needs",
        "Best-of-both-worlds for complex organizations"
      ],
      cons: [
        "Role confusion between centralized and embedded functions",
        "Complex coordination across multiple models",
        "Inconsistent experience across different teams",
        "More challenging to reorganize as company evolves",
        "Potential conflicts between efficiency and advocacy"
      ]
    },
    "distributed": {
      name: "Distributed Specialist Model",
      structure: "Each ops function reports to respective discipline leadership",
      description: "Each ops function reports to respective discipline leadership with deep domain expertise. Suitable for large organizations (100+ designers) with strong functional leadership.",
      bestFor: "Large organizations (100+ designers) with strong functional leadership",
      pros: [
        "Deep domain expertise within each function",
        "Direct advocacy for discipline-specific needs",
        "Cultural alignment with discipline values",
        "Clear specialist career advancement paths",
        "Maximum flexibility for each function"
      ],
      cons: [
        "High coordination overhead across functions",
        "Tool fragmentation and increased costs",
        "Potential resource duplication and inefficiency",
        "Organizational complexity with multiple reporting lines",
        "Risk of local optimization over global alignment"
      ]
    },
    "distributed-with-central": {
      name: "Distributed Model with Central Coordination",
      structure: "Specialized ops functions embedded in disciplines with central standards and coordination",
      description: "Distributed operations across multiple product teams with central coordination. Suitable for large organizations (100+ designers) with multiple product lines but need for consistency.",
      bestFor: "Large organizations (100+ designers) that already have some centralized operations infrastructure",
      pros: [
        "Deep domain expertise within each specialized function",
        "Central coordination ensures consistency and best practice sharing",
        "Economies of scale through shared standards and tools",
        "Clear governance while maintaining functional autonomy",
        "Leverages existing central operations investment"
      ],
      cons: [
        "More complex coordination between central and distributed functions",
        "Potential tension between central standards and functional needs",
        "Requires strong communication and alignment processes",
        "May slow decision-making due to coordination overhead",
        "Risk of bureaucracy if central coordination becomes too heavy"
      ]
    },
    "distributed-enterprise": {
      name: "Distributed Enterprise Model",
      structure: "Independent business units each with their own operations structure suited to their needs",
      description: "Fully distributed operations model for complex enterprise organizations (150+ designers) with multiple business units and diverse product portfolios.",
      bestFor: "Very large enterprises (150+ designers) with multiple distinct business units or complex ecosystems",
      pros: [
        "Each business unit can optimize for their specific context",
        "Autonomy allows for innovation and experimentation",
        "Business units can act like independent organizations",
        "Faster decision-making within each unit",
        "Better alignment with diverse business needs and markets"
      ],
      cons: [
        "Potential inconsistency across the enterprise",
        "Difficulty sharing learnings and best practices",
        "Higher overall costs due to duplication",
        "Complex coordination for enterprise-wide initiatives",
        "Risk of fragmented brand and user experience"
      ]
    },
    "centralized-operations": {
      name: "Centralized Operations",
      structure: "Enterprise-level centralized operations with balanced ops squads supporting individual business units",
      description: "Centralized operations with balanced ops squads supporting individual business units. Ideal for very large organizations (200+ designers) with centralized ops structure.",
      bestFor: "Very large enterprises (200+ designers) with existing centralized operations infrastructure and complex multi-business unit structure",
      pros: [
        "Maximum operational efficiency and standardization across the enterprise",
        "Balanced ops squads provide comprehensive support to each business unit",
        "Centralized governance ensures consistency while maintaining business unit focus",
        "Economies of scale across all operational functions (Product, Design, Research, Content, People, IT)",
        "Clear escalation paths and enterprise-wide coordination",
        "Optimal resource allocation and capacity management across business units",
        "Unified tooling, processes, and best practices across the organization"
      ],
      cons: [
        "Requires significant organizational maturity and investment",
        "Risk of bureaucracy and slower response to individual business unit needs",
        "Complex coordination overhead between central ops and business units",
        "Potential for over-standardization reducing business unit agility",
        "Requires strong change management and cultural alignment",
        "May struggle with highly specialized or unique business unit requirements",
        "Single point of failure for enterprise-wide operations support"
      ]
    }
  };

  // Organization structures for visual diagrams
  const orgStructures = {
    'no-dedicated-ops': {
      name: 'No Dedicated DesignOps',
      structure: [
        { id: 'cpo', title: 'CPO / Head of Product', level: 0, x: 300, y: 50, type: 'leadership' },
        { id: 'unified-ops', title: 'Unified Operations', level: 1, x: 300, y: 150, type: 'ops-leadership', responsibilities: ['Tool management', 'Basic design processes', 'Vendor coordination', 'General operations'] },
        { id: 'design-manager', title: 'Design Manager', level: 1, x: 500, y: 150, type: 'design-leadership', responsibilities: ['Team management', 'Design process oversight', 'Design system coordination', 'Designer enablement'] },
        { id: 'designers', title: 'Designers', level: 2, x: 500, y: 250, type: 'design-team', responsibilities: ['Design work', 'Some ops tasks', 'Design system contributions', 'Process feedback'] }
      ],
      connections: [
        { from: 'cpo', to: 'unified-ops' },
        { from: 'cpo', to: 'design-manager' },
        { from: 'design-manager', to: 'designers' }
      ]
    },
    'unified': {
      name: 'Unified Product Operations',
      structure: [
        { id: 'cpo', title: 'CPO / Head of Product', level: 0, x: 400, y: 50, type: 'leadership' },
        { id: 'product-ops-lead', title: 'Head of Product Operations', level: 1, x: 400, y: 150, type: 'ops-leadership' },
        { id: 'design-ops', title: 'Design Operations', level: 2, x: 200, y: 250, type: 'ops-function', responsibilities: ['Design system governance', 'Tool management', 'Process optimization', 'Team enablement'] },
        { id: 'product-ops', title: 'Product Operations', level: 2, x: 400, y: 250, type: 'ops-function', responsibilities: ['Product analytics', 'Market research', 'Roadmap support', 'Product tools'] },
        { id: 'research-ops', title: 'Research Operations (Existing or Future)', level: 2, x: 600, y: 250, type: 'ops-function', responsibilities: ['Research infrastructure', 'Methodology', 'Participant management', 'Research tools', 'Note: May already exist or be added in future'] },
        { id: 'content-ops', title: 'Content Operations (Existing or Future)', level: 2, x: 750, y: 250, type: 'ops-function', responsibilities: ['Content strategy', 'Content tools', 'Editorial processes', 'Content governance', 'Note: May already exist or be added in future'] }
      ],
      connections: [
        { from: 'cpo', to: 'product-ops-lead' },
        { from: 'product-ops-lead', to: 'design-ops' },
        { from: 'product-ops-lead', to: 'product-ops' },
        { from: 'product-ops-lead', to: 'research-ops' },
        { from: 'product-ops-lead', to: 'content-ops' }
      ]
    },
    'design-centered': {
      name: 'Design-Centered Operations',
      structure: [
        { id: 'cpo', title: 'CPO / Head of Product', level: 0, x: 400, y: 50, type: 'leadership' },
        { id: 'head-design', title: 'Head of Design', level: 1, x: 400, y: 130, type: 'design-leadership' },
        { id: 'head-experience-ops', title: 'Head of Experience Operations', level: 2, x: 400, y: 210, type: 'ops-leadership', responsibilities: ['Experience operations strategy', 'Cross-functional coordination', 'Experience standards', 'Operations team leadership'] },
        { id: 'design-ops', title: 'Design Operations', level: 3, x: 250, y: 290, type: 'ops-function', responsibilities: ['Design systems', 'Design tools', 'Process optimization', 'Team enablement'] },
        { id: 'research-ops', title: 'Research Operations', level: 3, x: 400, y: 290, type: 'ops-function', responsibilities: ['Research infrastructure', 'Methodology', 'Participant management', 'Research tools'] },
        { id: 'content-ops', title: 'Content Operations', level: 3, x: 550, y: 290, type: 'ops-function', responsibilities: ['Content strategy', 'Content tools', 'Editorial processes', 'Content governance'] }
      ],
      connections: [
        { from: 'cpo', to: 'head-design' },
        { from: 'head-design', to: 'head-experience-ops' },
        { from: 'head-experience-ops', to: 'design-ops' },
        { from: 'head-experience-ops', to: 'research-ops' },
        { from: 'head-experience-ops', to: 'content-ops' }
      ]
    },
    'hybrid': {
      name: 'Hybrid Embedded Model',
      structure: [
        { id: 'cpo', title: 'CPO / Head of Product', level: 0, x: 400, y: 50, type: 'leadership' },
        { id: 'shared-services', title: 'Shared Services', level: 1, x: 200, y: 150, type: 'ops-leadership', responsibilities: ['Tool procurement', 'Vendor management', 'Cross-team standards', 'Shared infrastructure'] },
        { id: 'product-team-1', title: 'Product Team A', level: 1, x: 400, y: 150, type: 'business-unit' },
        { id: 'product-team-2', title: 'Product Team B', level: 1, x: 600, y: 150, type: 'business-unit' },
        { id: 'embedded-ops-1', title: 'Embedded Ops A', level: 2, x: 400, y: 250, type: 'ops-function', responsibilities: ['Team-specific processes', 'Local optimization', 'Direct team support', 'Specialized workflows'] },
        { id: 'embedded-ops-2', title: 'Embedded Ops B', level: 2, x: 600, y: 250, type: 'ops-function', responsibilities: ['Team-specific processes', 'Local optimization', 'Direct team support', 'Specialized workflows'] }
      ],
      connections: [
        { from: 'cpo', to: 'shared-services' },
        { from: 'cpo', to: 'product-team-1' },
        { from: 'cpo', to: 'product-team-2' },
        { from: 'product-team-1', to: 'embedded-ops-1' },
        { from: 'product-team-2', to: 'embedded-ops-2' },
        { from: 'shared-services', to: 'embedded-ops-1' },
        { from: 'shared-services', to: 'embedded-ops-2' }
      ]
    },
    'distributed': {
      name: 'Distributed Specialist Model',
      structure: [
        { id: 'cpo', title: 'CPO', level: 1, x: 150, y: 100, type: 'leadership' },
        { id: 'head-design', title: 'Head of Design', level: 1, x: 350, y: 100, type: 'design-leadership' },
        { id: 'head-research', title: 'Head of Research', level: 1, x: 550, y: 100, type: 'leadership' },
        { id: 'cto', title: 'CTO', level: 1, x: 750, y: 100, type: 'leadership' },
        { id: 'product-ops', title: 'Product Operations', level: 2, x: 150, y: 200, type: 'ops-function', responsibilities: ['Product analytics', 'Market research', 'Roadmap support', 'Reports to CPO'] },
        { id: 'design-ops', title: 'Design Operations', level: 2, x: 350, y: 200, type: 'ops-function', responsibilities: ['Design systems', 'Design processes', 'Reports to Head of Design'] },
        { id: 'research-ops', title: 'Research Operations', level: 2, x: 550, y: 200, type: 'ops-function', responsibilities: ['Research infrastructure', 'Methodology', 'Reports to Head of Research'] },
        { id: 'eng-ops', title: 'Engineering Operations', level: 2, x: 750, y: 200, type: 'ops-function', responsibilities: ['Developer tooling', 'CI/CD', 'Reports to CTO'] }
      ],
      connections: [
        { from: 'cpo', to: 'product-ops' },
        { from: 'head-design', to: 'design-ops' },
        { from: 'head-research', to: 'research-ops' },
        { from: 'cto', to: 'eng-ops' }
      ]
    },
    'distributed-with-central': {
      name: 'Distributed with Central Coordination',
      structure: [
        { id: 'coo', title: 'COO / Head of Operations', level: 0, x: 450, y: 50, type: 'leadership' },
        { id: 'central-ops', title: 'Central Ops Standards', level: 1, x: 450, y: 130, type: 'ops-leadership', responsibilities: ['Cross-functional standards', 'Tool governance', 'Best practice sharing', 'Ops strategy coordination'] },
        { id: 'cpo', title: 'CPO', level: 1, x: 150, y: 200, type: 'leadership' },
        { id: 'head-design', title: 'Head of Design', level: 1, x: 350, y: 200, type: 'design-leadership' },
        { id: 'head-research', title: 'Head of Research', level: 1, x: 550, y: 200, type: 'leadership' },
        { id: 'cto', title: 'CTO', level: 1, x: 750, y: 200, type: 'leadership' },
        { id: 'product-ops', title: 'Product Operations', level: 2, x: 150, y: 300, type: 'ops-function', responsibilities: ['Product analytics', 'Reports to CPO', 'Coordinates with Central Standards'] },
        { id: 'design-ops', title: 'Design Operations', level: 2, x: 350, y: 300, type: 'ops-function', responsibilities: ['Design systems', 'Reports to Head of Design', 'Coordinates with Central Standards'] },
        { id: 'research-ops', title: 'Research Operations', level: 2, x: 550, y: 300, type: 'ops-function', responsibilities: ['Research infrastructure', 'Reports to Head of Research', 'Coordinates with Central Standards'] },
        { id: 'eng-ops', title: 'Engineering Operations', level: 2, x: 750, y: 300, type: 'ops-function', responsibilities: ['Developer tooling', 'Reports to CTO', 'Coordinates with Central Standards'] }
      ],
      connections: [
        { from: 'coo', to: 'central-ops' },
        { from: 'central-ops', to: 'cpo' },
        { from: 'central-ops', to: 'head-design' },
        { from: 'central-ops', to: 'head-research' },
        { from: 'central-ops', to: 'cto' },
        { from: 'cpo', to: 'product-ops' },
        { from: 'head-design', to: 'design-ops' },
        { from: 'head-research', to: 'research-ops' },
        { from: 'cto', to: 'eng-ops' }
      ]
    },
    'distributed-enterprise': {
      name: 'Distributed Enterprise Model',
      structure: [
        { id: 'ceo', title: 'CEO / Executive Team', level: 0, x: 400, y: 50, type: 'leadership' },
        { id: 'bu1', title: 'Business Unit A', level: 1, x: 200, y: 150, type: 'business-unit', responsibilities: ['Independent ops structure', 'Unit-specific processes', 'Autonomous decisions'] },
        { id: 'bu2', title: 'Business Unit B', level: 1, x: 400, y: 150, type: 'business-unit', responsibilities: ['Independent ops structure', 'Unit-specific processes', 'Autonomous decisions'] },
        { id: 'bu3', title: 'Business Unit C', level: 1, x: 600, y: 150, type: 'business-unit', responsibilities: ['Independent ops structure', 'Unit-specific processes', 'Autonomous decisions'] },
        { id: 'bu1-ops', title: 'Unit A Ops Structure', level: 2, x: 200, y: 250, type: 'ops-function', responsibilities: ['May use unified, hybrid, or distributed', 'Tailored to unit needs', 'Independent decision-making'] },
        { id: 'bu2-ops', title: 'Unit B Ops Structure', level: 2, x: 400, y: 250, type: 'ops-function', responsibilities: ['May use unified, hybrid, or distributed', 'Tailored to unit needs', 'Independent decision-making'] },
        { id: 'bu3-ops', title: 'Unit C Ops Structure', level: 2, x: 600, y: 250, type: 'ops-function', responsibilities: ['May use unified, hybrid, or distributed', 'Tailored to unit needs', 'Independent decision-making'] }
      ],
      connections: [
        { from: 'ceo', to: 'bu1' },
        { from: 'ceo', to: 'bu2' },
        { from: 'ceo', to: 'bu3' },
        { from: 'bu1', to: 'bu1-ops' },
        { from: 'bu2', to: 'bu2-ops' },
        { from: 'bu3', to: 'bu3-ops' }
      ]
    },
    'centralized-operations': {
      name: 'Centralized Operations',
      structure: [
        { id: 'ceo', title: 'CEO / Executive Team', level: 0, x: 400, y: 40, type: 'leadership' },
        { id: 'coo', title: 'COO / Head of Operations', level: 1, x: 400, y: 120, type: 'leadership' },
        { id: 'ops-squad-1', title: 'Ops Squad A', level: 2, x: 200, y: 200, type: 'ops-leadership', responsibilities: ['Product + Design + Research + Content + People + IT Ops', 'Supports Business Unit A', 'Balanced cross-functional support'] },
        { id: 'ops-squad-2', title: 'Ops Squad B', level: 2, x: 400, y: 200, type: 'ops-leadership', responsibilities: ['Product + Design + Research + Content + People + IT Ops', 'Supports Business Unit B', 'Balanced cross-functional support'] },
        { id: 'ops-squad-3', title: 'Ops Squad C', level: 2, x: 600, y: 200, type: 'ops-leadership', responsibilities: ['Product + Design + Research + Content + People + IT Ops', 'Supports Business Unit C', 'Balanced cross-functional support'] },
        { id: 'bu1', title: 'Business Unit A', level: 3, x: 200, y: 280, type: 'business-unit', responsibilities: ['Receives comprehensive ops support', 'Focus on business objectives', 'Streamlined operations'] },
        { id: 'bu2', title: 'Business Unit B', level: 3, x: 400, y: 280, type: 'business-unit', responsibilities: ['Receives comprehensive ops support', 'Focus on business objectives', 'Streamlined operations'] },
        { id: 'bu3', title: 'Business Unit C', level: 3, x: 600, y: 280, type: 'business-unit', responsibilities: ['Receives comprehensive ops support', 'Focus on business objectives', 'Streamlined operations'] }
      ],
      connections: [
        { from: 'ceo', to: 'coo' },
        { from: 'coo', to: 'ops-squad-1' },
        { from: 'coo', to: 'ops-squad-2' },
        { from: 'coo', to: 'ops-squad-3' },
        { from: 'ops-squad-1', to: 'bu1' },
        { from: 'ops-squad-2', to: 'bu2' },
        { from: 'ops-squad-3', to: 'bu3' }
      ]
    }
  };

  const getRecommendation = () => {
    const { companySize, designTeamSize, existingOpsStructure, organizationComplexity } = formData;
    
    // FIRST CHECK: Design team size threshold for dedicated DesignOps
    const teamSizeNumber = designTeamSize === '1' ? 1 : 
                          designTeamSize === '2-4' ? 3 : 
                          designTeamSize === '5-9' ? 7 : 
                          designTeamSize === '10-24' ? 17 : 
                          designTeamSize === '25-49' ? 37 : 
                          designTeamSize === '50-99' ? 75 : 
                          designTeamSize === '100-199' ? 150 : 200;
    
    // Small design teams (<10 people) don't need dedicated DesignOps
    if (teamSizeNumber < 10) {
      return "no-dedicated-ops";
    }
    
    // Size-first algorithm with existing structure consideration
    if (companySize === 'startup') {
      return 'unified';
    }
    
    if (companySize === 'growth') {
      // Small growth companies default to unified unless they have design focus
      if (existingOpsStructure === 'design-led' && teamSizeNumber >= 25) {
        return 'design-centered';
      }
      return 'unified';
    }
    
    if (companySize === 'scale') {
      // Mid-size companies are good candidates for hybrid approaches
      if (existingOpsStructure === 'multiple-functions' || organizationComplexity === 'multiple-business-units') {
        return 'hybrid';
      }
      if (existingOpsStructure === 'design-led' && teamSizeNumber >= 25) {
        return 'design-centered';
      }
      return 'hybrid'; // Default for scale
    }
    
    if (companySize === 'enterprise') {
      // PRIORITY: Very large enterprises (200+ designers) with centralized ops get centralized-operations
      if (teamSizeNumber >= 200 && existingOpsStructure === 'centralized') {
        return 'centralized-operations';
      }
      
      // Very large enterprises with multiple business units get distributed-enterprise
      if (organizationComplexity === 'complex-ecosystem' || organizationComplexity === 'multiple-business-units') {
        return 'distributed-enterprise';
      }
      
      // Large enterprises with existing central coordination get distributed-with-central
      if (existingOpsStructure === 'centralized' || existingOpsStructure === 'multiple-functions') {
        return 'distributed-with-central';
      }
      
      // Pure distributed for companies starting from scratch
      if (existingOpsStructure === 'single-function' || existingOpsStructure === 'none') {
        return 'distributed';
      }
      
      return 'distributed';
    }
    
    return 'unified';
  };

  // Benchmark data from DesignOps survey matching original structure
  const benchmarkData = {
    companySizeDistribution: {
      'startup': { percentage: 8.4, designTeamRange: '2-4 people (most common)' },
      'growth': { percentage: 13.8, designTeamRange: '10-24 people (most common)' },
      'scale': { percentage: 28.5, designTeamRange: '10-49 people (most common)' },
      'enterprise': { percentage: 45.6, designTeamRange: '50-199 people (most common)' }
    }
  };

  const getSizeBenchmark = (companySize: string) => {
    return benchmarkData.companySizeDistribution[companySize as keyof typeof benchmarkData.companySizeDistribution];
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    const result = getRecommendation();
    setRecommendation(result);
    setShowResults(true);
  };

  // Enhanced color scheme for node types
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'leadership': return '#8F1F57'; // Primary brand color
      case 'ops-leadership': return '#DD388B'; // Accent brand color
      case 'design-leadership': return '#F59E0B'; // Amber for design
      case 'ops-function': return '#8B5CF6'; // Purple for ops functions
      case 'design-team': return '#EF4444'; // Red for design teams
      case 'business-unit': return '#10B981'; // Emerald for business units
      default: return '#6B7280'; // Gray for default
    }
  };

  const getNodeSize = (type: string) => {
    switch (type) {
      case 'leadership': return 14;
      case 'ops-leadership': return 12;
      case 'design-leadership': return 12;
      case 'ops-function': return 10;
      case 'design-team': return 10;
      case 'business-unit': return 12;
      default: return 8;
    }
  };

  // Interactive diagram component
  const OrganizationDiagram = ({ modelKey }: { modelKey: string }) => {
    const structure = orgStructures[modelKey as keyof typeof orgStructures];
    if (!structure) return null;

    const handleNodeClick = (nodeId: string) => {
      setSelectedNode(selectedNode === nodeId ? null : nodeId);
    };

    const selectedNodeData = selectedNode ? structure.structure.find(node => node.id === selectedNode) : null;

    return (
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {structure.name} - Organization Structure
          </h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <svg width="900" height="350" className="w-full">
            {/* Render connections */}
            {structure.connections.map((connection, index) => {
              const fromNode = structure.structure.find(node => node.id === connection.from);
              const toNode = structure.structure.find(node => node.id === connection.to);
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={index}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#D1D5DB"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              );
            })}

            {/* Render nodes */}
            {structure.structure.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={getNodeSize(node.type)}
                  fill={getNodeColor(node.type)}
                  stroke={selectedNode === node.id ? '#1F2937' : '#FFFFFF'}
                  strokeWidth={selectedNode === node.id ? 3 : 2}
                  className="cursor-pointer transition-all duration-200 hover:stroke-gray-700 hover:stroke-2"
                  onClick={() => handleNodeClick(node.id)}
                />
                {/* Text with wrapping for longer titles */}
                {(() => {
                  const words = node.title.split(' ');
                  const maxWidth = 120; // Maximum width for text
                  const lineHeight = 12;
                  let lines = [];
                  let currentLine = '';
                  
                  words.forEach(word => {
                    const testLine = currentLine ? `${currentLine} ${word}` : word;
                    // Rough estimate: 6 pixels per character
                    if (testLine.length * 6 > maxWidth && currentLine) {
                      lines.push(currentLine);
                      currentLine = word;
                    } else {
                      currentLine = testLine;
                    }
                  });
                  if (currentLine) lines.push(currentLine);
                  
                  return lines.map((line, index) => (
                    <text
                      key={index}
                      x={node.x}
                      y={node.y + getNodeSize(node.type) + 20 + (index * lineHeight)}
                      textAnchor="middle"
                      className="text-xs font-medium fill-gray-700 cursor-pointer"
                      onClick={() => handleNodeClick(node.id)}
                    >
                      {line}
                    </text>
                  ));
                })()}
              </g>
            ))}
          </svg>

          {/* Node details panel */}
          {selectedNodeData && selectedNodeData.responsibilities && (
            <div className="mt-6 p-4 bg-[#F5DEEA] border border-[#DD388B] rounded-lg">
              <h4 className="font-semibold text-[#8F1F57] mb-2">
                {selectedNodeData.title} - Responsibilities
              </h4>
              <ul className="space-y-1">
                {selectedNodeData.responsibilities.map((responsibility, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-[#DD388B] mr-2">•</span>
                    {responsibility}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#8F1F57]"></div>
              <span>Leadership</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#DD388B]"></div>
              <span>Ops Leadership</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
              <span>Design Leadership</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
              <span>Ops Functions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
              <span>Design Teams</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
              <span>Business Units</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuickAssessment = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Quick Assessment
        </CardTitle>
        <CardDescription>
          Answer a few questions to get your personalized DesignOps model recommendation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">Company Size</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { key: 'startup', label: 'Startup', desc: '1-100 employees', survey: '18% of survey' },
              { key: 'growth', label: 'Growth', desc: '101-500 employees', survey: '22% of survey' },
              { key: 'scale', label: 'Scale', desc: '501-2000 employees', survey: '28% of survey' },
              { key: 'enterprise', label: 'Enterprise', desc: '2000+ employees', survey: '32% of survey' }
            ].map((size) => (
              <Button
                key={size.key}
                variant={formData.companySize === size.key ? "outline" : "outline"}
                className={cn(
                  "h-auto p-3 flex flex-col items-start text-left",
                  formData.companySize === size.key ? "bg-gray-700 text-white border-gray-700 hover:bg-gray-600" : ""
                )}
                onClick={() => handleInputChange('companySize', size.key)}
                title={`${size.desc} - ${size.survey}`}
              >
                <span className="font-medium text-sm">{size.label}</span>
                <span className="text-xs opacity-70">{size.desc}</span>
                <span className="text-xs opacity-60">{size.survey}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Design Team Size</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { key: '1', label: '1 person', ops: 'Rarely need DesignOps' },
              { key: '2-4', label: '2-4 people', ops: '8% have DesignOps' },
              { key: '5-9', label: '5-9 people', ops: '15% have DesignOps' },
              { key: '10-24', label: '10-24 people', ops: '35% have DesignOps' },
              { key: '25-49', label: '25-49 people', ops: '65% have DesignOps' },
              { key: '50-99', label: '50-99 people', ops: '78% have DesignOps' },
              { key: '100-199', label: '100-199 people', ops: '85% have DesignOps' },
              { key: '200+', label: '200+ people', ops: '90% have DesignOps' }
            ].map((size) => (
              <Button
                key={size.key}
                variant={formData.designTeamSize === size.key ? "outline" : "outline"}
                className={cn(
                  "h-auto p-3 flex flex-col items-start text-left",
                  formData.designTeamSize === size.key ? "bg-gray-700 text-white border-gray-700 hover:bg-gray-600" : ""
                )}
                onClick={() => handleInputChange('designTeamSize', size.key)}
                title={size.ops}
              >
                <span className="font-medium text-sm">{size.label}</span>
                <span className="text-xs opacity-70">{size.ops}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Existing Operations Structure</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { key: 'none', label: 'No dedicated ops', desc: 'No dedicated ops functions' },
              { key: 'single-function', label: 'Single ops function', desc: 'e.g., just DesignOps' },
              { key: 'design-led', label: 'Design-led ops', desc: 'DesignOps + ResearchOps + ContentOps' },
              { key: 'multiple-functions', label: 'Multiple separate ops', desc: 'Multiple separate functions' },
              { key: 'centralized', label: 'Already centralized', desc: 'Centralized ops structure' }
            ].map((structure) => (
              <Button
                key={structure.key}
                variant={formData.existingOpsStructure === structure.key ? "outline" : "outline"}
                className={cn(
                  "h-auto p-3 flex flex-col items-start text-left",
                  formData.existingOpsStructure === structure.key ? "bg-gray-700 text-white border-gray-700 hover:bg-gray-600" : ""
                )}
                onClick={() => handleInputChange('existingOpsStructure', structure.key)}
                title={structure.desc}
              >
                <span className="font-medium text-sm">{structure.label}</span>
                <span className="text-xs opacity-70">{structure.desc}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Organization Complexity</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { key: 'single-product', label: 'Single product', desc: 'Single product/service' },
              { key: 'product-suite', label: 'Product suite', desc: 'Suite of related products' },
              { key: 'multiple-business-units', label: 'Multiple business units', desc: 'Multiple divisions' },
              { key: 'complex-ecosystem', label: 'Complex ecosystem', desc: 'Multi-business ecosystem' }
            ].map((complexity) => (
              <Button
                key={complexity.key}
                variant={formData.organizationComplexity === complexity.key ? "outline" : "outline"}
                className={cn(
                  "h-auto p-3 flex flex-col items-start text-left",
                  formData.organizationComplexity === complexity.key ? "bg-gray-700 text-white border-gray-700 hover:bg-gray-600" : ""
                )}
                onClick={() => handleInputChange('organizationComplexity', complexity.key)}
                title={complexity.desc}
              >
                <span className="font-medium text-sm">{complexity.label}</span>
                <span className="text-xs opacity-70">{complexity.desc}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-start pt-4">
          <Button 
            onClick={handleSubmit}
            disabled={!formData.companySize || !formData.designTeamSize || !formData.existingOpsStructure || !formData.organizationComplexity}
            className="flex items-center gap-2"
          >
            Get Recommendation
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderRecommendation = () => {
    if (!recommendation) return null;
    const model = models[recommendation as keyof typeof models];
    const benchmark = getSizeBenchmark(formData.companySize);

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Your Recommended Model
            </CardTitle>
            <CardDescription>
              Based on your responses, here's the suggested DesignOps model for your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg border">
              <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
              <p className="text-muted-foreground mb-4">{model.structure}</p>
              <div className="bg-background/50 p-4 rounded-lg">
                <p className="text-sm"><strong>Best for:</strong> {model.bestFor}</p>
              </div>
            </div>

            {benchmark && (
              <div className="bg-muted p-6 rounded-lg border">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                  Industry Benchmark Context
                </h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>Your organization size ({formData.companySize}):</strong> {benchmark.percentage}% of companies in our DesignOps survey
                  </p>
                  <p>
                    <strong>Typical design team size:</strong> {benchmark.designTeamRange}
                  </p>
                  <p className="text-xs italic opacity-75">
                    Data source: DesignOps Benchmarking Survey 2024 (anonymized, n=333 responses)
                  </p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background p-6 rounded-lg border">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                  Strengths & Benefits
                </h4>
                <ul className="space-y-2">
                  {model.pros.map((pro, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-background p-6 rounded-lg border">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-accent" />
                  Potential Challenges
                </h4>
                <ul className="space-y-2">
                  {model.cons.map((con, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <Eye className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interactive Organization Diagram */}
            <OrganizationDiagram modelKey={recommendation} />

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentStep(0);
                  setRecommendation(null);
                  setFormData({
                    companySize: '',
                    designTeamSize: '',
                    existingOpsStructure: '',
                    organizationComplexity: ''
                  });
                }}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </Button>
              <Button 
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2"
              >
                View Detailed Analysis
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDetailedAnalysis = () => {
    if (!recommendation) return null;
    const model = models[recommendation as keyof typeof models];
    const benchmark = getSizeBenchmark(formData.companySize);

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Industry Benchmarking Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive insights from the DesignOps Benchmarking Survey 2024
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Survey Overview */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Survey Overview</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">333</div>
                  <div className="text-muted-foreground">Total Responses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">150+</div>
                  <div className="text-muted-foreground">DesignOps Professionals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Global</div>
                  <div className="text-muted-foreground">Industry Coverage</div>
                </div>
              </div>
            </div>

            {/* Data Collection Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <div className="text-yellow-600 mt-0.5">⚠️</div>
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Data Collection Timeframe</h4>
                  <p className="text-sm text-yellow-700">
                    This survey data was collected <strong>July 15 - August 13, 2024</strong>, sponsored by <strong>DesignOps Assembly</strong>. While most organizational patterns and benchmarks are expected to remain stable,&nbsp; 
                    <strong>AI adoption rates have likely increased significantly</strong> since then, which may impact tooling preferences and hiring patterns. 
                    Current AI adoption is expected to be much higher than the 73% reported in this data.
                  </p>
                </div>
              </div>
            </div>

            {/* Your Organization in Context */}
            {benchmark && (
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-accent" />
                  Your Organization in Context
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Company Size: {formData.companySize}</div>
                    <div className="text-sm text-muted-foreground">
                      {benchmark.percentage}% of survey respondents are {formData.companySize} companies
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Typical design team: {benchmark.designTeamRange}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Recommended Model: {model.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {model.bestFor}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Company Size Distribution */}
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-primary" />
                Company Size Distribution
              </h3>
              <div className="space-y-3">
                {[
                  { size: 'Startup (1-100)', percentage: 18, color: 'bg-red-500' },
                  { size: 'Growth (101-500)', percentage: 22, color: 'bg-orange-500' },
                  { size: 'Scale (501-2000)', percentage: 28, color: 'bg-yellow-500' },
                  { size: 'Enterprise (2000+)', percentage: 32, color: 'bg-green-500' }
                ].map((item) => (
                  <div key={item.size} className="flex items-center gap-3">
                    <div className="w-24 text-sm font-medium">{item.size}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className={`${item.color} h-4 rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm font-semibold">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DesignOps Adoption by Company Size */}
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                DesignOps Adoption by Company Size
              </h3>
              <div className="space-y-3">
                {[
                  { size: 'Startup', adoption: 8, teams: '2-4 people' },
                  { size: 'Growth', adoption: 34, teams: '5-15 people' },
                  { size: 'Scale', adoption: 56, teams: '16-50 people' },
                  { size: 'Enterprise', adoption: 78, teams: '50+ people' }
                ].map((item) => (
                  <div key={item.size} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div>
                      <div className="font-medium">{item.size} Companies</div>
                      <div className="text-sm text-muted-foreground">Typical team: {item.teams}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{item.adoption}%</div>
                      <div className="text-sm text-muted-foreground">Have DesignOps</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Organization Context */}


            {/* Unique Data-Driven Insights */}
            <div className="bg-background p-6 rounded-lg border mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-accent" />
                Unique Insights from Raw Data
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <h4 className="font-medium mb-2 text-blue-900">Tool Satisfaction Gap</h4>
                  <p className="text-sm text-blue-700">
                    Organizations with 100+ designers report 35% lower satisfaction with project management tools compared to smaller teams
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <h4 className="font-medium mb-2 text-green-900">Budget Reality Check</h4>
                  <p className="text-sm text-green-700">
                    Only 42% of DesignOps teams have dedicated budgets, yet those with budgets show 60% higher program maturity scores
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <h4 className="font-medium mb-2 text-purple-900">Hiring Freeze Impact</h4>
                  <p className="text-sm text-purple-700">
                    48% of organizations experienced hiring freezes, but those that resumed hiring show stronger DesignOps investment
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <h4 className="font-medium mb-2 text-orange-900">Design System Disconnect</h4>
                  <p className="text-sm text-orange-700">
                    67% of DesignOps teams don't directly support design systems, yet system governance remains a top challenge
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                  <h4 className="font-medium mb-2 text-red-900">Experience Paradox</h4>
                  <p className="text-sm text-red-700">
                    Teams with 7+ years DesignOps experience report similar challenges to newer teams, suggesting evolving complexity
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
                  <h4 className="font-medium mb-2 text-teal-900">Strategic Utilization</h4>
                  <p className="text-sm text-teal-700">
                    58% feel DesignOps isn't utilized strategically, correlating with lower leadership engagement scores
                  </p>
                </div>
              </div>
            </div>

            {/* Key Industry Insights */}
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Key Industry Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Most Common Challenge</h4>
                  <p className="text-sm text-muted-foreground">
                    67% of organizations struggle with design system governance and consistency across teams
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Growth Pattern</h4>
                  <p className="text-sm text-muted-foreground">
                    Organizations typically start with a single DesignOps person handling multiple responsibilities, then evolve to either unified product operations (multiple specialists under one leader) or distributed models as they scale beyond 100 designers
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Success Factor</h4>
                  <p className="text-sm text-muted-foreground">
                    Teams with dedicated DesignOps report 40% faster design-to-development handoffs
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">AI Adoption Trend</h4>
                  <p className="text-sm text-muted-foreground">
                    73% of DesignOps professionals are actively using AI tools, with knowledge management and process automation being the top use cases
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Geographic Pattern</h4>
                  <p className="text-sm text-muted-foreground">
                    European organizations show 25% higher adoption of centralized DesignOps models compared to North American companies
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Maturity Correlation</h4>
                  <p className="text-sm text-muted-foreground">
                    Organizations with 5+ years of DesignOps experience are 3x more likely to have published DesignOps strategies and dedicated budgets
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Recommendation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCurrentStep = () => {
    if (currentStep === 2) return renderDetailedAnalysis();
    if (showResults && recommendation) return renderRecommendation();
    return renderQuickAssessment();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            DesignOps Model Advisor
          </h1>
          <p className="text-lg text-muted-foreground">
            Finding operations model for your ops team
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const isClickable = index === 0 || (index === 1 && recommendation) || (index === 2 && recommendation);
              const handleStepClick = () => {
                if (!isClickable) return;
                if (index === 0) {
                  setCurrentStep(0);
                  setShowResults(false);
                } else if (index === 1 && recommendation) {
                  setCurrentStep(1);
                  setShowResults(true);
                } else if (index === 2 && recommendation) {
                  setCurrentStep(2);
                }
              };

              return (
                <div key={step} className="flex items-center">
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                      index <= currentStep 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground",
                      isClickable ? "cursor-pointer hover:scale-105 hover:shadow-md" : "cursor-default"
                    )}
                    onClick={handleStepClick}
                  >
                    {index + 1}
                  </div>
                  <span 
                    className={cn(
                      "ml-2 text-sm font-medium transition-colors duration-200",
                      index <= currentStep ? "text-foreground" : "text-muted-foreground",
                      isClickable ? "cursor-pointer hover:text-primary" : "cursor-default"
                    )}
                    onClick={handleStepClick}
                  >
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Content */}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default OperationsModelAdvisor;
