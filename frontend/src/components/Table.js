function Table({ columns, data, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>
              {column.label}
            </th>
          ))}

          {(onEdit || onDelete) && (
            <th>Action</th>
          )}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={column.key}>
                {row[column.key]}
              </td>
            ))}

            {(onEdit || onDelete) && (
              <td>
                {onEdit && (
                  <button onClick={() => onEdit(row)}>
                    Edit
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => onDelete(row.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;