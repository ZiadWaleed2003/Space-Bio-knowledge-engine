import { Modal } from 'antd'
import './styles.css'
import ChatBotComponent from '@/components/chat/ChatBotComponent'
interface IModalContainerProps {
  isModalOpen: boolean
  handleClose?: () => void
}
function ModalContainer({ isModalOpen, handleClose }: IModalContainerProps) {
  return (
    <Modal
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      closeIcon={null}
      onCancel={handleClose}
      footer={null}
      classNames={{ content: '!rounded-3xl !p-0' }}
    >
      <ChatBotComponent />
    </Modal>
  )
}

export default ModalContainer
