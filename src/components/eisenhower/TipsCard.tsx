
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckSquare, Clock, Trash2, ArrowRight } from 'lucide-react';

const TipsCard: React.FC = () => {
  return (
    <Card className="max-w-3xl mx-auto mb-8 bg-muted/40">
      <CardHeader>
        <CardTitle>Maximizando sua produtividade</CardTitle>
        <CardDescription>Dicas para uso eficiente da Matriz de Eisenhower no dia a dia</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="font-medium flex items-center gap-2">
                <div className="p-1 rounded-full bg-red-500/20">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                </div>
                <span>Quadrante 1: Urgente & Importante</span>
              </h4>
              <p className="text-sm text-muted-foreground">Dedique tempo para <strong>reduzir</strong> as tarefas deste quadrante melhorando seu planejamento. Muitas tarefas aqui indicam gerenciamento reativo.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h4 className="font-medium flex items-center gap-2">
                <div className="p-1 rounded-full bg-green-500/20">
                  <CheckSquare className="h-3.5 w-3.5 text-green-500" />
                </div>
                <span>Quadrante 2: Não-Urgente & Importante</span>
              </h4>
              <p className="text-sm text-muted-foreground"><strong>Amplie</strong> seu foco aqui. Investir tempo em planejamento, relacionamentos e desenvolvimento pessoal traz os melhores resultados a longo prazo.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h4 className="font-medium flex items-center gap-2">
                <div className="p-1 rounded-full bg-amber-500/20">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <span>Quadrante 3: Urgente & Não-Importante</span>
              </h4>
              <p className="text-sm text-muted-foreground"><strong>Reduza ou delegue</strong> estas tarefas. Elas parecem importantes pela urgência, mas não contribuem para seus objetivos de longo prazo.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h4 className="font-medium flex items-center gap-2">
                <div className="p-1 rounded-full bg-gray-500/20">
                  <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                </div>
                <span>Quadrante 4: Não-Urgente & Não-Importante</span>
              </h4>
              <p className="text-sm text-muted-foreground"><strong>Elimine</strong> estas atividades. Elas são desperdiçadores de tempo que não trazem valor significativo para sua vida ou objetivos.</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button asChild variant="outline" size="sm">
          <Link to="/introduction">
            Ver guia completo
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TipsCard;
