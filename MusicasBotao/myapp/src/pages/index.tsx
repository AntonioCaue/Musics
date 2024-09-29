// src/pages/index.tsx

import React from 'react';
import SidebarMenu from '../components/SidebarMenu'; // Atualizado para o nome correto

const Home: React.FC = () => {
  return (
    <div>
      <h1>Meu Player de Música</h1>
      <SidebarMenu />
    </div>
  );
};

export default Home;

