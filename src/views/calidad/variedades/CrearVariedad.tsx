import { useForm } from "react-hook-form";
import { DraftVariety } from "@/types";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import { Button } from "@mui/material";
import Error from "@/components/Error";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createVariety } from "@/api/VarietiesAPI";

export default function CrearVariedad() {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const {
        handleSubmit,
        formState: { errors },
        register
    } = useForm<DraftVariety>();

    const onSubmit = async (data : DraftVariety) => {
        setLoading(true);
        try {
            await createVariety(data);
            toast.success('Variedad creada correctamente');
            navigate('/productos/variedades');
        } catch (error) {
            toast.error('Hubo un error al crear la variedad');
        }
    }
    return (
        <>
            <h2 className="font-bold text-3xl">Crear Variedad</h2>

            <form className="mt-5 w-1/2 mx-auto" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-bold uppercase" htmlFor="name">
                        Nombre:
                    </label>
                    <input
                        autoComplete="off"
                        id="name"
                        type="text"
                        placeholder={"Nombre de la variedad"}
                        className="border border-black p-3"
                        {...register("name", { required: 'El nombre de la variedad es requerida' })}
                    />
                    {errors.name?.message && <Error>{errors.name.message}</Error>}
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
                        <p className="font-bold text-lg">Crear Variedad</p>
                    )}
                </Button>
            </form>
        </>
    )
}
