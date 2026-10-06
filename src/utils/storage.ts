import { 
  UserProfile, 
  ScholarshipScheme, 
  Application, 
  NotificationItem, 
  SupportingDocument 
} from '../types';
import { calculateEvaluationScore, checkScholarshipEligibility } from './evaluationEngine';

export const INITIAL_SCHEMES: ScholarshipScheme[] = [
  {
    id: 'SCH-MCM-01',
    code: 'MCM-2026',
    name: 'Institutional Merit-cum-Means Excellence Scholarship',
    category: 'Merit-cum-Means',
    description: 'Comprehensive financial award granted to high-achieving undergraduate and postgraduate students from families with modest financial circumstances.',
    awardAmount: 4800,
    currencySymbol: '$',
    awardFrequency: 'per academic year',
    totalSlots: 4,
    minAcademicPercentage: 75.0,
    maxAnnualFamilyIncome: 30000,
    eligibleCategories: ['All'],
    eligibleGenders: ['All'],
    deadline: '2026-11-15',
    academicWeight: 50,
    financialNeedWeight: 40,
    hardshipBonusWeight: 10,
    status: 'Active',
    sponsor: 'University Endowment & Alumni Trust',
  },
  {
    id: 'SCH-STEM-02',
    code: 'WSTEM-2026',
    name: 'Women in STEM Leadership Fellowship',
    category: 'Women in STEM',
    description: 'Targeted scholarship initiative fostering female talent pursuing computer science, electrical, mechanical, and biotechnology disciplines.',
    awardAmount: 5500,
    currencySymbol: '$',
    awardFrequency: 'per academic year',
    totalSlots: 3,
    minAcademicPercentage: 70.0,
    maxAnnualFamilyIncome: 45000,
    eligibleCategories: ['All'],
    eligibleGenders: ['Female', 'Non-binary'],
    deadline: '2026-11-30',
    academicWeight: 50,
    financialNeedWeight: 40,
    hardshipBonusWeight: 10,
    status: 'Active',
    sponsor: 'Global Technology Foundation',
  },
  {
    id: 'SCH-EWS-03',
    code: 'EWS-GRANT-2026',
    name: 'Economically Weaker Section (EWS) Higher Ed Grant',
    category: 'Need-Based',
    description: 'Direct institutional grant covering 100% tuition fees for students belonging to verified below-poverty line or low-income household backgrounds.',
    awardAmount: 6200,
    currencySymbol: '$',
    awardFrequency: 'full annual tuition waiver',
    totalSlots: 5,
    minAcademicPercentage: 60.0,
    maxAnnualFamilyIncome: 18000,
    eligibleCategories: ['EWS', 'SC', 'ST', 'OBC'],
    eligibleGenders: ['All'],
    deadline: '2026-10-31',
    academicWeight: 40,
    financialNeedWeight: 50,
    hardshipBonusWeight: 10,
    status: 'Active',
    sponsor: 'State Ministry of Higher Education',
  },
  {
    id: 'SCH-FIRSTGEN-04',
    code: 'FG-SCHOLAR-2026',
    name: 'First-Generation College Achievers Fellowship',
    category: 'First-Generation',
    description: 'Empowering trailblazing scholars whose parents have not obtained a university bachelor degree, bridging social and economic barriers.',
    awardAmount: 3500,
    currencySymbol: '$',
    awardFrequency: 'annual stipend + book allowance',
    totalSlots: 3,
    minAcademicPercentage: 65.0,
    maxAnnualFamilyIncome: 35000,
    eligibleCategories: ['All'],
    eligibleGenders: ['All'],
    deadline: '2026-12-10',
    academicWeight: 50,
    financialNeedWeight: 40,
    hardshipBonusWeight: 10,
    status: 'Active',
    sponsor: 'Chancellor Educational Opportunity Fund',
  },
  {
    id: 'SCH-PRES-05',
    code: 'PRES-HONORS-2026',
    name: "President's Academic Distinction Fellowship",
    category: 'Academic Excellence',
    description: 'Premier competitive award recognizing top 2 percentile academic standing combined with faculty recommendation and research promise.',
    awardAmount: 7500,
    currencySymbol: '$',
    awardFrequency: 'annual distinction grant',
    totalSlots: 2,
    minAcademicPercentage: 88.0,
    maxAnnualFamilyIncome: 75000,
    eligibleCategories: ['All'],
    eligibleGenders: ['All'],
    deadline: '2026-11-20',
    academicWeight: 70,
    financialNeedWeight: 20,
    hardshipBonusWeight: 10,
    status: 'Active',
    sponsor: 'University Presidential Council',
  },
];

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'STU-001',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@campus.edu',
    role: 'student',
    studentId: 'STU-2026-1048',
    phone: '+1 (555) 234-8901',
    gender: 'Female',
    category: 'EWS',
    dateOfBirth: '2005-04-18',
    address: '742 Elmwood Terrace, Sector 4, Metro City',
    institutionName: 'Metropolitan Institute of Technology',
    currentDegree: 'B.Tech in Artificial Intelligence & Data Science',
    currentDepartment: 'Computer Science & Engineering',
    currentSemesterYear: 'Year 2 / Semester 4',
    firstGenerationStudent: true,
    singleParentFamily: true,
    differentlyAbled: false,
    avatar: 'AS',
  },
  {
    id: 'STU-002',
    name: 'Marcus Chen',
    email: 'marcus.chen@campus.edu',
    role: 'student',
    studentId: 'STU-2026-2189',
    phone: '+1 (555) 478-9120',
    gender: 'Male',
    category: 'General',
    dateOfBirth: '2004-09-12',
    address: '118 University Way, North Quarter',
    institutionName: 'Metropolitan Institute of Technology',
    currentDegree: 'B.S. in Electrical & Robotics Engineering',
    currentDepartment: 'Electrical Engineering',
    currentSemesterYear: 'Year 3 / Semester 6',
    firstGenerationStudent: false,
    singleParentFamily: false,
    differentlyAbled: false,
    avatar: 'MC',
  },
  {
    id: 'STU-003',
    name: 'Fatima Al-Sayed',
    email: 'fatima.sayed@campus.edu',
    role: 'student',
    studentId: 'STU-2026-3042',
    phone: '+1 (555) 629-3310',
    gender: 'Female',
    category: 'OBC',
    dateOfBirth: '2005-01-25',
    address: '35 Crescent Boulevard, West Hills',
    institutionName: 'Metropolitan Institute of Technology',
    currentDegree: 'B.Tech in Biotechnology & Bio-Computing',
    currentDepartment: 'Biotechnology',
    currentSemesterYear: 'Year 2 / Semester 3',
    firstGenerationStudent: true,
    singleParentFamily: false,
    differentlyAbled: false,
    avatar: 'FA',
  },
  {
    id: 'ADMIN-001',
    name: 'Dr. Eleanor Vance',
    email: 'e.vance@campus.edu',
    role: 'admin',
    studentId: 'FAC-CHAIR-08',
    phone: '+1 (555) 901-4455',
    gender: 'Female',
    category: 'General',
    dateOfBirth: '1978-06-14',
    address: 'Academic Senate Building, Suite 304',
    institutionName: 'Metropolitan Institute of Technology',
    currentDegree: 'Ph.D. in Educational Policy',
    currentDepartment: 'Office of Financial Aid & Scholarships',
    currentSemesterYear: 'Chairperson, Evaluation Board',
    firstGenerationStudent: false,
    singleParentFamily: false,
    differentlyAbled: false,
    avatar: 'EV',
  },
];

const createSampleDocs = (studentName: string): { academic: SupportingDocument[]; financial: SupportingDocument[] } => {
  return {
    academic: [
      {
        id: `DOC-ACAD-10-${Math.random().toString(36).substr(2, 6)}`,
        type: '10th_marksheet',
        name: 'Secondary School (10th) Marksheet & Certificate',
        fileName: `${studentName.toLowerCase().replace(/\s+/g, '_')}_10th_marksheet.pdf`,
        fileSize: '1.4 MB',
        uploadDate: '2026-09-12',
        status: 'Verified',
        verifiedBy: 'Dr. Eleanor Vance (Dean Office)',
        verifiedAt: '2026-09-18',
        issuerAuthority: 'Central Board of Secondary Education',
      },
      {
        id: `DOC-ACAD-12-${Math.random().toString(36).substr(2, 6)}`,
        type: '12th_marksheet',
        name: 'Higher Secondary (12th) Marksheet',
        fileName: `${studentName.toLowerCase().replace(/\s+/g, '_')}_12th_transcript.pdf`,
        fileSize: '1.8 MB',
        uploadDate: '2026-09-12',
        status: 'Verified',
        verifiedBy: 'Dr. Eleanor Vance (Dean Office)',
        verifiedAt: '2026-09-18',
        issuerAuthority: 'Board of Higher Secondary Examinations',
      },
      {
        id: `DOC-ACAD-COL-${Math.random().toString(36).substr(2, 6)}`,
        type: 'college_transcript',
        name: 'Consolidated College Semester Grade Card (Sem 1-3)',
        fileName: `${studentName.toLowerCase().replace(/\s+/g, '_')}_college_cgpa_record.pdf`,
        fileSize: '2.1 MB',
        uploadDate: '2026-09-14',
        status: 'Verified',
        verifiedBy: 'Dr. Eleanor Vance (Dean Office)',
        verifiedAt: '2026-09-18',
        issuerAuthority: 'Office of the University Registrar',
      },
    ],
    financial: [
      {
        id: `DOC-FIN-INC-${Math.random().toString(36).substr(2, 6)}`,
        type: 'income_certificate',
        name: 'Official Government Family Income Certificate',
        fileName: `${studentName.toLowerCase().replace(/\s+/g, '_')}_revenue_income_cert.pdf`,
        fileSize: '890 KB',
        uploadDate: '2026-09-14',
        status: 'Verified',
        verifiedBy: 'Dr. Eleanor Vance (Dean Office)',
        verifiedAt: '2026-09-18',
        issuerAuthority: 'Sub-Divisional Revenue Magistrate Office',
      },
      {
        id: `DOC-FIN-EWS-${Math.random().toString(36).substr(2, 6)}`,
        type: 'caste_ews_certificate',
        name: 'Economically Weaker Section (EWS) Certificate',
        fileName: `${studentName.toLowerCase().replace(/\s+/g, '_')}_ews_verified.pdf`,
        fileSize: '1.1 MB',
        uploadDate: '2026-09-14',
        status: 'Verified',
        verifiedBy: 'Dr. Eleanor Vance (Dean Office)',
        verifiedAt: '2026-09-18',
        issuerAuthority: 'District Revenue Department',
      },
    ],
  };
};

export const INITIAL_APPLICATIONS: Application[] = [
  // Application 1: Ananya Sharma -> MCM-01 (Selected Rank 1)
  (() => {
    const scheme = INITIAL_SCHEMES[0];
    const docs = createSampleDocs('Ananya Sharma');
    const academicPercentage = 91.4;
    const income = 13500;
    const elig = checkScholarshipEligibility(academicPercentage, income, 'EWS', 'Female', scheme);
    const scores = calculateEvaluationScore({
      tenthPercentage: 93.2,
      twelfthPercentage: 92.0,
      currentPercentage: academicPercentage,
      annualFamilyIncome: income,
      numberOfDependents: 4,
      isEwsOrBpl: true,
      hardship: {
        hasChronicMedicalCost: true,
        singleEarningParent: true,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
      },
      firstGenerationStudent: true,
    }, scheme);

    return {
      id: 'APP-2026-0101',
      studentId: 'STU-001',
      studentName: 'Ananya Sharma',
      studentEmail: 'ananya.sharma@campus.edu',
      studentRoll: 'STU-2026-1048',
      studentPhone: '+1 (555) 234-8901',
      gender: 'Female',
      category: 'EWS',
      institutionName: 'Metropolitan Institute of Technology',
      degreeDepartment: 'B.Tech AI & Data Science (Year 2)',
      schemeId: scheme.id,
      schemeName: scheme.name,
      submissionDate: '2026-09-14',
      status: 'Selected',
      tenthBoard: 'Central Board of Secondary Education (CBSE)',
      tenthPercentage: 93.2,
      twelfthBoard: 'State Board of Higher Secondary Education',
      twelfthPercentage: 92.0,
      currentCgpa: 9.24,
      currentPercentage: academicPercentage,
      academicCertificates: docs.academic,
      annualFamilyIncome: income,
      fatherOccupation: 'Deceased (Former small shop assistant)',
      motherOccupation: 'Tailoring & Garment Worker (Unorganized sector)',
      guardianOccupation: 'None',
      numberOfDependents: 4,
      numberOfStudyingSiblings: 2,
      isEwsOrBpl: true,
      bplCardNumber: 'BPL-METRO-49201',
      hardship: {
        hasChronicMedicalCost: true,
        singleEarningParent: true,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
        additionalNotes: 'Mother is sole provider; grandmother undergoing chronic cardiac therapy; two younger siblings enrolled in public high school.',
      },
      financialCertificates: docs.financial,
      isEligible: elig.isEligible,
      eligibilityCheck: elig,
      ...scores,
      meritRank: 1,
      reviewedBy: 'Dr. Eleanor Vance',
      reviewDate: '2026-09-20',
      adminRemarks: 'Outstanding academic record (9.24 CGPA) paired with acute financial need. All income and EWS revenue certificates authenticated. Recommended for full award.',
      awardLetterGenerated: true,
    } as Application;
  })(),

  // Application 2: Fatima Al-Sayed -> STEM-02 (Selected Rank 1)
  (() => {
    const scheme = INITIAL_SCHEMES[1];
    const docs = createSampleDocs('Fatima Al-Sayed');
    const academicPercentage = 88.6;
    const income = 22000;
    const elig = checkScholarshipEligibility(academicPercentage, income, 'OBC', 'Female', scheme);
    const scores = calculateEvaluationScore({
      tenthPercentage: 90.5,
      twelfthPercentage: 87.8,
      currentPercentage: academicPercentage,
      annualFamilyIncome: income,
      numberOfDependents: 3,
      isEwsOrBpl: false,
      hardship: {
        hasChronicMedicalCost: false,
        singleEarningParent: true,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
      },
      firstGenerationStudent: true,
    }, scheme);

    return {
      id: 'APP-2026-0102',
      studentId: 'STU-003',
      studentName: 'Fatima Al-Sayed',
      studentEmail: 'fatima.sayed@campus.edu',
      studentRoll: 'STU-2026-3042',
      studentPhone: '+1 (555) 629-3310',
      gender: 'Female',
      category: 'OBC',
      institutionName: 'Metropolitan Institute of Technology',
      degreeDepartment: 'B.Tech Biotechnology (Year 2)',
      schemeId: scheme.id,
      schemeName: scheme.name,
      submissionDate: '2026-09-15',
      status: 'Selected',
      tenthBoard: 'State Board of Education',
      tenthPercentage: 90.5,
      twelfthBoard: 'State Board of Education',
      twelfthPercentage: 87.8,
      currentCgpa: 8.92,
      currentPercentage: academicPercentage,
      academicCertificates: docs.academic,
      annualFamilyIncome: income,
      fatherOccupation: 'Mechanic / Auto Workshop Technician',
      motherOccupation: 'Homemaker',
      numberOfDependents: 3,
      numberOfStudyingSiblings: 1,
      isEwsOrBpl: false,
      hardship: {
        hasChronicMedicalCost: false,
        singleEarningParent: true,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
        additionalNotes: 'First in family to enter tertiary STEM education. Father is sole wage earner.',
      },
      financialCertificates: docs.financial,
      isEligible: elig.isEligible,
      eligibilityCheck: elig,
      ...scores,
      meritRank: 1,
      reviewedBy: 'Dr. Eleanor Vance',
      reviewDate: '2026-09-21',
      adminRemarks: 'Strong biotechnology research aptitude; verified revenue documents and academic semester records.',
      awardLetterGenerated: true,
    } as Application;
  })(),

  // Application 3: Marcus Chen -> MCM-01 (Selected Rank 2)
  (() => {
    const scheme = INITIAL_SCHEMES[0];
    const docs = createSampleDocs('Marcus Chen');
    const academicPercentage = 84.8;
    const income = 24500;
    const elig = checkScholarshipEligibility(academicPercentage, income, 'General', 'Male', scheme);
    const scores = calculateEvaluationScore({
      tenthPercentage: 86.0,
      twelfthPercentage: 83.5,
      currentPercentage: academicPercentage,
      annualFamilyIncome: income,
      numberOfDependents: 3,
      isEwsOrBpl: false,
      hardship: {
        hasChronicMedicalCost: false,
        singleEarningParent: false,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
      },
      firstGenerationStudent: false,
    }, scheme);

    return {
      id: 'APP-2026-0103',
      studentId: 'STU-002',
      studentName: 'Marcus Chen',
      studentEmail: 'marcus.chen@campus.edu',
      studentRoll: 'STU-2026-2189',
      studentPhone: '+1 (555) 478-9120',
      gender: 'Male',
      category: 'General',
      institutionName: 'Metropolitan Institute of Technology',
      degreeDepartment: 'B.S. Robotics & Electrical (Year 3)',
      schemeId: scheme.id,
      schemeName: scheme.name,
      submissionDate: '2026-09-16',
      status: 'Selected',
      tenthBoard: 'National Council Curriculum',
      tenthPercentage: 86.0,
      twelfthBoard: 'National Council Curriculum',
      twelfthPercentage: 83.5,
      currentCgpa: 8.52,
      currentPercentage: academicPercentage,
      academicCertificates: docs.academic,
      annualFamilyIncome: income,
      fatherOccupation: 'Delivery Courier Contractor',
      motherOccupation: 'Part-time Retail Cashier',
      numberOfDependents: 3,
      numberOfStudyingSiblings: 1,
      isEwsOrBpl: false,
      hardship: {
        hasChronicMedicalCost: false,
        singleEarningParent: false,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
        additionalNotes: 'Household coping with high metropolitan rent and twin sibling college tuition.',
      },
      financialCertificates: docs.financial,
      isEligible: elig.isEligible,
      eligibilityCheck: elig,
      ...scores,
      meritRank: 2,
      reviewedBy: 'Dr. Eleanor Vance',
      reviewDate: '2026-09-22',
      adminRemarks: 'Solid coursework in robotics; family income within $30k ceiling. Recommended for award.',
      awardLetterGenerated: true,
    } as Application;
  })(),

  // Application 4: Devika Nair -> EWS-03 (Selected Rank 1)
  (() => {
    const scheme = INITIAL_SCHEMES[2];
    const docs = createSampleDocs('Devika Nair');
    const academicPercentage = 82.5;
    const income = 11000;
    const elig = checkScholarshipEligibility(academicPercentage, income, 'EWS', 'Female', scheme);
    const scores = calculateEvaluationScore({
      tenthPercentage: 85.0,
      twelfthPercentage: 81.2,
      currentPercentage: academicPercentage,
      annualFamilyIncome: income,
      numberOfDependents: 5,
      isEwsOrBpl: true,
      hardship: {
        hasChronicMedicalCost: true,
        singleEarningParent: true,
        hasAgriculturalLossOrDebt: true,
        orphanOrFostered: false,
      },
      firstGenerationStudent: true,
    }, scheme);

    return {
      id: 'APP-2026-0104',
      studentId: 'STU-004',
      studentName: 'Devika Nair',
      studentEmail: 'devika.nair@campus.edu',
      studentRoll: 'STU-2026-4190',
      studentPhone: '+1 (555) 782-1104',
      gender: 'Female',
      category: 'EWS',
      institutionName: 'Metropolitan Institute of Technology',
      degreeDepartment: 'B.Tech Civil Engineering (Year 2)',
      schemeId: scheme.id,
      schemeName: scheme.name,
      submissionDate: '2026-09-17',
      status: 'Selected',
      tenthBoard: 'State Board of Education',
      tenthPercentage: 85.0,
      twelfthBoard: 'State Board of Education',
      twelfthPercentage: 81.2,
      currentCgpa: 8.35,
      currentPercentage: academicPercentage,
      academicCertificates: docs.academic,
      annualFamilyIncome: income,
      fatherOccupation: 'Subsistence Marginal Farmer',
      motherOccupation: 'Home Farm Helper',
      numberOfDependents: 5,
      numberOfStudyingSiblings: 3,
      isEwsOrBpl: true,
      bplCardNumber: 'BPL-DIST-9021',
      hardship: {
        hasChronicMedicalCost: true,
        singleEarningParent: false,
        hasAgriculturalLossOrDebt: true,
        orphanOrFostered: false,
        additionalNotes: 'Severe rural crop loss in 2025; debt settlement pending; elderly grandparents dependent.',
      },
      financialCertificates: docs.financial,
      isEligible: elig.isEligible,
      eligibilityCheck: elig,
      ...scores,
      meritRank: 1,
      reviewedBy: 'Dr. Eleanor Vance',
      reviewDate: '2026-09-22',
      adminRemarks: 'High priority candidate with certified EWS credentials and verifiable rural hardship.',
      awardLetterGenerated: true,
    } as Application;
  })(),

  // Application 5: Arjun Patel -> MCM-01 (Waitlisted Rank 5)
  (() => {
    const scheme = INITIAL_SCHEMES[0];
    const docs = createSampleDocs('Arjun Patel');
    const academicPercentage = 77.4;
    const income = 28500;
    const elig = checkScholarshipEligibility(academicPercentage, income, 'OBC', 'Male', scheme);
    const scores = calculateEvaluationScore({
      tenthPercentage: 79.0,
      twelfthPercentage: 76.2,
      currentPercentage: academicPercentage,
      annualFamilyIncome: income,
      numberOfDependents: 2,
      isEwsOrBpl: false,
      hardship: {
        hasChronicMedicalCost: false,
        singleEarningParent: false,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
      },
      firstGenerationStudent: false,
    }, scheme);

    return {
      id: 'APP-2026-0105',
      studentId: 'STU-005',
      studentName: 'Arjun Patel',
      studentEmail: 'arjun.patel@campus.edu',
      studentRoll: 'STU-2026-5501',
      studentPhone: '+1 (555) 341-9922',
      gender: 'Male',
      category: 'OBC',
      institutionName: 'Metropolitan Institute of Technology',
      degreeDepartment: 'B.S. Mechanical Engineering (Year 2)',
      schemeId: scheme.id,
      schemeName: scheme.name,
      submissionDate: '2026-09-18',
      status: 'Waitlisted',
      tenthBoard: 'Central Board of Secondary Education',
      tenthPercentage: 79.0,
      twelfthBoard: 'Central Board of Secondary Education',
      twelfthPercentage: 76.2,
      currentCgpa: 7.78,
      currentPercentage: academicPercentage,
      academicCertificates: docs.academic,
      annualFamilyIncome: income,
      fatherOccupation: 'Small Hardware Store Clerk',
      motherOccupation: 'Housewife',
      numberOfDependents: 2,
      numberOfStudyingSiblings: 1,
      isEwsOrBpl: false,
      hardship: {
        hasChronicMedicalCost: false,
        singleEarningParent: false,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
        additionalNotes: 'Family income near the upper eligibility boundary ($28.5k of $30k cap).',
      },
      financialCertificates: docs.financial,
      isEligible: elig.isEligible,
      eligibilityCheck: elig,
      ...scores,
      meritRank: 5,
      reviewedBy: 'Dr. Eleanor Vance',
      reviewDate: '2026-09-23',
      adminRemarks: 'Eligible candidate placed on Waitlist Position #1. Will be upgraded if top rank declines.',
    } as Application;
  })(),

  // Application 6: Rohan Verma -> MCM-01 (Documents Under Verification)
  (() => {
    const scheme = INITIAL_SCHEMES[0];
    const docs = createSampleDocs('Rohan Verma');
    // Change document status to Pending
    docs.financial[0].status = 'Pending';
    docs.academic[1].status = 'Pending';
    const academicPercentage = 86.2;
    const income = 19000;
    const elig = checkScholarshipEligibility(academicPercentage, income, 'General', 'Male', scheme);
    const scores = calculateEvaluationScore({
      tenthPercentage: 88.0,
      twelfthPercentage: 84.5,
      currentPercentage: academicPercentage,
      annualFamilyIncome: income,
      numberOfDependents: 3,
      isEwsOrBpl: false,
      hardship: {
        hasChronicMedicalCost: true,
        singleEarningParent: true,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
      },
      firstGenerationStudent: true,
    }, scheme);

    return {
      id: 'APP-2026-0106',
      studentId: 'STU-006',
      studentName: 'Rohan Verma',
      studentEmail: 'rohan.verma@campus.edu',
      studentRoll: 'STU-2026-6112',
      studentPhone: '+1 (555) 998-3201',
      gender: 'Male',
      category: 'General',
      institutionName: 'Metropolitan Institute of Technology',
      degreeDepartment: 'B.Tech Information Technology (Year 2)',
      schemeId: scheme.id,
      schemeName: scheme.name,
      submissionDate: '2026-09-24',
      status: 'Documents_Under_Verification',
      tenthBoard: 'State Board of Education',
      tenthPercentage: 88.0,
      twelfthBoard: 'State Board of Education',
      twelfthPercentage: 84.5,
      currentCgpa: 8.65,
      currentPercentage: academicPercentage,
      academicCertificates: docs.academic,
      annualFamilyIncome: income,
      fatherOccupation: 'Electrician (Freelance)',
      motherOccupation: 'Home Maker',
      numberOfDependents: 3,
      numberOfStudyingSiblings: 2,
      isEwsOrBpl: false,
      hardship: {
        hasChronicMedicalCost: true,
        singleEarningParent: true,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
        additionalNotes: 'Father fractured limb in July; reduced family monthly earnings.',
      },
      financialCertificates: docs.financial,
      isEligible: elig.isEligible,
      eligibilityCheck: elig,
      ...scores,
      meritRank: 3,
      reviewedBy: undefined,
      adminRemarks: 'Application queued for revenue tehsildar document cross-verification.',
    } as Application;
  })(),

  // Application 7: Priya Kulkarni -> MCM-01 (Rejected: Income Exceeds Limit)
  (() => {
    const scheme = INITIAL_SCHEMES[0];
    const docs = createSampleDocs('Priya Kulkarni');
    const academicPercentage = 89.0;
    const income = 42000; // Above 30,000 ceiling!
    const elig = checkScholarshipEligibility(academicPercentage, income, 'General', 'Female', scheme);
    const scores = calculateEvaluationScore({
      tenthPercentage: 91.0,
      twelfthPercentage: 88.5,
      currentPercentage: academicPercentage,
      annualFamilyIncome: income,
      numberOfDependents: 2,
      isEwsOrBpl: false,
      hardship: {
        hasChronicMedicalCost: false,
        singleEarningParent: false,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
      },
      firstGenerationStudent: false,
    }, scheme);

    return {
      id: 'APP-2026-0107',
      studentId: 'STU-007',
      studentName: 'Priya Kulkarni',
      studentEmail: 'priya.kulkarni@campus.edu',
      studentRoll: 'STU-2026-7241',
      studentPhone: '+1 (555) 443-8819',
      gender: 'Female',
      category: 'General',
      institutionName: 'Metropolitan Institute of Technology',
      degreeDepartment: 'B.Tech Computer Science (Year 3)',
      schemeId: scheme.id,
      schemeName: scheme.name,
      submissionDate: '2026-09-19',
      status: 'Rejected',
      tenthBoard: 'Central Board of Secondary Education',
      tenthPercentage: 91.0,
      twelfthBoard: 'Central Board of Secondary Education',
      twelfthPercentage: 88.5,
      currentCgpa: 8.95,
      currentPercentage: academicPercentage,
      academicCertificates: docs.academic,
      annualFamilyIncome: income,
      fatherOccupation: 'Senior Bank Officer',
      motherOccupation: 'Government High School Teacher',
      numberOfDependents: 2,
      numberOfStudyingSiblings: 1,
      isEwsOrBpl: false,
      hardship: {
        hasChronicMedicalCost: false,
        singleEarningParent: false,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
        additionalNotes: 'None',
      },
      financialCertificates: docs.financial,
      isEligible: false,
      eligibilityCheck: elig,
      ...scores,
      reviewedBy: 'Dr. Eleanor Vance',
      reviewDate: '2026-09-22',
      adminRemarks: 'Application rejected during initial screening.',
      rejectionReason: 'Annual family income ($42,000) exceeds the statutory ceiling of $30,000 for this Need-cum-Means scheme. Candidate encouraged to apply for merit-only Presidential Fellowship.',
    } as Application;
  })(),

  // Application 8: Tariq Mansoor -> FG-SCHOLAR-04 (Documents Defective: Missing official seal)
  (() => {
    const scheme = INITIAL_SCHEMES[3];
    const docs = createSampleDocs('Tariq Mansoor');
    docs.financial[0].status = 'Defective';
    docs.financial[0].verificationRemarks = 'Income certificate submitted is missing official stamp and serial number from revenue authority. Resubmission requested.';
    const academicPercentage = 78.5;
    const income = 17500;
    const elig = checkScholarshipEligibility(academicPercentage, income, 'OBC', 'Male', scheme);
    const scores = calculateEvaluationScore({
      tenthPercentage: 80.0,
      twelfthPercentage: 77.0,
      currentPercentage: academicPercentage,
      annualFamilyIncome: income,
      numberOfDependents: 4,
      isEwsOrBpl: true,
      hardship: {
        hasChronicMedicalCost: false,
        singleEarningParent: true,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
      },
      firstGenerationStudent: true,
    }, scheme);

    return {
      id: 'APP-2026-0108',
      studentId: 'STU-008',
      studentName: 'Tariq Mansoor',
      studentEmail: 'tariq.mansoor@campus.edu',
      studentRoll: 'STU-2026-8802',
      studentPhone: '+1 (555) 771-4490',
      gender: 'Male',
      category: 'OBC',
      institutionName: 'Metropolitan Institute of Technology',
      degreeDepartment: 'B.Tech Electrical Engineering (Year 2)',
      schemeId: scheme.id,
      schemeName: scheme.name,
      submissionDate: '2026-09-20',
      status: 'Documents_Defective',
      tenthBoard: 'State Board of Education',
      tenthPercentage: 80.0,
      twelfthBoard: 'State Board of Education',
      twelfthPercentage: 77.0,
      currentCgpa: 7.9,
      currentPercentage: academicPercentage,
      academicCertificates: docs.academic,
      annualFamilyIncome: income,
      fatherOccupation: 'Plumber & Sanitation Worker',
      motherOccupation: 'Home Maker',
      numberOfDependents: 4,
      numberOfStudyingSiblings: 2,
      isEwsOrBpl: true,
      hardship: {
        hasChronicMedicalCost: false,
        singleEarningParent: true,
        hasAgriculturalLossOrDebt: false,
        orphanOrFostered: false,
        additionalNotes: 'First in family to attend college.',
      },
      financialCertificates: docs.financial,
      isEligible: true,
      eligibilityCheck: elig,
      ...scores,
      meritRank: 4,
      reviewedBy: 'Dr. Eleanor Vance',
      reviewDate: '2026-09-25',
      adminRemarks: 'Income certificate document lacks sub-divisional seal. Notification dispatched requesting upload of fresh stamped certificate within 7 days.',
    } as Application;
  })(),
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    recipientId: 'STU-001',
    title: 'Scholarship Awarded!',
    message: 'Congratulations Ananya! You have been selected for the Institutional Merit-cum-Means Excellence Scholarship. Your formal award letter is ready to download.',
    date: '2026-09-20',
    read: false,
    type: 'selection',
    applicationId: 'APP-2026-0101',
  },
  {
    id: 'NOTIF-02',
    recipientId: 'STU-003',
    title: 'Selection Confirmed: Women in STEM Award',
    message: 'Your application for Women in STEM Leadership Fellowship has been finalized and approved by the Evaluation Board.',
    date: '2026-09-21',
    read: false,
    type: 'selection',
    applicationId: 'APP-2026-0102',
  },
  {
    id: 'NOTIF-03',
    recipientId: 'STU-002',
    title: 'Application Evaluation Complete',
    message: 'Your application APP-2026-0103 has been verified and selected in Rank #2 of the Institutional Merit-cum-Means Scholarship.',
    date: '2026-09-22',
    read: true,
    type: 'selection',
    applicationId: 'APP-2026-0103',
  },
  {
    id: 'NOTIF-04',
    recipientId: 'admin',
    title: 'New Applications Queued for Verification',
    message: '3 student applications require document verification before the October 31 review deadline.',
    date: '2026-09-24',
    read: false,
    type: 'status_update',
  },
];

// LocalStorage Keys
const KEYS = {
  USERS: 'scholarship_users_v1',
  CURRENT_USER: 'scholarship_current_user_v1',
  SCHEMES: 'scholarship_schemes_v1',
  APPLICATIONS: 'scholarship_applications_v1',
  NOTIFICATIONS: 'scholarship_notifications_v1',
};

// Storage helper functions
export const getStoredUsers = (): UserProfile[] => {
  const data = localStorage.getItem(KEYS.USERS);
  if (!data) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(DEMO_USERS));
    return DEMO_USERS;
  }
  return JSON.parse(data);
};

export const getCurrentUser = (): UserProfile => {
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  if (!data) {
    // Default to student Ananya Sharma for quick interactive exploration
    const defaultUser = DEMO_USERS[0];
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(defaultUser));
    return defaultUser;
  }
  return JSON.parse(data);
};

export const setCurrentUser = (user: UserProfile) => {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  window.dispatchEvent(new Event('scholarship_user_changed'));
};

export const getStoredSchemes = (): ScholarshipScheme[] => {
  const data = localStorage.getItem(KEYS.SCHEMES);
  if (!data) {
    localStorage.setItem(KEYS.SCHEMES, JSON.stringify(INITIAL_SCHEMES));
    return INITIAL_SCHEMES;
  }
  return JSON.parse(data);
};

export const saveSchemes = (schemes: ScholarshipScheme[]) => {
  localStorage.setItem(KEYS.SCHEMES, JSON.stringify(schemes));
  window.dispatchEvent(new Event('scholarship_data_updated'));
};

export const getStoredApplications = (): Application[] => {
  const data = localStorage.getItem(KEYS.APPLICATIONS);
  if (!data) {
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  }
  return JSON.parse(data);
};

export const saveApplications = (applications: Application[]) => {
  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(applications));
  window.dispatchEvent(new Event('scholarship_data_updated'));
};

export const getStoredNotifications = (): NotificationItem[] => {
  const data = localStorage.getItem(KEYS.NOTIFICATIONS);
  if (!data) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  return JSON.parse(data);
};

export const saveNotifications = (notifications: NotificationItem[]) => {
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  window.dispatchEvent(new Event('scholarship_notifications_updated'));
};

export const resetAllDataToDefault = () => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(DEMO_USERS));
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS[0]));
  localStorage.setItem(KEYS.SCHEMES, JSON.stringify(INITIAL_SCHEMES));
  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  window.dispatchEvent(new Event('scholarship_data_updated'));
  window.dispatchEvent(new Event('scholarship_user_changed'));
  window.dispatchEvent(new Event('scholarship_notifications_updated'));
};
