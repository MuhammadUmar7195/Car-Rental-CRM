const convertToCSV = (data) => {
  const headers = Object.keys(data).join(",");
  const values = Object.values(data).join(",");
  return `${headers}\n${values}`;
};

export const downloadCSV = (filename, data) => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
