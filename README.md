# pitly

pitly is a project aiming at creating a bit.ly fork using javascript technologies.
It is firstly an exercise on clean coding (BDD, code coverage, CI) and well formed multi users REST api. There is no commercial purpose behind it.
Currently, it is mainly a REST api.


## GET /api/urls

return all the shortened urls. It is not really secure, nore it is efficient. Pagination is on his way.

### GET /api/urls?url=:url

You can provide a clear Url as query String. Behavior is to convert url to URIEncoded format and redirect to /api/urls/:URIEncode(url).

### GET /api/urls?shorten=:shorten

Also a shorten as query string. This parameter come prior to `url`.
Behavior is to redirect to /api/shorens/:shorten.

## GET /api/urls/:url

You can precise an url, in URIEncoded format as a parameter to get all info about a precise URL

## GET /api/shortens/:shorten

It is the same as previously but with a shorten format

## GET /:shorten

Given a existing shorten it redirects to the corresponding URL.

## POST /api/urls

You can provide `x-www-form-urlencoded` url parameter to add a new url. If the url already exists it silently return the already existing URL. Otherwise it returns the newly created URL.

## TODO

* Tokenize requests
* Web UI
* Sessions
* User-connection
* OAuth connection

## Shorten generation

A shorten is the first 5 characters of the SHA-1 of the given URL. It is possible for 2 shortens to be equal. There are numerous other solutions, this one was the fastest way to get it quick.
