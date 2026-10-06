import React, { useState } from 'react';
import { 
  Application, 
  ScholarshipScheme, 
  SupportingDocument 
} from '../../types';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Award, 
  Eye, 
  User, 
  Building, 
  DollarSign, 
  GraduationCap, 
  HeartHandshake,
  Check
} from 'lucide-react';

interface ApplicationDetailDrawerProps {
  application: Application | null;
  scheme: ScholarshipScheme | undefined;
  onClose: () => void;
  onPreviewDocument: (doc: SupportingDocument) => void;
  onUpdateStatus: (
    appId: string, 
    newStatus: Application['status'], 
    remarks: string, 
    rejectionReason?: string
  ) => void;
  onUpdateDocumentVerification: (
    appId: string, 
    docId: string, 
    status: 'Verified' | 'Defective', 
    remarks: string
  ) => void;
  onViewAwardLetter: (app: Application) => void;
}

export const ApplicationDetailDrawer: React.FC<ApplicationDetailDrawerProps> = ({
  application,
  scheme,
  onClose,
  onPreviewDocument,
  onUpdateStatus,
  onUpdateDocumentVerification,
  onViewAwardLetter,
}) => {
  if (!application) return null;

  const [decision, setDecision] = useState<Application['status']>(application.status);
  const [remarks, setRemarks] = useState(application.adminRemarks || '');
  const [rejectionReason, setRejectionReason] = useState(application.rejectionReason || '');

  const allDocuments = [...application.academicCertificates, ...application.financialCertificates];
  const allVerified = allDocuments.every((d) => d.status === 'Verified');
  const hasDefective = allDocuments.some((d) => d.status === 'Defective');

  const handleSaveDecision = () => {
    onUpdateStatus(application.id, decision, remarks, rejectionReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>{application.id}</span>
              <span aria-hidden="true">·</span>
              <span>Submitted {application.submissionDate}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Candidate Evaluation: {application.studentName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* Top Quick Status Alert */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Scheme Program</span>
              <span className="text-sm font-bold text-indigo-950">{application.schemeName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current Rank</span>
              <span className="text-base font-bold font-mono text-slate-900">
                {application.meritRank ? `Rank #${application.meritRank}` : 'Pending List'}
              </span>
            </div>
          </div>

          {/* Section 1: Candidate Academic Performance */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              1. Academic Qualifications & Marks Verification
            </h3>
            
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/70 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Secondary (10th) Board</span>
                <span className="font-semibold text-slate-800">{application.tenthBoard}</span>
                <span className="font-mono font-bold text-indigo-700 block mt-0.5">
                  {application.tenthPercentage.toFixed(1)}% Marks
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Senior Secondary (12th) Board</span>
                <span className="font-semibold text-slate-800">{application.twelfthBoard}</span>
                <span className="font-mono font-bold text-indigo-700 block mt-0.5">
                  {application.twelfthPercentage.toFixed(1)}% Marks
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Undergraduate CGPA</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {application.currentCgpa} / 10.0
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Current Aggregated Percentage</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {application.currentPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Family Financial Background */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              2. Family Income & Financial Background
            </h3>

            <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Annual Family Income</span>
                  <span className="font-mono font-bold text-base text-slate-900">
                    ${application.annualFamilyIncome.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    (Ceiling: ${scheme?.maxAnnualFamilyIncome.toLocaleString()})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">EWS / BPL Status</span>
                  <span className="font-semibold text-slate-800">
                    {application.isEwsOrBpl ? 'Verified EWS / BPL' : 'Non-EWS Standard'}
                  </span>
                  {application.bplCardNumber && (
                    <span className="font-mono text-[10px] text-slate-500 block">
                      Card: {application.bplCardNumber}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Father's Occupation</span>
                  <span className="font-medium text-slate-800">{application.fatherOccupation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mother's Occupation</span>
                  <span className="font-medium text-slate-800">{application.motherOccupation}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 block text-[11px]">Dependents & Siblings</span>
                <span className="font-medium text-slate-800">
                  {application.numberOfDependents} family dependents · {application.numberOfStudyingSiblings} siblings currently studying
                </span>
              </div>

              {application.hardship && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block text-[11px] mb-1">Documented Hardship Indicators:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {application.hardship.singleEarningParent && (
                      <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[10px]">
                        Single Earning Parent
                      </span>
                    )}
                    {application.hardship.hasChronicMedicalCost && (
                      <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[10px]">
                        Chronic Medical Costs
                      </span>
                    )}
                    {application.hardship.hasAgriculturalLossOrDebt && (
                      <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[10px]">
                        Agricultural Loss / Debt
                      </span>
                    )}
                    {application.hardship.orphanOrFostered && (
                      <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[10px]">
                        Orphan / Foster Care
                      </span>
                    )}
                  </div>
                  {application.hardship.additionalNotes && (
                    <p className="mt-1.5 text-slate-600 bg-white p-2 rounded border border-slate-200 text-[11px]">
                      "{application.hardship.additionalNotes}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Supporting Documents & Verification Audit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                3. Document Verification Checklist ({allDocuments.length})
              </h3>
              <span className={`text-[11px] font-semibold ${allVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                {allVerified ? 'All Authenticated' : hasDefective ? 'Defective Document Found' : 'Audit Incomplete'}
              </span>
            </div>

            <div className="space-y-2">
              {allDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between hover:border-slate-300"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800 block">{doc.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {doc.fileName} · {doc.issuerAuthority}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPreviewDocument(doc)}
                      className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> Inspect
                    </button>

                    {doc.status === 'Verified' ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-200">
                        Verified
                      </span>
                    ) : doc.status === 'Defective' ? (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[10px] font-bold border border-rose-200">
                        Defective
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-bold border border-amber-200">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Transparent Score Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-100">
              4. Deterministic Score Breakdown (0 - 100 Scale)
            </h3>

            <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-900 text-white rounded-lg">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Academic Merit (50%)</span>
                <span className="text-lg font-mono font-bold text-white">{application.academicScore}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Financial Need (40%)</span>
                <span className="text-lg font-mono font-bold text-white">{application.financialNeedScore}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Hardship Bonus (10%)</span>
                <span className="text-lg font-mono font-bold text-white">{application.hardshipBonusScore}</span>
              </div>
              <div className="col-span-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-indigo-300 font-semibold">Total Composite Score:</span>
                <span className="text-xl font-mono font-extrabold text-emerald-400">
                  {application.compositeScore} / 100.00
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Committee Review & Action Form */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Committee Decision & Actions
            </h3>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Update Application Status</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { val: 'Documents_Verified', label: 'Mark Docs Verified' },
                  { val: 'Selected', label: 'Approve & Select' },
                  { val: 'Waitlisted', label: 'Place on Waitlist' },
                  { val: 'Documents_Defective', label: 'Flag Defective' },
                  { val: 'Rejected', label: 'Reject Application' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setDecision(item.val as any)}
                    className={`py-2 px-2.5 rounded text-xs font-semibold text-center border transition-all cursor-pointer ${
                      decision === item.val
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Committee Remarks / Evaluation Log
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Document verification confirmation, special committee observations, rationale..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs"
              />
            </div>

            {decision === 'Rejected' && (
              <div>
                <label className="font-semibold text-rose-700 block mb-1">
                  Rejection Reason (Transmitted to Candidate)
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Annual family income exceeds scheme ceiling..."
                  className="w-full px-3 py-2 border border-rose-300 rounded-lg bg-white text-xs text-rose-900"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {application.status === 'Selected' ? (
            <button
              onClick={() => onViewAwardLetter(application)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4" /> Award Letter
            </button>
          ) : <span />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDecision}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Save Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
