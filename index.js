
/**
 * Scan the given `html`.
 * 
 * @param {String} html
 * @param {Function} emit
 */

module.exports = function(html, emit){
  var scan = text
    , pos = 0;

  /**
   * emitter.
   */
  
  emit = emit || function(){};

  /**
   * scan
   */
  
  while (scan = scan());

  /**
   * next
   */
  
  function next(){
    return html.charAt(pos++);
  }

  /**
   * peek
   */
  
  function peek(){
    return html.charAt(pos);
  }

  /**
   * consume
   */
  
  function consume(n){
    html = html.substr(n);
    pos = 0;
  }

  /**
   * `>(text)<`
   */
  
  function text(){
    if ('>' == peek()) consume(1);
    while (lessthan());
    var buf = html.slice(0, pos);
    consume(buf.length);
    if (buf) emit('text', buf);

    // treat `< ` as text
    if (0 == html.indexOf('< ')) {
      buf += html.slice(0, 2);
      consume(2);
      return text;
    }

    // ignore `<!`
    if (0 == html.indexOf('<!')) {
      while (greaterthan());
      consume(1 + pos);
      return text;
    }

    // close
    if (0 == html.indexOf('</')) {
      return close;
    }

    // open
    if ('<' == peek()) {
      return open;
    }
  }

  /**
   * `<(tag)`
   */
  
  function open(){
    while (' ' != peek() && '>' != peek() && next());
    var buf = html.slice(0, pos);
    consume(buf.length);
    var tag = buf.substr(1);
    if (1 < buf.length) emit('open', buf.substr(1));
    return attrkey;
  }

  /**
   * ` *(key)*`
   */
  
  function attrkey(){
    whitespace();
    while ('>' != peek() && ' ' != peek() && '=' != peek() && next());
    var buf = html.slice(0, pos);
    consume(buf.length);
    if (buf) emit('attrkey', buf.trim());
    return attrval;
  }

  /**
   * `=?(["'](val)['"])`
   */
  
  function attrval(){
    if (' ' == peek()) return attrkey;
    if ('>' == peek()) return text;
    if ('=' == peek()) consume(1);
    var end = ' ';
    if ('"' == peek()) end = '"';
    if ("'" == peek()) end = "'";
    if (' ' != end) consume(1);
    while (end != peek() && next());
    var buf = html.slice(0, pos);
    consume(buf.length);
    if (' ' != end) consume(1);
    emit('attrval', buf);
    return attrval;
  }

  /**
   * `</(tag)`
   */
  
  function close(){
    while (greaterthan());
    var buf = html.slice(0, pos);
    consume(1 + buf.length);
    if (2 < buf.length) emit('close', buf.substr(2));
    return text;
  }

  /**
   * consume whitespace.
   */
  
  function whitespace(){
    while (' ' == peek() && next());
    consume(pos);
  }

  /**
   * scan `<`
   */
  
  function lessthan(){
    return '<' != peek() && next();
  }

  /**
   * scan `>`
   */
  
  function greaterthan(){
    return '>' != peek() && next();
  }
  
};
