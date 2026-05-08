import { useState, useEffect } from 'react';
import { Scissors, Clock, ChevronRight, ChevronLeft, Check, MessageCircle, MapPin, Phone, Star, Calendar, User, LogOut, Loader } from 'lucide-react';
import AuthScreen from './components/AuthScreen';
import { publicService, appointmentService, authService } from './services/api';

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E8C96A';
const DARK = '#0f0f0f';
const DARK2 = '#1a1a1a';
const DARK3 = '#242424';
const DARK4 = '#2e2e2e';
const TEXT = '#f0f0f0';
const TEXT2 = '#a0a0a0';

function WaBtn() {
  return (
    <a href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio." target="_blank" rel="noreferrer" style={{ position: 'fixed', bottom: 24, right: 20, width: 54, height: 54, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,211,102,0.35)', textDecoration: 'none' }}>
      <MessageCircle size={26} color="#fff" fill="#fff" />
    </a>
  );
}

const s = {
  app: { background: DARK, minHeight: '100vh', color: TEXT, fontFamily: 'sans-serif', maxWidth: 420, margin: '0 auto', position: 'relative', paddingBottom: 80 },
  hero: { background: `linear-gradient(180deg, ${DARK2} 0%, ${DARK} 100%)`, padding: '24px 20px 20px', borderBottom: `1px solid ${DARK4}` },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  logoIcon: { width: 40, height: 40, borderRadius: 10, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: { background: DARK3, border: `1px solid ${DARK4}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, color: TEXT2, display: 'inline-flex', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: '50%', background: '#4ade80' },
  heroTitle: { fontSize: 26, fontWeight: 700, color: TEXT, margin: '12px 0 4px' },
  heroSub: { fontSize: 14, color: TEXT2 },
  section: { padding: '20px 20px 0' },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: GOLD, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 },
  serviceCard: { background: DARK2, border: `1px solid ${DARK4}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'border-color 0.2s' },
  serviceCardSel: { border: `1.5px solid ${GOLD}`, background: DARK3 },
  svcIcon: { width: 44, height: 44, borderRadius: 12, background: DARK3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 },
  svcName: { fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 2 },
  svcDesc: { fontSize: 12, color: TEXT2, marginBottom: 4 },
  svcMeta: { display: 'flex', gap: 12, fontSize: 12, color: TEXT2 },
  svcPrice: { fontSize: 17, fontWeight: 700, color: GOLD, marginLeft: 'auto', whiteSpace: 'nowrap' },
  barberCard: { background: DARK2, border: `1px solid ${DARK4}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' },
  barberCardSel: { border: `1.5px solid ${GOLD}`, background: DARK3 },
  avatar: { width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD} 0%, #8B6914 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: DARK, flexShrink: 0 },
  stars: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: GOLD, marginTop: 2 },
  daysRow: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 },
  dayChip: { minWidth: 52, padding: '10px 0', borderRadius: 12, background: DARK2, border: `1px solid ${DARK4}`, textAlign: 'center', cursor: 'pointer', flexShrink: 0 },
  dayChipSel: { background: GOLD, border: `1px solid ${GOLD}` },
  dayLabel: { fontSize: 11, color: TEXT2, marginBottom: 2 },
  dayNum: { fontSize: 17, fontWeight: 700, color: TEXT },
  timesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 14 },
  timeChip: { padding: '10px 0', borderRadius: 10, background: DARK2, border: `1px solid ${DARK4}`, textAlign: 'center', fontSize: 13, color: TEXT, cursor: 'pointer' },
  timeChipSel: { background: GOLD, border: `1px solid ${GOLD}`, color: DARK, fontWeight: 700 },
  timeChipOff: { opacity: 0.3, cursor: 'not-allowed' },
  btn: { width: '100%', padding: '15px', borderRadius: 14, background: GOLD, border: 'none', color: DARK, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 20 },
  btnOutline: { width: '100%', padding: '13px', borderRadius: 14, background: 'transparent', border: `1.5px solid ${DARK4}`, color: TEXT2, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 10 },
  header: { display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${DARK4}`, background: DARK, justifyContent: 'space-between' },
  backBtn: { width: 36, height: 36, borderRadius: 10, background: DARK3, border: `1px solid ${DARK4}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
  confirmCard: { background: DARK2, border: `1px solid ${DARK4}`, borderRadius: 16, padding: 20, margin: '20px 20px 0' },
  confirmRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${DARK4}` },
  confirmLast: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' },
  successCircle: { width: 72, height: 72, borderRadius: '50%', background: `rgba(201,168,76,0.15)`, border: `2px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  footer: { background: DARK2, borderTop: `1px solid ${DARK4}`, padding: '24px 20px', marginTop: 28 },
  divider: { height: 1, background: DARK4, margin: '0 20px 20px' },
  logoutBtn: { background: 'none', border: 'none', color: TEXT2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 },
};

function HomeScreen({ onBook, services, user, onLogout }) {
  const mockBarbers = [
    { id: 1, name: 'Rafael Souza', specialty: 'Degradê & Navalhado', rating: 4.9, reviews: 312, initials: 'RS' },
    { id: 2, name: 'Diego Mendes', specialty: 'Barba Clássica', rating: 4.8, reviews: 245, initials: 'DM' },
    { id: 3, name: 'Lucas Ferreira', specialty: 'Cortes Modernos', rating: 4.9, reviews: 189, initials: 'LF' },
  ];

  return (
    <div>
      <div style={s.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={s.logo}>
            <div style={s.logoIcon}><Scissors size={22} color={DARK} /></div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: TEXT }}>Barbearia Império</div>
              <div style={{ fontSize: 12, color: TEXT2 }}>Est. 2010 • São Paulo</div>
            </div>
          </div>
          <button style={s.logoutBtn} onClick={onLogout} title={`Sair como ${user?.name}`}>
            <LogOut size={14} />
          </button>
        </div>
        <div style={{ background: DARK3, borderRadius: 16, padding: 20, border: `1px solid ${DARK4}` }}>
          <div style={{ fontSize: 13, color: GOLD, fontWeight: 600, marginBottom: 4 }}>Bem-vindo, {user?.name?.split(' ')[0]}!</div>
          <div style={s.heroTitle}>Experiência Premium</div>
          <div style={s.heroSub}>Agende seu horário com os melhores profissionais da cidade</div>
          <button style={{ ...s.btn, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={onBook}>
            <Calendar size={18} /> Agendar Agora
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {[['4.9★', 'Avaliação'], ['312+', 'Clientes'], ['14 anos', 'Experiência']].map(([v, l]) => (
            <div key={l} style={{ flex: 1, background: DARK3, borderRadius: 12, padding: '12px 8px', textAlign: 'center', border: `1px solid ${DARK4}` }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: GOLD }}>{v}</div>
              <div style={{ fontSize: 11, color: TEXT2, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Nossos Serviços</div>
        {services.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: TEXT2, fontSize: 13 }}>
            Nenhum serviço disponível no momento
          </div>
        ) : services.map(svc => (
          <div key={svc.id} style={s.serviceCard} onClick={onBook}>
            <div style={s.svcIcon}>✂</div>
            <div style={{ flex: 1 }}>
              <div style={s.svcName}>{svc.name}</div>
              <div style={s.svcDesc}>{svc.description}</div>
              <div style={s.svcMeta}><Clock size={11} /> {svc.duration_minutes} min</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={s.svcPrice}>R$ {(svc.price / 100).toFixed(2)}</div>
              <ChevronRight size={16} color={TEXT2} style={{ marginTop: 4 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Nossa Equipe</div>
        {mockBarbers.map(b => (
          <div key={b.id} style={s.barberCard} onClick={onBook}>
            <div style={s.avatar}>{b.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={s.svcName}>{b.name}</div>
              <div style={{ fontSize: 12, color: TEXT2 }}>{b.specialty}</div>
              <div style={s.stars}><Star size={11} fill={GOLD} />{b.rating} <span style={{ color: TEXT2 }}>({b.reviews} avaliações)</span></div>
            </div>
            <ChevronRight size={16} color={TEXT2} />
          </div>
        ))}
      </div>

      <div style={{ ...s.footer, marginTop: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: GOLD, marginBottom: 12 }}>BARBEARIA IMPÉRIO</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: TEXT2 }}><MapPin size={14} color={GOLD} />Rua das Palmeiras, 847 — Centro, SP</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: TEXT2 }}><Phone size={14} color={GOLD} />(11) 9 9999-9999</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: TEXT2 }}><Clock size={14} color={GOLD} />Seg–Sáb: 9h às 19h • Dom: 9h às 14h</div>
        </div>
      </div>
    </div>
  );
}

function StepService({ selected, onSelect, onNext, onBack, services }) {
  return (
    <div>
      <div style={s.header}>
        <div style={s.backBtn} onClick={onBack}><ChevronLeft size={18} color={TEXT} /></div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Escolha o Serviço</div>
          <div style={{ fontSize: 12, color: TEXT2 }}>Passo 1 de 3</div>
        </div>
      </div>
      <div style={{ ...s.section, paddingTop: 16 }}>
        {services.map(svc => (
          <div key={svc.id} style={{ ...s.serviceCard, ...(selected?.id === svc.id ? s.serviceCardSel : {}) }} onClick={() => onSelect(svc)}>
            <div style={s.svcIcon}>✂</div>
            <div style={{ flex: 1 }}>
              <div style={s.svcName}>{svc.name}</div>
              <div style={s.svcDesc}>{svc.description}</div>
              <div style={s.svcMeta}><Clock size={11} /> {svc.duration_minutes} min</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={s.svcPrice}>R$ {(svc.price / 100).toFixed(2)}</div>
              {selected?.id === svc.id && <Check size={16} color={GOLD} style={{ marginTop: 4 }} />}
            </div>
          </div>
        ))}
        <button style={{ ...s.btn, opacity: selected ? 1 : 0.4 }} disabled={!selected} onClick={onNext}>
          Continuar <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
        </button>
      </div>
    </div>
  );
}

function StepBarber({ selected, onSelect, onNext, onBack }) {
  const barbers = [
    { id: 1, name: 'Rafael Souza', specialty: 'Degradê & Navalhado', rating: 4.9, reviews: 312, initials: 'RS' },
    { id: 2, name: 'Diego Mendes', specialty: 'Barba Clássica', rating: 4.8, reviews: 245, initials: 'DM' },
    { id: 3, name: 'Lucas Ferreira', specialty: 'Cortes Modernos', rating: 4.9, reviews: 189, initials: 'LF' },
  ];

  return (
    <div>
      <div style={s.header}>
        <div style={s.backBtn} onClick={onBack}><ChevronLeft size={18} color={TEXT} /></div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Escolha o Barbeiro</div>
          <div style={{ fontSize: 12, color: TEXT2 }}>Passo 2 de 3</div>
        </div>
      </div>
      <div style={{ ...s.section, paddingTop: 16 }}>
        {barbers.map(b => (
          <div key={b.id} style={{ ...s.barberCard, ...(selected?.id === b.id ? s.barberCardSel : {}) }} onClick={() => onSelect(b)}>
            <div style={s.avatar}>{b.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={s.svcName}>{b.name}</div>
              <div style={{ fontSize: 12, color: TEXT2 }}>{b.specialty}</div>
              <div style={s.stars}><Star size={11} fill={GOLD} />{b.rating} <span style={{ color: TEXT2 }}>({b.reviews})</span></div>
            </div>
            {selected?.id === b.id && <Check size={18} color={GOLD} />}
          </div>
        ))}
        <button style={{ ...s.btn, opacity: selected ? 1 : 0.4 }} disabled={!selected} onClick={onNext}>
          Continuar <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
        </button>
      </div>
    </div>
  );
}

function StepDateTime({ selDay, selTime, onDay, onTime, onNext, onBack }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return { date: d, label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''), num: d.getDate() };
  });

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '16:00', '16:30', '17:00'];
  const unavailable = ['10:30', '13:30', '15:00'];

  return (
    <div>
      <div style={s.header}>
        <div style={s.backBtn} onClick={onBack}><ChevronLeft size={18} color={TEXT} /></div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Data e Horário</div>
          <div style={{ fontSize: 12, color: TEXT2 }}>Passo 3 de 3</div>
        </div>
      </div>
      <div style={{ ...s.section, paddingTop: 16 }}>
        <div style={{ fontSize: 13, color: TEXT2, marginBottom: 10 }}>Selecione o dia</div>
        <div style={s.daysRow}>
          {days.map((d, i) => (
            <div key={i} style={{ ...s.dayChip, ...(selDay?.num === d.num ? s.dayChipSel : {}) }} onClick={() => onDay(d)}>
              <div style={{ fontSize: 11, color: selDay?.num === d.num ? DARK : TEXT2, marginBottom: 2 }}>{d.label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: selDay?.num === d.num ? DARK : TEXT }}>{d.num}</div>
            </div>
          ))}
        </div>
        {selDay && (
          <>
            <div style={{ fontSize: 13, color: TEXT2, marginTop: 20, marginBottom: 2 }}>Horários disponíveis</div>
            <div style={s.timesGrid}>
              {timeSlots.map(t => {
                const off = unavailable.includes(t);
                return (
                  <div key={t} style={{ ...s.timeChip, ...(selTime === t ? s.timeChipSel : {}), ...(off ? s.timeChipOff : {}) }}
                    onClick={() => !off && onTime(t)}>{t}</div>
                );
              })}
            </div>
          </>
        )}
        <button style={{ ...s.btn, opacity: selDay && selTime ? 1 : 0.4 }} disabled={!selDay || !selTime} onClick={onNext}>
          Ver Resumo <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
        </button>
      </div>
    </div>
  );
}

function StepConfirm({ service, barber, day, time, onConfirm, onBack, loading }) {
  return (
    <div>
      <div style={s.header}>
        <div style={s.backBtn} onClick={onBack}><ChevronLeft size={18} color={TEXT} /></div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Confirmar Agendamento</div>
          <div style={{ fontSize: 12, color: TEXT2 }}>Revise os detalhes</div>
        </div>
      </div>
      <div style={s.confirmCard}>
        <div style={{ fontSize: 13, color: GOLD, fontWeight: 600, marginBottom: 12 }}>RESUMO DO PEDIDO</div>
        {[
          [<Scissors size={14} />, 'Serviço', service.name],
          [<User size={14} />, 'Barbeiro', barber.name],
          [<Calendar size={14} />, 'Data', `${day.date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}`],
          [<Clock size={14} />, 'Horário', time],
        ].map(([icon, label, val], i, arr) => (
          <div key={label} style={i < arr.length - 1 ? s.confirmRow : s.confirmLast}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: TEXT2, fontSize: 13 }}>{icon}{label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, maxWidth: '60%', textAlign: 'right' }}>{val}</div>
          </div>
        ))}
        <div style={{ height: 1, background: DARK4, margin: '12px 0' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, color: TEXT2 }}>Total</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: GOLD }}>R$ {(service.price / 100).toFixed(2)}</div>
        </div>
      </div>
      <div style={{ padding: '0 20px' }}>
        <button style={s.btn} onClick={onConfirm} disabled={loading}>{loading ? 'Agendando...' : 'Confirmar Agendamento'}</button>
        <button style={s.btnOutline} onClick={onBack} disabled={loading}>Voltar e Editar</button>
      </div>
    </div>
  );
}

function StepSuccess({ service, barber, day, time, onHome }) {
  return (
    <div style={{ padding: '48px 20px 20px', textAlign: 'center' }}>
      <div style={s.successCircle}><Check size={34} color={GOLD} strokeWidth={2.5} /></div>
      <div style={{ fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Agendamento Confirmado!</div>
      <div style={{ fontSize: 14, color: TEXT2, marginBottom: 28 }}>Nos vemos em breve! Você receberá uma confirmação via WhatsApp.</div>
      <div style={{ ...s.confirmCard, textAlign: 'left' }}>
        <div style={{ fontSize: 13, color: GOLD, fontWeight: 600, marginBottom: 12 }}>DETALHES</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{service.name}</div>
        <div style={{ fontSize: 13, color: TEXT2, marginBottom: 2 }}>com {barber.name}</div>
        <div style={{ fontSize: 13, color: TEXT2, marginBottom: 2 }}>{day.date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} às {time}</div>
        <div style={{ height: 1, background: DARK4, margin: '12px 0' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: TEXT2 }}>Total</span>
          <span style={{ fontSize: 17, fontWeight: 700, color: GOLD }}>R$ {(service.price / 100).toFixed(2)}</span>
        </div>
      </div>
      <button style={{ ...s.btn, marginTop: 20 }} onClick={onHome}>Voltar ao Início</button>
    </div>
  );
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [screen, setScreen] = useState('home');
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [barber, setBarber] = useState(null);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setAuthenticated(true);
      setUser(JSON.parse(userData));
      loadServices();
    } else {
      setLoading(false);
    }
  }, []);

  const loadServices = async () => {
    try {
      const response = await publicService.getServices();
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setAuthenticated(true);
    loadServices();
  };

  const handleLogout = () => {
    authService.logout();
    setAuthenticated(false);
    setUser(null);
    setScreen('home');
  };

  const handleConfirm = async () => {
    setBookingLoading(true);
    try {
      const appointmentDate = new Date(day.date);
      const [hours, minutes] = time.split(':');
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0);

      await appointmentService.create(service.id, appointmentDate.toISOString(), '');
      setStep(5);
    } catch (error) {
      console.error('Erro ao agendar:', error);
      alert('Erro ao confirmar agendamento. Tente novamente.');
    } finally {
      setBookingLoading(false);
    }
  };

  const startBook = () => { setStep(1); setScreen('book'); };
  const goHome = () => { setScreen('home'); setService(null); setBarber(null); setDay(null); setTime(null); };

  if (!authenticated) {
    return <AuthScreen onSuccess={handleAuthSuccess} />;
  }

  if (loading) {
    return (
      <div style={{ background: DARK, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader size={32} color={GOLD} />
      </div>
    );
  }

  return (
    <div style={s.app}>
      {screen === 'home' && <HomeScreen onBook={startBook} services={services} user={user} onLogout={handleLogout} />}
      {screen === 'book' && step === 1 && <StepService selected={service} onSelect={setService} onNext={() => setStep(2)} onBack={goHome} services={services} />}
      {screen === 'book' && step === 2 && <StepBarber selected={barber} onSelect={setBarber} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {screen === 'book' && step === 3 && <StepDateTime selDay={day} selTime={time} onDay={setDay} onTime={setTime} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {screen === 'book' && step === 4 && <StepConfirm service={service} barber={barber} day={day} time={time} onConfirm={handleConfirm} onBack={() => setStep(3)} loading={bookingLoading} />}
      {screen === 'book' && step === 5 && <StepSuccess service={service} barber={barber} day={day} time={time} onHome={goHome} />}
      <WaBtn />
    </div>
  );
}
