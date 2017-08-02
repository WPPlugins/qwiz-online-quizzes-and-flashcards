(function() {

     /* Register the button. */
     tinymce.create ('tinymce.plugins.qwiz_tinymce', {
          init : function(ed, url) {

               // Part of init: run qwizzled.  Do only for main editor (in case
               // others are present).
               if (ed.id == 'content') {
                  run_qwizzled (ed);

                  /**
                  * Run-qwizzled button.
                  */
                  ed.addButton( 'button_q', {
                     title : 'Qwizcards - enable/restart editing menu',
                     image : qwizzled_params.url + 'images/icon_qwiz.png',
                     onclick : function() {
                        if (typeof (qwizzled) == 'undefined') {
                           //console.log ('[qwiz_tinymce > create > load_qwizzled_if_needed]'); 
                           pre_qwizzled.load_qwizzled_if_needed (ed, true);
                        } else {
                           qwizzled.show_main_menu (ed, true);
                        }
                     }
                  });
               }
          },
          createControl : function (n, cm) {
               return null;
          },
     });
     /* Start the buttons */
     tinymce.PluginManager.add ( 'qwizzled_button_script', tinymce.plugins.qwiz_tinymce );


     // Load pre_qwizzled JavaScript -- will load qwizzled and jquery-ui if
     // needed, and then start qwizzled (show editing menu).
     function run_qwizzled (ed) {
        if (typeof (pre_qwizzled) == 'undefined') {
           //console.log ('[qwiz_tinymce.js > run_qwizzled] qwizzled_params:', qwizzled_params);
           var script = '<script src="' + qwizzled_params.url + 'pre_qwizzled.js"></script>\n';
           jQuery (script).appendTo ('body');
        }

        // Closure to pass editor instance.
        function run_pre_qwizzled () {
           //var msec = new Date ().getTime ();
           //console.log ('qwiz_tinymce.js [run_pre_qwizzled] msec', msec);

           // Keep looking for pre_qwizzled until it shows up.
           if (typeof (pre_qwizzled) == 'undefined') {
              setTimeout (run_pre_qwizzled, 10);
           } else {
              pre_qwizzled.load_qwizzled_if_needed (ed, false);
           }
        }

        setTimeout (run_pre_qwizzled, 10);
     }
     
})();
