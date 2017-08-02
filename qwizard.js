// Isolate namespace.
qwizard = {};
var qwizard_f = function () {

// Check jQuery presence.
if (typeof (jQuery) == 'undefined') {
   alert ('jQuery JavaScript library not loaded.  Use Settings > Qwizcards > Force jQuery load\n'
          + 'to enable quizzes and flashcards');
}

var $ = jQuery;

var qw = this;
var qwname = 'qwizard';
var qqc;

// Publicly available.
this.questions_cards = [];
this.errmsgs = '';

this.unit_names  = [];
this.topic_names = [];

this.no_remove_placeholder_f = false;

// Globals, private to qwizard.
var debug = [];
debug[0]  = false;     // General.
debug[1]  = false;     // Existing quiz/deck data.
debug[2]  = false;     // Questions list ("Go to...").

var qwiz_deck;
var start_modal_first_call_f = true;

var $dialog_qwizard;
var $dialog_qwizard_media_upload;
var qwizard_upload_media_file_callback_routine;
var add_media_user_html_f;
var allowed_media = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'svg'];

var qwizzled_plugin_url;
var inline_ed_plugins;
var inline_ed_external_plugins;
var inline_ed_toolbar1;
var inline_ed_toolbar2;
var inline_ed_toolbar3;

var wp_editing_page_f      = false;
var qwizard_styles_added_b = false;
var qwizard_add_media_frame;
var current_editor = '';
var shortcode_ed = '';

var prevent_editor_blur_event_b = false;
var disable_add_media_timeout;

var new_qwiz_deck_f = false;
var qwizard_page = '';
var delay_go_to_question_i_question;
var delay_go_to_card_i_question;
var i_current_answer_choice;

var OPTIONS_ACCORDION   = 0;
var INTRO_ACCORDION     = 2;
var QUESTIONS_ACCORDION = 3;
var options_accordion_f = false;

var header_placeholder =   '<span class="qwizard_placeholder">'
                         +    'Header <span class="qwizard_smaller">double-click to format</span>'
                         + '</span>&hairsp;';
var intro_placeholder  =   '<span class="qwizard_placeholder">'
                         +    'Introduction'
                         +    '<br />'
                         +    '<span class="qwizard_smaller">'
                         +       '(enter text or &ldquo;Add Media&rdquo;; double-click to format)'
                         +    '</span>'
                         +    '<br />'
                         + '</span>&ensp;';
var show_me_button_placeholder 
                       =  '<span class="qwizard_placeholder" style="color: #ffff55; background: none;">'
                         +    'Show me the answer'
                         + '</span>&hairsp;';
var exit_placeholder =     '<span class="qwizard_placeholder">'
                         +    'Exit text'
                         +    '<br />'
                         +    '<span class="qwizard_smaller">'
                         +       '(enter text or &ldquo;Add Media&rdquo;; double-click to format)'
                         +    '</span>'
                         + '</span>&hairsp;';

var bstyles = ['dotted', 'dashed', 'solid'];
var bcolors = ['red', 'magenta', 'blue', 'aqua', 'black', 'silver'];
var n_bstyles = bstyles.length;
var n_bcolors = bcolors.length;

// Qwiz/deck data.
var i_qwiz          = 0;
var n_questions     = 0;
var i_question      = -1;
var header_text     = '';
var intro_text      = '';
var exit_text       = '';

var i_insert_before = -1;

var qwiz_deck_attributes = '';
var default_unit = '';

// -----------------------------------------------------------------------------
this.init_qwizard = function (wp_tinymce_ed) {
   if (debug[0]) {
      console.log ('[init_qwizard] wp_tinymce_ed:', wp_tinymce_ed);
   }

   // Need to define qwizzled_params if on qwizard.php rather than WordPress
   // editor.
   qw.set_qwizzled_plugin_url ();

   // If we're on WordPress editing page, get WordPress tinymce editor settings
   // (plugins, external plugins, toolbars) so qwizard tinymce inline editor has
   // same appearance.  Also, set flag that we're on WordPress editing page.
   if (wp_tinymce_ed) {
      inline_ed_plugins          = wp_tinymce_ed.settings.plugins;
      inline_ed_external_plugins = wp_tinymce_ed.settings.external_plugins;

      // Add bubbleBar.
      inline_ed_external_plugins.bubbleBar = qwizzled_plugin_url + 'tinymceBubbleBar.js';

      // Don't show "Q" icon for BubbleBar editing - delete button_q.
      inline_ed_toolbar1         = wp_tinymce_ed.settings.toolbar1.replace ('button_q,', '');
      inline_ed_toolbar2         = wp_tinymce_ed.settings.toolbar2;
      inline_ed_toolbar3         = wp_tinymce_ed.settings.toolbar3;

      wp_editing_page_f = true;
      qwizzled.wp_editing_page_f = true;
   } else {

      // Inline tinymce editor on regular page (not WordPress editing).
      qw.user_page_tinymce_options ();
      qwizzled.wp_editing_page_f = false;
   }
   if (debug[0]) {
      console.log ('[init_qwizard] wp_tinymce_ed:', wp_tinymce_ed);
      console.log ('[init_qwizard] inline_ed_plugins:', inline_ed_plugins);
      console.log ('[init_qwizard] inline_ed_external_plugins:', inline_ed_external_plugins);
      console.log ('[init_qwizard] inline_ed_toolbar1:', inline_ed_toolbar1);
      console.log ('[init_qwizard] inline_ed_toolbar2:', inline_ed_toolbar2);
      console.log ('[init_qwizard] inline_ed_toolbar3:', inline_ed_toolbar3);
   }

   // Add styles if not already done.
   if (! qwizard_styles_added_b) {
      qwizard_styles_added_b = true;
      add_style ();
   }

   // Container, initial questions/choices.
   qwizard_html ();

   // Put lists of quiz and deck components (header, intro, ...) into
   // appropriate divs.
   quiz_components_html ();

   // Put new-question options (multiple choice, show me, etc.) into appropriate
   // div (floating menu).
   new_question_type_menu_html ();

   // Make menus draggable.
   $ ('.qwizard_floating_menu').each (function () {
      $ (this).draggable ({handle:     $ (this).find ('.qwizard_floating_menu_header')[0]
                          });
   });
   accordion_panel_init ();
};


// -----------------------------------------------------------------------------
this.set_qwizzled_plugin_url = function () {
   qqc = qwiz_qcards_common;
   if (typeof (qwizzled_params) != 'undefined') {

      // WordPress editor - qwizzled_params object defined by admin_head script.
      qwizzled_plugin_url = qwizzled_params.url;
      if (debug[0]) {
         console.log ('[set_qwizzled_plugin_url] qwizzled_params.url:', qwizzled_params.url);
      }
   } else {

      // qwizard.php.
      qwizzled_plugin_url = qqc.get_qwiz_param ('url', './');
      if (debug[0]) {
         console.log ('[set_qwizzled_plugin_url > qqc.get_qwiz_param] qwizzled_plugin_url:', qwizzled_plugin_url);
      }
   }
}


// -----------------------------------------------------------------------------
this.user_page_tinymce_options = function () {

   //DKTMP autolink advlist link table
   inline_ed_plugins          = 'charmap colorpicker lists textcolor';
   inline_ed_external_plugins = { bubbleBar: qwizzled_plugin_url + 'tinymceBubbleBar.js',
                                  link:      qwizzled_plugin_url + 'link/plugin.min.js',
                                  table:     qwizzled_plugin_url + 'table/plugin.min.js'};
   inline_ed_toolbar1         = 'bold italic bullist numlist alignleft aligncenter alignright link table image bubbleBarOptionsButton';
   inline_ed_toolbar2         = 'formatselect fontselect fontsizeselect outdent indent';
   inline_ed_toolbar3         = 'forecolor backcolor subscript superscript removeformat charmap';
}


// -----------------------------------------------------------------------------
function accordion_panel_init () {

   // Apply accordion expand/collapse.  Start with questions panel open.
   $ ('div.qwizard_accordion').accordion ({collapsible: true,
                                           active:      QUESTIONS_ACCORDION,
                                           activate:    accordion_panel_open,
                                           heightStyle: 'content'
                                          });

   // Initialize color picker.
   $ ('#border_color').simpleColor ({boxWidth:  '50px',
                                     boxHeight: '17px',
                                     onSelect:  border_color_selected});

   // Set title.
   $ ('div.simpleColorDisplay').attr ('title', 'Click to select color');
}


// -----------------------------------------------------------------------------
function accordion_panel_open (e, ui) {
   var new_id = ui.newHeader.attr ('id');
   if (debug[0]) {
      console.log ('[accordion_panel_open] ui.newHeader:', ui.newHeader);
      console.log ('[accordion_panel_open] ui.newPanel:', ui.newPanel);
      console.log ('[accordion_panel_open] new_id:', new_id);
   }
   if (new_id != 'quiz_options') {
      qwizzled.exit_register_qqs ();
   }
   if (new_id != 'quiz_questions') {
      qw.hide_editing_menus ();
   }
   if (new_id == 'quiz_introduction') {

      // If "Show" radio button is checked, show intro in quiz window.
      var checked_b = $ ('input[name="qwiz_intro_yes_no"]').first ().prop ('checked');
      if (debug[0]) {
         console.log ('[accordion_panel_open] checked_b:', checked_b);
      }
      if (checked_b) {
         qw.hide_editing_menus ();
         if (qwiz_deck == 'qwiz') {
            qw.go_to_question (-1);
         } else {
            qw.go_to_card (-1);
         }
      }
   } else if (new_id == 'quiz_exit_text') {
      if (qwiz_deck == 'qwiz') {

         // Hide intro, other questions, progress, next button, menus,
         // show summary/exit.
         $ ('div.intro-qwiz' + i_qwiz).hide ();
         $ ('#qwizard_result div.qwizq').hide ();
         $ ('#qwizard_result progress-qwiz' + i_qwiz).hide ();
         $ ('#next_button-qwiz' + i_qwiz).hide ();
         qw.hide_editing_menus ();
         qwiz_.display_summary_and_exit (i_qwiz);
         qqc.select_placeholder ($ ('#qwiz_exit-qwiz' + i_qwiz));
      } else {
         qw.hide_editing_menus ();
         qcard_.done (i_qwiz);

         // Select placeholder, if there.
         qqc.select_placeholder ($ ('#qcard_front-part1-qdeck' + i_qwiz));
      }
         
      // Signal that we are on exit "question".
      i_question = n_questions;
   }
}


// -----------------------------------------------------------------------------
this.qwiz_header_yes_no = function (header_f) {
   var header_div_selector = '.header-qwiz' + i_qwiz;
   var $header_div = $ (header_div_selector);
   if (header_f) {

      // If header is all blank or "NA", reset to placeholder.  Take out tags.
      var header_wo_tags = header_text.replace (/<[^>]+>/gm, '');
      if (header_wo_tags.search (/\S/) == -1 || header_wo_tags == 'NA') {
         $header_div.html (header_placeholder);
      }
      $header_div.show ();
      qw.init_tinymce (header_div_selector);
      qqc.select_placeholder ($header_div);
   } else {
      $header_div.hide ();

      // Set up in case show again.
      $header_div.html (header_placeholder);
      init_remove_placeholder (header_div_selector);
   }
};


// -----------------------------------------------------------------------------
this.deck_header_yes_no = function (header_f) {
   var header_div_selector = '#qcard_header-qdeck' + i_qwiz;
   var $header_div = $ (header_div_selector);
   if (header_f) {

      // If header is all blank, reset to placeholder.  Take out tags.
      var header_wo_tags = header_text.replace (/<[^>]+>/gm, '');
      if (header_wo_tags.search (/\S/) == -1) {
         $header_div.html (header_placeholder);
      }
      $header_div.show ();
      qqc.select_placeholder ($header_div);
   } else {
      $header_div.hide ();
      header_text = '';
   }
}


// -----------------------------------------------------------------------------
this.recording_options = function () {

   // Open progress-recording-options menu.
   qwizzled.init_qwizzled_params ();
   qwizzled.add_style ();
   qwizzled.$edit_area = $ ('#qwizard_result');
   qwizzled.create_register_qqs_dialog_box ('#qwizard_result');

   qwizzled.qwiz_deck_attributes = qwiz_deck_attributes;
   qwizzled.qwiz_deck = qwiz_deck;
   qwizzled.register_qqs ('qq');
}


// -----------------------------------------------------------------------------
this.qwiz_random = function (true_false) {

   // Set qwiz or qdeck random= attribute.
   qwiz_deck_attributes = add_update_attributes (qwiz_deck_attributes, 'random', true_false);
}


// -----------------------------------------------------------------------------
this.qwiz_repeat = function (true_false) {

   // Set qwiz or qdeck repeat_incorrect= attribute.
   qwiz_deck_attributes = add_update_attributes (qwiz_deck_attributes, 'repeat_incorrect', true_false);
}


// -----------------------------------------------------------------------------
this.card_back_options = function (value) {

   // Default for all cards, for now.
   var $qcard_card_back = $ ('div.qcard_card-qdeck' + i_qwiz + ' div.qcard-back');
   if (value == 'none') {
      qwiz_deck_attributes = add_update_attributes (qwiz_deck_attributes, 'card_back', 'none');

      // Remove card_back_image= if there.
      qwiz_deck_attributes = add_update_attributes (qwiz_deck_attributes, 'card_back_image', 'rm');

      set_qwiz_deck_styles ('background', 'none', $qcard_card_back);
      qcard_.set_deckdata (i_qwiz, 'default_card_back_background', 'none');
   } else if (value == 'ruled lines') {

      // Remove both card_back= and card_back_image=
      qwiz_deck_attributes = add_update_attributes (qwiz_deck_attributes, 'card_back', 'rm');
      qwiz_deck_attributes = add_update_attributes (qwiz_deck_attributes, 'card_back_image', 'rm');
      set_qwiz_deck_styles ('background', qcard_.ruled_lines, $qcard_card_back);
      qcard_.set_deckdata (i_qwiz, 'default_card_back_background', '');
   }
}


// -----------------------------------------------------------------------------
this.align_options = function (left_center_right) {

   // Set qwiz or qdeck align= attribute.
   qwiz_deck_attributes = add_update_attributes (qwiz_deck_attributes, 'align', left_center_right);

   // Reset style of current display.
   var $qwiz_deck;
   if (qwiz_deck == 'qwiz') {
      $qwiz_deck = $ ('#qwiz' + i_qwiz);
   } else {
      $qwiz_deck = $ ('#qcard_window-qdeck' + i_qwiz);
      var qcard_width = $qwiz_deck.find ('div.qcard-front').outerWidth ();
      $qwiz_deck.width (qcard_width);
   }
   if (left_center_right == 'left') {
      $qwiz_deck.css ({'margin':       ''});
   } else if (left_center_right == 'center') {
      $qwiz_deck.css ({'margin':       'auto'});
   } else {
      $qwiz_deck.css ({'margin':       '',
                       'margin-left':  'auto'});
   }
}


// -----------------------------------------------------------------------------
this.set_expand_scroll = function (expand_scroll) {

   // Change to true/false (for scroll/expand).
   expand_scroll = expand_scroll == 'scroll';

   // Set qwiz or qdeck scroll= attribute.
   qwiz_deck_attributes = add_update_attributes (qwiz_deck_attributes, 'scroll', expand_scroll);

   // Redraw to match.
   if (qwiz_deck == 'qwiz') {
      // DKTMP...
   } else {
      qcard_.set_deckdata (i_qwiz, 'scroll_b', expand_scroll);
      redraw_qwiz_deck (i_question);
      options_accordion_f = true;
      setTimeout ('options_accordion_f = false', 500);
   }
}


// -----------------------------------------------------------------------------
function border_color_selected (hex) {
   if (debug[0]) {
      console.log ('[border_color_selected] hex:', hex);
   }
   var value = '#' + hex;
   qwiz_deck_attributes = update_add_style (qwiz_deck_attributes,
                                            'border-color', value);

   // Set style of current display.
   set_qwiz_deck_styles ('border-color', value);
}


// -----------------------------------------------------------------------------
this.qwiz_deck_style = function (property, value) {
   if (property == 'width' || property == 'min-height') {

      var ipx = parseInt (value);
      if (isNaN (ipx)) {
         alert ('Please enter a number');
         return;
      }
      value = value + 'px';
   }
   qwiz_deck_attributes = update_add_style (qwiz_deck_attributes, property, value);

   // Set styles of current display.
   set_qwiz_deck_styles (property, value);
}


// -----------------------------------------------------------------------------
function set_qwiz_deck_styles (property, value, $element) {

   // Reset style attribute of current display (use jQuery attr () rather than
   // css () on particular property -- css () doesn't handle "!important".
   if (! $element) {
      if (qwiz_deck == 'qwiz') {
         $element = $ ('#qwiz' + i_qwiz);
      } else {
         if (property == 'width' || property == 'min-height') {
            $element = $ ('div#qcard_window-qdeck' + i_qwiz + ' div.qcard-front-back');
            if (property == 'width') {
               qcard_.set_deckdata (i_qwiz, 'card_width_setting', value);
            } else {
               qcard_.set_deckdata (i_qwiz, 'card_height_setting', value);
            }
            qcard_.set_container_width_height (i_qwiz);
         } else {
            $element = $ ('div.qcard_card-qdeck' + i_qwiz + ' div.qcard-front-back');
         }
      }
   }

   // Get current style attribute.
   var styles = $element.attr ('style');
   if (typeof (styles) == 'undefined') {
      styles = 'style="' + property + ': ' + value + ' !important;"';
   } else {

      // Update or add property with new value.
      styles = 'style="' + styles + '"';
      styles = update_add_style (styles, property, value);
   }

   // style="
   // 0----+-
   var len = styles.length;
   $element.attr ('style', styles.substring (7, len-1));
}


// -----------------------------------------------------------------------------
function update_add_style (attributes, property, value) {

   // If style= attribute is there, update; otherwise add.  Get properties and
   // values inside double quotes.
   var m = attributes.match (/style\s*=\s*"([^"]*)/);
   var new_property_and_value = ' ' + property + ': ' + value + ' !important;';
   if (m) {

      // Style attribute is there.  Look for property and value, including
      // (optional) "!important".
      var styles = m[1];
      var re = new RegExp ('\\s*' + property + '\\s*:\\s*([^\\s;]+(\\s*!important)*)\\s*;*');
      var property_and_value_m = styles.match (re);
      if (property_and_value_m) {

         // Property and old value are there.  Replace.
         attributes = attributes.replace (re, new_property_and_value + ' ');
      } else {

         // Not there.  Add to styles at end. 
         attributes = attributes.replace (styles, styles + new_property_and_value);
      }
   } else {

      // No style= attribute.  Add to end of attributes.
      attributes += ' style="' + new_property_and_value.substr (1) + '"';
   }
   if (debug[0]) {
      console.log ('[update_add_style] attributes:', attributes);
   }

   return attributes;
}


// -----------------------------------------------------------------------------
this.qwiz_intro_yes_no = function (intro_f) {
   var intro_div_selector = 'div.intro-qwiz' + i_qwiz;
   var $intro_div = $ (intro_div_selector);
   if (intro_f) {
      qwiz_.no_intro_b[i_qwiz] = false;
      qw.go_to_question (-1, true);
   } else {
      qwiz_.no_intro_b[i_qwiz] = true;
      intro_text = '';
      $intro_div.hide ();

      // Set up in case show again.
      $intro_div.html (intro_placeholder);
      init_remove_placeholder (intro_div_selector);

      // Hide all questions, hide summary/exit, show the first.
      $ ('#qwizard_result div.qwizq').hide ();
      $ ('#qwizard_result #summary-qwiz' + i_qwiz).hide ();
      qwiz_.set_qwizdata (i_qwiz, 'i_question', -1);
      qwiz_.next_question (i_qwiz);

      // Change in intro seems to trigger tooltips.  Close them.
      close_tooltips ();
   }
};


// -----------------------------------------------------------------------------
this.deck_intro_yes_no = function (intro_f) {
   if (intro_f) {
      qcard_.no_intro_b[i_qwiz] = false;
      if (intro_text == '') {
         intro_text =   intro_placeholder
                      + '[start] &emsp;';
      }
      qw.go_to_card (-1);
   } else {
      qcard_.no_intro_b[i_qwiz] = true;
      intro_text = '';
      qw.go_to_card (0);
   }
}


// -----------------------------------------------------------------------------
this.quiz_restart_yes_no = function (restart_button_f) {
   var exit_html;
   if (restart_button_f) {

      // Add if not there.
      if (exit_text.indexOf ('[restart]') == -1) {
         exit_html = exit_text + restart_quiz_button_html () + ' &nbsp; &nbsp;';
         exit_text = exit_text + '[restart]';
      }
   } else {

      // Delete either shortcode or button html.
      exit_text = exit_text.replace (/\[restart\]/, '');
      exit_text = exit_text.replace (/<button[\s\S]*?<\/button>/g, '');
      exit_html = exit_text;
   }
   $ ('#qwiz_exit-qwiz' + i_qwiz).html (exit_html);
};


// -----------------------------------------------------------------------------
this.deck_restart_yes_no = function (restart_button_f) {
   if (restart_button_f) {

      // Add if not there.
      if (exit_text.indexOf ('[restart]') == -1) {
         exit_text += '<br />[restart]';
         $ ('#qcard_front-input-qdeck' + i_qwiz).html (restart_deck_button_html ());
      }
   } else {
      exit_text = exit_text.replace (/\[restart\]/, '');
      $ ('#qcard_front-input-qdeck' + i_qwiz).html ('');
   }
};


// -----------------------------------------------------------------------------
function show_intro ($intro_div, no_intro_b) {

   // If intro is all whitespace, reset to placeholder.  Take out tags.
   var intro_wo_tags = intro_text.replace (/<[^>]+>/gm, '');
   if (intro_wo_tags.search (/\S/) == -1) {
      $intro_div.html (intro_placeholder);

      // Initialize editor if not active.
      if (! $intro_div.attr ('contenteditable')) {
         qw.init_tinymce ('div.intro-qwiz' + i_qwiz);
      }
   }

   // Set up so next question will be the first, and indicate we're on intro.
   qwiz_.set_qwizdata (i_qwiz, 'i_question', -1);
   i_question = -1;

   // Close any leftover menus.
   qw.hide_editing_menus ();

   // Hide all questions and summary/exit, reset the next button to centered
   // "Start quiz".
   $ ('#qwizard_result div.qwizq').hide ();
   $ ('#qwizard_result #summary-qwiz' + i_qwiz).hide ();
   $ ('#next_button-qwiz' + i_qwiz).css ('text-align', 'center').show ();
   $ ('#next_button_text-qwiz' + i_qwiz).html ('Start');

   // Set progress.
   qwiz_.display_progress (i_qwiz, false);

   if (no_intro_b) {
      $intro_div.hide ();
   } else {
      $intro_div.show ();

      // Select placeholder if there.
      qqc.select_placeholder ($ ('div.intro-qwiz' + i_qwiz));
   }
}


// -----------------------------------------------------------------------------
this.init_tinymce = function (edit_div_selector, edit_shortcodes_f) {
   /*
   var external_plugins = qwizzled_plugin_url + 'tinymce_external_plugins/';
   var advlist = external_plugins + 'advlist/plugin.min.js';
   var table   = external_plugins + 'table/plugin.min.js';
   */
   if (debug[0]) {
      console.log ('[init_tinymce] edit_div_selector:', edit_div_selector);
   }

   tinymce.init ({
      selector:                  edit_div_selector,
      browser_spellcheck:        true,
      convert_urls:              false,
      external_plugins:          inline_ed_external_plugins,
      image_advtab:              true,
      inline:                    true,
      fixed_toolbar_container:   '#bubbleBarWrapper',
      //forced_root_block:         'p',
      forced_root_block:         false,
      menubar:                   false,
      paste_data_images:         true,
      plugins:                   [inline_ed_plugins],
      setup:                     function (editor) {
                                    editor.on ('focus', function (focus_obj) {

                                       // Save current editor.  Cancel timeout
                                       // if just blurred an editor.
                                       clearTimeout (disable_add_media_timeout);
                                       current_editor = editor;

                                       // Enable "Add Media" button.
                                       $ ('button.qwizard_add_media').removeAttr ('disabled');
                                       if (qwiz_deck == 'qwiz') {

                                          // Disable tooltip (if any) while editing.
                                          /* DEDRAG
                                          var $target = $ (focus_obj.target.targetElm);
                                          if ($target.tooltip ('instance')) {
                                             if (debug[0]) {
                                                console.log ('[editor onfocus] disable tooltip');
                                             }
                                             $target.tooltip ('disable');
                                          }
                                          */

                                          // If this is a multiple-choice answer
                                          // choice, highlight, and activate
                                          // menu options.
                                          if ($ (focus_obj.target.targetElm).hasClass ('qwiz-choice')) {
                                             answer_choice_focus (focus_obj.target.targetElm);
                                          }
                                       }

                                       // If user-page user html, make sure
                                       // bubblebar is below edit div.
                                       var $edit_div  = $ (edit_div_selector);
                                       if ($edit_div.attr ('id') == 'user_html') {
                                          setTimeout (function () {
                                             var $bubblebar = $ ('div.mce-tinymce-inline.mce-floatpanel');
                                             var bubblebar_top = $bubblebar.position ().top;
                                             var edit_div_bot  = $edit_div.position ().top + $edit_div.outerHeight ();

                                             // Need to subtract effect of 
                                             // mce-floatpanel transform
                                             // > translate.
                                             if (bubblebar_top < edit_div_bot + 5) {
                                                $bubblebar.css ({top: edit_div_bot - 35 + 'px'});
                                             }
                                          }, 200);
                                       }
                                    });

                                    if (! edit_shortcodes_f) {
                                       editor.on ('blur', function (blur_obj) {

                                          // Disable "Add Media" button after
                                          // delay (delay in case reason for
                                          // blur is hitting "Add Media"!).
                                          // Keep enabled on labeled diagram.
                                          if (   i_question < 0 
                                              || i_question >= n_questions
                                              || qw.questions_cards[i_question].type
                                                              != 'labeled_diagram') {
                                             // ...................................
                                             var delay_disable = function () {
                                                if (debug[0]) {
                                                   console.log ('[editor blur > delay_disable] current_editor:', current_editor);
                                                }
                                                if (prevent_editor_blur_event_b) {
                                                   prevent_editor_blur_event_b = false;
                                                } else {
                                                   current_editor = '';
                                                   $ ('button.qwizard_add_media').attr ('disabled', true);
                                                }
                                             }
                                             // ...................................
                                             disable_add_media_timeout
                                                = setTimeout (delay_disable, 250);

                                          }

                                          if (debug[0]) {
                                             console.log ('[editor.on (blur)] blur_obj:', blur_obj);
                                          }
                                          if (qwiz_deck == 'qwiz') {
                                             qwiz_editing_field_blur (blur_obj.target.targetElm);
                                          } else {
                                             deck_editing_field_blur (blur_obj.target.targetElm);
                                          }
                                       });

                                       // Set up to remove placeholder span when
                                       // click on edit field.
                                       editor.on ('init', function (init_obj) {
                                          init_remove_placeholder (init_obj.target.targetElm);
                                       });
                                    }
                                 },
      toolbar1:                  inline_ed_toolbar1,
      toolbar2:                  inline_ed_toolbar2,
      toolbar3:                  inline_ed_toolbar3,
   });
}


// -----------------------------------------------------------------------------
function init_remove_placeholder (edit_selector) {
   if (debug[0]) {
      console.log ('[init_remove_placeholder] edit_selector:', edit_selector);
      console.log ('[init_remove_placeholder] edit_selector.innerHTML:', edit_selector.innerHTML);
   }
   var htm = edit_selector.innerHTML;
   if (htm.indexOf ('qwizard_placeholder') != -1) {
      var $edit_elm = $ (edit_selector);
      var replace_w_space_b = edit_selector.tagName.toLowerCase () == 'span';
      $edit_elm.on ('click keydown', function (e) {
                                qw.remove_placeholder (e, $edit_elm, replace_w_space_b);
                             });
   }
}


// -----------------------------------------------------------------------------
this.remove_placeholder = function (e, $edit_elm, replace_w_space_b) {
   if (debug[0]) {
      console.log ('[remove_placeholder)] e:', e);
      console.log ('[remove_placeholder)] $edit_elm:', $edit_elm);
      console.log ('[remove_placeholder)] $edit_elm[0].innerHTML:', $edit_elm[0].innerHTML);
   }

   // Possibly set in qwizzled.js.
   if (qw.no_remove_placeholder_f) {
      qw.no_remove_placeholder_f = false;
      return;
   }

   // Ignore non-printing characters (DEL seems OK).
   if (! e || (e.metaKey || e.keyCode && e.keyCode < 32)) {
      return;
   }

   // Don't do again.
   $edit_elm.off ('keydown').off ('click');

   if ($edit_elm.text ().indexOf ('Show me the answer') != -1) {
      $edit_elm.find ('span.qwizard_placeholder').replaceWith ('Show me the answer');
   } else if (replace_w_space_b) {
      $edit_elm.find ('span.qwizard_placeholder').remove ();
   } else {
      $edit_elm.find ('span.qwizard_placeholder').remove ();
   }
   if (e.type != 'click') {

      // Just started typing with initially-selected text
      // (qqc.select_placeholder ()).  Undo TinyMCE's (apparent) transfer of
      // placeholder text color and background to new text, but first need to
      // wait a moment to let TinyMCE do that.  Then see if
      // <font color="#808080"> and/or <span style="background-color: 
      // rgb(255, 255, 85);" (matching qwizard_placeholder style gray and
      // #ffff55) are there.
      var delay_undo = function () {
         var $font = $edit_elm.find ('font');
         if (debug[0]) {
            console.log ('[delay_undo] $edit_elm.html ():', $edit_elm.html ());
            console.log ('[delay_undo] $font:', $font);
         }
         if ($font.length) {
            var color = $font.attr ('color');
            if (color == '#808080') {
               var htm = $font.html ();
               $font.replaceWith (htm);
            }
         }
         var $span = $edit_elm.find ('span').first ();
         if ($span.length) {
            var style = $span.attr ('style');
            if (style && style.search (/rgb.+?255.+?255.+?85/) != -1) {
               var htm = $span.html ();
               $span.replaceWith (htm);
            }
         }

         // Move cursor after tags and any entered characters.
         var id = $edit_elm.attr ('id');
         var ed = tinyMCE.get (id);
         var selection = ed.selection;
         selection.select (ed.getBody ());
         var node = selection.getNode ();
         if (debug[0]) {
            console.log ('[delay_undo] ed.getBody ():', ed.getBody ());
            console.log ('[delay_undo] selection.getContent ():', selection.getContent ());
            console.log ('[delay_undo] node:', node);
         }
         function getTextNodes (node, nodeType, result) {

            var children = node.childNodes;
            var nodeType = nodeType ? nodeType : 3;

            var result = !result ? [] : result;
            if (node.nodeType == nodeType) {
               result.push (node);
            }

            for (var i=0; i<children.length; i++) {
               result = getTextNodes (children[i], nodeType, result);
            }

            return result;
         };

         // get all Textnodes from lastchild, calc length
         var textnodes = getTextNodes(ed.getBody().lastChild);
         if (debug[0]) {
            console.log ('[delay_undo] textnodes:', textnodes);
         }
         if (textnodes.length) {

            // Set Cursor to last non-blank position.
            var last_textnode = textnodes[textnodes.length-1];
            var last_textnode_content = last_textnode.textContent;
            if (debug[0]) {
               console.log ('[delay_undo] last_textnode_content:', last_textnode_content);
            }

            // Delete trailing whitespace.
            var non_blank = last_textnode_content.replace (/\s*?$/, '');
            ed.selection.setCursorLocation(last_textnode, non_blank.length );
         } else {
            selection.setCursorLocation (node, 1);
         }
      };
      setTimeout (delay_undo, 200);
   }
}


// -----------------------------------------------------------------------------
function qwiz_editing_field_blur (edit_el) {
   if (debug[0]) {
      console.log ('[qwiz_editing_field_blur] edit_el:', edit_el);
      console.log ('[qwiz_editing_field_blur] i_question:', i_question);
   }
   var $edit_obj = $ (edit_el);

   /* DEDRAG
   // Re-enable tooltip, if any.
   if ($edit_obj.tooltip ('instance')) {
      $edit_obj.tooltip ('enable');
   }

   // If label, re-enable dragging and reset cursor.
   if ($edit_obj.hasClass ('qwizzled_highlight_label')) {
      $edit_obj.parents ('div.qwizzled_label').draggable ('enable');
      $edit_obj.css ({cursor: 'move'});
   }
   */

   // If WordPress embed editing, hide editor toolbar and "clipboard", if
   // showing.
   //$edit_obj.find ('div.mce-toolbar-grp.mce-arrow-down').hide ();
   //$edit_obj.find ('div.wpview-clipboard').hide ();
   $ ('div.mce-toolbar-grp.mce-arrow-down').hide ();
   $ ('div.wpview-clipboard').hide ();

   // See which field, update data arrays.  Classes are defined in qwiz.js.
   var new_html = trim ($edit_obj.html ());

   // If we're on WordPress editing page, see if there are any embed-code
   // candidates, process via ajax call -- callback is qwiz_editing_field_blur2 ().
   // UNNECESSARY - WordPress detects changes and does processing; keeping in
   // two parts in case needed in some (future) case.
   /*
   if (wp_editing_page_f) {
      new_html = process_embeds (edit_el, new_html);
   } else {
      qwiz_editing_field_blur2 (edit_el, new_html);
   }
   */
   qwiz_editing_field_blur2 (edit_el, new_html);
}


// -----------------------------------------------------------------------------
function qwiz_editing_field_blur2 (edit_el, new_html) {
   if (debug[0]) {
      console.log ('[qwiz_editing_field_blur2] new_html:', new_html);
   }
   var $edit_obj = $ (edit_el);

   // If embed codes have been processed (by WordPress) into sets of divs for
   // editing, save only the embed shortcodes.
   $edit_obj.find ('div.wpview-wrap').each (function () {
      var div_html = $ (this)[0].outerHTML;
      if (debug[0]) {
         console.log ('[qwiz_editing_field_blur2] div_html:', div_html);
      }
      var m = div_html.match (/\[(audio|video) src="[^\]]+\]/);
      if (m) {
         var embed_shortcode = m[0];
         new_html = new_html.replace (div_html, embed_shortcode);
      } else {

         // Shouldn't happen.  Save whole thing.
         console.log ('[qwiz_editing_field_blur2 > no shortcode] div_html:', div_html);
      }
   });

   if ($edit_obj.hasClass ('qwiz-header')) {
      header_text = new_html;

   } else if ($edit_obj.hasClass ('user_html')) {

      // Save to db -- user_page table via function in user_page_begin.php.
      update_user_page (new_html, 'user');

   } else if ($edit_obj.hasClass ('instructor_feedback')) {

      // Save to db -- user_page table via function in user_page_begin.php.
      update_user_page (new_html, 'instructor');

   } else if ($edit_obj.hasClass ('qwiz-intro')) {
      intro_text = new_html;

   } else if ($edit_obj.hasClass ('qwiz-exit')) {

      // Change "Take quiz again" button back to [restart] shortcode.
      exit_text = new_html.replace (/<button[\s\S]*?<\/button>/, '[restart]');

   } else {

      // Avoid any problems with global i_question getting changed (perhaps by
      // reorder_questions_cards ()?) before this processing done -- get 
      // ii_question from container div.
      var qwizq_id = $edit_obj.parents ('div.qwizq').attr ('id');
      var m = qwizq_id.match (/-q[0-9]+/);
      var ii_question = parseInt (m[0].substr (2));
      if (debug[0]) {
         console.log ('[qwiz_editing_field_blur2] ii_question:', ii_question);
      }

      if ($edit_obj.hasClass ('qwizzled_canvas')) {

         // Qwizzled question.  If any labels have been placed -- in a target --
         // don't include them in the saved HTML.  Use jQuery to help with this
         // processing.  COMMENTED OUT: labels in wizard have been made non-
         // draggable.
         /*
         $edit_obj.find ('div.qwizzled_target div.qwizzled_label').each (function () {
            var label_outer_html = $ (this)[0].outerHTML;
            new_html = new_html.replace (label_outer_html, '');
            if (debug[0]) {
               console.log ('[qwiz_editing_field_blur2] (remove placed label) new_html:', new_html);
            }
         });
         */

         // Preface the inner HTML with canvas div and "[q]" shortcode, end with
         // closing div.
         var preface = '<div class="qwizzled_canvas qwiz_editable qwiz-question">[q]';
         qw.questions_cards[ii_question].question_text = preface + new_html + '</div>';

         // Also update Questions accordion panel label if something besides
         // whitespace and non-breaking space.
         update_question_accordion_label (new_html, ii_question);

      } else if ($edit_obj.hasClass ('qwiz-question')) {
         var textentry_hangman = '';
         if ($edit_obj.hasClass ('qwiz-question-textentry')) {
            textentry_hangman = '[textentry';
         } else if ($edit_obj.hasClass ('qwiz-question-hangman')) {
            textentry_hangman = '[hangman';
         }
         if (textentry_hangman) {
            var question_text = qw.questions_cards[ii_question].question_text; 
            if ($edit_obj.hasClass ('qwiz-part1')) {
               new_html = question_text.replace (/[\s\S]*\[(textentry|hangman)/, new_html + textentry_hangman); 
            } else {
               var m = question_text.match (/\[(textentry|hangman)[^\]]*\]/);
               if (m) {
                  textentry_hangman = m[0];
                  new_html = question_text.replace (/\[(textentry|hangman)[^\]]*\][\s\S]*/, textentry_hangman + new_html); 
               }
            }
         }
         qw.questions_cards[ii_question].question_text = new_html;

         // Also update Questions accordion panel label.
         update_question_accordion_label (new_html, ii_question);

         // If multiple choice question, and a question has been entered (that
         // is, it's not a placeholder), select first answer-choice if it is
         // still a placeholder.
         if (qw.questions_cards[ii_question].type == 'multiple_choice') {
            if (new_html.indexOf ('qwizard_placeholder') == -1) {
               var $choice = $ ('span.choices-qwiz' + i_qwiz + '-q0 span.qwiz-choice.qwiz_editable');
               qqc.select_placeholder ($choice);
            }
         }

      } else if ($edit_obj.hasClass ('qwiz-choice')) {
         var i_choice = $edit_obj.data ('i_choice');
         qw.questions_cards[ii_question].choices[i_choice] = new_html;

      } else if ($edit_obj.hasClass ('qwiz-feedback-span')) {
         var i_choice = $edit_obj.data ('i_choice');
         qw.questions_cards[ii_question].feedbacks[i_choice] = new_html;

      } else if ($edit_obj.hasClass ('qwizzled_highlight_label')) {

         // Get label index from parent's id (like "label-qwiz0-q0-a1").
         var i_label = label_from_parent_id ($edit_obj);

         // Get the full parent html (including div and span), but take out the id.
         var div_html = $edit_obj.parent ()[0].outerHTML;
         if (debug[0]) {
            console.log ('[qwiz_editing_field_blur2 > qwizzled_highlight_label] div_html:', div_html);
         }
         div_html = div_html.replace (/id="[^"]+" /, '');

         // Add the [l] shortcode at beginning of qwizzled_highlight_label span.
         div_html = div_html.replace (/<span[^>]+>/, '$&[l]');

         qw.questions_cards[ii_question].labels[i_label] = div_html;

         // If the label has been placed (copy in target), then update the placed
         // label with the inner HTML.
         var m = div_html.match (/qtarget_assoc([0-9]+)/);
         var assoc_id = m[1];
         var $placed_label = $ ('div.qtarget_assoc' + assoc_id + ' span.qwizzled_label_placed');
         if ($placed_label.length) {
            $placed_label.html ($edit_obj.html ());
         }

      } else if ($edit_obj.hasClass ('qwizzled-correct_feedback')) {
         var i_label = $edit_obj.data ('i_choice');
         qw.questions_cards[ii_question].feedback_corrects[i_label]
                               = label_correct_feedback_placeholder (i_label+1);

      } else if ($edit_obj.hasClass ('qwizzled-incorrect-feedback')) {
         var i_label = $edit_obj.data ('i_choice');
         qw.questions_cards[ii_question].feedback_incorrects[i_label]
                               = label_incorrect_feedback_placeholder (i_label+1);
      }
   }

   if (debug[0]) {
      if (ii_question >= 0 && ii_question < n_questions) {
         console.log ('[qwiz_editing_field_blur2] qw.questions_cards[ii_question]:', qw.questions_cards[ii_question]);
      }
   }
}


// -----------------------------------------------------------------------------
function deck_editing_field_blur (edit_el) {
   if (debug[0]) {
      console.log ('[deck_editing_field_blur] edit_el:', edit_el);
   }
   var $edit_obj = $ (edit_el);

   // If WordPress embed editing, hide editor toolbar and "clipboard", if
   // showing.
   //$edit_obj.find ('div.mce-toolbar-grp.mce-arrow-down').hide ();
   //$edit_obj.find ('div.wpview-clipboard').hide ();
   $ ('div.mce-toolbar-grp.mce-arrow-down').hide ();
   $ ('div.wpview-clipboard').hide ();

   // See which field, update data arrays.  Classes are defined in qwiz.js.
   var new_html = trim ($edit_obj.html ());

   deck_editing_field_blur2 (edit_el, new_html);
}


// -----------------------------------------------------------------------------
function deck_editing_field_blur2 (edit_el, new_html) {
   var $edit_obj = $ (edit_el);
   if (debug[0]) {
      console.log ('[deck_editing_field_blur2] new_html:', new_html);
      console.log ('[deck_editing_field_blur2] $edit_obj:', $edit_obj);
   }

   // If embed codes have been processed (by WordPress) into sets of divs for
   // editing, save only the embed shortcodes.
   $edit_obj.find ('div.wpview-wrap').each (function () {
      var div_html = $ (this)[0].outerHTML;
      if (debug[0]) {
         console.log ('[deck_editing_field_blur2] div_html:', div_html);
      }
      var m = div_html.match (/\[(audio|video) src="[^\]]+\]/);
      if (m) {
         var embed_shortcode = m[0];
         new_html = new_html.replace (div_html, embed_shortcode);
      } else {

         // Shouldn't happen.  Save whole thing.
         console.log ('[deck_editing_field_blur2 > no shortcode] div_html:', div_html);
      }
   });

   // Use current question.
   var ii_question = i_question;
   if (debug[0]) {
      console.log ('[deck_editing_field_blur2] ii_question:', ii_question);
   }
   if (typeof (ii_question) == 'undefined') {
      console.log ('[deck_editing_field_blur2] ii_question undefined; $edit_obj:', $edit_obj);
      return;
   }
   if ($edit_obj.hasClass ('qcard_header')) {
      header_text = new_html;

   } else if ($edit_obj.hasClass ('user_html')) {

      // Save to db -- user_page table via function in user_page_begin.php.
      update_user_page (new_html, 'user');

   } else if ($edit_obj.hasClass ('instructor_feedback')) {

      // Save to db -- user_page table via function in user_page_begin.php.
      // Get class name (base64 encoded).
      var b64_class_name = $edit_obj.data ('class_name');
      var class_name = atob (b64_class_name);
      update_user_page (new_html, 'instructor', class_name);

   } else if (ii_question == -1 || ii_question >= n_questions) {
      var part1 = $ ('#qcard_front-part1-qdeck' + i_qwiz).html ();
      var input = $ ('#qcard_front-input-qdeck' + i_qwiz).html ();
      var part2 = $ ('#qcard_front-part2-qdeck' + i_qwiz).html ();
      if (ii_question == -1) {
         intro_text = part1 + '[start]' + part2;
         qcard_.set_deckdata (i_qwiz, 'intro_html', part1 + input + part2);
      } else {
         var restart = input.indexOf ('qwiz_restart') != -1  ? '[restart]' : '';
         exit_text = part1 + restart + part2;
         if (debug[0]) {
            console.log ('[deck_editing_field_blur2] exit_text:', exit_text);
         }
         qcard_.set_deckdata (i_qwiz, 'exit_html', part1 + input + part2);
      }
   } else {
      var text;
      var front_b = $edit_obj.parents ('div.qcard-front').length != 0;
      if (front_b) {
         text = qw.questions_cards[ii_question].question_text; 
      } else {
         text = qw.questions_cards[ii_question].answer_text; 
      }

      var i_choice = '';
      if ($edit_obj.hasClass ('qcard-part1')) {
         i_choice = $edit_obj.data ('choice');
         if (debug[0]) {
            console.log ('[deck_editing_field_blur2] i_choice:', i_choice);
         }

         if (typeof (i_choice) == 'undefined') {
            i_choice = '';
         }
         if (i_choice === '') {

            // Part 1 - use field html to update question/answer BEFORE
            // [textentry].
            if (text && text.search (/\[(textentry|hangman)/) != -1) {
               new_html = text.replace (/[\s\S]*\[(textentry|hangman)/, new_html + '[\$1'); 
            }
         }
      } else {

         // Part 2 - update question/answer AFTER [textentry].
         if (text) {
            var m = text.match (/\[(textentry|hangman)[^\]]*\]/);
            if (m) {
               var textentry_hangman = m[0];
               new_html = text.replace (/\[(textentry|hangman)[^\]]*\][\s\S]*/, textentry_hangman + new_html); 
            }
         }
      }
      if (front_b) {

         // Update locally, and in qwizcards.js data, with full html.
         qw.questions_cards[ii_question].question_text = new_html;
         var card_front =   $ ('#qcard_front-part1-qdeck' + i_qwiz).html ()
                          + $ ('#qcard_front-input-qdeck' + i_qwiz).html ()
                          + $ ('#qcard_front-part2-qdeck' + i_qwiz).html ();
         if (debug[0]) {
            console.log ('[deck_editing_field_blur2] card_front:', card_front);
         }
         qcard_.set_carddata (i_qwiz, ii_question, 'card_front', card_front);

         // Also update Questions accordion panel label.
         update_question_accordion_label (new_html, ii_question);
      } else {
         if (debug[0]) {
            console.log ('[deck_editing_field_blur2] i_choice:', i_choice);
         }
         if (i_choice === '') {
            qw.questions_cards[ii_question].answer_text = new_html;
            var card_back =   $ ('#qcard_back-echo-qdeck'  + i_qwiz).html()
                            + $ ('#qcard_back-part1-qdeck' + i_qwiz).html();
            qcard_.set_carddata (i_qwiz, ii_question, 'card_back', card_back);
            if (debug[0]) {
               console.log ('[deck_editing_field_blur2] card_back:', card_back);
            }
         } else {
            qw.questions_cards[ii_question].feedbacks[i_choice] = new_html;
            qcard_.set_carddata (i_qwiz, ii_question, 'feedback_htmls', new_html, i_choice);
         }
      }
   }


   if (debug[0]) {
      if (ii_question >= 0 && ii_question < n_questions) {
         console.log ('[deck_editing_field_blur2] qw.questions_cards[ii_question]:', qw.questions_cards[ii_question]);
      }
   }
}


// -----------------------------------------------------------------------------
function answer_choice_focus (choice_el) {
   if (debug[0]) {
      console.log ('[answer_choice_focus] choice_el:', choice_el);
      console.log ('[answer_choice_focus] i_question:', i_question, ', i_current_answer_choice:', i_current_answer_choice);
   }
   $ ('#multiple_choice_options_menu_feedback').hide ();

   // Delay all this in case still doing blur of a previous answer choice.
   var delay_answer_choice_focus = function () {

      // If argument not given, just use current setting.
      if (choice_el) {

         // Get which choice this is.
         var $choice_el = $ (choice_el);
         i_current_answer_choice = $choice_el.data ('i_choice');
         if (debug[0]) {
            console.log ('[answer_choice_focus] i_current_answer_choice:', i_current_answer_choice);
         }
      }

      // Unhighlight other, highlight answer choice editing div
      // $ (qwizq_id).find ('span.qwiz-choice.qwiz_editable'));
      var $choices = $ ('span.choices-qwiz' + i_qwiz + '-q' + i_question + ' .qwiz_editable');
      var selector = 'span.choice-qwiz' + i_qwiz + '-q' + i_question + '-a' + i_current_answer_choice + ' .qwiz_editable';
      var $choice = $ (selector);
      $choices.removeClass ('highlight_selected_choice_label');
      $choice.addClass ('highlight_selected_choice_label');

      // Select choice only if question is still a placeholder.
      if (qw.questions_cards[i_question].question_text.indexOf ('qwizard_placeholder') == -1) {
         qqc.select_placeholder ($choice);
      }

      // If correct choice has been selected, mark it with green border, others
      // with red.
      var correct_choice = qw.questions_cards[i_question].correct_choice;
      if (correct_choice != -1) {
         var $choice  = $ ('span.choice-qwiz' + i_qwiz + '-q' + i_question + '-a' + correct_choice + ' .qwiz_editable');
         var $choices = $ ('span.choices-qwiz' + i_qwiz + '-q' + i_question + ' .qwiz_editable');
         $choices.css ({'border': '1px dotted red'});
         $choice.css ({'border': '2px dotted green'});
      }

      // Reset checkbox to match whether this choice is marked as correct.
      var correct = correct_choice == i_current_answer_choice;
      $ ('#qwizard_correct_choice input').prop ('checked', correct);

      // Show delete option if more than one choice.
      if (qw.questions_cards[i_question].n_choices > 1) {
         $ ('#delete_answer_choice').show ();
      } else {
         $ ('#delete_answer_choice').hide ();
      }
   }

   // Note: has to be longer than delay in qwiz_editing_field_blur2 ();
   setTimeout (delay_answer_choice_focus, 200);
}


// -----------------------------------------------------------------------------
function process_embeds (edit_el, html) {

   // See if there are any embed-code candidates, process via ajax call.
   if (debug[0]) {
      console.log ('[process_embeds] edit_el:', edit_el);
      console.log ('                 html:', html);
   }

   // Look for links by themselves on a line.  Need to convert break and
   // paragraph tags to newlines.
   var tmp_html = html.replace (/(<br[^>]*>|<\/*p[^>]*>)/g, '\n');
   var urls = tmp_html.match (/^\s*(http:\/\/|https:\/\/)\S+\s*$/gm);
   if (urls) {
      var n_urls = urls.length;
      for (var i=0; i<n_urls; i++) {
         urls[i] = trim (urls[i]);
      }
      if (debug[0]) {
         console.log ('[process_embeds] urls:', urls);
      }

      // Closure for callback.
      var process_embeds_callback = function (embed_codes) {

         // Replace each url with embed code.
         for (var i=0; i<n_urls; i++) {
            html = html.replace (url[i], embed_codes[i]);
         }
         if (debug[0]) {
            console.log ('[process_embeds_callback] html:', html);
         }
         if (qwiz_deck == 'qwiz') {
            qwiz_editing_field_blur2 (edit_el, html)
         } else {
            deck_editing_field_blur2 (edit_el, html)
         }
      }
      var ajaxurl = qwizzled_params.ajaxurl;
      var data = {action:     'process_embeds',
                  urls:        urls
                 };
      $.ajax ({
         type:       'POST',
         url:        ajaxurl,
         data:       data,
         success:    process_embeds_callback
      });
   } else {
      if (qwiz_deck == 'qwiz') {
         qwiz_editing_field_blur2 (edit_el, html);
      } else {
         deck_editing_field_blur2 (edit_el, html);
      }
   }
}


// -----------------------------------------------------------------------------
function label_from_parent_id ($edit_obj) {
   var id = $edit_obj.parent ().attr ('id');
   var i_label = id.match (/[0-9]+$/)[0];

   return i_label;
}


// -----------------------------------------------------------------------------
// Update Questions accordion panel label if something besides whitespace and
// non-breaking space.
function update_question_accordion_label (new_html, ii_question) {
   if (debug[0]) {
      console.log ('[update_question_accordion_label] new_html:', new_html);
   }

   // Do only if something besides placeholder.
   var clean_html = placeholder_trim (new_html, ii_question);
   if (clean_html) {
      var clean_html_no_whitespace = clean_html.replace (/&nbsp;|\s/gm, '');
      if (clean_html_no_whitespace) {
         var label =   '&emsp; '
                     + (ii_question + 1) + '&ensp;'
                     + clean_html
                     + '&emsp;(' + question_type (ii_question) + ')';
         var $qdiv = $ ('#qwizard_questions div.q' + ii_question + ' div.qwizard_menu_question_label');
         $qdiv.html (label);
         if (debug[0]) {
            console.log ('[update_question_accordion_label] $qdiv:', $qdiv);
            console.log ('[update_question_accordion_label] label:', label);
         }
      }
   }
}


// -----------------------------------------------------------------------------
// Add style to head.
function add_style () {

   var s = [];

   s.push ('<style id="qwizard_styles" type="text/css">');

   s.push ('#qwizard {');
   s.push (   'position:            relative;');
   s.push (   'margin:              auto;');
   s.push (   'width:               525px;');
   s.push (   'text-align:          center;');
   s.push ('}');

   s.push ('button.qwizard_add_media {');
   s.push ('   margin-bottom:       5px;');
   s.push ('}');

   s.push ('#qwizard_shortcodes {');
   s.push (   'display:             none;');
   s.push ('}');

   s.push ('#quiz_components_menu {');
   s.push (   'margin:              auto;');
   s.push (   'width:               680px;');
   s.push ('}');

   s.push ('div.component_options {');
   s.push ('   text-align:          left;');
   s.push ('}');

   s.push ('div.qwizard_accordion div.ui-accordion-content {');
   s.push ('   padding:             5px 1em;');
   s.push ('}');

   s.push ('div.component_options p.qwizard_title {');
   s.push ('   color:               black !important;');
   s.push ('   font-size:           10pt;');
   s.push ('   font-weight:         bold;');
   s.push ('   background:          none !important;');
   s.push ('   padding-right:       3px !important;');
   s.push ('   padding-top:         3px !important;');
   s.push ('   padding-bottom:      3px !important;');
   s.push ('}');

   s.push ('.ui-accordion-content {');
   s.push ('   font-size:           10pt;');
   s.push ('}');

   s.push ('.qwiz_deck_options_box {');
   s.push ('   width:               85px;');
   s.push ('}');

   s.push ('div.simpleColorContainer {');
   s.push ('   display:             inline-block;');
   s.push ('   margin-top:          -10px;');
   s.push ('   transform:           translate(0px, 5px);');
   s.push ('   -webkit-transform:   translate(0px, 5px);');
   s.push ('   z-index:             25;');
   s.push ('}');

   s.push ('#multiple_choice_options_menu,');
   s.push ('#show_me_options_menu {');
   s.push ('   left:                450px;');
   s.push ('   top:                 250px;');
   s.push ('}');

   s.push ('#multiple_choice_options_menu_feedback {');
   s.push ('   display:             none;');
   s.push ('   padding:             5px;');
   s.push ('   background:          #FFFF77;');
   s.push ('}');

   s.push ('.qwiz_editable,');
   s.push ('.qcard_editable {');
   s.push ('   min-height:          12pt;');
   s.push ('   outline:             1px dotted gray;');
   s.push ('   padding:             3px;');
   s.push ('}');

   s.push ('.qwiz_editable p,');
   s.push ('.qcard_editable p {');
   s.push ('   margin-top:          2px !important;');
   s.push ('}');

   s.push ('span.qwizard_placeholder {');
   s.push ('   color:               gray;');
   s.push ('   background:          #ffff55;');
   s.push ('}');

   s.push ('span.qwizard_placeholder span {');
   s.push ('   font-weight:         normal !important;');
   s.push ('   color:               gray;');
   s.push ('   background:          white;');
   s.push ('}');

   s.push ('span.qwizard_placeholder::selection {');
   s.push ('   color:               indianred;');
   s.push ('   background:          #ffff55;');
   s.push ('}');

   s.push ('span.qwizard_placeholder span::selection {');
   s.push ('   color:               gray;');
   s.push ('   background:          white;');
   s.push ('}');

   s.push ('span.qwizard_placeholder::-moz-selection {');
   s.push ('   color:               indianred;');
   s.push ('   background:          #ffff55;');
   s.push ('}');

   s.push ('span.qwizard_placeholder span::-moz-selection {');
   s.push ('   color:               gray;');
   s.push ('   background:          white;');
   s.push ('}');

   s.push ('div.qwizzled_image {');
   s.push ('   outline:             2px dotted blue;');
   s.push ('}');

   s.push ('#label_options_menu {');
   s.push ('   bottom:              200px;');
   s.push ('   left:                600px;');
   s.push ('}');

   s.push ('.qwizard_floating_menu {');
   s.push ('   display:             none;');
   s.push ('   position:            fixed;');
   s.push ('   min-width:           230px;');
   s.push ('   border:              1px solid black;');
   s.push ('   box-shadow:          3px 3px 2px gray;');
   s.push ('   background:          white;');
   s.push ('   text-align:          left;');
   s.push ('   padding:             4px;');
   s.push ('   z-index:             23;');
   s.push ('}');

   s.push ('div.qwizard_floating_menu_header {');
   s.push ('   position:        relative;');
   s.push ('   height:          24px;');
   s.push ('   margin-bottom:   2px;');
   s.push ('   padding:         2px;');
   s.push ('   color:           white;');
   s.push ('   background:      rgba(79, 112, 153, 1);');
   s.push ('   font-weight:     bold;');
   s.push ('   cursor:          move;');
   s.push ('}');

   s.push ('div.qwizard_floating_menu_title {');
   s.push ('   position:        absolute;');
   s.push ('   left:            2px;');
   s.push ('   top:             3px;');
   s.push ('}');


   s.push ('.qwizard_icon_menu_exit {');
   s.push ('   float:           right;');
   s.push ('   border:          none;');
   s.push ('   margin-top:      3px;');
   s.push ('   cursor:          pointer;');
   s.push ('}');

   s.push ('.current_answer_choice {');
   s.push ('   background:          none;');
   s.push ('   border:              1px dotted gray;');
   s.push ('   padding:             0px 2px;');
   s.push ('   outline:             none;');
   s.push ('}');

   s.push ('.highlight_answer_choice {');
   s.push ('   background:          #ffffbb;');
   s.push ('   border:              1px dotted gray;');
   s.push ('   padding:             0px 2px;');
   s.push ('   outline:             2px solid #ff55ff;');
   s.push ('}');

   s.push ('.highlight_selected_choice_label {');
   s.push ('   outline:             2px solid #ff55ff;');
   s.push ('   background:          #ffffbb;');
   s.push ('}');

   s.push ('#new_question_type_menu {');
   s.push ('   display:             none;');
   s.push ('   position:            absolute;');
   s.push ('   border:              1px solid black;');
   s.push ('   box-shadow:          3px 3px 2px gray;');
   s.push ('   background:          white;');
   s.push ('   text-align:          left;');
   s.push ('   padding:             5px;');
   s.push ('}');

   s.push ('div.qwizard_menu_item {');
   s.push ('   border:                 1px solid white;');
   s.push ('   background:             white;');
   s.push ('   line-height:            1.4em;');
   s.push ('   -moz-user-select:       none;');
   s.push ('   -webkit-user-select:    none;');
   s.push ('   -ms-user-select:        none;');
   s.push ('}');

   s.push ('div.qwizard_menu_item_disabled {');
   s.push ('   border:                 1px solid white;');
   s.push ('   color:                  gray;');
   s.push ('   line-height:            1.4em;');
   s.push ('   -moz-user-select:       none;');
   s.push ('   -webkit-user-select:    none;');
   s.push ('   -ms-user-select:        none;');
   s.push ('}');

   s.push ('.menu_spinner {');
   s.push ('   visibility:             hidden;');
   s.push ('}');

   s.push ('div.qwizard_menu_item:hover {');
   s.push ('   border:                 1px solid gray;');
   s.push ('   cursor:                 pointer;');
   s.push ('}');

   s.push ('div.qwizard_menu_item:active {');
   s.push ('   outline:                2px solid lightgray;');
   s.push ('}');

   s.push ('div.qwizard_menu_question_label {');
   s.push ('   display:                inline-block;');
   s.push ('   vertical-align:         -3px;');
   s.push ('   width:                  380px;');
   s.push ('   white-space:            nowrap;');
   s.push ('   overflow:               hidden;');
   s.push ('}');

   s.push ('div.unit_combobox,');
   s.push ('div.topic_combobox {');
   s.push ('   display:                inline-block;');
   s.push ('   width:                  100px;');
   s.push ('}');

   // Buttons inside menu item float right.
   s.push ('.qwizard_menu_item button.qwiz_image_button {');
   s.push ('   float:                 right;');
   s.push ('   margin-left:           3px;');
   s.push ('}');

   // Options (alignment, border styles...) table.
   s.push ('table.quiz_deck_options {');
   s.push ('   border:                 0;');
   s.push ('}');

   s.push ('input.width_px,');
   s.push ('input.height_px {');
   s.push ('   width:                  3em;');
   s.push ('   text-align:             right;');
   s.push ('}');

   // Sortable questions.
   s.push ('#qwizard_questions_sortable {');
   s.push ('   padding-top:           3px;');
   s.push ('   padding-bottom:        3px;');
   s.push ('   max-height:            200px;');
   s.push ('   overflow-y:            auto;');
   s.push ('}');

   s.push ('#qwizard_questions div.sortable {');
   s.push ('   cursor:                move;');
   s.push ('}');


   /*
   s.push ('#free_form_options_menu {');
   s.push ('   left:                   550px;');
   s.push ('   top:                    300px;');
   s.push ('}');
   */

   s.push ('.qwiz_image_button {');
   s.push ('   border:                 none;');
   s.push ('   background:             none;');
   s.push ('   padding:                0;');
   s.push ('   cursor:                 pointer;');
   s.push ('}');

   // Keep bubbleBar in front of modal overlay.
   s.push ('div#bubbleBarWrapper {');
   s.push ('   z-index:                102;');
   s.push ('}');

   s.push ('div.multiple_choice_tooltip.ui-tooltip {');
   s.push ('   font-size:              10pt;');
   s.push ('}');

   s.push ('div.ui-widget-overlay.ui-front {');
   s.push ('   z-index:                99;');
   s.push ('}');

   s.push ('div#dialog_qwizard,');
   s.push ('div#dialog_qwizard_media_upload {');
   s.push ('   font-size:              10pt;');
   s.push ('   background:             white !important;');
   s.push ('}');

   s.push ('.ui-dialog-titlebar {');
   s.push (   'border:                 0 !important;');
   s.push (   'border-radius:          0 !important;');
   s.push (   'padding:                2px 0.4em !important;');
   s.push (   'color:                  white !important;');
   s.push (   'font-weight:            bold !important;');
   s.push ('   background:             rgba(79, 112, 153, 1) !important;');
   s.push ('}');

   s.push ('div.modal_dialog_qwizard div.ui-dialog-titlebar {');
   s.push ('   display:                inline-block;');
   s.push ('   box-sizing:             border-box;');
   s.push ('   width:                  100%;');
   s.push ('}');

   // No close x-icon in modal dialog titlebar.
   s.push ('div.modal_dialog_qwizard button.ui-dialog-titlebar-close {');
   s.push ('   display:                none !important;');
   s.push ('}');

   // Link in titlebar.
   s.push ('a.qwizard_view_edit_shortcodes,');
   s.push ('a.qwizard_exit_view_edit_shortcodes {');
   s.push ('   position:               absolute;');
   s.push ('   right:                  10px;');
   s.push ('   font-weight:            normal;');
   s.push ('   color:                  white;');
   s.push ('   display:                none;');
   s.push ('}');

   s.push ('div.ui-dialog-buttonpane {');
   s.push ('   background:             lightgray;');
   s.push ('}');

   s.push ('div.ui-dialog-buttonpane button.ui-button {');
   s.push ('   font-size:              10pt;');
   s.push ('   font-weight:            bold;');
   s.push ('   color:                  white;');
   s.push ('   background:             #65a9d7;');
   s.push ('}');

   s.push ('div.ui-dialog-buttonpane button.ui-button:hover {');
   s.push ('   color:                  #ccc;');
   s.push ('   background:             #28597a;');
   s.push ('}');

   s.push ('.ui-widget-header .ui-state-hover,');
   s.push ('   color:                  #0000ff !important;');
   s.push ('}');

   s.push ('.ui-state-hover,');
   s.push ('.ui-widget-content .ui-state-hover,');
   s.push ('.ui-widget-header .ui-state-hover,');
   s.push ('.ui-state-focus,');
   s.push ('.ui-widget-content .ui-state-focus,');
   s.push ('.ui-widget-header .ui-state-focus {');
   s.push (   'color:                  #1c94c4 !important;');
   s.push ('}');

   s.push ('.ui-state-active,');
   s.push (   'border:                 1px solid #fbd850 !important;');
   s.push (   'color:                  #eb8f00 !important;');
   s.push (' }');

   s.push ('.qwizard_center {');
   s.push ('   text-align:             center;');
   s.push ('}');

   s.push ('.qwizard_highlight {');
   s.push ('   background:             yellow;');
   s.push ('}');

   s.push ('.qwizard_green {');
   s.push ('   color:                  green;');
   s.push ('   font-weight:            bold;');
   s.push ('}');

   s.push ('.qwizard_red {');
   s.push ('   color:                  red;');
   s.push ('   font-weight:            bold;');
   s.push ('}');

   s.push ('.qwizard_gray {');
   s.push ('   color:                  gray;');
   s.push ('}');

   s.push ('.qwizard_normal {');
   s.push ('   font-size:              10pt;');
   s.push ('   font-weight:            normal;');
   s.push ('}');

   s.push ('.qwizard_smaller {');
   s.push ('   font-size:              80%;');
   s.push ('}');

   s.push ('.qwizard_shift_icon {');
   s.push ('   transform:              translate(0px, 2px);');
   s.push ('   -webkit-transform:      translate(0px, 2px);');
   s.push ('}');

   s.push ('.qwizard_pointer {');
   s.push ('   cursor:                 pointer;');
   s.push ('}');

   s.push ('.qwizard_help {');
   s.push ('   cursor:                 help;');
   s.push ('}');

   s.push ('.custom-combobox {');
   s.push (   'position: relative;');
   s.push (   'display: inline-block;');
   s.push ('}');
   s.push ('.custom-combobox-toggle {');
   s.push (   'position:            absolute;');
   s.push (   'top:                 0;');
   s.push (   'bottom:              0;');
   s.push (   'margin-left:         -1px;');
   s.push (   'padding:             0;');
   s.push (   'background:          none !important;');
   s.push (   'width:               1em  !important;');
   s.push (   'border-left:         0;');
   s.push (   'border-radius:       0    !important;');
   s.push ('}');
   s.push ('.custom-combobox-toggle:hover {');
   s.push (   'border:              1px solid #d9d9d9;');
   s.push (   'background:          #cee3f6 !important;');
   s.push (   '}');
   s.push (   '.custom-combobox-input {');
   s.push (   'font-size:           10pt;');
   s.push (   'color:               black;');
   s.push (   'margin:              0;');
   s.push (   'padding:             1px 2px 2px;');
   s.push (   'background:          none !important;');
   s.push (   'border-right:        0;');
   s.push (   'border-radius:       0;');
   s.push ('}');


   s.push ('</style>');

   $(s.join ('\n')).appendTo ('body');
}


// -----------------------------------------------------------------------------
function qwizard_html () {
   var m = [];

   m.push ('<div id="quiz_components_menu" class="component_options">');
   m.push ('</div>');

   m.push ('<div id="new_question_type_menu" class="qwizard_floating_menu">');
   m.push (   '<div class="qwizard_floating_menu_header">');
   m.push (   '</div>');
   m.push (   '<div class="qwizard_floating_menu_body">');
   m.push (   '</div>');
   m.push ('</div>');

   m.push ('<div id="multiple_choice_options_menu" class="qwizard_floating_menu">');
   m.push (   '<div class="qwizard_floating_menu_header">');
   m.push (   '</div>');
   m.push (   '<div class="qwizard_floating_menu_body">');
   m.push (   '</div>');
   m.push ('</div>');

   m.push ('<div id="show_me_options_menu" class="qwizard_floating_menu">');
   m.push (   '<div class="qwizard_floating_menu_header">');
   m.push (      '<div class="qwizard_floating_menu_title">');
   m.push (         'Show me the answer');
   m.push (      '</div>');
   m.push (      '<button class="qwiz_image_button qwizard_icon_menu_exit" onclick="jQuery (\'#show_me_options_menu\').hide ()">');
   m.push (         '<img src="' + qwizzled_plugin_url + 'images/icon_exit_red.png" />');
   m.push (      '</button>');
   m.push (   '</div>');
   m.push (   '<div class="qwizard_floating_menu_body">');
   m.push (      'Click &ldquo;Show me the answer&rdquo; button to enter/edit feedback.');
   m.push (      '<br />');
   m.push (      '(You may also change the button text.)');
   m.push (   '</div>');
   m.push ('</div>');

   m.push ('<div id="label_options_menu" class="qwizard_floating_menu">');
   m.push (   '<div class="qwizard_floating_menu_header">');
   m.push (   '</div>');
   m.push (   '<div class="qwizard_floating_menu_body">');
   m.push (   '</div>');
   m.push ('</div>');

   m.push ('<div id="free_form_options_menu" class="qwizard_floating_menu">');
   m.push (   '<div class="qwizard_floating_menu_header">');
   m.push (   '</div>');
   m.push (   '<div class="qwizard_floating_menu_body">');
   m.push (   '</div>');
   m.push ('</div>');

   m.push ('<div id="hangman_options_menu" class="qwizard_floating_menu">');
   m.push (   '<div class="qwizard_floating_menu_header">');
   m.push (   '</div>');
   m.push (   '<div class="qwizard_floating_menu_body">');
   m.push (   '</div>');
   m.push ('</div>');
   m.push ('<div id="deck_components_menu" class="component_options">');
   m.push ('</div>');

   var $qwizard = $ ('#qwizard');
   if (debug[0]) {
      console.log ('[qwizard_html] $qwizard:', $qwizard);
   }
   $qwizard.html (m.join ('\n'));
}


// -----------------------------------------------------------------------------
function quiz_components_html () {
   var m = [];

   m.push ('<div class="qwizard_accordion">');

   // First accordion header.
   m.push (   '<p id="quiz_options" class="qwizard_title">');
   var checked;
   var Quiz_Deck;
   var Quiz_Card;
   var Question_Card;
   if (qwiz_deck == 'qwiz') {
      m.push (   'Quiz options');
      checked = qwiz_.qrecord_b;
      Quiz_Deck = 'Quiz';
      Quiz_Card = 'Quiz';
      Question_Card = 'Question';
   } else {
      m.push (   'Flashcard deck options');
      checked = qcard_.qrecord_b;
      Quiz_Deck = 'Deck';
      Quiz_Card = 'Card';
      Question_Card = 'Card';
   }
   checked = checked ? 'checked' : '';
   m.push (   '</p>');

   // First accordion header's content panel.
   m.push (   '<div style="overflow: visible;">');

   // Progress recording -- not mini-makers.  document_qwiz_username set in
   // qwizard.php.
   if (typeof (document_qwiz_username) == 'undefined'
                     || document_qwiz_username.substr (0, 10) != 'mini-maker') {
      m.push (   '<div class="qwizard_menu_item" style="padding-left: 2px;" onmousedown="qwizard.recording_options ()">');
      m.push (      'Enable progress recording ');

      // Don't let click change checkbox.
      m.push (      '<input id="enable_progress_recording_checkbox" type="checkbox" class="qwizard_shift_icon" ' + checked + ' onclick="return false" />');
      m.push (   '</div>');
   }

   m.push (      '<table class="quiz_deck_options">');
   m.push (         '<tr>');
   m.push (            '<td>');
   m.push (               Question_Card + ' order');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               '<label>');
   m.push (                  '<input type="radio" name="qwiz_random" class="qwizard_shift_icon random_false" onclick="qwizard.qwiz_random (\'false\')" checked /> In order as entered &ensp;');
   m.push (               '</label>');
   m.push (               '<label>');
   m.push (                  '<input type="radio" name="qwiz_random" class="qwizard_shift_icon random_true"  onclick="qwizard.qwiz_random (\'true\')"          /> In random order &ensp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (         '</tr>');

   if (qwiz_deck == 'qwiz') {
      m.push (      '<tr>');
      m.push (         '<td>');
      m.push (            'Repeat incorrect');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="qwiz_repeat" class="qwizard_shift_icon repeat_incorrect_true"  onclick="qwizard.qwiz_repeat (\'true\')"  checked /> Repeat questions answered incorrectly (&ldquo;learn mode&rdquo;) &ensp;');
      m.push (            '</label>');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="qwiz_repeat" class="qwizard_shift_icon repeat_incorrect_false" onclick="qwizard.qwiz_repeat (\'false\')"         /> Only one try (&ldquo;test mode&rdquo;) &ensp;');
      m.push (            '</label>');
      m.push (         '</td>');
      m.push (      '</tr>');
   }

   if (qwiz_deck == 'deck') {
      m.push (      '<tr>');
      m.push (         '<td>');
      m.push (            'Card background');
      m.push (         '</td>');
      m.push (         '<td>');
      m.push (            '<select id="card_background" class="qwiz_deck_options_box" onchange="qwizard.card_back_options (this.value)">');
      m.push (               '<option selected>');
      m.push (                  'ruled lines');
      m.push (               '</option>');
      m.push (               '<option>');
      m.push (                  'none');
      m.push (               '</option>');
      m.push (            '</select>');
      m.push (         '</td>');
      m.push (      '</tr>');
   }

   m.push (         '<tr>');
   m.push (            '<td>');
   m.push (                'Alignment');
   m.push (            '</td>');
   m.push (            '<td>');

   // We'll select one of the radio buttons once the quiz or deck has been 
   // processed in qwizard_init ().  Default to left.
   m.push (               '<label>');
   m.push (                  '<input type="radio" name="qwiz_align" class="qwizard_shift_icon align_options_left"   onclick="qwizard.align_options (\'left\')" checked /> Left &ensp;');
   m.push (               '</label>');
   m.push (               '<label>');
   m.push (                  '<input type="radio" name="qwiz_align" class="qwizard_shift_icon align_options_center" onclick="qwizard.align_options (\'center\')"       /> Center &ensp;');
   m.push (               '</label>');
   m.push (               '<label>');
   m.push (                  '<input type="radio" name="qwiz_align" class="qwizard_shift_icon align_options_right"  onclick="qwizard.align_options (\'right\')"        /> Right &ensp;');
   m.push (               '</label>');
   m.push (            '</td>');
   m.push (         '</tr>');
   m.push (         '<tr>');
   m.push (            '<td>');
   m.push (               Quiz_Card + ' size');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               'width');
   m.push (               '<input type="text" class="width_px" onchange="qwizard.qwiz_deck_style (\'width\', this.value)" value="500" />px');
   m.push (               '&emsp;');
   m.push (               'height');
   m.push (               '<input type="text" class="height_px" onchange="qwizard.qwiz_deck_style (\'min-height\', this.value)" value="300" />px');
   if (qwiz_deck == 'deck') {
      m.push (            ' &nbsp;');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="qwiz_expand_scroll" class="qwizard_shift_icon qwiz_expand" onclick="qwizard.set_expand_scroll (\'expand\')" checked /> Expand');
      m.push (            '</label>');
      m.push (            '<img src="' + qwizzled_plugin_url + 'images/info_icon.png" class="qwizard_shift_icon" title="The card height will expand to fit contents" />');
      m.push (            ' &ensp;');
      m.push (            '<label>');
      m.push (               '<input type="radio" name="qwiz_expand_scroll" class="qwizard_shift_icon qwiz_scroll" onclick="qwizard.set_expand_scroll (\'scroll\')"         /> Scroll');
      m.push (            '</label>');
      m.push (            '<img src="' + qwizzled_plugin_url + 'images/info_icon.png" class="qwizard_shift_icon" title="Scrollbars will appear when the content exceeds the card size" />');
   }
   m.push (            '</td>');
   m.push (         '</tr>');
   m.push (         '<tr>');
   m.push (            '<td>');
   m.push (               'Border');
   m.push (            '</td>');
   m.push (            '<td>');
   m.push (               'width');
   m.push (               '<select id="border_width" onchange="qwizard.qwiz_deck_style (\'border-width\', this.value)">');
   m.push (                  '<option>');
   m.push (                     'none');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     '1px');
   m.push (                  '</option>');
   m.push (                  '<option selected>');
   m.push (                     '2px');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     '3px');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     '4px');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     '5px');
   m.push (                  '</option>');
   m.push (               '</select>');
   m.push (               '&emsp;');
   m.push (               'style');
   m.push (               '<select id="border_style" onchange="qwizard.qwiz_deck_style (\'border-style\', this.value)">');
   m.push (                  '<option>');
   m.push (                     'none');
   m.push (                  '</option>');
   m.push (                  '<option selected>');
   m.push (                     'solid');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'dotted');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'dashed');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'double');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'groove');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'ridge');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'inset');
   m.push (                  '</option>');
   m.push (                  '<option>');
   m.push (                     'outset');
   m.push (                  '</option>');
   m.push (               '</select>');
   m.push (               '&emsp;');
   m.push (               'color');
   m.push (               '<input id="border_color" type="text" class="simple_color_callback" value="black" />');
   m.push (            '</td>');
   m.push (         '</tr>');
   m.push (      '</table>');
   m.push (   '</div>');
   /*
   m.push (      'Card back');
   m.push (      'height');
   m.push (      'width');
   m.push (      'Default unit');
   m.push (      'Default topic');
   m.push (      'terms');
   */

   // Second accordion header.
   m.push (   '<p id="quiz_header" class="qwizard_title">');
   m.push (      'Header');
   m.push (   '</p>');

   // Second accordion header's content panel.
   m.push (   '<div>');
   m.push (      '<label>');
   m.push (         '<input type="radio" name="qwiz_header_yes_no" class="quiz_header_yes" onclick="qwizard.' + qwiz_deck + '_header_yes_no (1)" />');
   m.push (      '   Show/edit');
   m.push (      '</label>');
   m.push (      '&emsp;');
   m.push (      '<label>');
   m.push (         '<input type="radio" name="qwiz_header_yes_no" class="quiz_header_no" onclick="qwizard.' + qwiz_deck + '_header_yes_no (0)" checked />');
   m.push (      'No header');
   m.push (      '</label>');
   m.push (   '</div>');

   m.push (   '<p id="quiz_introduction" class="qwizard_title">');
   m.push (      'Introduction');
   m.push (   '</p>');
   m.push (   '<div>');
   m.push (      '<label>');
   m.push (         '<input type="radio" name="qwiz_intro_yes_no" class="quiz_intro_yes" onclick="qwizard.' + qwiz_deck + '_intro_yes_no (1)" />');
   m.push (         'Show/edit');
   m.push (      '</label>');
   m.push (      '&emsp;');
   m.push (      '<label>');
   m.push (         '<input type="radio" name="qwiz_intro_yes_no" class="quiz_intro_no" onclick="qwizard.' + qwiz_deck + '_intro_yes_no (0)" checked />');
   m.push (         'No introduction');
   m.push (      '</label>');
   m.push (   '</div>');

   m.push (   '<p id="quiz_questions" class="qwizard_title">');
   if (qwiz_deck == 'qwiz') {
      m.push (   'Questions');
   } else {
      m.push (   'Flashcards');
   }
   m.push (   '</p>');
   m.push (   '<div id="qwizard_questions">');
   m.push (   '</div>');

   m.push (   '<p id="quiz_exit_text" class="qwizard_title">');
   if (qwiz_deck == 'qwiz') {
      m.push (   'Exit text (at end of quiz)');
   } else {
      m.push (   'Exit text (at end of flashcard deck)');
   }
   m.push (   '</p>');
   m.push (   '<div>');
   m.push (      '<label>');
   if (qwiz_deck == 'qwiz') {
      m.push (      '<input type="radio" name="qwiz_restart_yes_no" class="quiz_restart_yes" onclick="qwizard.quiz_restart_yes_no (1)" />');
      m.push (      'Show &ldquo;Take the quiz again&rdquo; button');
   } else {
      m.push (      '<input type="radio" name="qwiz_restart_yes_no" class="quiz_restart_yes" onclick="qwizard.deck_restart_yes_no (1)" />');
      m.push (      'Show &ldquo;Review this flashcard stack again&rdquo; button');
   }
   m.push (      '</label>');
   m.push (      '&emsp;');
   m.push (      '<label>');
   if (qwiz_deck == 'qwiz') {
      m.push (      '<input type="radio" name="qwiz_restart_yes_no" class="quiz_restart_no" onclick="qwizard.quiz_restart_yes_no (0)" checked />');
   } else {
      m.push (      '<input type="radio" name="qwiz_restart_yes_no" class="quiz_restart_no" onclick="qwizard.deck_restart_yes_no (0)" checked />');
   }
   m.push (         'No button');
   m.push (      '</label>');
   m.push (   '</div>');
   m.push ('</div>');

   $ ('#quiz_components_menu').html (m.join ('\n'));
}


// -----------------------------------------------------------------------------
this.start_modal = function (wp_tinymce_ed, qwiz_deck_html, page) {
   if (debug[0]) {
      console.log ('[start_modal] wp_tinymce_ed:', wp_tinymce_ed);
      var qwiz_deck_htmlx = qwiz_deck_html;
      if (qwiz_deck_htmlx.length > 250) {
         qwiz_deck_htmlx = qwiz_deck_htmlx.substr (0, 250) + ' ...';
      }
      console.log ('[start_modal] qwiz_deck_html:', qwiz_deck_htmlx);
      console.log ('[start_modal] page:', page);
   }
   var first_four = qwiz_deck_html.substr (0, 4);
   qwiz_deck = first_four == 'qwiz' || first_four == '[qwi' ? 'qwiz' : 'deck';

   if (! start_modal_first_call_f) {

      // Put lists of quiz and deck components (header, intro, ...) into
      // appropriate divs.
      quiz_components_html ();
      accordion_panel_init ();

      // Put new-question options (multiple choice, show me, etc.) into appropriate
      // div (floating menu).
      new_question_type_menu_html ();

      $dialog_qwizard.dialog ('open');
   } else {
      start_modal_first_call_f = false;

      // Set up modal dialog box with relevant divs, start qwizard to populate,
      // show divs.
      d = [];
      d.push ('<div id="dialog_qwizard" title="QWizard">');

      d.push (   '<div id="qwizard_wrapper">');
      d.push (      '<div id="qwizard">');
      d.push (      '</div>');
      d.push (      '<br />');
      d.push (      '<button class="qwizard_add_media" onmousedown="qwizard.qwizard_add_media (event, \'insert\')" disabled>');
      d.push (         'Add Media');
      d.push (      '</button>');
      d.push (      '<div id="qwizard_result">');
      d.push (      '</div>');
      d.push (   '</div>');

      d.push (   '<div id="qwizard_shortcodes">');
      d.push (   '</div>');


      d.push ('</div>');

      $ ('body').append (d.join ('\n'));

      if (! wp_editing_page_f) {

         // Add our own media upload dialog if not already there (added on
         // startup on user pages).
         if ($ ('#dialog_qwizard_media_upload').length == 0) {
            qw.add_dialog_qwizard_media_upload ();
         }
      }

      qw.init_qwizard (wp_tinymce_ed);

      // wp_editing_page_f set in init_qwizard ().
      var save_label = wp_editing_page_f ? 'Save and exit' : 'Publish/update';
      var buttons = {};
      buttons['Discard changes']  = discard_edit;
      buttons[save_label] = qwizard_save_and_exit;

      $dialog_qwizard = $ ('#dialog_qwizard').dialog ({
         autoOpen:      true,
         classes:       {'ui-dialog': 'modal_dialog_qwizard'},
         closeOnEscape: false,
         draggable:     false,
         resizable:     false,
         position:      {my: 'left', at: 'left'},
         width:         Math.round (window.innerWidth*1.00 - 20),
         height:        Math.round (window.innerHeight*1.00),
         modal:         false,
         buttons:       buttons
      });

      // On qwizard/user page, add view/edit-shortcodes links to titlebar.
      if (! wp_editing_page_f) {
         var links = '<a href="javascript: qwizard.view_edit_shortcodes ()" class="qwizard_view_edit_shortcodes">'
                   +    'View/edit shortcodes'
                   + '</a>'
                   + '<a href="javascript: qwizard.exit_view_edit_shortcodes ()" class="qwizard_exit_view_edit_shortcodes">'
                   +    'Return to Wizard editing'
                   + '</a>';
         $ ('div.modal_dialog_qwizard div.ui-dialog-titlebar').append (links);

         // Show the first one.
         $ ('a.qwizard_view_edit_shortcodes').show ();
      }


      $ ('body').append ('<div id="bubbleBarWrapper"></div>');

      qwizard_page = page;
   }
   qw.qwizard_start (qwiz_deck_html);
}


// -----------------------------------------------------------------------------
this.view_edit_shortcodes = function () {

   var text;
   if (qwiz_deck == 'qwiz') {
      text = qwiz_shortcodes_text ();
   } else {
      text = deck_shortcodes_text ();
   }

   // Remove "enter text..." messages, unwrap placeholders.
   text = text.replace (/(<br>|<br \/>)*<span class="qwizard_smaller">.*?<\/span>/gm, '');
   var m = text.match (/<span class="qwizard_placeholder">([\S\s])*?<\/span>/gm);
   if (m) {
      n_m = m.length;
      for (var i=0; i<n_m; i++) {
         text = text.replace (/<span class="qwizard_placeholder">([\S\s]*?)<\/span>/m, '\$1');
      }
   }

   // Hide regular qwizard content, initiate editor if haven't done so already.
   // Replace shortcode edit area content, show.
   // content.  
   $ ('div#qwizard_wrapper').hide ();
   if (! shortcode_ed) {
      qw.init_tinymce ('#qwizard_shortcodes', true);
      shortcode_ed = current_editor;
   }
   $ ('#qwizard_shortcodes').html (text).show ();

   // Toggle header links.
   $ ('a.qwizard_view_edit_shortcodes').hide ();
   $ ('a.qwizard_exit_view_edit_shortcodes').show ();
}


// -----------------------------------------------------------------------------
this.exit_view_edit_shortcodes = function () {

   // Re-process html.  Show errors, if any.
   var new_text = $ ('#qwizard_shortcodes').html ();
   if (qwiz_deck == 'qwiz') {
      qwiz_.set_qwizdata (-1, 'errmsgs', '[]');
      qwiz_.process_qwiz_pair (new_text, i_qwiz, true);

      // Also check if any multiple-choice questions have only one choice.
      for (var i_question=0; i_question<n_questions; i_question++) {
         var question = qw.questions_cards[i_question];
         if (question.type == 'multiple_choice') {
            if (question.n_choices == 1 ) {
               qw.errmsgs.push ('Multiple-choice question has only one answer-choice (question ' + (i_question + 1) + ')');
            }
         }
      }
   } else {
      qcard_.set_deckdata (-1, 'errmsgs', '[]');
      qcard_.process_qdeck_pair (new_text, i_qwiz, true);
   }

   if (qw.errmsgs.length) {
      var s = qw.errmsgs.length > 1 ? 's' : '';
      var ok_f = confirm (  'Error' + s + ' found:\n\n'
                          + qw.errmsgs.join ('\n') + '\n\n'
                          + 'Continue? (hit cancel to stay in shortcodes editor)');
      qw.errmsgs = '';
      if (! ok_f) {
         return false;
      }
   }
   $ ('#qwizard_shortcodes').html ('');
   redraw_qwiz_deck ();
   $ ('div#qwizard_wrapper').show ();

   // Toggle header links.
   $ ('a.qwizard_view_edit_shortcodes').show ();
   $ ('a.qwizard_exit_view_edit_shortcodes').hide ();
}


// -----------------------------------------------------------------------------
this.add_dialog_qwizard_media_upload = function (callback_routine) {
   var d = [];

   d.push ('<div id="dialog_qwizard_media_upload" title="Add image">');
   d.push (   'Currently, limited to images (' + allowed_media.join (', ') + ')');
   d.push (   '<br />');
   d.push (   '<br />');
   d.push (   '<input id="qwizard_media_url" type="text" placeholder="Enter image URL" onchange="qwizard.check_media_file_type (this.value)" onfocus="jQuery (\'#upload_media_file_feedback\').hide ()" style="width: 30em; border: 1px solid gray;" />');
   d.push (   '<button onmousedown="qwizard.insert_media_from_url ()">');
   d.push (      'Go');
   d.push (   '</button>');
   d.push (   '<br />');
   d.push (   '<p class="qwizard_center">');
   d.push (      '<b>&mdash;&mdash;&mdash;&mdash;&mdash; OR &mdash;&mdash;&mdash;&mdash;&mdash;</b>');
   d.push (   '</p>');
   d.push (   '<form id="media_file_upload_form" enctype="multipart/form-data">');
   d.push (   '<form name="media_file_upload_form" enctype="multipart/form-data">');
   d.push (      '<input name="media_file" type="file" onchange="qwizard.check_media_file_type (this.value)" style="width: 35em; border: 1px solid gray;" />');
   d.push (      '<br />');
   d.push (      '<br />');
   d.push (      '<input id="upload_media_file_button" type="button" onmousedown="qwizard.qwizard_upload_media_file (qwizard.qwizard_insert_media_file_callback)" value="Upload" />');
   d.push (      '<input name="page" type="hidden" value="qwizard_page" />');
   d.push (   '</form>');
   d.push (   '<br />');
   d.push (   '<div id="upload_media_file_feedback" style="display: none; font-weight: bold; color: red;">');
   d.push (   '</div>');
   d.push ('</div>');

   $ ('body').append (d.join ('\n'));

   $dialog_qwizard_media_upload = $ ('#dialog_qwizard_media_upload').dialog ({
      autoOpen:      false,
      closeOnEscape: false,
      draggable:     true,
      resizable:     false,
      width:         500,
      height:        300,
      modal:         true,
      buttons:       {Cancel:    close_media_upload}
   });
}


// -----------------------------------------------------------------------------
this.qwizard_add_media = function (event, insert_f, local_add_media_user_html_f) {
   if (debug[0]) {
      console.log ('[qwizard_add_media] disable_add_media_timeout:', disable_add_media_timeout);
   }

   // Either prevent blur event -- disabling of "Add Media" button and clearing
   // of current_editor -- or cancel it if it's already occurred.
   prevent_editor_blur_event_b = true;

   // Don't disable "Add Media" button.
   clearTimeout (disable_add_media_timeout);

   // Hide qwizard modal dialog window.
   add_media_user_html_f = local_add_media_user_html_f;
   if (! add_media_user_html_f) {
      $dialog_qwizard.parent ().hide ();
   }

   //event.preventDefault();

   // Remove placeholder if there.
   if (current_editor) {
      var $edit_elm = $ (current_editor.targetElm);
      var tagName = $edit_elm.prop ('tagName');
      var replace_w_space_b = tagName.toLowerCase () == 'span';
      qw.remove_placeholder (null, $edit_elm, replace_w_space_b);
   }
   if (wp_editing_page_f) {

      // If the media frame already exists, reopen it.
      if ( qwizard_add_media_frame ) {
         qwizard_add_media_frame.open();
         return;
      }

      // Create the media frame.
      qwizard_add_media_frame = wp.media.frames.qwizard_add_media_frame = wp.media ({
         frame:      'post',
         title:      $ (this).data ('uploader_title'),
         button:     {
                        text: $ (this).data ('uploader_button_text'),
                     },
         multiple:   false  // Set to true to allow multiple files to be selected
      });

      // When an image is selected, run a callback.
      qwizard_add_media_frame.on ('insert', function() {

         // Multiple was set to false so only get one image from the uploader.
         var attachment = qwizard_add_media_frame.state ().get ('selection').first ().toJSON ();

         // Run image URL through oembed to get iframe html.
         if (debug[0]) {
            console.log ('[qwizard_add_media] > insert] attachment:', attachment)
            console.log ('                              current_editor:', current_editor);
            console.log ('                              attachment.url:', attachment.url);
         }

         // get_embed_code ()'s callback will do editor.selection.setContent ().
         get_embed_code (current_editor, attachment);

         // Re-show qwizard modal dialog.
         $dialog_qwizard.parent ().show ();
      });

      qwizard_add_media_frame.on ('close', function() {

         // Show qwizard modal dialog.
         $dialog_qwizard.parent ().show ();
      });

      // Finally, open the modal
      qwizard_add_media_frame.open ();
   } else {

      // On qwizard user page (not WordPress).  Open file upload dialog.  
      // Need to be logged in.
      qwizard_upload_media_file_callback_routine = qwizard_insert_media_file_callback;
      $dialog_qwizard_media_upload.dialog ('open');
      if (typeof (maker_id) == 'undefined' || ! maker_id) {
         $ ('#upload_media_file_feedback').html ('Please log in in order to save uploaded images (&ldquo;Cancel&rdquo; this box, then &ldquo;Publish/update&rdquo;, then &ldquo;Edit&rdquo;).  Copy-and-paste may work as a shortcut (depending on your browser).').show ();
         $ ('#upload_media_file_button').attr ('disabled', true);
      } else {
         $ ('#upload_media_file_feedback').hide ();
         $ ('#upload_media_file_button').removeAttr ('disabled');
      }
   }
}


// -----------------------------------------------------------------------------
this.check_media_file_type = function (filename) {
   //var filename = $ ('input[name="media_file"]').val ();
   if (debug[0]) {
      console.log ('[check_media_file_type] filename:', filename);
   }
   var file_ext = 'xyzzy';
   var m = filename.match (/\.([^.]*)$/);
   if (m) {
      file_ext = m[1].toLowerCase ();
   }

   var ok_f = allowed_media.indexOf (file_ext) != -1;
   if (ok_f) {
      $ ('#upload_media_file_feedback').hide ();
      $ ('#upload_media_file_button').removeAttr ('disabled');
   } else {
      $ ('#upload_media_file_feedback').html ('File is not one of allowed types (' + allowed_media.join (', ') + ')').show ();
      $ ('#upload_media_file_button').attr ('disabled', true);
   }

   return ok_f;
}


// -----------------------------------------------------------------------------
this.qwizard_upload_media_file = function () {

   var url = qqc.get_qwiz_param ('server_loc', './');
   if (url.indexOf ('admin') == -1) {
      url += 'admin/';
   }
   url += 'receive_media_file.php';

   var f = document.forms.media_file_upload_form;
   var formData = new FormData (f);

   $.ajax({
      type:          'POST',
      url:           url,
      data:          formData,
      dataType:      'json',
      error:         function (xhr, desc, exceptionobj) {
                        console.log ('[media_file_upload] error desc:', desc);
                     },
      success:       qwizard_upload_media_file_callback_routine,

      // Do not process data or worry about content-type.
      cache:         false,
      contentType:   false,
      processData:   false,
      /*  
      // Custom XMLHttpRequest
      xhr:           function () {
                        var myXhr = $.ajaxSettings.xhr ();

                        // Check if upload property exists.
                        if(myXhr.upload) {
                           myXhr.upload.addEventListener ('div#progress', progressHandlingFunction, false);
                        }
                        return myXhr;
                     },
       */
   });
}


// -----------------------------------------------------------------------------
function qwizard_insert_media_file_callback (data) {
   if (debug[0]) {
      console.log ('[qwizard_insert_media_file_callback] data:', data);
   }
   if (data.errmsg) {
      $ ('#upload_media_file_feedback').html (data.errmsg).show ();
   } else {
      var media_html = '<img src="' + data.image_url + '" />';
      dialog_insert_image_or_code (media_html);
   }
}


// -----------------------------------------------------------------------------
this.insert_media_from_url = function () {

   var media_url = $ ('input#qwizard_media_url').val ();
   if (qw.check_media_file_type (media_url)) {
      var media_html = '<img src="' + media_url + '" />';

      // See if image exists.  If so, go on to insert.
      // DKTMP -- need to handle non-images.
      url_exists (media_url, media_html, dialog_insert_image_or_code, url_exists_error);
   }
}


// -----------------------------------------------------------------------------
function url_exists (url, html, success, fail) {
  var img = new Image ();
  img.onload = function () {
     success (html);
  };
  img.onerror = function () {
     fail ();
  };
  img.src = url;
}


// -----------------------------------------------------------------------------
function url_exists_error () {
   $ ('#upload_media_file_feedback').html ('Could not find image -- please check the URL').show ();
   $ ('#upload_media_file_button').attr ('disabled', true);
}


// -----------------------------------------------------------------------------
function dialog_insert_image_or_code (media_html) {
   if (debug[0]) {
      console.log ('[dialog_insert_image_or_code] media_html:', media_html);
   }

   // Reset URL source.
   var ok_f = insert_image_or_code (current_editor, media_html);

   if (ok_f) {
      close_media_upload ();
   } else {
      $ ('#upload_media_file_feedback').html ('Sorry, it didn&rsquo;t work. Please Cancel and try again').show ();
      $ ('#upload_media_file_button').attr ('disabled', true);
   }
}


// -----------------------------------------------------------------------------
function qwizard_card_back_media_file_callback (data) {
   if (debug[0]) {
      console.log ('[qwizard_card_back_media_file_callback] data:', data);
   }
   if (data.errmsg) {
      $ ('#upload_media_file_feedback').html (data.errmsg).show ();
   } else {
      var image_html = '<img src="' + data.image_url + '" />';
      dialog_insert_image_or_code (image_html);
   }
}


// -----------------------------------------------------------------------------
function close_media_upload () {
   $dialog_qwizard_media_upload.dialog ('close');

   // Re-show qwizard modal dialog.
   if (! add_media_user_html_f) {
      $dialog_qwizard.parent ().show ();
   }
}


// -----------------------------------------------------------------------------
function get_embed_code (editor, attachment) {

   // Callback - closure.
   var get_embed_code_callback = function (embed_codes) {
      if (debug[0]) {
         console.log ('[get_embed_code_callback] embed_codes:', embed_codes);
      }
      var embed_code = embed_codes[0];
      if (! embed_code) {
         if (attachment.mime.substr (0, 5) == 'image') {
            embed_code = '<img src="' + attachment.url + '" />';
         } else if (attachment.mime.substr (0, 5) == 'audio') {
            embed_code = '[audio src="' + attachment.url + '"]';
         } else if (attachment.mime.substr (0, 5) == 'video') {
            embed_code = '[video src="' + attachment.url + '"]';
         } else {

            // Fall back to link.
            embed_code = attachment.url;
         }
      }
      insert_image_or_code (editor, embed_code);
   }

   var ajaxurl = qwizzled_params.ajaxurl;
   var urls = [attachment.url];
   var data = {action:     'process_embeds',
               urls:        encodeURIComponent (JSON.stringify (urls))
              };
   $.ajax ({
      type:       'POST',
      url:        ajaxurl,
      data:       data,
      success:    get_embed_code_callback
   });
}


// -----------------------------------------------------------------------------
function insert_image_or_code (editor, image_code) {
   if (debug[0]) {
      console.log ('[insert_image_or_code]: editor:', editor);
   }
   var ok_f = true;
   if (i_question < 0 || i_question >= n_questions
               || qw.questions_cards[i_question].type != 'labeled_diagram') {

      // Include selected content, in case user highlighted rather than
      // clicked.
      var selected_content = editor.selection.getContent ();
      editor.selection.setContent (selected_content + image_code);

      // Reset card height/width to accommodate image, if large.
      if (qwiz_deck == 'deck') {
         qcard_.set_container_width_height (i_qwiz);
      }

      // Is it there?
      var content = editor.getContent ();
      if (content.indexOf (image_code.substr (0, 10)) == -1) {
         if (debug[0]) {
            console.log ('[insert_image_or_code]: didn\'t work; content:', content);
         }
         ok_f = false;
      } else {
      }
   } else {

      // Labeled diagram: find/replace diagram, reset wrapper width and
      // height.
      var $img_wrapper = $ ('#qwiz' + i_qwiz + '-q' + i_question + ' div.qwizzled_image');
      var $image   = $img_wrapper.find ('img');

      // Image may have been deleted.
      if ($image.length) {
         $image.replaceWith (image_code);
      } else {
         $img_wrapper.append (image_code);
      }

      // Give it some time for processing.
      var delay_reset_wrapper_width_height = function () {
         var $image   = $img_wrapper.find ('img');
         var img_width  = $image.width ();
         var img_height = $image.height ();
         if (debug[0]) {
            console.log ('[insert_image_or_code] $image:', $image, ', img_width:', img_width, ', img_height:', img_height);
         }
         $img_wrapper.css ({width: img_width + 'px', height: img_height + 'px'});
      };
      setTimeout (delay_reset_wrapper_width_height, 100);


      // Need to get editor.
      editor = tinyMCE.get ('qwizzled_canvas-qwiz' + i_qwiz + '-q' + i_question);
   }

   // Trigger blur/save.  Delay a bit per labeled diagram, above.
   if (editor) {
      if (current_editor.targetElm) {
         if (qwiz_deck == 'qwiz') {
            var delay_blur = function () {
               qwiz_editing_field_blur (current_editor.targetElm);
            }
            setTimeout (delay_blur, 150);
         } else {
            deck_editing_field_blur (current_editor.targetElm);
         }
      }
      editor.focus ();
   }

   return ok_f;
}


// -----------------------------------------------------------------------------
this.qwizard_start = function (qwiz_deck_html) {
   if (debug[0]) {
      console.log ('[qwizard_start] qwiz_deck_html:', qwiz_deck_html);
   }
   qwizzled.qwizard_b = true;
   qwiz_.qwizard_b    = true;
   if (qwiz_deck_html == 'qwiz') {
      $ ('#quiz_components_menu').show ();

      // New quiz - set up qwiz container.
      qw.create_new_quiz ();
      new_qwiz_deck_f = true;
      qwiz_.qwiz_init ();
   } else if (qwiz_deck_html == 'deck') {
      $ ('#quiz_components_menu').show ();

      // New deck - set up.
      qw.create_new_deck ();
      new_qwiz_deck_f = true;
      qcard_.qdeck_init2 (1, true);
      qcard_.process_card_attributes (i_qwiz, []);
   } else {

      // Edit existing quiz or deck.  Delete bookmark(s) from html.
      new_qwiz_deck_f = false;
      qwiz_deck_html = qwiz_deck_html.replace (/<span id="qbookmark[^<]+<\/span>/g, '');
      var new_qwiz_deck_html;
      if (qwiz_deck == 'qwiz') {

         // ....................................................................
         // Qwiz.
         // Send html through qwiz.js processing -- will fill in qwizard
         // questions_cards data and provide processed html.
         default_unit = '';
         new_qwiz_deck_html = qwiz_.process_qwiz_pair (qwiz_deck_html, i_qwiz, true);
         if (debug[1]) {
            console.log ('[qwizard_start] qw.questions_cards:', qw.questions_cards);
         }

         // Set up qwizard version of quiz in dialog overlay.
         $ ('#qwizard_result').html (new_qwiz_deck_html);

         // For introduction and exit > restart button, select the appropriate
         // radio buttons.
         if (! qwiz_.no_intro_b[i_qwiz]) {
            $ ('input[name="qwiz_intro_yes_no"].quiz_intro_yes').prop ('checked', true);
         }
         if (exit_text.search (/\[restart\]/) != -1) {
            $ ('input[name="qwiz_restart_yes_no"].quiz_restart_yes').prop ('checked', true);
         }

         $ ('#quiz_components_menu').show ();

         // Set up "Add new" and list of questions in accordion div.
         qw.questions_list_html ();
         highlight_accordion_question (0);

         // If no intro for a quiz or single-question quiz, hide intro and move
         // immediately to first question.
         var intro_div_selector = 'div.intro-qwiz' + i_qwiz;
         if (qwiz_.no_intro_b[i_qwiz] || n_questions == 1) {
            $ (intro_div_selector).hide ();
            qwiz_.set_qwizdata (i_qwiz, 'i_question', -1);
            qwiz_.next_question (i_qwiz);
         } else {

            // Quiz has intro.  Set up to edit intro, open accordion panel.
            qw.init_tinymce (intro_div_selector);
            $ ('div.qwizard_accordion').accordion ('option', 'active', INTRO_ACCORDION);
         }

         // If any hangman or textentry questions, if just one paragraph tag
         // (presumably the default) inside the two question editing fields
         // (before and after [textentry] or [hangman]), and it's at the
         // beginning, remove the tag.
         $ ('div.qwiz-part1, div.qwiz-part2').each (function () {
            adjust_edit_part ($ (this));
         });

         // Initialize labeled diagrams.
         for (var ii_question=0; ii_question<n_questions; ii_question++) {
            var question = qw.questions_cards[ii_question];
            if (question.type == 'labeled_diagram') {
               var $content = $ ('#qwiz' + i_qwiz + '-q' + ii_question);
               qwiz_.init_qwizzled2 ($content, i_qwiz, ii_question);
            }
         }
      } else {

         // ....................................................................
         // Flashcard deck.
         // Send html through qwizcards.js processing -- will fill in qwizard
         // questions_cards data and provide processed html.
         default_unit = '';
         new_qwiz_deck_html = qcard_.process_qdeck_pair (qwiz_deck_html, i_qwiz, true);
         if (debug[1]) {
            console.log ('[qwizard_start] qw.questions_cards:', qw.questions_cards);
         }

         // Set up qwizard version of flashcard deck in dialog overlay.
         $ ('#qwizard_result').html (new_qwiz_deck_html);

         // For introduction, header, and exit > restart button, select the
         // appropriate radio buttons.
         if (header_text != '') {
            $ ('input[name="qwiz_header_yes_no"].quiz_header_yes').prop ('checked', true);
         }
         if (! qcard_.no_intro_b[i_qwiz]) {
            $ ('input[name="qwiz_intro_yes_no"].quiz_intro_yes').prop ('checked', true);
         }
         if (exit_text.search (/\[restart\]/) != -1) {
            $ ('input[name="qwiz_restart_yes_no"].quiz_restart_yes').prop ('checked', true);
         }

         $ ('#quiz_components_menu').show ();

         // Start -- will show intro or first card.
         qcard_.qdeck_init2 (1);

         // If no intro for a deck or single-question deck, move immediately to
         // first card.
         if (! qcard_.no_intro_b[i_qwiz] && n_questions > 1) {

            // Show separate intro card for deck. Open accordion panel.
            $ ('div.qwizard_accordion').accordion ('option', 'active', INTRO_ACCORDION);
         }

         // If any hangman or textentry questions, if just one paragraph tag
         // (presumably the default) inside the two question editing fields
         // (before and after [textentry] or [hangman]), and it's at the
         // beginning, remove the tag.
         $ ('div.qwiz-part1, div.qwiz-part2').each (function () {
            adjust_edit_part ($ (this));
         });

         // Set up "Add new" and list of cards in accordion div.
         qw.cards_list_html ();
      }
   }

   // Check the random-order radio button if random="true" (default false).
   var random_b;
   if (qwiz_deck == 'qwiz') {
      random_b = qwiz_.get_qwizdata (i_qwiz, 'random_b');
   } else {
      random_b = qcard_.get_deckdata (i_qwiz, 'random_b');
   }
   if (random_b) {
      $ ('input.random_true')[0].checked = true;
   }

   // Check the repeat-incorrect radio button if repeat_incorrect="false"
   // (default true).
   var repeat_incorrect_b;
   if (qwiz_deck == 'qwiz') {
      repeat_incorrect_b = qwiz_.get_qwizdata (i_qwiz, 'repeat_incorrect_b');
   } else {
      repeat_incorrect_b = qcard_.get_deckdata (i_qwiz, 'repeat_incorrect_b');
   }
   if (qwiz_deck == 'qwiz') {
      if (! repeat_incorrect_b) {
         $ ('input.repeat_incorrect_false')[0].checked = true;
      }
   }

   // Check one of the alignment radio buttons (quiz/deck options).  Default is
   // "left".
   var align;
   var $qwiz_deck;
   var $qcard_card_back;
   if (qwiz_deck == 'qwiz') {
      align = qwiz_.get_qwizdata (i_qwiz, 'align');
      $qwiz_deck = $ ('#qwiz' + i_qwiz);
   } else {
      align = qcard_.get_deckdata (i_qwiz, 'align');
      $qcard_card_back = $ ('div.qcard_card-qdeck' + i_qwiz + ' div.qcard-back');
      $qwiz_deck = $qcard_card_back;
   }
   if (align == 'center') {
      $ ('input.align_options_center')[0].checked = true;
   } else if (align == 'right') {
      $ ('input.align_options_right')[0].checked = true;
   }

   if (qwiz_deck == 'deck') {
      var style = $qcard_card_back.attr ('style');
      if (style) {

         // Set the card background selection.
         var m = style.match (/background\s*:\s*([^; ]+)/);
         if (m) {
            var value = m[1];
            if (value.indexOf ('none') != -1) {
               set_selectedIndex ($ ('#card_background')[0], 'none');
            }
         }
      }
   }

   // Expand or scroll height.  Default is "expand".
   var scroll_b;
   if (qwiz_deck == 'qwiz') {
      // DKTMP...
   } else {
      scroll_b = qcard_.get_deckdata (i_qwiz, 'scroll_b');
   }
   if (scroll_b) {
      $ ('input.qwiz_scroll')[0].checked = true;
   }

   var style = $qwiz_deck.attr ('style');
   if (style) {
      if (qwiz_deck == 'qwiz') {
         var m = style.match (/width\s*:\s*([^; A-Za-z]+)/);
         if (m) {
            $ ('input.width_px').val (m[1]);
         }
         var re = new RegExp ('min-height\\s*:\\s*([^; A-Za-z]+)');
         var m = style.match (re);
         if (m) {
            $ ('input.height_px').val (m[1]);
         }
      } else {
         var card_width  = qcard_.get_deckdata (i_qwiz, 'card_width_setting');
         var card_height = qcard_.get_deckdata (i_qwiz, 'card_height_setting');
         $ ('input.width_px').val (card_width.substr (0, card_width.length - 2));
         $ ('input.height_px').val (card_height.substr (0, card_height.length - 2));
      }


      // Set the border width selection.
      var m = style.match (/border-width\s*:\s*([^; ]+)/);
      if (m) {
         var value = m[1];
         var select_el = $ ('#border_width')[0];
         set_selectedIndex (select_el, value);
      }

      // Set the border style selection.
      var m = style.match (/border-style\s*:\s*([^; ]+)/);
      if (m) {
         var value = m[1];
         var select_el = $ ('#border_style')[0];
         set_selectedIndex (select_el, value);
      }

      // Set the border color box if not default.
      var m = style.match (/border-color\s*:\s*([^;]+)/);
      if (m) {
         var value = m[1];
         $ ('div.simpleColorDisplay').css ('background-color', value);
      }
   }
}


// -----------------------------------------------------------------------------
function adjust_edit_part ($part) {
   var part_html = $part.html ();

   // Don't know why an initial linefeed (^J) creeps in, but
   // get rid of it.
   part_html = part_html.replace (/\cJ/, '');

   var m = part_html.match ('<p>');
   if (m) {
      if (m.length == 1) {
         if (part_html.search (/^\s*<p>/) != -1) {
            part_html = part_html.replace (/<p>|<\/p>/g, '');
            $part.html (part_html);
         }
      }
   } else {

      // No <p> tag.  If there are </p> tags, delete.
      if (part_html.indexOf ('</p>')) {
         part_html = part_html.replace (/<\/p>/g, '');
         $part.html (part_html);
      }
   }
};


// -----------------------------------------------------------------------------
this.create_new_quiz = function () {

   // Set up empty quiz and initial data.
   var htm = [];

   htm.push ('[qwiz]');

   // Header.  Default: no header.  Reset in case left over from previous
   // discard.
   header_text = '';

   // Intro.  Default: no intro.
   intro_text = '';

   // No questions, initially.
   n_questions = 0;
   qw.unit_names  = [];
   qw.topic_names = [];

   // Exit text.
   htm.push ('[x]' + exit_placeholder);

   htm.push ('[/qwiz]');

   htm = htm.join ('\n');

   htm = qwiz_.process_qwiz_pair (htm, i_qwiz);

   $ ('#qwizard_result').html (htm);

   // Set up "Add new" and list of questions in accordion div.
   qw.questions_list_html ();

   // Hide intro and next button -- so just have blank card with border
   // anticipating first question.
   $ ('div.intro-qwiz' + i_qwiz).hide ();
   $ ('#next_button-qwiz' + i_qwiz).hide ();

   // Trigger "Add question".
   var position_el = $ ('#qwizard_questions')[0];
   qw.show_new_question_type_menu (position_el);
}


// -----------------------------------------------------------------------------
this.create_new_deck = function () {

   // Set up empty flashcard deck and initial data.
   var htm = [];

   htm.push ('[qdeck]');

   // No header initially.  Reset in case left over from previous discard.
   header_text = '';

   // No intro initially.  
   intro_text = '';

   // No cards, initially.
   n_questions = 0;
   qw.unit_names  = [];
   qw.topic_names = [];

   // Exit text.
   htm.push ('[x]' + exit_placeholder);

   htm.push ('[/qdeck]');

   htm = htm.join ('\n');

   qcard_.qwizard_b = true;
   htm = qcard_.process_qdeck_pair (htm, i_qwiz);

   $ ('#qwizard_result').html (htm);


   // Set up "Add new" and list of cards in accordion div.
   qw.cards_list_html ();

   // Hide intro entry fields -- just leave blank card with border anticipating
   // first card.
   $ ('#qcard_front-part1-qdeck' + i_qwiz + ', #qcard_front-part2-qdeck' + i_qwiz).hide ();

   // Trigger "Add card".
   var position_el = $ ('#qwizard_questions')[0];
   qw.show_new_question_type_menu (position_el);
}


// -----------------------------------------------------------------------------
this.new_multiple_choice_question = function () {

   // Called from "Choose new question type" menu.  Hide menu.
   $ ('#new_question_type_menu').hide ();

   i_question = n_questions;
   var question = new_multiple_choice_question_data (1);
   qw.questions_cards[i_question] = question;

   create_and_show_new_question (question.type);
}


// -----------------------------------------------------------------------------
this.new_show_me_question = function () {

   // Called from "Choose new question type" menu.  Hide menu.
   $ ('#new_question_type_menu').hide ();

   i_question = n_questions;
   var question = {}

   question.type           = 'show_me';
   question.n_choices      = 1;
   question.correct_choice = 0;
   question.choices_inline = false;

   // Question.
   question.question_text = question_placeholder (i_question+1);

   // Answer-choices and feedback.  Standard gray is too hard to see, but need
   // the class!
   question.choices   = ['[show_me_placeholder]'];
   question.feedbacks = [  '<span class="qwizard_placeholder">'
                         +    'Feedback for button click'
                         + '</span>&hairsp;'];

   qw.questions_cards[i_question] = question;

   create_and_show_new_question (question.type);
}


// -----------------------------------------------------------------------------
this.new_labeled_diagram_question = function () {

   // Called from "Choose new question type" menu.  Hide menu.
   $ ('#new_question_type_menu').hide ();

   i_question = n_questions;
   var question = {}

   question.type           = 'labeled_diagram';
   question.n_labels       = 1;
   question.labels_inline  = false;

   // Question.  Includes "canvas" -- including sample image and a label
   // and target.
   var q = [];
   var assoc_id = parseInt (new Date ().getTime ()/1000.0, 10);
   q.push ('<div class="qwizzled_canvas qwiz_editable qwiz-question">');
   q.push (   '[q]'
            + '<span class="qwizard_placeholder">'
            +    'Enter text'
            +    '<br />'
            +    '<span class="qwizard_smaller">'
            +       '(double-click to format)'
            +    '</span>'
            + '</span>&hairsp;');
   q.push (   '<br />');
   q.push (   '<div id="qwizzled_img_wrapper-' + assoc_id + '" class="qwizzled_image alignnone size-full wp-image-50" style="position: relative; width: 180px; height: 221px; margin: 0px;">');
   q.push (      '<div class="qwizzled_target-' + assoc_id + ' qwizzled_target qwizzled_border_class_dotted qwizzled_border_class_red qwizzled_border_class_width ui-draggable ui-draggable-handle ui-resizable" style="left: 156px; top: 11px; width: 120px; right: auto; height: 28px; bottom: auto; position: relative;">');
   q.push (      '</div>');
   q.push (      '<img class=" size-full wp-image-50" style="max-width: none; padding: 0px; border: 0px none;" width="180" height="221" src="' + qwizzled_plugin_url + 'images/sample_image.png" />');
   q.push (   '</div>');
   q.push (   '<p>');
   q.push (      '&emsp; &emsp;');
   q.push (   '</p>');
   q.push (   '<div style="clear: both;"></div>');
   q.push ('</div>');

   question.question_text = q.join ('');

   // Label.
   var l = [];
   l.push ('<div class="qwizzled_label qtarget_assoc' + assoc_id + '">');
   l.push (   '<span class="qwizzled_highlight_label qwiz_editable qwizzled_border_class_red qwizzled_border_class_dotted qwizzled_border_class_width">');
   l.push (      '[l]' + label_placeholder ());
   l.push (   '</span>');
   l.push ('</div>');
   
   question.labels = [l.join ('\n')];

   // Correct-placement feedback.
   question.feedback_corrects = [label_correct_feedback_placeholder (1)];

   // Incorrect-placement feedback.
   question.feedback_incorrects = [label_incorrect_feedback_placeholder (1)];

   qw.questions_cards[i_question] = question;

   create_and_show_new_question (question.type, true);

   // Feedback to qwizard user.
   var delay_feedback = function () {
      $ ('div.qwizzled_main_menu_feedback').html ('You can position and resize the target "drop zone" how you want in relation to the image.').show ().fadeOut (10000, 'easeInCubic');
   }
   setTimeout (delay_feedback, 500);
}


// -----------------------------------------------------------------------------
this.new_free_form_input_question_card = function () {

   // Called from "Choose new question type" menu.  Hide menu.
   $ ('#new_question_type_menu').hide ();

   i_question = n_questions;
   var question = {}

   question.type = 'textentry';
   if (qwiz_deck == 'qwiz') {
      question.n_choices = 3;
   } else {
      question.n_choices = 2;
   }

   // Question.
   question.question_text = question_placeholder (i_question+1, '[textentry]');

   // Answer-choices and feedback.
   // Correct-answer words.
   question.choices   = ['Enter word'];
   question.correct_choice_fs = [1];
   question.feedbacks = [free_form_feedback_placeholder ('correct')];

   if (qwiz_deck == 'qwiz') {

      // Incorrect-answer words.
      question.choices.push ('Enter word');
      question.correct_choice_fs.push (0);
      question.feedbacks.push (free_form_feedback_placeholder ('incorrect'));
   }

   // All other words.
   question.choices.push ('*');
   question.correct_choice_fs.push (0);
   question.feedbacks.push (free_form_feedback_placeholder ('default'));

   qw.questions_cards[i_question] = question;
   if (qwiz_deck == 'qwiz') {
      create_and_show_new_question (question.type);
   } else {
      create_and_show_new_card (question.type);
   }
}


// -----------------------------------------------------------------------------
this.new_hangman_question_card = function () {

   // Called from "Choose new question type" menu.  Hide menu.
   $ ('#new_question_type_menu').hide ();

   i_question = n_questions;
   var question = {}

   question.type = 'hangman';
   question.n_choices = 1;

   // Question.
   question.question_text = question_placeholder (i_question+1, '[hangman]');

   question.choices   = ['placeholder'];
   question.correct_choice_fs = [1];
   var feedback =  '<span class="qwizard_placeholder">'
                 +    'Feedback for hangman word(s)'
                 +    '<br />'
                 +    '<span class="qwizard_smaller">'
                 +       '(or leave blank for default)'
                 +    '</span>'
                 + '</span>&hairsp;';
   if (qwiz_deck == 'qwiz') {
      question.feedbacks = [feedback];
   } else {
      question.answer_text = feedback;
   }

   qw.questions_cards[i_question] = question;

   if (qwiz_deck == 'qwiz') {
      create_and_show_new_question (question.type);
   } else {
      create_and_show_new_card (question.type);
   }
}


// -----------------------------------------------------------------------------
this.new_one_letter_answer_question = function () {

   // Called from "Choose new question type" menu.  Hide menu.
   $ ('#new_question_type_menu').hide ();

   i_question = n_questions;
   var question = {}

   question.type = 'one_letter_answer';
   question.n_choices = 3;

   // Question.
   question.question_text = question_placeholder (i_question+1, '[textentry single_char="true"]');

   // Answer-choices and feedback.
   // Correct-answer words.
   question.choices   = ['Enter word'];
   question.correct_choice_fs = [1];
   question.feedbacks = [  '<span class="qwizard_placeholder">'
                         +    'Feedback for correct-answer letter(s) '
                         +    '<br />'
                         +    '<span class="qwizard_smaller">'
                         +       '(or leave blank for default)'
                         +    '</span>'
                         + '</span>&hairsp;'];

   // Incorrect-answer words.
   question.choices.push ('Enter word');
   question.correct_choice_fs.push (0);
   question.feedbacks.push ('<span class="qwizard_placeholder">'
                         +     'Feedback for incorrect-answer letter(s) '
                         +     '<span class="qwizard_smaller">'
                         +        '(or leave blank for default)'
                         +     '</span>'
                         +  '</span>&hairsp;');

   // All other words.
   question.choices.push ('*');
   question.correct_choice_fs.push (0);
   question.feedbacks.push ('<span class="qwizard_placeholder">'
                         +     'Feedback for any other letter '
                         +     '<span class="qwizard_smaller">'
                         +        '(or leave blank for default)'
                         +     '</span>'
                         +  '</span>&hairsp;');

   qw.questions_cards[i_question] = question;

   create_and_show_new_question (question.type);
}


// -----------------------------------------------------------------------------
this.new_information_only_question = function () {

   // Called from "Choose new question type" menu.  Hide menu.
   $ ('#new_question_type_menu').hide ();

   i_question = n_questions;
   var question = {}

   question.type = 'information_only';

   // Question.
   question.question_text =  '<span class="qwizard_placeholder">'
                           +    'Information'
                           +    '<br />'
                           +    '<span class="qwizard_smaller">'
                           +       '(enter text or &ldquo;Add Media&rdquo;; double-click to format)'
                           +    '</span>'
                           + '</span>';

   qw.questions_cards[i_question] = question;

   create_and_show_new_question (question.type);
}


// -----------------------------------------------------------------------------
this.new_simple_card = function () {

   // Called from "Choose new question type" menu.  Hide menu.
   $ ('#new_question_type_menu').hide ();

   i_question = n_questions;
   var question = {};

   question.type = 'simple_card';
   question.n_choices = 0;   // May be non-zero in case of [textentry].
   question.question_text = question_placeholder (i_question+1);
   question.answer_text = answer_placeholder (i_question+1);

   qw.questions_cards[i_question] = question;

   create_and_show_new_card (question.type);
}


// -----------------------------------------------------------------------------
this.new_free_form_optional_input_card = function () {

   // Called from "Choose new question type" menu.  Hide menu.
   $ ('#new_question_type_menu').hide ();

   i_question = n_questions;
   var question = {};

   question.type = 'optional_textentry';
   question.n_choices = 0;   // May be non-zero in case of [textentry].
   question.question_text = question_placeholder (i_question+1, '[textentry]');
   question.answer_text = answer_placeholder (i_question+1);

   qw.questions_cards[i_question] = question;

   create_and_show_new_card (question.type);
}


// -----------------------------------------------------------------------------
// Called from qwiz.js.
this.reset_show_me_button_text = function (ii_question) {
   if (qw.questions_cards[ii_question].type == 'show_me') {
      var text = qw.questions_cards[ii_question].choices[0];
      if (text.indexOf ('[show_me_placeholder]') != -1) {
         text = show_me_button_placeholder;
      }
      $ ('div#qwiz' + i_qwiz + '-q' + ii_question + ' button.show_the_answer').html (text)
   }
}


// -----------------------------------------------------------------------------
// Create quiz shortcodes text from data.
function qwiz_shortcodes_text () {
   if (debug[0]) {
      console.log ('[qwiz_shortcodes_text] n_questions:', n_questions);
   }
   var qwiz_text = [];

   // Open quiz, with options (attributes -- set in qwiz.js).
   var qwiz_shortcode = '[qwiz';
   if (qwiz_deck_attributes) {
      qwiz_shortcode += ' ' + qwiz_deck_attributes;
   }
   qwiz_shortcode += ']';
   qwiz_text.push (qwiz_shortcode);

   if (header_text) {
      var header_html = add_paragraph_tags ('[h]' + header_text);
      qwiz_text.push (header_html);
   }
   if (intro_text) {
      var intro_html = add_paragraph_tags ('[i]' + intro_text);
      qwiz_text.push (intro_html);
   }

   // Questions.  Global i_question used in question_shortcodes_text ().
   for (i_question=0; i_question<n_questions; i_question++) {
      qwiz_text.push (question_shortcodes_text (qw.questions_cards[i_question],
                                                true));
   }

   // Exit text, if any.
   if (exit_text) {
      var exit_html = add_paragraph_tags ('[x]' + exit_text);
      qwiz_text.push (exit_html);
   }

   // End qwiz.
   qwiz_text.push ('[/qwiz]');

   if (debug[1]) {
      console.log ('[qwiz_shortcodes_text] qwiz_text:', qwiz_text.join ('\n'));
   }
   return (qwiz_text.join ('\n'));
}


// -----------------------------------------------------------------------------
// Create quiz-question shortcodes html from data.
function question_shortcodes_text (question, default_f, do_not_use_labeled_diagram_html_b) {
   if (debug[0]) {
      console.log ('[question_shortcodes_text] question:', question);
   }
   htm = [];

   // Update question attributes.  If an attribute set, replace old; otherwise
   // add to end.
   var attributes = question.question_attributes;
   if (! attributes) {
      attributes = '';
   }
   if (typeof (question.unit) != 'undefined' && question.unit !== '') {
      attributes = attributes.replace (/\s*unit\s*=\s*"[^"]*"|$/, ' unit="' + question.unit + '"');
   }
   if (typeof (question.topic) != 'undefined' && question.topic !== '') {

      // "topic" or "topics".
      attributes = attributes.replace (/\s*topics*\s*=\s*"[^"]*"|$/, ' topic="' + question.topic + '"');
   }
   if (attributes && attributes.substr (0, 1) != ' ') {
      attributes = ' ' + attributes;
   }

   // ..........................................................................
   if (question.type == 'multiple_choice' || question.type == 'show_me') {

      // Question.  Place "[q]" shortcode after any opening tags.  Include
      // attributes.  "multiple_choice" attribute allows qwiz.js to distinguish
      // an in-progress single-choice question from a "show me" question.  Add if
      // not already there.
      if (question.type == 'multiple_choice') {
         if (attributes.indexOf ('multiple_choice') == -1) {
            attributes += ' multiple_choice="true"';
         }
      }
      var qtext = place_shortcode ('[q' + attributes + ']', question.question_text);
      qtext = add_paragraph_tags (qtext);
      htm.push (qtext);

      // Answer choices and feedback.
      var choices = [];
      for (var i_choice=0; i_choice<question.n_choices; i_choice++) {
         var star = i_choice == question.correct_choice ? '*' : '';
         var c = '[c' + star + ']';
         var choice = question.choices[i_choice];
         if (debug[0]) {
            console.log ('[question_shortcodes_text] choice:', choice);
         }
         if (question.choices_inline) {

            // Remove any paragraph, header, or break tags within choice text.
            choice = choice.replace (/<[ph][^>]*>|<\/[ph][1-6]{0,1}>|<br[^>]*>/g, ' ');
            choice = c + ' ' + choice + '&emsp;&emsp;';
         } else {
            choice = place_shortcode (c, choice);
            choice = add_paragraph_tags (choice);
         }
         choices.push (choice);

         if (! question.choices_inline) {
            var feedback = place_shortcode ('[f]', question.feedbacks[i_choice],
                                            default_f);
            feedback = add_paragraph_tags (feedback);
            choices.push (feedback);
         }
      }
      if (question.choices_inline) {
         for (var i_choice=0; i_choice<question.n_choices; i_choice++) {
            var choice = place_shortcode ('[f]', question.feedbacks[i_choice],
                                           default_f) + '\n';
            choice = add_paragraph_tags (choice);
            choices.push (choice);
         }
         htm.push (choices.join (''));
      } else {
         htm.push (choices.join (''));
      }
   // ..........................................................................
   } else if (question.type == 'labeled_diagram') {

      // If not a new labeled diagram, re-retrieve html, in case target
      // reposition did not trigger blur/save.
      if (! do_not_use_labeled_diagram_html_b) {
         update_labeled_diagram_question_text_from_html ();
      }

      htm.push ('<div class="qwizzled_question qwiz_editable">');
      htm.push (    question.question_text.replace (/\[q[^\]]*/, '[q' + attributes));
      htm.push ('</div>');


      for (var i_label=0; i_label <question.n_labels; i_label++) {

         // Label is already span in a div.  Don't add paragraph tags to this!
         htm.push (question.labels[i_label]);

         var feedback = place_shortcode ('[f*]', question.feedback_corrects[i_label], default_f);
         feedback = add_paragraph_tags (feedback);
         htm.push (feedback);

         feedback = place_shortcode ('[fx]', question.feedback_incorrects[i_label], default_f);
         feedback = add_paragraph_tags (feedback);
         htm.push (feedback);
      }
   // ..........................................................................
   } else if (question.type == 'textentry' || question.type == 'one_letter_answer') {

      // Question, including [textentry].  Replace textentry input element with
      // [textentry] shortcode.
      var qhtml;
      if (question.type == 'one_letter_answer') {
         qhtml = question.question_text.replace (/<input[^>]*>/, '[textentry single_char="true"]');
      } else {

         // DKTMP - KEEPING EXISTING ATTRIBUTES.
         var textentry_attributes = '';
         if (question.textentry_attributes) {
            textentry_attributes = ' ' + question.textentry_attributes;
         }
         var qhtml = question.question_text.replace (/<input[^>]*>/, '[textentry' + textentry_attributes + ']');
      }
      var qtext = place_shortcode ('[q' + attributes + ']', qhtml);
      qtext = add_paragraph_tags (qtext);
      htm.push (qtext);

      // Alternative answer words and feedback -- correct and incorrect.
      for (var i_choice=0; i_choice<question.n_choices; i_choice++) {
         var choice = question.choices[i_choice];
         var star = question.correct_choice_fs[i_choice] ? '*' : '';
         var c = '[c' + star + ']';
         choice = place_shortcode (c, choice);
         choice = add_paragraph_tags (choice);
         htm.push (choice);

         var feedback = place_shortcode ('[f]', question.feedbacks[i_choice],
                                         default_f);

         // If no feedback given for wildcard answer, create default.
         if (feedback === '' && choice == '*') {
            feedback = place_shortcode ('[f]', 'No, that\'s not correct.');
         }
         feedback = add_paragraph_tags (feedback);
         htm.push (feedback);
      }
   // ..........................................................................
   } else if (question.type == 'hangman') {

      // Question, including [hangman].  Replace hangman div -- if there -- with
      // [hangman] shortcode.  Find whole div.
      var qhtml = question.question_text;
      var div_pos = qhtml.indexOf ('<div class="qwiz_hangman');
      if (div_pos != -1) {
         var hangman_div = qqc.find_matching_block (qhtml.substr (div_pos));

         // DKTMP - KEEPING EXISTING ATTRIBUTES.
         var hangman_attributes = '';
         if (question.hangman_attributes) {
            hangman_attributes = ' ' + question.hangman_attributes;
         }
         qhtml = qhtml.replace (hangman_div, '[hangman' + hangman_attributes + ']');
      }
      var qtext = place_shortcode ('[q' + attributes + ']', qhtml);
      qtext = add_paragraph_tags (qtext)
      htm.push (qtext);

      // Word, within paragraph tags.
      var choice = place_shortcode ('[c]', question.choices[0]);
      choice = add_paragraph_tags (choice);
      htm.push (choice);

      // Feedback, within paragraph tags if none there..
      var feedback = place_shortcode ('[f]', question.feedbacks[0], default_f);
      feedback = add_paragraph_tags (feedback);
      htm.push (feedback);

   // ..........................................................................
   } else if (question.type == 'information_only') {
      var info_text = place_shortcode ('[q]', question.question_text);
      info_text = add_paragraph_tags (info_text);
      htm.push (info_text);
   }

   htm = htm.join ('\n');
   if (debug[0]) {
      console.log ('[question_shortcodes_text] htm:', htm);
   }

   return htm;
}


// -----------------------------------------------------------------------------
// Create flashcard deck shortcodes text from data.
function deck_shortcodes_text () {
   if (debug[0]) {
      console.log ('[deck_shortcodes_text] n_questions:', n_questions);
   }
   var deck_text = [];

   // Open quiz, with options (attributes) -- set in qwizcards.js.
   var deck_shortcode = '[qdeck';
   if (qwiz_deck_attributes) {
      deck_shortcode += ' ' + qwiz_deck_attributes;
   }
   deck_shortcode += ']';
   deck_text.push (deck_shortcode);

   if (header_text) {
      var header_html = place_shortcode ('[h]', header_text);
      header_html = add_paragraph_tags (header_html);
      deck_text.push (header_html);
   }
   if (intro_text) {
      if (intro_text.indexOf ('<span class="qwizard_placeholder">') == -1) {
         var intro_html = place_shortcode ('[i]', intro_text);
         intro_html = add_paragraph_tags (intro_html);
         deck_text.push (intro_html);
      }
   }

   // Questions.
   for (var i_question=0; i_question<n_questions; i_question++) {
      deck_text.push (card_shortcodes_text (qw.questions_cards[i_question]));
   }

   // Exit text, if any.
   if (exit_text) {
      var exit_html = place_shortcode ('[x]', exit_text);
      exit_html = add_paragraph_tags (exit_html);
      deck_text.push (exit_html);
   }

   // End deck.
   deck_text.push ('[/qdeck]');

   if (debug[0]) {
      console.log ('[deck_shortcodes_text] deck_text:', deck_text.join ('\n'));
   }
   return (deck_text.join ('\n'));
}


// -----------------------------------------------------------------------------
// Create flashcard shortcodes html from data.
function card_shortcodes_text (question, default_f) {
   if (debug[0]) {
      console.log ('[card_shortcodes_text] question:', question);
   }
   htm = [];

   // Update question attributes.  If an attribute set, replace old; otherwise
   // add to end.
   var question_attributes = question.question_attributes;
   if (! question_attributes) {
      question_attributes = '';
   }
   if (typeof (question.unit) != 'undefined' && question.unit !== '') {
      question_attributes = question_attributes.replace (/\s*unit\s*=\s*"[^"]*"|$/, ' unit="' + question.unit + '"');
   }
   if (typeof (question.topic) != 'undefined' && question.topic !== '') {

      // "topic" or "topics".
      question_attributes = question_attributes.replace (/\s*topics*\s*=\s*"[^"]*"|$/, ' topic="' + question.topic + '"');
   }
   if (question_attributes && question_attributes.substr (0, 1) != ' ') {
      question_attributes = ' ' + question_attributes;
   }

   // Card front, including [textentry].  Replace textentry input element with
   // [textentry] shortcode.
   var qhtml;
   if (question.question_text.indexOf ('textentry') != -1) {

      // DKTMP - KEEPING EXISTING ATTRIBUTES.
      var textentry_attributes = '';
      if (question.textentry_attributes) {
         textentry_attributes = ' ' + question.textentry_attributes;
      }
      qhtml = question.question_text.replace (/<input.*?textentry[^>]*>/, '[textentry' + textentry_attributes + ']');
      if (question_attributes && question_attributes.substr (0, 1) != ' ') {
         question_attributes = ' ' + question_attributes;
      }
      var card_front = place_shortcode ('[q' + question_attributes + ']', qhtml);
      card_front = add_paragraph_tags (card_front);
      htm.push (card_front);

      // Alternative answer words and feedback -- correct and incorrect.
      var i_delete_choices = [];
      for (var i_choice=0; i_choice<question.n_choices; i_choice++) {
         if (i_choice > 0) {

            // Flashcard: not first choice.  If still "Enter word", don't send
            // to qwizcards.js.  Set flag to update local data (below) to
            // reflect.
            if (question.choices[i_choice] == 'Enter word') {
               i_delete_choices.push (i_choice);
               continue;
            }

            // Also, if default (that is, any-other-word) choice ([c] *), and
            // card back is still placeholder, skip.
            if (question.choices[i_choice] == '*'
                  && question.feedbacks[i_choice].indexOf ('<span class="qwizard_placeholder">') != -1) {
               i_delete_choices.push (i_choice);
               continue;
            }
         }
         var star = question.correct_choice_fs[i_choice] ? '*' : '';
         var c = '[c' + star + ']';
         var choice = place_shortcode (c, question.choices[i_choice]);
         choice = add_paragraph_tags (choice);
         htm.push (choice);

         var feedback = place_shortcode ('[f]', question.feedbacks[i_choice],
                                         default_f);

         // If no feedback given for wildcard answer, create default.
         if (feedback === '' && choice == '*') {
            feedback = place_shortcode ('[f]', 'No, that\'s not correct.');
         }
         feedback = add_paragraph_tags (feedback);
         htm.push (feedback);
      }
      var n_delete_choices = i_delete_choices.length;
      for (ii=0; ii<n_delete_choices; ii++) {

         // Didn't send placeholder choice to qwizcards.js.  Update to reflect.
         i_delete_choice = i_delete_choices[ii];
         question.choices.splice (i_delete_choice, 1);
         question.correct_choice_fs.splice (i_delete_choice, 1);
         question.feedbacks.splice (i_delete_choice, 1);
         question.n_choices--;
      }
   } else if (question.question_text.indexOf ('hangman') != -1) {

      // DKTMP - hangman attributes.
      // ...
      var hangman_attributes = '';
      qhtml = question.question_text.replace (/<div class="qdeck_hangman[\s\S]*<\/div>/, '[hangman' + hangman_attributes + ']');
      var card_front = place_shortcode ('[q' + question_attributes + ']', qhtml);
      card_front = add_paragraph_tags (card_front);
      htm.push (card_front);

      var choice = place_shortcode ('[c*]', question.choices[0]);
      choice = add_paragraph_tags (choice);
      htm.push (choice);
   } else {
      qhtml = question.question_text;
      var card_front = place_shortcode ('[q' + question_attributes + ']', qhtml);
      card_front = add_paragraph_tags (card_front);
      htm.push (card_front);
   }

   // Card back.
   var card_back = '';
   if (! question.n_choices || question.type == 'hangman') {
      if (typeof (question.answer_text) != 'undefined') {
         card_back = place_shortcode ('[a]', question.answer_text);
         card_back = add_paragraph_tags (card_back);
      }
   }
   htm.push (card_back);

   htm = htm.join (' ');
   if (debug[0]) {
      console.log ('[card_shortcodes_text] htm:', htm);
   }

   return htm;
}


// -----------------------------------------------------------------------------
// Enclose in <p> and </p> if nothing like that there already (<br /> counts
// unless it's a placeholder).  But delete any unmatched </p> first.
function add_paragraph_tags (htm) {
   var pat = '<p|<h[1-6]';
   //if (htm.search ('qwizard_placeholder') == -1) {
   //   pat += '|<br';
   //}
   var re = new RegExp (pat);
   if (htm.search (re) == -1) {
      htm = htm.replace (/<\/p>|<\/h[1-6]>/g, '') 
      htm = '<p>' + htm + '</p>';
   } else {

      // If ends with unclosed <p> or <h*>, delete it.
      htm = htm.replace (/<(p|h[1-6])[^>]*>\s*$/, '');
   }

   return htm;
}


// -----------------------------------------------------------------------------
function place_shortcode (shortcode, htm, default_f) {

   // For default feedback: if flag set, and still placeholder, return nothing.
   // In case of labeled-diagram feedback, use a canned response.
   if (default_f) {
      if (htm.indexOf ('<span class="qwizard_placeholder">') != -1) {
         if (shortcode == '[f*]') {
            htm = qwiz_.canned_feedback (true);
         } else if (shortcode == '[fx]') {
            htm = qwiz_.canned_feedback (false);
         } else {
            return '';
         }
      }
   }

   // Place shortcode after any opening tags.  Match opening tags and the rest.
   // Always get four elements: 0: whole thing; 1: opening tags (or '');
   // 2: last opening tag (or "undefined"); 3: remaining text;
   // Don't do for placeholder or <img ...> tags.  Others?  DKTMP
   var m = htm.match (/\s*((<[^\/][^>]*>\s*)*)(.*)/);

   // Any images or placeholder in opening tags?  Set m[3] with last part of
   // m[1] before truncating m[1]!
   var i_pos = m[1].search (/<span class="qwizard_placeholder">|<img/);
   if (i_pos != -1) {
      m[3] = m[1].substr (i_pos) + m[3];
      m[1] = m[1].substr (0, i_pos);
   }

   // Include space for readability.
   return m[1] + shortcode + ' ' + m[3];
}


// -----------------------------------------------------------------------------
function new_multiple_choice_question_data (n_choices) {

   var question = {};

   question.type           = 'multiple_choice';
   question.n_choices      = n_choices;
   question.correct_choice = -1;
   question.choices_inline = false;

   // Question.
   question.question_text = question_placeholder (i_question+1);

   // Answer-choices and feedback.
   question.choices   = [];
   question.feedbacks = [];
   for (var i_choice=0; i_choice<n_choices; i_choice++) {
      new_answer_choice_data (question, i_choice);
   }

   return question;
}


// -----------------------------------------------------------------------------
function new_answer_choice_data (question, i_choice, only_if_placeholder_b) {

   // Answer choice.
   var do_choice_b = true;
   var do_feedback_b = true;
   if (only_if_placeholder_b && question.choices.length) {

      // Want to redo "first", "second", etc. in case renumbering.
      if (question.choices[i_choice].indexOf ('"qwizard_placeholder"') == -1) {
         do_choice_b = false;
      }
      if (question.feedbacks[i_choice].indexOf ('"qwizard_placeholder"') == -1) {
         do_feedback_b = false;
      }
   }
   if (do_choice_b) {
      question.choices[i_choice] = answer_choice_placeholder (i_choice+1);
   }

   // Feedback.
   if (do_feedback_b) {
      question.feedbacks[i_choice] = answer_choice_feedback_placeholder (i_choice+1);
   }
}


// -----------------------------------------------------------------------------
function update_labeled_diagram_question_text_from_html () {
   var $canvas = $ ('div.qwizzled_canvas-qwiz' + i_qwiz + '-q' + i_question);
   if (debug[0]) {
      console.log ('[update_labeled_diagram_question_text_from_html] $canvas:', $canvas);
   }

   // Make an exception: re-order (for one) may be redrawing quiz, but canvas
   // div hasn't been set yet.  Do only if there!
   if ($canvas.length) {
      var question_html = $canvas.html ();
      if (debug[0]) {
         console.log ('[update_labeled_diagram_question_text_from_html] question_html:', question_html);
      }

      // Per qwiz_editing_field_blur2 (), preface the inner HTML with canvas
      // div and "[q]" shortcode.  Include original or updated shortcode
      // attributes.  End with closing div.
      var preface = '<div class="qwizzled_canvas qwiz_editable qwiz-question">[q]';
      qw.questions_cards[i_question].question_text = preface + question_html + '</div>';
   }
}


// -----------------------------------------------------------------------------
function create_new_label_target_and_feedback (question, selected_label_assoc_id, i_label, before_f) {
   if (debug[0]) {
      console.log ('[create_new_label_target_and_feedback]');
   }

   // Current time as unique id to associate label and target.
   var new_assoc_id = parseInt (new Date ().getTime ()/1000.0, 10);

   // Pick a border style/color combination not already used.
   var bcolor;
   var bstyle;
   var ok_f = false;
   for (i_color=0; i_color<n_bcolors; i_color++) {
      bcolor = bcolors[i_color];
      for (i_style=0; i_style<n_bstyles; i_style++) {
         bstyle = bstyles[i_style];
         var selector = '#qwiz' + i_qwiz + '-q' + i_question + ' .qwizzled_border_class_' + bstyle + '.qwizzled_border_class_' + bcolor;
         if ($ (selector).length == 0) {
            ok_f = true;
            break;
         }
      }
      if (ok_f) {
         break;
      }
   }

   // Label.
   question.labels[i_label] = create_label_html (label_placeholder (), new_assoc_id, bcolor, bstyle);

   // New target.  Place at random offset direction from selected label.
   var position = $ ('div.qwizzled_target-' + selected_label_assoc_id).position ();

   var x = Math.random ();
   var offset = x < 0.5 ? -10 : 10;
   var new_left = Math.round (position.left) + offset;
   x = Math.random ();
   offset = x < 0.5 ? -18 : 18;
   var new_top  = Math.round (position.top + offset);

   var t = [];
   t.push ('<div class="qwizzled_target-' + new_assoc_id + ' qwizzled_target qwizzled_border_class_' + bstyle + ' qwizzled_border_class_' + bcolor + ' qwizzled_border_class_width ui-draggable ui-draggable-handle ui-resizable" style="left: ' + new_left + 'px; top: ' + new_top + 'px; width: 120px; right: auto; height: 28px; bottom: auto; position: relative;">');
   t.push (   '<div class="ui-resizable-handle ui-resizable-e" style="z-index: 105;">');
   t.push (   '</div>');
   t.push (   '<div class="ui-resizable-handle ui-resizable-s" style="z-index: 105;">');
   t.push (   '</div>');
   t.push (   '<div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 105;">');
   t.push (   '</div>');
   t.push ('</div>');
   target_html = t.join ('\n');

   // Add to question text in front of first target.
   var s = '<div class="qwizzled_target';
   question.question_text = question.question_text.replace (s, target_html + s);

   // Feedback for label placement.
   question.feedback_corrects[i_label] 
                               = label_correct_feedback_placeholder (i_label+1);

   question.feedback_incorrects[i_label]
                               = label_incorrect_feedback_placeholder (i_label+1);

   return new_assoc_id;
}


// -----------------------------------------------------------------------------
function create_label_html (label_text, assoc_id, bcolor, bstyle) {
   var l = [];
   l.push ('<div class="qwizzled_label qtarget_assoc' + assoc_id + '">');
   l.push (   '<span class="qwizzled_highlight_label qwiz_editable qwizzled_border_class_' + bcolor + ' qwizzled_border_class_' + bstyle + ' qwizzled_border_class_width">');
   l.push (      '[l]' + label_text);
   l.push (   '</span>');
   l.push ('</div>');

   return l.join ('\n');
}


// -----------------------------------------------------------------------------
function question_placeholder (i_question, textentry_hangman) {
   var question_card = qwiz_deck == 'qwiz' ? 'question' : 'card front';
   var htm =   '<span class="qwizard_placeholder">'
             +    qqc.number_to_ordinal_word (i_question, true) + ' ' + question_card + ' '
             +    '<br />'
             +    '<span class="qwizard_smaller">'
             +       '(enter text or &ldquo;Add Media&rdquo;; double-click to format)'
             +    '</span>'
             + '</span>';
   if (textentry_hangman == '[textentry single_char="true"]') {
      htm +=   '<br />'
             + '<br />'
             + textentry_hangman
             + '<br />'
             + ' &emsp; &emsp; ';
   } else if (textentry_hangman) {
      htm +=   ' &emsp; '
             + textentry_hangman + ' &emsp; ';
   }

   return htm;
}


// -----------------------------------------------------------------------------
function answer_placeholder (i_question, textentry_hangman) {

   // Flashcard back.
   var htm =   '<span class="qwizard_placeholder">'
             +    qqc.number_to_ordinal_word (i_question, true) + ' card back' + ' '
             +    '<br />'
             +    '<span class="qwizard_smaller">'
             +       '(enter text or &ldquo;Add Media&rdquo;; double-click to format)'
             +    '</span>'
             + '</span> &emsp;';
   if (textentry_hangman == '[textentry single_char="true"]') {
      htm +=   '<br />'
             + '<br />'
             + textentry_hangman
             + '<br />'
             + ' &emsp; &emsp; ';
   } else if (textentry_hangman == '[hangman]') {
      htm +=   ' &emsp; &emsp; [hangman] &emsp; ';
   }
   // (Allow qwizcards.js to add textentry echo on back when there is
   // [textentry] on front.)

   return htm;
}


// -----------------------------------------------------------------------------
function answer_choice_placeholder (i_choice) {
   var htm =   '<span class="qwizard_placeholder">'
             +    qqc.number_to_ordinal_word (i_choice, true) + ' answer choice'
             + '</span>&hairsp;';

   return htm;
}


// -----------------------------------------------------------------------------
function answer_choice_feedback_placeholder (i_choice) {
   var htm =   '<span class="qwizard_placeholder">'
             +    'Feedback for ' + qqc.number_to_ordinal_word (i_choice) + ' answer choice'
             +    '<br />'
             +    '<span class="qwizard_smaller">'
             +       '(or leave blank for default)'
             +    '</span>'
             + '</span>&hairsp;';

   return htm;
}


// -----------------------------------------------------------------------------
function free_form_feedback_placeholder (correct_incorrect_default) {
   var placeholder = '<span class="qwizard_placeholder">';
   if (qwiz_deck == 'qwiz') {
      if (correct_incorrect_default == 'correct') {
         placeholder +=    'Feedback for correct-answer word(s)';
      } else if (correct_incorrect_default == 'incorrect') {
         placeholder +=    'Feedback for incorrect-answer word(s)';
      } else {
         placeholder +=    'Feedback for any other word selection';
      }
   } else {
      if (correct_incorrect_default != 'default') {
         placeholder +=    'Card back for this user answer word';
      } else {
         placeholder +=    'Card back for any answer word not in &ldquo;Free-form input options&rdquo; list';
      }
   }
   placeholder    +=       '<br />'
                   +       '<span class="qwizard_smaller">'
                   +          '(or leave blank for default)'
                   +       '</span>'
                   + '</span>&hairsp;';

   return placeholder;
}


// -----------------------------------------------------------------------------
function label_placeholder () {
   var htm =   '<span class="qwizard_placeholder">'
             +    'Label'
             + '</span>&hairsp;';

   return htm;
}


// -----------------------------------------------------------------------------
function label_correct_feedback_placeholder (i_label) {
   var htm =   '<span class="qwizard_placeholder">'
             +    'Feedback for ' + qqc.number_to_ordinal_word (i_label) + ' label correct placement'
             +    '<br />'
             +    '<span class="qwizard_smaller">'
             +       '(or leave blank for default)'
             +    '</span>'
             + '</span>&hairsp;';

   return htm;
}


// -----------------------------------------------------------------------------
function label_incorrect_feedback_placeholder (i_label) {
   var htm =   '<span class="qwizard_placeholder">'
             +    'Feedback for ' + qqc.number_to_ordinal_word (i_label) + ' label incorrect placement'
             +    '<br />'
             +    '<span class="qwizard_smaller">'
             +       '(or leave blank for default)'
             +    '</span>'
             + '</span>&hairsp;';

   return htm;
}


// -----------------------------------------------------------------------------
function restart_quiz_button_html () {
   var button =   '<button class="qbutton qwiz_restart" onclick="qwiz_.restart_quiz (' + i_qwiz + ')">'
                +    'Take the quiz again'
                + '</button>';
   return button;
}


// -----------------------------------------------------------------------------
function restart_deck_button_html () {
   var button =   '<button class="qbutton" onclick="qcard.start_deck (' + i_qwiz + ')">'
                +    'Review this flashcard stack again'
                + '</button>';
   return button;
}


// -----------------------------------------------------------------------------
function create_and_show_new_question (question_type, do_not_use_labeled_diagram_html_b) {

   qw.questions_cards[i_question].unit  = '';
   qw.questions_cards[i_question].topic = '';

   qw.hide_editing_menus ();

   // Create question shortcodes.
   var question_text = question_shortcodes_text (qw.questions_cards[i_question],
                                                 false, do_not_use_labeled_diagram_html_b);

   // See if inserting or adding at end.
   if (i_insert_before != -1) {

      // Yes, inserting.  Same as reordering -- new question is currently at
      // end.
      n_questions++;
      reorder_questions_cards ('', '', i_insert_before);
      return false;
   }

   // Process, append after current last question.  If there is one question,
   // the current last question has index 0.
   qwiz_.set_qwizdata (i_qwiz, 'n_questions', n_questions + 1);
   var i_current_last_question = n_questions - 1;
   if (debug[0]) {
      console.log ('[create_and_show_new_question] i_current_last_question:', i_current_last_question);
   }

   var processed_htm = qwiz_.process_questions (question_text, '', i_qwiz, i_question);

   var current_last_question_selector = '#qwiz' + i_qwiz + '-q' + i_current_last_question;
   $ (current_last_question_selector).after (processed_htm);

   // Update Questions accordion panel.
   n_questions++;
   qw.questions_list_html ();

   // Update qwiz.js, hide intro, all questions, and summary; go to new
   // question.  (init_tinymce is called from qwiz.js, since we don't know here
   // when the html is added to the page.)
   $ ('#qwizard_result div.intro-qwiz' + i_qwiz).hide ();
   $ ('#qwizard_result div.qwizq').hide ();
   $ ('#qwizard_result #summary-qwiz' + i_qwiz).hide ();
   qwiz_.set_qwizdata (i_qwiz, 'i_question', i_question - 1);
   qwiz_.next_question (i_qwiz);

   // Display progress if adding to one-question quiz.
   if (n_questions == 2) {
      qwiz_.display_progress (i_qwiz);
   }

   // May not have done this: after "Start quiz", button is left-aligned and
   // says "Next question".
   $ ('#next_button-qwiz' + i_qwiz).css ('text-align', 'left');
   if (question_type != 'information_only') {
      $ ('#next_button_text-qwiz' + i_qwiz).html (qqc.T ('Next question'));
   }

   // If not labeled diagram, hide qwizzled editing menu, in case was there for
   // existing question.
   if (question_type != 'labeled_diagram') {
      $ ('#qwizzled_main_menu').hide ();
   }

   // If free-form input or hangman remove paragraph tags from both parts
   // (before and after [textentry] or [hangman]) of question-editing div.
   if (question_type == 'textentry' || question_type == 'hangman' || question_type == 'one_letter_answer') {
      $ ('#qwiz' + i_qwiz + '-q' + i_question + ' div.qwiz-question').each (function () {
         adjust_edit_part ($ (this));
      });
   }

   // If not multiple choice/free-form input/hangman, hide menu, in case there
   // from previous question.
   if (question_type != 'multiple_choice') {
      $ ('#multiple_choice_options_menu').hide ();
   }
   if (question_type != 'textentry' && question_type != 'one_letter_answer') {
      $ ('#free_form_options_menu').hide ();
   }
   if (question_type != 'hangman') {
      $ ('#hangman_options_menu').hide ();
   }
   if (question_type != 'show_me') {
      $ ('#show_me_options_menu').hide ();
   }

   if (question_type == 'multiple_choice') {

      // Multiple choice.  Open multiple-choice menu.  Since starts with just
      // one answer choice, set indicator and highlight it.
      qw.show_multiple_choice_options_menu ();
      i_current_answer_choice = 0;
      answer_choice_focus ();
   } else if (question_type == 'labeled_diagram') {

      // Labeled diagram: further initializations.  Also, show qwizzled editing
      // menu.  Editor instance is the editor for the "qwizzled_canvas" td.
      qwizzled.qwizard_b = true;
      if (debug[0]) {
         console.log ('[create_and_show_new_question] qwizzled.qwizard_b:', qwizzled.qwizard_b);
      }

      var qwizq = 'qwiz' + i_qwiz + '-q' + i_question;
      var $content = $ ('#' + qwizq);
      qwiz_.init_qwizzled2 ($content, i_qwiz, i_question);

      var ed = tinyMCE.get ('qwizzled_canvas-' + qwizq);
      qwizzled.question_attributes = qw.questions_cards[i_question].question_attributes;
      qwizzled.show_main_menu (ed, true);
      qwizzled.$edit_area = $content;

   } else if (question_type == 'textentry' || question_type == 'one_letter_answer') {
      var $content = $ ('#qwiz' + i_qwiz + '-q' + i_question);
      qwiz_.init_textentry_autocomplete ($content);

      // Also re-initialize onfocus event -- attribute apparently eaten by
      // tinyMCE (since texentry field is inside editing div).
      /* SHOULDN'T NEED THIS WITH THE FOLLOWING set_qwizdata ().
      $ ('#textentry-qwiz' + i_qwiz + '-q' + i_question).on ('focus', function (event) {
         if (debug[0]) {
            console.log ('[redraw_textentry_question > on (focus)] event:', event);
         }
         qwiz_.set_textentry_i_qwiz (event, $ (this)[0]);
      });
      */

      // Set textentry_i_qwiz.
      qwiz_.set_qwizdata (-1, 'textentry_i_qwiz', i_qwiz);

      // Create and show menu.
      qw.show_free_form_options_menu ();
   } else if (question_type == 'hangman') {

      // Create and show menu.
      qw.show_hangman_options_menu ();

      // Re-initialize onkeyup and hint onclick (tinymce eats).
      reinit_hangman_onkeyup ();
   }
}


// -----------------------------------------------------------------------------
function create_and_show_new_card (question_type) {

   qw.questions_cards[i_question].unit  = '';
   qw.questions_cards[i_question].topic = '';

   // Create card shortcodes.
   var card_text = card_shortcodes_text (qw.questions_cards[i_question]);


   // See if inserting or adding at end.
   if (i_insert_before != -1) {

      // Yes, inserting.  Same as reordering -- new card is currently at end.
      n_questions++;
      reorder_questions_cards ('', '', i_insert_before);
      return false;
   }

   // Process -- appends to deckdata after current last card.  If there is one
   // card, the current last card has index 0.
   qcard_.set_deckdata (i_qwiz, 'n_cards', n_questions + 1);
   var i_current_last_question = n_questions - 1;
   if (debug[0]) {
      console.log ('[create_and_show_new_card] i_current_last_question:', i_current_last_question);
   }

   qcard_.process_cards (card_text, i_qwiz, i_question);
   qcard_.start_deck2 (i_qwiz, i_question);
   n_questions++;

   // Select placeholder.
   qqc.select_placeholder ($ ('#qcard_front-part1-qdeck' + i_qwiz));

   // Update Questions accordion panel.
   qw.cards_list_html ();
   highlight_accordion_question (i_question);

   // If adding to one-question deck, display progress.
   if (n_questions == 2) {
      qcard_.display_progress (i_qwiz);
   }

   // If not free-form input/hangman, hide menu, in case there from previous
   // question.
   if (question_type != 'textentry' && question_type != 'one_letter_answer') {
      $ ('#free_form_options_menu').hide ();
   }
   if (question_type != 'show_me') {
      $ ('#show_me_options_menu').hide ();
   }
   if (question_type != 'hangman') {
      $ ('#hangman_options_menu').hide ();
   }

   if (question_type == 'textentry' || question_type == 'one_letter_answer') {
      qcard_.init_textentry_autocomplete (i_qwiz, i_question);

      // Set textentry_i_deck.
      qcard_.set_deckdata (-1, 'textentry_i_deck', i_qwiz);

      // Create and show menu.
      qw.show_free_form_options_menu ();
   } else if (question_type == 'hangman') {

      // Create and show menu.
      qw.show_hangman_options_menu ();

      // Re-initialize onkeyup and hint onclick (tinymce eats).
      reinit_hangman_onkeyup ();
   }

   // If free-form input or hangman remove paragraph tags from both parts
   // (before and after [textentry] or [hangman]) of question-editing div.
   if (question_type == 'textentry' || question_type == 'hangman' || question_type == 'one_letter_answer') {
      $ (    '#qcard_front-part1-qdeck' + i_qwiz
         + ', #qcard_front-part2-qdeck' + i_qwiz
         + ', #qcard_back-part1-qdeck' + i_qwiz
         + ', #qcard_back-part2-qdeck' + i_qwiz).each (function () {
                                                          adjust_edit_part ($ (this));
                                                       }
      );
   }
}


// -----------------------------------------------------------------------------
this.disable_browser_context_menu = function ($objs) {

   // Using right-click for something else -- e.g., start editing on labels
   // (since drag-and-drop seems to interfere, and right-click happens to work)
   // -- so disable browser context menu on these elements.

   // Called from qwiz.js, add_label ().
   if (debug[0]) {
      console.log ('[disable_browser_context_menu] $objs:', $objs);
   }
   $objs.contextmenu (function (e) {
                         return false;
                     });

   // Also, set up left- and right-click events: disable tooltip on drag,
   // disable dragging on right click (re-enabled on blur).  Also re-enabled
   // on drag stop (in qwiz_.init_drag_and_drop ()).
   $objs.mousedown (function (e) {
                       if (e.which == 1) {
                          var $this = $ (this);
                          if (debug[0]) {
                             console.log ('[disable_browser_context_menu > left-click] $this:', $this);
                          }
                          /* DEDRAG
                          if ($this.tooltip ('instance')) {
                             $this.tooltip ('disable');
                          }
                          if ($this.hasClass ('qwizzled_highlight_label')) {
                             $this.parents ('div.qwizzled_label').draggable ('enable');
                          } else {
                             $this.parent ().draggable ('enable');
                          }
                          */
                       } else if (e.which == 3) {
                          var $this = $ (this);
                          if (debug[0]) {
                             console.log ('[disable_browser_context_menu > right-click] $ (this):', $ (this));
                          }

                          // Remove placeholder if there.
                          //$this.find ('span.qwizard_placeholder').replaceWith ('&emsp; &emsp; &emsp;');

                          /* DEDRAG
                          if ($this.hasClass ('qwizzled_highlight_label')) {
                             $this.parents ('div.qwizzled_label').draggable ('disable');
                          } else {
                             $this.parent ().draggable ('disable');
                          }
                          */

                          // Reset cursor.
                          $this.css ({cursor: 'default'});
                       }
                    });

   // Re-enable tooltip.
   $objs.mouseup (function (e) {
                     if (debug[0]) {
                        console.log ('[disable_browser_context_menu > mouseup] e.which:', e.which);
                     }
                     if (e.which == 1) {
                        var $this = $ (this);
                        if ($this.tooltip ('instance')) {
                           $this.tooltip ('enable');
                        }
                        var $label_div = $this.parent ();
                        if ($label_div.draggable ('instance')) {
                           $label_div.draggable ('disable');
                        }
                     }
                  });
}


// -----------------------------------------------------------------------------
this.questions_list_html = function () {
   var m = [];

   var sortable = '';
   if (n_questions) {
      m.push ('Go to...');
      m.push ('<div id="qwizard_questions_sortable">');
   }
   if (n_questions > 1) {
      sortable = ' sortable';
   }

   // Loop over existing questions.
   for (var ii_question=0; ii_question<n_questions; ii_question++) {

      // If question has been entered, use first part of question (without
      // tags) as label.  If still placeholder or blank, just "Question n".
      var l = [];
      l.push ('&emsp; ');
      l.push ('' + (ii_question + 1) + '&ensp;');
      var question_text = qw.questions_cards[ii_question].question_text;
      question_text = placeholder_trim (question_text, ii_question);
      if (question_text) {

         // Take out tags, limit to set number of characters.
         l.push (clean_and_trim (question_text, ii_question));
      } else {
         if (n_questions == 1) {
            l.push ('First question');
         } else {
            l.push ('Question ' + qqc.number_to_word (ii_question + 1));
         }
      }
      l.push (  '&emsp;'
               + '(' + question_type (ii_question) + ')');

      // Unit input combobox.
      var u = [];
      u.push ('<div class="unit_combobox">');
      u.push (   '<select class="unit_topic_combobox">');
      var n_unit_names = qw.unit_names.length;
      for (var i=0; i<n_unit_names; i++) {
         u.push (   '<option>');
         u.push (      qw.unit_names[i]);
         u.push (   '</option>');
      }

      // Add "none" option.
      u.push (      '<option>');
      u.push (         '[none]');
      u.push (      '</option>');
      u.push (   '</select>');
      u.push ('</div>');

      // Topic input combobox.
      var t = [];
      t.push ('<div class="topic_combobox">');
      t.push (   '<select class="unit_topic_combobox">');
      var n_topic_names = qw.topic_names.length;
      for (var i=0; i<n_topic_names; i++) {
         t.push (   '<option>');
         t.push (      qw.topic_names[i]);
         t.push (   '</option>');
      }

      // Add "none" option.
      t.push (      '<option>');
      t.push (         '[none]');
      t.push (      '</option>');
      t.push (   '</select>');
      t.push ('</div>');

      // Highlight current question.
      var style = '';
      if (ii_question == i_question) {
         style = ' style="font-weight: bold;"';
      }

      // Question div.  Include add and delete icons (float right).
      m.push ('<div id="qwizard_menu_question-q' + ii_question + '" class="qwizard_menu_item qwizard_menu_question q' + ii_question + sortable + '" data-i_question="' + ii_question + '" onmousedown="qwizard.go_to_question (' + ii_question + ')"' + style + '>');
      m.push (   add_delete_buttons_html (ii_question, false));
      m.push (   '<div class="qwizard_menu_question_label">');
      m.push (      l.join (''));
      m.push (   '</div>');

      // Units and topics.
      m.push (   u.join ('\n'));
      m.push (   t.join ('\n'));

      m.push ('</div>');
   }
   var add_label = 'Add question';

   // Close sortable div.
   if (n_questions) {
      m.push ('</div>');
      add_label = 'Add new question at end (click green &ldquo;+&rdquo;, above right, to add earlier)';
   }

   // Add new question -- include add-icon, hide delete icon.
   m.push ('<div class="qwizard_menu_item" onmousedown="qwizard.show_new_question_type_menu (this)">');
   m.push (   add_delete_buttons_html (n_questions, true));
   m.push (   add_label);
   m.push ('</div>');

   if (debug[2]) {
      console.log ('[questions_list_html] m.join ():', m.join ('\n'));
   }
   $ ('#qwizard_questions').html (m.join ('\n'));

   // Make questions sortable.
   if (n_questions) {
      $ ('#qwizard_questions_sortable').sortable ({
         axis:          'y',
         containment:   '#qwizard_questions',
         stop:          reorder_questions_cards
      });
   }

   // Initialize unit and topic comboboxes.
   $ ('select.unit_topic_combobox').combobox ();

   // Set value of unit input box (created in place of select by combobox),
   // add data attribute so can tell question, and add change event action.
   $ ('#qwizard_questions div.qwizard_menu_question').each (function () {
      var ii_question = $ (this).data ('i_question');
      var unit = qw.questions_cards[ii_question].unit;
      var title = unit ? '' : 'Select an existing unit name or enter a new unit name'; 
      $ (this).find ('div.unit_combobox input')
         .val (unit)
         .data ('i_question', ii_question)
         .attr ('title', title)
         .attr ('placeholder', 'Unit')
         .css  ({width: '85px'})
         .on ('change', function () {

            // Change event - save input unit, update unit options.  Confirm if 
            // new.
            var ok_f = true;
            var input_unit = trim ($ (this).val ()).replace (/\s/g, '_');
            if (debug[0]) {
               console.log ('[unit on (\'change\')] input_unit:', input_unit);
            }
            if (! input_unit || input_unit == '[none]') {
               input_unit = '';
               $ (this).val ('');
            } else {
               var new_f = qw.unit_names.indexOf (input_unit) == -1;
               if (new_f) {
                  ok_f = confirm ('Do you want to create new unit "' + input_unit + '"?');
               }
            }
            var ii_question = $ (this).parents ('div.qwizard_menu_question').data ('i_question');
            if (ok_f) {
               qw.questions_cards[ii_question].unit = input_unit;

               // If this is a new option add to each select list.
               if (new_f) {
                  qw.unit_names.push (input_unit);
                  qw.unit_names.sort ();
                  $ ('div.unit_combobox select').each (function () {
                     var opts = $ (this)[0].options;
                     opts[opts.length] = new Option (input_unit);
                  });
               }
            } else {

               // Set back to previous value.
               $ (this).val (unit);
            }
         });
   });

   // Again for topic input.
   $ ('#qwizard_questions div.qwizard_menu_question').each (function () {
      var ii_question = $ (this).data ('i_question');
      var topic = qw.questions_cards[ii_question].topic;
      var title = topic ? '' : 'Select an existing topic name or enter a new topic name'; 
      $ (this).find ('div.topic_combobox input')
         .val (topic)
         .data ('i_question', ii_question)
         .attr ('title', title)
         .attr ('placeholder', 'Topic')
         .css  ({width: '85px'})
         .on ('change', function () {

            // Change event - save input topic, update topic options.  Confirm
            // if new.
            var ok_f = true;
            var new_f = false;
            var input_topic = trim ($ (this).val ()).replace (/\s/g, '_');
            if (debug[0]) {
               console.log ('[topic on (\'change\')] input_topic:', input_topic);
            }
            if (! input_topic || input_topic == '[none]') {
               input_topic = '';
               $ (this).val ('');
            } else {
               var new_f = qw.topic_names.indexOf (input_topic) == -1;
               if (new_f) {
                  ok_f = confirm ('Do you want to create new topic "' + input_topic + '"?');
               }
            }
            var ii_question = $ (this).parents ('div.qwizard_menu_question').data ('i_question');
            if (ok_f) {

               // If existing topic(s), see if add or replace.
               var existing_topics = qw.questions_cards[ii_question].topic;
               if (existing_topics) {
                  var add_f = confirm ('Do you want to add "' + input_topic + '" to existing topics "' + existing_topics + '"? (Cancel replaces all!)');
                  if (add_f) {
                     var topics = existing_topics + '; ' + input_topic;
                     qw.questions_cards[ii_question].topic = topics;
                     $ (this).val (topics);
                  } else {
                     qw.questions_cards[ii_question].topic = input_topic;
                  }
               } else {
                  qw.questions_cards[ii_question].topic = input_topic;
               }

               // If this is a new option add to each select list.
               if (new_f) {
                  qw.topic_names.push (input_topic);
                  qw.topic_names.sort ();
                  $ ('div.topic_combobox select').each (function () {
                     var opts = $ (this)[0].options;
                     opts[opts.length] = new Option (input_topic);
                  });
               }
            } else {

               // Set back to previous value.
               $ (this).val (topic);
            }
         });
   });

}


// -----------------------------------------------------------------------------
this.cards_list_html = function () {
   var m = [];

   var sortable = '';
   if (n_questions) {
      m.push ('Go to...');
      m.push ('<div id="qwizard_questions_sortable">');
   }
   if (n_questions > 1) {
      sortable = ' sortable';
   }

   // Loop over existing cards.
   for (var ii_question=0; ii_question<n_questions; ii_question++) {

      // If card has been entered, use first part of card (without
      // tags) as label.  If still placeholder or blank, just "Card n".
      var l = [];
      l.push ('&emsp; ');
      l.push ('' + (ii_question + 1) + '&ensp;');
      var question_text = qw.questions_cards[ii_question].question_text;
      question_text = placeholder_trim (question_text, ii_question);
      if (question_text) {

         // Take out tags, limit to set number of characters.
         l.push (clean_and_trim (question_text, ii_question));
      } else {
         if (n_questions == 1) {
            l.push ('First card');
         } else {
            l.push ('Card ' +  qqc.number_to_word (ii_question + 1));
         }
      }
      l.push (  '&emsp;'
               + '(' + question_type (ii_question) + ')');

      // Unit input combobox.
      var u = [];
      u.push ('<div class="unit_combobox">');
      u.push (   '<select class="unit_topic_combobox">');
      var n_unit_names = qw.unit_names.length;
      for (var i=0; i<n_unit_names; i++) {
         u.push (   '<option>');
         u.push (      qw.unit_names[i]);
         u.push (   '</option>');
      }

      // Add "none" option.
      u.push (      '<option>');
      u.push (         '[none]');
      u.push (      '</option>');
      u.push (   '</select>');
      u.push ('</div>');

      // Topic input combobox.
      var t = [];
      t.push ('<div class="topic_combobox">');
      t.push (   '<select class="unit_topic_combobox">');
      var n_topic_names = qw.topic_names.length;
      for (var i=0; i<n_topic_names; i++) {
         t.push (   '<option>');
         t.push (      qw.topic_names[i]);
         t.push (   '</option>');
      }

      // Add "none" option.
      t.push (      '<option>');
      t.push (         '[none]');
      t.push (      '</option>');
      t.push (   '</select>');
      t.push ('</div>');

      // Highlight current question.
      var style = '';
      if (ii_question == i_question) {
         style = ' style="font-weight: bold;"';
      }

      // Card div.  Include add and delete icons (float right).
      m.push ('<div id="qwizard_menu_question-q' + ii_question + '" class="qwizard_menu_item qwizard_menu_question q' + ii_question + sortable + '" data-i_question="' + ii_question + '" onmousedown="qwizard.go_to_card (' + ii_question + ')"' + style + '>');
      m.push (   add_delete_buttons_html (ii_question, false));
      m.push (   '<div class="qwizard_menu_question_label">');
      m.push (      l.join (''));
      m.push (   '</div>');

      // Units and topics.
      m.push (   u.join ('\n'));
      m.push (   t.join ('\n'));

      m.push ('</div>');
   }
   var add_label = 'Add card';

   // Close sortable div.
   if (n_questions) {
      m.push ('</div>');
      add_label = 'Add new card at end (click green &ldquo;+&rdquo;, above right, to add earlier)';
   }

   // Add new question -- include add-icon, hide delete icon.
   m.push ('<div class="qwizard_menu_item" onmousedown="qwizard.show_new_question_type_menu (this)">');
   m.push (   add_delete_buttons_html (n_questions, true));
   m.push (   add_label);
   m.push ('</div>');

   $ ('#qwizard_questions').html (m.join ('\n'));

   // Make cards sortable.
   if (n_questions) {
      $ ('#qwizard_questions_sortable').sortable ({
         axis:          'y',
         containment:   '#qwizard_questions',
         stop:          reorder_questions_cards
      });
   }

   // Initialize unit and topic comboboxes.
   $ ('select.unit_topic_combobox').combobox ();

   // Set value of unit input box (created in place of select by combobox),
   // add data attribute so can tell question, and add change event action.
   $ ('#qwizard_questions div.qwizard_menu_question').each (function () {
      var ii_question = $ (this).data ('i_question');
      var unit = qw.questions_cards[ii_question].unit;
      var title = unit ? '' : 'Select an existing unit name or enter a new unit name'; 
      $ (this).find ('div.unit_combobox input')
         .val (unit)
         .data ('i_question', ii_question)
         .attr ('title', title)
         .attr ('placeholder', 'Unit')
         .css  ({width: '85px'})
         .on ('change', function () {

            // Change event - save input unit, update unit options.  Confirm if 
            // new.
            var ok_f = true;
            var input_unit = trim ($ (this).val ()).replace (/\s/g, '_');
            if (debug) {
               console.log ('[unit on (\'change\')] input_unit:', input_unit);
            }
            if (! input_unit || input_unit == '[none]') {
               input_unit = '';
               $ (this).val ('');
            } else {
               var new_f = qw.unit_names.indexOf (input_unit) == -1;
               if (new_f) {
                  ok_f = confirm ('Do you want to create new unit "' + input_unit + '"?');
               }
            }
            var ii_question = $ (this).parents ('div.qwizard_menu_question').data ('i_question');
            if (ok_f) {
               qw.questions_cards[ii_question].unit = input_unit;

               // If this is a new option add to each select list.
               if (new_f) {
                  qw.unit_names.push (input_unit);
                  qw.unit_names.sort ();
                  $ ('div.unit_combobox select').each (function () {
                     var opts = $ (this)[0].options;
                     opts[opts.length] = new Option (input_unit);
                  });
               }
            } else {

               // Set back to previous value.
               $ (this).val (unit);
            }
         });
   });

   // Again for topic input.
   $ ('#qwizard_questions div.qwizard_menu_question').each (function () {
      var ii_question = $ (this).data ('i_question');
      var topic = qw.questions_cards[ii_question].topic;
      var title = topic ? '' : 'Select an existing topic name or enter a new topic name'; 
      $ (this).find ('div.topic_combobox input')
         .val (topic)
         .data ('i_question', ii_question)
         .attr ('title', title)
         .attr ('placeholder', 'Topic')
         .css  ({width: '85px'})
         .on ('change', function () {

            // Change event - save input topic, update topic options.  Confirm
            // if new.
            var ok_f = true;
            var new_f = false;
            var input_topic = trim ($ (this).val ()).replace (/\s/g, '_');
            if (debug) {
               console.log ('[topic on (\'change\')] input_topic:', input_topic);
            }
            if (! input_topic || input_topic == '[none]') {
               input_topic = '';
               $ (this).val ('');
            } else {
               var new_f = qw.topic_names.indexOf (input_topic) == -1;
               if (new_f) {
                  ok_f = confirm ('Do you want to create new topic "' + input_topic + '"?');
               }
            }
            var ii_question = $ (this).parents ('div.qwizard_menu_question').data ('i_question');
            if (ok_f) {

               // If existing topic(s), see if add or replace.
               var existing_topics = qw.questions_cards[ii_question].topic;
               if (existing_topics) {
                  var add_f = confirm ('Do you want to add "' + input_topic + '" to existing topics "' + existing_topics + '"? (Cancel replaces all!)');
                  if (add_f) {
                     var topics = existing_topics + '; ' + input_topic;
                     qw.questions_cards[ii_question].topic = topics;
                     $ (this).val (topics);
                  } else {
                     qw.questions_cards[ii_question].topic = input_topic;
                  }
               } else {
                  qw.questions_cards[ii_question].topic = input_topic;
               }

               // If this is a new option add to each select list.
               if (new_f) {
                  qw.topic_names.push (input_topic);
                  qw.topic_names.sort ();
                  $ ('div.topic_combobox select').each (function () {
                     var opts = $ (this)[0].options;
                     opts[opts.length] = new Option (input_topic);
                  });
               }
            } else {

               // Set back to previous value.
               $ (this).val (topic);
            }
         });
   });
}


// -----------------------------------------------------------------------------
this.unit_topic_selected = function (unit, unused, input_el) {
   unit = trim (unit);
   if (debug[0]) {
      console.log ('[unit_topic_selected] unit:', unit, 'input_el:', input_el);
   }
   var ii_question = $ (input_el).data ('i_question');
   if (! unit || unit == '[none]') {
      unit = '';

      // Combobox has to finish work first.  Closure.
      var delay_reset = function () {
         input_el.value = '';
      }
      setTimeout (delay_reset, 200);
   }

   qw.questions_cards[ii_question].unit = unit;
}

// -----------------------------------------------------------------------------
function add_delete_buttons_html (ii_question, add_at_end_f) {
   m = [];
   var question_card = qwiz_deck == 'qwiz' ? 'question' : 'card';

   // Don't show delete icon if add-at-end option.
   var style = '';
   var shift_icon = '';
   if (add_at_end_f) {
      style = 'style="visibility: hidden;"';
   } else {
      shift_icon = ' class="qwizard_shift_icon"';
   }
   m.push (   '<button class="qwiz_image_button" ' + style + ' onclick="qwizard.delete_question (event, ' + ii_question + ')" title="Delete this ' + question_card + '">');
   m.push (      '<img src="' + qwizzled_plugin_url + 'images/delete.png" class="qwizard_shift_icon" />');
   m.push (   '</button>');

   // Different action and title for add-at-end option.
   if (add_at_end_f) {
      m.push ('<button class="qwiz_image_button" title="Add new ' + question_card + ' at end">');
   } else {
      m.push ('<button class="qwiz_image_button" onclick="qwizard.insert_question (event, ' + ii_question + ')" title="Insert new ' + question_card + ' before this one">');
   }
   m.push (      '<img src="' + qwizzled_plugin_url + 'images/add_icon.png"' + shift_icon + ' />');
   m.push (   '</button>');

   return m.join ('\n');
}


// -----------------------------------------------------------------------------
function question_type (ii_question) {
   var type = qw.questions_cards[ii_question].type;
   if (debug[0]) {
      console.log ('[question_type] ii_question:', ii_question, ', type:', type);
   }
   var label;
   if (type == 'multiple_choice') {
      label = 'mult. choice';
   } else if (type == 'show_me') {
      label = '"show me..."';
   } else if (type == 'labeled_diagram') {
      label = 'labeled diagram';
   } else if (type == 'textentry') {
      label = 'free-form';
   } else if (type == 'hangman') {
      label = 'hangman';
   } else if (type == 'one_letter_answer') {
      label = 'one-letter answer';
   } else if (type == 'information_only') {
      label = 'information-only';
   } else if (type == 'simple_card') {
      label = 'simple flashcard';
   } else if (type == 'optional_textentry') {
      label = 'optional text input';
   }

   return label;
}


// -----------------------------------------------------------------------------
function new_question_type_menu_html () {
   var h = [];
   var m = [];

   h.push (   '<div class="qwizard_floating_menu_title">');
   if (qwiz_deck == 'qwiz') {
      h.push (   'Choose question type');
   } else {
      h.push (   'Choose flashcard type');
   }
   h.push (   '</div>');
   h.push (   '<button class="qwiz_image_button qwizard_icon_menu_exit" onclick="qwizard.cancel_new_question_type_menu ()">');
   h.push (      '<img src="' + qwizzled_plugin_url + 'images/icon_exit_red.png" />');
   h.push (   '</button>');
 
   if (qwiz_deck == 'qwiz') {
      m.push ('<div class="qwizard_menu_item" onclick="qwizard.new_multiple_choice_question ()" title="Create a multiple-choice question">');
      m.push (   'Multiple choice');
      m.push ('</div>');

      m.push ('<div class="qwizard_menu_item" onclick="qwizard.new_show_me_question ()" title="Create a &ldquo;Push button to see answer&rdquo; question">');
      m.push (   '&ldquo;Show me the answer&rdquo;');
      m.push ('</div>');

      m.push ('<div class="qwizard_menu_item" onclick="qwizard.new_labeled_diagram_question ()" title="Create a drag-and-drop question">');
      m.push (   'Labeled diagram');
      m.push ('</div>');

      m.push (   '<div class="qwizard_menu_item" onclick="qwizard.new_free_form_input_question_card ()" title="Create a fill-in-the-blank question">');
      m.push (      'Free-form input');
      m.push (   '</div>');

      m.push (   '<div class="qwizard_menu_item" onclick="qwizard.new_hangman_question_card ()" title="Create a hangman-entry style question">');
      m.push (      'Hangman');
      m.push (   '</div>');

      m.push (   '<div class="qwizard_menu_item" onclick="qwizard.new_one_letter_answer_question ()" title="Create an &rdquo;instant-multiple-choice&ldquo; question">');
      m.push (      'One-letter answer');
      m.push (   '</div>');

      m.push (   '<div class="qwizard_menu_item" onclick="qwizard.new_information_only_question ()" title="Create a &ldquo;question&rdquo; that just presents information and does not require an answer">');
      m.push (      'Information-only');
      m.push (   '</div>');
   } else {
      m.push ('<div class="qwizard_menu_item" onclick="qwizard.new_simple_card ()" title="Create a flashcard">');
      m.push (   'Simple card');
      m.push ('</div>');

      m.push ('<div class="qwizard_menu_item" onclick="qwizard.new_free_form_optional_input_card ()" title="Create a flashcard with a text box for the user&rsquo;s &ldquo;guess&rdquo;">');
      m.push (   'Card with optional text input');
      m.push ('</div>');

      m.push ('<div class="qwizard_menu_item" onclick="qwizard.new_free_form_input_question_card ()" title="Create a flashcard with a text box with drop-down suggestions list">');
      m.push (   'Card with required free-form input');
      m.push ('</div>');

      m.push (   '<div class="qwizard_menu_item" onclick="qwizard.new_hangman_question_card ()" title="Create a flashcard with hangman-style text entry">');
      m.push (      'Card with hangman input');
      m.push (   '</div>');
   }

   $ ('#new_question_type_menu div.qwizard_floating_menu_header').html (h.join ('\n'));
   $ ('#new_question_type_menu div.qwizard_floating_menu_body').html (m.join ('\n'));
}


// -----------------------------------------------------------------------------
this.show_new_question_type_menu = function (add_new_el) {

   // Show options for question type.  First hide any previous menus.
   qw.hide_editing_menus ();

   // Position new menu at "Add new" div.
   var $add_new_el = $ (add_new_el);
   var position  = $add_new_el.position ();
   var height_px = $add_new_el.height ();
   var left_px   = position.left;
   var top_px    = position.top;
   if (debug[0]) {
      console.log ('[show_new_question_type_menu] $add_new_el:', $add_new_el, ', left_px:', left_px, ', top_px:', top_px, ', height_px:', height_px);
   }
   $ ('#new_question_type_menu').css ({display: 'inline-block',
                                     left:    '' + left_px + 10 + 'px',
                                     top:     '' + (top_px  + height_px + 50) + 'px'
                                    });
}


// -----------------------------------------------------------------------------
function reorder_questions_cards (e, ui, local_i_insert_before) {
   if (debug[0]) {
      console.log ('[reorder_questions_cards] local_i_insert_before:', local_i_insert_before);
   }

   // Do nothing if user happened to drag the only question.
   if (n_questions == 1) {
      return false;
   }

   // Delay a bit, in case need blur of edited field to finish save.
   var delay_reorder = function () {

      var ii_new;

      // Inserting new question?  Move from current position -- at end.
      if (typeof (local_i_insert_before) != 'undefined') {
         ii_question = n_questions - 1;
         ii_new = local_i_insert_before;
         i_insert_before = -1;
         if (debug[0]) {
            console.log ('[reorder_questions_cards] ii_question:', ii_question, ', ii_new:', ii_new);
         }
      } else {

         // Get previous question number.
         var classnames = $ (ui.item).attr ('class');
         var m = classnames.match (/(^| )q([0-9]+)/);
         var ii_question = m[2];
         if (debug[0]) {
            console.log ('[reorder_questions_cards] ui.item:', ui.item);
            console.log ('[reorder_questions_cards] classnames:', classnames, ', ii_question:', ii_question);
         }

         // Hide any left-over menus.
         qw.hide_editing_menus ();

         // See where it is in new order.
         $ ('#qwizard_questions_sortable div.sortable').each (function (index) {
            var classnames = $ (this).attr ('class');
            var m = classnames.match (/(^| )q([0-9]+)/);
            var this_question = m[2];
            if (debug[0]) {
               console.log ('[reorder_questions_cards] classnames:', classnames, ', this_question:', this_question);
            }
            if (this_question == ii_question) {
               ii_new = index;

               // Exit each () loop.
               return false;
            }
         });
         if (debug[0]) {
            console.log ('[reorder_questions_cards] ii_new:', ii_new);
         }

         // If no change, do nothing.
         if (ii_new == ii_question) {
            return false;
         }
      }

      // Create new array (couldn't get splice () to work).
      var new_questions_cards = [];
      new_questions_cards[ii_new] = qw.questions_cards[ii_question];
      var n = qw.questions_cards.length;
      var ii = 0;
      for (var i=0; i<n; i++) {
         if (i != ii_question) {
            if (ii == ii_new) {
               ii++;
            }
            new_questions_cards[ii] = qw.questions_cards[i];
            ii++;
         }
      }
      if (debug[0]) {
         console.log ('[reorder_questions_cards] ii_new:', ii_new);
         /*
         var n = qw.questions_cards.length;
         for (var i=0; i<n; i++) {
            console.log ('i:', i, new_questions_cards[i].question_text, new_questions_cards[i].type);
         }
         */
      }
      qw.questions_cards = new_questions_cards;

      // If any question/card text is still placeholder, need to reset to
      // reflect reordered numbering.
      reset_placeholders ();

      // Redraw whole quiz/deck.
      redraw_qwiz_deck (ii_new);
   }
   setTimeout (delay_reorder, 200);
}


// -----------------------------------------------------------------------------
function reset_placeholders () {
   for (var i_question=0; i_question<n_questions; i_question++) {
      var question = qw.questions_cards[i_question];
      if (question.question_text.indexOf ('qwizard_placeholder') != -1) {
         var textentry_hangman = '';
         if (question.type == 'textentry' || question.type == 'hangman' ) {
            textentry_hangman = '[' + question.type + ']';
         } else if (question.type == 'one_letter_answer') {
            textentry_hangman = '[textentry single_char="true"]';
         } else if (question.type == 'optional_textentry') {
            textentry_hangman = '[textentry]';
         }
         if (question.type != 'labeled_diagram') {
            question.question_text = question_placeholder (i_question+1, textentry_hangman);
         }
      }
      if (qwiz_deck == 'deck') {
         if (! question.answer_text || question.answer_text.indexOf ('qwizard_placeholder') != -1) {
            if (question.type == 'hangman') {
               question.answer_text = answer_placeholder (i_question+1, '');
            } else {
               question.answer_text = answer_placeholder (i_question+1, textentry_hangman);
            }
         }
      }
   }
}


// -----------------------------------------------------------------------------
function redraw_qwiz_deck (local_i_question) {
   remove_editors ();
   if (typeof (local_i_question) == 'undefined') {
      if (n_questions > 0) {
         local_i_question = 0;
      }
   }
   if (qwiz_deck == 'qwiz') {
      var new_qwiz_text = qwiz_shortcodes_text ();
      var new_qwiz_html = qwiz_.process_qwiz_pair (new_qwiz_text, i_qwiz);
      $ ('#qwizard_result').html (new_qwiz_html);

      // Redraw questions list.
      qw.questions_list_html ();
      if (typeof (local_i_question) != 'undefined') {
         qw.go_to_question (local_i_question, true);
      }
   } else {
      var new_deck_text = deck_shortcodes_text ();
      var new_deck_html = qcard_.process_qdeck_pair (new_deck_text, i_qwiz);
      $ ('#qwizard_result').html (new_deck_html);

      // Initializations.
      qcard_.qdeck_init2 (1);

      // If any hangman or textentry questions, if just one paragraph tag
      // (presumably the default) inside the two question editing fields
      // (before and after [textentry] or [hangman]), and it's at the
      // beginning, remove the tag.
      $ ('div.qwiz-part1, div.qwiz-part2').each (function () {
         adjust_edit_part ($ (this));
      });

      // Redraw cards list.
      qw.cards_list_html ();
      if (typeof (local_i_question) != 'undefined') {
         qw.go_to_card (local_i_question, true);
      }
   }
}


// -----------------------------------------------------------------------------
this.insert_question = function (e, ii_question) {
   e.stopPropagation ();
   if (debug[0]) {
      console.log ('[insert_question] ii_question:', ii_question);
   }

   // Set (private) global.
   i_insert_before = ii_question;
   qw.show_new_question_type_menu ($ ('#qwizard_questions')[0]);

   return false;
}


// -----------------------------------------------------------------------------
this.delete_question = function (e, ii_question) {
   e.stopPropagation ();
   if (debug[0]) {
      console.log ('[delete_question] ii_question:', ii_question);
   }
   qw.hide_editing_menus ();

   qw.questions_cards.splice (ii_question, 1);
   n_questions--;

   // Re-do whole deck; display the question that had been after this, if there
   // is one.
   var i_display;
   if (n_questions) {
      if (ii_question < n_questions) {
         i_display = ii_question;
      } else {
         i_display = n_questions - 1;
      }
   } else {
      i_display = -1;
   }
   redraw_qwiz_deck (i_display);

   return false;
}


// -----------------------------------------------------------------------------
function free_form_options_menu_html (question) {
   var h = [];
   var m = [];

   h.push ('<div class="qwizard_floating_menu_title">');
   if (question.type == 'textentry') {
      h.push ('Free-form input options');
   } else {
      h.push ('One-letter-answer options');
   }
   h.push ('</div>');
 
   var word_letter = question.type == 'textentry' ? 'word' : 'letter';
   var feedback_card_back;
   if (qwiz_deck == 'qwiz') {
      feedback_card_back = 'feedback';
      m.push ('<div title="Alternative correct-answer ' + word_letter + 's (with same feedback) may be separated by semicolons">');
      m.push ('Correct-answer ' + word_letter + '(s)');
   } else {
      feedback_card_back = 'card back';
      m.push ('<div title="Alternative correct-answer ' + word_letter + 's (with same card back) may be separated by semicolons">');
      m.push ('Answer ' + word_letter + '(s)');
   }
   m.push (   '<img src="' + qwizzled_plugin_url + 'images/info_icon.png" class="qwizard_shift_icon" />');
   m.push ('</div>');

   // Correct-answer words.
   for (var i_choice=0; i_choice<question.n_choices; i_choice++) {
      if (qwiz_deck == 'deck' || question.correct_choice_fs[i_choice]) {
         var value = question.choices[i_choice];
         var highlight = '';
         if (value.replace (/\s|<[^>]+>/gm, '') == '*') {
            continue
         } else if (value.substr (0, 6) == 'Enter ') {
            value = '';
            highlight = 'style="background: yellow;" ';
         }
         value = qqc.encodeHtmlEntities (value);
         m.push ('<div id="qwizard_textentry_word-choice' + i_choice + '">');
         m.push (   '&emsp;<input type="text" ' + highlight + 'value="' + value + '" placeholder="Enter ' + word_letter + '" onfocus="qwizard.free_form_answer_word_focus (this, ' + i_choice + ')" onchange="qwizard.free_form_answer_word_entry (this, ' + i_choice + ')" />');

         // Button seems necessary to grab focus from edit area (at least in
         // Chrome) -- onclick just on image doesn't do it.
         m.push (   '<button class="qwiz_image_button" onmousedown="qwizard.show_free_form_word_feedback (' + i_choice + ')" title="Show ' + feedback_card_back + ' for this ' + word_letter + ' (or colon-separated ' + word_letter + 's)">');
         m.push (      '<img src="' + qwizzled_plugin_url + 'images/checkmark_icon.png" class="qwizard_shift_icon" />');
         m.push (   '</button>');
         m.push (   '<button class="qwiz_image_button" onmousedown="qwizard.add_free_form_word_feedback (' + i_choice + ')" title="Add new line - word(s) and ' + feedback_card_back + ' specific to these ' + word_letter + '(s)">');
         m.push (      '<img src="' + qwizzled_plugin_url + 'images/add_icon.png" class="qwizard_shift_icon" />');
         m.push (   '</button>');
         m.push ('</div>');
      }
   }

   if (qwiz_deck == 'qwiz') {
      m.push ('<div title="Alternative incorrect-answer ' + word_letter + 's (with same feedback) may be separated by semicolons">');
      m.push (   'Incorrect-answer ' + word_letter + '(s)');
      m.push (   '<img src="' + qwizzled_plugin_url + 'images/info_icon.png" class="qwizard_shift_icon" />');
      m.push ('</div>');

      // Incorrect-answer words.  If there isn't one besides the wildcard
      // (default) answer, add.
      var add_f = true;
      for (var i_choice=0; i_choice<question.n_choices; i_choice++) {
         if (question.correct_choice_fs[i_choice] == 0 
                                             && question.choices[i_choice] != '*') {
            add_f = false;
            break;
         }
      }
      if (add_f) {
         question.choices.push ('Enter ' + word_letter);
         question.correct_choice_fs.push (0);
         question.feedbacks.push ('<span class="qwizard_placeholder">'
                               +     'Feedback for incorrect-answer ' + word_letter + '(s)'
                               +     '<br />'
                               +     '<span class="qwizard_smaller">'
                               +        '(or leave blank for default)'
                               +     '</span>'
                               +  '</span>&hairsp;');
         question.n_choices++;
      }
      for (var i_choice=0; i_choice<question.n_choices; i_choice++) {
         if (! question.correct_choice_fs[i_choice] 
                                            && question.choices[i_choice] != '*') {
            var value = question.choices[i_choice];
            if (value.substr (0, 6) == 'Enter ') {
               value = '';
            }
            value = qqc.encodeHtmlEntities (value);
            m.push ('<div id="qwizard_textentry_word-choice' + i_choice + '">');
            m.push (   '&emsp;<input type="text" value="' + value + '" placeholder="Enter ' + word_letter + '" onfocus="qwizard.free_form_answer_word_focus (this, ' + i_choice + ')" onchange="qwizard.free_form_answer_word_entry (this, ' + i_choice + ')" />');

            m.push (   '<button class="qwiz_image_button" onmousedown="qwizard.show_free_form_word_feedback (' + i_choice + ')" title="Show feedback for this ' + word_letter + ' (or colon-separated ' + word_letter + 's)">');
            m.push (      '<img src="' + qwizzled_plugin_url + 'images/checkmark_icon.png" class="qwizard_shift_icon" />');
            m.push (   '</button>');
            m.push (   '<button class="qwiz_image_button" onmousedown="qwizard.add_free_form_word_feedback (' + i_choice + ')" title="Add new line - ' + word_letter + '(s) and feedback specific to these ' + word_letter + '(s)">');
            m.push (      '<img src="' + qwizzled_plugin_url + 'images/add_icon.png" class="qwizard_shift_icon" />');
            m.push (   '</button>');
            m.push ('</div>');
         }
      }
   }

   m.push ('<div class="qwizard_menu_item" onclick="qwizard.free_form_answer_word_entry (this, -1)">');
   m.push (   feedback_card_back[0].toUpperCase () + feedback_card_back.substr (1) + ' for any other answer ' + word_letter + 's');
   m.push ('</div>');


   $ ('#free_form_options_menu div.qwizard_floating_menu_header').html (h.join ('\n'));
   $ ('#free_form_options_menu div.qwizard_floating_menu_body').html (m.join ('\n'));
}


// -----------------------------------------------------------------------------
this.free_form_answer_word_focus = function (input_el, i_choice, go_to_back_f) {
   if (debug[0]) {
      console.log ('[free_form_answer_word_focus] input_el.value:', input_el.value);
   }

   // If value has been entered, place in textentry. and do equivalent of select
   // and "Check answer".  If any feedback is all-whitespace, replace with
   // placeholder.
   var question = qw.questions_cards[i_question];
   var n_choices = question.n_choices;
   var feedback = question.feedbacks[i_choice];

   // Take out tags.
   feedback = feedback.replace (/<[^>]+>/gm, '');
   if (feedback.search (/\S/) != -1) {

      // Signal no need to reset.
      feedback = '';
   } else {
      var choice = question.choices[i_choice];
      if (choice == '*') {
         feedback = free_form_feedback_placeholder ('default');
      } else if (question.correct_choice_fs[i_choice]) {
         feedback = free_form_feedback_placeholder ('correct');
      } else {
         feedback = free_form_feedback_placeholder ('incorrect');
      }
   }

   if (qwiz_deck == 'qwiz') {

      // Hide any previous feedback.
      var qwizq = 'qwiz' + i_qwiz + '-q' + i_question;
      $ ('#' + qwizq + ' .qwiz-feedback').hide ();

      if (feedback) {

         // Set editable span to feedback placeholder and re-initialize
         // removal.
         var $span = $ ('#qwiz' + i_qwiz + '-q' + i_question + '-a' + i_choice + ' span.qwiz-feedback-span');
         $span.html (feedback);
         var id = $span.attr ('id');
         init_remove_placeholder ('#' + id);
      }
      if (input_el.value) {
         var first_word = input_el.value.split (';')[0];
         $ ('input#textentry-' + qwizq).val (first_word);
      } else {
         $ ('input#textentry-' + qwizq).val ('');
      }
      qwiz_.item_selected ();
      qwiz_.textentry_check_answer (i_qwiz, false, i_choice);
   } else {
      if (input_el.value) {
         var first_word = input_el.value.split (';')[0];
         $ ('input#textentry-qdeck' + i_qwiz).val (first_word);
      } else {
         $ ('input#textentry-qdeck' + i_qwiz).val ('');
      }
      if (feedback) {
         if (debug[0]) {
            console.log ('[free_form_answer_word_focus] feedback:', feedback);
         }
         qw.questions_cards[i_question].feedbacks[i_choice] = feedback;
         qcard_.set_carddata (i_qwiz, i_question, 'feedback_htmls', feedback, i_choice);
         var selector = '#qcard_back-part1-qdeck' + i_qwiz;
         init_remove_placeholder (selector);
      }
      qcard_.item_selected ();
      var showing_front_b = qcard_.get_deckdata (i_qwiz, 'showing_front_b');
      if (showing_front_b) {
         if (go_to_back_f) {

            // Delay a little bit so textentry_set_card_back () will find
            // the word in the textentry input box.
            var delay_flip = function () {
               qcard_.flip (i_qwiz);
            }
            setTimeout (delay_flip, 100);
         }
      } else {
         if (! go_to_back_f) {
            qcard_.flip (i_qwiz);
         }
      }
   }
}


// -----------------------------------------------------------------------------
this.show_free_form_word_feedback = function (i_choice) {

   // Wait for redraw, if any (as a result of free_form_answer_word_entry ()
   // triggered by onchange event) to finish.
   var delay_focus = function () {
      var input_el = $ ('div#qwizard_textentry_word-choice' + i_choice + ' input')[0];
      if (debug[0]) {
         console.log ('[show_free_form_word_feedback > delay_focus] input_el:', input_el);
      }
      qw.free_form_answer_word_focus (input_el, i_choice, true);
   }

   // Note: this delay needs to be longer than qwizcards'
   // delay_set_container_width_height () delay.
   setTimeout (delay_focus, 500);
}


// -----------------------------------------------------------------------------
// Add word AND feedback.
this.add_free_form_word_feedback = function (i_choice) {
   if (debug[0]) {
      console.log ('[add_free_form_word_feedback] i_choice:', i_choice);
   }
   var i_start = i_choice + 1;

   // Insert array elements.
   qw.questions_cards[i_question].choices.splice (i_start, 0, 'Enter word');
   var correct_incorrect = 'correct';
   var correct_incorrect_f = 1;
   if (! qw.questions_cards[i_question].correct_choice_fs[i_choice]) {
      correct_incorrect = 'incorrect';
      correct_incorrect_f = 0;
   }
   qw.questions_cards[i_question].correct_choice_fs.splice (i_start, 0, correct_incorrect_f);

   var feedback =  '<span class="qwizard_placeholder">'
                 +    'Feedback for ' + correct_incorrect + '-answer word(s)'
                 +    '<br />'
                 +    '<span class="qwizard_smaller">'
                 +       '(or leave blank for default)'
                 +    '</span>'
                 + '</span>&hairsp;';
   qw.questions_cards[i_question].feedbacks.splice (i_start, 0, feedback);

   qw.questions_cards[i_question].n_choices++;

   if (qwiz_deck == 'qwiz') {
      redraw_textentry_question ();
   } else {
      redraw_textentry_card ();
   }

   // Reset html of floating menu.
   free_form_options_menu_html (qw.questions_cards[i_question])
}


// -----------------------------------------------------------------------------
this.free_form_answer_word_entry = function (input_el, i_choice) {
   if (debug[0]) {
      console.log ('[free_form_answer_word_entry] i_choice:', i_choice);
   }
   if (i_choice == -1) {

      // -1 indicates "wildcard" choice; i.e., "Show feedback for any other
      // word/letter."
      if (qwiz_deck == 'qwiz') {

         // Hide any previous feedback.
         var qwizq = 'qwiz' + i_qwiz + '-q' + i_question;
         $ ('#' + qwizq + ' .qwiz-feedback').hide ();

         // Show wildcard ([c] *) feedback.
         $ ('input#textentry-' + qwizq).val ('');
         qwiz_.item_selected ();
         qwiz_.textentry_check_answer (i_qwiz);
      } else {

         // If wildcard choice ([c] *) doesn't exist, add.
         var add_f = true;
         var question = qw.questions_cards[i_question];
         for (var i_choice=0; i_choice<question.n_choices; i_choice++) {
            if (question.choices[i_choice] == '*') {
               add_f = false;
               break;
            }
         }
         if (add_f) {
            question.choices.push ('*');
            question.correct_choice_fs.push (0);
            var feedback = free_form_feedback_placeholder ('default');
            question.feedbacks.push (feedback);

            // Also need to add to qwizcards.js data.
            qcard_.set_carddata (i_qwiz, i_question, 'choices', '*', question.n_choices);
            qcard_.set_carddata (i_qwiz, i_question, 'feedback_htmls', feedback, question.n_choices);

            question.n_choices++;
         }
         $ ('#textentry-qdeck' + i_qwiz).val ('');
         qcard_.item_selected ();
         qcard_.textentry_set_card_back (i_qwiz, i_question);
         var showing_front_b = qcard_.get_deckdata (i_qwiz, 'showing_front_b');
         if (showing_front_b) {
            qcard_.flip (i_qwiz);
         }
      }
   } else {

      // Save entry.
      var words = input_el.value;
      qw.questions_cards[i_question].choices[i_choice] = words;

      // Redraw -- so can redo setup of metaphone lists, etc.
      if (qwiz_deck == 'qwiz') {
         redraw_textentry_question (words);
      } else {
         redraw_textentry_card (words);
      }
   }
}


// -----------------------------------------------------------------------------
this.show_free_form_options_menu = function () {

   // Set and show options for textentry free-form input.
   free_form_options_menu_html (qw.questions_cards[i_question]);

   var left_px   = 550;
   var top_px    = 300;
   $ ('#free_form_options_menu').css ({display: 'inline-block',
                                       left:    '' + left_px + 'px',
                                       top:     '' + top_px  + 'px'
                                      }).show ();
}


// -----------------------------------------------------------------------------
function hangman_options_menu_html (question) {
   var h = [];
   var m = [];

   h.push ('<div class="qwizard_floating_menu_title">');
   h.push (   'Hangman input options');
   h.push ('</div>');
 
   m.push ('<div title="Hangman word or words">');
   m.push (   'Hangman word(s)');
   m.push ('</div>');

   // Hangman word.
   var value = question.choices[0];
   var highlight = '';
   if (value == 'placeholder') {
      value = '';
      highlight = 'style="background: yellow;" ';
   } else {
      value = qqc.encodeHtmlEntities (question.choices[0]);
   }
   m.push ('<div id="qwizard_hangman_word">');
   m.push (   '&emsp;<input type="text" ' + highlight + 'value="' + value + '" placeholder="Enter word(s)" onchange="qwizard.hangman_word_entry (this)" />');

   // Button seems necessary to grab focus from edit area (at least in
   // Chrome) -- onclick just on image doesn't do it.
   m.push (   '<button class="qwiz_image_button" onmousedown="qwizard.show_hangman_word_feedback ()" title="Show feedback for hangman word completion">');
   m.push (      '<img src="' + qwizzled_plugin_url + 'images/checkmark_icon.png" class="qwizard_shift_icon" />');
   m.push (   '</button>');
   m.push ('</div>');

   $ ('#hangman_options_menu div.qwizard_floating_menu_header').html (h.join ('\n'));
   $ ('#hangman_options_menu div.qwizard_floating_menu_body').html (m.join ('\n'));
}


// -----------------------------------------------------------------------------
this.show_hangman_options_menu = function () {

   // Set and show options for hangman.
   hangman_options_menu_html (qw.questions_cards[i_question]);

   var left_px   = 550;
   var top_px    = 300;
   $ ('#hangman_options_menu').css ({display: 'inline-block',
                                     left:    '' + left_px + 'px',
                                     top:     '' + top_px  + 'px'
                                    }).show ();
}


// -----------------------------------------------------------------------------
this.hangman_word_entry = function (input_el) {
   var words = input_el.value;
   if (debug[0]) {
      console.log ('[hangman_word_entry] words:', words);
   }

   // Save entry.
   qw.questions_cards[i_question].choices[0] = words;

   // Redraw -- so can redo setup of blanks, etc.
   if (qwiz_deck == 'qwiz') {
      redraw_hangman_question (words);
   } else {
      redraw_hangman_card (words);
   }
}


// -----------------------------------------------------------------------------
this.show_hangman_word_feedback = function () {
   if (qwiz_deck == 'qwiz') {

      // Wait for onchange (if any) to take effect.
      var delay_show = function () {
         var $feedback = $ ('#qwiz' + i_qwiz + '-q' + i_question + '-a0');
         $feedback.show ();
         if (debug[0]) {
            console.log ('[show_hangman_word_feedback > delay_show] $feedback:', $feedback);
         }
      }
      setTimeout (delay_show, 500);
   } else {

      // Wait here, too.
      var delay_flip = function () {
         var showing_front_b = qcard_.get_deckdata (i_qwiz, 'showing_front_b');
         if (showing_front_b) {
            qcard_.flip (i_qwiz);
         }
      }
      setTimeout (delay_flip, 500);
   }
}


// -----------------------------------------------------------------------------
this.go_to_question = function (local_i_question, force_f) {
   if (debug[0]) {
      console.log ('[go_to_question] i_question:', i_question, ', local_i_question:', local_i_question);
   }

   // Don't bother if already on this question.
   if (local_i_question == i_question && ! force_f) {
      return false;
   }

   // Delay all of this a little bit in case blurred a field that needs to
   // update current i_question.
   var delay_go_to_question_i_question = local_i_question;
   var delay_go_to_question = function () {

      // If multiple-question quiz, hide intro, reset "Start quiz" to
      // "Next question", etc.
      if (n_questions > 1) {
         qwiz_.next_question_from_intro (i_qwiz);
      }
      if (delay_go_to_question_i_question == -1) {
         var $intro_div = $ ('div.intro-qwiz' + i_qwiz);
         show_intro ($intro_div, qwiz_.no_intro_b[i_qwiz]);
      } else {

         i_question = local_i_question;

         // Hide intro, all questions, summary/exit.
         $ ('#qwizard_result div.intro-qwiz' + i_qwiz).hide ();
         $ ('#qwizard_result div.qwizq').hide ();
         $ ('#qwizard_result #summary-qwiz' + i_qwiz).hide ();
         qwiz_.set_qwizdata (i_qwiz, 'i_question', i_question - 1);
         qwiz_.next_question (i_qwiz);

         // Called by qwiz_.next_question ().
         //qw.go_to_question2 (true);
      }
   }
   setTimeout (delay_go_to_question, 100);
}


// -----------------------------------------------------------------------------
this.go_to_question2 = function (from_go_to_question_b) {
   if (debug[0]) {
      console.log ('[go_to_question2] i_question:', i_question);
   }
   qw.hide_editing_menus ();
   $ ('#next_button_text-qwiz' + i_qwiz).html ('Next question');

   // If new question is multiple choice, show menu and highlight first choice.
   var question_type = qw.questions_cards[i_question].type;
   if (question_type == 'multiple_choice') {
      qw.show_multiple_choice_options_menu ();
      i_current_answer_choice = 0;
      answer_choice_focus ();

   } else if (question_type == 'show_me') {
      $ ('#show_me_options_menu').show ();
      $ ('#' + document_qwiz_mobile + 'show_answer_got_it_or_not-qwiz' + i_qwiz + '-q' + i_question).hide ();

   } else if (question_type == 'labeled_diagram') {

      // Labeled diagram: set qwizzled.js edit area, show qwizzled editing
      // menu.
      var qwizq = 'qwiz' + i_qwiz + '-q' + i_question;
      var $qwizzled_main_menu = $ ('div#qwizzled_main_menu');
      if ($qwizzled_main_menu.length) {
         $ ('div#qwizzled_main_menu').show ();
      } else {
         var ed = tinyMCE.get ('qwizzled_canvas-' + qwizq);
         qwizzled.question_attributes = qw.questions_cards[i_question].question_attributes;
         qwizzled.show_main_menu (ed, true);
      }
      qwizzled.$edit_area = $ ('#' + qwizq);

      // Also, enable "Add Media" button, but with different label.
      $ ('button.qwizard_add_media').removeAttr ('disabled').html ('Change image');

   } else if (question_type == 'textentry' || question_type == 'one_letter_answer') {

      // Free-form input (including single-character input) -- redraw and show
      // options menu.  Show check-answer div.
      qw.show_free_form_options_menu ();
      $ ('div.textentry_check_answer_div').show ();

      // Set textentry_i_qwiz.
      qwiz_.set_qwizdata (-1, 'textentry_i_qwiz', i_qwiz);

   } else if (question_type == 'hangman') {

      // Hangman - redraw and show options menu.
      qw.show_hangman_options_menu ();

      // Re-establish onkeyup and hint onclick (tinymce eats).
      reinit_hangman_onkeyup ();

   } else if (question_type == 'information_only') {
      $ ('#next_button_text-qwiz' + i_qwiz).html ('Continue');
      var delay_show = function () {
         $ ('#qwiz' + i_qwiz + '-q' + i_question).show ();
      }
      setTimeout (delay_show, 100);
   }
   if (question_type != 'labeled_diagram') {

      // Start out with "Add Media" button disabled, standard label.
      $ ('button.qwizard_add_media').attr ('disabled', true).html ('Add Media');
   }

   // Make sure question accordion panel is open, and highlight this question.
   $ ('div.qwizard_accordion').accordion ('option', 'active', QUESTIONS_ACCORDION);
   highlight_accordion_question (i_question);

   // Select placeholder, if there.
   qqc.select_placeholder ($ ('#qwiz' + i_qwiz + '-q' + i_question + ' div.qwiz-question').first ());
}


// -----------------------------------------------------------------------------
this.go_to_card = function (local_i_question, force_f) {
   if (debug[0]) {
      console.log ('[go_to_card] i_question:', i_question, ', local_i_question:', local_i_question);
      console.log ('[go_to_card] current_editor:', current_editor);
   }

   // Clicking menu item doesn't seem to trigger editing-field blur event.  Do
   // those tasks now (update data here and in qwizcards.js, update cards list).
   // Do this first, that is, even if on same question -- counts as blur event.
   if (current_editor) {
      if (debug[0]) {
         console.log ('[go_to_card] current_editor.targetElm:', current_editor.targetElm);
      }
      if (current_editor.targetElm) {
         deck_editing_field_blur (current_editor.targetElm);
      }
   }

   // Don't bother if already on this question.
   if (local_i_question == i_question && ! force_f) {
      return false;
   }

   // Delay all of this a little bit in case blurred a field that needs to
   // update current i_question.
   var delay_go_to_card_i_question = local_i_question;

   // ....................................................
   var delay_go_to_card = function () {

      var $next_buttons = qcard_.get_deckdata (i_qwiz, '$next_buttons');
      if (delay_go_to_card_i_question == -1) {

         // Show introduction.
         var start_button_html = '<button id="start_button-qdeck' + i_qwiz + '" class="qbutton" onclick="qcard_.start_deck (' + i_qwiz + ')">Start reviewing cards</button>';
         var intro_html = intro_text.replace ('[start]', start_button_html);
         qcard_.set_editable_parts_front (i_qwiz, intro_html);
         var showing_front_b = qcard_.get_deckdata (i_qwiz, 'showing_front_b');
         if (! showing_front_b) {
            qcard_.flip (i_qwiz);
         }

         // Select placeholder, if there.
         qqc.select_placeholder ($ ('#qcard_front-part1-qdeck' + i_qwiz));

         // Don't show next buttons or progress.
         $next_buttons.html ('');
         var $progress_text = qcard_.get_deckdata (i_qwiz, '$progress_text');
         $progress_text.html ('&nbsp;');

         // Set question.
         i_question = -1;
      } else {

         // If next buttons not showing, set.
         if ($next_buttons.html ().search (/\S/ == -1)) {
            qcard_.set_next_buttons (i_qwiz);
         }
         qcard_.set_deckdata (i_qwiz, 'i_card', delay_go_to_card_i_question - 1);
         qcard_.next_card (i_qwiz);
         i_question = delay_go_to_card_i_question;
         qw.go_to_card2 ();
      }
   }

   // ....................................................
   setTimeout (delay_go_to_card, 100);
}


// -----------------------------------------------------------------------------
this.go_to_card2 = function () {
   if (debug[0]) {
      console.log ('[go_to_card2] i_question:', i_question);
   }
   qw.hide_editing_menus ();

   var question_type = qw.questions_cards[i_question].type;
   if (question_type == 'textentry' || question_type == 'one_letter_answer') {

      // Free-form input (including single-character input) -- redraw and show
      // options menu.  Show check-answer div.
      qw.show_free_form_options_menu ();
      $ ('div.textentry_check_answer_div').show ();

      // Set textentry_i_deck.
      qcard_.set_deckdata (-1, 'textentry_i_deck', i_qwiz);
   } else if (question_type == 'hangman') {

      // Hangman - redraw and show options menu.
      qw.show_hangman_options_menu ();

      // Re-establish onkeyup and hint onclick (tinymce eats).
      reinit_hangman_onkeyup ();
   }

   // Start out with "Add Media" button disabled, standard label.
   $ ('button.qwizard_add_media').attr ('disabled', true).html ('Add Media');

   if (options_accordion_f) {
      $ ('div.qwizard_accordion').accordion ('option', 'active', OPTIONS_ACCORDION);
   } else {

      // Make sure question accordion panel is open, and highlight this question.
      $ ('div.qwizard_accordion').accordion ('option', 'active', QUESTIONS_ACCORDION);
      highlight_accordion_question (i_question);
   }

   // Select placeholder, if there.
   qqc.select_placeholder ($ ('#qcard_front-part1-qdeck' + i_qwiz));
}


// -----------------------------------------------------------------------------
function reinit_hangman_onkeyup () {
   var hangman_answer = qw.questions_cards[i_question].choices[0];
   hangman_answer = hangman_answer.replace (/<[^>]+>|\n|&nbsp;/g, '');
   hangman_answer_length = hangman_answer.length;

   // 8192 = ensp.
   var input_value = new Array (hangman_answer_length).join (String.fromCharCode (8192));
   $ ('#qwiz' + i_qwiz + '-q' + i_question + ' div.qwiz_hangman input')
      .on ('keyup', function (event) {
         qwiz_.hangman_keyup ($ (this)[0], event, input_value, i_qwiz, i_question);
      });
   $ ('#qwiz' + i_qwiz + '-q' + i_question + ' div.qwiz_hangman button.hangman_hint')
      .on ('click', function (event) {
         qwiz_.hangman_hint (i_qwiz, i_question);
      });
}


// -----------------------------------------------------------------------------
this.hide_editing_menus = function () {
   if (debug[0]) {
      console.log ('[hide_editing_menus] i_question:', i_question);
   }
   $ ('#new_question_type_menu').hide ();
   $ ('#qwizzled_main_menu').hide ();
   $ ('div.textentry_check_answer_div').hide ();

   $ ('#multiple_choice_options_menu').hide ();
   $ ('#show_me_options_menu').hide ();
   $ ('#label_options_menu').hide ();
   $ ('#free_form_options_menu').hide ();
   $ ('#hangman_options_menu').hide ();
}


// -----------------------------------------------------------------------------
function highlight_accordion_question (local_i_question) {
   if (debug[0]) {
      console.log ('[highlight_accordion_question] local_i_question:', local_i_question);
   }

   // Highlight in Questions accordion panel.  First unhighlight others.
   $ ('#qwizard_questions_sortable > div.qwizard_menu_item').css ({'font-weight': 'normal'});
   $ ('#qwizard_questions_sortable > div.q' + local_i_question).css ({'font-weight': 'bold'});

   // Scroll into view, in case overflows window.  Position relative to
   // parent.  jQuery position () didn't work.
   if (n_questions > 8) {
      var $qwizard_questions_sortable = $ ('#qwizard_questions_sortable');
      if ($qwizard_questions_sortable.length) {
         var parent_offset   = $qwizard_questions_sortable.offset ();
         var $qwizard_menu_question = $ ('#qwizard_menu_question-q' + local_i_question);
         if  ($qwizard_menu_question.length) {
            var question_offset = $qwizard_menu_question.offset ();
            var diff_top = parseInt (question_offset.top - parent_offset.top);
            $ ('#qwizard_questions_sortable').scrollTop (diff_top);
         }
      }
   }
}


// -----------------------------------------------------------------------------
this.cancel_new_question_type_menu = function () {

   // Hide menu for question type.
   $ ('#new_question_type_menu').hide ();

   i_insert_before = -1;
}


// -----------------------------------------------------------------------------
function clean_and_trim (text, ii_question) {

   var question_type = qw.questions_cards[ii_question].type;
   if (question_type == 'hangman') {

      // If hangman div there, take out.
      var div_pos = text.search (/<div class="(qwiz|qdeck)_hangman/);
      if (div_pos != -1) {
         var hangman_div = qqc.find_matching_block (text.substr (div_pos));
         text = text.replace (hangman_div, ' ');
      } else {

         // Delete "[hangman]" and attributes, if there.
         text = text.replace (/\[hangman[^\]]*\]/, ' ');
      }
   } else if (   question_type == 'optional_textentry'
              || question_type == 'textentry'
              || question_type == 'one_letter_answer') {
      text = text.replace (/\[textentry[^\]]*\]/, ' ');

   } else if (question_type == 'labeled_diagram') {
      text = text.replace (/\[q[^\]]*\]/, '');
   }

   // Replace "<p>", "<h1>", etc., and <br />with space.
   text = text.replace (/<p>|<p [^>]+>|<h>|<h [^>]+>|<br[^>]*>/gm, ' ');

   // Delete remaining tags.
   text = text.replace (/<[^>]+>/gm, '');

   // Delete trailing whitespace and "&nbsp;" (replace non-breaking, etc. spaces
   // with regular space; trim).  &ensp; = u2003, &emsp; = u2003, &nbsp; = u00A0
   text = text.replace (/&nbsp;/g, ' ');
   text = trim (text.replace (/[\u2002\u2003\u00A0]/g, ' '));
   var len = text.length;
   if (len > 35) {
      text = text.substr (0, 35) + '...';
   }
   if (debug[0]) {
      console.log ('[clean_and_trim] text:', text);
      if (text.length) {
         console.log ('[clean_and_trim] text.charCodeAt (0):', text.charCodeAt (0));
      }
   }

   return text;
}


// -----------------------------------------------------------------------------
function placeholder_trim (text, ii_question) {
   if (text.indexOf ('"qwizard_placeholder') != -1) {
      text = '';
   } else {
      text = clean_and_trim (text, ii_question);
   }

   return text;
}


// -----------------------------------------------------------------------------
// IE 8 does not have trim () method for strings.
function trim (s) {
   if (s) {
      if ('a'.trim) {
         s = s.trim ();
      } else {
         s = s.replace (/^\s+|\s+$/g, '');
      }
   }

   return s;
}


// -----------------------------------------------------------------------------
this.show_multiple_choice_options_menu = function () {

   var h = [];
   var m = [];
   h.push ('<div class="qwizard_floating_menu_title">');
   h.push (   'Multiple-choice options');
   h.push ('</div>');
 
   m.push ('<div id="qwizard_correct_choice" class="qwizard_menu_item" onclick="qwizard.mark_correct_answer_choice (event)">');
   m.push (   '<input type="checkbox" class="qwizard_shift_icon" onclick="qwizard.mark_correct_answer_choice (event)" />');
   m.push (   '<span class="highlight_answer_choice">This choice</span> is the correct answer');
   m.push ('</div>');

   m.push ('<div class="qwizard_menu_item" onclick="qwizard.add_answer_choice (1)">');
   m.push (   'Add a new answer choice <b>before</b> <span class="highlight_answer_choice">this choice</span>');
   m.push ('</div>');

   m.push ('<div class="qwizard_menu_item" onclick="qwizard.add_answer_choice (0)">');
   m.push (   'Add a new answer choice <b>after</b> <span class="highlight_answer_choice">this choice</span>');
   m.push ('</div>');

   m.push ('<div id="delete_answer_choice" class="qwizard_menu_item" style="display: none;" onclick="qwizard.delete_answer_choice ()">');
   m.push (   'Delete <span class="highlight_answer_choice">this choice</span>');
   m.push ('</div>');

   var checked = qw.questions_cards[i_question].choices_inline ? '' : ' checked';
   m.push ('<div id="qwizard_choices_inline" class="qwizard_menu_item" onclick="qwizard.choices_inline (event)">');
   m.push (   '<input type="checkbox" class="qwizard_shift_icon" onclick="qwizard.choices_inline (event)"' + checked + ' />');
   m.push (   'Line-breaks between choices');
   m.push ('</div>');

   // Feedback.
   m.push ('<div id="multiple_choice_options_menu_feedback"></div>');

   $ ('#multiple_choice_options_menu div.qwizard_floating_menu_header').html (h.join ('\n'));
   $ ('#multiple_choice_options_menu div.qwizard_floating_menu_body').html (m.join ('\n'));
   $ ('#multiple_choice_options_menu').show ();
}


// -----------------------------------------------------------------------------
this.show_label_options_menu = function (assoc_id) {
   var $label = $ ('div.qtarget_assoc' + assoc_id + ' .qwizzled_highlight_label');
   var $labels = $ ('#qwiz' + i_qwiz + '-q' + i_question + ' .qwizzled_highlight_label');
   if (debug[0]) {
      console.log ('[show_label_options_menu] assoc_id:', assoc_id);
      console.log ('[show_label_options_menu] $label:', $label);
      console.log ('[show_label_options_menu] $labels:', $labels);
   }

   // Unhighlight other, highlight the label selected.
   $labels.removeClass ('highlight_selected_choice_label');
   $label.addClass ('highlight_selected_choice_label');

   var h = [];
   var m = [];
   h.push ('<div class="qwizard_floating_menu_title">');
   h.push (   'Label options');
   h.push ('</div>');
   h.push ('<img src="' + qwizzled_plugin_url + 'images/icon_exit_red.png" class="qwizard_icon_menu_exit" onclick="qwizard.exit_label_options_menu ()" />');
 
   m.push ('<div class="qwizard_menu_item" onclick="qwizard.add_label (\'' + assoc_id + '\', 1)">');
   m.push (   'Add a new label <b>before</b> <span class="highlight_answer_choice">this label</span>');
   m.push ('</div>');

   m.push ('<div class="qwizard_menu_item" onclick="qwizard.add_label (\'' + assoc_id + '\', 0)">');
   m.push (   'Add a new label <b>after</b> <span class="highlight_answer_choice">this label</span>');
   m.push ('</div>');

   if (qw.questions_cards[i_question].n_labels > 1) {
      m.push ('<div class="qwizard_menu_item" onclick="qwizard.delete_label (\'' + assoc_id + '\')">');
      m.push (   'Delete <span class="highlight_answer_choice">this label</span>');
      m.push ('</div>');
   }

   $ ('#label_options_menu div.qwizard_floating_menu_header').html (h.join ('\n'));
   $ ('#label_options_menu div.qwizard_floating_menu_body').html (m.join ('\n'));
   $ ('#label_options_menu').show ();
}


// -----------------------------------------------------------------------------
this.create_label_tooltips = function ($labels) {

   // Called from qwiz.js, add_label ().
   if (debug[0]) {
      console.log ('[create_label_tooltips] $labels:', $labels);
   }

   $labels.each (function () {
      if (debug[0]) {
         console.log ('[create_label_tooltips] $ (this):', $ (this));
      }

      // Get ID from wrapping div.  May not have target associated with it, yet.
      var classnames = $ (this).parents ('div.qwizzled_label').attr ('class');
      var m = classnames.match (/qtarget_assoc([0-9]+)/);
      if (m) {
         var assoc_id = m[1];
         var htm =  '<span style="line-height: 150%;">'
                  +    '(Right-click label to enter/edit text)'
                  +    '<br />'
                  +    '<a href="javascript: void (0);" onclick="qwizard.show_label_options_menu (\'' + assoc_id + '\')">'
                  +       'Label options'
                  +    '</a>'
                  + '</span>';
         interactive_tooltip ($ (this), htm, 'multiple_choice_tooltip');
      }
   });

   // Sometimes the tooltips start out open.  Close them.
   close_tooltips ();
}


// -----------------------------------------------------------------------------
// Create tooltip that stays on hover, can have clickable elements.
function interactive_tooltip ($obj, htm, tooltipClass) {
   if (debug[0]) {
      console.log ('[interactive_tooltip] $obj:', $obj);
   }
   if (! tooltipClass) {
      tooltipClass = '';
   }

   $obj.tooltip ({
      items:         'input[type="radio"], .qwiz_editable',
      content:       htm,
      position:      {my: 'left top+0'},
      show:          null, // Show immediately.
      tooltipClass:  tooltipClass,
      open:          function (event, ui) {
                        if (typeof (event.originalEvent) === 'undefined') {
                           return false;
                        }
                        // DEDRAG
                        console.log ('[tooltip open]');

                        // Close any lingering tooltips.
                        var $id = $ (ui.tooltip).attr ('id');
                        $ ('div.ui-tooltip').not ('#' + $id).remove ();

                        // Close this tooltip after a set time, even if still on
                        // target.  Store the timeout ID in the target element.
                        /*
                        console.log ('[interactive_tooltip > $ (this):', $ (this));
                        $ (this)[0].timeout_id = setTimeout (function () {
                           $ (ui.tooltip).hide ();
                        }, 1500);
                        */
                     },
      close:         function (event, ui) {
                        var target_el = $ (this)[0];
                        ui.tooltip.hover (function () {

                           console.log ('[interactive_tooltip > hover > $ (this):', $ (this));

                           // Hover on tooltip: don't fade it.
                           $ (this).stop (true).fadeTo (400, 1); 

                           // Also, clear the timeout, if any.
                           //clearTimeout (target_el.timeout_id);
                        },
                        function () {

                           // Regular close-the-tooltip event (left target).
                           $ (this).fadeOut ('400', function () {
                              $ (this).remove ();
                           });
                           console.log ('[tooltip close]');
                        });
                    }
   });
}


// -----------------------------------------------------------------------------
this.exit_label_options_menu = function () {
   $ ('#label_options_menu').hide ();

   // Reset highlighting of any selected labels.
   var $labels = $ ('#qwiz' + i_qwiz + '-q' + i_question + ' .qwizzled_highlight_label');
   $labels.removeClass ('highlight_selected_choice_label');

   // Close any open tooltips.
   //close_tooltips ();
}


// -----------------------------------------------------------------------------
function close_tooltips () {

   // Close any open tooltips.
   $tooltips = $ ('.choices-qwiz' + i_qwiz + '-q' + i_question).find ('.qwiz-choice.qwiz_editable');
   if (debug[0]) {
      console.log ('[close_tooltips] $tooltips:', $tooltips);
   }
   if ($tooltips.tooltip ('instance')) {
      $tooltips.tooltip ('close');
   }
}


// -----------------------------------------------------------------------------
this.add_answer_choice = function (before_f) {
   if (i_current_answer_choice == -1) {
      click_an_answer_choice ();
   } else {
      var i_start = i_current_answer_choice;
      if (! before_f) {
         i_start++;
      }

      // Insert array elements.
      qw.questions_cards[i_question].choices.splice (i_start, 0, '');
      qw.questions_cards[i_question].feedbacks.splice (i_start, 0, '');

      // Put data in those elements.
      new_answer_choice_data (qw.questions_cards[i_question], i_start);
      qw.questions_cards[i_question].n_choices++;

      // Adjust correct choice, if set.
      if (before_f) {
         if (qw.questions_cards[i_question].correct_choice >= i_current_answer_choice) {
            qw.questions_cards[i_question].correct_choice++;
         }
      } else {
         if (qw.questions_cards[i_question].correct_choice > i_current_answer_choice) {
            qw.questions_cards[i_question].correct_choice++;
         }
      }

      // Make newly-inserted answer choice the "currently selected."
      i_current_answer_choice = i_start;

      reset_choices (i_start);
   }
}


// -----------------------------------------------------------------------------
this.add_label = function (assoc_id, before_f) {
   if (debug[0]) {
      console.log ('[add_label] assoc_id:', assoc_id);
   }

   // Find label with this assoc_id.
   var i_label = find_label (assoc_id);
   var i_start = i_label;
   if (! before_f) {
      i_start++;
   }

   // Insert array elements.
   qw.questions_cards[i_question].labels.splice (i_start, 0, '');
   qw.questions_cards[i_question].feedback_corrects.splice (i_start, 0, '');
   qw.questions_cards[i_question].feedback_incorrects.splice (i_start, 0, '');

   // Create new label and target html.  Put data into inserted elements (just
   // above).  Before doing so, update question_text from editing field html,
   // in case target repositioned (doesn't trigger blur/save).
   update_labeled_diagram_question_text_from_html ();
   var new_assoc_id = create_new_label_target_and_feedback (qw.questions_cards[i_question], assoc_id, i_start, before_f);
   qw.questions_cards[i_question].n_labels++;
   redraw_qwizzled_question (new_assoc_id);

   // Feedback to qwizard user.
   var delay_feedback = function () {
      $ ('div.qwizzled_main_menu_feedback').html ('You can position and resize the target "drop zone" how you want in relation to the image.').show ().fadeOut (10000, 'easeInCubic');
   }
   setTimeout (delay_feedback, 500);
}


// -----------------------------------------------------------------------------
this.set_labels_position = function (top_left_right_bottom) {

   // Update labels= attribute.  If set, replace old; otherwise add to end.
   var question = qw.questions_cards[i_question];
   if (! question.question_attributes) {
      question.question_attributes = '';
   }
   question.question_attributes = question.question_attributes.replace (/\s*labels\s*=\s*"[^"]*"|$/, ' labels="' + top_left_right_bottom + '"');

   // Before redraw, update question_text from editing field html, in case
   // target repositioned (doesn't trigger blur/save).
   update_labeled_diagram_question_text_from_html ();
   redraw_qwizzled_question ();
}


// -----------------------------------------------------------------------------
function redraw_qwizzled_question (new_assoc_id) {

   // Remove editors on this question -- will be recreated with redraw
   // (init_tinymce () below, or called from qwiz.js if not present).
   remove_editors (i_question);

   // Have qwiz.js recreate question html.
   // Re-create question shortcodes, process, replace on page.
   var question_text = question_shortcodes_text (qw.questions_cards[i_question],
                                                 false, true);
   var processed_htm = qwiz_.process_questions (question_text, '', i_qwiz, i_question);
   var qwizq_id = 'div#qwiz' + i_qwiz + '-q' + i_question;
   var $qwizq_id = $ (qwizq_id);
   $qwizq_id.replaceWith (processed_htm);

   // replaceWith () appears to clobber the object.  Reset.
   $qwizq_id = $ (qwizq_id);
   $qwizq_id.show ();

   // Re-initialize editing and tooltips for this question's fields.
   qw.init_tinymce (qwizq_id + ' .qwiz_editable');

   // Reset qwizzled editor to new instance.
   $ ('.qwizzled_main_menu').remove ();
   var ed = tinyMCE.get ('qwizzled_canvas-qwiz' + i_qwiz + '-q' + i_question);
   qwizzled.question_attributes = qw.questions_cards[i_question].question_attributes;
   qwizzled.show_main_menu (ed, true);
   if (new_assoc_id) {
      qw.show_label_options_menu (new_assoc_id);
   } else {
      qw.exit_label_options_menu ();
   }

   var $labels = $qwizq_id.find ('.qwizzled_highlight_label');
   /* DEDRAG
   qw.create_label_tooltips ($labels);
   qw.disable_browser_context_menu ($labels);
   */
   $labels.addClass ('no_move');

   // Re-initialize dragging for targets.
   qwizzled.reinit_dragging ($qwizq_id);
}


// -----------------------------------------------------------------------------
function redraw_textentry_question (answer_words) {

   // Remove editors on this question -- will be recreated with redraw
   // (init_tinymce () below, or called from qwiz.js if not present).
   if (qwiz_deck == 'qwiz') {
      remove_editors (i_question);
   }

   // Have qwiz.js recreate question html.
   // Re-create question shortcodes, process, replace on page.
   var question_text = question_shortcodes_text (qw.questions_cards[i_question]);
   var processed_htm = qwiz_.process_questions (question_text, '', i_qwiz, i_question);
   var qwizq_id = 'div#qwiz' + i_qwiz + '-q' + i_question;
   $ (qwizq_id).replaceWith (processed_htm);

   // Go through display_question () to reset textentry metaphones, etc.
   if (debug[0]) {
      console.log ('[redraw_textentry_question] i_question:', i_question);
   }
   qwiz_.set_qwizdata (i_qwiz, 'i_question', i_question - 1);
   qwiz_.next_question (i_qwiz);

   // For some reason, didn't work in concatenated form.
   //$ (qwizq_id).show ();

   // Re-initialize textentry.
   var $content = $ ('#qwiz' + i_qwiz + '-q' + i_question);
   qwiz_.init_textentry_autocomplete ($content);


   // Remove paragraph tags from both parts (before and after [textentry]) of
   // question-editing div.
   $ ('#qwiz' + i_qwiz + '-q' + i_question + ' div.qwiz-question').each (function () {
      adjust_edit_part ($ (this));
   });

   // Also re-initialize onfocus event -- attribute apparently eaten by
   // tinyMCE (since texentry field is inside editing div).
   /*
   $ ('#textentry-qwiz' + i_qwiz + '-q' + i_question).on ('focus', function (event) {
      if (debug[0]) {
         console.log ('[redraw_textentry_question > on (focus)] event:', event);
      }
      qwiz_.set_textentry_i_qwiz (event, $ (this)[0]);
   });
   */

   // Set textentry_i_qwiz.
   qwiz_.set_qwizdata (-1, 'textentry_i_qwiz', i_qwiz);

   // Enter first answer word in textentry field and do "Check answer".
   if (answer_words) {
      var first_word = answer_words.split (';')[0];
      var qwizq = 'qwiz' + i_qwiz + '-q' + i_question;
      $textentry = $ ('input#textentry-' + qwizq);
      $textentry.val (first_word); //.focus ();

      var delay_check_answer = function () {
         if (debug[0]) {
            console.log ('[redraw_textentry_question > delay_check_answer]');
         }
         qwiz_.item_selected ();
         qwiz_.textentry_check_answer (i_qwiz);
      }
      setTimeout (delay_check_answer, 200);
   }
}


// -----------------------------------------------------------------------------
function redraw_textentry_card (answer_words) {

   // Have qwizcards.js recreate card html.
   // Re-create shortcodes, process, replace on page.
   var card_text = card_shortcodes_text (qw.questions_cards[i_question]);
   var processed_htm = qcard_.process_cards (card_text, i_qwiz, i_question);
   qcard_.start_deck2 (i_qwiz, i_question);
   if (debug[0]) {
      console.log ('[redraw_textentry_card] i_question:', i_question);
   }

   // Re-initialize textentry metaphones, etc.
   qcard_.init_textentry_autocomplete (i_qwiz, i_question);


   /*
   // Remove paragraph tags from both parts (before and after [textentry]) of
   // question-editing div.
   $ ('#qwiz' + i_qwiz + '-q' + i_question + ' div.qwiz-question').each (function () {
      adjust_edit_part ($ (this));
   });
   */

   // Set textentry_i_deck.
   qcard_.set_deckdata (-1, 'textentry_i_deck', i_qwiz);

   // Enter first answer word in textentry field and do flip".
   if (answer_words) {
      var first_word = answer_words.split (';')[0];
      $textentry = $ ('input#textentry-qdeck' + i_qwiz);
      $textentry.val (first_word); //.focus ();

      var delay_check_answer = function () {
         if (debug[0]) {
            console.log ('[redraw_textentry_card > delay_check_answer]');
         }
         qcard_.item_selected ();
      }
      setTimeout (delay_check_answer, 200);
   }
}


// -----------------------------------------------------------------------------
function redraw_hangman_question (answer_words) {

   // Remove editors on this question -- will be recreated with redraw
   // (init_tinymce () below, or called from qwiz.js if not present).
   remove_editors (i_question);

   // Have qwiz.js recreate question html.
   // Re-create question shortcodes, process, replace on page.
   var question_text = question_shortcodes_text (qw.questions_cards[i_question]);
   var processed_htm = qwiz_.process_questions (question_text, '', i_qwiz, i_question);
   var qwizq_id = 'div#qwiz' + i_qwiz + '-q' + i_question;
   $ (qwizq_id).replaceWith (processed_htm);
   if (debug[0]) {
      console.log ('[redraw_hangman_question] i_question:', i_question);
   }
   qwiz_.set_qwizdata (i_qwiz, 'i_question', i_question - 1);
   qwiz_.next_question (i_qwiz);

   // Re-establish onkeyup and hint onclick (tinymce eats).
   reinit_hangman_onkeyup ();

   // Remove paragraph tags from both parts (before and after [hangman]) of
   // question-editing div.
   $ ('#qwiz' + i_qwiz + '-q' + i_question + ' div.qwiz-question').each (function () {
      adjust_edit_part ($ (this));
   });
}


// -----------------------------------------------------------------------------
function redraw_hangman_card (answer_words) {

   // Have qwizcards.js recreate question html.
   // Re-create shortcodes, process, replace on page.
   var card_text = card_shortcodes_text (qw.questions_cards[i_question]);
   var processed_htm = qcard_.process_cards (card_text, i_qwiz, i_question);
   var qwizq_id = 'div#qwiz' + i_qwiz + '-q' + i_question;
   qcard_.start_deck2 (i_qwiz, i_question);
   /*
   qwiz_.set_qwizdata (i_qwiz, 'i_question', i_question - 1);
   qwiz_.next_question (i_qwiz);
   */

   // Re-establish onkeyup and hint onclick (tinymce eats).
   //reinit_hangman_onkeyup ();

   // Remove paragraph tags from both parts (before and after [hangman]) of
   // question-editing div.
   /*
   $ ('#qwiz' + i_qwiz + '-q' + i_question + ' div.qwiz-question').each (function () {
      adjust_edit_part ($ (this));
   });
   */
}


// -----------------------------------------------------------------------------
function reset_choices (i_start) {

   // If any fields still have placeholders, adjust to new choice number.
   if (typeof (i_start) != 'undefined') {
      for (var ii_choice=i_start; ii_choice<qw.questions_cards[i_question].n_choices; ii_choice++) {
         new_answer_choice_data (qw.questions_cards[i_question], ii_choice, true);
      }
   }

   // Remove editors on this question -- will be recreated with redraw
   // (init_tinymce () called from qwiz.js).
   remove_editors (i_question);

   // Re-create question shortcodes, process, replace on page.
   var question_text = question_shortcodes_text (qw.questions_cards[i_question]);
   var processed_htm = qwiz_.process_questions (question_text, '', i_qwiz, i_question);
   var qwizq_id = '#qwiz' + i_qwiz + '-q' + i_question;
   $ (qwizq_id).replaceWith (processed_htm);

   // replaceWith () clobbers object, so re-select.
   $ (qwizq_id).show ();

   // Re-initialize editing for this question's fields.
   qw.init_tinymce (qwizq_id + ' .qwiz_editable'); 

   // Redraw menu.
   qw.show_multiple_choice_options_menu ();

   // Highlight current choice.
   answer_choice_focus ();
}


// -----------------------------------------------------------------------------
this.delete_answer_choice = function () {
   if (i_current_answer_choice == -1) {
      click_an_answer_choice ();
   } else {

      // Delete array elements.
      qw.questions_cards[i_question].choices.splice (i_current_answer_choice, 1);
      qw.questions_cards[i_question].feedbacks.splice (i_current_answer_choice, 1);

      // Adjust correct choice if necessary.
      var correct_choice = qw.questions_cards[i_question].correct_choice;
      if (correct_choice != -1) {
         if (correct_choice == i_current_answer_choice) {
            correct_choice = -1;
         } else if (correct_choice > i_current_answer_choice) {
            correct_choice--;
         }
         qw.questions_cards[i_question].correct_choice = correct_choice;
      }
      qw.questions_cards[i_question].n_choices--;

      // Make choice after this -- or new last choice if this was last --
      // the new "current choice".
      if (i_current_answer_choice >= qw.questions_cards[i_question].n_choices) {
         i_current_answer_choice = qw.questions_cards[i_question].n_choices - 1;
      }

      reset_choices (i_current_answer_choice);
   }
}


// -----------------------------------------------------------------------------
this.delete_label = function (assoc_id) {

   // Find label with this assoc_id.
   var i_label = find_label (assoc_id);

   // Delete array elements.
   qw.questions_cards[i_question].labels.splice (i_label, 1);
   qw.questions_cards[i_question].feedback_corrects.splice (i_label, 1);
   qw.questions_cards[i_question].feedback_incorrects.splice (i_label, 1);

   qw.questions_cards[i_question].n_labels--;

   // Close menu, unhighlight selected label.
   qw.exit_label_options_menu ();

   // Remove the editor on this label.
   var id = $ ('.qtarget_assoc' + assoc_id + ' .qwiz_editable').attr ('id');
   var ed = tinyMCE.get (id);
   if (debug[0]) {
      console.log ('[delete_label] id:', id, ', ed:', ed);
   }
   if (ed) {
      ed.destroy ();
   }

   // Before redraw, update question_text from editing field html, in case
   // target repositioned (doesn't trigger blur/save).
   update_labeled_diagram_question_text_from_html ();
   redraw_qwizzled_question ();
}


// -----------------------------------------------------------------------------
function find_label (assoc_id) {

   // Find label with this assoc_id.
   var i_label;
   for (var ii_label=0; ii_label<qw.questions_cards[i_question].n_labels; ii_label++) {
      if (qw.questions_cards[i_question].labels[ii_label].indexOf (assoc_id) != -1) {
         i_label = ii_label;
         break;
      }
   }
   if (debug[0]) {
      console.log ('[find_label] assoc_id:', assoc_id, ', i_label:', i_label);
   }

   return i_label;
}


// -----------------------------------------------------------------------------
function remove_editors (ii_question) {
   current_editor = '';
   if (qwiz_deck == 'qwiz') {

      // Remove editors -- either all, or just this question -- will be
      // recreated with redraw (init_tinymce () called from qwiz.js).
      var selector = 'div.qwiz_editable';
      if (typeof (ii_question) != 'undefined') {
         selector = '#qwiz' + i_qwiz + '-q' + i_question + ' .qwiz_editable';
      }
   } else {
      var selector = 'div.qcard_editable';
   }
   $ (selector).each (function () {
      var id = $ (this).attr ('id');
      var ed = tinyMCE.get (id);
      if (debug[0]) {
         console.log ('[remove_editors] $ (this):', $ (this));
         console.log ('[remove_editors] id:', id, ', ed:', ed);
      }
      if (ed) {
         ed.destroy ();
      }
   });
}


// -----------------------------------------------------------------------------
this.mark_correct_answer_choice = function (e) {
   e.stopPropagation ();
   if (debug[0]) {
      console.log ('[mark_correct_answer_choice] e:', e);
   }
   if (i_current_answer_choice == -1) {
      click_an_answer_choice ();
   } else {

      // If this choice was previously marked as the correct answer, unmark it.  If
      // this choice is not currently marked as the correct answer, unmark all
      // and set this one.
      var $choice = $ ('span.choice-qwiz' + i_qwiz + '-q' + i_question + '-a' + i_current_answer_choice + ' .qwiz_editable');
      if (qw.questions_cards[i_question].correct_choice == i_current_answer_choice) {
         qw.questions_cards[i_question].correct_choice = -1;
         $ ('#qwizard_correct_choice input').prop ('checked', false);
         $choice.css ({'border': '1px dotted red'});
      } else {
         qw.questions_cards[i_question].correct_choice = i_current_answer_choice;
         $ ('#qwizard_correct_choice input').prop ('checked', true);
         var $choices = $ ('span.choices-qwiz' + i_qwiz + '-q' + i_question + ' .qwiz_editable');
         $choices.css ({'border': '1px dotted red'});
         $choice.css ({'border': '2px dotted green'});
      }
   }
}


// -----------------------------------------------------------------------------
function click_an_answer_choice () {
   $ ('#multiple_choice_options_menu_feedback').html ('Please click an anwser choice, then try again').show ();
}


// -----------------------------------------------------------------------------
this.choices_inline = function (e) {
   e.stopPropagation ();
   if (debug[0]) {
      console.log ('[choices_inline] e:', e);
   }

   // If choices with line breaks, switch flag, and vice-versa.
   if (! qw.questions_cards[i_question].choices_inline) {

      // Currently line-breaks.  Unset checkbox.
      qw.questions_cards[i_question].choices_inline = true;
      $ ('#qwizard_choices_inline').find ('input').prop ('checked', false);
   } else {

      // Currently inline.  Set checkbox.
      qw.questions_cards[i_question].choices_inline = false;
      $ ('#qwizard_choices_inline').find ('input').prop ('checked', true);
   }

   // Redraw choices.
   reset_choices ();
}


// -----------------------------------------------------------------------------
function discard_edit () {

   // Hide any open menus (so don't show up on re-open of qwizard dialog).
   qw.hide_editing_menus ();
   $ ('#register_qqs_dialog_box').hide ();
   $ ('#register_qqs_login').hide ();
   $ ('#register_qqs_main').hide ();

   var msg;
   var $qwizard_shortcodes = $ ('#qwizard_shortcodes');
   if ($qwizard_shortcodes.length && $qwizard_shortcodes.is (':visible')) {
      msg = 'Discard changes? (includes any made in Wizard as well as here!)';
   } else {
      msg = 'Discard changes? (no save)';
   }
   if (confirm (msg)) {

      // Remove all editors.
      remove_editors ();

      if (wp_editing_page_f) {

         // Remove bookmark (all, just in case).
         qwizzled.remove_bookmarks ();

         // Re-show main menu.
         var ed = qwizzled.qwizzled_tinymce_ed;
         qwizzled.qwizzled_tinymce_ed = '';
         qwizzled.qwizard_b = false;
         qwizzled.show_main_menu (ed, true);
      } else if (typeof (maker_id) != 'undefined' && maker_id 
                                                         && ! new_qwiz_deck_f) {

         // If shortcodes editor initiated, remove it, too.
         if (shortcode_ed) {
            shortcode_ed.destroy ();
            shortcode_ed = '';
         }
         $ ('#qwizard_shortcodes').html ('').hide ();
         $ ('div#qwizard_wrapper').show ();

         // Default header link.
         $ ('a.qwizard_view_edit_shortcodes').show ();
         $ ('a.qwizard_exit_view_edit_shortcodes').hide ();

         // Restore html -- need to add back wrapper -- on qwizard user page,
         // re-initialize quiz or deck.
         var htm =   '<div class="qwiz_wrapper qdeck_wrapper qwiz_shortcodes_hidden">'
                   +    qwizard_qwiz_deck_text
                   + '</div>';
         $ ('#qwizard_qwiz_deck_div').html (htm);
         if (qwiz_deck == 'qwiz') {
            qwiz_.qwizard_b = false;
            qwiz_.qwiz_init (true);
         } else {
            qcard_.qwizard_b = false;
            qcard_.set_deckdata (i_qwiz, 'click_flip_b', true);
            qcard_.qdeck_init (true);
         }
      }

      if (! wp_editing_page_f) {
         $ (window).off ('beforeunload');
      }
      $dialog_qwizard.dialog ('close');
   }
}


// -----------------------------------------------------------------------------
function qwizard_save_and_exit () {

   // Run whole quiz/deck through processing, see if any errors (set at end of
   // process_qwiz_pair ()).
   var $qwizard_shortcodes = $ ('#qwizard_shortcodes');
   if (qwiz_deck == 'qwiz') {
      if (n_questions == 0) {
         alert ('You haven\'t added any questions, yet');
         return false;
      }

      // If was editing shortcodes, use those directly.
      var new_text;
      if ($qwizard_shortcodes.length && $qwizard_shortcodes.is (':visible')) {
         new_text = $ ('#qwizard_shortcodes').html ();
      } else {
         new_text = qwiz_shortcodes_text ();
      }
      qwiz_.set_qwizdata (-1, 'errmsgs', '[]');
      qwiz_.process_qwiz_pair (new_text, i_qwiz);

      // Also check if any multiple-choice questions have only one choice.
      for (var i_question=0; i_question<n_questions; i_question++) {
         var question = qw.questions_cards[i_question];
         if (question.type == 'multiple_choice') {
            if (question.n_choices == 1 ) {
               qw.errmsgs.push ('Multiple-choice question has only one answer-choice (question ' + (i_question + 1) + ')');
            }
         }
      }
   } else {
      if (n_questions == 0) {
         alert ('You haven\'t added any cards, yet');
         return false;
      }

      // If was editing shortcodes, use those directly.
      var new_text;
      if ($qwizard_shortcodes.length && $qwizard_shortcodes.is (':visible')) {
         new_text = $ ('#qwizard_shortcodes').html ();
      } else {
         new_text = deck_shortcodes_text ();
      }
      qcard_.set_deckdata (-1, 'errmsgs', '[]');
      qcard_.process_qdeck_pair (new_text, i_qwiz);
   }

   if (qw.errmsgs.length) {
      var s = qw.errmsgs.length > 1 ? 's' : '';
      var ok_f = confirm (  'Error' + s + ' found:\n\n'
                          + qw.errmsgs.join ('\n') + '\n\n'
                          + 'Proceed anyway? (hit cancel to go back and fix first)');
      qw.errmsgs = '';
      if (! ok_f) {
         return false;
      }
   }

   // Remove all editors.
   remove_editors ();

   if (wp_editing_page_f) {

      // Send shortcode version back to qwizzled -- replace bookmark.
      qwizzled.qwizard_update_edit_area (new_text, new_qwiz_deck_f);

      // Close modal window, re-show main menu.
      $dialog_qwizard.dialog ('close');
      var ed = qwizzled.qwizzled_tinymce_ed;
      qwizzled.qwizzled_tinymce_ed = '';
      qwizzled.qwizard_b = false;
      qwizzled.show_main_menu (ed, true);
   } else {

      // QWizard on regular page (not WordPress editing).  Save to qwizcards
      // user directory.  Login or create maker account if not already logged
      // in.
      $dialog_qwizard.dialog ('close');

      // If shortcodes editor initiated, remove it, too.
      if (shortcode_ed) {
         shortcode_ed.destroy ();
         shortcode_ed = '';
      }
      $ ('#qwizard_shortcodes').html ('').hide ();
      $ ('div#qwizard_wrapper').show ();

      // Back to default header link.
      $ ('a.qwizard_view_edit_shortcodes').show ();
      $ ('a.qwizard_exit_view_edit_shortcodes').hide ();

      // If logged in and new quiz or deck (not an update), first do dialog
      // for user to enter directory name and page name; otherwise replace
      // existing page html.
      // If not logged in, do that first.
      // In all cases, need to pass quiz/deck html ("new_text").  Use form to do
      // post.  Global (document) variable maker_id set in qwizard.php.
      if (typeof (maker_id) != 'undefined' && maker_id) {
         if (new_qwiz_deck_f) {
            $ (window).off ('beforeunload');
            go_to_dialog_create_page (new_text);
         } else {
            if (qwiz_deck == 'qwiz') {
               qwiz_.qwizard_b = false;
            } else {
               qcard_.qwizard_b = false;
               qcard_.set_deckdata (i_qwiz, 'click_flip_b', true);
            }

            // Same as create_page, but replace existing.
            go_to_create_page (new_text, qwizard_page);
         }
      } else {
         $ (window).off ('beforeunload');
         go_to_login (new_text);
      }
   }
}


// -----------------------------------------------------------------------------
function go_to_login (new_text) {

   // Form is on qwizard.php.
   var f = document.forms.go_to_login_form;
   f.new_text.value = new_text;
   f.submit ();
}


// -----------------------------------------------------------------------------
function go_to_create_page (new_text, qwizard_page) {
   var f = document.forms.go_to_create_page_form;
   if (debug[0]) {
      console.log ('[go_to_create_page] qwizard_page: ', qwizard_page);
   }

   // Form is on qwizard.php, or on qwizard page in the case in which that is
   // set.
   f.new_text.value = new_text;
   if (qwizard_page) {
      f.page.value = qwizard_page;
   }
   f.submit ();
}


// -----------------------------------------------------------------------------
function go_to_dialog_create_page (new_text) {
   var f = document.forms.go_to_dialog_create_page_form;

   // Form is on qwizard.php.
   f.new_text.value = new_text;
   if (debug[0]) {
      console.log ('[go_to_dialog_create_page] f.new_text.value: ', f.new_text.value);
   }
   f.submit ();
}


// -----------------------------------------------------------------------------
function go_to_update_page (new_text, qwizard_page) {

   // Form is on qwizard_page, as is this script (qwizard.js) in this case.
   var f = document.forms.go_to_create_page_form;
   f.new_text.value = new_text;
   f.submit ();
}


// -----------------------------------------------------------------------------
// Add or update attributes.
function add_update_attributes (attributes, attr, value) {

   // Is the attribute there?
   var re = new RegExp (attr + '\\s*=\\s*"[^"]*"');
   var new_attr_value = attr + '="' + value + '"';
   if (attributes.match (attr)) {

      // Yes.  Remove or update.
      if (value == 'rm') {
         attributes = attributes.replace (re, '');
      } else {
         attributes = attributes.replace (re, new_attr_value);
      }
   } else {

      //No.  Add at end.
      if (value != 'rm') {
         attributes += ' ' + new_attr_value;
      }
   }
   if (debug[0]) {
      console.log ('[add_update_attributes] attributes:', attributes);
   }

   return attributes;
}


// -----------------------------------------------------------------------------
this.set_qwizard_data = function (variable, value) {
   if (debug[0]) {
      console.log ('[set_qwizard_data] variable:', variable, ', value:', value);
   }
   if (value === '') {
      return;
   }
   var code;
   if (parseInt (value) == value) {
      code = variable + ' = ' + value;
   } else {
      code = variable + ' = "' + qqc.addSlashes (value) + '"';
   }
   eval (code);
}


// -----------------------------------------------------------------------------
function set_selectedIndex (select_el, value) {
   var n_opts = select_el.options.length;
   for (var i_opt=0; i_opt<n_opts; i_opt++) {
      if (select_el.options[i_opt].value == value) {
         select_el.selectedIndex = i_opt;
         break;
      }
   }
}


// =============================================================================
// Close - isolate namespace.
};
// -----------------------------------------------------------------------------
qwizard_f.call (qwizard);

// Document global.
combobox_callback = qwizard.unit_topic_selected;

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


