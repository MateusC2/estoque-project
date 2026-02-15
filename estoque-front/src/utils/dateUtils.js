export const isDateToday = (date) => {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };
  
  export const isBeforeNow = (date) => {
    return date < new Date();
  };
  
  export const getToday = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  };

  // Formata data para padrão BR: dd/mm/yyyy
  export const formatDateBR = (input) => {
    if (!input) return "";
    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Formata data e hora para padrão BR: dd/mm/yyyy HH:MM
  export const formatDateTimeBR = (input) => {
    if (!input) return "";
    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  