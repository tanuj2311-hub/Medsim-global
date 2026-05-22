'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Mail, Lock, User, Loader } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    router.push('/dashboard');
  };

  const field = (key: keyof typeof form, label: string, type: string, placeholder: string, Icon: typeof User) => (
    <div>
      <label style={{ fontSize:12, color:'#64748B', display:'block', marginBottom:6 }}>{label}</label>
      <div style={{ position:'relative' }}>
        <Icon size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#64748B' }} />
        <input type={type} required value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={placeholder}
          style={{ width:'100%', padding:'10px 12px 10px 36px', background:'rgba(56,189,248,0.05)', border:'1px solid rgba(56,189,248,0.15)', borderRadius:8, color:'#E2E8F0', fontSize:14, outline:'none', boxSizing:'border-box' }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#020817', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(56,189,248,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.025) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:400, padding:'0 24px' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:48, height:48, borderRadius:12, background:'linear-gradient(135deg,#38BDF8,#818CF8)', marginBottom:16 }}>
            <Activity size={22} color="white" />
          </div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#E2E8F0', margin:'0 0 6px', letterSpacing:'-0.5px' }}>Create Account</h1>
          <p style={{ color:'#64748B', fontSize:14, margin:0 }}>Start simulating healthcare crises</p>
        </div>
        <GlassCard glow>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {field('name','Full Name','text','Dr. Jane Smith', User)}
            {field('email','Email','email','you@hospital.org', Mail)}
            {field('password','Password','password','••••••••', Lock)}
            <button type="submit" disabled={loading}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px', background:'linear-gradient(135deg,#38BDF8,#818CF8)', border:'none', borderRadius:10, color:'white', fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer' }}>
              {loading ? <><Loader size={14} style={{ animation:'spin 1s linear infinite' }} /> Creating account…</> : 'Create Account'}
            </button>
            <div style={{ textAlign:'center', fontSize:13, color:'#64748B' }}>
              Have an account?{' '}
              <span onClick={() => router.push('/auth/login')} style={{ color:'#38BDF8', cursor:'pointer', fontWeight:600 }}>Sign in</span>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
