'use client'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div style={{ padding: 24 }}>
      <h2>Something went wrong.</h2>
      <p>{error?.message || 'Unexpected error.'}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
