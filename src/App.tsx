import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  ScholarshipScheme, 
  Application, 
  NotificationItem, 
  SupportingDocument 
} from './types';
import { 
  getCurrentUser, 
  setCurrentUser as persistCurrentUser,
  getStoredUsers, 
  getStoredSchemes, 
  saveSchemes,
  getStoredApplications, 
  saveApplications, 
  getStoredNotifications, 
  saveNotifications,
  resetAllDataToDefault,
  DEMO_USERS
} from './utils/storage';
import { Header } from './components/common/Header';
import { DocumentPreviewModal } from './components/common/DocumentPreviewModal';
import { AwardLetterModal } from './components/common/AwardLetterModal';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ApplicationWizard } from './components/student/ApplicationWizard';
import { EligibilityChecker } from './components/student/EligibilityChecker';
import { ApplicationReviewTable } from './components/admin/ApplicationReviewTable';
import { ApplicationDetailDrawer } from './components/admin/ApplicationDetailDrawer';
import { MeritListGenerator } from './components/admin/MeritListGenerator';
import { SchemeManager } from './components/admin/SchemeManager';
import { ReportsAndAnalytics } from './components/reports/ReportsAndAnalytics';
import { 
  UserPlus, 
  ShieldCheck, 
  GraduationCap, 
  AlertCircle, 
  CheckCircle2, 
  X,
  FileText,
  Clock,
  Award,
  Users
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<UserProfile>(getCurrentUser());
  const [allUsers, setAllUsers] = useState<UserProfile[]>(getStoredUsers());
  const [schemes, setSchemes] = useState<ScholarshipScheme[]>(getStoredSchemes());
  const [applications, setApplications] = useState<Application[]>(getStoredApplications());
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications());

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [preselectedSchemeId, setPreselectedSchemeId] = useState<string | undefined>(undefined);

  // Modals
  const [inspectingDoc, setInspectingDoc] = useState<{
    doc: SupportingDocument;
    studentName?: string;
    studentRoll?: string;
  } | null>(null);

  const [awardLetterApp, setAwardLetterApp] = useState<Application | null>(null);
  const [selectedAppForReview, setSelectedAppForReview] = useState<Application | null>(null);
  const [showRegisterStudentModal, setShowRegisterStudentModal] = useState(false);

  // New Student Registration State
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    studentId: `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    phone: '',
    gender: 'Female' as const,
    category: 'General' as const,
    currentDegree: 'B.Tech Computer Engineering',
    currentDepartment: 'School of Engineering',
    firstGenerationStudent: false,
    singleParentFamily: false,
  });

  // Keep state synchronized with storage events
  useEffect(() => {
    const handleStorageChange = () => {
      setSchemes(getStoredSchemes());
      setApplications(getStoredApplications());
      setNotifications(getStoredNotifications());
      setAllUsers(getStoredUsers());
    };

    const handleUserChange = () => {
      setCurrentUserState(getCurrentUser());
    };

    window.addEventListener('scholarship_data_updated', handleStorageChange);
    window.addEventListener('scholarship_user_changed', handleUserChange);
    window.addEventListener('scholarship_notifications_updated', handleStorageChange);

    return () => {
      window.removeEventListener('scholarship_data_updated', handleStorageChange);
      window.removeEventListener('scholarship_user_changed', handleUserChange);
      window.removeEventListener('scholarship_notifications_updated', handleStorageChange);
    };
  }, []);

  const handleSelectUser = (user: UserProfile) => {
    persistCurrentUser(user);
    setCurrentUserState(user);
    setIsApplying(false);
  };

  const handleResetData = () => {
    if (window.confirm('Reset application data to initial demo state? All test submissions will be restored to defaults.')) {
      resetAllDataToDefault();
      setCurrentUserState(getCurrentUser());
      setSchemes(getStoredSchemes());
      setApplications(getStoredApplications());
      setNotifications(getStoredNotifications());
      setIsApplying(false);
    }
  };

  const handleMarkNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
    setNotifications(updated);
  };

  const handleClearAllNotifications = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
    setNotifications(updated);
  };

  // Submit Application
  const handleApplicationSuccess = (newApp: Application) => {
    const updatedApps = [newApp, ...applications];
    saveApplications(updatedApps);
    setApplications(updatedApps);
    setIsApplying(false);
    setActiveTab('dashboard');

    // Generate in-app notifications
    const newNotifs: NotificationItem[] = [
      {
        id: `NOTIF-${Date.now()}`,
        recipientId: currentUser.id,
        title: 'Application Submitted Successfully',
        message: `Your scholarship application ${newApp.id} for ${newApp.schemeName} has been queued for document verification.`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'status_update',
        applicationId: newApp.id,
      },
      {
        id: `NOTIF-${Date.now() + 1}`,
        recipientId: 'admin',
        title: 'New Student Application Received',
        message: `${newApp.studentName} (${newApp.studentRoll}) submitted application for ${newApp.schemeName}.`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'status_update',
        applicationId: newApp.id,
      },
      ...notifications,
    ];
    saveNotifications(newNotifs);
    setNotifications(newNotifs);
  };

  // Start Application from scheme or button
  const handleStartApplicationForScheme = (schemeId?: string) => {
    setPreselectedSchemeId(schemeId);
    setIsApplying(true);
  };

  // Admin updates application status
  const handleUpdateApplicationStatus = (
    appId: string, 
    newStatus: Application['status'], 
    remarks: string, 
    rejectionReason?: string
  ) => {
    const targetApp = applications.find((a) => a.id === appId);
    const updatedApps = applications.map((app) => {
      if (app.id === appId) {
        return {
          ...app,
          status: newStatus,
          adminRemarks: remarks,
          rejectionReason: rejectionReason || app.rejectionReason,
          reviewedBy: currentUser.name,
          reviewDate: new Date().toISOString().split('T')[0],
          awardLetterGenerated: newStatus === 'Selected',
        };
      }
      return app;
    });

    saveApplications(updatedApps);
    setApplications(updatedApps);

    // Notify the student
    if (targetApp) {
      let title = 'Application Status Updated';
      let message = `Your application for ${targetApp.schemeName} is now marked as ${newStatus.replace(/_/g, ' ')}.`;
      let type: NotificationItem['type'] = 'status_update';

      if (newStatus === 'Selected') {
        title = 'Scholarship Awarded!';
        message = `Congratulations! You have been selected for ${targetApp.schemeName}. Your formal award letter is ready.`;
        type = 'selection';
      } else if (newStatus === 'Documents_Defective') {
        title = 'Supporting Document Flagged';
        message = `A defect was noted on your application documents. Remark: "${remarks}". Please review.`;
        type = 'document_flag';
      }

      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        recipientId: targetApp.studentId,
        title,
        message,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type,
        applicationId: targetApp.id,
      };

      const updatedNotifs = [newNotif, ...notifications];
      saveNotifications(updatedNotifs);
      setNotifications(updatedNotifs);
    }
  };

  // Document verification toggle
  const handleUpdateDocumentVerification = (
    docId: string,
    status: 'Verified' | 'Defective',
    remarks: string
  ) => {
    const updatedApps = applications.map((app) => {
      const matchAcad = app.academicCertificates.find((d) => d.id === docId);
      const matchFin = app.financialCertificates.find((d) => d.id === docId);

      if (matchAcad || matchFin) {
        const updateDoc = (d: SupportingDocument) =>
          d.id === docId
            ? {
                ...d,
                status,
                verificationRemarks: remarks,
                verifiedBy: currentUser.name,
                verifiedAt: new Date().toISOString().split('T')[0],
              }
            : d;

        return {
          ...app,
          academicCertificates: app.academicCertificates.map(updateDoc),
          financialCertificates: app.financialCertificates.map(updateDoc),
          status: status === 'Defective' ? ('Documents_Defective' as const) : app.status,
        };
      }
      return app;
    });

    saveApplications(updatedApps);
    setApplications(updatedApps);
  };

  // Student Profile Update
  const handleUpdateStudentProfile = (updated: UserProfile) => {
    persistCurrentUser(updated);
    setCurrentUserState(updated);

    const updatedUsers = allUsers.map((u) => (u.id === updated.id ? updated : u));
    localStorage.setItem('scholarship_users_v1', JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
  };

  // Register New Student Form Submission
  const handleRegisterNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email) return;

    const newStudent: UserProfile = {
      id: `STU-${Date.now()}`,
      name: regForm.name,
      email: regForm.email,
      role: 'student',
      studentId: regForm.studentId,
      phone: regForm.phone || '+1 (555) 000-1122',
      gender: regForm.gender,
      category: regForm.category,
      dateOfBirth: '2005-06-15',
      address: 'Metropolitan Campus Residences, Block C',
      institutionName: 'Metropolitan Institute of Technology',
      currentDegree: regForm.currentDegree,
      currentDepartment: regForm.currentDepartment,
      currentSemesterYear: 'Year 1 / Semester 2',
      firstGenerationStudent: regForm.firstGenerationStudent,
      singleParentFamily: regForm.singleParentFamily,
      differentlyAbled: false,
    };

    const updatedUsers = [...allUsers, newStudent];
    localStorage.setItem('scholarship_users_v1', JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);

    // Switch to newly created user immediately
    persistCurrentUser(newStudent);
    setCurrentUserState(newStudent);
    setShowRegisterStudentModal(false);
    setIsApplying(false);
  };

  // Merit List publication bulk notifications
  const handleMeritListPublishedNotifications = (schemeName: string, selectedCount: number) => {
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      recipientId: 'all',
      title: `Merit List Published: ${schemeName}`,
      message: `The institutional evaluation board has released the finalized merit list. ${selectedCount} candidates selected for sanction.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'announcement',
    };
    const updated = [newNotif, ...notifications];
    saveNotifications(updated);
    setNotifications(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 3-Zone Navigation Header */}
      <Header
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsApplying(false);
        }}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onClearAllNotifications={handleClearAllNotifications}
        onResetData={handleResetData}
        onOpenAwardLetter={(appId) => {
          const app = applications.find((a) => a.id === appId);
          if (app) setAwardLetterApp(app);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {isApplying ? (
          <ApplicationWizard
            currentUser={currentUser}
            schemes={schemes}
            existingApplications={applications}
            selectedSchemeId={preselectedSchemeId}
            onSuccess={handleApplicationSuccess}
            onCancel={() => setIsApplying(false)}
            onPreviewDocument={(doc) =>
              setInspectingDoc({
                doc,
                studentName: currentUser.name,
                studentRoll: currentUser.studentId,
              })
            }
          />
        ) : (
          <>
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <>
                {currentUser.role === 'student' ? (
                  <StudentDashboard
                    currentUser={currentUser}
                    applications={applications}
                    schemes={schemes}
                    onStartNewApplication={() => handleStartApplicationForScheme()}
                    onViewAwardLetter={(app) => setAwardLetterApp(app)}
                    onPreviewDocument={(doc) =>
                      setInspectingDoc({
                        doc,
                        studentName: currentUser.name,
                        studentRoll: currentUser.studentId,
                      })
                    }
                    onUpdateProfile={handleUpdateStudentProfile}
                  />
                ) : (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {/* Admin Board Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                      <div>
                        <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 font-mono block">
                          Evaluation Committee Control Center
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                          Welcome, {currentUser.name}
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                          Academic Scholarships & Financial Aid Allocation Directorate · Academic Year 2026-2027
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowRegisterStudentModal(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                          Register New Student
                        </button>
                        <button
                          onClick={() => setActiveTab('merit-list')}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs cursor-pointer"
                        >
                          <Award className="w-4 h-4 text-emerald-400" />
                          View Merit Lists
                        </button>
                      </div>
                    </div>

                    {/* Admin Executive Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-xs text-slate-500 font-medium block">Total Applications</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-2xl font-bold font-mono text-slate-900">{applications.length}</span>
                          <span className="text-xs text-slate-400">across {schemes.length} schemes</span>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-xs text-slate-500 font-medium block">Verification Pending</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-2xl font-bold font-mono text-amber-600">
                            {applications.filter((a) => ['Submitted', 'Documents_Under_Verification'].includes(a.status)).length}
                          </span>
                          <span className="text-xs text-slate-400">awaiting document audit</span>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-xs text-slate-500 font-medium block">Selected Candidates</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-2xl font-bold font-mono text-emerald-600">
                            {applications.filter((a) => a.status === 'Selected').length}
                          </span>
                          <span className="text-xs text-slate-400">within quota slots</span>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-xs text-slate-500 font-medium block">Active Schemes</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-2xl font-bold font-mono text-indigo-700">
                            {schemes.length}
                          </span>
                          <span className="text-xs text-slate-400">programs open</span>
                        </div>
                      </div>
                    </div>

                    {/* Applications Review Queue */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">
                          Candidate Intake & Verification Queue
                        </h2>
                        <span className="text-xs text-slate-500">
                          Click any candidate row to audit documents and record committee decisions.
                        </span>
                      </div>

                      <ApplicationReviewTable
                        applications={applications}
                        schemes={schemes}
                        onSelectApplication={(app) => setSelectedAppForReview(app)}
                        onPreviewDocument={(doc) =>
                          setInspectingDoc({
                            doc,
                            studentName: 'Candidate',
                            studentRoll: 'ROLL-VERIF',
                          })
                        }
                        onViewAwardLetter={(app) => setAwardLetterApp(app)}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* TAB: SCHEMES */}
            {activeTab === 'schemes' && (
              <SchemeManager
                schemes={schemes}
                userRole={currentUser.role}
                onUpdateSchemes={(updated) => {
                  saveSchemes(updated);
                  setSchemes(updated);
                }}
                onApplyForScheme={(schemeId) => handleStartApplicationForScheme(schemeId)}
              />
            )}

            {/* TAB: ELIGIBILITY CHECKER */}
            {activeTab === 'eligibility' && (
              <EligibilityChecker
                schemes={schemes}
                currentUser={currentUser}
                onApplyForScheme={(schemeId) => handleStartApplicationForScheme(schemeId)}
              />
            )}

            {/* TAB: APPLICATIONS */}
            {activeTab === 'applications' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                      {currentUser.role === 'admin' ? 'Candidate Applications Registry' : 'My Applications'}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      {currentUser.role === 'admin'
                        ? 'Comprehensive registry of student applicants, academic performance transcripts, and income documentation.'
                        : 'Track review stages, document verification, and merit list results.'}
                    </p>
                  </div>

                  {currentUser.role === 'student' && (
                    <button
                      onClick={() => handleStartApplicationForScheme()}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                    >
                      New Application
                    </button>
                  )}
                </div>

                <ApplicationReviewTable
                  applications={
                    currentUser.role === 'admin'
                      ? applications
                      : applications.filter((a) => a.studentId === currentUser.id)
                  }
                  schemes={schemes}
                  onSelectApplication={(app) => {
                    if (currentUser.role === 'admin') {
                      setSelectedAppForReview(app);
                    }
                  }}
                  onPreviewDocument={(doc) =>
                    setInspectingDoc({
                      doc,
                      studentName: 'Candidate',
                    })
                  }
                  onViewAwardLetter={(app) => setAwardLetterApp(app)}
                />
              </div>
            )}

            {/* TAB: MERIT LIST */}
            {activeTab === 'merit-list' && (
              <MeritListGenerator
                schemes={schemes}
                applications={applications}
                onUpdateApplications={(updated) => {
                  saveApplications(updated);
                  setApplications(updated);
                }}
                onViewAwardLetter={(app) => setAwardLetterApp(app)}
                onSendNotifications={handleMeritListPublishedNotifications}
              />
            )}

            {/* TAB: REPORTS & ANALYTICS */}
            {activeTab === 'reports' && (
              <ReportsAndAnalytics
                applications={applications}
                schemes={schemes}
              />
            )}
          </>
        )}
      </main>

      {/* Document Inspector Modal */}
      {inspectingDoc && (
        <DocumentPreviewModal
          document={inspectingDoc.doc}
          studentName={inspectingDoc.studentName}
          studentRoll={inspectingDoc.studentRoll}
          isAdmin={currentUser.role === 'admin'}
          onClose={() => setInspectingDoc(null)}
          onUpdateVerification={(docId, status, remarks) => {
            handleUpdateDocumentVerification(docId, status, remarks);
          }}
        />
      )}

      {/* Printable Award Sanction Certificate Modal */}
      {awardLetterApp && (
        <AwardLetterModal
          application={awardLetterApp}
          scheme={
            schemes.find((s) => s.id === awardLetterApp.schemeId) || schemes[0]
          }
          onClose={() => setAwardLetterApp(null)}
        />
      )}

      {/* Admin Application Audit Drawer */}
      {selectedAppForReview && (
        <ApplicationDetailDrawer
          application={selectedAppForReview}
          scheme={schemes.find((s) => s.id === selectedAppForReview.schemeId)}
          onClose={() => setSelectedAppForReview(null)}
          onPreviewDocument={(doc) =>
            setInspectingDoc({
              doc,
              studentName: selectedAppForReview.studentName,
              studentRoll: selectedAppForReview.studentRoll,
            })
          }
          onUpdateStatus={handleUpdateApplicationStatus}
          onUpdateDocumentVerification={(appId, docId, status, remarks) => {
            handleUpdateDocumentVerification(docId, status, remarks);
          }}
          onViewAwardLetter={(app) => setAwardLetterApp(app)}
        />
      )}

      {/* Register New Student Account Modal */}
      {showRegisterStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Register New Student Applicant
              </h3>
              <button
                onClick={() => setShowRegisterStudentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterNewStudent} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Ramirez"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="maya@campus.edu"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Student Roll Number</label>
                  <input
                    type="text"
                    required
                    value={regForm.studentId}
                    onChange={(e) => setRegForm({ ...regForm, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={regForm.category}
                    onChange={(e) => setRegForm({ ...regForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="General">General</option>
                    <option value="EWS">EWS</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={regForm.gender}
                    onChange={(e) => setRegForm({ ...regForm, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Degree Program & Department</label>
                <input
                  type="text"
                  value={regForm.currentDegree}
                  onChange={(e) => setRegForm({ ...regForm, currentDegree: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterStudentModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Create & Login as Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SCHOLARSELECT</span>
            <span aria-hidden="true">·</span>
            <span>Scholarship Candidate Selection System</span>
            <span aria-hidden="true">·</span>
            <span>Academic Intake 2026</span>
          </div>
          <div className="text-slate-400">
            Transparent Criteria Engine · Verified Institutional Security
          </div>
        </div>
      </footer>
    </div>
  );
}
