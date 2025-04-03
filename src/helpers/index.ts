export const getYear = () => {
    const currentYear: number = new Date().getFullYear();
    return currentYear;
}

export function formatDate(dateStr: string): string {
    const dateObj = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    return new Intl.DateTimeFormat('es-ES', options).format(dateObj);
}

export function downloadBase64File(base64: string, filename: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
export function getWeekNumber(): number {
    const date = new Date();
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
}


export function formatearQuetzales(number: number) {
    return new Intl.NumberFormat("es-GT", {
        style: "currency",
        currency: "GTQ",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

export function validarDiferenciaFechas(fechaActual: string, fechaDestino: string) {
    const fecha1 = new Date(fechaActual);
    const fecha2 = new Date(fechaDestino + 1);

    return fecha1 == fecha2;
}

export function getCurrentDate() {
    const today = new Date().toLocaleDateString("es-ES", { timeZone: "America/Guatemala" }).split("/").reverse().map(num => num.padStart(2, "0")).join("-");
    return today;
}
export function getYesterdayDate() {
    const today = new Date();
    today.setDate(today.getDate() - 1);

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "America/Guatemala",
    };
    return new Intl.DateTimeFormat("es-ES", options)
        .format(today)
        .split("/")
        .reverse()
        .map(num => num.padStart(2, "0")) 
        .join("-");
}
