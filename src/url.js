var url = require("url");

/**
 * Removes query string and hash at the end of the URL.
 * @example "http://example.com/?q=a#end" => "http://example.com/"
 * @param  {String} href 
 * @return {String} 
 */
function removeSearchAndHash(href) {
  return href.split(/\#|\?/g)[0];
}

/**
 * Changes protocol to "http" and removes: "www.", querystring, hash & trailing slashes
 * @example "https://www.example.com" => "http://example.com"
 * @param  {String} href 
 * @return {String}
 */
function normalise(href) {
  href = removeSearchAndHash(href);
  return href.replace(/^https?:\/\/(www\.)?/, "http://")
    .replace(/\/+$/, "");
}

var reHTTP = /^https?:/;

/**
 * @param  {String} href 
 * @return {Boolean}
 */
function isHTTP(href) {
  return reHTTP.test(href);
}

var reAsset = /\.(pdf|zip|css|js|jpg|jpeg|gif|png|docx|xlsx|json|xml|feed|csv)$/i;

/**
 * Checks whether the URL is *probably* an asset.
 * @param  {String} href
 * @return {Boolean}
 */
function isAsset(href) {
  href = removeSearchAndHash(href);
  return reAsset.test(href);
}


/**
 * Checks whether the URL's domain matches the passed domain.
 * @param  {String} domain 
 * @param  {String} href
 * @return {Boolean}
 */
function isOnDomain(domain, href) {
  return isOnDomainPartial(domain)(href);
}

/**
 * Same as `isOnDomain`, but returns a partial function.
 * @param  {String} domain
 * @return {Function}
 */
function isOnDomainPartial(domain) {
  var reSameDomain = new RegExp("^(.+\.)?" + domain + "$", "i");
  return function(href) {
    var hostname = url.parse(href).hostname;
    return reSameDomain.test(hostname);
  }
}

exports.normalise = normalise;
exports.removeSearchAndHash = removeSearchAndHash;
exports.isHTTP = isHTTP;
exports.isAsset = isAsset;
exports.isOnDomainPartial = isOnDomainPartial;
exports.isOnDomain = isOnDomain;

exports.resolve = url.resolve;
exports.parse = url.parse;
exports.format = url.format;
