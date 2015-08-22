var _ = require("lodash");
var util = require("util");
var events = require("events");

var get = require("./get");
var url = require("./url");
var parse = require("./parse");

/**
 * Creates a new crawler.
 * @constructor
 * @param {Object} opts { domain: {String}, url: {String} }
 */
function Crawler(opts) {
  this.rootDomain = opts.domain;
  this.sameDomain = url.isOnDomainPartial(this.rootDomain);
  this.requests = {};
  this.pages = {};
  this.done = false;
  this.request(opts.url);
}

util.inherits(Crawler, events.EventEmitter);

/**
 * Requests a new page, then adds it to the crawler.
 * @param  {String} href URL of the page
 * @return {Crawler} this
 */
Crawler.prototype.request = function(href) {

  href = url.normalise(href);

  if (this.sameDomain(href) && !this.isRequested(href)) {
    var request = this.requests[href] = get(href);
    request.then(this._pageSuccess.bind(this), this._pageError.bind(this));
  }

  return this;
};

/**
 * Check whether page was already requested.
 * @param  {String} href
 * @return {Boolean}
 */
Crawler.prototype.isRequested = function(href) {
  return this.requests.hasOwnProperty(href);
};

/**
 * @return {Array.<Object>} The result in JSON
 */
Crawler.prototype.toJSON = function() {
  return _.values(this.pages);
};

Crawler.prototype._pageSuccess = function(response) {

  var href = response.request.uri.href;
  var page = parse(response.body);

  page.url = href;

  page.links = page.links
    .map(_.partial(url.resolve, href))
    .filter(url.isHTTP)
    .filter(this.sameDomain);

  page.assets = page.assets
    .map(_.partial(url.resolve, href))
    .filter(this.sameDomain);

  this.pages[page.url] = page;
  page.links.forEach(this.request.bind(this));
  this.emit("add", page);

  this._checkIfAllDone();
};

Crawler.prototype._pageError = function(error) {
  this.emit("error", error);
  this._checkIfAllDone();
};

Crawler.prototype._checkIfAllDone = function() {
  if (!this.done) {
    var promises = _.values(this.requests);
    if (!_.any(promises, _.method("isPending"))) {
      this.done = true;
      this.emit("done", this.toJSON());
    }
  }
};

module.exports = Crawler;
