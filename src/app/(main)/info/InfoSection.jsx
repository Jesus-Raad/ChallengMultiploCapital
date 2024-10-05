"use client";
import React, { useContext, useEffect, useState } from 'react';
import { ReactGrid } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import Papa from 'papaparse';
import { CapitalContext } from '@/context/capitalContext';

const InfoSection = () => {
  const {dataDetail, setDataDetail}=useContext(CapitalContext)
    const [data, setData] = useState([]);
    const [rows, setRows] = useState([]);
    const [portfolioData, setPortfolioData] = useState({});
    
    const columns = [
      { columnId: 'Nombre', width: 200, isEditable: true },
      { columnId: 'ISIN', width: 150 },
      { columnId: 'TIKR', width: 100 },
      { columnId: 'Volatilidad', width: 100 },
      { columnId: 'Acciones', width: 100, isEditable: true },
      { columnId: 'Precio', width: 100, isEditable: true },
    ];
    
    const headerRow = {
      rowId: 'header',
      cells: columns.map(column => ({
        type: 'header',
        text: column.columnId
      }))
    };
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/data/list.csv');
          const text = await response.text();
          const parsedData = Papa.parse(text, { header: true });
          
          const formattedData = parsedData.data.map(item => ({
            name: item.name,
            isin: item.isin,
            tikr: item.tikr,
            volatility: item.volatility,
            type: item.type, 
            shares: item.shares,
            price: item.price,
          }));
          
          setData(formattedData);
          setDataDetail(formattedData)
          initializeRows();
    
          // Cargar datos existentes del localStorage
          const savedData = localStorage.getItem('portfolioData');
          
          if (savedData) {
            const parsed = JSON.parse(savedData);
            setPortfolioData(parsed);
            // Actualizar filas con datos guardados
            updateRowsFromStorage(parsed);
          }
        } catch (error) {
          console.error('Error loading CSV:', error);
        }
      };
    
      fetchData();
    }, []);
    
    const updateRowsFromStorage = (savedData) => {
      if (!savedData || Object.keys(savedData).length === 0) return;
    
      const initialDataRow = {
        rowId: 1,
        cells: [
          { type: 'text', text: savedData.name || '', columnId: 'Nombre' },
          { type: 'text', text: savedData.isin || '', columnId: 'ISIN' },
          { type: 'text', text: savedData.tikr || '', columnId: 'TIKR' },
          { type: 'text', text: savedData.volatility || '', columnId: 'Volatilidad' },
          { type: 'text', text: savedData.shares || '', columnId: 'Acciones' },
          { type: 'text', text: savedData.price || '', columnId: 'Precio' }
        ]
      };
    
      setRows([headerRow, initialDataRow]);
    };
    
    const initializeRows = () => {
      const initialDataRow = {
        rowId: 1,
        cells: columns.map(column => ({
          type: 'text',
          text: '',
          columnId: column.columnId
        }))
      };
    
      setRows([headerRow, initialDataRow]);
    };
    
    const updatePortfolioData = (newRows) => {
      const dataRow = newRows.find(row => row.rowId === 1);
      if (!dataRow) return;
    
      const getCellText = (columnId) => {
        const cell = dataRow.cells.find(cell => cell.columnId === columnId);
        return cell ? cell.text : '';
      };
    
      const stockInfo = data.find(item => item.name === getCellText('Nombre'));
      if (!stockInfo) return;
    
      const newPortfolioData = {
        name: getCellText('Nombre'),
        isin: getCellText('ISIN'),
        tikr: getCellText('TIKR'),
        volatility: getCellText('Volatilidad'),
        shares: getCellText('Acciones'),
        price: getCellText('Precio'),
        type: stockInfo.type
      };
    
      // Solo actualizar si todos los campos necesarios están llenos
      if (newPortfolioData.name && newPortfolioData.shares && newPortfolioData.price) {
        setPortfolioData(newPortfolioData);
        localStorage.setItem('portfolioData', JSON.stringify(newPortfolioData));
      }
    };
    
    const handleChanges = (changes) => {
      setRows(prevRows => {
        const newRows = [...prevRows];
    
        changes.forEach(change => {
          const { rowId, columnId, newCell } = change;
          const rowIndex = newRows.findIndex(row => row.rowId === rowId);
          
          if (rowIndex === -1) return;
          
          const row = {...newRows[rowIndex]};
          const cells = [...row.cells];
          
          if (columnId === 'Nombre') {
            const stockInfo = data.find(item => 
              item.name.toLowerCase() === newCell.text.toLowerCase()
            );
    
            if (stockInfo) {
              cells[0] = { ...cells[0], text: stockInfo.name };
              cells[1] = { ...cells[1], text: stockInfo.isin };
              cells[2] = { ...cells[2], text: stockInfo.tikr };
              cells[3] = { ...cells[3], text: stockInfo.volatility };
            }
          } else {
            const cellIndex = cells.findIndex(cell => cell.columnId === columnId);
            if (cellIndex !== -1) {
              cells[cellIndex] = { ...cells[cellIndex], text: newCell.text };
            }
          }
    
          row.cells = cells;
          newRows[rowIndex] = row;
        });
    
        // Actualizar localStorage después de cada cambio
        updatePortfolioData(newRows);
        return newRows;
      });
    };
    
    
    
    return (
      <div className="w-full p-4">
        {rows.length > 0 && (
          <ReactGrid
            rows={rows}
            columns={columns}
            onCellsChanged={handleChanges}
        
            enableColumnResizing
          />
        )}
      </div>
    );
};

export default InfoSection;
