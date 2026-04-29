import { useState } from "react";
import { Button } from "./ui/button";
import CertificateCallDialog from "./CertificateCallDialog";

interface BidRecord {
  id: string;
  name: string;
  projectName: string;
  bidDate: string;
  status: string;
  amount: string;
}

const mockData: BidRecord[] = [
  {
    id: "1",
    name: "某市智慧城市建设项目",
    projectName: "智慧城市一期",
    bidDate: "2026-03-15",
    status: "进行中",
    amount: "5000万",
  },
  {
    id: "2",
    name: "政务系统升级改造项目",
    projectName: "政务云平台",
    bidDate: "2026-03-10",
    status: "待提交",
    amount: "3200万",
  },
  {
    id: "3",
    name: "教育信息化建设项目",
    projectName: "智慧校园",
    bidDate: "2026-03-08",
    status: "进行中",
    amount: "2800万",
  },
  {
    id: "4",
    name: "医疗大数据平台建设",
    projectName: "健康云",
    bidDate: "2026-03-05",
    status: "已完成",
    amount: "4500万",
  },
  {
    id: "5",
    name: "交通管理系统项目",
    projectName: "智慧交通",
    bidDate: "2026-03-01",
    status: "进行中",
    amount: "6000万",
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                序号
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                标书名称
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                项目名称
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                投标日期
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                状态
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                金额
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((bid, index) => (
              <tr key={bid.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 text-sm cursor-pointer hover:underline" style={{ color: '#5047E6' }}>
                  {bid.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {bid.projectName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{bid.bidDate}</td>
                <td className="px-6 py-4 text-sm">
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
                <td className="px-6 py-4 text-sm text-gray-900">{bid.amount}</td>
                <td className="px-6 py-4 text-sm">
                  <Button
                    onClick={() => handleCertificateCall(bid)}
                    className="text-white text-sm px-4 py-1"
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