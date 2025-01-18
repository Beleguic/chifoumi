import React from "react";

const Table = ({ columns, data, onRowClick }) => {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
      }}
    >
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
                backgroundColor: "#f4f4f4",
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            onClick={() => onRowClick && onRowClick(row)}
            style={{
              cursor: onRowClick ? "pointer" : "default",
              backgroundColor: rowIndex % 2 === 0 ? "#fafafa" : "#fff",
            }}
          >
            {columns.map((col) => (
              <td
                key={col.key}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
