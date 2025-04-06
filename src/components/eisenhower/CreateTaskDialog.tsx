
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Task } from './TaskCard';

interface QuadrantData {
  [key: string]: {
    title: string;
    icon: React.ElementType;
    color: string;
    textColor: string;
  };
}

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTask: Partial<Task>;
  setNewTask: (task: Partial<Task>) => void;
  onAddTask: () => void;
  quadrantData: QuadrantData;
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  open,
  onOpenChange,
  newTask,
  setNewTask,
  onAddTask,
  quadrantData
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da tarefa e selecione o quadrante correto na matriz.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Tarefa</Label>
            <Input
              id="title"
              placeholder="Digite o título da tarefa"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Detalhes adicionais sobre a tarefa"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Quadrante</Label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(quadrantData).map(([key, data]) => {
                const Icon = data.icon;
                const isSelected = newTask.quadrant === parseInt(key);
                
                return (
                  <div
                    key={key}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      isSelected ? 'border-primary ring-1 ring-primary' : ''
                    }`}
                    onClick={() => setNewTask({ ...newTask, quadrant: parseInt(key) as 1 | 2 | 3 | 4 })}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md ${data.color}/20`}>
                        <Icon className={`h-4 w-4 ${data.textColor}`} />
                      </div>
                      <span className="text-sm font-medium">{`Q${key}: ${data.title.split(",")[0]}`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onAddTask} disabled={!newTask.title}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
