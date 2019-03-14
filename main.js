const EventEmitter = require("events");
const snoowrap = require("snoowrap");

const SnooStorm = (() => {

  const removeDuplicates = (old, fresh, start) => fresh.filter(item => (
    old.every(i => i.id != item.id) && 
    item.created_utc >= start / 1000
  ));

  const parseOptions = options => {
    options = options || {};
    options.filter = options.filter || "inbox";
    options.pollTime = options.pollTime || 2000;
    options.results = options.results || 25;
    options.subreddit = options.subreddit;
    return options
  }

  // credit: @Felix Kling on SO (http://stackoverflow.com/a/30760236/2016735)
  const isClass = v => (
    typeof v === 'function' && /^\s*class\s+/.test(v.toString())
  );

  return class {

    constructor(client) {
      this.client = isClass(client) ? client : new snoowrap(client);
    }

    Stream(kind, options) {
      
      let apiCall;
      let client = this.client;
      let event = new EventEmitter();
      let old = [];
      let start = Date.now();
     
      options = parseOptions(options);

      if (kind === "comment") {
        apiCall = () => client.getNewComments(options.subreddit, {
          limit: options.results
        });
      } else if (kind === "inbox") {
        apiCall = () => client.getInbox({
          filter: options.filter
        });
      } else if (kind === "submission") {
        apiCall = () => client.getNew(options.subreddit, {
          limit: options.results
        });
      } else {
        console.error("error");
      }

      let streamId = setInterval(() => {
        apiCall().then(fresh => {
          removeDuplicates(old, fresh, start).forEach(item => {
            event.emit("item", item);
          });
          old = fresh;
        }).catch(e => {
          event.emit("error", e);
        });
      }, options.pollTime);

      event.on("end", () => {
        clearInterval(streamId);
      });

      return event;
    }
  };
})();

module.exports = SnooStorm;
