import React, { useState } from "react";

const AdditionalInfoForm = ({ role, subRole, onBack, onContinue, onSkip }) => {
  const [residenceCountry, setResidenceCountry] = useState("");
  const [orgName, setOrgName] = useState("");
  const [idDoc, setIdDoc] = useState(null);
  const [proofRes, setProofRes] = useState(null);
  const [bizReg, setBizReg] = useState(null);

  return (
    <div className="w-full max-w-[560px]">
      <button onClick={onBack} className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg py-1.5 px-2.75 text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-4.5">
        ← Back
      </button>

      <div className="text-xl font-bold text-[#111827] mb-1">Additional Details</div>
      <div className="text-sm text-[#6B7280] mb-5.5">Help us verify your account faster and match you with the right opportunities.</div>

      <div className="mb-5">
        <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider pb-2 border-b border-[#E5E7EB] mb-3">Location</div>
        <div className="mb-2.5">
          <label className="block text-sm font-medium text-[#111827] mb-1">Country of Residence</label>
          <input type="text" value={residenceCountry} onChange={(e) => setResidenceCountry(e.target.value)} placeholder="🔍  Search your country..." className="w-full py-2.5 px-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]" />
        </div>
      </div>

      {role === "provider" && subRole === "office" && (
        <div className="mb-5">
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider pb-2 border-b border-[#E5E7EB] mb-3">Organization</div>
          <div className="mb-2.5">
            <label className="block text-sm font-medium text-[#111827] mb-1">Organization / Company Name</label>
            <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Official registered name" className="w-full py-2.5 px-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]" />
          </div>
        </div>
      )}

      <div className="mb-5">
        <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider pb-2 border-b border-[#E5E7EB] mb-3 flex items-center gap-1.5">
          Identity Verification <span className="font-normal text-[#9CA3AF] text-xs uppercase tracking-normal">— PDF, JPG, PNG · max 5MB</span>
        </div>
        
        <div className="border-1.5 border-dashed border-[#E5E7EB] rounded-xl p-4 text-center cursor-pointer bg-[#F9FAFB] relative mb-2.25 hover:bg-[#F3F4F6]">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setIdDoc(e.target.files[0])} />
          <div className="text-2xl mb-1">🪪</div>
          <div className="text-sm text-[#6B7280]"><span className="text-[#024CEE] font-medium">Upload Passport or National ID</span></div>
          {idDoc && <div className="text-xs text-[#16A34A] mt-1">✓ {idDoc.name}</div>}
        </div>

        {role === "provider" && subRole === "office" && (
          <>
            <div className="border-1.5 border-dashed border-[#E5E7EB] rounded-xl p-4 text-center cursor-pointer bg-[#F9FAFB] relative mb-2.25 hover:bg-[#F3F4F6]">
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setProofRes(e.target.files[0])} />
              <div className="text-2xl mb-1">🏠</div>
              <div className="text-sm text-[#6B7280]"><span className="text-[#024CEE] font-medium">Proof of Residence</span></div>
              {proofRes && <div className="text-xs text-[#16A34A] mt-1">✓ {proofRes.name}</div>}
            </div>
            <div className="border-1.5 border-dashed border-[#E5E7EB] rounded-xl p-4 text-center cursor-pointer bg-[#F9FAFB] relative hover:bg-[#F3F4F6]">
              <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setBizReg(e.target.files[0])} />
              <div className="text-2xl mb-1">📋</div>
              <div className="text-sm text-[#6B7280]"><span className="text-[#024CEE] font-medium">Business Registration</span> (PDF)</div>
              {bizReg && <div className="text-xs text-[#16A34A] mt-1">✓ {bizReg.name}</div>}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={onContinue} className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc]">
          Submit & Verify Email →
        </button>
        <button onClick={onSkip} className="w-full py-2.75 rounded-xl border border-[#E5E7EB] text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7]">
          Skip for now — verify my email
        </button>
      </div>
    </div>
  );
};

export default AdditionalInfoForm;