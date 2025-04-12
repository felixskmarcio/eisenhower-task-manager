
import React from 'react';
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
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isDarkMode?: boolean;
}

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Exclusão",
  description = "Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.",
  isDarkMode = false,
}: DeleteConfirmationDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className={`${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-black border-gray-200'} max-w-md backdrop-blur-lg z-50`}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="p-2 rounded-full bg-red-500/10">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 pt-2">
          <AlertDialogCancel 
            className={`transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border-gray-700 hover:border-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400'
            } hover:shadow-md hover:-translate-y-0.5 flex-1`}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white flex-1 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
