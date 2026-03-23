'use client'

import { ChatHeader } from '@/components/chat-header'
import { ChatArea } from '@/components/chat-area'
import { ChatInput } from '@/components/chat-input'
import { useChat } from '@/hooks/use-chat'

export default function Page() {
  const { messages, isTyping, hasStarted, sendMessage } = useChat()

  return (
    <div
      className="flex flex-col h-dvh bg-[#FAFAF7]"
      style={{ paddingTop: '56px' /* header height */ }}
    >
      <ChatHeader />

      <ChatArea
        messages={messages}
        isTyping={isTyping}
        hasStarted={hasStarted}
        onChipClick={sendMessage}
      />

      <ChatInput onSend={sendMessage} disabled={isTyping} />
    </div>
  )
}
