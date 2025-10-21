import { useState } from "react";

export interface PlannerFincasFilters {
    finca: string;
    week: string;
    year: string;
}

export const usePlannerFincasFilters = () => {
    const [filters, setFilters] = useState<PlannerFincasFilters>({
        finca: '',
        week: '',
        year: ''
    });

    const resetFilters = () => setFilters({ finca: '', week: '', year: '' });

    return { filters, setFilters, resetFilters };
}