'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Mail, Lock, Loader } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      // Demo: skip auth, go straight to dashboard
      await new Promise(r => setTimeout(r, 800));
      router.push('/dashboard');
    } catch {
      setError('Invalid credentials. Try demo@medsim.io / password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#020817', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(56,189,248,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.025) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:400, padding:'0 24px' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:48, height:48, borderRadius:12, background:'linear-gradient(135deg,#38BDF8,#818CF8)', marginBottom:16 }}>
            <Activity size={22} color="white" />
          </div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#E2E8F0', margin:'0 0 6px', letterSpacing:'-0.5px' }}>MedSim Global</h1>
          <p style={{ color:'#64748B', fontSize:14, margin:0 }}>Sign in to your simulation account</p>
        </div>

        <GlassCard glow>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {error && <div style={{ padding:'10px 12px', background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:8, fontSize:13, color:'#F87171' }}>{error}</div>}

            <div>
              <label style={{ fontSize:12, color:'#64748B', display:'block', marginBottom:6 }}>Email</label>
              <div style={{ position:'relative' }}>
                <Mail size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#64748B' }} />
                <input type="email" required value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="demo@medsim.io"
                  style={{ width:'100%', padding:'10px 12px 10px 36px', background:'rgba(56,189,248,0.05)', border:'1px solid rgba(56,189,248,0.15)', borderRadius:8, color:'#E2E8F0', fontSize:14, outline:'none', boxSizing:'border-box' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize:12, color:'#64748B', display:'block', marginBottom:6 }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#64748B' }} />
                <input type="password" required value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••"
                  style={{ width:'100%', padding:'10px 12px 10px 36px', background:'rgba(56,189,248,0.05)', border:'1px solid rgba(56,189,248,0.15)', borderRadius:8, color:'#E2E8F0', fontSize:14, outline:'none', boxSizing:'border-box' }} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px', background:'linear-gradient(135deg,#38BDF8,#818CF8)', border:'none', borderRadius:10, color:'white', fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1 }}>
              {loading ? <><Loader size={14} style={{ animation:'spin 1s linear infinite' }} /> Signing in…</> : 'Sign In'}
            </button>

            <div style={{ textAlign:'center', fontSize:13, color:'#64748B' }}>
              No account?{' '}
              <span onClick={() => router.push('/auth/signup')} style={{ color:'#38BDF8', cursor:'pointer', fontWeight:600 }}>Sign up free</span>
            </div>

            <div style={{ padding:'10px', background:'rgba(56,189,248,0.05)', borderRadius:8, fontSize:11, color:'#64748B', textAlign:'center' }}>
              Demo: any email + any password → dashboard
            </div>
          </form>
        </GlassCard>

        <div style={{ textAlign:'center', marginTop:20 }}>
          <span onClick={() => router.push('/')} style={{ fontSize:13, color:'#64748B', cursor:'pointer' }}>← Back to landing</span>
        </div>
      </div>
    </div>
  );
}
