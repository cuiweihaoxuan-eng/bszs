import { Outlet } from "react-router";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧菜单 */}
      <aside 
        className="bg-white border-r border-gray-200 flex flex-col transition-all duration-300"
        style={{ width: isCollapsed ? '64px' : '240px' }}
      >
        {/* Logo 区域 */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#5047E6' }}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">标书系统</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded flex items-center justify-center mx-auto" style={{ backgroundColor: '#5047E6' }}>
              <FileText className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* 菜单项 */}
        <nav className="flex-1 py-4">
          <div className={isCollapsed ? "px-2" : "px-3"}>
            <div 
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer"
              style={{ backgroundColor: '#F0EFFD', color: '#5047E6' }}
              title={isCollapsed ? "标书管理" : ""}
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>标书管理</span>}
            </div>
          </div>
        </nav>

        {/* 收起/展开按钮 */}
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isCollapsed ? "展开菜单" : "收起菜单"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">收起</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* 右侧内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部栏 */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="text-xl font-semibold text-gray-900">标书管理</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">管理员</span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: '#F0EFFD', color: '#5047E6' }}>
              P
            </div>
          </div>
        </header>

        {/* 主内容区域 */}
        <main className="flex-1 bg-[#F5F8FA] p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}