import React, { useState } from 'react';
import { ScholarshipScheme, UserRole } from '../../types';
import { 
  Award, 
  Edit3, 
  Check, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  Users, 
  ShieldCheck,
  Plus,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface SchemeManagerProps {
  schemes: ScholarshipScheme[];
  userRole: UserRole;
  onUpdateSchemes: (updated: ScholarshipScheme[]) => void;
  onApplyForScheme?: (schemeId: string) => void;
}

export const SchemeManager: React.FC<SchemeManagerProps> = ({
  schemes,
  userRole,
  onUpdateSchemes,
  onApplyForScheme,
}) => {
  const [editingScheme, setEditingScheme] = useState<ScholarshipScheme | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheme) return;

    const updated = schemes.map((s) => (s.id === editingScheme.id ? editingScheme : s));
    onUpdateSchemes(updated);
    setEditingScheme(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Institutional Scholarship Schemes & Eligibility Rules
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Predefined eligibility thresholds, seat quotas, and transparent criteria matrices established by the Academic Council.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Scheme criteria and quotas updated successfully!</span>
        </div>
      )}

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    {scheme.code} · {scheme.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{scheme.name}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                {scheme.description}
              </p>

              {/* Award Amount */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between mb-4">
                <span className="text-xs text-slate-500">Sanctioned Award</span>
                <span className="text-base font-bold font-mono text-emerald-700">
                  {scheme.currencySymbol}{scheme.awardAmount.toLocaleString()}
                  <span className="text-[10px] text-slate-500 font-sans font-normal ml-1">/ {scheme.awardFrequency}</span>
                </span>
              </div>

              {/* Predefined Criteria Specs */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    Minimum Academic Marks:
                  </span>
                  <span className="font-mono font-bold text-slate-900">{scheme.minAcademicPercentage}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    Family Income Ceiling:
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    ${scheme.maxAnnualFamilyIncome.toLocaleString()} / yr
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Sanctioned Seats (Quota):
                  </span>
                  <span className="font-mono font-bold text-indigo-700">{scheme.totalSlots} Seats</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Intake Deadline:
                  </span>
                  <span className="font-mono text-slate-700">{scheme.deadline}</span>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Weighting Ratio:</span>
                  <span className="font-mono text-slate-600">
                    {scheme.academicWeight}% Acad · {scheme.financialNeedWeight}% Need · {scheme.hardshipBonusWeight}% Hardship
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 truncate max-w-[140px]">
                {scheme.sponsor}
              </span>

              <div className="flex items-center gap-2">
                {userRole === 'admin' ? (
                  <button
                    onClick={() => setEditingScheme({ ...scheme })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Configure Criteria
                  </button>
                ) : onApplyForScheme ? (
                  <button
                    onClick={() => onApplyForScheme(scheme.id)}
                    className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    Apply Now
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Criteria Configuration Modal */}
      {editingScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Configure Predefined Criteria: {editingScheme.name}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Minimum Academic Marks Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="40"
                  max="100"
                  value={editingScheme.minAcademicPercentage}
                  onChange={(e) =>
                    setEditingScheme({
                      ...editingScheme,
                      minAcademicPercentage: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Maximum Annual Family Income Ceiling ($ / annum)
                </label>
                <input
                  type="number"
                  step="500"
                  min="5000"
                  max="200000"
                  value={editingScheme.maxAnnualFamilyIncome}
                  onChange={(e) =>
                    setEditingScheme({
                      ...editingScheme,
                      maxAnnualFamilyIncome: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Sanctioned Seats Quota
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingScheme.totalSlots}
                    onChange={(e) =>
                      setEditingScheme({
                        ...editingScheme,
                        totalSlots: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Award Amount ($)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={editingScheme.awardAmount}
                    onChange={(e) =>
                      setEditingScheme({
                        ...editingScheme,
                        awardAmount: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Application Deadline Date
                </label>
                <input
                  type="date"
                  value={editingScheme.deadline}
                  onChange={(e) =>
                    setEditingScheme({
                      ...editingScheme,
                      deadline: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingScheme(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Save Criteria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
