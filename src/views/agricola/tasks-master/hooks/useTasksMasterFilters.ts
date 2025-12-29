import { useState } from "react";

export interface TasksMasterFilters {
    recipe: string;
    crop: string;
    week: string;
}

export const useTasksMasterFilters = () => {
    const [filters, setFilters] = useState<TasksMasterFilters>({
        recipe: '',
        crop: '',
        week: ''
    });

    const resetFilters = () => setFilters({ recipe: '', crop: '', week: '' });

    return { filters, setFilters, resetFilters };
}