"use client";
import React, { createContext, useState } from "react";

export const CapitalContext = createContext(null);

export default function CapitalContextProvider({ children }) {
 
const [dataDetail, setDataDetail]=useState([])
  return (
    <CapitalContext.Provider
      value={{
        dataDetail, setDataDetail
      }}
    >
      {children}
    </CapitalContext.Provider>
  );
}
