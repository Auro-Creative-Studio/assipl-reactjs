const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = "No records found.",
  className = "",
  defaultRowHeight = "py-4",
}) => {
  const firstColumnIndex = 0;
  const lastColumnIndex = Math.max(columns.length - 1, 0);
  const middleColumnCount = Math.max(columns.length - 2, 1);

  const getColumnWidth = (index, col, customWidths = {}) => {
    if (customWidths[col.key]) return customWidths[col.key];
    if (col.width) return col.width;
    if (columns.length === 1) return "100%";
    if (index === firstColumnIndex) return col.key === "sno" ? "88px" : "18%";
    if (index === lastColumnIndex) return col.key === "actions" ? "180px" : "14%";

    return `${68 / middleColumnCount}%`;
  };

  const getCellAlignment = (index, col) => {
    if (col.align === "right" || index === lastColumnIndex) return "text-right";
    if (col.align === "center") return "text-left";

    return "text-left";
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-slate-500 shadow-sm ${className}`}>
        <div className="h-9 w-9 rounded-full border-[3px] border-slate-200 border-t-slate-950 animate-spin" />
        <p className="text-sm font-semibold">Loading data...</p>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[760px] table-fixed border-collapse text-sm">
          <colgroup>
            {columns.map((col, index) => (
              <col key={col.key} style={{ width: getColumnWidth(index, col) }} />
            ))}
          </colgroup>
          <thead className="bg-primary text-white">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.key}
                  className={`whitespace-nowrap px-5 py-4 text-[11px] font-black uppercase tracking-[0.12em] text-white/70 ${getCellAlignment(index, col)}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-14 text-center text-sm font-semibold text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const rowHeight = row.rowHeight || defaultRowHeight;
                const columnWidths = row.columnWidths || {};
                return (
                  <tr
                    key={row.id ?? rowIdx}
                    className={`border-b border-slate-100 transition-colors duration-150 last:border-b-0 hover:bg-slate-50/80`}
                  >
                    {columns.map((col, index) => {
                      const customWidth = getColumnWidth(index, col, columnWidths);
                      const widthStyle = customWidth ? { width: customWidth } : {};
                      return (
                        <td
                          key={col.key}
                          style={widthStyle}
                          className={`px-5 ${rowHeight} align-left font-medium text-slate-700 ${getCellAlignment(index, col)}`}
                        >
                          {col.render ? (
                            <div
                              className={`flex w-full items-center ${
                                col.align === "right" || index === lastColumnIndex
                                  ? "justify-end gap-2"
                                  : col.align === "center"
                                    ? "justify-center gap-2"
                                    : "justify-start gap-2"
                              }`}
                            >
                              {col.render(row[col.key], row)}
                            </div>
                          ) : (
                            row[col.key] ?? "N/A"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
