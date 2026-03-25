function Sidebar({ conversations, activeConversationId, onSelectConversation, onNewChat, loading }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button type="button" className="new-chat-button" onClick={onNewChat} disabled={loading}>
          + New Chat
        </button>
      </div>

      <div className="conversation-list" role="list">
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId
          const preview = conversation.messages.at(-1)?.content || 'No messages yet'

          return (
            <button
              key={conversation.id}
              type="button"
              className={`conversation-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectConversation(conversation.id)}
              disabled={loading && !isActive}
            >
              <span className="conversation-title">{conversation.title}</span>
              <span className="conversation-preview">{preview}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default Sidebar
