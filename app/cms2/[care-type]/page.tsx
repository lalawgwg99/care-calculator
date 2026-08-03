import CMSCareTypePage, { generateMetadata as createMetadata } from "@/components/CMSCareTypePage";
import { CARE_TYPES } from "@/constants/pseoData";

const level = "2";
type Props = { params: { "care-type": string } };

export const generateStaticParams = () => CARE_TYPES.map((type) => ({ "care-type": type }));
export const generateMetadata = ({ params }: Props) => createMetadata({ params: { level, "care-type": params["care-type"] } });
export default function Page({ params }: Props) { return <CMSCareTypePage params={{ level, "care-type": params["care-type"] }} />; }
