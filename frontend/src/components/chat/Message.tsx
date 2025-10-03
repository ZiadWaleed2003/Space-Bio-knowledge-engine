interface IMessage {
  from: 'user' | 'bot'
  text: string
}
function Message({ msg, index }: { msg: IMessage; index: number }) {
  return (
    <div className="w-full flex-1 ">
      <div
        key={index}
        className={`px-3 py-4  w-fit rounded-lg text-gray-900 max-w-xs ${
          msg.from === 'user'
            ? 'bg-gray-200 justify-self-end '
            : 'bg-gray-300  '
        }`}
      >
        {msg.text}
      </div>
    </div>
  )
}

export default Message
