import React, { useState } from 'react';
import { ScholarshipScheme, UserProfile } from '../../types';
import { checkScholarshipEligibility } from '../../utils/evaluationEngine';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  SlidersHorizontal,
  DollarSign,
  GraduationCap,
  Users,
  Award
} from 'lucide-react';

interface EligibilityCheckerProps {
  schemes: ScholarshipScheme[];
  currentUser: UserProfile;
  onApplyForScheme: (schemeId: string) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  schemes,
  currentUser,
  onApplyForScheme,
}) => {
  // Interactive inputs with defaults from user's current profile
  const [academicPercentage, setAcademicPercentage] = useState<number>(85.0);
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState<number>(22000);
  const [category, setCategory] = useState<string>(currentUser.category || 'General');
  const [gender, setGender] = useState<string>(currentUser.gender || 'Female');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Scholarship Eligibility Checker
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Test your qualifications instantly against all active institutional scholarship programs. 
          Adjust your current marks percentage and annual family income below to preview 
          predefined criteria thresholds and determine your eligibility status.
        </p>
      </div>

      {/* Input Parameters Form Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Evaluation Parameters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Academic Percentage */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Academic Marks (%)
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                min="40"
                max="100"
                step="0.1"
                value={academicPercentage}
                onChange={(e) => setAcademicPercentage(parseFloat(e.target.value) || 0)}
                className="w-full text-sm font-mono font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Undergraduate / Senior Sec. aggregated</p>
          </div>

          {/* Annual Family Income */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Annual Family Income ($ / yr)
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">$</span>
              <input
                type="number"
                min="0"
                max="150000"
                step="500"
                value={annualFamilyIncome}
                onChange={(e) => setAnnualFamilyIncome(parseInt(e.target.value, 10) || 0)}
                className="w-full text-sm font-mono font-semibold pl-7 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Combined gross household income</p>
          </div>

          {/* Social Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reservation / Social Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white mt-1"
            >
              <option value="General">General / Open</option>
              <option value="EWS">Economically Weaker Section (EWS)</option>
              <option value="OBC">Other Backward Classes (OBC)</option>
              <option value="SC">Scheduled Caste (SC)</option>
              <option value="ST">Scheduled Tribe (ST)</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">As stated on official certificates</p>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Candidate Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white mt-1"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">Used for targeted STEM initiatives</p>
          </div>
        </div>
      </div>

      {/* Schemes Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Eligibility Status Across Active Schemes ({schemes.length})
          </h2>
          <div className="text-xs text-slate-500">
            Rules refreshed based on institutional Senate guidelines 2026
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map((scheme) => {
            const result = checkScholarshipEligibility(
              academicPercentage,
              annualFamilyIncome,
              category,
              gender,
              scheme
            );

            return (
              <div
                key={scheme.id}
                className={`p-6 rounded-xl border transition-all ${
                  result.isEligible
                    ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                    : 'border-slate-200 bg-white opacity-90'
                }`}
              >
                {/* Scheme Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                      {scheme.code} · {scheme.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{scheme.name}</h3>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-base font-bold font-mono text-slate-900">
                      {scheme.currencySymbol}{scheme.awardAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block">/ {scheme.awardFrequency}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {scheme.description}
                </p>

                {/* Predefined Criteria Comparison Matrix */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 mb-4 space-y-2 text-xs">
                  {/* Academic threshold */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      Academic Requirement (Min {scheme.minAcademicPercentage}%):
                    </span>
                    <span className={`font-mono font-medium flex items-center gap-1 ${
                      result.academicCriteriaMet ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {result.academicCriteriaMet ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      Your: {academicPercentage.toFixed(1)}%
                    </span>
                  </div>

                  {/* Income threshold */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      Family Income Ceiling (Max ${scheme.maxAnnualFamilyIncome.toLocaleString()}):
                    </span>
                    <span className={`font-mono font-medium flex items-center gap-1 ${
                      result.incomeCriteriaMet ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {result.incomeCriteriaMet ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      Your: ${annualFamilyIncome.toLocaleString()}
                    </span>
                  </div>

                  {/* Category / Quota */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Designated Category:
                    </span>
                    <span className={`font-medium flex items-center gap-1 ${
                      result.categoryCriteriaMet ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {result.categoryCriteriaMet ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      {scheme.eligibleCategories.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Outcome Statement */}
                <div className="mb-4">
                  {result.isEligible ? (
                    <div className="flex items-start gap-2 p-2.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">You are Eligible to Apply!</span>
                        <span className="text-emerald-700">
                          {scheme.totalSlots} scholarship seats available. Selection decided via transparent merit ranking.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 p-2.5 bg-rose-50 text-rose-900 rounded border border-rose-200 text-xs">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Not Eligible for this Scheme</span>
                        <span className="text-rose-700">{result.reasons[0]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Apply Action Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">
                    Deadline: {scheme.deadline}
                  </span>
                  <button
                    onClick={() => onApplyForScheme(scheme.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      result.isEligible
                        ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{result.isEligible ? 'Apply Now' : 'View Application Form'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
