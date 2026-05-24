import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LOAN_TYPES = [
  { id: 'home', name: 'હોમ લોન', icon: 'home', defaultRate: 8.5, defaultTenure: 240, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'gold', name: 'ગોલ્ડ લોન', icon: 'monetization_on', defaultRate: 10.0, defaultTenure: 12, color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'personal', name: 'પર્સનલ લોન', icon: 'person', defaultRate: 13.5, defaultTenure: 36, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'car', name: 'કાર / બાઈક લોન', icon: 'directions_car', defaultRate: 9.0, defaultTenure: 60, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
];

const InterestCalculator = () => {
  const navigate = useNavigate();

  // Input States
  const [loanType, setLoanType] = useState(LOAN_TYPES[0]);
  const [amount, setAmount] = useState(1000000); // 10 Lakh default
  const [rate, setRate] = useState(8.5); // 8.5% default
  const [tenure, setTenure] = useState(240); // 20 years (240 months) default
  const [tenureType, setTenureType] = useState('months'); // 'months' or 'years'

  // Result States
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  // Handle preset clicks
  const selectLoanType = (type) => {
    setLoanType(type);
    setRate(type.defaultRate);
    setTenureType('months');
    setTenure(type.defaultTenure);
  };

  // Calculations
  useEffect(() => {
    calculateEMI();
  }, [amount, rate, tenure, tenureType]);

  const calculateEMI = () => {
    const P = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const time = parseFloat(tenure);

    if (!P || !annualRate || !time || P <= 0 || annualRate <= 0 || time <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayment(0);
      return;
    }

    const n = tenureType === 'years' ? time * 12 : time; // Total months
    const r = annualRate / 12 / 100; // Monthly interest rate

    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emiCalc = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    const totalPay = emiCalc * n;
    const totalInt = totalPay - P;

    setEmi(Math.round(emiCalc));
    setTotalInterest(Math.round(totalInt));
    setTotalPayment(Math.round(totalPay));
  };

  // Format currency
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Chart Percentages
  const principalPercent = totalPayment > 0 ? (amount / totalPayment) * 100 : 100;
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-body min-h-[85vh] animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-stone-200/50 mb-8">
        <button onClick={() => navigate('/tools')} className="h-10 w-10 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-50 transition active:scale-95 shadow-sm">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h1 className="font-headline font-black text-3xl text-stone-900 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">calculate</span>
            વ્યાજ કેલ્ક્યુલેટર
          </h1>
          <p className="text-stone-500 font-gujarati text-sm mt-1">
            લોનનો હપ્તો, કુલ વ્યાજ અને ચૂકવવાપાત્ર રકમની સચોટ ગણતરી.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Loan Presets */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-gujarati font-bold text-sm text-stone-500 uppercase tracking-widest">૧. લોનનો પ્રકાર પસંદ કરો</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LOAN_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => selectLoanType(type)}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${loanType.id === type.id ? type.color + ' shadow-md scale-105' : 'bg-stone-50 text-stone-600 border-stone-100 hover:border-stone-200 hover:bg-stone-100'}`}
                >
                  <span className="material-symbols-outlined text-2xl">{type.icon}</span>
                  <span className="font-gujarati font-black text-xs text-center">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8">
            <h3 className="font-gujarati font-bold text-sm text-stone-500 uppercase tracking-widest mb-2">૨. લોનની વિગતો દાખલ કરો</h3>
            
            {/* Principal Amount */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="font-gujarati font-black text-lg text-stone-800">મુદ્દલ (લોનની રકમ)</label>
                <div className="relative w-48">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-500">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-headline font-black text-xl text-right focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
              <input
                type="range"
                min="10000"
                max="20000000"
                step="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs font-bold text-stone-400">
                <span>₹10,000</span>
                <span>₹2 કરોડ</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex justify-between items-end">
                <label className="font-gujarati font-black text-lg text-stone-800">વ્યાજ દર (વાર્ષિક)</label>
                <div className="relative w-32">
                  <input
                    type="number"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full pl-4 pr-8 py-3 bg-stone-50 border border-stone-200 rounded-xl font-headline font-black text-xl text-right focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs font-bold text-stone-400">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <label className="font-gujarati font-black text-lg text-stone-800">લોનનો સમયગાળો</label>
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className="flex-1 sm:w-24 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-headline font-black text-xl text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <div className="flex bg-stone-100 p-1 rounded-xl">
                    <button
                      onClick={() => {
                        if (tenureType === 'years') {
                          setTenureType('months');
                          setTenure(tenure * 12);
                        }
                      }}
                      className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${tenureType === 'months' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
                    >
                      મહિના
                    </button>
                    <button
                      onClick={() => {
                        if (tenureType === 'months') {
                          setTenureType('years');
                          setTenure(Math.ceil(tenure / 12));
                        }
                      }}
                      className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${tenureType === 'years' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
                    >
                      વર્ષ
                    </button>
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max={tenureType === 'months' ? 360 : 30}
                step="1"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs font-bold text-stone-400">
                <span>1 {tenureType === 'months' ? 'મહિનો' : 'વર્ષ'}</span>
                <span>{tenureType === 'months' ? 360 : 30} {tenureType === 'months' ? 'મહિના' : 'વર્ષ'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Results & Visualization */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-5">
              <span className="material-symbols-outlined text-[150px]">account_balance</span>
            </div>
            
            <h3 className="font-gujarati font-bold text-stone-400 uppercase tracking-widest text-xs mb-6 relative z-10">લોન ગણતરીનું પરિણામ</h3>
            
            <div className="space-y-6 relative z-10">
              
              {/* EMI Box */}
              <div className="bg-white/10 border border-white/20 p-6 rounded-3xl text-center shadow-inner backdrop-blur-sm">
                <span className="block font-gujarati text-stone-300 mb-1">તમારો માસિક હપ્તો (EMI)</span>
                <span className="font-headline font-black text-4xl sm:text-5xl text-amber-400 drop-shadow-md">
                  {formatINR(emi)}
                </span>
                <span className="block text-[10px] text-stone-400 uppercase tracking-widest mt-2 font-bold">દર મહિને ચૂકવવાની રકમ</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="block font-gujarati text-xs text-stone-400 mb-1">કુલ મુદ્દલ રકમ</span>
                  <span className="font-headline font-black text-xl">{formatINR(amount || 0)}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 border-b-2 border-b-red-400/50">
                  <span className="block font-gujarati text-xs text-stone-400 mb-1">તમે ભરનાર વધારાનું વ્યાજ</span>
                  <span className="font-headline font-black text-xl text-red-300">{formatINR(totalInterest)}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 p-5 rounded-2xl border border-emerald-500/30">
                <span className="block font-gujarati text-sm text-stone-300 mb-1">કુલ ચૂકવવાપાત્ર રકમ (મુદ્દલ + વ્યાજ)</span>
                <span className="font-headline font-black text-2xl text-emerald-300">{formatINR(totalPayment)}</span>
              </div>

            </div>
          </div>

          {/* Chart Visualization */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="font-gujarati font-black text-lg text-stone-800 mb-6 text-center">મુદ્દલ અને વ્યાજનો તફાવત</h3>
            
            {/* Visual Progress Bar Chart */}
            <div className="h-12 w-full flex rounded-full overflow-hidden shadow-inner bg-stone-100">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000 flex items-center justify-center relative group" 
                style={{ width: `${principalPercent}%` }}
              >
                {principalPercent > 10 && <span className="font-bold text-white text-xs whitespace-nowrap">મુદ્દલ {principalPercent.toFixed(1)}%</span>}
              </div>
              <div 
                className="h-full bg-red-400 transition-all duration-1000 flex items-center justify-center relative group" 
                style={{ width: `${interestPercent}%` }}
              >
                {interestPercent > 10 && <span className="font-bold text-white text-xs whitespace-nowrap">વ્યાજ {interestPercent.toFixed(1)}%</span>}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 text-sm font-bold font-gujarati">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-stone-600">મુદ્દલ રકમ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-stone-600">વધારાનું વ્યાજ (Extra)</span>
              </div>
            </div>

            <p className="mt-6 text-xs text-stone-500 font-gujarati leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100">
              <strong className="text-stone-800">સમજૂતી:</strong> જો તમે <strong>{formatINR(amount || 0)}</strong> ની લોન <strong>{rate}%</strong> ના વાર્ષિક વ્યાજે <strong>{tenure} {tenureType === 'months' ? 'મહિના' : 'વર્ષ'}</strong> માટે લો છો, 
              તો તમારે દર મહિને <strong>{formatINR(emi)}</strong> નો હપ્તો ભરવો પડશે. 
              આખી લોન પૂરી થતાં સુધીમાં તમે બેંકને મુદ્દલ ઉપરાંત <strong>{formatINR(totalInterest)}</strong> માત્ર વ્યાજ પેટે જમા કરાવશો.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default InterestCalculator;
