import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Clock, ArrowRight, Mail, Lock, User, Sparkles, Eye, EyeOff, Check, Shield, Zap, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { toast } from '../hooks/use-toast';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import LoginErrorDisplay from '../components/LoginErrorDisplay';
import { useLocation } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Digite um e-mail valido'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres')
});

const signupSchema = z.object({
  nome: z.string().min(3, 'O nome precisa ter pelo menos 3 caracteres'),
  email: z.string().email('Digite um e-mail valido'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres')
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'As senhas nao conferem'
});

const resetPasswordSchema = z.object({
  email: z.string().email('Digite um e-mail valido')
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const AuthPage: React.FC = () => {
  const { signIn, signUp, signInWithGoogle, resetPassword, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { isDarkTheme } = useTheme();
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [loginError, setLoginError] = useState<{email: string, code?: string, message?: string} | null>(null);
  const location = useLocation();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nome: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const loginPasswordValue = loginForm.watch('password');
  const signupPasswordValue = signupForm.watch('password');
  const signupConfirmPasswordValue = signupForm.watch('confirmPassword');

  useEffect(() => {
    const state = location.state as any;
    if (state?.activateSignup) {
      setActiveTab('signup');
      if (state.email) {
        signupForm.setValue('email', state.email);
      }
    }
  }, [location, signupForm]);

  const onLoginSubmit = async (values: LoginFormValues) => {
    setLoginError(null);
    try {
      await signIn(values.email, values.password);
    } catch (error: any) {
      setLoginError({
        email: values.email,
        code: error.code,
        message: error.message
      });
    }
  };

  const onSignupSubmit = async (values: SignupFormValues) => {
    await signUp(values.email, values.password, values.nome);
  };

  const onResetPasswordSubmit = async (values: ResetPasswordFormValues) => {
    setResetPasswordLoading(true);
    try {
      await resetPassword(values.email);
      setResetPasswordOpen(false);
      resetPasswordForm.reset();
      toast({
        title: "Email de recuperacao enviado!",
        description: (
          <div className="mt-2 space-y-2">
            <p>Enviamos um link de recuperacao para <strong>{values.email}</strong></p>
            <p className="text-xs text-muted-foreground">
              Verifique sua caixa de entrada e spam. O link expira em 1 hora.
            </p>
          </div>
        ),
      });
    } catch (error) {
      console.error("Erro ao enviar email de redefinicao:", error);
      toast({
        title: "Erro ao enviar email",
        description: "Nao foi possivel enviar o email de recuperacao. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLoginTryAgain = () => {
    setLoginError(null);
  };

  const handleResetPasswordFromError = () => {
    if (loginError?.email) {
      resetPasswordForm.setValue('email', loginError.email);
      setResetPasswordOpen(true);
    }
  };

  const features = [
    { icon: Target, title: "Matriz Eisenhower", desc: "Priorize tarefas por urgencia e importancia" },
    { icon: Zap, title: "Produtividade", desc: "Aumente seu foco e eficiencia diaria" },
    { icon: Shield, title: "Seguro", desc: "Seus dados protegidos e sincronizados" },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Eisenhower Matrix</span>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Organize seu tempo,<br />
              <span className="text-white/90">conquiste seus objetivos</span>
            </h1>
            
            <p className="text-lg text-white/80 mb-12 max-w-md leading-relaxed">
              A metodologia usada por lideres mundiais para priorizar tarefas e maximizar resultados.
            </p>

            <div className="space-y-5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-white/70">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-12 xl:left-20 text-white/50 text-sm">
          2024 Eisenhower Matrix. Todos os direitos reservados.
        </div>
      </div>

      <div className={`flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 ${isDarkTheme ? 'bg-background' : 'bg-slate-50'}`}>
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Eisenhower Matrix</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {activeTab === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
              </h2>
              <p className="text-muted-foreground">
                {activeTab === 'login' 
                  ? 'Entre para acessar suas tarefas' 
                  : 'Comece a organizar suas tarefas agora'}
              </p>
            </div>

            <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-8">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid="tab-login"
              >
                Entrar
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'signup'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid="tab-signup"
              >
                Cadastrar
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {loginError && (
                    <LoginErrorDisplay 
                      email={loginError.email}
                      errorCode={loginError.code}
                      errorMessage={loginError.message}
                      onTryAgain={handleLoginTryAgain}
                      onResetPassword={handleResetPasswordFromError}
                    />
                  )}
                  
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                      <FormField 
                        control={loginForm.control} 
                        name="email" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">E-mail</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="seu@email.com" 
                                  className="h-12 pl-11 bg-background border-border/60 focus:border-primary transition-colors"
                                  data-testid="input-login-email"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      
                      <FormField 
                        control={loginForm.control} 
                        name="password" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type={showLoginPassword ? "text" : "password"} 
                                  placeholder="Digite sua senha" 
                                  className="h-12 pl-11 pr-11 bg-background border-border/60 focus:border-primary transition-colors"
                                  data-testid="input-login-password"
                                  {...field} 
                                />
                                {loginPasswordValue && loginPasswordValue.length > 0 && (
                                  <button 
                                    type="button"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    tabIndex={-1}
                                    data-testid="button-toggle-login-password"
                                  >
                                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      
                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                            data-testid="checkbox-remember"
                          />
                          <span className="text-sm text-muted-foreground">Lembrar-me</span>
                        </label>
                        <button 
                          type="button"
                          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors" 
                          onClick={() => setResetPasswordOpen(true)}
                          data-testid="button-forgot-password"
                        >
                          Esqueci a senha
                        </button>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-medium mt-2"
                        disabled={loading}
                        data-testid="button-login-submit"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Entrando...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Entrar
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                      <FormField 
                        control={signupForm.control} 
                        name="nome" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">Nome</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="Seu nome completo" 
                                  className="h-12 pl-11 bg-background border-border/60 focus:border-primary transition-colors"
                                  data-testid="input-signup-name"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      
                      <FormField 
                        control={signupForm.control} 
                        name="email" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">E-mail</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="seu@email.com" 
                                  className="h-12 pl-11 bg-background border-border/60 focus:border-primary transition-colors"
                                  data-testid="input-signup-email"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      
                      <FormField 
                        control={signupForm.control} 
                        name="password" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type={showSignupPassword ? "text" : "password"} 
                                  placeholder="Minimo 6 caracteres" 
                                  className="h-12 pl-11 pr-11 bg-background border-border/60 focus:border-primary transition-colors"
                                  data-testid="input-signup-password"
                                  {...field} 
                                />
                                {signupPasswordValue && signupPasswordValue.length > 0 && (
                                  <button 
                                    type="button"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                                    tabIndex={-1}
                                    data-testid="button-toggle-signup-password"
                                  >
                                    {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      
                      <FormField 
                        control={signupForm.control} 
                        name="confirmPassword" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">Confirmar Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type={showSignupConfirmPassword ? "text" : "password"} 
                                  placeholder="Repita a senha" 
                                  className="h-12 pl-11 pr-11 bg-background border-border/60 focus:border-primary transition-colors"
                                  data-testid="input-signup-confirm-password"
                                  {...field} 
                                />
                                {signupConfirmPasswordValue && signupConfirmPasswordValue.length > 0 && (
                                  <button 
                                    type="button"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                                    tabIndex={-1}
                                    data-testid="button-toggle-signup-confirm-password"
                                  >
                                    {showSignupConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-medium mt-2"
                        disabled={loading}
                        data-testid="button-signup-submit"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Criando conta...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Criar conta
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center">
                <span className={`px-4 text-sm text-muted-foreground ${isDarkTheme ? 'bg-background' : 'bg-slate-50'}`}>
                  ou continue com
                </span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-12 border-border/60 hover:bg-muted/50 transition-colors"
              onClick={handleGoogleLogin} 
              disabled={googleLoading}
              data-testid="button-google-login"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 mr-3">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              <span className="font-medium">
                {activeTab === 'login' ? 'Entrar com Google' : 'Cadastrar com Google'}
              </span>
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-8">
              {activeTab === 'login' ? (
                <>
                  Nao tem uma conta?{' '}
                  <button 
                    onClick={() => setActiveTab('signup')}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                    data-testid="link-to-signup"
                  >
                    Cadastre-se
                  </button>
                </>
              ) : (
                <>
                  Ja tem uma conta?{' '}
                  <button 
                    onClick={() => setActiveTab('login')}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                    data-testid="link-to-login"
                  >
                    Entre aqui
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </div>
      </div>

      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 mb-4">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold">
              Esqueceu sua senha?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Digite seu email e enviaremos um link para criar uma nova senha.
            </DialogDescription>
          </DialogHeader>
          <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-5 mt-4">
              <FormField
                control={resetPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Seu e-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="seu@email.com" 
                          className="h-12 pl-11 bg-background border-border/60 focus:border-primary" 
                          {...field} 
                          data-testid="input-reset-email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-muted/40 rounded-lg p-4 text-sm text-muted-foreground space-y-2">
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                  Verifique sua caixa de entrada
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                  Clique no link do email
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                  Crie sua nova senha
                </p>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setResetPasswordOpen(false)}
                  className="w-full sm:w-auto h-11"
                  data-testid="button-cancel-reset"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={resetPasswordLoading}
                  className="w-full sm:w-auto h-11 font-medium"
                  data-testid="button-send-reset"
                >
                  {resetPasswordLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Enviar link
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthPage;
