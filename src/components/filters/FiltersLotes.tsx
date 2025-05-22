import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { useQuery } from '@tanstack/react-query';
import { FiltersLotesType } from '@/views/agricola/lotes/IndexLotes';
import Filters from '../Filters';
import { getFincas } from '@/api/FincasAPI';

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setFilters: Dispatch<SetStateAction<FiltersLotesType>>;
    setTempFilters: Dispatch<SetStateAction<FiltersLotesType>>;
    tempFilters: FiltersLotesType;
}

const initialValues = {
    name: "",
    cdp: "",
    finca_id: ""
}


export default function FiltersLotes({ isOpen, setIsOpen, setFilters, setTempFilters, tempFilters }: Props) {

    const { data: fincas } = useQuery({
        queryKey: ['getAllFincas'],
        queryFn: getFincas,
    });

    const filterFincas = fincas?.filter(finca => +finca.id < 7);

    const handleFilterTempChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTempFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilterData = () => {
        setFilters(tempFilters);
        setIsOpen(false);
    };

    const handleResetFilters = () => {
        setTempFilters(initialValues);
        setFilters(initialValues);
        setIsOpen(false);
    }

    return (
        <Filters isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className='mt-5 space-y-5'>
                <div>
                    <label className="block text-sm font-medium">Lote</label>
                    <input type="text" name="name" className="w-full border p-2 rounded" placeholder="Nombre del lote"
                        onChange={handleFilterTempChange} value={tempFilters.name}
                        autoComplete="off"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">CDP Activo</label>
                    <input type="text" name="cdp" className="w-full border p-2 rounded" placeholder="Ingrese el cdp"
                        onChange={handleFilterTempChange} value={tempFilters.cdp}
                        autoComplete="off"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Finca</label>
                    <select className="w-full border p-2 rounded" name="finca_id"
                        onChange={handleFilterTempChange} value={tempFilters.finca_id || ""}
                    >
                        <option value="">Todas</option>
                        {filterFincas?.map(finca => (
                            <option key={finca.id} value={finca.id}>{finca.name}</option>
                        ))}
                    </select>
                </div>


                <div className="border-t pt-3 space-y-2">
                    <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded"
                        onClick={handleFilterData}
                    >
                        Buscar
                    </button>

                    <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                        onClick={handleResetFilters}
                    >
                        Borrar Filtros
                    </button>
                </div>
            </div>
        </Filters>
    )
}
