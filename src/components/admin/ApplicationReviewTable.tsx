import React, { useState, useMemo } from 'react';
import { Application, ScholarshipScheme, SupportingDocument } from '../../types';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Eye, 
  Award, 
  FileText,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface ApplicationReviewTableProps {
  applications: Application[];
  schemes: ScholarshipScheme[];
  onSelectApplication: (app: Application) => void;
  onPreviewDocument: (doc: SupportingDocument) => void;
  onViewAwardLetter: (app: Application) => void;
}

export const ApplicationReviewTable: React.FC<ApplicationReviewTableProps> = ({
  applications,
  schemes,
  onSelectApplication,
  onPreviewDocument,
  onViewAwardLetter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'compositeScore' | 'currentPercentage' | 'annualFamilyIncome' | 'submissionDate'>('compositeScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesSearch = 
          app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.studentRoll.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.degreeDepartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesScheme = 
          selectedSchemeFilter === 'all' || app.schemeId === selectedSchemeFilter;

        const matchesStatus = 
          statusFilter === 'all' || app.status === statusFilter;

        return matchesSearch && matchesScheme && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === 'string') {
          return sortOrder === 'asc' 
            ? (valA as string).localeCompare(valB as string) 
            : (valB as string).localeCompare(valA as string);
        }

        return sortOrder === 'asc' 
          ? (valA as number) - (valB as number) 
          : (valB as number) - (valA as number);
      });
  }, [applications, searchTerm, selectedSchemeFilter, statusFilter, sortBy, sortOrder]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'Selected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selected
          </span>
        );
      case 'Waitlisted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Waitlisted
          </span>
        );
      case 'Documents_Under_Verification':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-600" /> Under Audit
          </span>
        );
      case 'Documents_Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <ShieldCheck className="w-3 h-3 text-indigo-600" /> Docs Verified
          </span>
        );
      case 'Documents_Defective':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Defective Doc
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <XCircle className="w-3 h-3 text-slate-500" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate, roll no, degree..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Scheme Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSchemeFilter}
              onChange={(e) => setSelectedSchemeFilter(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white w-full sm:w-64"
            >
              <option value="all">All Scholarship Schemes ({schemes.length})</option>
              {schemes.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Segmented Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs border-t border-slate-100 pt-3 scrollbar-none">
          <span className="text-slate-400 font-medium text-[11px] mr-2 shrink-0">Status:</span>
          {[
            { val: 'all', label: 'All Applications' },
            { val: 'Submitted', label: 'Submitted' },
            { val: 'Documents_Under_Verification', label: 'Under Audit' },
            { val: 'Documents_Verified', label: 'Verified' },
            { val: 'Selected', label: 'Selected' },
            { val: 'Waitlisted', label: 'Waitlisted' },
            { val: 'Documents_Defective', label: 'Defective' },
            { val: 'Rejected', label: 'Rejected' },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setStatusFilter(item.val)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === item.val
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications High-Density Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Candidate & Roll</th>
                <th className="py-3 px-4">Scholarship Scheme</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none text-right"
                  onClick={() => toggleSort('currentPercentage')}
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Academic %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none text-right"
                  onClick={() => toggleSort('annualFamilyIncome')}
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Family Income</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none text-right"
                  onClick={() => toggleSort('compositeScore')}
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Score (0-100)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Docs Status</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No student applications matching selected filters.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const allDocs = [...app.academicCertificates, ...app.financialCertificates];
                  const verifiedDocs = allDocs.filter((d) => d.status === 'Verified').length;
                  const hasDefect = allDocs.some((d) => d.status === 'Defective');

                  return (
                    <tr 
                      key={app.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectApplication(app)}
                    >
                      {/* Candidate Column */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors">
                            {app.studentName}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {app.studentRoll} · {app.category}
                          </span>
                        </div>
                      </td>

                      {/* Scheme */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-medium text-slate-800 line-clamp-1 block">
                          {app.schemeName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {app.id}
                        </span>
                      </td>

                      {/* Academic */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-bold text-slate-900 text-sm">
                          {app.currentPercentage.toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          10th: {app.tenthPercentage.toFixed(0)}% · 12th: {app.twelfthPercentage.toFixed(0)}%
                        </span>
                      </td>

                      {/* Income */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-bold text-slate-900 text-sm">
                          ${app.annualFamilyIncome.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {app.numberOfDependents} deps {app.isEwsOrBpl ? '· EWS' : ''}
                        </span>
                      </td>

                      {/* Composite Score */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-extrabold text-indigo-700 text-sm">
                          {app.compositeScore}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {app.meritRank ? `Rank #${app.meritRank}` : 'Unranked'}
                        </span>
                      </td>

                      {/* Documents status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
                          hasDefect
                            ? 'text-rose-600'
                            : verifiedDocs === allDocs.length
                            ? 'text-emerald-700'
                            : 'text-amber-600'
                        }`}>
                          {hasDefect ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          ) : verifiedDocs === allDocs.length ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          {verifiedDocs}/{allDocs.length}
                        </span>
                      </td>

                      {/* Application Status */}
                      <td className="py-3.5 px-4 text-center">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onSelectApplication(app)}
                            className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 cursor-pointer"
                          >
                            Audit & Review
                          </button>
                          {app.status === 'Selected' && (
                            <button
                              type="button"
                              onClick={() => onViewAwardLetter(app)}
                              className="p-1 text-indigo-600 hover:text-indigo-800 rounded"
                              title="Award Certificate"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Summary Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Showing {filteredApplications.length} of {applications.length} applications</span>
          <span>Evaluation committee session active</span>
        </div>
      </div>
    </div>
  );
};
