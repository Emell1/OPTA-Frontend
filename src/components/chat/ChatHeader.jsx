// Icons
import { History, Menu } from "lucide-react"

// Libs
import { useChatStore } from "../../../stores/chat-store"

// Components
import Button from "../Button"


export default function ChatHeader() {
  
  // Zustand store
  const toggleHistory = useChatStore(state => state.toggleHistory)
  const toggleNav = useChatStore(state => state.toggleNav)
  
  return (
    <div className={`
      bg-white
        px-4
        py-8
        shadow
        flex
        flex-col sm:flex-row
        justify-between
        items-center
        gap-4
      `}>

      <Button
        onClick={() => toggleNav()}
        isActive={true}
        className={`
          w-auto
          md:hidden
        `}
      >
        <Menu className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => alert("Nueva Conversación")}
        isActive={true}
        className={`
          w-auto
        `}
      >
        Nueva Conversación
      </Button>

      <Button
        onClick={() => toggleHistory()}
        isActive={true}
        className={`
          w-auto
          flex
          items-center
          gap-2
        `}
      >
        {/* Icon */}
        <History className="w-5 h-5" />

        {/* Text */}
        <span>Historial</span>
      </Button>
    </div>
  )
}