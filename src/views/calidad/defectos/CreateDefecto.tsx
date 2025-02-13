import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useAppStore } from "../../../stores/useAppStore";
import { toast } from "react-toastify";
import { DraftDefecto, QualityVariety } from "../../../types";
import Error from "../../../components/Error";
import { Button } from "@mui/material";
import Spinner from "../../../components/Spinner";
export default function CreateDefecto() {
    const [loading, setLoading] = useState<boolean>(true);
    const [varieties, setVarieties] = useState<QualityVariety[]>([]);
    const getAllVarieties = useAppStore((state) => state.getAllVarieties);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<DraftDefecto>();


    const varietiesOptions = varieties.map((variety) => ({
        value: variety.id,
        label: variety.name,
    }));

    const handleGetInfo = async () => {
        try {
            const data = await getAllVarieties();
            setVarieties(data);
        } catch (error) {
            toast.error('Hubo un error al traer la información');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetInfo();
    }, []);

    const onSubmit = async (data: DraftDefecto) => {
        console.log(data);
    }
    return (
        <>
            <h2 className="font-bold text-4xl">Crear Defecto</h2>

            <div className="mt-10 w-1/2 mx-auto">
                <form noValidate className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-bold uppercase" htmlFor="name">
                            Nombre:
                        </label>
                        <input
                            autoComplete="off"
                            id="name"
                            type="text"
                            placeholder="Nombre del Defecto"
                            className="border border-black p-3"
                            {...register('name', {
                                required: 'El nombre de la variedad es obligatorio'
                            })}
                        />
                        {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-bold uppercase" htmlFor="tolerance_percentage">
                            Porcentaje de Tolerancia:
                        </label>
                        <input
                            autoComplete="off"
                            id="tolerance_percentage"
                            type="number"
                            placeholder="Porcentaje de Tolerancia"
                            className="border border-black p-3"
                            {...register('tolerance_percentage', {
                                required: 'El porcentaje de tolerancia es obligatoria',
                                min:{value:1, message:'El valor minimo debe de ser 1'}
                            })}
                        />
                        {errors.tolerance_percentage && <Error>{errors.tolerance_percentage?.message?.toString()}</Error>}
                    </div>

                    <div>
                        <label className="text-lg font-bold uppercase" htmlFor="variety_id">
                            VARIEDAD:
                        </label>
                        <Controller
                            name="variety_id"
                            control={control}
                            rules={{ required: "Seleccione un tipo de varidedad" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={varietiesOptions}
                                    id="variety_id"
                                    placeholder={"--SELECCIONE UNA OPCION--"}
                                    className="border border-black"
                                    onChange={(selected) => field.onChange(selected?.value)}
                                    value={varietiesOptions.find(
                                        (option) => option.value === field.value
                                    )}
                                />
                            )}
                        />
                        {errors.variety_id && <Error>{errors.variety_id?.message?.toString()}</Error>}
                    </div>

                    <Button
                        disabled={loading}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        {loading ? (
                            <Spinner />
                        ) : (
                            <p className="font-bold text-lg">Crear Defecto</p>
                        )}
                    </Button>
                </form>
            </div>
        </>
    )
}
