import { FieldErrors, UseFormRegister } from "react-hook-form";
import { DraftUser } from "views/admin/users/CreateUser";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { getRoles, Role } from "@/api/RolesAPI";
import { getPermissions, Permission } from "@/api/PermissionsAPI";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";

type Props = {
    register: UseFormRegister<DraftUser>;
    errors: FieldErrors<DraftUser>;
    setSelectedPermissions?: Dispatch<SetStateAction<string[]>>;
    isEditing?: boolean;
}

export default function UsersForm({ register, errors, setSelectedPermissions, isEditing = false }: Props) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);

    const results = useQueries({
        queries: [
            { queryKey: ['getRoles'], queryFn: getRoles },
            { queryKey: ['getPermissions'], queryFn: getPermissions }
        ]
    });

    const isLoading = results.some(result => result.isLoading);

    useEffect(() => {
        if (results[0].data) setRoles(results[0].data)
        if (results[1].data) setPermissions(results[1].data)
    }, [results]);

    const handleCheckboxChange = (permissionId: string) => {
        if (setSelectedPermissions) {
            setSelectedPermissions((prev) =>
                prev.includes(permissionId)
                    ? prev.filter((id) => id !== permissionId)
                    : [...prev, permissionId]
            );
        }
    };

    if (isLoading) return <Spinner />
    return (
        <>
            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase" htmlFor="name">
                    Nombre:
                </label>
                <input
                    autoComplete="off"
                    id="name"
                    type="text"
                    placeholder={"Nombre del usuario"}
                    className="border border-black p-3"
                    {...register("name", { required: "El nombre es obligatorio" })}
                />
                {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase" htmlFor="username">
                    Username:
                </label>
                <input
                    autoComplete="off"
                    id="username"
                    type="text"
                    placeholder={"Nombre del usuario"}
                    className="border border-black p-3"
                    {...register("username", {
                        required: "El username es obligatorio",
                        maxLength: {
                            value: 16,
                            message: "El username no puede tener más de 16 caracteres",
                        },
                    })}
                />
                {errors.username && (
                    <Error>{errors.username?.message?.toString()}</Error>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase" htmlFor="username">
                    Email (Opcional):
                </label>
                <input
                    autoComplete="off"
                    id="email"
                    type="email"
                    placeholder={"Correo Electronico"}
                    className="border border-black p-3"
                    {...register("email", {
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "El formato del email es inválido",
                        },
                    })}
                />
                {errors.email && <Error>{errors.email?.message?.toString()}</Error>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase" htmlFor="password">
                    Contraseña:
                </label>
                <input
                    autoComplete="off"
                    id="password"
                    type="password"
                    placeholder={"Contraseña"}
                    className="border border-black p-3"
                    {...register("password", {
                        required: !isEditing && "La contraseña es obligatoria",
                    })}
                />
                {errors.password && (
                    <Error>{errors.password?.message?.toString()}</Error>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase" htmlFor="role">
                    Rol:
                </label>

                <select
                    id="role"
                    className="border border-black p-3"
                    {...register("roles", { required: "El rol es obligatorio" })}
                >
                    <option value="">--SELECCIONE UNA OPCIÓN--</option>
                    {roles.map((role) => (
                        <option value={role.name} key={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>

                {errors.roles && <Error>{errors.roles?.message?.toString()}</Error>}
            </div>

            <fieldset className="shadow p-5">
                <legend className="text-3xl font-bold">Permisos</legend>
                <div className="flex flex-col gap-5 my-5 w-full p-2 max-h-96 overflow-y-scroll">
                    <table className="table">
                        <thead>
                            <tr className="thead-tr">
                                <th className="thead-th">Permiso</th>
                                <th className="thead-th">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map(permission => (
                                <tr className="tbody-tr">
                                    <td className="tbody-td">
                                        {permission.name}
                                    </td>
                                    <td className="tbody-td">
                                        <input
                                            type="checkbox"
                                            id={permission.name}
                                            value={permission.id}
                                            {...register("permissions", {
                                                required: "Selecciona al menos un permiso",
                                            })}
                                            className="w-10 h-6"
                                            onChange={() => handleCheckboxChange?.(permission.id.toString())}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {errors.permissions && (
                    <Error>{errors.permissions.message?.toString()}</Error>
                )}
            </fieldset>
        </>
    )
}
