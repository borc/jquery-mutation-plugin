/* 
 * jQuery mutation plugin - stop/start events for rapid mutation series
 *  
 * Copyright (c) 2012 Teemu Pääkkönen, University of Tampere
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function( $, window, document, undefined ) {
	
	var options = {
		threshold: 500	
	};
	
	var createStartHandler = function( handler )
	{
		var timer = null;
		return function( e )
		{
			if ( timer === null ) handler.call( this, e );
			window.clearTimeout( timer );
			timer = window.setTimeout( function()
			{
				window.clearTimeout( timer );
				timer = null;
			}, options.threshold );
		};
	};
	
	var createStopHandler = function( handler )
	{
		var timer = null;
		return function( e )
		{
			window.clearTimeout( timer );
			timer = window.setTimeout( function()
			{
				window.clearTimeout( timer );
				timer = null;
				handler.call( this, e );
			}, options.threshold );
		};
	};
	
	var eventError = function( event )
	{
		$.error( 'Event jQuery.mutation.' + event + ' does not exist' );
	};
	
	var events = {
	
		// Set handler function for mutation start.
		start: function( handler )
		{
			return this.on( 'DOMSubtreeModified.mutation.start', createStartHandler( handler ) );
		},
		
		// Set handler function for mutation stop.
		stop: function( handler )
		{
			return this.on( 'DOMSubtreeModified.mutation.stop', createStopHandler( handler ) );
		}
	};
	
	var methods = {
		
		// Set handler function for mutation start.
		start: function( handler )
		{
			return events[ 'start' ].apply( this, Array.prototype.slice.call( arguments, 0 ) );
		},
		
		// Set handler function for mutation stop.
		stop: function( handler )
		{
			return events[ 'stop' ].apply( this, Array.prototype.slice.call( arguments, 0 ) );
		},
		
		// Returns true if mutation events are supported by browser
		supported: function()
		{
			// Rely on MutationEvent interface.
			// The interface can either be an object or a function, depending
			// on the browser.
			return ( typeof MutationEvent !== 'undefined' );
		},
		
		// Bind an event handler.
		bind: function( event )
		{
			if ( events[ event ] )
			{
				return events[ event ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
			}
			eventError( event );
		},
		
		// Shortcut for bind()
		on: function()
		{
			return methods[ 'bind' ].apply( this, Array.prototype.slice.call( arguments, 0 ) );
		},
		
		// Unbinds all handlers for an event
		unbind: function( event )
		{
			if ( events[ event ] )
			{
				return this.off( 'DOMSubtreeModified.mutation.' + event );
			}
			eventError( event );
		},
		
		// Shortcut for unbind()
		off: function( event )
		{
			return methods[ 'unbind' ].apply( this, Array.prototype.slice.call( arguments, 0 ) );
		}
	};
	
	$.fn.mutation = function( method ) {
		if ( methods[ method ] )
		{
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		}
		$.error( 'Method jQuery.mutation.' + method + ' does not exist' );
	};
})( jQuery, window, document );
