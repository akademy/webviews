WebViews
========

Welcome to WebViews.
WebViews provides a way to see many of your webpages at once,
no need to load multiple pages or to click through,
you just need to open this one page. Furthermore,
it'll do some error checking for you too.

Check out an example at http://lab.akademy.uk/webviews/webviews.html

Uses
----
You can use them for:

- When you update your code you can see if anything breaks.
- When your doing user testing you can quickly jump between the pages you need to test.
- If you're updating a design you can see how it looks across the entire website in one go.
- You can test many pages to check they're responding correctly.
- You can even use it as a bookmark store.

Setup
-----
The file [webviews.html](https://bitbucket.org/akademy/webviews/src/7cd1dddffc95a66a7d0543f1b015149c63b875da/webviews.html?at=master) shows a typical set up.

First embed the little script:

    <script src="webviews.js"></script>

Then set up a config object, for example two web pages, one with an auto reload and the other with a text check, they're attached to the end of the body element:

    var config = {
        element: document.body,
        views: [
            {
                url:"localhost/mywebpage1",
                title: "Home Page",
                autoReload: 10,
            },
            {
                url:"localhost/mywebpage2",
                title: "Sub page",
                textCheck: "Second Page"
            }
            // more webpages here...
        ]

Now pass it into WebViews:

    akademy.webviews( config );


The full set of options:

- `config.element` : THe HTML element you would like the webviews to
 be put. Default: <body>
- `config.views`: an array of objects holding the webpages to load. (Technically optional, as it'll load it's own list if not specified)
 - `config.views.url`: the url of the webpage. Mandatory.
 - `config.views.title`: the name to show underneath the WebView. Optional.
 - `config.views.autoReload`: Number of seconds to wait before reloading. Optional. Default is no refresh. Overrules the `config.refresh` value.
 - `config.views.textCheck`: A string to look for inside the iframe (see restrictions section). Optional. Default is no check.
- `config.width`: Width of a minimised WebView. Default is 206.
- `config.height`: Height of a minimised WebView. Default is 136.
- `config.scale`: Scale amount of the webpage within a minimised WebView. Default is 0.2.
- `config.autoReload`: An auto reload value for all the WebViews.

Border colour keys
------------------
The colour of the border of a WebView shows how successful the load of the page was.

- Green: Load and text check were OK.
- Yellow: The page loaded correctly but I can't access the iFrame due to security restrictions.
- Red: There were one or more errors either in loading or the text check failed.
- Blue: Used when the webview isloading. (At the moment webpages which timeout are also shown in blue)


Security Restrictions
---------------------
There are two security restrictions you need to know about.

The first is that any website can refuse to be embedded inside an iframe with the X-Frame-Options HTTP header setting (for instance the bbc.co.uk website has this restriction), if you try to place one of these in a view it will attempt to load but just be blank, in this case the border will turn yellow to indicate there is an access restriction.

The second restriction is that you can only read the content of an iframe if that page is on the same domain as your WebViews webpage. This only causes a problem when we try to detect certain errors or attempted to check for specific words, many of the errors are impossible to check for without unrestricted access to the content.

