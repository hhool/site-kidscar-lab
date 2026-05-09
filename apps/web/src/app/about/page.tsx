import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      title={{ zh: "关于", en: "About" }}
      description={{ zh: "数据来源、测试流程和评测团队透明度说明。", en: "Explain data sources, test workflow, and review team transparency." }}
    />
  );
}
