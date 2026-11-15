import { Activity, HeartHandshake, ShieldCheck } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-6">
        <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full">
          <HeartHandshake className="w-12 h-12" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Medora</h1>
          <p className="text-sm text-slate-600">
            Elderly Care & Medication Management Platform
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-100/60 py-2 px-3 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>Foundation Ready</span>
        </div>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-left text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700 block">Frontend</span>
            React + Vite + Tailwind
          </div>
          <div>
            <span className="font-semibold text-slate-700 block">Backend</span>
            Node.js + Express
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
