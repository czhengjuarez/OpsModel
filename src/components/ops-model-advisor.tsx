import React, { useState } from 'react';
import { ChevronRight, Users, BarChart3, Eye, CheckCircle, ArrowLeft, Building2 } from 'lucide-react';

const OperationsModelAdvisor = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    companySize: '',
    designTeamSize: '',
    existingOpsStructure: '',
    organizationComplexity: ''
  });

  const [detailedData, setDetailedData] = useState({
    designMaturity: '',
    organizationalCulture: '',
    primaryGoals: [],
    operationsMaturity: '',
    resourceConstraints: [],
    changeCapacity: '',
    specializationNeeds: ''
  });

  const [recommendation, setRecommendation] = useState(null);
  const [showDetailed, setShowDetailed] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showCurrentState, setShowCurrentState] = useState(false);

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
      bestFor: "Large organizations (2000+ employees) with strong functional leadership",
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
      bestFor: "Large organizations (2000+ employees) that already have some centralized operations infrastructure",
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
      bestFor: "Very large enterprises (5000+ employees) with multiple distinct business units or complex ecosystems",
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
    }
  };

  // Benchmark data from DesignOps survey
  const benchmarkData = {
    companySizeDistribution: {
      'startup': { percentage: 8.4, designTeamRange: '2-4 people (most common)' },
      'growth': { percentage: 13.8, designTeamRange: '10-24 people (most common)' },
      'scale': { percentage: 28.5, designTeamRange: '10-49 people (most common)' },
      'enterprise': { percentage: 45.6, designTeamRange: '50-199 people (most common)' }
    },
    designTeamPatterns: {
      'startup': '64% have 2-4 person design teams',
      'growth': '45% have 10-24 person design teams', 
      'scale': '48% have 10-49 person design teams',
      'enterprise': '40% have 100+ person design teams'
    }
  };

  const getRecommendation = (data) => {
    const size = data.companySize;
    const teamSize = data.designTeamSize;
    const structure = data.existingOpsStructure;
    const complexity = data.organizationComplexity;
    
    // FIRST CHECK: Design team size threshold for dedicated DesignOps
    const teamSizeNumber = teamSize === '1' ? 1 : 
                          teamSize === '2-4' ? 3 : 
                          teamSize === '5-9' ? 7 : 
                          teamSize === '10-24' ? 17 : 
                          teamSize === '25-49' ? 37 : 
                          teamSize === '50-99' ? 75 : 
                          teamSize === '100-199' ? 150 : 200;
    
    // Small design teams (<10 people) don't need dedicated DesignOps
    if (teamSizeNumber < 10) {
      return "no-dedicated-ops";
    }
    
    // Size-first algorithm with existing structure consideration
    if (size === 'startup') {
      return 'unified';
    }
    
    if (size === 'growth') {
      // Small growth companies default to unified unless they have design focus
      if (structure === 'design-led' && teamSizeNumber >= 25) {
        return 'design-centered';
      }
      return 'unified';
    }
    
    if (size === 'scale') {
      // Mid-size companies are good candidates for hybrid approaches
      if (structure === 'multiple-functions' || complexity === 'multiple-business-units') {
        return 'hybrid';
      }
      if (structure === 'design-led' && teamSizeNumber >= 25) {
        return 'design-centered';
      }
      return 'hybrid'; // Default for scale
    }
    
    if (size === 'enterprise') {
      // Very large enterprises with multiple business units
      if (complexity === 'complex-ecosystem' || complexity === 'multiple-business-units') {
        return 'distributed-enterprise';
      }
      // Large companies - check existing structure to determine distributed approach
      if (structure === 'centralized' || structure === 'multiple-functions') {
        return 'distributed-with-central'; // They have central coordination
      }
      if (structure === 'single-function' || structure === 'none') {
        return 'distributed'; // Pure distributed
      }
      return 'distributed';
    }
    
    return 'unified';
  };

  const getSizeBenchmark = (companySize) => {
    const sizeMap = {
      "startup": "startup",
      "growth": "growth", 
      "scale": "scale",
      "enterprise": "enterprise"
    };
    
    return benchmarkData.companySizeDistribution[sizeMap[companySize]];
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDetailedInputChange = (field, value) => {
    setDetailedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field, value, checked) => {
    setDetailedData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSubmit = () => {
    const recommendedModel = getRecommendation(formData);
    setRecommendation(recommendedModel);
    setCurrentStep(1);
  };

  const renderQuickAssessment = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Building2 className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Quick Assessment</h2>
        <span className="text-sm text-gray-500">Core factors that drive 80% of the decision</span>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Company Size</label>
        <select 
          value={formData.companySize} 
          onChange={(e) => handleInputChange('companySize', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select company size...</option>
          <option value="startup">Startup (1-100 employees)</option>
          <option value="growth">Growth (101-500 employees)</option>
          <option value="scale">Scale (501-2000 employees)</option>
          <option value="enterprise">Enterprise (2000+ employees)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Design Team Size</label>
        <select 
          value={formData.designTeamSize} 
          onChange={(e) => handleInputChange('designTeamSize', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select design team size...</option>
          <option value="1">1 person</option>
          <option value="2-4">2-4 people</option>
          <option value="5-9">5-9 people</option>
          <option value="10-24">10-24 people</option>
          <option value="25-49">25-49 people</option>
          <option value="50-99">50-99 people</option>
          <option value="100-199">100-199 people</option>
          <option value="200+">200+ people</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Existing Operations Structure</label>
        <select 
          value={formData.existingOpsStructure} 
          onChange={(e) => handleInputChange('existingOpsStructure', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select existing structure...</option>
          <option value="none">No dedicated ops functions</option>
          <option value="single-function">Single ops function (e.g., just DesignOps)</option>
          <option value="design-led">Design-led ops (DesignOps + ResearchOps)</option>
          <option value="multiple-functions">Multiple separate ops functions</option>
          <option value="centralized">Already centralized ops structure</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Organization Complexity</label>
        <select 
          value={formData.organizationComplexity} 
          onChange={(e) => handleInputChange('organizationComplexity', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select organization complexity...</option>
          <option value="single-product">Single product/service</option>
          <option value="product-suite">Suite of related products</option>
          <option value="multiple-business-units">Multiple business units or divisions</option>
          <option value="complex-ecosystem">Complex multi-business ecosystem</option>
        </select>
      </div>
    </div>
  );

  const renderRecommendation = () => {
    if (!recommendation) return null;
    const model = models[recommendation];
    const benchmark = getSizeBenchmark(formData.companySize);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-semibold">Recommended Model</h2>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{model.name}</h3>
          <p className="text-gray-700 mb-4">{model.structure}</p>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600"><strong>Best for:</strong> {model.bestFor}</p>
          </div>
        </div>

        {benchmark && (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Industry Benchmark Context
            </h4>
            <div className="text-sm text-blue-700">
              <p className="mb-2">
                <strong>Your organization size ({formData.companySize}):</strong> {benchmark.percentage}% of companies in our DesignOps survey
              </p>
              <p className="mb-2">
                <strong>Typical design team size:</strong> {benchmark.designTeamRange}
              </p>
              <p className="text-xs text-blue-600 italic">
                Data source: DesignOps Benchmarking Survey (anonymized, n=333 responses)
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Strengths & Benefits
            </h4>
            <ul className="space-y-2">
              {model.pros.map((pro, index) => (
                <li key={index} className="text-sm text-green-700 flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Potential Challenges
            </h4>
            <ul className="space-y-2">
              {model.cons.map((con, index) => (
                <li key={index} className="text-sm text-red-700 flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={() => {
              setShowDetailed(true);
              setCurrentStep(1);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            Get Detailed Analysis
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
          
          <button 
            onClick={() => {
              setCurrentStep(0);
              setRecommendation(null);
              setShowDetailed(false);
              setFormData({
                companySize: '',
                designTeamSize: '',
                existingOpsStructure: '',
                organizationComplexity: ''
              });
            }}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  };

  const renderDetailedAnalysis = () => {
    const model = models[recommendation];
    
    // Define org structures for visualization
    const orgStructures = {
      'no-dedicated-ops': {
        name: 'No Dedicated DesignOps',
        structure: [
          {
            id: 'cpo',
            title: 'CPO / Head of Product',
            level: 0,
            x: 300,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'unified-ops',
            title: 'Unified Operations',
            level: 1,
            x: 300,
            y: 150,
            type: 'ops-leadership',
            reports: ['cpo'],
            responsibilities: ['Tool management', 'Basic design processes', 'Vendor coordination', 'General operations']
          },
          {
            id: 'design-manager',
            title: 'Design Manager',
            level: 1,
            x: 500,
            y: 150,
            type: 'design-leadership',
            reports: ['cpo'],
            responsibilities: ['Team management', 'Design process oversight', 'Design system coordination', 'Designer enablement']
          },
          {
            id: 'designers',
            title: 'Designers',
            level: 2,
            x: 500,
            y: 250,
            type: 'design-team',
            reports: ['design-manager'],
            responsibilities: ['Design work', 'Some ops tasks', 'Design system contributions', 'Process feedback']
          }
        ],
        connections: [
          { from: 'cpo', to: 'unified-ops' },
          { from: 'cpo', to: 'design-manager' },
          { from: 'design-manager', to: 'designers' }
        ]
      },
      unified: {
        name: 'Unified Product Operations',
        structure: [
          {
            id: 'cpo',
            title: 'CPO / Head of Product',
            level: 0,
            x: 400,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'product-ops-lead',
            title: 'Head of Product Operations',
            level: 1,
            x: 400,
            y: 150,
            type: 'ops-leadership',
            reports: ['cpo']
          },
          {
            id: 'design-ops',
            title: 'Design Operations',
            level: 2,
            x: 200,
            y: 250,
            type: 'ops-function',
            reports: ['product-ops-lead'],
            responsibilities: ['Design system governance', 'Tool management', 'Process optimization', 'Team enablement']
          },
          {
          {
            id: 'product-ops',
            title: 'Product Operations',
            level: 1,
            x: 150,
            y: 150,
            type: 'ops-function',
            reports: ['cpo'],
            responsibilities: ['Product analytics', 'Market research', 'Roadmap support', 'Product tools']
          },
          {
            id: 'design-ops',
            title: 'Design Operations',
            level: 1,
            x: 350,
            y: 150,
            type: 'ops-function',
            reports: ['head-design'],
            responsibilities: ['Design systems', 'Design tools', 'Process optimization', 'Team enablement']
          },
          {
            id: 'research-ops',
            title: 'Research Operations',
            level: 1,
            x: 550,
            y: 150,
            type: 'ops-function',
            reports: ['head-research'],
            responsibilities: ['Research infrastructure', 'Methodology', 'Participant management', 'Research tools']
          },
          {
            id: 'eng-ops',
            title: 'Engineering Operations',
            level: 1,
            x: 750,
            y: 150,
            type: 'ops-function',
            reports: ['cto'],
            responsibilities: ['Developer tooling', 'CI/CD', 'Infrastructure', 'Dev experience']
          }
        ],
        connections: [
          { from: 'cpo', to: 'product-ops' },
          { from: 'head-design', to: 'design-ops' },
          { from: 'head-research', to: 'research-ops' },
          { from: 'cto', to: 'eng-ops' }
        ]
      },
      'distributed-with-central': {
        name: 'Distributed Model with Central Coordination',
        structure: [
          {
            id: 'coo',
            title: 'COO / Head of Operations',
            level: 0,
            x: 450,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'central-ops-standards',
            title: 'Central Ops Standards',
            level: 1,
            x: 450,
            y: 130,
            type: 'ops-leadership',
            reports: ['coo'],
            responsibilities: ['Cross-functional standards', 'Tool governance', 'Best practice sharing', 'Ops strategy coordination']
          },
          {
            id: 'cpo',
            title: 'CPO',
            level: 1,
            x: 150,
            y: 200,
            type: 'leadership'
          },
          {
            id: 'head-design',
            title: 'Head of Design',
            level: 1,
            x: 350,
            y: 200,
            type: 'leadership'
          },
          {
            id: 'head-research',
            title: 'Head of Research',
            level: 1,
            x: 550,
            y: 200,
            type: 'leadership'
          },
          {
            id: 'cto',
            title: 'CTO',
            level: 1,
            x: 750,
            y: 200,
            type: 'leadership'
          },
          {
            id: 'product-ops',
            title: 'Product Operations',
            level: 2,
            x: 150,
            y: 300,
            type: 'ops-function',
            reports: ['cpo'],
            responsibilities: ['Product analytics', 'Market research', 'Roadmap support', 'Reports to CPO, coordinates with Central Standards']
          },
          {
            id: 'design-ops',
            title: 'Design Operations',
            level: 2,
            x: 350,
            y: 300,
            type: 'ops-function',
            reports: ['head-design'],
            responsibilities: ['Design systems', 'Design processes', 'Reports to Head of Design, coordinates with Central Standards']
          },
          {
            id: 'research-ops',
            title: 'Research Operations',
            level: 2,
            x: 550,
            y: 300,
            type: 'ops-function',
            reports: ['head-research'],
            responsibilities: ['Research infrastructure', 'Methodology', 'Reports to Head of Research, coordinates with Central Standards']
          },
          {
            id: 'eng-ops',
            title: 'Engineering Operations',
            level: 2,
            x: 750,
            y: 300,
            type: 'ops-function',
            reports: ['cto'],
            responsibilities: ['Developer tooling', 'CI/CD', 'Reports to CTO, coordinates with Central Standards']
          }
        ],
        connections: [
          { from: 'coo', to: 'central-ops-standards' },
          { from: 'central-ops-standards', to: 'cpo' },
          { from: 'central-ops-standards', to: 'head-design' },
          { from: 'central-ops-standards', to: 'head-research' },
          { from: 'central-ops-standards', to: 'cto' },
          { from: 'cpo', to: 'product-ops' },
          { from: 'head-design', to: 'design-ops' },
          { from: 'head-research', to: 'research-ops' },
          { from: 'cto', to: 'eng-ops' }
        ]
      },
      'distributed-enterprise': {
        name: 'Distributed Enterprise Model',
        structure: [
          {
            id: 'ceo',
            title: 'CEO / Executive Team',
            level: 0,
            x: 400,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'bu1',
            title: 'Business Unit A',
            level: 1,
            x: 200,
            y: 150,
            type: 'business-unit',
            reports: ['ceo'],
            responsibilities: ['Independent ops structure', 'Unit-specific processes', 'Autonomous decisions']
          },
          {
            id: 'bu2',
            title: 'Business Unit B',
            level: 1,
            x: 400,
            y: 150,
            type: 'business-unit',
            reports: ['ceo'],
            responsibilities: ['Independent ops structure', 'Unit-specific processes', 'Autonomous decisions']
          },
          {
            id: 'bu3',
            title: 'Business Unit C',
            level: 1,
            x: 600,
            y: 150,
            type: 'business-unit',
            reports: ['ceo'],
            responsibilities: ['Independent ops structure', 'Unit-specific processes', 'Autonomous decisions']
          },
          {
            id: 'bu1-ops',
            title: 'Unit A Ops Structure',
            level: 2,
            x: 200,
            y: 250,
            type: 'ops-function',
            reports: ['bu1'],
            responsibilities: ['May use unified, hybrid, or distributed', 'Tailored to unit needs', 'Independent decision-making']
          },
          {
            id: 'bu2-ops',
            title: 'Unit B Ops Structure',
            level: 2,
            x: 400,
            y: 250,
            type: 'ops-function',
            reports: ['bu2'],
            responsibilities: ['May use unified, hybrid, or distributed', 'Tailored to unit needs', 'Independent decision-making']
          },
          {
            id: 'bu3-ops',
            title: 'Unit C Ops Structure',
            level: 2,
            x: 600,
            y: 250,
            type: 'ops-function',
            reports: ['bu3'],
            responsibilities: ['May use unified, hybrid, or distributed', 'Tailored to unit needs', 'Independent decision-making']
          }
        ],
        connections: [
          { from: 'ceo', to: 'bu1' },
          { from: 'ceo', to: 'bu2' },
          { from: 'ceo', to: 'bu3' },
          { from: 'bu1', to: 'bu1-ops' },
          { from: 'bu2', to: 'bu2-ops' },
          { from: 'bu3', to: 'bu3-ops' }
        ]
      }
    };

    // Get the appropriate structure based on recommendation and existing setup
    const getStructureKey = () => {
      if (recommendation === "distributed" && formData.existingOpsStructure === "centralized") {
        return "distributed-with-central";
      }
      return recommendation;
    };
    
    const currentStructure = orgStructures[getStructureKey()];

    const getNodeColor = (type) => {
      switch (type) {
        case "leadership": return "#3B82F6";
        case "ops-leadership": return "#10B981";
        case "ops-function": return "#8B5CF6";
        case "design-leadership": return "#F59E0B";
        case "design-team": return "#EF4444";
        case "business-unit": return "#06B6D4";
        default: return "#6B7280";
      }
    };

    const getNodeSize = (type) => {
      switch (type) {
        case "leadership": return 12;
        case "ops-leadership": return 10;
        case "ops-function": return 8;
        case "design-leadership": return 10;
        case "design-team": return 8;
        case "business-unit": return 10;
        default: return 8;
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold">Interactive Organization Structure</h2>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{currentStructure.name}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCurrentState(false)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  !showCurrentState 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Recommended Structure
              </button>
              <button
                onClick={() => setShowCurrentState(true)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  showCurrentState 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Current State
              </button>
            </div>
          </div>
          
          <div className="relative bg-gray-50 rounded-lg" style={{ height: '400px', overflow: 'hidden' }}>
            <svg width="100%" height="100%" className="absolute inset-0">
              {currentStructure.connections.map((conn, index) => {
                const fromNode = currentStructure.structure.find(n => n.id === conn.from);
                const toNode = currentStructure.structure.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                
                return (
                  <line
                    key={index}
                    x1={fromNode.x}
                    y1={fromNode.y + 15}
                    x2={toNode.x}
                    y2={toNode.y - 15}
                    stroke="#D1D5DB"
                    strokeWidth="2"
                  />
                );
              })}
              
              {currentStructure.structure.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={getNodeSize(node.type)}
                    fill={getNodeColor(node.type)}
                    stroke={selectedNode?.id === node.id ? '#F59E0B' : '#FFFFFF'}
                    strokeWidth={selectedNode?.id === node.id ? '3' : '2'}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                  />
                  <text
                    x={node.x}
                    y={node.y + 25}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700 pointer-events-none"
                    style={{ fontSize: '11px' }}
                  >
                    {node.title.length > 20 ? node.title.substring(0, 18) + '...' : node.title}
                  </text>
                </g>
              ))}
            </svg>
            
            <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md border">
              <h4 className="text-sm font-medium mb-2">Legend</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Leadership</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Ops Leadership</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Ops Function</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Design Leadership</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Design Team</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span>Business Unit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedNode && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-purple-800">{selectedNode.title}</h4>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {selectedNode.responsibilities && (
              <div>
                <h5 className="font-medium text-purple-700 mb-2">Key Responsibilities:</h5>
                <ul className="space-y-1">
                  {selectedNode.responsibilities.map((resp, index) => (
                    <li key={index} className="text-sm text-purple-600 flex items-start">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4 text-xs text-purple-600">
              Click other nodes to explore their roles and responsibilities
            </div>
          </div>
        )}

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h4 className="text-lg font-semibold text-yellow-800 mb-3">Your Organization Insights</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-yellow-800 mb-2">Current Profile</h5>
              <ul className="text-yellow-700 space-y-1">
                <li>• Company: {formData.companySize} ({getSizeBenchmark(formData.companySize)?.percentage}% of survey)</li>
                <li>• Design team: {formData.designTeamSize} people</li>
                <li>• Current ops: {formData.existingOpsStructure?.replace('-', ' ')}</li>
                <li>• Complexity: {formData.organizationComplexity?.replace('-', ' ')}</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-yellow-800 mb-2">Recommended Changes</h5>
              <ul className="text-yellow-700 space-y-1">
                <li>• Structure: {model.name}</li>
                <li>• Best fit for your size and complexity</li>
                <li>• {currentStructure.structure.filter(n => n.type === 'ops-function').length} ops functions</li>
                <li>• Clear reporting lines and accountability</li>
              </ul>
            </div>
          </div>
        </div>

        {showDetailed && (
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowDetailed(false)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recommendation
            </button>
            
            <button 
              onClick={() => {
                setCurrentStep(0);
                setRecommendation(null);
                setShowDetailed(false);
                setFormData({
                  companySize: '',
                  designTeamSize: '',
                  existingOpsStructure: '',
                  organizationComplexity: ''
                });
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Start Over
            </button>
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Interactive visualization • Click nodes to explore roles and responsibilities<br/>
            Benchmarking data from DesignOps Survey by Design Operations Assembly (DOA) • n=333 responses
          </p>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    if (currentStep === 0) return renderQuickAssessment();
    if (currentStep === 1 && !showDetailed) return renderRecommendation();
    if (currentStep === 1 && showDetailed) return renderDetailedAnalysis();
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Operations Model Advisor</h1>
        <p className="text-gray-600">Get personalized recommendations for organizing your operations functions</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const isActive = (index === currentStep) || (showDetailed && index === 2);
            const isCompleted = (index < currentStep) || (currentStep === 1 && index === 1);
            
            return (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive || isCompleted
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  isActive || isCompleted ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        {renderCurrentStep()}
      </div>

      {currentStep === 0 && (
        <div className="flex justify-between">
          <div></div>
          <button 
            onClick={handleSubmit}
            disabled={!formData.companySize || !formData.designTeamSize || !formData.existingOpsStructure || !formData.organizationComplexity}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center ${
              (!formData.companySize || !formData.designTeamSize || !formData.existingOpsStructure || !formData.organizationComplexity)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Get Recommendation
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OperationsModelAdvisor;
            title: 'Product Operations',
            level: 2,
            x: 400,
            y: 250,
            type: 'ops-function',
            reports: ['product-ops-lead'],
            responsibilities: ['Data analytics', 'Roadmap planning', 'Process optimization', 'Tool management']
          },
          {
            id: 'research-ops',
            title: 'Research Operations',
            level: 2,
            x: 600,
            y: 250,
            type: 'ops-function',
            reports: ['product-ops-lead'],
            responsibilities: ['Participant management', 'Insight repository', 'Research tools', 'Methodology']
          },
          {
            id: 'content-ops',
            title: 'Content Operations',
            level: 2,
            x: 300,
            y: 350,
            type: 'ops-function',
            reports: ['product-ops-lead'],
            responsibilities: ['Content governance', 'Editorial workflows', 'Brand consistency', 'Content systems']
          }
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
          {
            id: 'cpo',
            title: 'CPO / Head of Product',
            level: 0,
            x: 200,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'head-design',
            title: 'Head of Design',
            level: 0,
            x: 600,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'product-ops-lead',
            title: 'Product Operations',
            level: 1,
            x: 200,
            y: 150,
            type: 'ops-function',
            reports: ['cpo'],
            responsibilities: ['Product analytics', 'Roadmap support', 'Product tools']
          },
          {
            id: 'design-ops-lead',
            title: 'Head of Design Operations',
            level: 1,
            x: 600,
            y: 150,
            type: 'ops-leadership',
            reports: ['head-design']
          },
          {
            id: 'design-ops',
            title: 'Design Operations',
            level: 2,
            x: 450,
            y: 250,
            type: 'ops-function',
            reports: ['design-ops-lead'],
            responsibilities: ['Design systems', 'Tool management', 'Process optimization', 'Team enablement']
          },
          {
            id: 'research-ops',
            title: 'Research Operations',
            level: 2,
            x: 600,
            y: 250,
            type: 'ops-function',
            reports: ['design-ops-lead'],
            responsibilities: ['Research infrastructure', 'Participant management', 'Insights', 'Methods']
          },
          {
            id: 'content-ops',
            title: 'Content Operations',
            level: 2,
            x: 750,
            y: 250,
            type: 'ops-function',
            reports: ['design-ops-lead'],
            responsibilities: ['Content strategy', 'Editorial workflows', 'Brand consistency']
          }
        ],
        connections: [
          { from: 'cpo', to: 'product-ops-lead' },
          { from: 'head-design', to: 'design-ops-lead' },
          { from: 'design-ops-lead', to: 'design-ops' },
          { from: 'design-ops-lead', to: 'research-ops' },
          { from: 'design-ops-lead', to: 'content-ops' }
        ]
      },
      hybrid: {
        name: 'Hybrid Embedded Model',
        structure: [
          {
            id: 'cpo',
            title: 'CPO',
            level: 0,
            x: 200,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'head-design',
            title: 'Head of Design',
            level: 0,
            x: 500,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'cto',
            title: 'CTO',
            level: 0,
            x: 800,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'shared-ops',
            title: 'Shared Operations Services',
            level: 1,
            x: 350,
            y: 130,
            type: 'ops-leadership',
            reports: ['cpo', 'head-design'],
            responsibilities: ['Tool procurement', 'Vendor management', 'Process standards', 'Analytics infrastructure']
          },
          {
            id: 'head-experience-ops',
            title: 'Head of Experience Ops',
            level: 1,
            x: 500,
            y: 150,
            type: 'ops-leadership',
            reports: ['head-design'],
            responsibilities: ['Experience ops strategy', 'Cross-functional coordination', 'Team enablement', 'Experience operations leadership']
          },
          {
            id: 'product-ops',
            title: 'Product Operations',
            level: 2,
            x: 200,
            y: 250,
            type: 'ops-function',
            reports: ['cpo'],
            responsibilities: ['Product analytics', 'Roadmap support', 'Market research']
          },
          {
            id: 'design-ops',
            title: 'Design Operations',
            level: 2,
            x: 400,
            y: 250,
            type: 'ops-function',
            reports: ['head-experience-ops'],
            responsibilities: ['Design systems', 'Design processes', 'Tool management', 'Design team enablement']
          },
          {
            id: 'research-ops',
            title: 'Research Operations',
            level: 2,
            x: 500,
            y: 250,
            type: 'ops-function',
            reports: ['head-experience-ops'],
            responsibilities: ['Research methodology', 'Participant management', 'Insights synthesis', 'Research infrastructure']
          },
          {
            id: 'content-ops',
            title: 'Content Operations',
            level: 2,
            x: 600,
            y: 250,
            type: 'ops-function',
            reports: ['head-experience-ops'],
            responsibilities: ['Content strategy', 'Editorial workflows', 'Brand consistency', 'Content governance']
          }
        ],
        connections: [
          { from: 'cpo', to: 'shared-ops' },
          { from: 'head-design', to: 'shared-ops' },
          { from: 'head-design', to: 'head-experience-ops' },
          { from: 'cpo', to: 'product-ops' },
          { from: 'head-experience-ops', to: 'design-ops' },
          { from: 'head-experience-ops', to: 'research-ops' },
          { from: 'head-experience-ops', to: 'content-ops' }
        ]
      },
      distributed: {
        name: 'Distributed Specialist Model',
        structure: [
          {
            id: 'cpo',
            title: 'CPO',
            level: 0,
            x: 150,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'head-design',
            title: 'Head of Design',
            level: 0,
            x: 350,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'head-research',
            title: 'Head of Research',
            level: 0,
            x: 550,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'cto',
            title: 'CTO',
            level: 0,
            x: 750,
            y: 50,
            type: 'leadership'
          },
          {
            id: 'product-ops',