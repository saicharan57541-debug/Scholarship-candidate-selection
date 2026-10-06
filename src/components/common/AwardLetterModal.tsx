import React from 'react';
import { Application, ScholarshipScheme } from '../../types';
import { X, Printer, Award, CheckCircle, FileCheck, Shield } from 'lucide-react';

interface AwardLetterModalProps {
  application: Application;
  scheme: ScholarshipScheme;
  onClose: () => void;
}

export const AwardLetterModal: React.FC<AwardLetterModalProps> = ({
  application,
  scheme,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Controls Bar (hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-800">
              Official Scholarship Sanction & Award Certificate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Printable Document Sheet */}
        <div className="p-8 sm:p-12 text-slate-900 bg-white min-h-[680px]">
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center relative">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full border-2 border-slate-900 flex items-center justify-center bg-slate-50 text-slate-900 font-bold text-lg shadow-xs">
                <Shield className="w-8 h-8 text-indigo-900" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
              METROPOLITAN INSTITUTE OF TECHNOLOGY
            </h1>
            <p className="text-xs uppercase tracking-widest text-slate-600 font-medium mt-1">
              Office of the Dean · Student Financial Aid & Academic Scholarships Board
            </p>
            <p className="text-xs text-slate-500 mt-1">
              700 University Avenue, Academic Quadrangle, Metro District · scholarship.affairs@mit.edu
            </p>

            <div className="flex justify-between items-center text-xs text-slate-500 mt-6 pt-2 border-t border-slate-200">
              <span className="font-mono">Ref No: MIT/SCH/{scheme.code}/{application.id}</span>
              <span>Date: {currentDate}</span>
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-6 text-sm leading-relaxed text-slate-800">
            <div>
              <p className="font-semibold text-slate-900">To,</p>
              <p className="font-bold text-base text-slate-900">{application.studentName}</p>
              <p className="text-xs font-mono text-slate-600">Roll No: {application.studentRoll} · Dept: {application.degreeDepartment}</p>
              <p className="text-xs text-slate-600">Email: {application.studentEmail} · Phone: {application.studentPhone}</p>
            </div>

            <div className="py-2">
              <p className="font-bold text-slate-900 uppercase tracking-wide text-xs bg-slate-100 p-2 border-l-4 border-indigo-600">
                Subject: Provisional Sanction of Scholarship Award for Academic Year 2026-2027
              </p>
            </div>

            <p>Dear <span className="font-semibold">{application.studentName}</span>,</p>

            <p>
              On behalf of the Institutional Scholarship Evaluation Committee and the Academic Senate, we are 
              pleased to inform you that following a rigorous and transparent evaluation of your academic performance 
              and family financial background, you have been selected for the award of the prestigious:
            </p>

            {/* Award Card Banner */}
            <div className="p-5 border border-slate-300 rounded-lg bg-slate-50/70 text-slate-900 my-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Scholarship Scheme</span>
                  <span className="text-lg font-bold text-indigo-900">{scheme.name}</span>
                  <p className="text-xs text-slate-600 mt-1">Sponsoring Body: {scheme.sponsor}</p>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                  <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Sanctioned Financial Award</span>
                  <span className="text-2xl font-bold font-mono text-emerald-700">
                    {scheme.currencySymbol}{scheme.awardAmount.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 block">({scheme.awardFrequency})</span>
                </div>
              </div>

              {/* Evaluation Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Merit Rank</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">Rank #{application.meritRank || 1}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Composite Score</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">{application.compositeScore} / 100</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Academic Standing</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">{application.currentPercentage.toFixed(1)}% ({application.currentCgpa} CGPA)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Verification Status</span>
                  <span className="font-semibold text-emerald-700 inline-flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Fully Verified
                  </span>
                </div>
              </div>
            </div>

            <p>
              This award is granted in recognition of your academic diligence and is aimed at relieving economic constraints 
              on your educational journey. The sanctioned grant will be disbursed directly into your validated institutional 
              bank account in two equal semester installments.
            </p>

            {/* Terms */}
            <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-4 rounded border border-slate-200">
              <p className="font-semibold text-slate-800 uppercase tracking-wider">Mandatory Conditions for Award Retention:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Maintenance of minimum 7.50 CGPA without any disciplinary warnings in subsequent semesters.</li>
                <li>Immediate intimation to the Financial Aid Office if receiving any conflicting dual tuition fellowships.</li>
                <li>Submission of the semester progress report certified by your academic department head.</li>
              </ul>
            </div>

            <p className="pt-2">We extend our heartiest congratulations and wish you continued academic excellence.</p>
          </div>

          {/* Signature Block */}
          <div className="mt-12 pt-8 border-t border-slate-300 flex justify-between items-end">
            <div className="text-xs text-slate-500">
              <div className="w-24 h-24 border border-dashed border-slate-300 rounded-full flex items-center justify-center text-center p-2 text-slate-400">
                Official Institutional Seal
              </div>
              <p className="mt-2 font-mono">DIGITAL AUTH ID: {application.id.slice(-6)}</p>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-base text-indigo-950 font-bold mb-1">
                Dr. Eleanor Vance
              </div>
              <div className="h-0.5 w-48 bg-slate-900 ml-auto mb-1"></div>
              <p className="text-xs font-bold text-slate-900">Dr. Eleanor Vance, Ph.D.</p>
              <p className="text-xs text-slate-600">Chairperson, Scholarship Selection Committee</p>
              <p className="text-xs text-slate-500">Metropolitan Institute of Technology</p>
            </div>
          </div>
        </div>

        {/* Footer (hidden during print) */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Print / Save Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
