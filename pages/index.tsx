import { ImportData } from '../components/ImportData';

export default function Home() {
  const handleImport = (data: any) => {
    // Processe os dados importados aqui
    console.log('Dados importados:', data);
    // Atualize seu estado ou banco de dados com os dados importados
  };

  return (
    <div>
      <ImportData onImport={handleImport} />
    </div>
  );
} 