import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalNotasProblemas: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [problema, setProblema] = React.useState("");
    const [solucion, setSolucion] = React.useState("");

    const handleGuardar = () => {
        console.log("Problema:", problema);
        console.log("Solución:", solucion);
        // Aquí podrías agregar la lógica para guardar o procesar los datos ingresados
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-3/6">
                <h2 className="text-2xl font-semibold text-center mb-4">Registro de Problemas y Soluciones</h2>
                
                <div className="mb-4">
                    <label htmlFor="problema" className="block text-sm font-medium text-gray-700">¿Cuál fue el problema?</label>
                    <textarea 
                        id="problema" 
                        className="w-full mt-2 p-2 border border-gray-300 rounded-lg" 
                        placeholder="Describe el problema que encontraste." 
                        value={problema} 
                        onChange={(e) => setProblema(e.target.value)} 
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="solucion" className="block text-sm font-medium text-gray-700">¿Cómo lo solucionaste?</label>
                    <textarea 
                        id="solucion" 
                        className="w-full mt-2 p-2 border border-gray-300 rounded-lg" 
                        placeholder="Explica cómo solucionaste el problema." 
                        value={solucion} 
                        onChange={(e) => setSolucion(e.target.value)} 
                    />
                </div>

                <div className="flex justify-between">
                    <button 
                        onClick={onClose} 
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Cerrar
                    </button>
                    <button 
                        onClick={handleGuardar} 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalNotasProblemas;
