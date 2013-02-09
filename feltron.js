;(function ($) {

    "use strict"; //jshint ;_;

    // Function to get the Max value in Array
    Array.max = function (array) {
        return Math.max.apply( Math, array );
    };

    // Function to get the Min value in Array
    Array.min = function (array) {
       return Math.min.apply( Math, array );
    };

    var methods = {

        /**
         *
         *
         */

        heat: function (options) {

            /*
             * Extend default settings with any provided.
             * Will introduce in a later version.
             */

            var settings = $.extend({
                txt  : [
                    {
                        'font': '12px myriad-pro-condensed, "Myriad Pro Condensed", "Myriad Pro", Myriad, "DejaVu Sans Condensed", "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif', 
                        stroke: 'none', 
                        fill: '#666'
                    },
                    {
                        'font': '12px minion-pro, Times, "Times New Roman", serif', 
                        'font-style': 'italic', 
                        stroke: 'none', 
                        fill: '#666', 
                        'text-anchor': 'start'
                    }
                ],
                shade : ['102,102,102', '215,10,45'],
                shade1 : ['rgb(215,10,45)', 'rgb(102,102,102)']
            }, options);
    

            return this.each(function(){

                var data    = [],
                    axisx   = [],
                    axisy   = [],
                    axisz   = [],

                    $table = $(this);

                $('table', $table).hide();

                $('tbody td', $table).each(function() {
                    data.push(parseFloat($(this).text(), 10));
                });

                $('thead th', $table).each(function() {
                   axisz.push($(this).text()); 
                });
                $('tbody th', $table).each(function() {
                   axisy.push($(this).text()); 
                });
                $('tfoot th', $table).each(function() {
                   axisx.push($(this).text()); 
                });


                //draw
                var width   = $(this).width(),
                    height  = $(this).height(),
                    leftgutter = 30,
                    rightgutter = 60,
                    topgutter = 30,
                    bottomgutter = 90,
                    spacing = 0.5,

                    r = Raphael($(this).attr('id'), width, height),

                    Z = (width - topgutter) / axisz.length,
                    X = (width - rightgutter) / axisx.length,
                    Y = (height - bottomgutter) / axisy.length,

                    color = $(this).css('color'),

                    max = 55,
                    // settings.shade1 = ['rgb(215,10,45)', 'rgb(102,102,102)'],
                    fade = [ 0.4, 0.6, 0.8, 1, 0.8, 0.6 ],
                    fade1 = [ 0.1, 0.3, 0.45, 0.85, 0.45, 0.3 ]; 
                

                var fadeIn = Raphael.animation({ 
                    'fill-opacity' : 1
                }, 1100, "<>");
                
                var fadeIn = function(level) {
                    var anim = Raphael.animation({ 
                        'fill-opacity' : level
                    }, 1800, "<>");
                    
                    return anim;
                } 
                
                for (var i = 0, ii = axisz.length; i < ii; i++) {
                        r.text((Z * (i + 0.4)), 10, axisz[i]).attr(settings.txt[0])
                        .attr({ 'fill-opacity' : 0 })
                        .animate(fadeIn(0.7).delay((i+1)*50));
                }

                for (var i = 0, ii = axisx.length; i < ii; i++) {
                        var textx = r.text((X * (i + spacing)), height - (bottomgutter) + 20, axisx[i])
                        .attr(settings.txt[0]).attr({ transform: "r" + (-90), fill : settings.shade1[i % 2] })
                        .attr({'text-anchor': 'end', 'fill-opacity' : 0})
                        .animate(fadeIn(1).delay((i+1)*50));
                }

                for (var i = 0, ii = axisy.length; i < ii; i++) {
                    r.text(width - (rightgutter ), Y * (i + spacing) + 20, axisy[i])
                    .attr(settings.txt[1]).attr({'text-anchor': 'start', 'fill-opacity' : 0})
                    .animate(fadeIn(fade[i]).delay((i+1)*50));
                }

                var o = 0;
                for (var i = 0, ii = axisy.length; i < ii; i++) {
                    for (var j = 0, jj = axisx.length; j < jj; j++) {

                        /*
                         * Different styles goverened by weird loop selector from $.each(id)
                         * Removed. Will refactor later.
                         */
                        /*
                        if (id === 2) {
                            if (data[o] != 0) {
                                var R = 10;
                            } else {
                                var R = 0;
                            }
                        } else {*/
                            var R = data[o] && Math.min(Math.round(Math.sqrt(data[o] / Math.PI) * 12), max);
                        //}

                        if (R) {
                            (function (dx, dy, R, value) {
                                
                                var max = Array.max(data),
                                    value = (data[o] / max),
                                
                                    a = value,
                                    b = 0.9,
                                    opacity = (a + Math.random() * (b-a)),
                                
                                    anim = Raphael.animation({ 
                                        r : R
                                    }, (200 * (i+1)) + (200 * (j+1)), "bounce"),
                                
                                    color = "rgba(" + settings.shade[Math.round(a + Math.random() * (b-a))] + ","+ fade1[i] +")",

                                    dt = r.circle(dx + 60 + R, dy + 10, 0).attr({stroke: "none", fill: color})
                                        .animate(anim.delay(1000)),

                                    lbl = r.text(dx + 60 + R, dy + 10, data[o])
                                        .attr(settings.txt[0]).attr({fill: "#fff"}).hide();
                                
                                //if (id === 2) {
                                    // var dot = r.circle(dx + 60 + R, dy + 10, R+10).attr({stroke: "none", fill: "#000", opacity: 0});
                                //} else {
                                    var dot = r.circle(dx + 60 + R, dy + 10, data[o]+10).attr({stroke: "none", fill: "#000", opacity: 0});
                                //}
                                
                                dot[0].onmouseover = function () {
                                    var clr = Raphael.rgb2hsb(color);
                                    clr.b = .5;
                                    if (R < 8 ) {
                                        dt.animate({ r: 10,  "fill-opacity": 1}, 300, "bounce");
                                    } else {
                                        dt.animate({"fill" : Raphael.hsb2rgb(clr).hex, r: (R+2)}, 300, "bounce");
                                    }
                                    lbl.show();
                                    if (R > 50) {
                                        lbl.toFront(); // can be removed to fix hovers
                                        //dot.toFront(); // can be removed to fix hovers
                                    }
                                };
                                dot[0].onmouseout = function () {
                                    if (R < 8 ) {
                                        dt.animate({ r: R, "fill" : color, "fill-opacity" : opacity }, 300, "bounce");
                                    } else {
                                        dt.animate({"fill" : color, r: R}, 300, "bounce");
                                    }
                                    lbl.hide();
                                };

                            })((X * (j + spacing) - 60 - R), Y * (i + spacing) + 10, R, data[o]);
                        }
                        o++;
                    }
                }

            });


        },
        bar: function() {}
    };

    jQuery.fn.feltron = function(method) {

        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.heat.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.feltron' );
        }

    };

})(jQuery);