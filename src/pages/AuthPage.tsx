import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Loader2, AlertTriangle, Terminal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { toast } from '../hooks/use-toast';
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
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { AuthHero } from '../components/auth/AuthHero';
import { IndustrialTabs } from '../components/auth/IndustrialTabs';

const loginSchema = z.object({
  email: z.string().email('INVALID EMAIL FORMAT'),
  password: z.string().min(6, 'MIN LENGTH 6 CHARS')
});

const signupSchema = z.object({
  nome: z.string().min(3, 'MIN LEGNTH 3 CHARS'),
  email: z.string().email('INVALID EMAIL FORMAT'),
  password: z.string().min(6, 'MIN LENGTH 6 CHARS'),
  confirmPassword: z.string().min(6, 'MIN LENGTH 6 CHARS')
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'PASSWORD MISMATCH'
});

const resetPasswordSchema = z.object({
  email: z.string().email('INVALID EMAIL FORMAT')
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const AuthPage: React.FC = () => {
  const { signIn, signUp, signInWithGoogle, resetPassword, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [loginError, setLoginError] = useState<{ email: string, code?: string, message?: string } | null>(null);
  const location = useLocation();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { nome: '', email: '', password: '', confirmPassword: '' }
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' }
  });

  useEffect(() => {
    const state = location.state as any;
    if (state?.activateSignup) setActiveTab('signup');
  }, [location]);

  const onLoginSubmit = async (values: LoginFormValues) => {
    setLoginError(null);
    try {
      await signIn(values.email, values.password);
    } catch (error: any) {
      setLoginError({ email: values.email, code: error.code, message: error.message });
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
      toast({ title: "RECOVERY LINK SENT" });
    } catch (error) {
      toast({ title: "ERROR SENDING MAIL", variant: "destructive" });
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex animate-in fade-in duration-700 font-sans bg-[#09090b]">
      <AuthHero />

      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative">
        <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-[#ccff00]'}`} />
          <span className="font-mono text-xs text-[#52525b]">STATUS: {loading ? 'PROCESSING' : 'READY'}</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <div className="w-10 h-10 bg-[#ccff00] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold tracking-tight text-white text-lg">MATRIX</span>
            </div>

            <h2 className="text-4xl font-bold text-white mb-2 uppercase tracking-wide">
              {activeTab === 'login' ? 'Authenticate' : 'Initialize'}
            </h2>
            <p className="font-mono text-sm text-[#71717a]">
              {activeTab === 'login' ? '> Enter credentials to access system' : '> Create new user profile'}
            </p>
          </div>


          {/* Tabs - Refined Industrial Style */}
          <IndustrialTabs activeTab={activeTab} onChange={setActiveTab} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {loginError && (
                <div className="bg-red-900/20 border border-red-900 text-red-500 p-4 mb-6 font-mono text-xs flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span>ERROR: {loginError.message?.toUpperCase() || 'Auth Failed'}</span>
                </div>
              )}

              <Form {...(activeTab === 'login' ? loginForm : signupForm)}>
                <form
                  onSubmit={activeTab === 'login' ? loginForm.handleSubmit(onLoginSubmit) : signupForm.handleSubmit(onSignupSubmit)}
                  className="space-y-6"
                >
                  {activeTab === 'signup' && (
                    <FormField
                      control={signupForm.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-mono uppercase tracking-widest text-[#71717a]">Operator Name</FormLabel>
                          <FormControl>
                            <div className="input-industrial">
                              <Input placeholder="ENTER FULL NAME" className="border-none bg-transparent h-12 rounded-none placeholder:text-[#3f3f46]" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="font-mono text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={activeTab === 'login' ? loginForm.control : signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-widest text-[#71717a]">Email Address</FormLabel>
                        <FormControl>
                          <div className="input-industrial">
                            <Input placeholder="USER@DOMAIN.COM" className="border-none bg-transparent h-12 rounded-none placeholder:text-[#3f3f46]" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="font-mono text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={activeTab === 'login' ? loginForm.control : signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-widest text-[#71717a]">Passcode</FormLabel>
                        <FormControl>
                          <div className="input-industrial">
                            <Input type="password" placeholder="••••••••" className="border-none bg-transparent h-12 rounded-none placeholder:text-[#3f3f46]" {...field} />
                          </div>
                        </FormControl>
                        {activeTab === 'login' && (
                          <div className="flex justify-end pt-2">
                            <span
                              onClick={() => setResetPasswordOpen(true)}
                              className="text-[10px] font-mono text-[#52525b] hover:text-[#ccff00] cursor-pointer hover:underline uppercase"
                            >
                              Forgot Passcode?
                            </span>
                          </div>
                        )}
                        <FormMessage className="font-mono text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  {activeTab === 'signup' && (
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-mono uppercase tracking-widest text-[#71717a]">Confirm Passcode</FormLabel>
                          <FormControl>
                            <div className="input-industrial">
                              <Input type="password" placeholder="••••••••" className="border-none bg-transparent h-12 rounded-none placeholder:text-[#3f3f46]" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="font-mono text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button
                    type="submit"
                    className="w-full h-14 btn-industrial btn-industrial-primary mt-4 text-black text-sm"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <span className="flex items-center gap-2">
                        {activeTab === 'login' ? 'ACCESS SYSTEM' : 'INITIALIZE PROFILE'}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#27272a]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-[10px] bg-[#09090b] text-[#52525b] font-mono uppercase tracking-widest">
                    Or Authenticate With
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-14 btn-industrial btn-industrial-outline flex items-center justify-center gap-3 hover:bg-[#27272a] border-[#27272a] text-white rounded-none"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                <div className="bg-white p-1 rounded-sm">
                  <GoogleIcon className="h-4 w-4" />
                </div>
                <span className="text-xs tracking-wider">GOOGLE SECURE AUTH</span>
              </Button>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-6 left-12 right-12 flex justify-between text-[10px] font-mono text-[#3f3f46] hidden lg:flex">
          <span>SECURE CONNECTION ENCRYPTED</span>
          <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        </div>
      </div>

      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-md bg-[#09090b] border border-[#27272a] text-white">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl uppercase tracking-wide">Reset Protocol</DialogTitle>
            <DialogDescription className="font-mono text-xs text-[#a1a1aa]">
              Enter authorized email to receive reset link.
            </DialogDescription>
          </DialogHeader>
          <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4 py-4">
              <FormField
                control={resetPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="input-industrial">
                        <Input placeholder="EMAIL" className="border-none bg-transparent h-12 rounded-none placeholder:text-[#3f3f46]" {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="ghost" className="rounded-none text-[#a1a1aa] hover:text-white" onClick={() => setResetPasswordOpen(false)}>ABORT</Button>
                <Button type="submit" className="btn-industrial btn-industrial-primary h-10 px-6">TRANSMIT</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthPage;
