// Icons
import { SquareX } from 'lucide-react'

// Libs
import { useState, useEffect } from "react"
import { getTipoLead, getMomento, getPrograma } from "../api/chatbot.api"
import { useChatStore } from "../../stores/chat-store"

// Media
import logo from "../assets/logo.webp"

// Components
import Button from "./Button"


export default function Sidebar() {

  // Api data
  const [dataTipoLead, setDataTipoLead] = useState([])
  const [dataPrograma, setDataPrograma] = useState([])
  const [dataMomento, setDataMomento] = useState([])

  // Sidebar state
  const [selectedTipoLead, setSelectedTipoLead] = useState(null)
  const [selectedPrograma, setSelectedPrograma] = useState(null)
  const [selectedMomento, setSelectedMomento] = useState({ id: null })

  // Render texts
  const tipoLeadNames = dataTipoLead.map((tipo) => tipo.nombre)

  // Zustand store
  const setMomento = useChatStore(state => state.setMomento)
  const resetMessages = useChatStore(state => state.resetMessages)
  const showNav = useChatStore(state => state.showNav)
  const toggleNav = useChatStore(state => state.toggleNav)

  // Load tipo leads when mounted
  useEffect(() => {
    async function loadAll() {
      try {
        const tipoLead = await getTipoLead()
        setDataTipoLead(tipoLead.data)
        setSelectedTipoLead(tipoLead.data[0]?.id)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    loadAll()
  }, [])

  // Update programs when change tipo lead
  useEffect(() => {
    if (selectedTipoLead === null) { return }

    // Update program options
    getPrograma(selectedTipoLead).then(programas => {
      setDataPrograma(programas.data)
    })

    // Reset selected program
    setSelectedPrograma(null)

  }, [selectedTipoLead])

  // Update moments when change program
  useEffect(() => {
    if (selectedPrograma === null || selectedPrograma === "") {
      // Reset moments
      setDataMomento([])
      setSelectedMomento({ id: null })
      setMomento({ id: null })
    } else {
      getMomento(selectedPrograma).then(momentos => {
        setDataMomento(momentos.data)
      })
    }
  }, [selectedPrograma])

  // Update submoments when change moment
  useEffect(() => {
    setMomento(selectedMomento)
    resetMessages()
  }, [selectedMomento])

  // Monitor chat state 
  // useEffect(() => {
  //   console.log({ selectedTipoLead, selectedPrograma, selectedMomento })
  // }, [selectedTipoLead, selectedPrograma, selectedMomento])

  return (
    <div
      className={`
        w-64
        bg-[#F9F9F9]
        flex-col
        fixed md:static
        h-screen
        ${showNav ? 'left-0' : '-left-96'}
        duration-300
        shadow-2xl md:shadow-none
        z-20
      `}
    >
      <div className="p-4">
        <div className="mb-4">

          {/* Logo and close btn*/}
          <div 
            className={`
              flex
              border-b
              border-gray-400
              mb-12
              pb-6
              md:pt-3
              flex-col
              items-end
              justify-center
              gap-2
            `}
          >
            {/* Close button */}
            <Button
              onClick={() => toggleNav()}
              className={`
                border-none
                !p-0
                w-auto
                !bg-transparent
                md:hidden
              `}
              isActive={true}
            >
              <SquareX
                className={`
                  w-10
                  h-10
                  text-[#7D3C98]
                `}
              />
            </Button>

            {/* Logo */}
            <img src={logo || "/placeholder.svg"} alt="Logo" className="w-full mx-auto" />
          </div>

          {/* toggle tipo lead */}
          <div className="toggle flex gap-4 justify-center items-center">
            <span className="text-sm font-medium">
              {tipoLeadNames[0]}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={selectedTipoLead == dataTipoLead[0]?.id}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTipoLead(dataTipoLead[0].id)
                  } else {
                    setSelectedTipoLead(dataTipoLead[1].id)
                  }
                }}
              />
              <div className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all bg-[#7D3C98] rotate-180"></div>
            </label>
            <span className="text-sm font-medium">
              {tipoLeadNames[1]}
            </span>
          </div>
        </div>

        <select
          className="w-full p-2 border border-gray-300 rounded-md bg-[#7D3C98] text-white"
          onChange={(e) => setSelectedPrograma(e.target.value)}
        >
          <option value="">Programas</option>
          {/* Render programas of current tipo lead */}
          {dataPrograma.map((program) => (
            <option key={program.id} value={program.id}>
              {program.nombre.charAt(0).toUpperCase() + program.nombre.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

      </div>
      <div className="flex flex-col gap-2 p-4">
        {/* render momentos of the current programa */}
        {dataMomento.map((moment) => (
          <Button
            key={moment.id}
            isActive={moment.id == selectedMomento.id}
            onClick={() => setSelectedMomento({ id: moment.id, name: moment.nombre })}
          >
            {moment.nombre}
          </Button>
        ))}
      </div>
    </div>
  )
}