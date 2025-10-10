import { TablePagination } from "@mui/material";

interface PaginationProps {
    page: number;
    rowsPerPage: number;
    count: number;
    handleOnPageChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
    handleOnRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function Pagination({ page, rowsPerPage, count, handleOnPageChange, handleOnRowsPerPageChange }: PaginationProps) {
    return (
        <TablePagination
            labelRowsPerPage="Registros Por Página"
            labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) { return `${from}–${to} de ${count !== -1 ? count : `more than ${to}`}`; }}
            component="div"
            count={count}
            page={page}
            onPageChange={handleOnPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleOnRowsPerPageChange}
            className="shadow mt-5"
        />
    )
}
