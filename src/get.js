var Q = require("q");
var request = require("request");

/**
 * Returns a promise to an HTTP response object. Rejects if the resource is not an HTML page.
 * @param  {String} href URL of the page
 * @return {Promise.Object} response
 */
function get(href) {
  var deferred = Q.defer();
  request(href, function(error, response, body) {

    if (error) return deferred.reject(error);

    // `request` automatically resolves redirects, so original URL can change.
    var href = response.request.uri.href;
    
    if (response.statusCode < 200 || response.statusCode >= 300) {
      return deferred.reject(
        new Error("Resource " + href + " returned status " + response.statusCode));
    }

    var contentType = response.headers["content-type"];
    if (contentType && contentType.indexOf("text/html") === -1) {
      return deferred.reject(
        new Error("Resource " + href + " has content type " + contentType));
    }

    deferred.resolve(response);

  });
  return deferred.promise;
}

module.exports = get;
