import GraphComponent from '@/components/KnowledgeGraph/GraphComponent'
import SearchSemantic from '@/components/ui/SearchSemantic'

function HomePage() {
  return (
    <div className="grid grid-cols-4 relative pt-9 bg-[#1e1e2e] text-gray-200">
      {/* 📝 المحتوى */}
      <div className="col-span-3 h-screen overflow-y-auto border-r border-gray-700">
        <h1 className="text-3xl ps-4 py-5 font-semibold text-gray-100">
          Title
        </h1>

        <div className="max-w-md px-4">
          <SearchSemantic />
        </div>

        <div className="p-4 space-y-4">
          {Array.from({ length: 50 }).map((_, i) => (
            <p key={i} className="text-gray-300">
              Content line {i + 1}
            </p>
          ))}
        </div>
      </div>

      {/* 📊 الجراف */}
      <div className="max-w-md w-full col-start-4 col-span-1 px-4">
        <h2 className="text-xl text-gray-100 uppercase font-semibold font-sans pb-7">
          Interactive Graph
        </h2>
        <div className="overflow-hidden min-h-[150px] h-[200px] rounded-2xl border border-gray-700 bg-[#2a2a36]">
          <GraphComponent />
        </div>
      </div>
    </div>
  )
}

export default HomePage
