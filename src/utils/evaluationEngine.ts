import { Application, ScholarshipScheme } from '../types';

export interface EligibilityResult {
  isEligible: boolean;
  academicCriteriaMet: boolean;
  incomeCriteriaMet: boolean;
  categoryCriteriaMet: boolean;
  genderCriteriaMet: boolean;
  reasons: string[];
}

export interface ScoreBreakdown {
  academicScore: number;
  financialNeedScore: number;
  hardshipBonusScore: number;
  compositeScore: number;
}

/**
 * Checks eligibility of a candidate for a given scholarship scheme
 */
export function checkScholarshipEligibility(
  studentAcademicPercentage: number,
  annualFamilyIncome: number,
  category: string,
  gender: string,
  scheme: ScholarshipScheme
): EligibilityResult {
  const reasons: string[] = [];

  const academicCriteriaMet = studentAcademicPercentage >= scheme.minAcademicPercentage;
  if (!academicCriteriaMet) {
    reasons.push(
      `Academic percentage (${studentAcademicPercentage.toFixed(1)}%) is below the minimum threshold of ${scheme.minAcademicPercentage}%.`
    );
  }

  const incomeCriteriaMet = annualFamilyIncome <= scheme.maxAnnualFamilyIncome;
  if (!incomeCriteriaMet) {
    reasons.push(
      `Annual family income ($${annualFamilyIncome.toLocaleString()}) exceeds the maximum ceiling of $${scheme.maxAnnualFamilyIncome.toLocaleString()}.`
    );
  }

  const categoryCriteriaMet =
    scheme.eligibleCategories.includes('All') ||
    scheme.eligibleCategories.includes(category);
  if (!categoryCriteriaMet) {
    reasons.push(
      `Category '${category}' is not designated for this specific scheme quota (${scheme.eligibleCategories.join(', ')}).`
    );
  }

  const genderCriteriaMet =
    scheme.eligibleGenders.includes('All') ||
    scheme.eligibleGenders.includes(gender);
  if (!genderCriteriaMet) {
    reasons.push(
      `Gender '${gender}' does not match the targeted eligibility criteria for this scheme.`
    );
  }

  const isEligible = academicCriteriaMet && incomeCriteriaMet && categoryCriteriaMet && genderCriteriaMet;

  if (isEligible) {
    reasons.push('All institutional eligibility criteria met successfully.');
  }

  return {
    isEligible,
    academicCriteriaMet,
    incomeCriteriaMet,
    categoryCriteriaMet,
    genderCriteriaMet,
    reasons,
  };
}

/**
 * Calculates transparent, deterministic composite score (0 - 100)
 */
export function calculateEvaluationScore(
  application: {
    tenthPercentage: number;
    twelfthPercentage: number;
    currentPercentage: number;
    annualFamilyIncome: number;
    numberOfDependents: number;
    isEwsOrBpl: boolean;
    hardship: {
      hasChronicMedicalCost: boolean;
      singleEarningParent: boolean;
      hasAgriculturalLossOrDebt: boolean;
      orphanOrFostered: boolean;
    };
    firstGenerationStudent?: boolean;
  },
  scheme: ScholarshipScheme
): ScoreBreakdown {
  // 1. Academic Performance Score (Weight default: 50% = max 50 points)
  // Weighted: 70% current higher ed + 15% 12th + 15% 10th
  const blendedAcademic = 
    application.currentPercentage * 0.70 + 
    (application.twelfthPercentage || application.currentPercentage) * 0.15 + 
    (application.tenthPercentage || application.currentPercentage) * 0.15;

  const academicScore = Math.min(50, Math.max(0, (blendedAcademic / 100) * 50));

  // 2. Financial Need Score (Weight default: 40% = max 40 points)
  // Inverse proportion to income ceiling: lower income = higher need score
  const incomeCeiling = Math.max(scheme.maxAnnualFamilyIncome, 1);
  const incomeRatio = Math.max(0, Math.min(1, 1 - (application.annualFamilyIncome / incomeCeiling)));
  let baseFinancialScore = incomeRatio * 26; // up to 26 points from pure income ratio

  // Dependent family adjustment: +2.5 pts per dependent, capped at 10 pts
  const dependentsBonus = Math.min(10, Math.max(0, (application.numberOfDependents || 1) * 2.5));

  // BPL / EWS official certification bonus: +4 pts
  const ewsBonus = application.isEwsOrBpl ? 4.0 : 0;

  const financialNeedScore = Math.min(40, Math.max(0, baseFinancialScore + dependentsBonus + ewsBonus));

  // 3. Hardship & Special Consideration Bonus (Weight default: 10% = max 10 points)
  let hardshipBonus = 0;
  if (application.hardship.orphanOrFostered) hardshipBonus += 4.0;
  if (application.hardship.singleEarningParent) hardshipBonus += 3.0;
  if (application.hardship.hasChronicMedicalCost) hardshipBonus += 2.5;
  if (application.hardship.hasAgriculturalLossOrDebt) hardshipBonus += 2.5;
  if (application.firstGenerationStudent) hardshipBonus += 2.0;

  const hardshipBonusScore = Math.min(10, Math.max(0, hardshipBonus));

  // 4. Total Composite Score (0 - 100 scale)
  const compositeScore = Number((academicScore + financialNeedScore + hardshipBonusScore).toFixed(2));

  return {
    academicScore: Number(academicScore.toFixed(2)),
    financialNeedScore: Number(financialNeedScore.toFixed(2)),
    hardshipBonusScore: Number(hardshipBonusScore.toFixed(2)),
    compositeScore,
  };
}

/**
 * Generates ranked Merit List for a specific scheme
 */
export function generateMeritList(
  applications: Application[],
  scheme: ScholarshipScheme
): Application[] {
  // Filter applications for this scheme that are eligible
  const schemeApps = applications.filter((app) => app.schemeId === scheme.id);

  // Sort deterministically:
  // 1. Composite Score descending
  // 2. Financial Need Score descending (tie-break favoring higher need)
  // 3. Academic Percentage descending
  // 4. Submission date ascending (early bird tie-breaker)
  const sorted = [...schemeApps].sort((a, b) => {
    // Eligible candidates always rank ahead of ineligible
    if (a.isEligible !== b.isEligible) {
      return a.isEligible ? -1 : 1;
    }
    if (b.compositeScore !== a.compositeScore) {
      return b.compositeScore - a.compositeScore;
    }
    if (b.financialNeedScore !== a.financialNeedScore) {
      return b.financialNeedScore - a.financialNeedScore;
    }
    if (b.currentPercentage !== a.currentPercentage) {
      return b.currentPercentage - a.currentPercentage;
    }
    return new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
  });

  // Assign ranks & calculate selection/waitlist statuses
  return sorted.map((app, index) => {
    const rank = index + 1;
    let computedStatus = app.status;

    // Only update automatic selection status if it is currently in Evaluated/Submitted/Selected/Waitlisted state
    if (
      app.isEligible && 
      app.status !== 'Rejected' && 
      app.status !== 'Documents_Defective'
    ) {
      if (rank <= scheme.totalSlots) {
        computedStatus = 'Selected';
      } else if (rank <= scheme.totalSlots + 3) {
        computedStatus = 'Waitlisted';
      } else {
        computedStatus = 'Evaluated';
      }
    }

    return {
      ...app,
      meritRank: rank,
      status: computedStatus,
    };
  });
}

/**
 * Validates duplicate application check
 */
export function checkDuplicateApplication(
  existingApplications: Application[],
  studentId: string,
  schemeId: string,
  currentAppId?: string
): boolean {
  return existingApplications.some(
    (app) =>
      app.studentId === studentId &&
      app.schemeId === schemeId &&
      app.id !== currentAppId &&
      app.status !== 'Rejected'
  );
}
