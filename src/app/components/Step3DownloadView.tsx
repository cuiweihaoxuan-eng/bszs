import { Download, FileText, CheckCircle2, Link } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

interface AppliedCertificate {
  id: number;
  type: string;
  name: string;
  applicationNumber: string;
  status: string;
  applyDate: string;
}

interface Step3DownloadViewProps {
  appliedCertificates: AppliedCertificate[];
  selectedForDownload: number[];
  toggleDownloadSelection: (id: number) => void;
  PRIMARY_COLOR: string;
}

export default function Step3DownloadView({
  appliedCertificates,
  selectedForDownload,
  toggleDownloadSelection,
  PRIMARY_COLOR,
}: Step3DownloadViewProps) {
  // 按类型分组已申请的证书
  const groupedCertificates = {
    人员: appliedCertificates.filter(cert => cert.type === "人员"),
    企业资质: appliedCertificates.filter(cert => cert.type === "企业资质"),
    合同案例: appliedCertificates.filter(cert => cert.type === "合同案例"),
  };

  // 切换分类全选
  const toggleCategorySelectAll = (category: string, certs: AppliedCertificate[]) => {
    const categoryIds = certs.map(cert => cert.id);
    const allSelected = categoryIds.every(id => selectedForDownload.includes(id));
    
    if (allSelected) {
      // 取消全选
      categoryIds.forEach(id => {
        if (selectedForDownload.includes(id)) {
          toggleDownloadSelection(id);
        }
      });
    } else {
      // 全选
      categoryIds.forEach(id => {
        if (!selectedForDownload.includes(id)) {
          toggleDownloadSelection(id);
        }
      });
    }
  };

  // 检查分类是否全选
  const isCategoryAllSelected = (certs: AppliedCertificate[]) => {
    if (certs.length === 0) return false;
    return certs.every(cert => selectedForDownload.includes(cert.id));
  };

  // 检查分类是否部分选中
  const isCategoryIndeterminate = (certs: AppliedCertificate[]) => {
    if (certs.length === 0) return false;
    const selectedCount = certs.filter(cert => selectedForDownload.includes(cert.id)).length;
    return selectedCount > 0 && selectedCount < certs.length;
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedCertificates).map(([category, certs]) => (
        <div key={category} className="border border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {certs.length > 0 && (
                <Checkbox
                  checked={isCategoryAllSelected(certs)}
                  onCheckedChange={() => toggleCategorySelectAll(category, certs)}
                  className="data-[state=indeterminate]:bg-gray-400"
                  {...(isCategoryIndeterminate(certs) ? { 'data-state': 'indeterminate' } : {})}
                />
              )}
              <h3 className="font-medium text-gray-900">
                {category} ({certs.length})
              </h3>
            </div>
            {certs.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                style={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
              >
                <Link className="w-3.5 h-3.5 mr-1.5" />
                获取下载链接
              </Button>
            )}
          </div>
          <div className="divide-y divide-gray-100">
            {certs.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                暂无申请的{category}证书
              </div>
            ) : (
              certs.map((cert) => (
                <div key={cert.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      checked={selectedForDownload.includes(cert.id)}
                      onCheckedChange={() => toggleDownloadSelection(cert.id)}
                    />
                    <FileText className="w-5 h-5 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {cert.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        申请时间: {cert.applyDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 min-w-[320px]">
                      <div className="text-right w-28">
                        <div className="text-xs text-gray-500">申请流水号</div>
                        <div className="text-xs font-medium text-gray-700">{cert.applicationNumber}</div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap w-20 text-center ${
                          cert.status === '审核通过'
                            ? 'bg-green-100 text-green-700'
                            : cert.status === '审核中'
                            ? 'text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                        style={cert.status === '审核中' ? { backgroundColor: '#FEF3C7', color: '#92400E' } : {}}
                      >
                        {cert.status}
                      </span>
                      <div className="w-20">
                        {cert.status === '审核通过' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs whitespace-nowrap w-full"
                            style={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                          >
                            查看证书
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}

      <div className="flex gap-2 pt-4">
        <Button 
          className="text-white" 
          style={{ backgroundColor: PRIMARY_COLOR }}
          disabled={selectedForDownload.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          批量下载证书 ({selectedForDownload.length})
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <FileText className="w-4 h-4 mr-2" />
          生成标书
        </Button>
      </div>
    </div>
  );
}