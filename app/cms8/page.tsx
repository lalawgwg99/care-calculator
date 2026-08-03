import CMSLevelPage, { generateMetadata as createMetadata } from "@/components/CMSLevelPage";

const params = { level: "8" };

export const generateMetadata = () => createMetadata({ params });
export default function Page() { return <CMSLevelPage params={params} />; }
