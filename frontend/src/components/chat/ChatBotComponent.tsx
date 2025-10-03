import Message from '@/components/chat/Message'
import { Button, Input } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { useChatBot } from '@/services/hooks/useChatbot'

import MicButton from './MicButton'

function ChatBotComponent() {
  const { messages, input, setInput, handleSend, messagesEndRef } = useChatBot()

  return (
    <div
      className="w-full shadow-2xl rounded-3xl bg-[#252537] border border-gray-700 overflow-hidden flex flex-col"
      style={{ minHeight: 500 }}
    >
      {/* Messages */}
      <div className="flex-1 flex flex-col max-h-[400px] overflow-y-auto p-6 space-y-4 text-gray-200">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-gray-500 italic">
            What do you want to read today?
          </div>
        ) : (
          <div>
            {messages.map((msg, index) => (
              <Message key={index} msg={msg} index={index} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 flex items-center border-t border-gray-700 bg-[#1e1e2e] rounded-b-3xl space-x-2">
        <MicButton setInput={setInput} />
        <Input
          type="text"
          className="flex-1 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-700 transition rounded-xl px-4 py-3 text-gray-200 bg-[#2a2a3d] shadow-sm outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          suffix={
            <Button
              onClick={handleSend}
              type="primary"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-5 py-3 rounded-xl shadow-lg flex items-center justify-center"
            >
              <SendOutlined style={{ fontSize: 18 }} />
            </Button>
          }
        />
      </div>
    </div>
  )
}

export default ChatBotComponent
