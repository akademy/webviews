var akademy = akademy || {};
akademy.webviews = akademy.webviews ||
	function( config ) {

		var configDefault = {
			views : [
				// This is a random collection of websites (partly random because I have no idea what domain it will be run on)
				{url:"http://wouldlike.gift", title : "loaded but restricted"},
				{url:"http://blog.akademy.co.uk/2017/04/webviews-seeing-all-your-website/" /* No Title */},
				{url:"https://bitbucket.org/akademy/webviews", title : "3 Embed Not Allowed", openFull : true},
				{url:"httpf://error.example.com", title : "4 Error Bad schema"},
				{url:"http://!$&'()*+,;=.com", title : "Error Bad URL"},
				{url:"http://qweetergfsadgdvvbboisfgergerhjokjnmtn.com", title : "Unknown website"},
				{url:"http:/local", title : "Text found", textCheck: "Not Found"},
				{url:"http://127.0.0.1", title : "OK" }
			],
			width: 206,
			height: 136,
			scale: 0.2,
			element: document.body,
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
			_autoReload = config.autoReload || configDefault.autoReload;

		var	_fullSize = {
				w: _size.w * 4,
				h: _size.h * 4
			},
			_windowSize = {
				w: window.innerWidth || document.body.clientWidth,
				h: window.innerHeight || document.body.clientHeight
			};

		if( _fullSize.w > _windowSize.w ) {
			_fullSize.w = _windowSize.w - 120;
		}
		if( _fullSize.h > _windowSize.h ) {
			_fullSize.h = _windowSize.h - 50;
		}

		window.addEventListener("message", function( event ) { console.log("A window message:", event ); }, false);
		window.addEventListener("load", function() {

			var style = document.createElement("style");
			style.appendChild(document.createTextNode(
				" .iframe-wrap, iframe-wrap * {box-sizing:content-box !important;}" +
				" .iframe-wrap *.hide {display:block !important;}" +
				" .iframe-wrap {width:" + _size.w + "px;height:" + (_size.h+25) +  "px;padding:0;margin:0;display:inline-block;background-color:white;margin:5px;border:3px solid black}" +
				" .iframe-wrap.full {position:absolute;top:20px;left:20px;border:0}" +
				" .iframe-wrap.loading { border-color: blue; }" +
				" .iframe-wrap.loaded-ok { border-color: limegreen; }" +
				" .iframe-wrap.loaded-restricted { border-color: #e5d610; }" +
				" .iframe-wrap.loaded-errored { border-color: red; }" +
				" .iframe-wrap.error { border-color: #f55; }" +
				" .iframe-wrap a {width:" + _size.w + "px;height:" + _size.h + "px;padding:0;margin:0;display:block;position:absolute;background-color:transparent;text-align:center;font-size:20px;font-weight:bold;cursor:hand;margin-top:0}" +
				" .iframe-wrap a:hover {background-color: rgba(0,0,0,0.5);color:white;}" +
				" .iframe-wrap a.hide {color: transparent }" +
				" .iframe-wrap a:hover.hide {color: white }" +
				" .iframe-wrap p {position:relative; color:black; top:" + _size.h + "px; margin:4px 4px;}" +
				" .iframe-wrap button {visibility:hidden;z-index:200;width:59px;background-color:rgb(239, 240, 241);border:1px;}" +
				" .iframe-wrap .buttons {margin-top:-18px;}" +
				" .iframe-wrap.full .buttons {margin-top:0;left:" + (_fullSize.w-118) + "px;position:relative;}" +
				" .iframe-wrap.full button {visibility:visible;}" +
				" .iframe-wrap.full a:hover, .iframe-wrap.full a:hover.hide {background-color: rgba(0,0,0,0);color:transparent;}" +
				" .iframe-wrap iframe {width:" + _scaledSize.w + "px;height:" + _scaledSize.h + "px;transform: scale(" + _scale + "); position:absolute; transform-origin:0 0; overflow:hidden; background-color:white; border-color:black;margin-top:0px}" +
				" .iframe-wrap.full iframe {width:" + _fullSize.w + ";height:" + _fullSize.h + "px;transform: scale(1);z-index:100;overflow:auto;margin-top:0px}" +
				" .iframe-wrap.loading iframe { /*display:none*/ }" +
				" .iframe-wrap.loaded iframe { /*display:block*/ }"

				//" .iframe-wrap.loaded a {color: transparent }"
			));
			_element.appendChild(style);

			for( var i=0; i<_views.length; i++  ) {

				var viewData = _views[i];

				viewData.status = "none";

				if( !viewData.title ) {
					viewData.title = "No title. (Webview" + (i+1) + ")";
				}

				var div         = document.createElement("div"),
					divButtons  = document.createElement("div"),
					iframe      = document.createElement("iframe"),
					a           = document.createElement("a"),
					aText       = document.createTextNode( viewData.title ),
					pTitle      = document.createElement( "p" ),
					pTitleText  = document.createTextNode( viewData.title ),
					br          = document.createElement("br"),
					buttonClose      = document.createElement("button"),
					buttonCloseText  = document.createTextNode( "✕" ), // ✕
					buttonRefresh      = document.createElement("button"),
					buttonRefreshText  = document.createTextNode( "↻" ); // ↻

				div.setAttribute( "class","iframe-wrap" );
				div.setAttribute( "id","iframe-wrap-" + i );

				divButtons.setAttribute( "class","buttons" );

				iframe.setAttribute("src", "");
				iframe.setAttribute("scrolling", "no");
				iframe.setAttribute("seamless", "seamless");
				iframe.setAttribute( "id","iframe-" + i );

				iframe.onload = iFrameOnLoad.bind( iframe, viewData );
				iframe.onerror = iFrameOnError.bind( iframe, viewData );

				//iframe.addEventListener("message", function( event ) { console.log("A frame message:", event ); }, false);

				a.setAttribute("href",viewData.url); // This lets you "right click and open in other tab"
				a.setAttribute("target","_blank");
				a.setAttribute("alt",viewData.title + " : " + viewData.url);
				
				if( !viewData.openFull ) {
					a.onclick = aOnClick.bind(a, iframe);
				}

				buttonClose.setAttribute( "id","close" );
				buttonClose.onclick = buttonCloseOnClick.bind( buttonClose, iframe );

				buttonRefresh.setAttribute( "id","refresh" );
				buttonRefresh.onclick = buttonRefreshOnClick.bind( buttonRefresh, iframe, viewData );

				buttonClose.appendChild(buttonCloseText);
				buttonRefresh.appendChild(buttonRefreshText);

				divButtons.appendChild(buttonClose);
				//div.appendChild(document.createElement("br"));
				divButtons.appendChild(buttonRefresh);

				a.appendChild(br);
				a.appendChild(aText);

				pTitle.appendChild(pTitleText);

				div.appendChild(divButtons);
				//div.appendChild(document.createElement("br"));
				div.appendChild(iframe);
				div.appendChild(a);
				div.appendChild(pTitle);

				_element.appendChild(div);

				updateIFrame( iframe, viewData, 50 * (i+1) );
				setTimeout( updateATitle.bind(this, a, aText ), 2500 );
			}

			function updateATitle(a, aText) {
				a.replaceChild( document.createTextNode("⌕ zoom"), aText );
				a.classList.add("hide");
			}

			function updateIframeSrc(viewData) {
				viewData.status = "loading"; // Set "real" loading, not just about:blank page loaded!
				this.parentNode.classList.add("loading");

				try {
					this.setAttribute("src", viewData.url);
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
							if (viewData.textCheck &&
								viewData.textCheck !== '' &&
								content.body.innerText.indexOf(viewData.textCheck) === -1) {
								divParent.classList.add("loaded-errored");
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
				iframe.setAttribute("scrolling", "yes");
			}
			function iFrameSmall( iframe ) {
				iframe.parentNode.classList.remove("full");
				iframe.setAttribute("scrolling", "no");
			}



		}, false);
	};
