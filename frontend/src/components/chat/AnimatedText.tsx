import { Typewriter } from 'react-simple-typewriter'

function AnimatedText({ msg, onDone }: { msg: string; onDone?: () => void }) {
  return (
    <Typewriter
      words={[msg]}
      loop={1}
      cursorStyle="|"
      typeSpeed={40}
      deleteSpeed={50}
      delaySpeed={1000}
      onLoopDone={onDone}
    />
  )
}
export default AnimatedText
