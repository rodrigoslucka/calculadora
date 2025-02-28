import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Modal = ({
    startDate,
    endDate,
    messageError,
    handleClosedModal,
    setStartDate,
    setEndDate,
    handleRegistrarFecha,
    isSpecial,
    setIsSpecial,
    editingId
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="relative bg-white p-5 rounded-lg flex flex-col justify-center items-center gap-5 w-96 h-auto shadow-lg border border-gray-300">
                
                {/* Logos laterales */}
                <img src="/logo-left.png" alt="Logo Izquierdo" className="absolute left-[-50px] w-16 h-16" />
                <img src="/logo-right.png" alt="Logo Derecho" className="absolute right-[-50px] w-16 h-16" />
                
                {/* Botón de cierre */}
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 rounded-full bg-white p-2 shadow-md"
                    onClick={() => handleClosedModal()}
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>

                <p className='text-xl uppercase text-center text-indigo-900 font-bold'>{editingId ? 'Editar Fecha' : 'Registrar Fecha'}</p>
                <hr className="w-full border-t-2 border-gray-400 mb-3" />

                <div className='flex flex-col w-full'>
                    <label className='mb-2 text-indigo-900 uppercase font-bold'>Fecha Inicial: </label>
                    <input
                        type="date"
                        className="p-2 border rounded focus:outline-none focus:border-indigo-800"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className='flex flex-col w-full'>
                    <label className='mb-2 text-indigo-900 uppercase font-bold'>Fecha Final:</label>
                    <input
                        type="date"
                        className="p-2 border rounded focus:outline-none focus:border-indigo-800"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <div className='flex flex-col w-full'>
                    <label className='mb-2 text-indigo-900 uppercase font-bold'>Tipo:</label>
                    <select
                        className="p-2 border rounded focus:outline-none focus:border-indigo-800 appearance-none transition"
                        value={isSpecial.toString()}
                        onChange={(e) => setIsSpecial(e.target.value === 'true')}
                    >
                        <option value="false" className="py-2 bg-white">Normal</option>
                        <option value="true" className="py-2 bg-white">Especial</option>
                    </select>
                </div>

                {messageError && (
                    <p className='p-2 bg-red-700 text-white rounded-md w-full text-center font-bold uppercase'>
                        {messageError}
                    </p>
                )}

                <button
                    className="bg-indigo-800 py-2 px-6 rounded w-full uppercase text-white font-bold mb-2 hover:bg-indigo-900 transition-colors"
                    onClick={() => handleRegistrarFecha()}
                >
                    {editingId ? 'Guardar Cambios' : 'Registrar'}
                </button>

                {/* Pie de página */}
                <footer className="text-sm text-gray-500 mt-4 text-center border-t pt-2 w-full">
                    © 2024 Mi Aplicación - Todos los derechos reservados
                </footer>
            </div>
        </div>
    );
};

export default Modal;