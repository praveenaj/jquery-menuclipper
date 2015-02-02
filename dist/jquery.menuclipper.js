/*
 *  jQuery Menu Clipper - v0.0.1
 *  Clips overflowing items from a navigation bar and adds them into a dropdown
 *  https://github.com/praveenaj/jquery-menuclipper
 *
 *  Made by Praveena Sarathchandra
 *  Under MIT License
 */
/*! Copyright 2012, Ben Lin (http://dreamerslab.com/)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 1.0.16
 *
 * Requires: jQuery >= 1.2.3
 */
;( function ( $ ){
  $.fn.addBack = $.fn.addBack || $.fn.andSelf;

  $.fn.extend({

    actual : function ( method, options ){
      // check if the jQuery method exist
      if( !this[ method ]){
        throw '$.actual => The jQuery method "' + method + '" you called does not exist';
      }

      var defaults = {
        absolute      : false,
        clone         : false,
        includeMargin : false
      };

      var configs = $.extend( defaults, options );

      var $target = this.eq( 0 );
      var fix, restore;

      if( configs.clone === true ){
        fix = function (){
          var style = 'position: absolute !important; top: -1000 !important; ';

          // this is useful with css3pie
          $target = $target.
            clone().
            attr( 'style', style ).
            appendTo( 'body' );
        };

        restore = function (){
          // remove DOM element after getting the width
          $target.remove();
        };
      }else{
        var tmp   = [];
        var style = '';
        var $hidden;

        fix = function (){
          // get all hidden parents
          $hidden = $target.parents().addBack().filter( ':hidden' );
          style   += 'visibility: hidden !important; display: block !important; ';

          if( configs.absolute === true ) style += 'position: absolute !important; ';

          // save the origin style props
          // set the hidden el css to be got the actual value later
          $hidden.each( function (){
            // Save original style. If no style was set, attr() returns undefined
            var $this     = $( this );
            var thisStyle = $this.attr( 'style' );

            tmp.push( thisStyle );
            // Retain as much of the original style as possible, if there is one
            $this.attr( 'style', thisStyle ? thisStyle + ';' + style : style );
          });
        };

        restore = function (){
          // restore origin style values
          $hidden.each( function ( i ){
            var $this = $( this );
            var _tmp  = tmp[ i ];

            if( _tmp === undefined ){
              $this.removeAttr( 'style' );
            }else{
              $this.attr( 'style', _tmp );
            }
          });
        };
      }

      fix();
      // get the actual value with user specific methed
      // it can be 'width', 'height', 'outerWidth', 'innerWidth'... etc
      // configs.includeMargin only works for 'outerWidth' and 'outerHeight'
      var actual = /(outer)/.test( method ) ?
        $target[ method ]( configs.includeMargin ) :
        $target[ method ]();

      restore();
      // IMPORTANT, this plugin only return the value of the first element
      return actual;
    }
  });
})( jQuery );

;
(function($, window, document, undefined) {

    // Create the defaults once
    var pluginName = "menuclipper",
        defaults = {
            menu : '.menuclipper-menu',
            item : '.menuclipper-menu > li',
            bufferWidth : 100
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            this.refresh();
        },
        refresh: function() {
            var $container = $(this.element);
            var $menuItems = $(this.options.item);

            var cWidth = $container.outerWidth(true);

            var itemsWidth = 0;
            var lastIndex = -1;
            var _this = this;
            
            $menuItems.each(function(index) {
                var itemWidth = $(this).actual('outerWidth', {
                    includeMargin: true
                });
                if (itemWidth + itemsWidth + _this.options.bufferWidth < cWidth) {
                    itemsWidth += itemWidth;
                    $(this).removeClass('hidden');
       
                } else {
                    if (lastIndex < 0) lastIndex = index;

                    $(this).addClass('hidden');
                }
            });

            var overflowingItems = $menuItems.splice(lastIndex, $menuItems.length);

            var $dropdown = $('.menuclipper-dropdown').length ? $('.menuclipper-dropdown') : $('<div class="dropdown menuclipper-dropdown"/>');
            !$('.menuclipper-dropdown').length && $dropdown.append('<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>');

            var $dropdownMenu = $('.menuclipper-dropdown-menu').length ? $('.menuclipper-dropdown-menu') : $('<ul class="dropdown-menu menuclipper-dropdown-menu pull-right" role="menu"/>');

            if (lastIndex > -1) {
                $dropdown.show();
                $dropdown.insertAfter($menuItems.eq(lastIndex - 1));

                $dropdownMenu.empty();
                for (var item in overflowingItems) {
                    var li = '<li role="presentation">' + $(overflowingItems[item]).html() + "</li>";
                    $dropdownMenu.append(li);
                }

                !$('.menuclipper-dropdown-menu').length && $dropdown.append($dropdownMenu);
            } else {
                $dropdown.hide();
            }
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

    var timeout;
    $(window).on('resize', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            var $menu = $('.menuclipper');
            $menu.each(function() {
                var plugin = $(this).data("plugin_" + pluginName);
                plugin.refresh();
            });
        }, 100);
    });


})(jQuery, window, document);