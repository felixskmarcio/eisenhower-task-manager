import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { InfoIcon, PlayCircle, ArrowRight, LogIn, Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, User, MessageSquare, Terminal, Cpu, Activity, ShieldCheck, Database, LayoutGrid } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import AppLogo from '../components/ui/app-logo';

const Landing = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio do formulário
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

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans relative overflow-x-hidden selection:bg-[#ccff00] selection:text-black">
      {/* Industrial Grid Background */}
      <div className="fixed inset-0 z-0 industrial-grid opacity-20 pointer-events-none" />

      <div className="relative z-10">
        {/* Navigation / Header */}
        <header className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-sm fixed top-0 w-full z-50">
          <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ccff00] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold tracking-tight text-white text-lg uppercase font-display">EISENHOWER<span className="text-[#ccff00]">.SYS</span></span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-6 border-r border-[#27272a] pr-6 mr-2">
                <a href="#features" className="text-xs font-mono text-[#a1a1aa] hover:text-white uppercase transition-colors">Recursos</a>
                <a href="#contact" className="text-xs font-mono text-[#a1a1aa] hover:text-white uppercase transition-colors">Comunicação</a>
              </div>

              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button variant="ghost" className="rounded-none h-8 font-mono text-xs hover:bg-[#27272a] hover:text-white text-[#ccff00]">
                    ENTRAR_
                  </Button>
                </Link>
                <Link to="/login" state={{ activateSignup: true }}>
                  <Button className="rounded-none h-8 bg-[#ccff00] hover:bg-[#b3e600] text-black font-mono text-xs font-bold px-4">
                    INICIAR_ACESSO
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-3 pl-2 border-l border-[#27272a]">
                <div className="bg-[#18181b] border border-[#27272a] px-3 py-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#ccff00] rounded-sm animate-pulse" />
                  <span className="font-mono text-[10px] text-[#ccff00]">SYS.ONLINE</span>
                </div>
                <div className="bg-[#18181b] border border-[#27272a] px-3 py-1">
                  <span className="font-mono text-[10px] text-[#71717a]">V.2.4.0-RC</span>
                </div>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-36 pb-20 md:pt-48 md:pb-32 border-b border-[#27272a]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#27272a] bg-[#18181b]">
                  <span className="font-mono text-[10px] text-[#ccff00] uppercase tracking-wider">Protocolo de Produtividade</span>
                </div>

                <motion.h1
                  className="text-5xl md:text-7xl font-bold tracking-tighter leading-none text-white font-display uppercase"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Gerencie <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#ffffff]">O Caos</span>
                </motion.h1>

                <motion.p
                  className="text-[#a1a1aa] text-lg font-mono max-w-xl leading-relaxed border-l-2 border-[#ccff00] pl-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Sistema de priorização tática baseado na Matriz de Eisenhower.
                  Classifique operações por urgência e importância para maximizar a eficiência operacional.
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/login">
                    <Button className="h-14 px-8 btn-industrial btn-industrial-primary text-black text-sm">
                      <span className="flex items-center gap-2">
                        ACESSAR SISTEMA <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </Link>

                </motion.div>
              </div>

              {/* Technical Illustration / Code Block */}
              <div className="relative hidden lg:block">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ccff00] to-[#27272a] opacity-20 blur-lg"></div>
                <div className="relative bg-[#09090b] border border-[#27272a] p-2">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#27272a] bg-[#18181b]">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27272a]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27272a]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27272a]"></div>
                    </div>
                    <span className="font-mono text-[10px] text-[#52525b]">matrix_core.tsx</span>
                  </div>
                  <div className="p-6 font-mono text-xs md:text-sm text-[#a1a1aa] leading-relaxed">
                    <p><span className="text-[#ccff00]">const</span> EisenhowerMatrix = <span className="text-[#ccff00]">{`{`}</span></p>
                    <p className="pl-4">quadrant_1: <span className="text-white">"FAZER_AGORA"</span>, <span className="text-[#52525b]">// Urgente + Importante</span></p>
                    <p className="pl-4">quadrant_2: <span className="text-white">"AGENDAR"</span>, <span className="text-[#52525b]">// !Urgente + Importante</span></p>
                    <p className="pl-4">quadrant_3: <span className="text-white">"DELEGAR"</span>, <span className="text-[#52525b]">// Urgente + !Importante</span></p>
                    <p className="pl-4">quadrant_4: <span className="text-white">"ELIMINAR"</span> <span className="text-[#52525b]">// !Urgente + !Importante</span></p>
                    <p><span className="text-[#ccff00]">{`}`}</span>;</p>
                    <br />
                    <p><span className="text-[#ccff00]">function</span> optimizeProductivity(tasks) <span className="text-[#ccff00]">{`{`}</span></p>
                    <p className="pl-4">return tasks.filter(t =&gt; t.prioridade === <span className="text-[#ccff00]">MAX</span>);</p>
                    <p><span className="text-[#ccff00]">{`}`}</span></p>
                    <br />
                    <div className="flex items-center gap-2 mt-4 text-[#ccff00] animate-pulse">
                      <span>{`>`}</span>
                      <span className="cursor-block bg-[#ccff00] w-2 h-4 inline-block"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-[#09090b]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <span className="font-mono text-xs text-[#ccff00] mb-2 block">&gt; FUNCIONALIDADES DO SISTEMA</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white uppercase font-display tracking-tight">Módulos Operacionais</h2>
              </div>
              <div className="md:max-w-xs text-right">
                <p className="font-mono text-xs text-[#71717a]">Ferramentas projetadas para controle absoluto sobre o fluxo de trabalho.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <LayoutGrid className="w-6 h-6 text-[#ccff00]" />,
                  title: "Matriz Tática",
                  desc: "Visualização em quatro quadrantes para tomada de decisão imediata sobre prioridades."
                },
                {
                  icon: <ShieldCheck className="w-6 h-6 text-[#ccff00]" />,
                  title: "Autenticação Segura",
                  desc: "Proteção de dados com criptografia de ponta e login via provedores confiáveis."
                },
                {
                  icon: <Database className="w-6 h-6 text-[#ccff00]" />,
                  title: "Sync em Nuvem",
                  desc: "Persistência de dados em tempo real. Acesse suas operações de qualquer terminal."
                }
              ].map((feature, idx) => (
                <Card key={idx} className="bg-[#18181b] border border-[#27272a] rounded-none hover:border-[#ccff00] transition-colors group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-[#27272a] flex items-center justify-center mb-4 group-hover:bg-[#ccff00] transition-colors">
                      <div className="group-hover:text-black transition-colors">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-white uppercase font-display">{feature.title}</CardTitle>
                    <CardDescription className="font-mono text-xs text-[#a1a1aa] mt-2">
                      {feature.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 border-t border-[#27272a] bg-[#0c0c0e]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <span className="font-mono text-xs text-[#ccff00] mb-2 block">&gt; CANAL DE COMUNICAÇÃO</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white uppercase font-display tracking-tight mb-6">Iniciar Transmissão</h2>
                <p className="font-mono text-sm text-[#a1a1aa] mb-10 max-w-md">
                  Envie relatórios de bugs, solicitações de recursos ou dúvidas operacionais. Nossa equipe responderá assim que possível.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#18181b] p-3 border border-[#27272a]">
                      <Mail className="w-5 h-5 text-[#ccff00]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase text-sm mb-1">Ponto de Contato Eletrônico</h4>
                      <p className="font-mono text-xs text-[#a1a1aa]">felixskmarcio2@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-[#18181b] p-3 border border-[#27272a]">
                      <Phone className="w-5 h-5 text-[#ccff00]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase text-sm mb-1">Linha Direta</h4>
                      <p className="font-mono text-xs text-[#a1a1aa]">+55 82 9.9827-4851</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-[#18181b] p-3 border border-[#27272a]">
                      <MapPin className="w-5 h-5 text-[#ccff00]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase text-sm mb-1">Base de Operações</h4>
                      <p className="font-mono text-xs text-[#a1a1aa]">Penedo, AL - BRASIL</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  {[Github, Linkedin, Twitter].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 border border-[#27272a] flex items-center justify-center hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all text-[#a1a1aa]">
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="bg-[#18181b] border border-[#27272a] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-1 bg-[#ccff00]"></div>
                <h3 className="text-xl font-bold text-white uppercase font-display mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#ccff00]" />
                  Formulário de Mensagem
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] uppercase tracking-widest text-[#71717a]">Identificação (Nome)</Label>
                    <div className="input-industrial">
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border-none bg-transparent h-12 rounded-none placeholder:text-[#3f3f46]"
                        placeholder="DIGITE SEU NOME"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] uppercase tracking-widest text-[#71717a]">Endereço de Retorno (Email)</Label>
                    <div className="input-industrial">
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-none bg-transparent h-12 rounded-none placeholder:text-[#3f3f46]"
                        placeholder="USUARIO@DOMINIO.COM"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] uppercase tracking-widest text-[#71717a]">Dados da Mensagem</Label>
                    <div className="input-industrial h-auto">
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="border-none bg-transparent min-h-[120px] rounded-none placeholder:text-[#3f3f46] resize-none focus-visible:ring-0"
                        placeholder="INICIAR TRANSMISSÃO DE TEXTO..."
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 btn-industrial btn-industrial-primary mt-4 text-black text-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">TRANSMITINDO...</span>
                    ) : (
                      <span className="flex items-center gap-2">ENVIAR DADOS <Send className="w-4 h-4 ml-2" /></span>
                    )}
                  </Button>

                  {submitStatus === 'success' && (
                    <div className="bg-[#ccff00]/10 border border-[#ccff00] p-3">
                      <p className="font-mono text-xs text-[#ccff00] text-center">✓ TRANSMISSÃO CONCLUÍDA COM SUCESSO</p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#27272a] bg-[#09090b] py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
              <Cpu className="w-4 h-4 text-[#a1a1aa]" />
              <span className="font-mono text-xs text-[#a1a1aa]">SYSTEM STATUS: NOMINAL</span>
            </div>
            <p className="font-mono text-[10px] text-[#52525b] uppercase">
              © 2025 Eisenhower Task Manager. Todos os direitos reservados. Protocolo Seguro v2.4
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Landing;