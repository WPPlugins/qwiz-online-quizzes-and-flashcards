/*
 * Version 3.13 2016-??-??
 * dataset/use_dataset
 *
 * Version 3.12 2016-05-11
 * Make WordPress audio player, if any, visible on cards after first.
 *
 * Version 3.10 2016-04-20
 * Hangman "hint" button.
 *
 * Version 3.03 2016-01-28
 * "My progress" option on user menu -- progress bars by unit.
 *
 * Version 3.02 2015-12-22
 * Format login, other for Twentysixteen theme.
 *
 * Version 3.01 2015-12-14
 * Disable [textentry] after answer.
 * [textentry plural="true"] works for dictionary words.
 * Mobile view.
 * Qwiz icon - link to sharing.
 *
 * Version 3.00 2015-10-25
 * Progress recording/reporting.
 * Fix - <Enter> working for login.
 * Check if deck with qrecord_id registered.
 * Check if user will get credit for deck.
 * Login option to register (independent student).
 * Timeout/warning for login session expiration.
 * "Forgot password?" link.
 * [hangman].
 * Dictionary for textentry suggestions.
 * Don't allow user to delete textentry hint letters.
 * [qdeck] attribute: "align=" (center or right).
 * Add [textentry] attributes: "single_char=...", "use_terms=...".
 *
 * Version 2.34 2015-08-31
 * Mouseenter starts timer for show hint on first card of no-intro deck.
 * Fix - Firefox focus-blur (for keydown event) BEFORE textentry focus.
 * Flip front/back on click.
 * Record deck hits.
 *
 * Version 2.30 2015-06-26
 * Team login.
 * Login timeout.
 * Check that attributes have a value given in double quotes.
 * textentry minlength= option.
 * Set textentry minlength for short answer choices.
 * Let zero-length entry metaphones match zero-length term metaphones.
 * Required-input textentry "Check answer" text changes with entry state.
 * <Enter> works for "Check answer"/"Flip back" and "Login".
 * Hint button appears after timeout, or after gray "Check answer" click.
 *
 * Version 2.29 2015-04-26
 * topic= implemented.
 * Recording implemented.
 *
 * Version 2.28 2015-02-03
 * Don't do container set on one-card deck.
 * Resize card front/back to larger of two (including alternate textentry backs).
 * Textentry with required input and suggestions/hints.
 *
 * Version 2.27 2015-01-05
 * Reset header width to match card width for summary report.
 * Toolbar option - keep "next" button active.
 * Don't increment number of cards reviewed until "Check answer"/flip.
 *
 * Version 2.26 2014-12-21
 * Look for WP content filter-created divs, rewrite only that HTML.
 * On back side of card, "Flip"/"Check answer" -> "Flip back".
 * Gray-out/disable "Need more practice" and "Got it!" until user clicks "Check answer".
 *
 * Version 2.25 2014-12-16
 * Fix search for any [qdeck] shortcode.
 * Reorder buttons, default translation: "Flip" -> "Check answer".
 *
 * Version 2.24 2014-12-15
 * Make $ (= jQuery) private.
 *
 * Version 2.23 2014-12-13
 * Explicit visible/hidden for card front/back (Chrome backface-visibility?)
 *
 * Version 2.22 2014-12-07
 * Tolerate whitespace before [h].
 * Fix check for paragraph with header plus something else -- don't delete.
 * Qwiz icon within <td> - keep the icon inside the border.
 *
 * Version 2.21 2014-12-02
 * Workaround for Firefox 33.1 problem with long regular expression and long
 * string in intro parse.
 *
 * Version 2.20 2014-11-20
 * Handle "smart quotes" in attributes.
 *
 * Version 2.17 2014-11-13
 * Bug fix: "text before intro"
 *
 * Version 2.16 2014-11-12
 * Separate out "Got it!" from summary text.
 * Delete <br> in header.
 *
 * Version 2.15 2014-11-09
 * Nicer qwiz icon, hover effect.  Hide icon with flip.
 * Fix ignore empty paragraphs when no [i].  Also, handle multiple paragraphs.
 * Handle left- and right-double-quotes in random="true", etc.
 * Correct sizing of larger of front and back (border showing through in
 * Firefox).
 *
 * Version 2.12 2014-11-03
 * Distinguish qwiz from qdeck in hiding icon.
 *
 * Version 2.11 2014-11-03
 * Ignore empty paragraphs (with "&nbsp;") in intro without "[i]".
 * Qwiz icon/link on intro or first card only.
 * 'div.container' as content option.
 *
 * Version 2.09 2014-10-12
 * Add random="true" option - initial order randomized.
 *
 * Version 2.08 2014-10-05
 * Add internationalization - use .po and .mo files.
 * Add div.post-entry as page content location.
 *
 * Version 2.07 2014-10-01
 * Suppress errors, delete source in page/post excerpts.
 *
 * Version 2.05 2014-09-29
 * [qdeckdemo] tags.
 *
 * Version 2.00 2014-09-07
 * Labeled-diagrams capability, including interactive editing.
 * Chrome on Mac: fallback for Flashcards; others: prevent sub/sup showing
 * through.
 * Don't focus on textarea if first flashcard initially displayed.
 *
 * Version 1.01 2014-08-16
 * Remove <p>s and headers that contain only [!] ... [/!] comments.  Paragraph
 * marks that remained after comments were deleted were taking space.
 *
 * Remove <br />s after textentry.
 *
 * Remove spacing/margins from back side.
 */

// Do-nothing function for old IE.
if (! window.console) {
   window.console = {log: function(){} };
}

// Document global for fallback initialization.
var flipping_cards;
var flipping_cards_part2;

// =============================================================================
// Isolate namespace.
qcard_ = {};
var qcardf = function () {
// =============================================================================

var qname = 'qcard_';

// Debug settings.
var debug = [];
debug.push (false);    // 0 - general.
debug.push (false);    // 1 - process_card_input ().
debug.push (false);    // 2 - answer (card back) html.
debug.push (false);    // 3 - old/new html dump.
debug.push (false);    // 4 - card tags/topics.
debug.push (false);    // 5 - "next" buttons, element objects.
debug.push (false);    // 6 - [textentry] w/ required input.
debug.push (false);    // 7 - Enter -> click.
debug.push (false);    // 8 - unused.
debug.push (false);    // 9 - [hangman].
debug.push (false);    // 10 - unused.
debug.push (false);    // 11 - use_dataset.
debug.push (false);    // 12 - QWizard.
debug.push (false);    // 13 - set_container_width_height.

var $ = jQuery;

// Publicly available.
this.no_intro_b = [];
this.qwizard_b = false;
this.qrecord_b = false;
this.ruled_lines = 'img:data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf4AAAE2CAIAAAAPtmerAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEnklEQVR4nO3YMW1AMRQEwTgyf3ix9Mm8sLCLnUFw1Ra3ZuYHgJLf1wMAuE36AXKkHyBH+gFypB8gR/oBcqQfIEf6AXKkHyBH+gFypB8gR/oBcqQfIEf6AXKkHyBH+gFypB8gR/oBcqQfIEf6AXKkHyBH+gFypB8gR/oBcqQfIEf6AXKkHyBH+gFypB8gR/oBcqQfIEf6AXKkHyBH+gFypB8gR/oBcqQfIEf6AXKkHyBH+gFypB8gR/oBcqQfIEf6AXKkHyBH+gFypB8gR/oBcqQfIGf//P293gDAVWtmXm8A4CqHD0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+Ts883rDQBctWakH6DF4QOQI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA5+3zzegMAV60Z6QdocfgA5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9Azj7fvN4AwFVrRvoBWhw+ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkLPPN683AHDVmpF+gBaHD0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+Ts883rDQBctWakH6DF4QOQI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA5+3zzegMAV60Z6QdocfgA5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9Azj7fvN4AwFVrRvoBWhw+ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkLPPN683AHDVmpF+gBaHD0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+RIP0CO9APkSD9AjvQD5Eg/QI70A+Ts883rDQBctWakH6DF4QOQI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA50g+QI/0AOdIPkCP9ADnSD5Aj/QA5/8mNPTHI1j+2AAAAAElFTkSuQmCC';
this.preview = false;

// Private data, but global to this qcard instance.
var q = this;
var qqc;
q.processing_complete_b = false;

var content                     = 'body';
var default_use_dict            = 'true';
var default_use_terms           = 'true';
var hint_timeout_sec            = 20;
var default_hangman_max_hints   = 2;
var post_id                     = 0;
var errmsgs = [];

var n_decks = 0;

var deck_id;
var deckdata = [];

var next_button_active_b  = false;

var textentry_i_deck;
var loaded_metaphone_js_b = false;

// Object (singular and plural) of arrays of term-metaphone pairs.
// Constant across quizzes.
var default_textentry_terms_metaphones;

// (deckdata[i_deck].textentry_terms_metaphones are quiz-specific terms given
// with [terms]...[/terms].)

// These vary with quiz, and are set up anew for each [textentry] question.
var current_card_textentry_terms_metaphones = {};

var textentry_answers = {};
var textentry_answer_metaphones = {};

var textentry_matches = {};
var lc_textentry_matches = {};

var Tcheck_answer_message;
var show_hint_timeout = {};

var q_and_a_text = '';

var scroll_detect_i_deck;
var panel_exit_mobile_open_b = false;
var panel_exit_mobile_just_closed_b;

var non_mobile_scrollLeft;
var non_mobile_scrollTop;

var qw;
var set_qwizard_data_b = false;


// -----------------------------------------------------------------------------
$(document).ready (function () {

   qqc = qwiz_qcards_common;

   // Do only if we're not on WordPress editing page and we're not on qwizard
   // user/editing page (qdeck_init will be called in that case once the user/
   // editing page has had a chance to grab the source shortcodes).
   if (typeof (document_qwizard_user_page) == 'undefined'
            && window.location.href.indexOf ('action=edit') == -1
                           && window.location.href.indexOf ('post-new') == -1) {
      q.qdeck_init ();
   }
});


// -----------------------------------------------------------------------------
this.qdeck_init = function (skip_error_check_f) {

   // The identifier -- including qualifiers like "#" -- of the page content (that
   // perhaps contains inline flashcard decks) on WordPress.  Default
   // set in qwiz-online-quizzes-wp-plugin.php: div.entry-content, div.post-entry.
   // Apparently themes can change this; these have come up so far.
   // Body default for stand-alone use.
   content                   = qqc.get_qwiz_param ('content', 'body');
   default_use_dict          = qqc.get_qwiz_param ('use_dict', 'true');
   default_use_terms         = qqc.get_qwiz_param ('use_terms', 'true');
   default_hangman_max_hints = parseInt (qqc.get_qwiz_param ('hangman_hints', 2));
   hint_timeout_sec          = qqc.get_qwiz_param ('hint_timeout_sec', 20);
   post_id                   = qqc.get_qwiz_param ('post_id', 0);
   document_qwiz_mobile_enabled = qqc.get_qwiz_param ('mobile_enabled', 'Enabled') == 'Enabled';
   Tcheck_answer_message = T ('Need help?  Try the "hint" button');

   process_html ();

   // Error messages, if any.
   if (errmsgs.length && ! skip_error_check_f) {
      if (! q.qwizard_b) {
         alert (Tplural ('Error found', 'Errors found', errmsgs.length) + ':\n\n' + errmsgs.join ('\n'));
      } else {
         if (debug[12]) {
            console.log (errmsgs.join ('\n'));
         }
      }
   }

   if (n_decks) {

      // If on mobile, show expand-to-full-screen icon and clickable target on
      // all decks.
      if (qqc.is_mobile ()) {
         $ ('.go-mobile-qdeck').show ();
      }
      q.qdeck_init2 (n_decks);
   }
}


// -----------------------------------------------------------------------------
this.qdeck_init2 = function (n_decks, new_qwizard_deck_f) {
   for (var i_deck=0; i_deck<n_decks; i_deck++) {
      init_element_pointers (i_deck);
      init_card_order (i_deck);

      // If deck subject to recording, set flag to record start times on
      // first interaction of logged-in user with deck.
      if (deckdata[i_deck].qrecord_id) {
         deckdata[i_deck].record_start_b = true;
      }

      // Set header so there's something in it (measure height).
      set_header (i_deck, 'qcard-front', true);

      // If any specific questions from datasets, do that processing.  If no
      // intro for a deck or single-card deck, move immediately to first
      // card.  Otherwise, show introductory html along with button to start
      // deck.
      var use_dataset_card_html = deckdata[i_deck].use_dataset_card_html;
      if (use_dataset_card_html) {
         use_dataset_card_html = qqc.replace_smart_quotes (use_dataset_card_html);
         var use_dataset_card_id = get_attr (use_dataset_card_html, 'use_dataset_card');
         var pos_bar = use_dataset_card_id.indexOf ('|');
         var use_dataset = use_dataset_card_id.substr (0, pos_bar);
         qqc.get_dataset_questions (use_dataset, qname,
                                    i_deck, deckdata[i_deck].qrecord_id,
                                    [], [], 10000, 'spaced_repetition',
                                    use_dataset_card_html);
      } else if (   ! new_qwizard_deck_f
                 && ! deckdata[i_deck].use_dataset
                 && (q.no_intro_b[i_deck] || deckdata[i_deck].n_cards == 1)) {
         q.start_deck2 (i_deck);
      } else {
         deckdata[i_deck].no_flip_b = deckdata[i_deck].click_flip_b;
         if (q.qwizard_b) {
            if (! new_qwizard_deck_f) {

               // New deck -- starts with no intro.
               q.set_editable_parts_front (i_deck, deckdata[i_deck].intro_html);
            }
         } else {
            var $front = q.$card_front (i_deck, -1);
            $front.html (qqc.decode_image_tags (deckdata[i_deck].intro_html));
            var card_height_setting = deckdata[i_deck].card_height_setting;
            if (card_height_setting) {
               card_height_setting = card_height_setting.replace ('px', '');
            } else {
               card_height_setting = deckdata[i_deck].$qcard_container.outerHeight ();
            }
            center_vertical ($front, card_height_setting);
         }

         // Add qwiz icon.
         if (! q.preview) {
            var qwiz_icon_div = create_qwiz_icon_div (i_deck);
            deckdata[i_deck].$qcard_card.append (qwiz_icon_div);

            q.qwiz_icon_stop_propagation (i_deck);
         }

         // Set to match larger of front and back.
         deckdata[i_deck].i_card = -1;
         q.set_container_width_height (i_deck);

         // Set overflow if scrolling.
         if (deckdata[i_deck].scroll_b) {
            var $qcard_card = deckdata[i_deck].$qcard_card;
            $qcard_card.find ('div.qcard-front').css ({overflow: 'auto'});
         }
      }

      // If qwizard, set up to edit header, card front, and card back.
      if (q.qwizard_b) {
         if (debug[0]) {
            console.log ('[qdeck_init2] $ (\'div#qcard_front-part1-qdeck\' + i_deck):', $ ('div#qcard_front-part1-qdeck' + i_deck));
         }
         qwizard.init_tinymce ('div#qcard_header-qdeck' + i_deck);
         qwizard.init_tinymce ('div#qcard_front-part1-qdeck' + i_deck);
         qwizard.init_tinymce ('div#qcard_front-part2-qdeck' + i_deck);

         qwizard.init_tinymce ('div#qcard_back-part1-qdeck' + i_deck);
      }
   }

   // If preview, set front and back of each card.
   if (q.preview && ! q.qwizard_b) {
      init_preview (0);
   }

   flipping_cards ();
}


// -----------------------------------------------------------------------------
function init_preview (i_deck) {

   // Allow flips (introduction screened in flip ()).
   deckdata[i_deck].no_flip_b = false;

   // Set front and back of each card.
   var n_cards = deckdata[i_deck].n_cards;
   for (var i_card=0; i_card<n_cards; i_card++) {
      deckdata[i_deck].i_card = i_card;
      q.set_card_front_and_back (i_deck, i_card);
   }

   // Set summary/exit.
   if (n_cards > 1) {
      q.done (i_deck);
   }

   // Calculate sum of heights of each card container and set window to match
   // overall height.  Wait until set_card_front_and_back () > 
   // set_container_width_height () finishes.
   var delay_sum_height = function () {
      var sum_height = 0;

      // Intro, too, if there.
      var i_beg = q.no_intro_b[i_deck] ? 0 : -1;
      for (var i_card=i_beg; i_card<n_cards; i_card++) {
         var $qcard_container      = $ ('div.card-container.preview-qdeck' + i_deck + '.preview-qcard' + i_card);
         var card_container_height = $qcard_container.outerHeight ();
         sum_height += card_container_height;
      }

      // Summary/exit, too.
      if (n_cards > 1) {
         var $qcard_container      = $ ('div.card-container.preview-qdeck' + i_deck + '.preview-qcard' + n_cards);
         var card_container_height = $qcard_container.outerHeight ();
         sum_height += card_container_height;
      }

      var $qcard_window = deckdata[i_deck].$qcard_window;
      $qcard_window.height (sum_height);
   };

   setTimeout (delay_sum_height, 300);

   // For each card container, mouseover to set i_card.
   $ ('div.card-container').on ('mouseenter', q.set_i_deck_i_card);
}


// -----------------------------------------------------------------------------
this.set_i_deck_i_card = function () {
   if (debug[0]) {
      console.log ('[set_i_deck_i_card] this:', this);
   }

   // Get deck and card from classes.
   var classes = this.className;
   var i_deck = classes.match ('preview-qdeck([0-9]+)')[1];

   // Card may be "-1".
   var i_card = classes.match ('preview-qcard([-0-9]+)')[1];
   deckdata[i_deck].i_card = i_card
}


// -----------------------------------------------------------------------------
// Selector for "Flip"/"Check answer" button.  Card-specific if preview.
// i_card set by set_i_deck_i_card ();
function button_flip_selector (i_deck) {
   var selector = 'button.flip-qdeck' + i_deck;
   if (q.preview) {
      selector += '-qcard' + deckdata[i_deck].i_card;
   }

   return selector;
}


// -----------------------------------------------------------------------------
this.$card_front = function (i_deck, i_card) {
   if (q.preview) {
      if (typeof (i_card) == 'undefined') {
         i_card = deckdata[i_deck].i_card;
      }
      $qcard_card_front = $ ('div#qcard_window-qdeck' + i_deck + ' div.card-container.preview-qcard' + i_card + ' div.qcard-front div.qcard_content_size');
   } else {
      $qcard_card_front = deckdata[i_deck].$qcard_card_front;
   }

   return $qcard_card_front;
}


// -----------------------------------------------------------------------------
function $card_back (i_deck, i_card) {
   if (q.preview) {
      if (typeof (i_card) == 'undefined') {
         i_card = deckdata[i_deck].i_card;
      }
      $qcard_card_back  = $ ('div#qcard_window-qdeck' + i_deck + ' div.card-container.preview-qcard' + i_card + ' div.qcard-back  div.qcard_content_size');
   } else {
      $qcard_card_back = deckdata[i_deck].$qcard_card_back;
   }

   return $qcard_card_back;
}


// -----------------------------------------------------------------------------
function process_html () {

   // Delete paragraphs and headers that contain only [!] ... [/!] comments
   // and whitespace/tags outside.
   $ ('p:contains("[!]"), :header:contains("[!]")').each (function () {

      // See if only whitespace outside [!] ... [/!].
      var comment_htm = $ (this).html ();
      if (comment_htm.search (/\s*(<.+?>)*\s*\[!+\][\s\S]*?\[\/!+\]\s*(<.+?>)*\s*$/m) == 0) {
         $ (this).remove ();
      }
   });

   // Look for [qdeck] and [/qdeck] that are only thing inside parents (e.g.,
   // <p>[qdeck]</p>).  Replace with "unwrapped" content if so.
   $ ('p:contains("qdeck"), :header:contains("qdeck")').each (function () {
      var tag_htm = $ (this).html ();
      if (tag_htm.search (/\s*\[\/{0,1}qdeck[^\]]*\]\s*/m) == 0) {
         $ (this).replaceWith (tag_htm);
      }
   });

   // We're either going to deal with HTML (stand-alone version) or divs (added
   // by WordPress content filter).  The divs allow us to replace content
   // specific to qwiz/qdeck -- avoid clobbering any events bound to remaining
   // html by other plugins.  See if there are such divs.  WP content filter
   // always adds at least one empty div, so don't have to do HTML branch.
   var div_html_selector = '';
   var $qdeck_divs = $ ('div.qdeck_wrapper');
   var $fallback_wrappers = $ ('div.qdeck_wrapper_fallback');
   if ($qdeck_divs.length) {
      div_html_selector = 'div.qdeck_wrapper';

      // Hide fallback wrappers.
      $fallback_wrappers.css ({display: 'none'});
   } else {

      // If there are no fallback wrappers, need to add style so they'll show
      // if they're inserted into the page later.
      if ($fallback_wrappers.length == 0) {
         var style =   '<style type="text/css">\n'
                     +    '.qdeck_wrapper_fallback_visible {\n'
                     +       'visibility: visible;\n'
                     +    '}\n'
                     + '</style>\n';
         $ ('head').append (style);
      }
      div_html_selector = content;
   }

   // Read appropriate divs, look for inline qcard shortcodes, loop over
   // shortcode pairs.
   var i_deck = 0;
   $ (div_html_selector).each (function () {
      var htm = $(this).html ();
      if (! htm) {

         //errmsgs.push (T ('Did not find page content (looking for div') + ' "' + content + '")');
      } else {

         // See if there is a deck or decks.
         var qdeck_pos = htm.search (/\[qdeck/);
         if (qdeck_pos != -1) {

            // Remove and save text inside [qdeckdemo] ... [/qdeckdemo] pairs.
            // Replace with <qdeckdemo></qdeckdemo> pairs as placeholder.
            var qdeckdemo_re = new RegExp ('\\[qdeckdemo\\][\\s\\S]*?\\[\\/qdeckdemo\\]', 'gm');
            var qdeckdemos = htm.match (qdeckdemo_re);
            var n_qdeckdemos = 0;
            if (qdeckdemos) {
               n_qdeckdemos = qdeckdemos.length;
               htm = htm.replace (qdeckdemo_re, '<qdeckdemo></qdeckdemo>');
               if (debug[0]) {
                  console.log ('[process_html] n_qdeckdemos: ', n_qdeckdemos);
               }
            }

            // Delete comments -- don't want to process [qdeck][/qdeck] pairs or any other
            // deck-related tags that are in comments.
            var new_html = htm.replace (/<!--[\s\S]*?-->/gm, '');

            // Take out any remaining [!]...[\!] comments (those that were not
            // inside paragraph or header elements).
            new_html = new_html.replace (/\[!+\][\s\S]*?\[\/!+\]/gm, '');

            // Check that there are pairs.
            var do_not_process_html = check_qdeck_tag_pairs (new_html);
            if (do_not_process_html) {
               new_html = do_not_process_html;
            } else {

               // Get text, including beginning and ending tags.
               // "." does not match line-ends (!), so use the whitespace/not-whitespace
               // construct.  Non-greedy search, global, multiline.
               var qdeck_matches = new_html.match (/\[qdeck[\s\S]*?\[\/qdeck\]/gm);
               if (qdeck_matches) {
                  var local_n_decks = qdeck_matches.length;
                  if (debug[0]) {
                     console.log ('[process_html] local_n_decks: ', local_n_decks);
                     console.log ('               qdeck_matches[0]: ', qdeck_matches[0]);
                  }

                  // Loop over qdeck-tag pairs.
                  for (var ii_deck=0; ii_deck<local_n_decks; ii_deck++) {
                     var new_deck_html = q.process_qdeck_pair (qdeck_matches[ii_deck], i_deck);

                     // Let's take out <p...> and <h...> from before [qdeck].
                     new_html = new_html.replace (/(<[ph][^>]*>\s*)*?\[qdeck[\s\S]*?\[\/qdeck\]/m, new_deck_html);
                     i_deck++;
                  }
               }
            }

            // Restore examples, but without [qdeckdemo] ... [/qdeckdemo] tags.
            for (var i_qdeckdemo=0; i_qdeckdemo< n_qdeckdemos; i_qdeckdemo++) {
               var qdeckdemo_i = qdeckdemos[i_qdeckdemo];
               var len = qdeckdemo_i.length;
               qdeckdemo_i = qdeckdemo_i.substring (11, len - 12);
               new_html = new_html.replace ('<qdeckdemo></qdeckdemo>', qdeckdemo_i);
            }

            // Replace content html.
            $ (this).html (new_html);

            // Mouseenter for this deck records it as the active qwiz/deck.
            $ (this).find ('div.qcard_window')
               .on ('mouseenter',
                    function (e) {

                       // Make sure get container div.
                       if (e.target.className.toLowerCase () == 'qcard_window') {
                          document_active_qwiz_qdeck = e.target;
                       } else {
                          var $qdeckdiv = $ (e.target).parents ('div.qcard_window');
                          if ($qdeckdiv.length) {
                             document_active_qwiz_qdeck = $qdeckdiv[0];
                          }
                       }
                       if (debug[7]) {
                          console.log ('[qcard_window mouseenter] e.target:', e.target);
                          console.log ('[qcard_window mouseenter] document_active_qwiz_qdeck:', document_active_qwiz_qdeck);
                       }
                    });

            // Waited to do check_registered so can update sharing href of qwiz
            // icon.  Also, record/update number of cards.
            $ (this).find ('div.qcard_window').each (function () {
               var id = $ (this)[0].id;

               // ID looks like: qcard_window-qdeck0
               //                0----+----1----+---
               var ii_deck = parseInt (id.substr (18), 10);
               var qrecord_id = $ (this).find ('div.qcard_content').attr ('qrecord_id');
               if (qrecord_id) {
                  qrecord_id = qqc.replace_smart_quotes (qrecord_id);
                  var n_cards = deckdata[ii_deck].n_cards;
                  var data = {qwiz_qdeck: 'qdeck', n_questions_cards: n_cards};
                  qqc.jjax (qname, ii_deck, qrecord_id, 'check_registered', data);
               }
            });
         }

         // If wrapper divs, unwrap.
         if ($qdeck_divs.length) {
            $ (this).contents ().unwrap ();
         }
      }
      n_decks = i_deck;
   });

   // Set up Enter-key intercept -- trigger appropriate button press
   // (Check answer, Login).
   if (! q.qwizard_b) {
      qqc.init_enter_intercept ();
   }

   // If any quizzes subject to recording, set user menus -- if this comes after
   // check_session_id () callback, it will properly set the menus (while the
   // callback may not have worked if the html hadn't been set at that time).
   if (q.qrecord_b) {
      qqc.set_user_menus_and_icons ();
   }

   // Set flag (used in qwiz.js).
   q.processing_complete_b = true;
}


// -----------------------------------------------------------------------------
// Set up [textentry] autocomplete for this card.
this.init_textentry_autocomplete = function (i_deck, ii_card) {
   if (debug[0]) {
      console.log ('[init_textentry_autocomplete] ii_card:', ii_card);
   }

   // Set minlength for autocomplete suggestions for this card.
   var card = deckdata[i_deck].cards[ii_card];
   var minlength = card.textentry_minlength;
   if (card.all_choices[0].length < minlength) {
      minlength = card.all_choices[0].length;
   }

   if (card.single_char_b) {

      // Single-char textentry.
      $ ('input.qcard_single_char_entry').keyup (single_char_textentry_keyup);
   } else {

      var $textentry = $ ('input.textentry-qdeck' + i_deck);
      $textentry.autocomplete ({
         minLength:     minlength,
         source:        find_matching_terms,
         close:         menu_closed,
         open:          menu_shown,
         select:        q.item_selected
      });

      $textentry.keyup (menu_closed);
   }

   // See if using terms
   if (card.single_char_b) {

      // Not using terms.  Gray out and disable "Check answer"/"Flip" button.
      $ (button_flip_selector (i_deck)).removeClass ('qbutton').addClass ('qbutton_disabled').attr ('disabled', true);
      deckdata[i_deck].check_answer_disabled_b = true;
      card.check_answer = 'Check answer';
   } else {

      // Get terms given with [terms]...[/terms] for this flashcard deck; or
      // load default terms if haven't done so already.
      if (deckdata[i_deck].terms) {

         // Only do this once per flashcard deck.
         if (! deckdata[i_deck].textentry_terms_metaphones) {
            deckdata[i_deck].textentry_terms_metaphones = qqc.process_textentry_terms (deckdata[i_deck].terms);
         }
      } else {
         if (! default_textentry_terms_metaphones) {
            var plugin_url = qqc.get_qwiz_param ('url', './');
            var terms_data = qqc.get_textentry_terms (plugin_url + 'terms.txt', deckdata);
            default_textentry_terms_metaphones = qqc.process_textentry_terms (terms_data);
         }
      }

      // Also need to process additional terms for this flashcard deck, if any.
      // Only do once per deck.
      if (deckdata[i_deck].add_terms) {
         if (! deckdata[i_deck].add_textentry_terms_metaphones) {
            deckdata[i_deck].add_textentry_terms_metaphones = qqc.process_textentry_terms (deckdata[i_deck].add_terms);
         }
      }

      if (card.use_terms_b) {

         // Set terms for this card.  List of terms (term, metaphone pairs):
         // (1) default or specific to this flashcard deck; plus (2) additional terms
         // for this deck, if any; and (3) specified entries for this [textentry].
         // Singular or plural in each case.
         var singular_plural;
         if (card.textentry_plural_b) {
            singular_plural = 'plural';
         } else {
            singular_plural = 'singular';
         }

         // (1) Quiz-specific or default.
         if (deckdata[i_deck].terms) {
            current_card_textentry_terms_metaphones[i_deck]
                  = deckdata[i_deck].textentry_terms_metaphones[singular_plural];
         } else {
            current_card_textentry_terms_metaphones[i_deck]
                  = default_textentry_terms_metaphones[singular_plural];
         }

         // (2) Additional.
         if (deckdata[i_deck].add_terms) {
            current_card_textentry_terms_metaphones[i_deck]
               = current_card_textentry_terms_metaphones[i_deck]
                  .concat (deckdata[i_deck].add_textentry_terms_metaphones[singular_plural]);
         }
      } else {
         current_card_textentry_terms_metaphones[i_deck] = [];
      }

      // (3) All specified entries.  Calculate metaphones up to first blank
      // following a non-blank.
      textentry_answers[i_deck] = card.all_choices;
      textentry_answer_metaphones[i_deck]
         = textentry_answers[i_deck].map (function (answer) {
                                             answer = answer.replace (/\s*(\S+)\s.*/, '\$1');
                                             return qqc.metaphone (answer);
                                          })

      var textentry_answers_metaphones
         = textentry_answers[i_deck].map (function (answer) {
                                     return [answer, qqc.metaphone (answer)];
                                  });
      if (debug[6]) {
         console.log ('[init_textentry_autocomplete] textentry_answers_metaphones: ', textentry_answers_metaphones);
      }
      current_card_textentry_terms_metaphones[i_deck]
         = current_card_textentry_terms_metaphones[i_deck]
                                       .concat (textentry_answers_metaphones);

      // Sort and de-dupe.
      current_card_textentry_terms_metaphones[i_deck]
         = qqc.sort_dedupe_terms_metaphones (current_card_textentry_terms_metaphones[i_deck]);

      if (debug[6]) {
         console.log ('[init_textentry_autocomplete] current_card_textentry_terms_metaphones[i_deck].length: ', current_card_textentry_terms_metaphones[i_deck].length);
         console.log ('[init_textentry_autocomplete] current_card_textentry_terms_metaphones[i_deck].slice (0, 10): ', current_card_textentry_terms_metaphones[i_deck].slice (0, 10));
         var i_start = current_card_textentry_terms_metaphones[i_deck].length - 10;
         if (i_start > 0) {
            console.log ('[init_textentry_autocomplete] current_card_textentry_terms_metaphones[i_deck].slice (' + i_start + '): ', current_card_textentry_terms_metaphones[i_deck].slice (i_start));
         }
      }

      // Set placeholder now.  Also reset "Check answer" button.
      var placeholder;
      var check_answer;
      if (minlength <= 1) {
         placeholder = T ('Type a letter/number');
         check_answer = T ('Type a letter');
      } else {
         minlength = Math.max (minlength, 3);
         placeholder = T ('Type %s+ letters/numbers');
         placeholder = placeholder.replace ('%s', minlength);

         check_answer = T ('Type %s+ letters');
         check_answer = check_answer.replace ('%s', minlength);
      }
      $textentry.attr ('placeholder', placeholder);
      $ (button_flip_selector (i_deck)).html (check_answer);

      // Save for flip ().
      card.save_check_answer = check_answer;
      card.check_answer = check_answer;

      // Needed in find_matching_terms ().
      card.textentry_minlength = minlength;

      // Gray out "Check answer"/"Flip" button, but leave enabled -- click
      // will print alert rather than do flip.  Also provide alert text as
      // title.
      $ (button_flip_selector (i_deck)).removeClass ('qbutton').addClass ('qbutton_disabled').attr ('title', Tcheck_answer_message);
      deckdata[i_deck].check_answer_disabled_b = true;
      deckdata[i_deck].textentry_n_hints = 0;

      // If first card of no-intro deck, set up for mouseenter to start timer
      // to show hint button.
      if (deckdata[i_deck].n_reviewed == 0
                        && (q.no_intro_b[i_deck] || deckdata[i_deck].n_cards == 1)) {
         deckdata[i_deck].$qcard_window.attr ('onmouseenter', qname + '.start_hint_timeout (' + i_deck + ')');
      } else {

         // Otherwise, start timeout now (with question display).
         q.start_hint_timeout (i_deck);
      }
   }

   // Don't let clicks bubble (to flip).
   if (deckdata[i_deck].click_flip_b) {
      $ ('#textentry_hint-qdeck' + i_deck).click (function (event) {
         event.stopPropagation ();
         if (debug[0]) {
            console.log ('[init_textentry_autocomplete] click event:', event);
         }
      });
   }
}


// -----------------------------------------------------------------------------
this.start_hint_timeout = function (i_deck) {
   if (debug[0]) {
      console.log ('[start_hint_timeout] i_deck:', i_deck);
   }

   // Only execute this function once for this question.
   deckdata[i_deck].$qcard_window.removeAttr ('onmouseenter');

   // Closure for setTimeout ().
   var show_hint_button = function () {
      $ ('#textentry_hint-qdeck' + i_deck)
         .removeAttr ('disabled')
         .addClass ('qbutton')
         .removeClass ('qbutton_disabled')
         .show ();
   }
   $ ('#textentry_hint-qdeck' + i_deck).html ('Hint').hide ();
   if (hint_timeout_sec >= 0) {
      show_hint_timeout[i_deck] = setTimeout (show_hint_button, hint_timeout_sec*1000);
   }
}


// -----------------------------------------------------------------------------
this.process_qdeck_pair = function (htm, i_deck, existing_qdeck_f) {
   if (debug[0]) {
      console.log ('[process_qdeck_pair] htm:', htm);
      console.log ('[process_qdeck_pair] i_deck:', i_deck);
   }
   if (existing_qdeck_f) {

      // Called from qwizard.js to process/parse card shortcodes.
      qw = qwizard;
      n_decks = 1;
      set_qwizard_data_b = true;
      q.qwizard_b = true;
      q.no_intro_b = [];
   }

   // Data object for this deck.
   deckdata.push ({});

   // Array of cards ("cards").
   deckdata[i_deck].cards = [];

   deckdata[i_deck].showing_front_b = true;

   deckdata[i_deck].i_card = 0;

   deckdata[i_deck].n_reviewed = 0;
   deckdata[i_deck].n_got_it   = 0;

   deckdata[i_deck].exit_html = '';

   deckdata[i_deck].align = '';

   deckdata[i_deck].use_dataset = '';
   deckdata[i_deck].dataset_id = {};
   deckdata[i_deck].use_dataset_card_ids = {};

   deckdata[i_deck].qrecord_id = '';
   deckdata[i_deck].qrecord_id_ok = 'check credit';

   deckdata[i_deck].unit = [];

   deckdata[i_deck].default_card_back_background = '';
   deckdata[i_deck].card_back_background = [];

   deckdata[i_deck].click_flip_b = true;

   // Include any opening tags (e.g., "<p>" in WordPress).
   // DKTMP Opening tags not there, due to way htm captured in process_html ().
   var m = htm.match (/(<[^\/][^>]*>\s*)*?\[qdeck([^\]]*)\]/m);
   var qdeck_tag  = m[0];
   var attributes = m[2];

   qdeck_tag  = qqc.replace_smart_quotes (qdeck_tag);
   attributes = qqc.replace_smart_quotes (attributes);
   if (debug[0]) {
      console.log ('[process_qdeck_pair] qdeck_tag: ', qdeck_tag);
      console.log ('[process_qdeck_pair] attributes: ', attributes);
   }
   if (set_qwizard_data_b) {
      qw.set_qwizard_data ('qwiz_deck_attributes', attributes);
   }
   var use_dataset_cards_b = false;

   // See if use_dataset deck.
   var use_dataset = get_attr (qdeck_tag, 'use_dataset');
   if (use_dataset) {
      deckdata[i_deck].use_dataset = use_dataset;

      // See if no dataset intro.
      var dataset_intro_f = get_attr (qdeck_tag, 'dataset_intro') != 'false';
      deckdata[i_deck].dataset_intro_f = dataset_intro_f;

      // See if random question order (default is not).
      deckdata[i_deck].random_b = get_attr (qdeck_tag, 'random') == 'true';

      // See if a display name is given.  First, may include style info.
      // Encode that so can parse out.
      var m = qdeck_tag.match (/\sstyle\s*=\s*"[^"]+"/gm);
      if (m) {
         var len = m.length;
         for (var i=0; i<len; i++) {
            var encoded_style = encodeURIComponent (m[i]);
            qdeck_tag = qdeck_tag.replace (m[i], encoded_style);
         }
      }
      var display_name = get_attr (qdeck_tag, 'display_name');
      if (display_name) {
         deckdata[i_deck].use_dataset_options_display_name = decodeURIComponent (display_name);

         // Delete display_name="..." from qdeck_tag -- so won't contaminate
         // final html created in create_qdeck_divs ().
         var qdeck_tag = qdeck_tag.replace (/\sdisplay_name\s*=\s*"[^"]*?"/, '');
      }

      // Restore any remaining style info to plain HTML.
      qdeck_tag = decodeURIComponent (qdeck_tag);
   }

   // Alignment.  Default = left.  If center or right, set.
   var align = get_attr (attributes, 'align');
   if (align == 'center' || align == 'right') {
      deckdata[i_deck].align = align;
   }

   // If "qrecord_id=..." present, parse out database ID.
   var qrecord_id = get_attr (attributes, 'qrecord_id');
   if (qrecord_id) {

      // Set flag indicating this deck subject to recording.  (Will get unset
      // by check_registered returned JavaScript if not registered.)
      deckdata[i_deck].qrecord_id = qrecord_id;

      // Set up array to save question text.
      deckdata[i_deck].q_and_a_text = {};

      // If haven't checked already, see if user already logged in (get session
      // ID in cookie, see if still valid).
      if (! q.qrecord_b) {
         q.qrecord_b = true;
         if (typeof (document_qwiz_user_logged_in_b) == 'undefined'
                              || document_qwiz_user_logged_in_b == 'not ready') {
            qqc.check_session_id (i_deck);
         }
      }
   }

   // If "unit=..." present, set as default for cards in this deck.
   var unit = get_attr (attributes, 'unit');
   if (unit) {
      deckdata[i_deck].default_unit = unit;
      if (set_qwizard_data_b) {
         qw.set_qwizard_data ('default_unit', unit);
      }
   } else {
      deckdata[i_deck].default_unit = 'null';
   }

   // Turn off flip on click?
   if (q.qwizard_b) {
         deckdata[i_deck].click_flip_b = false;
   } else {
      var click_flip_val = get_attr (attributes, 'click_flip');
      if (click_flip_val) {
         deckdata[i_deck].click_flip_b = ! (click_flip_val == 'false');
      }
   }

   // Custom card-back background?  Default for deck.
   var card_back_background = get_attr (attributes, 'card_back');
   if (card_back_background) {
      deckdata[i_deck].default_card_back_background = card_back_background;
   } else {
      card_back_background = get_attr (attributes, 'card_back_image');
      if (card_back_background) {
         deckdata[i_deck].default_card_back_background = 'img:' + card_back_background;
      } else {
         deckdata[i_deck].default_card_back_background = '';
      }
   }

   // Scroll content rather than expand card?
   deckdata[i_deck].scroll_b = get_attr (attributes, 'scroll') == 'true';

   var n_decks = 0;
   var new_html = '';
   var no_intro_i_b = false;

   // Is deck encoded?  Decode if necessary.
   //htm = decode_qdeck (htm, qdeck_tag);

   // Capture any initial closing tags after [qdeck ...] -- will put them in
   // front of <div> that replaces [qdeck ...].
   var m = htm.match (/\[qdeck[^\]]*\]((<\/[^>]+>\s*)*)/m, '');
   if (m) {
      var initial_closing_tags = m[1];
      new_html += initial_closing_tags;
   }

   // Delete [qdeck], any initial closing tags.
   htm = htm.replace (/\[qdeck[^\]]*\]((<\/[^>]+>\s*)*)/m, '');

   // Take off closing "[/qdeck]".
   var len = htm.length;
   htm = htm.substring (0, len-8);

   // Delete any initial whitespace.
   htm = qqc.trim (htm);

   // Make sure there's at least one card (unless use_dataset).
   var n_cards = -1;
   if (! use_dataset && htm.search (/\[q([^\]]*)\]/m) == -1) {
      errmsgs.push (T ('Did not find question tags ("[q]") for') + ' qdeck ' + (i_deck + 1));
      n_cards = 0;
   }

   // Look for [terms]...[/terms] and/or [add_terms]...[/add_terms] pairs.
   // Parse, and delete.  Include opening tags in front and closing tags
   // after.
   htm = qqc.process_inline_textentry_terms (htm, 'terms', deckdata, i_deck);
   errmsgs = errmsgs.concat (deckdata.additional_errmsgs);
   htm = qqc.process_inline_textentry_terms (htm, 'add_terms', deckdata, i_deck);
   errmsgs = errmsgs.concat (deckdata.additional_errmsgs);

   // See if html up to first shortcode is just whitespace, including empty
   // paragraphs.  Limit to first 2000 characters.
   var whitespace = qqc.parse_html_block (htm.substr (0, 2000), ['^'], ['[h]', '[i]', '[q]', '[q '], 'return whitespace');
   if (whitespace) {

      // Yes, delete it.
      htm = htm.replace (whitespace, '');
   }

   // See if header.  Sets deckdata[i_deck].header_html.
   htm = process_header (htm, i_deck, true);
   if (set_qwizard_data_b && deckdata[i_deck].header_html) {
      qw.set_qwizard_data ('header_text', deckdata[i_deck].header_html);
   }

   // See if intro.  Limit search to first 2000 characters.  Include [x] as
   // a "next" tag in case use_dataset (no questions) or qwizard with no 
   // questions.
   var intro_html = qqc.parse_html_block (htm.substr (0, 2000), ['[i]'], ['[q]', '[q ', '[x]'], true);

   // See if no [i].
   if (intro_html == 'NA') {

      // No [i] -- intro may be text before [q].  See if there is.  Add flag
      // to ignore &nbsp; (empty paragraph).
      intro_html = qqc.parse_html_block (htm.substr (0, 2000), ['^'], ['[q]', '[q ', '[x]'], true);

      // If just tags and whitespace, then no intro, unless this is a
      // use_dataset= deck, which always has at least a "Start quiz" button.
      if (intro_html == '') {
         if (use_dataset) {

            // Create intro with a few line-breaks -- move start button down
            // a bit.
            intro_html = '<br /><br /><br />';
         } else {
            no_intro_i_b = true;
         }
      }
   } else {

      // There was an [i].  Error if text before [i].  Exclude <br...> or
      // <img...> or <span class="qwizard_placeholder">
      var htmx = htm.substr (0, 200);
      htmx = qqc.trim (htmx);
      var i_pos = qqc.opening_tag_shortcode_pos ('[i]', htmx);
      htmx = htmx.substr (i_pos, 5);
      var intro_htmlx = intro_html.replace (/<br[^>]*>/g, '');
      intro_htmlx = qqc.trim (intro_htmlx).substr (0, 5);
      if (htmx != intro_htmlx) {
         errmsgs.push (T ('Text before intro') + ' [i] - qdeck ' + (i_deck + 1));
      }

      // Delete [i] from intro.
      intro_html = intro_html.replace (/\[i\]/, '');
   }
   if (intro_html != '') {

      // If there's an unmatched </p> or the like near the beginning, add a
      // matching opening tag.
      intro_html = qqc.balance_closing_tag (intro_html);
      var intro_text = intro_html;

      // If there's a [start] tag, replace with start button html.  Otherwise
      // add start button html.
      var start_button_html = '<button id="start_button-qdeck' + i_deck + '" class="qbutton" onclick="' + qname + '.start_deck (' + i_deck + ')">' + T ('Start reviewing cards') + '</button>';
      if (intro_html.indexOf ('[start]') != -1) {
         intro_html = intro_html.replace ('[start]', start_button_html);
      } else {
         intro_html += start_button_html;
         intro_text += '[start]';
      }
      if (set_qwizard_data_b) {
         qw.set_qwizard_data ('intro_text', intro_text);
      }
   }

   // Save intro html.
   deckdata[i_deck].intro_html = intro_html;

   var card_html = htm;
   if (n_cards != 0) {

      // card_html -- everything from first [q] on.  Include opening tags.
      var i_pos = qqc.opening_tag_shortcode_pos ('([q |[q])', htm);
      card_html = htm.substr (i_pos);
   }

   var exit_mobile_button_html =
         '<button class="summary_exit_mobile_deck qbutton" onclick="' + qname + '.exit_mobile (' + i_deck + ')">\n'
       +    'Return to page view'
       + '</button>\n';

   // If there's exit html, capture for summary report.
   var exit_html = qqc.parse_html_block (card_html, ['[x]'], []);
   if (exit_html != 'NA') {
      exit_html = exit_html.replace (/\[x\]/, '');

      // If there's an unmatched </p> or the like near the beginning, add a
      // matching opening tag.
      exit_html = qqc.balance_closing_tag (exit_html);
      if (set_qwizard_data_b) {
         qw.set_qwizard_data ('exit_text', exit_html);
      }
   } else {
      exit_html = '';
   }
   if (deckdata[i_deck].use_dataset) {
      if (exit_html.indexOf ('[restart]') == -1) {
         exit_html += '<br />[restart]';
      }
   }
   if (exit_html) {

      // If "[restart]" tag there, replace with restart button html.  Send flag
      // to start_deck () -- don't need to check login.
      var label;
      if (deckdata[i_deck].use_dataset && deckdata[i_deck].dataset_intro_f) {
         label = T ('Practice more flashcards');
      } else {
         label = T ('Review this flashcard stack again');
      }
      var restart_button_html =
                       '    <button class="qbutton qwiz_restart"'
                     + '            onclick="' + qname + '.start_deck (' + i_deck + ', true)">\n'
                     +          label + '\n'
                     + '    </button>\n';
      exit_html = exit_html.replace (/\[restart\]/, restart_button_html);
      exit_html += '<br />' + exit_mobile_button_html;

      // Delete exit html from card html.
      var i_pos_exit_opening = qqc.opening_tag_shortcode_pos ('[x]', card_html);
      card_html = card_html.substr (0, i_pos_exit_opening);
   } else {

      // Add initially-non-displayed "exit-mobile-mode" button.
      exit_html = exit_mobile_button_html;
   }
   deckdata[i_deck].exit_html = exit_html;

   // If not using a dataset, may be specific cards from various datasets.
   // If so, save card html.
   if (! use_dataset) {
      if (htm.search (/use_dataset_card\s*=\s*/) != -1) {
         use_dataset_cards_b = true;
         deckdata[i_deck].use_dataset_card_html = card_html;
      }
   }

   // If either dataset or specific cards from datasets, process cards after
   // call to qqc.get_dataset_questions ().
   if (n_cards && ! use_dataset && ! use_dataset_cards_b) {
      n_cards = q.process_cards (card_html, i_deck);
   }
   q.no_intro_b.push (no_intro_i_b);
   if (! use_dataset && ! use_dataset_cards_b) {
      deckdata[i_deck].n_cards = n_cards;
      deckdata[i_deck].n_to_go = n_cards;
      if (set_qwizard_data_b) {
         qw.set_qwizard_data ('n_questions', n_cards);
      }
   }

   // First [qdeck] tag becomes start of container for card.  Add additional
   // div elements (progress, summary div, "next" buttons).
   new_html = create_qdeck_divs (i_deck, qdeck_tag);

   if (debug[3]) {
      console.log ('                    new_html: ', new_html);
   }
   if (q.qwizard_b) {

      // Called from qwizard.js - return error messages to qwizard (won't
      // always be used).
      qwizard.errmsgs = errmsgs;
   }
   set_qwizard_data_b = false;

   return new_html;
}


// -----------------------------------------------------------------------------
this.process_cards = function (card_html, i_deck, i_qwizard_card) {
   if (debug[0]) {
      console.log ('[process_cards] card_html:', card_html);
   }

   // i_qwizard_card is set if called directly from qwizard.js (rather than via
   // process_qdeck_pair ()).
   if (typeof (i_qwizard_card) != 'undefined') {
      number_first_card = i_qwizard_card;
   } else {
      number_first_card = 0;
   }

   // May be from use_dataset= retrieval.  Delete qwizcard comments, if any.
   // DKTMP -- may leave empty paragraphs.
   // Leave comments in place if from qwizard.js.
   if (! set_qwizard_data_b) {
      if (/\[!/.test (card_html)) {
         card_html = card_html.replace (/\[!+\][\s\S]*?\[\/!+\]/gm, '');
      }
   }

   // Find topic attributes, if any, for cards.  First get [q] tags.
   var card_tags = card_html.match (/\[q[^\]]*\]/gm);
   if (debug[4]) {
      console.log ('[process_cards] card_tags[0]: ', card_tags[0]);
   }
   var n_cards = card_tags.length;
   if (debug[0]) {
      console.log ('[process_cards] n_cards: ', n_cards);
   }

   q.process_card_attributes (i_deck, card_tags, i_qwizard_card);

   // Find cards -- opening tags of each up to opening tags of next.
   var cards_html = [];
   var qtags = ['[q]', '[q '];
   var remaining_card_html = card_html;
   while (true) {
      var card_i_html = qqc.parse_html_block (remaining_card_html, qtags, qtags);
      if (card_i_html == 'NA') {
         break;
      }
      remaining_card_html = remaining_card_html.substr (card_i_html.length);

      // Remove [q ...] shortcode.
      card_i_html = card_i_html.replace (/\[q[^\]]*\]/, '');
      cards_html.push (card_i_html);
   }
   if (debug[0]) {
      console.log ('[process_cards] cards_html: ', cards_html);
   }

   // Take off initial "[q]" (or "[q topic=...]".
   //var start = card_html.search (/\]/) + 1;
   //card_html = card_html.substr (start);

   // Split into individual cards -- [q] (fronts) and [a] (backs).
   //var cards_html = card_html.split (/(<[^\/][^>]*>\s*)*?\[q [^\]]*\]|(<[^\/][^>]*>\s*)*?\[q\]/);
   var n_cards = cards_html.length;

   // Save each card and answer html in data array.
   for (var ii=0; ii<n_cards; ii++) {
      var i_card = ii + number_first_card;
      var card;

      // See if hangman-style entry.
      if (cards_html[ii].search (/\[hangman|qdeck_hangman/m) != -1) {
         card = process_hangman (i_deck, i_card, cards_html[ii]);

      // See if required input for [textentry] -- [c] or [c*] on card.
      } else if (cards_html[ii].search (/\[c\]|\[c\*\]/m) != -1) {
         card = process_textentry (i_deck, i_card, cards_html[ii]);
      } else {
         card = process_card_input (i_deck, i_card, cards_html[ii]);
      }
      deckdata[i_deck].cards[i_card] = card;
   }

   return n_cards;
}


// -----------------------------------------------------------------------------
function create_qwiz_icon_div (i_deck) {
   var style = '';
   if (qqc.get_qwiz_param ('beta')) {
      style = 'style = "background: red;"';
   }
   var divs = [];
   divs.push ('<div id="icon_qdeck' + i_deck + '" class="icon_qdeck" ' + style + '>');
   var icon_qwiz = qqc.get_qwiz_param ('icon_qwiz');
   if (icon_qwiz != 'Not displayed') {
      var title = 'Want to use this flashcard deck in your own class?';
      if (icon_qwiz != 'Icon only') {

         // If qrecord_id, sharing, href will be reset by jjax call to
         // check_registered.php.
         var share_loc = qqc.get_qwiz_param ('server_loc').replace ('admin', 'share/?q_f=F');
         divs.push ('<a href="' + share_loc + '" style="box-shadow: none;" target="_blank">');
      } else {
         title += '  See qwizcards.com/share';
      }

      divs.push ('      <img class="icon_qdeck" style="border: none;" title="' + title + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAIAAAALACogAAAABnRSTlMA/wD/AP83WBt9AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABP0lEQVR4nGP8//8/AymAiSTV5GhgwSZ4rcRrxRooW3futlBnJDlGND/cXzXVccFLVP0oepiwqtZJyH2wrenBtogQBgYGhsv9q15j9cO1qTDVW8JEGRgYGBi0PJ0YGBgYrjzCpuH+qv1rGBgYGHQLoaoZGBgYlOTEGRgYGB68uY+h4fXuQy8ZGBgYnLSRvXjv0UsGBgYGBRFFdA1Prm+6x8DAwBBio4XsyO37GBgYGHTkEHaixYO4mszrWTl1CjmH7iMcKe5nhdAAi4cnL6/A3HbrHgMDw56pJ0QYIOHr5JgmgzASZoOFdggDAwPDy03HRCEhs6YJEne6c0uQHYkUcXt76pL3oTqQQbxqVjay8Sh+cC5pmuuEpkFMWQZNBCNpwMDrWTmT2+5hCCu54EqtomkVLjqYwgoiuGzACWifgQDhK2rq5bcX2gAAAABJRU5ErkJggg==" />');

      if (icon_qwiz != 'Icon only') {
         divs.push ('</a>');
      }
   }
   divs.push ('</div>');

   return divs.join ('');
}


// -----------------------------------------------------------------------------
this.qwiz_icon_stop_propagation = function (i_deck) {

   // Don't let click on icon bubble to flip.
   $ ('#icon_qdeck' + i_deck).click (function (event) {
      event.stopPropagation ();
   });
}


// -----------------------------------------------------------------------------
// Get card front and card back html, put into data array.
function process_card_input (i_deck, i_card, htm) {

   // Object for this card.
   var card = {};
   card.got_it = false;

   // Start with any opening tags that preceded "[q]" tag.
   var card_front_and_back_html = htm;
   if (debug[1]) {
      console.log ('[process_card_input] card_front_and_back_html: ', card_front_and_back_html);
   }

   // Get rid of everything from "[a]" (card back) on.  Include any opening
   // tags.
   var i_answer_pos = qqc.opening_tag_shortcode_pos ('[a]', card_front_and_back_html);
   var card_front_html = card_front_and_back_html.substr (0, i_answer_pos);

   // If recording, save text without tags.  Also, replace non-breaking spaces
   // and EOLs with space, multiple spaces with single space, trim.
   if (deckdata[i_deck].qrecord_id) {
      var q_and_a_text = qqc.remove_tags_eols (card_front_html);
      deckdata[i_deck].q_and_a_text[i_card] = q_and_a_text;
   }

   if (set_qwizard_data_b) {
      qw.questions_cards[i_card].type = 'simple_card';

      // Include opening tags -- formatting -- with question text, so
      // qwizard will save (and allow changes to) formatting.  Already in
      // card_front_and_back_html.
      qw.questions_cards[i_card].question_text = card_front_html;
   }

   // If [textentry], change to html equivalent.  Save flag if there.
   var front_textentry_b = false;
   if (card_front_html.indexOf ('[textentry') != -1) {
      card_front_html = card_front_textentry_html (card_front_html, i_deck);
      front_textentry_b = true;
      if (set_qwizard_data_b) {
         qw.questions_cards[i_card].type = 'optional_textentry';
      }
   }
   card.card_front = card_front_html;


   // ..........................................................................
   // Card back html, including opening tags.
   var card_back_html = card_front_and_back_html.substr (i_answer_pos);
   if (debug[0]) {
      console.log ('[process_card_input] card_back_html: ', card_back_html);
   }

   // Delete the "[a]".
   var a_opening_tags = '';
   if (! card_back_html) {
      var dotdotdot = htm.length > 150 ? ' ...' : '';
      errmsgs.push (T ('Did not find answer ("[a]") -- card back -- for') + ' qdeck ' + (i_deck + 1) + ', ' + T ('card') + ' ' + (i_card + 1) + '\n' + htm.substr (0, 150) + dotdotdot);
      card_back_html = '';
   } else {
      // Handle opening tags separately.
      var shortcode_pos = card_back_html.indexOf ('[a]');
      a_opening_tags = card_back_html.substr (0, shortcode_pos);
      card_back_html = card_back_html.substr (shortcode_pos + 3);
   }

   // If qwizard, if still placeholder, also error.
   if (q.qwizard_b) {
      if (card_back_html.indexOf ('<span class="qwizard_placeholder">') != -1) {
         errmsgs.push (T ('Did not enter answer text -- card back -- for') + ' qdeck ' + (i_deck + 1) + ', ' + T ('card') + ' ' + (i_card + 1) + '\n' + htm);
      }
   }
   if (set_qwizard_data_b) {
      qw.questions_cards[i_card].answer_text = a_opening_tags + card_back_html;
   }

   // Split into individual items.  Should be just one.
   var card_back_items = card_back_html.split (/\[a\]/);
   if (card_back_items.length != 1) {
      errmsgs.push (T ('Got more than one answer ("[a]") -- card back -- for') + ': qdeck ' + (1 + i_deck) + ', ' + T ('card') + ' ' + (1 + i_card) + '\n' + htm);
   }

   // If recording, add card-back text to q_and_a_text.
   if (deckdata[i_deck].qrecord_id) {
      var q_and_a_text = qqc.remove_tags_eols (card_back_items[0]);
      deckdata[i_deck].q_and_a_text[i_card] += '\n' + q_and_a_text;
   }

   card.card_back = create_card_back_html (i_deck, i_card, card_back_items[0],
                                           a_opening_tags, front_textentry_b);
   return card;
}


// -----------------------------------------------------------------------------
// Process input for card with [textentry] with required input/autocomplete.
function process_textentry (i_deck, i_card, htm) {

   // Object for this card.
   var card = {};
   card.got_it = false;

   // Capture text up to first [c] or [c*], not including opening tags before.
   var question_text = '';
   var i_pos = qqc.opening_tag_shortcode_pos ('([c]|[c*])', htm);
   if (i_pos == htm.length) {
      errmsgs.push (T ('No answer-word given') + ': deck ' + (1 + i_deck) + ', ' + T ('card') + ' ' + (1 + i_card));
   } else {
      question_text = htm.substr (0, i_pos);
   }
   if (set_qwizard_data_b) {

      // Include opening tags -- formatting -- with question text, so qwizard
      // will save (and allow changes to) formatting.
      qw.questions_cards[i_card].question_text = question_text;
      qw.questions_cards[i_card].choices = [];
      qw.questions_cards[i_card].correct_choice_fs = [];
      qw.questions_cards[i_card].feedbacks = [];
   }

   // Look for [textentry], see if plurals specified or minlength specified.
   var textentry_plural_b = false;
   var textentry_minlength = 3;
   var use_dict_b  = default_use_dict == 'true';
   var use_terms_b = default_use_terms == 'true';
   var single_char_b = false;
   var m = question_text.match (/\[textentry([^\]]*)\]/m);
   if (! m) {
      errmsgs.push (T ('Free-form input choices [c] or [c*] card does not have [textentry]')+ ': qdeck ' + (1 + i_deck) + ', ' + T ('card') + ' ' + (1 + i_card));
   } else {
      var attributes = m[1];
      if (attributes) {

         // Look for "plural=" attribute.  Match regular double-quote, or
         // left- or right-double-quote.
         attributes = qqc.replace_smart_quotes (attributes);
         textentry_plural_b = get_attr (attributes, 'plural') == 'true';

         // "minlength=" attribute.
         var attr_val = get_attr (attributes, 'minlength');
         if (attr_val != '') {
            textentry_minlength = attr_val;
         }

         // "use_terms=" attribute.
         var use_terms = get_attr (attributes, 'use_terms');
         if (use_terms) {
            use_terms_b = use_terms != 'false';
         }

         // "use_dict=" attribute.
         var use_dict = get_attr (attributes, 'use_dict');
         if (use_dict) {
            use_dict_b = use_dict != 'false';
         }

         // "single_char=" attribute.
         single_char_b = get_attr (attributes, 'single_char') == 'true';
      }
   }
   if (set_qwizard_data_b) {
      qw.questions_cards[i_card].type = single_char_b ? 'one_letter_answer' : 'textentry';
      qw.questions_cards[i_card].textentry_attributes = attributes;
   }

   // Replace [textentry] with input textbox and (hidden, initially) hint button.
   // Placeholder will be set later (in init_textentry_autocomplete ()).
   var classname;
   var style = '';
   if (single_char_b) {
      classname = 'qcard_single_char_entry';
      style = 'style="width: 2em;" ';
   } else {
      classname = 'qcard_textentry';
   }
   var input_and_button_htm =   '<div class="' + classname + '">\n'
                              +    '<input type="text" class="textentry-qdeck' + i_deck + ' ' + classname + '" ' + style + 'onfocus="' + qname + '.set_textentry_i_deck (this)" />\n'
                              +    '<button id="textentry_hint-qdeck' + i_deck + '" class="qbutton textentry_hint" onclick="' + qname + '.textentry_hint (' + i_deck + ')" disabled>'
                              +        T ('Hint')
                              +    '</button>\n'
                              + '</div>\n';

   htm = htm.replace (/\[textentry([^\]]*)\]/, input_and_button_htm);
   if (debug[0]) {
      console.log ('[process_textentry] htm:', htm);
   }

   // Look for choices and answers/feedback (interleaved, answer/feedback
   // required for each choice).  Save as data, delete here.
   var choice_start_tags = ['[c]', '[c*]'];
   var choice_next_tags  = ['[c]', '[c*]', '[x]'];

   var got_feedback_b = false;

   // Look for first [c], including any opening tags.
   var c_pos = qqc.opening_tag_shortcode_pos ('([c]|[c*])', htm);

   // Start with [c]s.
   var remaining_htm = htm.substr (c_pos);

   // Delete opening tags before first [c] and the rest.
   htm = htm.substr (0, c_pos);

   // Save as card front, set flag that entry required.
   card.card_front = htm;
   card.textentry_required_b = true;

   // If recording, save card front without tags.  Exclude "Hint".
   if (deckdata[i_deck].qrecord_id) {
      var q_and_a_text = htm.replace (/<button.*Hint.*?<\/button>/, '');
      q_and_a_text = qqc.remove_tags_eols (q_and_a_text);
      deckdata[i_deck].q_and_a_text[i_card] = q_and_a_text;
   }

   // Set up data for this card, create a div for each feedback alt -- so can
   // measure each, set front and back card size.  Div to show selected in
   // flip () > textentry_set_card_back () depending on text entered.
   card.choices = [];
   card.textentry_plural_b = textentry_plural_b;
   card.textentry_minlength = textentry_minlength;
   card.use_terms_b = use_terms_b;
   card.use_dict_b = use_dict_b;
   card.single_char_b = single_char_b;
   card.feedback_htmls = [];
   card.all_choices = [];
   card.card_back = '';
   var card_back = '';

   // Loop over [c]s.
   var i_choice = 0;
   var default_choice_given_b = false;
   while (true) {
      var choice_html = qqc.parse_html_block (remaining_htm, choice_start_tags,
                                              choice_next_tags);
      if (choice_html == 'NA') {
         break;
      }
      remaining_htm = remaining_htm.substr (choice_html.length);

      // See if there's feedback within the choice html.
      var r = process_feedback_item (choice_html);
      choice_html  = r.choice_html;

      if (r.feedback_html) {
         got_feedback_b = true;

         card.feedback_htmls.push (r.feedback_html);

         // Check that there's not more than one feedback item accompanying
         // this choice.
         var r_check = process_feedback_item (choice_html);
         if (r_check.feedback_html) {
            errmsgs.push (T ('More than one answer or feedback shortcode [a] or [f] given with [textentry] choice') + ': qdeck ' + (1 + i_deck) + ', ' + T ('card') + ' ' + (1 + i_card) + ', ' + T ('choice') + ' ' + (1 + i_choice));
         }
      } else {

         // No answers/feedback given for this choice.
         errmsgs.push (T ('Did not get answer/feedback [a] or [f] for [textentry] choice') + ': qdeck ' + (1 + i_deck) + ', ' + T ('card') + ' ' + (1 + i_card) + ', ' + T ('choice') + ' ' + (1 + i_choice));
         card.feedback_htmls.push ('');
      }
      if (set_qwizard_data_b) {
         qw.questions_cards[i_card].feedbacks[i_choice] = r.feedback_html;
      }

      // Parse choice data.  [c] or [c*] followed by semicolon-separated list
      // of potential answers.  Delete up through [c] or [c*].
      choice_html = choice_html.replace (/.*\[c\*{0,1}\]/m, '');

      // Delete any tags and EOLs and non-breaking spaces.
      choice_html = choice_html.replace (/<[^>]+>|\n|&nbsp;/g, '');

      // Error if just blanks and semicolons.
      if (choice_html.replace (';', '').search (/\S/) == -1) {
         errmsgs.push (T ('No text given for [textentry] choice') + ' - qdeck ' + (i_deck + 1) + ', ' + T ('question') + ' ' + (1 + i_card) + ', ' + T ('choice') + ' ' + (1 + i_choice));
      }

      // Split on semicolons.
      var alts = choice_html.split (/\s*;\s*/);

      // Eliminate any blank entries.
      var nonblank_alts = [];
      for (var i=0; i<alts.length; i++) {
         if (alts[i].search (/\S/) != -1) {
            nonblank_alts.push (qqc.trim (alts[i]));
         }
      }

      // If default choice/feedback ("*" entered), set indicator.
      if (nonblank_alts[0] == '*') {
         default_choice_given_b = true;

         // Must be accompanied by feedback/answer (no default for "wrong
         // answers").
         if (card.feedback_htmls[i_choice] == '') {
            errmsgs.push (T ('For [textentry] card, wildcard choice ("*", for any other user entry) must be accompanied by answer/feedback "[a] or [f]"'));
         }
      }

      // Save these, associated with this choice.
      card.choices.push (nonblank_alts);
      if (set_qwizard_data_b) {
         qw.questions_cards[i_card].choices.push (nonblank_alts.join (';'));
      }

      // Also save as simple array for this card.  Check no duplicates (only
      // first instance feedback would be given).
      var n_alts = nonblank_alts.length;
      for (var i=0; i<n_alts; i++) {
         if (card.all_choices.indexOf (nonblank_alts[i]) != -1) {
            errmsgs.push (T ('Entry given in more than one [textentry] choice') + ': ' + nonblank_alts[i] + ' - qdeck ' + (i_deck + 1) + ', ' + T ('card') + ' ' + (1 + i_card) + ', ' + T ('choice') + ' ' + (1 + i_choice));
         }
      }
      card.all_choices = card.all_choices.concat (nonblank_alts);
      i_choice++;
   }
   if (set_qwizard_data_b) {
      qw.questions_cards[i_card].n_choices = i_choice;
   }
   card.card_back = card_back;

   // If default choice ([c] *) and feedback/answer supplied, must be at least
   // one other choice-feedback/answer pair.
   if (default_choice_given_b) {
      if (card.choices.length == 1) {
         errmsgs.push (T ('Need to define acceptable entries for [textentry] card in addition to "other entry" choice ([c] *)') + ' - qdeck ' + (i_deck + 1) + ', ' + T ('card') + ' ' + (1 + i_card));
      }
   }
   if (debug[6]) {
      console.log ('[process_textentry] card.choices:', card.choices);
      console.log ('[process_textentry] card.feedback_htmls:', card.feedback_htmls);
   }

   return card;
}


// -----------------------------------------------------------------------------
function process_hangman (i_deck, i_card, card_html) {

   // Object for this card.
   var card = {};
   card.got_it = false;

   // Start with any opening tags that preceded "[q]" tag.
   var card_front_html = card_html;

   // Get rid of everything from "[a]" (card back) on, including opening tags.
   card_front_html = card_front_html.replace (/(<[^\/][^>]*>\s*)*?\[a\][\s\S]*/m, '');
   if (debug[9]) {
      console.log ('[process_hangman] card_front_html: ', card_front_html);
   }

   // If recording, replace [hangman] shortcode with __________.
   if (deckdata[i_deck].qrecord_id) {
      var q_and_a_text = card_front_html.replace (/\[hangman[^\]]*\]/, '_________');
      deckdata[i_deck].q_and_a_text[i_card] = qqc.remove_tags_eols (q_and_a_text);
   }
   var hangman_max_hints = default_hangman_max_hints;

   // Look for "hint=" attribute.
   var m = card_html.match (/\[hangman([^\]]*)\]/m);
   if (m) {
      var attributes = m[1];
      if (attributes) {
         attributes = qqc.replace_smart_quotes (attributes);
         var hints = get_attr (attributes, 'hints');
         if (hints) {
            if (hints.search (/[^0-9]/) == -1) {
               hangman_max_hints = parseInt (hints);
            } else {
               errmsgs.push (T ('"hints" for [hangman] should be a number') + ': deck ' + (1 + i_deck) + ', ' + T ('card') + ' ' + (1 + i_card));
            }
         }
      }
   }


   // Look for first [c], including opening tags.
   var question_htm;
   var c_pos = card_front_html.search (/(<[^\/][^>]*>\s*)*?\[c\*{0,1}\]/m);
   if (c_pos == -1) {
      errmsgs.push (T ('Did not get [c] or [c*] (hangman answer) with [hangman]') + ': deck ' + (1 + i_deck) + ', ' + T ('card') + ' ' + (1 + i_card));
      c_pos = 0;
      question_htm = card_front_html;
   } else {
      question_htm = card_front_html.substr (0, c_pos);
   }

   // If [hangman] is inside paragraph or header, close previous and start new,
   // give both inline-block style, and wrap whole thing in div that replicates
   // paragraph's or header's style (handles "text-align=center", for example.
   // Look backwards from [hangman].  If first thing you come to is </p or </h,
   // then you're OK.  If first thing you come to is <p or <h, then do
   // modification.
   var h_pos = question_htm.indexOf ('[hangman]');
   for (var i=h_pos-3; i>=0; i--) {
      var chrs = question_htm.substr (i, 3);
      if (chrs == '</p' || chrs == '</h') {
         break;
      } else {
         chrs = chrs.substr (0, 2);
         if (chrs == '<p' || chrs == '<h') {
            question_htm = qqc.make_inline (question_htm, i);
         }
      }
   }
   if (set_qwizard_data_b) {
      qw.questions_cards[i_card].type = 'hangman';
      qw.questions_cards[i_card].hangman_attributes = attributes;

      // Include opening tags -- formatting -- with question text, so qwizard
      // will save (and allow changes to) formatting.
      qw.questions_cards[i_card].question_text = question_htm;
      qw.questions_cards[i_card].choices = [];
      qw.questions_cards[i_card].feedbacks = [];
   }
   if (debug[9]) {
      console.log ('[process_hangman] question_htm:', question_htm);
   }

   // Hangman answer.  Start with [c] or [c*].  Make sure only one.
   var remaining_htm = card_front_html.substr (c_pos);
   var choice_start_tags = ['[c]', '[c*]'];
   var choice_next_tags  = ['[c]', '[c*]', '[x]'];

   // Loop over [c]s (should only be one!).
   var i_choice = 0;
   var hangman_answer = '';
   var hangman_answer_length = 0;
   while (true) {
      var choice_html = qqc.parse_html_block (remaining_htm, choice_start_tags,
                                              choice_next_tags);
      if (choice_html == 'NA') {
         break;
      }
      remaining_htm = remaining_htm.substr (choice_html.length);

      // Get hangman answer.
      var hangman_match = choice_html.match (/\[c\*{0,1}\]([^\[]*)/m);
      if (hangman_match) {
         hangman_answer = hangman_match[1];

         // Delete any tags and EOLs and non-breaking spaces.
         hangman_answer = hangman_answer.replace (/<[^>]+>|\n|&nbsp;/g, '');
         hangman_answer = qqc.trim (hangman_answer);
         hangman_answer_length = hangman_answer.length;
         if (debug[9]) {
            console.log ('[process_hangman] hangman_answer:', hangman_answer);
         }
      }
      i_choice++;
   }
   if (i_choice > 1) {
      errmsgs.push (T ('More than one hangman answer ([c] or [c*]) given') + ': deck ' + (1 + i_deck) + ', ' + T ('card') + ' ' + (1 + i_card));
   }

   // Save the answer.
   if (! deckdata[i_deck].hangman_answer) {
      deckdata[i_deck].hangman_answer          = {};
      deckdata[i_deck].hangman_final_entry     = {};
      deckdata[i_deck].hangman_current_entry   = {};
      deckdata[i_deck].hangman_incorrect_chars = {};
      deckdata[i_deck].hangman_max_hints       = {};
      deckdata[i_deck].hangman_n_hints = 0;
   }
   deckdata[i_deck].hangman_answer[i_card]    = hangman_answer;
   if (set_qwizard_data_b) {
      qw.questions_cards[i_card].choices[0] = hangman_answer;
   }
   deckdata[i_deck].hangman_max_hints[i_card] = hangman_max_hints;

   // Thin-space-separated characters, individually underscored (except for
   // non-alpha characters).
   var hangman_final_entry = qqc.create_hangman_entry (hangman_answer);

   // Save.  Substitute a single character (tab) for &ensp; in saved value.
   deckdata[i_deck].hangman_final_entry[i_card] = hangman_final_entry;

   // Just en-spaces for input value -- so user can click anywhere in input
   // text box.
   var hint_class = hangman_max_hints ? ' qdeck_hangman_w_hint' : '';
   var input_value = new Array (hangman_answer_length).join ('&ensp;');
   var hangman_div =   '<div class="qdeck_hangman' + hint_class + '">'
                     +    '<div class="entry">'
                     +    '</div>'
                     +    '<input type="text" onkeyup="' + qname + '.hangman_keyup (this, event,\' ' + input_value + '\', ' + i_deck + ', ' + i_card + ')" value="' + input_value + '" />';
   if (hangman_max_hints) {
      var title = '';
      if (hangman_max_hints < hangman_answer.replace (/[a-z0-9]/i, '').length) {
         title = ' title="' + T ('You can get') + ' ' + qqc.number_to_word (hangman_max_hints) + ' ' + T ('hint') + ' ' + Tplural ('letter', 'letters', hangman_max_hints) + '"';
      }
      hangman_div   +=    '<button id="hangman_hint-qdeck' + i_deck + '" class="qbutton hangman_hint" onclick="' + qname + '.hangman_hint (' + i_deck + ', ' + i_card + ')" title="' + T ('You can get two hint letters') + '">'
                     +        T ('Hint')
                     +    '</button>\n';
   }
   hangman_div      +=    '<div class="hangman_status"></div>'
                     + '</div>';
   question_htm = question_htm.replace (/\[hangman[^\]]*\]/, hangman_div);

   // Add hangman message div.
   // DKTMP
   //question_htm += '<div class="qdeck_hangman_msg"></div>';

   card.card_front = question_htm;

   // ..........................................................................
   // Find card back html, including opening tags.
   var i_pos = qqc.opening_tag_shortcode_pos ('[a]', card_html);
   var card_back_html = card_html.substr (i_pos);
   if (debug[0]) {
      console.log ('[process_hangman] card_back_html: ', card_back_html);
   }

   // Take off initial "[a]".
   var a_opening_tags = '';
   if (! card_back_html) {
      errmsgs.push (T ('Did not find answer ("[a]") -- card back -- for') + ' qdeck ' + (i_deck + 1) + ', ' + T ('card') + ' ' + (i_card + 1) + '\n' + card_html);
      card_back_html = '';
   } else {

      // Handle opening tags separately.
      var shortcode_pos = card_back_html.indexOf ('[a]');
      a_opening_tags = card_back_html.substr (0, shortcode_pos);
      card_back_html = card_back_html.substr (shortcode_pos + 3);
   }

   // Split into individual items.  Should be just one.
   var card_back_items = card_back_html.split (/\[a\]/);
   if (card_back_items.length != 1) {
      errmsgs.push (T ('Got more than one answer ("[a]") -- card back -- for') + ': qdeck ' + (1 + i_deck) + ', ' + T ('card') + ' ' + (1 + i_card) + '\n' + card_html);
   }

   // If recording, add card-back text to q_and_a_text.
   if (deckdata[i_deck].qrecord_id) {
      var q_and_a_text = qqc.remove_tags_eols (card_back_items[0]);
      deckdata[i_deck].q_and_a_text[i_card] += '\n' + q_and_a_text;
   }

   card.card_back = create_card_back_html (i_deck, i_card, card_back_items[0],
                                           a_opening_tags, false);
   if (set_qwizard_data_b) {
      qw.questions_cards[i_card].answer_text = a_opening_tags + card_back_items[0];
   }

   return card;
}


// -----------------------------------------------------------------------------
this.hangman_keyup = function (input_el, event, default_value, i_deck, ii_card) {
   var key = event.keyCode;

   // Get current input, reset to blank default.
   var value = input_el.value;
   input_el.value = default_value;
   if (debug[9]) {
      console.log ('[hangman_keyup] value.charCodeAt:', value.charCodeAt (0), value.charCodeAt (1), value.charCodeAt (2), value.charCodeAt (3));
   }

   // Ignore if not in [A-Za-z0-9].  Typing quickly can produce more than one
   // character.
   var keychars = value.replace (/[^a-z0-9]/gi, '');
   if (keychars == '') {
      return false;
   }
   keychars = keychars.toLowerCase ();
   if (debug[9]) {
      console.log ('[hangman_keyup] keychars:', keychars);
   }

   // Update entry.  If characters are in answer, replace.  If not, add to
   // incorrect-letters list.
   var current_entry = deckdata[i_deck].hangman_current_entry[ii_card];
   var final_entry   = deckdata[i_deck].hangman_final_entry[ii_card];

   // Loop over characters.
   var n_chars = keychars.length;
   for (var i=0; i<n_chars; i++) {
      var keychar = keychars[i];
      var break_f = update_hangman_input (keychar, current_entry, final_entry,
                                          i_deck, ii_card, input_el);
      if (break_f) {
         break;
      }
   }

   // Show status; only first 8 incorrect letters.
   if (deckdata[i_deck].hangman_incorrect_chars[ii_card]) {
      var hangman_incorrect_chars_display 
         = qqc.create_hangman_incorrect_chars_display (deckdata[i_deck].hangman_incorrect_chars[ii_card], 3);
      $ (input_el).siblings ('div.hangman_status').html (hangman_incorrect_chars_display);
   } else {
      $ (input_el).siblings ('div.hangman_status').html ('');
   }

   return true;
}


// -----------------------------------------------------------------------------
function update_hangman_input (keychar, current_entry, final_entry,
                               i_deck, ii_card, input_el, hint_f) {
   var break_f = false;
   var good_char_b = false;
   var i_pos = -1;

   // Final-entry characters are each between <u></u> pairs.
   var re = new RegExp ('>' + keychar + '<', 'i');
   while (true) {
      var m = final_entry.substr (i_pos + 1).match (re);
      if (! m ) break;
      i_pos += m.index + 1;
      current_entry = qqc.setCharAt (current_entry, i_pos + 1, m[0][1]);
      good_char_b = true;
   }
   if (debug[9]) {
      console.log ('[update_hangman_input] keychar:', keychar, ', good_char_b:', good_char_b);
   }

   var hangman_incorrect_chars = deckdata[i_deck].hangman_incorrect_chars[ii_card];
   if (good_char_b) {
      deckdata[i_deck].hangman_current_entry[ii_card] = current_entry;
      var local_current_entry = current_entry.replace (/\t/g, '&ensp;');
      $ (input_el).siblings ('div.entry').html (local_current_entry);

      // Did this character complete the hangman (all <u>\t</u> filled in)?
      var done_f = current_entry.indexOf ('<u>\t</u>') == -1;
      if (done_f) {

         // Yes.  Don't accept further input.
         $ (input_el).attr ('disabled', true);

         //Enable "Check answer".
         $ (button_flip_selector (i_deck))
            .removeAttr ('disabled')
            .removeClass ('qbutton_disabled')
            .addClass ('qbutton')
            .html (T ('Flip'));
         deckdata[i_deck].check_answer_disabled_b = false;

         // Do flip.  Somehow hint on last character triggers a flip, so not
         // needed here when hint.
         if (! hint_f) {
            q.flip (i_deck);
         }

         // Exit loop over characters.
         break_f = true;
      }
   } else {

      // Letter incorrect.  Update status.  Do if not already there.
      keychar = keychar.toLowerCase ();
      if (hangman_incorrect_chars.indexOf (keychar) == -1) {
         hangman_incorrect_chars += keychar;
      }
      deckdata[i_deck].hangman_incorrect_chars[ii_card] = hangman_incorrect_chars;
      if (debug[9]) {
         console.log ('[hangman_keyup] hangman_incorrect_chars:', hangman_incorrect_chars);
      }
   }

   return break_f;
}


// -----------------------------------------------------------------------------
this.hangman_hint = function (i_deck, i_card) {

   // Allow two hints -- each hint gives first unfilled-blank letter.
   deckdata[i_deck].hangman_n_hints++;
   if (deckdata[i_deck].hangman_n_hints > deckdata[i_deck].hangman_max_hints[i_card]) {
      return false;
   } else if (deckdata[i_deck].hangman_n_hints == deckdata[i_deck].hangman_max_hints[i_card]) {

      // Disable hint button.
      $ ('#hangman_hint-qdeck' + i_deck)
         .attr ('disabled', true)
         .removeClass ('qbutton')
         .addClass ('qbutton_disabled');
   }

   // Get correct answer.
   var hangman_answer = deckdata[i_deck].hangman_answer[i_card];

   // Get current entry and find position -- in answer -- of first still-blank
   // letter.  Hangman characters in answer are A-Z, a-z, and 0-9.  Hangman
   // characters in current entry are between <u></u> pairs (either character
   // or \t -- indicates blank).
   var current_entry = deckdata[i_deck].hangman_current_entry[i_card];
   var matches = current_entry.match (/<u>.<\/u>/g);
   var i_pos = matches.indexOf ('<u>\t</u>');
   if (debug[9]) {
      console.log ('[hangman_hint] matches:', matches);
      console.log ('[hangman_hint] i_pos:', i_pos);
   }

   if (i_pos != -1) {
      var final_entry = deckdata[i_deck].hangman_final_entry[i_card];

      // Extract the corresponding character.
      matches = final_entry.match (/<u>.<\/u>/g);
      var hint_char = matches[i_pos][3];

      // Substitute in to current input.
      var $hangman_input = q.$card_front (i_deck).find ('div.qdeck_hangman input');
      var input_el = $hangman_input[0];
      update_hangman_input (hint_char, current_entry, final_entry, 
                            i_deck, i_card, input_el, true);
      $hangman_input.focus ();
   }
}


// -----------------------------------------------------------------------------
function single_char_textentry_keyup (e) {
   var input_el = e.target;
   if (debug[6]) {
      console.log ('[single_char_textentry_keyup] input_el:', input_el);
   }

   // Get first character.  Ignore if not in alphanumeric.
   var value = input_el.value;
   if (value.search (/[a-z0-9]/i) == -1) {
      input_el.value = '';
      return false;
   }

   // Get i_deck from classes.  Looks like "textentry-qdeck0".
   var classes = input_el.className;
   var i_deck = classes.match (/textentry-qdeck([0-9]+)/)[1];

   // Flip.
   q.flip (i_deck);
}


// -----------------------------------------------------------------------------
function process_feedback_item (choice_html) {

   // Answers/feedback.
   var feedback_start_tags = ['[a]', '[f]'];
   var feedback_next_tags  = ['[a]', '[f]', '[x]'];

   var feedback_html = qqc.parse_html_block (choice_html, feedback_start_tags,
                                             feedback_next_tags);
   if (feedback_html != 'NA') {

      // Yes.  Take out of the choice html.
      choice_html = choice_html.replace (feedback_html, '');

      // Delete [a] or [f].
      feedback_html = feedback_html.replace (/\[[af]\]/, '');
      if (debug[2]) {
         console.log ('[process_feedback_item] feedback_html: ', feedback_html);
      }
   } else {
      feedback_html = '';
   }
   if (debug[2]) {
      console.log ('[process_feedback_item] feedback_html:', feedback_html);
      console.log ('[process_feedback_item] choice_html:', choice_html);
   }

   return {'feedback_html':   feedback_html,
           'choice_html':     choice_html};
}


// -----------------------------------------------------------------------------
// Provide first letters of first correct answer as hint, up to five letters.
this.textentry_hint = function (i_deck) {

   // Cancel any previous timer.
   clearTimeout (show_hint_timeout[i_deck]);
   show_hint_timeout[i_deck] = 0;

   deckdata[i_deck].textentry_n_hints++;

   var i_card = deckdata[i_deck].i_card;
   var ii_card = deckdata[i_deck].card_order[i_card];
   var card = deckdata[i_deck].cards[ii_card];
   var textentry_hint = card.all_choices[0].substr (0, deckdata[i_deck].textentry_n_hints);
   var $textentry = $ ('input.textentry-qdeck' + i_deck);
   $textentry.val (textentry_hint).focus ();

   // Trigger search on entry -- handles hints that don't match anything (grays
   // "Check answer"/"Flip") and those that do.
   $textentry.autocomplete ('search');

   // Disable hint button, reset label.
   $ ('#textentry_hint-qdeck' + i_deck)
      .attr ('disabled', true)
      .removeClass ('qbutton')
      .addClass ('qbutton_disabled')
      .html ('Another<br />hint');

   // But set timer to show again.  Closure.
   var show_hint_button = function () {
      $ ('#textentry_hint-qdeck' + i_deck)
         .removeAttr ('disabled')
         .addClass ('qbutton')
         .removeClass ('qbutton_disabled');
   }
   if (hint_timeout_sec >= 0) {
      show_hint_timeout[i_deck] = setTimeout (show_hint_button, hint_timeout_sec*1000);
   }
}


// -----------------------------------------------------------------------------
this.set_textentry_i_deck = function (input_el) {

   // See which flashcard deck this is.  Save in global (private) variable.
   // Classes look like textentry-qdeck0...
   var classes = input_el.className;
   textentry_i_deck = classes.match (/textentry-qdeck([0-9]+)/)[1];
   if (debug[6]) {
      console.log ('[set_textentry_i_deck] textentry_i_deck: ', textentry_i_deck);
   }
}


// -----------------------------------------------------------------------------
function create_card_back_html (i_deck, i_card, htm, opening_tags, front_textentry_b) {

   var new_html = opening_tags + htm;

   // See if '[textentry]' present.
   if (htm.search (/\[.*textentry.*/) != -1) {

      // Yes.  Error if no textentry on front.
      if (! front_textentry_b) {
         errmsgs.push (T ('[textentry] on back of card, but not on front') + ' - qdeck ' + (i_deck+1) + ', ' + T ('card') + ' ' + (i_card+1));
      }

      // Convert to equivalent html.
      new_html = card_back_textentry_html (new_html, i_deck);
   } else {

      // No.  If there was textentry on front, create default echo.
      if (front_textentry_b) {
         var preview_qcard = '';
         if (q.preview) {
            preview_qcard = ' preview-qcard' + i_card;
         }
         var prepend_html = '<p class="back_textentry_p-qdeck' + i_deck + ' back_textentry_p' + preview_qcard + '">' + T ('You wrote') + ' &ldquo;<span class="back_qcard_textentry back_textentry-qdeck' + i_deck + preview_qcard + '">&emsp;&emsp;&emsp;&emsp;&emsp;</span>&rdquo;</p>';
         new_html = prepend_html + new_html;
      }
   }
   if (debug[2]) {
      console.log ('[create_card_back_html] new_html:', new_html);
   }

   return new_html;
}


// -----------------------------------------------------------------------------
// If [h] (or [H]), capture header tag/text, including opening tags before
// [h], up to intro ([i]) if allowed, or question ([q]).  Delete header from
// intro.
function process_header (htm, i_deck, intro_b) {
   var qtags = ['[h]'];
   var qnext_tags = ['[q]', '[q '];
   if (intro_b != undefined) {
      qnext_tags.push ('[i]');
   }

   // Limit to first 1000 characters.
   var header_html = qqc.parse_html_block (htm.substr (0, 1000), qtags, qnext_tags, true);
   if (header_html == 'NA') {
      header_html = '';
   }
   if (header_html) {

      // Error if text before [h].  Exclude < br...> or <img...> or
      // <span class="qwizard_placeholder">
      var htmx = htm.substr (0, 200);
      htmx = qqc.trim (htmx);
      var i_pos = qqc.opening_tag_shortcode_pos ('[h]', htmx);
      htmx = htmx.substr (i_pos, 5);
      var header_htmlx = header_html.replace (/<br[^>]*>/g, '');
      header_htmlx = qqc.trim (header_htmlx).substr (0, 5);
      if (htmx != header_htmlx) {
         errmsgs.push (T ('Text before header') + ' [h] - qdeck ' + (i_deck + 1));
      }

      // Delete header from htm.
      htm = htm.replace (header_html, '');

      // Delete [h] from header.
      header_html = header_html.replace (/\[h\]/ig, '');

      // Delete line-breaks from header.
      header_html = header_html.replace (/<br.*?>/ig, '');

      // If there's an unmatched </p> or the like near the beginning, add a
      // matching opening tag.
      header_html = qqc.balance_closing_tag (header_html);

      // Delete any empty paragraphs or the like.
      header_html = header_html.replace (/<(p|h[1-6])[^>]*><\/(p|h[1-6])>/g, '');
   }
   deckdata[i_deck].header_html = header_html;

   return htm;
}


// -----------------------------------------------------------------------------
// Divs for card, progress, "next" buttons.
function create_qdeck_divs (i_deck, qdeck_tag) {
   if (debug[0]) {
      console.log ('[create_qdeck_divs] i_deck:', i_deck);
   }

   // Capture any style info or other attributes provided.  If styles not set
   // for width and height, do so now (do as style in order to override
   // any WordPress theme class for <table>).
   var m = qdeck_tag.match (/\[qdeck([^\]]*)\]/m);
   var attributes = m[1];
   var default_style = '';
   if (! deckdata[i_deck].scroll_b) {
      //DKTMP scroll
      //default_style = ' style="width: 500px; min-height: 265px;"';
      deckdata[i_deck].card_width_setting = '500px';
      deckdata[i_deck].card_height_setting = '300px';
   }
   if (! attributes) {
      attributes = default_style;
   } else {

      // Replace any "smart quotes" with regular quotes.
      attributes = qqc.replace_smart_quotes (attributes);
      if (attributes.search (/style\s*?=/m) == -1) {
         attributes += default_style;
      } else {
         if (attributes.search (/["\s;]width/) == -1) {
            attributes = attributes.replace (/(style\s*?=\s*?["'])/m, '$1width: 500px; ');
         } else {
            m = attributes.match (/width\s*:\s*([^;\s"]*)[;\s"]/m);
            if (m) {
               deckdata[i_deck].card_width_setting = m[1];
            }
         }
         if (attributes.search ('height') == -1) {
            attributes = attributes.replace (/(style\s*?=\s*?["'])/m, '$1min-height: 300px; ');
         } else {

            // If height (rather than min-height) set, change to min-height
            // (backwards compatibility).
            attributes = attributes.replace (/([^-])height/, '$1min-height');
            m = attributes.match (/height\s*:\s*([^;\s]*)[;\s$]/m);
            if (m) {
               deckdata[i_deck].card_height_setting = m[1];
            }
         }
      }

      // Set flag if random="true".
      deckdata[i_deck].random_b = get_attr (attributes, 'random') == 'true';
      if (debug[0]) {
         console.log ('[create_qdeck_divs] random_b:', deckdata[i_deck].random_b);
      }
   }

   // Delete "align=..." from attributes.
   attributes = attributes.replace (/align\s*=\s*"[^"]*"/, '');

   if (debug[0]) {
      console.log ('[create_qdeck_divs] attributes: ', attributes);
   }

   var divs = [];

   // Add z-index, so if large graphic expands card, will stay on top of decks
   // farther down the page.  Also, if alignment center or right, add style.
   var style = 'z-index: ' + (20 - i_deck) + ';';
   if (deckdata[i_deck].align == 'center') {
      style += ' margin: auto;';
   } else if (deckdata[i_deck].align == 'right') {
      style += ' margin-left: auto;';
   }
   //var qwiz_flashcard = deckdata[i_deck].scroll_b ? ' qwiz_flashcard' : '';
   var qwiz_flashcard = 'qwiz_flashcard';
   divs.push ('<div id="qcard_window-qdeck' + i_deck + '" class="qcard_window ' + qwiz_flashcard + '" style="' + style + '">');

   // Exit mobile mode panel and slide-in icon.  Panel icon adjusted left to
   // offset left padding of qcard_window
   divs.push (   '<div id="overlay-exit-mobile-qdeck' + i_deck + '" class="overlay-exit-mobile-qwiz" onclick="' + qname + '.close_panel_exit_mobile(this)">');
   divs.push (      '<div id="panel-exit-mobile-qdeck' + i_deck + '" class="panel-exit-mobile-qwiz">');
   divs.push (         '<button onclick="' + qname + '.exit_mobile (' + i_deck + ')">');
   divs.push (            'Back to page view');
   divs.push (         '</button>');
   divs.push (         '<br />');
   divs.push (         '<span>');
   divs.push (            '(To return to this full-screen view, tap ');
   divs.push (            '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAk0lEQVR4nI3QMQ6EIBAF0BG2YLiGtjRcgt7EcBfDhShtbLwBHIgCJrPFbrGJqPvrl/k/MzAzPOUFAMYYRCSiaZpijGckAAARSynM3BVf1FpTSkkpQwiXaBzHnLNzbtu2Lhr+GS4exSUyxqzrCgDLssDnBefM87zv+3EcRHS3yVpba0XElFK/znsvhNBal1LuLv3mDbu1OYLB67+mAAAAAElFTkSuQmCC" />');
   divs.push (            ')');
   divs.push (         '</span>');
   divs.push (         '<div class="panel-icon-exit-mobile-qwiz" style="margin-left: -5px;"></div>');
   divs.push (      '</div>');
   divs.push (   '</div>');
   divs.push (   '<div id="icon-exit-mobile-deck' + i_deck + '" class="icon-exit-mobile-qwiz" onclick="' + qname + '.open_panel_exit_mobile (' + i_deck + ')"></div>');

   // Progress div.
   divs.push ('   <div id="qcard_progress-qdeck' + i_deck + '" class="qcard_progress">');

   // "Go-mobile" icon.  First, large clickable target positioned absolutely,
   // centered on go-mobile icon.
   divs.push (   '<div class="go-mobile-qdeck go-mobile-qdeck' + i_deck + '" onclick="' + qname + '.go_mobile (' + i_deck + ')" title="Full-screen view">');
   divs.push (   '</div>');

   // Image is in the regular flow (float left, though).
   divs.push (   '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAk0lEQVR4nI3QMQ6EIBAF0BG2YLiGtjRcgt7EcBfDhShtbLwBHIgCJrPFbrGJqPvrl/k/MzAzPOUFAMYYRCSiaZpijGckAAARSynM3BVf1FpTSkkpQwiXaBzHnLNzbtu2Lhr+GS4exSUyxqzrCgDLssDnBefM87zv+3EcRHS3yVpba0XElFK/znsvhNBal1LuLv3mDbu1OYLB67+mAAAAAElFTkSuQmCC" class="go-mobile-qdeck go-mobile-qdeck' + i_deck + '" />');

   // "Exit-mobile" icon and image, too.
   divs.push (   '<div class="exit-mobile-qdeck exit-mobile-qdeck' + i_deck + '" onclick="' + qname + '.exit_mobile (' + i_deck + ')" title="Full-screen view">');
   divs.push (   '</div>');
   divs.push (   '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACFQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbdFIwQAAAAp0Uk5TAA8fLz9Pf5/P76Y8vMQAAABISURBVAjXY6gQYGBgbGfoanJg1VjBILEqgW1VIwMTiFJgYElzYEkLYEAFzCBBAwbGWQlsKwUYJFYmsM1qZOhqdGCWWMEAMQwA1XERIiyHr7wAAAAASUVORK5CYII=" class="exit-mobile-qdeck exit-mobile-qdeck' + i_deck + '" />');

   if (deckdata[i_deck].qrecord_id) {
      var addclass = '';
      if (q.no_intro_b[i_deck] || deckdata[i_deck].n_cards == 1) {
         addclass = ' qwiz-usermenu_icon_no_intro';
      }
      divs.push ('   <div id="usermenu_icon-qdeck' + i_deck + '" class="qwiz-usermenu_icon' + addclass + '" onmouseover="' + qname + '.show_usermenu (' + i_deck + ')" onclick="' + qname + '.show_usermenu (' + i_deck + ')">');
      divs.push (      '&#x25bc;');
      divs.push ('   </div>');
   }

   divs.push ('      <span class="progress_text">');
   divs.push ('      </span>');

   if (deckdata[i_deck].qrecord_id) {

      // Add user menu div.  Don't populate until after start/login.
      divs.push ('   <div id="usermenu-qdeck' + i_deck + '" class="qq-usermenu qdeck-usermenu">');
      divs.push ('   </div>');
   }

   // End qcard_progress-qdeck.
   divs.push ('   </div>');

   // Header.
   divs.push (   '<div id="qcard_header-qdeck' + i_deck + '" class="qcard_header qcard_editable">');
   divs.push (   '</div>');

   // If preview, repeat for each card.  Extra at beginning for intro, if there.
   if (q.preview) {
      if (! q.no_intro_b[i_deck]) {
         divs = divs.concat (card_container_divs (i_deck, attributes, -1));
      }
      var n_cards = deckdata[i_deck].n_cards;
      for (var i_card=0; i_card<n_cards; i_card++) {
         divs = divs.concat (card_container_divs (i_deck, attributes, i_card));
      }

      // Extra at end for summary/exit.
      divs = divs.concat (card_container_divs (i_deck, attributes, n_cards));
   } else {
      divs = divs.concat (card_container_divs (i_deck, attributes));
   }
   if (! q.preview) {
      divs.push (   '<div id="qcard_next_buttons-qdeck' + i_deck + '" class="qcard_next_buttons">');
      divs.push (   '</div>');
   }

   // Small, almost invisible, focusable element inside a div.  For Firefox issue
   // related to keydown event --> <Enter> intercept.
   divs.push ('   <div class="focusable">');
   divs.push ('      <input type="text" />');
   divs.push ('   </div>');

   divs.push ('</div>');

   return divs.join ('\n');
}


// -----------------------------------------------------------------------------
function card_container_divs (i_deck, attributes, i_card) {
   if (debug[0]) {
      console.log ('[card_container_divs] i_card:', i_card);
   }
   var divs = [];

   var card_class = '';
   var onclick_i_card = '';
   if (typeof (i_card) != 'undefined') {
      card_class = ' preview-qdeck' + i_deck + ' preview-qcard' + i_card;
      onclick_i_card = ', ' + i_card;
   }
   var onclick = '';
   if (! q.qwizard_b && deckdata[i_deck].click_flip_b) {
      onclick = ' onclick="' + qname + '.flip (' + i_deck + onclick_i_card + ')"';
   }
   var qwiz_flashcard_expand = '';
   if (deckdata[i_deck].scroll_b) {
      card_class += ' qwiz_flashcard_expand';
      qwiz_flashcard_expand = ' qwiz_flashcard_expand';
   }
   divs.push ('<div class="card-container' + card_class + '"> ');
   divs.push (   '<div class="qcard_card-qdeck' + i_deck + ' qcard_card card" data-direction="right"> <button class="cbutton-qdeck' + i_deck + card_class + ' cbutton">Flip</button>');
   divs.push (      '<div class="qcard-front qcard-front-back' + qwiz_flashcard_expand + '" ' + attributes + onclick + '>');
   divs.push (         '<div class="qcard_content">');
   divs.push (            '<div class="qcard_content_size">');
   if (q.qwizard_b) {
      divs.push (            '<div id="qcard_front-part0-qdeck' + i_deck + '" class="qcard-part0" style="display: none;">');
      divs.push (            '</div>');
      divs.push (            '<div id="qcard_front-part1-qdeck' + i_deck + '" class="qcard-part1 qcard-inline qcard_editable">');
      divs.push (            '</div>');
      divs.push (            '<div id="qcard_front-input-qdeck' + i_deck + '" class="qcard-inline">');
      divs.push (            '</div>');
      divs.push (            '<div id="qcard_front-part2-qdeck' + i_deck + '" class="qcard-part2 qcard-inline qcard_editable">');
      divs.push (            '</div>');
   }
   divs.push (            '</div>');
   divs.push (         '</div>');
   divs.push (      '</div>');
   divs.push (      '<div class="qcard-back qcard-front-back' + qwiz_flashcard_expand + '" ' + attributes + onclick + '>');
   divs.push (         '<div class="qcard_content">');
   divs.push (            '<div class="qcard_content_size">');
   if (q.qwizard_b) {
      divs.push (            '<div id="qcard_back-echo-qdeck' + i_deck + '" class="qcard-inline">');
      divs.push (            '</div>');
      divs.push (            '<div id="qcard_back-part1-qdeck' + i_deck + '" class="qcard-part1 qcard-inline qcard_editable">');
      divs.push (            '</div>');
   }
   divs.push (            '</div>');
   divs.push (         '</div>');
   divs.push (      '</div>');
   divs.push (   '</div>');
   divs.push ('</div>');

   // If preview, and not intro or summary/exit, add a "Flip"/"Check answer"
   // button specific to this card.
   if (q.preview) {
      if (i_card >= 0 && i_card < deckdata[i_deck].n_cards) {
         divs.push ('<button class="qbutton flip flip-qdeck' + i_deck + '-qcard' + i_card + '" onclick="' + qname + '.flip (' + i_deck + ', ' + i_card + ')" title="' + T ('Show the other side') + '">' + T ('Flip') + '</button>');
      }
   }
   if (debug[0]) {
      console.log ('[card_container_divs] divs:', divs);
   }

   return divs;
}


// -----------------------------------------------------------------------------
this.flip_if_back = function (i_deck) {
   $ ('div.card-container').click (function (event) {
      event.preventDefault ();
      console.log ('[flip_if_back] > preventDefault');
   });

   if (! showing_front (i_deck)) {
      q.flip (i_deck);
   }

   return false;
}


// -----------------------------------------------------------------------------
this.process_card_attributes = function (i_deck, card_tags, i_qwizard_card) {

   // Topic or topics each card, if any.
   var n_cards = card_tags.length;
   deckdata[i_deck].card_topics = new Array (n_cards);

   // List of all topics.
   deckdata[i_deck].topics = [];

   // Loop over tags.
   var add_other_b = false;
   for (var i_card=0; i_card<n_cards; i_card++) {
      if (set_qwizard_data_b) {
         if (typeof (i_qwizard_card) == 'undefined') {
            qw.questions_cards[i_card] = {};
         } else {
            qw.questions_cards[i_qwizard_card] = {};
         }
      }
      var card_tag = card_tags[i_card];

      // Set to defaults first.
      deckdata[i_deck].dataset_id[i_card] = i_card;
      deckdata[i_deck].unit[i_card] = deckdata[i_deck].default_unit;

      // See if any attributes.
      var matches = card_tag.match (/\[q +([^\]]*)\]/);
      if (matches) {
         var attributes = matches[1];
         attributes = qqc.replace_smart_quotes (attributes);

         if (set_qwizard_data_b) {
            if (typeof (i_qwizard_card) == 'undefined') {
               qw.questions_cards[i_card].question_attributes = attributes;
            } else {
               qw.questions_cards[i_qwizard_card].question_attributes = attributes;
            }
         }

         // Look for "topic=" attribute.
         var card_topics = get_attr (attributes, 'topic');
         if (! card_topics) {
            card_topics = get_attr (attributes, 'topics');
         }
         if (card_topics) {
            if (debug[4]) {
               console.log ('[process_card_attributes] card_topics: ', card_topics);
            }
            if (set_qwizard_data_b) {
               if (typeof (i_qwizard_card) == 'undefined') {
                  qw.questions_cards[i_card].topic = card_topics;
               } else {
                  qw.questions_cards[i_qwizard_card].topic = card_topics;
               }
            }

            // Multiple topics for a card - separated by semicolon (and
            // optional space).  Split into array.
            card_topics = card_topics.split (/; */);
            deckdata[i_deck].card_topics[i_card] = card_topics;

            // Add topics to list of topics if not already in list.
            for (var i=0; i<card_topics.length; i++) {
               var topic = card_topics[i];
               if (deckdata[i_deck].topics.indexOf (topic) == -1) {
                  deckdata[i_deck].topics.push (topic);
               }
            }
         } else {
            deckdata[i_deck].card_topics[i_card] = ['Other'];
            add_other_b = true;
         }

         // Look for dataset_id= attribute.  Default: i_card.
         var dataset_id = get_attr (attributes, 'dataset_id');
         if (dataset_id) {
            deckdata[i_deck].dataset_id[i_card] = dataset_id;
         }

         // Look for unit= attribute.  If not present, set unit to quiz default.
         var unit = get_attr (attributes, 'unit');
         if (unit) {
            deckdata[i_deck].unit[i_card] = unit;
            if (set_qwizard_data_b) {
               if (typeof (i_qwizard_card) == 'undefined') {
                  qw.questions_cards[i_card].unit = unit;
               } else {
                  qw.questions_cards[i_qwizard_card].unit = unit;
               }
            }
         }

         // Look for card_back= attribute - specific to this card.
         var card_back_background = get_attr (attributes, 'card_back');
         if (card_back_background) {
            deckdata[i_deck].card_back_background[i_card] = card_back_background;
         } else {
            card_back_background = get_attr (attributes, 'card_back_image');
            if (card_back_background) {
               deckdata[i_deck].card_back_background[i_card] = 'img:' + card_back_background;
            }
         }

         // If any card-specific background, then make sure default is available
         // (in case a card without background spec).
         if (card_back_background) {
            if (! deckdata[i_deck].default_card_back_background) {
               deckdata[i_deck].default_card_back_background = q.ruled_lines;
            }
         }

         // Is this a specific card from a dataset?
         var use_dataset_card_id = get_attr (attributes, 'use_dataset_card');
         if (use_dataset_card_id) {
            deckdata[i_deck].use_dataset_card_ids[i_card] = use_dataset_card_id;
            deckdata[i_deck].dataset_id[i_card]           = use_dataset_card_id;
         }
      }
   }
   if (add_other_b) {
      if (deckdata[i_deck].topics.indexOf ('Other') == -1) {
         deckdata[i_deck].topics.push ('Other');
      }
   }
   if (debug[4]) {
      console.log ('[process_card_attributes] deckdata[i_deck].card_topics:', deckdata[i_deck].card_topics);
   }

   // Set up statistics by topic.  Object of objects (list of lists).
   deckdata[i_deck].topic_statistics = {};
   var n_topics = deckdata[i_deck].topics.length;
   for (var i_topic=0; i_topic<n_topics; i_topic++) {
      var topic = deckdata[i_deck].topics[i_topic];
      deckdata[i_deck].topic_statistics[topic] = {};
      deckdata[i_deck].topic_statistics[topic].n_cards = 0;
      deckdata[i_deck].topic_statistics[topic].n_reviewed = 0;
   }

   // Count how many cards with each topic.
   for (var i_card=0; i_card<n_cards; i_card++) {
      var card_topics = deckdata[i_deck].card_topics[i_card];
      if (card_topics) {
         if (debug[4]) {
            console.log ('[process_card_attributes] i_card:', i_card, ', card_topics: ' + card_topics);
         }
         var n_topics = card_topics.length;
         for (var i_topic=0; i_topic<n_topics; i_topic++) {
            var topic = card_topics[i_topic];
            deckdata[i_deck].topic_statistics[topic].n_cards++;
         }
      }
   }
}


// -----------------------------------------------------------------------------
this.start_deck = function (i_deck, no_login_b) {
   if (debug[0]) {
      console.log ('[start_deck] deckdata[i_deck].i_card:', deckdata[i_deck].i_card);
   }

   // If no cards (qwizard, initially), or preview, do nothing.
   if (deckdata[i_deck].n_cards == 0 || q.preview) {
      return;
   }

   // If on mobile screen, switch to full-screen view for qdeck container.
   if (qqc.is_mobile ()) {
      q.go_mobile (i_deck);
   }

   // See if already checked login.
   if (! no_login_b && ! q.qwizard_b) {

      // If deck may be recorded, and user not logged in, go to login rather than
      // first card (if user hasn't declined).
      if (deckdata[i_deck].qrecord_id) {
         var user_logged_in_b
            =    typeof (document_qwiz_user_logged_in_b) != 'undefined'
                                                && document_qwiz_user_logged_in_b
              && typeof (document_qwiz_username) != 'undefined';
         if (   user_logged_in_b
             || (   typeof (document_qwiz_declined_login_b) != 'undefined'
                 && document_qwiz_declined_login_b)) {
            if (user_logged_in_b) {

               // If more than __ minutes since last login, confirm continue.
               var now_sec = new Date ().getTime ()/1000.0;
               var login_timeout_min = qqc.get_qwiz_param ('login_timeout_min', 40);
               if (now_sec > document_qwiz_current_login_sec + login_timeout_min*60) {
                  var a_team = '';
                  if (document_qwiz_team_b) {
                     a_team = ' ' + T ('a team') + ':';
                  }
                  if (confirm (T ('You are logged in as') + a_team + ' ' + document_qwiz_username + '.\n' + T ('Do you want to continue?  (Click "Cancel" to sign out)'))) {
                     document_qwiz_current_login_sec = now_sec;
                  } else {
                     qqc.sign_out ();
                     deckdata[i_deck].deck_started_b = true;
                     q.process_card (i_deck);
                     return false;
                  }
               } else {

                  // If logged in as team, check if want to continue as team.
                  if (document_qwiz_team_b) {
                     if (! confirm (T ('You are logged in as team') + ': ' + document_qwiz_username + '.\n' + T ('Do you want to continue as this team?'))) {

                        // No.  Reset document global flags and user menu.
                        document_qwiz_session_id = document_qwiz_session_id.split (';')[0];
                        document_qwiz_username   = document_qwiz_username.split ('; ')[0];
                        document_qwiz_team_b     = false;
                        qqc.set_user_menus_and_icons ();
                        var msg = T ('OK.  Only %s is logged in now');
                        msg = msg.replace ('%s', document_qwiz_username);
                        alert (msg)
                     }
                  }
               }
               if (deckdata[i_deck].qrecord_id && document_qwiz_user_logged_in_b) {
                  deckdata[i_deck].record_start_b = false;
                  var now_sec = new Date ().getTime ()/1000.0;
                  var data = {qrecord_id_ok: deckdata[i_deck].qrecord_id_ok, type: 'start', now_sec: now_sec};
                  qqc.jjax (qname, i_deck, deckdata[i_deck].qrecord_id, 'record_qcard', data);
               }
            }
         } else {
            q.display_login (i_deck);
            return false;
         }
      }
   }

   // If use_dataset= deck, show units/topics options screen.
   if (deckdata[i_deck].use_dataset) {
      if (deckdata[i_deck].dataset_intro_f) {
         q.display_login (i_deck, false, 'use_dataset_options');
      } else {
         qqc.get_dataset_questions (deckdata[i_deck].use_dataset, qname,
                                    i_deck, deckdata[i_deck].qrecord_id,
                                    [], [], 10000, 'spaced_repetition',
                                    deckdata[i_deck].random_b,
                                    deckdata[i_deck].use_dataset_card_html);
      }
   } else {
      q.start_deck2 (i_deck);
   }
}


// -----------------------------------------------------------------------------
this.start_deck2 = function (i_deck, i_qwizard_card) {

   if (typeof (i_qwizard_card) != 'undefined') {
      deckdata[i_deck].i_card = i_qwizard_card;
   } else {
      deckdata[i_deck].i_card = 0;
   }
   deckdata[i_deck].n_got_it = 0;
   deckdata[i_deck].n_reviewed = 0;

   var n_cards = deckdata[i_deck].n_cards;
   deckdata[i_deck].n_to_go = n_cards;

   // Don't show  buttons on single-card deck (unless no click-flip).
   if (n_cards > 1 || ! deckdata[i_deck].click_flip_b) {
      q.set_next_buttons (i_deck);
   }

   for (var ii_card=0; ii_card<n_cards; ii_card++) {
      deckdata[i_deck].cards[ii_card].got_it = false;
   }

   var n_topics = deckdata[i_deck].topics.length;
   for (var i_topic=0; i_topic<n_topics; i_topic++) {
      var topic = deckdata[i_deck].topics[i_topic];
      deckdata[i_deck].topic_statistics[topic].n_reviewed = 0;
   }

   init_card_order (i_deck);
   deckdata[i_deck].deck_started_b = true;

   // no_flip_b usually true on starting deck -- suppresses flip caused by
   // a triggered click -- somewhere! (perhaps bubbling of "Start reviewing
   // cards" or "Review this deck again" buttons -- not sure).  But when go to
   // a card in qwizard.js, need it to work.
   if (typeof (i_qwizard_card) != 'undefined') {
      if (deckdata[i_deck].i_card >=0 && deckdata[i_deck].i_card < n_cards) {
         deckdata[i_deck].no_flip_b = false;
      }
   }
   deckdata[i_deck].$qcard_card_back.css ({display: ''});

   // If showing back, change to front.
   if (! showing_front (i_deck)) {
      q.flip (i_deck);
   }
   q.process_card (i_deck);
};


// -----------------------------------------------------------------------------
this.go_mobile = function (i_deck) {

   // Deck container: save style, remove style, change class to mobile.
   var $deck = deckdata[i_deck].$qcard_window;
   deckdata[i_deck].deck_style = $deck.attr ('style');
   $deck.removeAttr ('style').removeAttr ('width').removeClass ('qcard_window').addClass ('qdeck-mobile');

   // Place deck div directly into body, absolutely positioned at top.  Record
   // current scroll position, then scroll to top (plus one pixel so can scroll
   // down for panel).  First put a placeholder div in so know where to put
   // deck div back!
   $deck.after ('<div id="deck_div_placeholder"></div>');
   non_mobile_scrollLeft = $ (document).scrollLeft ();
   non_mobile_scrollTop  = $ (document).scrollTop ();
   $deck.appendTo ('body');
   window.scrollTo (0, 1);

   // Hide go-mobile icon and clickable target.
   $ ('.go-mobile-qdeck' + i_deck).hide ();

   // Show exit-mobile icon and clickable target.
   $ ('.exit-mobile-qdeck' + i_deck).show ();

   // Show exit-mobile slider icon.
   $ ('#icon-exit-mobile-qdeck' + i_deck).show ();

   // Show summary report "Return to page view" button.
   $ ('#summary-deck' + i_deck).find ('button.summary_exit_mobile_deck').show ();

   // Detect window scroll - if scroll to top, show slide-in panel for exit-
   // mobile-mode button.  Flag so ignore initiating trigger.
   scroll_detect_i_deck = -1;
   $ (window).on ('scroll',   
                  function () {
                     //console.log ('[go_mobile > scroll] $ (window).scrollTop ():', $ (window).scrollTop ());
                     if (scroll_detect_i_deck != -1) {
                        var scrollTop = $ (window).scrollTop ();
                        if (scrollTop == 0) {

                           // If just closed panel, assume don't want to reopen
                           // it just yet.
                           if (panel_exit_mobile_just_closed_b) {
                              window.scrollTo ($ (window).scrollLeft (), 1);
                              panel_exit_mobile_just_closed_b = false;
                           } else {

                              // Show panel and set flag.
                              q.open_panel_exit_mobile (i_deck);
                           }
                        } else if (panel_exit_mobile_open_b) {

                           // Any scroll will close panel (as will click).
                           q.close_panel_exit_mobile ($ ('#overlay-exit-mobile-qdeck' + i_deck)[0]);
                        } else if (scrollTop != 1) {
                           
                           // Any other user scroll means OK to open panel when
                           // scroll to top (scrollTop 1 assumed to be panel
                           // close scroll, which triggers scroll event).
                           panel_exit_mobile_just_closed_b = false;
                        }
                     }
                  });
   scroll_detect_i_deck = i_deck;

   // Don't let click on "Return to page view" trigger close_panel_exit_mobile ().
   $ ('#panel-exit-mobile-qdeck' + i_deck + ' button')
      .click (function (event) {
                 event.stopPropagation ();
              });

   // Set global var.
   document_qwiz_mobile = 'mobile_';
}


// -----------------------------------------------------------------------------
this.open_panel_exit_mobile = function (i_deck) {

   $ ('#overlay-exit-mobile-qdeck' + i_deck)
      .show ()
      .animate ({top: '0px'}, 500);
   panel_exit_mobile_open_b = true;

   // Also hide default slide-icon.
   $ ('#icon-exit-mobile-deck' + i_deck).hide ();
}


// -----------------------------------------------------------------------------
this.close_panel_exit_mobile = function (overlay_el) {
   $ (overlay_el).animate ({top: '-100px'}, 500, 
                           function () {
                              $ (this).hide ();

                              // Also show default slide-icon (easier to show
                              // all).
                              $ ('div.icon-exit-mobile-qwiz').show ();
                           });

   // Reposition window vertically so can have a scroll to detect.
   window.scrollTo ($ (window).scrollLeft (), 1);

   // Reset flags.
   panel_exit_mobile_open_b = false;
   panel_exit_mobile_just_closed_b = true;

   return false;
}


// -----------------------------------------------------------------------------
this.exit_mobile = function (i_deck) {

   // Deck container: restore style, change class to standard.
   var $deck = deckdata[i_deck].$qcard_window;
   $deck.attr ('style', deckdata[i_deck].deck_style)
        .removeClass ('qdeck-mobile')
        .addClass ('qcard_window');

   // Place deck back into content.  Scroll back to previous position.
   $ ('#deck_div_placeholder').replaceWith ($deck);
   window.scrollTo (non_mobile_scrollLeft, non_mobile_scrollTop);

   // Reset exit panel.
   $ ('#overlay-exit-mobile-qdeck' + i_deck).css ({top: '-100px', display: 'none'});

   // Turn off scroll detect.
   $ (window).off ('scroll');

   // Hide exit-mobile slider icon (easier just to hide them all).
   $ ('div.icon-exit-mobile-qwiz, div.icon-panel-exit-mobile-qwiz').hide ();

   // Hide exit-mobile icon (in progress bar).
   $ ('.exit-mobile-qdeck').hide ();

   // Also hide summary exit-mobile button.
   $ ('button.summary_exit_mobile_deck').hide ();

   // If still on mobile device, show go-mobile icon and clickable target.
   if (qqc.is_mobile ()) {
      $ ('.go-mobile-qdeck' + i_deck).show ();
   }

   // Unset global vars.
   document_qwiz_mobile = '';
   panel_exit_mobile_just_closed_b = false;
}


// -----------------------------------------------------------------------------
function check_qdeck_tag_pairs (htm) {

   var new_htm = '';

   // Match "[qdeck]" or "[/qdeck]".
   var matches = htm.match (/\[qdeck|\[\/qdeck\]/gm);
   if (matches) {
      var n_tags = matches.length;
      var error_b = false;

      if (n_tags % 2 != 0) {
         error_b = true;
      } else {

         // Check proper pairs.
         for (var i=0; i<n_tags; i++) {
            if (i % 2 == 0) {
               if (matches[i] != '[qdeck') {
                  error_b = true;
                  break;
               }
            } else {
               if (matches[i] != '[/qdeck]') {
                  error_b = true;
                  break;
               }
            }
         }
      }
      if (error_b){

         // If we're inside an excerpt, no error.  Delete from '[qdeck]' up to
         // '<p class="more-link' if possible,  In any event non-null return
         // signals not to process.
         if (htm.search ('more-link') != -1) {

            var pos_qdeck = htm.search (/\[qdeck/);
            var pos_more  = htm.search (/<[pa] class="more-link/);
            if (pos_more != -1) {
               new_htm = htm.substring (0, pos_qdeck) + htm.substr (pos_more);
            } else {
               new_htm = htm;
            }
         } else {
            alert (T ('Unmatched [qdeck] - [/qdeck] pairs.'));
         }
      }
   }

   return new_htm;
}


// -----------------------------------------------------------------------------
function card_front_textentry_html (htm, i_deck) {

   // Simple (optional) text input (echoed on back).  Change '[textentry]' to
   // appropriate htm.  id lets qqc.init_enter_intercept () see input as qwiz/
   // qdeck-related.
   var input =   '<div class="qcard_textentry">'
               +    '<input id="qdeck-textentry" type="text" class="textentry-qdeck' + i_deck + ' qcard_textentry" />'
               + '</div>';
   htm = htm.replace (/\[textentry[^\]]*\]/, input);
   if (debug[0]) {
      console.log ('[card_front_textentry_html] htm: ', htm);
   }
   return htm;
}


// -----------------------------------------------------------------------------
function card_back_textentry_html (htm, i_deck) {

   // Change to appropriate html.
   // Spec is either
   //    (1) [optional text textentry more optional text]
   // or (2) [optional text <span id="back_textentry" class="qdeck_textentry" etc.></span> more optional text]
   //
   // If user does not make an entry on front of card, then nothing within
   // square brackets is shown when flip to back.

   // Change class="back_textentry" to class="textentry-qdeck...", otherwise expand to
   // equivalent.
   var preview_qcard = '';
   if (q.preview) {
      preview_qcard = ' preview-qcard' + ii_card;
   }
   if (htm.indexOf ('class="back_textentry"') != -1) {
      htm = htm.replace ('back_textentry', 'back_textentry-qdeck' + i_deck + preview_qcard);
   } else {
      htm = htm.replace ('textentry', '<span class="back_textentry-qdeck' + i_deck + preview_qcard + ' back_qdeck_textentry"></span>');
   }

   // Convert "[" and "]" to paragraph.
   htm = htm.replace (/\[([^[]*textentry.*?)\]/, '<p class="back_textentry_p-qdeck' + i_deck + preview_qcard + ' back_textentry_p">$1</p>');
   if (debug[0]) {
      console.log ('[card_back_textentry_html] htm:', htm);
   }

   return htm;
}


// -----------------------------------------------------------------------------
function init_element_pointers (i_deck) {

   // jQuery element objects for this deck.
   deckdata[i_deck].$qcard_window          = $ ('div#qcard_window-qdeck' + i_deck);
   deckdata[i_deck].$qcard_container       = $ ('div#qcard_window-qdeck' + i_deck + ' div.card-container');
   deckdata[i_deck].$flip                  = $ ('button.cbutton-qdeck' + i_deck);
   deckdata[i_deck].$progress              = $ ('div#qcard_progress-qdeck' + i_deck);
   deckdata[i_deck].$progress_text         = $ ('div#qcard_progress-qdeck' + i_deck + ' span.progress_text');
   deckdata[i_deck].$header                = $ ('div#qcard_header-qdeck' + i_deck);
   deckdata[i_deck].$qcard_card            = $ ('div.qcard_card-qdeck' + i_deck);
   deckdata[i_deck].$qcard_card_front_back = $ ('div.qcard_card-qdeck' + i_deck + ' div.qcard-front-back');
   deckdata[i_deck].$qcard_card_front      = $ ('div.qcard_card-qdeck' + i_deck + ' div.qcard-front div.qcard_content_size');
   deckdata[i_deck].$qcard_card_back       = $ ('div.qcard_card-qdeck' + i_deck + ' div.qcard-back  div.qcard_content_size');
   deckdata[i_deck].$next_buttons          = $ ('div#qcard_next_buttons-qdeck' + i_deck);

   if (q.qwizard_b) {
      deckdata[i_deck].$qcard_front_part1 = $ ('#qcard_front-part1-qdeck' + i_deck);
      deckdata[i_deck].$qcard_back_part1  = $ ('#qcard_back-part1-qdeck' + i_deck);
   }

   if (debug[5]) {
      console.log ('[init_element_pointers] $next_buttons:', deckdata[i_deck].$next_buttons);
   }
}


// -----------------------------------------------------------------------------
function init_card_order (i_deck) {
   var n_cards = deckdata[i_deck].n_cards;
   deckdata[i_deck].card_order = new Array (n_cards);
   for (var i=0; i<n_cards; i++) {
      deckdata[i_deck].card_order[i] = i;
   }

   // Shuffle if attribute for initial random order set (random="true").
   if (deckdata[i_deck].random_b) {
      deckdata[i_deck].card_order = shuffle (deckdata[i_deck].card_order);
   }
}


// -----------------------------------------------------------------------------
this.set_next_buttons = function (i_deck) {
   var htm = '';

   // "Flip" / "Check answer".
   htm += '<button class="qbutton flip flip-qdeck' + i_deck + '" onclick="' + qname + '.flip (' + i_deck + ')" title="' + T ('Show the other side') + '">' + T ('Flip') + '</button> &nbsp; ';

   // "Need more practice".  Starts out disabled, gray.
   if (deckdata[i_deck].n_to_go > 1) {
      htm += '<button class="qbutton_disabled next_card-qdeck' + i_deck + '" disabled="true" onclick="' + qname + '.next_card (' + i_deck + ')" title="' + T ('Put this card at the bottom of the stack, show the next card') + '">' + T ('Need more practice') + '</button> &nbsp; ';
   }

   // "Got it".  Starts out disabled, gray.
   if (next_button_active_b) {
      htm += '<button class="qbutton got_it got_it-qdeck' + i_deck + '" onclick="' + qname + '.got_it (' + i_deck + ')" title="' + T ('Remove this card from the stack') + '">' + T ('Got it!') + '</button> &nbsp; ';
   } else {
      htm += '<button class="qbutton_disabled got_it got_it-qdeck' + i_deck + '" disabled="true" onclick="' + qname + '.got_it (' + i_deck + ')" title="' + T ('Remove this card from the stack') + '">' + T ('Got it!') + '</button> &nbsp; ';
   }

   // "Shuffle".
   if (deckdata[i_deck].n_to_go > 1) {
      htm += '<button class="qbutton shuffle-qdeck' + i_deck + '" onclick="' + qname + '.shuffle_order (' + i_deck + ')" title="' + T ('Randomly shuffle the remaining cards') +'">' + T ('Shuffle') + '</button> &nbsp; ';
   }
   if (debug[5]) {
      console.log ('[set_next_buttons] htm:', htm);
   }

   deckdata[i_deck].$next_buttons.html (htm);
};


// -----------------------------------------------------------------------------
this.process_card = function (i_deck, progress_bars_f) {

   // Keep running through cards until got_it true for all.
   if (deckdata[i_deck].n_to_go == 0 && ! q.qwizard_b && deckdata[i_deck].n_cards > 1) {
      q.done (i_deck, progress_bars_f);
   } else {

      var i_card = deckdata[i_deck].i_card;
      while (true) {

         // Display only those cards not yet marked got_it.
         var ii_card = deckdata[i_deck].card_order[i_card];
         if (! deckdata[i_deck].cards[ii_card].got_it) {

            // Display card - not "reviewed" until "Check answer"/flip.  "Need
            // more practice" and "Got it!" buttons start out disabled, gray.
            deckdata[i_deck].card_reviewed_b = false;
            if (deckdata[i_deck].qrecord_id) {
               deckdata[i_deck].current_first_flip_sec = 0;
               deckdata[i_deck].n_flips = 0;
               deckdata[i_deck].current_first_textentry_sec = 0;
            }
            if (! next_button_active_b) {
               $ ('button.got_it-qdeck' + i_deck + ', button.next_card-qdeck' + i_deck).attr ('disabled', true).removeClass ('qbutton').addClass ('qbutton_disabled');
            }

            // If only one to go, disable and gray out more practice/next card
            // and shuffle buttons.
            if (deckdata[i_deck].n_to_go == 1) {
               $ ('button.next_card-qdeck' + i_deck + ', button.shuffle-qdeck' + i_deck).attr ('disabled', true).removeClass ('qbutton').addClass ('qbutton_disabled');
            }
            deckdata[i_deck].i_card = i_card;
            q.set_card_front_and_back (i_deck, i_card);

            // If qwizard, use go_to_card2 () to hide any previous menus, show
            // relevant menus for this card, highlight in accordion panel card
            // list.
            if (q.qwizard_b) {
               qwizard.set_qwizard_data ('i_question', i_card);
               qwizard.go_to_card2 ();
            }
            break;
         } else {
            i_card++;
            if (i_card >= deckdata[i_deck].n_cards) {
               i_card = 0;
            }
         }
      }
   }
};


// -----------------------------------------------------------------------------
this.done = function (i_deck, progress_bars_f) {

   // If showing back, change to front.
   if (! showing_front (i_deck)) {
      q.flip (i_deck);
   }

   // Progress div (and go-mobile and user-menu icons) disappears without
   // something in text.
   deckdata[i_deck].$progress_text.html ('&nbsp;');

   if (! q.preview) {
      deckdata[i_deck].$qcard_card_back.hide ();
      deckdata[i_deck].$next_buttons.html ('');
   }

   var report_html = [];
   report_html.push ('<div id="flashcard_summary">');

   // Overall.
   var overall;
   var n_cards = deckdata[i_deck].n_cards;
   var n_reviewed = deckdata[i_deck].n_reviewed;
   if (n_reviewed == n_cards) {
      overall = T ('In this %s-flashcard stack, you clicked') + ' &ldquo;' + T ('Got it!') + '&rdquo; ' + T ('on the first try for every card') + '.';
   } else {
      overall = T('This flashcard stack had %s cards.') + ' ';
      overall += T ('It took you') + ' ' + qqc.number_to_word (n_reviewed) + ' ' + Tplural ('try', 'tries', n_reviewed) + ' ' + T ('until you felt comfortable enough to click') + ' &ldquo;' + T ('Got it!') + '&rdquo; ' + Tplural ('for this card', 'for each card', n_cards) + '.';
   }
   overall = overall.replace ('%s', qqc.number_to_word (n_cards));
   report_html.push ('<p>' + overall + '</p>');

   // By topic.
   var n_topics = 0;
   if (deckdata[i_deck].topics) {
      n_topics = deckdata[i_deck].topics.length;
   }
   if (n_topics == 1) {
      var topic = deckdata[i_deck].topics[0];
      if (topic != 'Other') {
         var all_both_n;
         if (n_cards == 1) {
            all_both_n = T ('This');
         } else if (n_cards == 2) {
            all_both_n = T ('Both');
         } else {
            all_both_n = T ('All') + ' '+ qqc.number_to_word (n_cards);
         }
         report_html.push ('<p>' + all_both_n + ' ' + Tplural ('card was', 'cards were', n_cards) + ' about topic &ldquo;' + topic + '.&rdquo;</p>');
      }
   } else if (n_topics > 1 && n_reviewed > n_cards) {

      // We'll show only topics where user clicked "Need more practice".  See
      // which.
      var need_more_practice_topics = [];
      for (var i_topic=0; i_topic<n_topics; i_topic++) {
         var topic = deckdata[i_deck].topics[i_topic];
         var i_topic_n_cards = deckdata[i_deck].topic_statistics[topic].n_cards;
         var i_topic_n_reviewed = deckdata[i_deck].topic_statistics[topic].n_reviewed;
         if (debug[4]) {
            console.log ('[done] topic:', topic, ', i_topic_n_cards:', i_topic_n_cards, ', i_topic_n_reviewed:', i_topic_n_reviewed);
         }
         if (i_topic_n_reviewed > i_topic_n_cards) {
            var topic_text = '<strong>' + topic + '</strong>: ' + qqc.number_to_word (i_topic_n_cards) + ' ' + Tplural ('card', 'cards', i_topic_n_cards) + ', ' + qqc.number_to_word (i_topic_n_reviewed) + ' ' + 'tries';
            need_more_practice_topics.push (topic_text);
         }
      }
      var n_need_more_practice_topics = need_more_practice_topics.length;
      var topic_list_html = '<p class="topic_list">';
      if (n_need_more_practice_topics > 1) {
         topic_list_html += T ('These are the topics of cards where you clicked');
         for (var i=0; i<n_need_more_practice_topics; i++) {
            need_more_practice_topics[i] = '&bull; ' + need_more_practice_topics[i];
         }
      } else {
         topic_list_html += T ('This is the only topic for which you clicked');
      }
      topic_list_html += ' &ldquo;' + T ('Need more practice') + '&rdquo;:<br />';
      topic_list_html += need_more_practice_topics.join ('; ') + '.';
      topic_list_html += '</p>';
      report_html.push (topic_list_html);
   }

   // Close "flashcard_summary" div.
   report_html.push ('</div>');

   // Show exit text.
   report_html.push (deckdata[i_deck].exit_html);
   report_html = report_html.join ('\n');

   var n_cards = deckdata[i_deck].n_cards;
   if (q.qwizard_b) {
      q.set_editable_parts_front (i_deck, report_html);
   } else {
      report_html = qqc.decode_image_tags (report_html);
      if (q.preview) {
         q.$card_front (i_deck, n_cards).html (report_html);
      } else {
         q.$card_front (i_deck).html (report_html);
      }
   }

   deckdata[i_deck].i_card = n_cards;
   q.set_container_width_height (i_deck);

   // Show or hide "exit-mobile" button.
   if (document_qwiz_mobile) {
      $ ('button.summary_exit_mobile_deck').show ();
   } else {
      $ ('button.summary_exit_mobile_deck').hide ();
   }

   if (! q.preview) {
      deckdata[i_deck].no_flip_b = true;
      deckdata[i_deck].deck_started_b = false;
   }

   // Set to match larger of front and back.
   q.set_container_width_height (i_deck);

   // If recording, record first completion time for sake of leaderboard data.  
   // (If use_dataset="..." deck the php script will check whether all cards
   // have now been marked "got-it").  Wait a bit so previous "got-it" can be
   // recorded.  Don't do if coming from displaying progress bars/leaderboard.
   if (deckdata[i_deck].qrecord_id && document_qwiz_user_logged_in_b && ! progress_bars_f) {

      // Closure.
      var wait_completed = function () {
         var now_sec = new Date ().getTime ()/1000.0;
         var data = {type: 'completed', now_sec: now_sec};
         qqc.jjax (qname, i_deck, deckdata[i_deck].qrecord_id, 'record_qcard', data);
      }
      setTimeout (wait_completed, 2000);
   }
}


// -----------------------------------------------------------------------------
this.display_progress = function (i_deck) {
   var progress_html;
   progress_html = '<p>' + deckdata[i_deck].n_cards + ' ' + T ('cards total') + ', ' + deckdata[i_deck].n_reviewed + ' ' + Tplural ('card', 'cards', deckdata[i_deck].n_reviewed) + ' ' + T ('reviewed') + ', ' + deckdata[i_deck].n_to_go + ' ' + Tplural ('card', 'cards', deckdata[i_deck].n_to_go) + ' ' + T ('to go') + '</p>';
   deckdata[i_deck].$progress_text.html (progress_html);
}


// -----------------------------------------------------------------------------
this.display_login = function (i_deck, add_team_member_f, progress_bars_use_dataset_options) {
   if (! progress_bars_use_dataset_options) {
      progress_bars_use_dataset_options = '';
   }

   // Close menu in case came from there.
   $ ('#usermenu-qdeck' + i_deck).hide ();

   if (! add_team_member_f && ! progress_bars_use_dataset_options) {

      // Stop any bouncing icons (no-intro quizzes/flashcard decks) bouncing.
      $ ('div.qwiz-usermenu_icon_no_intro').removeClass ('qwiz-icon-bounce');
   }

   // If showing back, change to front.
   if (! showing_front (i_deck)) {
      deckdata[i_deck].check_answer_disabled_b = false;
      q.flip (i_deck);
   }

   if (progress_bars_use_dataset_options == 'progress_bars'
                        || progress_bars_use_dataset_options == 'leaderboard') {

      // Gets data, callback sets html.
      qqc.create_progress_bars (qname, deckdata, i_deck, progress_bars_use_dataset_options);
   } else if (progress_bars_use_dataset_options == 'use_dataset_options') {
      qqc.create_use_dataset_options (qname, deckdata, i_deck);
   } else {
      deckdata[i_deck].$qcard_card_front.html (get_login_html (i_deck, add_team_member_f));
      deckdata[i_deck].deck_started_b = false;
      deckdata[i_deck].no_flip_b = true;
   }

   // Hide buttons.
   $ ('#qcard_next_buttons-qdeck' + i_deck).css ('visibility', 'hidden');

   // Focus on username field.
   $ ('#qdeck_username-qdeck' + i_deck).focus ();
}


// -----------------------------------------------------------------------------
function get_login_html (i_deck, add_team_member_f) {

   add_team_member_f = add_team_member_f ? 1 : 0;
   var onfocus = 'onfocus="jQuery (\'#qdeck_login-qdeck' + i_deck + ' p.login_error\').css (\'visibility\', \'hidden\')"';

   var login_html =
       '<div id="qdeck_login-qdeck' + i_deck + '" class="qdeck-login">\n'
     +    '<p>';
   if (add_team_member_f) {
      login_html +=
             '<strong>' + T ('Add team member') + '</strong>';
   } else {
      login_html +=
             '<strong>' + T ('Record score/credit?') + '</strong>';
   }
   login_html +=
          '</p>\n'
     +    '<table>'
     +       '<tr>'
     +          '<td>'
     +             '<label for="qdeck_username-qdeck' + i_deck + '">'+ T ('User name') + '</label>'
     +          '</td>'
     +          '<td>'
     +             '<input type="text" id="qdeck_username-qdeck' + i_deck + '" ' + onfocus + ' />'
     +          '</td>'
     +       '</tr>'
     +       '<tr>'
     +          '<td>'
     +             '<label for="qdeck_password-qdeck' + i_deck + '">'+ T ('Password') + '</label>'
     +          '</td>'
     +          '<td>'
     +             '<input type="password" id="qdeck_password-qdeck' + i_deck + '" ' + onfocus + ' />'
     +          '</td>'
     +       '</tr>'
     +       '<tr>'
     +          '<td style="text-align: right;">'
     +             '<span class="qdeck-remember" title="' + T ('Save preference (do not use on shared computer)') + '"><label><span><input type="checkbox" /></span>&nbsp;' + T ('Remember') + '</label></span>'
     +          '</td>'
     +          '<td>'
     +             '<button class="qbutton login_button" onclick="' + qname + '.login (' + i_deck + ',' + add_team_member_f + ')">'
     +                T ('Login')
     +             '</button>'
     +             '&ensp;'
     +             '<button class="qbutton" onclick="' + qname + '.no_login (' + i_deck + ',' + add_team_member_f + ')">';
   if (add_team_member_f) {
      login_html +=   T ('Cancel');
   } else {
      login_html +=   T ('No thanks');
   }
   login_html +=
                   '</button>'
     +          '</td>'
     +       '</tr>';

   if (! add_team_member_f) {
      login_html +=
             '<tr>'
     +          '<td>'
     +          '</td>'
     +          '<td>'
     +             '<span class="qdeck-register-forgot">'
     +                '<a href="' + qqc.get_qwiz_param ('secure_server_loc', '//localhost/qwiz/admin') + '/new_ind_student_account.php" target="_blank" title="Create an account to track what you\'ve accomplished\nwith quizzes and flashcards">'
     +                   T ('Register') + '</a>'
     +                '&ensp; '
     +                '<a href="' + qqc.get_qwiz_param ('server_loc', '//localhost/qwiz/admin') + '/password_reset_request.php" target="_blank">'
     +                   T ('Forgot password?') + '</a>'
     +             '</span>'
     +          '</td>'
     +       '</tr>';
   }
   login_html +=
          '</table>\n'
     +    '<p class="login_error">'
     +       T ('Login incorrect. Please try again')
     +    '</p>\n'
     + '</div>\n';

   return login_html;
}


// -----------------------------------------------------------------------------
this.login = function (i_deck, add_team_member_f) {

   add_team_member_f = add_team_member_f ? 1 : 0;

   // In case previously declined login option, unset cookie and local flag.
   $.removeCookie ('qwiz_declined_login', {path: '/'});
   document_qwiz_declined_login_b = false;

   // Have we got username and password?
   var username_obj = $ ('#qdeck_username-qdeck' + i_deck);
   var username = username_obj.val ();
   if (! username ) {
      alert (T ('Please enter User name'));
      username_obj.focus ();
      return;
   }

   if (add_team_member_f) {

      // Check if this username already on team list.
      var usernames = document_qwiz_username.split ('; ');
      if (usernames.indexOf (username) != -1) {
         alert ('User ' + username + ' is already on your team.');
         return false;
      }
   }

   var password_obj = $ ('#qdeck_password-qdeck' + i_deck);
   var password = password_obj.val ();
   if (! password) {
      alert (T ('Please enter Password'));
      password_obj.focus ();
      return;
   }

   // We'll send "SHA3" of password.
   var sha3_password = CryptoJS.SHA3 (password).toString ();

   var remember_f;
   if (add_team_member_f) {
      remember_f = document_qwiz_remember_f;
   } else {

      // Pass state of "Remember" checkbox.
      remember_f = $ ('#qdeck_login-qdeck' + i_deck + ' input[type="checkbox"]').prop('checked') ? 1 : 0;
      document_qwiz_remember_f = remember_f;
   }

   // Do jjax call.
   var data = {username: username, sha3_password: sha3_password, remember_f: remember_f, add_team_member_f: add_team_member_f};
   if (add_team_member_f) {
      data.previous_username = document_qwiz_username;
   }
   qqc.jjax (qname, i_deck, deckdata[i_deck].qrecord_id, 'login', data);
}


// -----------------------------------------------------------------------------
this.login_ok = function (i_deck, session_id, remember_f) {

   // Success.  Create session cookie, valid for this session, or -- if flag
   // set -- 1 day, good for whole site.  Value set by server.  Callback
   // script also saves session ID as global (document) variable
   // document_qwiz_session_id.
   if (debug[0]) {
      console.log ('[login_ok] i_deck:', i_deck);
   }
   var options = {path: '/'};
   if (remember_f == 1) {
      options.expires = 1;
   }
   $.cookie ('qwiz_session_id', document_qwiz_session_id, options);


   // Set flag, record time.
   document_qwiz_user_logged_in_b = true;
   document_qwiz_current_login_sec = new Date ().getTime ()/1000.0;

   // Set user menus.
   qqc.set_user_menus_and_icons ();

   // Hide login.
   $ ('#qdeck_login-qdeck' + i_deck).hide ();

   // If recording any decks, reset flag to record start time on first
   // interaction.
   if (q.qrecord_b) {
      for (var ii_deck=0; ii_deck<n_decks; ii_deck++) {
         if (deckdata[ii_deck].qrecord_id) {
            deckdata[ii_deck].record_start_b = true;
         }

         // Also, set indicator to re-check whether (new?) user will get
         // credit for each deck.
         if (deckdata[ii_deck].qrecord_id) {
            deckdata[ii_deck].qrecord_id_ok = 'check credit';
         }
      }
   }
   // If had been on intro or, for use_dataset= deck, on select units/topics,
   // return to "start reviewing cards" screen.
   var i_card = deckdata[i_deck].i_card;
   if (i_card == -1) {
      deckdata[i_deck].$qcard_card_front.html (qqc.decode_image_tags (deckdata[i_deck].intro_html));
   } else {

      // Show buttons.
      $ ('#qcard_next_buttons-qdeck' + i_deck).css ('visibility', 'visible');

      if (i_card == 0) {

         // Start deck with flag set to skip login.
         q.start_deck (i_deck, true);

         // Go to first card.
         //deckdata[i_deck].deck_started_b = true;
         //q.process_card (i_deck);
      } else {

         // Record start, re-display current card.
         deckdata[i_deck].record_start_b = false;
         var now_sec = new Date ().getTime ()/1000.0;
         var data = {qrecord_id_ok: deckdata[i_deck].qrecord_id_ok, type: 'start', now_sec: now_sec};
         qqc.jjax (qname, i_deck, deckdata[i_deck].qrecord_id, 'record_qcard', data);
         q.set_card_front_and_back (i_deck, i_card);
      }
   }
}


// -----------------------------------------------------------------------------
this.login_not_ok = function (i_deck) {

   // Invalid login.  Error message.
   $ ('#qdeck_login-qdeck' + i_deck + ' p.login_error').css ('visibility', 'visible');
   if (debug[0]) {
      console.log ('[login_not_ok] $ (\'#qdeck_login-qdeck' + i_deck + ' p.login_error\'):', $ ('#qdeck_login-qdeck' + i_deck + ' p.login_error'));
   }
}


// -----------------------------------------------------------------------------
this.no_login = function (i_deck, add_team_member_f, progress_bars_f, e) {
   if (debug[0]) {
      console.log ('[no_login] e:', e);
   }
   if (progress_bars_f) {
      e.stopPropagation ();
   }

   // Skip login.  Hide login, go to first question.  If checkbox checked, set
   // cookie and local flag to skip in the future.
   if (! (add_team_member_f || progress_bars_f)) {
      if ($ ('#qdeck_login-qdeck' + i_deck + ' input[type="checkbox"]').prop('checked')) {
         $.cookie ('qwiz_declined_login', 1, {path: '/'});
         document_qwiz_declined_login_b = true;
      }
   }

   // Stop any bouncing icons (no-intro quizzes) bouncing.
   $ ('div.qwiz-usermenu_icon_no_intro').removeClass ('qwiz-icon-bounce');

   // Show buttons.
   $ ('#qcard_next_buttons-qdeck' + i_deck).css ('visibility', 'visible');

   if (deckdata[i_deck].i_card == -1) {

      // Start deck with flag set to skip login.
      q.start_deck (i_deck, true);

      // DKTMP Go to first card.
      //deckdata[i_deck].deck_started_b = true;
      //q.process_card (i_deck, progress_bars_f);
   } else {

      // Re-display current card.
      i_card = deckdata[i_deck].i_card;
      q.set_card_front_and_back (i_deck, i_card);
   }

   // If showing back, change to front.
   if (! showing_front (i_deck)) {
      deckdata[i_deck].check_answer_disabled_b = false;
      q.flip (i_deck);
   }
}


// -----------------------------------------------------------------------------
this.icon_no_login = function (i_deck) {

   // Stop icon from bouncing.  If checkbox checked, set cookie and local flag
   // to skip bouncing/login in the future.
   $ ('div.qwiz-usermenu_icon_no_intro').removeClass ('qwiz-icon-bounce');

   if ($ ('#usermenu-qdeck' + i_deck + ' input[type="checkbox"]').prop('checked')) {
      $.cookie ('qwiz_declined_login', 1, {path: '/'});
      document_qwiz_declined_login_b = true;
   }

   // Close menu.
   $ ('#usermenu-qdeck' + i_deck).hide ();
}


// -----------------------------------------------------------------------------
this.show_usermenu = function (i_deck) {
   $ ('#usermenu-qdeck' + i_deck).show ().mouseleave (function () {
                                                        $ (this).hide ();
                                                      });
}


// -----------------------------------------------------------------------------
this.flip = function (i_deck, i_card) {
   if (debug[0]) {
      console.log ('[flip] i_deck:', i_deck, ', deckdata[i_deck].i_card:', deckdata[i_deck].i_card, ', deckdata[i_deck].no_flip_b:', deckdata[i_deck].no_flip_b);
   }
   if (typeof (i_card) != 'undefined') {

      // Preview -- set to clicked card.
      deckdata[i_deck].i_card = i_card;

      // Don't flip on intro or summary/exit "cards".
      if (i_card == -1 || i_card == deckdata[i_deck].n_cards) {
         return false;
      }
   }

   // Don't flip on intro "card".
   if (deckdata[i_deck].no_flip_b) {
      if (deckdata[i_deck].deck_started_b) {
         deckdata[i_deck].no_flip_b = false;
      }
      return false;
   }
   var i_card  = deckdata[i_deck].i_card;
   var ii_card = deckdata[i_deck].card_order[i_card];
   var card = deckdata[i_deck].cards[ii_card];
   if (! card.single_char_b) {
      if (deckdata[i_deck].check_answer_disabled_b) {
         if (card.textentry_required_b) {
            alert (Tcheck_answer_message);

            // Show hint button.
            $ ('#textentry_hint-qdeck' + i_deck)
               .removeAttr ('disabled')
               .removeClass ('qbutton_disabled')
               .addClass ('qbutton').show ();
         }
         return;
      }
   }
   var $textentry;
   var $front;
   var $back;
   if (q.preview) {
      $textentry = $ ('div#qcard_window-qdeck' + i_deck + ' div.card-container.preview-qcard' + i_card + ' input.textentry-qdeck' + i_deck);
      $front     = $ ('div#qcard_window-qdeck' + i_deck + ' div.card-container.preview-qcard' + i_card + ' div.qcard_card-qdeck' + i_deck + ' div.qcard-front');
      $back      = $ ('div#qcard_window-qdeck' + i_deck + ' div.card-container.preview-qcard' + i_card + ' div.qcard_card-qdeck' + i_deck + ' div.qcard-back');
   } else {
      $textentry = $ ('input.textentry-qdeck' + i_deck);
      $front     = $ ('div.qcard_card-qdeck' + i_deck + ' div.qcard-front');
      $back      = $ ('div.qcard_card-qdeck' + i_deck + ' div.qcard-back');
   }

   var set_front_back;
   var textentry = false;
   var preview_qcard = '';
   if (q.preview) {
      preview_qcard = '.preview-qcard' + ii_card;
   }
   if (showing_front (i_deck)) {

      // If recording, count number of flips (front-to-back only).
      if (deckdata[i_deck].qrecord_id && document_qwiz_user_logged_in_b) {
         deckdata[i_deck].n_flips++;

         // If this is first interaction with no-intro, single-card deck, record
         // as start time.
         if (deckdata[i_deck].record_start_b && document_qwiz_user_logged_in_b) {
            deckdata[i_deck].record_start_b = false;
            var now_sec = new Date ().getTime ()/1000.0;
            var data = {qrecord_id_ok: deckdata[i_deck].qrecord_id_ok, type: 'start', now_sec: now_sec};
            qqc.jjax (qname, i_deck, deckdata[i_deck].qrecord_id, 'record_qcard', data);
         }
      }

      // Hide qwiz icon/link.
      if (i_card == 0) {
         deckdata[i_deck].$qcard_window.find ('div#icon_qdeck' + i_deck).hide ();
      }

      // "Flip"/"Check answer" button - for back, change to "Flip back" and
      // enable.
      $ (button_flip_selector (i_deck)).html (T ('Flip back'))
         .removeClass ('qbutton_disabled')
         .addClass ('qbutton')
         .removeAttr ('disabled');

      // Enable "Need more practice" and "Got it!" buttons, un-gray.
      $ ('button.got_it-qdeck' + i_deck + ', button.next_card-qdeck' + i_deck).attr ('disabled', false).removeClass ('qbutton_disabled').addClass ('qbutton');

      // Increment n_reviewed on first flip for this card and redisplay progress.
      if (! deckdata[i_deck].card_reviewed_b) {
         deckdata[i_deck].card_reviewed_b = true;
         deckdata[i_deck].n_reviewed++;

         // By topic, too.
         var card_topics = deckdata[i_deck].card_topics[ii_card];
         if (debug[4]) {
            console.log ('[flip] card_topics:', card_topics);
         }
         if (card_topics) {
            for (var ii=0; ii<card_topics.length; ii++) {
               var topic = card_topics[ii];
               deckdata[i_deck].topic_statistics[topic].n_reviewed++;
            }
         }

         if (deckdata[i_deck].n_cards > 1) {
            q.display_progress (i_deck);
         }

         // If recording this deck, record (locally) time of first flip.
         if (deckdata[i_deck].qrecord_id) {
            var now_sec = new Date ().getTime ()/1000.0;
            deckdata[i_deck].current_first_flip_sec = now_sec;
         }
      }

      // If there's a text entry box...
      if ($textentry.length) {

         // Hide it (shows through in Safari, Chrome, "flashing" in Chrome on
         // Mac).  Also blur, so jQuery knows to hide suggestion list (in case
         // flip triggered by <Enter>).
         $textentry.blur ().css ('visibility', 'hidden');

         if (card.textentry_required_b) {

            // Find with which choice the user textentry is associated, set card
            // back to answer for that choice.
            q.textentry_set_card_back (i_deck, ii_card);
         } else {

            // If something entered in text box, then set back-side element to
            // what was entered.
            textentry = $textentry.val ();
            if (textentry) {

               // Show what was within square brackets, insert user entry.
               $ ('p.back_textentry_p-qdeck' + i_deck + preview_qcard).css ('visibility', 'visible');
               $ ('span.back_textentry-qdeck' + i_deck + preview_qcard).html (textentry);
            } else {

               // No entry on front. Don't show any of paragraph on back, but
               // keep spacing.
               $ ('p.back_textentry_p-qdeck' + i_deck + preview_qcard).css ('visibility', 'hidden');
            }
         }
      }
      set_front_back = 'back';
   } else {
      set_front_back = 'front';

      // "Flip"/"Check answer" button - for front, change back to current
      // setting (might be "Type 3+ letters" for required-input textentry).
      $ (button_flip_selector (i_deck)).html (card.check_answer);
   }

   if (q.preview) {

      // Flip just current card.
      var $flip_icard = $ ('div#qcard_window-qdeck' + i_deck + ' div.card-container.preview-qcard' + i_card + ' button.cbutton');
      $flip_icard.trigger ('click');
   } else {
      deckdata[i_deck].$flip.trigger ('click');
   }

   // Doing explicit show/hide for whole front back -- Chrome seemed to
   // randomly ignore "backface-visibility."  Also do for front text box and
   // super/subscripts ("flashing" in Chrome). Wait till after flip is halfway
   // through  (Time based on that in flipCard.css.)
   if (showing_front (i_deck)) {

      // Hide whole thing (Chrome randomly ignoring backface-visibility?),
      // superscripts and subscripts (!) (shows through in Safari, Chrome,
      // "flashing" in Chrome on Mac).  Closures for setTimeout ().
      var hideFrontElements = function () {
         $front.css ('visibility', 'hidden');
         $front.find ('sup, sub').css ('visibility', 'hidden');
      }
      var showBackElements = function () {
         $back.css ('visibility', 'visible');
         $back.find ('sup, sub').css ('visibility', 'visible');
         if (textentry) {
            $ ('p.back_textentry_p-qdeck' + i_deck + preview_qcard).css ('visibility', 'visible');
         }
         if (deckdata[i_deck].scroll_b) {
            $back.css ({overflow: 'auto'});
         }
      };
      setTimeout (hideFrontElements, 300);
      setTimeout (showBackElements, 300);
   } else {

      // Closures for setTimeout ().
      var showFrontElements = function () {
         if ($textentry.length) {
            $textentry.css ('visibility', 'visible');
         }
         $front.css ('visibility', 'visible');
         $front.find ('sup, sub').css ('visibility', 'visible');
      };
      var hideBackElements = function () {
         $back.css ('visibility', 'hidden');
         $back.find ('sup, sub').css ('visibility', 'hidden');
         $ ('p.back_textentry_p-qdeck' + i_deck + preview_qcard).css ('visibility', 'hidden');
      }
      setTimeout (showFrontElements, 300);
      setTimeout (hideBackElements, 300);
   }

   // Chrome doesn't measure height of card back until it's displayed.  Re-do
   // setting if flipping to card back.
   if (deckdata[i_deck].showing_front_b) {
      setTimeout ('qcard_.set_container_width_height (' + i_deck + ')', 700);
   }

   // Keep track whether showing front or back.
   toggle_showing_front (i_deck);

   if (q.qwizard_b) {
      if (showing_front (i_deck)) {
         qqc.select_placeholder (deckdata[i_deck].$qcard_front_part1);
      } else {
         qqc.select_placeholder (deckdata[i_deck].$qcard_back_part1);
      }

   }

   return false;
};


// -----------------------------------------------------------------------------
function showing_front (i_deck) {
   var showing_front_b = true;
   if (q.preview) {
      if (deckdata[i_deck].showing_front_bs) {
         var i_card = deckdata[i_deck].i_card;
         if (typeof (deckdata[i_deck].showing_front_bs[i_card]) != 'undefined') {
            showing_front_b = deckdata[i_deck].showing_front_bs[i_card];
         }
      } else {
         deckdata[i_deck].showing_front_bs = [];
      }
   } else {
      showing_front_b = deckdata[i_deck].showing_front_b;
   }

   return showing_front_b;
}


// -----------------------------------------------------------------------------
function toggle_showing_front (i_deck) {
   if (q.preview) {
      var i_card = deckdata[i_deck].i_card;
      if (deckdata[i_deck].showing_front_bs) {
         if (typeof (deckdata[i_deck].showing_front_bs[i_card]) != 'undefined') {
            deckdata[i_deck].showing_front_bs[i_card] = ! deckdata[i_deck].showing_front_bs[i_card];
         } else {
            deckdata[i_deck].showing_front_bs[i_card] = false;
         }
      } else {
         deckdata[i_deck].showing_front_bs = [];
         deckdata[i_deck].showing_front_bs[i_card] = false;
      }
   } else {
      deckdata[i_deck].showing_front_b = ! deckdata[i_deck].showing_front_b;
   }
}


// -----------------------------------------------------------------------------
function set_header (i_deck, front_back, init_b) {

   // If no initial header, hide.
   if (init_b != undefined) {
      var header_html = deckdata[i_deck].header_html;
      if (header_html) {
         deckdata[i_deck].$header.html (header_html);
      } else {
         deckdata[i_deck].$header.hide ();
      }
   }

   // Set the widths of the progress div and header div to match card side.
   var qcard_width = $('div.qcard_card-qdeck' + i_deck + ' div.' + front_back).outerWidth ();
   if (debug[0]) {
      console.log ('[set_header] qcard_width: ', qcard_width);
   }

   // Don't go smaller than current setting (default 500 x 300, or user-
   // specified).  If scrolling, rely on stylesheet.
   if (deckdata[i_deck].card_width_setting) {
      var card_width_setting = deckdata[i_deck].card_width_setting.replace ('px', '');
      if (qcard_width < card_width_setting) {
         qcard_width = card_width_setting;
      }
   }
   // DKTMP scroll
   //deckdata[i_deck].$progress.width (qcard_width);
   //deckdata[i_deck].$header.width (qcard_width);
   //deckdata[i_deck].$next_buttons.width (qcard_width);

   // If alignment center or right, set width of deck window div.  Don't do if
   // mobile view.
   if (deckdata[i_deck].align == 'center' || deckdata[i_deck].align == 'right') {
      if (! document_qwiz_mobile) {
         deckdata[i_deck].$qcard_window.width (qcard_width);
      }
   }

   return qcard_width;
}


// -----------------------------------------------------------------------------
this.set_card_front_and_back = function (i_deck, i_card) {
   if (debug[0]) {
      console.log ('[set_card_front_and_back] i_card:', i_card);
   }

   // Reset card width and height to original settings (so possible resize of
   // previous card won't persist).
   var $qcard_card_front_back;
   var $qcard_card_front;
   var $qcard_card_back;
   if (q.preview) {
      $qcard_card_front_back = $ ('div.card-container.preview-qdeck' + i_deck + '.preview-qcard' + ii_card + ' div.qcard-front-back');
      $qcard_card_front =      $ ('div.card-container.preview-qdeck' + i_deck + '.preview-qcard' + ii_card + ' div.qcard-front div.qcard_content_size');
      $qcard_card_back  =      $ ('div.card-container.preview-qdeck' + i_deck + '.preview-qcard' + ii_card + ' div.qcard-back  div.qcard_content_size');
   } else {
      $qcard_card_front_back = deckdata[i_deck].$qcard_card_front_back;
      $qcard_card_front      = deckdata[i_deck].$qcard_card_front;
      $qcard_card_back       = deckdata[i_deck].$qcard_card_back;
   }
   /* DKTMP scroll
   if (! deckdata[i_deck].scroll_b) {
      $qcard_card_front_back.css ({'width':      deckdata[i_deck].card_width_setting,
                                   'min-height': deckdata[i_deck].card_height_setting});
   }
   */

   var card_front_back = ['card_front', 'card_back'];

   // Show progress -- not in single-card deck.
   if (deckdata[i_deck].n_cards > 1) {
      q.display_progress (i_deck);
   }

   var ii_card = deckdata[i_deck].card_order[i_card];
   var card = deckdata[i_deck].cards[ii_card];

   // Default: "Check answer"/flip enabled.
   $ (button_flip_selector (i_deck))
      .removeAttr ('disabled')
      .removeClass ('qbutton_disabled')
      .addClass ('qbutton');
   deckdata[i_deck].check_answer_disabled_b = false;

   for (var i_side=0; i_side<2; i_side++) {
      var side = card_front_back[i_side];

      // Card front/back text.
      if (side == 'card_front') {
         var $qcard_card_front = q.$card_front (i_deck);

         // If qwizard, split textentry and hangman entries into three parts
         // (editable div before entry field, entry field, and editable div
         // after).
         if (q.qwizard_b) {
            q.set_editable_parts_front (i_deck, card[side]);
         } else {
            $qcard_card_front.html (qqc.decode_image_tags (card[side]));
         }

         // If no intro, and this is first card, add Qwiz icon to front.
         if (q.no_intro_b[i_deck] && deckdata[i_deck].n_reviewed == 0) {
            var qwiz_icon_div = create_qwiz_icon_div (i_deck);
            deckdata[i_deck].$qcard_card.append (qwiz_icon_div);

            q.qwiz_icon_stop_propagation (i_deck);
         }
      } else {
         var $qcard_card_back = $card_back (i_deck);
         if (q.qwizard_b) {
            set_editable_parts_back (i_deck, card[side]);
         } else {
            $qcard_card_back.html (qqc.decode_image_tags (card[side]));
         }

         // If custom card-back background, set style.
         var background = deckdata[i_deck].default_card_back_background;
         var background_card_i = deckdata[i_deck].card_back_background[i_card];
         if (background_card_i) {
            background = background_card_i;
         }
         var css;
         if (background) {
            if (background.substr (0, 4) == 'img:') {
               css = {'background-image': 'url(' + background.substr (4) + ')'};
            } else {
               css = {'background':       background};
            }
            $qcard_card_back.css (css);
         }
      }
   }

   // Make WordPress audio player, if any, visible, and don't let click bubble
   // (to "flip").
   deckdata[i_deck].$qcard_card_front.find ('.wp-audio-shortcode')
      .css ({visibility: 'visible'})
      .click (function (event) {
         event.stopPropagation ();
      });
   deckdata[i_deck].$qcard_card_back.find ('.wp-audio-shortcode')
      .css ({visibility: 'visible'})
      .click (function (event) {
         event.stopPropagation ();
      });

   // Firefox issue: keydown event disappears after "next card" until this is
   // done.  Do before textentry focus!
   if (document_active_qwiz_qdeck) {
      $ (document_active_qwiz_qdeck).find ('div.focusable input').focus ().blur ();
   }

   // Reset value of textentry box, if there is one.
   var $textentry = $('input.textentry-qdeck' + i_deck);
   if ($textentry.length) {
      $textentry.val ('');

      // Set focus to textentry box.  Don't do if first card and no intro
      // (avoid scrolling page to this flashcard deck).  Focus can trigger
      // scroll > panel open in mobile view, so set flag not to open panel.
      if (i_card != 0 || ! q.no_intro_b[i_deck]) {
         panel_exit_mobile_just_closed_b = true;
         $textentry.focus ();
      }

      // Don't let click bubble (to "flip").
      if (deckdata[i_deck].click_flip_b) {
         $textentry.click (function (event) {
            event.stopPropagation ();
            if (debug[0]) {
               console.log ('[set_card_front_and_back] click event:', event);
            }
         });
      }
   } else if (deckdata[i_deck].hangman_answer && deckdata[i_deck].hangman_answer[ii_card]) {

      // Disable flip.
      if (! q.qwizard_b) {
         $ (button_flip_selector (i_deck)).removeClass ('qbutton').addClass ('qbutton_disabled').attr ('disabled', true);
         deckdata[i_deck].check_answer_disabled_b = true;
      }

      var $hangman = q.$card_front (i_deck).find ('div.qdeck_hangman');

      // Initial entry - just underscores for each letter.
      var hangman_final_entry = deckdata[i_deck].hangman_final_entry[ii_card]
      var hangman_current_entry = hangman_final_entry.replace (/>[a-z0-9]</gi, '>&ensp;<');
      deckdata[i_deck].hangman_current_entry[ii_card] = hangman_current_entry.replace (/>&ensp;</g, '>\t<');
      $hangman.find ('div.entry').html (hangman_current_entry);

      // Enable input in case previously disabled.  Reset incorrect
      // characters, number of hints, enable hint button.
      var $hangman_input = $hangman.find ('input');
      $hangman_input.removeAttr ('disabled');
      deckdata[i_deck].hangman_incorrect_chars[ii_card] = '';
      deckdata[i_deck].hangman_n_hints = 0;
      $ ('#hangman_hint-qdeck' + i_deck)
         .removeAttr ('disabled')
         .removeClass ('qbutton_disabled')
         .addClass ('qbutton');

      // Don't let click bubble (to "flip").
      if (deckdata[i_deck].click_flip_b) {
         $hangman_input.click (function (event) {
            event.stopPropagation ();
            if (debug[0]) {
               console.log ('[set_card_front_and_back] click event:', event);
            }
         });
      }

      // Reset hangman status, hide message in case was shown.
      var msg;
      var hangman_answer = deckdata[i_deck].hangman_answer[ii_card];
      if (hangman_answer.search (/[a-z]/i) != -1) {
         msg = T ('Type letters in the box');
      } else {
         msg = T ('Type numbers in the box');
      }
      $hangman.find ('div.hangman_status').html ('<span class="type_letters">' + msg + '</span>');
      // DKTMP
      //q.$card_front (i_deck).find ('div.qdeck_hangman_msg').hide ();

      // Set focus to hangman input box.  Don't do if first card and no intro
      // (avoid scrolling page to this flashcard deck).  Focus can trigger
      // scroll > panel-open in mobile view, so set flag not to open panel.
      // In mobile view (at least in Android default browswer), highlights
      // input box and doesn't respond to first letter, so deselect.
      if (i_card != 0 || ! q.no_intro_b[i_deck]) {
         var $hangman_input = q.$card_front (i_deck).find ('div.qdeck_hangman input');
         panel_exit_mobile_just_closed_b = true;
         $hangman_input.focus ();
         $hangman_input[0].setSelectionRange (0, 0);
      }
   }

   // If textentry with required input/autocomplete set up autocomplete (since
   // just set new html).  Also load metaphone.js, and -- if needed -- terms, if
   // haven't done so already.
   if (card.textentry_required_b) {
      q.init_textentry_autocomplete (i_deck, ii_card);
   } else {

      // In case previous card was textentry with required input, set button
      // text and title back to defaults, and reset saved text.
      $ (button_flip_selector (i_deck)).html (T ('Flip')).attr ('title', T ('Show the other side'));
      card.check_answer = T ('Flip');
   }

   // How soon does new html show?  Test.
   /*
   var ms_count = 0;
   var width_front = 0;
   var width_back  = 0;
   var now = new Date ();
   var start_ms = now.getTime ();
   var size_test = function () {
      var new_width_front  = deckdata[i_deck].$qcard_card_front.outerWidth ();
      var new_width_back  = deckdata[i_deck].$qcard_card_back.outerWidth ();
      if (new_width_front != width_front || new_width_back != width_back) {
         width_front = new_width_front;
         width_back  = new_width_back;
         var now = new Date ();
         var e_ms = now.getTime () - start_ms;
         console.log ('[size_test] ms_count: ', ms_count, ', e_ms: ', e_ms, ', width_front: ', width_front, ', width_back: ', width_back);
      }

      if (ms_count < 200) {
         setTimeout (size_test, 5);
      }
      ms_count += 5;
   }
   size_test ();
   */

   // Set card size to larger of front or back.
   q.set_container_width_height (i_deck, card.textentry_required_b);

   // Set overflow if scrolling -- needed to wait.
   if (deckdata[i_deck].scroll_b) {
      var $qcard_card = deckdata[i_deck].$qcard_card;
      $qcard_card.find ('div.qcard-front').css ({overflow: 'auto'});

      // New card: reset scroll.
      deckdata[i_deck].$qcard_card_front_back.scrollLeft (0).scrollTop (0);
   }
};


// -----------------------------------------------------------------------------
this.set_editable_parts_front = function (i_deck, card_front) {

   // Try for <div class="qcard_textentry"> or <div class="qdeck_hangman...".
   // Include opening and closing tags. (<[^/][^>]*>\s*)*?
   var parts = [];
   var len_card_front = card_front.length;
   var i_pos_textentry_open = qqc.opening_tag_shortcode_pos ('<div class="qcard_textentry|<div class="qcard_single_char_entry', card_front);
   if (i_pos_textentry_open < len_card_front) {
      parts[1] = card_front.substr (0, i_pos_textentry_open);
      parts[2] = qqc.find_matching_block (card_front.substr (i_pos_textentry_open));
      parts[3] = card_front.substr (i_pos_textentry_open + parts[2].length);
   } else {

      var i_pos_hangman_open = qqc.opening_tag_shortcode_pos ('<div class="qdeck_hangman', card_front);
      if (i_pos_hangman_open < len_card_front) {
         parts[1] = card_front.substr (0, i_pos_hangman_open);
         parts[2] = qqc.find_matching_block (card_front.substr (i_pos_hangman_open));
         parts[3] = card_front.substr (i_pos_hangman_open + parts[2].length);
      }
   }
   if (parts.length) {
      $ ('#qcard_front-part0-qdeck' + i_deck).hide ();

      // Take away display (so class qcard-iline with "display: inline" is in
      // effect).
      $ ('#qcard_front-part1-qdeck' + i_deck).html (parts[1]).css ({display: ''});
      $ ('#qcard_front-input-qdeck' + i_deck).html (parts[2]).show ();

      // If there's an unmatched <p> in the second part, delete.
      var part3 = delete_unmatched_p (parts[3]);
      $ ('#qcard_front-part2-qdeck' + i_deck).html (part3).css ({display: ''});
   } else {

      // No <div class="qcard_textentry"> or <div class="qdeck_hangman"> tag.
      // See if <button> tags ("Start // reviewing cards" or "Review this
      // flashcard stack again" and "Return to page view").
      var buttons_opening_pos = qqc.opening_tag_shortcode_pos ('<button', card_front);
      if (buttons_opening_pos < len_card_front) {
         var part1 = card_front.substr (0, buttons_opening_pos);
         if (part1.indexOf ('<div id="flashcard_summary') != -1) {

            // Put summary report into separate div.
            var summary_end_pos = part1.indexOf ('</div>') + 6;
            var summary = part1.substring (0, summary_end_pos);
            $ ('#qcard_front-part0-qdeck' + i_deck).html (summary).show ();

            // Exclude summary report from editable div.
            part1 = part1.substr (summary_end_pos + 1);
         } else {
            $ ('#qcard_front-part0-qdeck' + i_deck).hide ();
         }
         var buttons = qqc.find_matching_block (card_front.substr (buttons_opening_pos));
         var part2 = card_front.substr (buttons_opening_pos + buttons.length);
         $ ('#qcard_front-part1-qdeck' + i_deck).html (part1).css ({display: ''});
         $ ('#qcard_front-input-qdeck' + i_deck).html (buttons).show ();
         var part2 = delete_unmatched_p (part2);
         $ ('#qcard_front-part2-qdeck' + i_deck).html (part2).css ({display: ''});
      } else {

         // No <input> or <button> tags.  Best (apparently) if display is
         // block.
         $ ('#qcard_front-part0-qdeck' + i_deck).hide ();
         $ ('#qcard_front-part1-qdeck' + i_deck).html (card_front).css ({display: 'block'});
         $ ('#qcard_front-input-qdeck' + i_deck).html ('').hide ();
         $ ('#qcard_front-part2-qdeck' + i_deck).html ('').hide ();
      }
   }
}


// -----------------------------------------------------------------------------
function delete_unmatched_p (htm) {
   var i_pos = htm.indexOf ('<p');
   if (i_pos != -1) {
      if (htm.substr (i_pos).indexOf ('</p') == -1) {
         htm = htm.replace (/<p[^>]*>/, '');
      }
   }

   // Also, if it's just whitespace, add a bit of spacer.  Remove tags.
   var htm_wo_tags = htm.replace (/<[^>]+>/gm, '');
   if (htm_wo_tags.search (/\S/) == -1) {
      htm += ' &emsp;';
   }

   return htm;
}


// -----------------------------------------------------------------------------
function set_editable_parts_back (i_deck, card_back, i_choice) {

   // Delay this a bit - let blur event capture fields before resetting html.
   var delay_set = function () {
      if (debug[0]) {
         console.log ('[set_editable_parts_back > delay_set] i_choice:', i_choice);
      }
      var $qcard_back_part1 = deckdata[i_deck].$qcard_back_part1;
      if (typeof (i_choice) != 'undefined') {

         // Free-form required-input.  Maker feedback is already labeled with div
         // having part1 ID -- take editable html from there.
         var i_pos = card_back.indexOf ('<div id="qcard_back-part1');
         var you_entered_p = card_back.substr (0, i_pos);
         var part1_div = card_back.substr (i_pos);
         var maker_feedback = part1_div.replace (/<div[^>]*>/, '').replace (/<\/div>$/, '');
         $ ('#qcard_back-echo-qdeck'  + i_deck).html (you_entered_p).show ();
         $qcard_back_part1.html (maker_feedback).show ();
         $qcard_back_part1.data ('choice', i_choice);
      } else if (card_back.indexOf ('back_textentry_p') != -1) {

         // Optional-input textentry.
         var m = card_back.match (/([\s\S]*?<p class="back_textentry_p.*?<\/p>)([\s\S]*)/);
         $ ('#qcard_back-echo-qdeck'  + i_deck).html (m[1]).show ();
         $qcard_back_part1.html (m[2]).show ();
         $qcard_back_part1.removeData ('choice');
      } else {

         // Hangman or other -- nothing special.
         $ ('#qcard_back-echo-qdeck' +  i_deck).html ('').hide ();
         $qcard_back_part1.html (card_back).show ();
         $qcard_back_part1.removeData ('choice');
      }
      //DKTMP
      //qqc.select_placeholder ($qcard_back_part1);
   }
   setTimeout (delay_set, 100);
}


// -----------------------------------------------------------------------------
this.textentry_set_card_back = function (i_deck, i_card, local_i_choice) {
   if (debug[0]) {
      console.log ('[textentry_set_card_back] i_card:', i_card, ', local_i_choice:', local_i_choice);
   }
   var card = deckdata[i_deck].cards[i_card];
   var $qcard_card_back = $card_back (i_deck);

   var i_choice;
   var entry;
   if (typeof (local_i_choice) != 'undefined') {

      // Set card back to given choice.  Keep entry as is.
      i_choice = local_i_choice;
      entry = $qcard_card_back.find ('span.back_qcard_textentry').html ();
   } else {

      // See with which choice the user textentry is associated.
      var $textentry;
      if (q.preview) {
         $textentry = $ ('div#qcard_window-qdeck' + i_deck + ' div.card-container.preview-qcard' + i_card + ' input.textentry-qdeck' + i_deck);
      } else {
         $textentry = $ ('input.textentry-qdeck' + i_deck);
      }
      entry = $textentry.val ();
      var lc_entry = entry.toLowerCase ();

      // See if entry among choices; identify default choice ("*").
      i_choice = -1;
      var n_choices = card.choices.length;
      var i_default_choice = 0;
      for (var i=0; i<n_choices; i++) {
         var alts = card.choices[i];
         if (alts[0] == '*') {
            i_default_choice = i;
         } else {
            var lc_alts = alts.map (function (item) {
                                       return item.toLowerCase ();
                                    });
            if (lc_alts.indexOf (lc_entry) != -1) {

               // Yes, this one.
               i_choice = i;
               break;
            }
         }
      }
      if (i_choice == -1) {
         i_choice = i_default_choice;
      }
   }
   if (! entry) {
      entry = '___________';
   }

   // Set card back to this feedback.
   var preview_qcard = '';
   if (q.preview) {
      preview_qcard = ' preview-qcard' + i_card;
   }
   var card_back =  '<p class="back_textentry_p' + preview_qcard + '">'
                 +     T ('You entered') + ' &ldquo;'
                 +     '<span class="back_qcard_textentry' + preview_qcard + '">'
                 +        entry
                 +     '</span>&rdquo;'
                 +  '</p>'
                 +  '<div id="qcard_back-part1-qdeck' + i_deck + '" class="card_back_textentry">\n'
                 +     card.feedback_htmls[i_choice]
                 +  '</div>';
   if (q.qwizard_b) {
      set_editable_parts_back (i_deck, card_back, i_choice);
   } else {
      $card_back (i_deck).html (qqc.decode_image_tags (card_back));
   }


   // Do "manual" centering, because position relative has different effect on
   // table cell.
   /*
   var card_width  = $qcard_card_back.outerWidth ();
   var card_height = $qcard_card_back.outerHeight ();

   var div_width  = $qcard_card_back.find ('#qcard_back-part1-qdeck').outerWidth ();
   var div_height = $qcard_card_back.find ('#qcard_back-part1-qdeck').outerHeight ();

   var left = card_width/2  - div_width/2;
   var top  = card_height/2 - div_height/2

   $qcard_card_back.find ('#qcard_back-part1-qdeck' + i_deck).css ({display: 'block', left: left + 'px', top: top + 'px'});
   */
}


// -----------------------------------------------------------------------------
this.set_container_width_height = function (i_deck, textentry_required_b) {
   var scroll_b = deckdata[i_deck].scroll_b;
   var i_card  = deckdata[i_deck].i_card;
   var ii_card;
   if (i_card >= 0 && i_card < deckdata[i_deck].n_cards) {
      ii_card = deckdata[i_deck].card_order[i_card];
   } else {
      ii_card = i_card;
   }

   var $qcard_window;
   var $qcard_container;
   var $qcard_card_front_back;
   var $qcard_card_front;
   var $qcard_card_back;
   if (q.preview) {
      $qcard_window          = $ ('div.card-window.preview-qdeck' + i_deck + '.preview-qcard' + ii_card);
      $qcard_container       = $ ('div.card-container.preview-qdeck' + i_deck + '.preview-qcard' + ii_card);
      $qcard_card_front_back = $ ('div.card-container.preview-qdeck' + i_deck + '.preview-qcard' + ii_card + ' div.qcard-front-back');
      $qcard_card_front      = $ ('div.card-container.preview-qdeck' + i_deck + '.preview-qcard' + ii_card + ' div.qcard-front div.qcard_content_size');
      $qcard_card_back       = $ ('div.card-container.preview-qdeck' + i_deck + '.preview-qcard' + ii_card + ' div.qcard-back  div.qcard_content_size');
   } else {
      $qcard_window          = deckdata[i_deck].$qcard_window;
      $qcard_container       = deckdata[i_deck].$qcard_container;
      $qcard_card_front_back = deckdata[i_deck].$qcard_card_front_back;
      $qcard_card_front      = deckdata[i_deck].$qcard_card_front;
      $qcard_card_back       = deckdata[i_deck].$qcard_card_back;
   }

   // ..........................................................................
   // Set things after a delay -- in case rendering is catching up.  Closure.
   var delay_set_container_width_height = function () {
      var card_width_setting;
      var card_height_setting;
      if (deckdata[i_deck].card_width_setting) {
         card_width_setting  = deckdata[i_deck].card_width_setting.replace ('px', '');
         card_height_setting = deckdata[i_deck].card_height_setting.replace ('px', '');
      }
      if (scroll_b) {

         // Set width and height of container to match.  Do width only if not
         // mobile view.  If not set, rely on stylesheet class.
         if (card_width_setting) {
            card_width_setting  = deckdata[i_deck].card_width_setting.replace ('px', '');
            card_height_setting = deckdata[i_deck].card_height_setting.replace ('px', '');
            /* DKTMP scroll
            if (! document_qwiz_mobile) {
               $qcard_container.width (card_width_setting);
            }
            $qcard_container.height (card_height_setting);
            $qcard_card_front_back.height (card_height_setting);
            */
         } else {
            card_width_setting  = $qcard_container.outerWidth ();
            card_height_setting = $qcard_container.outerHeight ();
         }
      } else {

         // Get width and height of front and back, set size to match largest
         // dimensions.
         var width_front  = parseInt ($qcard_card_front.outerWidth ());
         var height_front = parseInt ($qcard_card_front.outerHeight ());

         var width_back   = parseInt ($qcard_card_back.outerWidth ());
         var height_back  = parseInt ($qcard_card_back.outerHeight ());

         var max_width  = Math.max (width_front,  width_back);
         var max_height = Math.max (height_front, height_back);
         if (debug[0]) {
            console.log ('[delay_set_container_width_height] width_front: ', width_front, ', width_back: ', width_back);
         }

         var new_width_front  = parseInt ($qcard_card_front.outerWidth ());
         var new_height_front = parseInt ($qcard_card_front.outerHeight ());
         if (debug[0]) {
            console.log ('[delay_set_container_width_height] i_deck:', i_deck, ', new_width_front: ', new_width_front, ', new_height_front: ', new_height_front);
         }

         var new_width_back  = 0;
         var new_height_back = 0;
         if (textentry_required_b) {

            // Find largest width and height of alternate feedback divs.  We'll
            // have to put each in place in turn.
            var card = deckdata[i_deck].cards[ii_card];
            var n_choices = card.choices.length;
            for (var i_choice=0; i_choice<n_choices; i_choice++) {

               // Set card back to this choice/feedback.
               q.textentry_set_card_back (i_deck, ii_card, i_choice);

               var new_width_back_i  = parseInt ($qcard_card_back.find ('#qcard_back-part1-qdeck' + i_deck).outerWidth ());
               var new_height_back_i = parseInt ($qcard_card_back.find ('#qcard_back-part1-qdeck' + i_deck).outerHeight ());
               new_width_back  = Math.max (new_width_back,  new_width_back_i);
               new_height_back = Math.max (new_height_back, new_height_back_i);
            }
         } else {
            new_width_back  = parseInt ($qcard_card_back.outerWidth ());
            new_height_back = parseInt ($qcard_card_back.outerHeight ());
         }

         var new_max_width  = Math.max (new_width_front,  new_width_back);
         var new_max_height = Math.max (new_height_front, new_height_back);
         if (debug[13]) {
            console.log ('[delay_set_container_width_height] new_width_front: ', new_width_front, ', new_width_back: ', new_width_back);
            console.log ('[delay_set_container_width_height] new_height_front: ', new_height_front, ', new_height_back: ', new_height_back);
            console.log ('[delay_set_container_width_height] new_max_width: ', new_max_width, ', new_max_height: ', new_max_height);
         }
         if (textentry_required_b) {

            // Add 10px for padding (that position: absolute absorbs).
            new_max_width  += 10;
            new_max_height += 10;
         }

         // Don't go smaller than current setting (default 500 x 300, or user-
         // specified).
         max_width  = Math.max ( max_width, new_max_width, card_width_setting);
         max_height = Math.max ( max_height, new_max_height, card_height_setting);
         if (debug[13]) {
            console.log ('[delay_set_container_width_height] max_width: ', max_width, ', max_height: ', max_height);
         }

         // DKTMP scroll
         //$qcard_card_front_back.outerWidth (max_width);
         //$qcard_card_front_back.outerHeight (max_height);
      }

      if (q.preview) {
         $qcard_container.width (max_width);
         $qcard_container.height (max_height);
      } else {
         if (! scroll_b) {

            // Set width and height of card window to match.  Do width only if not
            // mobile view.
            if (! document_qwiz_mobile) {
               $qcard_window.width (max_width);
            }
            $qcard_window.height (max_height);
         }
      }

      // If height of content is less than card height, align vertically.
      center_vertical ($qcard_card_front, card_height_setting);
      center_vertical ($qcard_card_back,  card_height_setting);

      // Set the widths of the progress, header, and next-button divs to match
      // card.
      // DKTMP scroll
      /*
      if (! q.preview && ! scroll_b) {
         var delay_set_header = function () {
            set_header (i_deck, 'qcard-front');
         }
         setTimeout (delay_set_header, 100);
      }
      */
   }

   // ..........................................................................
   // Note: this delay needs to be shorter than qwizard delay_focus () delay.
   setTimeout (delay_set_container_width_height, 100);
   setTimeout (delay_set_container_width_height, 300);
}


// -----------------------------------------------------------------------------
function center_vertical ($div, height_setting) {
   if ($div.outerHeight () < height_setting) {
      $div.parent ().css ({'top':                 '50%',
                           'transform':           'translateY(-50%)',
                           '-webkit-transform':   'translateY(-50%)'});
   } else {
      $div.parent ().css ({'top':                 '',
                           'transform':           '',
                           '-webkit-transform':   ''});
   }
}


// -----------------------------------------------------------------------------
// Mark card, increment counters, go to next card.
this.got_it = function (i_deck) {

   // If reporting usage, and haven't done so already for this deck, increment
   // counter.
   if (post_id != 0 && ! deckdata[i_deck].usage_incremented_b) {
      qqc.increment_usage ('deck', i_deck, post_id);
      deckdata[i_deck].usage_incremented_b = true;
   }

   if (! q.qwizard_b) {
      var i_card  = deckdata[i_deck].i_card;
      var ii_card = deckdata[i_deck].card_order[i_card];
      deckdata[i_deck].cards[ii_card].got_it = true;
      deckdata[i_deck].n_to_go--;
   }
   q.next_card (i_deck, true);
};


// -----------------------------------------------------------------------------
// Go to next card.
var directions = ['right', 'left', 'top', 'bottom'];
this.next_card = function (i_deck, got_it_f) {
   if (debug[0]) {
      console.log ('[next_card] deckdata[i_deck].i_card:', deckdata[i_deck].i_card);
   }

   // If recording, record either "Need more practice" or "Got it/check answer"
   // button press, as well as stored data.
   if (deckdata[i_deck].qrecord_id && document_qwiz_user_logged_in_b) {
      i_card = deckdata[i_deck].i_card;
      var textentry = '';  // DKTMP
      var now_sec = new Date ().getTime ()/1000.0;
      got_it_f = got_it_f ? 1 : 0;
      var data = {type:                'flashcard',
                  i_card:              deckdata[i_deck].dataset_id[i_card],
                  unit:                deckdata[i_deck].unit[i_card],
                  q_and_a_text:        deckdata[i_deck].q_and_a_text[i_card],
                  first_flip_sec:      deckdata[i_deck].current_first_flip_sec,
                  n_flips:             deckdata[i_deck].n_flips,
                  first_textentry_sec: deckdata[i_deck].current_first_textentry_sec,
                  response:            textentry,
                  now_sec:             now_sec,
                  got_it_f:            got_it_f
                 };
      qqc.jjax (qname, i_deck, deckdata[i_deck].qrecord_id, 'record_qcard', data)
   }

   deckdata[i_deck].i_card++;
   if (deckdata[i_deck].i_card >= deckdata[i_deck].n_cards) {
      deckdata[i_deck].i_card = 0;
   }

   // If showing back, change to front.
   if (! showing_front (i_deck)) {
      q.flip (i_deck);
   }

   // Randomly pick a new flip direction.
   var i = Math.floor (Math.random () * 4.0);
   var new_direction = directions[i];
   deckdata[i_deck].$qcard_card.attr ('data-direction', new_direction);
   deckdata[i_deck].$qcard_card.data('direction', new_direction);

   setTimeout (qname + '.process_card (' + i_deck + ')', 375);
};


// -----------------------------------------------------------------------------
/*
function decode_qdeck (htm, qdeck_tag) {

   // Get html after [qdeck] tag and before [/qdeck] tag.
   var len = htm.length;
   htm = htm.substring (qdeck_tag.length, htm.length-8);
   while (true) {

      // See if non-base64 character (blank, for now) in html.
      var cpos = htm.search (' ');
      if (cpos != -1) {
         break;
      } else {
         htm = atob (htm);
      }
   }

   // Add back [qdeck] [/qdeck] tags.
   htm = qdeck_tag + htm + '[/qdeck]';

   return htm;
}
*/


// -----------------------------------------------------------------------------
this.shuffle_order = function (i_deck) {

   // Shuffle, but make sure current card changes!
   var i_card = deckdata[i_deck].i_card;
   var ii_card = deckdata[i_deck].card_order[i_card];
   while (true) {
      var new_ii_card = deckdata[i_deck].card_order[i_card];
      if (new_ii_card != ii_card && ! deckdata[i_deck].cards[new_ii_card].got_it) {
         break;
      }
      deckdata[i_deck].card_order = shuffle (deckdata[i_deck].card_order);
   }

   // If showing back, change to front.
   if (! showing_front (i_deck)) {
      q.flip (i_deck);
   }

   q.process_card (i_deck);
};


// -----------------------------------------------------------------------------
function shuffle (array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor (Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


// -----------------------------------------------------------------------------
var find_matching_terms = function (request, response) {

   var entry = request.term.toLowerCase ();
   var entry_metaphone = qqc.metaphone (entry);
   if (debug[6]) {
      console.log ('[find_matching_terms] entry_metaphone; ', entry_metaphone);
   }

   // If recording this deck, record (locally) time of first interaction with
   // free-format input (textentry_i_deck set on focus in set_textentry_i_deck ()).
   if (deckdata[textentry_i_deck].qrecord_id) {
      if (! deckdata[textentry_i_deck].current_first_textentry_sec) {
         var now_sec = new Date ().getTime ()/1000.0;
         deckdata[textentry_i_deck].current_first_textentry_sec = now_sec;
      }
   }

   // See if first character of entry metaphone matches first
   // character of any answer metaphone.  If so, determine shortest
   // answer metaphone that matches.
   var required_entry_length = 100;
   var required_metaphone_length = 100;
   var i_card = deckdata[textentry_i_deck].i_card;
   var ii_card = deckdata[textentry_i_deck].card_order[i_card];
   var card = deckdata[textentry_i_deck].cards[ii_card];
   var minlength = card.textentry_minlength;
   for (var i=0; i<textentry_answer_metaphones[textentry_i_deck].length; i++) {
      if (entry[0] == textentry_answers[textentry_i_deck][i][0].toLowerCase ()) {
         required_entry_length = Math.min (required_entry_length, textentry_answers[textentry_i_deck][i].length);
         if (debug[6]) {
            console.log ('[find_matching_terms] entry[0]:', entry[0], ', textentry_answers[textentry_i_deck][i][0]:', textentry_answers[textentry_i_deck][i][0]);
         }
      }
      if (entry_metaphone[0] == textentry_answer_metaphones[textentry_i_deck][i][0]) {
         required_metaphone_length = Math.min (required_metaphone_length, textentry_answer_metaphones[textentry_i_deck][i].length);
         if (debug[6]) {
            console.log ('[find_matching_terms] textentry_answer_metaphones[textentry_i_deck][' + i + ']:', textentry_answer_metaphones[textentry_i_deck][i], ', textentry_answers[textentry_i_deck][' + i + '][0]:', textentry_answers[textentry_i_deck][i][0], ', required_metaphone_length:', required_metaphone_length);
         }
      }
   }
   if (required_entry_length == 100) {
      required_entry_length = minlength;
   } else {
      required_entry_length -= 2;
      required_entry_length = Math.min (minlength, required_entry_length);
   }

   if (required_metaphone_length != 100) {
      required_metaphone_length--;
      if (required_metaphone_length < 2) {
         required_metaphone_length = 2;
      } else if (required_metaphone_length > 4) {
         required_metaphone_length = 4;
      }
   }
   if (debug[6]) {
      console.log ('[find_matching_terms] required_entry_length:', required_entry_length, ', required_metaphone_length:', required_metaphone_length);
   }

   // Entry consisting of repeated single character doesn't count as "long".
   // Replace any three or more of same character in a row with just one.
   var deduped_entry = entry.replace (/(.)\1{2,}/gi, '\$1');
   if (deduped_entry.length < required_entry_length && entry_metaphone.length < required_metaphone_length) {
      textentry_matches[textentry_i_deck] = [];

   } else {
      if (debug[6]) {
         console.log ('[find_matching_terms] request.term:', request.term, entry_metaphone, entry_metaphone.length);
      }
      textentry_matches[textentry_i_deck]
            = $.map (current_card_textentry_terms_metaphones[textentry_i_deck],
                     function (term_i) {
         var ok_f;
         if (entry_metaphone == '') {

            // A number, or perhaps other non-alpha characters.  Match similar
            // terms.
            ok_f = term_i[1] == ''
                             || term_i[0].toLowerCase ().indexOf (entry) === 0;
         } else {
            ok_f = term_i[1].indexOf (entry_metaphone) === 0
                             || term_i[0].toLowerCase ().indexOf (entry) === 0;
         }
         if (ok_f) {
            if (debug[6]) {
               console.log ('[find_matching_terms] term_i:', term_i);
            }
            return term_i[0];
         }
      });
      if (debug[6]) {
         console.log ('[find_matching_terms] textentry_matches[textentry_i_deck]:', textentry_matches[textentry_i_deck]);
      }

      // Add dictionary result, unless flag set.
      if (card.use_dict_b) {

         // Add terms to dictionary processing.
         var plural_f = card.textentry_plural_b ? 1 : 0;
         var data =   'action='           + 'textentry_suggestions'
                    + '&entry='           + encodeURIComponent (entry)
                    + '&entry_metaphone=' + encodeURIComponent (entry_metaphone)
                    + '&n_hints='         + deckdata[textentry_i_deck].textentry_n_hints
                    + '&terms='           + encodeURIComponent (JSON.stringify (textentry_matches[textentry_i_deck]))
                    + '&plural_f='        + plural_f;
         var ajaxurl = qqc.get_qwiz_param ('ajaxurl', '');
         $.ajax ({
            type:       'POST',
            url:        ajaxurl,
            data:       data,
            dataType:   'json',
            error:      function (xhr, desc, exceptionobj) {
                           if (debug[0]) {
                              console.log ('[find_matching_terms] error desc:', desc, exceptionobj);
                           }
                        },
            success:    function (data) {
                           textentry_matches[textentry_i_deck] = data;
                           find_matching_terms2 (response, deduped_entry);
                        }
         });
      } else {
         find_matching_terms2 (response, deduped_entry);
      }
   }
}


// -----------------------------------------------------------------------------
function find_matching_terms2 (response, deduped_entry) {

   if (textentry_matches[textentry_i_deck].length) {
      lc_textentry_matches[textentry_i_deck]
         = textentry_matches[textentry_i_deck].map (function (item) {
                                                       return item.toLowerCase ();
                                                    });
      if (debug[6]) {
         console.log ('[find_matching_terms2] textentry_matches[textentry_i_deck]:', textentry_matches[textentry_i_deck]);
      }
   }

   // If entry length is minlength (default 3) or more, and matches-list does
   // not include first correct answer, and haven't used up hints, enable hint.
   if (debug[6]) {
      console.log ('[find_matching_terms] deduped_entry.length: ', deduped_entry.length, ', textentry_matches[textentry_i_deck].length: ', textentry_matches[textentry_i_deck].length, ', deckdata[textentry_i_deck].textentry_n_hints: ', deckdata[textentry_i_deck].textentry_n_hints);
   }
   var i_card = deckdata[textentry_i_deck].i_card;
   var ii_card = deckdata[textentry_i_deck].card_order[i_card];
   var card = deckdata[textentry_i_deck].cards[ii_card];
   var minlength = card.textentry_minlength;
   if (deduped_entry.length >= minlength && deckdata[textentry_i_deck].textentry_n_hints < 5) {
      var lc_first_choice = card.all_choices[0];
      if (typeof (lc_textentry_matches[textentry_i_deck]) == 'undefined'
            || lc_textentry_matches[textentry_i_deck].indexOf (lc_first_choice) == -1) {
         $ ('#textentry_hint-qdeck' + textentry_i_deck)
            .removeAttr ('disabled')
            .removeClass ('qbutton_disabled')
            .addClass ('qbutton').show ();
      }
   }
   response (textentry_matches[textentry_i_deck]);
}


// -----------------------------------------------------------------------------
// When menu closed: if current entry doesn't fully match anything on the last
// set of matches, disable "Check answer".
function menu_closed (e) {

   var i_card = deckdata[textentry_i_deck].i_card;
   var ii_card = deckdata[textentry_i_deck].card_order[i_card];
   var card = deckdata[textentry_i_deck].cards[ii_card];
   var lc_entry = e.target.value.toLowerCase ();

   // Since triggered by keyup, if entry is shorter than number of hints (user
   // has deleted characters), restore to hint value.
   var n_hints = deckdata[textentry_i_deck].textentry_n_hints;
   if (lc_entry.length < n_hints) {
      var textentry_hint = card.all_choices[0].substr (0, n_hints);
      e.target.value = textentry_hint;
   }

   // Do only if "Check answer" not already disabled.
   if (! deckdata[textentry_i_deck].check_answer_disabled_b) {
      if (debug[6]) {
         console.log ('[menu_closed] textentry_matches[textentry_i_deck]: ', textentry_matches[textentry_i_deck]);
      }
      if (! lc_textentry_matches[textentry_i_deck] 
           || lc_textentry_matches[textentry_i_deck].indexOf (lc_entry) == -1) {
         $ (button_flip_selector (textentry_i_deck)).removeClass ('qbutton').addClass ('qbutton_disabled');
         deckdata[textentry_i_deck].check_answer_disabled_b = true;
      }
   }

   // Since done on keyup (that is, if any typing), cancel automatic
   // presentation (if in progress) if have minlength characters.
   // Do only if there is a timeout in progress.
   if (show_hint_timeout[textentry_i_deck]) {
      var $textentry = $ ('input.textentry-qdeck' + textentry_i_deck);
      var n_chars = $textentry.val ().length;

      var minlength = card.textentry_minlength;
      if (n_chars >= minlength) {
         clearTimeout (show_hint_timeout[textentry_i_deck]);
         show_hint_timeout[textentry_i_deck] = 0;
      }
   }
}


// -----------------------------------------------------------------------------
// When suggestion menu shown: (1) if the matches list shown includes the first
// correct answer, then set flag that hint not needed; (2) if current entry
// _fully_ matches anything on the matches list shown, then enable "Check
// answer"; otherwise disable "Check answer".
function menu_shown (e) {

   // If recording and this is first interaction (no-intro, single-card deck),
   // record as start time.
   if (debug[0]) {
      console.log ('[menu_shown] textentry_i_deck:', textentry_i_deck, ', document_qwiz_user_logged_in_b:', document_qwiz_user_logged_in_b);
      console.log ('[menu_shown] deckdata[textentry_i_deck].record_start_b:', deckdata[textentry_i_deck].record_start_b);
   }
   if (deckdata[textentry_i_deck].record_start_b && document_qwiz_user_logged_in_b) {
      deckdata[textentry_i_deck].record_start_b = false;
      var now_sec = new Date ().getTime ()/1000.0;
      var data = {qrecord_id_ok: deckdata[textentry_i_deck].qrecord_id_ok, type: 'start', now_sec: now_sec};
      qqc.jjax (qname, textentry_i_deck, deckdata[textentry_i_deck].qrecord_id, 'record_qcard', data);
   }

   // Lowercase entry and matches list.
   var lc_entry = e.target.value.toLowerCase ();

   // Does matches list include first choice in list of possible choices?
   var i_card  = deckdata[textentry_i_deck].i_card;
   var ii_card = deckdata[textentry_i_deck].card_order[i_card];
   var card = deckdata[textentry_i_deck].cards[ii_card];
   var lc_first_choice = card.all_choices[0];
   if (lc_textentry_matches[textentry_i_deck].indexOf (lc_first_choice) != -1) {
      $ ('#textentry_hint-qdeck' + textentry_i_deck)
         .attr ('disabled', true)
         .removeClass ('qbutton')
         .addClass ('qbutton_disabled');
   }

   // Enable/disable "Flip/Check answer", and toggle button text between
   // "Flip/Check answer" and "Type 3+ letters" or alternative.
   if (lc_textentry_matches[textentry_i_deck].indexOf (lc_entry) != -1) {
      $ (button_flip_selector (textentry_i_deck))
         .removeAttr ('disabled')
         .removeClass ('qbutton_disabled')
         .addClass ('qbutton')
         .html (T ('Flip'));
      card.check_answer = T ('Flip');
      deckdata[textentry_i_deck].check_answer_disabled_b = false;
   } else {
      card.check_answer = card.save_check_answer;
      $ (button_flip_selector (textentry_i_deck))
         .removeClass ('qbutton')
         .addClass ('qbutton_disabled')
         .html (card.check_answer);
      deckdata[textentry_i_deck].check_answer_disabled_b = true;
   }
}


// -----------------------------------------------------------------------------
// When item selected, enable check answer and set text.
this.item_selected = function () {
   $ (button_flip_selector (textentry_i_deck))
      .removeAttr ('disabled')
      .removeClass ('qbutton_disabled')
      .addClass ('qbutton')
      .html (T ('Flip'));
   deckdata[textentry_i_deck].check_answer_disabled_b = false;
}


// -----------------------------------------------------------------------------
this.keep_next_button_active = function () {
   next_button_active_b = true;
   $ ('button.got_it').attr ('disabled', false).removeClass ('qbutton_disabled').addClass ('qbutton');

}


// -----------------------------------------------------------------------------
function get_attr (htm, attr_name) {
   var attr_value = qqc.get_attr (htm, attr_name, deckdata);
   errmsgs = errmsgs.concat (deckdata.additional_errmsgs);

   return attr_value;
}


// -----------------------------------------------------------------------------
this.get_deckdata = function (i_deck, variable) {

   return deckdata[i_deck][variable];
}


// -----------------------------------------------------------------------------
this.set_deckdata = function (i_deck, variable, value) {
   if (i_deck == -1) {
      var s = variable + ' = ' + value;
      eval (s);
   } else {
      deckdata[i_deck][variable] = value;
   }
}


// -----------------------------------------------------------------------------
this.set_carddata = function (i_deck, i_card, variable, value, i_choice) {
   if (debug[0]) {
      console.log ('[set_carddata] i_card:', i_card, ', variable:', variable, ', value:', value);
   }
   if (typeof (i_choice) == 'undefined') {
      deckdata[i_deck].cards[i_card][variable] = value;
   } else {
      deckdata[i_deck].cards[i_card][variable][i_choice] = value;
   }
}


// -----------------------------------------------------------------------------
function T (string) {
   return qqc.T (string);
}


// -----------------------------------------------------------------------------
function Tplural (word, plural_word, n) {
   return qqc.Tplural (word, plural_word, n);
}


// =============================================================================
// Close - isolate namespace.
};

qcardf.call (qcard_);


/* =============================================================================
 * Flipping Cards 3D
 * By David Blanco
 *
 * Contact: http://codecanyon.net/user/davidbo90
 *
 * Created: January 2013
 *
 * Copyright (c) 2013, David Blanco. All rights reserved.
 * Released under CodeCanyon License http://codecanyon.net/
 *
 * ======================================================= */

flipping_cards = function() {
   $ = jQuery;

   // CHECKS FOR FALLBACK -----------------------
   var debug = false;
   var fallback = false;
   var dk_fallback = false;
   var supportsPerspective;
   var testDiv;
   var is_chrome;
   var is_safari;

   // -----------------------------------------------------------------------
   function getInternetExplorerVersion()
   // Returns the version of Windows Internet Explorer or a -1
   // (indicating the use of another browser).
   {
      var rv = -1; // Return value assumes failure.
      if (navigator.appName == 'Microsoft Internet Explorer');
      {
         var ua = navigator.userAgent;
         var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
         if (re.exec(ua) != null)
            rv = parseFloat( RegExp.$1 );
      }

      var isAtLeastIE11 = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));
      if(isAtLeastIE11){
            rv = 11; //if it is IE 11
      }

      return rv;
   }
   // -----------------------------------------------------------------------


   if( getInternetExplorerVersion() != -1 ){ //IF IS IE
      if (debug) {
         console.log ('is IE');
      }
      fallback = true;
      dk_fallback = true;
   }


   // -----------------------------------------------------------------------
   var supports = (function() {
      var   div = document.createElement('div'),
        vendors = 'Khtml Ms O Moz Webkit'.split(' '),
            len = vendors.length;

      return function(prop) {
        if ( prop in div.style ) return true;

        prop = prop.replace(/^[a-z]/, function(val) {
           return val.toUpperCase();
        });

        while(len--) {
           if ( vendors[len] + prop in div.style ) {
              // browser supports box-shadow. Do what you need.
              // Or use a bang (!) to test if the browser doesn't.
              return true;
           }
        }
        return false;
      };
   })();
   // -----------------------------------------------------------------------


   if ( !supports('backfaceVisibility') ) { //IF IT DOES NOT SUPPORT BACKFACE VISIBILITY
      if (debug) {
         console.log ('! backfaceVisibility');
      }
      fallback = true;
   }


   is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && !!window.chrome;
   is_safari =  navigator.userAgent.toLowerCase().indexOf('safari') > -1 && !window.chrome;

   // If is Chrome or Safari, set up div to test 3D support.
   if (is_chrome || is_safari) {
      testDiv = document.createElement('div');
      var properties = ['perspectiveProperty', 'WebkitPerspective'];
      for (var i = properties.length - 1; i >= 0; i--){
         supportsPerspective = supportsPerspective ? supportsPerspective : testDiv.style[properties[i]] != undefined;
      };
      if (! supportsPerspective) {
         fallback = true;
         if (debug) {
            console.log ('!perspectiveProperty');
         }
      } else {
         var testStyle = document.createElement('style');
         testStyle.textContent = '@media (-webkit-transform-3d){#test3d{height:3px}}';
         document.getElementsByTagName('head')[0].appendChild(testStyle);
         testDiv.id = 'test3d';
         document.body.appendChild(testDiv);
      }
   }


   // -----------------------------------------------------------------------
   flipping_cards_part2 = function () {

      // If is Chrome or is Safari, and good so far, check if supports
      // 3D transform.
      if (is_chrome || is_safari){
         if (! fallback) {

            // If Chrome on Mac, give up.  DK 2014-09-05.
            var is_mac = navigator.platform.toLowerCase().indexOf('mac') != -1;
            if (is_chrome && is_mac) {
               fallback = true;
            }

            retOffsetHeight = testDiv.offsetHeight === 3;
            if (! retOffsetHeight) {
               fallback = true;
               if (debug) {
                  console.log ('!3D_transform');
               }
            }

            // Clean-up.
            testStyle.parentNode.removeChild(testStyle);
            testDiv.parentNode.removeChild(testDiv);
         }
      }

      if( fallback ){
         jQuery('div.card-container').addClass('noCSS3Container');

         jQuery('.card').addClass('noCSS3Card');

         jQuery('.card').children('div').addClass('noCSS3Sides');

         jQuery('.back').hide();
      }

      $('.over').parents('.card-container').on('mouseenter',function(){
         $this = $(this);

         if(!$this.hasClass('mouseenter')){
            $this.addClass('mouseenter');
         }

         direction($this.find('.over'));

      });

      $('.over').parents('.card-container').on('mouseleave',function(){
         $this = $(this);

         if($this.hasClass('mouseenter')){
            direction($this.find('.over'));
         }

      });

      $('.click').on('click', function(){
         $this = $(this);

         direction($this);

      });

      //Stop propagation
      $('.click').on('click', '.ignoreEvent', function(e){
         e.stopPropagation();
      });

      $('.card').on('click', '.cbutton', function(e){
         e.preventDefault();
         $this = $(this);

         direction($this.parents('.card'));
      });

      var intervals = Array();

      function direction($this, index){

         $this.stop(true, true);

         if($this.data('autoflip') != undefined && index != undefined){
            intervals[index] = setTimeout(function(){
                              direction($this, index);
                           }, $this.data('autoflip'));
         }

         //In auto flip feature if it has a mouseover
         if($this.data('mouse') == 'true'){
            return;
         }

         if( fallback ){

            var $div_front = $this.find ('div.qcard-front');
            var $div_back  = $this.find ('div.qcard-back');

            var toggle_front = function () {
               $div_front.toggle ('clip');
            };
            var toggle_back = function () {
               $div_back.toggle ('clip');
            };

            if ($div_front.is (':visible')) {
               $div_front.css ({visibility:  'hidden'});
               $div_back.css  ({visibility:  'visible'});
            } else {
               $div_back.css  ({visibility:  'hidden'});
               $div_front.css ({visibility:  'visible'});
            }

            return;
         }

         if($this.data('direction') === 'right'){

            $this.toggleClass('flipping-right');

         }else if($this.data('direction') === 'left'){

            $this.toggleClass('flipping-left');

         }else if($this.data('direction') === 'top'){

            $this.toggleClass('flipping-top');

         }else if($this.data('direction') === 'bottom'){

            $this.toggleClass('flipping-bottom');

         }

      }


      //AUTO FLIP FEATURE ----------------------->

      var card = $('.card[data-autoflip]');

      function start(){
         card.each(function(index){
            $this = $(this);

            (function(c){

                  var autoStart = c.data('start');

                  if(autoStart == undefined){
                     autoStart = c.data('autoflip');
                  }

                  intervals[index] = setTimeout(function(){
                                    direction(c, index);
                                 }, autoStart);

               })($this);

         });
      }

      start();

      var restart = function() {

          //clear all intervals and start again
          for(var i=0; i<intervals.length; i++){
            clearTimeout(intervals[i]);
          }

          card.removeClass('flipping-right');
          card.removeClass('flipping-left');
          card.removeClass('flipping-top');
          card.removeClass('flipping-bottom');

          start();
      };

      /* Unneeded
      if (window.addEventListener){
        window.addEventListener('focus', restart, false);
      } else if (window.attachEvent){
        window.attachEvent('onfocus', restart);
      }
      */

      // But do it once.
      restart ();


      card.on('mouseenter', function(){
         $(this).data('mouse', 'true');
      });

      card.on('mouseleave', function(){
         $(this).data('mouse', 'false');
      });
   }

   setTimeout (flipping_cards_part2, 200);
}

