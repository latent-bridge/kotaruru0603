import { PALETTE, FONTS } from "@/lib/mochi";
import { EyebrowChip } from "@/components/mochi-ui";

export const metadata = {
  title: "プライバシーポリシー — ruruのポンコツ部屋",
  description:
    "ruruのポンコツ部屋(kotaruru0603.latent-bridge.com)における個人情報の取り扱いについて。",
};

const BUSINESS_NAME = "Latent Bridge";
const OPERATOR_NAME = "安里 和";
const CONTACT_EMAIL = "latentbridge3@gmail.com";
const SERVICE_NAME = "ruruのポンコツ部屋 (kotaruru0603.latent-bridge.com)";
const PLATFORM_NAME = "latent-bridge プラットフォーム";
const EFFECTIVE_DATE = "2026年4月27日";

export default function PrivacyPage() {
  return (
    <main
      className="max-w-[820px] mx-auto px-5 md:px-8"
      style={{ paddingTop: 24, paddingBottom: 80 }}
    >
      <header style={{ marginBottom: 28 }}>
        <EyebrowChip>☁ PRIVACY POLICY ☁</EyebrowChip>
        <h1
          style={{
            fontFamily: FONTS.body,
            fontWeight: 900,
            fontSize: "clamp(26px, 4vw, 40px)",
            lineHeight: 1.2,
            letterSpacing: -0.5,
            color: PALETTE.ink,
            margin: "10px 0 10px",
          }}
        >
          <span
            style={{
              background: `linear-gradient(180deg, transparent 60%, ${PALETTE.cream}cc 60%)`,
            }}
          >
            プライバシーポリシー
          </span>
        </h1>
        <p
          style={{
            fontSize: 13,
            color: PALETTE.inkDim,
            lineHeight: 1.8,
          }}
        >
          {SERVICE_NAME}(以下「本サービス」)における個人情報の取り扱いについて定めます。
        </p>
        <p
          style={{
            fontSize: 12,
            color: PALETTE.inkDim,
            fontFamily: FONTS.mono,
            marginTop: 6,
          }}
        >
          施行日: {EFFECTIVE_DATE}
        </p>
      </header>

      <Section title="1. 運営者">
        <p>
          本サービスは <strong>{BUSINESS_NAME}</strong>(屋号、運営者: {OPERATOR_NAME})が運営しています。
        </p>
        <p>
          本サービスは、{PLATFORM_NAME}の一部として配信者ごとのファンサイトを提供しており、
          認証情報およびユーザーアカウントはプラットフォーム全体で共有されます。
        </p>
      </Section>

      <Section title="2. 取得する情報">
        <p>本サービスでは、以下の情報を取得します。</p>
        <h3 style={subHeading}>2.1 ログイン時に取得する情報</h3>
        <p>
          ユーザーが Discord、Google(YouTube)、またはメールアドレスでログインした際、
          本サービスが受け取り保存する情報は次のとおりです。
        </p>
        <ul style={listStyle}>
          <li>
            <strong>Discord ログイン時</strong>: Discord ユーザー ID のみを保存します。
            Discord API のレスポンスに含まれる表示名・アバター画像 URL は本サービスでは利用せず、保存もしません。
          </li>
          <li>
            <strong>Google(YouTube)ログイン時</strong>: Google アカウント識別子 (sub) のみを保存します。
            OAuth スコープから <code>profile</code> および <code>email</code> を除外しているため、
            表示名・プロフィール画像・メールアドレスへのアクセス権限を要求しません。
          </li>
          <li>
            <strong>メールアドレスでログイン時</strong>: 入力されたメールアドレスのみを保存します。
            ログインの度に当該アドレス宛へワンタイムのログインリンクを送信し、リンクのクリックを本人確認の手段として使用します(パスワードは保存しません)。
            メール送信は外部メール配信サービスを利用するため、メールアドレスは送信処理の範囲で当該事業者へ送られます。
          </li>
        </ul>
        <p>
          サイト上での表示名は、ログイン後にユーザー本人が設定するものを使用します(初回ログイン時に設定画面が表示されます)。
        </p>
        <h3 style={subHeading}>2.2 サービス利用に伴い生成される情報</h3>
        <ul style={listStyle}>
          <li>
            チャット送信機能で投稿したメッセージの内容(Discord チャンネルへ転送されます)
          </li>
          <li>
            セッション識別子(Cookie にて保持、30日間有効)
          </li>
          <li>
            アクセス時刻・IP アドレス(不正利用防止およびレート制限の目的で一時的に保持)
          </li>
          <li>
            将来の機能追加時に取得予定:訪問日時、ログインスタンプ残高等のサイト内アクティビティ記録
          </li>
        </ul>
      </Section>

      <Section title="3. 利用目的">
        <p>取得した情報は、次の目的のために利用します。</p>
        <ul style={listStyle}>
          <li>ユーザーアカウントの識別および認証</li>
          <li>
            ユーザーのリクエストに基づく Discord チャンネルへの代理投稿(ユーザー本人がサイト上で設定した表示名のみを使用し、アバター画像は付与しません)
          </li>
          <li>不正利用・スパム行為の検知およびレート制限の適用</li>
          <li>サイト機能(チャット、スタンプ等)の提供</li>
          <li>サービス運営上必要な連絡</li>
        </ul>
      </Section>

      <Section title="4. 第三者への提供">
        <p>
          取得した情報を、以下の場合を除き第三者に提供することはありません。
        </p>
        <ul style={listStyle}>
          <li>
            <strong>Discord Webhook 経由の投稿</strong>:ユーザーがサイト上でチャット送信を行った場合、
            ユーザー本人が設定した表示名・投稿内容を該当する Discord サーバ/チャンネルへ転送します。
          </li>
          <li>法令に基づく開示要求があった場合</li>
          <li>ユーザーの生命・身体または財産の保護のために必要であり、本人の同意を得ることが困難な場合</li>
        </ul>
      </Section>

      <Section title="5. 外部サービスの利用">
        <p>
          本サービスは、認証に以下の外部サービスを利用します。各サービスのプライバシーポリシーも併せてご確認ください。
        </p>
        <ul style={listStyle}>
          <li>
            <strong>Discord OAuth 2.0</strong> — <ExtLink href="https://discord.com/privacy">Discord Privacy Policy</ExtLink>
          </li>
          <li>
            <strong>Google Identity (OAuth 2.0 / OpenID Connect)</strong> — <ExtLink href="https://policies.google.com/privacy">Google プライバシー ポリシー</ExtLink>
          </li>
        </ul>
        <p>
          また、チャット機能のバックエンドとして Amazon Web Services (AWS Lightsail、東京リージョン)を利用しています。
        </p>
      </Section>

      <Section title="6. Cookie の使用">
        <p>本サービスは以下の目的で Cookie を使用します。</p>
        <ul style={listStyle}>
          <li>ログイン状態の維持(セッション Cookie、HttpOnly / Secure / SameSite=Lax 属性で発行)</li>
          <li>OAuth 認証フロー中の state 改竄検知(5分間のみ有効)</li>
        </ul>
        <p>
          本サービスは広告・解析目的の第三者 Cookie を使用しません。
        </p>
      </Section>

      <Section title="7. 保管期間">
        <ul style={listStyle}>
          <li>
            <strong>アカウント情報</strong>(外部認証の識別子・本人が設定した表示名・ハンドルタグ):ユーザーが削除を希望するまで保管します。
          </li>
          <li>
            <strong>セッション情報</strong>:発行から 30 日間で自動失効します。
          </li>
          <li>
            <strong>チャット投稿内容</strong>:サーバ側で直近 20 件のみをメモリに保持し、再起動時に破棄されます。Discord チャンネル側の履歴は Discord のポリシーに従います。
          </li>
          <li>
            <strong>アクセスログ</strong>:サーバ運用上必要な期間(最大 30 日)で自動ローテートされます。
          </li>
        </ul>
      </Section>

      <Section title="8. ユーザーの権利">
        <p>ユーザーは、自身の個人情報について以下の権利を有します。</p>
        <ul style={listStyle}>
          <li>自身のアカウントを削除する権利</li>
          <li>保有する個人情報の開示を請求する権利</li>
          <li>個人情報の訂正・利用停止を請求する権利</li>
        </ul>
        <p>
          アカウントの削除は、本サービスにログイン後、設定画面の「アカウントを けす」からご自身で実行いただけます。
          実行すると、表示名・スタンプカード履歴・外部認証連携情報がすべて消去され、復元できません。
        </p>
        <p>
          その他のご請求、およびアカウント削除をご自身で実行できない場合のご相談は、
          本ポリシー末尾の連絡先までメールにてお申し出ください。本人確認のうえ、合理的な期間内に対応いたします。
        </p>
      </Section>

      <Section title="9. セキュリティ">
        <ul style={listStyle}>
          <li>全通信は HTTPS (TLS 1.2 / 1.3) で暗号化されます。</li>
          <li>
            セッション Cookie は HttpOnly および Secure 属性付きで発行され、JavaScript から直接アクセスすることはできません。
          </li>
          <li>OAuth 認証フローは state パラメータによる CSRF 対策を実施しています。</li>
          <li>データベースへの接続はローカルループバックに限定しています。</li>
        </ul>
      </Section>

      <Section title="10. 未成年者の利用">
        <p>
          本サービスは、13 歳未満の方による利用を想定していません。
          13 歳以上 18 歳未満の方は、保護者の同意を得たうえでご利用ください。
        </p>
      </Section>

      <Section title="11. 本ポリシーの変更">
        <p>
          本ポリシーは、関連法令の変更、サービス内容の追加等に応じて改定する場合があります。
          重要な変更は本ページ上部の「施行日」を更新し、必要に応じてサイト上で告知します。
        </p>
      </Section>

      <Section title="12. お問い合わせ">
        <p>本ポリシーおよび個人情報の取り扱いに関するお問い合わせは下記までお願いします。</p>
        <ul style={{ ...listStyle, listStyle: "none", paddingLeft: 0 }}>
          <li>
            <strong>屋号</strong>: {BUSINESS_NAME}
          </li>
          <li>
            <strong>運営者</strong>: {OPERATOR_NAME}
          </li>
          <li>
            <strong>メール</strong>:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              style={{ color: PALETTE.accent, fontWeight: 700 }}
            >
              {CONTACT_EMAIL}
            </a>
          </li>
        </ul>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontFamily: FONTS.body,
          fontSize: 18,
          fontWeight: 900,
          color: PALETTE.ink,
          marginBottom: 12,
          borderBottom: `2px solid ${PALETTE.inkSoft}`,
          paddingBottom: 6,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.85,
          color: PALETTE.ink,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function ExtLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: PALETTE.accent,
        fontWeight: 700,
        textDecoration: "underline",
      }}
    >
      {children}
    </a>
  );
}

const subHeading: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: PALETTE.ink,
  marginTop: 12,
  marginBottom: 4,
};

const listStyle: React.CSSProperties = {
  paddingLeft: 20,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};
