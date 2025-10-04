import { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { AudioOutlined } from '@ant-design/icons'
import { useTranscription } from '@/services/hooks/useTranscriptions'

interface ButtonProps {
  setInput: React.Dispatch<React.SetStateAction<string>>
}

function MicButton({ setInput }: ButtonProps) {
  const { uploadFile, transcription } = useTranscription()

  const [recording, setRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const handleStartRecording = async () => {
    console.log('Starting recording...')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        })
        console.log('Recorded blob:', audioBlob)
        await uploadFile(audioBlob) // هنسيب useEffect يتصرف
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (err) {
      console.error('Mic error:', err)
    }
  }

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  // 👇 UseEffect يتابع الترانسكربشن ويحدّث الـ input
  useEffect(() => {
    if (transcription) {
      setInput(transcription)
    }
  }, [transcription, setInput])

  return (
    <Button
      onClick={recording ? handleStopRecording : handleStartRecording}
      className={`rounded-full ${recording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
      shape="circle"
      icon={<AudioOutlined />}
    />
  )
}

export default MicButton
