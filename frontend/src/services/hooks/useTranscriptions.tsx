import { useState } from 'react'

export function useTranscription() {
  const [transcription, setTranscription] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (file: File | Blob) => {
    setIsLoading(true)
    setError(null)
    setTranscription(null)
    console.log('Uploading file:', file)
    try {
      const formData = new FormData()
      formData.append('file', file, 'recording.webm')
      formData.append('model', 'whisper-large-v3-turbo')

      const response = await fetch(
        'https://api.groq.com/openai/v1/audio/transcriptions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: formData,
        }
      )

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || 'Failed to transcribe')
      }
      console.log('Transcription result:', data)
      setTranscription(data.text)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return { transcription, isLoading, error, uploadFile }
}
