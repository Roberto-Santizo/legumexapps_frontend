export type DraftRecipe = {
    name: string;
}
export type DraftCrop = {
    name: string;
    code: string;
}

export type DraftInsumoRecipe = {
    insumo_id:  number;
    quantity:   number;
    name:       string;
}

export type DraftMasterTask = {
    task_id:    string;
    recipe_id:  string;
    crop_id:    string;
    budget:     number;
    hours:      number;
    week:       number;
    finca_id:   number;
    insumos:    Array<DraftInsumoRecipe>
}