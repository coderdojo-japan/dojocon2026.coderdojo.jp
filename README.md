# :yin_yang: Teaser Site Template for CoderDojo Conferences like [DojoCon](https://dojocon.coderdojo.jp/) / [DecaDojo](https://decadojo.coderdojo.jp/)

[![Screenshot of Teaser Site](https://github.com/coderdojo-japan/teaser-template.coderdojo.jp/blob/main/images/readme-cover.gif?raw=true)](https://teaser-template.coderdojo.jp/)

<br>

<div id='howto'></div>

## [:beginner:](#howto) 本テンプレートの使い方

[承認された CoderDojo](https://coderdojo.jp/#dojos) であれば、以下の手順で本テンプレートをお使いいただけます。

### 1. [GitHub](https://github.co.jp/) のアカウントを作る
[![GitHub Singup](https://github.com/coderdojo-japan/teaser-template.coderdojo.jp/blob/main/images/readme-github.png?raw=true)](https://github.co.jp/)
[&raquo; https://github.co.jp/](https://github.co.jp/)

<br>


### 2. 本ページの画面右上にある `Use this template` -> `Create a new repository` を押す
![Use this template](https://github.com/coderdojo-japan/teaser-template.coderdojo.jp/blob/main/images/readme-template.png?raw=true)

<br>


### 3. 各項目に情報を入力し、本テンプレートから新しいリポジトリを作成する
![Create with template](https://github.com/coderdojo-japan/teaser-template.coderdojo.jp/blob/main/images/readme-create.png?raw=true)

<br>


### 4. [README の動かす方法](#setup)にしたがって、適宜Webサイトを修正・確認する
![Edit HTML](https://github.com/coderdojo-japan/teaser-template.coderdojo.jp/blob/main/images/readme-edit.png?raw=true)

<br>


### 5. 準備ができたら [GitHub Pages](https://www.google.com/search?q=GitHub+Pages) から公開する
- `Settings` -> `Pages` に行き、`Branch` 欄にある `None` を `main` に変更し、`Save` を押す
- `Custom domain` 欄が表示されたらドメイン名 (例: `dojocon2024.coderdojo.jp`) を入力し、`Save` を押す
- :warning: ドメインの適用には DNS 設定が必要です。ココまで設定できたら [@yasulab](https://github.com/yasulab) までご連絡ください! :email: :dash:
   ![GitHub Pages Settings](https://github.com/coderdojo-japan/teaser-template.coderdojo.jp/blob/main/images/readme-domain.png?raw=true)

<br>


### 6. DNS 設定が完了したら、ティザーサイトが公開できているはずです!
- 公開例 (1/2): [https://dojocon2024-teaser.coderdojo.jp/](https://dojocon2024-teaser.coderdojo.jp/)
- 公開例 (2/2): [https://teaser-template.coderdojo.jp/](https://teaser-template.coderdojo.jp/)  
  [![Teaser Site Screenshot](https://github.com/coderdojo-japan/teaser-template.coderdojo.jp/blob/main/images/readme-cover.gif?raw=true)](https://teaser-template.coderdojo.jp/)

<br>


<div id='setup'></div>

<br>

## [:wrench:](#setup) Ruby / Python / Node.js / PHP で動かす方法

### 共通

下記の手順でティザーサイトをローカル環境で確認できます。無事に立ち上げられると、ブラウザで [http://localhost:8080/](http://localhost:8080/) にアクセスした際、上記のようなティザーサイトが表示されます。

### Ruby で動かす方法

```shell
# Ruby がインストールされていることを確認する (無ければインストールする)
$ ruby --version

# ローカルサーバーを立ち上げる
$ ruby -run -e httpd
```

<br>


### Python で動かす方法

```shell
# Python がインストールされていることを確認する (無ければインストールする)
$ python --version

# ローカルサーバーを立ち上げる
$ python -m SimpleHTTPServer 8080
```

<br>


### Node.js で動かす方法

```shell
# Node.js の npx がインストールされていることを確認する (無ければインストールする)
$ npx --version

# ローカルサーバーを立ち上げる
$ npx http-server
```

<br>

### PHP で動かす方法

```shell
# PHP がインストールされていることを確認する (無ければインストールする)
$ php --version

# ローカルサーバーを立ち上げる
$ php -S localhost:8080
```


<div id='customize'></div>

<br>

## [:memo:](#customize) 動かせたら、開催情報などを入力する

前項の手順で [http://localhost:8080/](http://localhost:8080/) からティザーサイトを表示できたら、以下のファイルにある各項目を修正して完成です。

- `index.html`: 開催場所、開催日、テーマ、OGP 画像のパスなど (必須)
- `site.webmanifest`: [スマホでホーム画面に追加](https://www.google.com/search?q=スマホ+ホーム画面+追加)した際に表示されるサイト名 (任意)
- `sitemap.xml`: ドメイン名 (必須)

入力例: [:octocat: coderdojo-japan/dojocon2025-teaser.coderdojo.jp - fill date / location #1](https://github.com/coderdojo-japan/dojocon2025-teaser.coderdojo.jp/pull/1/files)



<div id='references'></div>

<br>

## [:octocat:](#references) 関連リポジトリ

- [GitHub - ティザーサイト用テンプレート](https://github.com/coderdojo-japan/teaser-template.coderdojo.jp)
- [GitHub - DojoCon Japan リポジトリ一覧](https://github.com/search?q=org%3Acoderdojo-japan%20dojocon&type=repositories)
- [GitHub - CoderDojo Japan organization](https://github.com/coderdojo-japan) (approved by [GitHub for Nonprofit](https://news.coderdojo.jp/2019/08/29/github-for-nonprofit/))

<br>

<div id='license'></div>

## [:handshake:](#license) Credits & Works

- :yin_yang: The CoderDojo logo in header - See the [CoderDojo Charter](https://coderdojo.jp/charter).
- :camera_flash: The CoderDojo object in footer is crafted by [DojoCon Japan 2016](https://dojocon2016.coderdojo.jp/) team and photo by [@yasulab](https://github.com/yasulab).
- :art: This template is based on the [DojoCon Japan 2023](https://dojocon2023.coderdojo.jp/)'s teaser site, designed by [@kwaka1208](https://github.com/kwaka1208).

Other than the logo and photo above, the source codes, such as HTML and CSS, are published under [The MIT License](https://github.com/coderdojo-japan/teaser-template.coderdojo.jp/blob/main/LICENSE.md). Feel free to refer, copy, or share them.

-----

Copyright ©  [DojoCon Japan](https://dojocon.coderdojo.jp/) & [CoderDojo Japan](https://github.com/coderdojo-japan)
