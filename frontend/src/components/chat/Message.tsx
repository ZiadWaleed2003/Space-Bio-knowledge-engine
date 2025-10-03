import dayjs from './../../../node_modules/dayjs/esm/index'

interface IMessage {
  from: 'user' | 'bot'
  text: string
  timestamp: string
}

function Message({ msg, index }: { msg: IMessage; index: number }) {
  return (
    <div className="w-full flex-1">
      <div
        key={index}
        className={`px-3 py-2 w-fit rounded-lg text-gray-900 max-w-xs mb-2 ${
          msg.from === 'user' ? 'bg-gray-200 justify-self-end' : 'bg-gray-300'
        }`}
      >
        <div>{msg.text}</div>
        <div className="text-xs text-gray-600 mt-2">
          {msg.from} • {dayjs(msg.timestamp).format('HH:mm')}
        </div>
      </div>
    </div>
  )
}

export default Message
