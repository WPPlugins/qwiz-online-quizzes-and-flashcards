// Preliminary - see if [qwiz or [qdeck in editing area.  If so, load
// qwizzled.js and jquery-ui.min.js and show editing menu.  If called by "Q"
// button, do loads and show menu in any case.

// Called by TinyMCE startup or by added "Q" button (both via qwiz_tinymce.js).

// Do-nothing function for old IE.
if (! window.console) {
   window.console = {log: function(){} };
}


// =============================================================================
// Isolate namespace.
pre_qwizzled = {};
var pre_qwizzledf = function () {
// =============================================================================
//

// Debug settings.
var debug = [];
debug.push (false);    // 0 - general.

var $ = jQuery;

// Private data, but global to this pre_qwizzled instance.
var q = this;

// The identifier -- including qualifiers like "#" -- of the editing frame on
// WordPress.
var edit_area_selector = 'iframe#content_ifr, iframe#wpb_tinymce_content_ifr';
var $edit_area;


// -----------------------------------------------------------------------------
this.load_qwizzled_if_needed = function (ed, qwiz_button_b) {

   // Called from qwiz_tinymce.js.

   // Don't do if qwizard present.
   if (typeof (qwizard) != 'undefined') {
      return false;
   }

   // Is the visual editing frame present?
   var ok_f = false;
   if ($ (edit_area_selector).is (':visible')) {
      $edit_area = $ (edit_area_selector).contents ().find ('body');
      if ($edit_area.length > 0) {
         ok_f = true;
      }
   }
   if (ok_f) {

      // If auto-started (not Q button press) in qwiz_tinymce.js, see if [qwiz]
      // or [qdeck] on page.  Show menu only if one is.
      if (! qwiz_button_b) {
         var $contains_qwiz  = $edit_area.find ('*:contains("[qwiz")');
         var $contains_qdeck = $edit_area.find ('*:contains("[qdeck")');
         if (debug[0]) {
            console.log ('[load_qwizzled_if_needed] $contains_qwiz:', $contains_qwiz, ', $contains_qdeck:', $contains_qdeck);
         }
         if ($contains_qwiz.length == 0 && $contains_qdeck.length == 0) {

            // No [qwiz] or [qdeck] on page.  Do nothing.
            return false;
         }
      }

      // OK.  Load qwizzled.js and jquery-ui.min.js, and proceed to qwizzled.
      var scripts = '<script src="' + qwizzled_params.url + 'qwizzled.js"></script>\n'
                  + '<script src="' + qwizzled_params.url + 'jquery-ui.min.js"></script>\n';
                  // Done in qwizzled.js
                  //+ '<link rel="stylesheet" href="' + qwizzled_params.url + 'jquery-ui.css">\n';
      $ (scripts).appendTo ('body');

      // Closure to pass editor instance.
      function menu_start () {
         if (debug[0]) {
            var msec = new Date ().getTime ();
            console.log ('[pre_qwizzled.js > menu_start] msec:', msec);
         }
         if (typeof (qwizzled) == 'undefined') {
            setTimeout (menu_start, 10);
         } else {
            qwizzled.show_main_menu (ed, qwiz_button_b);
         }
      }

      setTimeout (menu_start, 10);
   } else {

      // Couldn't find editing window.  Error message only if Q button pressed.
      if (qwiz_button_b) {
         alert (T ('Could not find editing window.  You need to be editing a page or post in Visual mode.'));
         return false;
      }
   }
}


// =============================================================================
// Close - isolate namespace.
};


// -----------------------------------------------------------------------------
pre_qwizzledf.call (pre_qwizzled);


