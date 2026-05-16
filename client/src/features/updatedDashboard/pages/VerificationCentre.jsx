import React, { useState } from "react";
import { 
  AlertCircle, Search, User, Building2, LayoutGrid, Award, 
  CheckCircle, XCircle, Clock, Upload, FileText, Shield, 
  HelpCircle, ChevronRight, ChevronDown, ExternalLink
} from "lucide-react";

const verificationData = {
  profileProgress: 75,
  categoriesProgress: 50,
  badgesEarned: 2,
  alert: {
    show: true,
    message: "Action required: 1 document rejected — Proof of Residence expired. Profile hidden until resolved.",
    action: "Fix now"
  }
};

const documents = {
  identity: [
    { id: "personal-id", title: "Personal Identification", subtitle: "Passport or National ID • Freelancer & Company", status: "verified", fileName: "passport_2024.pdf", required: true },
    { id: "residence", title: "Proof of Residence", subtitle: "Utility bill or bank statement (last 3 months)", status: "rejected", reason: "document expired", required: true },
  ],
  business: [
    { id: "business-reg", title: "Business Registration", subtitle: "Official commercial license • Company only", status: "pending", fileName: "business_reg.pdf", required: true },
    { id: "freelance", title: "Freelance License", subtitle: "Valid professional permit • Freelancer only", status: "not-uploaded", required: false },
  ]
};

const categories = [
  { id: "german", name: "German Language", status: "active", subs: ["General German A1–C2", "Exam Prep Goethe", "Business German", "Online Courses"] },
  { id: "coaching", name: "Career Coaching", status: "pending", subs: ["CV & Cover Letter", "LinkedIn Optimization", "Job Interview Prep"] },
  { id: "translation", name: "Translation Services", status: "active", subs: ["Sworn Translation", "Legal Translation", "Document Translation"] },
];

const badges = [
  { id: 1, name: "Identity Verified", desc: "Your identity has been verified", status: "earned", icon: "🛡️" },
  { id: 2, name: "Professional", desc: "Completed professional verification", status: "earned", icon: "⭐" },
  { id: 3, name: "Top Rated", desc: "Maintain 4.8+ rating for 30 days", status: "upload", icon: "🏆" },
  { id: 4, name: "Quick Responder", desc: "Respond to 95% of inquiries within 2h", status: "locked", icon: "⚡" },
];

export default function VerificationCentre() {
  const [activeTab, setActiveTab] = useState("profile");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "verified": return { bg: "rgba(5,150,105,0.10)", color: "#059669", icon: CheckCircle };
      case "rejected": return { bg: "rgba(220,38,38,0.10)", color: "#DC2626", icon: XCircle };
      case "pending": return { bg: "rgba(2,76,238,0.08)", color: "#024CEE", icon: Clock };
      case "not-uploaded": return { bg: "rgba(107,114,128,0.08)", color: "#6b7280", icon: Clock };
      case "earned": return { bg: "rgba(5,150,105,0.10)", color: "#059669" };
      case "upload": return { bg: "rgba(2,76,238,0.08)", color: "#024CEE" };
      case "locked": return { bg: "rgba(107,114,128,0.10)", color: "#6b7280" };
      default: return { bg: "rgba(107,114,128,0.08)", color: "#6b7280" };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "verified": return "Verified";
      case "rejected": return "Rejected";
      case "pending": return "Under review";
      case "not-uploaded": return "Not uploaded";
      default: return status;
    }
  };

  const TabIcon = activeTab === "profile" ? User : activeTab === "categories" ? LayoutGrid : Award;

  return (
    <div style={{ animation: "fadeUp 0.3s ease both" }}>
      {/* Alert Banner */}
      {verificationData.alert.show && (
        <div className="vc-alert" style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.20)",
          borderRadius: "10px", padding: "11px 14px", marginBottom: "20px"
        }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "7px", 
            background: "rgba(220,38,38,0.10)", display: "flex", 
            alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <AlertCircle size={14} color="#DC2626" />
          </div>
          <div style={{ flex: 1, fontSize: "12.5px", color: "#DC2626" }}>
            <strong style={{ fontWeight: 600 }}>Action required:</strong> {verificationData.alert.message}
          </div>
          <button style={{
            fontSize: "11.5px", fontWeight: 600, color: "#DC2626",
            cursor: "pointer", border: "1px solid rgba(220,38,38,0.25)",
            padding: "5px 12px", borderRadius: "6px", whiteSpace: "nowrap",
            background: "transparent", transition: "background 0.13s"
          }}>
            {verificationData.alert.action} →
          </button>
        </div>
      )}

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: "7px", background: "#f7f9ff",
        border: "1px solid rgba(2,76,238,0.10)", borderRadius: "8px", 
        padding: "8px 13px", marginBottom: "16px", maxWidth: "100%"
      }}>
        <Search size={13} color="#6b7280" />
        <input 
          type="text" 
          placeholder="Search documents, categories, badges…" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: "none", background: "transparent", fontSize: "13px", 
            fontFamily: "'Outfit', sans-serif", color: "#0a0f1e", width: "100%", 
            outline: "none"
          }}
        />
      </div>

      {/* Progress Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        <div style={{
          background: "#fff", border: "1px solid rgba(2,76,238,0.10)", 
          borderRadius: "12px", padding: "14px 16px", display: "flex", 
          flexDirection: "column", gap: "8px", cursor: "pointer",
          borderColor: activeTab === "profile" ? "#024CEE" : "rgba(2,76,238,0.10)",
          boxShadow: activeTab === "profile" ? "0 0 0 3px rgba(2,76,238,0.07)" : "none"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(2,76,238,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={14} color="#024CEE" />
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#0a0f1e", flex: 1 }}>Profile</span>
            <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: "99px", background: "rgba(217,119,6,0.1)", color: "#D97706" }}>1 issue</span>
          </div>
          <div style={{ height: "5px", background: "rgba(2,76,238,0.07)", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "75%", borderRadius: "99px", background: "linear-gradient(90deg,#024CEE,#49B7DF)" }}></div>
          </div>
          <span style={{ fontSize: "10.5px", color: "#6b7280" }}>75% complete</span>
        </div>

        <div style={{
          background: "#fff", border: "1px solid rgba(2,76,238,0.10)", 
          borderRadius: "12px", padding: "14px 16px", display: "flex", 
          flexDirection: "column", gap: "8px", cursor: "pointer",
          borderColor: activeTab === "categories" ? "#024CEE" : "rgba(2,76,238,0.10)",
          boxShadow: activeTab === "categories" ? "0 0 0 3px rgba(2,76,238,0.07)" : "none"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(2,76,238,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LayoutGrid size={14} color="#024CEE" />
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#0a0f1e", flex: 1 }}>Categories</span>
            <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: "99px", background: "rgba(217,119,6,0.1)", color: "#D97706" }}>Pending</span>
          </div>
          <div style={{ height: "5px", background: "rgba(2,76,238,0.07)", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "50%", borderRadius: "99px", background: "linear-gradient(90deg,#024CEE,#49B7DF)" }}></div>
          </div>
          <span style={{ fontSize: "10.5px", color: "#6b7280" }}>2 of 8 approved</span>
        </div>

        <div style={{
          background: "#fff", border: "1px solid rgba(2,76,238,0.10)", 
          borderRadius: "12px", padding: "14px 16px", display: "flex", 
          flexDirection: "column", gap: "8px", cursor: "pointer",
          borderColor: activeTab === "badges" ? "#024CEE" : "rgba(2,76,238,0.10)",
          boxShadow: activeTab === "badges" ? "0 0 0 3px rgba(2,76,238,0.07)" : "none"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(2,76,238,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={14} color="#024CEE" />
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#0a0f1e", flex: 1 }}>Badges</span>
            <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: "99px", background: "rgba(5,150,105,0.1)", color: "#059669" }}>2 Earned</span>
          </div>
          <div style={{ height: "5px", background: "rgba(2,76,238,0.07)", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "25%", borderRadius: "99px", background: "linear-gradient(90deg,#024CEE,#49B7DF)" }}></div>
          </div>
          <span style={{ fontSize: "10.5px", color: "#6b7280" }}>2 of 8 badges</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="vc-tabs" style={{
        display: "flex", gap: "2px", background: "rgba(2,76,238,0.07)", 
        borderRadius: "10px", padding: "3px", marginBottom: "18px"
      }}>
        {[
          { id: "profile", label: "Profile Verification", icon: User, badge: "1 issue", badgeType: "warn" },
          { id: "categories", label: "Categories", icon: LayoutGrid, badge: "Pending", badgeType: "warn" },
          { id: "badges", label: "Badges", icon: Award, badge: "2 Earned", badgeType: "ok" }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: "8px 12px", borderRadius: "8px", fontSize: "12.5px", 
                fontWeight: 500, color: isActive ? "#024CEE" : "#6b7280", cursor: "pointer",
                textAlign: "center", transition: "all 0.18s", display: "flex", 
                alignItems: "center", justifyContent: "center", gap: "6px", userSelect: "none",
                background: isActive ? "#fff" : "transparent",
                boxShadow: isActive ? "0 1px 6px rgba(2,76,238,0.10)" : "none",
                fontWeight: isActive ? 600 : 500
              }}
            >
              <Icon size={13} />
              {tab.label}
              <span style={{
                fontSize: "9.5px", padding: "2px 6px", borderRadius: "99px",
                background: tab.badgeType === "warn" ? "rgba(217,119,6,0.12)" : "rgba(5,150,105,0.12)",
                color: tab.badgeType === "warn" ? "#D97706" : "#059669"
              }}>{tab.badge}</span>
            </div>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{ animation: "fadeUp 0.25s ease both" }}>
        
        {/* Profile Verification Tab */}
        {activeTab === "profile" && (
          <div>
            <div style={{
              display: "flex", alignItems: "flex-start", gap: "9px", background: "#f7f9ff",
              border: "1px solid rgba(2,76,238,0.10)", borderRadius: "9px", 
              padding: "11px 13px", marginBottom: "14px", fontSize: "12px", color: "#6b7280"
            }}>
              <HelpCircle size={13} color="#024CEE" style={{ flexShrink: 0, marginTop: "1px" }} />
              <span>Accepted formats: <strong style={{ color: "#0a0f1e", margin: "0 3px" }}>PDF · JPG · PNG</strong> · Max 5 MB · English, German, or Arabic only</span>
            </div>

            {/* Identity Documents Section */}
            <div style={{ background: "#fff", border: "1px solid rgba(2,76,238,0.10)", borderRadius: "12px", marginBottom: "12px", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderBottom: "1px solid rgba(2,76,238,0.10)" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(220,38,38,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={15} color="#DC2626" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0a0f1e" }}>Identity Documents</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>Government ID, Proof of Residence</div>
                </div>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {documents.identity.map((doc) => {
                    const status = getStatusColor(doc.status);
                    const StatusIcon = status.icon;
                    return (
                      <div key={doc.id} style={{
                        border: `1px solid ${doc.status === "verified" ? "rgba(5,150,105,0.20)" : doc.status === "rejected" ? "rgba(220,38,38,0.25)" : "rgba(2,76,238,0.10)"}`,
                        borderRadius: "10px", padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: "10px",
                        background: doc.status === "verified" ? "rgba(5,150,105,0.01)" : doc.status === "rejected" ? "rgba(220,38,38,0.02)" : "transparent",
                        transition: "all 0.15s", cursor: "pointer"
                      }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: status.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FileText size={15} color={status.color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#0a0f1e" }}>
                            {doc.title} {!doc.required && <span style={{ color: "#6b7280", fontSize: "10.5px" }}>(Optional)</span>}
                          </div>
                          <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>{doc.subtitle}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10.5px", fontWeight: 600, marginTop: "5px", color: status.color }}>
                            <StatusIcon size={11} />
                            {getStatusLabel(doc.status)}
                            {doc.status === "rejected" && ` — ${doc.reason}`}
                          </div>
                          {doc.fileName && (
                            <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "#f7f9ff", border: "1px solid rgba(2,76,238,0.10)", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", color: "#0a0f1e", maxWidth: "140px", overflow: "hidden" }}>
                                <FileText size={10} color="#6b7280" />
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.fileName}</span>
                              </div>
                              <button style={{ fontSize: "11px", fontWeight: 600, padding: "5px 10px", borderRadius: "6px", cursor: "pointer", border: "1px solid rgba(2,76,238,0.10)", background: "#fff", color: "#024CEE" }}>Replace</button>
                            </div>
                          )}
                          {!doc.fileName && (
                            <div style={{ marginTop: "8px" }}>
                              <button style={{ fontSize: "11px", fontWeight: 600, padding: "5px 10px", borderRadius: "6px", cursor: "pointer", border: "none", background: "#024CEE", color: "#fff", display: "flex", alignItems: "center", gap: "4px" }}>
                                <Upload size={11} /> Upload
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Business Registration Section */}
            <div style={{ background: "#fff", border: "1px solid rgba(2,76,238,0.10)", borderRadius: "12px", marginBottom: "12px", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderBottom: "1px solid rgba(2,76,238,0.10)" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(2,76,238,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Building2 size={15} color="#024CEE" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0a0f1e" }}>Business Registration</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>Commercial license, Freelance permit, or School registration</div>
                </div>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {documents.business.map((doc) => {
                    const status = getStatusColor(doc.status);
                    const StatusIcon = status.icon;
                    return (
                      <div key={doc.id} style={{
                        border: "1px solid rgba(2,76,238,0.10)",
                        borderRadius: "10px", padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: "10px",
                        transition: "all 0.15s", cursor: "pointer"
                      }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: status.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FileText size={15} color={status.color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#0a0f1e" }}>
                            {doc.title} {!doc.required && <span style={{ color: "#6b7280", fontSize: "10.5px" }}>(Optional)</span>}
                          </div>
                          <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>{doc.subtitle}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10.5px", fontWeight: 600, marginTop: "5px", color: status.color }}>
                            <StatusIcon size={11} />
                            {getStatusLabel(doc.status)}
                          </div>
                          {doc.fileName && (
                            <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "#f7f9ff", border: "1px solid rgba(2,76,238,0.10)", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", color: "#0a0f1e", maxWidth: "140px", overflow: "hidden" }}>
                                <FileText size={10} color="#6b7280" />
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.fileName}</span>
                              </div>
                            </div>
                          )}
                          {!doc.fileName && (
                            <div style={{ marginTop: "8px" }}>
                              <button style={{ fontSize: "11px", fontWeight: 600, padding: "5px 10px", borderRadius: "6px", cursor: "pointer", border: "none", background: "#024CEE", color: "#fff", display: "flex", alignItems: "center", gap: "4px" }}>
                                <Upload size={11} /> Upload
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <div style={{
              display: "flex", alignItems: "flex-start", gap: "9px", background: "#f7f9ff",
              border: "1px solid rgba(2,76,238,0.10)", borderRadius: "9px", 
              padding: "11px 13px", marginBottom: "14px", fontSize: "12px", color: "#6b7280"
            }}>
              <HelpCircle size={13} color="#024CEE" style={{ flexShrink: 0, marginTop: "1px" }} />
              <span>Select the service categories you operate in. Each category requires admin approval before you can publish services in it.</span>
            </div>

            {/* My Service Categories */}
            <div style={{ background: "#fff", border: "1px solid rgba(2,76,238,0.10)", borderRadius: "12px", marginBottom: "12px", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderBottom: "1px solid rgba(2,76,238,0.10)" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(2,76,238,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LayoutGrid size={15} color="#024CEE" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0a0f1e" }}>My Service Categories</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>Active and pending categories</div>
                </div>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {categories.map((cat) => {
                    const isActive = cat.status === "active";
                    return (
                      <div key={cat.id} style={{
                        border: "1px solid rgba(2,76,238,0.10)", borderRadius: "10px", 
                        padding: "13px 14px", transition: "all 0.15s", cursor: "pointer",
                        borderColor: "#024CEE", background: "rgba(2,76,238,0.02)"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "8px" }}>
                          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: isActive ? "rgba(5,150,105,0.10)" : "rgba(217,119,6,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <LayoutGrid size={14} color={isActive ? "#059669" : "#D97706"} />
                          </div>
                          <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#0a0f1e", flex: 1 }}>{cat.name}</span>
                          <span style={{ 
                            fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: "99px",
                            background: isActive ? "rgba(5,150,105,0.1)" : "rgba(217,119,6,0.1)", 
                            color: isActive ? "#059669" : "#D97706"
                          }}>{isActive ? "Active" : "Pending"}</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {cat.subs.map((sub, idx) => (
                            <span key={idx} style={{
                              fontSize: "10.5px", padding: "2px 7px", borderRadius: "5px",
                              background: isActive ? "rgba(5,150,105,0.08)" : "rgba(217,119,6,0.08)",
                              color: isActive ? "#059669" : "#D97706"
                            }}>{sub}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {/* Add Category Card */}
                  <div style={{
                    border: "2px dashed rgba(2,76,238,0.20)", borderRadius: "10px",
                    padding: "20px", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "8px",
                    cursor: "pointer"
                  }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(2,76,238,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Upload size={14} color="#024CEE" />
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#024CEE" }}>Add Category</div>
                    <div style={{ fontSize: "11px", color: "#6b7280", textAlign: "center" }}>Request access to a new service category</div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Available Categories */}
            <div style={{ background: "#fff", border: "1px solid rgba(2,76,238,0.10)", borderRadius: "12px", marginBottom: "12px", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderBottom: "1px solid rgba(2,76,238,0.10)" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(107,114,128,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LayoutGrid size={15} color="#6b7280" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0a0f1e" }}>All Available Categories</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>8 main categories on Germany Assists</div>
                </div>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {[
                    { name: "German Language", type: "Freelancer / School", status: "active", color: "#059669" },
                    { name: "Career Coaching", type: "Freelancer / Company", status: "pending", color: "#D97706" },
                    { name: "Translation Services", type: "Freelancer / Company", status: "active", color: "#059669" },
                    { name: "Certificate Recognition", type: "Company only", status: "inactive", color: "#6b7280" },
                    { name: "Visa & Immigration", type: "Freelancer / Company", status: "inactive", color: "#6b7280" },
                    { name: "Recruitment Services", type: "Company / Freelancer", status: "inactive", color: "#6b7280" },
                  ].map((cat, idx) => (
                    <div key={idx} style={{
                      display: "flex", alignItems: "center", gap: "10px", 
                      padding: "9px 12px", border: "1px solid rgba(2,76,238,0.10)", 
                      borderRadius: "9px"
                    }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: cat.color, flexShrink: 0 }}></div>
                      <div style={{ flex: 1, fontSize: "12.5px", fontWeight: 500, color: "#0a0f1e" }}>{cat.name}</div>
                      <div style={{ fontSize: "11px", color: "#6b7280" }}>{cat.type}</div>
                      {cat.status === "active" && (
                        <span style={{ fontSize: "10.5px", fontWeight: 600, padding: "2px 8px", borderRadius: "5px", background: "rgba(5,150,105,0.08)", color: "#059669" }}>Active</span>
                      )}
                      {cat.status === "pending" && (
                        <span style={{ fontSize: "10.5px", fontWeight: 600, padding: "2px 8px", borderRadius: "5px", background: "rgba(217,119,6,0.08)", color: "#D97706" }}>Pending</span>
                      )}
                      {cat.status === "inactive" && (
                        <button style={{ fontSize: "10.5px", fontWeight: 600, padding: "3px 9px", borderRadius: "5px", background: "rgba(2,76,238,0.07)", color: "#024CEE", border: "none", cursor: "pointer" }}>Request</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === "badges" && (
          <div>
            {/* Badge Category Filter */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
              {["All", "Verification", "Performance", "Engagement"].map((cat, idx) => (
                <button key={idx} style={{
                  fontSize: "11.5px", fontWeight: 500, padding: "5px 11px", borderRadius: "7px",
                  border: "1px solid rgba(2,76,238,0.10)", background: idx === 0 ? "#024CEE" : "#fff",
                  color: idx === 0 ? "#fff" : "#6b7280", cursor: "pointer",
                  transition: "all 0.13s"
                }}>{cat}</button>
              ))}
            </div>

            {/* Badge Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {badges.map((badge) => {
                const isEarned = badge.status === "earned";
                const isLocked = badge.status === "locked";
                return (
                  <div key={badge.id} style={{
                    border: `1px solid ${isEarned ? "rgba(5,150,105,0.25)" : "rgba(2,76,238,0.10)"}`,
                    borderRadius: "10px", padding: "13px 14px", transition: "all 0.15s",
                    position: "relative", opacity: isLocked ? 0.6 : 1,
                    background: isEarned ? "rgba(5,150,105,0.02)" : "transparent"
                  }}>
                    {isEarned && (
                      <div style={{
                        position: "absolute", top: "10px", right: "10px", width: "18px", height: "18px",
                        borderRadius: "50%", background: "#059669", display: "flex", 
                        alignItems: "center", justifyContent: "center"
                      }}>
                        <CheckCircle size={10} color="#fff" />
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(2,76,238,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                        {badge.icon}
                      </div>
                      <span style={{
                        fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: "99px",
                        background: isEarned ? "rgba(5,150,105,0.10)" : isLocked ? "rgba(107,114,128,0.10)" : "rgba(2,76,238,0.08)",
                        color: isEarned ? "#059669" : isLocked ? "#6b7280" : "#024CEE"
                      }}>
                        {isEarned ? "Earned" : isLocked ? "Locked" : "Upload"}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#0a0f1e", marginBottom: "2px" }}>{badge.name}</div>
                    <div style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.4 }}>{badge.desc}</div>
                    {!isEarned && !isLocked && (
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "#024CEE", cursor: "pointer", marginTop: "7px", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                        Upload <ExternalLink size={11} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}