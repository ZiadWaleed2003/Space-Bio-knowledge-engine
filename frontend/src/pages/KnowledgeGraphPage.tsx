import GraphComponent from '@/components/KnowledgeGraph/GraphComponent'
import { FloatButton } from 'antd'
import { CustomerServiceOutlined } from '@ant-design/icons'
import ModalContainer from '@/components/ui/models/ModalContainer'
import { useState } from 'react'
function KnowledgeGraphPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <main className="h-screen w-screen">
      <FloatButton
        shape="circle"
        type="primary"
        className="z-10"
        onClick={() => setIsModalOpen(true)}
        style={{ insetInlineEnd: 15 }}
        icon={<CustomerServiceOutlined />}
      />
      <ModalContainer
        isModalOpen={isModalOpen}
        handleClose={() => {
          setIsModalOpen(false)
        }}
      />
      <GraphComponent />
    </main>
  )
}

export default KnowledgeGraphPage
