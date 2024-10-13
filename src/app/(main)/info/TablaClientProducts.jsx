"use client";
import React, { useContext, useEffect, useState } from "react";
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { CapitalContext } from "@/context/capitalContext";

const TablaClientProducts = () => {
  const { data } = useContext(CapitalContext);

  const [rows, setRows] = useState([]);

  const columns = [
    { columnId: "name", width: 200, title: "Name" },
    { columnId: "isin", width: 150, title: "ISIN" },
    { columnId: "tikr", width: 150, title: "TIKR" },
    { columnId: "volatility", width: 150, title: "Volatilidad" },
    { columnId: "acc", width: 150, title: "Acciones" },
    { columnId: "price", width: 150, title: "Precio" },
  ];

  useEffect(() => {
    const savedRows = localStorage.getItem("tableRows");
    if (savedRows) {
      setRows(JSON.parse(savedRows));
    } else {
      setRows([
        {
          rowId: "header",
          cells: columns.map((col) => ({
            columnId: col.columnId,
            type: "header",
            text: col.title,
          })),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (rows.length > 0) {
      localStorage.setItem("tableRows", JSON.stringify(rows));
    }
  }, [rows]);

  const addRow = () => {
    if (selectedProduct) {
      const newRow = {
        rowId: `row${rows.length + 1}`,
        cells: columns.map((col) => {
          if (col.columnId === "name")
            return {
              columnId: col.columnId,
              type: "text",
              text: selectedProduct.name,
            };
          if (col.columnId === "isin")
            return {
              columnId: col.columnId,
              type: "text",
              text: selectedProduct.isin,
            };
          if (col.columnId === "tikr")
            return {
              columnId: col.columnId,
              type: "text",
              text: selectedProduct.tikr,
            };
          if (col.columnId === "volatility")
            return {
              columnId: col.columnId,
              type: "text",
              text: selectedProduct.volatility,
            };
          return { columnId: col.columnId, type: "text", text: "" }; // Celdas vacías para las otras columnas
        }),
      };
      setRows([...rows, newRow]);
    }
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
        } else {
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedProduct, setSelectedProduct] = useState(null); 

  const openDialog = () => {
    setIsDialogOpen(true);
    setSearchTerm(""); 
    setSelectedProduct(null); 
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Filtrar productos según el término de búsqueda
  const filteredProducts = data.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <ReactGrid
        rows={rows}
        columns={columns}
        onCellsChanged={handleChanges2}
      />
      <button
        className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        onClick={openDialog}
      >
        Agregar Fila
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              Selecciona una opción:
            </h3>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded p-2 mb-4 w-full"
            />
            <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded">
              {filteredProducts.map((item) => (
                <li
                  key={item.isin}
                  className={`p-2 cursor-pointer hover:bg-gray-200 ${
                    selectedProduct === item ? "bg-gray-300" : ""
                  }`}
                  onClick={() => setSelectedProduct(item)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={addRow}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
              >
                Agregar
              </button>
              <button
                onClick={closeDialog}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaClientProducts;
