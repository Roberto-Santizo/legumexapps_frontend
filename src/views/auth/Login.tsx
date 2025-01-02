type Props = {}

export default function Login({ }: Props) {
    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <h2 className="text-center text-4xl mb-5 font-bold p-5 md:p-0">Iniciar Sesión</h2>

            <form method="POST" action="{{ route('login') }}" className="flex flex-col gap-5 w-1/4" noValidate>
                <div className="flex flex-col gap-1">
                    <label htmlFor="username" className="block font-medium text-sm text-gray-700 uppercase">Nombre de Usuario:</label>
                    <input autoComplete="off" name="username" id="username" placeholder="Coloque su nombre de usuario" type="text" className="border border-black p-1.5 focus:border-indigo-500 focus:ring-indigo-500 rounded" />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="block font-medium text-sm text-gray-700 uppercase">Contraseña:</label>
                    <input autoComplete="off" name="password" id="password" placeholder="Coloque su contraseña" type="password" className="border border-black p-1.5 focus:border-indigo-500 focus:ring-indigo-500 rounded" />
                </div>
            </form>
        </div>
    )
}