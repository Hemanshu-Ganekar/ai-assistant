import { useState } from 'react'

function InputBox({ onSend, loading, disabled = false }) {
  const [input, setInput] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = input.trim()

    if (!trimmed || loading || disabled) {
      return
    }

    onSend(trimmed)
    setInput('')
  }

  const handlePdfClick = () => {
    // No-op: PDF button is just UI
    console.log('[InputBox] PDF button clicked (no action)')
  }

  const isDisabled = loading || disabled

  return (
    <form className="input-box" onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={disabled ? 'Waiting for Ollama...' : 'Ask your study question...'}
          disabled={isDisabled}
          style={{ flex: 1, opacity: isDisabled ? 0.6 : 1 }}
        />
        <button
          type="button"
          onClick={handlePdfClick}
          disabled={isDisabled}
          title="PDF Upload (Demo)"
          style={{
            padding: '8px 12px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.5 : 1,
          }}
        >
          📄 PDF
        </button>
        <button type="submit" disabled={isDisabled || !input.trim()}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </form>
  )
}

export default InputBox
