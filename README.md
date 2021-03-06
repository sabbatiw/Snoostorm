# snoostorm-es6

event-based wrapper around [`snoowrap`](https://not-an-aardvark.github.io/snoowrap)  
fork of [`SnooStorm`](https://github.com/MayorMonty/Snoostorm)

## usage

#### setup:

```javascript
'use strict';

const snoowrap = require('snoowrap');
const snoostorm = require('snoostorm-es6');

const options = {
    userAgent: "<user agent>",
    clientSecret: "<client secret>",
    clientId: "<client id>",
    username: "<username>",
    password: "<password>"
};

const r = new snoowrap(options);
const s = new snoostorm(r);
```

#### comment streaming
```javascript
const comments = s.Stream("comment", {
  subreddit: "all",
  results: 100, // defaults to 25, max is 100
  pollTime: 5000
});

comments.on("item", item => {
  console.log(item);
});
```

#### submission streaming
```javascript
const submissions = s.Stream("submission", {
  subreddit: "asoiaf",
  pollTime: 10000
});

submissions.on("item", item => {
  console.log(item.title);
});
```

#### inbox streaming
```javascript
// filter one of "inbox" (default), "unread", "messages", "comments", "selfreply", or "mentions"
const mentions = s.Stream("inbox", {
  filter: "mentions"
});

mentions.on("item", item => {
  console.log(item.author.name);
});
```

#### error handling
```javascript
comments.on("error", e => {
  console.log(e); // stop breaking the rate-limit
});
```

#### ending a stream
```javascript
comments.on("end", () => {
  console.log("your one hour comment stream has ended.");
});

setTimeout(() => {
  comments.emit("end");
}, 3600000);
```
