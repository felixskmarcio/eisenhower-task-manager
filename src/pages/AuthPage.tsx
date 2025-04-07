
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Clock, ArrowRight, Mail, Lock, User, LogIn, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

// Esquemas de validação
const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres')
});

const signupSchema = z.object({
  nome: z.string().min(3, 'O nome precisa ter pelo menos 3 caracteres'),
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres')
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'As senhas não conferem'
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const AuthPage: React.FC = () => {
  const { signIn, signUp, signInWithGoogle, loading, user } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { isDarkTheme } = useTheme();

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

  const onLoginSubmit = async (values: LoginFormValues) => {
    await signIn(values.email, values.password);
  };

  const onSignupSubmit = async (values: SignupFormValues) => {
    await signUp(values.email, values.password, values.nome);
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

  const fillTestCredentials = () => {
    loginForm.setValue('email', 'teste@example.com');
    loginForm.setValue('password', 'senha123');
  };

  // Variantes para animações
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Fundo animado */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-base-100 to-secondary/20"></div>
        
        {/* Padrão de fundo */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDIiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-10"></div>
        
        {/* Círculos decorativos */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-secondary/20 to-primary/10 blur-3xl opacity-50 animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
        
        {/* Partículas brilhantes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/50 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-3/4 left-2/3 w-3 h-3 bg-secondary/50 rounded-full blur-sm animate-pulse" style={{
        animationDelay: '0.5s'
      }}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-primary/50 rounded-full blur-sm animate-pulse" style={{
        animationDelay: '1.5s'
      }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-secondary/50 rounded-full blur-sm animate-pulse" style={{
        animationDelay: '2s'
      }}></div>
      </div>
      
      <motion.div className="w-full max-w-md" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div className="mb-8 text-center" variants={itemVariants}>
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30 z-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 animate-gradient-shift"></div>
              <Clock className="w-8 h-8 text-white relative z-10" />
              <div className="absolute -inset-1 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80 tracking-tight">
            Eisenhower Matrix
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
            Organize suas tarefas com a eficiente metodologia da Matriz de Eisenhower.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 rounded-full p-1.5 shadow-xl bg-background/50 backdrop-blur-md border border-white/10">
              <TabsTrigger value="login" className={`
                  data-[state=active]:bg-gradient-to-r 
                  data-[state=active]:from-primary 
                  data-[state=active]:to-primary/90 
                  data-[state=active]:text-white 
                  data-[state=active]:shadow-lg 
                  data-[state=active]:backdrop-blur-lg
                  rounded-full transition-all duration-500 font-medium text-base py-3 relative overflow-hidden group
                `}>
                <span className="relative z-10">Entrar</span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-primary/80 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              </TabsTrigger>
              <TabsTrigger value="signup" className={`
                  data-[state=active]:bg-gradient-to-r 
                  data-[state=active]:from-primary 
                  data-[state=active]:to-primary/90 
                  data-[state=active]:text-white 
                  data-[state=active]:shadow-lg
                  data-[state=active]:backdrop-blur-lg
                  rounded-full transition-all duration-500 font-medium text-base py-3 relative overflow-hidden group
                `}>
                <span className="relative z-10">Cadastrar</span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-primary/80 rounded-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.3
            }}>
                <Card className={`
                  border-none shadow-2xl 
                  ${isDarkTheme ? 'bg-background/60' : 'bg-background/95'} 
                  backdrop-blur-xl rounded-2xl overflow-hidden
                  border border-white/10
                `}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                      Fazer Login
                    </CardTitle>
                    <CardDescription className="text-muted-foreground/80">
                      Entre com seu e-mail e senha para acessar sua conta
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField control={loginForm.control} name="email" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>E-mail</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                                  <Input placeholder="seu@email.com" className="pl-10 ring-offset-background focus-visible:ring-primary/20 transition-all duration-200 border-input/50 focus:border-primary" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={loginForm.control} name="password" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                                  <Input type="password" placeholder="••••••" className="pl-10 ring-offset-background focus-visible:ring-primary/20 transition-all duration-200 border-input/50 focus:border-primary" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <Button type="submit" className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium text-base relative overflow-hidden group shadow-lg shadow-primary/20 animate-gradient-shift" disabled={loading}>
                          <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
                          <span className="relative flex items-center justify-center gap-1 font-medium">
                            {loading ? <span className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Entrando...
                              </span> : <>
                                Entrar
                                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </>}
                          </span>
                        </Button>
                        
                        <div className="relative my-7">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-input/40" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className={`${isDarkTheme ? 'bg-background/70' : 'bg-card'} px-3 text-muted-foreground`}>
                              ou continue com
                            </span>
                          </div>
                        </div>
                        
                        <Button type="button" variant="outline" className="w-full h-12 relative group overflow-hidden border-input/50 hover:border-primary/30 shadow-md transition-all duration-300" onClick={handleGoogleLogin} disabled={googleLoading}>
                          <span className="absolute inset-0 w-0 bg-gradient-to-r from-red-50/20 via-white/10 to-blue-50/20 transition-all duration-500 ease-out group-hover:w-full"></span>
                          <span className="relative flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 mr-3">
                              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </svg>
                            <span className="font-medium text-base text-slate-900 dark:text-slate-200">Entrar com Google</span>
                          </span>
                        </Button>
                        
                        <div className="mt-6 text-center">
                          <button 
                            type="button" 
                            onClick={fillTestCredentials}
                            className="text-xs text-muted-foreground/70 hover:text-primary transition-colors duration-200"
                          >
                            Usar credenciais de teste
                          </button>
                        </div>
                        
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="signup">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.3
            }}>
                <Card className={`
                  border-none shadow-2xl 
                  ${isDarkTheme ? 'bg-background/60' : 'bg-background/95'} 
                  backdrop-blur-xl rounded-2xl overflow-hidden
                  border border-white/10
                `}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                      Criar Conta
                    </CardTitle>
                    <CardDescription className="text-muted-foreground/80">
                      Preencha seus dados para criar uma nova conta
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...signupForm}>
                      <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                        <FormField control={signupForm.control} name="nome" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                                  <Input placeholder="Seu nome completo" className="pl-10 ring-offset-background focus-visible:ring-primary/20 transition-all duration-200 border-input/50 focus:border-primary" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={signupForm.control} name="email" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>E-mail</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                                  <Input placeholder="seu@email.com" className="pl-10 ring-offset-background focus-visible:ring-primary/20 transition-all duration-200 border-input/50 focus:border-primary" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={signupForm.control} name="password" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                                  <Input type="password" placeholder="••••••" className="pl-10 ring-offset-background focus-visible:ring-primary/20 transition-all duration-200 border-input/50 focus:border-primary" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={signupForm.control} name="confirmPassword" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>Confirmar Senha</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                                  <Input type="password" placeholder="••••••" className="pl-10 ring-offset-background focus-visible:ring-primary/20 transition-all duration-200 border-input/50 focus:border-primary" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <Button type="submit" className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium text-base relative overflow-hidden group shadow-lg shadow-primary/20 animate-gradient-shift" disabled={loading}>
                          <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
                          <span className="relative flex items-center justify-center font-medium">
                            {loading ? <span className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Criando conta...
                              </span> : 'Criar conta'}
                          </span>
                        </Button>
                        
                        <div className="relative my-7">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-input/40" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className={`${isDarkTheme ? 'bg-background/70' : 'bg-card'} px-3 text-muted-foreground`}>
                              ou continue com
                            </span>
                          </div>
                        </div>
                        
                        <Button type="button" variant="outline" className="w-full h-12 relative group overflow-hidden border-input/50 hover:border-primary/30 shadow-md transition-all duration-300" onClick={handleGoogleLogin} disabled={googleLoading}>
                          <span className="absolute inset-0 w-0 bg-gradient-to-r from-red-50/20 via-white/10 to-blue-50/20 transition-all duration-500 ease-out group-hover:w-full"></span>
                          <span className="relative flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 mr-3">
                              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </svg>
                            <span className="font-medium text-base text-slate-800 dark:text-slate-200">Cadastrar com Google</span>
                          </span>
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
