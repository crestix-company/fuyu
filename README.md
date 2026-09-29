# Farmer’s table 冬の日

新潟県上越市の料理・喫茶・野菜販売のWebサイトです。トップ、冬の日について、料理とメニュー、畑と野菜販売、店舗情報・ご予約の5ページ構成です。

## 公開

- Webサイト: https://crestix-company.github.io/fuyu/
- 公開元: `main`
- 配信フォルダ: `dist`
- `main`へのプッシュで、検証後にGitHub Pagesへ自動公開します。
- GitHubの Settings → Pages → Build and deployment は **GitHub Actions** を使用します。

リポジトリのREADMEではなく、`dist/index.html`がサイトとして配信されます。画像・CSS・JavaScriptは相対パスなので、`/fuyu/`配下でも表示できます。

## ローカル

Node.js 22以上。外部パッケージのインストールは不要です。

```sh
npm run dev
```

http://localhost:3007/ で表示します。別のサイトが同じポートを使っている場合は `PORT=3018 npm run dev` としてください。

GitHub Pagesと同じパス構成での確認:

```sh
PORT=3018 BASE_PATH=/fuyu/ npm run dev
```

## 検証

```sh
npm run build
npm test
```

共通テンプレートから5ページを生成し、本文・素材参照・ページ間とページ内のリンク・電話案内・アニメーションの配慮を検証します。

## 編集箇所

- 本文: `src/pages/*.html`
- 共通ヘッダー・フッター: `src/layout.html`
- ページ名・説明文・出力: `scripts/build.mjs`
- スタイル: `dist/assets/design.css` と `dist/assets/pages.css`
- メニューと表示アニメーション: `dist/assets/site.js`
- 写真: `dist/assets/`

ご予約は電話受付。Googleカレンダーは「店舗情報・ご予約」の `#calendar` に埋め込み、トップのメイン写真直下と全ページのフッターから案内しています。店舗情報ページでは営業時間とカレンダーをページ前半にまとめ、1000pxより広い画面は横並び、それ以下は縦並びにしています。カレンダー自体はPCでは月表示、760px以下では予定一覧を表示します。お客様がGoogleカレンダーの予定を更新すると、埋め込みにも反映されます。APIキーやサーバー処理は不要です。閲覧できない場合に備えて、カレンダーを直接開くリンクも用意しています。

カレンダーURLと表示オプションの編集箇所は `src/pages/visit.html` です。表示するカレンダーは「一般公開」かつ「予定の詳細の表示」を維持し、個人の予定・予約者情報は登録しないでください。独自の休業日や予約可否は生成していません。

ヒーローの番号・操作バーは表示せず、表示時の短いアニメーションのみを使用しています。

本文を編集したら `npm run build` を実行してください。生成先のHTMLを直接編集しないでください。以前のトップページ内リンク（`#food` など）は対応する新ページへ移動します。
