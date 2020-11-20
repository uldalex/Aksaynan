 const ready = require('./utils/documentReady.js');

// ready(function(){
//   console.log('DOM героически построен!');
// });

 const $ = require('jquery');

/*!
 * Isotope PACKAGED v3.0.6
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * https://isotope.metafizzy.co
 * Copyright 2010-2018 Metafizzy
 */

/**
 * Bridget makes jQuery widgets
 * v2.0.1
 * MIT license
 */

/* jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
    // universal module definition
    /*jshint strict: false */ /* globals define, module, require */
    if ( typeof define == 'function' && define.amd ) {
      // AMD
      define( 'jquery-bridget/jquery-bridget',[ 'jquery' ], function( jQuery ) {
        return factory( window, jQuery );
      });
    } else if ( typeof module == 'object' && module.exports ) {
      // CommonJS
      module.exports = factory(
        window,
        require('jquery')
      );
    } else {
      // browser global
      window.jQueryBridget = factory(
        window,
        window.jQuery
      );
    }
  
  }( window, function factory( window, jQuery ) {
  'use strict';
  
  // ----- utils ----- //
  
  var arraySlice = Array.prototype.slice;
  
  // helper function for logging errors
  // $.error breaks jQuery chaining
  var console = window.console;
  var logError = typeof console == 'undefined' ? function() {} :
    function( message ) {
      console.error( message );
    };
  
  // ----- jQueryBridget ----- //
  
  function jQueryBridget( namespace, PluginClass, $ ) {
    $ = $ || jQuery || window.jQuery;
    if ( !$ ) {
      return;
    }
  
    // add option method -> $().plugin('option', {...})
    if ( !PluginClass.prototype.option ) {
      // option setter
      PluginClass.prototype.option = function( opts ) {
        // bail out if not an object
        if ( !$.isPlainObject( opts ) ){
          return;
        }
        this.options = $.extend( true, this.options, opts );
      };
    }
  
    // make jQuery plugin
    $.fn[ namespace ] = function( arg0 /*, arg1 */ ) {
      if ( typeof arg0 == 'string' ) {
        // method call $().plugin( 'methodName', { options } )
        // shift arguments by 1
        var args = arraySlice.call( arguments, 1 );
        return methodCall( this, arg0, args );
      }
      // just $().plugin({ options })
      plainCall( this, arg0 );
      return this;
    };
  
    // $().plugin('methodName')
    function methodCall( $elems, methodName, args ) {
      var returnValue;
      var pluginMethodStr = '$().' + namespace + '("' + methodName + '")';
  
      $elems.each( function( i, elem ) {
        // get instance
        var instance = $.data( elem, namespace );
        if ( !instance ) {
          logError( namespace + ' not initialized. Cannot call methods, i.e. ' +
            pluginMethodStr );
          return;
        }
  
        var method = instance[ methodName ];
        if ( !method || methodName.charAt(0) == '_' ) {
          logError( pluginMethodStr + ' is not a valid method' );
          return;
        }
  
        // apply method, get return value
        var value = method.apply( instance, args );
        // set return value if value is returned, use only first value
        returnValue = returnValue === undefined ? value : returnValue;
      });
  
      return returnValue !== undefined ? returnValue : $elems;
    }
  
    function plainCall( $elems, options ) {
      $elems.each( function( i, elem ) {
        var instance = $.data( elem, namespace );
        if ( instance ) {
          // set options & init
          instance.option( options );
          instance._init();
        } else {
          // initialize new instance
          instance = new PluginClass( elem, options );
          $.data( elem, namespace, instance );
        }
      });
    }
  
    updateJQuery( $ );
  
  }
  
  // ----- updateJQuery ----- //
  
  // set $.bridget for v1 backwards compatibility
  function updateJQuery( $ ) {
    if ( !$ || ( $ && $.bridget ) ) {
      return;
    }
    $.bridget = jQueryBridget;
  }
  
  updateJQuery( jQuery || window.jQuery );
  
  // -----  ----- //
  
  return jQueryBridget;
  
  }));
  
  /**
   * EvEmitter v1.1.0
   * Lil' event emitter
   * MIT License
   */
  
  /* jshint unused: true, undef: true, strict: true */
  
  ( function( global, factory ) {
    // universal module definition
    /* jshint strict: false */ /* globals define, module, window */
    if ( typeof define == 'function' && define.amd ) {
      // AMD - RequireJS
      define( 'ev-emitter/ev-emitter',factory );
    } else if ( typeof module == 'object' && module.exports ) {
      // CommonJS - Browserify, Webpack
      module.exports = factory();
    } else {
      // Browser globals
      global.EvEmitter = factory();
    }
  
  }( typeof window != 'undefined' ? window : this, function() {
  
  
  
  function EvEmitter() {}
  
  var proto = EvEmitter.prototype;
  
  proto.on = function( eventName, listener ) {
    if ( !eventName || !listener ) {
      return;
    }
    // set events hash
    var events = this._events = this._events || {};
    // set listeners array
    var listeners = events[ eventName ] = events[ eventName ] || [];
    // only add once
    if ( listeners.indexOf( listener ) == -1 ) {
      listeners.push( listener );
    }
  
    return this;
  };
  
  proto.once = function( eventName, listener ) {
    if ( !eventName || !listener ) {
      return;
    }
    // add event
    this.on( eventName, listener );
    // set once flag
    // set onceEvents hash
    var onceEvents = this._onceEvents = this._onceEvents || {};
    // set onceListeners object
    var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
    // set flag
    onceListeners[ listener ] = true;
  
    return this;
  };
  
  proto.off = function( eventName, listener ) {
    var listeners = this._events && this._events[ eventName ];
    if ( !listeners || !listeners.length ) {
      return;
    }
    var index = listeners.indexOf( listener );
    if ( index != -1 ) {
      listeners.splice( index, 1 );
    }
  
    return this;
  };
  
  proto.emitEvent = function( eventName, args ) {
    var listeners = this._events && this._events[ eventName ];
    if ( !listeners || !listeners.length ) {
      return;
    }
    // copy over to avoid interference if .off() in listener
    listeners = listeners.slice(0);
    args = args || [];
    // once stuff
    var onceListeners = this._onceEvents && this._onceEvents[ eventName ];
  
    for ( var i=0; i < listeners.length; i++ ) {
      var listener = listeners[i]
      var isOnce = onceListeners && onceListeners[ listener ];
      if ( isOnce ) {
        // remove listener
        // remove before trigger to prevent recursion
        this.off( eventName, listener );
        // unset once flag
        delete onceListeners[ listener ];
      }
      // trigger listener
      listener.apply( this, args );
    }
  
    return this;
  };
  
  proto.allOff = function() {
    delete this._events;
    delete this._onceEvents;
  };
  
  return EvEmitter;
  
  }));
  
  /*!
   * getSize v2.0.3
   * measure size of elements
   * MIT license
   */
  
  /* jshint browser: true, strict: true, undef: true, unused: true */
  /* globals console: false */
  
  ( function( window, factory ) {
    /* jshint strict: false */ /* globals define, module */
    if ( typeof define == 'function' && define.amd ) {
      // AMD
      define( 'get-size/get-size',factory );
    } else if ( typeof module == 'object' && module.exports ) {
      // CommonJS
      module.exports = factory();
    } else {
      // browser global
      window.getSize = factory();
    }
  
  })( window, function factory() {
  'use strict';
  
  // -------------------------- helpers -------------------------- //
  
  // get a number from a string, not a percentage
  function getStyleSize( value ) {
    var num = parseFloat( value );
    // not a percent like '100%', and a number
    var isValid = value.indexOf('%') == -1 && !isNaN( num );
    return isValid && num;
  }
  
  function noop() {}
  
  var logError = typeof console == 'undefined' ? noop :
    function( message ) {
      console.error( message );
    };
  
  // -------------------------- measurements -------------------------- //
  
  var measurements = [
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginBottom',
    'borderLeftWidth',
    'borderRightWidth',
    'borderTopWidth',
    'borderBottomWidth'
  ];
  
  var measurementsLength = measurements.length;
  
  function getZeroSize() {
    var size = {
      width: 0,
      height: 0,
      innerWidth: 0,
      innerHeight: 0,
      outerWidth: 0,
      outerHeight: 0
    };
    for ( var i=0; i < measurementsLength; i++ ) {
      var measurement = measurements[i];
      size[ measurement ] = 0;
    }
    return size;
  }
  
  // -------------------------- getStyle -------------------------- //
  
  /**
   * getStyle, get style of element, check for Firefox bug
   * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
   */
  function getStyle( elem ) {
    var style = getComputedStyle( elem );
    if ( !style ) {
      logError( 'Style returned ' + style +
        '. Are you running this code in a hidden iframe on Firefox? ' +
        'See https://bit.ly/getsizebug1' );
    }
    return style;
  }
  
  // -------------------------- setup -------------------------- //
  
  var isSetup = false;
  
  var isBoxSizeOuter;
  
  /**
   * setup
   * check isBoxSizerOuter
   * do on first getSize() rather than on page load for Firefox bug
   */
  function setup() {
    // setup once
    if ( isSetup ) {
      return;
    }
    isSetup = true;
  
    // -------------------------- box sizing -------------------------- //
  
    /**
     * Chrome & Safari measure the outer-width on style.width on border-box elems
     * IE11 & Firefox<29 measures the inner-width
     */
    var div = document.createElement('div');
    div.style.width = '200px';
    div.style.padding = '1px 2px 3px 4px';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px 2px 3px 4px';
    div.style.boxSizing = 'border-box';
  
    var body = document.body || document.documentElement;
    body.appendChild( div );
    var style = getStyle( div );
    // round value for browser zoom. desandro/masonry#928
    isBoxSizeOuter = Math.round( getStyleSize( style.width ) ) == 200;
    getSize.isBoxSizeOuter = isBoxSizeOuter;
  
    body.removeChild( div );
  }
  
  // -------------------------- getSize -------------------------- //
  
  function getSize( elem ) {
    setup();
  
    // use querySeletor if elem is string
    if ( typeof elem == 'string' ) {
      elem = document.querySelector( elem );
    }
  
    // do not proceed on non-objects
    if ( !elem || typeof elem != 'object' || !elem.nodeType ) {
      return;
    }
  
    var style = getStyle( elem );
  
    // if hidden, everything is 0
    if ( style.display == 'none' ) {
      return getZeroSize();
    }
  
    var size = {};
    size.width = elem.offsetWidth;
    size.height = elem.offsetHeight;
  
    var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';
  
    // get all measurements
    for ( var i=0; i < measurementsLength; i++ ) {
      var measurement = measurements[i];
      var value = style[ measurement ];
      var num = parseFloat( value );
      // any 'auto', 'medium' value will be 0
      size[ measurement ] = !isNaN( num ) ? num : 0;
    }
  
    var paddingWidth = size.paddingLeft + size.paddingRight;
    var paddingHeight = size.paddingTop + size.paddingBottom;
    var marginWidth = size.marginLeft + size.marginRight;
    var marginHeight = size.marginTop + size.marginBottom;
    var borderWidth = size.borderLeftWidth + size.borderRightWidth;
    var borderHeight = size.borderTopWidth + size.borderBottomWidth;
  
    var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;
  
    // overwrite width and height if we can get it from style
    var styleWidth = getStyleSize( style.width );
    if ( styleWidth !== false ) {
      size.width = styleWidth +
        // add padding and border unless it's already including it
        ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
    }
  
    var styleHeight = getStyleSize( style.height );
    if ( styleHeight !== false ) {
      size.height = styleHeight +
        // add padding and border unless it's already including it
        ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
    }
  
    size.innerWidth = size.width - ( paddingWidth + borderWidth );
    size.innerHeight = size.height - ( paddingHeight + borderHeight );
  
    size.outerWidth = size.width + marginWidth;
    size.outerHeight = size.height + marginHeight;
  
    return size;
  }
  
  return getSize;
  
  });
  
  /**
   * matchesSelector v2.0.2
   * matchesSelector( element, '.selector' )
   * MIT license
   */
  
  /*jshint browser: true, strict: true, undef: true, unused: true */
  
  ( function( window, factory ) {
    /*global define: false, module: false */
    'use strict';
    // universal module definition
    if ( typeof define == 'function' && define.amd ) {
      // AMD
      define( 'desandro-matches-selector/matches-selector',factory );
    } else if ( typeof module == 'object' && module.exports ) {
      // CommonJS
      module.exports = factory();
    } else {
      // browser global
      window.matchesSelector = factory();
    }
  
  }( window, function factory() {
    'use strict';
  
    var matchesMethod = ( function() {
      var ElemProto = window.Element.prototype;
      // check for the standard method name first
      if ( ElemProto.matches ) {
        return 'matches';
      }
      // check un-prefixed
      if ( ElemProto.matchesSelector ) {
        return 'matchesSelector';
      }
      // check vendor prefixes
      var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];
  
      for ( var i=0; i < prefixes.length; i++ ) {
        var prefix = prefixes[i];
        var method = prefix + 'MatchesSelector';
        if ( ElemProto[ method ] ) {
          return method;
        }
      }
    })();
  
    return function matchesSelector( elem, selector ) {
      return elem[ matchesMethod ]( selector );
    };
  
  }));
  
  /**
   * Fizzy UI utils v2.0.7
   * MIT license
   */
  
  /*jshint browser: true, undef: true, unused: true, strict: true */
  
  ( function( window, factory ) {
    // universal module definition
    /*jshint strict: false */ /*globals define, module, require */
  
    if ( typeof define == 'function' && define.amd ) {
      // AMD
      define( 'fizzy-ui-utils/utils',[
        'desandro-matches-selector/matches-selector'
      ], function( matchesSelector ) {
        return factory( window, matchesSelector );
      });
    } else if ( typeof module == 'object' && module.exports ) {
      // CommonJS
      module.exports = factory(
        window,
        require('desandro-matches-selector')
      );
    } else {
      // browser global
      window.fizzyUIUtils = factory(
        window,
        window.matchesSelector
      );
    }
  
  }( window, function factory( window, matchesSelector ) {
  
  
  
  var utils = {};
  
  // ----- extend ----- //
  
  // extends objects
  utils.extend = function( a, b ) {
    for ( var prop in b ) {
      a[ prop ] = b[ prop ];
    }
    return a;
  };
  
  // ----- modulo ----- //
  
  utils.modulo = function( num, div ) {
    return ( ( num % div ) + div ) % div;
  };
  
  // ----- makeArray ----- //
  
  var arraySlice = Array.prototype.slice;
  
  // turn element or nodeList into an array
  utils.makeArray = function( obj ) {
    if ( Array.isArray( obj ) ) {
      // use object if already an array
      return obj;
    }
    // return empty array if undefined or null. #6
    if ( obj === null || obj === undefined ) {
      return [];
    }
  
    var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
    if ( isArrayLike ) {
      // convert nodeList to array
      return arraySlice.call( obj );
    }
  
    // array of single index
    return [ obj ];
  };
  
  // ----- removeFrom ----- //
  
  utils.removeFrom = function( ary, obj ) {
    var index = ary.indexOf( obj );
    if ( index != -1 ) {
      ary.splice( index, 1 );
    }
  };
  
  // ----- getParent ----- //
  
  utils.getParent = function( elem, selector ) {
    while ( elem.parentNode && elem != document.body ) {
      elem = elem.parentNode;
      if ( matchesSelector( elem, selector ) ) {
        return elem;
      }
    }
  };
  
  // ----- getQueryElement ----- //
  
  // use element as selector string
  utils.getQueryElement = function( elem ) {
    if ( typeof elem == 'string' ) {
      return document.querySelector( elem );
    }
    return elem;
  };
  
  // ----- handleEvent ----- //
  
  // enable .ontype to trigger from .addEventListener( elem, 'type' )
  utils.handleEvent = function( event ) {
    var method = 'on' + event.type;
    if ( this[ method ] ) {
      this[ method ]( event );
    }
  };
  
  // ----- filterFindElements ----- //
  
  utils.filterFindElements = function( elems, selector ) {
    // make array of elems
    elems = utils.makeArray( elems );
    var ffElems = [];
  
    elems.forEach( function( elem ) {
      // check that elem is an actual element
      if ( !( elem instanceof HTMLElement ) ) {
        return;
      }
      // add elem if no selector
      if ( !selector ) {
        ffElems.push( elem );
        return;
      }
      // filter & find items if we have a selector
      // filter
      if ( matchesSelector( elem, selector ) ) {
        ffElems.push( elem );
      }
      // find children
      var childElems = elem.querySelectorAll( selector );
      // concat childElems to filterFound array
      for ( var i=0; i < childElems.length; i++ ) {
        ffElems.push( childElems[i] );
      }
    });
  
    return ffElems;
  };
  
  // ----- debounceMethod ----- //
  
  utils.debounceMethod = function( _class, methodName, threshold ) {
    threshold = threshold || 100;
    // original method
    var method = _class.prototype[ methodName ];
    var timeoutName = methodName + 'Timeout';
  
    _class.prototype[ methodName ] = function() {
      var timeout = this[ timeoutName ];
      clearTimeout( timeout );
  
      var args = arguments;
      var _this = this;
      this[ timeoutName ] = setTimeout( function() {
        method.apply( _this, args );
        delete _this[ timeoutName ];
      }, threshold );
    };
  };
  
  // ----- docReady ----- //
  
  utils.docReady = function( callback ) {
    var readyState = document.readyState;
    if ( readyState == 'complete' || readyState == 'interactive' ) {
      // do async to allow for other scripts to run. metafizzy/flickity#441
      setTimeout( callback );
    } else {
      document.addEventListener( 'DOMContentLoaded', callback );
    }
  };
  
  // ----- htmlInit ----- //
  
  // http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
  utils.toDashed = function( str ) {
    return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
      return $1 + '-' + $2;
    }).toLowerCase();
  };
  
  var console = window.console;
  /**
   * allow user to initialize classes via [data-namespace] or .js-namespace class
   * htmlInit( Widget, 'widgetName' )
   * options are parsed from data-namespace-options
   */
  utils.htmlInit = function( WidgetClass, namespace ) {
    utils.docReady( function() {
      var dashedNamespace = utils.toDashed( namespace );
      var dataAttr = 'data-' + dashedNamespace;
      var dataAttrElems = document.querySelectorAll( '[' + dataAttr + ']' );
      var jsDashElems = document.querySelectorAll( '.js-' + dashedNamespace );
      var elems = utils.makeArray( dataAttrElems )
        .concat( utils.makeArray( jsDashElems ) );
      var dataOptionsAttr = dataAttr + '-options';
      var jQuery = window.jQuery;
  
      elems.forEach( function( elem ) {
        var attr = elem.getAttribute( dataAttr ) ||
          elem.getAttribute( dataOptionsAttr );
        var options;
        try {
          options = attr && JSON.parse( attr );
        } catch ( error ) {
          // log error, do not initialize
          if ( console ) {
            console.error( 'Error parsing ' + dataAttr + ' on ' + elem.className +
            ': ' + error );
          }
          return;
        }
        // initialize
        var instance = new WidgetClass( elem, options );
        // make available via $().data('namespace')
        if ( jQuery ) {
          jQuery.data( elem, namespace, instance );
        }
      });
  
    });
  };
  
  // -----  ----- //
  
  return utils;
  
  }));
  
  /**
   * Outlayer Item
   */
  
  ( function( window, factory ) {
    // universal module definition
    /* jshint strict: false */ /* globals define, module, require */
    if ( typeof define == 'function' && define.amd ) {
      // AMD - RequireJS
      define( 'outlayer/item',[
          'ev-emitter/ev-emitter',
          'get-size/get-size'
        ],
        factory
      );
    } else if ( typeof module == 'object' && module.exports ) {
      // CommonJS - Browserify, Webpack
      module.exports = factory(
        require('ev-emitter'),
        require('get-size')
      );
    } else {
      // browser global
      window.Outlayer = {};
      window.Outlayer.Item = factory(
        window.EvEmitter,
        window.getSize
      );
    }
  
  }( window, function factory( EvEmitter, getSize ) {
  'use strict';
  
  // ----- helpers ----- //
  
  function isEmptyObj( obj ) {
    for ( var prop in obj ) {
      return false;
    }
    prop = null;
    return true;
  }
  
  // -------------------------- CSS3 support -------------------------- //
  
  
  var docElemStyle = document.documentElement.style;
  
  var transitionProperty = typeof docElemStyle.transition == 'string' ?
    'transition' : 'WebkitTransition';
  var transformProperty = typeof docElemStyle.transform == 'string' ?
    'transform' : 'WebkitTransform';
  
  var transitionEndEvent = {
    WebkitTransition: 'webkitTransitionEnd',
    transition: 'transitionend'
  }[ transitionProperty ];
  
  // cache all vendor properties that could have vendor prefix
  var vendorProperties = {
    transform: transformProperty,
    transition: transitionProperty,
    transitionDuration: transitionProperty + 'Duration',
    transitionProperty: transitionProperty + 'Property',
    transitionDelay: transitionProperty + 'Delay'
  };
  
  // -------------------------- Item -------------------------- //
  
  function Item( element, layout ) {
    if ( !element ) {
      return;
    }
  
    this.element = element;
    // parent layout class, i.e. Masonry, Isotope, or Packery
    this.layout = layout;
    this.position = {
      x: 0,
      y: 0
    };
  
    this._create();
  }
  
  // inherit EvEmitter
  var proto = Item.prototype = Object.create( EvEmitter.prototype );
  proto.constructor = Item;
  
  proto._create = function() {
    // transition objects
    this._transn = {
      ingProperties: {},
      clean: {},
      onEnd: {}
    };
  
    this.css({
      position: 'absolute'
    });
  };
  
  // trigger specified handler for event type
  proto.handleEvent = function( event ) {
    var method = 'on' + event.type;
    if ( this[ method ] ) {
      this[ method ]( event );
    }
  };
  
  proto.getSize = function() {
    this.size = getSize( this.element );
  };
  
  /**
   * apply CSS styles to element
   * @param {Object} style
   */
  proto.css = function( style ) {
    var elemStyle = this.element.style;
  
    for ( var prop in style ) {
      // use vendor property if available
      var supportedProp = vendorProperties[ prop ] || prop;
      elemStyle[ supportedProp ] = style[ prop ];
    }
  };
  
   // measure position, and sets it
  proto.getPosition = function() {
    var style = getComputedStyle( this.element );
    var isOriginLeft = this.layout._getOption('originLeft');
    var isOriginTop = this.layout._getOption('originTop');
    var xValue = style[ isOriginLeft ? 'left' : 'right' ];
    var yValue = style[ isOriginTop ? 'top' : 'bottom' ];
    var x = parseFloat( xValue );
    var y = parseFloat( yValue );
    // convert percent to pixels
    var layoutSize = this.layout.size;
    if ( xValue.indexOf('%') != -1 ) {
      x = ( x / 100 ) * layoutSize.width;
    }
    if ( yValue.indexOf('%') != -1 ) {
      y = ( y / 100 ) * layoutSize.height;
    }
    // clean up 'auto' or other non-integer values
    x = isNaN( x ) ? 0 : x;
    y = isNaN( y ) ? 0 : y;
    // remove padding from measurement
    x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
    y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;
  
    this.position.x = x;
    this.position.y = y;
  };
  
  // set settled position, apply padding
  proto.layoutPosition = function() {
    var layoutSize = this.layout.size;
    var style = {};
    var isOriginLeft = this.layout._getOption('originLeft');
    var isOriginTop = this.layout._getOption('originTop');
  
    // x
    var xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight';
    var xProperty = isOriginLeft ? 'left' : 'right';
    var xResetProperty = isOriginLeft ? 'right' : 'left';
  
    var x = this.position.x + layoutSize[ xPadding ];
    // set in percentage or pixels
    style[ xProperty ] = this.getXValue( x );
    // reset other property
    style[ xResetProperty ] = '';
  
    // y
    var yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom';
    var yProperty = isOriginTop ? 'top' : 'bottom';
    var yResetProperty = isOriginTop ? 'bottom' : 'top';
  
    var y = this.position.y + layoutSize[ yPadding ];
    // set in percentage or pixels
    style[ yProperty ] = this.getYValue( y );
    // reset other property
    style[ yResetProperty ] = '';
  
    this.css( style );
    this.emitEvent( 'layout', [ this ] );
  };
  
  proto.getXValue = function( x ) {
    var isHorizontal = this.layout._getOption('horizontal');
    return this.layout.options.percentPosition && !isHorizontal ?
      ( ( x / this.layout.size.width ) * 100 ) + '%' : x + 'px';
  };
  
  proto.getYValue = function( y ) {
    var isHorizontal = this.layout._getOption('horizontal');
    return this.layout.options.percentPosition && isHorizontal ?
      ( ( y / this.layout.size.height ) * 100 ) + '%' : y + 'px';
  };
  
  proto._transitionTo = function( x, y ) {
    this.getPosition();
    // get current x & y from top/left
    var curX = this.position.x;
    var curY = this.position.y;
  
    var didNotMove = x == this.position.x && y == this.position.y;
  
    // save end position
    this.setPosition( x, y );
  
    // if did not move and not transitioning, just go to layout
    if ( didNotMove && !this.isTransitioning ) {
      this.layoutPosition();
      return;
    }
  
    var transX = x - curX;
    var transY = y - curY;
    var transitionStyle = {};
    transitionStyle.transform = this.getTranslate( transX, transY );
  
    this.transition({
      to: transitionStyle,
      onTransitionEnd: {
        transform: this.layoutPosition
      },
      isCleaning: true
    });
  };
  
  proto.getTranslate = function( x, y ) {
    // flip cooridinates if origin on right or bottom
    var isOriginLeft = this.layout._getOption('originLeft');
    var isOriginTop = this.layout._getOption('originTop');
    x = isOriginLeft ? x : -x;
    y = isOriginTop ? y : -y;
    return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
  };
  
  // non transition + transform support
  proto.goTo = function( x, y ) {
    this.setPosition( x, y );
    this.layoutPosition();
  };
  
  proto.moveTo = proto._transitionTo;
  
  proto.setPosition = function( x, y ) {
    this.position.x = parseFloat( x );
    this.position.y = parseFloat( y );
  };
  
  // ----- transition ----- //
  
  /**
   * @param {Object} style - CSS
   * @param {Function} onTransitionEnd
   */
  
  // non transition, just trigger callback
  proto._nonTransition = function( args ) {
    this.css( args.to );
    if ( args.isCleaning ) {
      this._removeStyles( args.to );
    }
    for ( var prop in args.onTransitionEnd ) {
      args.onTransitionEnd[ prop ].call( this );
    }
  };
  
  /**
   * proper transition
   * @param {Object} args - arguments
   *   @param {Object} to - style to transition to
   *   @param {Object} from - style to start transition from
   *   @param {Boolean} isCleaning - removes transition styles after transition
   *   @param {Function} onTransitionEnd - callback
   */
  proto.transition = function( args ) {
    // redirect to nonTransition if no transition duration
    if ( !parseFloat( this.layout.options.transitionDuration ) ) {
      this._nonTransition( args );
      return;
    }
  
    var _transition = this._transn;
    // keep track of onTransitionEnd callback by css property
    for ( var prop in args.onTransitionEnd ) {
      _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
    }
    // keep track of properties that are transitioning
    for ( prop in args.to ) {
      _transition.ingProperties[ prop ] = true;
      // keep track of properties to clean up when transition is done
      if ( args.isCleaning ) {
        _transition.clean[ prop ] = true;
      }
    }
  
    // set from styles
    if ( args.from ) {
      this.css( args.from );
      // force redraw. http://blog.alexmaccaw.com/css-transitions
      var h = this.element.offsetHeight;
      // hack for JSHint to hush about unused var
      h = null;
    }
    // enable transition
    this.enableTransition( args.to );
    // set styles that are transitioning
    this.css( args.to );
  
    this.isTransitioning = true;
  
  };
  
  // dash before all cap letters, including first for
  // WebkitTransform => -webkit-transform
  function toDashedAll( str ) {
    return str.replace( /([A-Z])/g, function( $1 ) {
      return '-' + $1.toLowerCase();
    });
  }
  
  var transitionProps = 'opacity,' + toDashedAll( transformProperty );
  
  proto.enableTransition = function(/* style */) {
    // HACK changing transitionProperty during a transition
    // will cause transition to jump
    if ( this.isTransitioning ) {
      return;
    }
  
    // make `transition: foo, bar, baz` from style object
    // HACK un-comment this when enableTransition can work
    // while a transition is happening
    // var transitionValues = [];
    // for ( var prop in style ) {
    //   // dash-ify camelCased properties like WebkitTransition
    //   prop = vendorProperties[ prop ] || prop;
    //   transitionValues.push( toDashedAll( prop ) );
    // }
    // munge number to millisecond, to match stagger
    var duration = this.layout.options.transitionDuration;
    duration = typeof duration == 'number' ? duration + 'ms' : duration;
    // enable transition styles
    this.css({
      transitionProperty: transitionProps,
      transitionDuration: duration,
      transitionDelay: this.staggerDelay || 0
    });
    // listen for transition end event
    this.element.addEventListener( transitionEndEvent, this, false );
  };
  
  // ----- events ----- //
  
  proto.onwebkitTransitionEnd = function( event ) {
    this.ontransitionend( event );
  };
  
  proto.onotransitionend = function( event ) {
    this.ontransitionend( event );
  };
  
  // properties that I munge to make my life easier
  var dashedVendorProperties = {
    '-webkit-transform': 'transform'
  };
  
  proto.ontransitionend = function( event ) {
    // disregard bubbled events from children
    if ( event.target !== this.element ) {
      return;
    }
    var _transition = this._transn;
    // get property name of transitioned property, convert to prefix-free
    var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;
  
    // remove property that has completed transitioning
    delete _transition.ingProperties[ propertyName ];
    // check if any properties are still transitioning
    if ( isEmptyObj( _transition.ingProperties ) ) {
      // all properties have completed transitioning
      this.disableTransition();
    }
    // clean style
    if ( propertyName in _transition.clean ) {
      // clean up style
      this.element.style[ event.propertyName ] = '';
      delete _transition.clean[ propertyName ];
    }
    // trigger onTransitionEnd callback
    if ( propertyName in _transition.onEnd ) {
      var onTransitionEnd = _transition.onEnd[ propertyName ];
      onTransitionEnd.call( this );
      delete _transition.onEnd[ propertyName ];
    }
  
    this.emitEvent( 'transitionEnd', [ this ] );
  };
  
  proto.disableTransition = function() {
    this.removeTransitionStyles();
    this.element.removeEventListener( transitionEndEvent, this, false );
    this.isTransitioning = false;
  };
  
  /**
   * removes style property from element
   * @param {Object} style
  **/
  proto._removeStyles = function( style ) {
    // clean up transition styles
    var cleanStyle = {};
    for ( var prop in style ) {
      cleanStyle[ prop ] = '';
    }
    this.css( cleanStyle );
  };
  
  var cleanTransitionStyle = {
    transitionProperty: '',
    transitionDuration: '',
    transitionDelay: ''
  };
  
  proto.removeTransitionStyles = function() {
    // remove transition
    this.css( cleanTransitionStyle );
  };
  
  // ----- stagger ----- //
  
  proto.stagger = function( delay ) {
    delay = isNaN( delay ) ? 0 : delay;
    this.staggerDelay = delay + 'ms';
  };
  
  // ----- show/hide/remove ----- //
  
  // remove element from DOM
  proto.removeElem = function() {
    this.element.parentNode.removeChild( this.element );
    // remove display: none
    this.css({ display: '' });
    this.emitEvent( 'remove', [ this ] );
  };
  
  proto.remove = function() {
    // just remove element if no transition support or no transition
    if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
      this.removeElem();
      return;
    }
  
    // start transition
    this.once( 'transitionEnd', function() {
      this.removeElem();
    });
    this.hide();
  };
  
  proto.reveal = function() {
    delete this.isHidden;
    // remove display: none
    this.css({ display: '' });
  
    var options = this.layout.options;
  
    var onTransitionEnd = {};
    var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
    onTransitionEnd[ transitionEndProperty ] = this.onRevealTransitionEnd;
  
    this.transition({
      from: options.hiddenStyle,
      to: options.visibleStyle,
      isCleaning: true,
      onTransitionEnd: onTransitionEnd
    });
  };
  
  proto.onRevealTransitionEnd = function() {
    // check if still visible
    // during transition, item may have been hidden
    if ( !this.isHidden ) {
      this.emitEvent('reveal');
    }
  };
  
  /**
   * get style property use for hide/reveal transition end
   * @param {String} styleProperty - hiddenStyle/visibleStyle
   * @returns {String}
   */
  proto.getHideRevealTransitionEndProperty = function( styleProperty ) {
    var optionStyle = this.layout.options[ styleProperty ];
    // use opacity
    if ( optionStyle.opacity ) {
      return 'opacity';
    }
    // get first property
    for ( var prop in optionStyle ) {
      return prop;
    }
  };
  
  proto.hide = function() {
    // set flag
    this.isHidden = true;
    // remove display: none
    this.css({ display: '' });
  
    var options = this.layout.options;
  
    var onTransitionEnd = {};
    var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
    onTransitionEnd[ transitionEndProperty ] = this.onHideTransitionEnd;
  
    this.transition({
      from: options.visibleStyle,
      to: options.hiddenStyle,
      // keep hidden stuff hidden
      isCleaning: true,
      onTransitionEnd: onTransitionEnd
    });
  };
  
  proto.onHideTransitionEnd = function() {
    // check if still hidden
    // during transition, item may have been un-hidden
    if ( this.isHidden ) {
      this.css({ display: 'none' });
      this.emitEvent('hide');
    }
  };
  
  proto.destroy = function() {
    this.css({
      position: '',
      left: '',
      right: '',
      top: '',
      bottom: '',
      transition: '',
      transform: ''
    });
  };
  
  return Item;
  
  }));
  
  /*!
   * Outlayer v2.1.1
   * the brains and guts of a layout library
   * MIT license
   */
  
  ( function( window, factory ) {
    'use strict';
    // universal module definition
    /* jshint strict: false */ /* globals define, module, require */
    if ( typeof define == 'function' && define.amd ) {
      // AMD - RequireJS
      define( 'outlayer/outlayer',[
          'ev-emitter/ev-emitter',
          'get-size/get-size',
          'fizzy-ui-utils/utils',
          './item'
        ],
        function( EvEmitter, getSize, utils, Item ) {
          return factory( window, EvEmitter, getSize, utils, Item);
        }
      );
    } else if ( typeof module == 'object' && module.exports ) {
      // CommonJS - Browserify, Webpack
      module.exports = factory(
        window,
        require('ev-emitter'),
        require('get-size'),
        require('fizzy-ui-utils'),
        require('./item')
      );
    } else {
      // browser global
      window.Outlayer = factory(
        window,
        window.EvEmitter,
        window.getSize,
        window.fizzyUIUtils,
        window.Outlayer.Item
      );
    }
  
  }( window, function factory( window, EvEmitter, getSize, utils, Item ) {
  'use strict';
  
  // ----- vars ----- //
  
  var console = window.console;
  var jQuery = window.jQuery;
  var noop = function() {};
  
  // -------------------------- Outlayer -------------------------- //
  
  // globally unique identifiers
  var GUID = 0;
  // internal store of all Outlayer intances
  var instances = {};
  
  
  /**
   * @param {Element, String} element
   * @param {Object} options
   * @constructor
   */
  function Outlayer( element, options ) {
    var queryElement = utils.getQueryElement( element );
    if ( !queryElement ) {
      if ( console ) {
        console.error( 'Bad element for ' + this.constructor.namespace +
          ': ' + ( queryElement || element ) );
      }
      return;
    }
    this.element = queryElement;
    // add jQuery
    if ( jQuery ) {
      this.$element = jQuery( this.element );
    }
  
    // options
    this.options = utils.extend( {}, this.constructor.defaults );
    this.option( options );
  
    // add id for Outlayer.getFromElement
    var id = ++GUID;
    this.element.outlayerGUID = id; // expando
    instances[ id ] = this; // associate via id
  
    // kick it off
    this._create();
  
    var isInitLayout = this._getOption('initLayout');
    if ( isInitLayout ) {
      this.layout();
    }
  }
  
  // settings are for internal use only
  Outlayer.namespace = 'outlayer';
  Outlayer.Item = Item;
  
  // default options
  Outlayer.defaults = {
    containerStyle: {
      position: 'relative'
    },
    initLayout: true,
    originLeft: true,
    originTop: true,
    resize: true,
    resizeContainer: true,
    // item options
    transitionDuration: '0.4s',
    hiddenStyle: {
      opacity: 0,
      transform: 'scale(0.001)'
    },
    visibleStyle: {
      opacity: 1,
      transform: 'scale(1)'
    }
  };
  
  var proto = Outlayer.prototype;
  // inherit EvEmitter
  utils.extend( proto, EvEmitter.prototype );
  
  /**
   * set options
   * @param {Object} opts
   */
  proto.option = function( opts ) {
    utils.extend( this.options, opts );
  };
  
  /**
   * get backwards compatible option value, check old name
   */
  proto._getOption = function( option ) {
    var oldOption = this.constructor.compatOptions[ option ];
    return oldOption && this.options[ oldOption ] !== undefined ?
      this.options[ oldOption ] : this.options[ option ];
  };
  
  Outlayer.compatOptions = {
    // currentName: oldName
    initLayout: 'isInitLayout',
    horizontal: 'isHorizontal',
    layoutInstant: 'isLayoutInstant',
    originLeft: 'isOriginLeft',
    originTop: 'isOriginTop',
    resize: 'isResizeBound',
    resizeContainer: 'isResizingContainer'
  };
  
  proto._create = function() {
    // get items from children
    this.reloadItems();
    // elements that affect layout, but are not laid out
    this.stamps = [];
    this.stamp( this.options.stamp );
    // set container style
    utils.extend( this.element.style, this.options.containerStyle );
  
    // bind resize method
    var canBindResize = this._getOption('resize');
    if ( canBindResize ) {
      this.bindResize();
    }
  };
  
  // goes through all children again and gets bricks in proper order
  proto.reloadItems = function() {
    // collection of item elements
    this.items = this._itemize( this.element.children );
  };
  
  
  /**
   * turn elements into Outlayer.Items to be used in layout
   * @param {Array or NodeList or HTMLElement} elems
   * @returns {Array} items - collection of new Outlayer Items
   */
  proto._itemize = function( elems ) {
  
    var itemElems = this._filterFindItemElements( elems );
    var Item = this.constructor.Item;
  
    // create new Outlayer Items for collection
    var items = [];
    for ( var i=0; i < itemElems.length; i++ ) {
      var elem = itemElems[i];
      var item = new Item( elem, this );
      items.push( item );
    }
  
    return items;
  };
  
  /**
   * get item elements to be used in layout
   * @param {Array or NodeList or HTMLElement} elems
   * @returns {Array} items - item elements
   */
  proto._filterFindItemElements = function( elems ) {
    return utils.filterFindElements( elems, this.options.itemSelector );
  };
  
  /**
   * getter method for getting item elements
   * @returns {Array} elems - collection of item elements
   */
  proto.getItemElements = function() {
    return this.items.map( function( item ) {
      return item.element;
    });
  };
  
  // ----- init & layout ----- //
  
  /**
   * lays out all items
   */
  proto.layout = function() {
    this._resetLayout();
    this._manageStamps();
  
    // don't animate first layout
    var layoutInstant = this._getOption('layoutInstant');
    var isInstant = layoutInstant !== undefined ?
      layoutInstant : !this._isLayoutInited;
    this.layoutItems( this.items, isInstant );
  
    // flag for initalized
    this._isLayoutInited = true;
  };
  
  // _init is alias for layout
  proto._init = proto.layout;
  
  /**
   * logic before any new layout
   */
  proto._resetLayout = function() {
    this.getSize();
  };
  
  
  proto.getSize = function() {
    this.size = getSize( this.element );
  };
  
  /**
   * get measurement from option, for columnWidth, rowHeight, gutter
   * if option is String -> get element from selector string, & get size of element
   * if option is Element -> get size of element
   * else use option as a number
   *
   * @param {String} measurement
   * @param {String} size - width or height
   * @private
   */
  proto._getMeasurement = function( measurement, size ) {
    var option = this.options[ measurement ];
    var elem;
    if ( !option ) {
      // default to 0
      this[ measurement ] = 0;
    } else {
      // use option as an element
      if ( typeof option == 'string' ) {
        elem = this.element.querySelector( option );
      } else if ( option instanceof HTMLElement ) {
        elem = option;
      }
      // use size of element, if element
      this[ measurement ] = elem ? getSize( elem )[ size ] : option;
    }
  };
  
  /**
   * layout a collection of item elements
   * @api public
   */
  proto.layoutItems = function( items, isInstant ) {
    items = this._getItemsForLayout( items );
  
    this._layoutItems( items, isInstant );
  
    this._postLayout();
  };
  
  /**
   * get the items to be laid out
   * you may want to skip over some items
   * @param {Array} items
   * @returns {Array} items
   */
  proto._getItemsForLayout = function( items ) {
    return items.filter( function( item ) {
      return !item.isIgnored;
    });
  };
  
  /**
   * layout items
   * @param {Array} items
   * @param {Boolean} isInstant
   */
  proto._layoutItems = function( items, isInstant ) {
    this._emitCompleteOnItems( 'layout', items );
  
    if ( !items || !items.length ) {
      // no items, emit event with empty array
      return;
    }
  
    var queue = [];
  
    items.forEach( function( item ) {
      // get x/y object from method
      var position = this._getItemLayoutPosition( item );
      // enqueue
      position.item = item;
      position.isInstant = isInstant || item.isLayoutInstant;
      queue.push( position );
    }, this );
  
    this._processLayoutQueue( queue );
  };
  
  /**
   * get item layout position
   * @param {Outlayer.Item} item
   * @returns {Object} x and y position
   */
  proto._getItemLayoutPosition = function( /* item */ ) {
    return {
      x: 0,
      y: 0
    };
  };
  
  /**
   * iterate over array and position each item
   * Reason being - separating this logic prevents 'layout invalidation'
   * thx @paul_irish
   * @param {Array} queue
   */
  proto._processLayoutQueue = function( queue ) {
    this.updateStagger();
    queue.forEach( function( obj, i ) {
      this._positionItem( obj.item, obj.x, obj.y, obj.isInstant, i );
    }, this );
  };
  
  // set stagger from option in milliseconds number
  proto.updateStagger = function() {
    var stagger = this.options.stagger;
    if ( stagger === null || stagger === undefined ) {
      this.stagger = 0;
      return;
    }
    this.stagger = getMilliseconds( stagger );
    return this.stagger;
  };
  
  /**
   * Sets position of item in DOM
   * @param {Outlayer.Item} item
   * @param {Number} x - horizontal position
   * @param {Number} y - vertical position
   * @param {Boolean} isInstant - disables transitions
   */
  proto._positionItem = function( item, x, y, isInstant, i ) {
    if ( isInstant ) {
      // if not transition, just set CSS
      item.goTo( x, y );
    } else {
      item.stagger( i * this.stagger );
      item.moveTo( x, y );
    }
  };
  
  /**
   * Any logic you want to do after each layout,
   * i.e. size the container
   */
  proto._postLayout = function() {
    this.resizeContainer();
  };
  
  proto.resizeContainer = function() {
    var isResizingContainer = this._getOption('resizeContainer');
    if ( !isResizingContainer ) {
      return;
    }
    var size = this._getContainerSize();
    if ( size ) {
      this._setContainerMeasure( size.width, true );
      this._setContainerMeasure( size.height, false );
    }
  };
  
  /**
   * Sets width or height of container if returned
   * @returns {Object} size
   *   @param {Number} width
   *   @param {Number} height
   */
  proto._getContainerSize = noop;
  
  /**
   * @param {Number} measure - size of width or height
   * @param {Boolean} isWidth
   */
  proto._setContainerMeasure = function( measure, isWidth ) {
    if ( measure === undefined ) {
      return;
    }
  
    var elemSize = this.size;
    // add padding and border width if border box
    if ( elemSize.isBorderBox ) {
      measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
        elemSize.borderLeftWidth + elemSize.borderRightWidth :
        elemSize.paddingBottom + elemSize.paddingTop +
        elemSize.borderTopWidth + elemSize.borderBottomWidth;
    }
  
    measure = Math.max( measure, 0 );
    this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
  };
  
  /**
   * emit eventComplete on a collection of items events
   * @param {String} eventName
   * @param {Array} items - Outlayer.Items
   */
  proto._emitCompleteOnItems = function( eventName, items ) {
    var _this = this;
    function onComplete() {
      _this.dispatchEvent( eventName + 'Complete', null, [ items ] );
    }
  
    var count = items.length;
    if ( !items || !count ) {
      onComplete();
      return;
    }
  
    var doneCount = 0;
    function tick() {
      doneCount++;
      if ( doneCount == count ) {
        onComplete();
      }
    }
  
    // bind callback
    items.forEach( function( item ) {
      item.once( eventName, tick );
    });
  };
  
  /**
   * emits events via EvEmitter and jQuery events
   * @param {String} type - name of event
   * @param {Event} event - original event
   * @param {Array} args - extra arguments
   */
  proto.dispatchEvent = function( type, event, args ) {
    // add original event to arguments
    var emitArgs = event ? [ event ].concat( args ) : args;
    this.emitEvent( type, emitArgs );
  
    if ( jQuery ) {
      // set this.$element
      this.$element = this.$element || jQuery( this.element );
      if ( event ) {
        // create jQuery event
        var $event = jQuery.Event( event );
        $event.type = type;
        this.$element.trigger( $event, args );
      } else {
        // just trigger with type if no event available
        this.$element.trigger( type, args );
      }
    }
  };
  
  // -------------------------- ignore & stamps -------------------------- //
  
  
  /**
   * keep item in collection, but do not lay it out
   * ignored items do not get skipped in layout
   * @param {Element} elem
   */
  proto.ignore = function( elem ) {
    var item = this.getItem( elem );
    if ( item ) {
      item.isIgnored = true;
    }
  };
  
  /**
   * return item to layout collection
   * @param {Element} elem
   */
  proto.unignore = function( elem ) {
    var item = this.getItem( elem );
    if ( item ) {
      delete item.isIgnored;
    }
  };
  
  /**
   * adds elements to stamps
   * @param {NodeList, Array, Element, or String} elems
   */
  proto.stamp = function( elems ) {
    elems = this._find( elems );
    if ( !elems ) {
      return;
    }
  
    this.stamps = this.stamps.concat( elems );
    // ignore
    elems.forEach( this.ignore, this );
  };
  
  /**
   * removes elements to stamps
   * @param {NodeList, Array, or Element} elems
   */
  proto.unstamp = function( elems ) {
    elems = this._find( elems );
    if ( !elems ){
      return;
    }
  
    elems.forEach( function( elem ) {
      // filter out removed stamp elements
      utils.removeFrom( this.stamps, elem );
      this.unignore( elem );
    }, this );
  };
  
  /**
   * finds child elements
   * @param {NodeList, Array, Element, or String} elems
   * @returns {Array} elems
   */
  proto._find = function( elems ) {
    if ( !elems ) {
      return;
    }
    // if string, use argument as selector string
    if ( typeof elems == 'string' ) {
      elems = this.element.querySelectorAll( elems );
    }
    elems = utils.makeArray( elems );
    return elems;
  };
  
  proto._manageStamps = function() {
    if ( !this.stamps || !this.stamps.length ) {
      return;
    }
  
    this._getBoundingRect();
  
    this.stamps.forEach( this._manageStamp, this );
  };
  
  // update boundingLeft / Top
  proto._getBoundingRect = function() {
    // get bounding rect for container element
    var boundingRect = this.element.getBoundingClientRect();
    var size = this.size;
    this._boundingRect = {
      left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
      top: boundingRect.top + size.paddingTop + size.borderTopWidth,
      right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
      bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
    };
  };
  
  /**
   * @param {Element} stamp
  **/
  proto._manageStamp = noop;
  
  /**
   * get x/y position of element relative to container element
   * @param {Element} elem
   * @returns {Object} offset - has left, top, right, bottom
   */
  proto._getElementOffset = function( elem ) {
    var boundingRect = elem.getBoundingClientRect();
    var thisRect = this._boundingRect;
    var size = getSize( elem );
    var offset = {
      left: boundingRect.left - thisRect.left - size.marginLeft,
      top: boundingRect.top - thisRect.top - size.marginTop,
      right: thisRect.right - boundingRect.right - size.marginRight,
      bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
    };
    return offset;
  };
  
  // -------------------------- resize -------------------------- //
  
  // enable event handlers for listeners
  // i.e. resize -> onresize
  proto.handleEvent = utils.handleEvent;
  
  /**
   * Bind layout to window resizing
   */
  proto.bindResize = function() {
    window.addEventListener( 'resize', this );
    this.isResizeBound = true;
  };
  
  /**
   * Unbind layout to window resizing
   */
  proto.unbindResize = function() {
    window.removeEventListener( 'resize', this );
    this.isResizeBound = false;
  };
  
  proto.onresize = function() {
    this.resize();
  };
  
  utils.debounceMethod( Outlayer, 'onresize', 100 );
  
  proto.resize = function() {
    // don't trigger if size did not change
    // or if resize was unbound. See #9
    if ( !this.isResizeBound || !this.needsResizeLayout() ) {
      return;
    }
  
    this.layout();
  };
  
  /**
   * check if layout is needed post layout
   * @returns Boolean
   */
  proto.needsResizeLayout = function() {
    var size = getSize( this.element );
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var hasSizes = this.size && size;
    return hasSizes && size.innerWidth !== this.size.innerWidth;
  };
  
  // -------------------------- methods -------------------------- //
  
  /**
   * add items to Outlayer instance
   * @param {Array or NodeList or Element} elems
   * @returns {Array} items - Outlayer.Items
  **/
  proto.addItems = function( elems ) {
    var items = this._itemize( elems );
    // add items to collection
    if ( items.length ) {
      this.items = this.items.concat( items );
    }
    return items;
  };
  
  /**
   * Layout newly-appended item elements
   * @param {Array or NodeList or Element} elems
   */
  proto.appended = function( elems ) {
    var items = this.addItems( elems );
    if ( !items.length ) {
      return;
    }
    // layout and reveal just the new items
    this.layoutItems( items, true );
    this.reveal( items );
  };
  
  /**
   * Layout prepended elements
   * @param {Array or NodeList or Element} elems
   */
  proto.prepended = function( elems ) {
    var items = this._itemize( elems );
    if ( !items.length ) {
      return;
    }
    // add items to beginning of collection
    var previousItems = this.items.slice(0);
    this.items = items.concat( previousItems );
    // start new layout
    this._resetLayout();
    this._manageStamps();
    // layout new stuff without transition
    this.layoutItems( items, true );
    this.reveal( items );
    // layout previous items
    this.layoutItems( previousItems );
  };
  
  /**
   * reveal a collection of items
   * @param {Array of Outlayer.Items} items
   */
  proto.reveal = function( items ) {
    this._emitCompleteOnItems( 'reveal', items );
    if ( !items || !items.length ) {
      return;
    }
    var stagger = this.updateStagger();
    items.forEach( function( item, i ) {
      item.stagger( i * stagger );
      item.reveal();
    });
  };
  
  /**
   * hide a collection of items
   * @param {Array of Outlayer.Items} items
   */
  proto.hide = function( items ) {
    this._emitCompleteOnItems( 'hide', items );
    if ( !items || !items.length ) {
      return;
    }
    var stagger = this.updateStagger();
    items.forEach( function( item, i ) {
      item.stagger( i * stagger );
      item.hide();
    });
  };
  
  /**
   * reveal item elements
   * @param {Array}, {Element}, {NodeList} items
   */
  proto.revealItemElements = function( elems ) {
    var items = this.getItems( elems );
    this.reveal( items );
  };
  
  /**
   * hide item elements
   * @param {Array}, {Element}, {NodeList} items
   */
  proto.hideItemElements = function( elems ) {
    var items = this.getItems( elems );
    this.hide( items );
  };
  
  /**
   * get Outlayer.Item, given an Element
   * @param {Element} elem
   * @param {Function} callback
   * @returns {Outlayer.Item} item
   */
  proto.getItem = function( elem ) {
    // loop through items to get the one that matches
    for ( var i=0; i < this.items.length; i++ ) {
      var item = this.items[i];
      if ( item.element == elem ) {
        // return item
        return item;
      }
    }
  };
  
  /**
   * get collection of Outlayer.Items, given Elements
   * @param {Array} elems
   * @returns {Array} items - Outlayer.Items
   */
  proto.getItems = function( elems ) {
    elems = utils.makeArray( elems );
    var items = [];
    elems.forEach( function( elem ) {
      var item = this.getItem( elem );
      if ( item ) {
        items.push( item );
      }
    }, this );
  
    return items;
  };
  
  /**
   * remove element(s) from instance and DOM
   * @param {Array or NodeList or Element} elems
   */
  proto.remove = function( elems ) {
    var removeItems = this.getItems( elems );
  
    this._emitCompleteOnItems( 'remove', removeItems );
  
    // bail if no items to remove
    if ( !removeItems || !removeItems.length ) {
      return;
    }
  
    removeItems.forEach( function( item ) {
      item.remove();
      // remove item from collection
      utils.removeFrom( this.items, item );
    }, this );
  };
  
  // ----- destroy ----- //
  
  // remove and disable Outlayer instance
  proto.destroy = function() {
    // clean up dynamic styles
    var style = this.element.style;
    style.height = '';
    style.position = '';
    style.width = '';
    // destroy items
    this.items.forEach( function( item ) {
      item.destroy();
    });
  
    this.unbindResize();
  
    var id = this.element.outlayerGUID;
    delete instances[ id ]; // remove reference to instance by id
    delete this.element.outlayerGUID;
    // remove data for jQuery
    if ( jQuery ) {
      jQuery.removeData( this.element, this.constructor.namespace );
    }
  
  };
  
  // -------------------------- data -------------------------- //
  
  /**
   * get Outlayer instance from element
   * @param {Element} elem
   * @returns {Outlayer}
   */
  Outlayer.data = function( elem ) {
    elem = utils.getQueryElement( elem );
    var id = elem && elem.outlayerGUID;
    return id && instances[ id ];
  };
  
  
  // -------------------------- create Outlayer class -------------------------- //
  
  /**
   * create a layout class
   * @param {String} namespace
   */
  Outlayer.create = function( namespace, options ) {
    // sub-class Outlayer
    var Layout = subclass( Outlayer );
    // apply new options and compatOptions
    Layout.defaults = utils.extend( {}, Outlayer.defaults );
    utils.extend( Layout.defaults, options );
    Layout.compatOptions = utils.extend( {}, Outlayer.compatOptions  );
  
    Layout.namespace = namespace;
  
    Layout.data = Outlayer.data;
  
    // sub-class Item
    Layout.Item = subclass( Item );
  
    // -------------------------- declarative -------------------------- //
  
    utils.htmlInit( Layout, namespace );
  
    // -------------------------- jQuery bridge -------------------------- //
  
    // make into jQuery plugin
    if ( jQuery && jQuery.bridget ) {
      jQuery.bridget( namespace, Layout );
    }
  
    return Layout;
  };
  
  function subclass( Parent ) {
    function SubClass() {
      Parent.apply( this, arguments );
    }
  
    SubClass.prototype = Object.create( Parent.prototype );
    SubClass.prototype.constructor = SubClass;
  
    return SubClass;
  }
  
  // ----- helpers ----- //
  
  // how many milliseconds are in each unit
  var msUnits = {
    ms: 1,
    s: 1000
  };
  
  // munge time-like parameter into millisecond number
  // '0.4s' -> 40
  function getMilliseconds( time ) {
    if ( typeof time == 'number' ) {
      return time;
    }
    var matches = time.match( /(^\d*\.?\d*)(\w*)/ );
    var num = matches && matches[1];
    var unit = matches && matches[2];
    if ( !num.length ) {
      return 0;
    }
    num = parseFloat( num );
    var mult = msUnits[ unit ] || 1;
    return num * mult;
  }
  
  // ----- fin ----- //
  
  // back in global
  Outlayer.Item = Item;
  
  return Outlayer;
  
  }));
  
  /**
   * Isotope Item
  **/
  
  ( function( window, factory ) {
    // universal module definition
    /* jshint strict: false */ /*globals define, module, require */
    if ( typeof define == 'function' && define.amd ) {
      // AMD
      define( 'isotope-layout/js/item',[
          'outlayer/outlayer'
        ],
        factory );
    } else if ( typeof module == 'object' && module.exports ) {
      // CommonJS
      module.exports = factory(
        require('outlayer')
      );
    } else {
      // browser global
      window.Isotope = window.Isotope || {};
      window.Isotope.Item = factory(
        window.Outlayer
      );
    }
  
  }( window, function factory( Outlayer ) {
  'use strict';
  
  // -------------------------- Item -------------------------- //
  
  // sub-class Outlayer Item
  function Item() {
    Outlayer.Item.apply( this, arguments );
  }
  
  var proto = Item.prototype = Object.create( Outlayer.Item.prototype );
  
  var _create = proto._create;
  proto._create = function() {
    // assign id, used for original-order sorting
    this.id = this.layout.itemGUID++;
    _create.call( this );
    this.sortData = {};
  };
  
  proto.updateSortData = function() {
    if ( this.isIgnored ) {
      return;
    }
    // default sorters
    this.sortData.id = this.id;
    // for backward compatibility
    this.sortData['original-order'] = this.id;
    this.sortData.random = Math.random();
    // go thru getSortData obj and apply the sorters
    var getSortData = this.layout.options.getSortData;
    var sorters = this.layout._sorters;
    for ( var key in getSortData ) {
      var sorter = sorters[ key ];
      this.sortData[ key ] = sorter( this.element, this );
    }
  };
  
  var _destroy = proto.destroy;
  proto.destroy = function() {
    // call super
    _destroy.apply( this, arguments );
    // reset display, #741
    this.css({
      display: ''
    });
  };
  
  return Item;
  
  }));
  
  /**
   * Isotope LayoutMode
   */
  
  ( function( window, factory ) {
    // universal module definition
    /* jshint strict: false */ /*globals define, module, require */
    if ( typeof define == 'function' && define.amd ) {
      // AMD
      define( 'isotope-layout/js/layout-mode',[
          'get-size/get-size',
          'outlayer/outlayer'
        ],
        factory );
    } else if ( typeof module == 'object' && module.exports ) {
      // CommonJS
      module.exports = factory(
        require('get-size'),
        require('outlayer')
      );
    } else {
      // browser global
      window.Isotope = window.Isotope || {};
      window.Isotope.LayoutMode = factory(
        window.getSize,
        window.Outlayer
      );
    }
  
  }( window, function factory( getSize, Outlayer ) {
    'use strict';
  
    // layout mode class
    function LayoutMode( isotope ) {
      this.isotope = isotope;
      // link properties
      if ( isotope ) {
        this.options = isotope.options[ this.namespace ];
        this.element = isotope.element;
        this.items = isotope.filteredItems;
        this.size = isotope.size;
      }
    }
  
    var proto = LayoutMode.prototype;
  
    /**
     * some methods should just defer to default Outlayer method
     * and reference the Isotope instance as `this`
    **/
    var facadeMethods = [
      '_resetLayout',
      '_getItemLayoutPosition',
      '_manageStamp',
      '_getContainerSize',
      '_getElementOffset',
      'needsResizeLayout',
      '_getOption'
    ];
  
    facadeMethods.forEach( function( methodName ) {
      proto[ methodName ] = function() {
        return Outlayer.prototype[ methodName ].apply( this.isotope, arguments );
      };
    });
  
    // -----  ----- //
  
    // for horizontal layout modes, check vertical size
    proto.needsVerticalResizeLayout = function() {
      // don't trigger if size did not change
      var size = getSize( this.isotope.element );
      // check that this.size and size are there
      // IE8 triggers resize on body size change, so they might not be
      var hasSizes = this.isotope.size && size;
      return hasSizes && size.innerHeight != this.isotope.size.innerHeight;
    };
  
    // ----- measurements ----- //
  
    proto._getMeasurement = function() {
      this.isotope._getMeasurement.apply( this, arguments );
    };
  
    proto.getColumnWidth = function() {
      this.getSegmentSize( 'column', 'Width' );
    };
  
    proto.getRowHeight = function() {
      this.getSegmentSize( 'row', 'Height' );
    };
  
    /**
     * get columnWidth or rowHeight
     * segment: 'column' or 'row'
     * size 'Width' or 'Height'
    **/
    proto.getSegmentSize = function( segment, size ) {
      var segmentName = segment + size;
      var outerSize = 'outer' + size;
      // columnWidth / outerWidth // rowHeight / outerHeight
      this._getMeasurement( segmentName, outerSize );
      // got rowHeight or columnWidth, we can chill
      if ( this[ segmentName ] ) {
        return;
      }
      // fall back to item of first element
      var firstItemSize = this.getFirstItemSize();
      this[ segmentName ] = firstItemSize && firstItemSize[ outerSize ] ||
        // or size of container
        this.isotope.size[ 'inner' + size ];
    };
  
    proto.getFirstItemSize = function() {
      var firstItem = this.isotope.filteredItems[0];
      return firstItem && firstItem.element && getSize( firstItem.element );
    };
  
    // ----- methods that should reference isotope ----- //
  
    proto.layout = function() {
      this.isotope.layout.apply( this.isotope, arguments );
    };
  
    proto.getSize = function() {
      this.isotope.getSize();
      this.size = this.isotope.size;
    };
  
    // -------------------------- create -------------------------- //
  
    LayoutMode.modes = {};
  
    LayoutMode.create = function( namespace, options ) {
  
      function Mode() {
        LayoutMode.apply( this, arguments );
      }
  
      Mode.prototype = Object.create( proto );
      Mode.prototype.constructor = Mode;
  
      // default options
      if ( options ) {
        Mode.options = options;
      }
  
      Mode.prototype.namespace = namespace;
      // register in Isotope
      LayoutMode.modes[ namespace ] = Mode;
  
      return Mode;
    };
  
    return LayoutMode;
  
  }));
  
  /*!
   * Masonry v4.2.1
   * Cascading grid layout library
   * https://masonry.desandro.com
   * MIT License
   * by David DeSandro
   */
  
  ( function( window, factory ) {
    // universal module definition
    /* jshint strict: false */ /*globals define, module, require */
    if ( typeof define == 'function' && define.amd ) {
      // AMD
      define( 'masonry-layout/masonry',[
          'outlayer/outlayer',
          'get-size/get-size'
        ],
        factory );
    } else if ( typeof module == 'object' && module.exports ) {
      // CommonJS
      module.exports = factory(
        require('outlayer'),
        require('get-size')
      );
    } else {
      // browser global
      window.Masonry = factory(
        window.Outlayer,
        window.getSize
      );
    }
  
  }( window, function factory( Outlayer, getSize ) {
  
  
  
  // -------------------------- masonryDefinition -------------------------- //
  
    // create an Outlayer layout class
    var Masonry = Outlayer.create('masonry');
    // isFitWidth -> fitWidth
    Masonry.compatOptions.fitWidth = 'isFitWidth';
  
    var proto = Masonry.prototype;
  
    proto._resetLayout = function() {
      this.getSize();
      this._getMeasurement( 'columnWidth', 'outerWidth' );
      this._getMeasurement( 'gutter', 'outerWidth' );
      this.measureColumns();
  
      // reset column Y
      this.colYs = [];
      for ( var i=0; i < this.cols; i++ ) {
        this.colYs.push( 0 );
      }
  
      this.maxY = 0;
      this.horizontalColIndex = 0;
    };
  
    proto.measureColumns = function() {
      this.getContainerWidth();
      // if columnWidth is 0, default to outerWidth of first item
      if ( !this.columnWidth ) {
        var firstItem = this.items[0];
        var firstItemElem = firstItem && firstItem.element;
        // columnWidth fall back to item of first element
        this.columnWidth = firstItemElem && getSize( firstItemElem ).outerWidth ||
          // if first elem has no width, default to size of container
          this.containerWidth;
      }
  
      var columnWidth = this.columnWidth += this.gutter;
  
      // calculate columns
      var containerWidth = this.containerWidth + this.gutter;
      var cols = containerWidth / columnWidth;
      // fix rounding errors, typically with gutters
      var excess = columnWidth - containerWidth % columnWidth;
      // if overshoot is less than a pixel, round up, otherwise floor it
      var mathMethod = excess && excess < 1 ? 'round' : 'floor';
      cols = Math[ mathMethod ]( cols );
      this.cols = Math.max( cols, 1 );
    };
  
    proto.getContainerWidth = function() {
      // container is parent if fit width
      var isFitWidth = this._getOption('fitWidth');
      var container = isFitWidth ? this.element.parentNode : this.element;
      // check that this.size and size are there
      // IE8 triggers resize on body size change, so they might not be
      var size = getSize( container );
      this.containerWidth = size && size.innerWidth;
    };
  
    proto._getItemLayoutPosition = function( item ) {
      item.getSize();
      // how many columns does this brick span
      var remainder = item.size.outerWidth % this.columnWidth;
      var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
      // round if off by 1 pixel, otherwise use ceil
      var colSpan = Math[ mathMethod ]( item.size.outerWidth / this.columnWidth );
      colSpan = Math.min( colSpan, this.cols );
      // use horizontal or top column position
      var colPosMethod = this.options.horizontalOrder ?
        '_getHorizontalColPosition' : '_getTopColPosition';
      var colPosition = this[ colPosMethod ]( colSpan, item );
      // position the brick
      var position = {
        x: this.columnWidth * colPosition.col,
        y: colPosition.y
      };
      // apply setHeight to necessary columns
      var setHeight = colPosition.y + item.size.outerHeight;
      var setMax = colSpan + colPosition.col;
      for ( var i = colPosition.col; i < setMax; i++ ) {
        this.colYs[i] = setHeight;
      }
  
      return position;
    };
  
    proto._getTopColPosition = function( colSpan ) {
      var colGroup = this._getTopColGroup( colSpan );
      // get the minimum Y value from the columns
      var minimumY = Math.min.apply( Math, colGroup );
  
      return {
        col: colGroup.indexOf( minimumY ),
        y: minimumY,
      };
    };
  
    /**
     * @param {Number} colSpan - number of columns the element spans
     * @returns {Array} colGroup
     */
    proto._getTopColGroup = function( colSpan ) {
      if ( colSpan < 2 ) {
        // if brick spans only one column, use all the column Ys
        return this.colYs;
      }
  
      var colGroup = [];
      // how many different places could this brick fit horizontally
      var groupCount = this.cols + 1 - colSpan;
      // for each group potential horizontal position
      for ( var i = 0; i < groupCount; i++ ) {
        colGroup[i] = this._getColGroupY( i, colSpan );
      }
      return colGroup;
    };
  
    proto._getColGroupY = function( col, colSpan ) {
      if ( colSpan < 2 ) {
        return this.colYs[ col ];
      }
      // make an array of colY values for that one group
      var groupColYs = this.colYs.slice( col, col + colSpan );
      // and get the max value of the array
      return Math.max.apply( Math, groupColYs );
    };
  
    // get column position based on horizontal index. #873
    proto._getHorizontalColPosition = function( colSpan, item ) {
      var col = this.horizontalColIndex % this.cols;
      var isOver = colSpan > 1 && col + colSpan > this.cols;
      // shift to next row if item can't fit on current row
      col = isOver ? 0 : col;
      // don't let zero-size items take up space
      var hasSize = item.size.outerWidth && item.size.outerHeight;
      this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;
  
      return {
        col: col,
        y: this._getColGroupY( col, colSpan ),
      };
    };
  
    proto._manageStamp = function( stamp ) {
      var stampSize = getSize( stamp );
      var offset = this._getElementOffset( stamp );
      // get the columns that this stamp affects
      var isOriginLeft = this._getOption('originLeft');
      var firstX = isOriginLeft ? offset.left : offset.right;
      var lastX = firstX + stampSize.outerWidth;
      var firstCol = Math.floor( firstX / this.columnWidth );
      firstCol = Math.max( 0, firstCol );
      var lastCol = Math.floor( lastX / this.columnWidth );
      // lastCol should not go over if multiple of columnWidth #425
      lastCol -= lastX % this.columnWidth ? 0 : 1;
      lastCol = Math.min( this.cols - 1, lastCol );
      // set colYs to bottom of the stamp
  
      var isOriginTop = this._getOption('originTop');
      var stampMaxY = ( isOriginTop ? offset.top : offset.bottom ) +
        stampSize.outerHeight;
      for ( var i = firstCol; i <= lastCol; i++ ) {
        this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
      }
    };
  
    proto._getContainerSize = function() {
      this.maxY = Math.max.apply( Math, this.colYs );
      var size = {
        height: this.maxY
      };
  
      if ( this._getOption('fitWidth') ) {
        size.width = this._getContainerFitWidth();
      }
  
      return size;
    };
  
    proto._getContainerFitWidth = function() {
      var unusedCols = 0;
      // count unused columns
      var i = this.cols;
      while ( --i ) {
        if ( this.colYs[i] !== 0 ) {
          break;
        }
        unusedCols++;
      }
      // fit container to columns that have been used
      return ( this.cols - unusedCols ) * this.columnWidth - this.gutter;
    };
  
    proto.needsResizeLayout = function() {
      var previousWidth = this.containerWidth;
      this.getContainerWidth();
      return previousWidth != this.containerWidth;
    };
  
    return Masonry;
  
  }));
  
  /*!
   * Masonry layout mode
   * sub-classes Masonry
   * https://masonry.desandro.com
   */
  
  ( function( window, factory ) {
    // universal module definition
    /* jshint strict: false */ /*globals define, module, require */
    if ( typeof define == 'function' && define.amd ) {
      // AMD
      define( 'isotope-layout/js/layout-modes/masonry',[
          '../layout-mode',
          'masonry-layout/masonry'
        ],
        factory );
    } else if ( typeof module == 'object' && module.exports ) {
      // CommonJS
      module.exports = factory(
        require('../layout-mode'),
        require('masonry-layout')
      );
    } else {
      // browser global
      factory(
        window.Isotope.LayoutMode,
        window.Masonry
      );
    }
  
  }( window, function factory( LayoutMode, Masonry ) {
  'use strict';
  
  // -------------------------- masonryDefinition -------------------------- //
  
    // create an Outlayer layout class
    var MasonryMode = LayoutMode.create('masonry');
  
    var proto = MasonryMode.prototype;
  
    var keepModeMethods = {
      _getElementOffset: true,
      layout: true,
      _getMeasurement: true
    };
  
    // inherit Masonry prototype
    for ( var method in Masonry.prototype ) {
      // do not inherit mode methods
      if ( !keepModeMethods[ method ] ) {
        proto[ method ] = Masonry.prototype[ method ];
      }
    }
  
    var measureColumns = proto.measureColumns;
    proto.measureColumns = function() {
      // set items, used if measuring first item
      this.items = this.isotope.filteredItems;
      measureColumns.call( this );
    };
  
    // point to mode options for fitWidth
    var _getOption = proto._getOption;
    proto._getOption = function( option ) {
      if ( option == 'fitWidth' ) {
        return this.options.isFitWidth !== undefined ?
          this.options.isFitWidth : this.options.fitWidth;
      }
      return _getOption.apply( this.isotope, arguments );
    };
  
    return MasonryMode;
  
  }));
  
  /**
   * fitRows layout mode
   */
  
  ( function( window, factory ) {
    // universal module definition
    /* jshint strict: false */ /*globals define, module, require */
    if ( typeof define == 'function' && define.amd ) {
      // AMD
      define( 'isotope-layout/js/layout-modes/fit-rows',[
          '../layout-mode'
        ],
        factory );
    } else if ( typeof exports == 'object' ) {
      // CommonJS
      module.exports = factory(
        require('../layout-mode')
      );
    } else {
      // browser global
      factory(
        window.Isotope.LayoutMode
      );
    }
  
  }( window, function factory( LayoutMode ) {
  'use strict';
  
  var FitRows = LayoutMode.create('fitRows');
  
  var proto = FitRows.prototype;
  
  proto._resetLayout = function() {
    this.x = 0;
    this.y = 0;
    this.maxY = 0;
    this._getMeasurement( 'gutter', 'outerWidth' );
  };
  
  proto._getItemLayoutPosition = function( item ) {
    item.getSize();
  
    var itemWidth = item.size.outerWidth + this.gutter;
    // if this element cannot fit in the current row
    var containerWidth = this.isotope.size.innerWidth + this.gutter;
    if ( this.x !== 0 && itemWidth + this.x > containerWidth ) {
      this.x = 0;
      this.y = this.maxY;
    }
  
    var position = {
      x: this.x,
      y: this.y
    };
  
    this.maxY = Math.max( this.maxY, this.y + item.size.outerHeight );
    this.x += itemWidth;
  
    return position;
  };
  
  proto._getContainerSize = function() {
    return { height: this.maxY };
  };
  
  return FitRows;
  
  }));
  
  /**
   * vertical layout mode
   */
  
  ( function( window, factory ) {
    // universal module definition
    /* jshint strict: false */ /*globals define, module, require */
    if ( typeof define == 'function' && define.amd ) {
      // AMD
      define( 'isotope-layout/js/layout-modes/vertical',[
          '../layout-mode'
        ],
        factory );
    } else if ( typeof module == 'object' && module.exports ) {
      // CommonJS
      module.exports = factory(
        require('../layout-mode')
      );
    } else {
      // browser global
      factory(
        window.Isotope.LayoutMode
      );
    }
  
  }( window, function factory( LayoutMode ) {
  'use strict';
  
  var Vertical = LayoutMode.create( 'vertical', {
    horizontalAlignment: 0
  });
  
  var proto = Vertical.prototype;
  
  proto._resetLayout = function() {
    this.y = 0;
  };
  
  proto._getItemLayoutPosition = function( item ) {
    item.getSize();
    var x = ( this.isotope.size.innerWidth - item.size.outerWidth ) *
      this.options.horizontalAlignment;
    var y = this.y;
    this.y += item.size.outerHeight;
    return { x: x, y: y };
  };
  
  proto._getContainerSize = function() {
    return { height: this.y };
  };
  
  return Vertical;
  
  }));
  
 // параллакс 
function parallaxTop(){
    var scrolled = $(window).scrollTop();
    var iconRotate = $('.icon-rotate img');
    maxScroll = $(document).height()-$(window).height();
    $('.parallax1').css('margin-top', +(scrolled * 0.4) + 'px');
    $('.parallax1').css('margin-right', -(scrolled * 0.2) + 'px');
    $('.parallax1').css({transform: 'rotate(+' + (360 * scrolled/maxScroll) + 'deg)'});
    $('.parallax2').css('margin-bottom', +(scrolled * 0.8) + 'px');
    $('.parallax2').css('margin-left', -(scrolled * 0.3) + 'px');
    $('.parallax3').css('margin-top', +(scrolled * 0.6) + 'px');
    $('.parallax3').css({transform: 'rotate(-' + (2000 * scrolled/maxScroll) + 'deg)'});
    $('.parallax5').css('margin-top', +(scrolled * 0.6) + 'px');
    $('.parallax5').css({transform: 'rotate(-' + (600 * scrolled/maxScroll) + 'deg)'});
    $('.parallax4').css('margin-top', -(scrolled * 0.6) + 'px');
    $('.parallax4').css({transform: 'rotate(-' + (1000 * scrolled/maxScroll) + 'deg)'})
    $('.parallax6').css('margin-bottom', +(scrolled * 0.5) + 'px');
    $('.parallax6').css({transform: 'rotate(-' + (1000 * scrolled/maxScroll) + 'deg)'});
    $('.parallax7').css('margin-bottom', +(scrolled * 0.2) + 'px');
    $('.parallax7').css({transform: 'rotate(-' + (1000 * scrolled/maxScroll) + 'deg)'});
    $('.parallax8').css('margin-top', +(scrolled * 0.5) + 'px');
    $('.parallax8').css({transform: 'rotate(-' + (500 * scrolled/maxScroll) + 'deg)'});
    $('.parallax10').css('margin-top', +(scrolled * 0.8) + 'px');
    $('.parallax10').css({transform: 'rotate(-' + (500 * scrolled/maxScroll) + 'deg)'});
    $('.parallax12').css('margin-bottom', +(scrolled * 0.2) + 'px');
    $('.parallax12').css({transform: 'rotate(-' + (500 * scrolled/maxScroll) + 'deg)'});
    $('.parallax13').css('margin-bottom', +(scrolled * 0.2) + 'px');
    $('.parallax14').css('margin-top', +(scrolled * 0.2) + 'px');
    $('.parallax14').css({transform: 'rotate(-' + (500 * scrolled/maxScroll) + 'deg)'});
    $('.parallax15').css('margin-top', +(scrolled * 0.1) + 'px');

         	
}

$(window).scroll(function(e){
	parallaxTop();
  });
  

// карта
  ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [43.234542, 76.832134],
            zoom: 12
        }, {
            searchControlProvider: 'yandex#search'
        }),

        // Создаём макет содержимого.
        MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        ),

        AcsayOne = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'Центральный магазин',
            balloonContent: '«Аксай- 2», ул. Б.Момышулы, 36 А'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'img/map.svg',
            // Размеры метки.
            iconImageSize: [32, 39],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-5, -38]
        }),

        AksayTwo = new ymaps.Placemark([43.246850, 76.948160], {
            hintContent: 'Магазин на Назарбаева',
            balloonContent: 'Пр Назарбаева Н.А., д.148, магазин «Беташар»',
            iconContent: '12'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#imageWithContent',
            // Своё изображение иконки метки.
            iconImageHref: 'img/map.png',
            // Размеры метки.
            iconImageSize:  [19, 27],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-24, -24],
            // Смещение слоя с содержимым относительно слоя с картинкой.
            iconContentOffset: [15, 15],
            // Макет содержимого.
            iconContentLayout: MyIconContentLayout
        });

        AksayThree = new ymaps.Placemark([43.253383, 76.919594], {
          hintContent: 'Магазин на Толе Би',
          balloonContent: 'улица Толе Би 125, Алматы',
          iconContent: '12'
      }, {
          // Опции.
          // Необходимо указать данный тип макета.
          iconLayout: 'default#imageWithContent',
          // Своё изображение иконки метки.
          iconImageHref: 'img/map.png',
          // Размеры метки.
          iconImageSize:  [19, 27],
          // Смещение левого верхнего угла иконки относительно
          // её "ножки" (точки привязки).
          iconImageOffset: [-24, -24],
          // Смещение слоя с содержимым относительно слоя с картинкой.
          iconContentOffset: [15, 15],
          // Макет содержимого.
          iconContentLayout: MyIconContentLayout
      });
      AksayFour = new ymaps.Placemark([43.253383, 76.919594], {
        hintContent: 'Магазин на Толе Би',
        balloonContent: 'улица Толе Би 125, Алматы',
        iconContent: '12'
    }, {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: 'default#imageWithContent',
        // Своё изображение иконки метки.
        iconImageHref: 'img/map.png',
        // Размеры метки.
        iconImageSize:  [19, 27],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-24, -24],
        // Смещение слоя с содержимым относительно слоя с картинкой.
        iconContentOffset: [15, 15],
        // Макет содержимого.
        iconContentLayout: MyIconContentLayout
    });
    AksayFive = new ymaps.Placemark([43.200924, 76.885970], {
      hintContent: 'Магазин на Орбита-1',
      balloonContent: 'Мкр. Орбита-1, ул. Навои, д.6',
      iconContent: '12'
  }, {
      // Опции.
      // Необходимо указать данный тип макета.
      iconLayout: 'default#imageWithContent',
      // Своё изображение иконки метки.
      iconImageHref: 'img/map.png',
      // Размеры метки.
      iconImageSize: [19, 27],
      // Смещение левого верхнего угла иконки относительно
      // её "ножки" (точки привязки).
      iconImageOffset:  [19, 27],
      // Смещение слоя с содержимым относительно слоя с картинкой.
      iconContentOffset: [-24, -24],
      // Макет содержимого.
      iconContentLayout: MyIconContentLayout
  });

  AksaySix = new ymaps.Placemark([43.256364, 76.886895], {
    hintContent: 'Магазин на Розебакиева',
    balloonContent: 'Ул. Розыбакиева 33/1, ТК «Оптовка»',
    iconContent: '12'
}, {
    // Опции.
    // Необходимо указать данный тип макета.
    iconLayout: 'default#imageWithContent',
    // Своё изображение иконки метки.
    iconImageHref: 'img/map.png',
    // Размеры метки.
    iconImageSize: [19, 27],
    // Смещение левого верхнего угла иконки относительно
    // её "ножки" (точки привязки).
    iconImageOffset: [-24, -24],
    // Смещение слоя с содержимым относительно слоя с картинкой.
    iconContentOffset: [15, 15],
    // Макет содержимого.
    iconContentLayout: MyIconContentLayout
});

    myMap.geoObjects
        .add(AcsayOne)
        .add(AksayTwo)
        .add(AksayThree)
        .add(AksayFour)
        .add(AksayFive)
        .add(AksaySix);

  // отключить прокрутку мышью      
  myMap.behaviors.disable ('scrollZoom');
});

//фильтр range
addEventListener('input', e => {
  let _t = e.target;
  _t.parentNode.style.setProperty(`--${_t.id}`, +_t.value)
}, false);

$('.filter__arrow').on ('click', function(){
  $(this).toggleClass('filter__arrow--open')
  $('.filter__shops-list').toggleClass('filter__shops-list--open')
})

$('.filter__shops-list li').on('click', function(){
  var text = $(this).html();
$('.filter__shops-list').removeClass('filter__shops-list--open');
$('.filter__arrow').removeClass('filter__arrow--open');
$(this).parent().parent().find('.filter__content').html(text);
});

$('.filter__link').on('click', function(){
  var text= $(this).text();
  $(this).text(
  text == "Свернуть список" ? "Раскрыть весь список" : "Свернуть список");
$('.filter-control--hidden').toggleClass('filter-control--hidden-open')
  return false;
});
$('.sidebar__filter-toggler').on('click', function(){
$('.filter').toggleClass('filter--open');

});
//galery
/*!
 * Splide.js
 * Version  : 2.4.10
 * License  : MIT
 * Copyright: 2020 Naotoshi Fujita
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

  "use strict";
  // ESM COMPAT FLAG
  __webpack_require__.r(__webpack_exports__);
  
  // EXPORTS
  __webpack_require__.d(__webpack_exports__, "Splide", function() { return /* binding */ complete_Splide; });
  
  // NAMESPACE OBJECT: ./src/js/constants/states.js
  var states_namespaceObject = {};
  __webpack_require__.r(states_namespaceObject);
  __webpack_require__.d(states_namespaceObject, "CREATED", function() { return CREATED; });
  __webpack_require__.d(states_namespaceObject, "MOUNTED", function() { return MOUNTED; });
  __webpack_require__.d(states_namespaceObject, "IDLE", function() { return IDLE; });
  __webpack_require__.d(states_namespaceObject, "MOVING", function() { return MOVING; });
  __webpack_require__.d(states_namespaceObject, "DESTROYED", function() { return DESTROYED; });
  
  // CONCATENATED MODULE: ./src/js/core/event.js
  /**
   * The function for providing an Event object simply managing events.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * The function for providing an Event object simply managing events.
   */
  /* harmony default export */ var core_event = (function () {
    /**
     * Store all event data.
     *
     * @type {Array}
     */
    var data = [];
    var Event = {
      /**
       * Subscribe the given event(s).
       *
       * @param {string}   events  - An event name. Use space to separate multiple events.
       *                             Also, namespace is accepted by dot, such as 'resize.{namespace}'.
       * @param {function} handler - A callback function.
       * @param {Element}  elm     - Optional. Native event will be listened to when this arg is provided.
       * @param {Object}   options - Optional. Options for addEventListener.
       */
      on: function on(events, handler, elm, options) {
        if (elm === void 0) {
          elm = null;
        }
  
        if (options === void 0) {
          options = {};
        }
  
        events.split(' ').forEach(function (event) {
          if (elm) {
            elm.addEventListener(event, handler, options);
          }
  
          data.push({
            event: event,
            handler: handler,
            elm: elm,
            options: options
          });
        });
      },
  
      /**
       * Unsubscribe the given event(s).
       *
       * @param {string}  events - A event name or names split by space.
       * @param {Element} elm    - Optional. removeEventListener() will be called when this arg is provided.
       */
      off: function off(events, elm) {
        if (elm === void 0) {
          elm = null;
        }
  
        events.split(' ').forEach(function (event) {
          data = data.filter(function (item) {
            if (item && item.event === event && item.elm === elm) {
              unsubscribe(item);
              return false;
            }
  
            return true;
          });
        });
      },
  
      /**
       * Emit an event.
       * This method is only for custom events.
       *
       * @param {string}  event - An event name.
       * @param {*}       args  - Any number of arguments passed to handlers.
       */
      emit: function emit(event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
  
        data.forEach(function (item) {
          if (!item.elm && item.event.split('.')[0] === event) {
            item.handler.apply(item, args);
          }
        });
      },
  
      /**
       * Clear event data.
       */
      destroy: function destroy() {
        data.forEach(unsubscribe);
        data = [];
      }
    };
    /**
     * Remove the registered event listener.
     *
     * @param {Object} item - An object containing event data.
     */
  
    function unsubscribe(item) {
      if (item.elm) {
        item.elm.removeEventListener(item.event, item.handler, item.options);
      }
    }
  
    return Event;
  });
  // CONCATENATED MODULE: ./src/js/core/state.js
  /**
   * The function providing a super simple state system.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * The function providing a super simple state system.
   *
   * @param {string|number} initialState - Provide the initial state value.
   */
  /* harmony default export */ var state = (function (initialState) {
    /**
     * Store the current state.
     *
     * @type {string|number}
     */
    var curr = initialState;
    return {
      /**
       * Change state.
       *
       * @param {string|number} state - A new state.
       */
      set: function set(state) {
        curr = state;
      },
  
      /**
       * Verify if the current state is given one or not.
       *
       * @param {string|number} state - A state name to be verified.
       *
       * @return {boolean} - True if the current state is the given one.
       */
      is: function is(state) {
        return state === curr;
      }
    };
  });
  // CONCATENATED MODULE: ./src/js/utils/object.js
  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
  
  /**
   * Some utility functions related with Object, supporting IE.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  var keys = Object.keys;
  /**
   * Iterate an object like Array.forEach.
   * IE doesn't support forEach of HTMLCollection.
   *
   * @param {Object}    obj       - An object.
   * @param {function}  callback  - A function handling each value. Arguments are value, property and index.
   */
  
  function each(obj, callback) {
    keys(obj).some(function (key, index) {
      return callback(obj[key], key, index);
    });
  }
  /**
   * Return values of the given object as an array.
   * IE doesn't support Object.values.
   *
   * @param {Object} obj - An object.
   *
   * @return {Array} - An array containing all values of the given object.
   */
  
  function values(obj) {
    return keys(obj).map(function (key) {
      return obj[key];
    });
  }
  /**
   * Check if the given subject is object or not.
   *
   * @param {*} subject - A subject to be verified.
   *
   * @return {boolean} - True if object, false otherwise.
   */
  
  function isObject(subject) {
    return typeof subject === 'object';
  }
  /**
   * Merge two objects deeply.
   *
   * @param {Object} to   - An object where "from" is merged.
   * @param {Object} from - An object merged to "to".
   *
   * @return {Object} - A merged object.
   */
  
  function merge(_ref, from) {
    var to = _extends({}, _ref);
  
    each(from, function (value, key) {
      if (isObject(value)) {
        if (!isObject(to[key])) {
          to[key] = {};
        }
  
        to[key] = merge(to[key], value);
      } else {
        to[key] = value;
      }
    });
    return to;
  }
  /**
   * Assign all properties "from" to "to" object.
   *
   * @param {Object} to   - An object where properties are assigned.
   * @param {Object} from - An object whose properties are assigned to "to".
   *
   * @return {Object} - An assigned object.
   */
  
  function object_assign(to, from) {
    keys(from).forEach(function (key) {
      if (!to[key]) {
        Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key));
      }
    });
    return to;
  }
  // CONCATENATED MODULE: ./src/js/utils/utils.js
  /**
   * A package of some miscellaneous utility functions.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * Convert the given value to array.
   *
   * @param {*} value - Any value.
   *
   * @return {*[]} - Array containing the given value.
   */
  
  function toArray(value) {
    return Array.isArray(value) ? value : [value];
  }
  /**
   * Check if the given value is between min and max.
   * Min will be returned when the value is less than min or max will do when greater than max.
   *
   * @param {number} value - A number to be checked.
   * @param {number} m1    - Minimum or maximum number.
   * @param {number} m2    - Maximum or minimum number.
   *
   * @return {number} - A value itself, min or max.
   */
  
  function between(value, m1, m2) {
    return Math.min(Math.max(value, m1 > m2 ? m2 : m1), m1 > m2 ? m1 : m2);
  }
  /**
   * The sprintf method with minimum functionality.
   *
   * @param {string}       format       - The string format.
   * @param {string|Array} replacements - Replacements accepting multiple arguments.
   *
   * @returns {string} - Converted string.
   */
  
  function sprintf(format, replacements) {
    var i = 0;
    return format.replace(/%s/g, function () {
      return toArray(replacements)[i++];
    });
  }
  /**
   * Append px unit to the given subject if necessary.
   *
   * @param {number|string} value - A value that may not include an unit.
   *
   * @return {string} - If the value is string, return itself.
   *                    If number, do value + "px". An empty string, otherwise.
   */
  
  function unit(value) {
    var type = typeof value;
  
    if (type === 'number' && value > 0) {
      return parseFloat(value) + 'px';
    }
  
    return type === 'string' ? value : '';
  }
  /**
   * Pad start with 0.
   *
   * @param {number} number - A number to be filled with 0.
   *
   * @return {string|number} - Padded number.
   */
  
  function pad(number) {
    return number < 10 ? '0' + number : number;
  }
  /**
   * Convert the given value to pixel.
   *
   * @param {Element}       root  - Root element where a dummy div is appended.
   * @param {string|number} value - CSS value to be converted, such as 10rem.
   *
   * @return {number} - Pixel.
   */
  
  function toPixel(root, value) {
    if (typeof value === 'string') {
      var div = create('div', {});
      applyStyle(div, {
        position: 'absolute',
        width: value
      });
      append(root, div);
      value = div.clientWidth;
      dom_remove(div);
    }
  
    return +value || 0;
  }
  // CONCATENATED MODULE: ./src/js/utils/dom.js
  /**
   * Some utility functions related with DOM.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  /**
   * Find the first element matching the given selector.
   * Be aware that all selectors after a space are ignored.
   *
   * @param {Element|Node}  elm       - An ancestor element.
   * @param {string}        selector  - DOMString.
   *
   * @return {Element|null} - A found element or null.
   */
  
  function find(elm, selector) {
    return elm ? elm.querySelector(selector.split(' ')[0]) : null;
  }
  /**
   * Find a first child having the given tag or class name.
   *
   * @param {Element} parent         - A parent element.
   * @param {string}  tagOrClassName - A tag or class name.
   *
   * @return {Element|undefined} - A found element on success or undefined on failure.
   */
  
  function child(parent, tagOrClassName) {
    return children(parent, tagOrClassName)[0];
  }
  /**
   * Return chile elements that matches the provided tag or class name.
   *
   * @param {Element} parent         - A parent element.
   * @param {string}  tagOrClassName - A tag or class name.
   *
   * @return {Element[]} - Found elements.
   */
  
  function children(parent, tagOrClassName) {
    if (parent) {
      return values(parent.children).filter(function (child) {
        return hasClass(child, tagOrClassName.split(' ')[0]) || child.tagName === tagOrClassName;
      });
    }
  
    return [];
  }
  /**
   * Create an element with some optional attributes.
   *
   * @param {string} tag   - A tag name.
   * @param {Object} attrs - An object any attribute pairs of name and value.
   *
   * @return {Element} - A created element.
   */
  
  function create(tag, attrs) {
    var elm = document.createElement(tag);
    each(attrs, function (value, key) {
      return setAttribute(elm, key, value);
    });
    return elm;
  }
  /**
   * Convert HTML string to DOM node.
   *
   * @param {string} html - HTML string.
   *
   * @return {Node} - A created node.
   */
  
  function domify(html) {
    var div = create('div', {});
    div.innerHTML = html;
    return div.firstChild;
  }
  /**
   * Remove a given element from a DOM tree.
   *
   * @param {Element|Element[]} elms - Element(s) to be removed.
   */
  
  function dom_remove(elms) {
    toArray(elms).forEach(function (elm) {
      if (elm) {
        var parent = elm.parentElement;
        parent && parent.removeChild(elm);
      }
    });
  }
  /**
   * Append a child to a given element.
   *
   * @param {Element} parent - A parent element.
   * @param {Element} child  - An element to be appended.
   */
  
  function append(parent, child) {
    if (parent) {
      parent.appendChild(child);
    }
  }
  /**
   * Insert an element before the reference element.
   *
   * @param {Element|Node} ref - A reference element.
   * @param {Element}      elm - An element to be inserted.
   */
  
  function before(elm, ref) {
    if (elm && ref) {
      var parent = ref.parentElement;
      parent && parent.insertBefore(elm, ref);
    }
  }
  /**
   * Apply styles to the given element.
   *
   * @param {Element} elm     - An element where styles are applied.
   * @param {Object}  styles  - Object containing styles.
   */
  
  function applyStyle(elm, styles) {
    if (elm) {
      each(styles, function (value, prop) {
        if (value !== null) {
          elm.style[prop] = value;
        }
      });
    }
  }
  /**
   * Add or remove classes to/from the element.
   * This function is for internal usage.
   *
   * @param {Element}         elm     - An element where classes are added.
   * @param {string|string[]} classes - Class names being added.
   * @param {boolean}         remove  - Whether to remove or add classes.
   */
  
  function addOrRemoveClasses(elm, classes, remove) {
    if (elm) {
      toArray(classes).forEach(function (name) {
        if (name) {
          elm.classList[remove ? 'remove' : 'add'](name);
        }
      });
    }
  }
  /**
   * Add classes to the element.
   *
   * @param {Element}          elm     - An element where classes are added.
   * @param {string|string[]}  classes - Class names being added.
   */
  
  
  function addClass(elm, classes) {
    addOrRemoveClasses(elm, classes, false);
  }
  /**
   * Remove a class from the element.
   *
   * @param {Element}         elm     - An element where classes are removed.
   * @param {string|string[]} classes - A class name being removed.
   */
  
  function removeClass(elm, classes) {
    addOrRemoveClasses(elm, classes, true);
  }
  /**
   * Verify if the provided element has the class or not.
   *
   * @param {Element} elm       - An element.
   * @param {string}  className - A class name.
   *
   * @return {boolean} - True if the element has the class or false if not.
   */
  
  function hasClass(elm, className) {
    return !!elm && elm.classList.contains(className);
  }
  /**
   * Set attribute to the given element.
   *
   * @param {Element}                 elm   - An element where an attribute is assigned.
   * @param {string}                  name  - Attribute name.
   * @param {string|number|boolean}   value - Attribute value.
   */
  
  function setAttribute(elm, name, value) {
    if (elm) {
      elm.setAttribute(name, value);
    }
  }
  /**
   * Get attribute from the given element.
   *
   * @param {Element} elm  - An element where an attribute is assigned.
   * @param {string}  name - Attribute name.
   *
   * @return {string} - The value of the given attribute if available. An empty string if not.
   */
  
  function getAttribute(elm, name) {
    return elm ? elm.getAttribute(name) : '';
  }
  /**
   * Remove attribute from the given element.
   *
   * @param {Element|Element[]} elms  - An element where an attribute is removed.
   * @param {string|string[]}      names - Attribute name.
   */
  
  function removeAttribute(elms, names) {
    toArray(names).forEach(function (name) {
      toArray(elms).forEach(function (elm) {
        return elm && elm.removeAttribute(name);
      });
    });
  }
  /**
   * Return the Rect object of the provided object.
   *
   * @param {Element} elm - An element.
   *
   * @return {ClientRect|DOMRect} - A rect object.
   */
  
  function getRect(elm) {
    return elm.getBoundingClientRect();
  }
  /**
   * Trigger the given callback after all images contained by the element are loaded.
   *
   * @param {Element}  elm      - Element that may contain images.
   * @param {Function} callback - Callback function fired right after all images are loaded.
   */
  
  function dom_loaded(elm, callback) {
    var images = elm.querySelectorAll('img');
    var length = images.length;
  
    if (length) {
      var count = 0;
      each(images, function (img) {
        img.onload = img.onerror = function () {
          if (++count === length) {
            callback();
          }
        };
      });
    } else {
      // Trigger the callback immediately if there is no image.
      callback();
    }
  }
  // CONCATENATED MODULE: ./src/js/constants/types.js
  /**
   * Export slider types.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * Normal slider.
   *
   * @type {string}
   */
  var SLIDE = 'slide';
  /**
   * Loop after the last slide and before the first one.
   *
   * @type {string}
   */
  
  var LOOP = 'loop';
  /**
   * The track doesn't move.
   *
   * @type {string}
   */
  
  var FADE = 'fade';
  // CONCATENATED MODULE: ./src/js/transitions/slide/index.js
  /**
   * The component for general slide effect transition.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  /**
   * The component for general slide effect transition.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var transitions_slide = (function (Splide, Components) {
    /**
     * Hold the list element.
     *
     * @type {Element}
     */
    var list;
    /**
     * Hold the onEnd callback function.
     *
     * @type {function}
     */
  
    var endCallback;
    return {
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        list = Components.Elements.list;
        Splide.on('transitionend', function (e) {
          if (e.target === list && endCallback) {
            endCallback();
          }
        }, list);
      },
  
      /**
       * Start transition.
       *
       * @param {number}   destIndex - Destination slide index that might be clone's.
       * @param {number}   newIndex  - New index.
       * @param {number}   prevIndex - Previous index.
       * @param {Object}   coord     - Destination coordinates.
       * @param {function} done      - Callback function must be invoked when transition is completed.
       */
      start: function start(destIndex, newIndex, prevIndex, coord, done) {
        var options = Splide.options;
        var edgeIndex = Components.Controller.edgeIndex;
        var speed = options.speed;
        endCallback = done;
  
        if (Splide.is(SLIDE)) {
          if (prevIndex === 0 && newIndex >= edgeIndex || prevIndex >= edgeIndex && newIndex === 0) {
            speed = options.rewindSpeed || speed;
          }
        }
  
        applyStyle(list, {
          transition: "transform " + speed + "ms " + options.easing,
          transform: "translate(" + coord.x + "px," + coord.y + "px)"
        });
      }
    };
  });
  // CONCATENATED MODULE: ./src/js/transitions/fade/index.js
  /**
   * The component for fade transition.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  /**
   * The component for fade transition.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var fade = (function (Splide, Components) {
    var Fade = {
      /**
       * Called when the component is mounted.
       * Apply transition style to the first slide.
       */
      mount: function mount() {
        apply(Splide.index);
      },
  
      /**
       * Start transition.
       *
       * @param {number}    destIndex - Destination slide index that might be clone's.
       * @param {number}    newIndex  - New index.
       * @param {number}    prevIndex - Previous index.
       * @param {Object}    coord     - Destination coordinates.
       * @param {function}  done      - Callback function must be invoked when transition is completed.
       */
      start: function start(destIndex, newIndex, prevIndex, coord, done) {
        var track = Components.Elements.track;
        applyStyle(track, {
          height: unit(track.clientHeight)
        });
        apply(newIndex);
        done();
        applyStyle(track, {
          height: ''
        });
      }
    };
    /**
     * Apply transition style to the slide specified by the given index.
     *
     * @param {number} index - A slide index.
     */
  
    function apply(index) {
      var options = Splide.options;
      applyStyle(Components.Elements.slides[index], {
        transition: "opacity " + options.speed + "ms " + options.easing
      });
    }
  
    return Fade;
  });
  // CONCATENATED MODULE: ./src/js/transitions/index.js
  /**
   * Export transition components.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  // CONCATENATED MODULE: ./src/js/core/composer.js
  /**
   * Provide a function for composing components.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  /**
   * Compose components.
   *
   * @param {Splide}   Splide     - Splide instance.
   * @param {Object}   Components - Additional components.
   * @param {function} Transition - Change component for transition.
   *
   * @return {Object} - An object containing all components.
   */
  
  function compose(Splide, Components, Transition) {
    var components = {};
    each(Components, function (Component, name) {
      components[name] = Component(Splide, components, name.toLowerCase());
    });
  
    if (!Transition) {
      Transition = Splide.is(FADE) ? fade : transitions_slide;
    }
  
    components.Transition = Transition(Splide, components);
    return components;
  }
  // CONCATENATED MODULE: ./src/js/utils/error.js
  /**
   * Utility functions for outputting logs.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * Prefix of an error massage.
   *
   * @type {string}
   */
  var MESSAGE_PREFIX = '[SPLIDE]';
  /**
   * Display an error message on the browser console.
   *
   * @param {string} message - An error message.
   */
  
  function error_error(message) {
    console.error(MESSAGE_PREFIX + " " + message);
  }
  /**
   * Check existence of the given object and throw an error if it doesn't.
   *
   * @throws {Error}
   *
   * @param {*}      subject - A subject to be confirmed.
   * @param {string} message - An error message.
   */
  
  function exist(subject, message) {
    if (!subject) {
      throw new Error(message);
    }
  }
  // CONCATENATED MODULE: ./src/js/constants/classes.js
  /**
   * Export class names.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * A root class name.
   *
   * @type {string}
   */
  var ROOT = 'splide';
  /**
   * The definition table of all classes for elements.
   * They might be modified by options.
   *
   * @type {Object}
   */
  
  var ELEMENT_CLASSES = {
    root: ROOT,
    slider: ROOT + "__slider",
    track: ROOT + "__track",
    list: ROOT + "__list",
    slide: ROOT + "__slide",
    container: ROOT + "__slide__container",
    arrows: ROOT + "__arrows",
    arrow: ROOT + "__arrow",
    prev: ROOT + "__arrow--prev",
    next: ROOT + "__arrow--next",
    pagination: ROOT + "__pagination",
    page: ROOT + "__pagination__page",
    clone: ROOT + "__slide--clone",
    progress: ROOT + "__progress",
    bar: ROOT + "__progress__bar",
    autoplay: ROOT + "__autoplay",
    play: ROOT + "__play",
    pause: ROOT + "__pause",
    spinner: ROOT + "__spinner",
    sr: ROOT + "__sr"
  };
  /**
   * Definitions of status classes.
   *
   * @type {Object}
   */
  
  var STATUS_CLASSES = {
    active: 'is-active',
    visible: 'is-visible',
    loading: 'is-loading'
  };
  // CONCATENATED MODULE: ./src/js/constants/i18n.js
  /**
   * Export i18n texts as object.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * Texts for i18n.
   *
   * @type {Object}
   */
  var I18N = {
    prev: 'Previous slide',
    next: 'Next slide',
    first: 'Go to first slide',
    last: 'Go to last slide',
    slideX: 'Go to slide %s',
    pageX: 'Go to page %s',
    play: 'Start autoplay',
    pause: 'Pause autoplay'
  };
  // CONCATENATED MODULE: ./src/js/constants/defaults.js
  /**
   * Export default options.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  var DEFAULTS = {
    /**
     * Determine a slider type.
     * - 'slide': Regular slider.
     * - 'loop' : Carousel slider.
     * - 'fade' : Change slides with fade transition. perPage, drag options are ignored.
     *
     * @type {string}
     */
    type: 'slide',
  
    /**
     * Whether to rewind a slider before the first slide or after the last one.
     * In "loop" mode, this option is ignored.
     *
     * @type {boolean}
     */
    rewind: false,
  
    /**
     * Transition speed in milliseconds.
     *
     * @type {number}
     */
    speed: 400,
  
    /**
     * Transition speed on rewind in milliseconds.
     *
     * @type {number}
     */
    rewindSpeed: 0,
  
    /**
     * Whether to prevent any actions while a slider is transitioning.
     * If false, navigation, drag and swipe work while the slider is running.
     * Even so, it will be forced to wait for transition in some cases in the loop mode to shift a slider.
     *
     * @type {boolean}
     */
    waitForTransition: true,
  
    /**
     * Define slider max width.
     *
     * @type {number}
     */
    width: 0,
  
    /**
     * Define slider height.
     *
     * @type {number}
     */
    height: 0,
  
    /**
     * Fix width of slides. CSS format is allowed such as 10em, 80% or 80vw.
     * perPage number will be ignored when this option is falsy.
     *
     * @type {number|string}
     */
    fixedWidth: 0,
  
    /**
     * Fix height of slides. CSS format is allowed such as 10em, 80vh but % unit is not accepted.
     * heightRatio option will be ignored when this option is falsy.
     *
     * @type {number|string}
     */
    fixedHeight: 0,
  
    /**
     * Determine height of slides by ratio to a slider width.
     * This will be ignored when the fixedHeight is provided.
     *
     * @type {number}
     */
    heightRatio: 0,
  
    /**
     * If true, slide width will be determined by the element width itself.
     * - perPage/perMove should be 1.
     *
     * @type {boolean}
     */
    autoWidth: false,
  
    /**
     * If true, slide height will be determined by the element width itself.
     * - perPage/perMove should be 1.
     *
     * @type {boolean}
     */
    autoHeight: false,
  
    /**
     * Determine how many slides should be displayed per page.
     *
     * @type {number}
     */
    perPage: 1,
  
    /**
     * Determine how many slides should be moved when a slider goes to next or perv.
     *
     * @type {number}
     */
    perMove: 0,
  
    /**
     * Determine manually how many clones should be generated on the left and right side.
     * The total number of clones will be twice of this number.
     *
     * @type {number}
     */
    clones: 0,
  
    /**
     * Start index.
     *
     * @type {number}
     */
    start: 0,
  
    /**
     * Determine which slide should be focused if there are multiple slides in a page.
     * A string "center" is acceptable for centering slides.
     *
     * @type {boolean|number|string}
     */
    focus: false,
  
    /**
     * Gap between slides. CSS format is allowed such as 1em.
     *
     * @type {number|string}
     */
    gap: 0,
  
    /**
     * Set padding-left/right in horizontal mode or padding-top/bottom in vertical one.
     * Give a single value to set a same size for both sides or
     * do an object for different sizes.
     * Also, CSS format is allowed such as 1em.
     *
     * @example
     * - 10: Number
     * - '1em': CSS format.
     * - { left: 0, right: 20 }: Object for different sizes in horizontal mode.
     * - { top: 0, bottom: 20 }: Object for different sizes in vertical mode.
     *
     * @type {number|string|Object}
     */
    padding: 0,
  
    /**
     * Whether to append arrows.
     *
     * @type {boolean}
     */
    arrows: true,
  
    /**
     * Change the arrow SVG path like 'm7.61 0.807-2.12...'.
     *
     * @type {string}
     */
    arrowPath: '',
  
    /**
     * Whether to append pagination(indicator dots) or not.
     *
     * @type {boolean}
     */
    pagination: true,
  
    /**
     * Activate autoplay.
     *
     * @type {boolean}
     */
    autoplay: false,
  
    /**
     * Autoplay interval in milliseconds.
     *
     * @type {number}
     */
    interval: 5000,
  
    /**
     * Whether to stop autoplay when a slider is hovered.
     *
     * @type {boolean}
     */
    pauseOnHover: true,
  
    /**
     * Whether to stop autoplay when a slider elements are focused.
     * True is recommended for accessibility.
     *
     * @type {boolean}
     */
    pauseOnFocus: true,
  
    /**
     * Whether to reset progress of the autoplay timer when resumed.
     *
     * @type {boolean}
     */
    resetProgress: true,
  
    /**
     * Loading images lazily.
     * Image src must be provided by a data-splide-lazy attribute.
     *
     * - false: Do nothing.
     * - 'nearby': Only images around an active slide will be loaded.
     * - 'sequential': All images will be sequentially loaded.
     *
     * @type {boolean|string}
     */
    lazyLoad: false,
  
    /**
     * This option works only when a lazyLoad option is "nearby".
     * Determine how many pages(not slides) around an active slide should be loaded beforehand.
     *
     * @type {number}
     */
    preloadPages: 1,
  
    /**
     * Easing for CSS transition. For example, linear, ease or cubic-bezier().
     *
     * @type {string}
     */
    easing: 'cubic-bezier(.42,.65,.27,.99)',
  
    /**
     * Whether to enable keyboard shortcuts
     * - true or 'global': Listen to keydown event of the document.
     * - 'focused': Listen to the keydown event of the slider root element. tabindex="0" will be added to the element.
     * - false: Disable keyboard shortcuts.
     *
     * @type {boolean|string}
     */
    keyboard: 'global',
  
    /**
     * Whether to allow mouse drag and touch swipe.
     *
     * @type {boolean}
     */
    drag: true,
  
    /**
     * The angle threshold for drag.
     * The slider starts moving only when the drag angle is less than this threshold.
     *
     * @type {number}
     */
    dragAngleThreshold: 30,
  
    /**
     * Distance threshold for determining if the action is "flick" or "swipe".
     * When a drag distance is over this value, the action will be treated as "swipe", not "flick".
     *
     * @type {number}
     */
    swipeDistanceThreshold: 150,
  
    /**
     * Velocity threshold for determining if the action is "flick" or "swipe".
     * Around 0.5 is recommended.
     *
     * @type {number}
     */
    flickVelocityThreshold: .6,
  
    /**
     * Determine power of flick. The larger number this is, the farther a slider runs by flick.
     * Around 500 is recommended.
     *
     * @type {number}
     */
    flickPower: 600,
  
    /**
     * Limit a number of pages to move by flick.
     *
     * @type {number}
     */
    flickMaxPages: 1,
  
    /**
     * Slider direction.
     * - 'ltr': Left to right.
     * - 'rtl': Right to left.
     * - 'ttb': Top to bottom.
     *
     * @type {string}
     */
    direction: 'ltr',
  
    /**
     * Set img src to background-image of its parent element.
     * Images with various sizes can be displayed as same dimension without cropping work.
     * fixedHeight or heightRatio is required.
     *
     * @type {boolean}
     */
    cover: false,
  
    /**
     * Whether to enable accessibility(aria and screen reader texts) or not.
     *
     * @type {boolean}
     */
    accessibility: true,
  
    /**
     * Whether to add tabindex="0" to visible slides or not.
     *
     * @type {boolean}
     */
    slideFocus: true,
  
    /**
     * Determine if a slider is navigation for another.
     * Use "sync" API to synchronize two sliders.
     *
     * @type {boolean}
     */
    isNavigation: false,
  
    /**
     * Whether to trim spaces before the fist slide or after the last one when "focus" is not 0.
     *
     * @type {boolean}
     */
    trimSpace: true,
  
    /**
     * The "is-active" class is added after transition as default.
     * If true, it will be added before move.
     *
     * @type {boolean}
     */
    updateOnMove: false,
  
    /**
     * Throttle duration in milliseconds for the resize event.
     *
     * @type {number}
     */
    throttle: 100,
  
    /**
     * Whether to destroy a slider or not.
     *
     * @type {boolean}
     */
    destroy: false,
  
    /**
     * Options for specific breakpoints.
     *
     * @example
     * {
     *   1000: {
     *     perPage: 3,
     *     gap: 20
     *   },
     *   600: {
     *     perPage: 1,
     *     gap: 5,
     *   }
     * }
     *
     * @type {boolean|Object}
     */
    breakpoints: false,
  
    /**
     * Collection of class names.
     *
     * @see ./classes.js
     *
     * @type {Object}
     */
    classes: ELEMENT_CLASSES,
  
    /**
     * Collection of i18n texts.
     *
     * @see ./i18n.js
     *
     * @type {Object}
     */
    i18n: I18N
  };
  // CONCATENATED MODULE: ./src/js/constants/states.js
  /**
   * Export state constants.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * Splide has been just created.
   *
   * @type {number}
   */
  var CREATED = 1;
  /**
   * All components have been mounted and initialized.
   *
   * @type {number}
   */
  
  var MOUNTED = 2;
  /**
   * Splide is ready for transition.
   *
   * @type {number}
   */
  
  var IDLE = 3;
  /**
   * Splide is moving.
   *
   * @type {number}
   */
  
  var MOVING = 4;
  /**
   * Splide is moving.
   *
   * @type {number}
   */
  
  var DESTROYED = 5;
  // CONCATENATED MODULE: ./src/js/splide.js
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  
  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
  
  /**
   * The main class for applying Splide to an element.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  
  
  
  
  
  /**
   * The main class for applying Splide to an element,
   * providing some APIs to control the behavior.
   */
  
  var splide_Splide = /*#__PURE__*/function () {
    /**
     * Splide constructor.
     *
     * @throws {Error} When the given root element or selector is invalid.
     *
     * @param {Element|string}  root       - A selector for a root element or an element itself.
     * @param {Object}          options    - Optional. Options to change default behaviour.
     * @param {Object}          Components - Optional. Components.
     */
    function Splide(root, options, Components) {
      if (options === void 0) {
        options = {};
      }
  
      if (Components === void 0) {
        Components = {};
      }
  
      this.root = root instanceof Element ? root : document.querySelector(root);
      exist(this.root, 'An invalid element/selector was given.');
      this.Components = null;
      this.Event = core_event();
      this.State = state(CREATED);
      this.STATES = states_namespaceObject;
      this._o = merge(DEFAULTS, options);
      this._i = 0;
      this._c = Components;
      this._e = {}; // Extensions
  
      this._t = null; // Transition
    }
    /**
     * Compose and mount components.
     *
     * @param {Object}   Extensions - Optional. Additional components.
     * @param {function} Transition - Optional. Set a custom transition component.
     *
     * @return {Splide|undefined} - This instance or undefined if an exception occurred.
     */
  
  
    var _proto = Splide.prototype;
  
    _proto.mount = function mount(Extensions, Transition) {
      var _this = this;
  
      if (Extensions === void 0) {
        Extensions = this._e;
      }
  
      if (Transition === void 0) {
        Transition = this._t;
      }
  
      // Reset the state.
      this.State.set(CREATED);
      this._e = Extensions;
      this._t = Transition;
      this.Components = compose(this, merge(this._c, Extensions), Transition);
  
      try {
        each(this.Components, function (component, key) {
          var required = component.required;
  
          if (required === undefined || required) {
            component.mount && component.mount();
          } else {
            delete _this.Components[key];
          }
        });
      } catch (e) {
        error_error(e.message);
        return;
      }
  
      var State = this.State;
      State.set(MOUNTED);
      each(this.Components, function (component) {
        component.mounted && component.mounted();
      });
      this.emit('mounted');
      State.set(IDLE);
      this.emit('ready');
      applyStyle(this.root, {
        visibility: 'visible'
      });
      this.on('move drag', function () {
        return State.set(MOVING);
      }).on('moved dragged', function () {
        return State.set(IDLE);
      });
      return this;
    }
    /**
     * Set sync target.
     *
     * @param {Splide} splide - A Splide instance.
     *
     * @return {Splide} - This instance.
     */
    ;
  
    _proto.sync = function sync(splide) {
      this.sibling = splide;
      return this;
    }
    /**
     * Register callback fired on the given event(s).
     *
     * @param {string}   events  - An event name. Use space to separate multiple events.
     *                             Also, namespace is accepted by dot, such as 'resize.{namespace}'.
     * @param {function} handler - A callback function.
     * @param {Element}  elm     - Optional. Native event will be listened to when this arg is provided.
     * @param {Object}   options - Optional. Options for addEventListener.
     *
     * @return {Splide} - This instance.
     */
    ;
  
    _proto.on = function on(events, handler, elm, options) {
      if (elm === void 0) {
        elm = null;
      }
  
      if (options === void 0) {
        options = {};
      }
  
      this.Event.on(events, handler, elm, options);
      return this;
    }
    /**
     * Unsubscribe the given event.
     *
     * @param {string}  events - A event name.
     * @param {Element} elm    - Optional. removeEventListener() will be called when this arg is provided.
     *
     * @return {Splide} - This instance.
     */
    ;
  
    _proto.off = function off(events, elm) {
      if (elm === void 0) {
        elm = null;
      }
  
      this.Event.off(events, elm);
      return this;
    }
    /**
     * Emit an event.
     *
     * @param {string} event - An event name.
     * @param {*}      args  - Any number of arguments passed to handlers.
     */
    ;
  
    _proto.emit = function emit(event) {
      var _this$Event;
  
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
  
      (_this$Event = this.Event).emit.apply(_this$Event, [event].concat(args));
  
      return this;
    }
    /**
     * Go to the slide specified by the given control.
     *
     * @param {string|number} control - A control pattern.
     * @param {boolean}       wait    - Optional. Whether to wait for transition.
     */
    ;
  
    _proto.go = function go(control, wait) {
      if (wait === void 0) {
        wait = this.options.waitForTransition;
      }
  
      if (this.State.is(IDLE) || this.State.is(MOVING) && !wait) {
        this.Components.Controller.go(control, false);
      }
  
      return this;
    }
    /**
     * Verify whether the slider type is the given one or not.
     *
     * @param {string} type - A slider type.
     *
     * @return {boolean} - True if the slider type is the provided type or false if not.
     */
    ;
  
    _proto.is = function is(type) {
      return type === this._o.type;
    }
    /**
     * Insert a slide.
     *
     * @param {Element|string} slide - A slide element to be added.
     * @param {number}         index - A slide will be added at the position.
     */
    ;
  
    _proto.add = function add(slide, index) {
      if (index === void 0) {
        index = -1;
      }
  
      this.Components.Elements.add(slide, index, this.refresh.bind(this));
      return this;
    }
    /**
     * Remove the slide designated by the index.
     *
     * @param {number} index - A slide index.
     */
    ;
  
    _proto.remove = function remove(index) {
      this.Components.Elements.remove(index);
      this.refresh();
      return this;
    }
    /**
     * Destroy all Slide objects and clones and recreate them again.
     */
    ;
  
    _proto.refresh = function refresh() {
      this.emit('refresh').emit('resize');
      return this;
    }
    /**
     * Destroy the Splide.
     * "Completely" boolean is mainly for breakpoints.
     *
     * @param {boolean} completely - Destroy completely.
     */
    ;
  
    _proto.destroy = function destroy(completely) {
      var _this2 = this;
  
      if (completely === void 0) {
        completely = true;
      }
  
      // Postpone destroy because it should be done after mount.
      if (this.State.is(CREATED)) {
        this.on('ready', function () {
          return _this2.destroy(completely);
        });
        return;
      }
  
      values(this.Components).reverse().forEach(function (component) {
        component.destroy && component.destroy(completely);
      });
      this.emit('destroy', completely); // Destroy all event handlers, including ones for native events.
  
      this.Event.destroy();
      this.State.set(DESTROYED);
      return this;
    }
    /**
     * Return the current slide index.
     *
     * @return {number} - The current slide index.
     // */
    ;
  
    _createClass(Splide, [{
      key: "index",
      get: function get() {
        return this._i;
      }
      /**
       * Set the current slide index.
       *
       * @param {number|string} index - A new index.
       */
      ,
      set: function set(index) {
        this._i = parseInt(index);
      }
      /**
       * Return length of slides.
       * This is an alias of Elements.length.
       *
       * @return {number} - A number of slides.
       */
  
    }, {
      key: "length",
      get: function get() {
        return this.Components.Elements.length;
      }
      /**
       * Return options.
       *
       * @return {Object} - Options object.
       */
  
    }, {
      key: "options",
      get: function get() {
        return this._o;
      }
      /**
       * Set options with merging the given object to the current one.
       *
       * @param {Object} options - New options.
       */
      ,
      set: function set(options) {
        var created = this.State.is(CREATED);
  
        if (!created) {
          this.emit('update');
        }
  
        this._o = merge(this._o, options);
  
        if (!created) {
          this.emit('updated', this._o);
        }
      }
      /**
       * Return the class list.
       * This is an alias of Splide.options.classList.
       *
       * @return {Object} - An object containing all class list.
       */
  
    }, {
      key: "classes",
      get: function get() {
        return this._o.classes;
      }
      /**
       * Return the i18n strings.
       * This is an alias of Splide.options.i18n.
       *
       * @return {Object} - An object containing all i18n strings.
       */
  
    }, {
      key: "i18n",
      get: function get() {
        return this._o.i18n;
      }
    }]);
  
    return Splide;
  }();
  
  
  // CONCATENATED MODULE: ./src/js/components/options/index.js
  /**
   * The component for initializing options.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  /**
   * The component for initializing options.
   *
   * @param {Splide} Splide - A Splide instance.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var components_options = (function (Splide) {
    /**
     * Retrieve options from the data attribute.
     * Note that IE10 doesn't support dataset property.
     *
     * @type {string}
     */
    var options = getAttribute(Splide.root, 'data-splide');
  
    if (options) {
      try {
        Splide.options = JSON.parse(options);
      } catch (e) {
        error_error(e.message);
      }
    }
  
    return {
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        if (Splide.State.is(CREATED)) {
          Splide.index = Splide.options.start;
        }
      }
    };
  });
  // CONCATENATED MODULE: ./src/js/constants/directions.js
  /**
   * Export layout modes.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * Enumerate slides from left to right.
   *
   * @type {string}
   */
  var LTR = 'ltr';
  /**
   * Enumerate slides from right to left.
   *
   * @type {string}
   */
  
  var RTL = 'rtl';
  /**
   * Enumerate slides in a col.
   *
   * @type {string}
   */
  
  var TTB = 'ttb';
  // CONCATENATED MODULE: ./src/js/components/elements/slide.js
  /**
   * The sub component for handling each slide.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  
  
  
  /**
   * Events for restoring original styles.
   *
   * @type {string}
   */
  
  var STYLE_RESTORE_EVENTS = 'update.slide';
  /**
   * The sub component for handling each slide.
   *
   * @param {Splide}  Splide    - A Splide instance.
   * @param {number}  index     - An unique slide index.
   * @param {number}  realIndex - Clones should pass a real slide index.
   * @param {Element} slide     - A slide element.
   *
   * @return {Object} - The sub component object.
   */
  
  /* harmony default export */ var elements_slide = (function (Splide, index, realIndex, slide) {
    /**
     * Whether to update "is-active" class before or after transition.
     *
     * @type {boolean}
     */
    var updateOnMove = Splide.options.updateOnMove;
    /**
     * Events when the slide status is updated.
     * Append a namespace to remove listeners later.
     *
     * @type {string}
     */
  
    var STATUS_UPDATE_EVENTS = 'ready.slide updated.slide resize.slide moved.slide' + (updateOnMove ? ' move.slide' : '');
    /**
     * Slide sub component object.
     *
     * @type {Object}
     */
  
    var Slide = {
      /**
       * Slide element.
       *
       * @type {Element}
       */
      slide: slide,
  
      /**
       * Slide index.
       *
       * @type {number}
       */
      index: index,
  
      /**
       * Real index for clones.
       *
       * @type {number}
       */
      realIndex: realIndex,
  
      /**
       * Container element if available.
       *
       * @type {Element|undefined}
       */
      container: child(slide, Splide.classes.container),
  
      /**
       * Whether this is a cloned slide or not.
       *
       * @type {boolean}
       */
      isClone: realIndex > -1,
  
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        var _this = this;
  
        if (!this.isClone) {
          slide.id = Splide.root.id + "-slide" + pad(index + 1);
        }
  
        Splide.on(STATUS_UPDATE_EVENTS, function () {
          return _this.update();
        }).on(STYLE_RESTORE_EVENTS, restoreStyles).on('click', function () {
          return Splide.emit('click', _this);
        }, slide);
        /*
         * Add "is-active" class to a clone element temporarily
         * and it will be removed on "moved" event.
         */
  
        if (updateOnMove) {
          Splide.on('move.slide', function (newIndex) {
            if (newIndex === realIndex) {
              _update(true, false);
            }
          });
        } // Make sure the slide is shown.
  
  
        applyStyle(slide, {
          display: ''
        }); // Hold the original styles.
  
        this.styles = getAttribute(slide, 'style') || '';
      },
  
      /**
       * Destroy.
       */
      destroy: function destroy() {
        Splide.off(STATUS_UPDATE_EVENTS).off(STYLE_RESTORE_EVENTS).off('click', slide);
        removeClass(slide, values(STATUS_CLASSES));
        restoreStyles();
        removeAttribute(this.container, 'style');
      },
  
      /**
       * Update active and visible status.
       */
      update: function update() {
        _update(this.isActive(), false);
  
        _update(this.isVisible(), true);
      },
  
      /**
       * Check whether this slide is active or not.
       *
       * @return {boolean} - True if the slide is active or false if not.
       */
      isActive: function isActive() {
        return Splide.index === index;
      },
  
      /**
       * Check whether this slide is visible in the viewport or not.
       *
       * @return {boolean} - True if the slide is visible or false if not.
       */
      isVisible: function isVisible() {
        var active = this.isActive();
  
        if (Splide.is(FADE) || active) {
          return active;
        }
  
        var trackRect = getRect(Splide.Components.Elements.track);
        var slideRect = getRect(slide);
  
        if (Splide.options.direction === TTB) {
          return trackRect.top <= slideRect.top && slideRect.bottom <= trackRect.bottom;
        }
  
        return trackRect.left <= slideRect.left && slideRect.right <= trackRect.right;
      },
  
      /**
       * Calculate how far this slide is from another slide and
       * return true if the distance is within the given number.
       *
       * @param {number} from   - Index of a target slide.
       * @param {number} within - True if the slide is within this number.
       *
       * @return {boolean} - True if the slide is within the number or false otherwise.
       */
      isWithin: function isWithin(from, within) {
        var diff = Math.abs(from - index);
  
        if (!Splide.is(SLIDE) && !this.isClone) {
          diff = Math.min(diff, Splide.length - diff);
        }
  
        return diff < within;
      }
    };
    /**
     * Update classes for activity or visibility.
     *
     * @param {boolean} active        - Is active/visible or not.
     * @param {boolean} forVisibility - Toggle classes for activity or visibility.
     */
  
    function _update(active, forVisibility) {
      var type = forVisibility ? 'visible' : 'active';
      var className = STATUS_CLASSES[type];
  
      if (active) {
        addClass(slide, className);
        Splide.emit("" + type, Slide);
      } else {
        if (hasClass(slide, className)) {
          removeClass(slide, className);
          Splide.emit("" + (forVisibility ? 'hidden' : 'inactive'), Slide);
        }
      }
    }
    /**
     * Restore the original styles.
     */
  
  
    function restoreStyles() {
      setAttribute(slide, 'style', Slide.styles);
    }
  
    return Slide;
  });
  // CONCATENATED MODULE: ./src/js/components/elements/index.js
  /**
   * The component for main elements.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  
  
  /**
   * The property name for UID stored in a window object.
   *
   * @type {string}
   */
  
  var UID_NAME = 'uid';
  /**
   * The component for main elements.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var components_elements = (function (Splide, Components) {
    /**
     * Hold the root element.
     *
     * @type {Element}
     */
    var root = Splide.root;
    /**
     * Hold the class list.
     *
     * @type {Object}
     */
  
    var classes = Splide.classes;
    /**
     * Store Slide objects.
     *
     * @type {Array}
     */
  
    var Slides = [];
    /*
     * Assign unique ID to the root element if it doesn't have the one.
     * Note that IE doesn't support padStart() to fill the uid by 0.
     */
  
    if (!root.id) {
      window.splide = window.splide || {};
      var uid = window.splide[UID_NAME] || 0;
      window.splide[UID_NAME] = ++uid;
      root.id = "splide" + pad(uid);
    }
    /**
     * Elements component object.
     *
     * @type {Object}
     */
  
  
    var Elements = {
      /**
       * Called when the component is mounted.
       * Collect main elements and store them as member properties.
       */
      mount: function mount() {
        var _this = this;
  
        this.init();
        Splide.on('refresh', function () {
          _this.destroy();
  
          _this.init();
        }).on('updated', function () {
          removeClass(root, getClasses());
          addClass(root, getClasses());
        });
      },
  
      /**
       * Destroy.
       */
      destroy: function destroy() {
        Slides.forEach(function (Slide) {
          Slide.destroy();
        });
        Slides = [];
        removeClass(root, getClasses());
      },
  
      /**
       * Initialization.
       */
      init: function init() {
        var _this2 = this;
  
        collect();
        addClass(root, getClasses());
        this.slides.forEach(function (slide, index) {
          _this2.register(slide, index, -1);
        });
      },
  
      /**
       * Register a slide to create a Slide object and handle its behavior.
       *
       * @param {Element} slide     - A slide element.
       * @param {number}  index     - A unique index. This can be negative.
       * @param {number}  realIndex - A real index for clones. Set -1 for real slides.
       */
      register: function register(slide, index, realIndex) {
        var SlideObject = elements_slide(Splide, index, realIndex, slide);
        SlideObject.mount();
        Slides.push(SlideObject);
      },
  
      /**
       * Return the Slide object designated by the index.
       * Note that "find" is not supported by IE.
       *
       * @return {Object|undefined} - A Slide object if available. Undefined if not.
       */
      getSlide: function getSlide(index) {
        return Slides.filter(function (Slide) {
          return Slide.index === index;
        })[0];
      },
  
      /**
       * Return all Slide objects.
       *
       * @param {boolean} includeClones - Whether to include cloned slides or not.
       *
       * @return {Object[]} - Slide objects.
       */
      getSlides: function getSlides(includeClones) {
        return includeClones ? Slides : Slides.filter(function (Slide) {
          return !Slide.isClone;
        });
      },
  
      /**
       * Return Slide objects belonging to the given page.
       *
       * @param {number} page - A page number.
       *
       * @return {Object[]} - An array containing Slide objects.
       */
      getSlidesByPage: function getSlidesByPage(page) {
        var idx = Components.Controller.toIndex(page);
        var options = Splide.options;
        var max = options.focus !== false ? 1 : options.perPage;
        return Slides.filter(function (_ref) {
          var index = _ref.index;
          return idx <= index && index < idx + max;
        });
      },
  
      /**
       * Insert a slide to a slider.
       * Need to refresh Splide after adding a slide.
       *
       * @param {Node|string} slide    - A slide element to be added.
       * @param {number}      index    - A slide will be added at the position.
       * @param {Function}    callback - Called right after the slide is added to the DOM tree.
       */
      add: function add(slide, index, callback) {
        if (typeof slide === 'string') {
          slide = domify(slide);
        }
  
        if (slide instanceof Element) {
          var ref = this.slides[index]; // This will be removed in mount() of a Slide component.
  
          applyStyle(slide, {
            display: 'none'
          });
  
          if (ref) {
            before(slide, ref);
            this.slides.splice(index, 0, slide);
          } else {
            append(this.list, slide);
            this.slides.push(slide);
          }
  
          dom_loaded(slide, function () {
            callback && callback(slide);
          });
        }
      },
  
      /**
       * Remove a slide from a slider.
       * Need to refresh Splide after removing a slide.
       *
       * @param index - Slide index.
       */
      remove: function remove(index) {
        dom_remove(this.slides.splice(index, 1)[0]);
      },
  
      /**
       * Trigger the provided callback for each Slide object.
       *
       * @param {Function} callback - A callback function. The first argument will be the Slide object.
       */
      each: function each(callback) {
        Slides.forEach(callback);
      },
  
      /**
       * Return slides length without clones.
       *
       * @return {number} - Slide length.
       */
      get length() {
        return this.slides.length;
      },
  
      /**
       * Return "SlideObjects" length including clones.
       *
       * @return {number} - Slide length including clones.
       */
      get total() {
        return Slides.length;
      }
  
    };
    /**
     * Collect elements.
     */
  
    function collect() {
      Elements.slider = child(root, classes.slider);
      Elements.track = find(root, "." + classes.track);
      Elements.list = child(Elements.track, classes.list);
      exist(Elements.track && Elements.list, 'Track or list was not found.');
      Elements.slides = children(Elements.list, classes.slide);
      var arrows = findParts(classes.arrows);
      Elements.arrows = {
        prev: find(arrows, "." + classes.prev),
        next: find(arrows, "." + classes.next)
      };
      var autoplay = findParts(classes.autoplay);
      Elements.bar = find(findParts(classes.progress), "." + classes.bar);
      Elements.play = find(autoplay, "." + classes.play);
      Elements.pause = find(autoplay, "." + classes.pause);
      Elements.track.id = Elements.track.id || root.id + "-track";
      Elements.list.id = Elements.list.id || root.id + "-list";
    }
    /**
     * Return class names for the root element.
     */
  
  
    function getClasses() {
      var rootClass = classes.root;
      var options = Splide.options;
      return [rootClass + "--" + options.type, rootClass + "--" + options.direction, options.drag ? rootClass + "--draggable" : '', options.isNavigation ? rootClass + "--nav" : '', STATUS_CLASSES.active];
    }
    /**
     * Find parts only from children of the root or track.
     *
     * @return {Element} - A found element or undefined.
     */
  
  
    function findParts(className) {
      return child(root, className) || child(Elements.slider, className);
    }
  
    return Elements;
  });
  // CONCATENATED MODULE: ./src/js/components/controller/index.js
  /**
   * The component for controlling the track.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  var floor = Math.floor;
  /**
   * The component for controlling the track.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var controller = (function (Splide, Components) {
    /**
     * Store current options.
     *
     * @type {Object}
     */
    var options;
    /**
     * True if the slide is LOOP mode.
     *
     * @type {boolean}
     */
  
    var isLoop;
    /**
     * Controller component object.
     *
     * @type {Object}
     */
  
    var Controller = {
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        options = Splide.options;
        isLoop = Splide.is(LOOP);
        bind();
      },
  
      /**
       * Make track run by the given control.
       * - "+{i}" : Increment the slide index by i.
       * - "-{i}" : Decrement the slide index by i.
       * - "{i}"  : Go to the slide whose index is i.
       * - ">"    : Go to next page.
       * - "<"    : Go to prev page.
       * - ">{i}" : Go to page i.
       *
       * @param {string|number} control  - A control pattern.
       * @param {boolean}       silently - Go to the destination without event emission.
       */
      go: function go(control, silently) {
        var destIndex = this.trim(this.parse(control));
        Components.Track.go(destIndex, this.rewind(destIndex), silently);
      },
  
      /**
       * Parse the given control and return the destination index for the track.
       *
       * @param {string} control - A control target pattern.
       *
       * @return {number} - A parsed target.
       */
      parse: function parse(control) {
        var index = Splide.index;
        var matches = String(control).match(/([+\-<>]+)(\d+)?/);
        var indicator = matches ? matches[1] : '';
        var number = matches ? parseInt(matches[2]) : 0;
  
        switch (indicator) {
          case '+':
            index += number || 1;
            break;
  
          case '-':
            index -= number || 1;
            break;
  
          case '>':
          case '<':
            index = parsePage(number, index, indicator === '<');
            break;
  
          default:
            index = parseInt(control);
        }
  
        return index;
      },
  
      /**
       * Compute index from the given page number.
       *
       * @param {number} page - Page number.
       *
       * @return {number} - A computed page number.
       */
      toIndex: function toIndex(page) {
        if (hasFocus()) {
          return page;
        }
  
        var length = Splide.length;
        var perPage = options.perPage;
        var index = page * perPage;
        index = index - (this.pageLength * perPage - length) * floor(index / length); // Adjustment for the last page.
  
        if (length - perPage <= index && index < length) {
          index = length - perPage;
        }
  
        return index;
      },
  
      /**
       * Compute page number from the given slide index.
       *
       * @param {number} index - Slide index.
       *
       * @return {number} - A computed page number.
       */
      toPage: function toPage(index) {
        if (hasFocus()) {
          return index;
        }
  
        var length = Splide.length;
        var perPage = options.perPage; // Make the last "perPage" number of slides belong to the last page.
  
        if (length - perPage <= index && index < length) {
          return floor((length - 1) / perPage);
        }
  
        return floor(index / perPage);
      },
  
      /**
       * Trim the given index according to the current mode.
       * Index being returned could be less than 0 or greater than the length in Loop mode.
       *
       * @param {number} index - An index being trimmed.
       *
       * @return {number} - A trimmed index.
       */
      trim: function trim(index) {
        if (!isLoop) {
          index = options.rewind ? this.rewind(index) : between(index, 0, this.edgeIndex);
        }
  
        return index;
      },
  
      /**
       * Rewind the given index if it's out of range.
       *
       * @param {number} index - An index.
       *
       * @return {number} - A rewound index.
       */
      rewind: function rewind(index) {
        var edge = this.edgeIndex;
  
        if (isLoop) {
          while (index > edge) {
            index -= edge + 1;
          }
  
          while (index < 0) {
            index += edge + 1;
          }
        } else {
          if (index > edge) {
            index = 0;
          } else if (index < 0) {
            index = edge;
          }
        }
  
        return index;
      },
  
      /**
       * Check if the direction is "rtl" or not.
       *
       * @return {boolean} - True if "rtl" or false if not.
       */
      isRtl: function isRtl() {
        return options.direction === RTL;
      },
  
      /**
       * Return the page length.
       *
       * @return {number} - Max page number.
       */
      get pageLength() {
        var length = Splide.length;
        return hasFocus() ? length : Math.ceil(length / options.perPage);
      },
  
      /**
       * Return the edge index.
       *
       * @return {number} - Edge index.
       */
      get edgeIndex() {
        var length = Splide.length;
  
        if (!length) {
          return 0;
        }
  
        if (hasFocus() || options.isNavigation || isLoop) {
          return length - 1;
        }
  
        return length - options.perPage;
      },
  
      /**
       * Return the index of the previous slide.
       *
       * @return {number} - The index of the previous slide if available. -1 otherwise.
       */
      get prevIndex() {
        var prev = Splide.index - 1;
  
        if (isLoop || options.rewind) {
          prev = this.rewind(prev);
        }
  
        return prev > -1 ? prev : -1;
      },
  
      /**
       * Return the index of the next slide.
       *
       * @return {number} - The index of the next slide if available. -1 otherwise.
       */
      get nextIndex() {
        var next = Splide.index + 1;
  
        if (isLoop || options.rewind) {
          next = this.rewind(next);
        }
  
        return Splide.index < next && next <= this.edgeIndex || next === 0 ? next : -1;
      }
  
    };
    /**
     * Listen to some events.
     */
  
    function bind() {
      Splide.on('move', function (newIndex) {
        Splide.index = newIndex;
      }).on('updated refresh', function (newOptions) {
        options = newOptions || options;
        Splide.index = between(Splide.index, 0, Controller.edgeIndex);
      });
    }
    /**
     * Verify if the focus option is available or not.
     *
     * @return {boolean} - True if a slider has the focus option.
     */
  
  
    function hasFocus() {
      return options.focus !== false;
    }
    /**
     * Return the next or previous page index computed by the page number and current index.
     *
     * @param {number}  number - Specify the page number.
     * @param {number}  index  - Current index.
     * @param {boolean} prev   - Prev or next.
     *
     * @return {number} - Slide index.
     */
  
  
    function parsePage(number, index, prev) {
      if (number > -1) {
        return Controller.toIndex(number);
      }
  
      var perMove = options.perMove;
      var sign = prev ? -1 : 1;
  
      if (perMove) {
        return index + perMove * sign;
      }
  
      return Controller.toIndex(Controller.toPage(index) + sign);
    }
  
    return Controller;
  });
  // CONCATENATED MODULE: ./src/js/components/track/index.js
  /**
   * The component for moving list in the track.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  
  
  var abs = Math.abs;
  /**
   * The component for moving list in the track.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var components_track = (function (Splide, Components) {
    /**
     * Hold the Layout component.
     *
     * @type {Object}
     */
    var Layout;
    /**
     * Hold the Layout component.
     *
     * @type {Object}
     */
  
    var Elements;
    /**
     * Store the list element.
     *
     * @type {Element}
     */
  
    var list;
    /**
     * Whether the current direction is vertical or not.
     *
     * @type {boolean}
     */
  
    var isVertical = Splide.options.direction === TTB;
    /**
     * Whether the slider type is FADE or not.
     *
     * @type {boolean}
     */
  
    var isFade = Splide.is(FADE);
    /**
     * This will be true while transitioning from the last index to the first one.
     *
     * @type {boolean}
     */
  
    var isLoopPending = false;
    /**
     * Sign for the direction. Only RTL mode uses the positive sign.
     *
     * @type {number}
     */
  
    var sign = Splide.options.direction === RTL ? 1 : -1;
    /**
     * Track component object.
     *
     * @type {Object}
     */
  
    var Track = {
      /**
       * Make public the sign defined locally.
       *
       * @type {number}
       */
      sign: sign,
  
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        Elements = Components.Elements;
        Layout = Components.Layout;
        list = Elements.list;
      },
  
      /**
       * Called after the component is mounted.
       * The resize event must be registered after the Layout's one is done.
       */
      mounted: function mounted() {
        var _this = this;
  
        if (!isFade) {
          this.jump(0);
          Splide.on('mounted resize updated', function () {
            _this.jump(Splide.index);
          });
        }
      },
  
      /**
       * Go to the given destination index.
       * After arriving there, the track is jump to the new index without animation, mainly for loop mode.
       *
       * @param {number}  destIndex - A destination index.
       *                              This can be negative or greater than slides length for reaching clones.
       * @param {number}  newIndex  - An actual new index. They are always same in Slide and Rewind mode.
       * @param {boolean} silently  - If true, suppress emitting events.
       */
      go: function go(destIndex, newIndex, silently) {
        var newPosition = getTrimmedPosition(destIndex);
        var prevIndex = Splide.index; // Prevent any actions while transitioning from the last index to the first one for jump.
  
        if (Splide.State.is(MOVING) && isLoopPending) {
          return;
        }
  
        isLoopPending = destIndex !== newIndex;
  
        if (!silently) {
          Splide.emit('move', newIndex, prevIndex, destIndex);
        }
  
        if (Math.abs(newPosition - this.position) >= 1 || isFade) {
          Components.Transition.start(destIndex, newIndex, prevIndex, this.toCoord(newPosition), function () {
            onTransitionEnd(destIndex, newIndex, prevIndex, silently);
          });
        } else {
          if (destIndex !== prevIndex && Splide.options.trimSpace === 'move') {
            Components.Controller.go(destIndex + destIndex - prevIndex, silently);
          } else {
            onTransitionEnd(destIndex, newIndex, prevIndex, silently);
          }
        }
      },
  
      /**
       * Move the track to the specified index.
       *
       * @param {number} index - A destination index where the track jumps.
       */
      jump: function jump(index) {
        this.translate(getTrimmedPosition(index));
      },
  
      /**
       * Set the list position by CSS translate property.
       *
       * @param {number} position - A new position value.
       */
      translate: function translate(position) {
        applyStyle(list, {
          transform: "translate" + (isVertical ? 'Y' : 'X') + "(" + position + "px)"
        });
      },
  
      /**
       * Cancel the transition and set the list position.
       * Also, loop the slider if necessary.
       */
      cancel: function cancel() {
        if (Splide.is(LOOP)) {
          this.shift();
        } else {
          // Ensure the current position.
          this.translate(this.position);
        }
  
        applyStyle(list, {
          transition: ''
        });
      },
  
      /**
       * Shift the slider if it exceeds borders on the edge.
       */
      shift: function shift() {
        var position = abs(this.position);
        var left = abs(this.toPosition(0));
        var right = abs(this.toPosition(Splide.length));
        var innerSize = right - left;
  
        if (position < left) {
          position += innerSize;
        } else if (position > right) {
          position -= innerSize;
        }
  
        this.translate(sign * position);
      },
  
      /**
       * Trim redundant spaces on the left or right edge if necessary.
       *
       * @param {number} position - Position value to be trimmed.
       *
       * @return {number} - Trimmed position.
       */
      trim: function trim(position) {
        if (!Splide.options.trimSpace || Splide.is(LOOP)) {
          return position;
        }
  
        var edge = sign * (Layout.totalSize() - Layout.size - Layout.gap);
        return between(position, edge, 0);
      },
  
      /**
       * Calculate the closest slide index from the given position.
       *
       * @param {number} position - A position converted to an slide index.
       *
       * @return {number} - The closest slide index.
       */
      toIndex: function toIndex(position) {
        var _this2 = this;
  
        var index = 0;
        var minDistance = Infinity;
        Elements.getSlides(true).forEach(function (Slide) {
          var slideIndex = Slide.index;
          var distance = abs(_this2.toPosition(slideIndex) - position);
  
          if (distance < minDistance) {
            minDistance = distance;
            index = slideIndex;
          }
        });
        return index;
      },
  
      /**
       * Return coordinates object by the given position.
       *
       * @param {number} position - A position value.
       *
       * @return {Object} - A coordinates object.
       */
      toCoord: function toCoord(position) {
        return {
          x: isVertical ? 0 : position,
          y: isVertical ? position : 0
        };
      },
  
      /**
       * Calculate the track position by a slide index.
       *
       * @param {number} index - Slide index.
       *
       * @return {Object} - Calculated position.
       */
      toPosition: function toPosition(index) {
        var position = Layout.totalSize(index) - Layout.slideSize(index) - Layout.gap;
        return sign * (position + this.offset(index));
      },
  
      /**
       * Return the current offset value, considering direction.
       *
       * @return {number} - Offset amount.
       */
      offset: function offset(index) {
        var focus = Splide.options.focus;
        var slideSize = Layout.slideSize(index);
  
        if (focus === 'center') {
          return -(Layout.size - slideSize) / 2;
        }
  
        return -(parseInt(focus) || 0) * (slideSize + Layout.gap);
      },
  
      /**
       * Return the current position.
       * This returns the correct position even while transitioning by CSS.
       *
       * @return {number} - Current position.
       */
      get position() {
        var prop = isVertical ? 'top' : 'left';
        return getRect(list)[prop] - getRect(Elements.track)[prop] - Layout.padding[prop];
      }
  
    };
    /**
     * Called whenever slides arrive at a destination.
     *
     * @param {number}  destIndex - A destination index.
     * @param {number}  newIndex  - A new index.
     * @param {number}  prevIndex - A previous index.
     * @param {boolean} silently  - If true, suppress emitting events.
     */
  
    function onTransitionEnd(destIndex, newIndex, prevIndex, silently) {
      applyStyle(list, {
        transition: ''
      });
      isLoopPending = false;
  
      if (!isFade) {
        Track.jump(newIndex);
      }
  
      if (!silently) {
        Splide.emit('moved', newIndex, prevIndex, destIndex);
      }
    }
    /**
     * Convert index to the trimmed position.
     *
     * @return {number} - Trimmed position.
     */
  
  
    function getTrimmedPosition(index) {
      return Track.trim(Track.toPosition(index));
    }
  
    return Track;
  });
  // CONCATENATED MODULE: ./src/js/components/clones/index.js
  /**
   * The component for cloning some slides for "loop" mode of the track.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  
  /**
   * The component for cloning some slides for "loop" mode of the track.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var components_clones = (function (Splide, Components) {
    /**
     * Store information of all clones.
     *
     * @type {Array}
     */
    var clones = [];
    /**
     * Store the current clone count on one side.
     *
     * @type {number}
     */
  
    var cloneCount = 0;
    /**
     * Keep Elements component.
     *
     * @type {Object}
     */
  
    var Elements = Components.Elements;
    /**
     * Clones component object.
     *
     * @type {Object}
     */
  
    var Clones = {
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        var _this = this;
  
        if (Splide.is(LOOP)) {
          init();
          Splide.on('refresh', init).on('resize', function () {
            if (cloneCount !== getCloneCount()) {
              // Destroy before refresh not to collect clones by the Elements component.
              _this.destroy();
  
              Splide.refresh();
            }
          });
        }
      },
  
      /**
       * Destroy.
       */
      destroy: function destroy() {
        dom_remove(clones);
        clones = [];
      },
  
      /**
       * Return all clones.
       *
       * @return {Element[]} - Cloned elements.
       */
      get clones() {
        return clones;
      },
  
      /**
       * Return clone length.
       *
       * @return {number} - A length of clones.
       */
      get length() {
        return clones.length;
      }
  
    };
    /**
     * Initialization.
     */
  
    function init() {
      Clones.destroy();
      cloneCount = getCloneCount();
      generateClones(cloneCount);
    }
    /**
     * Generate and append/prepend clones.
     *
     * @param {number} count - The half number of clones.
     */
  
  
    function generateClones(count) {
      var length = Elements.length,
          register = Elements.register;
  
      if (length) {
        var slides = Elements.slides;
  
        while (slides.length < count) {
          slides = slides.concat(slides);
        } // Clones after the last element.
  
  
        slides.slice(0, count).forEach(function (elm, index) {
          var clone = cloneDeeply(elm);
          append(Elements.list, clone);
          clones.push(clone);
          register(clone, index + length, index % length);
        }); // Clones before the first element.
  
        slides.slice(-count).forEach(function (elm, index) {
          var clone = cloneDeeply(elm);
          before(clone, slides[0]);
          clones.push(clone);
          register(clone, index - count, (length + index - count % length) % length);
        });
      }
    }
    /**
     * Return half count of clones to be generated.
     * Clone count is determined by:
     * - "clones" value in the options.
     * - Number of slides that can be placed in a view in "fixed" mode.
     * - Max pages a flick action can move.
     * - Whether the slide length is enough for perPage.
     *
     * @return {number} - Count for clones.
     */
  
  
    function getCloneCount() {
      var options = Splide.options;
  
      if (options.clones) {
        return options.clones;
      } // Use the slide length in autoWidth mode because the number cannot be calculated.
  
  
      var baseCount = options.autoWidth || options.autoHeight ? Elements.length : options.perPage;
      var dimension = options.direction === TTB ? 'Height' : 'Width';
      var fixedSize = toPixel(Splide.root, options["fixed" + dimension]);
  
      if (fixedSize) {
        // Roughly calculate the count. This needs not to be strict.
        baseCount = Math.ceil(Elements.track["client" + dimension] / fixedSize);
      }
  
      return baseCount * (options.drag ? options.flickMaxPages + 1 : 1);
    }
    /**
     * Clone deeply the given element.
     *
     * @param {Element} elm - An element being duplicated.
     *
     * @return {Node} - A cloned node(element).
     */
  
  
    function cloneDeeply(elm) {
      var clone = elm.cloneNode(true);
      addClass(clone, Splide.classes.clone); // ID should not be duplicated.
  
      removeAttribute(clone, 'id');
      return clone;
    }
  
    return Clones;
  });
  // CONCATENATED MODULE: ./src/js/components/layout/directions/horizontal.js
  /**
   * The resolver component for horizontal layout.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  /**
   * The resolver component for horizontal layout.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The resolver object.
   */
  
  /* harmony default export */ var horizontal = (function (Splide, Components) {
    /**
     * Keep the Elements component.
     *
     * @type {string}
     */
    var Elements = Components.Elements;
    /**
     * Keep the root element.
     *
     * @type {Element}
     */
  
    var root = Splide.root;
    /**
     * Keep the track element.
     *
     * @type {Element}
     */
  
    var track;
    /**
     * Keep the latest options.
     *
     * @type {Element}
     */
  
    var options = Splide.options;
    return {
      /**
       * Margin property name.
       *
       * @type {string}
       */
      margin: 'margin' + (options.direction === RTL ? 'Left' : 'Right'),
  
      /**
       * Always 0 because the height will be determined by inner contents.
       *
       * @type {number}
       */
      height: 0,
  
      /**
       * Initialization.
       */
      init: function init() {
        this.resize();
      },
  
      /**
       * Resize gap and padding.
       * This must be called on init.
       */
      resize: function resize() {
        options = Splide.options;
        track = Elements.track;
        this.gap = toPixel(root, options.gap);
        var padding = options.padding;
        var left = toPixel(root, padding.left || padding);
        var right = toPixel(root, padding.right || padding);
        this.padding = {
          left: left,
          right: right
        };
        applyStyle(track, {
          paddingLeft: unit(left),
          paddingRight: unit(right)
        });
      },
  
      /**
       * Return total width from the left of the list to the right of the slide specified by the provided index.
       *
       * @param {number} index - Optional. A slide index. If undefined, total width of the slider will be returned.
       *
       * @return {number} - Total width to the right side of the specified slide, or 0 for an invalid index.
       */
      totalWidth: function totalWidth(index) {
        if (index === void 0) {
          index = Splide.length - 1;
        }
  
        var Slide = Elements.getSlide(index);
        var width = 0;
  
        if (Slide) {
          var slideRect = getRect(Slide.slide);
          var listRect = getRect(Elements.list);
  
          if (options.direction === RTL) {
            width = listRect.right - slideRect.left;
          } else {
            width = slideRect.right - listRect.left;
          }
  
          width += this.gap;
        }
  
        return width;
      },
  
      /**
       * Return the slide width in px.
       *
       * @param {number} index - Slide index.
       *
       * @return {number} - The slide width.
       */
      slideWidth: function slideWidth(index) {
        if (options.autoWidth) {
          var Slide = Elements.getSlide(index);
          return Slide ? Slide.slide.offsetWidth : 0;
        }
  
        var width = options.fixedWidth || (this.width + this.gap) / options.perPage - this.gap;
        return toPixel(root, width);
      },
  
      /**
       * Return the slide height in px.
       *
       * @return {number} - The slide height.
       */
      slideHeight: function slideHeight() {
        var height = options.height || options.fixedHeight || this.width * options.heightRatio;
        return toPixel(root, height);
      },
  
      /**
       * Return slider width without padding.
       *
       * @return {number} - Current slider width.
       */
      get width() {
        return track.clientWidth - this.padding.left - this.padding.right;
      }
  
    };
  });
  // CONCATENATED MODULE: ./src/js/components/layout/directions/vertical.js
  /**
   * The resolver component for vertical layout.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  /**
   * The resolver component for vertical layout.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The resolver object.
   */
  
  /* harmony default export */ var vertical = (function (Splide, Components) {
    /**
     * Keep the Elements component.
     *
     * @type {string}
     */
    var Elements = Components.Elements;
    /**
     * Keep the root element.
     *
     * @type {Element}
     */
  
    var root = Splide.root;
    /**
     * Keep the track element.
     *
     * @type {Element}
     */
  
    var track;
    /**
     * Keep the latest options.
     *
     * @type {Element}
     */
  
    var options;
    return {
      /**
       * Margin property name.
       *
       * @type {string}
       */
      margin: 'marginBottom',
  
      /**
       * Initialization.
       */
      init: function init() {
        this.resize();
      },
  
      /**
       * Resize gap and padding.
       * This must be called on init.
       */
      resize: function resize() {
        options = Splide.options;
        track = Elements.track;
        this.gap = toPixel(root, options.gap);
        var padding = options.padding;
        var top = toPixel(root, padding.top || padding);
        var bottom = toPixel(root, padding.bottom || padding);
        this.padding = {
          top: top,
          bottom: bottom
        };
        applyStyle(track, {
          paddingTop: unit(top),
          paddingBottom: unit(bottom)
        });
      },
  
      /**
       * Return total height from the top of the list to the bottom of the slide specified by the provided index.
       *
       * @param {number} index - Optional. A slide index. If undefined, total height of the slider will be returned.
       *
       * @return {number} - Total height to the bottom of the specified slide, or 0 for an invalid index.
       */
      totalHeight: function totalHeight(index) {
        if (index === void 0) {
          index = Splide.length - 1;
        }
  
        var Slide = Elements.getSlide(index);
  
        if (Slide) {
          return getRect(Slide.slide).bottom - getRect(Elements.list).top + this.gap;
        }
  
        return 0;
      },
  
      /**
       * Return the slide width in px.
       *
       * @return {number} - The slide width.
       */
      slideWidth: function slideWidth() {
        return toPixel(root, options.fixedWidth || this.width);
      },
  
      /**
       * Return the slide height in px.
       *
       * @param {number} index - Slide index.
       *
       * @return {number} - The slide height.
       */
      slideHeight: function slideHeight(index) {
        if (options.autoHeight) {
          var Slide = Elements.getSlide(index);
          return Slide ? Slide.slide.offsetHeight : 0;
        }
  
        var height = options.fixedHeight || (this.height + this.gap) / options.perPage - this.gap;
        return toPixel(root, height);
      },
  
      /**
       * Return slider width without padding.
       *
       * @return {number} - Current slider width.
       */
      get width() {
        return track.clientWidth;
      },
  
      /**
       * Return slide height without padding.
       *
       * @return {number} - Slider height.
       */
      get height() {
        var height = options.height || this.width * options.heightRatio;
        exist(height, '"height" or "heightRatio" is missing.');
        return toPixel(root, height) - this.padding.top - this.padding.bottom;
      }
  
    };
  });
  // CONCATENATED MODULE: ./src/js/utils/time.js
  /**
   * A package of utility functions related with time.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * Simple throttle function that controls how often the given function is executed.
   *
   * @param {function} func - A function to be throttled.
   * @param {number}   wait - Time in millisecond for interval of execution.
   *
   * @return {Function} - A debounced function.
   */
  function throttle(func, wait) {
    var timeout; // Declare function by the "function" keyword to prevent "this" from being inherited.
  
    return function () {
      if (!timeout) {
        timeout = setTimeout(function () {
          func();
          timeout = null;
        }, wait);
      }
    };
  }
  /**
   * Custom setInterval function that provides progress rate as callback.
   *
   * @param {function} callback - A callback function fired every time the interval time passes.
   * @param {number}   interval - Interval duration in milliseconds.
   * @param {function} progress - A callback function fired whenever the progress goes.
   *
   * @return {Object} - An object containing play() and pause() functions.
   */
  
  function createInterval(callback, interval, progress) {
    var _window = window,
        requestAnimationFrame = _window.requestAnimationFrame;
    var start,
        elapse,
        rate,
        _pause = true;
  
    var step = function step(timestamp) {
      if (!_pause) {
        if (!start) {
          start = timestamp;
  
          if (rate && rate < 1) {
            start -= rate * interval;
          }
        }
  
        elapse = timestamp - start;
        rate = elapse / interval;
  
        if (elapse >= interval) {
          start = 0;
          rate = 1;
          callback();
        }
  
        if (progress) {
          progress(rate);
        }
  
        requestAnimationFrame(step);
      }
    };
  
    return {
      pause: function pause() {
        _pause = true;
        start = 0;
      },
      play: function play(reset) {
        start = 0;
  
        if (_pause) {
          _pause = false;
  
          if (reset) {
            rate = 0;
          }
  
          requestAnimationFrame(step);
        }
      }
    };
  }
  // CONCATENATED MODULE: ./src/js/components/layout/index.js
  /**
   * The component for handing slide layouts and their sizes.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  
  
  
  
  /**
   * The component for handing slide layouts and their sizes.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var layout = (function (Splide, Components) {
    /**
     * Keep the Elements component.
     *
     * @type {string}
     */
    var Elements = Components.Elements;
    /**
     * Whether the slider is vertical or not.
     *
     * @type {boolean}
     */
  
    var isVertical = Splide.options.direction === TTB;
    /**
     * Layout component object.
     *
     * @type {Object}
     */
  
    var Layout = object_assign({
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        bind();
        init(); // The word "size" means width for a horizontal slider and height for a vertical slider.
  
        this.totalSize = isVertical ? this.totalHeight : this.totalWidth;
        this.slideSize = isVertical ? this.slideHeight : this.slideWidth;
      },
  
      /**
       * Destroy the component.
       */
      destroy: function destroy() {
        removeAttribute([Elements.list, Elements.track], 'style');
      },
  
      /**
       * Return the slider height on the vertical mode or width on the horizontal mode.
       *
       * @return {number}
       */
      get size() {
        return isVertical ? this.height : this.width;
      }
  
    }, isVertical ? vertical(Splide, Components) : horizontal(Splide, Components));
    /**
     * Init slider styles according to options.
     */
  
    function init() {
      Layout.init();
      applyStyle(Splide.root, {
        maxWidth: unit(Splide.options.width)
      });
      Elements.each(function (Slide) {
        Slide.slide.style[Layout.margin] = unit(Layout.gap);
      });
      resize();
    }
    /**
     * Listen the resize native event with throttle.
     * Initialize when the component is mounted or options are updated.
     */
  
  
    function bind() {
      Splide.on('resize load', throttle(function () {
        Splide.emit('resize');
      }, Splide.options.throttle), window).on('resize', resize).on('updated refresh', init);
    }
    /**
     * Resize the track and slide elements.
     */
  
  
    function resize() {
      var options = Splide.options;
      Layout.resize();
      applyStyle(Elements.track, {
        height: unit(Layout.height)
      });
      var slideHeight = options.autoHeight ? null : unit(Layout.slideHeight());
      Elements.each(function (Slide) {
        applyStyle(Slide.container, {
          height: slideHeight
        });
        applyStyle(Slide.slide, {
          width: options.autoWidth ? null : unit(Layout.slideWidth(Slide.index)),
          height: Slide.container ? null : slideHeight
        });
      });
    }
  
    return Layout;
  });
  // CONCATENATED MODULE: ./src/js/components/drag/index.js
  /**
   * The component for supporting mouse drag and swipe.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  
  
  var drag_abs = Math.abs;
  /**
   * If the absolute velocity is greater thant this value,
   * a slider always goes to a different slide after drag, not allowed to stay on a current slide.
   */
  
  var MIN_VELOCITY = 0.1;
  /**
   * Adjust how much the track can be pulled on the first or last page.
   * The larger number this is, the farther the track moves.
   * This should be around 5 - 9.
   *
   * @type {number}
   */
  
  var FRICTION_REDUCER = 7;
  /**
   * The component supporting mouse drag and swipe.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var drag = (function (Splide, Components) {
    /**
     * Store the Move component.
     *
     * @type {Object}
     */
    var Track = Components.Track;
    /**
     * Store the Controller component.
     *
     * @type {Object}
     */
  
    var Controller = Components.Controller;
    /**
     * Coordinate of the track on starting drag.
     *
     * @type {Object}
     */
  
    var startCoord;
    /**
     * Analyzed info on starting drag.
     *
     * @type {Object|null}
     */
  
    var startInfo;
    /**
     * Analyzed info being updated while dragging/swiping.
     *
     * @type {Object}
     */
  
    var currentInfo;
    /**
     * Determine whether slides are being dragged or not.
     *
     * @type {boolean}
     */
  
    var isDragging;
    /**
     * Whether the slider direction is vertical or not.
     *
     * @type {boolean}
     */
  
    var isVertical = Splide.options.direction === TTB;
    /**
     * Axis for the direction.
     *
     * @type {string}
     */
  
    var axis = isVertical ? 'y' : 'x';
    /**
     * Drag component object.
     *
     * @type {Object}
     */
  
    var Drag = {
      /**
       * Whether dragging is disabled or not.
       *
       * @type {boolean}
       */
      disabled: false,
  
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        var _this = this;
  
        var Elements = Components.Elements;
        var track = Elements.track;
        Splide.on('touchstart mousedown', start, track).on('touchmove mousemove', move, track, {
          passive: false
        }).on('touchend touchcancel mouseleave mouseup dragend', end, track).on('mounted refresh', function () {
          // Prevent dragging an image or anchor itself.
          each(Elements.list.querySelectorAll('img, a'), function (elm) {
            Splide.off('dragstart', elm).on('dragstart', function (e) {
              e.preventDefault();
            }, elm, {
              passive: false
            });
          });
        }).on('mounted updated', function () {
          _this.disabled = !Splide.options.drag;
        });
      }
    };
    /**
     * Called when the track starts to be dragged.
     *
     * @param {TouchEvent|MouseEvent} e - TouchEvent or MouseEvent object.
     */
  
    function start(e) {
      if (!Drag.disabled && !isDragging) {
        // These prams are used to evaluate whether the slider should start moving.
        init(e);
      }
    }
    /**
     * Initialize parameters.
     *
     * @param {TouchEvent|MouseEvent} e - TouchEvent or MouseEvent object.
     */
  
  
    function init(e) {
      startCoord = Track.toCoord(Track.position);
      startInfo = analyze(e, {});
      currentInfo = startInfo;
    }
    /**
     * Called while the track being dragged.
     *
     * @param {TouchEvent|MouseEvent} e - TouchEvent or MouseEvent object.
     */
  
  
    function move(e) {
      if (startInfo) {
        currentInfo = analyze(e, startInfo);
  
        if (isDragging) {
          if (e.cancelable) {
            e.preventDefault();
          }
  
          if (!Splide.is(FADE)) {
            var position = startCoord[axis] + currentInfo.offset[axis];
            Track.translate(resist(position));
          }
        } else {
          if (shouldMove(currentInfo)) {
            Splide.emit('drag', startInfo);
            isDragging = true;
            Track.cancel(); // These params are actual drag data.
  
            init(e);
          }
        }
      }
    }
    /**
     * Determine whether to start moving the track or not by drag angle.
     *
     * @param {Object} info - An information object.
     *
     * @return {boolean} - True if the track should be moved or false if not.
     */
  
  
    function shouldMove(_ref) {
      var offset = _ref.offset;
  
      if (Splide.State.is(MOVING) && Splide.options.waitForTransition) {
        return false;
      }
  
      var angle = Math.atan(drag_abs(offset.y) / drag_abs(offset.x)) * 180 / Math.PI;
  
      if (isVertical) {
        angle = 90 - angle;
      }
  
      return angle < Splide.options.dragAngleThreshold;
    }
    /**
     * Resist dragging the track on the first/last page because there is no more.
     *
     * @param {number} position - A position being applied to the track.
     *
     * @return {Object} - Adjusted position.
     */
  
  
    function resist(position) {
      if (Splide.is(SLIDE)) {
        var sign = Track.sign;
  
        var _start = sign * Track.trim(Track.toPosition(0));
  
        var _end = sign * Track.trim(Track.toPosition(Controller.edgeIndex));
  
        position *= sign;
  
        if (position < _start) {
          position = _start - FRICTION_REDUCER * Math.log(_start - position);
        } else if (position > _end) {
          position = _end + FRICTION_REDUCER * Math.log(position - _end);
        }
  
        position *= sign;
      }
  
      return position;
    }
    /**
     * Called when dragging ends.
     */
  
  
    function end() {
      startInfo = null;
  
      if (isDragging) {
        Splide.emit('dragged', currentInfo);
        go(currentInfo);
        isDragging = false;
      }
    }
    /**
     * Go to the slide determined by the analyzed data.
     *
     * @param {Object} info - An info object.
     */
  
  
    function go(info) {
      var velocity = info.velocity[axis];
      var absV = drag_abs(velocity);
  
      if (absV > 0) {
        var options = Splide.options;
        var index = Splide.index;
        var sign = velocity < 0 ? -1 : 1;
        var destIndex = index;
  
        if (!Splide.is(FADE)) {
          var destination = Track.position;
  
          if (absV > options.flickVelocityThreshold && drag_abs(info.offset[axis]) < options.swipeDistanceThreshold) {
            destination += sign * Math.min(absV * options.flickPower, Components.Layout.size * (options.flickMaxPages || 1));
          }
  
          destIndex = Track.toIndex(destination);
        }
        /*
         * Do not allow the track to go to a previous position if there is enough velocity.
         * Always use the adjacent index for the fade mode.
         */
  
  
        if (destIndex === index && absV > MIN_VELOCITY) {
          destIndex = index + sign * Track.sign;
        }
  
        if (Splide.is(SLIDE)) {
          destIndex = between(destIndex, 0, Controller.edgeIndex);
        }
  
        Controller.go(destIndex, options.isNavigation);
      }
    }
    /**
     * Analyze the given event object and return important information for handling swipe behavior.
     *
     * @param {Event}   e          - Touch or Mouse event object.
     * @param {Object}  startInfo  - Information analyzed on start for calculating difference from the current one.
     *
     * @return {Object} - An object containing analyzed information, such as offset, velocity, etc.
     */
  
  
    function analyze(e, startInfo) {
      var timeStamp = e.timeStamp,
          touches = e.touches;
  
      var _ref2 = touches ? touches[0] : e,
          clientX = _ref2.clientX,
          clientY = _ref2.clientY;
  
      var _ref3 = startInfo.to || {},
          _ref3$x = _ref3.x,
          fromX = _ref3$x === void 0 ? clientX : _ref3$x,
          _ref3$y = _ref3.y,
          fromY = _ref3$y === void 0 ? clientY : _ref3$y;
  
      var startTime = startInfo.time || 0;
      var offset = {
        x: clientX - fromX,
        y: clientY - fromY
      };
      var duration = timeStamp - startTime;
      var velocity = {
        x: offset.x / duration,
        y: offset.y / duration
      };
      return {
        to: {
          x: clientX,
          y: clientY
        },
        offset: offset,
        time: timeStamp,
        velocity: velocity
      };
    }
  
    return Drag;
  });
  // CONCATENATED MODULE: ./src/js/components/click/index.js
  /**
   * The component for handling a click event.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * The component for handling a click event.
   * Click should be disabled during drag/swipe.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var click = (function (Splide, Components) {
    /**
     * Whether click is disabled or not.
     *
     * @type {boolean}
     */
    var disabled = false;
    /**
     * Click component object.
     *
     * @type {Object}
     */
  
    var Click = {
      /**
       * Mount only when the drag is activated and the slide type is not "fade".
       *
       * @type {boolean}
       */
      required: Splide.options.drag && !Splide.is(FADE),
  
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        Splide.on('click', onClick, Components.Elements.track, {
          capture: true
        }).on('drag', function () {
          disabled = true;
        }).on('moved', function () {
          disabled = false;
        });
      }
    };
    /**
     * Called when a track element is clicked.
     *
     * @param {Event} e - A click event.
     */
  
    function onClick(e) {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  
    return Click;
  });
  // CONCATENATED MODULE: ./src/js/components/autoplay/index.js
  /**
   * The component for playing slides automatically.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  /**
   * Set of pause flags.
   */
  
  var PAUSE_FLAGS = {
    HOVER: 1,
    FOCUS: 2,
    MANUAL: 3
  };
  /**
   * The component for playing slides automatically.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   * @param {string} name       - A component name as a lowercase string.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var components_autoplay = (function (Splide, Components, name) {
    /**
     * Store pause flags.
     *
     * @type {Array}
     */
    var flags = [];
    /**
     * Store an interval object.
     *
     * @type {Object};
     */
  
    var interval;
    /**
     * Keep the Elements component.
     *
     * @type {string}
     */
  
    var Elements = Components.Elements;
    /**
     * Autoplay component object.
     *
     * @type {Object}
     */
  
    var Autoplay = {
      /**
       * Required only when the autoplay option is true.
       *
       * @type {boolean}
       */
      required: Splide.options.autoplay,
  
      /**
       * Called when the component is mounted.
       * Note that autoplay starts only if there are slides over perPage number.
       */
      mount: function mount() {
        var options = Splide.options;
  
        if (Elements.slides.length > options.perPage) {
          interval = createInterval(function () {
            Splide.go('>');
          }, options.interval, function (rate) {
            Splide.emit(name + ":playing", rate);
  
            if (Elements.bar) {
              applyStyle(Elements.bar, {
                width: rate * 100 + "%"
              });
            }
          });
          bind();
          this.play();
        }
      },
  
      /**
       * Start autoplay.
       *
       * @param {number} flag - A pause flag to be removed.
       */
      play: function play(flag) {
        if (flag === void 0) {
          flag = 0;
        }
  
        flags = flags.filter(function (f) {
          return f !== flag;
        });
  
        if (!flags.length) {
          Splide.emit(name + ":play");
          interval.play(Splide.options.resetProgress);
        }
      },
  
      /**
       * Pause autoplay.
       * Note that Array.includes is not supported by IE.
       *
       * @param {number} flag - A pause flag to be added.
       */
      pause: function pause(flag) {
        if (flag === void 0) {
          flag = 0;
        }
  
        interval.pause();
  
        if (flags.indexOf(flag) === -1) {
          flags.push(flag);
        }
  
        if (flags.length === 1) {
          Splide.emit(name + ":pause");
        }
      }
    };
    /**
     * Listen some events.
     */
  
    function bind() {
      var options = Splide.options;
      var sibling = Splide.sibling;
      var elms = [Splide.root, sibling ? sibling.root : null];
  
      if (options.pauseOnHover) {
        switchOn(elms, 'mouseleave', PAUSE_FLAGS.HOVER, true);
        switchOn(elms, 'mouseenter', PAUSE_FLAGS.HOVER, false);
      }
  
      if (options.pauseOnFocus) {
        switchOn(elms, 'focusout', PAUSE_FLAGS.FOCUS, true);
        switchOn(elms, 'focusin', PAUSE_FLAGS.FOCUS, false);
      }
  
      Splide.on('click', function () {
        // Need to be removed a focus flag at first.
        Autoplay.play(PAUSE_FLAGS.FOCUS);
        Autoplay.play(PAUSE_FLAGS.MANUAL);
      }, Elements.play).on('move refresh', function () {
        Autoplay.play();
      }) // Rewind the timer.
      .on('destroy', function () {
        Autoplay.pause();
      });
      switchOn([Elements.pause], 'click', PAUSE_FLAGS.MANUAL, false);
    }
    /**
     * Play or pause on the given event.
     *
     * @param {Element[]} elms  - Elements.
     * @param {string}    event - An event name or names.
     * @param {number}    flag  - A pause flag defined on the top.
     * @param {boolean}   play  - Determine whether to play or pause.
     */
  
  
    function switchOn(elms, event, flag, play) {
      elms.forEach(function (elm) {
        Splide.on(event, function () {
          Autoplay[play ? 'play' : 'pause'](flag);
        }, elm);
      });
    }
  
    return Autoplay;
  });
  // CONCATENATED MODULE: ./src/js/components/cover/index.js
  /**
   * The component for change an img element to background image of its wrapper.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * The component for change an img element to background image of its wrapper.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var components_cover = (function (Splide, Components) {
    /**
     * Hold options.
     *
     * @type {Object}
     */
    var options = Splide.options;
    /**
     * Cover component object.
     *
     * @type {Object}
     */
  
    var Cover = {
      /**
       * Required only when "cover" option is true.
       *
       * @type {boolean}
       */
      required: options.cover,
  
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        Splide.on('lazyload:loaded', function (img) {
          cover(img, false);
        });
        Splide.on('mounted updated refresh', function () {
          return apply(false);
        });
      },
  
      /**
       * Destroy.
       */
      destroy: function destroy() {
        apply(true);
      }
    };
    /**
     * Apply "cover" to all slides.
     *
     * @param {boolean} uncover - If true, "cover" will be clear.
     */
  
    function apply(uncover) {
      Components.Elements.each(function (Slide) {
        var img = child(Slide.slide, 'IMG') || child(Slide.container, 'IMG');
  
        if (img && img.src) {
          cover(img, uncover);
        }
      });
    }
    /**
     * Set background image of the parent element, using source of the given image element.
     *
     * @param {Element} img     - An image element.
     * @param {boolean} uncover - Reset "cover".
     */
  
  
    function cover(img, uncover) {
      applyStyle(img.parentElement, {
        background: uncover ? '' : "center/cover no-repeat url(\"" + img.src + "\")"
      });
      applyStyle(img, {
        display: uncover ? '' : 'none'
      });
    }
  
    return Cover;
  });
  // CONCATENATED MODULE: ./src/js/components/arrows/path.js
  /**
   * Export vector path for an arrow.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * Namespace definition for SVG element.
   *
   * @type {string}
   */
  var XML_NAME_SPACE = 'http://www.w3.org/2000/svg';
  /**
   * The arrow vector path.
   *
   * @type {number}
   */
  
  var PATH = 'm15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z';
  /**
   * SVG width and height.
   *
   * @type {number}
   */
  
  var SIZE = 40;
  // CONCATENATED MODULE: ./src/js/components/arrows/index.js
  /**
   * The component for appending prev/next arrows.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  /**
   * The component for appending prev/next arrows.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   * @param {string} name       - A component name as a lowercase string.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var components_arrows = (function (Splide, Components, name) {
    /**
     * Previous arrow element.
     *
     * @type {Element|undefined}
     */
    var prev;
    /**
     * Next arrow element.
     *
     * @type {Element|undefined}
     */
  
    var next;
    /**
     * Store the class list.
     *
     * @type {Object}
     */
  
    var classes = Splide.classes;
    /**
     * Hold the root element.
     *
     * @type {Element}
     */
  
    var root = Splide.root;
    /**
     * Whether arrows are created programmatically or not.
     *
     * @type {boolean}
     */
  
    var created;
    /**
     * Hold the Elements component.
     *
     * @type {Object}
     */
  
    var Elements = Components.Elements;
    /**
     * Arrows component object.
     *
     * @type {Object}
     */
  
    var Arrows = {
      /**
       * Required when the arrows option is true.
       *
       * @type {boolean}
       */
      required: Splide.options.arrows,
  
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        // Attempt to get arrows from HTML source.
        prev = Elements.arrows.prev;
        next = Elements.arrows.next; // If arrows were not found in HTML, let's generate them.
  
        if ((!prev || !next) && Splide.options.arrows) {
          prev = createArrow(true);
          next = createArrow(false);
          created = true;
          appendArrows();
        }
  
        if (prev && next) {
          bind();
        }
  
        this.arrows = {
          prev: prev,
          next: next
        };
      },
  
      /**
       * Called after all components are mounted.
       */
      mounted: function mounted() {
        Splide.emit(name + ":mounted", prev, next);
      },
  
      /**
       * Destroy.
       */
      destroy: function destroy() {
        removeAttribute([prev, next], 'disabled');
  
        if (created) {
          dom_remove(prev.parentElement);
        }
      }
    };
    /**
     * Listen to native and custom events.
     */
  
    function bind() {
      Splide.on('click', function () {
        Splide.go('<');
      }, prev).on('click', function () {
        Splide.go('>');
      }, next).on('mounted move updated refresh', updateDisabled);
    }
    /**
     * Update a disabled attribute.
     */
  
  
    function updateDisabled() {
      var _Components$Controlle = Components.Controller,
          prevIndex = _Components$Controlle.prevIndex,
          nextIndex = _Components$Controlle.nextIndex;
      var isEnough = Splide.length > Splide.options.perPage || Splide.is(LOOP);
      prev.disabled = prevIndex < 0 || !isEnough;
      next.disabled = nextIndex < 0 || !isEnough;
      Splide.emit(name + ":updated", prev, next, prevIndex, nextIndex);
    }
    /**
     * Create a wrapper element and append arrows.
     */
  
  
    function appendArrows() {
      var wrapper = create('div', {
        "class": classes.arrows
      });
      append(wrapper, prev);
      append(wrapper, next);
      var slider = Elements.slider;
      var parent = Splide.options.arrows === 'slider' && slider ? slider : root;
      before(wrapper, parent.firstElementChild);
    }
    /**
     * Create an arrow element.
     *
     * @param {boolean} prev - Determine to create a prev arrow or next arrow.
     *
     * @return {Element} - A created arrow element.
     */
  
  
    function createArrow(prev) {
      var arrow = "<button class=\"" + classes.arrow + " " + (prev ? classes.prev : classes.next) + "\" type=\"button\">" + ("<svg xmlns=\"" + XML_NAME_SPACE + "\"\tviewBox=\"0 0 " + SIZE + " " + SIZE + "\"\twidth=\"" + SIZE + "\"\theight=\"" + SIZE + "\">") + ("<path d=\"" + (Splide.options.arrowPath || PATH) + "\" />");
      return domify(arrow);
    }
  
    return Arrows;
  });
  // CONCATENATED MODULE: ./src/js/components/pagination/index.js
  /**
   * The component for handling pagination
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  /**
   * The event name for updating some attributes of pagination nodes.
   *
   * @type {string}
   */
  
  var ATTRIBUTES_UPDATE_EVENT = 'move.page';
  /**
   * The event name for recreating pagination.
   *
   * @type {string}
   */
  
  var UPDATE_EVENT = 'updated.page refresh.page';
  /**
   * The component for handling pagination
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   * @param {string} name       - A component name as a lowercase string.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var components_pagination = (function (Splide, Components, name) {
    /**
     * Store all data for pagination.
     * - list: A list element.
     * - items: An array that contains objects(li, button, index, page).
     *
     * @type {Object}
     */
    var data = {};
    /**
     * Hold the Elements component.
     *
     * @type {Object}
     */
  
    var Elements = Components.Elements;
    /**
     * Pagination component object.
     *
     * @type {Object}
     */
  
    var Pagination = {
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        var pagination = Splide.options.pagination;
  
        if (pagination) {
          data = createPagination();
          var slider = Elements.slider;
          var parent = pagination === 'slider' && slider ? slider : Splide.root;
          append(parent, data.list);
          Splide.on(ATTRIBUTES_UPDATE_EVENT, updateAttributes);
        }
  
        Splide.off(UPDATE_EVENT).on(UPDATE_EVENT, function () {
          Pagination.destroy();
  
          if (Splide.options.pagination) {
            Pagination.mount();
            Pagination.mounted();
          }
        });
      },
  
      /**
       * Called after all components are mounted.
       */
      mounted: function mounted() {
        if (Splide.options.pagination) {
          var index = Splide.index;
          Splide.emit(name + ":mounted", data, this.getItem(index));
          updateAttributes(index, -1);
        }
      },
  
      /**
       * Destroy the pagination.
       * Be aware that node.remove() is not supported by IE.
       */
      destroy: function destroy() {
        dom_remove(data.list);
  
        if (data.items) {
          data.items.forEach(function (item) {
            Splide.off('click', item.button);
          });
        } // Do not remove UPDATE_EVENT to recreate pagination if needed.
  
  
        Splide.off(ATTRIBUTES_UPDATE_EVENT);
        data = {};
      },
  
      /**
       * Return an item by index.
       *
       * @param {number} index - A slide index.
       *
       * @return {Object|undefined} - An item object on success or undefined on failure.
       */
      getItem: function getItem(index) {
        return data.items[Components.Controller.toPage(index)];
      },
  
      /**
       * Return object containing pagination data.
       *
       * @return {Object} - Pagination data including list and items.
       */
      get data() {
        return data;
      }
  
    };
    /**
     * Update attributes.
     *
     * @param {number} index     - Active index.
     * @param {number} prevIndex - Prev index.
     */
  
    function updateAttributes(index, prevIndex) {
      var prev = Pagination.getItem(prevIndex);
      var curr = Pagination.getItem(index);
      var active = STATUS_CLASSES.active;
  
      if (prev) {
        removeClass(prev.button, active);
      }
  
      if (curr) {
        addClass(curr.button, active);
      }
  
      Splide.emit(name + ":updated", data, prev, curr);
    }
    /**
     * Create a wrapper and button elements.
     *
     * @return {Object} - An object contains all data.
     */
  
  
    function createPagination() {
      var options = Splide.options;
      var classes = Splide.classes;
      var list = create('ul', {
        "class": classes.pagination
      });
      var items = Elements.getSlides(false).filter(function (Slide) {
        return options.focus !== false || Slide.index % options.perPage === 0;
      }).map(function (Slide, page) {
        var li = create('li', {});
        var button = create('button', {
          "class": classes.page,
          type: 'button'
        });
        append(li, button);
        append(list, li);
        Splide.on('click', function () {
          Splide.go(">" + page);
        }, button);
        return {
          li: li,
          button: button,
          page: page,
          Slides: Elements.getSlidesByPage(page)
        };
      });
      return {
        list: list,
        items: items
      };
    }
  
    return Pagination;
  });
  // CONCATENATED MODULE: ./src/js/components/lazyload/index.js
  /**
   * The component for loading slider images lazily.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  /**
   * The name for a data attribute of src.
   *
   * @type {string}
   */
  
  var SRC_DATA_NAME = 'data-splide-lazy';
  /**
   * The name for a data attribute of srcset.
   *
   * @type {string}
   */
  
  var SRCSET_DATA_NAME = 'data-splide-lazy-srcset';
  /**
   * The component for loading slider images lazily.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   * @param {string} name       - A component name as a lowercase string.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var lazyload = (function (Splide, Components, name) {
    /**
     * Next index for sequential loading.
     *
     * @type {number}
     */
    var nextIndex;
    /**
     * Store objects containing an img element and a Slide object.
     *
     * @type {Object[]}
     */
  
    var images;
    /**
     * Store the options.
     *
     * @type {Object}
     */
  
    var options = Splide.options;
    /**
     * Whether to load images sequentially or not.
     *
     * @type {boolean}
     */
  
    var isSequential = options.lazyLoad === 'sequential';
    /**
     * Lazyload component object.
     *
     * @type {Object}
     */
  
    var Lazyload = {
      /**
       * Mount only when the lazyload option is provided.
       *
       * @type {boolean}
       */
      required: options.lazyLoad,
  
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        Splide.on('mounted refresh', function () {
          init();
          Components.Elements.each(function (Slide) {
            each(Slide.slide.querySelectorAll("[" + SRC_DATA_NAME + "], [" + SRCSET_DATA_NAME + "]"), function (img) {
              if (!img.src && !img.srcset) {
                images.push({
                  img: img,
                  Slide: Slide
                });
                applyStyle(img, {
                  display: 'none'
                });
              }
            });
          });
  
          if (isSequential) {
            loadNext();
          }
        });
  
        if (!isSequential) {
          Splide.on("mounted refresh moved." + name, check);
        }
      },
  
      /**
       * Destroy.
       */
      destroy: init
    };
    /**
     * Initialize parameters.
     */
  
    function init() {
      images = [];
      nextIndex = 0;
    }
    /**
     * Check how close each image is from the active slide and
     * determine whether to start loading or not, according to the distance.
     *
     * @param {number} index - Current index.
     */
  
  
    function check(index) {
      index = isNaN(index) ? Splide.index : index;
      images = images.filter(function (image) {
        if (image.Slide.isWithin(index, options.perPage * (options.preloadPages + 1))) {
          load(image.img, image.Slide);
          return false;
        }
  
        return true;
      }); // Unbind if all images are loaded.
  
      if (!images[0]) {
        Splide.off("moved." + name);
      }
    }
    /**
     * Start loading an image.
     * Creating a clone of the image element since setting src attribute directly to it
     * often occurs 'hitch', blocking some other processes of a browser.
     *
     * @param {Element} img   - An image element.
     * @param {Object}  Slide - A Slide object.
     */
  
  
    function load(img, Slide) {
      addClass(Slide.slide, STATUS_CLASSES.loading);
      var spinner = create('span', {
        "class": Splide.classes.spinner
      });
      append(img.parentElement, spinner);
  
      img.onload = function () {
        loaded(img, spinner, Slide, false);
      };
  
      img.onerror = function () {
        loaded(img, spinner, Slide, true);
      };
  
      setAttribute(img, 'srcset', getAttribute(img, SRCSET_DATA_NAME) || '');
      setAttribute(img, 'src', getAttribute(img, SRC_DATA_NAME) || '');
    }
    /**
     * Start loading a next image in images array.
     */
  
  
    function loadNext() {
      if (nextIndex < images.length) {
        var image = images[nextIndex];
        load(image.img, image.Slide);
      }
  
      nextIndex++;
    }
    /**
     * Called just after the image was loaded or loading was aborted by some error.
     *
     * @param {Element} img     - An image element.
     * @param {Element} spinner - A spinner element.
     * @param {Object}  Slide   - A Slide object.
     * @param {boolean} error   - True if the image was loaded successfully or false on error.
     */
  
  
    function loaded(img, spinner, Slide, error) {
      removeClass(Slide.slide, STATUS_CLASSES.loading);
  
      if (!error) {
        dom_remove(spinner);
        applyStyle(img, {
          display: ''
        });
        Splide.emit(name + ":loaded", img).emit('resize');
      }
  
      if (isSequential) {
        loadNext();
      }
    }
  
    return Lazyload;
  });
  // CONCATENATED MODULE: ./src/js/constants/a11y.js
  /**
   * Export aria attribute names.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  /**
   * Attribute name for aria-current.
   *
   * @type {string}
   */
  var ARIA_CURRENRT = 'aria-current';
  /**
   * Attribute name for aria-control.
   *
   * @type {string}
   */
  
  var ARIA_CONTROLS = 'aria-controls';
  /**
   * Attribute name for aria-control.
   *
   * @type {string}
   */
  
  var ARIA_LABEL = 'aria-label';
  /**
   * Attribute name for aria-labelledby.
   *
   * @type {string}
   */
  
  var ARIA_LABELLEDBY = 'aria-labelledby';
  /**
   * Attribute name for aria-hidden.
   *
   * @type {string}
   */
  
  var ARIA_HIDDEN = 'aria-hidden';
  /**
   * Attribute name for tab-index.
   *
   * @type {string}
   */
  
  var TAB_INDEX = 'tabindex';
  // CONCATENATED MODULE: ./src/js/components/keyboard/index.js
  /**
   * The component for controlling slides via keyboard.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  /**
   * Map a key to a slide control.
   *
   * @type {Object}
   */
  
  var KEY_MAP = {
    ltr: {
      ArrowLeft: '<',
      ArrowRight: '>',
      // For IE.
      Left: '<',
      Right: '>'
    },
    rtl: {
      ArrowLeft: '>',
      ArrowRight: '<',
      // For IE.
      Left: '>',
      Right: '<'
    },
    ttb: {
      ArrowUp: '<',
      ArrowDown: '>',
      // For IE.
      Up: '<',
      Down: '>'
    }
  };
  /**
   * The component for controlling slides via keyboard.
   *
   * @param {Splide} Splide - A Splide instance.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var components_keyboard = (function (Splide) {
    /**
     * Hold the target element.
     *
     * @type {Element|Document|undefined}
     */
    var target;
    return {
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        Splide.on('mounted updated', function () {
          var options = Splide.options;
          var root = Splide.root;
          var map = KEY_MAP[options.direction];
          var keyboard = options.keyboard;
  
          if (target) {
            Splide.off('keydown', target);
            removeAttribute(root, TAB_INDEX);
          }
  
          if (keyboard) {
            if (keyboard === 'focused') {
              target = root;
              setAttribute(root, TAB_INDEX, 0);
            } else {
              target = document;
            }
  
            Splide.on('keydown', function (e) {
              if (map[e.key]) {
                Splide.go(map[e.key]);
              }
            }, target);
          }
        });
      }
    };
  });
  // CONCATENATED MODULE: ./src/js/components/a11y/index.js
  /**
   * The component for enhancing accessibility.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  /**
   * The component for enhancing accessibility.
   *
   * @param {Splide} Splide     - A Splide instance.
   * @param {Object} Components - An object containing components.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var a11y = (function (Splide, Components) {
    /**
     * Hold a i18n object.
     *
     * @type {Object}
     */
    var i18n = Splide.i18n;
    /**
     * Hold the Elements component.
     *
     * @type {Object}
     */
  
    var Elements = Components.Elements;
    /**
     * All attributes related with A11y.
     *
     * @type {string[]}
     */
  
    var allAttributes = [ARIA_HIDDEN, TAB_INDEX, ARIA_CONTROLS, ARIA_LABEL, ARIA_CURRENRT, 'role'];
    /**
     * A11y component object.
     *
     * @type {Object}
     */
  
    var A11y = {
      /**
       * Required only when the accessibility option is true.
       *
       * @type {boolean}
       */
      required: Splide.options.accessibility,
  
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        Splide.on('visible', function (Slide) {
          updateSlide(Slide.slide, true);
        }).on('hidden', function (Slide) {
          updateSlide(Slide.slide, false);
        }).on('arrows:mounted', initArrows).on('arrows:updated', updateArrows).on('pagination:mounted', initPagination).on('pagination:updated', updatePagination).on('refresh', function () {
          removeAttribute(Components.Clones.clones, allAttributes);
        });
  
        if (Splide.options.isNavigation) {
          Splide.on('navigation:mounted', initNavigation).on('active', function (Slide) {
            updateNavigation(Slide, true);
          }).on('inactive', function (Slide) {
            updateNavigation(Slide, false);
          });
        }
  
        initAutoplay();
      },
  
      /**
       * Destroy.
       */
      destroy: function destroy() {
        var Arrows = Components.Arrows;
        var arrows = Arrows ? Arrows.arrows : {};
        removeAttribute(Elements.slides.concat([arrows.prev, arrows.next, Elements.play, Elements.pause]), allAttributes);
      }
    };
    /**
     * Update slide attributes when it gets visible or hidden.
     *
     * @param {Element} slide   - A slide element.
     * @param {Boolean} visible - True when the slide gets visible, or false when hidden.
     */
  
    function updateSlide(slide, visible) {
      setAttribute(slide, ARIA_HIDDEN, !visible);
  
      if (Splide.options.slideFocus) {
        setAttribute(slide, TAB_INDEX, visible ? 0 : -1);
      }
    }
    /**
     * Initialize arrows if they are available.
     * Append screen reader elements and add aria-controls attribute.
     *
     * @param {Element} prev - Previous arrow element.
     * @param {Element} next - Next arrow element.
     */
  
  
    function initArrows(prev, next) {
      var controls = Elements.track.id;
      setAttribute(prev, ARIA_CONTROLS, controls);
      setAttribute(next, ARIA_CONTROLS, controls);
    }
    /**
     * Update arrow attributes.
     *
     * @param {Element} prev      - Previous arrow element.
     * @param {Element} next      - Next arrow element.
     * @param {number}  prevIndex - Previous slide index or -1 when there is no precede slide.
     * @param {number}  nextIndex - Next slide index or -1 when there is no next slide.
     */
  
  
    function updateArrows(prev, next, prevIndex, nextIndex) {
      var index = Splide.index;
      var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
      var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
      setAttribute(prev, ARIA_LABEL, prevLabel);
      setAttribute(next, ARIA_LABEL, nextLabel);
    }
    /**
     * Initialize pagination if it's available.
     * Append a screen reader element and add aria-controls/label attribute to each item.
     *
     * @param {Object} data       - Data object containing all items.
     * @param {Object} activeItem - An initial active item.
     */
  
  
    function initPagination(data, activeItem) {
      if (activeItem) {
        setAttribute(activeItem.button, ARIA_CURRENRT, true);
      }
  
      data.items.forEach(function (item) {
        var options = Splide.options;
        var text = options.focus === false && options.perPage > 1 ? i18n.pageX : i18n.slideX;
        var label = sprintf(text, item.page + 1);
        var button = item.button;
        var controls = item.Slides.map(function (Slide) {
          return Slide.slide.id;
        });
        setAttribute(button, ARIA_CONTROLS, controls.join(' '));
        setAttribute(button, ARIA_LABEL, label);
      });
    }
    /**
     * Update pagination attributes.
     *
     * @param {Object}  data - Data object containing all items.
     * @param {Element} prev - A previous active element.
     * @param {Element} curr - A current active element.
     */
  
  
    function updatePagination(data, prev, curr) {
      if (prev) {
        removeAttribute(prev.button, ARIA_CURRENRT);
      }
  
      if (curr) {
        setAttribute(curr.button, ARIA_CURRENRT, true);
      }
    }
    /**
     * Initialize autoplay buttons.
     */
  
  
    function initAutoplay() {
      ['play', 'pause'].forEach(function (name) {
        var elm = Elements[name];
  
        if (elm) {
          if (!isButton(elm)) {
            setAttribute(elm, 'role', 'button');
          }
  
          setAttribute(elm, ARIA_CONTROLS, Elements.track.id);
          setAttribute(elm, ARIA_LABEL, i18n[name]);
        }
      });
    }
    /**
     * Initialize navigation slider.
     * Add button role, aria-label, aria-controls to slide elements and append screen reader text to them.
     *
     * @param {Splide} main - A main Splide instance.
     */
  
  
    function initNavigation(main) {
      Elements.each(function (Slide) {
        var slide = Slide.slide;
        var realIndex = Slide.realIndex;
  
        if (!isButton(slide)) {
          setAttribute(slide, 'role', 'button');
        }
  
        var slideIndex = realIndex > -1 ? realIndex : Slide.index;
        var label = sprintf(i18n.slideX, slideIndex + 1);
        var mainSlide = main.Components.Elements.getSlide(slideIndex);
        setAttribute(slide, ARIA_LABEL, label);
  
        if (mainSlide) {
          setAttribute(slide, ARIA_CONTROLS, mainSlide.slide.id);
        }
      });
    }
    /**
     * Update navigation attributes.
     *
     * @param {Object}  Slide  - A target Slide object.
     * @param {boolean} active - True if the slide is active or false if inactive.
     */
  
  
    function updateNavigation(_ref, active) {
      var slide = _ref.slide;
  
      if (active) {
        setAttribute(slide, ARIA_CURRENRT, true);
      } else {
        removeAttribute(slide, ARIA_CURRENRT);
      }
    }
    /**
     * Check if the given element is button or not.
     *
     * @param {Element} elm - An element to be checked.
     *
     * @return {boolean} - True if the given element is button.
     */
  
  
    function isButton(elm) {
      return elm.tagName === 'BUTTON';
    }
  
    return A11y;
  });
  // CONCATENATED MODULE: ./src/js/components/sync/index.js
  /**
   * The component for synchronizing a slider with another.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  /**
   * The event name for sync.
   *
   * @type {string}
   */
  
  var SYNC_EVENT = 'move.sync';
  /**
   * The keys for triggering the navigation button.
   *
   * @type {String[]}
   */
  
  var TRIGGER_KEYS = [' ', 'Enter', 'Spacebar'];
  /**
   * The component for synchronizing a slider with another.
   *
   * @param {Splide} Splide - A Splide instance.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var sync = (function (Splide) {
    /**
     * Keep the sibling Splide instance.
     *
     * @type {Splide}
     */
    var sibling = Splide.sibling;
    /**
     * Whether the sibling slider is navigation or not.
     *
     * @type {Splide|boolean}
     */
  
    var isNavigation = sibling && sibling.options.isNavigation;
    /**
     * Layout component object.
     *
     * @type {Object}
     */
  
    var Sync = {
      /**
       * Required only when the sub slider is available.
       *
       * @type {boolean}
       */
      required: !!sibling,
  
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        syncMain();
        syncSibling();
  
        if (isNavigation) {
          bind();
        }
      },
  
      /**
       * Called after all components are mounted.
       */
      mounted: function mounted() {
        if (isNavigation) {
          sibling.emit('navigation:mounted', Splide);
        }
      }
    };
    /**
     * Listen the primary slider event to move secondary one.
     * Must unbind a handler at first to avoid infinite loop.
     */
  
    function syncMain() {
      Splide.on(SYNC_EVENT, function (newIndex, prevIndex, destIndex) {
        sibling.off(SYNC_EVENT).go(sibling.is(LOOP) ? destIndex : newIndex, false);
        syncSibling();
      });
    }
    /**
     * Listen the secondary slider event to move primary one.
     * Must unbind a handler at first to avoid infinite loop.
     */
  
  
    function syncSibling() {
      sibling.on(SYNC_EVENT, function (newIndex, prevIndex, destIndex) {
        Splide.off(SYNC_EVENT).go(Splide.is(LOOP) ? destIndex : newIndex, false);
        syncMain();
      });
    }
    /**
     * Listen some events on each slide.
     */
  
  
    function bind() {
      sibling.Components.Elements.each(function (_ref) {
        var slide = _ref.slide,
            index = _ref.index;
  
        /*
         * Listen mouseup and touchend events to handle click.
         */
        Splide.on('mouseup touchend', function (e) {
          // Ignore a middle or right click.
          if (!e.button || e.button === 0) {
            moveSibling(index);
          }
        }, slide);
        /*
         * Subscribe keyup to handle Enter and Space key.
         * Note that Array.includes is not supported by IE.
         */
  
        Splide.on('keyup', function (e) {
          if (TRIGGER_KEYS.indexOf(e.key) > -1) {
            e.preventDefault();
            moveSibling(index);
          }
        }, slide, {
          passive: false
        });
      });
    }
    /**
     * Move the sibling to the given index.
     * Need to check "IDLE" status because slides can be moving by Drag component.
     *
     * @param {number} index - Target index.
     */
  
  
    function moveSibling(index) {
      if (Splide.State.is(IDLE)) {
        sibling.go(index);
      }
    }
  
    return Sync;
  });
  // CONCATENATED MODULE: ./src/js/components/breakpoints/index.js
  /**
   * The component for updating options according to a current window width.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  /**
   * Interval time for throttle.
   *
   * @type {number}
   */
  
  var THROTTLE = 50;
  /**
   * The component for updating options according to a current window width.
   *
   * @param {Splide} Splide - A Splide instance.
   *
   * @return {Object} - The component object.
   */
  
  /* harmony default export */ var components_breakpoints = (function (Splide) {
    /**
     * Store breakpoints.
     *
     * @type {Object|boolean}
     */
    var breakpoints = Splide.options.breakpoints;
    /**
     * The check function whose frequency of call is reduced.
     *
     * @type {Function}
     */
  
    var throttledCheck = throttle(check, THROTTLE);
    /**
     * Keep initial options.
     *
     * @type {Object}
     */
  
    var initialOptions;
    /**
     * An array containing objects of point and MediaQueryList.
     *
     * @type {Object[]}
     */
  
    var map = [];
    /**
     * Hold the previous breakpoint.
     *
     * @type {number|undefined}
     */
  
    var prevPoint;
    /**
     * Breakpoints component object.
     *
     * @type {Object}
     */
  
    var Breakpoints = {
      /**
       * Required only when the breakpoints definition is provided and browser supports matchMedia.
       *
       * @type {boolean}
       */
      required: breakpoints && matchMedia,
  
      /**
       * Called when the component is mounted.
       */
      mount: function mount() {
        map = Object.keys(breakpoints).sort(function (n, m) {
          return +n - +m;
        }).map(function (point) {
          return {
            point: point,
            mql: matchMedia("(max-width:" + point + "px)")
          };
        });
        /*
         * To keep monitoring resize event after destruction without "completely",
         * use native addEventListener instead of Splide.on.
         */
  
        this.destroy(true);
        addEventListener('resize', throttledCheck); // Keep initial options to apply them when no breakpoint matches.
  
        initialOptions = Splide.options;
        check();
      },
  
      /**
       * Destroy.
       *
       * @param {boolean} completely - Whether to destroy Splide completely.
       */
      destroy: function destroy(completely) {
        if (completely) {
          removeEventListener('resize', throttledCheck);
        }
      }
    };
    /**
     * Check the breakpoint.
     */
  
    function check() {
      var point = getPoint();
  
      if (point !== prevPoint) {
        prevPoint = point;
        var State = Splide.State;
        var options = breakpoints[point] || initialOptions;
        var destroy = options.destroy;
  
        if (destroy) {
          Splide.options = initialOptions;
          Splide.destroy(destroy === 'completely');
        } else {
          if (State.is(DESTROYED)) {
            State.set(CREATED);
            Splide.mount();
          }
  
          Splide.options = options;
        }
      }
    }
    /**
     * Return the breakpoint matching current window width.
     * Note that Array.prototype.find is not supported by IE.
     *
     * @return {number|string} - A breakpoint as number or string. -1 if no point matches.
     */
  
  
    function getPoint() {
      var item = map.filter(function (item) {
        return item.mql.matches;
      })[0];
      return item ? item.point : -1;
    }
  
    return Breakpoints;
  });
  // CONCATENATED MODULE: ./src/js/components/index.js
  /**
   * Export components.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  var COMPLETE = {
    Options: components_options,
    Breakpoints: components_breakpoints,
    Controller: controller,
    Elements: components_elements,
    Track: components_track,
    Clones: components_clones,
    Layout: layout,
    Drag: drag,
    Click: click,
    Autoplay: components_autoplay,
    Cover: components_cover,
    Arrows: components_arrows,
    Pagination: components_pagination,
    LazyLoad: lazyload,
    Keyboard: components_keyboard,
    Sync: sync,
    A11y: a11y
  };
  var LIGHT = {
    Options: components_options,
    Controller: controller,
    Elements: components_elements,
    Track: components_track,
    Clones: components_clones,
    Layout: layout,
    Drag: drag,
    Click: click,
    Arrows: components_arrows,
    Pagination: components_pagination,
    A11y: a11y
  };
  // CONCATENATED MODULE: ./build/complete/complete.js
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }
  
  /**
   * Export "Splide" class for frontend with full components.
   *
   * @author    Naotoshi Fujita
   * @copyright Naotoshi Fujita. All rights reserved.
   */
  
  
  /**
   * Export Splide with all components.
   */
  
  var complete_Splide = /*#__PURE__*/function (_Core) {
    _inheritsLoose(Splide, _Core);
  
    function Splide(root, options) {
      return _Core.call(this, root, options, COMPLETE) || this;
    }
  
    return Splide;
  }(splide_Splide); // Register the class as a global variable for non-ES6 environment.
  
  window.Splide = complete_Splide;
  
  /***/ })
  /******/ ]);
document.addEventListener( 'DOMContentLoaded', function () {
      
  var splide =new Splide( '#product-page__galery', {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '1rem',
        height : '8rem',
        cover  : true,
        autoplay: true,
        } ).mount();
} );