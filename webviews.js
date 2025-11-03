var akademy = akademy || {};
akademy.webviews = akademy.webviews ||
	function( config ) {
		var _document = document, // minify
			configDefault = {
				views : [
					// This is a random collection of websites (partly random because I have no idea what domain it will be run on)
					{url:"http://wouldlike.gift", title : "loaded but restricted"},
					{url:"http://blog.akademy.co.uk/2017/04/webviews-seeing-all-your-website/" /* No Title */},
					{url:"https://bitbucket.org/akademy/webviews", title : "Embed Not Allowed", openFull : true},
					{url:"httpf://error.example.com", title : "Error Bad schema"},
					{url:"http://!$&'()*+,;=.com", title : "Error Bad URL"},
					{url:"http://qweetergfsadgdvvbboisfgergerhjokjnmtn.com", title : "Unknown website"},
					{url:"http:/local", title : "Text found", textCheck: "Not Found", textCheckDelay: 2000 },
					{url:"http://127.0.0.1", title : "OK", sandbox: ["allow-forms"] }
				],
				width: 206,
				height: 136,
				scale: 0.2,
				element: _document.body,
				autoReload: 0
			};

		config = config || {};

		var _size = {
				w: config.width || configDefault.width,
				h: config.height || configDefault.height
			},
			_scale = config.scale || configDefault.scale,
			_scaledSize = {
				w: _size.w * (1/_scale),
				h : _size.h * (1/_scale)
			},
			_element = config.element || configDefault.element,
			_views = config.views || configDefault.views,
			_autoReload = config.autoReload || configDefault.autoReload,


			_fullSize = {
				w: _size.w * 4,
				h: _size.h * 4
			},
			_windowSize = {
				w: window.innerWidth || _document.body.clientWidth,
				h: window.innerHeight || _document.body.clientHeight
			};

		if( _fullSize.w > _windowSize.w ) {
			_fullSize.w = _windowSize.w - 120;
		}
		if( _fullSize.h > _windowSize.h ) {
			_fullSize.h = _windowSize.h - 50;
		}

		//window.addEventListener("message", function( event ) { console.log("A window message:", event ); }, false);
		function create() {
			var style = createElement("style"), wrapperName = " .iframe-wrap";
			style.appendChild(createTextNode(
				wrapperName + ", iframe-wrap * {box-sizing:content-box !important;}" +
				wrapperName + " *.hide {display:block !important;}" +
				wrapperName + " {width:" + _size.w + "px;height:" + (_size.h+25) +  "px;padding:0;margin:0;display:inline-block;background-color:white;margin:5px;border:3px solid black}" +
				wrapperName + ".full {position:absolute;top:20px;left:20px;border:0}" +
				wrapperName + ".loading { border-color: blue; }" +
				wrapperName + ".loaded-ok { border-color: limegreen; }" +
				wrapperName + ".loaded-restricted { border-color: #e5d610; }" +
				wrapperName + ".loaded-errored { border-color: red; }" +
				wrapperName + ".error { border-color: #f55; }" +
				wrapperName + " a {width:" + _size.w + "px;height:" + _size.h + "px;padding:0;margin:0;display:block;position:absolute;background-color:transparent;text-align:center;font-size:20px;font-weight:bold;cursor:hand;margin-top:0}" +
				wrapperName + " a:hover {background-color: rgba(0,0,0,0.5);color:white;}" +
				wrapperName + " a.hide {color: transparent }" +
				wrapperName + " a:hover.hide {color: white }" +
				wrapperName + " p {position:relative; color:black; top:" + _size.h + "px; margin:4px 4px;}" +
				wrapperName + " button {position:relative;visibility:hidden;z-index:200;width:59px;background-color:rgb(239, 240, 241);border:1px;line-height:1}" +
				wrapperName + " button:hover {background-color:rgb(139, 140, 141);color:black}" +
				wrapperName + " .buttons {margin-top:-18px}" +
				wrapperName + ".full .buttons {margin-top:0;left:" + (_fullSize.w-118) + "px;position:relative;}" +
				wrapperName + ".full button {visibility:visible;}" +
				wrapperName + ".full a:hover, .iframe-wrap.full a:hover.hide {background-color: rgba(0,0,0,0);color:transparent;}" +
				wrapperName + " iframe {width:" + _scaledSize.w + "px;height:" + _scaledSize.h + "px;transform: scale(" + _scale + "); position:absolute; transform-origin:0 0; overflow:hidden; background-color:white; border-color:black;margin-top:0px}" +
				wrapperName + ".full iframe {width:" + _fullSize.w + ";height:" + _fullSize.h + "px;transform: scale(1);z-index:100;overflow:auto;margin-top:0px}" +
				wrapperName + ".loading iframe { /*display:none*/ }" +
				wrapperName + ".loaded iframe { /*display:block*/ }"

				//" .iframe-wrap.loaded a {color: transparent }"
			));
			_element.appendChild(style);

			for( var i=0; i<_views.length; i++  ) {

				var viewData = _views[i];

				viewData.status = "none";

				if( !viewData.title ) {
					viewData.title = "No title. (Webview" + (i+1) + ")";
				}

				var div         = createElement("div"),
					divButtons  = createElement("div"),
					iframe      = createElement("iframe"),
					a           = createElement("a"),
					aText       = createTextNode( viewData.title ),
					pTitle      = createElement( "p" ),
					pTitleText  = createTextNode( viewData.title ),
					br          = createElement("br"),
					buttonClose      = createElement("button"),
					buttonCloseText  = createTextNode( "✕" ), // utf8 close symbol
					buttonRefresh      = createElement("button"),
					buttonRefreshText  = createTextNode( "↻" ); // utf8 reload symbol

				setAttribute( div, "class","iframe-wrap" );
				setAttribute( div, "id","iframe-wrap-" + i );

				setAttribute(divButtons, "class","buttons" );

				setAttribute(iframe, "src", "");
				setAttribute(iframe, "scrolling", "yes"); // Chrome bug: setting to no doesn't show the scrollbars when zoomed
				setAttribute(iframe, "seamless", "seamless");
				setAttribute(iframe,  "id","iframe-" + i );

				if( viewData.sandbox ) {
					setAttribute(iframe,  "sandbox", viewData.sandbox.join(" ") );
				}

				iframe.onload = iFrameOnLoad.bind( iframe, viewData );
				iframe.onerror = iFrameOnError.bind( iframe, viewData );

				//iframe.addEventListener("message", function( event ) { console.log("A frame message:", event ); }, false);

				setAttribute(a, "href",viewData.url); // This lets you "right click and open in other tab"
				setAttribute(a, "target","_blank");
				setAttribute(a, "alt",viewData.title + " : " + viewData.url);

				if( !viewData.openFull ) {
					a.onclick = aOnClick.bind(a, iframe);
				}

				setAttribute(buttonClose, "id","close" );
				buttonClose.onclick = buttonCloseOnClick.bind( buttonClose, iframe );

				setAttribute( buttonRefresh, "id","refresh" );
				buttonRefresh.onclick = buttonRefreshOnClick.bind( buttonRefresh, iframe, viewData );

				appendChild(buttonClose,buttonCloseText);
				appendChild(buttonRefresh,buttonRefreshText);

				appendChild(divButtons,buttonClose);
				//appendChild(div, createElement("br"));
				appendChild(divButtons,buttonRefresh);

				appendChild(a,br);
				appendChild(a,aText);

				appendChild(pTitle,pTitleText);

				appendChild(div,divButtons);
				//div.appendChild(div,createElement("br"));
				appendChild(div,iframe);
				appendChild(div,a);
				appendChild(div,pTitle);

				appendChild(_element,div);

				updateIFrame( iframe, viewData, 50 * (i+1) );
				setTimeout( updateATitle.bind(this, a, aText ), 2000 );
			}

			function setAttribute( element, attribute, value ) {element.setAttribute(attribute, value)}
			function createElement( name ) {return _document.createElement(name)}
			function createTextNode( text ) {return _document.createTextNode(text)}
			function appendChild( parent, child ) {parent.appendChild(child)}

			function updateATitle(a, aText) {
				a.replaceChild( createTextNode("⌕ zoom"), aText ); // utf8 magnify glass symbol
				a.classList.add("hide");
			}

			function updateIframeSrc(viewData) {
				viewData.status = "loading"; // Set "real" loading, not just about:blank page loaded!
				this.parentNode.classList.add("loading");

				try {
					setAttribute(this, "src", viewData.url);
				}
				catch(all) {
					// iFrame restricter... this does not catch anything, as nothing is thrown... :(
					this.parentNode.classList.add("loaded-restricted");
				}
			}

			function iFrameOnLoad( viewData ) {
				if( viewData.status === "loading") {
					var divParent = this.parentNode;

					divParent.classList.remove("loading");
					viewData.status = "loaded";

					// try to detect page not loaded the right webpage...
					try {
						var content = (this.contentWindow || this.contentDocument);
						if (content.document) {
							content = content.document;
						}

						if (!content.implementation || !content.body || !content.body.innerText ||
							content.body.childElementCount === 0) {
							divParent.classList.add("loaded-errored");
						}
						else {
							if (viewData.textCheck && viewData.textCheck !== '' ) {

								if( viewData.textCheckDelay ) {
									setTimeout(()=>{
										var content = this.contentDocument;
										if( content.body.innerText.indexOf(viewData.textCheck) === -1) {
											divParent.classList.add("loaded-errored");
										}
										else {
											divParent.classList.add("loaded-ok");
										}
									}, viewData.textCheckDelay )
								}
								else {
									if( content.body.innerText.indexOf(viewData.textCheck) === -1) {
										divParent.classList.add("loaded-errored");
									}
									else {
										divParent.classList.add("loaded-ok");
									}
								}
							}
							else {
								divParent.classList.add("loaded-ok");
							}
						}

						if( viewData.autoReload > 0 || _autoReload > 0 ) {
							var reload = _autoReload;
							if (viewData.autoReload > 0) {
								reload = viewData.autoReload;
							}
							if (reload > 0) {
								updateIFrame(this, viewData, reload * 1000);
							}
						}
					}
					catch(all) {
						//Not allowed access to iframe as likely on another domain.
						divParent.classList.add("loaded-restricted");
					}
				}

			}

			/* Detect loading errors (but not server errors on particular page!), such as an invalid URL */
			function iFrameOnError( viewData ) {
				viewData.status = "errored";
				this.parentNode.classList.add("error");
			}

			function aOnClick ( iframe ) {
				iFrameLarge( iframe );
				return false;
			}
			function buttonCloseOnClick ( iframe ) {
				iFrameSmall( iframe );
			}
			function buttonRefreshOnClick ( iframe, viewData ) {
				updateIFrame( iframe, viewData );
			}

			function updateIFrame( iframe, viewData, updateTime ) {
				if( viewData.timeout ) {
					clearTimeout( viewData.timeout );
				}
				viewData.timeout = setTimeout( updateIframeSrc.bind( iframe, viewData ), updateTime || 50 );
			}

			function iFrameLarge( iframe ) {
				iframe.parentNode.classList.add("full");
				//iframe.style.overflow = "shown";
				setAttribute(iframe,"scrolling", "auto");
			}
			function iFrameSmall( iframe ) {
				iframe.parentNode.classList.remove("full");
				//iframe.style.overflow = "hidden";
				setAttribute(iframe,"scrolling", "no");
			}
		}

		create();
	};
