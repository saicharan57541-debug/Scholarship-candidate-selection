import React from 'react';
import { Application, ScholarshipScheme } from '../../types';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  GraduationCap, 
  ShieldCheck, 
  Download,
  Printer
} from 'lucide-react';

interface ReportsAndAnalyticsProps {
  applications: Application[];
  schemes: ScholarshipScheme[];
}

export const ReportsAndAnalytics: React.FC<ReportsAndAnalyticsProps> = ({
  applications,
  schemes,
}) => {
  // Aggregate statistics
  const totalApps = applications.length;
  const selectedApps = applications.filter((a) => a.status === 'Selected');
  const verifiedApps = applications.filter((a) => 
    a.academicCertificates.every((d) => d.status === 'Verified') &&
    a.financialCertificates.every((d) => d.status === 'Verified')
  );

  const totalSanctionedFunds = selectedApps.reduce((sum, app) => {
    const s = schemes.find((x) => x.id === app.schemeId);
    return sum + (s?.awardAmount || 0);
  }, 0);

  const averageSelectedPercentage = selectedApps.length > 0
    ? (selectedApps.reduce((sum, a) => sum + a.currentPercentage, 0) / selectedApps.length).toFixed(1)
    : '0';

  const averageSelectedIncome = selectedApps.length > 0
    ? Math.round(selectedApps.reduce((sum, a) => sum + a.annualFamilyIncome, 0) / selectedApps.length)
    : 0;

  // Category Breakdown
  const categoryCounts: Record<string, number> = {};
  applications.forEach((a) => {
    categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
  });

  // Income Brackets (<15k, 15k-25k, 25k-35k, >35k)
  const incomeBrackets = {
    'Under $15,000': applications.filter((a) => a.annualFamilyIncome < 15000).length,
    '$15,000 – $25,000': applications.filter((a) => a.annualFamilyIncome >= 15000 && a.annualFamilyIncome <= 25000).length,
    '$25,000 – $35,000': applications.filter((a) => a.annualFamilyIncome > 25000 && a.annualFamilyIncome <= 35000).length,
    'Above $35,000': applications.filter((a) => a.annualFamilyIncome > 35000).length,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Institutional Aid Analytics & Transparency Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Demographic equity indicators, economic need index distribution, and merit scholarship disbursement metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Total Applications Logged</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{totalApps}</span>
            <span className="text-xs text-slate-400">across {schemes.length} schemes</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Allocated Scholarship Aid</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              ${totalSanctionedFunds.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">sanctioned</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Avg. Academic Standing (Selected)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-indigo-700">{averageSelectedPercentage}%</span>
            <span className="text-xs text-slate-400">marks</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Avg. Family Income (Selected)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              ${averageSelectedIncome.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">/ yr</span>
          </div>
        </div>
      </div>

      {/* Analytics Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Brackets */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Family Income Bracket Distribution
          </h2>
          <p className="text-xs text-slate-500">
            Targeting economically weaker candidates with acute financial need.
          </p>

          <div className="space-y-3 pt-2">
            {Object.entries(incomeBrackets).map(([bracket, count]) => {
              const pct = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
              return (
                <div key={bracket} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{bracket}</span>
                    <span className="font-mono text-slate-900">{count} students ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social Category Representation */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Social Category Representation
          </h2>
          <p className="text-xs text-slate-500">
            Ensuring institutional diversity and affirmative inclusion guidelines.
          </p>

          <div className="space-y-3 pt-2">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{cat} Category</span>
                    <span className="font-mono text-slate-900">{count} students ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scheme-by-Scheme Allocation Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Scheme Intake & Sanction Summary Table
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Scheme Code & Title</th>
                <th className="py-3 px-4 text-center">Sanctioned Seats</th>
                <th className="py-3 px-4 text-center">Applications</th>
                <th className="py-3 px-4 text-center">Selected</th>
                <th className="py-3 px-4 text-right">Per Candidate Award</th>
                <th className="py-3 px-4 text-right">Committed Aid ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {schemes.map((scheme) => {
                const schemeApps = applications.filter((a) => a.schemeId === scheme.id);
                const schemeSelected = schemeApps.filter((a) => a.status === 'Selected').length;
                const totalCommitted = schemeSelected * scheme.awardAmount;

                return (
                  <tr key={scheme.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{scheme.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{scheme.code}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold">{scheme.totalSlots}</td>
                    <td className="py-3 px-4 text-center font-mono">{schemeApps.length}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">{schemeSelected}</td>
                    <td className="py-3 px-4 text-right font-mono">${scheme.awardAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ${totalCommitted.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
