import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  isAdmin, 
  getAllUsers, 
  createUser, 
  updateUser, 
  deactivateUser, 
  activateUser,
  UserProfile, 
  UserRole 
} from '@/services/authorization';
import { logAudit } from '@/services/audit';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Users, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  ShieldOff,
  RefreshCw,
  UserCheck,
  UserX
} from 'lucide-react';

const AdminPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState('criado_em');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'USER' as UserRole,
  });

  const checkAdminAccess = useCallback(async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const userId = (user as any).uid || (user as any).id;
    const adminStatus = await isAdmin(userId);
    
    if (!adminStatus) {
      toast({
        title: 'Acesso Negado',
        description: 'Você não tem permissão para acessar esta página.',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }
    
    setHasAdminAccess(true);
  }, [user, navigate]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const { users: loadedUsers, total } = await getAllUsers(
      page,
      pageSize,
      { search: searchTerm, role: roleFilter, active: activeFilter },
      sortBy,
      sortOrder
    );
    setUsers(loadedUsers);
    setTotalUsers(total);
    setLoading(false);
  }, [page, pageSize, searchTerm, roleFilter, activeFilter, sortBy, sortOrder]);

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  useEffect(() => {
    if (hasAdminAccess) {
      loadUsers();
    }
  }, [hasAdminAccess, loadUsers]);

  const handleCreateUser = async () => {
    if (!formData.email || !formData.nome || !formData.senha) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.senha.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setFormLoading(true);
    const result = await createUser(formData);
    
    if (result.success) {
      await logAudit({
        user_id: (user as any)?.uid || (user as any)?.id || 'unknown',
        action: 'CREATE',
        table_name: 'users',
        record_id: result.userId,
        new_data: { email: formData.email, nome: formData.nome, role: formData.role },
      });
      
      toast({
        title: 'Sucesso',
        description: 'Usuário criado com sucesso!',
      });
      setIsCreateModalOpen(false);
      resetForm();
      loadUsers();
    } else {
      toast({
        title: 'Erro',
        description: result.error || 'Erro ao criar usuário.',
        variant: 'destructive',
      });
    }
    setFormLoading(false);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setFormLoading(true);
    const result = await updateUser(selectedUser.id, {
      nome: formData.nome,
      email: formData.email,
      role: formData.role,
    });
    
    if (result.success) {
      await logAudit({
        user_id: (user as any)?.uid || (user as any)?.id || 'unknown',
        action: 'UPDATE',
        table_name: 'users',
        record_id: selectedUser.id,
        old_data: { email: selectedUser.email, nome: selectedUser.nome, role: selectedUser.role },
        new_data: { email: formData.email, nome: formData.nome, role: formData.role },
      });
      
      toast({
        title: 'Sucesso',
        description: 'Usuário atualizado com sucesso!',
      });
      setIsEditModalOpen(false);
      resetForm();
      loadUsers();
    } else {
      toast({
        title: 'Erro',
        description: result.error || 'Erro ao atualizar usuário.',
        variant: 'destructive',
      });
    }
    setFormLoading(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setFormLoading(true);
    const result = await deactivateUser(selectedUser.id);
    
    if (result.success) {
      await logAudit({
        user_id: (user as any)?.uid || (user as any)?.id || 'unknown',
        action: 'DELETE',
        table_name: 'users',
        record_id: selectedUser.id,
        old_data: { email: selectedUser.email, nome: selectedUser.nome, active: true },
        new_data: { active: false },
      });
      
      toast({
        title: 'Sucesso',
        description: 'Usuário desativado com sucesso!',
      });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } else {
      toast({
        title: 'Erro',
        description: result.error || 'Erro ao desativar usuário.',
        variant: 'destructive',
      });
    }
    setFormLoading(false);
  };

  const handleToggleUserStatus = async (userToToggle: UserProfile) => {
    const action = userToToggle.active ? deactivateUser : activateUser;
    const result = await action(userToToggle.id);
    
    if (result.success) {
      await logAudit({
        user_id: (user as any)?.uid || (user as any)?.id || 'unknown',
        action: 'UPDATE',
        table_name: 'users',
        record_id: userToToggle.id,
        old_data: { active: userToToggle.active },
        new_data: { active: !userToToggle.active },
      });
      
      toast({
        title: 'Sucesso',
        description: `Usuário ${userToToggle.active ? 'desativado' : 'ativado'} com sucesso!`,
      });
      loadUsers();
    } else {
      toast({
        title: 'Erro',
        description: result.error || 'Erro ao alterar status do usuário.',
        variant: 'destructive',
      });
    }
  };

  const openEditModal = (userToEdit: UserProfile) => {
    setSelectedUser(userToEdit);
    setFormData({
      nome: userToEdit.nome || '',
      email: userToEdit.email || '',
      senha: '',
      role: userToEdit.role,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (userToDelete: UserProfile) => {
    setSelectedUser(userToDelete);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      senha: '',
      role: 'USER',
    });
    setSelectedUser(null);
  };

  const totalPages = Math.ceil(totalUsers / pageSize);

  if (!hasAdminAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Gerenciamento de Usuários</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Administre os usuários do sistema
              </p>
            </div>
          </div>
          <Button onClick={() => { resetForm(); setIsCreateModalOpen(true); }} data-testid="button-create-user">
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="pl-10"
                data-testid="input-search-users"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v as UserRole | ''); setPage(1); }}>
              <SelectTrigger className="w-[150px]" data-testid="select-role-filter">
                <SelectValue placeholder="Perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="ADM">Administrador</SelectItem>
                <SelectItem value="USER">Usuário</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={activeFilter === null ? 'all' : activeFilter ? 'active' : 'inactive'} 
              onValueChange={(v) => { 
                setActiveFilter(v === 'all' ? null : v === 'active'); 
                setPage(1); 
              }}
            >
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={loadUsers} data-testid="button-refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => { setSortBy('nome'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                        Nome
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => { setSortBy('email'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                        Email
                      </TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => { setSortBy('criado_em'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                        Criado em
                      </TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          Nenhum usuário encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u.id} data-testid={`row-user-${u.id}`}>
                          <TableCell className="font-medium">{u.nome || '-'}</TableCell>
                          <TableCell>{u.email || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={u.role === 'ADM' ? 'default' : 'secondary'}>
                              {u.role === 'ADM' ? (
                                <><Shield className="h-3 w-3 mr-1" /> Admin</>
                              ) : (
                                <><ShieldOff className="h-3 w-3 mr-1" /> Usuário</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={u.active ? 'default' : 'destructive'}>
                              {u.active ? (
                                <><UserCheck className="h-3 w-3 mr-1" /> Ativo</>
                              ) : (
                                <><UserX className="h-3 w-3 mr-1" /> Inativo</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(u.criado_em).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleToggleUserStatus(u)}
                                title={u.active ? 'Desativar' : 'Ativar'}
                                data-testid={`button-toggle-${u.id}`}
                              >
                                {u.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openEditModal(u)}
                                data-testid={`button-edit-${u.id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openDeleteDialog(u)}
                                className="text-destructive hover:text-destructive"
                                data-testid={`button-delete-${u.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {users.length} de {totalUsers} usuários
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Página {page} de {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo usuário no sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo"
                data-testid="input-nome"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                data-testid="input-email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="senha">Senha *</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                data-testid="input-senha"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Perfil *</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}>
                <SelectTrigger data-testid="select-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Usuário</SelectItem>
                  <SelectItem value="ADM">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUser} disabled={formLoading} data-testid="button-confirm-create">
              {formLoading ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize os dados do usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome</Label>
              <Input
                id="edit-nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                data-testid="input-edit-nome"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-edit-email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Perfil</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}>
                <SelectTrigger data-testid="select-edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Usuário</SelectItem>
                  <SelectItem value="ADM">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateUser} disabled={formLoading} data-testid="button-confirm-edit">
              {formLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Desativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desativar o usuário <strong>{selectedUser?.nome || selectedUser?.email}</strong>?
              <br /><br />
              O usuário será desativado e não poderá mais acessar o sistema. Esta ação pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground" data-testid="button-confirm-delete">
              {formLoading ? 'Desativando...' : 'Desativar Usuário'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;
