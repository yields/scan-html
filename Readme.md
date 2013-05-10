
# scan-html

  a tiny html lexer (WIP).

## Installation

    $ component install yields/scan-html

## Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>foobaz</title>
    <script src='baz'></script>
    <meta type='dummy' href>
  </head>
  <body>
    <h1 this is broken!>
    <div></div>
  </body>
</html>
```

```js
var scan = require('./');

scan(html, function(type, val){
  if ('text' == type && !val.trim()) return;
  console.log('%s: %s', type, val);
});
```

```text
open: html
open: head
open: title
text: foobaz
close: title
open: script
attrs: src='baz'
close: script
open: meta
attrs: type='dummy' href
close: head
open: body
open: h1
attrs: this is broken!
open: div
close: div
close: body
close: html
```

## License

  MIT
