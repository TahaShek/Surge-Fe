/**
 * Mock Job Data
 * Matches the backend schema structure
 */

import type { IJob } from '../types/job.types';

export const mockJobs: IJob[] = [
  {
    _id: "1",
    talentFinderId: {
      _id: "tf1",
      name: "TechCorp",
      companyName: "TechCorp Solutions",
    },
    title: "Frontend Developer Intern",
    description: "Looking for a passionate frontend developer to join our team. Experience with React and TypeScript required. You'll work on building modern web applications using cutting-edge technologies.",
    requirements: [
      "Experience with React and TypeScript",
      "Understanding of HTML, CSS, and JavaScript",
      "Basic knowledge of Git version control",
      "Strong problem-solving skills",
    ],
    responsibilities: [
      "Develop responsive web applications",
      "Collaborate with design team on UI/UX",
      "Write clean and maintainable code",
      "Participate in code reviews",
    ],
    skills: ["React", "TypeScript", "CSS", "HTML", "Git"],
    jobType: "internship",
    experienceLevel: "entry",
    location: "San Francisco, CA",
    jobWorkingType: "remote",
    salary: {
      min: 15,
      max: 20,
      currency: "USD",
    },
    benefits: [
      "Health Insurance",
      "Flexible Hours",
      "Learning Budget",
      "Remote Work",
    ],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: "active",
    applicantsCount: 12,
    viewsCount: 156,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    _id: "2",
    talentFinderId: {
      _id: "tf2",
      name: "StartupXYZ",
      companyName: "StartupXYZ Inc.",
    },
    title: "Marketing Coordinator",
    description: "Help us grow our brand through creative marketing campaigns. Perfect for marketing students looking to gain real-world experience. You'll work closely with our marketing team on social media, content creation, and analytics.",
    requirements: [
      "Marketing or related field of study",
      "Social media management experience",
      "Strong written communication skills",
      "Creative thinking and problem-solving",
    ],
    responsibilities: [
      "Create engaging social media content",
      "Analyze campaign performance",
      "Assist with content creation",
      "Manage social media calendar",
    ],
    skills: ["Social Media", "Content Creation", "Analytics", "Copywriting"],
    jobType: "part-time",
    experienceLevel: "entry",
    location: "New York, NY",
    jobWorkingType: "hybrid",
    salary: {
      min: 18,
      max: 25,
      currency: "USD",
    },
    benefits: [
      "Flexible Schedule",
      "Team Events",
      "Professional Development",
    ],
    applicationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    status: "active",
    applicantsCount: 8,
    viewsCount: 89,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    _id: "3",
    talentFinderId: {
      _id: "tf3",
      name: "DataCo",
      companyName: "DataCo Analytics",
    },
    title: "Data Science Intern",
    description: "Work with large datasets and machine learning models. Python and SQL experience required. You'll assist our data science team in analyzing data, building models, and creating insights for business decisions.",
    requirements: [
      "Python programming experience",
      "SQL knowledge",
      "Understanding of machine learning basics",
      "Strong analytical skills",
    ],
    responsibilities: [
      "Clean and preprocess data",
      "Build and test ML models",
      "Create data visualizations",
      "Generate insights and reports",
    ],
    skills: ["Python", "SQL", "Machine Learning", "Pandas", "NumPy"],
    jobType: "internship",
    experienceLevel: "mid",
    location: "San Francisco, CA",
    jobWorkingType: "on-site",
    salary: {
      min: 20,
      max: 30,
      currency: "USD",
    },
    benefits: [
      "Health Insurance",
      "401(k) Matching",
      "Stock Options",
      "Free Meals",
    ],
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    status: "active",
    applicantsCount: 25,
    viewsCount: 234,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    _id: "4",
    talentFinderId: {
      _id: "tf4",
      name: "DesignHub",
      companyName: "DesignHub Creative",
    },
    title: "UX/UI Designer",
    description: "Create beautiful and intuitive user interfaces. Portfolio required. You'll work on designing user experiences for web and mobile applications, collaborating with developers and product managers.",
    requirements: [
      "Portfolio demonstrating UI/UX design work",
      "Proficiency in Figma or similar tools",
      "Understanding of design principles",
      "Ability to create wireframes and prototypes",
    ],
    responsibilities: [
      "Design user interfaces",
      "Create wireframes and prototypes",
      "Conduct user research",
      "Collaborate with development team",
    ],
    skills: ["Figma", "UI Design", "Prototyping", "User Research", "Adobe XD"],
    jobType: "full-time",
    experienceLevel: "entry",
    location: "Remote",
    jobWorkingType: "remote",
    salary: {
      min: 25,
      max: 35,
      currency: "USD",
    },
    benefits: [
      "Remote Work",
      "Health Insurance",
      "Design Budget",
      "Flexible Hours",
    ],
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    status: "active",
    applicantsCount: 34,
    viewsCount: 412,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "5",
    talentFinderId: {
      _id: "tf5",
      name: "CloudTech",
      companyName: "CloudTech Solutions",
    },
    title: "Software Engineer",
    description: "Build scalable cloud applications. Experience with AWS and microservices preferred. You'll work on backend services, API development, and cloud infrastructure.",
    requirements: [
      "Strong programming skills in Java or similar",
      "AWS cloud experience",
      "Understanding of microservices architecture",
      "Experience with Docker and containerization",
    ],
    responsibilities: [
      "Develop backend services",
      "Design and implement APIs",
      "Deploy applications to cloud",
      "Maintain and optimize existing systems",
    ],
    skills: ["Java", "AWS", "Docker", "Microservices", "Kubernetes"],
    jobType: "full-time",
    experienceLevel: "mid",
    location: "Austin, TX",
    jobWorkingType: "hybrid",
    salary: {
      min: 30,
      max: 40,
      currency: "USD",
    },
    benefits: [
      "Health Insurance",
      "401(k) Matching",
      "Stock Options",
      "Remote Work Options",
      "Professional Development",
    ],
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    status: "active",
    applicantsCount: 45,
    viewsCount: 523,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "6",
    talentFinderId: {
      _id: "tf6",
      name: "MediaGroup",
      companyName: "MediaGroup Publishing",
    },
    title: "Content Writer",
    description: "Write engaging content for our blog and social media channels. You'll create articles, blog posts, and social media content that engages our audience and drives traffic.",
    requirements: [
      "Excellent writing skills",
      "Understanding of SEO principles",
      "Ability to research topics thoroughly",
      "Social media experience",
    ],
    responsibilities: [
      "Write blog posts and articles",
      "Create social media content",
      "Optimize content for SEO",
      "Research trending topics",
    ],
    skills: ["Writing", "SEO", "Research", "Content Strategy", "WordPress"],
    jobType: "contract",
    experienceLevel: "entry",
    location: "Remote",
    jobWorkingType: "remote",
    salary: {
      min: 15,
      max: 22,
      currency: "USD",
    },
    benefits: [
      "Remote Work",
      "Flexible Schedule",
    ],
    applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: "active",
    applicantsCount: 18,
    viewsCount: 167,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "7",
    talentFinderId: {
      _id: "tf7",
      name: "FinancePro",
      companyName: "FinancePro Advisors",
    },
    title: "Financial Analyst Intern",
    description: "Assist our finance team with data analysis, financial modeling, and reporting. Perfect for finance or business students looking to gain practical experience.",
    requirements: [
      "Finance or business-related field of study",
      "Strong analytical skills",
      "Excel proficiency",
      "Attention to detail",
    ],
    responsibilities: [
      "Analyze financial data",
      "Create financial reports",
      "Assist with budgeting and forecasting",
      "Support financial modeling",
    ],
    skills: ["Excel", "Financial Analysis", "Data Analysis", "Reporting"],
    jobType: "internship",
    experienceLevel: "entry",
    location: "Chicago, IL",
    jobWorkingType: "on-site",
    salary: {
      min: 16,
      max: 22,
      currency: "USD",
    },
    benefits: [
      "Health Insurance",
      "Professional Development",
      "Mentorship Program",
    ],
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    status: "active",
    applicantsCount: 21,
    viewsCount: 198,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    _id: "8",
    talentFinderId: {
      _id: "tf8",
      name: "DevOpsSolutions",
      companyName: "DevOps Solutions LLC",
    },
    title: "DevOps Engineer",
    description: "Manage infrastructure, CI/CD pipelines, and automation tools. Experience with cloud platforms and containerization required.",
    requirements: [
      "Experience with cloud platforms (AWS, Azure, GCP)",
      "Knowledge of CI/CD tools",
      "Understanding of containerization",
      "Scripting skills (Python, Bash)",
    ],
    responsibilities: [
      "Maintain and optimize infrastructure",
      "Build and maintain CI/CD pipelines",
      "Automate deployment processes",
      "Monitor system performance",
    ],
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Python", "Terraform"],
    jobType: "full-time",
    experienceLevel: "senior",
    location: "Seattle, WA",
    jobWorkingType: "remote",
    salary: {
      min: 45,
      max: 60,
      currency: "USD",
    },
    benefits: [
      "Health Insurance",
      "401(k) Matching",
      "Stock Options",
      "Remote Work",
      "Learning Budget",
    ],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: "active",
    applicantsCount: 56,
    viewsCount: 678,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "9",
    talentFinderId: {
      _id: "tf9",
      name: "MobileFirst",
      companyName: "MobileFirst Apps",
    },
    title: "Mobile App Developer (Freelance)",
    description: "Develop mobile applications for iOS and Android. Work on exciting projects with flexible hours. Perfect for experienced developers looking for freelance opportunities.",
    requirements: [
      "Experience with React Native or Flutter",
      "iOS or Android development experience",
      "Portfolio of mobile apps",
      "Strong problem-solving skills",
    ],
    responsibilities: [
      "Develop mobile applications",
      "Fix bugs and optimize performance",
      "Collaborate with design team",
      "Test apps on various devices",
    ],
    skills: ["React Native", "Flutter", "iOS", "Android", "JavaScript"],
    jobType: "freelance",
    experienceLevel: "mid",
    location: "Remote",
    jobWorkingType: "remote",
    salary: {
      min: 35,
      max: 50,
      currency: "USD",
    },
    benefits: [
      "Remote Work",
      "Flexible Hours",
      "Project-based",
    ],
    applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    status: "active",
    applicantsCount: 29,
    viewsCount: 345,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "10",
    talentFinderId: {
      _id: "tf10",
      name: "EduTech",
      companyName: "EduTech Learning",
    },
    title: "Lead Product Manager",
    description: "Lead product development initiatives and work with cross-functional teams to deliver innovative educational technology solutions.",
    requirements: [
      "5+ years of product management experience",
      "Experience in EdTech or SaaS",
      "Strong leadership skills",
      "Technical background preferred",
    ],
    responsibilities: [
      "Define product roadmap",
      "Lead product development teams",
      "Collaborate with stakeholders",
      "Analyze market trends and user needs",
    ],
    skills: ["Product Management", "Agile", "Roadmapping", "Stakeholder Management", "Analytics"],
    jobType: "full-time",
    experienceLevel: "lead",
    location: "Boston, MA",
    jobWorkingType: "hybrid",
    salary: {
      min: 50,
      max: 70,
      currency: "USD",
    },
    benefits: [
      "Health Insurance",
      "401(k) Matching",
      "Stock Options",
      "Flexible Hours",
      "Professional Development",
      "Unlimited PTO",
    ],
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
    status: "active",
    applicantsCount: 67,
    viewsCount: 892,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
];

