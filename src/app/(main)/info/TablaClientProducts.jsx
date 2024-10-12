"use client";
import React, { useContext, useEffect, useState } from "react";
import { ReactGrid, Row, Column } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { CapitalContext } from "@/context/capitalContext";

const TablaClientProducts = () => {
  const { data } = useContext(CapitalContext);

  console.log(data);
  

  // Define las columnas (encabezados)
  const columns = [
    { columnId: "name", width: 200, title: "Name" },
    { columnId: "isin", width: 150, title: "ISIN" },
    { columnId: "tikr", width: 150, title: "TIKR" },
    { columnId: "volatility", width: 150, title: "Volatilidad" },
    { columnId: "acc", width: 150, title: "Acciones" },
    { columnId: "price", width: 150, title: "Precio" },
  ];

   // Estado inicial de filas como un array vacío
  const [rows, setRows] = useState([]);

  //  cargar  datos de localStorage 
  useEffect(() => {
    const savedRows = localStorage.getItem("tableRows");
    if (savedRows) {
      setRows(JSON.parse(savedRows));
    } else {
      // Si no hay datos en localStorage, se establecen las filas por defecto
      setRows([
        {
          rowId: "header",
          cells: columns.map((col) => ({ columnId: col.columnId, type: "header", text: col.title })),
        },
        {
          rowId: "row1",
          cells: columns.map((col) => ({ columnId: col.columnId, type: "text", text: "" })),
        },
      ]);
    }
  }, []); // Se ejecuta una vez, al montar el componente


  // Guardar filas en localStorage
  useEffect(() => {
    if (rows.length > 0) {
      localStorage.setItem("tableRows", JSON.stringify(rows));
    }
  }, [rows]);





  //  adición de filas
  const addRow = () => {
    const newRow = {
      rowId: `row${rows.length}`,
      cells: columns.map((col) => ({  columnId: col.columnId, type: "text", text: "" })),
    };
    setRows([...rows, newRow]);
  };

  const handleChanges2 = (changes) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];

      changes.forEach((change) => {
       

        const { rowId, columnId, newCell } = change;
        const rowIndex = newRows.findIndex((row) => row.rowId === rowId);

        if (rowIndex === -1) return;

        const row = { ...newRows[rowIndex] };
        const cells = [...row.cells];

        if (columnId === "name") {
          const stockInfo = data.find(
            (item) => item.name.toLowerCase() === newCell.text.toLowerCase()
          );


          if (stockInfo) {
            cells[0] = { ...cells[0], text: stockInfo.name };
            cells[1] = { ...cells[1], text: stockInfo.isin };
            cells[2] = { ...cells[2], text: stockInfo.tikr };
            cells[3] = { ...cells[3], text: stockInfo.volatility };
            
          }
        } else  {
            // Encuentra la celda correspondiente a la columna que cambió
            const cellIndex = cells.findIndex(
              (cell) => cell.columnId === columnId
            );
            if (cellIndex !== -1) {
              cells[cellIndex] = { ...cells[cellIndex], text: newCell.text };
            }
          }

        row.cells = cells;
        newRows[rowIndex] = row;
      });

      return newRows;
    });
  };




 
  

  return (
    <div>
      <ReactGrid
        rows={rows}
        columns={columns}
        onCellsChanged={handleChanges2}
      />
      <button onClick={addRow}>Agregar Fila</button>
    </div>
  );
};

export default TablaClientProducts;
