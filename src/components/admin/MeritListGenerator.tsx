import React, { useState } from 'react';
import { Application, ScholarshipScheme } from '../../types';
import { generateMeritList } from '../../utils/evaluationEngine';
import { 
  Award, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sliders, 
  FileSpreadsheet,
  Check,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface MeritListGeneratorProps {
  schemes: ScholarshipScheme[];
  applications: Application[];
  onUpdateApplications: (updatedApps: Application[]) => void;
  onViewAwardLetter: (app: Application) => void;
  onSendNotifications: (schemeName: string, selectedCount: number) => void;
}

export const MeritListGenerator: React.FC<MeritListGeneratorProps> = ({
  schemes,
  applications,
  onUpdateApplications,
  onViewAwardLetter,
  onSendNotifications,
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(schemes[0]?.id || '');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const selectedScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];

  // Dynamically generate the ranked merit list for this scheme
  const rankedSchemeApps = generateMeritList(applications, selectedScheme);

  const eligibleCandidates = rankedSchemeApps.filter((a) => a.isEligible);
  const selectedCandidates = rankedSchemeApps.filter((a) => a.status === 'Selected');
  const waitlistedCandidates = rankedSchemeApps.filter((a) => a.status === 'Waitlisted');
  const ineligibleCandidates = rankedSchemeApps.filter((a) => !a.isEligible || a.status === 'Rejected');

  // Cut-off score (score of the lowest selected candidate)
  const cutoffScore = selectedCandidates.length > 0 
    ? selectedCandidates[selectedCandidates.length - 1].compositeScore 
    : 0;

  // Finalize & Publish action
  const handlePublishMeritList = () => {
    setIsPublishing(true);

    // Merge ranked scheme apps back into main applications array
    const updatedAll = applications.map((app) => {
      const rankedMatch = rankedSchemeApps.find((r) => r.id === app.id);
      return rankedMatch ? rankedMatch : app;
    });

    onUpdateApplications(updatedAll);
    onSendNotifications(selectedScheme.name, selectedCandidates.length);

    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 4000);
    }, 600);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Rank',
      'Candidate Name',
      'Roll Number',
      'Category',
      'Gender',
      'Academic %',
      'CGPA',
      'Annual Income ($)',
      'Academic Score (50)',
      'Financial Need Score (40)',
      'Hardship Bonus (10)',
      'Composite Score (100)',
      'Selection Status',
    ];

    const rows = rankedSchemeApps.map((a) => [
      a.meritRank || 'N/A',
      `"${a.studentName}"`,
      a.studentRoll,
      a.category,
      a.gender,
      a.currentPercentage.toFixed(2),
      a.currentCgpa,
      a.annualFamilyIncome,
      a.academicScore,
      a.financialNeedScore,
      a.hardshipBonusScore,
      a.compositeScore,
      a.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `merit_list_${selectedScheme.code.toLowerCase()}_2026.csv`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Merit List & Candidate Selection
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic ranking engine combining academic marks, family economic index, and verified hardship factors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Board List
          </button>
          <button
            onClick={handlePublishMeritList}
            disabled={isPublishing}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPublishing ? 'Publishing...' : 'Publish & Finalize List'}
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {publishSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold block">Merit List Published Successfully!</span>
            <span>
              Selection statuses finalized for {selectedScheme.name}. Official notification alerts and provisional sanction letters dispatched to selected candidates.
            </span>
          </div>
        </div>
      )}

      {/* Scheme Selector & Scheme Quota Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:w-96">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Scholarship Scheme to Rank
            </label>
            <select
              value={selectedSchemeId}
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
            >
              {schemes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) — {s.totalSlots} Slots
                </option>
              ))}
            </select>
          </div>

          {/* Scheme Allocation Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-sans">Available Slots</span>
              <span className="text-lg font-bold text-slate-900">{selectedScheme.totalSlots}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-sans">Applicants</span>
              <span className="text-lg font-bold text-indigo-700">{rankedSchemeApps.length}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-sans">Eligible Candidates</span>
              <span className="text-lg font-bold text-emerald-700">{eligibleCandidates.length}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-sans">Cut-Off Score</span>
              <span className="text-lg font-bold text-slate-900">{cutoffScore || '—'}</span>
            </div>
          </div>
        </div>

        {/* Evaluation Formula Transparency Explainer */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
          <span className="font-semibold text-slate-800 block mb-1">
            Institutional Selection Formula for {selectedScheme.code}:
          </span>
          <p className="leading-relaxed">
            Rank is determined deterministically: 
            <span className="font-mono text-slate-900 font-bold"> Composite Score = [Academic Merit × {selectedScheme.academicWeight}%] + [Financial Need Index × {selectedScheme.financialNeedWeight}%] + [Hardship Bonus × {selectedScheme.hardshipBonusWeight}%]</span>. 
            Candidates holding ranks 1 to {selectedScheme.totalSlots} are automatically selected for the award. Ties are broken in favor of candidates with higher financial need score.
          </p>
        </div>
      </div>

      {/* Official Printable Sheet Header (visible during print) */}
      <div className="hidden print-only mb-6 text-center border-b-2 border-slate-900 pb-4">
        <h1 className="text-xl font-bold uppercase text-slate-900">METROPOLITAN INSTITUTE OF TECHNOLOGY</h1>
        <h2 className="text-base font-semibold text-slate-800 mt-1">OFFICIAL PROVISIONAL MERIT LIST — 2026</h2>
        <p className="text-xs text-slate-600">
          Scheme: {selectedScheme.name} ({selectedScheme.code}) · Total Sanctioned Quota: {selectedScheme.totalSlots} Candidates
        </p>
      </div>

      {/* Ranked Candidate Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Ranked Merit Order
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {selectedCandidates.length} Selected · {waitlistedCandidates.length} Waitlisted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Candidate & Roll</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Academic %</th>
                <th className="py-3 px-4 text-right">Annual Income</th>
                <th className="py-3 px-4 text-right">Need Index</th>
                <th className="py-3 px-4 text-right">Composite Score</th>
                <th className="py-3 px-4 text-center">Selection Result</th>
                <th className="py-3 px-4 text-right no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
              {rankedSchemeApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No candidates have submitted applications for this scheme yet.
                  </td>
                </tr>
              ) : (
                rankedSchemeApps.map((app) => {
                  const isSelected = app.status === 'Selected';
                  const isWaitlist = app.status === 'Waitlisted';

                  return (
                    <tr
                      key={app.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected
                          ? 'bg-emerald-50/20'
                          : isWaitlist
                          ? 'bg-amber-50/10'
                          : ''
                      }`}
                    >
                      {/* Merit Rank */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-sm">
                        {app.isEligible ? (
                          <span className={isSelected ? 'text-emerald-700' : 'text-slate-700'}>
                            #{app.meritRank}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Candidate Name */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{app.studentName}</span>
                        <span className="font-mono text-[11px] text-slate-500">{app.studentRoll}</span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-700">{app.category}</span>
                        {app.isEwsOrBpl && (
                          <span className="text-[10px] text-emerald-700 font-bold block">EWS Certified</span>
                        )}
                      </td>

                      {/* Academic */}
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                        {app.currentPercentage.toFixed(1)}%
                      </td>

                      {/* Annual Income */}
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                        ${app.annualFamilyIncome.toLocaleString()}
                      </td>

                      {/* Need Index */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                        {app.financialNeedScore} / 40
                      </td>

                      {/* Total Score */}
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-indigo-700 text-sm">
                        {app.compositeScore}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                          </span>
                        ) : isWaitlist ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                            <Clock className="w-3.5 h-3.5" /> Waitlisted
                          </span>
                        ) : !app.isEligible ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700">
                            Ineligible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            Evaluated
                          </span>
                        )}
                      </td>

                      {/* Actions (no-print) */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap no-print">
                        {isSelected && (
                          <button
                            type="button"
                            onClick={() => onViewAwardLetter(app)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors cursor-pointer"
                          >
                            <Award className="w-3 h-3" /> Award Letter
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Board Sign-off (visible during print) */}
        <div className="hidden print-only p-8 mt-12 border-t border-slate-300 flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-500">Certified Authentic Merit List</p>
            <p className="text-xs font-mono">MIT/SENATE/SCHOLARSHIP/2026</p>
          </div>
          <div className="text-right">
            <div className="w-48 h-0.5 bg-slate-900 ml-auto mb-1"></div>
            <p className="text-xs font-bold text-slate-900">Dr. Eleanor Vance, Ph.D.</p>
            <p className="text-xs text-slate-600">Chairperson, Scholarship Committee</p>
          </div>
        </div>
      </div>
    </div>
  );
};
