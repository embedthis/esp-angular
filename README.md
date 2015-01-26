esp-angular
===

Pak for to provide Angular support for ESP.

### To install:

    pak install esp-angular

### Description

The esp-angular pak extends the 'angular' pak by adding ESP specific directives and services.

### Components 

* esp-click.js &mdash; Conditionally redirect to URLs depending on the authorized user's abilities.
* esp-field-errors.js &mdash; Emit form field validation errors.
* esp-fixnum.js &mdash; Convert a number to a fixed number of digits.
* esp-format.js &mdash; Format fields according to the database table data types.
* esp-input-group.js &mdash; Input a group of fields into a database table.
* esp-input.js &mdash; Emit an input field of the appropriate data type.
* esp-resource.js &mdash; Perform RESTful URI requests.
* esp-session.js &mdash; Client side session storage service.
* esp-sockets.js &mdash; Web sockets support.
* esp-titlecase.js &mdash; Simple TitleCase filter.
* esp.js &mdash; ESP support for [AngularJS](http://angularjs.org).

### To configure

In esp.json

* esp.mappings &mdash; Collection of properties to send to the client. The keys are the properties to send to the client,
    the values are the properties in esp.json from which to copy the data values. This sends a subset of the configuration
    to the client.

```
{
    "esp": {
        "mappings": {
            "auth": {
                "login": "http.auth.login",
                "store": "http.auth.store"
            },
            "formats":   "http.formats",
            "prefix":    "http.prefix",
            "timeouts": "http.timeouts"
        }
    }
}
```

### Get Pak from

[https://embedthis.com/pak](https://embedthis.com/pak)
