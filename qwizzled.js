/*
 * Version 3.11 2016-04-23
 * Register quizzes/decks - wasn't allowing flashcard decks to be registered.
 *
 * Version 3.10 2016-04-20
 * Menu item - create and use datasets.
 *
 * Version 3.01 2015-12-14
 * Fix registration permalink/URL capture - WordPress 4.4 change.
 *
 * Version 3.00 2015-10-25
 * Register quizzes/decks menu option.
 *
 * Version 2.29 2015-04-26
 * Don't use <code></code> for already-wrapped [q] and [l].
 * Warnings on removing blank labels.
 * Error if selection already is a target.
 * "Create another target for the same label".
 * "Delete a target".
 *
 * Version 2.27 2015-01-05
 * Make sure labeled-diagram questions contain matching opening/closing divs.
 *
 * Version 2.24 2014-12-15
 * Make $ (= jQuery) private.
 * Alternate edit-area iframe id: wpb_tinymce_content_ifr.
 *
 * Version 2.22 2014-11-07
 * Multiple targets for a single label.
 * Accommodate image resizing (resize wrapper, reposition targets).
 * Don't use text_target_wrapper (rely on qtarget_sibs-... instead).
 * Keep [!] comments at end of labeled-diagram question outside the question div.
 * Fix: made headers into labels.
 *
 * Version 2.18 2014-11-16
 * More backwards compatibility fixes (labeled diagrams assoc_id).
 * Move comments ([!] ... [/!] after labels, delete trailing whitespace in
 * labels.
 *
 * Version 2.16 2014-11-12
 * Delete question and label divs with nothing in them.
 * Nicer formatting of labeled diagram borders in editor.
 * Improve backwards compatibility with data- (identify labels having targets).
 *
 * Version 2.11 2014-11-03
 * Use class instead of style for target/label borders (avoid "flash").
 * Use class "qtarget_assocNNN..." instead of data-...; some implementations
 * eat data-...
 * If feedback fadeout stopped, reset opacity (since jQuery doesn't).
 *
 * Version 2.09 2014-10-12
 * Warn/prevent use of images with captions for labeled diagrams.
 *
 * Version 2.08 2014-10-05
 * Add internationalization - use .po and .mo files.
 * Add div.post-entry as page content location.
 *
 * Version 2.01 2014-09-16
 * Modify menu header for Safari on Mac.
 *
 * Version 2.00 2014-09-14
 * Position targets where click.
 * Error message if no questions when click menu.
 * Raise menu z-index (TinyMCE 4.0).
 *
 * Version 1.1b03 2014-09-07
 * Labeled-diagrams capability, including interactive editing.
 */

// Set up interactive labeled diagrams within WordPress editor.  Invoked by
// TinyMCE startup or by added "Q" button.

// Do-nothing function for old IE.
if (! window.console) {
   window.console = {log: function(){} };
}


// =============================================================================
// Isolate namespace.
qwizzled = {};
var qwizzledf = function () {
// =============================================================================

var qname = 'qwizzled';

// Debug settings.
var debug = [];
debug[0]  = false;     // general.
debug[1]  = false;     // Label checks.
debug[2]  = false;     // Preliminary checks.
debug[3]  = false;     // Register/datasets.
debug[4]  = false;     // Reposition targets.
debug[10] = false;     // parse_html_block ().

var $ = jQuery;

// Publicly available.
this.$edit_area;

// Set in qwizard.js.
this.qwiz_deck_attributes;
this.question_attributes;
this.qwiz_deck;

// Private data, but global to this qwizzled instance.
var q = this;

// The identifier -- including qualifiers like "#" -- of the editing frame on
// WordPress.
var editing_page_selector;
var edit_area_selector    = 'iframe#content_ifr, iframe#wpb_tinymce_content_ifr';
var $qwizzled_edit_area;
var $qwizzled_main_menu_feedback;
var expand_qwizzled_menu_items_b = false;

var errmsgs = [];

var n_qwizzes = 0;

var no_q_code_b;
var any_labeled_diagram_questions_b;

this.tinymce_ed = '';
this.qwizzled_tinymce_ed = '';
var dataset_b;

var waiting_for_label_click_b = false;
var label_will_have_multiple_targets_b = false;
var add_delete_label_f = false;
var edit_label_feedback = '';
var waiting_for_target_select_b = false;
var waiting_for_target_to_delete_click_b = false;
var decoy_target_b = false;
var $qwizzled_question;
var el_label_div = null;
var label_border_class;
var assoc_id;

var bstyles = ['dotted', 'dashed', 'solid'];
var bcolors = ['red', 'magenta', 'blue', 'aqua', 'black', 'silver'];

var horizontal_margin_adjust = 4;
var vertical_margin_adjust   = 4;

var head = '';
var jjax_script_no = 0;
this.maker_logged_in_b = false;

var n_qwizzes;
var n_decks;

var hide_new_account_info_timeout;
var register_qq3_timeout;
var register_qq3_response_f;
var permalink;
var qq_dataset;

this.qwizard_b         = false; // Indicates interactive editing with qwizard.js.
this.wp_editing_page_f = true;  // Indicates whether on WordPress or not.
var $qwizard_dialog;
var waiting_for_quiz_deck_click = '';
var current_html;
var current_qwiz_deck_html;
var qbookmark;


// -----------------------------------------------------------------------------
this.show_main_menu = function (ed, qwiz_button_b) {

   // Called from qwiz_tinymce.js or from pre_qwizzled.js, or from qwizard.js.
   if (debug[0]) {
      console.log ('[show_main_menu] ed:', ed);
      console.log ('[show_main_menu] q.qwizard_b:', q.qwizard_b, ', qwiz_button_b:', qwiz_button_b);
   }
   if (q.qwizard_b) {
      editing_page_selector = '#qwizard_result';
   } else {
      editing_page_selector = '#wp-content-editor-container';
   }

   if (typeof (qwizzled_params) == 'undefined') {
      q.init_qwizzled_params ();;
   }

   // Save editor object instance and a "backup" in case qwizard clobbers.
   q.tinymce_ed = ed;
   if (! q.qwizzled_tinymce_ed) {
      q.qwizzled_tinymce_ed = ed;
   }
   if (debug[0]) {
      var msec = new Date ().getTime ();
      console.log ('[show_main_menu] msec:', msec);
      console.log ('[show_main_menu] ed:', ed);
   }

   // If update message from previous save, show, erase (locally -- in case menu
   // closed/reopened).
   if (qwizzled_params.update_msg) {
      alert (qwizzled_params.update_msg);
      qwizzled_params.update_msg = '';
   }

   // If qwizard, $edit_area will be reset to current question in qwizard.
   var ok_f;
   if (q.qwizard_b) {
      ok_f = true;
      q.$edit_area = $ ('#qwizard_result');
   } else {
      ok_f = false;

      // Is the visual editing frame present?
      if ($ (edit_area_selector).is (':visible')) {
         q.$edit_area = $ (edit_area_selector).contents ().find ('body');
         if (q.$edit_area.length > 0) {
            ok_f = true;
         }
      }
   }
   if (ok_f) {

      // If auto-started (not Q button press) in qwiz_tinymce.js, see if [qwiz]
      // or [qdeck] on page.  Show menu only if one is.
      if (! qwiz_button_b) {
         var $contains_qwiz  = q.$edit_area.find ('*:contains("[qwiz")');
         var $contains_qdeck = q.$edit_area.find ('*:contains("[qdeck")');
         if (debug[0]) {
            console.log ('[show_main_menu] $contains_qwiz:', $contains_qwiz, ', $contains_qdeck:', $contains_qdeck);
         }
         if ($contains_qwiz.length == 0 && $contains_qdeck.length == 0) {

            // No [qwiz] or [qdeck] on page.  Do nothing.
            return false;
         }
      }

      // If dataset= on page, and not logged in, will show message to
      // login if maker wants to update dataset questions.
      var $contains_dataset = q.$edit_area.find ('*:contains(" dataset=")');
      dataset_b = $contains_dataset.length;

      q.add_style ();
      add_style_edit_area ();

      // If maker hasn't explicitly logged in, see if session ID indicates so.
      if (! q.qwizard_b && ! q.maker_logged_in_b) {

         // Callback is show_main_menu2.
         check_session_id ('show_main_menu2');
      } else {
         q.show_main_menu2 ();
      }
   } else {

      // Couldn't find editing window.  Error message only if Q button pressed.
      if (qwiz_button_b) {
         alert (T ('Could not find editing window.  You need to be editing a page or post in Visual mode.'));
         return false;
      }
   }
}


// -----------------------------------------------------------------------------
this.show_main_menu2 = function () {

   // Is there already a menu present?  If so, delete it and create new.  Assume
   // styles are still present.
   var $existing_menu = $ ('#qwizzled_main_menu');
   if (debug[0]) {
      console.log ('[show_main_menu2] $existing_menu:', $existing_menu);
   }
   if ($existing_menu.length) {
      $existing_menu.remove ();
   }

   // Create new menu.  HTML.
   var mm = [];

   mm.push ('<div id="qwizzled_main_menu" class="qwizzled_main_menu" style="height: auto;">');
   mm.push (   '<div id="qwizzled_main_menu_header" class="qwizzled_main_menu_header">');
   mm.push (      '<img src="' + qwizzled_params.url + 'images/icon_qwiz.png" class="icon_qwiz" />');
   mm.push (      '<div class="qwizzled_main_menu_title">');
   if (q.qwizard_b) {
      mm.push (      'Labeled diagram ' + T ('editing menu'));
   } else {
      mm.push (      'Qwizcards - ' + T ('editing menu'));
   }
   mm.push (      '</div>');
   mm.push (      '<img src="' + qwizzled_params.url + 'images/icon_exit_red.png" class="icon_main_menu_exit" onclick="qwizzled.exit_main_menu ()" />');
   mm.push (   '</div>');
   mm.push (   '<div id="qwizzled_main_menu_items">');
   if (! q.qwizard_b) {
      mm.push (   '<div class="qwizzled_main_menu_item" onclick="qwizzled.qwizard_new_or_edit_existing ()" title="Create or edit a quiz or deck - interactive GUI">');
      mm.push (      'Qwizcards interactive editing wizard');
      mm.push (   '</div>');
      if (! expand_qwizzled_menu_items_b) {
         mm.push ('<div class="qwizzled_main_menu_item" onclick="qwizzled.expand_qwizzled_menu_items ()" title="Show options for Qwizcards shortcodes">');
         mm.push (   'Edit shortcodes directly - labeled diagram options');
         mm.push ('</div>');
      }
      mm.push (   '<div class="qwizzled_main_menu_item" onclick="qwizzled.register_qqs (\'qq\')" title="Options for recording student scores">');
      mm.push (      'Enable progress recording for quizzes/flashcard decks');
      mm.push (   '</div>');
      mm.push (   '<div class="qwizzled_main_menu_item" onclick="qwizzled.register_qqs (\'dataset\')" title="Use a set of questions from the database in a quiz/deck, or save questions to database">');
      mm.push (      'Quizzes/decks &ndash; use &ldquo;dataset&rdquo; or save as &ldquo;dataset&rdquo;');
      mm.push (   '</div>');
      if (expand_qwizzled_menu_items_b) {
         mm.push ('<hr>');
         mm.push ('<div class="qwizzled_main_menu_item" onclick="qwizzled.create_target1 (0, 0)" title="Create a target &ldquo;drop zone&rdquo; for a label - click here, then click label">');
         mm.push (   'Create target for a label');
         mm.push ('</div>');
         mm.push ('<div id="create_another_target_same_label" class="qwizzled_main_menu_item_disabled" onclick="qwizzled.create_target_for_same_label ()" title="The previously-selected label may be correctly placed in more than one target &ldquo;drop zone&rdquo;">');
         mm.push (   'Create another target for the <b>same</b> label');
         mm.push ('</div>');
      }
   }
   if (q.qwizard_b) {

      // Label position.  Current-question setting done below.
      mm.push (      '<div>');
      mm.push (         'Labels:');
      mm.push (         '<input type="radio" name="labels_position" class="labels_right  qwizard_shift_icon" onclick="qwizard.set_labels_position (\'right\')" />');
      mm.push (         'right &ensp;');
      mm.push (         '<input type="radio" name="labels_position" class="labels_top    qwizard_shift_icon" onclick="qwizard.set_labels_position (\'top\')" />');
      mm.push (         'top &ensp;');
      mm.push (         '<input type="radio" name="labels_position" class="labels_left   qwizard_shift_icon" onclick="qwizard.set_labels_position (\'left\')" />');
      mm.push (         'left &ensp;');
      mm.push (         '<input type="radio" name="labels_position" class="labels_bottom qwizard_shift_icon" onclick="qwizard.set_labels_position (\'bottom\')" />');
      mm.push (         'bottom');
      mm.push (      '</div>');

      mm.push (      '<div class="qwizzled_main_menu_item" onclick="qwizzled.create_target1 (0, 1)" title="Add a label to or delete a label from the list of labels to be placed.">');
      mm.push (         'Add or delete a label/target');
      mm.push (      '</div>');

      mm.push (      '<div class="qwizzled_main_menu_item" onclick="qwizzled.edit_label_feedback (\'correct\')" title="Show feedback given when this label is correctly placed.">');
      mm.push (         'Enter/edit feedback for label when placed <b>correctly</b>');
      mm.push (      '</div>');

      mm.push (      '<div class="qwizzled_main_menu_item" onclick="qwizzled.edit_label_feedback (\'incorrect\')" title="Show feedback given when this label is incorrectly placed.">');
      mm.push (         'Enter/edit feedback for label when placed <b>incorrectly</b>');
      mm.push (      '</div>');
   }
   if (q.qwizard_b || expand_qwizzled_menu_items_b) {
      mm.push (   '<div class="qwizzled_main_menu_item" onclick="qwizzled.create_target1 (1, 0)" title="Select a label that may be correctly placed in more than one target &ldquo;drop zone&rdquo;">');
      mm.push (      'Create another target for');
      mm.push (      '<span id="main_menu_different_label">');
      mm.push (         'an <b>existing</b>');
      mm.push (      '</span>');
      mm.push (      'label');
      mm.push (   '</div>');
   }
   if (q.qwizard_b) {
      mm.push (   '<div id="create_another_target_same_label" class="qwizzled_main_menu_item" onclick="qwizzled.create_target_for_same_label ()" style="display: none;" title="The label you selected may be correctly placed in more than one target &ldquo;drop zone&rdquo;">');
      mm.push (      'Create another target for this label');
      mm.push (   '</div>');
   }
   if (q.qwizard_b || expand_qwizzled_menu_items_b) {
      mm.push (   '<div class="qwizzled_main_menu_item" onclick="qwizzled.create_decoy_target ()" title="Create a target &ldquo;drop zone&rdquo; that will not accept a label">');
      mm.push (      'Create a decoy target');
      mm.push (   '</div>');
      mm.push (   '<div class="qwizzled_main_menu_item" onclick="qwizzled.delete_target ()" title="Delete a target &ldquo;drop zone&rdquo; &ndash; though not its underlying image.">');
      mm.push (      'Delete a target');
      mm.push (   '</div>');
   }
   mm.push (   '</div>');  // End qwizzled_menu_items.
   mm.push (   '<div class="qwizzled_main_menu_feedback"></div>');
   mm.push ('</div>');

   // Put on current (editor) page, not in content iframe!
   $ (editing_page_selector).append (mm.join ('\n'));
   $qwizzled_main_menu_feedback = $ ('div.qwizzled_main_menu_feedback');

   // Set current value of labels position.
   if (q.qwizard_b) {
      var top_left_right_bottom = '';
      if (q.question_attributes) {
         top_left_right_bottom = get_attr (q.question_attributes, 'labels');
      }
      if (! top_left_right_bottom) {

         // Default.
         top_left_right_bottom = 'right';
      }
      $ ('input[name="labels_position"].labels_' + top_left_right_bottom)[0].checked = true;
   }

   // If dataset= quiz/deck on page, and maker not logged in, set message.
   if (dataset_b) {
      if (! q.maker_logged_in_b) {
         var login_msg = 'Note: if you want to add or edit dataset questions, please <a href="javascript: qwizzled.show_login ()">log in</a> in order to save them in the Qwizcards database (which happens when you click the WordPress "Update" button)'
                         + '<img src="' + qwizzled_params.url + 'images/icon_exit_bw.jpg" class="click_on____exit" onclick="jQuery (\'div.qwizzled_main_menu_feedback\').hide ()" />';
         $qwizzled_main_menu_feedback.html (login_msg).show ();

         // Also, remove session ID cookie, in case there but no longer valid.
         $.removeCookie ('maker_session_id', {path: '/'});
      }
   }

   // Make menu draggable.
   $ ('#qwizzled_main_menu').draggable ({handle: '#qwizzled_main_menu_header'});

   // For registering a quiz, create dialog box, analogous to main menu.
   q.create_register_qqs_dialog_box (editing_page_selector);

   // Make anything that was previously draggable draggable and anything that
   // was previously resizable resizable.  If qwizard, need delay (perhaps
   // jQuery dialog is clobbering).
   if (q.qwizard_b) {
      var delay_reinit_dragging = function () {
         q.reinit_dragging (q.$edit_area);
      }
      setTimeout (delay_reinit_dragging, 500);
   } else {
      q.reinit_dragging (q.$edit_area);
   }

   // Bind TinyMCE image/object selects (note: doesn't apply to text) to
   // function.  UNNEEDED.  Mouseup plus TinyMCE selection.getContent () works
   // for <img .../> html.
   /*
   q.tinymce_ed.on ('ObjectSelected', function (e) {
      q.target_object_selected (e);
   });
   */

   // Listen for resize events -- if a wrapped image (one that has associated
   // targets) is resized, resize wrapper with it.  Also reposition targets to
   // re-establish same relative positions on resized image.
   q.tinymce_ed.on ('ObjectResized', function (e) {
      if (e.target.nodeName == 'IMG') {
         var $image = $ (e.target);

         // Look for parent with id that starts with "qwizzled_img_wrapper".
         var $image_wrapper = $image.parents ('[id^="qwizzled_img_wrapper"]');
         if (debug[0]) {
            console.log ('resized:', e.target);
            console.log ('width:', e.width, 'height:', e.height);
            console.log ('$image:', $image);
            console.log ('$image_wrapper:', $image_wrapper);
         }
         if ($image_wrapper.length) {

            // Grab current width and height to calculate scaling factors.
            var old_width  = $image_wrapper.width ();
            var old_height = $image_wrapper.height ();
            var width_factor  = e.width  / old_width;
            var height_factor = e.height / old_height;

            // data-mce-style attribute clobbers resize info (presumably during
            // TinyMCE save process).
            $image_wrapper.removeAttr ('data-mce-style').css ({width: e.width + 'px', height: e.height + 'px'});;

            // Reposition the targets consistent with the resize (but let's not
            // resize the targets).
            $image_wrapper.find ('.qwizzled_target').each (function () {
               var position = $ (this).position ();
               var old_left = position.left;
               var old_top  = position.top;
               var new_left = old_left * width_factor;
               var new_top  = old_top  * height_factor;
               $ (this).css ({left: new_left + 'px', top: new_top + 'px'});
               if (debug[4]) {
                  console.log ('[on ObjectResized] old_left:', old_left, ', old_top:', old_top);
               }
            });
         }
      }
   });

   // Add the bubble-bar wrapper to the body.
   if ($ ('#bubbleBarWrapper').length == 0) {
      $ ('<div id="bubbleBarWrapper"></div>').appendTo ('body');
   }
};


// -----------------------------------------------------------------------------
this.create_register_qqs_dialog_box = function (local_editing_page_selector) {

   // Do only if not already present.
   if ( $ ('#register_qqs_dialog_box').length == 0) {
      var ddiv = [];

      ddiv.push ('<div id="register_qqs_dialog_box">');
      ddiv.push (   '<div id="register_qqs_header" class="qwizzled_main_menu_header">');
      ddiv.push (      '<img src="' + qwizzled_params.url + 'images/icon_qwiz.png" class="icon_qwiz" />');

      // Title set in register_qqs ().
      ddiv.push (      '<div class="qwizzled_main_menu_title">');
      ddiv.push (      '</div>');
      ddiv.push (      '<img src="' + qwizzled_params.url + 'images/icon_exit_red.png" class="icon_main_menu_exit" onclick="qwizzled.exit_register_qqs ()" />');
      ddiv.push (   '</div>');
      ddiv.push (   '<div id="register_qqs_login" style="display: none;">');
      ddiv.push (      '<br /><br />');
      ddiv.push (      '<b>Qwizcards administrative login</b>');
      ddiv.push (      '<form action="nada" onSubmit="return qwizzled.login ()">');
      ddiv.push (      '<table border="0" align="center">');
      ddiv.push (         '<tr>');
      ddiv.push (            '<td>');
      ddiv.push (               '<label for="qwizzled_username">'+ T ('User name') + '</label>');
      ddiv.push (            '</td>');

      var onfocus = 'onfocus="jQuery (\'#register_qqs_login p.login_error\').css ({visibility: \'hidden\'})"';

      ddiv.push (            '<td>');
      ddiv.push (               '<input type="text" id="qwizzled_username" ' + onfocus + ' />');
      ddiv.push (            '</td>');
      ddiv.push (         '</tr>');
      ddiv.push (         '<tr>');
      ddiv.push (            '<td>');
      ddiv.push (               '<label for="qwizzled_password">'+ T ('Password') + '</label>');
      ddiv.push (            '</td>');
      ddiv.push (            '<td>');
      ddiv.push (               '<input type="password" id="qwizzled_password" ' + onfocus + ' />');
      ddiv.push (            '</td>');
      ddiv.push (         '</tr>');
      ddiv.push (         '<tr>');
      ddiv.push (            '<td colspan="2" align="center">');
      ddiv.push (               '<input type="submit" value="Login" />');
      ddiv.push (               '&emsp;');
      ddiv.push (               '<input type="button" value="Cancel" onclick="qwizzled.exit_register_qqs ()" />');
      ddiv.push (               ' &emsp; ');
      ddiv.push (               '<a href="' + qwizzled_params.secure_server_loc + '/new_account" target="_blank">');
      ddiv.push (                  'Create new account</a> <img src="' + qwizzled_params.url + 'images/info_icon.png" class="new_account_info" onmouseenter="qwizzled.show_new_account_info ()" onmouseleave="qwizzled.hide_new_account_info ()">');
      ddiv.push (            '</td>');
      ddiv.push (         '</tr>');
      ddiv.push (         '<tr>');
      ddiv.push (            '<td colspan="2">');
      ddiv.push (               '<a href="' + qwizzled_params.server_loc + '/password_reset_request?m=1" class="qwizzled_smaller" target="_blank">');
      ddiv.push (                  'Forgot password?</a>');
      ddiv.push (            '</td>');
      ddiv.push (         '</tr>');
      ddiv.push (      '</table>\n');
      ddiv.push (      '</form>\n');
      ddiv.push (      '<p class="login_error">');
      ddiv.push (         T ('Login incorrect. Please try again'));
      ddiv.push (      '</p>\n');
      ddiv.push (      '<div id="new_account_info">');
      ddiv.push (         'With a Qwizcards administrative account you can get reports of your students&rsquo; quiz scores and use of flashcard decks.');
      ddiv.push (      '</div>');
      ddiv.push (   '</div>');
      ddiv.push (   '<div id="register_qqs_user">');
      ddiv.push (   '</div>');
      ddiv.push (   '<div id="register_qqs_main" style="display: none;">');
      ddiv.push (   '</div>');
      ddiv.push ('</div>');

      // Put on current (editor) page, not in content iframe!
      $ (local_editing_page_selector).append (ddiv.join ('\n'));

      // Make draggable.
      $ ('#register_qqs_dialog_box').draggable ({handle: '#register_qqs_header'});
   }
}


// -----------------------------------------------------------------------------
this.init_qwizzled_params = function () {
   var local_server_loc = get_qwiz_param ('server_loc');
   var admin = local_server_loc.indexOf ('admin') == -1 ? 'admin/' : '';
   qwizzled_params = {url:                get_qwiz_param ('url', './'),
                      server_loc:         get_qwiz_param ('server_loc', 'http://qwizcards.com') + admin,
                      secure_server_loc:  get_qwiz_param ('secure_server_loc', 'https://host359.hostmonster.com/~whereisq/qwiz') + admin,
                     }
   if (debug[0]) {
      console.log ('[init_qwizzled_params] qwizzled_params:', qwizzled_params);
   }
}


// -----------------------------------------------------------------------------
this.reinit_dragging = function ($edit_area) {

   // Make anything that was previously draggable draggable and anything that
   // was previously resizable resizable.  Also, remove the 'data-mce-style'
   // attribute -- however it's used, it clobbers drag and resize info.
   // DEDRAG
   var $draggables;
   if (q.qwizard_b) {
      $draggables = $edit_area.find ('.qwizzled_target.ui-draggable');
   } else {
      $draggables = $edit_area.find ('.ui-draggable');
   }
   var $resizables = $edit_area.find ('div.ui-resizable');
   if (debug[0]) {
      console.log ('[reinit_dragging] $edit_area:', $edit_area);
      console.log ('[reinit_dragging] $draggables:', $draggables);
      console.log ('[reinit_dragging] $resizables:', $resizables);
   }
   if ($draggables.draggable ('instance')) {
      $draggables.draggable ('destroy');
   }
   $draggables.draggable ();

   // First remove any already-created resizable-handle divs.
   if ($resizables.resizable ('instance')) {
      $resizables.resizable ('destroy');
   }

   // Just in case...
   $resizables.find ('div.ui-resizable-handle').remove ();

   $resizables.resizable ({
      resize: function (e, ui_obj) {
         if (debug[0]) {
            console.log ('[reinit_dragging > resize]: $ (this):', $ (this));
         }

         // Set the left and bottom margins of the target div to offset the
         // (resized) width and height of the div (kludge to enable use of
         // relative positioning rather than absolute, which gets extra
         // "drag handle" in Firefox).
         $ (this).css ({'margin-right': -(ui_obj.size.width + horizontal_margin_adjust) + 'px', 'margin-bottom': -(ui_obj.size.height + vertical_margin_adjust) + 'px'});
      }
   }).removeAttr ('data-mce-style');
   var $resizable_handles = $resizables.find ('div.ui-resizable-handle');
   if (debug[0]) {
      console.log ('[reinit_dragging] $resizable_handles:', $resizable_handles);
   }
   $resizable_handles.css ({'z-index': 105});
}


// -----------------------------------------------------------------------------
this.show_new_account_info = function () {
   clearTimeout (hide_new_account_info_timeout);
   $ ('#new_account_info').show ();
}


// -----------------------------------------------------------------------------
this.hide_new_account_info = function () {
   hide_new_account_info_timeout = setTimeout ("jQuery ('#new_account_info').hide ()", 2000);
}


// -----------------------------------------------------------------------------
// Hide main menu, reset flags.
this.exit_main_menu = function () {

   $ ('#qwizzled_main_menu').hide ();

   waiting_for_target_select_b          = false;
   waiting_for_label_click_b            = false;
   waiting_for_target_to_delete_click_b = false;
   label_will_have_multiple_targets_b   = false;
   add_delete_label_f                   = false;
   edit_label_feedback                  = '';
   decoy_target_b                       = false;
}


// -----------------------------------------------------------------------------
// Add style to editing-page head.
this.add_style = function () {

   // Don't do if already done.
   if ($ ('#qwizzled_editing_page').length) {
      return false;
   }

   var s = [];

   s.push ('<style id="qwizzled_editing_page" type="text/css">');

   s.push ('.qwizzled_image {');
   s.push ('   display:          inline-block;');
   s.push ('}');

   s.push ('#qwizzled_main_menu {');
   s.push ('   position:        fixed;');
   s.push ('   width:           21rem;');
   s.push ('   height:          auto;');
   s.push ('   line-height:     1.4em;');
   s.push ('   box-shadow:      3px 3px 2px gray;');

   // Want to beat TinyMCE toolbars at 999.
   s.push ('   z-index:         1000;');
   s.push ('   right:           125px;');
   s.push ('   top:             250px;');
   s.push ('   border:          2px solid rgba(79, 112, 153, 1);');
   s.push ('}');

   s.push ('div.qwizzled_main_menu_header {');
   s.push ('   position:        relative;');
   s.push ('   height:          22px !important;');
   s.push ('   color:           white;');
   s.push ('   background:      rgba(79, 112, 153, 1);');
   s.push ('   font-weight:     bold;');
   //s.push ('   vertical-align:  40%;');
   s.push ('   cursor:          move;');
   s.push ('}');

   s.push ('.icon_qwiz {');
   s.push ('   position:        absolute;');
   s.push ('   background:      white;');
   s.push ('   border:          none;');
   s.push ('}');

   s.push ('div.qwizzled_main_menu_title {');
   s.push ('   position:        absolute;');
   s.push ('   left:            24px;');
   s.push ('   top:             2px;');
   s.push ('}');

   s.push ('.icon_main_menu_exit {');
   s.push ('   float:           right;');
   s.push ('   border:          none;');
   s.push ('   margin-top:      2px;');
   s.push ('   margin-right:    1px;');
   s.push ('   cursor:          pointer;');
   s.push ('}');

   s.push ('#qwizzled_main_menu_items {');
   s.push ('   background:      white;');
   //DKTMP
   //s.push ('   padding:         5px;');
   s.push ('}');

   s.push ('.qwizzled_main_menu_item {');
   s.push ('   border:                 1px solid white;');
   s.push ('   -moz-user-select:       none;');
   s.push ('   -webkit-user-select:    none;');
   s.push ('   -ms-user-select:        none;');
   s.push ('}');

   s.push ('.qwizzled_main_menu_item_disabled {');
   s.push ('   border:                 1px solid white;');
   s.push ('   color:                  gray;');
   s.push ('   -moz-user-select:       none;');
   s.push ('   -webkit-user-select:    none;');
   s.push ('   -ms-user-select:        none;');
   s.push ('}');

   s.push ('.qwizzled_main_menu_item:hover {');
   s.push ('   border:          1px solid gray;');
   s.push ('   cursor:          pointer;');
   s.push ('}');

   s.push ('.qwizzled_main_menu_item:active {');
   s.push ('   outline:         2px solid lightgray;');
   s.push ('}');

   s.push ('.qwizzled_main_menu_feedback {');
   s.push ('   display:         none;');
   s.push ('   padding:         5px;');
   s.push ('   background:      #FFFF77;');
   s.push ('}');

   s.push ('img.click_on____exit {');
   s.push ('   float:           right;');
   s.push ('   margin-top:      2px;');
   s.push ('   margin-right:    2px;');
   s.push ('   cursor:          pointer;');
   s.push ('}');

   s.push ('.qwizzled_image_button {');
   s.push ('   border:                 none;');
   s.push ('   background:             none;');
   s.push ('   padding:                0;');
   s.push ('   cursor:                 pointer;');
   s.push ('}');

   s.push ('.qwizzled_highlight_label_border {');
   s.push ('   padding:         0px 2px;');
   s.push ('   border:          1px dotted gray;');
   s.push ('}');

   s.push ('#register_qqs_dialog_box {');
   s.push ('   position:        fixed !important;');
   s.push ('   min-width:       500px;');
   s.push ('   display:         none;');
   s.push ('   box-shadow:      3px 3px 2px gray;');

   // Want to beat TinyMCE toolbars at 999 and main menu at 1000.
   s.push ('   z-index:         1001;');
   s.push ('   left:            250px;');
   s.push ('   top:             150px;');
   s.push ('   background:      white;');
   s.push ('   border:          2px solid rgba(79, 112, 153, 1);');
   s.push ('}');

   s.push ('#register_qqs_login,');
   s.push ('#register_qqs_main {');
   s.push ('   position:            relative;');
   s.push ('   display:             none;');
   s.push ('   background:          white;');
   s.push ('   padding:             5px;');
   s.push ('}');

   s.push ('#register_qqs_user {');
   s.push ('   text-align:          right;');
   s.push ('   display:             none;');
                                 /* top right bot left */
   s.push ('   padding:             2px 5px 0px 5px;');
   s.push ('   background:          white;');
   s.push ('}');

   s.push ('.ui-dialog {');
   s.push (   'padding:             0 !important;');
   s.push ('   border:              2px solid rgba(79, 112, 153, 1) !important;');
   s.push ('}');
   s.push ('.ui-dialog-titlebar {');
   s.push (   'border:              0 !important;');
   s.push (   'border-radius:       0 !important;');
   s.push (   'padding:             2px 0.4em !important;');
   s.push (   'color:               white !important;');
   s.push (   'font-weight:         bold !important;');
   s.push ('   background:          rgba(79, 112, 153, 1) !important;');
   s.push ('}');

   // No close x-icon in login modal dialog titlebar.
   /*
   s.push ('button.ui-dialog-titlebar-close {');
   s.push ('   display:             none;');
   s.push ('}');
   */

   // Let qwizard dialog get on top of these!
   s.push ('.wp-editor-expand #wp-content-editor-tools {');
   s.push ('   z-index:             100 !important;');
   s.push ('}');
   s.push ('.wp-editor-expand div.mce-toolbar-grp {');
   s.push ('   z-index:             auto !important;');
   s.push ('}');

   // Keep bubble-bar wrapper on top of qwizard dialog.
   s.push ('#bubbleBarWrapper {');
   s.push ('   z-index:             102;');
   s.push ('}');

   s.push ('.qbookmark {');
   s.push ('   display:             none;');
   s.push ('}');

   s.push ('select.new_existing_dataset {');
   s.push ('   height:              22px;');
   s.push ('   width:               110px;');
   s.push ('   padding:             0;');
   s.push ('   font-size:           10pt;');
   s.push ('}');

   s.push ('p.login_error {');
   s.push ('   visibility:          hidden;');
   s.push ('   color:               red;');
   s.push ('   font-weight:         bold;');
   s.push ('}');

   s.push ('#new_account_info {');
   s.push ('   position:            absolute;');
   s.push ('   top:                 40px;');
   s.push ('   left:                75px;');
   s.push ('   width:               350px;');
   s.push ('   padding:             8px;');
   s.push ('   background:          white;');
   s.push ('   border:              1px solid black;');
   s.push ('   box-shadow:          -3px 3px 2px gray;');
   s.push ('   display:             none;');
   s.push ('}');

   s.push ('img.new_account_info {');
   s.push ('   border:              0px;');
   s.push ('   cursor:              help;');
   s.push ('}');

   s.push ('.ui-resizable-se {');
   s.push ('   width:               16px !important;');
   s.push ('   height:              16px !important;');
   s.push ('}');

   s.push ('.cursor_help {');
   s.push ('   cursor:              help;');
   s.push ('}');

   s.push ('table.register_qqs {');
   s.push ('   border-spacing:      0;');
   s.push ('}');

   s.push ('table.register_qqs th,');
   s.push ('table.register_qqs td {');
   s.push ('   font-size:           10pt;');
   s.push ('   padding-left:        5px;');
   s.push ('   padding-right:       5px;');
   s.push ('}');

   s.push ('table.register_qqs th {');
   s.push ('   vertical-align:      bottom;');
   s.push ('}');

   s.push ('table.register_qqs th.qwizzled-border-left,');
   s.push ('table.register_qqs td.qwizzled-border-left {');
   s.push ('   border-left:         2px solid gray;');
   s.push ('}');

   s.push ('table.register_qqs button {');
   s.push ('   vertical-align:      -2px;');
   s.push ('}');

   s.push ('img.icon_clickable {');
   s.push ('   border:              0;');
   s.push ('   cursor:              pointer;');
   s.push ('   transform:           translate(0px, 3px);');
   s.push ('   -webkit-transform:   translate(0px, 3px);');
   s.push ('}');

   s.push ('input.register_checkbox {');
   s.push ('   margin:              0 !important;');
   s.push ('}');

   s.push ('input.enter_qrecord_id {');
   s.push ('   width:           10em;');
   s.push ('   font-size:       inherit;');
   s.push ('   padding-left:    0px;');
   s.push ('}');

   s.push ('#register_qq_feedback {');
   s.push ('   font-weight:     bold;');
   s.push ('}');

   s.push ('.qwizzled_center {');
   s.push ('   text-align:      center;');
   s.push ('}');

   s.push ('.qwizzled_smaller {');
   s.push ('   font-size:       80%;');
   s.push ('}');

   s.push ('   text-align:      right;');
   s.push ('}');

   s.push ('</style>');

   s.push ('<link rel="stylesheet" href="' + qwizzled_params.url + 'jquery-ui.css">');

   $(s.join ('\n')).appendTo ('head');
}


// -----------------------------------------------------------------------------
// Add style to edit content (in iframe).
function add_style_edit_area () {

   // Don't do if already present.
   if (q.qwizard_b) {
      if ($ ('#qwizzled_edit_area').length) {
         return false;
      }
   } else {
      if ($ (edit_area_selector).contents ().find ('#qwizzled_edit_area').length) {
         return false;
      }
   }

   var s = [];

   s.push ('<style id="qwizzled_edit_area" type="text/css">\n');

   s.push ('div.qwizzled_question {');
   s.push ('   position:        relative;');
   s.push ('   border:          1px dotted blue;');
   s.push ('   margin-bottom:   10px;');
   s.push ('   padding:         5px;');
   s.push ('}');

   s.push ('div.qwizzled_question_bottom_border_title {');
   s.push ('   position:        absolute;');
   s.push ('   width:           100%;');
   s.push ('   height:          10px;');
   s.push ('   left:            0px;');
   s.push ('   bottom:          -7px;');
   s.push ('   cursor:          help;');
   s.push ('   font-size:       0.1px;');
   s.push ('}');

   s.push ('div.qwizzled_canvas {');
   s.push ('   position:        relative;');
   s.push ('   min-height:      250px;');
   if (! q.qwizard_b) {
      s.push ('outline:         2px solid black;');
   }
   s.push ('   padding:         5px;');
   s.push ('}');

   s.push ('div.qwizzled_canvas p {');
   s.push ('   margin:          0px;');
   s.push ('}');

   s.push ('.qwizzled_highlight_label_border {');
   s.push ('   border:          1px dotted gray;');
   s.push ('}');

   s.push ('div.qwizzled_target {');
   s.push ('   width:           120px;');
   s.push ('   height:          28px;');
   s.push ('   margin-right:     -124px;');
   s.push ('   margin-bottom:   -32px;');
   s.push ('   position:        relative;');
   s.push ('   z-index:         2;');
   s.push ('   cursor:          move;');
   s.push ('}');

   s.push ('.qwizzled_border_all {');
   s.push ('   border-width:    2px;');
   s.push ('}');

   s.push ('.qwizzled_border_left {');
   s.push ('   border-width:    2px 0px 2px 2px;');
   s.push ('}');

   s.push ('.qwizzled_border_right {');
   s.push ('   border-width:    2px 2px 2px 0px;');
   s.push ('}');

   s.push ('.qwizzled_border_center {');
   s.push ('   border-width:    2px 0px 2px 0px;');
   s.push ('}');

   s.push ('.qwizzled_border_class_red {');
   s.push ('   border-color:    red;');
   s.push ('}');

   s.push ('.qwizzled_border_class_magenta {');
   s.push ('   border-color:    magenta;');
   s.push ('}');

   s.push ('.qwizzled_border_class_blue {');
   s.push ('   border-color:    blue;');
   s.push ('}');

   s.push ('.qwizzled_border_class_aqua {');
   s.push ('   border-color:    aqua;');
   s.push ('}');

   s.push ('.qwizzled_border_class_black {');
   s.push ('   border-color:    black;');
   s.push ('}');

   s.push ('.qwizzled_border_class_silver {');
   s.push ('   border-color:    silver;');
   s.push ('}');

   s.push ('.qwizzled_border_class_dotted {');
   s.push ('   border-style:    dotted;');
   s.push ('}');

   s.push ('.qwizzled_border_class_dashed {');
   s.push ('   border-style:    dashed;');
   s.push ('}');

   s.push ('.qwizzled_border_class_solid {');
   s.push ('   border-style:    solid;');
   s.push ('}');

   s.push ('.qwizzled_border_class_width {');
   s.push ('   border-width:    2px;');
   s.push ('}');

   s.push ('</style>');

   s.push ('<link rel="stylesheet" href="' + qwizzled_params.url + 'jquery-ui.css">');

   var edit_page_header;
   if (debug[0]) {
      console.log ('[add_style_edit_area] q.qwizard_b:',  q.qwizard_b);
   }
   if (q.qwizard_b) {
      edit_page_header = $ ('head');
   } else {
      edit_page_header = $ (edit_area_selector).contents ().find ('head');
   }
   $(s.join ('\n')).appendTo (edit_page_header);
}


// -----------------------------------------------------------------------------
this.expand_qwizzled_menu_items = function () {
   expand_qwizzled_menu_items_b = true;

   // Redraw menu.
   q.show_main_menu2 ();
}


// -----------------------------------------------------------------------------
// Create a target for a label -- part 1 -- set up to wait for click on label.
this.create_target1 = function (multiple_targets_f, add_delete_f) {

   // If in text mode, message only.
   if (! q.qwizard_b && ! $ (edit_area_selector).is (':visible')) {
      alert (T ('Please select "Visual" mode to create a target/drop zone'));
      return;
   }
   setTimeout ('qwizzled.create_target2 (' + multiple_targets_f + ', ' + add_delete_f + ')', 100);
}


// -----------------------------------------------------------------------------
this.create_target2 = function (multiple_targets_f, local_add_delete_label_f) {

   // If was waiting for click on a target to delete, cancel.
   if (waiting_for_target_to_delete_click_b) {
      q.exit_click_on_a_target ();
   }

   if (! q.qwizard_b) {
      preliminary_label_checks ();
   }

   // For all images within qwizzled divs, ignore max-width set by WordPress.
   // User will have to resize smaller.  Take care of padding and border, too.
   var qwizzled_imgs_obj = q.$edit_area.find ('div.qwizzled_question img');
   if (debug[0]) {
      console.log ('[create_target2] qwizzled_imgs_obj: ', qwizzled_imgs_obj);
      console.log ('                 length: ', qwizzled_imgs_obj.length);
   }
   qwizzled_imgs_obj.css ({'max-width': 'none', padding: '0px', border: '0px'});

   // Find any images inside labels -- set margins to zero.
   var label_imgs_obj = q.$edit_area.find ('*.qwizzled_label img');
   if (debug[0]) {
      console.log ('[create_target2] label_imgs_obj: ', label_imgs_obj);
      console.log ('                 length: ', label_imgs_obj.length);
   }
   label_imgs_obj.css ({margin: '0px', padding: '0px'});

   // Make all labels clickable.
   q.$edit_area.find ('.qwizzled_label').click (function () {
      q.label_clicked (this);
   });

   // Set global flag that waiting for label to be clicked.
   waiting_for_label_click_b = true;

   // Set global indicator whether label can be placed in any of several targets.
   label_will_have_multiple_targets_b = multiple_targets_f == 1;

   // Set global indicator whether waiting for add/delete label.
   add_delete_label_f = local_add_delete_label_f;

   // Provide instruction/feedback.
   var style = 'background: white;';
   if (multiple_targets_f) {
      style += ' border-color: red;';
   }
   var click_on_label;
   if (add_delete_label_f) {

      // Qwizard.  Be a bit more explicit.
      click_on_a_label =   'Click on '
                         + '<span class="qwizzled_highlight_label_border" style="' + style + '">'
                         +    'label'
                         + '</span> '
                         + 'where you want to add before/after, or delete'
                         + '<img src="' + qwizzled_params.url + 'images/icon_exit_bw.jpg" class="click_on____exit" onclick="qwizzled.exit_click_on_a_label ()" />';

      // Also, do not remove placeholder if there.
      qwizard.no_remove_placeholder_f = true;
   } else {

      // Old-style - dealing with shortcodes.
      click_on_a_label =   'Click on a '
                         + '<span class="qwizzled_highlight_label_border" style="' + style + '">'
                         +    'label'
                         + '</span>'
                         + '<img src="' + qwizzled_params.url + 'images/icon_exit_bw.jpg" class="click_on____exit" onclick="qwizzled.exit_click_on_a_label ()" />';
}

   // First cancel any previous action (fadeout of "You can position..."
   // instruction).  Set opacity back to 1.0 in case gets stuck.
   $qwizzled_main_menu_feedback.stop ().html (click_on_a_label).show ().css ('opacity', '1.0');

   report_errors ();
};


// -----------------------------------------------------------------------------
this.edit_label_feedback = function (correct_incorrect) {

   // Qwizard only.

   // Make all labels clickable.
   q.$edit_area.find ('.qwizzled_label').click (function () {
      q.label_clicked (this);
   });

   // Set global flag that waiting for label to be clicked.
   waiting_for_label_click_b = true;

   // Set global indicator whether waiting for edit label feedback.
   edit_label_feedback = correct_incorrect;

   // Provide instruction/feedback.
   var style = 'background: white;';
   var msg =   'Click on a '
             + '<span class="qwizzled_highlight_label_border" style="' + style + '">'
             +    'label'
             + '</span>'
             + '<img src="' + qwizzled_params.url + 'images/icon_exit_bw.jpg" class="click_on____exit" onclick="qwizzled.exit_click_on_a_label ()" />';

   // Also, do not remove placeholder if there.
   qwizard.no_remove_placeholder_f = true;

   // First cancel any previous action (fadeout of "You can position..."
   // instruction).  Set opacity back to 1.0 in case gets stuck.
   $qwizzled_main_menu_feedback.stop ().html (msg).show ().css ('opacity', '1.0');
}


// -----------------------------------------------------------------------------
function preliminary_label_checks () {

   // Preliminary check 1: Look for already-wrapped labels -- label divs --  and
   // make sure no additional [l] shortcodes have been added inside.  If so,
   // move out.
   q.$edit_area.find ('.qwizzled_label').each (function () {

      var label_html = $ (this).html ();

      // More than one label (including old style) in here?
      var m = label_html.match (/\[(<code><\/code>)*l\]/gm);
      if (m && m.length > 1) {

         // Move second label out.  Grab any opening tags that go with second
         // label.
         var first_label_pos = label_html.search (/\[(<code><\/code>)*l\]/);
         var r = parse_html_block (label_html.substr (first_label_pos + 1), ['[l]'], []);
         var new_label_html = r.htm_block;
         if (new_label_html != 'NA') {

            if (debug[2]) {
               console.log ('[preliminary_label_checks] new_label_html:', new_label_html);
            }

            // Remove new label from div html.
            label_html = label_html.replace (new_label_html, '');
            $ (this).html (label_html);

            // Add new label after.
            $ (this).after (new_label_html);
         }
      }
   });

   // Use jQuery to get html for already-wrapped questions.  Process labels, etc.
   // within each.  Need to do before grab editor HTML content.
   // Set flags (global variables).
   no_q_code_b = true;
   any_labeled_diagram_questions_b = false;
   var any_new_question_div_b = process_wrapped_questions ();

   // Grab current editor HTML content.
   var htm = q.$edit_area.html ();
   if (debug[0]) {
      console.log ('[preliminary_label_checks] htm: ', htm);
   }

   // Take out and save <qwizdemo>...</qwizdemo> code and comments.
   // DKTMP
   // ...

   // Want labels to be within [qwiz]...[/qwiz] pairs.  Make sure there is such
   // a pair.
   if (debug[0]) {
      console.log ('[preliminary_label_checks] q.qwizard_b:', q.qwizard_b);
   }
   if (! q.qwizard_b && ! check_qwiz_tag_pairs_ok (htm)) {

      return;
   }

   // Preliminary check 2: If any wrapped question divs (div.qwizzled_question),
   // if more than one question inside a question div, error.
   var any_new_html_b = false;
   var new_html = htm;
   if (htm.indexOf ('qwizzled_question') != -1) {
      if (debug[2]) {
         console.log ('[preliminary_label_checks] preliminary check 2...');
      }

      // Yes, some have been wrapped.
      var error_b = false;
      q.$edit_area.find ('div.qwizzled_question').each (function () {

         if (! error_b) {
            var qwizzled_question_html = $ (this).html ()
            var m = qwizzled_question_html.match (/\[(<code><\/code>)*q[ \]]/gm);
            if (debug[2]) {
               console.log ('[preliminary_label_checks] m:', m);
            }
            if (m && m.length > 1) {
               alert (T ('A new question shortcode [q] has been placed inside an existing question.  Please move it outside and try again.') + '*');
               error_b = true;
            }
         }
      });
      if (error_b) {
         return;
      }

      // Preliminary check 3: make sure balanced divs between each wrapped
      // question.
      var question_start_tags = ['<div class="qwizzled_question">'];
      var question_next_tags = question_start_tags.concat (['[x]', '[/qwiz]']);
      if (debug[2]) {
         console.log ('[preliminary_label_checks] preliminary check 3...');
      }
      var ipos = 0;
      while (true) {

         // Get html up to next question.
         var rqwiz = parse_html_block (htm.substr (ipos), question_start_tags,
                                       question_next_tags);
         var question_html = rqwiz.htm_block;
         if (question_html == 'NA') {
            break;
         }

         // Check and fix matching divs.
         var new_question_html = check_fix_matching_divs (question_html);
         if (new_question_html) {
            any_new_html_b = true;
            new_html = new_html.replace (question_html, new_question_html);
            if (debug[2]) {
               console.log ('[preliminary_label_checks] new_html:', new_html);
            }
         }

         // Skip visited.
         ipos += rqwiz.htm_index + question_html.length;
      }
   }

   // We'll get all labels in unwrapped questions (wrapped questions done above)
   // [qwiz]...[/qwiz] pairs.  Check that there are such pairs.
   var qwiz_matches = new_html.match (/\[qwiz[\s\S]*?\[\/qwiz\]/gm);
   if (debug[0]) {
      console.log ('[preliminary_label_checks] qwiz_matches:', qwiz_matches);
   }
   if (! qwiz_matches) {
      report_errors ();
      return;
   }
   n_qwizzes = qwiz_matches.length;

   // For not-yet-wrapped questions, loop over qwiz-tag pairs, and then over
   // [q] questions within each pair.
   // If any labels not yet wrapped in an inline-block span element, do so.
   for (var i_qwiz=0; i_qwiz<n_qwizzes; i_qwiz++) {

      // See if labels [l] inside, along with associated feedback ([f*] and
      // [fx]).  Wrap labels.  If no feedback given, create with canned
      // response.  html returned only if labels inside.
      question_start_tags = ['[q]', '[q '];

      var question_html = process_notwrapped_questions (qwiz_matches[i_qwiz], question_start_tags);
      if (question_html) {
         any_new_html_b = true;
         new_html = new_html.replace (qwiz_matches[i_qwiz], question_html);
      }
   }

   if (! any_labeled_diagram_questions_b) {
      if (no_q_code_b) {
         alert (T ('Did not find any questions [q] within [qwiz]...[/qwiz] shortcode pairs'));
      } else {
         alert (T ('Did not find any labels [l] within [qwiz]...[/qwiz] shortcode pairs'));
      }
      return
   }

   if (any_new_html_b) {

      // Update displayed content.
      q.$edit_area.html (new_html);
   }

   if (any_new_html_b || any_new_question_div_b) {

      // If any empty label divs, or labels that comments have gotten into, fix
      // (delete empties, move comments out).  Use jQuery to find label divs.
      check_fix_label_divs ();

      // Find paragraphs and headers within labels, wrap their inner html with
      // highlight span if haven't already done so.
      q.$edit_area.find ('*.qwizzled_label > p, *.qwizzled_label > :header').each (function () {
         var innerhtm = $ (this).html ();
         if (innerhtm.indexOf ('qwizzled_highlight_label') == -1) {
            $ (this).html ('<span class="qwizzled_highlight_label qwizzled_highlight_label_border">' + innerhtm + '</span>');
         }
      });
   }
}


// -----------------------------------------------------------------------------
this.exit_click_on_a_label = function () {

   if (debug[2]) {
      console.log ('[exit_click_on_a_label] $qwizzled_main_menu_feedback:', $qwizzled_main_menu_feedback);
   }
   $qwizzled_main_menu_feedback.hide ();
   waiting_for_label_click_b = false;
   label_will_have_multiple_targets_b = false;
}


// -----------------------------------------------------------------------------
this.exit_click_on_a_target = function () {

   if (debug[2]) {
      console.log ('[exit_click_on_a_target] $qwizzled_main_menu_feedback:', $qwizzled_main_menu_feedback);
   }

   // Cancel clickability.
   q.$edit_area.find ('.qwizzled_target').off ('click');

   $qwizzled_main_menu_feedback.hide ();
   waiting_for_target_to_delete_click_b = false;
   decoy_target_b = false;
}


// -----------------------------------------------------------------------------
this.create_target_for_same_label = function () {

   // If was waiting for click on a target to delete, cancel.
   if (waiting_for_target_to_delete_click_b) {
      q.exit_click_on_a_target ();
   }

   // Set up as if label clicked, but pass global variable containing
   // previously-selected label element.  Emulate "disabled" if no label
   // selected already.
   if (! el_label_div) {
      return false;
   }
   label_will_have_multiple_targets_b = true;
   waiting_for_label_click_b = true;
   q.label_clicked (el_label_div);
}


// -----------------------------------------------------------------------------
// Create a target for a label -- part 2 -- clicked on label.  Check that
// waiting for a click, check if this label already has a target, prompt user to
// select a target.
this.label_clicked = function (local_el_label_div) {

   // Ignore if haven't clicked menu item.  (Flag set in create_target2 ()).
   if (! waiting_for_label_click_b) {
      return false;
   }

   // Save label element in global variable.
   el_label_div = local_el_label_div;
   if (debug[0]) {
      console.log ('[label_clicked] el_label_div:', el_label_div);
   }

   var classes = $ (el_label_div).attr ('class');
   var m = classes.match (/qtarget_assoc([0-9]*)/);
   if (m) {
      assoc_id = m[1];
   } else {

      // Try data () -- backwards compatibility.
      assoc_id = $ (el_label_div).data ('label_target_id');
   }

   waiting_for_label_click_b = false;
   $qwizzled_main_menu_feedback.hide ();

   // Also called from qwizard version of main editing menu -- add or delete
   // this label.
   if (add_delete_label_f) {
      add_delete_label_f = false;
      qwizard.show_label_options_menu (assoc_id);
      return false;
   }

   // Also Qwizard-only: enter/edit feedback.  Show feedback for this label.
   if (edit_label_feedback) {
      qwizard.show_label_options_menu (assoc_id);

      // Get id.  Looks like label-qwiz0-q0-a0.  
      //                       0     1    2  3
      var id = el_label_div.id;

      // Hide any previously-showing feedback divs.
      var pieces = id.split ('-');
      var qwizq = pieces[1] + '-' + pieces[2];
      $ ('#' + qwizq + ' div.qwiz-feedback').hide ();

      // Feedback id looks like
      // qwiz0-q0-a0c or qwiz0-q0-a0x.
      var feedback_selector = '#' + qwizq + '-' + pieces[3];
      feedback_selector += (edit_label_feedback == 'correct' ? 'c' : 'x');
      var $feedback_selector = $ (feedback_selector);
      $feedback_selector.show ();
      qwiz_qcards_common.select_placeholder ($feedback_selector);

      edit_label_feedback = '';
      return false;
   }

   // Zero the margins of any images in this label.
   $ (el_label_div).find ('img').css ({margin: '0px', padding: '0px'});

   // Find question div that is parent of this label.
   $qwizzled_question = $ (el_label_div).parents ('.qwizzled_question');
   if (debug[0]) {
      console.log ('[label_clicked] $qwizzled_question:', $qwizzled_question);
   }

   // Does this label have a target already?  label_border_class will signal
   // new target for existing label.
   var create_target_b = true;
   label_border_class = '';
   if (assoc_id) {

      // Yes, label has a target already.  If adding another target for same
      // label, get border style and proceed.  Otherwise, see if user wants to
      // replace target.
      if (label_will_have_multiple_targets_b) {
         label_border_class = get_label_border_class (el_label_div);
      } else {
         if (confirm (T ('This label already has a target.\nDo you want to replace the existing target?'))) {
            if (debug[0]) {
               console.log ('[label_clicked] classes:', classes, ', assoc_id:', assoc_id);
            }

            // If it's a div -- a rectangle on an image -- delete it.  If it's a
            // span or spans, replace the <span> with its content.
            remove_target ($qwizzled_question, assoc_id);

            // Get the label's current border colors/style classes -- re-use for new
            // target.
            label_border_class = get_label_border_class (el_label_div);
            if (debug[0]) {
               console.log ('[label_clicked] label_border_class:', label_border_class);
            }
         } else {
            create_target_b = false;
         }
      }
   } else {

      // Label does not have a target yet.  If user clicked "Create another
      // target..." ask if should proceed.
      if (label_will_have_multiple_targets_b) {
         if (! confirm (T ('This label does not have a target, while you clicked "Create another target for a label."  Do you want to create a target for this label?'))) {
            create_target_b = false;
         }
         label_will_have_multiple_targets_b = false;
      }
   }
   if (debug[0]) {
      console.log ('[label_clicked] create_target_b:', create_target_b)
   }
   if (create_target_b) {

      // Prompt to select target.
      $qwizzled_main_menu_feedback.html (T ('Select the text or click on the image (you may have to click twice) where you want the target "drop zone" for this label')).show ();

      // Wait for selection.
      waiting_for_target_select_b = true;

      // If qwizard, disable editor until click.
      if (q.qwizard_b) {
         //q.$edit_area.attr ('contenteditable', false);
      }

      // Selecting text within question div will involve mouseup, which we can
      // process.  First turn off any previous event handler (just want to
      // do function call once!).
      q.$edit_area.off ('mouseup');
      q.$edit_area.on ('mouseup', q.target_text_selected);
   }
}


// -----------------------------------------------------------------------------
this.create_decoy_target = function () {

   // Prompt to select target.
   var feedback = T ('Select the text or click on the image (you may have to click twice) where you want the decoy target "drop zone" (that will not accept a label)')
                  + '<img src="' + qwizzled_params.url + 'images/icon_exit_bw.jpg" class="click_on____exit" onclick="qwizzled.exit_select_for_decoy ()" />';
   $qwizzled_main_menu_feedback.html (feedback).show ();

   // Wait for selection; indicate decoy.
   waiting_for_target_select_b = true;
   decoy_target_b = true;

   // Selecting text will involve mouseup, which we can process.  For decoy
   // target, we don't know which question, so have to turn on mouseup for
   // contents.  First turn off any previous event handler (just want to
   // do function call once!).
   q.$edit_area.off ('mouseup');
   q.$edit_area.on ('mouseup', q.target_text_selected);
}


// -----------------------------------------------------------------------------
this.exit_select_for_decoy = function () {

   if (debug[2]) {
      console.log ('[exit_select_for_decoy] $qwizzled_main_menu_feedback:', $qwizzled_main_menu_feedback);
   }

   $qwizzled_main_menu_feedback.hide ();
   waiting_for_target_select_b = false;
   decoy_target_b = false;
}


// -----------------------------------------------------------------------------
this.delete_target = function () {

   // Are there targets?
   var target_objs = q.$edit_area.find ('.qwizzled_target');
   if (! target_objs.length) {
      alert (T ('Did not find any targets'));
      return false;
   }

   // Prompt to select target.
   var feedback = T ('Click on the target you want to delete')
                  + '<img src="' + qwizzled_params.url + 'images/icon_exit_bw.jpg" class="click_on____exit" onclick="qwizzled.exit_click_on_a_target ()" />';
   $qwizzled_main_menu_feedback.html (feedback).show ();

   // Make all targets clickable.
   target_objs.click (function () {
      q.target_to_delete_clicked (this);
   });

   // Set flag.
   waiting_for_target_to_delete_click_b = true;
}


// -----------------------------------------------------------------------------
this.target_to_delete_clicked = function (target_el) {

   // Hide feedback, cancel clickability.
   $qwizzled_main_menu_feedback.hide ();
   q.$edit_area.find ('.qwizzled_target').off ('click');
   waiting_for_target_to_delete_click_b = false;

   var target_div_span_obj = $ (target_el);

   // Find label associated with this target.  If only associated with this
   // one target (not multiple targets) delete label associations -- if user
   // wants to proceed.  If multiple targets, decrement number (class
   // qwizzled_n_targetsN).
   var classes = $ (target_div_span_obj).attr ('class');
   var m = classes.match (/qwizzled_target-([0-9]*)/);
   var delete_label_b = false;
   if (m) {
      var assoc_id = m[1];
      var $label = q.$edit_area.find ('div.qtarget_assoc' + assoc_id + ', div.qwizzled_label[data-label_target_id="' + assoc_id + '"]');
      if (debug[0]) {
         console.log ('[target_to_delete_clicked] $label:', $label);
         console.log ('[target_to_delete_clicked] $label.length:', $label.length);
      }
      if ($label.length) {

         // See if label associated with multiple targets.
         classes = $label.attr ('class');
         m = classes.match (/qwizzled_n_targets([0-9]*)/);
         if (m) {

            // Decrement by 1, or delete class.
            var n_targets = m[1];
            if (n_targets == 2) {
               $label.removeClass ('qwizzled_n_targets2');
            } else {
               n_targets--;
               $label.removeClass (m[0]).addClass ('qwizzled_n_targets' + n_targets);
            }
         } else {

            // See if user wants to proceed.
            if (confirm (T ('Note: the label for this target will no longer be associated with any target'))) {
               delete_label_b = true;
            } else {
               return false;
            }
         }
      }
   }
   if (target_div_span_obj[0].tagName.toLowerCase () == 'div') {
      target_div_span_obj.remove ();
   } else {

      // Remove wrapper if there (backwards compatibility), remove
      // qwizzled_target spans (keeping content).
      target_div_span_obj.parents ('span.text_target_wrapper').contents ().unwrap ();
      target_div_span_obj.contents ().unwrap ();
   }
   if (delete_label_b) {

      // Unwrap span.qwizzled_highlight_label.
      if (debug[0]) {
         console.log ('[target_to_delete_clicked] $label.contents ():', $label.contents ());
      }
      var label_contents_obj = $label.contents ();
      label_contents_obj.find ('span.qwizzled_highlight_label').contents ().unwrap ();

      // If old-style <code></code> is there, delete.
      var htm = label_contents_obj.html ();
      if (htm.search ('<code></code>') != -1) {
         htm = htm.replace ('<code></code>', '');
         label_contents_obj.html (htm);
      }

      // And unwrap div.qwizzled_label.
      label_contents_obj.unwrap ();
   }
}


// -----------------------------------------------------------------------------
function remove_target ($qwizzled_question, assoc_id) {
   var div_span_obj = $qwizzled_question.find ('.qwizzled_target-' + assoc_id);
   if (div_span_obj.length) {
      if (div_span_obj[0].tagName.toLowerCase () == 'div') {
         div_span_obj.remove ();
      } else {

         // Remove wrapper if there (backwards compatibility), remove
         // qwizzled_target spans (keeping content).
         div_span_obj.parents ('span.text_target_wrapper').contents ().unwrap ();
         div_span_obj.contents ().unwrap ();
      }
   }
}


// -----------------------------------------------------------------------------
this.target_text_selected = function (e) {

   var tinymce_ed_selection = q.tinymce_ed.selection;
   var selected_text;
   var node;
   var $node;
   if (tinymce_ed_selection) {
      selected_text = tinymce_ed_selection.getContent ();
      node = tinymce_ed_selection.getNode ();
      $node = $ (node);
   } else {
      selected_text = '';
      node = '';
   }

   // Has trouble -- especially in qwizard -- having click return the image.
   // If not obviously an image, grab the first image on the canvas.
   var img_el;
   if (selected_text || (node && $node[0].tagName.toLowerCase () == 'img')) {
      img_el = $node[0];
   } else {

      // Not obviously an image.
      var $image;
      if ($node.hasClass ('qwizzled_canvas')) {
         $image = $node.find ('img').first ();
      } else {
         $image = $node.parents ('.qwizzled_canvas').find ('img').first ();
      }
      if (debug[0]) {
         console.log ('[target_text_selected] $image:', $image);
      }
      if ($image.length) {
         img_el = $image[0];
         selected_text = img_el.outerHTML;
         $node = $image;
         if (debug[0]) {
            console.log ('[target_text_selected] selected_text:', selected_text);
         }
      } else {

         // Seems not to be relevant (clicked somewhere else entirely). Ignore
         // the click.
         return false;;
      }
   }

   // Turn off further selects.
   q.$edit_area.off ('mouseup');

   if (! waiting_for_target_select_b) {
      return false;
   }
   waiting_for_target_select_b = false;

   // If selection already is a target, error.
   var target_obj = $node.parents ('.qwizzled_target');
   var classes = $node.attr ('class');
   if (target_obj.length || (classes && classes.indexOf ('qwizzled_target') != -1)) {
      alert (T ('Selection already is a target'));

      // Cancel feedback.
      $qwizzled_main_menu_feedback.hide ();

      return false;
   }

   // Position the target where clicked.  clientX and Y are relative to document
   // -- body in iframe in this case.  $node is our image, with jQuery offset ()
   // also relative to document.  So subtraction should give us click position
   // in image.
   var node_obj_offset   = $node.offset ();
   var node_obj_position = $node.position ();
   var target_left       = e.clientX - node_obj_offset.left;
   var target_top        = e.clientY - node_obj_offset.top;

   // In qwizard, for some reason scroll has effect that doesn't bother plain
   // qwizzled.  e.clientX and e.clientY are relative to current window,
   // while offset is relative to document.  So add in scroll.
   if (q.qwizard_b) {
      target_top += $ (window).scrollTop ();
   }
   target_left = Math.round (target_left);
   target_top  = Math.round (target_top);

   if (debug[0]) {
      console.log ('[target_text_selected] selected_text: ' + selected_text);
      console.log ('                       $node:', $node);
      console.log ('                       node_obj_offset:', node_obj_offset);
      console.log ('                       node_obj_position:', node_obj_position);
      console.log ('                       e.clientX:', e.clientX, ', e.clientY:', e.clientY);
      if (q.qwizard_b) {
         console.log ('                       $ (window).scrollTop ():', $ (window).scrollTop ());
      }
      console.log ('                       target_left:', target_left, ', target_top:', target_top);
   }

   if (decoy_target_b) {

      // New "association ID" (not associated with any label).
      assoc_id = time_id ();

      // Decoy target will have gray border.
      bcolor = 'gray';
      bstyle = 'solid';
      label_border_class = '';
   } else {

      // If doesn't exist, create association ID between label and target.  Use
      // time (in seconds) as unique ID.  We'll also use it to identify image
      // wrapper.
      if (! assoc_id) {
         assoc_id = time_id ();
      }

      // Pick border color and style for this label-target pair.  Look for a not-
      // yet-used combination.  Don't do if re-using current label border (new or
      // additional target for an existing label).
      var ok_b = false;
      var bcolor;
      var bcolor = '';
      if (label_border_class == '') {
         var n_bcolors = bcolors.length;
         var n_bstyles = bstyles.length;
         for (var i_bcolor=0; i_bcolor<n_bcolors; i_bcolor++) {
            bcolor = bcolors[i_bcolor];

            // Any with this border color?
            var label_objs = $qwizzled_question.find ('span.qwizzled_border_class_' + bcolor);
            if (debug[0]) {
               console.log ('[target_text_selected] bcolor:', bcolor, ', label_objs.length:', label_objs.length);
            }
            if (label_objs.length == 0) {

               // No.  Can use first style.
               bstyle = bstyles[0];
               break;

            } else {

               // Some or all used.  Create list that marks styles already used.
               var bstyles_used = new Array (n_bstyles+1).join ('0').split ('');
               label_objs.each (function () {
                                   var classes = $ (this).attr ('class');
                                   for (var i_bstyle=0; i_bstyle<n_bstyles; i_bstyle++) {
                                      var bstyle_i = bstyles[i_bstyle];
                                      if (classes.indexOf (bstyle_i) != -1) {
                                         bstyles_used[i_bstyle] = '1';
                                         break;
                                      }
                                   }
                                });

               // See if any unused styles this color.
               var i_bstyle = bstyles_used.indexOf ('0');
               if (debug[0]) {
                  console.log ('[target_text_selected] bstyles_used:', bstyles_used, ', i_bstyle:', i_bstyle);
               }
               if (i_bstyle == -1) {

                  // No.  Continue to next color.
                  continue;
               } else {

                  // Return first unused style.
                  bstyle = bstyles[i_bstyle];
                  break;
               }
            }
         }
         if (debug[0]) {
            console.log ('[target_text_selected] bcolor:', bcolor, ', bstyle:', bstyle);
         }
      }
   }

   // See if an image and only an image.
   var img_txt = selected_text.match (/<img.*?>/m);
   var slen = selected_text.length;
   if (img_txt && img_txt[0].length == slen) {

      // Yes, image.
      if (debug[0]) {
         console.log ('[target_text_selected] node tagName:', $node[0].tagName);
         console.log ('                       parent tagName:', $node.parent ()[0].tagName);
         console.log ('                       parent parent tagName:', $node.parent ().parent ()[0].tagName);
      }

      // If images already wrapped, add target to that div.  Use jQuery to get
      // parent.
      var $img_wrapper = '';
      $img = $ (img_el);
      if (debug[0]) {
         console.log ('[target_text_selected] $img:', $img);
      }
      if ($img.parents ().hasClass ('qwizzled_image')) {
         $img_wrapper = $img.parents ('.qwizzled_image');
         if (debug[0]) {
            console.log ('[target_text_selected] Found $img_wrapper:', $img_wrapper);
         }
      }
      var caption_b = false;
      if ($img_wrapper == '') {

         // Won't work with captions.  Alert to delete caption and try again.
         parent_parent_tagname = $node.parent ().parent ()[0].tagName;
         caption_b = parent_parent_tagname.toLowerCase () == 'dt';
         if (caption_b) {
            alert (T ('Sorry, labeled diagrams do not work with images that have captions.  Please edit the image, delete the caption, and try again.'));

            // Cancel feedback.
            $qwizzled_main_menu_feedback.hide ();
         } else {

            // Create wrapper.  First collect attributes from image (that is,
            // everything except "<img " and "/>").
            var img_attributes = selected_text.substr (5, slen-7);

            // Wrap image in div with image's attributes, but delete id=, src=,
            // alt=, height=, and width=.  Set the margins to zero, since the
            // image's class's margins will take care of that (and don't want to
            // double them), but keep auto margins if aligncenter WordPress class.
            var img_wrapper_attributes = img_attributes.replace (/(id|src|alt|width|height)\s*=\s*".*?"/gm, '');

            // Just use assoc_id to create unique id -- used below as selector
            // for jQuery find.
            var img_wrapper_id = 'id="qwizzled_img_wrapper-' + assoc_id + '" ';
            var img_wrapper_style = ' style="position: relative; ';
            if (img_attributes.indexOf ('aligncenter') == -1) {
               img_wrapper_style += 'margin: 0px; ';
            } else {
               img_wrapper_style += 'margin: 0px auto; ';
            }

            // Get width and height from image, apply as style to image wrapper
            // (so can undo resizing in qwiz_.init_qwizzled (), which gets
            // width and height from wrapper -- which doesn't have a width and
            // height when display is 'none' and width and height aren't 
            // explicitly set).
            var width = '';
            var m = img_attributes.match (/width="([0-9]+)"/);
            if (m) {
               width = m[1];
               img_wrapper_style += 'width: ' + width + 'px; ';
            }
            var height = '';
            var m = img_attributes.match (/height="([0-9]+)"/);
            if (m) {
               height = m[1];
               img_wrapper_style += 'height: ' + height + 'px; ';
            }
            img_wrapper_style += '" ';

            // TinyMCE has style that adds padding to image, but this isn't present
            // in page display.  Add style to set padding to zero.  Editor also puts
            // border around image.  Nix that, too.
            //img_attributes = add_attr_value ('style', 'padding: 0px; border: none; ', img_attributes);

            // Take away alignleft, aligncenter, etc.  Messes things up when
            // display page.
            img_attributes = img_attributes.replace (/align(left|center|right|none)/m, '');

            // Add class or add to existing class.
            var new_txt = '<div ' + img_wrapper_id + img_wrapper_style + img_wrapper_attributes + '><img ' + img_attributes + ' /></div>';
            new_txt = add_attr_value ('class', 'qwizzled_image', new_txt);
            if (debug[0]) {
               console.log ('[target_text_selected] new_txt: ' + new_txt);
            }

            // Note: observed setups include
            //   <p>                            <p>
            //      <a> href=...>                  Paragraph text...
            //         <img ...>                   <a href=...>
            //      </a>                              <img ...>
            //      <br data-mce-bogus=1>          </a>
            //   </p>                              more paragraph text...
            //                                  </p>
            //
            //  A div can't live inside a paragraph, so when wrap img in a div,
            //  move the div in front of the paragraph.  If paragraph otherwise
            //  empty, delete.  Note also that img_el (selected text via TinyMCE
            //  is just the <img ...> element.

            // Identify <a href=...> link, if there.
            var img_href = '';
            var link_obj = $img.parent ('a');
            if (link_obj.length) {
               img_href = link_obj.attr ('href');
               if (debug[0]) {
                  console.log ('[target_text_selected] img_href:', img_href);
               }
            }

            // If image was inside a paragraph, want to move it in front of
            // paragraph.  Otherwise, just use TinyMCE to replace image with
            // wrapper that includes image.
            var p_obj = $img.parents ('p');
            if (p_obj.length) {

               // Yes, paragraph parent exists.  Insert wrapping div and img
               // in front of the paragraph, delete existing image with TinyMCE.
               p_obj.before (new_txt);
               tinymce_ed_selection.setContent ('');
               if (debug[0]) {
                  console.log ('inserted wrapper before p_obj:', p_obj);
                  console.log ('p_obj.html ():', p_obj.html ());
               }

            } else {
               tinymce_ed_selection.setContent (new_txt);
            }

            // Use jQuery to get wrapper object.
            $img_wrapper = q.$edit_area.find ('#qwizzled_img_wrapper-' + assoc_id);

            // If image link, check that it's now empty.  If parent is <p>,
            // see if just image link and "data-mce-bogus" element.  If so,
            // delete paragraph.
            if (img_href) {
               link_obj = q.$edit_area.find ('a[href="' + img_href + '"]');
               if (link_obj.length) {
                  if (debug[0]) {
                     console.log ('[target_text_selected] link_obj.html():', link_obj.html());
                  }
                  var link_html = link_obj.html ();
                  if (link_html.search (/\S/) == -1) {
                     p_obj = link_obj.parents ('p');
                     if (p_obj.length) {
                        link_obj.remove ();
                        q.$edit_area.find ('[data-mce-bogus]').remove ();
                        var p_html = p_obj.html ();
                        if (debug[0]) {
                           console.log ('[target_text_selected] p_html:', p_html);
                        }
                        if (p_html.search (/\S/) == -1) {
                           p_obj.remove ();
                        }
                     }
                  }
               }
            }
            if (debug[0]) {
               console.log ('[target_text_selected] updated q.$edit_area html:', q.$edit_area.html ());
            }
         }
      }
      if (! caption_b) {
         if (! decoy_target_b) {

            // If provided an additional target for a label, add or update label
            // class that indicates how many targets this label can be placed in.
            if (label_will_have_multiple_targets_b) {
               set_mult_targets_indicator ($ (el_label_div));
               label_will_have_multiple_targets_b = false;
            } else {

               // Save association ID between target and label with label.  Use a
               // class to avoid editors that eat the data-... attribute.  Also,
               // set label border same as associated target border.  Remove
               // previous qtarget_assoc class if there.
               var classes = $ (el_label_div).attr ('class');
               var m = classes.match (/qtarget_assoc[0-9]*/g);
               if (m) {
                  var qtargets = m.join (' ');
                  if (debug[0]) {
                     console.log ('[target_text_selected] el_label_div: ', el_label_div, ', removeClass (' + qtargets + ')');
                  }
                  $ (el_label_div).removeClass (qtargets);
               }
               $ (el_label_div).addClass ('qtarget_assoc' + assoc_id);
               if (label_border_class == '') {
                  if ($ (el_label_div).hasClass ('qwizzled_highlight_label')) {
                     $ (el_label_div).removeClass ('qwizzled_highlight_label_border').addClass ('qwizzled_border_class_' + bcolor + ' qwizzled_border_class_' + bstyle + ' qwizzled_border_class_width');
                  } else {
                     $ (el_label_div).find ('.qwizzled_highlight_label').removeClass ('qwizzled_highlight_label_border').addClass ('qwizzled_border_class_' + bcolor + ' qwizzled_border_class_' + bstyle + ' qwizzled_border_class_width');
                  }
               }
            }
         }

         // Add target to image wrapper div.  
         var style = 'left: ' + target_left + 'px; top: ' + target_top + 'px;';

         // Target height and width set in add_style_edit_area ().  Give target
         // classes for border to match label border.
         if (! label_border_class) {
            label_border_class = 'qwizzled_border_class_' + bstyle + ' qwizzled_border_class_' + bcolor + ' qwizzled_border_class_width';
         }

         // Create target, include association ID.  Prepend it to wrapper content.
         var decoy = decoy_target_b ? 'decoy ' : '';
         var target_html = '<div class="qwizzled_target-' + assoc_id + ' qwizzled_target ' + decoy + label_border_class + '" style="' + style + '"></div>';
         $img_wrapper.prepend (target_html);

         // Make target draggable, resizable.
         var target_obj = q.$edit_area.find ('.qwizzled_target-' + assoc_id);
         target_obj.draggable ();
         target_obj.resizable ({
            resize: function (e, ui_obj) {

               // Set the left and bottom margins of the target div to offset the
               // (resized) width and height of the div (kludge to enable use of
               // relative positioning rather than absolute, which gets extra
               // "drag handle" in Firefox).
               $ (this).css ({'margin-right': -(ui_obj.size.width + horizontal_margin_adjust) + 'px', 'margin-bottom': -(ui_obj.size.height + vertical_margin_adjust) + 'px'});
            }
         }).css ({'z-index': 105});

         // Provide instruction/feedback.
         $qwizzled_main_menu_feedback.html (T ('You can position and resize the target "drop zone" how you want in relation to the image.')).show ().fadeOut (10000, 'easeInCubic');
      }
   } else {

      // Not just an image.  Regular text; but may include an image.
      // Wrap selected text in span or spans.  If selection is (parts of) more
      // than one paragraph, need separate spans.
      if (label_border_class == '') {
         label_border_class = 'qwizzled_border_class_' + bstyle + ' qwizzled_border_class_' + bcolor;
      }

      // In case there are multiple targets for a label (also having this
      // assoc_id, identify just this group of spans with another id).
      sib_id = time_id ();
      var new_txt = create_text_target (selected_text, assoc_id, sib_id, label_border_class, decoy_target_b);
      tinymce_ed_selection.setContent (new_txt);
      if (! decoy_target_b) {
         if (label_will_have_multiple_targets_b) {
            set_mult_targets_indicator ($ (el_label_div));
            label_will_have_multiple_targets_b = false;
         }

         // Save association with target ID with label.  Use class to avoid editors
         // editors that eat the data-... attribute.  Also, set label border same as
         // associated target border.
         $ (el_label_div).addClass ('qtarget_assoc' + assoc_id);
         $ (el_label_div).find ('.qwizzled_highlight_label').removeClass ('qwizzled_highlight_label_border').addClass (label_border_class + ' qwizzled_border_class_width');
      }

      // Cancel feedback.
      $qwizzled_main_menu_feedback.hide ();
   }

   if (decoy_target_b) {
      decoy_target_b = false;
   } else {

      // Now that finished creating target for a label, since a label had been
      // selected, can enable "Create another target for same label"
      if (q.qwizard_b) {
         $ ('#create_another_target_same_label').show ();
      } else {
         $ ('#create_another_target_same_label').removeClass ('qwizzled_main_menu_item_disabled').addClass ('qwizzled_main_menu_item');
      }

      // Also, change "Create another target for an existing label" to "Create
      // another target for a different label".
      // DKTMP
      //$ ('#main_menu_different_label').html ('a <b>different</b>').show ();
   }
}


// -----------------------------------------------------------------------------
function create_text_target (htm, assoc_id, sib_id, border_class, decoy_target_b) {

   // Parse into tags and text.
   var t = parse_tags_text (htm);
   var tokens = t.tokens;
   var token_types = t.token_types;

   // Enclose each bit of plain text in <span>.  First and last text tokens
   // get "left" and "right" class.  Find first and last text tokens.
   var n_tokens = tokens.length;
   var i_first = -1;
   var i_last  = -1;
   var n_texts = 0;
   for (var i=0; i<n_tokens; i++) {
      if (token_types[i] != 'tag') {
         n_texts++;
         if (i_first == -1) {
            i_first = i;
         }
         i_last = i;
      }
   }

   // Be sure not to include width class from border_class -- widths set by
   // classes added here.
   border_class = border_class.replace ('qwizzled_border_class_width', '');
   var decoy = decoy_target_b ? 'decoy ' : '';
   var common = '<span class="qwizzled_target-' + assoc_id + ' qtarget_sib-' + sib_id + ' qwizzled_target ' + decoy;
   if (n_texts == 0) {
      alert (T ('Error: no text selected.'));
   } else if (n_texts == 1) {
      tokens[i_first] = common + 'qwizzled_border_all '       + border_class + '">' + tokens[i_first] + '</span>';
   } else if (n_texts >= 2) {
      tokens[i_first] = common + 'qwizzled_border_left '      + border_class + '">' + tokens[i_first] + '</span>';
      tokens[i_last]  = common + 'qwizzled_border_right '     + border_class + '">' + tokens[i_last]  + '</span>';
      for (var i=i_first+1; i<i_last; i++) {
         if (token_types[i] != 'tag') {

            // Leave all-whitespace text alone, but replace with TinyMCE
            // empty-line indicator (apparently).
            if (tokens[i].search (/\S/) == -1) {
               tokens[i] = '<br data-mce-bogus="1">';
            } else {
               tokens[i]    = common + 'qwizzled_border_center ' + border_class + '">' + tokens[i]  + '</span>';
            }
         }
      }
   }

   // Reassemble.
   var new_htm = tokens.join ('');
   if (debug[0]) {
      console.log ('[create_text_target] i_first, i_last, n_texts:', i_first, i_last, n_texts);
      console.log ('[create_text_target] new_htm:', new_htm);
   }

   return new_htm;
}


// -----------------------------------------------------------------------------
function get_label_border_class (el_label_div) {
   var label_border_class = '';

   var label_class = $ (el_label_div).find ('.qwizzled_highlight_label').attr ('class');
   if (debug[0]) {
      console.log ('[get_label_border_class] label_class:', label_class);
   }
   var m = label_class.match (/qwizzled_border_class_[a-z]*/g);
   if (m) {
      label_border_class = m.join (' ');
   }

   return label_border_class;
}


// -----------------------------------------------------------------------------
// Add or update label class that indicates how many targets in which this label
// can be placed.
function set_mult_targets_indicator ($label) {
   var label_class = $label.attr ('class');
   if (debug[0]) {
      console.log ('[set_mult_targets_indicator] $label:', $label);
      console.log ('[set_mult_targets_indicator] label_class:', label_class);
   }
   var m = label_class.match (/qwizzled_n_targets([0-9]*)/);
   if (m) {

      // Increment.  Remove existing class, add incremented.
      var current_class = m[0];
      var n_targets = parseInt (m[1], 10);
      if (debug[0]) {
         console.log ('[set_mult_targets_indicator] current_class:', current_class, ', n_targets:', n_targets);
      }
      var new_class = 'qwizzled_n_targets' + (++n_targets);
      $label.removeClass (current_class).addClass (new_class);
   } else {

      // Create class.  This is first additional target, so total is 2.
      $label.addClass ('qwizzled_n_targets2');
   }
}


// -----------------------------------------------------------------------------
function parse_tags_text (htm) {

   var tokens = [''];
   var token_types = [''];
   var i_token = 0;
   var len = htm.length;
   for (var i=0; i<len; i++) {
      if (htm[i] == '<') {
         if (tokens[i_token] == '') {
            tokens[i_token] = '<';
            token_types[i_token] = 'tag';
         } else {
            tokens.push ('<');
            token_types.push ('tag');
            i_token++;
         }
      } else if (htm[i] == '>') {
         tokens[i_token] += '>';
         tokens.push ('');
         token_types.push ('');
         i_token++;
      } else {

         // Add to token.
         tokens[i_token] += htm[i];
      }
   }

   // Remove empty non-tag tokens.
   var new_tokens = [];
   var new_token_types = [];
   var n_tokens = tokens.length;
   for (var i=0; i<n_tokens; i++) {
      if (token_types[i] == 'tag' || tokens[i] != '') {
         new_tokens.push (tokens[i]);
         new_token_types.push (token_types[i]);
      }
   }

   if (debug[0]) {
      console.log ('[parse_tags_text] new_tokens:', new_tokens);
   }

   return {'tokens': new_tokens, 'token_types': new_token_types}
}


// -----------------------------------------------------------------------------
// Add a value to an attribute, if attribute there already, or add attribute
// and value.
function add_attr_value (attr, value, attributes) {
   var re = new RegExp (attr + '\\s*=\\s*["\']', 'im');
   var m = attributes.match (re);
   if (m) {

      // Add only if particular value not already there.
      if (attributes.indexOf (value) == -1) {
         attributes = attributes.replace (re, m[0] + value + ' ');
      }
   } else {
      attributes += ' ' + attr + '="' + value + '"';
   }
   if (debug[0]) {
      console.log ('[add_attr_value] attributes:', attributes);
   }

   return attributes;
}


// -----------------------------------------------------------------------------
function process_wrapped_questions () {

   var any_new_question_div_b = false;
   q.$edit_area.find ('div.qwizzled_question').each (function () {
      var htm = $ (this).html ();
      if (debug[1]) {
         console.log ('[process_wrapped_questions] htm:', htm);
      }

      // If just tags and whitespace, delete div.
      if (is_only_tags_and_whitespace (htm)) {
         $ (this).remove ();
      } else {
         any_labeled_diagram_questions_b = true;

         // Error if more than one [q] inside question div.
         var m = htm.match (/\[q[ \]]/gm);
         if (m && m.length > 1) {
            alert (T ('A new question shortcode [q] has been placed inside an existing question.  Please move it outside and try again.'));
            q.exit_click_on_a_label ();
         } else {

            // Can set flag -- got at least one question.
            no_q_code_b = false;

            // Process already-wrapped and not-yet-wrapped labels and feedback,
            // if any.
            htm = q.process_question (htm, true);

            // Replace htm if any change.
            if (htm) {
               any_new_question_div_b = true;
               $ (this).html (htm);

               // Reinitialize dragging.
               q.reinit_dragging (q.$edit_area);
            }
         }
      }
   });

   return any_new_question_div_b;
}


// -----------------------------------------------------------------------------
// Look for questions in qwiz html.  Do for each question.
function process_notwrapped_questions (qwiz_html, question_start_tags) {

   var question_next_tags = ['[q]', '[q ', '<div class="qwizzled_question">', '[x]', '[/qwiz]'];

   var any_new_html_b = false;
   var any_labels_b   = false;

   // Don't revisit questions (in case no new html).
   var ipos = 0;
   var new_qwiz_html = qwiz_html;
   while (true) {

      // Need to avoid [q]s already inside qwizzled_question divs.  Method will
      // be to see what comes first, <div class="qwizzled_question"... or [q].
      // If <div... first, set search position past the next [q] (which is
      // inside the div).
      var qwizzled_question_div_pos = qwiz_html.substr (ipos).search (/<div class="qwizzled_question[^_]/);
      if (qwizzled_question_div_pos != -1) {
         var q_pos = qwiz_html.substr (ipos).search (/\[q[ \]]/);
         if (debug[0]) {
            console.log ('[process_notwrapped_questions] qwizzled_question_div_pos:', qwizzled_question_div_pos, ', q_pos:', q_pos);
         }
         if (qwizzled_question_div_pos < q_pos) {
            ipos += q_pos + 2;
            continue;
         }
      }

      // Get html up to next question, including labels, feedback, and hints.
      var rqwiz = parse_html_block (qwiz_html.substr (ipos), question_start_tags,
                                    question_next_tags, false);
      var question_html = rqwiz.htm_block;
      if (question_html == 'NA') {
         break;
      }

      // Set global var.
      no_q_code_b = false;
      var new_question_html = question_html;

      // Create canvas div -- up to first label if or feedback shortcode or
      // hint if one of these present, otherwise everything.
      if (debug[0]) {
         console.log ('[process_notwrapped_questions] create canvas div...');
      }
      var label_pos = new_question_html.search (/\[l\]|\[f*\]|\[fx\]|\[hint\]/m);
      var label_etc_start_tags = ['[l]', '[f*]', '[fx]', '[hint]'];
      var r = parse_html_block (new_question_html, question_start_tags, label_etc_start_tags);
      var canvas_div_content = r.htm_block;
      if (debug[0]) {
         console.log ('[process_notwrapped_questions] canvas_div_content:', canvas_div_content);
      }

      // Include clear div in case any images.
      var canvas_div = '<div class="qwizzled_canvas qwiz_editable qwiz-question">'
                       + canvas_div_content
                       + '<div style="clear: both;"></div>'
                       + '</div> <!-- close qwizzled_canvas -->';
      new_question_html = new_question_html.replace (canvas_div_content, canvas_div);
      if (debug[0]) {
         console.log ('[process_notwrapped_questions] new_question_html:', new_question_html);
      }

      // Process labels and feedback.
      new_question_html = q.process_question (new_question_html, false);

      if (new_question_html) {
         any_new_html_b = true;
         new_qwiz_html = new_qwiz_html.replace (question_html, new_question_html);
      }

      // Skip visited.
      ipos += rqwiz.htm_index + question_html.length;
   }

   if (! any_new_html_b) {
      new_qwiz_html = '';
   }

   if (debug[0]) {
      console.log ('[process_notwrapped_questions] new_qwiz_html:', new_qwiz_html);
   }

   return new_qwiz_html;
}


// -----------------------------------------------------------------------------
this.process_question = function (question_html, doing_wrapped_b) {

   if (debug[0]) {
      console.log ('[process_question] doing_wrapped_b:', doing_wrapped_b);
   }
   if (debug[1]) {
      console.log ('[process_question] question_html:', question_html);
   }
   var any_new_html_b = false;

   // If there's a comment at the end -- that is, just opening tags,
   // comment, closing tags, and whitespace -- delete it temporarily, add
   // back to end when done.
   var comment_html = '';

   // This regex assumes no left square bracket in comment -- couldn't get non-
   // greedy match to work.  After comment, also look for opening/closing tags
   // around whitespace/non-breaking space.
   var comment_pos = question_html.search (/(<[^\/][^>]*>\s*)*\[!+\][^\[]*\[\/!+\]\s*(<\/[^>]+>\s*)*(<[^>]+>|&nbsp;|\s)*$/);
   if (comment_pos != -1) {
      comment_html = question_html.substr (comment_pos);
      question_html = question_html.substr (0, comment_pos);
      if (debug[0]) {
         console.log ('[process_question] comment_html:', comment_html);
      }
   }

   // Look for not-yet-wrapped labels in this question.
   // If not followed by [f*] and [fx], add shortcodes and canned responses
   // after wrap.
   label_start_tags = ['[l]'];
   var r = process_labels (question_html, label_start_tags, false);
   if (r.any_labels_b) {
      any_labeled_diagram_questions_b = true;
   }
   if (r.new_html) {
      any_new_html_b = true;
      question_html = r.new_html;

      // Add wrapper for question only if not wrapped already.  Include div
      // at bottom for title for div bottom border.  Add comment, if there,
      // back.
      if (! doing_wrapped_b) {
         question_html = '<div class="qwizzled_question">'
                       +    question_html
                       +    '<div class="qwizzled_question_bottom_border_title" title="' + T ('End of labeled-diagram question') +'">'
                       +    '</div>'
                       + '</div> <!-- close qwizzled_question -->'
                       + comment_html;
      }
   }

   return any_new_html_b ? question_html : '';
}


// -----------------------------------------------------------------------------
function check_fix_label_divs () {

   // Use jQuery to get label divs.
   q.$edit_area.find ('div.qwizzled_label').each (function () {
      var label_html = $ (this).html ();
      if (debug[1]) {
         console.log ('[check_fix_label_divs] label_html:', label_html);
      }

      // If just tags and whitespace, delete div.
      if (is_only_tags_and_whitespace (label_html)) {

         // Remove associated target, if any.
         var classes = $ (this).attr ('class');
         var m = classes.match (/qtarget_assoc([0-9]*)/);
         if (m) {
            assoc_id = m[1];
            var $qwizzled_question = $ (this).parents ('.qwizzled_question');
            remove_target ($qwizzled_question, assoc_id);
         }

         // Delete label div.
         $ (this).remove ();

      } else if (is_only_tags_and_whitespace (label_html, '[l]')) {

         // Blank label (had [l], but that's all).
         errmsgs.push (T ('Label [l] is blank'));

      } else {

         // If any comments inside label, move to after the label (save, delete,
         // add back after).  Include whitespace and opening/closing tags.
         var new_label_html = label_html;
         var label_comments = '';
         var re = new RegExp ('\\s*(<[^\/][^>]*>)*\\s*\\[!+\\][\\s\\S]*?\\[\\/!+\\]\\s*(<\\/[^>]+>)*\\s*', 'gm');
         var m = new_label_html.match (re);
         if (m) {
            label_comments = m.join ('');
            if (debug[0]) {
               console.log ('[process_wrapped_labels] new_label_html:', new_label_html);
               console.log ('[process_wrapped_labels] label_comments:', label_comments);
            }
            new_label_html = new_label_html.replace (re, '');
            $ (this).html (new_label_html);
            $ (this).after (label_comments);
         }
      }
   });
}


// -----------------------------------------------------------------------------
// Only do not-yet-wrapped labels.
function process_labels (question_html, label_start_tags, doing_wrapped_b) {

   // Get everything up to next label -- will process/parse out feedback
   // associated with each label, if any.
   var label_next_tags  = ['[l]', '[x]]',
                           '<div{^>}#?class\\s#=\\s#"{^"}#?qwizzled_label'];
   var feedback_start_tags = ['[f*]', '[fx]'];
   var feedback_next_tags = ['[l]', '[f*]', '[fx]', '[hint]', '[x]'];

   // Look for labels in question html.  Do for each [l] found.
   var any_new_html_b = false;
   var any_labels_b = false;

   // Skip visited -- in case no new html.
   var ipos = 0;
   var new_question_html = question_html;
   while (true) {

      // Need to avoid [l]s already inside qwizzled_label divs.  Method will
      // be to see what comes first, <div class="qwizzled_label"... or [l].
      // If <div... first, move past the next [l] (which is inside the div).
      var qwizzled_label_div_pos = question_html.substr (ipos).indexOf ('<div class="qwizzled_label">');
      if (qwizzled_label_div_pos != -1) {
         var q_pos = question_html.substr (ipos).search (/\[q[ \]]/);
         if (debug[0]) {
            console.log ('[process_labels] qwizzled_label_div_pos:', qwizzled_label_div_pos, ', q_pos:', q_pos);
         }
         if (qwizzled_label_div_pos < q_pos) {
            ipos += q_pos + 2;
            continue;
         }
      }

      // Get html up to next label.
      var r = parse_html_block (question_html.substr (ipos), label_start_tags,
                                label_next_tags, doing_wrapped_b);
      var label_html = r.htm_block;
      if (label_html == 'NA') {
         break;
      }

      // If empty wrapped div, delete.
      if (doing_wrapped_b) {
         if (r.all_whitespace) {
            new_question_html = new_question_html.replace (label_html, '');
            ipos += r.htm_index + label_html.length;
            any_new_html_b = true;
            continue
         }
      }

      // If any comments inside label, move to after the label (save, delete,
      // add back later).  Include whitespace and opening/closing tags.
      var new_label_html = label_html;
      var label_comments = '';
      var re = new RegExp ('\\s*(<[^\/][^>]*>)*\\s*\\[!+\\][\\s\\S]*?\\[\\/!+\\]\\s*(<\\/[^>]+>)*\\s*', 'gm');
      var m = new_label_html.match (re);
      if (m) {
         label_comments = m.join ('');
         if (debug[0]) {
            console.log ('[process_labels] new_label_html:', new_label_html);
            console.log ('[process_labels] label_comments:', label_comments);
         }
         new_label_html = new_label_html.replace (re, '');
      }

      // Process label only if not all whitespace.
      if (! is_only_tags_and_whitespace (new_label_html)) {
         any_labels_b = true;
         if (! doing_wrapped_b) {
            any_new_html_b = true;
            if (debug[0]) {
               console.log ('[process_labels] new_label_html:', new_label_html);
            }

            // Not yet wrapped, so see if feedback present within the label
            // html.
            var feedback_htmls = [];
            while (true) {
               var rf = parse_html_block (new_label_html, feedback_start_tags,
                                          feedback_next_tags);
               var feedback_html = rf.htm_block;
               if (feedback_html == 'NA') {
                  break;
               }

               // Take feedback out of label html.  If feedback is empty,
               // ignore -- will create feedback with canned response.
               // Otherwise, save.
               new_label_html = new_label_html.replace (feedback_html, '');
               if (debug[0]) {
                  console.log ('[process_labels] feedback_html:', feedback_html);
                  console.log ('[process_labels] new_label_html:', new_label_html);
               }
               if (! is_only_tags_and_whitespace (feedback_html.replace (/\[f[\*x]\]/, ''))) {
                  feedback_htmls.push (feedback_html);
               }
            }

            // Delete trailing whitespace from label, which includes paragraphs
            // and headers with &nbsp; and/or <br> in them.
            new_label_html = new_label_html.replace (/(\s*(<[ph][^>]*>)*\s*(&nbsp;|<br[^>]*>)*\s*(<\/[ph][^>]*>)*\s*)*$/gm, '');

            // Div for labels if not already wrapped.  (Not span: somebody eats
            // spans around <p> elements.)  "Opening tag" for wrapped label is
            // div with class qwizzled_label.
            if (new_label_html.indexOf ('qwizzled_label') == -1) {

               // Add highlight class to div only if there are no paragraph or
               // header tags inside.  Also, when no paragraph or header tags,
               // make div inline.
               var highlight = '';
               var style     = '';
               var ph_pos = new_label_html.search (/<p|<h[1-6]/m);
               if (ph_pos == -1) {
                  highlight = ' qwizzled_highlight_label';
                  style     = ' style="display: inline;"';
               }
               new_label_html = '<div class="qwizzled_label qwiz_editable' + highlight + '"' + style + '>' + new_label_html + '</div>';
            }

            // Add back comments, if any.
            new_label_html += label_comments;

            // Now check feedback for this label.
            var fc_b = false;
            var fx_b = false;
            var f_len = feedback_htmls.length;
            if (f_len > 2) {
               errmsgs.push (T ('Too many feedback shortcodes'));
            }
            for (var i=0; i<f_len; i++) {
               if (feedback_htmls[i].search (/\[fx\]/) != -1) {
                  fx_b = true;
               } else {
                  fc_b = true;
               }
            }
            if (debug[0]) {
               console.log ('[process_labels] fx_b:', fx_b, ', fc_b:', fc_b);
            }
            if (! fx_b) {
               feedback_htmls.push (canned_feedback (false));
            }
            if (! fc_b) {
               feedback_htmls.push (canned_feedback (true));
            }
            if (debug[0]) {
               console.log ('[process_labels] feedback_htmls:', feedback_htmls.join ('\n'));
            }
            new_label_html += feedback_htmls.join ('\n');

            new_question_html = new_question_html.replace (label_html, new_label_html);
         }
      }

      // Skip visited.
      ipos += r.htm_index + label_html.length;
   }

   if (! any_new_html_b) {
      new_question_html = '';
   }

   if (debug[0]) {
      console.log ('[process_labels] any_labels_b: ', any_labels_b);
      console.log ('[process_labels] new_question_html: ', new_question_html);
   }

   return {'any_labels_b': any_labels_b, 'new_html': new_question_html};
}


var correct = [T ('Good!'), T ('Correct!'), T ('Excellent!'), T ('Great!')];
var incorrect = [T ('No.'), T ('No, that\'s not correct.')];
// -----------------------------------------------------------------------------
function canned_feedback (correct_b) {

   var response;
   if (correct_b) {
      var i = Math.floor (Math.random () * correct.length);
      response = '[f*] ' + correct[i];
   } else {
      var i = Math.floor (Math.random () * incorrect.length);
      response = '[fx] ' + incorrect[i] + ' ' + T ('Please try again') + '.';
   }
   response = '<p><strong>' + response + '</strong></p>';

   if (debug[0]) {
      console.log ('[canned_feedback] response:', response);
   }
   return response;
}


// -----------------------------------------------------------------------------
function check_qwiz_tag_pairs_ok (htm) {

   var error_b = false;

   // Match "[qwiz]" or "[/qwiz]".
   var matches = htm.match (/\[qwiz|\[\/qwiz\]/gm);
   if (matches) {
      var n_tags = matches.length;
      if (n_tags == 0) {
         alert (T ('Did not find [qwiz]...[/qwiz] shortcodes'));
         error_b = true;
      } else {

         if (n_tags % 2 != 0) {
            error_b = true;
         } else {

            // Check proper pairs.
            for (var i=0; i<n_tags; i++) {
               var tag = matches[i];
               if (i % 2 == 0) {
                  if (matches[i] != '[qwiz') {
                     error_b = true;
                     break;
                  }
               } else {
                  if (matches[i] != '[/qwiz]') {
                     error_b = true;
                     break;
                  }
               }
            }
         }
         if (error_b){
            alert (  T ('Unmatched [qwiz] - [/qwiz] pairs.')  + '  '
                   + T ('Please fix and try again.'));
         }
      }
   } else {
      alert (  T ('Did not find [qwiz]...[/qwiz] shortcodes') + '  '
             + T ('Please fix and try again.'));
   }

   return ! error_b;
}


// -----------------------------------------------------------------------------
function check_fix_matching_divs (htm) {

   var new_htm = [];

   // Find all opening/closing divs.
   var div_re = RegExp ('<div[^>]*>|<\/div>', 'gm');
   var div_matches = htm.match (div_re);
   if (div_matches) {

      // Loop over tags.  Mark matches.
      var matched_pair_b = [];
      var n_tags = div_matches.length;
      for (var i=0; i<n_tags; i++) {
         matched_pair_b.push (false);
         if (div_matches[i].substr(0, 2) == '</') {

            // Closing </div>.  Look for previous unmatched opening <div>.  If
            // found, mark pair as matched.
            for (var jj=i-1; jj>=0; jj--) {
               if (div_matches[jj].substr (0, 2) == '<d' && ! matched_pair_b[jj]) {
                  matched_pair_b[jj] = true;
                  matched_pair_b[i]  = true;
                  break;
               }
            }
         }
      }

      // If unmatched opening divs, add a closing div for each.  If unmatched
      // closing divs, delete.
      if (matched_pair_b.indexOf (false) != -1) {

         // If there's a comment at the end -- that is, just opening tags,
         // comment, closing tags, and whitespace before (optionally) the
         // bottom-border div and a closing div -- delete it temporarily, add
         // back to end when done.
         var comment_html = '';

         // This regex assumes no left square bracket in comment -- couldn't get
         // non-greedy match to work.  After comment, also look for
         // opening/closing tags around whitespace/non-breaking space.
         //                               2 opening tags                           3 closing     4 tags around nbsp            5                                                             6
         var comment_match = htm.match (/((<[^\/][^>]*>\s*)*\[!+\][^\[]*\[\/!+\]\s*(<\/[^>]+>\s*)*(<[^>]+>&nbsp;<\/[^>]+>\s*)*)(<div class="qwizzled_question_bottom_border_title"[^>]*>\s*)*(<\/div>\s*)*$/);
         //                              1 comment, open/close tags, whitespace & nbsp ---------------------------------------|
         if (comment_match) {
            comment_html = comment_match[1];
            htm = htm.replace (comment_html, '');

            if (debug[2]) {
               console.log ('[check_fix_matching_divs] comment_html:', comment_html);
            }
         }

         // Split contents on div tags.
         var pieces = htm.split (div_re);

         new_htm.push (pieces[0]);
         var n_new_closing_divs = 0;
         for (var i=0; i<n_tags; i++) {

            // Save pieces and divs, except unmatched closing divs.
            if (matched_pair_b[i]) {
               new_htm.push (div_matches[i]);
            } else {
               if (div_matches[i].substr(0, 2) == '<d') {

                  // Unmatched opening div.  Save, and count how many closing
                  // divs needed.
                  new_htm.push (div_matches[i]);
                  n_new_closing_divs++;
                  if (debug[2]) {
                     console.log ('[check_fix_matching_divs] unmatched opening div:', div_matches[i]);
                  }
               } else {
                  if (debug[2]) {
                     console.log ('[check_fix_matching_divs] unmatched closing div', i);
                  }
               }
            }
            new_htm.push (pieces[i+1]);
         }

         // Add on needed closing divs.
         for (var i=0; i<n_new_closing_divs; i++) {
            new_htm.push ('</div>');
         }

         // Add back comment.
         if (comment_html) {
            new_htm.push (comment_html);
         }
      }
   }
   new_htm = new_htm.join ('');
   if (debug[2]) {
      console.log ('[check_fix_matching_divs] new_htm:', new_htm);
   }

   return new_htm;
}


// -----------------------------------------------------------------------------
function report_errors () {

   // Error messages, if any.
   if (errmsgs.length) {
      alert (plural ('Error found', 'Errors found', errmsgs.length) + ':\n\n' + errmsgs.join ('\n'));
   }
}


// -----------------------------------------------------------------------------
function parse_html_block_pattern (tags) {
   var tags_pat = '(' + tags.join (')|(') + ')';
   tags_pat = tags_pat.replace (/([\[\]\*])/g, '\\$1');
   tags_pat = '((' + tags_pat + ')\\s*)';

   return tags_pat;
}


// -----------------------------------------------------------------------------
function find_opening_tags_at_end (htm) {
   var all_opening_tags_match = htm.match (/(\s*(<[^/][^>]*>\s*)*)*?$/);
   if (debug[10]) {
      console.log ('[find_opening_tags_at_end] htm:', htm);
      console.log ('[find_opening_tags_at_end] all_opening_tags_match:', all_opening_tags_match);
   }

   var opening_tags = '';
   if (all_opening_tags_match && typeof (all_opening_tags_match[1]) != 'undefined') {
      var all_opening_tags = all_opening_tags_match[1];
      var opening_tags_match = all_opening_tags.match (/\s*(<[^/][^>]*>\s*)|([^<]*$)/g);
      if (debug[10]) {
         console.log ('[find_opening_tags_at_end] all_opening_tags:', all_opening_tags);
         console.log ('[find_opening_tags_at_end] opening_tags_match:', opening_tags_match);
      }

      // Loop, starting from last.  Stop before anything that is not a tag or
      // whitespace, or is one of these (self-closing) tags: <input... />,
      // <img... />.
      if (opening_tags_match) {
         var opening_tags_array = [];
         var n_matches = opening_tags_match.length;
         for (var i_match=n_matches-1; i_match>=0; i_match--) {
            var tag = opening_tags_match[i_match];
            if (tag == '') {
               continue;
            }
            if (tag[0] != '<' && ! /\s/.test(tag[0])) {
               break;
            }
            var stag = tag.replace (/\s/g, '').substr (0, 4);
            if (stag == '<img' || stag == '<inp') {
               break;
            }

            // Keep in correct order: add to front of array.
            opening_tags_array.unshift (tag);
         }
         opening_tags = opening_tags_array.join ('');
      }
   }
   if (debug[10]) {
      console.log ('[find_opening_tags_at_end] opening_tags:', opening_tags);
   }

   return opening_tags;
}


// -----------------------------------------------------------------------------
// Parse out block of html -- from opening tags, through one of qwiz/qcard
// shortcodes up to any opening tags of next qwiz/qcard shortcode.
function parse_html_block (htm, shortcodes, next_shortcodes, ignore_nbsp_b) {
   if (debug[10]) {
      console.log ('[parse_html_block] shortcodes: ', shortcodes, ', htm: ', htm);
   }

   // String is presumably "return whitespace".  Flag to do so only if is all
   // whitespace (including empty paragraphs).
   var return_whitespace_b = typeof (ignore_nbsp_b) == 'string';

   // Find position of shortcode(s) we're interested in.
   var html_block;
   var offset       = 0;
   var opening_tags = '';
   if (shortcodes[0] != '^') {
      var shortcodes_pat = parse_html_block_pattern (shortcodes);
      var re = new RegExp (shortcodes_pat);
      var shortcodes_pos = htm.search (re);
      if (shortcodes_pos == -1) {
         if (debug[10]) {
            console.log ('[parse_html_block] html_block: NA');
         }
         return 'NA';
      }

      // Find all opening tags before next shortcode.
      offset = 3;
      var all_before_shortcode = htm.substr (0, shortcodes_pos);
      opening_tags = find_opening_tags_at_end (all_before_shortcode);
   }

   // Find position of next shortcode.
   var next_shortcodes_pos = -1;
   if (next_shortcodes.length) {
      var shortcodes_pat = parse_html_block_pattern (next_shortcodes);
      re = new RegExp (shortcodes_pat);
      next_shortcodes_pos = htm.substr (shortcodes_pos+offset).search (re);
   }
   if (next_shortcodes_pos == -1) {

      // Not there.  Take all up to end.
      html_block = opening_tags + htm.substr (shortcodes_pos);
   } else if (next_shortcodes_pos == 0) {
      html_block = '';
   } else {

      // Find all opening tags before next shortcode.
      var next_opening_tags = '';
      var all_before_next_shortcode = htm.substr (shortcodes_pos, offset + next_shortcodes_pos);
      next_opening_tags = find_opening_tags_at_end (all_before_next_shortcode);

      // Take away -- at end only!
      var html_before_next_opening_tags;
      if (next_opening_tags != '') {
         var next_opening_tags_pat = next_opening_tags + '$';
         re = new RegExp (next_opening_tags_pat);
         html_before_next_opening_tags = all_before_next_shortcode.replace (re, '');
      } else {
         html_before_next_opening_tags = all_before_next_shortcode;
      }
      html_block = opening_tags + html_before_next_opening_tags;
      if (html_block != '') {

         // If htm is only tags and whitespace, set to empty string.
         var htm_wo_tags = html_before_next_opening_tags.replace (/<[^>]+>/gm, '');

         // If flag set, also ignore &nbsp and breaks;
         if (ignore_nbsp_b != undefined) {
            htm_wo_tags = htm_wo_tags.replace (/&nbsp;|&emsp;|<br[^>]*>/gm, '');
         }

         var is_whitespace_b = htm_wo_tags.search (/\S/) == -1;
         if (is_whitespace_b) {
            if (! return_whitespace_b) {
               html_block = '';
            }
         }
      }
   }

   // If returning only whitespace, and not all whitespace, return empty
   // string.
   if (return_whitespace_b && ! is_whitespace_b) {
      html_block = '';
   }
   if (debug[10]) {
      console.log ('[parse_html_block] html_block:', html_block);
   }

   return html_block;
}


// -----------------------------------------------------------------------------
function is_only_tags_and_whitespace (htm, take_out_shortcode) {

   if (debug[10]) {
      console.log ('[is_only_tags_and_whitespace] htm:', htm);
   }

   // Take out tags.
   var htm = htm.replace (/<[^>]+>/gm, '');

   if (take_out_shortcode) {

      // Also take out shortcode.
      htm = htm.replace (take_out_shortcode, '');
   }

   var only_tags_and_whitespace_b = htm.search (/\S/) == -1;
   if (debug[10]) {
      console.log ('[is_only_tags_and_whitespace] only_tags_and_whitespace_b:', only_tags_and_whitespace_b);
   }

   return only_tags_and_whitespace_b;
}


// -----------------------------------------------------------------------------
// Register quizzes/decks OR make quiz/deck into a dataset source.
// A draggable like the main menu to do all -- login if not logged in, create
// maker account, register (set qrecord_id="..." attribute) or make into
// dataset (set dataset="..." attribute).
this.register_qqs = function (local_qq_dataset) {

   // Set global var.
   qq_dataset = local_qq_dataset;

   var title;
   if (qq_dataset == 'qq') {
      title = 'Qwizcards - ' + T ('Enable progress recording for quizzes and flashcard decks');
   } else {
      title = 'Qwizcards - ' + T ('Use datasets or save quizzes and decks as datasets');
   }
   $ ('#register_qqs_header div.qwizzled_main_menu_title').html (title);

   // If maker not logged in, check session ID -- DB call.
   if (! q.maker_logged_in_b) {

      // Callback: continue with register_qqs2 ().
      check_session_id ('register_qqs2');
   } else {

      // If logged in as mini-maker, require new administrative login.
      if (q.username.substr (0, 10) == 'mini-maker') {
         q.maker_logged_in_b = false;
      }
      q.register_qqs2 ();
   }
}


// -----------------------------------------------------------------------------
this.register_qqs2 = function () {

   // If maker not logged in, show login dialog.
   if (! q.maker_logged_in_b) {

      // Remove session ID cookie, in case there but no longer valid.
      $.removeCookie ('maker_session_id', {path: '/'});

      // Login callback will continue with register_qqs3 ().
      $ ('#register_qqs_main').hide ();
      $ ('#register_qqs_login').show ();
      $ ('#register_qqs_dialog_box').show ();
      $ ('#qwizzled_username').focus ();
   } else {
      q.register_qqs3 ();
   }
}


// -----------------------------------------------------------------------------
this.register_qqs3 = function (change_f) {
   if (! change_f) {
      change_f = 0;
   }
   if (debug[0]) {
      console.log ('[register_qqs3] change_f:', change_f);
   }
   $ ('#register_qqs_login').hide ();
   $ ('#register_qqs_main').html ('');

   // Show username in dialog box.
   var sign_out =   '<a href="javascript: qwizzled.sign_out ()" class="qwizzled_smaller">'
                  +    T ('Sign out')
                  + '</a>';
   $ ('#register_qqs_user').html (q.username + '&ensp;' + sign_out).show ();

   // Login/verification completed.  

   // If qwizard, use attributes passed in (from qwiz.js or qwizcards.js) --
   // just a single quiz or deck.
   var check_b = false;
   q.qrecord_ids_datasets = [];
   q.dataset_intros       = [];
   if (q.qwizard_b) {
      var q_f = q.qwiz_deck == 'qwiz' ? 'Q' : 'F';
      q.q_fs = [q_f];
      var qrecord_id_dataset = '';
      if (qq_dataset == 'qq') {
         qrecord_id_dataset = get_attr (q.qwiz_deck_attributes, 'qrecord_id');
         if (! qrecord_id_dataset) {
            qrecord_id_dataset = get_attr (q.qwiz_deck_attributes, 'xqrecord_id');
            if (qrecord_id_dataset) {
               qrecord_id_dataset = '$x$' + qrecord_id_dataset;
            }
         }
      } else {
         // DKTMP...
      }
      var dataset_intro_b = false;
      if (qrecord_id_dataset) {
         check_b = true;
         dataset_intro_b = get_attr (q.qwiz_deck_attributes, 'dataset_intro') != 'false';
      }
      q.qrecord_ids_datasets = [qrecord_id_dataset];
      q.dataset_intros       = [dataset_intro_b];
   } else {

      // Find quizzes and decks on this page, see which -- if any -- have
      // qrecord_id/dataset already.  For those, see if is valid in DB table.
      // Show list of all, with options.
      var r = get_qwiz_qdeck_shortcodes ();
      if (! r) {

         // Was in text mode.
         return false;
      }
      var matches = r.matches;
      if (matches) {

         // Loop over each.
         q.q_fs = [];
         var n_matches = matches.length;
         for (var i=0; i<n_matches; i++) {
            var m = matches[i];
            var q_f = m.substr (0, 5) == '[qwiz' ? 'Q' : 'F';
            q.q_fs.push (q_f);

            m = replace_smart_quotes (m);

            var qrecord_id_dataset = '';
            if (qq_dataset == 'qq') {
               qrecord_id_dataset = get_attr (m, 'qrecord_id');
               if (! qrecord_id_dataset) {
                  qrecord_id_dataset = get_attr (m, 'xqrecord_id');
                  if (qrecord_id_dataset) {
                     qrecord_id_dataset = '$x$' + qrecord_id_dataset;
                  }
               }
            } else {
               qrecord_id_dataset = get_attr (m, 'dataset');
               if (! qrecord_id_dataset) {
                  qrecord_id_dataset = get_attr (m, 'use_dataset');
                  if (qrecord_id_dataset) {
                     qrecord_id_dataset = '$use$' + qrecord_id_dataset;
                  }
               }
            }
            var dataset_intro_b = false;
            if (qrecord_id_dataset) {
               check_b = true;
               dataset_intro_b = get_attr (m, 'dataset_intro') != 'false';
            }
            q.qrecord_ids_datasets.push (qrecord_id_dataset);
            q.dataset_intros.push (dataset_intro_b);
         }
      } else {
         $ ('#register_qqs_main').html ('<span style="color: red; font-weight: bold;">' + T ('Did not find "[qwiz...]" or ["qdeck...]" shortcodes') + '</span>').show ();
         $ ('#register_qqs_dialog_box').show ();
      }
   }
   if (check_b || qq_dataset == 'dataset') {

      // See which are known -- callback continues with register_qqs4 ().
      var qrecord_ids = [];
      var n_qrecord_ids = q.qrecord_ids_datasets.length;
      for (var i=0; i<n_qrecord_ids; i++) {
         qrecord_ids.push (q.qrecord_ids_datasets[i].replace ('$x$', ''));
      }
      var data = {maker_session_id: q.maker_session_id,
                  qq_dataset:       qq_dataset,
                  qrecord_ids:      JSON.stringify (qrecord_ids),
                  q_fs:             JSON.stringify (q.q_fs),
                  change_f:         change_f,
                  permalink:        permalink};
      if (qq_dataset == 'dataset') {
         data.ip = get_qwiz_param ('wp_server_address', '');
      }
      jjax (qname, 'check_registered', data);
   } else {
      q.qwiz_qdeck_ids = [];
      q.qwiz_page_urls = [];
      q.register_qqs4 (change_f);
   }
}


// -----------------------------------------------------------------------------
// Show table of quizzes/decks, with options.
this.register_qqs4 = function (change_f) {
   if (debug[0]) {
      console.log ('[register_qqs4] q.qwiz_qdeck_ids:', q.qwiz_qdeck_ids);
      console.log ('[register_qqs4] q.qwiz_page_urls:', q.qwiz_page_urls);
   }
   var h = [];
   h.push ('<table class="register_qqs" align="center" border="0">');
   h.push ('<tr>');
   h.push (   '<th>');
   h.push (      'Quiz/deck&nbsp;no.');
   h.push (   '</th>');
   if (qq_dataset == 'qq') {
      h.push ('<th>');
      h.push (   'Name&nbsp;(qrecord_id)&nbsp;<img src="' + qwizzled_params.url + 'images/info_icon.png" class="cursor_help" title="You can change the display name - go to qwizcards.com/admin &ldquo;Manage quizzes and decks&rdquo;" />');
      h.push ('</th>');
      h.push ('<th>');
      h.push (   'Registered?');
      h.push ('</th>');
      h.push ('<th>');
      h.push (   'Enabled?');
      h.push ('</th>');
      h.push ('<th>');
      h.push (   'Enable/<br />disable');
      h.push ('</th>');
      h.push ('<th>');
      h.push (   'URL <img src="' + qwizzled_params.url + 'images/info_icon.png" class="cursor_help" title="Save/do not save page address in database. Uncheck and check to update."/>');
      h.push ('</th>');
   } else {
      h.push ('<th colspan="2">');
      h.push (   'Use&nbsp;dataset');
      h.push ('</th>');
      h.push ('<th>');
      h.push (   'Intro<img src="' + qwizzled_params.url + 'images/info_icon.png" class="cursor_help" title="Whether quiz/deck will start with a menu to choose units/topics"/>');
      h.push ('</th>');
      h.push ('<th class="qwizzled-border-left">');
      h.push (   'Dataset');
      h.push ('</th>');
      h.push ('<th>');
      h.push (   'Saved?');
      h.push ('</th>');
      h.push (   '<th>');
      h.push (      'Save');
      h.push (   '</th>');
   }
   h.push ('</tr>');

   var i_qwiz = 0;
   var i_deck = 0;

   if (q.wp_editing_page_f) {

      // Get permalink.  Start with http://sample.com/subdir/?page_id=...
      var site_url = $ ('#wp-admin-bar-site-name a').attr ('href');
      if (! site_url) {
         site_url = '';
      }
      permalink = $ ('#sample-permalink a').attr ('href');
      if (! permalink) {
         var post_name = $ ('#editable-post-name-full').html ();
         if (post_name) {
            permalink = site_url + post_name;
         } else {
            permalink = $ ('#view-post-btn a').attr ('href');
         }
      }

      // If still haven't found it, use WordPress admin header.
      if (! permalink) {
         permalink = $ ('a:contains("View Page")').attr ('href');
      }

      // Delete "&preview=true" if there.
      if (permalink) {
         permalink = permalink.replace ('&preview=true', '');
      }
   } else {

      // On user page or elsewhere.
      permalink = document.location.href;
   }

   var n_rows = q.qrecord_ids_datasets.length;
   for (var i_row=0; i_row<n_rows; i_row++) {
      h.push ('<tr class="row' + i_row + '">');

      var Quiz_deck;
      if (q.q_fs[i_row] == 'Q') {
         i_qwiz++;
         Quiz_deck = 'Quiz ' + i_qwiz;
      } else {
         i_deck++;
         Quiz_deck = 'Deck ' + i_deck;
      }
      h.push (   '<td>');
      h.push (      Quiz_deck);
      h.push (   '</td>');

      var using_dataset_b = false;
      if (qq_dataset == 'qq') {
         h.push (   '<td>');
         h.push (      q.qrecord_ids_datasets[i_row].replace ('$x$', ''));
         h.push (   '</td>');
      } else {

         // Use dataset.
         var select      = ' select';
         var use_dataset = '</td><td>';
         var dataset     = '';
         var qrecord_id_dataset = addSlashes (q.qrecord_ids_datasets[i_row]);
         using_dataset_b = qrecord_id_dataset.substr (0, 5) == '$use$';
         if (using_dataset_b) {
            var icon_delete =   '<button class="qwizzled_image_button" onclick="qwizzled.update_qrecord_id_dataset_attr (' + i_row + ', \'use_dataset\', \'' + qrecord_id_dataset + '\', true)">'
                              +    '<img src="' + qwizzled_params.url + 'images/delete.png" '
                              +         'class="icon_clickable" '
                              +         'title="Do not use dataset questions for this quiz/deck" />'
                              + '</button>';

            use_dataset = '<nobr>' + qrecord_id_dataset.substr (5) + '</nobr>'
                          + '</td><td>' + icon_delete;
            select = '';
         } else {
            dataset = q.qrecord_ids_datasets[i_row];
            if (dataset) {

               // Is a dataset.  Can't "use" another dataset (or itself!).
               select = '';
            }
         }
         h.push (   '<td class="use_dataset' + select + '">');
         h.push (      use_dataset);
         h.push (   '</td>');

         // Intro off/on.
         h.push (   '<td class="qwizzled_center">');
         var checked = q.dataset_intros[i_row] ? 'checked' : '';
         if (using_dataset_b) {
            h.push (   '<input type="checkbox" onclick="qwizzled.update_qrecord_id_dataset_attr (' + i_row + ', \'dataset_intro\', this.checked ? \'true\' : \'false\', false)" ' + checked + ' />');
         }
         h.push (   '</td>');

         // Dataset.
         h.push (   '<td class="qwizzled-border-left">');
         h.push (      dataset);
         h.push (   '</td>');
      }

      if (! using_dataset_b) {
         var registered;
         var enabled;
         var add_delete;
         var save_url = '';
         var url_checked = '';
         quiz_deck = q.q_fs[i_row] == 'Q' ? 'quiz' : 'deck';
         var title;
         var qrecord_id_dataset = q.qrecord_ids_datasets[i_row];
         if (q.qwiz_qdeck_ids[i_row] && qrecord_id_dataset.substr (0, 3) != '$x$') {
            registered = 'Yes';
            enabled = 'Yes';
            if (qq_dataset == 'qq') {
               title = 'Disable progress recording for this ' + quiz_deck + '. (You can reenable it later)';
            } else {
               title = 'Changes to this ' + quiz_deck + ' will not be saved in dataset ' + qrecord_id_dataset.replace (/'/g, '&#39;');
            }
            add_delete =   '<button class="qwizzled_image_button" onclick="qwizzled.deregister_qq (' + i_row + ')">'
                         +    '<img src="' + qwizzled_params.url + 'images/delete.png" '
                         +         'title="' + title + '" '
                         +         'class="icon_clickable" />'
                         + '</button>';
            title = 'Saved page address currently: ';
            if (qq_dataset == 'qq' && q.qwiz_page_urls[i_row]) {
               if (q.qwiz_page_urls[i_row] == permalink) {
                  url_checked = 'checked';
               }
               title += permalink;
            } else {
               title += '(none)';
            }
            save_url =   '<span id="update_page_url' + i_row + '" title="' + title + '">'
                       +    '<input type="checkbox" class="register_checkbox" onclick="qwizzled.update_page_url (this, ' + i_row + ')" ' + url_checked + ' />'
                       + '</span>';
         } else {
            registered = q.qwiz_qdeck_ids[i_row] ? 'Yes' : 'No';
            enabled = 'No';
            if (qq_dataset == 'qq') {
               title = 'Enable recording and reporting of student scores for this ' + quiz_deck;
            } else {
               title = 'Save this ' + quiz_deck + ' in database';
            }
            add_delete =   '<img src="' + qwizzled_params.url + 'images/add_icon.png" '
                         +      'title="' + title + '" '
                         +      'onclick="qwizzled.register_qq (\'' + addSlashes (qrecord_id_dataset) + '\', ' + i_row + ')" '
                         +      'class="icon_clickable" />';
         }
         h.push (   '<td class="qwizzled_center">');
         h.push (      registered);
         h.push (   '</td>');

         if (qq_dataset == 'qq') {
            h.push (   '<td class="qwizzled_center">');
            h.push (      enabled);
            h.push (   '</td>');
         }

         h.push (   '<td class="qwizzled_center">');
         h.push (      add_delete);
         h.push (   '</td>');
      }

      if (qq_dataset == 'qq') {
         h.push ('<td class="qwizzled_center" valign="middle">');
         h.push (   save_url);
         h.push ('</td>');
      }

      // Cell to enter new qrecord_id.
      h.push (   '<td class="enter_qrecord_id">');
      h.push (   '</td>');
      h.push ('</tr>');
   }
   n_qwizzes = i_qwiz;
   n_decks   = i_deck;
   h.push ('</table>');
   h.push ('<div id="register_qq_feedback">');
   h.push ('<div>');

   $ ('#register_qqs_main').html (h.join ('\n')).show ();

   // Set use_dataset selects.
   if (qq_dataset == 'dataset') {
      for (var i_row=0; i_row<n_rows; i_row++) {
         q.register_qq (q.qrecord_ids_datasets[i_row], i_row, true);
      }
   }

   $ ('#register_qqs_dialog_box').show ();

   if (change_f == 1 && ! q.qwizard_b) {
      var registration_save = qq_dataset == 'qq' ? 'registration' : 'save';
      $ ('#register_qq_feedback').html ('Please remember to Update - ' + registration_save + ' changed page text').css ({color: 'green'});
   }
}


// -----------------------------------------------------------------------------
this.exit_register_qqs = function () {
   $ ('#register_qqs_dialog_box').hide ();
   $ ('#register_qqs_login').hide ();
   $ ('#register_qqs_main').hide ();

   // In case qwizard editing.
   if (waiting_for_quiz_deck_click) {
      waiting_for_quiz_deck_click = '';
      q.$edit_area.off ('mouseup');
   }
}


// -----------------------------------------------------------------------------
// For progress recording, temporarily disable qrecord_id (change to
// "xqrecord_id").  For dataset, remove dataset= attribute from quiz/deck and
// remove dataset_id= from questions.
this.deregister_qq = function (i_row) {

   $ ('#register_qq_feedback').html ('');

   /* MARK DELETED IN DATABASE - NO LONGER DOING HERE.
   if (qq_dataset == 'qq') {
      var data = {maker_session_id: q.maker_session_id,
                  jjax:             1,
                  qrecord_id:       q.qrecord_ids_datasets[i_row],
                  i_row:            i_row};
      jjax (qname, 'mark_quiz_deck_deleted', data);
   }
   */

   // Change qrecord_id to xqrecord_id, or remove dataset= attribute.
   var remove_f = true;
   q.register_qq3 ('', q.q_fs[i_row], i_row, q.qrecord_ids_datasets[i_row], remove_f);
}


// -----------------------------------------------------------------------------
this.qq_deregistered = function (i_row, shared_f) {
   if (i_row >= 0) {

      // Redraw table, wait a little (table redraw) to set feedback.
      q.register_qqs3 ();
      var htm;
      if (shared_f && shared_f == 1) {
         htm =   'Quiz/deck no longer active for you.&nbsp; Note that it had been<br />'
               + 'shared and that others are using it in their classes.<br />'
               + 'Please leave qrecord_id="..." in place.';
      } else {
         htm = 'Quiz/deck registration removed from database.  (It can be restored on the Manage quizzes/decks page)';
      }
      setTimeout ("jQuery ('#register_qq_feedback').html ('" + htm + "').css ({color: 'green'})", 500);
   } else {
      $ ('#register_qq_feedback').html ('Unable to remove quiz/deck registration').css ({color: 'red'});
   }
}


// -----------------------------------------------------------------------------
this.register_qq = function (qrecord_id_dataset, i_row, use_dataset_f) {
   if (debug[0]) {
      console.log ('[register_qq] qrecord_id_dataset:', qrecord_id_dataset, ', i_row:', i_row);
   }
   $ ('#register_qq_feedback').html ('');
   if (qrecord_id_dataset) {
      if (qq_dataset == 'qq') {
         if (qrecord_id_dataset.substr (0, 3) == '$x$') {

            // Reset attribute from "xqrecord_id" to "qrecord_id".
            q.update_qrecord_id_dataset_attr (i_row, 'xqrecord_id', qrecord_id_dataset.substr (3));
            return;
         }
         qrecord_id_dataset = qrecord_id_dataset.replace (q.username + '-', '');
      }
   } else {
      qrecord_id_dataset = '';
   }
   var htm = [];
   htm.push ('<nobr>');
   if (qq_dataset == 'qq') {

      // Qrecord_id: input text for new qrecord_id.
      htm.push ('Name:&nbsp;' + q.username + '-');
      htm.push ('<input id="enter_qrecord_id' + i_row + '" type="text" class="enter_qrecord_id" onfocus="jQuery (\'#register_qq_feedback\').html (\'\')" value="' + qrecord_id_dataset + '" />');
      htm.push ('&nbsp;');
      htm.push ('<input type="button" onclick="qwizzled.register_qq2 (' + i_row + ')" value="Register" />');
   } else {

      // Use_dataset/dataset.
      var onchange;
      if (use_dataset_f) {

         // Use_dataset: select from among existing datasets (with permission).
         // If dataset being used is by this maker, make sure this page is in
         // permissions table.
         onchange = 'qwizzled.update_use_dataset (' + i_row + ', this.value)';
      } else {

         // Dataset: Add quiz/deck questions/cards to existing dataset or create
         // new dataset.
         onchange = 'qwizzled.set_save_create_button (' + i_row + ', this)';
      }

      // Existing datasets -- limit to those that match current row: quizzes or
      // decks only.
      var opt = [];
      if (q.available_datasets) {
         var n_existing_datasets = q.available_datasets.length;
         for (var i=0; i<n_existing_datasets; i++) {
            if (q.available_dataset_q_fs[i] == q.q_fs[i_row]) {
               opt.push ('   <option>');
               opt.push (       q.available_datasets[i]);
               opt.push ('   </option>');
            }
         }
      }

      // If creating dataset, make sure "Create new" option is available.
      if (opt.length || ! use_dataset_f) {
         var title = '';
         if (opt.length) {
            var questions_cards = q.q_fs[i_row] == 'Q' ? 'questions' : 'cards';
            title = ' title="Add ' + questions_cards + ' to an existing dataset or create a new dataset"';
         }
         htm.push ('<select class="new_existing_dataset" onchange="' + onchange + '"' + title + '>');
      }
      if (opt.length) {
         htm.push (   '<option>');
         htm.push (      'Select...');
         htm.push (   '</option>');

         htm.push (opt.join ('\n'));
      }

      if (! opt.length || ! use_dataset_f) {
         htm.push (   '<option>');
         htm.push (      'Create new');
         htm.push (   '</option>');

         htm.push ('</select>');
      }

      if (! use_dataset_f) {
         htm.push ('&nbsp;');
         var disabled = opt.length ? 'disabled' : '';
         htm.push ('<button onclick="qwizzled.new_existing_dataset (' + i_row + ')" ' + disabled +'>');
         if (opt.length) {
            htm.push ('Save');
         } else {
            htm.push ('Create');
         }
         htm.push ('</button>');
      }
   }
   htm.push ('</nobr>');

   // Remove element style width, which dragging adds -- just want to rely on
   // stylesheet min-width.
   $ ('#register_qqs_dialog_box').css ('width', '');

   // Erase any previous html, set new.
   $ ('table.register_qqs  td.enter_qrecord_id').html ('');
   if (use_dataset_f) {

      // Replace add-icon with select dropdown.
      $ ('table.register_qqs tr.row' + i_row + ' td.use_dataset.select').html (htm.join (''));
      $ ('table.register_qqs tr.row' + i_row + ' select.new_existing_dataset').focus ();
   } else {
      $ ('table.register_qqs tr.row' + i_row + ' td.enter_qrecord_id').html (htm.join (''));
      $ ('table.register_qqs tr.row' + i_row + ' input.enter_qrecord_id').focus ();
   }
}


// -----------------------------------------------------------------------------
this.new_existing_dataset = function (i_row) {

   // From use/save datasets menu (register_qq ()).  See whether saving as
   // existing or saving as new.
   var select_el = $ ('table.register_qqs tr.row' + i_row + ' td.enter_qrecord_id select.new_existing_dataset')[0];
   var selectedIndex = select_el.selectedIndex;
   if (debug[3]) {
      console.log ('[new_existing_dataset] selectedIndex:', selectedIndex);
   }
   var value = select_el.options[selectedIndex].value;
   if (debug[3]) {
      console.log ('[new_existing_dataset] value:', value);
   }
   if (value == 'Select...') {
      alert ('Please select an option from the drop-down list');
   } else {
      if (value == 'Create new') {

         // Replace cell with input textbox and save button.
         var htm =   '<input id="enter_qrecord_id' + i_row + '" type="text" class="enter_qrecord_id" onfocus="jQuery (\'#register_qq_feedback\').html (\'\')" placeholder="Dataset name" />'
                   + '&nbsp;'
                   + '<input type="button" onclick="qwizzled.register_qq2 (' + i_row + ', 1)" value="Create" />';
         $ ('#register_qqs_dialog_box').css ('width', '');
         $ ('table.register_qqs tr.row' + i_row + ' td.enter_qrecord_id').html (htm);
         $ ('table.register_qqs tr.row' + i_row + ' input.enter_qrecord_id').focus ();
      } else {

         // See which this is.
         var i_dataset = q.available_datasets.indexOf (value);
         q.register_qq3 ('', q.available_dataset_q_fs[i_dataset], i_row, value); 
      }
   }
}


// -----------------------------------------------------------------------------
this.set_save_create_button = function (i_row, select_el) {
   var label;
   if (select_el.value == 'Create new') {
      label = 'Create';
   } else {
      label = 'Save';
   }
   var $button = $ ('table.register_qqs tr.row' + i_row + ' button');
   $button.html (label);
   if (select_el.value == "Select...") {
      $button.attr ('disabled', true);
   } else {
      $button.removeAttr ('disabled');
   }
}


// -----------------------------------------------------------------------------
this.register_qq2 = function (i_row, create_f) {
   var qrecord_id_dataset;
   if (qq_dataset == 'qq' || create_f) {
      qrecord_id_dataset = $ ('table.register_qqs tr.row' + i_row + ' input.enter_qrecord_id').val ();
      if (qrecord_id_dataset == '') {
         var quiz_deck = q.q_fs[i_row] == 'Q' ? 'quiz' : 'deck';
         $ ('#register_qq_feedback').html ('Please enter name for ' + quiz_deck).css ({color: 'red'});
         return false;
      } else if (qrecord_id_dataset.indexOf ('"') != -1) {
         var quiz_deck = q.q_fs[i_row] == 'Q' ? 'quiz' : 'deck';
         $ ('#register_qq_feedback').html ('Double-quotes not allowed in name for ' + quiz_deck).css ({color: 'red'});
         return false;
      }
      if (qq_dataset == 'qq') {
         qrecord_id_dataset = q.username + '-' + qrecord_id_dataset;
      }
   } else {
      qrecord_id_dataset = $ ('table.register_qqs tr.row' + i_row + ' select.new_existing_dataset').val ();
   }

   // Condense multiple blanks (since apparently some combination of TinyMCE
   // or jQuery or browser will do so on the page in any case).
   qrecord_id_dataset = qrecord_id_dataset.replace (/ +/g, ' ');

   var data = {qq_dataset:       qq_dataset,
               maker_session_id: q.maker_session_id,
               qrecord_id:       qrecord_id_dataset,
               q_f:              q.q_fs[i_row].toUpperCase (),
               i_row:            i_row,
               permalink:        permalink};
   if (debug[0]) {
      console.log ('[register_qq2] data:', data);
   }

   // Callback: register_qq3 ().  Also, timeout to check on response.
   jjax (qname, 'register_qq', data);

   clearTimeout (register_qq3_timeout);
   register_qq3_response_f = false;
   register_qq3_timeout = setTimeout ('qwizzled.check_register_qq3_response ()', 3000);

   return false;
}


// -----------------------------------------------------------------------------
// Feedback for quiz/deck register, and add/modify html if successful.
this.register_qq3 = function (result, q_f, i_row, qrecord_id_dataset, remove_f) {
   register_qq3_response_f = true;
   if (result == 'dup') {
      var htm = 'That name is already in use.';
      $ ('#register_qq_feedback').html (htm).css ({color: 'red'});
   } else if (result == 'err') {
      $ ('#register_qq_feedback').html ('Unable to update database.').css ({color: 'red'});
   } else {

      // Add/modify html, redraw table.
      var attr;
      if (qq_dataset == 'qq') {
         attr = 'qrecord_id';
      } else {
         attr = 'dataset';
      }
      q.update_qrecord_id_dataset_attr (i_row, attr, qrecord_id_dataset, remove_f);
   }
}


// -----------------------------------------------------------------------------
this.check_register_qq3_response = function () {
   if (debug[0]) {
      console.log ('[check_register_qq3_response] register_qq3_response_f:', register_qq3_response_f);
   }
   if (! register_qq3_response_f) {
      var registration_save = qq_dataset == 'qq' ? 'registration' : 'save';
      $ ('#register_qq_feedback').html (T ('Did not get ' + registration_save + ' confirmation.  Please close and re-open this menu and check/try again.')).css ({color: 'red'});
   }
}


// -----------------------------------------------------------------------------
// Add page URL to permissions table if dataset from this maker.  Add
// use_dataset= attribute to quiz/deck.
this.update_use_dataset = function (i_row, dataset) {

   if (debug[3]) {
      console.log ('[update_use_dataset] dataset:', dataset);
   }
   if (dataset == 'Select...') {
      return false;
   }

   var i_dataset = q.available_datasets.indexOf (dataset);
   if (q.available_dataset_is_this_maker_fs[i_dataset]) {

      // Yes, from this maker.  Update permissions.
      var data = {maker_session_id: q.maker_session_id,
                  dataset:          dataset,
                  page_url:         permalink
                 }
      jjax (qname, 'update_dataset_permission', data);
   }

   // Add use_dataset=.
   q.update_qrecord_id_dataset_attr (i_row, 'use_dataset', dataset);
}


// -----------------------------------------------------------------------------
this.update_qrecord_id_dataset_attr = function (i_row, attr, 
                                                qrecord_id_dataset, remove_f) {
   if (debug[3]) {
      console.log ('[update_qrecord_id_dataset_attr] attr:', attr, ', qrecord_id_dataset:', qrecord_id_dataset);
   }
   if (qrecord_id_dataset == 'Select...') {
      return false;
   }
   if (q.qwizard_b) {

      // Qwizard -- update saved attributes; will get written when save/update
      // new quiz/deck.
      var old_qrecord_id_dataset = get_attr (q.qwiz_deck_attributes, attr);
      if (old_qrecord_id_dataset) {
         if (remove_f) {
            if (qq_dataset == 'qq') {
               q.qwiz_deck_attributes = q.qwiz_deck_attributes.replace (' ' + attr, ' x' + attr);
            } else {

               // Remove dataset= or dataset_intro attribute.
               q.qwiz_deck_attributes = q.qwiz_deck_attributes.replace (' ' + attr + '="' + old_qrecord_id_dataset + '"', '');

               // Also remove dataset_id= from questions in this quiz or deck.
               // DKTMP...
            }
         } else {

            // Replace with new qrecord_id.
            q.qwiz_deck_attributes = q.qwiz_deck_attributes.replace (old_qrecord_id_dataset, qrecord_id_dataset);
            if (attr == 'xqrecord_id') {
               q.qwiz_deck_attributes = q.qwiz_deck_attributes.replace (attr, 'qrecord_id');
            }
            if (debug[0]) {
               console.log ('[update_qrecord_id_dataset_attr] old_qrecord_id_dataset:', old_qrecord_id_dataset, ', qrecord_id_dataset: ', qrecord_id_dataset, ', q.qwiz_deck_attributes:', q.qwiz_deck_attributes);
            }
         }
      } else {

         // No qrecord_id or dataset.  Add at end.
         q.qwiz_deck_attributes += ' ' + attr + '="' + qrecord_id_dataset + '"';
         if (debug[0]) {
            console.log ('[update_qrecord_id_dataset_attr] q.qwiz_deck_attributes:', q.qwiz_deck_attributes);
         }
      }

      // Send updated attributes back to qwizard.js.
      qwizard.set_qwizard_data ('qwiz_deck_attributes', q.qwiz_deck_attributes);

      if (qq_dataset == 'qq') {

         // Set qwiz/deck options menu "Enable progress recording checkbox to
         // reflect state.
         var checked = q.qwiz_deck_attributes.indexOf ('xqrecord_id') == -1;
         $ ('#enable_progress_recording_checkbox')[0].checked = checked;
      }

      // Redraw table.
      q.register_qqs3 ();
   } else {
      var r = get_qwiz_qdeck_shortcodes ();
      if (! r) {

         // Was in text mode.
         return false;
      }
      var matches = r.matches;
      var htm     = r.htm;
      if (matches) {

         // Loop over each.
         q.q_fs = [];
         q.qrecord_ids_datasets = [];
         var n_check_qwizzes = 0;
         var n_check_decks   = 0;
         var n_matches = matches.length;
         for (var i=0; i<n_matches; i++) {
            var m = matches[i];
            if (m.substr (0, 5) == '[qwiz') {
               n_check_qwizzes++;
            } else {
               n_check_decks++;
            }
         }
         if (n_check_qwizzes != n_qwizzes || n_check_decks != n_decks) {
            $ ('#register_qq_feedback').html ('The number of quizzes and/or flashcard decks has changed -- perhaps from editing.<br />Please close this "Enable progress recording" box and try again.').css ({color: 'red'});
            return false;
         }

         // Find the i_rowth match in the html.
         var i_start_pos = 0;
         var shortcode;
         for (var i=0; i<=i_row; i++) {
            shortcode = matches[i];
            var i_pos = htm.indexOf (shortcode, i_start_pos+4);
            i_start_pos = i_pos;
         }
         var i_end_pos = htm.indexOf (']', i_start_pos);
         if (debug[0] || debug[3]) {
            var shortcode_check = htm.substring (i_start_pos, i_end_pos+1);
            console.log ('[update_qrecord_id_dataset_attr] shortcode:', shortcode, ', i_pos:', i_pos, ', i_end_pos:', i_end_pos, ', shortcode_check:', shortcode_check);
         }

         // Get attribute, if any.
         shortcode = replace_smart_quotes (shortcode);
         var old_qrecord_id_dataset = get_attr (shortcode, attr);
         if (old_qrecord_id_dataset) {
            if (remove_f) {
               if (qq_dataset == 'qq') {
                  shortcode = shortcode.replace (' ' + attr, ' x' + attr);
               } else {

                  // Remove the dataset= attribute.
                  shortcode = shortcode.replace (' ' + attr + '="' + old_qrecord_id_dataset + '"', '');
               }
               htm = htm.substring (0, i_start_pos) + shortcode + htm.substring (i_end_pos+1);

               if (qq_dataset == 'dataset') {

                  // Also remove dataset_id= from questions in
                  // this quiz or deck.
                  var i_end_quiz_deck = htm.indexOf ('[/q', i_start_pos);
                  var qdhtm = htm.substring (i_start_pos, i_end_quiz_deck);
                  var qmatches = qdhtm.match (/\[q\s[^\]]*\]/gm);
                  if (debug[3]) {
                     console.log ('[update_qrecord_id_dataset_attr] qmatches:', qmatches);
                  }
                  if (qmatches) {
                     var n_qmatches = qmatches.length;
                     for (var i=0; i<n_qmatches; i++) {
                        var qshortcode = qmatches[i];
                        var new_qshortcode = replace_smart_quotes (qshortcode);
                        new_qshortcode = new_qshortcode.replace (/\sdataset_id="[^"]+"/, '');
                        if (debug[3]) {
                           console.log ('[update_qrecord_id_dataset_attr] new_qshortcode:', new_qshortcode);
                        }
                        qdhtm = qdhtm.replace (/\[q\s[^\]]*\]/m, new_qshortcode);
                     }
                  }
                  htm = htm.substring (0, i_start_pos) + qdhtm + htm.substring (i_end_quiz_deck);
                  if (debug[3]) {
                     console.log ('[update_qrecord_id_dataset_attr] qdhtm:', qdhtm);
                     console.log ('[update_qrecord_id_dataset_attr] htm:', htm);
                  }
               }
            } else {

               // Replace with new qrecord_id.
               shortcode = shortcode.replace (old_qrecord_id_dataset, qrecord_id_dataset);
               if (attr == 'xqrecord_id') {
                  shortcode = shortcode.replace (attr, 'qrecord_id');
               }
               htm = htm.substring (0, i_start_pos) + shortcode + htm.substring (i_end_pos+1);
               if (debug[0]) {
                  console.log ('[update_qrecord_id_dataset_attr] old_qrecord_id_dataset:', old_qrecord_id_dataset, ', qrecord_id_dataset: ', qrecord_id_dataset, ', shortcode:', shortcode);
               }
            }
         } else {

            // No qrecord_id or dataset.  Add at end (before "]").
            var len = shortcode.length;
            shortcode = shortcode.substring (0, len-1) + ' ' + attr + '="' + qrecord_id_dataset + '"]';
            htm = htm.substring (0, i_start_pos) + shortcode + htm.substring (i_end_pos+1);
            if (debug[0]) {
               console.log ('[update_qrecord_id_dataset_attr] shortcode:', shortcode, ', i_start_pos:', i_start_pos, ', i_end_pos:', i_end_pos);
            }
         }

         // Replace content.
         q.$edit_area.html (htm);

         // Redraw table.  Set flag to show message to Update.
         q.register_qqs3 (1);
      } else {
         $ ('#register_qq_feedback').html (T ('Did not find "[qwiz...]" or ["qdeck...]" shortcodes')).css ({color: 'red'});
      }
   }
}


// -----------------------------------------------------------------------------
this.update_page_url = function (checkbox_el, i_row) {
   var save_page_url_f = checkbox_el.checked ? 1 : 0;
   var data = {maker_session_id: q.maker_session_id,
               qq_dataset:       qq_dataset,
               save_page_url_f:  save_page_url_f,
               i_row:            i_row,
               qrecord_id:       q.qrecord_ids_datasets[i_row],
               permalink:        permalink
              };
   jjax (qname, 'update_page_url', data);
}


// -----------------------------------------------------------------------------
this.page_url_updated = function (save_page_url_f, i_row, affected_rows) {
   if (affected_rows > 0) {

      // Success.  Reset span title.
      var current;
      if (save_page_url_f == 1) {
         $ ('#register_qq_feedback').html ('Page address updated in database').css ({color: 'green'});
         current = permalink;
      } else {
         $ ('#register_qq_feedback').html ('Page address removed from database').css ({color: 'green'});
         current = '(none)';
      }
      $ ('span#update_page_url' + i_row).attr ('title', 'Saved page address currently: ' + current);
   } else {

      // Didn't work.  Reset checkbox -- if was saving (checked), back to not
      // checked.
      $ ('span#update_page_url' + i_row + ' input')[0].checked = save_page_url_f == 1 ? false : true;
      $ ('#register_qq_feedback').html ('Unable to update page address in database').css ({color: 'red'});
   }
}


// -----------------------------------------------------------------------------
// Choices - new quiz, new flashcard deck, or edit existing quiz or deck.
this.qwizard_new_or_edit_existing = function () {

   mm = [];
   mm.push ('<div id="qwizzled_main_menu_items">');
   mm.push (   '<div class="qwizzled_main_menu_item" onclick="qwizzled.qwizard_new_or_edit_existing2 (\'qwiz\')" title="Create and add a new quiz">');
   mm.push (      'Insert new quiz');
   mm.push (   '</div>');

   mm.push (   '<div class="qwizzled_main_menu_item" onclick="qwizzled.qwizard_new_or_edit_existing2 (\'deck\')" title="Create and add a new flashcard deck">');
   mm.push (      'Insert new flashcard deck');
   mm.push (   '</div>');

   // Existing quizzes/decks, if any.
   var r = get_qwiz_qdeck_shortcodes ();
   if (! r) {

      // Was in text mode.
      return false;
   }

   var n_non_dataset_quizzes_decks = 0;
   var matches = r.matches;
   if (matches) {

      // Loop -- see if any non-use_dataset quizzes or decks.
      var n_matches = matches.length;
      if (debug[0]) {
         console.log ('[qwizard_new_or_edit_existing] n_matches:', n_matches);
      }
      for (var i=0; i<n_matches; i++) {
         var m = matches[i];
         m = replace_smart_quotes (m);
         if (! get_attr (m, 'use_dataset')) {
            n_non_dataset_quizzes_decks++;
         }
      }
   }
   if (n_non_dataset_quizzes_decks) {
      mm.push ('<div class="qwizzled_main_menu_item" onclick="qwizzled.qwizard_new_or_edit_existing2 (' + n_non_dataset_quizzes_decks + ')" title="Select quiz or flashcard deck to edit">');
      mm.push (   'Edit existing quiz or flashcard deck');
      mm.push ('</div>');
   }
   mm.push ('</div>');  // End qwizzled_menu_items.
   mm.push ('<div class="qwizzled_main_menu_feedback"></div>');

   var title = 'Interactive editing options';
   $ ('#register_qqs_header div.qwizzled_main_menu_title').html (title);
   $ ('#register_qqs_main').html (mm.join ('\n')).show ();
   $ ('#register_qqs_dialog_box').show ();
}


// -----------------------------------------------------------------------------
this.qwizard_new_or_edit_existing2 = function (qwiz_qdeck) {
   if (debug[0]) {
      console.log ('[qwizard_new_or_edit_existing2] qwiz_qdeck:', qwiz_qdeck);
   }
   var msg = '';
   if (typeof (qwiz_qdeck) == 'number') {

      // Edit existing.  Choose if there's more than one.
      waiting_for_quiz_deck_click = 'edit';
      msg = 'Click on quiz or flashcard deck you want to edit';
   } else {

      // Prompt for click for location of new quiz/deck.
      var quiz_flashcard_deck = qwiz_qdeck == 'qwiz' ? 'quiz' : 'flashcard deck';
      waiting_for_quiz_deck_click = 'new_' + qwiz_qdeck;
      msg = 'Click where you want to insert new ' + quiz_flashcard_deck;
   }
   $ ('#register_qqs_main div.qwizzled_main_menu_feedback').html (msg).show ();

   q.$edit_area.off ('mouseup');
   q.$edit_area.on ('mouseup', new_quiz_deck_click);
}


// -----------------------------------------------------------------------------
function new_quiz_deck_click (e) {
   var tinymce_ed_selection = q.tinymce_ed.selection;
   var selected_text;
   var node;
   var $node;
   if (tinymce_ed_selection) {
      selected_text = tinymce_ed_selection.getContent ();
      node = tinymce_ed_selection.getNode ();
      $node = $ (node);
   } else {
      selected_text = '';
      node = '';
   }
   if (debug[0]) {
      console.log ('[new_quiz_deck_click] selected_text:', selected_text, ', waiting_for_quiz_deck_click:', waiting_for_quiz_deck_click);
   }

   // Turn off further selects.
   q.$edit_area.off ('mouseup');

   if (! waiting_for_quiz_deck_click) {
      return false;
   }

   // Hide feedback and hide the menu.
   $ ('#register_qqs_main div.qwizzled_main_menu_feedback').hide ();
   $ ('#register_qqs_dialog_box').hide ();

   // Insert bookmark, id'd with current time.  Include selected text in case
   // user highlighted and not just clicked.
   var qbookmark_id = time_id ();
   qbookmark = '<span id="qbookmark' + time_id () + '" class="qbookmark"></span>';
   tinymce_ed_selection.setContent (selected_text + qbookmark);

   // Grab updated editor HTML content.
   current_html = q.$edit_area.html ();

   // Save qwizzled edit area -- for when return from qwizard.
   $qwizzled_edit_area = q.$edit_area;

   // If bookmark is inside a [qwiz or [qdeck shortcode, move after.  Move
   // before [/qwiz or [/qdeck].  Do the latter first (so can find the "/").
   var re = new RegExp ('\\[\\/[^\\]<]*' + qbookmark + '[^\\]]*\\]');
   var m = current_html.match (re);
   if (m) {
      var old_closing_shortcode = m[0];
      if (debug[0]) {
         console.log ('[new_quiz_deck_click] old_closing_shortcode:', old_closing_shortcode);
      }
      var shortcode = old_closing_shortcode.replace (/<span id="qbookmark[^<]+<\/span>/, '');
      var first_six = shortcode.substr (0, 6);
      if (first_six == '[/qwiz' || first_six == '[/qdec') {
         var new_shortcode = qbookmark + shortcode;
         current_html = current_html.replace (old_closing_shortcode, new_shortcode);
         if (debug[0]) {
            console.log ('[new_quiz_deck_click] new_shortcode:', new_shortcode);
            console.log ('[new_quiz_deck_click] current_html:', current_html);
         }
      }
   } else {
      re = new RegExp ('\\[[^\\]<]*' + qbookmark + '[^\\]]*\\]');
      m = current_html.match (re);
      if (m) {
         var old_opening_shortcode = m[0];
         if (debug[0]) {
            console.log ('[new_quiz_deck_click] old_opening_shortcode:', old_opening_shortcode);
         }
         var shortcode = old_opening_shortcode.replace (/<span id="qbookmark[^<]+<\/span>/, '');
         var first_five = shortcode.substr (0, 5);
         if (first_five == '[qwiz' || first_five == '[qdec') {
            var new_shortcode = shortcode + qbookmark;
            current_html = current_html.replace (old_opening_shortcode, new_shortcode);
            if (debug[0]) {
               console.log ('[new_quiz_deck_click] new_shortcode:', new_shortcode);
               console.log ('[new_quiz_deck_click] current_html:', current_html);
            }
         }
      }
   }

   // If we're right after an opening tag like <p> or <b> or <i> or <h1>, move
   // in front.
   // DKTMP

   // See if bookmark is inside [qwiz ... [/qwiz] or [qdeck ...  [/qdeck].
   // Match all quiz/deck pairs, then check if bookmark is inside, and which.

   m = current_html.match (/\[(qwiz|qdeck)[\s\S]*?\[\/(qwiz|qdeck)\]/gm);
   var i_bookmarked = -1;
   if (m) {

      // See which has bookmark, if any.
      var n_quizzes_decks = m.length;
      for (var ii=0; ii<n_quizzes_decks; ii++) {
         if (m[ii].indexOf (qbookmark) != -1) {
            i_bookmarked = ii;
            break;
         }
      }
   }
   var ok_f = true;
   if (waiting_for_quiz_deck_click.substr (0, 3) == 'new') {

      // Error if inside an existing quiz or deck.
      if (i_bookmarked != -1) {
         alert ('Cannot insert new quiz or deck inside an existing quiz or deck.\n'
                + 'Please try again');
         q.qwizard_new_or_edit_existing ();
         ok_f = false;
      } else {
         // E.g, "new_qwiz".
         //       0----1
         var qwiz_qdeck = waiting_for_quiz_deck_click.substr (4);
         q.qwizzled_start_qwizard (qwiz_qdeck);
      }
   } else {

      // Edit existing.  See which quiz/deck has been clicked, send html to
      // qwizard.
      if (i_bookmarked != -1) {
         current_qwiz_deck_html = m[i_bookmarked];

         // Check that not a use_dataset= quiz or deck.
         if (current_qwiz_deck_html.indexOf ('use_dataset="') != -1) {
            alert ('Cannot edit a use_dataset="..." quiz or deck.\n'
                   + 'You have to edit the quiz or deck that defines the dataset\n'
                   + '(that is, the one with dataset="")');
            q.qwizard_new_or_edit_existing ();
            ok_f = false;
         } else {
            q.qwizzled_start_qwizard (current_qwiz_deck_html);
         }
      } else {
         alert ('Click was not on an existing quiz or deck.\n'
                + 'Please try again');
         q.qwizard_new_or_edit_existing ();
         ok_f = false;
      }
   }
   waiting_for_quiz_deck_click = '';
   if (! ok_f) {

      // Remove bookmark from edit content.
      current_html = current_html.replace (qbookmark, '');
      q.$edit_area.html (current_html);
   }
}


// -----------------------------------------------------------------------------
// Load qwizard.js, qwizzled.js, and tinymce, start modal dialog.
this.qwizzled_start_qwizard = function (qwiz_deck_html) {
   if (debug[0]) {
      console.log ('[qwizzled_start_qwizard] q.tinymce_ed:', q.tinymce_ed, ', qwiz_deck_html:', qwiz_deck_html);
   }

   // Completely get rid of main menu so won't conflict with new one for
   // qwizard.
   $ ('.qwizzled_main_menu').remove ();
   if (   typeof (qwizard)             != 'undefined'
       && typeof (qwizard.start_modal) != 'undefined'
       && typeof (qwiz_)               != 'undefined'
       && typeof (qwiz_.qwiz_init)     != 'undefined') {
      qwizard.start_modal (q.tinymce_ed, qwiz_deck_html);
   } else {

      // Load script for qwizard, and scripts and css for rendering quizzes and
      // decks.
      var plugin_url = qwizzled_params.url;
      var query = '';
      if (debug[0]) {
         query = '?msec=' + new Date ().getTime ();
      }
      var scripts = '<script src="' + plugin_url + 'qwizard.js' + query + '"></script>\n'

                  // Done in pre_qwizzled.js.
                  //+ '<link rel="stylesheet" href="' + plugin_url + 'jquery-ui.css">\n'

                  + '<script src="' + plugin_url + 'autocomplete-combobox.js' + query + '"></script>\n'
                  + '<script src="' + plugin_url + 'jquery.simple-color.min.js' + query + '"></script>\n'

                  + '<script src="' + plugin_url + 'qwiz_qcards_common.js' + query + '"></script>\n'
                  + '<script src="' + plugin_url + 'qwiz.js' + query + '"></script>\n'
                  + '<script src="' + plugin_url + 'qwizcards.js' + query + '"></script>\n'

                  + '<link rel="stylesheet" href="' + plugin_url + 'qwiz.css">\n'
                  + '<link rel="stylesheet" href="' + plugin_url + 'qwizcards.css">\n';
      $ (scripts).appendTo ('head');

      // Move wp-admin stuff behind the modal overlay screen.
      $ ('#adminmenuwrap, #wpadminbar').css ({'z-index': 99});

      qwizard.start_modal (q.tinymce_ed, qwiz_deck_html);
   }
}


// -----------------------------------------------------------------------------
this.remove_bookmarks = function () {
   q.$edit_area = $qwizzled_edit_area;
   q.$edit_area.find ('span.qbookmark').remove ();
}


// -----------------------------------------------------------------------------
this.qwizard_update_edit_area = function (new_html, new_qwiz_qdeck_f) {

   // Called from qwizard.js.  If new quiz or deck, replace bookmark with html.
   if (new_qwiz_qdeck_f) {
      current_html = current_html.replace (qbookmark, new_html)
   } else {

      // Existing.  Replace whole quiz/deck.
      current_html = current_html.replace (current_qwiz_deck_html, new_html);
   }

   // Replace edit area content.
   q.$edit_area = $qwizzled_edit_area;
   q.$edit_area.html (current_html);
}


// -----------------------------------------------------------------------------
this.qwizard_dialog = function () {

   // Hide main menu, registration/dataset menu, in case showing.
   $ ('#qwizzled_main_menu, #register_qqs_main').hide ();

   // Open modal dialog box for wizard editing.
   console.log ('[qwizard_dialog] $qwizard_dialog:', $qwizard_dialog);
   $qwizard_dialog.dialog ('open');
}


// -----------------------------------------------------------------------------
this.qwizard_dialog_close = function () {
   $qwizard_dialog.dialog ('close');

   // Reopen main menu.
   $ ('#qwizzled_main_menu').show ();
}


// -----------------------------------------------------------------------------
function get_qwiz_qdeck_shortcodes () {

   // Get html.  If in text mode, message.
   if (! q.qwizard_b && ! $ (edit_area_selector).is (':visible')) {
      var htm =   '<br /><br />'
                + ('Please select "Visual" mode, then click "Continue"')
                + '<br /><br />'
                + '<button onclick="qwizzled.qwizard_new_or_edit_existing ()">'
                +    T ('Continue')
                + '</button>'
                + '&emsp;'
                + '<button onclick="jQuery (\'#register_qqs_dialog_box\').hide (); return false">'
                +    T ('Cancel')
                + '</button>'
                + '<br /><br />';
      $ ('#register_qqs_main').html (htm).show ();
      $ ('#register_qqs_dialog_box').show ();
      return;
   }

   // Grab current editor HTML content.
   var htm = q.$edit_area.html ();

   // Look for all "[qwiz...]" or "[qdeck...]"
   var matches;
   if (q.qwizard_b) {
      matches = htm.match (/<div id="qwiz0"[^>]*>/gm);
      if (! matches ) {
         var $tag = $ ('div.front table.qcard_table');
         if ($tag.length) {
            var table_div = $tag[0].outerHTML;
            matches = [table_div];
         }
      }
   } else {
      matches = htm.match (/\[(qwiz|qdeck)[^\]]*\]/gm);
   }

   if (debug[3]) {
      console.log ('[get_qwiz_qdeck_shortcodes] matches:', matches);
   }
   return {matches: matches, htm: htm};
}


// -----------------------------------------------------------------------------
function check_session_id (callback) {
   var logged_in_b;

   // Get cookie, check if still valid (server call).  If undefined, change
   // to null string (so don't pass string 'undefined' to php).
   var cookie_session_id = $.cookie ('maker_session_id');
   if (debug[0]) {
      console.log ('[check_session_id] cookie_session_id:', cookie_session_id);
   }
   if (! cookie_session_id) {
      logged_in_b = false;
      eval ('q.' + callback + ' ()');
   } else {
      var data = {cookie_session_id: cookie_session_id,
                  callback:          callback
                 };
      jjax (qname, 'check_maker_session_id', data);
   }
}


// -----------------------------------------------------------------------------
this.show_login = function () {
   qq_dataset = 'login';
   var title = T ('Qwizcards administrative login');
   $ ('#register_qqs_header div.qwizzled_main_menu_title').html (title);
   q.register_qqs2 ();
}


// -----------------------------------------------------------------------------
this.login = function () {

   // Have we got username and password?
   var $username = $ ('#qwizzled_username');
   var username = $username.val ();
   if (! username ) {
      alert (T ('Please enter User name'));
      $username.focus ();
      return false;
   }

   var $password = $ ('#qwizzled_password');
   var password = $password.val ();
   if (! password) {
      alert (T ('Please enter Password'));
      $password.focus ();
      return false;
   }

   // We'll send "SHA3" of password.
   var sha3_password = CryptoJS.SHA3 (password).toString ();

   // Do jjax call.  Callback is either login_ok () or login_not_ok ().
   var data = {jjax: 1, username: username, sha3_password: sha3_password};
   jjax (qname, 'maker_login', data);
   return false;
}


// -----------------------------------------------------------------------------
this.login_ok = function () {

   // Success.  Create session cookie, valid for one day,
   // set -- 1 day, good for whole site.  Value set by server.  Callback
   // script also sets session ID q.maker_session_id and sets q.username.
   var options = {path: '/', expires: 1};
   $.cookie ('maker_session_id', q.maker_session_id, options);

   // Set flag, record time.
   q.maker_logged_in_b = true;
   maker_current_login_sec = new Date ().getTime ()/1000.0;
   if (debug[0]) {
      console.log ('[login_ok] qq_dataset:', qq_dataset);
      console.log ('[login_ok] maker_current_login_sec:', maker_current_login_sec);
   }

   // Proceed, unless only login.
   if (qq_dataset == 'login') {
      $ ('#register_qqs_login').hide ();
      $ ('#register_qqs_main').html ('');
      $ ('#register_qqs_dialog_box').hide ();
      $qwizzled_main_menu_feedback.hide ();
   } else {
      q.register_qqs3 ();
   }
}


// -----------------------------------------------------------------------------
this.login_not_ok = function () {

   // Invalid login.  Error message.
   $ ('#register_qqs_login p.login_error').css ({visibility: 'visible'});

   // So subsequent focus () will work.
   $ ('#qwizzled_password').blur ();
}


// -----------------------------------------------------------------------------
this.sign_out = function () {

   // Delete cookie, unset flag.
   $.removeCookie ('maker_session_id', {path: '/'});
   q.maker_logged_in_b = false;

   // Remove session ID from DB table.
   var data = {session_id: q.maker_session_id, table: 'maker_session_id'};
   jjax ('', 'delete_session_id', data);

   // Hide username and main.  Show login.  Also blank the username and password
   // fields.
   $ ('#register_qqs_user').hide ();
   $ ('#register_qqs_main').hide ();
   $ ('#register_qqs_login').show ();
   $ ('#qwizzled_username').val ('').focus ();
   $ ('#qwizzled_password').val ('');
}


// -----------------------------------------------------------------------------
var jjax = function (qname, dest, data) {

   // Add script to this page -- sends/receives via src=.
   // Set head if not initialized.
   if (! head) {
      head = document.getElementsByTagName ('head')[0];
   }

   // Several different script IDs, in case calls in too-quick succession.
   jjax_script_no++;
   jjax_script_no = jjax_script_no % 5;

   // Delete previous script with same ID, if there.
   var script_id = 'jjax' + jjax_script_no;
   var script = document.getElementById (script_id);
   if (script) {
      try {
         head.removeChild (script);
      } catch (e) {
         console.log ('[jjax] script_id:', script_id, ', script:', script);
      }
   }
   var script = document.createElement ('script');
   script.id = script_id;
   script.setAttribute ('charset', 'utf-8');

   // Always send qname.
   var send_data = '?';
   if (data) {
      for (var property in data) {
         send_data += property + '=' + encodeURIComponent (data[property]) + '&'
      }
   }
   send_data += 'qname=' + qname;

   // Add something unique each time, so IE will re-retrieve javascript!
   var msec = new Date ().getTime();
   send_data += '&msec=' + msec;

   // Send session id, if set.
   if (typeof (document_qwiz_session_id) != 'undefined') {
      send_data += '&qwiz_session_id=' + encodeURIComponent (document_qwiz_session_id);
   }

   var local_server_loc;
   if (dest == 'maker_login') {
      local_server_loc = qwizzled_params.secure_server_loc;
   } else {
      local_server_loc = qwizzled_params.server_loc;
   }
   script.src = local_server_loc + '/' + dest + '.php' + send_data;
   if (debug[0]) {
      console.log ('[jjax] data:', data);
      console.log ('[jjax] script.src:', script.src);
   }

   head.appendChild (script);
}


// -----------------------------------------------------------------------------
var get_attr = function (htm, attr_name) {

   var attr_value = '';

   // get_attr () is always preceded by replace_smart_quotes (), so can just
   // handle regular quotes.
   var attr_re = new RegExp ('\\s' + attr_name + '\\s*=\\s*("([^"]+)")*', 'm');
   var attr_match = htm.match (attr_re);
   if (attr_match) {
      if (attr_match[2]) {
         attr_value = trim (attr_match[2]);
      }
   }

   return attr_value;
}


// -----------------------------------------------------------------------------
var replace_smart_quotes = function (string) {
   var new_string = string.replace (/[\u201C\u201D\u2033]/gm, '"');

   return new_string;
}


var number_word = [T ('zero'), T ('one'), T ('two'), T ('three'), T ('four'), T ('five'), T ('six'), T ('seven'), T ('eight'), T ('nine'), T ('ten')];
// -----------------------------------------------------------------------------
function number_to_word (number) {
   var word;
   if (number > 10) {
      word = number;
   } else {
      word = number_word[number];
   }

   return word;
}


// -----------------------------------------------------------------------------
function plural (word, plural_word, n) {
   var new_word;
   if (n == 1) {
      new_word = word;
   } else {
      new_word = plural_word;
   }

   return T (new_word);
}


// -----------------------------------------------------------------------------
function T (string) {

   //DKTMP
   //var string = tinymce.translate (string);

   return string;
}


// -----------------------------------------------------------------------------
// Current system seconds as unique ID.
function time_id () {
   var now = new Date ();
   var now_millisec = now.getTime ();
   return parseInt (now_millisec / 1000.0, 10);
}


// -----------------------------------------------------------------------------
function addSlashes (str) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace (/\n/g, '\\n').replace(/\u0000/g, '\\0');
}


// -----------------------------------------------------------------------------
function get_qwiz_param (key, default_value) {

   var value = '';
   if (typeof (qwiz_params) != 'undefined') {
      if (typeof (qwiz_params[key]) != 'undefined') {
         value = qwiz_params[key];
      }
   } else if (typeof (qwizzled_params) != 'undefined') {
      if (typeof (qwizzled_params[key]) != 'undefined') {
         value = qwizzled_params[key];
      }
   }
   if (! value) {

      // qwiz_params object or key not present.  Return default value, if
      // given, or ''.
      if (default_value != undefined) {
         value = default_value;
      }
   }

   return value;
}

// -----------------------------------------------------------------------------
// IE 8 does not have trim () method for strings.
function trim (s) {
   if ('a'.trim) {
      s = s.trim ();
   } else {
      s = s.replace (/^\s+|\s+$/g, '');
   }

   return s;
}


// =============================================================================
// Close - isolate namespace.
};


// -----------------------------------------------------------------------------
qwizzledf.call (qwizzled);


// =============================================================================
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

// =============================================================================
/*
Usage: CryptoJS.SHA3 ('text');

CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(v,p){var d={},u=d.lib={},r=function(){},f=u.Base={extend:function(a){r.prototype=this;var b=new r;a&&b.mixIn(a);b.hasOwnProperty("init")||(b.init=function(){b.$super.init.apply(this,arguments)});b.init.prototype=b;b.$super=this;return b},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
s=u.WordArray=f.extend({init:function(a,b){a=this.words=a||[];this.sigBytes=b!=p?b:4*a.length},toString:function(a){return(a||y).stringify(this)},concat:function(a){var b=this.words,c=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var n=0;n<a;n++)b[j+n>>>2]|=(c[n>>>2]>>>24-8*(n%4)&255)<<24-8*((j+n)%4);else if(65535<c.length)for(n=0;n<a;n+=4)b[j+n>>>2]=c[n>>>2];else b.push.apply(b,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<
32-8*(b%4);a.length=v.ceil(b/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],c=0;c<a;c+=4)b.push(4294967296*v.random()|0);return new s.init(b,a)}}),x=d.enc={},y=x.Hex={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],j=0;j<a;j++){var n=b[j>>>2]>>>24-8*(j%4)&255;c.push((n>>>4).toString(16));c.push((n&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],j=0;j<b;j+=2)c[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new s.init(c,b/2)}},e=x.Latin1={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],j=0;j<a;j++)c.push(String.fromCharCode(b[j>>>2]>>>24-8*(j%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],j=0;j<b;j++)c[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new s.init(c,b)}},q=x.Utf8={stringify:function(a){try{return decodeURIComponent(escape(e.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return e.parse(unescape(encodeURIComponent(a)))}},
t=u.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new s.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=q.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,j=b.sigBytes,n=this.blockSize,e=j/(4*n),e=a?v.ceil(e):v.max((e|0)-this._minBufferSize,0);a=e*n;j=v.min(4*a,j);if(a){for(var f=0;f<a;f+=n)this._doProcessBlock(c,f);f=c.splice(0,a);b.sigBytes-=j}return new s.init(f,j)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});u.Hasher=t.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){t.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,c){return(new a.init(c)).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return(new w.HMAC.init(a,
c)).finalize(b)}}});var w=d.algo={};return d}(Math);
(function(v){var p=CryptoJS,d=p.lib,u=d.Base,r=d.WordArray,p=p.x64={};p.Word=u.extend({init:function(f,s){this.high=f;this.low=s}});p.WordArray=u.extend({init:function(f,s){f=this.words=f||[];this.sigBytes=s!=v?s:8*f.length},toX32:function(){for(var f=this.words,s=f.length,d=[],p=0;p<s;p++){var e=f[p];d.push(e.high);d.push(e.low)}return r.create(d,this.sigBytes)},clone:function(){for(var f=u.clone.call(this),d=f.words=this.words.slice(0),p=d.length,r=0;r<p;r++)d[r]=d[r].clone();return f}})})();
(function(v){for(var p=CryptoJS,d=p.lib,u=d.WordArray,r=d.Hasher,f=p.x64.Word,d=p.algo,s=[],x=[],y=[],e=1,q=0,t=0;24>t;t++){s[e+5*q]=(t+1)*(t+2)/2%64;var w=(2*e+3*q)%5,e=q%5,q=w}for(e=0;5>e;e++)for(q=0;5>q;q++)x[e+5*q]=q+5*((2*e+3*q)%5);e=1;for(q=0;24>q;q++){for(var a=w=t=0;7>a;a++){if(e&1){var b=(1<<a)-1;32>b?w^=1<<b:t^=1<<b-32}e=e&128?e<<1^113:e<<1}y[q]=f.create(t,w)}for(var c=[],e=0;25>e;e++)c[e]=f.create();d=d.SHA3=r.extend({cfg:r.cfg.extend({outputLength:512}),_doReset:function(){for(var a=this._state=
[],b=0;25>b;b++)a[b]=new f.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(a,b){for(var e=this._state,f=this.blockSize/2,h=0;h<f;h++){var l=a[b+2*h],m=a[b+2*h+1],l=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360,m=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360,g=e[h];g.high^=m;g.low^=l}for(f=0;24>f;f++){for(h=0;5>h;h++){for(var d=l=0,k=0;5>k;k++)g=e[h+5*k],l^=g.high,d^=g.low;g=c[h];g.high=l;g.low=d}for(h=0;5>h;h++){g=c[(h+4)%5];l=c[(h+1)%5];m=l.high;k=l.low;l=g.high^
(m<<1|k>>>31);d=g.low^(k<<1|m>>>31);for(k=0;5>k;k++)g=e[h+5*k],g.high^=l,g.low^=d}for(m=1;25>m;m++)g=e[m],h=g.high,g=g.low,k=s[m],32>k?(l=h<<k|g>>>32-k,d=g<<k|h>>>32-k):(l=g<<k-32|h>>>64-k,d=h<<k-32|g>>>64-k),g=c[x[m]],g.high=l,g.low=d;g=c[0];h=e[0];g.high=h.high;g.low=h.low;for(h=0;5>h;h++)for(k=0;5>k;k++)m=h+5*k,g=e[m],l=c[m],m=c[(h+1)%5+5*k],d=c[(h+2)%5+5*k],g.high=l.high^~m.high&d.high,g.low=l.low^~m.low&d.low;g=e[0];h=y[f];g.high^=h.high;g.low^=h.low}},_doFinalize:function(){var a=this._data,
b=a.words,c=8*a.sigBytes,e=32*this.blockSize;b[c>>>5]|=1<<24-c%32;b[(v.ceil((c+1)/e)*e>>>5)-1]|=128;a.sigBytes=4*b.length;this._process();for(var a=this._state,b=this.cfg.outputLength/8,c=b/8,e=[],h=0;h<c;h++){var d=a[h],f=d.high,d=d.low,f=(f<<8|f>>>24)&16711935|(f<<24|f>>>8)&4278255360,d=(d<<8|d>>>24)&16711935|(d<<24|d>>>8)&4278255360;e.push(d);e.push(f)}return new u.init(e,b)},clone:function(){for(var a=r.clone.call(this),b=a._state=this._state.slice(0),c=0;25>c;c++)b[c]=b[c].clone();return a}});
p.SHA3=r._createHelper(d);p.HmacSHA3=r._createHmacHelper(d)})(Math);

