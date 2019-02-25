# snoostorm-es6

event-based wrapper around [`snoowrap`](https://npm.im/snoowrap)
fork of [`SnooStorm`](https://github.com/MayorMonty/Snoostorm)

## usage

basic usage:

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
const s = new snoostream(r);

// comment streaming
const comments = s.Stream("comment", {
  subreddit: "all",
  pollTime: 5000
});

comments.on("item", item => {
  console.log(item);
});

// submission streaming
const submissions = s.Stream("submission", {
  subreddit: "asoiaf",
  pollTime: 10000
});

submissions.on("item", item => {
  console.log(item.title);
});

// inbox streaming
// filter one of "inbox" (default), "unread", "messages", "comments", "selfreply", or "mentions"
const mentions = s.Stream("inbox", {
  filter: "mentions"
});

mentions.on("item", item => {
  console.log(item.author.name);
});
```
