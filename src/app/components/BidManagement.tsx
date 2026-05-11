import { useState } from "react";
import { Button } from "./ui/button";
import CertificateCallDialog from "./CertificateCallDialog";

interface BidRecord {
  id: string;
  code: string;
  name: string;
  manager: string;
  createTime: string;
  creator: string;
  status: string;
}

const mockData: BidRecord[] = [
  {
    id: "1",
    code: "BS-2026-001",
    name: "某市智慧城市建设项目",
    manager: "张三",
    createTime: "2026-03-15",
    creator: "李四",
    status: "进行中",
  },
  {
    id: "2",
    code: "BS-2026-002",
    name: "政务系统升级改造项目",
    manager: "王五",
    createTime: "2026-03-10",
    creator: "李四",
    status: "待提交",
  },
  {
    id: "3",
    code: "BS-2026-003",
    name: "教育信息化建设项目",
    manager: "赵六",
    createTime: "2026-03-08",
    creator: "李四",
    status: "进行中",
  },
  {
    id: "4",
    code: "BS-2026-004",
    name: "医疗大数据平台建设",
    manager: "钱七",
    createTime: "2026-03-05",
    creator: "李四",
    status: "已完成",
  },
  {
    id: "5",
    code: "BS-2026-005",
    name: "交通管理系统项目",
    manager: "孙八",
    createTime: "2026-03-01",
    creator: "李四",
    status: "进行中",
  },
];

export default function BidManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<BidRecord | null>(null);

  const handleCertificateCall = (bid: BidRecord) => {
    setSelectedBid(bid);
    setDialogOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 顶部搜索栏 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="标书名称"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': '#5047E6' } as React.CSSProperties}
          />
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': '#5047E6' } as React.CSSProperties}
          />
          <span className="flex items-center text-gray-500">至</span>
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': '#5047E6' } as React.CSSProperties}
          />
          <Button className="text-white" style={{ backgroundColor: '#5047E6' }}>
            搜索
          </Button>
          <Button className="text-white" style={{ backgroundColor: '#5047E6' }}>
            新增
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-16">
                序号
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                项目编号
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                项目名称
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-24">
                项目负责人
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-32">
                创建时间
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-20">
                创建人
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-20">
                状态
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-24">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((bid, index) => (
              <tr key={bid.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{bid.code}</td>
                <td className="px-4 py-3 text-sm cursor-pointer hover:underline" style={{ color: '#5047E6' }}>
                  {bid.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{bid.manager}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{bid.createTime}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{bid.creator}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      bid.status === "进行中"
                        ? ""
                        : bid.status === "待提交"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                    style={bid.status === "进行中" ? { backgroundColor: '#F0EFFD', color: '#5047E6' } : {}}
                  >
                    {bid.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <Button
                    onClick={() => handleCertificateCall(bid)}
                    className="text-white text-sm px-3 py-1"
                    style={{ backgroundColor: '#5047E6' }}
                  >
                    证书调用
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="p-4 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-600">
          共 {mockData.length} 条记录，每页显示 10 条
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            上一页
          </Button>
          <Button variant="outline" size="sm" className="text-white" style={{ backgroundColor: '#5047E6' }}>
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            下一页
          </Button>
        </div>
      </div>

      {/* 证书调用弹窗 */}
      <CertificateCallDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        bidData={selectedBid}
      />
    </div>
  );
}