// Print route is no longer used for PDF generation.
// PDF is now generated directly from Python HTML templates.
// This route remains only if needed for future direct-link sharing.

export default function Print() {
  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#888', textAlign: 'center' }}>
      <h2>Re-Po Generator</h2>
      <p>This route is handled server-side.</p>
    </div>
  )
}