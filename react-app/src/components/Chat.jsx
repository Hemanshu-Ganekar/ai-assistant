import { useEffect, useRef } from 'react'
import Message from './Message'

function Chat({ messages, loading }) {
  const chatRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, loading])

  return (
    <section className="chat-window" ref={chatRef}>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {loading && (
        <div className="message-row assistant">
          <div className="message-bubble assistant-bubble loading">Assistant is thinking...</div>
        </div>
      )}
    </section>
  )
}

export default Chat
