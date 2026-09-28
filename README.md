# Farmer’s table 冬の日

新潟県上越市の料理・喫茶・野菜販売のWebサイトです。

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

本文・素材参照・ページ内リンク・電話案内・アニメーションの配慮を検証します。

## 編集箇所

- 本文: `dist/index.html`
- スタイル: `dist/assets/design.css`
- メニューと表示アニメーション: `dist/assets/site.js`
- 写真: `dist/assets/`

ご予約は電話受付。Googleカレンダー連携は保留中です。ヒーローの番号・操作バーは表示せず、表示時の短いアニメーションのみを使用しています。
