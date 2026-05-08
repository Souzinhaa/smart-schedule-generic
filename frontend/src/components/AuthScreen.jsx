import { useState } from 'react';
import { MessageCircle, ChevronRight, Loader } from 'lucide-react';
import { authService } from '../services/api';

const GOLD = '#C9A84C';
const DARK = '#0f0f0f';
const DARK2 = '#1a1a1a';
const DARK3 = '#242424';
const DARK4 = '#2e2e2e';
const TEXT = '#f0f0f0';
const TEXT2 = '#a0a0a0';

export default function AuthScreen({ onSuccess }) {
  const [step, setStep] = useState('phone'); // phone, name, code
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverMessage, setServerMessage] = useState('');

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 11) throw new Error('Telefone inválido');

      const fullPhone = `55${cleanPhone}`;
      const response = await authService.login(fullPhone, name);
      setServerMessage(response.data?.message || '');
      setStep('code');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (code.length !== 6) throw new Error('Código deve ter 6 dígitos');

      const cleanPhone = phone.replace(/\D/g, '');
      const fullPhone = `55${cleanPhone}`;
      const response = await authService.verifyCode(fullPhone, code);

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({ name, phone: fullPhone }));

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const s = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${DARK2} 0%, ${DARK} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    card: {
      background: DARK2,
      border: `1px solid ${DARK4}`,
      borderRadius: 20,
      padding: '32px 24px',
      maxWidth: 360,
      width: '100%',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 24,
    },
    logoIcon: {
      width: 50,
      height: 50,
      borderRadius: 12,
      background: GOLD,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
    },
    title: { fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 8 },
    subtitle: { fontSize: 13, color: TEXT2, marginBottom: 28 },
    form: { display: 'flex', flexDirection: 'column', gap: 14 },
    input: {
      padding: '12px 14px',
      borderRadius: 10,
      background: DARK3,
      border: `1px solid ${DARK4}`,
      color: TEXT,
      fontSize: 14,
      fontFamily: 'inherit',
    },
    inputLabel: { fontSize: 12, color: TEXT2, marginBottom: 6 },
    button: {
      padding: '12px 14px',
      borderRadius: 10,
      background: GOLD,
      border: 'none',
      color: DARK,
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
    },
    error: { fontSize: 12, color: '#ef4444', marginTop: 12, padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 6 },
    hint: { fontSize: 11, color: TEXT2, marginTop: 12, textAlign: 'center' },
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoIcon}>💈</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Barbearia</div>
            <div style={{ fontSize: 11, color: TEXT2 }}>Smart Schedule</div>
          </div>
        </div>

        {step === 'phone' && (
          <>
            <div style={s.title}>Bem-vindo</div>
            <div style={s.subtitle}>Digite seu WhatsApp para continuar</div>
            <form onSubmit={handleLogin} style={s.form}>
              <div>
                <div style={s.inputLabel}>Telefone</div>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formatPhone(phone)}
                  onChange={(e) => setPhone(e.target.value)}
                  style={s.input}
                  disabled={loading}
                  autoFocus
                />
              </div>
              <div>
                <div style={s.inputLabel}>Nome</div>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={s.input}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                style={s.button}
                disabled={loading || !phone || !name}
              >
                {loading ? <Loader size={16} className="animate-spin" /> : <>
                  <MessageCircle size={16} />
                  Receber Código
                </>}
              </button>
            </form>
            <div style={s.hint}>Você receberá um código via WhatsApp</div>
          </>
        )}

        {step === 'code' && (
          <>
            <div style={s.title}>Confirmar Código</div>
            <div style={s.subtitle}>Digite o código de 6 dígitos enviado para seu WhatsApp</div>
            {serverMessage && (
              <div style={{ fontSize: 12, color: GOLD, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
                {serverMessage}
              </div>
            )}
            <form onSubmit={handleVerifyCode} style={s.form}>
              <div>
                <div style={s.inputLabel}>Código de Verificação</div>
                <input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.slice(0, 6))}
                  style={{ ...s.input, letterSpacing: 8, textAlign: 'center', fontSize: 18, fontWeight: 600 }}
                  disabled={loading}
                  autoFocus
                  maxLength="6"
                />
              </div>
              <button
                type="submit"
                style={s.button}
                disabled={loading || code.length !== 6}
              >
                {loading ? <Loader size={16} className="animate-spin" /> : <>
                  <ChevronRight size={16} />
                  Verificar
                </>}
              </button>
            </form>
            <div style={{ ...s.hint, marginTop: 16 }}>
              <button
                onClick={() => { setStep('phone'); setCode(''); setError(''); }}
                style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
              >
                Usar outro telefone
              </button>
            </div>
          </>
        )}

        {error && <div style={s.error}>{error}</div>}
      </div>
    </div>
  );
}
