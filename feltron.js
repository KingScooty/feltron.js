(function($) {

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

            var settings = $.extend({
            }, options);
    
            */

            return this.each(function(){

                var txt  = [
                    {'font': '12px myriad-pro-condensed, "Myriad Pro Condensed", "Myriad Pro", Myriad, "DejaVu Sans Condensed", "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif', stroke: 'none', fill: '#666'},
                    {'font': '12px minion-pro, Times, "Times New Roman", serif', 'font-style': 'italic', stroke: 'none', fill: '#666', 'text-anchor': 'start'}
                ];

                var data    = [],
                    axisx   = [],
                    axisy   = [],
                    axisz   = [],
                    // $table   = $('#data-heat'+(id+1)+' table');
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
                var width   = $(this).width(), //320, //UPDATE TO BE DYNAMIC
                    height  = 420,
                    leftgutter = 30,
                    rightgutter = 60,
                    topgutter = 30,
                    bottomgutter = 90,
                    spacing = 0.5,
                    // r = Raphael('heat'+(id+1), width, height),
                    r = Raphael($(this).attr('id'), width, height),
                    //X = (width - leftgutter) / axisx.length,
                    Z = (width - topgutter) / axisz.length,
                    X = (width - rightgutter) / axisx.length,
                    Y = (height - bottomgutter) / axisy.length,
                    // color = $('#heat'+(id+1)).css('color'),
                    color = $(this).css('color'),
                    //max = Math.round(X / 2) - 1; o % 2
                    max = 55,
                    shade1 = ['rgb(215,10,45)', 'rgb(102,102,102)'],
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
                    /*
                     * Scrap IE LT9 checks.
                     */
                    /*
                    if (!$('html.lt-ie9').exists()) {
                    */
                        r.text((Z * (i + 0.4)), 10, axisz[i]).attr(txt[0])
                        .attr({ 'fill-opacity' : 0 })
                        .animate(fadeIn(0.7).delay((i+1)*50));
                    /*
                    } else {
                        r.print((Z * (i + 0.4)), 10, axisz[i], r.getFont(cufon[0].font, 700), 12)
                        .attr({ 'fill-opacity': 0 }).attr({fill: '#666666'})
                        .animate(fadeIn(0.7).delay((i+1)*50));
                    }*/
                }

                for (var i = 0, ii = axisx.length; i < ii; i++) {
                        var textx = r.text((X * (i + spacing)), height - (bottomgutter) + 20, axisx[i])
                        .attr(txt[0]).attr({ transform: "r" + (-90), fill : shade1[i % 2] })
                        .attr({'text-anchor': 'end', 'fill-opacity' : 0})
                        .animate(fadeIn(1).delay((i+1)*50));

                }


                for (var i = 0, ii = axisy.length; i < ii; i++) {
                    r.text(width - (rightgutter ), Y * (i + spacing) + 20, axisy[i])
                    .attr(txt[1]).attr({'text-anchor': 'start', 'fill-opacity' : 0})
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
                                //var color = "hsb(" + [(1 - R / max) * .5, 1, .75] + ")";

                                //console.log("RADIUS: " + R + ' DATA: ' + data[o]);
                                
                                var max = Array.max(data);
                                var value = (data[o] / max);
                                
                                var a = value; //(R*2)/100; //0.2
                                var b = 0.9;
                                var opacity = (a + Math.random() * (b-a));
                                ////console.log(value);
                                
                                var shade = ['102,102,102', '215,10,45'];

                                ////console.log(Math.round(a + Math.random() * (b-a)));

                                ////console.log(0.2 + Math.random() * (0.9-0.2));
                                ////console.log( a + (b - a) * Math.random());
                                //var color = "rgba(215,10,45,"+ (0.2 + (0.9 - 0.2) * Math.random()) +")";
                                
                                var anim = Raphael.animation({ 
                                    r : R
                                }, (200 * (i+1)) + (200 * (j+1)), "bounce");
                                
                                var color = "rgba(" + shade[Math.round(a + Math.random() * (b-a))] + ","+ fade1[i] +")";
                                var dt = r.circle(dx + 60 + R, dy + 10, 0).attr({stroke: "none", fill: color})
                                .animate(anim.delay(1000));

                                var lbl = r.text(dx + 60 + R, dy + 10, data[o])
                                        .attr(txt[0]).attr({fill: "#fff"}).hide();
                                
                                //if (id === 2) {
                                    var dot = r.circle(dx + 60 + R, dy + 10, R+10).attr({stroke: "none", fill: "#000", opacity: 0});
                                //} else {
                                    var dot = r.circle(dx + 60 + R, dy + 10, data[o]+10).attr({stroke: "none", fill: "#000", opacity: 0});
                                //}
                                
                                dot[0].onmouseover = function () {
                                    var clr = Raphael.rgb2hsb(color);
                                    clr.b = .5;
                                    if (R < 8 ) {
                                        //dt.hide();
                                        //bg.show();
                                        dt.animate({ r: 10,  "fill-opacity": 1}, 300, "bounce");
                                    } else {
                                        //dt.attr("fill", Raphael.hsb2rgb(clr).hex);
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
                                        //dt.show();
                                        //bg.hide();
                                        dt.animate({ r: R, "fill" : color, "fill-opacity" : opacity }, 300, "bounce");
                                    } else {
                                        //dt.attr("fill", color);
                                        dt.animate({"fill" : color, r: R}, 300, "bounce");
                                    }
                                    lbl.hide();
                                };

                            //})(leftgutter + X * (j + .5) - 60 - R, Y * (i + .5) - 10, R, data[o]);
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