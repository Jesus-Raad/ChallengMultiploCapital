"use client";
import React, { createContext, useEffect, useState } from "react";
import Papa from 'papaparse';
export const CapitalContext = createContext(null);

export default function CapitalContextProvider({ children }) {
 
const [data, setData]=useState([])
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/data/list.csv');
          const text = await response.text();
          const parsedData = Papa.parse(text, { header: true });
          
          
          
          setData(parsedData.data);
          
        } catch (error) {
          console.error('Error loading CSV:', error);
        }
      };
    
      fetchData();
    }, []);

  return (
    <CapitalContext.Provider
      value={{
        data, setData
      }}
    >
      {children}
    </CapitalContext.Provider>
  );
}
