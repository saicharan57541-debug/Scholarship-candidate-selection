export type UserRole = 'student' | 'admin' | 'evaluator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId: string;
  phone: string;
  gender: 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  dateOfBirth: string;
  address: string;
  institutionName: string;
  currentDegree: string;
  currentDepartment: string;
  currentSemesterYear: string;
  firstGenerationStudent: boolean;
  singleParentFamily: boolean;
  differentlyAbled: boolean;
  avatar?: string;
}

export interface SupportingDocument {
  id: string;
  type: 
    | '10th_marksheet' 
    | '12th_marksheet' 
    | 'college_transcript' 
    | 'income_certificate' 
    | 'caste_ews_certificate' 
    | 'bank_passbook' 
    | 'affidavit_hardship';
  name: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'Pending' | 'Verified' | 'Defective';
  verificationRemarks?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  fileDataUrl?: string;
  issuerAuthority?: string;
}

export interface ScholarshipScheme {
  id: string;
  code: string;
  name: string;
  category: 'Merit-cum-Means' | 'Need-Based' | 'Women in STEM' | 'First-Generation' | 'Special Hardship' | 'Academic Excellence';
  description: string;
  awardAmount: number; // in USD or INR
  currencySymbol: string;
  awardFrequency: string; // e.g. "per semester", "annual"
  totalSlots: number;
  minAcademicPercentage: number;
  maxAnnualFamilyIncome: number;
  eligibleCategories: string[]; // ['All'] or specific categories
  eligibleGenders: string[]; // ['All'] or specific
  deadline: string;
  academicWeight: number; // default 50%
  financialNeedWeight: number; // default 40%
  hardshipBonusWeight: number; // default 10%
  status: 'Active' | 'Under Review' | 'Closed';
  sponsor: string;
}

export type ApplicationStatus = 
  | 'Submitted'
  | 'Documents_Under_Verification'
  | 'Documents_Verified'
  | 'Documents_Defective'
  | 'Evaluated'
  | 'Selected'
  | 'Waitlisted'
  | 'Rejected';

export interface HardshipDetails {
  hasChronicMedicalCost: boolean;
  singleEarningParent: boolean;
  hasAgriculturalLossOrDebt: boolean;
  orphanOrFostered: boolean;
  additionalNotes: string;
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentRoll: string;
  studentPhone: string;
  gender: string;
  category: string;
  institutionName: string;
  degreeDepartment: string;
  schemeId: string;
  schemeName: string;
  submissionDate: string;
  status: ApplicationStatus;
  
  // Academic Performance
  tenthBoard: string;
  tenthPercentage: number;
  twelfthBoard: string;
  twelfthPercentage: number;
  currentCgpa: number;
  currentPercentage: number; // Calculated or entered
  academicCertificates: SupportingDocument[];

  // Family & Financial Background
  annualFamilyIncome: number;
  fatherOccupation: string;
  motherOccupation: string;
  guardianOccupation?: string;
  numberOfDependents: number;
  numberOfStudyingSiblings: number;
  isEwsOrBpl: boolean;
  bplCardNumber?: string;
  hardship: HardshipDetails;
  financialCertificates: SupportingDocument[];

  // Eligibility Evaluation
  isEligible: boolean;
  eligibilityCheck: {
    academicCriteriaMet: boolean;
    incomeCriteriaMet: boolean;
    categoryCriteriaMet: boolean;
    genderCriteriaMet: boolean;
    reasons: string[];
  };

  // Evaluation Breakdown
  academicScore: number;       // out of 50
  financialNeedScore: number;  // out of 40
  hardshipBonusScore: number;  // out of 10
  compositeScore: number;      // 0 - 100
  meritRank?: number;

  // Administrative Review
  reviewedBy?: string;
  reviewDate?: string;
  adminRemarks?: string;
  rejectionReason?: string;
  awardLetterGenerated?: boolean;
}

export interface NotificationItem {
  id: string;
  recipientId: string; // user id or 'admin' or 'all'
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'status_update' | 'document_flag' | 'selection' | 'deadline' | 'announcement';
  applicationId?: string;
}
