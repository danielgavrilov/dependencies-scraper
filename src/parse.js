var _ = require("lodash")
var cheerio = require("cheerio");

var url = require("./url");

/** 
 * Extracts links and asset URLs from an HTML string.
 * @param  {String} html HTML string
 * @return {Object} { links: {Array.<String>}, assets: {Array.<String>} }
 */
function parse(html) {

  var $ = cheerio.load(html);

  /**
   * Extracts attribute values of all occurrences of `tag`.
   * @param  {String} tag
   * @param  {String} attr
   * @return {Array.<String>} values of the attributes
   */
  function extract(tag, attr) {
    return $(tag).map(function() {
      return $(this).attr(attr);
    }).get();
  }

  var links = extract("a", "href");

  var assets = extract("link", "href")
    .concat(extract("script", "src"))
    .concat(extract("img", "src"));

  // URLs that are probably assets (pdf/jpg/png/...) are moved to `assets` array.
  var partition = _.partition(links, url.isAsset);
  links = partition[1];
  assets = assets.concat(partition[0]);

  return {
    links: _.unique(links),
    assets: _.unique(assets)
  };

}

module.exports = parse;