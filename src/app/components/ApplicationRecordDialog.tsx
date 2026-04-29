import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

interface ApplicationRecord {
  id: number;
  applyDate: string;
  status: string;
  applicant: string;
  applicationNumber: string;
  applyType: string;
}

interface ApplicationRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bidName: string;
}

export default function ApplicationRecordDialog({
  open,
  onOpenChange,
  bidName,
}: ApplicationRecordDialogProps) {
  const mockRecords: ApplicationRecord[] = [
    {
      id: 1,
      applyDate: "2026-03-18 10:30",
      status: "申请完成",
      applicant: "张三",
      applicationNumber: "APP-2026-0318-001",
      applyType: "人员",
    },
    {
      id: 2,
      applyDate: "2026-03-15 14:20",
      status: "申请中",
      applicant: "李四",
      applicationNumber: "APP-2026-0315-002",
      applyType: "企业资质",
    },
    {
      id: 3,
      applyDate: "2026-03-10 09:15",
      status: "审批拒绝",
      applicant: "王五",
      applicationNumber: "APP-2026-0310-003",
      applyType: "合同案例",
    },
    {
      id: 4,
      applyDate: "2026-03-05 16:30",
      status: "终止",
      applicant: "赵六",
      applicationNumber: "APP-2026-0305-004",
      applyType: "人员",
    },
    {
      id: 5,
      applyDate: "2026-03-01 11:00",
      status: "撤销",
      applicant: "钱七",
      applicationNumber: "APP-2026-0301-005",
      applyType: "企业资质",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>申请记录</DialogTitle>
          <DialogDescription>标书项目：{bidName}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">申请时间</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">申请流水号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">申请人</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">申请类型</th>
              </tr>
            </thead>
            <tbody>
              {mockRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-900">{record.applyDate}</td>
                  <td className="px-4 py-3 text-gray-900">{record.applicationNumber}</td>
                  <td className="px-4 py-3 text-gray-900">{record.applicant}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        record.status === "申请完成"
                          ? "bg-green-100 text-green-700"
                          : record.status === "申请中"
                          ? "bg-blue-100 text-blue-700"
                          : record.status === "审批拒绝"
                          ? "bg-red-100 text-red-700"
                          : record.status === "终止"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{record.applyType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}