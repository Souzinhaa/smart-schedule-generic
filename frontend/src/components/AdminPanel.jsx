import { useState, useEffect } from 'react';
import { Scissors, Users, Calendar, LogOut, Plus, Trash2, Edit2, Check, X, BarChart2 } from 'lucide-react';
import { adminService, authService } from '../services/api';

const GOLD = '#C9A84C';
const DARK = '#0f0f0f';
const DARK2 = '#1a1a1a';
const DARK3 = '#242424';
const DARK4 = '#2e2e2e';
const TEXT = '#f0f0f0';
const TEXT2 = '#a0a0a0';
const RED = '#ef4444';

const s = {
  container: { background: DARK, minHeight: '100vh', color: TEXT, fontFamily: 'sans-serif', maxWidth: 480, margin: '0 auto' },
  header: { background: DARK2, borderBottom: `1px solid ${DARK4}`, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tabs: { display: 'flex', background: DARK2, borderBottom: `1px solid ${DARK4}` },
  tab: { flex: 1, padding: '12px 0', textAlign: 'center', cursor: 'pointer', fontSize: 12, color: TEXT2, border: 'none', background: 'none' },
  tabActive: { color: GOLD, borderBottom: `2px solid ${GOLD}` },
  section: { padding: '16px 20px' },
  card: { background: DARK2, border: `1px solid ${DARK4}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10 },
  label: { fontSize: 11, color: TEXT2, marginBottom: 4 },
  input: { width: '100%', padding: '10px 12px', borderRadius: 8, background: DARK3, border: `1px solid ${DARK4}`, color: TEXT, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' },
  btn: { padding: '10px 16px', borderRadius: 8, background: GOLD, border: 'none', color: DARK, fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  btnDanger: { padding: '6px 10px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.3)`, color: RED, cursor: 'pointer', fontSize: 12 },
  btnGhost: { padding: '6px 10px', borderRadius: 6, background: DARK3, border: `1px solid ${DARK4}`, color: TEXT2, cursor: 'pointer', fontSize: 12 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  statCard: { background: DARK2, border: `1px solid ${DARK4}`, borderRadius: 12, padding: '16px', flex: 1, textAlign: 'center' },
  error: { fontSize: 12, color: RED, background: 'rgba(239,68,68,0.1)', borderRadius: 6, padding: '8px 12px', marginBottom: 10 },
  badge: { fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 600 },
};

function ServiceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', description: '', price: '', duration_minutes: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name: form.name,
        description: form.description || null,
        price: Math.round(parseFloat(form.price) * 100),
        duration_minutes: parseInt(form.duration_minutes),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
      <div><div style={s.label}>Nome *</div><input style={s.input} value={form.name} onChange={e => set('name', e.target.value)} required /></div>
      <div><div style={s.label}>Descrição</div><input style={s.input} value={form.description || ''} onChange={e => set('description', e.target.value)} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div><div style={s.label}>Preço (R$) *</div><input style={s.input} type="number" step="0.01" min="0" value={form.price === '' ? '' : (initial ? form.price / 100 : form.price)} onChange={e => set('price', initial ? Math.round(e.target.value * 100) : e.target.value)} required /></div>
        <div><div style={s.label}>Duração (min) *</div><input style={s.input} type="number" min="5" value={form.duration_minutes} onChange={e => set('duration_minutes', e.target.value)} required /></div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" style={s.btnGhost} onClick={onCancel}>Cancelar</button>
        <button type="submit" style={s.btn} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </form>
  );
}

function BarberForm({ onSave, onCancel }) {
  const [form, setForm] = useState({ whatsapp: '', name: '', specialty: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ whatsapp: form.whatsapp.replace(/\D/g, ''), name: form.name, specialty: form.specialty || null });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
      <div><div style={s.label}>WhatsApp (com DDD) *</div><input style={s.input} placeholder="11999999999" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} required /></div>
      <div><div style={s.label}>Nome *</div><input style={s.input} value={form.name} onChange={e => set('name', e.target.value)} required /></div>
      <div><div style={s.label}>Especialidade</div><input style={s.input} value={form.specialty} onChange={e => set('specialty', e.target.value)} /></div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" style={s.btnGhost} onClick={onCancel}>Cancelar</button>
        <button type="submit" style={s.btn} disabled={saving}>{saving ? 'Salvando...' : 'Adicionar'}</button>
      </div>
    </form>
  );
}

export default function AdminPanel({ user, onLogout }) {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showAddBarber, setShowAddBarber] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashRes, svcRes, barberRes, apptRes] = await Promise.all([
        adminService.getDashboard(),
        adminService.getServices(),
        adminService.getBarbers(),
        adminService.getAppointments(),
      ]);
      setStats(dashRes.data);
      setServices(Array.isArray(svcRes.data) ? svcRes.data : []);
      setBarbers(Array.isArray(barberRes.data) ? barberRes.data : []);
      setAppointments(Array.isArray(apptRes.data) ? apptRes.data : []);
    } catch (e) {
      setError('Erro ao carregar dados do painel.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (data) => {
    try {
      await adminService.createService(data);
      setShowAddService(false);
      const res = await adminService.getServices();
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch { setError('Erro ao criar serviço.'); }
  };

  const handleUpdateService = async (data) => {
    try {
      await adminService.updateService(editingService.id, data);
      setEditingService(null);
      const res = await adminService.getServices();
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch { setError('Erro ao atualizar serviço.'); }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Excluir este serviço?')) return;
    try {
      await adminService.deleteService(id);
      setServices(s => s.filter(x => x.id !== id));
    } catch { setError('Erro ao excluir serviço.'); }
  };

  const handleAddBarber = async (data) => {
    try {
      await adminService.addBarber(data);
      setShowAddBarber(false);
      const res = await adminService.getBarbers();
      setBarbers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e.response?.data?.detail || 'Erro ao adicionar barbeiro.');
    }
  };

  const handleDeleteBarber = async (id) => {
    if (!confirm('Remover este barbeiro?')) return;
    try {
      await adminService.deleteBarber(id);
      setBarbers(b => b.filter(x => x.id !== id));
    } catch { setError('Erro ao remover barbeiro.'); }
  };

  const statusColor = { pending: '#f59e0b', confirmed: '#3b82f6', completed: '#22c55e', cancelled: '#ef4444' };
  const statusLabel = { pending: 'Pendente', confirmed: 'Confirmado', completed: 'Concluído', cancelled: 'Cancelado' };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={14} /> },
    { id: 'services', label: 'Serviços', icon: <Scissors size={14} /> },
    { id: 'barbers', label: 'Barbeiros', icon: <Users size={14} /> },
    { id: 'appointments', label: 'Agendamentos', icon: <Calendar size={14} /> },
  ];

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: GOLD }}>Painel Admin</div>
          <div style={{ fontSize: 12, color: TEXT2 }}>{user?.name}</div>
        </div>
        <button style={{ background: 'none', border: 'none', color: TEXT2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }} onClick={onLogout}>
          <LogOut size={14} /> Sair
        </button>
      </div>

      <div style={s.tabs}>
        {tabs.map(t => (
          <button key={t.id} style={{ ...s.tab, ...(tab === t.id ? s.tabActive : {}) }} onClick={() => setTab(t.id)}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {t.icon}<span>{t.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div style={s.section}>
        {error && <div style={s.error}>{error}<button onClick={() => setError('')} style={{ marginLeft: 8, background: 'none', border: 'none', color: RED, cursor: 'pointer' }}>✕</button></div>}

        {loading ? (
          <div style={{ textAlign: 'center', color: TEXT2, padding: 40 }}>Carregando...</div>
        ) : (
          <>
            {tab === 'dashboard' && stats && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {[
                    ['Agendamentos', stats.total_appointments],
                    ['Concluídos', stats.completed_appointments],
                    ['Pendentes', stats.pending_appointments],
                    ['Barbeiros', stats.active_barbers],
                  ].map(([label, value]) => (
                    <div key={label} style={s.statCard}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: GOLD }}>{value}</div>
                      <div style={{ fontSize: 12, color: TEXT2, marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={s.statCard}>
                  <div style={{ fontSize: 12, color: TEXT2, marginBottom: 4 }}>Receita Total (concluídos)</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>R$ {(stats.total_revenue / 100).toFixed(2)}</div>
                </div>
              </div>
            )}

            {tab === 'services' && (
              <div>
                <div style={{ ...s.row, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{services.length} serviço{services.length !== 1 ? 's' : ''}</div>
                  <button style={s.btn} onClick={() => { setShowAddService(true); setEditingService(null); }}>
                    <Plus size={14} style={{ verticalAlign: 'middle' }} /> Novo
                  </button>
                </div>

                {showAddService && !editingService && (
                  <div style={{ ...s.card, borderColor: GOLD }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: GOLD, marginBottom: 4 }}>Novo Serviço</div>
                    <ServiceForm onSave={handleCreateService} onCancel={() => setShowAddService(false)} />
                  </div>
                )}

                {services.map(svc => (
                  <div key={svc.id} style={s.card}>
                    {editingService?.id === svc.id ? (
                      <>
                        <div style={{ fontSize: 13, fontWeight: 600, color: GOLD, marginBottom: 4 }}>Editar Serviço</div>
                        <ServiceForm initial={svc} onSave={handleUpdateService} onCancel={() => setEditingService(null)} />
                      </>
                    ) : (
                      <div style={s.row}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{svc.name}</div>
                          <div style={{ fontSize: 12, color: TEXT2 }}>{svc.duration_minutes} min</div>
                        </div>
                        <div style={{ textAlign: 'right', marginRight: 10 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: GOLD }}>R$ {(svc.price / 100).toFixed(2)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button style={s.btnGhost} onClick={() => { setEditingService(svc); setShowAddService(false); }}><Edit2 size={13} /></button>
                          <button style={s.btnDanger} onClick={() => handleDeleteService(svc.id)}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {services.length === 0 && !showAddService && (
                  <div style={{ textAlign: 'center', color: TEXT2, fontSize: 13, padding: 24 }}>Nenhum serviço. Clique em Novo para adicionar.</div>
                )}
              </div>
            )}

            {tab === 'barbers' && (
              <div>
                <div style={{ ...s.row, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{barbers.length} barbeiro{barbers.length !== 1 ? 's' : ''}</div>
                  <button style={s.btn} onClick={() => setShowAddBarber(true)}>
                    <Plus size={14} style={{ verticalAlign: 'middle' }} /> Adicionar
                  </button>
                </div>

                {showAddBarber && (
                  <div style={{ ...s.card, borderColor: GOLD }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: GOLD, marginBottom: 4 }}>Novo Barbeiro</div>
                    <BarberForm onSave={handleAddBarber} onCancel={() => setShowAddBarber(false)} />
                  </div>
                )}

                {barbers.map(b => (
                  <div key={b.id} style={s.card}>
                    <div style={s.row}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD}, #8B6914)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: DARK, flexShrink: 0 }}>
                        {b.user?.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{b.user?.name}</div>
                        <div style={{ fontSize: 12, color: TEXT2 }}>{b.specialty || 'Sem especialidade'}</div>
                        <div style={{ fontSize: 11, color: TEXT2 }}>{b.user?.whatsapp}</div>
                      </div>
                      <button style={s.btnDanger} onClick={() => handleDeleteBarber(b.id)}><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
                {barbers.length === 0 && !showAddBarber && (
                  <div style={{ textAlign: 'center', color: TEXT2, fontSize: 13, padding: 24 }}>Nenhum barbeiro cadastrado.</div>
                )}
              </div>
            )}

            {tab === 'appointments' && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 14 }}>{appointments.length} agendamento{appointments.length !== 1 ? 's' : ''}</div>
                {appointments.length === 0 && (
                  <div style={{ textAlign: 'center', color: TEXT2, fontSize: 13, padding: 24 }}>Nenhum agendamento ainda.</div>
                )}
                {[...appointments].sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)).map(appt => (
                  <div key={appt.id} style={s.card}>
                    <div style={s.row}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>#{appt.id} — Serviço #{appt.service_id}</div>
                        <div style={{ fontSize: 12, color: TEXT2 }}>{new Date(appt.appointment_date).toLocaleString('pt-BR')}</div>
                        {appt.notes && <div style={{ fontSize: 11, color: TEXT2, marginTop: 2 }}>{appt.notes}</div>}
                      </div>
                      <span style={{ ...s.badge, background: `${statusColor[appt.status]}22`, color: statusColor[appt.status] }}>
                        {statusLabel[appt.status] || appt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
