import React from 'react';
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

import { useEffect, useState } from 'react'
import Modal from './Modal';
import { formatFecha } from './helpers';
import { SyncLoader } from 'react-spinners';


function App() {
  const [isOpen, setIsOpen] = useState(Boolean);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [messageError, setMessageError] = useState('');
  const [fechas, setFechas] = useState([])
  const [fechasModificadas, setFechasModificadas] = useState([])
  const [respuesta, setRespuesta] = useState(false)
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState('');
  const [resultadoSpecific, setResultadoSpecific] = useState('');
  const [isSpecial, setIsSpecial] = useState(false);
  const [editingId, setEditingId] = useState(null);


  useEffect(() => {
    // Hacer los calculos aqui
    setFechasModificadas(fechas.map(fecha => {
      const dateObjStart = new Date(fecha.startDate + 'T00:00:00');
      const dateObjEnd = new Date(fecha.endDate + 'T00:00:00');

      // calculamos el Total de dias trabajados en las fechas seleccionadas
      const differenceInMilliseconds = dateObjEnd - dateObjStart;
      let resultado = differenceInMilliseconds / (1000 * 60 * 60 * 24) + 1;

      // Operacion para cada fecha
      let days = 0;
      let months = 0;
      let years = 0;

      // Si la fecha inicial es menor o igual a la fecha final seleccionada
      while (dateObjStart <= dateObjEnd) {
        const totalDiasMes = new Date(dateObjStart.getFullYear(), dateObjStart.getMonth() + 1, 0).getDate(); 4
        if (resultado >= totalDiasMes) {
          months++;
          resultado = resultado - totalDiasMes
        } else {
          days = resultado;
        }
        if (months >= 12) {
          years++;
          months = 0
        }
        dateObjStart.setMonth(dateObjStart.getMonth() + 1);
      }
      return {
        ...fecha, days, months, years
      }
    }));
  }, [fechas]);

  const leadingActions = (id) => (
    <LeadingActions>
      <SwipeAction onClick={() => handleEditar(id)}>
        Editar
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = (id) => (
    <TrailingActions>
      <SwipeAction
        destructive={true}
        onClick={() => handleEliminar(id)}
      >
        Eliminar
      </SwipeAction>
    </TrailingActions>
  );

  const handleEditar = (id) => {
    setIsOpen(true);
    setEditingId(id);

    const fechaEditar = fechas.find((fecha) => fecha.id === id);
    if (fechaEditar) {
      setStartDate(fechaEditar.startDate);
      setEndDate(fechaEditar.endDate);
      setIsSpecial(fechaEditar.isSpecial);
    }
  }

  const handleEliminar = (id) => {
    const fechasEliminadas = fechas.filter(fecha => fecha.id !== id);
    setFechas(fechasEliminadas);
  }

  const handleRegistrarFecha = () => {

    const currentDate = new Date();
    const endDateSelect = new Date(endDate);

    if (startDate === '' || endDate === '') {
      setMessageError('Ambos campos son obligatorios')

      setTimeout(() => {
        setMessageError('')
      }, 3000);
      return;
    }

    if (startDate > endDate) {
      setMessageError('la fecha inicial debe ser menor a la fecha final')

      setTimeout(() => {
        setMessageError('');
      }, 3000);
      return;
    }

    if (endDateSelect > currentDate) {
      setMessageError('La fecha final debe ser menor o igual a la fecha actual');

      setTimeout(() => {
        setMessageError('')
      }, 3000);
      return;
    }

    const fecha = {
      startDate,
      endDate,
      isSpecial,
      id: editingId || Date.now(), // Usa editingId si está en modo edición, de lo contrario, crea uno nuevo
    };

    if (editingId) {
      // Si está en modo edición, actualiza el registro existente en lugar de agregar uno nuevo
      setFechas((prevFechas) =>
        prevFechas.map((f) => (f.id === editingId ? fecha : f))
      );
      setEditingId(null); // Sale del modo edición después de actualizar
    } else {
      // const fecha = {
      // startDate, endDate, isSpecial, id: Date.now()
      // }
      setFechas([...fechas, fecha])
    }

    // Resetear
    setStartDate('')
    setEndDate('');
    setIsOpen(false);
    setEditingId(null);
    setIsSpecial(false);
  };

  const handleClosedModal = () => {
    setStartDate('')
    setEndDate('')
    setMessageError('');
    setIsOpen(false);
    setEditingId(null);
    setIsSpecial(false);
  }

  const calcFechaGenerales = () => {
    let years = 0;
    let months = 0;
    let days = 0;

    fechasModificadas.forEach(fecha => {
      years += fecha.years;
      months += fecha.months;
      days += fecha.days


      if (months >= 11) {
        years++;
        months = months - 11;
      }

      if (days >= 30) {
        months++;
        days = days - 30;
      }
    });

    console.log(months);

    return `${years} años, ${months} ${months === 1 ? 'mes' : 'meses'} , ${days} dias`;
  }

  const calcFechaSpecific = () => {
    const fechasSpecific = fechasModificadas.filter(fecha => fecha.isSpecial !== false);
    let years = 0;
    let months = 0;
    let days = 0;
    fechasSpecific.forEach(fecha => {
      years += fecha.years;
      months += fecha.months;
      days += fecha.days

      if (months >= 11) {
        years++;
        months = months - 11;
      }

      if (days >= 30) {
        months++;
        days = days - 30;
      }
    });
    return `${years} ${years === 1 ? 'año' : 'años'}, ${months} ${months === 1 ? 'mes' : 'meses'} , ${days} ${days === 1 ? 'dia' : 'dias'}`;
  }

  const handleCalcDatesGeneral = () => {
    setResultadoSpecific('');
    setRespuesta(false);
    setLoading(true)
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    setRespuesta(true);
    const resultadoGeneral = calcFechaGenerales();
    setResultado(resultadoGeneral)
  }

  const handleCalcDatesSpecific = () => {
    setResultado('')
    setRespuesta(false);
    setLoading(true)
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    setRespuesta(true);
    const resultadoSpecifico = calcFechaSpecific();
    setResultadoSpecific(resultadoSpecifico)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">      
        <div className=' bg-indigo-900 p-16 shadow-gray-900'>        
          <div className='bg-white max-w-3xl shadow-lg rounded-lg p-7 mx-auto'>
            <img src="/Logo_Icarus.png" alt="Logo Izquierdo" className="rounded float-start w-24 h-24 mx-4" />          
            <img src="/Quimeras_Logo.png" alt="Logo Derecho" className="rounded float-end w-24 h-24 mx-4" />   
            <h1 className="text-xl md:text-3xl uppercase text-center">Calculadora de Fechas</h1>

            <div className="flex justify-center">
              <button
                className="bg-indigo-800 py-2 px-6 rounded-md text-white font-bold m-5 hover:bg-indigo-900 uppercase"
                onClick={() => setIsOpen(true)}
              >Registrar Fecha</button>
            </div>
          </div>
        </div>

        {isOpen &&
          <Modal
            handleClosedModal={handleClosedModal}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            handleRegistrarFecha={handleRegistrarFecha}
            startDate={startDate}
            endDate={endDate}
            messageError={messageError}
            isSpecial={isSpecial}
            setIsSpecial={setIsSpecial}
            editingId={editingId}
          />
        }

        {
          fechasModificadas.length === 0
            ?
            <p className='text-center mt-7 text-xl font-medium'>No hay registros</p>
            :
            <>
              <p className='text-center mt-7 text-xl font-medium'>Fechas Registradas</p>

              <ul className='w-3/4 md:w-2/5 mx-auto mt-5'>
                {fechasModificadas.map(fecha => (

                  <SwipeableList
                    key={fecha.id}
                  >
                    <SwipeableListItem
                      leadingActions={leadingActions(fecha.id)}
                      trailingActions={trailingActions(fecha.id)}
                    >
                      <li
                        className={`w-full sombra p-4 mb-5 text-center ${fecha.isSpecial ? 'bg-yellow-400' : 'bg-white'}`}
                      >
                        <p className='font-medium'>{formatFecha(fecha)}</p>
                      </li>

                    </SwipeableListItem>
                  </SwipeableList>
                ))}
              </ul>

              {
                fechasModificadas.length > 1 &&
                <>
                  <div className='flex flex-col sm:flex-row justify-center gap-4 mt-10 mb-10 mx-10'>
                    <button
                      onClick={() => handleCalcDatesGeneral()}
                      className='bg-indigo-700 p-3 rounded-md text-white font-bold  hover:bg-indigo-800 uppercase transition-colors'
                    >Calcular Fechas Generales</button>
                    <button
                      onClick={() => handleCalcDatesSpecific()}
                      className='bg-indigo-700 p-3 rounded-md text-white font-bold  hover:bg-indigo-800 uppercase  transition-colors'
                    >Calcular Fechas Especificas</button>
                  </div>

                  {
                    loading ?
                      <div className="sweet-loading flex justify-center mb-10">
                        <SyncLoader
                          color="#332d97"
                          cssOverride={{}}
                          loading
                          margin={8}
                          size={20}
                          speedMultiplier={0.7}
                        />
                      </div>

                      :
                      <>
                        {
                          respuesta &&
                          <>
                            {
                              resultado &&
                              <p
                                className='mx-auto w-4/5 sm:w-2/5 sombra p-4 bg-white text-center rounded-lg mt-10 mb-10 font-bold text-xl '
                              >{resultado}</p>
                            }

                            {
                              resultadoSpecific &&
                              <p
                                className='mx-auto w-4/5 sm:w-2/5 sombra p-4 text-center rounded-lg mt-10 mb-10 font-bold text-xl bg-white'
                              >{resultadoSpecific}</p>
                            }
                            
                          </>
                        }
                      </>
                  }
                </>
              }                        
            </>          
        } 
               
      </main> 
        <footer className="bg-gray-800 text-white text-center p-4 w-full">
          Copyright © Consultora Quimeras e Icarus Consultores - Desarrollado por Ing. Joel Llanos - Cel. 72549764
        </footer>
    </div>  
  )
}

export default App