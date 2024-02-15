## Abstract File Storage

### Project Structure

Express application generator

### Prettier Default Settings

```json
{
	"singleQuote": true, // '' for stings instead of ""
	"trailingComma": "es5", // add trailing commas in objects, arrays, etc.
	"printWidth": 120, // max 120 chars in line, code is easy to read
	"useTabs": true, // use spaces instead of tabs
	"tabWidth": 2, // "visual width" of of the "tab"
	"semi": true, // add ; when needed
	"bracketSpacing": true, // import { some } ... instead of import {some} ...
	"arrowParens": "always" // braces even for single param in arrow functions (a) => { }
}
```

### How to start ?

```bash
# install node packages
$ npm i

# start the node server
$ npm start

# when we change anything in www
$ rs
```

### standerd response header

```
Accept-Ranges: bytes
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: X-Requested-With,content-type,Authorization
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT
Cache-Control: no-cache, no-store, must-revalidate
Connection: keep-alive
Content-Length: 979
Content-Security-Policy-Report-Only: default-src 'self';script-src 'self' 'unsafe-inline' https://65.0.154.115:6500;style-src 'self' 'unsafe-inline' fonts.googleapis.com;frame-src 'self';font-src 'self' fonts.googleapis.com fonts.gstatic.com res.cloudinary.com/;img-src 'self' data: https://res.cloudinary.com;base-uri 'self';block-all-mixed-content;form-action 'self';frame-ancestors 'self';object-src 'none';script-src-attr 'none';upgrade-insecure-requests
Content-Type: text/html; charset=UTF-8
Date: Mon, 08 Aug 2022 10:29:53 GMT
ETag: W/"3d3-1827cfb7d50"
Expect-CT: max-age=0
Expires: 0
Keep-Alive: timeout=5
Last-Modified: Mon, 08 Aug 2022 10:23:52 GMT
Pragma: no-cache
Referrer-Policy: no-referrer
Strict-Transport-Security: 'max-age=31536000; includeSubDomains; preload' env=HTTPS
Surrogate-Control: no-store
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
```