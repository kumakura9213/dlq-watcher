# dlq-watcher

これは「定期的に指定したDLQ(Dead Letter Queue)のメッセージを取得し、Chatworkに通知するLambda関数」です。  

Elastic Beanstalkだと費用がかかるので、その費用を抑えるためにLambdaで作成しました。  
ただ、Lambdaで作成したためにいくつかの点で注意が必要です。

* イベントスケジュールで動作するため、DLQに入ったタイミングで通知できるわけではない。
* シングルプロセスでしか動作しないため、DLQに短期間に大量のデータが入るとさばき切れないことがある。

そのため、DLQに滅多にメッセージが来ないが、メッセージが来たときにすぐ対応したいという用途であれば、利用できると思います。

## How to deploy

### :octocat: STEP 1. Clone

```sh
$ git clone https://github.com/kumakura9213/dlq-watcher.git
$ cd dlq-watcher
$ npm install
```

### :pencil: STEP 2. Edit config

```sh
$ cd dlq-watcher
$ cp template-env.yml env.yml
$ vi env.yml
```

### :rocket: STEP 3. Deploy to AWS

```sh
$ cd dlq-watcher
$ ./node_modules/.bin/sls config credentials --provider aws --key XXX --secret XXX

# deploy for development
$ npm run deploy

# deploy for production
$ npm run deploy -- -s production
```

## How to cleanup

```sh
$ cd dlq-watcher

# remove for development
$ npm run remove

# remove for production
$ npm run remove -- -s production
```

## How to test

```sh
$ cd dlq-watcher
$ cp test/.template-env test/.env
$ vi test/.env
$ npm test
```
