import { ChevronRight, ChevronDown, Check, Download, FileText, History, Search, CheckCircle2, Circle, Plus, Minus, Trash2, Link } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import ApplicationRecordDialog from "./ApplicationRecordDialog";
import Step3DownloadView from "./Step3DownloadView";

interface BidRecord {
  id: string;
  name: string;
  projectName: string;
  bidDate: string;
  status: string;
  amount: string;
}

interface CertificateCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bidData: BidRecord | null;
}

export default function CertificateCallDialog({
  open,
  onOpenChange,
  bidData,
}: CertificateCallDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState("personnel");
  const [selectedCertificates, setSelectedCertificates] = useState<number[]>([]);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [selectedForDownload, setSelectedForDownload] = useState<number[]>([]);
  
  // 待申请清单附件选择状态
  const [selectedAttachments, setSelectedAttachments] = useState<{[key: number]: string[]}>({});

  // 主题色
  const PRIMARY_COLOR = '#5047E6';
  const PRIMARY_BG = '#F0EFFD';
  const PRIMARY_BORDER = '#E0DFFB';

  // 已申请清单展开状态
  const [showAppliedList, setShowAppliedList] = useState(false);

  // 项目应标数据
  const [projects] = useState([
    {
      id: 1,
      projectName: "某市智慧政务云平台建设项目",
      projectId: "PROJ-2024-001",
      bidPackageId: "BP-001",
      bidOpenDate: "2024-12-20",
      createdTime: "2024-11-15 10:30:00",
    },
    {
      id: 2,
      projectName: "教育信息化管理系统采购项目",
      projectId: "PROJ-2024-002",
      bidPackageId: "BP-002",
      bidOpenDate: "2024-12-25",
      createdTime: "2024-11-18 14:20:00",
    },
    {
      id: 3,
      projectName: "5G智能运营平台建设",
      projectId: "PROJ-2024-003",
      bidPackageId: "BP-003",
      bidOpenDate: "2025-01-10",
      createdTime: "2024-11-20 09:15:00",
    },
    {
      id: 4,
      projectName: "银行核心业务系统升级改造",
      projectId: "PROJ-2024-004",
      bidPackageId: "BP-004",
      bidOpenDate: "2025-01-15",
      createdTime: "2024-11-22 16:45:00",
    },
    {
      id: 5,
      projectName: "智慧医疗综合平台",
      projectId: "PROJ-2023-089",
      bidPackageId: "BP-089",
      bidOpenDate: "2024-11-30",
      createdTime: "2024-10-25 11:00:00",
    },
  ]);

  // 手动绑定弹窗状态
  const [bindDialogOpen, setBindDialogOpen] = useState(false);
  const [bindingItem, setBindingItem] = useState<any>(null);
  const [bindingCategory, setBindingCategory] = useState<string>("");

  // 绑定表单状态
  const [bindFormData, setBindFormData] = useState({
    // 人员绑定
    certificateType: "",
    // 企业资质绑定
    qualificationName: "",
    // 合同案例绑定
    productName: "",
    contractAmountRange: "",
    contractTime: "",
    contractType: "",
  });

  // 人员查询条件组（支持多组条件）
  const [personnelQueryGroups, setPersonnelQueryGroups] = useState([
    {
      id: 1,
      certificateName: "",
      ownerName: "",
      company: ""
    }
  ]);

  // 项目绑定状态
  const [boundProject, setBoundProject] = useState<any>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [employeeCodeDialogOpen, setEmployeeCodeDialogOpen] = useState(false);
  const [employeeCodeInput, setEmployeeCodeInput] = useState("");
  // 通过工号添加的虚拟人员数据
  const [virtualPersonnel, setVirtualPersonnel] = useState<any[]>([]);

  // 过滤项目列表
  const filteredProjects = projects.filter(project =>
    project.projectName.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
    project.projectId.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  // 选择投标项目
  const selectProject = (project: any) => {
    setBoundProject(project);
    setProjectSearchQuery(project.projectName);
    setShowProjectDropdown(false);
  };

  // 移除已选项目
  const removeProject = () => {
    setBoundProject(null);
    setProjectSearchQuery("");
  };

  // 第一步：解析结果 - 改为列表形式（去掉专利和软著）
  const [parsedRequirements] = useState({
    personnel: {
      title: "人员",
      items: [
        // 项目经理
        { 
          id: 1, 
          type: "项目经理", 
          requirement: "", 
          completed: false, 
          originalText: "", 
          score: 10,
          subItems: [
            { id: '1-1', type: '学历', name: "本科", matchStatus: "matched" as const, score: 2, originalText: "项目经理需具备本科及以上学历" },
            { id: '1-2', type: '身份证', name: "身份证", matchStatus: "matched" as const, score: 0, originalText: "项目经理需提供身份证复印件" },
            { id: '1-3', type: '劳动合同', name: "劳动合同", matchStatus: "matched" as const, score: 0, originalText: "项目经理需提供与投标单位签订的劳动合同" },
            { id: '1-4', type: '社保证明', name: "社保证明", matchStatus: "unmatched" as const, score: 0, originalText: "需提供投标截止日前连续六个月的社保缴纳证明" },
            { id: '1-5', type: '履历表', name: "履历表", matchStatus: "matched" as const, score: 0, originalText: "项目经理需提供详细履历表" },
            { id: '1-6', type: '资质证书', name: "系统架构师", matchStatus: "matched" as const, score: 5, originalText: "项目经理需具备系统架构师证书" },
            { id: '1-7', type: '资质证书', name: "PMP", matchStatus: "unmatched" as const, score: 3, originalText: "项目经理需具备PMP证书" },
          ]
        },
        // 研发人员
        { 
          id: 2, 
          type: "研发人员", 
          requirement: "", 
          completed: false, 
          originalText: "", 
          score: 15,
          subItems: [
            { id: '2-1', type: '学历', name: "本科（5人）", matchStatus: "matched" as const, score: 3, originalText: "研发人员需具备本科及以上学历，至少5人" },
            { id: '2-2', type: '身份证', name: "身份证（5人）", matchStatus: "matched" as const, score: 0, originalText: "所有研发人员需提供身份证复印件" },
            { id: '2-3', type: '劳动合同', name: "劳动合同（5人）", matchStatus: "matched" as const, score: 0, originalText: "研发人员需提供与投标单位签订的劳动合同" },
            { id: '2-4', type: '社保证明', name: "社保证明（5人）", matchStatus: "unmatched" as const, score: 0, originalText: "需提供投标截止日前连续六个月的社保缴纳证明" },
            { id: '2-5', type: '履历表', name: "履历表（5人）", matchStatus: "matched" as const, score: 0, originalText: "所有研发人员需提供详细履历表" },
            { id: '2-6', type: '资质证书', name: "信息系统项目管理师（2人）", matchStatus: "matched" as const, score: 6, originalText: "研发团队需包含2名信息系统项目管理师" },
            { id: '2-7', type: '资质证书', name: "软件设计师（3人）", matchStatus: "unmatched" as const, score: 6, originalText: "研发团队需包含3名软件设计师" },
          ]
        },
      ],
    },
    companyQualification: {
      title: "企业资质",
      items: [
        { id: 1, type: "营业执照", requirement: "有效期内，经营范围包含软件开发", completed: true, originalText: "投标人需提供有效期内的营业执照，且经营范围应包含软件开发相关业务", matchStatus: "matched" as const, score: 0 },
        { id: 2, type: "资质证书", requirement: "软件企业认定（甲级）", completed: true, originalText: "投标人需具备甲级软件企业认定证书", matchStatus: "matched" as const, score: 5 },
        { id: 3, type: "ISO认证", requirement: "ISO9001质量管理体系认证", completed: true, originalText: "需提供ISO9001质量管理体系认证证书", matchStatus: "matched" as const, score: 3 },
        { id: 4, type: "资信证明", requirement: "AAA级信用等级", completed: false, originalText: "投标人需具备AAA级企业信用等级证明", matchStatus: "unmatched" as const, score: 2 },
        { id: 5, type: "社保缴纳证明", requirement: "企业近一年社保缴纳记录", completed: true, originalText: "需提供企业近12个月的社保缴纳明细", matchStatus: "matched" as const, score: 0 },
        { id: 6, type: "发明专利", requirement: "与项目相关（2项）", completed: true, originalText: "投标人需具备至少2项与智慧城市或政务云相关的发明专利", matchStatus: "matched" as const, score: 4 },
        { id: 7, type: "实用新型专利", requirement: "5项", completed: true, originalText: "需提供5项实用新型专利证书", matchStatus: "matched" as const, score: 3 },
        { id: 8, type: "软件著作权", requirement: "与项目相关（5项）", completed: false, originalText: "投标人需具备至少5项与本项目相关的软件著作权证书", matchStatus: "unmatched" as const, score: 5 },
        { id: 9, type: "著作权时间", requirement: "近三年内获得", completed: true, originalText: "软件著作权需在2023年1月1日之后获得", matchStatus: "matched" as const, score: 0 },
      ],
    },
    performance: {
      title: "合同案例",
      items: [
        { id: 1, type: "项目经验", requirement: "智慧城市或政务云项目（3个）", completed: false, originalText: "投标人需提供近三年内至少3个智慧城市建设或政务云平台项目案例", matchStatus: "unmatched" as const, score: 10 },
        { id: 2, type: "合同金额", requirement: "单个项目500万以上（3个）", completed: false, originalText: "所提供的项目案例单个合同金额应不低于500万元人民币", matchStatus: "unmatched" as const, score: 5 },
        { id: 3, type: "项目时间", requirement: "近三年内完成", completed: true, originalText: "项目验收时间需在2023年1月1日至今", matchStatus: "matched" as const, score: 0 },
        { id: 4, type: "合同类型", requirement: "正式合同或框架订单", completed: true, originalText: "需提供正式签订的合同或框架协议订单", matchStatus: "matched" as const, score: 0 },
      ],
    },
  });

  // 人员证书模拟数据（添加所属公司和工号字段）
  const [personnelCertificates] = useState([
    {
      id: 1,
      certificateName: "系统架构师",
      professionalField: "软件工程",
      level: "高级",
      certificateType: "职称证书",
      expiryDate: "2027-12-31",
      ownerName: "张三",
      ownerCode: "EMP001",
      phone: "13800138001",
      department: "研发部",
      ownerCompany: "中天火箭技术股份有限公司",
      certificateExpired: false,
      socialSecurityExpired: false,
      education: "本科",
      hasResume: true,
    },
    {
      id: 2,
      certificateName: "PMP",
      professionalField: "项目管理",
      level: "中级",
      certificateType: "资格证书",
      expiryDate: "2026-08-15",
      ownerName: "李四",
      ownerCode: "EMP002",
      phone: "13800138002",
      department: "项目部",
      ownerCompany: "中天火箭技术股份有限公司",
      certificateExpired: false,
      socialSecurityExpired: false,
      education: "硕士",
      hasResume: true,
    },
    {
      id: 3,
      certificateName: "信息系统项目管理师",
      professionalField: "信息系统",
      level: "高级",
      certificateType: "职称证书",
      expiryDate: "2028-03-20",
      ownerName: "王五",
      ownerCode: "EMP003",
      phone: "13800138003",
      department: "技术部",
      ownerCompany: "北京易通信息技术有限公司",
      certificateExpired: false,
      socialSecurityExpired: false,
      education: "本科",
      hasResume: true,
    },
    {
      id: 4,
      certificateName: "高级工程师",
      professionalField: "计算机",
      level: "高级",
      certificateType: "职称证书",
      expiryDate: "2029-06-30",
      ownerName: "赵六",
      ownerCode: "EMP004",
      phone: "13800138004",
      department: "研发部",
      ownerCompany: "北京易通信息技术有限公司",
      certificateExpired: false,
      socialSecurityExpired: true,
      education: "本科",
      hasResume: false,
    },
  ]);

  // 企业资质查询状态
  const [qualificationQuery, setQualificationQuery] = useState({
    qualificationName: "",
    categoryPath: "", // 改为单一的分类路径
    patentType: "",
    companySubject: "",
    qualificationStatus: "",
  });

  // 合同案例查询状态
  const [performanceQuery, setPerformanceQuery] = useState({
    contractName: "",
    productCategory: "",
    amountRange: "",
    customAmountRange: "",
    signingParty: "",
    customerIndustry: "",
    signingYears: [] as string[],
  });

  // 资质分类数据（三级级联）
  const qualificationCategories = {
    "基础资质": {
      "营业执照": ["一般营业执照", "特殊营业执照"],
      "组织机构代码证": ["企业", "事业单位"],
    },
    "ISO认证": {
      "质量管理": ["ISO9001", "ISO9002"],
      "环境管理": ["ISO14001"],
      "信息安全": ["ISO27001", "ISO27002"],
    },
    "���件研发资质": {
      "高新技术企业": ["国家级", "省级"],
      "软件企业认定": ["甲级", "乙级"],
      "CMMI认证": ["CMMI-3", "CMMI-5"],
    },
    "信息系统建设": {
      "集成资质": ["CS-1级", "CS-2级", "CS-3级"],
      "服务资质": ["ITSS-1级", "ITSS-2级", "ITSS-3级"],
    },
    "涉密资质": {
      "集成资质": ["甲级", "乙级", "丙级"],
      "咨询资质": ["甲级", "乙级"],
    },
    "专利与软著": {
      "发明专利": ["发明专利"],
      "实用新型专利": ["实用新型"],
      "外观设计专利": ["外观设计"],
      "软件著作权": ["软件著作权"],
    },
  };

  // 生成所有分类路径的扁平列表
  const categoryPathOptions: string[] = [];
  Object.entries(qualificationCategories).forEach(([cat1, level2]) => {
    Object.entries(level2).forEach(([cat2, level3]) => {
      level3.forEach((cat3) => {
        categoryPathOptions.push(`${cat1} - ${cat2} - ${cat3}`);
      });
    });
  });

  // 企业资质模拟数据（添加新字段）
  const [companyQualifications] = useState([
    {
      id: 1,
      qualificationNumber: "91110000600010000U",
      qualificationName: "营业执照",
      category1: "基础资质",
      category2: "营业执照",
      category3: "一般营业执照",
      patentType: "-",
      companySubject: "中天火箭技术股份有限公司",
      validFrom: "2020-01-01",
      validUntil: "2030-12-31",
      allowOriginalLoan: true,
      allowUse: true,
      custodian: "张管理员",
      custodianCode: "ADM001",
      status: "有效",
    },
    {
      id: 2,
      qualificationNumber: "A-JX-02-20200601",
      qualificationName: "高新技术企业证书",
      category1: "软件研发资质",
      category2: "高新技术企业",
      category3: "国家级",
      patentType: "-",
      companySubject: "中天火箭技术股份有限公司",
      validFrom: "2023-01-03",
      validUntil: "2029-01-03",
      allowOriginalLoan: true,
      allowUse: true,
      custodian: "李管理员",
      custodianCode: "ADM002",
      status: "有效",
    },
    {
      id: 3,
      qualificationNumber: "CRED2120210127HM",
      qualificationName: "ISO9001质量管理体系认证",
      category1: "ISO认证",
      category2: "质量管理",
      category3: "ISO9001",
      patentType: "-",
      companySubject: "北京易通信息技术有限公司",
      validFrom: "2024-05-04",
      validUntil: "2027-05-04",
      allowOriginalLoan: false,
      allowUse: true,
      custodian: "王管理员",
      custodianCode: "ADM003",
      status: "有效",
    },
    {
      id: 4,
      qualificationNumber: "Q490020816IPHM",
      qualificationName: "ISO27001信息安全认证",
      category1: "ISO认证",
      category2: "信息安全",
      category3: "ISO27001",
      patentType: "-",
      companySubject: "北京易通信息技术有限公司",
      validFrom: "2024-07-02",
      validUntil: "2027-07-02",
      allowOriginalLoan: false,
      allowUse: true,
      custodian: "赵管理员",
      custodianCode: "ADM004",
      status: "有效",
    },
    {
      id: 5,
      qualificationNumber: "CMMI-2024-0356",
      qualificationName: "CMMI-3级认证",
      category1: "软件研发资质",
      category2: "CMMI认证",
      category3: "CMMI-3",
      patentType: "-",
      companySubject: "中天火箭技术股份有限公司",
      validFrom: "2025-06-30",
      validUntil: "2028-06-30",
      allowOriginalLoan: true,
      allowUse: true,
      custodian: "张管理员",
      custodianCode: "ADM001",
      status: "有效",
    },
    {
      id: 6,
      qualificationNumber: "ZL202110001234.5",
      qualificationName: "基于云计算的智慧城市管理系统",
      category1: "专利与软著",
      category2: "发明专利",
      category3: "发明专利",
      patentType: "发明专利",
      companySubject: "中天火箭技术股份有限公司",
      validFrom: "2024-06-15",
      validUntil: "2044-06-15",
      allowOriginalLoan: true,
      allowUse: true,
      custodian: "李管理员",
      custodianCode: "ADM002",
      status: "有效",
    },
    {
      id: 7,
      qualificationNumber: "ZL202220005678.X",
      qualificationName: "智能数据采集装置",
      category1: "专利与软著",
      category2: "实用新型专利",
      category3: "实用新型",
      patentType: "实用新型专利",
      companySubject: "北京易通信息技术有限公司",
      validFrom: "2024-03-20",
      validUntil: "2034-03-20",
      allowOriginalLoan: false,
      allowUse: true,
      custodian: "王管理员",
      custodianCode: "ADM003",
      status: "有效",
    },
    {
      id: 8,
      qualificationNumber: "2024SR123456",
      qualificationName: "智慧政务服务平台V1.0",
      category1: "专利与软著",
      category2: "软件著作权",
      category3: "软件著作权",
      patentType: "软件著作权",
      companySubject: "中天火箭技术股份有限公司",
      validFrom: "2024-05-10",
      validUntil: "2074-05-10",
      allowOriginalLoan: true,
      allowUse: true,
      custodian: "赵管理员",
      custodianCode: "ADM004",
      status: "有效",
    },
    {
      id: 9,
      qualificationNumber: "OLD-2020-001",
      qualificationName: "旧版软件系统V1.0",
      category1: "专利与软著",
      category2: "软件著作权",
      category3: "软件著作权",
      patentType: "软件著作权",
      companySubject: "北京易通信息技术有限公司",
      validFrom: "2020-01-01",
      validUntil: "2023-12-31",
      allowOriginalLoan: false,
      allowUse: false,
      custodian: "张管理员",
      custodianCode: "ADM001",
      status: "已过期",
    },
  ]);

  // 合同案例模拟数据
  const [performanceCases] = useState([
    {
      id: 101,
      contractName: "某市智慧政务云平台建设项目",
      contractId: "HT-2024-001",
      customerName: "某市人民政府",
      signingCompany: "亚信科技",
      customerIndustry: "政府机关",
      signingYear: "2024",
      amountRange: "500-1000万",
      productCategory: "智慧城市",
    },
    {
      id: 102,
      contractName: "教育信息化管理系统",
      contractId: "HT-2023-045",
      customerName: "某省教育厅",
      signingCompany: "亚信中国",
      customerIndustry: "教育",
      signingYear: "2023",
      amountRange: "500-1000万",
      productCategory: "教育信息化",
    },
    {
      id: 103,
      contractName: "5G智能运营平台",
      contractId: "HT-2025-012",
      customerName: "中国移动",
      signingCompany: "亚信科技",
      customerIndustry: "运营商",
      signingYear: "2025",
      amountRange: "2000-5000万",
      productCategory: "5G网络",
    },
    {
      id: 104,
      contractName: "银行核心业务系统升级",
      contractId: "HT-2024-078",
      customerName: "某商业银行",
      signingCompany: "亚信中国",
      customerIndustry: "金融",
      signingYear: "2024",
      amountRange: "1000-2000万",
      productCategory: "金融科技",
    },
    {
      id: 105,
      contractName: "智慧医疗综合平台",
      contractId: "HT-2023-089",
      customerName: "某市卫生健康委员会",
      signingCompany: "亚信科技",
      customerIndustry: "医疗卫生",
      signingYear: "2023",
      amountRange: "200-500万",
      productCategory: "医疗信息化",
    },
  ]);

  // 已申请清单模拟数据
  const [appliedCertificates, setAppliedCertificates] = useState([
    {
      id: 1,
      type: "人员",
      name: "系统架构师 - 张三",
      applicationNumber: "SQ202600001",
      status: "审核通过",
      applyDate: "2026-04-10 10:30",
    },
    {
      id: 2,
      type: "人员",
      name: "PMP - 李四",
      applicationNumber: "SQ202600002",
      status: "审核中",
      applyDate: "2026-04-12 14:20",
    },
    {
      id: 3,
      type: "企业资质",
      name: "ISO9001质量管理体系认证",
      applicationNumber: "SQ202600003",
      status: "审核通过",
      applyDate: "2026-04-08 09:15",
    },
    {
      id: 4,
      type: "企业资质",
      name: "高新技术企业证书",
      applicationNumber: "SQ202600004",
      status: "审核未通过",
      applyDate: "2026-04-05 16:45",
    },
    {
      id: 5,
      type: "合同案例",
      name: "某市智慧政务云平台建设项目",
      applicationNumber: "SQ202600005",
      status: "审核通过",
      applyDate: "2026-04-15 11:00",
    },
    {
      id: 6,
      type: "合同案例",
      name: "5G智能运营平台",
      applicationNumber: "SQ202600006",
      status: "审核中",
      applyDate: "2026-04-16 15:30",
    },
  ]);

  // 专利模拟数据
  const [patents] = useState([
    {
      id: 1,
      patentName: "基于云计算的智慧城市管理系统",
      patentType: "发明专利",
      patentNumber: "ZL202110001234.5",
      applicant: "XX科技有限公司",
      authorizationDate: "2024-06-15",
    },
    {
      id: 2,
      patentName: "政务数据安全传输方法",
      patentType: "发明专利",
      patentNumber: "ZL202110005678.9",
      applicant: "XX科技有限公司",
      authorizationDate: "2024-09-20",
    },
  ]);

  // 软著模拟数据
  const [copyrights] = useState([
    {
      id: 1,
      softwareName: "智慧政务服务平台V1.0",
      registrationNumber: "2024SR123456",
      company: "XX科技有限公司",
      registrationDate: "2024-05-10",
      version: "V1.0",
    },
    {
      id: 2,
      softwareName: "城市运营管理系统V2.0",
      registrationNumber: "2024SR234567",
      company: "XX科技有限公司",
      registrationDate: "2024-08-25",
      version: "V2.0",
    },
  ]);

  // 查询表单状态
  const [personnelQuery, setPersonnelQuery] = useState({
    certificateName: "",
    level: "",
    ownerName: "",
    company: "",
    education: "",
  });

  // 人员查询条件列表（支持多条）
  const [personnelQueryList, setPersonnelQueryList] = useState([
    {
      id: 1,
      certificateName: "",
      professionalField: "",
      level: "",
      ownerName: "",
      ownerCompany: "",
      usageCompany: "",
    },
  ]);

  const addQueryRow = () => {
    setPersonnelQueryList([
      ...personnelQueryList,
      {
        id: Date.now(),
        certificateName: "",
        professionalField: "",
        level: "",
        ownerName: "",
        ownerCompany: "",
        usageCompany: "",
      },
    ]);
  };

  const removeQueryRow = (id: number) => {
    if (personnelQueryList.length > 1) {
      setPersonnelQueryList(personnelQueryList.filter((row) => row.id !== id));
    }
  };

  const updateQueryRow = (id: number, field: string, value: string) => {
    setPersonnelQueryList(
      personnelQueryList.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const toggleSection = (section: keyof typeof parsedRequirements) => {
    // 这个功能现在不需要了因为改成列表形式
  };

  const toggleCertificateSelection = (id: number) => {
    setSelectedCertificates((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
    // 如果是取消选中且ID为负数（虚拟数据），清理附件和虚拟数据
    if (id < 0) {
      setSelectedAttachments(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      setVirtualPersonnel(prev => prev.filter(v => v.id !== id));
    }
  };

  const toggleDownloadSelection = (id: number) => {
    setSelectedForDownload(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // 处理手动输入工号添加人员证书到待申请清单
  const handleAddByEmployeeCode = () => {
    const codes = employeeCodeInput.split('\n').map(c => c.trim()).filter(c => c);
    if (codes.length === 0) return;

    // 固定的5种附件类型：学历证明、身份证、劳动合同、社保证明、履历表
    const defaultAttachments = ["学历证明", "身份证", "劳动合同", "社保证明", "履历表"];

    // 为每个工号创建虚拟人员数据
    const newVirtualData = codes.map((code) => ({
      id: -(Date.now() + Math.random() * 1000), // 唯一负数ID
      employeeCode: code,
      certificateName: "待查询",
      ownerName: code,
      ownerCompany: "-",
      department: "-",
      level: "-",
      isVirtual: true, // 标记为虚拟数据
    }));

    // 将新数据添加到虚拟人员列表
    setVirtualPersonnel(prev => [...prev, ...newVirtualData]);

    // 将新ID添加到选中证书
    setSelectedCertificates(prev => [...prev, ...newVirtualData.map(item => item.id)]);

    // 为这些记录设置默认附件选择
    setSelectedAttachments(prev => {
      const newState = { ...prev };
      newVirtualData.forEach(item => {
        newState[item.id] = [...defaultAttachments];
      });
      return newState;
    });

    // 清空输入并关闭弹窗
    setEmployeeCodeInput("");
    setEmployeeCodeDialogOpen(false);
  };

  // 申请借阅确认
  const confirmBorrowApplication = () => {
    setConfirmDialogOpen(false);

    // 获取当前tab类型
    const currentTab = activeTab;

    // 根据当前tab获取待申请的项目信息
    let itemsToApply: any[] = [];
    if (currentTab === "personnel") {
      const allItems = [...personnelCertificates, ...virtualPersonnel];
      itemsToApply = allItems.filter(cert => selectedCertificates.includes(cert.id));
    } else if (currentTab === "qualification") {
      itemsToApply = companyQualifications.filter(qual => selectedCertificates.includes(qual.id));
    } else if (currentTab === "performance") {
      itemsToApply = performanceCases.filter(perf => selectedCertificates.includes(perf.id));
    }

    // 为每个待申请项目创建已申请记录
    const newAppliedRecords = itemsToApply.map((item, idx) => {
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      let name = "";
      let type = "";
      if (currentTab === "personnel") {
        name = item.isVirtual ? `工号: ${item.employeeCode}` : `${item.certificateName} - ${item.ownerName}`;
        type = "人员";
      } else if (currentTab === "qualification") {
        name = item.qualificationName;
        type = "企业资质";
      } else {
        name = item.contractName;
        type = "合同案例";
      }

      return {
        id: Date.now() + idx,
        type,
        name,
        applicationNumber: `SQ${new Date().getFullYear()}${String(Date.now()).slice(-6)}`,
        status: "审核中",
        applyDate: timeStr,
      };
    });

    // 添加到已申请清单
    setAppliedCertificates(prev => [...prev, ...newAppliedRecords]);

    // 清空待申请列表
    setSelectedCertificates([]);
    setSelectedAttachments({});
    setVirtualPersonnel([]);
  };

  // 打开绑定弹窗
  const openBindDialog = (item: any, category: string, parentItem?: any) => {
    setBindingItem(item);
    setBindingCategory(category);
    setBindDialogOpen(true);
    
    // 如果有parentItem，说明是资质证书的子项
    if (parentItem) {
      setBindFormData({
        certificateType: "",
        qualificationName: "",
        productName: "",
        contractAmountRange: "",
        contractTime: "",
        contractType: "",
        isSubItem: true,
        parentType: parentItem.type,
      } as any);
    } else {
      setBindFormData({
        certificateType: "",
        qualificationName: "",
        productName: "",
        contractAmountRange: "",
        contractTime: "",
        contractType: "",
      });
    }
  };

  // 提交绑定
  const submitBinding = () => {
    console.log("绑定数据:", bindFormData);
    // 这里可以添加实际的绑定逻辑
    setBindDialogOpen(false);
  };

  const renderParseRequirementsStep = () => (
    <div className="space-y-4">
      {Object.entries(parsedRequirements).map(([key, section]) => {
        // 计算匹配数量，考虑子项
        let matchedCount = 0;
        let totalCount = 0;
        
        section.items.forEach((item: any) => {
          if (item.subItems) {
            // 如果有子项，统计子项的匹配情况
            item.subItems.forEach((subItem: any) => {
              totalCount++;
              if (subItem.matchStatus === "matched") {
                matchedCount++;
              }
            });
          } else {
            // 没有子项，统计项本身
            totalCount++;
            if (item.matchStatus === "matched") {
              matchedCount++;
            }
          }
        });

        return (
          <div key={key} className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {matchedCount >= totalCount ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <h3 className="font-medium text-gray-900">{section.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  已匹配 {matchedCount}/{totalCount}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-16">
                      状态
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-1/6">
                      要求类型
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-1/4">
                      具体要求
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-20">
                      分值
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      原文内容
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item: any) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 flex-nowrap">
                          <span className="text-sm text-gray-900 whitespace-nowrap">{item.type}</span>
                          {/* 只有非资质证书类型才在这里显示匹配标签 */}
                          {!item.subItems && (
                            <>
                              {item.matchStatus === "matched" ? (
                                <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 whitespace-nowrap flex-shrink-0">
                                  已匹配
                                </span>
                              ) : (
                                <span
                                  className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 cursor-pointer hover:bg-red-200 flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                                  onClick={() => openBindDialog(item, key)}
                                >
                                  <Link className="w-3 h-3" />
                                  未匹配
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {/* 如果有子项（资质证书），则展示子项列表 */}
                        {item.subItems ? (
                          <div className="space-y-1.5">
                            {item.subItems.map((subItem: any) => (
                              <div key={subItem.id} className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
                                <span className="whitespace-nowrap text-gray-600">{subItem.type}：</span>
                                <span className="whitespace-nowrap">{subItem.name}</span>
                                {subItem.matchStatus === "matched" ? (
                                  <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 whitespace-nowrap flex-shrink-0">
                                    已匹配
                                  </span>
                                ) : (
                                  <span
                                    className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 cursor-pointer hover:bg-red-200 flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                                    onClick={() => openBindDialog(subItem, key, item)}
                                  >
                                    <Link className="w-3 h-3" />
                                    未匹配
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          item.requirement
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: PRIMARY_COLOR }}>
                        {item.subItems ? (
                          <div className="space-y-1.5">
                            {item.subItems.map((subItem: any) => (
                              <div key={subItem.id} className="h-6 flex items-center">
                                {subItem.score > 0 ? subItem.score : '-'}
                              </div>
                            ))}
                          </div>
                        ) : (
                          item.score > 0 ? item.score : '-'
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 italic">
                        {item.subItems ? (
                          <div className="space-y-1.5">
                            {item.subItems.map((subItem: any) => (
                              <div key={subItem.id} className="h-6 flex items-center">
                                {subItem.originalText}
                              </div>
                            ))}
                          </div>
                        ) : (
                          item.originalText
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );

  // 渲染已申请清单（可复用组件）
  const renderAppliedListSection = (tabType: string) => {
    const filteredApplied = appliedCertificates.filter(cert => cert.type === tabType);
    
    if (filteredApplied.length === 0) {
      return null;
    }

    return (
      <div className="border border-gray-200 rounded-lg mt-4">
        <div
          className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100"
          onClick={() => setShowAppliedList(!showAppliedList)}
        >
          <h4 className="text-sm font-medium text-gray-700">
            已申请清单 ({filteredApplied.length})
          </h4>
          {showAppliedList ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </div>
        {showAppliedList && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left font-medium text-gray-700">证书名称</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">申请流水号</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">申请时间</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">审核状态</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplied.map((cert) => (
                  <tr key={cert.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2" style={{ color: PRIMARY_COLOR }}>{cert.name}</td>
                    <td className="px-3 py-2 text-gray-900">{cert.applicationNumber}</td>
                    <td className="px-3 py-2 text-gray-900">{cert.applyDate}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          cert.status === "审核通过"
                            ? "bg-green-100 text-green-700"
                            : cert.status === "审核中"
                            ? "text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        style={cert.status === "审核中" ? { backgroundColor: "#FEF3C7", color: "#92400E" } : {}}
                      >
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {cert.status === "审核通过" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          style={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                        >
                          查看证书
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderPersonnelTab = () => {
    // 合并真实证书数据和虚拟人员数据
    const allItems = [...personnelCertificates, ...virtualPersonnel];
    const selectedItems = allItems.filter((cert) =>
      selectedCertificates.includes(cert.id)
    );

    // 附件选项
    const attachmentOptions = [
      "学历证明",
      "身份证",
      "劳动合同",
      "社保证明",
      "履历表",
      "资质证书"
    ];

    // 切换附件选择
    const toggleAttachment = (certId: number, attachment: string) => {
      setSelectedAttachments(prev => {
        const current = prev[certId] || [];
        const exists = current.includes(attachment);
        return {
          ...prev,
          [certId]: exists 
            ? current.filter(a => a !== attachment)
            : [...current, attachment]
        };
      });
    };

    // 全选某个附件类型
    const selectAllAttachment = (attachment: string) => {
      setSelectedAttachments(prev => {
        const newState = { ...prev };
        selectedItems.forEach(cert => {
          const current = newState[cert.id] || [];
          if (!current.includes(attachment)) {
            newState[cert.id] = [...current, attachment];
          }
        });
        return newState;
      });
    };

    // 添加查询条件组
    const addQueryGroup = () => {
      const newId = Math.max(...personnelQueryGroups.map(g => g.id)) + 1;
      setPersonnelQueryGroups([...personnelQueryGroups, {
        id: newId,
        certificateName: "",
        ownerName: "",
        company: ""
      }]);
    };

    // 删除查询条件组
    const removeQueryGroup = (id: number) => {
      if (personnelQueryGroups.length > 1) {
        setPersonnelQueryGroups(personnelQueryGroups.filter(g => g.id !== id));
      }
    };

    // 更新查询条件组
    const updateQueryGroup = (id: number, field: string, value: string) => {
      setPersonnelQueryGroups(personnelQueryGroups.map(g => 
        g.id === id ? { ...g, [field]: value } : g
      ));
    };

    return (
      <div className="space-y-4">
        {/* 查询条件 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">证书查询条件</h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={addQueryGroup}
              className="h-7 w-7 p-0"
              title="添加查询条件组"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {personnelQueryGroups.map((group, index) => (
              <div key={group.id} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <Input
                    placeholder="证书名称"
                    value={group.certificateName}
                    onChange={(e) =>
                      updateQueryGroup(group.id, "certificateName", e.target.value)
                    }
                  />
                  <Input
                    placeholder="所属人员"
                    value={group.ownerName}
                    onChange={(e) =>
                      updateQueryGroup(group.id, "ownerName", e.target.value)
                    }
                  />
                  <Select
                    value={group.company}
                    onValueChange={(value) =>
                      updateQueryGroup(group.id, "company", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="所属公司" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="中天火箭技术股份有限公司">中天火箭技术股份有限公司</SelectItem>
                      <SelectItem value="北京易通信息技术有限公司">北京易通信息技术有限公司</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {personnelQueryGroups.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeQueryGroup(group.id)}
                    className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="删除此条件组"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <Button className="text-white" style={{ backgroundColor: PRIMARY_COLOR }}>
              <Search className="w-4 h-4 mr-2" />
              查询
            </Button>
            <Button className="text-white" style={{ backgroundColor: PRIMARY_COLOR }}>
              同时具备查询
            </Button>
            <Button variant="outline">重置</Button>
          </div>
        </div>

        {/* 查询结果列表 */}
        <div className="border border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">查询结果列表</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left">
                    <Checkbox />
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">证书名称</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">证书过期日期</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">所属公司</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">所属员工姓名</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">员工电话</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">员工工号</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">员工部门</th>
                </tr>
              </thead>
              <tbody>
                {personnelCertificates.map((cert) => (
                  <tr key={cert.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <Checkbox
                        checked={selectedCertificates.includes(cert.id)}
                        onCheckedChange={() => toggleCertificateSelection(cert.id)}
                      />
                    </td>
                    <td className="px-3 py-2" style={{ color: PRIMARY_COLOR }}>{cert.certificateName}</td>
                    <td className="px-3 py-2 text-gray-900">{cert.expiryDate}</td>
                    <td className="px-3 py-2 text-gray-900">{cert.ownerCompany}</td>
                    <td className="px-3 py-2 text-gray-900">{cert.ownerName}</td>
                    <td className="px-3 py-2 text-gray-600">{cert.phone}</td>
                    <td className="px-3 py-2 text-gray-900">{cert.ownerCode}</td>
                    <td className="px-3 py-2 text-gray-900">{cert.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 待申请清单 */}
        <div className="border rounded-lg" style={{ borderColor: PRIMARY_BORDER, backgroundColor: PRIMARY_BG }}>
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium" style={{ color: PRIMARY_COLOR }}>
                待申请清单 ({selectedItems.length})
              </h4>
              <Button
                size="sm"
                onClick={() => setEmployeeCodeDialogOpen(true)}
                style={{ backgroundColor: PRIMARY_COLOR }}
                className="text-xs text-white h-7"
              >
                <Plus className="w-3 h-3 mr-1" />
                添加
              </Button>
            </div>
            {selectedItems.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {attachmentOptions.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => selectAllAttachment(option)}
                    style={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                  >
                    全选{option}
                  </Button>
                ))}
              </div>
            )}
          </div>
          {selectedItems.length > 0 && (
            <div className="p-4 space-y-3">
              {selectedItems.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded border border-gray-200"
                >
                  <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {cert.isVirtual ? `工号: ${cert.employeeCode}` : `${cert.certificateName} - ${cert.ownerName}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {cert.isVirtual ? "待查询" : `${cert.ownerCompany} | ${cert.department} | ${cert.level}`}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (cert.isVirtual) {
                          setVirtualPersonnel(prev => prev.filter(v => v.id !== cert.id));
                          setSelectedAttachments(prev => {
                            const newState = { ...prev };
                            delete newState[cert.id];
                            return newState;
                          });
                        }
                        toggleCertificateSelection(cert.id);
                      }}
                    >
                      移除
                    </Button>
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-gray-600 mb-2">选择附件：</div>
                    <div className="flex flex-wrap gap-2">
                      {attachmentOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-xs"
                        >
                          <Checkbox
                            checked={selectedAttachments[cert.id]?.includes(option) || false}
                            onCheckedChange={() => toggleAttachment(cert.id, option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setConfirmDialogOpen(true)}
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  className="text-xs text-white"
                >
                  申请借阅
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 已申请清单 */}
        {renderAppliedListSection("人员")}
      </div>
    );
  };

  const renderQualificationTab = () => {
    const selectedItems = companyQualifications.filter((qual) =>
      selectedCertificates.includes(qual.id)
    );

    return (
      <div className="space-y-4">
        {/* 查询条件 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">资质查询条件</h4>
          <div className="grid grid-cols-5 gap-3">
            <Input
              placeholder="资质名称"
              value={qualificationQuery.qualificationName}
              onChange={(e) =>
                setQualificationQuery({ ...qualificationQuery, qualificationName: e.target.value })
              }
            />
            <Select
              value={qualificationQuery.categoryPath}
              onValueChange={(value) =>
                setQualificationQuery({ ...qualificationQuery, categoryPath: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="资质分类（一级-二级-三级）" />
              </SelectTrigger>
              <SelectContent>
                {categoryPathOptions.map((path) => (
                  <SelectItem key={path} value={path}>{path}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={qualificationQuery.patentType}
              onValueChange={(value) =>
                setQualificationQuery({ ...qualificationQuery, patentType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="专利类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-">无</SelectItem>
                <SelectItem value="发明专利">发明专利</SelectItem>
                <SelectItem value="实用新型专利">实用新型专利</SelectItem>
                <SelectItem value="外观设计专利">外观设计专利</SelectItem>
                <SelectItem value="软件著作权">软件著作权</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={qualificationQuery.companySubject}
              onValueChange={(value) =>
                setQualificationQuery({ ...qualificationQuery, companySubject: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="所属公司" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="中天火箭技术股份有限公司">中天火箭技术股份有限公司</SelectItem>
                <SelectItem value="北京易通信息技术有限公司">北京易通信息技术有限公司</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={qualificationQuery.qualificationStatus}
              onValueChange={(value) =>
                setQualificationQuery({ ...qualificationQuery, qualificationStatus: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="资质状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="有效">有效</SelectItem>
                <SelectItem value="已过期">已过期</SelectItem>
                <SelectItem value="即将过期">即将过期</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex gap-2">
            <Button className="text-white" style={{ backgroundColor: PRIMARY_COLOR }}>
              <Search className="w-4 h-4 mr-2" />
              查询
            </Button>
            <Button variant="outline">重置</Button>
          </div>
        </div>

        {/* 资质清单 */}
        <div className="border border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">资质清单</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left">
                    <Checkbox />
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">资质名称</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">资质编号</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">资质分类</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">公司名称</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">有效期</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">允许借阅原件</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">允许使用</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">保管员</th>
                </tr>
              </thead>
              <tbody>
                {companyQualifications.map((qual) => (
                  <tr key={qual.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <Checkbox
                        checked={selectedCertificates.includes(qual.id)}
                        onCheckedChange={() => toggleCertificateSelection(qual.id)}
                      />
                    </td>
                    <td className="px-3 py-2" style={{ color: PRIMARY_COLOR }}>{qual.qualificationName}</td>
                    <td className="px-3 py-2 text-gray-900">{qual.qualificationNumber}</td>
                    <td className="px-3 py-2 text-gray-900">
                      {qual.category1} - {qual.category2} - {qual.category3}
                    </td>
                    <td className="px-3 py-2 text-gray-900">{qual.companySubject}</td>
                    <td className="px-3 py-2 text-gray-900">
                      {qual.validFrom} ~ {qual.validUntil}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {qual.allowOriginalLoan ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {qual.allowUse ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      {qual.custodian} - {qual.custodianCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 待申请清单 */}
        <div className="border rounded-lg" style={{ borderColor: PRIMARY_BORDER, backgroundColor: PRIMARY_BG }}>
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h4 className="text-sm font-medium" style={{ color: PRIMARY_COLOR }}>
              待申请清单 ({selectedItems.length})
            </h4>
          </div>
          {selectedItems.length > 0 && (
            <div className="p-4 space-y-3">
              {selectedItems.map((qual) => (
                <div
                  key={qual.id}
                  className="bg-white rounded border border-gray-200"
                >
                  <div className="flex items-start justify-between p-3">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm font-medium text-gray-900">
                            {qual.qualificationName}
                          </div>
                          <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                            {qual.category1} - {qual.category2} - {qual.category3}
                          </span>
                          {qual.patentType !== "-" && (
                            <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: PRIMARY_BG, color: PRIMARY_COLOR }}>
                              {qual.patentType}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {qual.companySubject} | {qual.status} | 有效期: {qual.validFrom} ~ {qual.validUntil}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleCertificateSelection(qual.id)}
                    >
                      移除
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setConfirmDialogOpen(true)}
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  className="text-xs text-white"
                >
                  申请借阅
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 已申请清单 */}
        {renderAppliedListSection("企业资质")}
      </div>
    );
  };

  const renderPerformanceTab = () => {
    const selectedItems = performanceCases.filter((perf) =>
      selectedCertificates.includes(perf.id)
    );

    // 处理签约年度多选
    const toggleYear = (year: string) => {
      setPerformanceQuery(prev => ({
        ...prev,
        signingYears: prev.signingYears.includes(year)
          ? prev.signingYears.filter(y => y !== year)
          : [...prev.signingYears, year]
      }));
    };

    const availableYears = ["2023", "2024", "2025", "2026"];

    return (
      <div className="space-y-4">
        {/* 查询条件 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">业绩查询条件</h4>
          <div className="grid grid-cols-4 gap-3 mb-3">
            <Input
              placeholder="合同名称"
              value={performanceQuery.contractName}
              onChange={(e) =>
                setPerformanceQuery({ ...performanceQuery, contractName: e.target.value })
              }
            />
            <Select
              value={performanceQuery.productCategory}
              onValueChange={(value) =>
                setPerformanceQuery({ ...performanceQuery, productCategory: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="产品分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="智慧城市">智慧城市</SelectItem>
                <SelectItem value="教育信息化">教育信息化</SelectItem>
                <SelectItem value="5G网络">5G网络</SelectItem>
                <SelectItem value="金融科技">金融科技</SelectItem>
                <SelectItem value="医疗信息化">医疗信息化</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={performanceQuery.amountRange}
              onValueChange={(value) =>
                setPerformanceQuery({ ...performanceQuery, amountRange: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="金额范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10万">1-10万</SelectItem>
                <SelectItem value="10-50万">10-50万</SelectItem>
                <SelectItem value="50-100万">50-100万</SelectItem>
                <SelectItem value="100-200万">100-200万</SelectItem>
                <SelectItem value="200-500万">200-500万</SelectItem>
                <SelectItem value="500-1000万">500-1000万</SelectItem>
                <SelectItem value="1000-2000万">1000-2000万</SelectItem>
                <SelectItem value="2000-5000万">2000-5000万</SelectItem>
                <SelectItem value="5000万以上">5000万以上</SelectItem>
                <SelectItem value="其他范围">其他范围</SelectItem>
              </SelectContent>
            </Select>
            {performanceQuery.amountRange === "其他范围" && (
              <Input
                placeholder="自定义金额范围"
                value={performanceQuery.customAmountRange}
                onChange={(e) =>
                  setPerformanceQuery({ ...performanceQuery, customAmountRange: e.target.value })
                }
              />
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Select
              value={performanceQuery.signingParty}
              onValueChange={(value) =>
                setPerformanceQuery({ ...performanceQuery, signingParty: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="亚信签约方" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="亚信科技">亚信科技</SelectItem>
                <SelectItem value="亚信中国">亚信中国</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={performanceQuery.customerIndustry}
              onValueChange={(value) =>
                setPerformanceQuery({ ...performanceQuery, customerIndustry: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="客户行业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="政府机关">政府机关</SelectItem>
                <SelectItem value="教育">教育</SelectItem>
                <SelectItem value="运营商">运营商</SelectItem>
                <SelectItem value="金融">金融</SelectItem>
                <SelectItem value="医疗卫生">医疗卫生</SelectItem>
                <SelectItem value="制造业">制造业</SelectItem>
                <SelectItem value="能源">能源</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={
                    performanceQuery.signingYears.length === 0 
                      ? "签约年度（多选）" 
                      : `已选${performanceQuery.signingYears.length}项`
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <div
                      key={year}
                      className="flex items-center px-2 py-1.5 hover:bg-gray-100 cursor-pointer"
                      onClick={() => toggleYear(year)}
                    >
                      <Checkbox
                        checked={performanceQuery.signingYears.includes(year)}
                        onCheckedChange={() => toggleYear(year)}
                        className="mr-2"
                      />
                      <span className="text-sm">{year}</span>
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button className="text-white" style={{ backgroundColor: PRIMARY_COLOR }}>
              <Search className="w-4 h-4 mr-2" />
              查询
            </Button>
            <Button variant="outline">重置</Button>
          </div>
        </div>

        {/* 查询结果列表 */}
        <div className="border border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">合同案例列表</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left">
                    <Checkbox />
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">合同名称</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">合同ID</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">客户名称</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">签约公司</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">客户行业</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">签约年度</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">合同金额区间</th>
                </tr>
              </thead>
              <tbody>
                {performanceCases.map((perf) => (
                  <tr key={perf.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <Checkbox
                        checked={selectedCertificates.includes(perf.id)}
                        onCheckedChange={() => toggleCertificateSelection(perf.id)}
                      />
                    </td>
                    <td className="px-3 py-2" style={{ color: PRIMARY_COLOR }}>{perf.contractName}</td>
                    <td className="px-3 py-2 text-gray-900">{perf.contractId}</td>
                    <td className="px-3 py-2 text-gray-900">{perf.customerName}</td>
                    <td className="px-3 py-2 text-gray-900">{perf.signingCompany}</td>
                    <td className="px-3 py-2 text-gray-900">{perf.customerIndustry}</td>
                    <td className="px-3 py-2 text-gray-900">{perf.signingYear}</td>
                    <td className="px-3 py-2 text-gray-900">{perf.amountRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 待申请清单 */}
        <div className="border rounded-lg" style={{ borderColor: PRIMARY_BORDER, backgroundColor: PRIMARY_BG }}>
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h4 className="text-sm font-medium" style={{ color: PRIMARY_COLOR }}>
              待申请清单 ({selectedItems.length})
            </h4>
          </div>
          {selectedItems.length > 0 && (
            <div className="p-4 space-y-3">
              {selectedItems.map((perf) => (
                <div
                  key={perf.id}
                  className="bg-white rounded border border-gray-200"
                >
                  <div className="flex items-start justify-between p-3">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {perf.contractName} - {perf.amountRange}
                        </div>
                        <div className="text-xs text-gray-500">
                          {perf.customerName} | {perf.signingCompany} | {perf.signingYear}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleCertificateSelection(perf.id)}
                    >
                      移除
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setConfirmDialogOpen(true)}
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  className="text-xs text-white"
                >
                  申请借阅
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 已申请清单 */}
        {renderAppliedListSection("合同案例")}
      </div>
    );
  };

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="border rounded-lg p-4" style={{ backgroundColor: PRIMARY_BG, borderColor: PRIMARY_BORDER }}>
        <p className="text-sm" style={{ color: PRIMARY_COLOR }}>
          根据解析的标书要求，系统已自动查询相关证书。请在各分类中查询并勾选所需证书。
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="personnel">人员</TabsTrigger>
          <TabsTrigger value="qualification">企业资质</TabsTrigger>
          <TabsTrigger value="performance">合同案例</TabsTrigger>
        </TabsList>

        <TabsContent value="personnel" className="mt-4">
          {renderPersonnelTab()}
        </TabsContent>

        <TabsContent value="qualification" className="mt-4">
          {renderQualificationTab()}
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          {renderPerformanceTab()}
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderStep3 = () => {
    return (
      <Step3DownloadView
        appliedCertificates={appliedCertificates}
        selectedForDownload={selectedForDownload}
        toggleDownloadSelection={toggleDownloadSelection}
        PRIMARY_COLOR={PRIMARY_COLOR}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">证书调用</DialogTitle>
          <DialogDescription className="sr-only">
            证书调用流程，包括解析标书要求、证书申请和证书下载
          </DialogDescription>
          {bidData && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>标书项目：{bidData.name}</span>
              <span>|</span>
              <span>投标日期：{bidData.bidDate}</span>
              <span>|</span>
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto"
                style={{ color: PRIMARY_COLOR }}
                onClick={() => setRecordDialogOpen(true)}
              >
                <History className="w-4 h-4 mr-1" />
                申请记录
              </Button>
            </div>
          )}

          {/* 投标项目绑定区域 */}
          <div className="mt-3 p-3 border rounded-lg" style={{ backgroundColor: "#F9FAFB", borderColor: PRIMARY_BORDER }}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">投标项目：</span>
              {boundProject ? (
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium" style={{ color: PRIMARY_COLOR }}>
                    {boundProject.projectName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: PRIMARY_BG, color: PRIMARY_COLOR }}>
                    已关联
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={removeProject}
                    className="text-xs text-gray-500 hover:text-red-500"
                  >
                    变更项目
                  </Button>
                </div>
              ) : (
                <div className="flex-1 relative">
                  <Input
                    placeholder="点击选择或搜索投标项目..."
                    value={projectSearchQuery}
                    onChange={(e) => {
                      setProjectSearchQuery(e.target.value);
                      setShowProjectDropdown(true);
                    }}
                    onFocus={() => setShowProjectDropdown(true)}
                    className="w-full text-sm h-8"
                  />
                  {showProjectDropdown && projectSearchQuery && filteredProjects.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredProjects.map((project) => (
                        <div
                          key={project.id}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => selectProject(project)}
                        >
                          <div className="text-sm font-medium text-gray-900">
                            {project.projectName}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>项目ID: {project.projectId}</span>
                            <span>标包ID: {project.bidPackageId}</span>
                            <span>开标日期: {project.bidOpenDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Steps indicator */}
        <div className="flex items-center justify-center px-4 py-3 border-b">
          <div className="flex items-center max-w-4xl">
            {[
              { num: 1, title: "解析标书" },
              { num: 2, title: "证书申请" },
              { num: 3, title: "证书下载" },
            ].map((step, index) => (
              <div key={step.num} className="flex items-center">
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => setCurrentStep(step.num)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep > step.num
                        ? "text-white"
                        : currentStep === step.num
                        ? "text-white"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                    style={
                      currentStep >= step.num
                        ? { backgroundColor: PRIMARY_COLOR }
                        : {}
                    }
                  >
                    {currentStep > step.num ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.num
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStep === step.num
                        ? ""
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    style={currentStep === step.num ? { color: PRIMARY_COLOR } : {}}
                  >
                    {step.title}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className="h-0.5 mx-4 w-20"
                    style={{
                      backgroundColor:
                        currentStep > step.num ? PRIMARY_COLOR : "#E5E7EB",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {currentStep === 1 && renderParseRequirementsStep()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                onOpenChange(false);
              }
            }}
          >
            {currentStep === 1 ? "取消" : "上一步"}
          </Button>
          <Button
            className="text-white"
            style={{ backgroundColor: PRIMARY_COLOR }}
            onClick={() => {
              // 如果是证书申请步骤，需要检查是否有绑定项目
              if (currentStep === 2 && Object.keys(selectedAttachments).length > 0 && !boundProject) {
                // 提示用户先绑定项目
                alert("请先在顶部绑定投标项目");
                return;
              }
              if (currentStep < 3) {
                setCurrentStep(currentStep + 1);
              } else {
                onOpenChange(false);
              }
            }}
          >
            {currentStep === 3 ? "完成" : "下一步"}
          </Button>
        </div>
      </DialogContent>

      <ApplicationRecordDialog
        open={recordDialogOpen}
        onOpenChange={setRecordDialogOpen}
        bidName={bidData?.name || ""}
      />

      {/* 手动绑定弹窗 */}
      <Dialog open={bindDialogOpen} onOpenChange={setBindDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>手动绑定证书数据</DialogTitle>
            <DialogDescription className="sr-only">
              为未匹配的要求手动绑定证书数据
            </DialogDescription>
          </DialogHeader>

          {bindingItem && (
            <div className="space-y-4">
              {/* 显示要绑定的项目信息 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-20">要求类型：</span>
                    <span className="font-medium text-gray-900">{(bindFormData as any).parentType || bindingItem.type}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-20">具体要求：</span>
                    <span className="text-gray-900">{bindingItem.name || bindingItem.requirement}</span>
                  </div>
                  {bindingItem.originalText && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-20">原文内容：</span>
                      <span className="text-gray-600 italic">{bindingItem.originalText}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 人员绑定表单 */}
              {bindingCategory === "personnel" && (
                <div className="space-y-3">
                  {/* 枚举类型：学历、身份证、劳动合同、社保证明、履历表 */}
                  {["学历", "身份证", "劳动合同", "社保证明", "履历表"].includes(bindingItem.type) && (
                    <>
                      <h4 className="text-sm font-medium text-gray-700">选择{bindingItem.type}</h4>
                      <Select
                        value={bindFormData.certificateType}
                        onValueChange={(value) =>
                          setBindFormData({ ...bindFormData, certificateType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`请选择${bindingItem.type}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {bindingItem.type === "学历" && (
                            <>
                              <SelectItem value="学历">学历</SelectItem>
                            </>
                          )}
                          {bindingItem.type === "身份证" && (
                            <SelectItem value="身份证">身份证</SelectItem>
                          )}
                          {bindingItem.type === "劳动合同" && (
                            <SelectItem value="劳动合同">劳动合同</SelectItem>
                          )}
                          {bindingItem.type === "社保证明" && (
                            <SelectItem value="社保证明">社保证明</SelectItem>
                          )}
                          {bindingItem.type === "履历表" && (
                            <SelectItem value="履历表">履历表</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                  
                  {/* 资质证书类型 - 支持多选 */}
                  {((bindFormData as any).isSubItem || bindingItem.type === "资质证书") && (
                    <>
                      <h4 className="text-sm font-medium text-gray-700">绑定证书类型（可多选）</h4>
                      <div className="border border-gray-200 rounded-lg p-3 space-y-2 max-h-60 overflow-y-auto">
                        {["系统架构师", "PMP", "信息系统项目管理师", "高级工程师", "软件设计师", "网络工程师", "数据库系统工程师", "信息安全工程师", "高级职称", "中级职称"].map((cert) => (
                          <div key={cert} className="flex items-center gap-2">
                            <Checkbox
                              id={`cert-${cert}`}
                              checked={(bindFormData.certificateType || "").split(",").includes(cert)}
                              onCheckedChange={(checked) => {
                                const currentTypes = bindFormData.certificateType ? bindFormData.certificateType.split(",").filter(t => t) : [];
                                const newTypes = checked 
                                  ? [...currentTypes, cert]
                                  : currentTypes.filter(t => t !== cert);
                                setBindFormData({ ...bindFormData, certificateType: newTypes.join(",") });
                              }}
                            />
                            <label
                              htmlFor={`cert-${cert}`}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {cert}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 企业资质绑定表单 */}
              {bindingCategory === "companyQualification" && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">绑定资质名称</h4>
                  <Select
                    value={bindFormData.qualificationName}
                    onValueChange={(value) =>
                      setBindFormData({ ...bindFormData, qualificationName: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择资质名称" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="营业执照">营业执照</SelectItem>
                      <SelectItem value="高新技术企业证书">高新技术企业证书</SelectItem>
                      <SelectItem value="软件企业认定证书">软件企业认定证书</SelectItem>
                      <SelectItem value="ISO9001质量管理体系认证">ISO9001质量管理体系认证</SelectItem>
                      <SelectItem value="ISO27001信息安全认证">ISO27001信息安全认证</SelectItem>
                      <SelectItem value="CMMI认证">CMMI认证</SelectItem>
                      <SelectItem value="发明专利">发明专利</SelectItem>
                      <SelectItem value="实用新型专利">实用新型专利</SelectItem>
                      <SelectItem value="软件著作权">软件著作权</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* 合同案例绑定表单 */}
              {bindingCategory === "performance" && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">绑定合同案例信息</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">产品名称</label>
                      <Input
                        placeholder="请输入产品名称"
                        value={bindFormData.productName}
                        onChange={(e) =>
                          setBindFormData({ ...bindFormData, productName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">合同金额范围</label>
                      <Select
                        value={bindFormData.contractAmountRange}
                        onValueChange={(value) =>
                          setBindFormData({ ...bindFormData, contractAmountRange: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择金额范围" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10万">1-10万</SelectItem>
                          <SelectItem value="10-50万">10-50万</SelectItem>
                          <SelectItem value="50-100万">50-100万</SelectItem>
                          <SelectItem value="100-200万">100-200万</SelectItem>
                          <SelectItem value="200-500万">200-500万</SelectItem>
                          <SelectItem value="500-1000万">500-1000万</SelectItem>
                          <SelectItem value="1000-2000万">1000-2000万</SelectItem>
                          <SelectItem value="2000-5000万">2000-5000万</SelectItem>
                          <SelectItem value="5000万以上">5000万以上</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">合同签订时间</label>
                      <Input
                        type="date"
                        value={bindFormData.contractTime}
                        onChange={(e) =>
                          setBindFormData({ ...bindFormData, contractTime: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">合同类型</label>
                      <Select
                        value={bindFormData.contractType}
                        onValueChange={(value) =>
                          setBindFormData({ ...bindFormData, contractType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择合同类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="正式合同">正式合同</SelectItem>
                          <SelectItem value="框架订单">框架订单</SelectItem>
                          <SelectItem value="采购协议">采购协议</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* 按钮 */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setBindDialogOpen(false)}>
                  取消
                </Button>
                <Button
                  className="text-white"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  onClick={submitBinding}
                >
                  确认绑定
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 申请借阅确认弹窗 */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>确认发起借阅申请</DialogTitle>
            <DialogDescription className="sr-only">
              确认是否发起借阅申请
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              确定要发起借阅申请吗？系统将把待申请清单中的项目提交给管理员进行审核。
            </p>
          </div>
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              取消
            </Button>
            <Button
              className="text-white"
              style={{ backgroundColor: PRIMARY_COLOR }}
              onClick={confirmBorrowApplication}
            >
              确认申请
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 工号输入弹窗 */}
      <Dialog open={employeeCodeDialogOpen} onOpenChange={setEmployeeCodeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>通过工号添加人员</DialogTitle>
            <DialogDescription className="sr-only">
              输入人员工号添加证书申请
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              输入人员工号（每行一个），系统将自动申请学历证明、身份证、劳动合同、社保证明、履历表
            </p>
            <textarea
              className="w-full h-32 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2"
              style={{ focusRing: PRIMARY_COLOR }}
              placeholder="请输入工号，例如：&#10;EMP001&#10;EMP002&#10;EMP003"
              value={employeeCodeInput}
              onChange={(e) => setEmployeeCodeInput(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => {
              setEmployeeCodeInput("");
              setEmployeeCodeDialogOpen(false);
            }}>
              取消
            </Button>
            <Button
              className="text-white"
              style={{ backgroundColor: PRIMARY_COLOR }}
              onClick={handleAddByEmployeeCode}
              disabled={!employeeCodeInput.trim()}
            >
              确认添加
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}