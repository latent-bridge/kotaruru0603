import { AuthPanel } from "@/components/AuthPanel";

export const metadata = {
  title: "ログイン — ruruのポンコツ部屋",
};

export default function LoginPage() {
  return <AuthPanel mode="login" />;
}
