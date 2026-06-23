import React from 'react';

const PaymentSection = ({ vcard, primaryColor }) => {
  if (!vcard.upiId && !vcard.bankAccount) return null;
  
  return (
    <div className="w-full mt-12 mb-8 text-left">
      <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2" style={{ color: primaryColor }}>
        <span className="material-symbols-outlined">account_balance</span>
        Payment Details
      </h3>
      
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-6 relative overflow-hidden">
        {/* UPI Details */}
        {(vcard.upiId || vcard.upi_qr) && (
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b border-slate-100 pb-6">
            {vcard.upi_qr && (
              <div className="shrink-0">
                <img src={vcard.upi_qr} alt="UPI QR Code" className="w-32 h-32 object-cover rounded-2xl border border-slate-200 p-1 bg-white" />
              </div>
            )}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Scan & Pay via UPI</h4>
              {vcard.upiName && <p className="font-black text-lg text-slate-800">{vcard.upiName}</p>}
              {vcard.upiId && <p className="font-medium text-slate-600 font-sans">{vcard.upiId}</p>}
              {vcard.upiId && (
                <a 
                  href={`upi://pay?pa=${vcard.upiId}&pn=${encodeURIComponent(vcard.upiName || 'Payment')}`}
                  className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  Pay Now
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* Bank Details */}
        {(vcard.bankAccount || vcard.bankName) && (
          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest text-center sm:text-left">Bank Transfer</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vcard.bankName && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Bank Name</p>
                  <p className="font-bold text-slate-800">{vcard.bankName}</p>
                </div>
              )}
              {vcard.bankAccount && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Account Number</p>
                  <p className="font-bold text-slate-800 font-sans">{vcard.bankAccount}</p>
                </div>
              )}
              {vcard.bankIfsc && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">IFSC Code</p>
                  <p className="font-bold text-slate-800 font-sans uppercase">{vcard.bankIfsc}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSection;
