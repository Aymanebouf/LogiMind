import React, { createContext, useContext, useState } from "react";

type SidebarState = "collapsed" | "expanded";

const SidebarContext = createContext<{
  state: SidebarState;
  toggle: () => void;
}>({ state: "expanded", toggle: () => {} });

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<SidebarState>("expanded");

  const toggle = () => {
    setState((prev) => (prev === "expanded" ? "collapsed" : "expanded"));
  };

  return (
    <SidebarContext.Provider value={{ state, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
