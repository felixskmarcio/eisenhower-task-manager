
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InnovativeEisenhowerAnimation from '@/components/eisenhower-animation';

// Import our new components
import HeaderSection from '@/components/introduction/HeaderSection';
import WhatIsTab from '@/components/introduction/WhatIsTab';
import QuadrantsTab from '@/components/introduction/QuadrantsTab';
import BenefitsTab from '@/components/introduction/BenefitsTab';
import CallToAction from '@/components/introduction/CallToAction';

const Introduction = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <HeaderSection 
            title="Matriz de Eisenhower"
            description="Uma poderosa técnica de gestão de tempo que ajuda a priorizar tarefas com base em sua urgência e importância."
          />

          <div className="flex justify-center mb-10">
            <InnovativeEisenhowerAnimation />
          </div>

          <Tabs defaultValue="what" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="what" className="text-sm md:text-base">O que é</TabsTrigger>
              <TabsTrigger value="quadrants" className="text-sm md:text-base">Os 4 Quadrantes</TabsTrigger>
              <TabsTrigger value="benefits" className="text-sm md:text-base">Benefícios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="what">
              <WhatIsTab />
            </TabsContent>
            
            <TabsContent value="quadrants">
              <QuadrantsTab />
            </TabsContent>
            
            <TabsContent value="benefits">
              <BenefitsTab />
            </TabsContent>
          </Tabs>
          
          <CallToAction />
        </div>
      </div>
    </Layout>
  );
};

export default Introduction;
