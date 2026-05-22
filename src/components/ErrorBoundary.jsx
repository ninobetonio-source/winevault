import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // log to console for now
    console.error('ErrorBoundary caught', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <pre className="mt-4 bg-surface-900 p-4 rounded max-w-full overflow-auto text-sm">{String(this.state.error)}</pre>
          <div className="mt-4 text-gray-400">Open browser console for more details.</div>
        </div>
      )
    }
    return this.props.children
  }
}
