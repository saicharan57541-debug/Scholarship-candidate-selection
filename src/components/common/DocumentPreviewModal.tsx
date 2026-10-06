import React, { useState } from 'react';
import { SupportingDocument } from '../../types';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  ShieldCheck, 
  Calendar, 
  Building,
  UserCheck
} from 'lucide-react';

interface DocumentPreviewModalProps {
  document: SupportingDocument | null;
  studentName?: string;
  studentRoll?: string;
  isAdmin?: boolean;
  onClose: () => void;
  onUpdateVerification?: (docId: string, status: 'Verified' | 'Defective', remarks: string) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  studentName = 'Student Candidate',
  studentRoll = 'ROLL-N/A',
  isAdmin = false,
  onClose,
  onUpdateVerification,
}) => {
  if (!document) return null;

  const [verificationStatus, setVerificationStatus] = useState<'Verified' | 'Defective'>(
    document.status === 'Defective' ? 'Defective' : 'Verified'
  );
  const [remarks, setRemarks] = useState(document.verificationRemarks || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveDecision = () => {
    if (!onUpdateVerification) return;
    setIsSubmitting(true);
    onUpdateVerification(document.id, verificationStatus, remarks);
    setIsSubmitting(false);
    onClose();
  };

  const handleSimulateDownload = () => {
    const element = window.document.createElement('a');
    const file = new Blob([
      `DOCUMENT VERIFICATION RECORD\n` +
      `-----------------------------\n` +
      `Title: ${document.name}\n` +
      `File: ${document.fileName}\n` +
      `Candidate: ${studentName} (${studentRoll})\n` +
      `Issuing Authority: ${document.issuerAuthority || 'State Educational / Revenue Authority'}\n` +
      `Status: ${document.status}\n` +
      `Verification Stamp: AUTHENTICATED\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = document.fileName.replace(/\.pdf$/, '.txt');
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">{document.name}</h3>
              <p className="text-xs text-slate-500 font-mono">
                {document.fileName} · {document.fileSize} · Uploaded {document.uploadDate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Simulated Official Document Sheet */}
          <div className="border border-slate-300 rounded-lg bg-slate-50/40 p-6 shadow-inner relative overflow-hidden">
            {/* Watermark Crest */}
            <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
              <Building className="w-96 h-96 text-slate-800" />
            </div>

            {/* Document Header */}
            <div className="text-center pb-4 border-b border-slate-200 mb-5 relative">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs mb-2">
                GOV
              </div>
              <h4 className="text-sm font-bold tracking-wide text-slate-800 uppercase">
                {document.issuerAuthority || 'State Competent Authority & Examination Directorate'}
              </h4>
              <p className="text-xs text-slate-500">Official Certificate of Verification and Institutional Record</p>
            </div>

            {/* Document Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs relative z-10">
              <div>
                <span className="text-slate-400 block mb-0.5">Applicant Name</span>
                <span className="font-semibold text-slate-900 text-sm">{studentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Registration / Roll No</span>
                <span className="font-mono font-semibold text-slate-900 text-sm">{studentRoll}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Document Classification</span>
                <span className="font-medium text-slate-800">{document.type.replace(/_/g, ' ').toUpperCase()}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Verification Serial Number</span>
                <span className="font-mono text-slate-700">DOC-VERIF-{document.id.slice(-6).toUpperCase()}</span>
              </div>
            </div>

            {/* Document Body Snippet */}
            <div className="mt-5 p-4 bg-white rounded border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-800 mb-1">Authenticated Attestation Statement:</p>
              <p>
                This certifies that the supporting credential submitted under document title 
                <span className="font-medium text-slate-900"> "{document.name}" </span> 
                has been recorded on the central scholarship intake registry. The academic marks, 
                annual income declaration, and associated seal have been cross-checked against 
                state repository standards.
              </p>
              {document.verificationRemarks && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2 text-slate-700 bg-amber-50/50 p-2.5 rounded">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-amber-900 block">Verification Board Note:</span>
                    <span>{document.verificationRemarks}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Stamp & Seal Area */}
            <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Date: {document.uploadDate}</span>
              </div>

              <div className="flex items-center gap-2">
                {document.status === 'Verified' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>AUTHENTICATED & VERIFIED</span>
                  </div>
                ) : document.status === 'Defective' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>DEFECTIVE / RESUBMISSION REQUIRED</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded text-xs font-semibold">
                    <span>PENDING VERIFICATION</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Verification Action Box */}
          {isAdmin && onUpdateVerification && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Administrative Document Audit
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="radio"
                      name="verif-status"
                      checked={verificationStatus === 'Verified'}
                      onChange={() => setVerificationStatus('Verified')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    Mark as Verified
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700 ml-3">
                    <input
                      type="radio"
                      name="verif-status"
                      checked={verificationStatus === 'Defective'}
                      onChange={() => setVerificationStatus('Defective')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    Flag as Defective
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Evaluation Committee Audit Remarks / Instructions
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={
                    verificationStatus === 'Verified'
                      ? 'e.g., Verified against official revenue portal with valid serial'
                      : 'e.g., Seal unclear, missing official signature. Please re-upload.'
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveDecision}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
                >
                  Save Verification Status
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50/70">
          <button
            onClick={handleSimulateDownload}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Document Record
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
