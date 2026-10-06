import React, { useState } from 'react';
import { 
  UserProfile, 
  ScholarshipScheme, 
  Application, 
  SupportingDocument,
  HardshipDetails 
} from '../../types';
import { 
  checkScholarshipEligibility, 
  calculateEvaluationScore, 
  checkDuplicateApplication 
} from '../../utils/evaluationEngine';
import { 
  GraduationCap, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle,
  Eye,
  Trash2
} from 'lucide-react';

interface ApplicationWizardProps {
  currentUser: UserProfile;
  schemes: ScholarshipScheme[];
  existingApplications: Application[];
  selectedSchemeId?: string;
  onSuccess: (newApplication: Application) => void;
  onCancel: () => void;
  onPreviewDocument: (doc: SupportingDocument) => void;
}

export const ApplicationWizard: React.FC<ApplicationWizardProps> = ({
  currentUser,
  schemes,
  existingApplications,
  selectedSchemeId,
  onSuccess,
  onCancel,
  onPreviewDocument,
}) => {
  const [step, setStep] = useState<number>(1);
  const [targetSchemeId, setTargetSchemeId] = useState<string>(
    selectedSchemeId || schemes[0]?.id || ''
  );

  // Step 1: Personal Details (pre-filled from user profile)
  const [personalDetails, setPersonalDetails] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    studentRoll: currentUser.studentId,
    gender: currentUser.gender,
    category: currentUser.category,
    degreeDepartment: `${currentUser.currentDegree} · ${currentUser.currentDepartment}`,
    institutionName: currentUser.institutionName,
    firstGenerationStudent: currentUser.firstGenerationStudent,
    singleParentFamily: currentUser.singleParentFamily,
  });

  // Step 2: Academic Information
  const [academicDetails, setAcademicDetails] = useState({
    tenthBoard: 'Central Board of Secondary Education (CBSE)',
    tenthPercentage: 88.5,
    twelfthBoard: 'State Board of Higher Secondary Education',
    twelfthPercentage: 86.0,
    currentCgpa: 8.75,
    currentPercentage: 83.1, // percentage conversion = CGPA * 9.5 approx or custom
  });

  // Step 3: Family Financial Background
  const [financialDetails, setFinancialDetails] = useState({
    annualFamilyIncome: 18000,
    fatherOccupation: 'Driver / Transportation Worker',
    motherOccupation: 'Home Tailor (Informal Sector)',
    guardianOccupation: '',
    numberOfDependents: 4,
    numberOfStudyingSiblings: 2,
    isEwsOrBpl: true,
    bplCardNumber: 'BPL-METRO-88210',
    hasChronicMedicalCost: false,
    singleEarningParent: true,
    hasAgriculturalLossOrDebt: false,
    orphanOrFostered: false,
    hardshipDescription: 'Mother works informal tailoring hours; father is single wage earner supporting aged grandparents.',
  });

  // Document Uploads
  const [documents, setDocuments] = useState<SupportingDocument[]>([
    {
      id: `DOC-ACAD-10-${Date.now()}`,
      type: '10th_marksheet',
      name: 'Class 10th Board Certificate & Marksheet',
      fileName: '10th_marksheet_verified.pdf',
      fileSize: '1.2 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      issuerAuthority: 'CBSE Examination Directorate',
    },
    {
      id: `DOC-ACAD-12-${Date.now() + 1}`,
      type: '12th_marksheet',
      name: 'Class 12th Higher Secondary Grade Sheet',
      fileName: '12th_transcript_board.pdf',
      fileSize: '1.5 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      issuerAuthority: 'State Board of Higher Secondary Education',
    },
    {
      id: `DOC-ACAD-COL-${Date.now() + 2}`,
      type: 'college_transcript',
      name: 'Consolidated College Semesters Transcript',
      fileName: 'college_semester_gradecard.pdf',
      fileSize: '2.0 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      issuerAuthority: 'Office of Controller of Examinations, MIT',
    },
    {
      id: `DOC-FIN-INC-${Date.now() + 3}`,
      type: 'income_certificate',
      name: 'Revenue Tehsildar Annual Income Certificate',
      fileName: 'income_certificate_authenticated.pdf',
      fileSize: '950 KB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      issuerAuthority: 'Sub-Divisional Revenue Officer',
    },
    {
      id: `DOC-FIN-EWS-${Date.now() + 4}`,
      type: 'caste_ews_certificate',
      name: 'EWS Category Certificate / Ration Card',
      fileName: 'ews_category_credential.pdf',
      fileSize: '1.1 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      issuerAuthority: 'District Welfare Department',
    },
  ]);

  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [newDocType, setNewDocType] = useState<SupportingDocument['type']>('affidavit_hardship');

  const selectedScheme = schemes.find((s) => s.id === targetSchemeId) || schemes[0];

  // Duplicate Check
  const isDuplicate = checkDuplicateApplication(existingApplications, currentUser.id, targetSchemeId);

  // Live Eligibility Check
  const liveEligibility = checkScholarshipEligibility(
    academicDetails.currentPercentage,
    financialDetails.annualFamilyIncome,
    personalDetails.category,
    personalDetails.gender,
    selectedScheme
  );

  // Live Score Calculation
  const liveScores = calculateEvaluationScore({
    tenthPercentage: academicDetails.tenthPercentage,
    twelfthPercentage: academicDetails.twelfthPercentage,
    currentPercentage: academicDetails.currentPercentage,
    annualFamilyIncome: financialDetails.annualFamilyIncome,
    numberOfDependents: financialDetails.numberOfDependents,
    isEwsOrBpl: financialDetails.isEwsOrBpl,
    hardship: {
      hasChronicMedicalCost: financialDetails.hasChronicMedicalCost,
      singleEarningParent: financialDetails.singleEarningParent,
      hasAgriculturalLossOrDebt: financialDetails.hasAgriculturalLossOrDebt,
      orphanOrFostered: financialDetails.orphanOrFostered,
    },
    firstGenerationStudent: personalDetails.firstGenerationStudent,
  }, selectedScheme);

  // Document management
  const handleSimulateAddDoc = () => {
    if (!simulatedFileName.trim()) return;
    const newDoc: SupportingDocument = {
      id: `DOC-${Date.now()}`,
      type: newDocType,
      name: newDocType.replace(/_/g, ' ').toUpperCase(),
      fileName: simulatedFileName.endsWith('.pdf') ? simulatedFileName : `${simulatedFileName}.pdf`,
      fileSize: '1.4 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      issuerAuthority: 'Institutional / Revenue Authority',
    };
    setDocuments([...documents, newDoc]);
    setSimulatedFileName('');
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  const handleSubmitApplication = () => {
    if (isDuplicate) {
      alert('You have already submitted an active application for this scholarship scheme.');
      return;
    }

    const academicDocs = documents.filter((d) => 
      ['10th_marksheet', '12th_marksheet', 'college_transcript'].includes(d.type)
    );
    const financialDocs = documents.filter((d) => 
      !['10th_marksheet', '12th_marksheet', 'college_transcript'].includes(d.type)
    );

    const newApp: Application = {
      id: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: currentUser.id,
      studentName: personalDetails.name,
      studentEmail: personalDetails.email,
      studentRoll: personalDetails.studentRoll,
      studentPhone: personalDetails.phone,
      gender: personalDetails.gender,
      category: personalDetails.category,
      institutionName: personalDetails.institutionName,
      degreeDepartment: personalDetails.degreeDepartment,
      schemeId: selectedScheme.id,
      schemeName: selectedScheme.name,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      
      tenthBoard: academicDetails.tenthBoard,
      tenthPercentage: academicDetails.tenthPercentage,
      twelfthBoard: academicDetails.twelfthBoard,
      twelfthPercentage: academicDetails.twelfthPercentage,
      currentCgpa: academicDetails.currentCgpa,
      currentPercentage: academicDetails.currentPercentage,
      academicCertificates: academicDocs,

      annualFamilyIncome: financialDetails.annualFamilyIncome,
      fatherOccupation: financialDetails.fatherOccupation,
      motherOccupation: financialDetails.motherOccupation,
      guardianOccupation: financialDetails.guardianOccupation,
      numberOfDependents: financialDetails.numberOfDependents,
      numberOfStudyingSiblings: financialDetails.numberOfStudyingSiblings,
      isEwsOrBpl: financialDetails.isEwsOrBpl,
      bplCardNumber: financialDetails.bplCardNumber,
      hardship: {
        hasChronicMedicalCost: financialDetails.hasChronicMedicalCost,
        singleEarningParent: financialDetails.singleEarningParent,
        hasAgriculturalLossOrDebt: financialDetails.hasAgriculturalLossOrDebt,
        orphanOrFostered: financialDetails.orphanOrFostered,
        additionalNotes: financialDetails.hardshipDescription,
      },
      financialCertificates: financialDocs,

      isEligible: liveEligibility.isEligible,
      eligibilityCheck: liveEligibility,

      ...liveScores,
      meritRank: undefined,
    };

    onSuccess(newApp);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Wizard Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Scholarship Application Intake</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional Candidate Selection Portal · Academic Year 2026-2027
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          Cancel & Exit
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { stepNum: 1, label: '1. Scheme & Personal' },
            { stepNum: 2, label: '2. Academic Marks' },
            { stepNum: 3, label: '3. Financial & Hardship' },
            { stepNum: 4, label: '4. Evaluation Preview' },
          ].map((item) => (
            <button
              key={item.stepNum}
              onClick={() => setStep(item.stepNum)}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                step === item.stepNum
                  ? 'bg-slate-900 text-white shadow-xs'
                  : step > item.stepNum
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-400 bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duplicate Application Banner */}
      {isDuplicate && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl mb-6 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Duplicate Application Detected</span>
            <span>
              You already have a submitted or evaluated application on file for{' '}
              <strong>{selectedScheme.name}</strong>. The system restricts candidates to a single active application per scholarship scheme.
            </span>
          </div>
        </div>
      )}

      {/* STEP 1: Scheme Selection & Personal Details */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Select Target Scholarship Program
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Choose the program you are applying for. Predefined criteria will be applied dynamically.
            </p>

            <select
              value={targetSchemeId}
              onChange={(e) => setTargetSchemeId(e.target.value)}
              className="w-full text-sm font-semibold px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {schemes.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>
                  {scheme.name} ({scheme.category}) — {scheme.currencySymbol}{scheme.awardAmount.toLocaleString()} / {scheme.awardFrequency}
                </option>
              ))}
            </select>

            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Criteria for {selectedScheme.name}: </span>
              <span>
                Min Academic: <strong>{selectedScheme.minAcademicPercentage}%</strong> · Max Annual Income: <strong>${selectedScheme.maxAnnualFamilyIncome.toLocaleString()}</strong> · Total Seats: <strong>{selectedScheme.totalSlots}</strong>
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              Personal & Institutional Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={personalDetails.name}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Student ID / Roll No</label>
                <input
                  type="text"
                  value={personalDetails.studentRoll}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, studentRoll: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={personalDetails.email}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={personalDetails.phone}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Social / Reservation Category</label>
                <select
                  value={personalDetails.category}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="General">General</option>
                  <option value="EWS">Economically Weaker Section (EWS)</option>
                  <option value="OBC">Other Backward Classes (OBC)</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Gender</label>
                <select
                  value={personalDetails.gender}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, gender: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="font-medium text-slate-700 block mb-1">Degree Program & Department</label>
                <input
                  type="text"
                  value={personalDetails.degreeDepartment}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, degreeDepartment: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={personalDetails.firstGenerationStudent}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, firstGenerationStudent: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                First-generation college student in family (+2 score consideration)
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={personalDetails.singleParentFamily}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, singleParentFamily: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Single parent household
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Continue to Academic Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Academic Qualifications */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Academic Qualifications & Performance
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter previous and current academic records. Percentage calculations are cross-checked with official mark sheets.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Secondary (10th) */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wider">
                  Secondary School (10th Grade)
                </span>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Examining Board</label>
                  <input
                    type="text"
                    value={academicDetails.tenthBoard}
                    onChange={(e) => setAcademicDetails({ ...academicDetails, tenthBoard: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Aggregated Marks Percentage (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={academicDetails.tenthPercentage}
                    onChange={(e) => setAcademicDetails({ ...academicDetails, tenthPercentage: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              {/* Higher Secondary (12th) */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wider">
                  Senior Secondary (12th Grade)
                </span>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Examining Board</label>
                  <input
                    type="text"
                    value={academicDetails.twelfthBoard}
                    onChange={(e) => setAcademicDetails({ ...academicDetails, twelfthBoard: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Aggregated Marks Percentage (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={academicDetails.twelfthPercentage}
                    onChange={(e) => setAcademicDetails({ ...academicDetails, twelfthPercentage: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              {/* Current Collegiate Standing */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 md:col-span-2">
                <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wider">
                  Current Undergraduate / Postgraduate Standing
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Cumulative Grade Point Average (CGPA / 10.0)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={academicDetails.currentCgpa}
                      onChange={(e) => {
                        const cgpa = parseFloat(e.target.value) || 0;
                        const calcPct = Number((cgpa * 9.5).toFixed(2));
                        setAcademicDetails({ ...academicDetails, currentCgpa: cgpa, currentPercentage: calcPct });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Institutional standard multiplier: CGPA × 9.5</p>
                  </div>
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">Equivalent Marks Percentage (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={academicDetails.currentPercentage}
                      onChange={(e) => setAcademicDetails({ ...academicDetails, currentPercentage: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono font-bold text-slate-900"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Used for scheme eligibility comparison</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Continue to Financial Background
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Family Financial Background & Hardship */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Family Financial Background & Hardship Circumstances
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Detailed financial parameters enable our transparent evaluation engine to compute accurate need index scores.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Annual Gross Family Income ($ / annum)
                </label>
                <input
                  type="number"
                  step="500"
                  value={financialDetails.annualFamilyIncome}
                  onChange={(e) => setFinancialDetails({ ...financialDetails, annualFamilyIncome: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Scheme ceiling: ${selectedScheme.maxAnnualFamilyIncome.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Father / Primary Guardian Occupation
                </label>
                <input
                  type="text"
                  value={financialDetails.fatherOccupation}
                  onChange={(e) => setFinancialDetails({ ...financialDetails, fatherOccupation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Mother / Secondary Guardian Occupation
                </label>
                <input
                  type="text"
                  value={financialDetails.motherOccupation}
                  onChange={(e) => setFinancialDetails({ ...financialDetails, motherOccupation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Number of Dependents</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={financialDetails.numberOfDependents}
                    onChange={(e) => setFinancialDetails({ ...financialDetails, numberOfDependents: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Studying Siblings</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={financialDetails.numberOfStudyingSiblings}
                    onChange={(e) => setFinancialDetails({ ...financialDetails, numberOfStudyingSiblings: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="md:col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={financialDetails.isEwsOrBpl}
                    onChange={(e) => setFinancialDetails({ ...financialDetails, isEwsOrBpl: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  Family possesses official Economically Weaker Section (EWS) or Below Poverty Line (BPL) Card
                </label>
                {financialDetails.isEwsOrBpl && (
                  <div className="mt-2 pl-6">
                    <label className="text-[11px] text-slate-600 block mb-1">BPL / Ration Card Serial Number</label>
                    <input
                      type="text"
                      value={financialDetails.bplCardNumber}
                      onChange={(e) => setFinancialDetails({ ...financialDetails, bplCardNumber: e.target.value })}
                      placeholder="e.g. BPL-STATE-12904"
                      className="text-xs px-3 py-1.5 border border-slate-300 rounded bg-white w-full sm:w-64 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Special Hardship Factors */}
              <div className="md:col-span-2 space-y-2 pt-2">
                <span className="font-semibold text-slate-800 block text-xs">
                  Family Hardship Indicators (Subject to verification for bonus points):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={financialDetails.hasChronicMedicalCost}
                      onChange={(e) => setFinancialDetails({ ...financialDetails, hasChronicMedicalCost: e.target.checked })}
                    />
                    Chronic medical costs / ongoing healthcare distress
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={financialDetails.singleEarningParent}
                      onChange={(e) => setFinancialDetails({ ...financialDetails, singleEarningParent: e.target.checked })}
                    />
                    Single earning parent or sole provider
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={financialDetails.hasAgriculturalLossOrDebt}
                      onChange={(e) => setFinancialDetails({ ...financialDetails, hasAgriculturalLossOrDebt: e.target.checked })}
                    />
                    Rural crop loss / acute agricultural debt
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={financialDetails.orphanOrFostered}
                      onChange={(e) => setFinancialDetails({ ...financialDetails, orphanOrFostered: e.target.checked })}
                    />
                    Orphan / fostered / loss of parents
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="font-medium text-slate-700 block mb-1">
                  Additional Financial Statement / Hardship Description
                </label>
                <textarea
                  rows={2}
                  value={financialDetails.hardshipDescription}
                  onChange={(e) => setFinancialDetails({ ...financialDetails, hardshipDescription: e.target.value })}
                  placeholder="Summarize any unforeseen financial emergencies or economic barriers..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Document Uploads Subsection */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Supporting Document Credentials ({documents.length} attached)
                </h3>
              </div>

              {/* Uploaded Docs List */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg mb-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <div>
                        <span className="font-semibold text-slate-800">{doc.name}</span>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {doc.fileName} · {doc.fileSize} · {doc.issuerAuthority}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onPreviewDocument(doc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium"
                      >
                        <Eye className="w-3 h-3" /> Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Remove document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Document Form */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-3 text-xs">
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as any)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded bg-white w-full sm:w-auto"
                >
                  <option value="affidavit_hardship">Hardship Affidavit / Medical Proof</option>
                  <option value="income_certificate">Salary Slip / Tax Return Statement</option>
                  <option value="bank_passbook">Bank Account Passbook / Statement</option>
                </select>
                <input
                  type="text"
                  placeholder="Document file name (e.g. hardship_medical_proof.pdf)"
                  value={simulatedFileName}
                  onChange={(e) => setSimulatedFileName(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded bg-white flex-1 w-full"
                />
                <button
                  type="button"
                  onClick={handleSimulateAddDoc}
                  disabled={!simulatedFileName.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded font-medium disabled:opacity-50 whitespace-nowrap cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  Attach File
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Preview Evaluation & Scores
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review, Transparent Evaluation Calculation & Submission */}
      {step === 4 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Transparent Evaluation Preview & Final Submission
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Review your transparent candidate evaluation formula. All institutional scores are deterministically calculated.
            </p>

            {/* Scheme Eligibility Box */}
            <div className={`p-4 rounded-xl border mb-6 ${
              liveEligibility.isEligible 
                ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center gap-2 font-semibold text-sm mb-2">
                {liveEligibility.isEligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                )}
                <span>
                  {liveEligibility.isEligible
                    ? `Candidate Fully Qualified for ${selectedScheme.name}`
                    : `Eligibility Criterion Not Met`}
                </span>
              </div>
              <ul className="text-xs space-y-1 list-disc list-inside">
                {liveEligibility.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Transparent Scoring Formula Matrix */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Transparent Evaluation Engine Breakdown
                </span>
                <span className="text-xs font-mono text-slate-500">Scale: 0 – 100 Points</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Academic component */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 block">Academic Merit (Weight 50%)</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold font-mono text-slate-900">{liveScores.academicScore}</span>
                    <span className="text-xs text-slate-400 font-mono">/ 50 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Based on {academicDetails.currentPercentage.toFixed(1)}% current + 12th & 10th history
                  </p>
                </div>

                {/* Financial Need component */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 block">Financial Need (Weight 40%)</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold font-mono text-slate-900">{liveScores.financialNeedScore}</span>
                    <span className="text-xs text-slate-400 font-mono">/ 40 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ${financialDetails.annualFamilyIncome.toLocaleString()} income · {financialDetails.numberOfDependents} dependents
                  </p>
                </div>

                {/* Hardship Bonus */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 block">Hardship Bonus (Weight 10%)</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold font-mono text-slate-900">{liveScores.hardshipBonusScore}</span>
                    <span className="text-xs text-slate-400 font-mono">/ 10 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Special circumstances & first-generation index
                  </p>
                </div>
              </div>

              {/* Total Composite Score */}
              <div className="p-4 bg-indigo-900 text-white rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider block">
                    Calculated Merit Evaluation Score
                  </span>
                  <p className="text-xs text-indigo-300 mt-0.5">
                    This score determines rank placement in the institutional Merit List.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {liveScores.compositeScore}
                  </span>
                  <span className="text-xs font-mono text-indigo-300 block">out of 100.00</span>
                </div>
              </div>
            </div>

            {/* Certification Declaration */}
            <div className="mt-6 p-4 border border-slate-200 rounded-lg text-xs text-slate-600 bg-slate-50">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  required
                  className="rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <span>
                  I solemnly declare that all statements made regarding my family annual income, parent occupations, 
                  and academic marks are true and accurate. I understand that falsification will lead to immediate cancellation 
                  of scholarship, recovery of disbursed funds, and disciplinary referral.
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleSubmitApplication}
              disabled={isDuplicate}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-50 cursor-pointer"
            >
              Submit Application Form
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
