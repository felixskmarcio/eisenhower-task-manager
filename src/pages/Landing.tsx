import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, MessageSquare, Terminal, ShieldCheck, Database, LayoutGrid, Zap, Target, Clock, ChevronDown, Star, Users, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { SpiralAnimation } from '../components/ui/spiral-animation';

const Landing = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeFeature, setActiveFeature] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <LayoutGrid className="w-7 h-7" />,
      title: "Matriz Tática",
      desc: "Visualização em quatro quadrantes para tomada de decisão imediata sobre prioridades.",
      detail: "Organize suas tarefas por urgência e importância com drag & drop intuitivo."
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "Autenticação Segura",
      desc: "Proteção de dados com criptografia de ponta e login via provedores confiáveis.",
      detail: "Firebase Auth com suporte a Google, email e recuperação de senha."
    },
    {
      icon: <Database className="w-7 h-7" />,
      title: "Sync em Nuvem",
      desc: "Persistência de dados em tempo real. Acesse suas operações de qualquer terminal.",
      detail: "Banco de dados Supabase com sincronização automática e backup."
    }
  ];

  const stats = [
    { value: "4", label: "Quadrantes", icon: <Target className="w-5 h-5" /> },
    { value: "∞", label: "Tarefas", icon: <Zap className="w-5 h-5" /> },
    { value: "24/7", label: "Acesso", icon: <Clock className="w-5 h-5" /> },
    { value: "100%", label: "Seguro", icon: <ShieldCheck className="w-5 h-5" /> }
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans relative overflow-x-hidden selection:bg-[#ccff00] selection:text-black">
      <div className="relative z-10">
        {/* Navigation */}
        <header className="border-b border-[#27272a]/50 bg-[#09090b]/60 backdrop-blur-xl fixed top-0 w-full z-50">
          <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#ccff00] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold tracking-tight text-white text-lg uppercase font-display">
                EISENHOWER<span className="text-[#ccff00]">.SYS</span>
              </span>
            </div>

            <nav className="flex items-center gap-4">
              <a href="#features" className="hidden md:block font-mono text-xs text-[#a1a1aa] hover:text-[#ccff00] transition-colors uppercase tracking-wider">
                Recursos
              </a>
              <a href="#contact" className="hidden md:block font-mono text-xs text-[#a1a1aa] hover:text-[#ccff00] transition-colors uppercase tracking-wider">
                Contato
              </a>
              <Link to="/login">
                <Button className="rounded-none h-9 px-5 bg-[#ccff00] text-black font-mono text-xs uppercase tracking-wider hover:bg-[#b3e600] transition-all">
                  Entrar <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section with Spiral Animation */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Spiral Animation Background */}
          <div className="absolute inset-0 z-0 opacity-40">
            <SpiralAnimation />
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#09090b] via-transparent to-[#09090b]" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#09090b]/80 via-transparent to-[#09090b]/80" />
          <div className="absolute bottom-0 left-0 right-0 h-40 z-[1] bg-gradient-to-t from-[#09090b] to-transparent" />

          <div className="relative z-10 container mx-auto px-6 lg:px-8 max-w-6xl text-center pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#ccff00]/30 bg-[#ccff00]/5 backdrop-blur-sm mx-auto">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
                <span className="font-mono text-[11px] text-[#ccff00] uppercase tracking-[0.2em]">
                  Sistema de Produtividade v2.4
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-white font-display uppercase">
                Domine Suas<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] via-[#e6ff80] to-[#ccff00]">
                  Prioridades
                </span>
              </h1>

              <p className="text-[#a1a1aa] text-base md:text-lg font-mono max-w-2xl mx-auto leading-relaxed">
                Sistema tático baseado na Matriz de Eisenhower. Classifique por urgência
                e importância. Maximize sua eficiência operacional.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link to="/login">
                  <Button className="h-14 px-10 bg-[#ccff00] text-black font-mono text-sm uppercase tracking-wider hover:bg-[#b3e600] transition-all rounded-none group">
                    <span className="flex items-center gap-2">
                      Acessar Sistema
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="ghost" className="h-14 px-8 font-mono text-sm text-[#a1a1aa] hover:text-white hover:bg-[#18181b] rounded-none border border-[#27272a] uppercase tracking-wider">
                    Explorar Recursos
                  </Button>
                </a>
              </div>

              {/* Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-12"
              >
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 p-4 border border-[#27272a]/50 bg-[#09090b]/50 backdrop-blur-sm"
                  >
                    <div className="text-[#ccff00]">{stat.icon}</div>
                    <span className="text-2xl md:text-3xl font-bold text-white font-display">{stat.value}</span>
                    <span className="font-mono text-[10px] text-[#71717a] uppercase tracking-widest">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ChevronDown className="w-6 h-6 text-[#52525b]" />
            </motion.div>
          </div>
        </section>

        {/* Matrix Preview Section */}
        <section className="py-20 md:py-28 bg-[#09090b] border-t border-[#27272a]/30 relative overflow-hidden">
          <div className="absolute inset-0 industrial-grid opacity-10 pointer-events-none" />
          <div className="container mx-auto px-6 lg:px-8 max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <span className="font-mono text-xs text-[#ccff00] tracking-[0.15em] uppercase">&gt; Visualização Inteligente</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white uppercase font-display tracking-tight leading-tight">
                  Quatro Quadrantes.<br />
                  <span className="text-[#ccff00]">Controle Total.</span>
                </h2>
                <p className="font-mono text-sm text-[#a1a1aa] leading-relaxed max-w-lg">
                  A Matriz de Eisenhower divide suas tarefas em quatro categorias estratégicas,
                  permitindo foco no que realmente importa e eliminação do ruído operacional.
                </p>
                <div className="space-y-3 pt-4">
                  {[
                    { color: "#ff5555", label: "Fazer Agora", desc: "Urgente + Importante" },
                    { color: "#8be9fd", label: "Agendar", desc: "Importante + Não Urgente" },
                    { color: "#f1fa8c", label: "Delegar", desc: "Urgente + Não Importante" },
                    { color: "#bd93f9", label: "Eliminar", desc: "Não Urgente + Não Importante" }
                  ].map((q, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border border-[#27272a]/50 bg-[#18181b]/50 hover:border-[#27272a] transition-colors group">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: q.color }} />
                      <div className="flex-1">
                        <span className="text-sm font-bold text-white uppercase">{q.label}</span>
                        <span className="font-mono text-xs text-[#71717a] ml-3">{q.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Matrix Visual */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-[#ccff00]/5 to-transparent blur-3xl" />
                <div className="relative grid grid-cols-2 gap-2">
                  {[
                    { title: "FAZER", color: "#ff5555", items: ["Relatório urgente", "Bug crítico", "Reunião cliente"] },
                    { title: "AGENDAR", color: "#8be9fd", items: ["Planejamento Q2", "Curso online", "Revisão código"] },
                    { title: "DELEGAR", color: "#f1fa8c", items: ["Emails rotina", "Updates docs", "Backup dados"] },
                    { title: "ELIMINAR", color: "#bd93f9", items: ["Redes sociais", "Reunião vaga", "Notificações"] }
                  ].map((quad, i) => (
                    <div
                      key={i}
                      className="p-5 border border-[#27272a] bg-[#18181b]/80 backdrop-blur-sm hover:border-opacity-60 transition-all duration-300 group"
                      style={{ borderColor: `${quad.color}20`, }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: quad.color }} />
                        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: quad.color }}>
                          {quad.title}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {quad.items.map((item, j) => (
                          <div key={j} className="flex items-center gap-2 py-1.5 px-2 bg-[#09090b]/50 border border-[#27272a]/30">
                            <div className="w-1 h-1 rounded-full bg-[#52525b]" />
                            <span className="font-mono text-[11px] text-[#a1a1aa]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-[#0c0c0e] border-t border-[#27272a]/30">
          <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="font-mono text-xs text-[#ccff00] mb-4 block tracking-[0.2em] uppercase">&gt; Módulos do Sistema</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase font-display tracking-tight leading-tight mb-6">
                Funcionalidades
              </h2>
              <p className="font-mono text-sm text-[#71717a] max-w-xl mx-auto">
                Ferramentas projetadas para controle absoluto sobre o fluxo de trabalho.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <Card
                    className={`bg-[#18181b] border rounded-none transition-all duration-500 group p-8 h-full cursor-default ${
                      activeFeature === idx
                        ? 'border-[#ccff00]/50 shadow-[0_0_30px_rgba(204,255,0,0.06)]'
                        : 'border-[#27272a] hover:border-[#3f3f46]'
                    }`}
                  >
                    <CardHeader className="p-0 space-y-5">
                      <div className={`w-16 h-16 flex items-center justify-center transition-all duration-500 ${
                        activeFeature === idx ? 'bg-[#ccff00] text-black' : 'bg-[#27272a] text-[#ccff00]'
                      }`}>
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl font-bold text-white uppercase font-display tracking-wide">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="font-mono text-sm text-[#a1a1aa] leading-relaxed">
                        {feature.desc}
                      </CardDescription>
                      <div className={`overflow-hidden transition-all duration-500 ${
                        activeFeature === idx ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="pt-4 border-t border-[#27272a]">
                          <p className="font-mono text-xs text-[#ccff00]">{feature.detail}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / CTA */}
        <section className="py-16 border-t border-[#27272a]/30 bg-[#09090b] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ccff00]/3 via-transparent to-[#ccff00]/3" />
          <div className="container mx-auto px-6 lg:px-8 max-w-4xl relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white uppercase font-display tracking-tight">
                Pronto para <span className="text-[#ccff00]">otimizar</span> sua produtividade?
              </h2>
              <p className="font-mono text-sm text-[#a1a1aa] max-w-lg mx-auto">
                Comece a organizar suas tarefas com a metodologia mais eficiente do mundo.
                Grátis para começar, poderoso para escalar.
              </p>
              <Link to="/login">
                <Button className="h-14 px-12 bg-[#ccff00] text-black font-mono text-sm uppercase tracking-wider hover:bg-[#b3e600] transition-all rounded-none mt-4 group">
                  <span className="flex items-center gap-2">
                    Começar Agora
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 border-t border-[#27272a]/30 bg-[#0c0c0e]">
          <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="font-mono text-xs text-[#ccff00] mb-3 block tracking-[0.15em] uppercase">&gt; Canal de Comunicação</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white uppercase font-display tracking-tight mb-6">
                  Iniciar Transmissão
                </h2>
                <p className="font-mono text-sm text-[#a1a1aa] mb-10 max-w-md leading-relaxed">
                  Envie relatórios, solicitações de recursos ou dúvidas operacionais.
                  Nossa equipe responderá assim que possível.
                </p>

                <div className="space-y-5">
                  {[
                    { icon: <Mail className="w-5 h-5 text-[#ccff00]" />, title: "Contato Eletrônico", value: "felixskmarcio2@gmail.com" },
                    { icon: <Phone className="w-5 h-5 text-[#ccff00]" />, title: "Linha Direta", value: "+55 82 9.9827-4851" },
                    { icon: <MapPin className="w-5 h-5 text-[#ccff00]" />, title: "Base de Operações", value: "Penedo, AL - BRASIL" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="bg-[#18181b] p-2.5 border border-[#27272a] group-hover:border-[#ccff00]/30 transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-white uppercase text-sm mb-1">{item.title}</h4>
                        <p className="font-mono text-xs text-[#a1a1aa]">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-10">
                  {[Github, Linkedin, Twitter].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 border border-[#27272a] flex items-center justify-center hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all text-[#a1a1aa] group">
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-[#18181b] border border-[#27272a] p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ccff00] to-transparent" />
                <h3 className="text-xl font-bold text-white uppercase font-display mb-8 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#ccff00]" />
                  Enviar Mensagem
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] uppercase tracking-widest text-[#71717a]">Nome</Label>
                    <div className="input-industrial">
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border-none bg-transparent h-12 rounded-none placeholder:text-[#3f3f46] font-mono text-sm"
                        placeholder="SEU NOME"
                        required
                        data-testid="input-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] uppercase tracking-widest text-[#71717a]">Email</Label>
                    <div className="input-industrial">
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-none bg-transparent h-12 rounded-none placeholder:text-[#3f3f46] font-mono text-sm"
                        placeholder="SEU@EMAIL.COM"
                        required
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] uppercase tracking-widest text-[#71717a]">Mensagem</Label>
                    <div className="input-industrial h-auto">
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="border-none bg-transparent min-h-[120px] rounded-none placeholder:text-[#3f3f46] resize-none focus-visible:ring-0 font-mono text-sm"
                        placeholder="SUA MENSAGEM..."
                        required
                        data-testid="input-message"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-[#ccff00] text-black font-mono text-sm uppercase tracking-wider hover:bg-[#b3e600] rounded-none mt-2"
                    disabled={isSubmitting}
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">Enviando...</span>
                    ) : (
                      <span className="flex items-center gap-2">Enviar <Send className="w-4 h-4 ml-1" /></span>
                    )}
                  </Button>

                  {submitStatus === 'success' && (
                    <div className="bg-[#ccff00]/10 border border-[#ccff00]/30 p-3">
                      <p className="font-mono text-xs text-[#ccff00] text-center">Mensagem enviada com sucesso</p>
                    </div>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#27272a]/30 bg-[#09090b] py-10">
          <div className="container mx-auto px-6 md:px-8 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#ccff00] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-black" />
                </div>
                <span className="font-mono text-sm text-white uppercase tracking-wide">
                  Eisenhower<span className="text-[#ccff00]">.SYS</span>
                </span>
              </div>
              <div className="text-center md:text-right">
                <p className="font-mono text-xs text-[#52525b] uppercase tracking-wider">
                  &copy; 2026 Eisenhower Task Manager
                </p>
                <p className="font-mono text-[10px] text-[#3f3f46] uppercase mt-1">
                  Protocolo Seguro v2.4
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Landing;