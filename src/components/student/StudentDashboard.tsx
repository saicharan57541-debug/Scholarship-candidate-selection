import React, { useState } from 'react';
import { 
  UserProfile, 
  Application, 
  ScholarshipScheme, 
  SupportingDocument 
} from '../../types';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Award, 
  Eye, 
  User, 
  DollarSign, 
  GraduationCap, 
  ShieldCheck,
  Building,
  Edit3,
  Calendar,
  ExternalLink,
  Info
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: UserProfile;
  applications: Application[];
  schemes: ScholarshipScheme[];
  onStartNewApplication: () => void;
  onViewAwardLetter: (app: Application) => void;
  onPreviewDocument: (doc: SupportingDocument) => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  applications,
  schemes,
  onStartNewApplication,
  onViewAwardLetter,
  onPreviewDocument,
  onUpdateProfile,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ ...currentUser });

  const studentApplications = applications.filter((app) => app.studentId === currentUser.id);

  const selectedCount = studentApplications.filter((a) => a.status === 'Selected').length;
  const underReviewCount = studentApplications.filter((a) => 
    ['Submitted', 'Documents_Under_Verification', 'Documents_Verified', 'Evaluated'].includes(a.status)
  ).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setIsEditingProfile(false);
  };

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'Selected':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Selected for Award
          </span>
        );
      case 'Waitlisted':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Waitlisted (Quota Full)
          </span>
        );
      case 'Documents_Under_Verification':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
            <Clock className="w-3.5 h-3.5" /> Documents Under Audit
          </span>
        );
      case 'Documents_Verified':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Documents Authenticated
          </span>
        );
      case 'Documents_Defective':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Action Required (Defective Doc)
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <XCircle className="w-3.5 h-3.5" /> Not Selected / Ineligible
          </span>
        );
      case 'Submitted':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <Clock className="w-3.5 h-3.5" /> Application Submitted
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 font-mono block">
            Student Candidate Portal
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Welcome back, {currentUser.name}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Roll: <strong className="font-mono text-slate-700">{currentUser.studentId}</strong></span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.currentDegree}</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.category} Category</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditingProfile(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
          <button
            onClick={onStartNewApplication}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Scholarship Application
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Applications</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{studentApplications.length}</span>
            <span className="text-xs text-slate-500">submitted this academic year</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Sanctioned Scholarships</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-emerald-600">{selectedCount}</span>
            <span className="text-xs text-slate-500">official award letter ready</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Under Evaluation / Review</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-indigo-600">{underReviewCount}</span>
            <span className="text-xs text-slate-500">processing with committee</span>
          </div>
        </div>
      </div>

      {/* My Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            My Scholarship Applications ({studentApplications.length})
          </h2>
          {studentApplications.length === 0 && (
            <button
              onClick={onStartNewApplication}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Browse Open Schemes & Apply →
            </button>
          )}
        </div>

        {studentApplications.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No active scholarship applications yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
              Explore our need-cum-means and merit scholarship schemes. Complete your personal details, academic marks, and parent income certificate to apply.
            </p>
            <button
              onClick={onStartNewApplication}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Start First Application
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {studentApplications.map((app) => {
              const scheme = schemes.find((s) => s.id === app.schemeId);
              return (
                <div
                  key={app.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 transition-all hover:border-slate-300"
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                        <span>App ID: {app.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>Submitted {app.submissionDate}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{app.schemeName}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(app.status)}
                      {app.status === 'Selected' && (
                        <button
                          onClick={() => onViewAwardLetter(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          <Award className="w-4 h-4" />
                          View Sanction Certificate
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pipeline Lifecycle Step Indicator */}
                  <div className="py-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                      Application Evaluation Progress
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      <div className={`p-2 rounded font-medium ${
                        ['Submitted', 'Documents_Under_Verification', 'Documents_Verified', 'Evaluated', 'Selected', 'Waitlisted'].includes(app.status)
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-50 text-slate-400'
                      }`}>
                        1. Submitted
                      </div>
                      <div className={`p-2 rounded font-medium ${
                        ['Documents_Under_Verification', 'Documents_Verified', 'Evaluated', 'Selected', 'Waitlisted'].includes(app.status)
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : app.status === 'Documents_Defective'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-50 text-slate-400'
                      }`}>
                        2. Document Audit
                      </div>
                      <div className={`p-2 rounded font-medium ${
                        ['Documents_Verified', 'Evaluated', 'Selected', 'Waitlisted'].includes(app.status)
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-50 text-slate-400'
                      }`}>
                        3. Merit Evaluation
                      </div>
                      <div className={`p-2 rounded font-medium ${
                        app.status === 'Selected'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                          : app.status === 'Waitlisted'
                          ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold'
                          : app.status === 'Rejected'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-slate-50 text-slate-400'
                      }`}>
                        4. Final Selection
                      </div>
                    </div>
                  </div>

                  {/* Application Metrics Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg text-xs">
                    <div>
                      <span className="text-slate-500 block">Academic Marks</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {app.currentPercentage.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">CGPA: {app.currentCgpa}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Annual Family Income</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        ${app.annualFamilyIncome.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{app.numberOfDependents} Dependents</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Evaluation Score</span>
                      <span className="font-mono font-bold text-indigo-600 text-sm">
                        {app.compositeScore} / 100
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Acad: {app.academicScore} · Need: {app.financialNeedScore}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Merit Rank</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {app.meritRank ? `Rank #${app.meritRank}` : 'In Ranking Queue'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Quota: {scheme?.totalSlots || 4} slots
                      </span>
                    </div>
                  </div>

                  {/* Admin Feedback or Rejection/Defect Notice */}
                  {app.adminRemarks && (
                    <div className="p-3 bg-indigo-50/50 rounded border border-indigo-100 text-xs text-slate-700">
                      <span className="font-semibold text-indigo-900 block mb-0.5">
                        Evaluation Board Note:
                      </span>
                      <p>{app.adminRemarks}</p>
                    </div>
                  )}

                  {app.rejectionReason && (
                    <div className="p-3 bg-rose-50 rounded border border-rose-200 text-xs text-rose-900">
                      <span className="font-semibold block mb-0.5">Rejection Explanation:</span>
                      <p>{app.rejectionReason}</p>
                    </div>
                  )}

                  {/* Supporting Documents Strip */}
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-slate-700 block mb-2">
                      Attached Documents ({[...app.academicCertificates, ...app.financialCertificates].length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[...app.academicCertificates, ...app.financialCertificates].map((doc) => (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => onPreviewDocument(doc)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border transition-colors cursor-pointer ${
                            doc.status === 'Verified'
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                              : doc.status === 'Defective'
                              ? 'bg-rose-50 border-rose-200 text-rose-800'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{doc.name}</span>
                          <span className="font-mono text-[10px] opacity-75">({doc.status})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Edit Drawer / Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Update Student Profile
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Social Category</label>
                  <select
                    value={profileForm.category}
                    onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="General">General</option>
                    <option value="EWS">EWS</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Degree Program</label>
                <input
                  type="text"
                  value={profileForm.currentDegree}
                  onChange={(e) => setProfileForm({ ...profileForm, currentDegree: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  value={profileForm.currentDepartment}
                  onChange={(e) => setProfileForm({ ...profileForm, currentDepartment: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
