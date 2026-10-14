import { Component } from 'react'

// If anything crashes while rendering, show the message instead of a blank page.
export default class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (!this.state.error) return this.props.children
    if (this.props.fallback) return this.props.fallback
    return (
      <main style={{ maxWidth: 640, margin: '60px auto', padding: 20, fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontFamily: 'Georgia, serif' }}>Something went wrong</h1>
        <p>ROOMLY hit an error. Please send this message to whoever is helping you debug:</p>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#EDE4D8', padding: 12, borderRadius: 8 }}>{String(this.state.error?.stack || this.state.error)}</pre>
        <button onClick={() => { try { localStorage.clear() } catch {} location.reload() }}>Clear saved designs and reload</button>
      </main>
    )
  }
}
