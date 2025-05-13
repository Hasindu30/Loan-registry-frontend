// context/SidebarContext.js
import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <SidebarContext.Provider value={{ isHovered, setIsHovered }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
