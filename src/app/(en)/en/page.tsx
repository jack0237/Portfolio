import { HomePage } from "@/site/home/HomePage";
import { homeMetadata } from "@/site/metadata";

export const revalidate = 300;
export const metadata = homeMetadata("en");

export default function Page() {
  return <HomePage locale="en" />;
}
