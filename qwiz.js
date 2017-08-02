/*
 * Version 3.10 2016-04-20
 * Hangman "hint" button.
 * Leaderboard.
 * Use dataset.
 *
 * Version 3.03 2016-01-28
 * No-suggestions textentry -- suggest="false" option.
 * "My progress" option on user menu -- progress bars by unit.
 *
 * Version 3.02 2015-12-22
 * "Got it!" and "Need more practice" for "show-the-answer" type question.
 * Format login, other for Twentysixteen theme.
 * Fix login -> question view mobile/non-mobile.
 *
 * Version 3.01 2015-12-14
 * Disable [textentry] after answer.
 * Do not require topic for information-only question.
 * [textentry plural="true"] works for dictionary words.
 * Blur hangman focus on complete so <Return> can trigger next-button click.
 * Mobile view, including click-click alternative to drag-and-drop.
 * Qwiz icon - link to sharing.
 * Usermenu icon - quizzes shifted with bounces in WordPress 4.4.  Fix.
 *
 * Version 3.00 2015-10-25
 * Fix <Enter> not working for login.
 * Check if quiz with qrecord_id registered.
 * Check if user will get credit for quiz.
 * Login option to register (independent student).
 * Timeout/warning for login session expiration.
 * "Forgot password?" link.
 * [hangman].
 * Dictionary for textentry suggestions.
 * Don't allow user to delete textentry hint letters.
 * [qwiz] attribute: "align=" (center or right).
 * Add [textentry] attributes: "single_char=...", "use_terms=...".
 *
 * Version 2.35 2015-10-08
 * Information-only "question."
 * "Create a decoy target" option.
 * Class "summary" --> "qwiz-summary"; interfered with other plugins (WooCommerce).
 *
 * Version 2.34 2015-08-31
 * Mouseenter starts timer for show hint on first question of no-intro quiz.
 * Record quiz hits.
 *
 * Version 2.31 2015-06-27
 * Fix bug - labels were getting pre-placed after "Take quiz again".
 *
 * Version 2.30 2015-06-26
 * Team login.
 * Login timeout.
 * Check that attributes have a value given in double quotes.
 * Set textentry minlength for short answer choices.
 * Let zero-length entry metaphones match zero-length term metaphones.
 * Required-input textentry "Check answer" text changes with entry state.
 * <Enter> works for "Check answer", "Next question", and "Login".
 * [fx] feedback applies to all incorrect choices.
 * Hint button appears after timeout, or after gray "Check answer" click.
 * On re-do of a labeled diagram, restore previously-correctly-placed labels.
 * Fix bug - labeled diagrams - "Next" button not showing.
 *
 * Version 2.29 2015-04-26
 * Word-wrap normal for labels (problem in Firefox).
 * Don't use <code></code> for already-wrapped [q] and [l].
 * Fix bug -- hint required matching first character.
 * textentry minlength= option.
 * Sort numeric for textentry suggestions.
 * Recording/progress.
 * Briefer topic summary.
 *
 * Version 2.28 2015-02-03
 * Hide Qwiz icon when autocomplete starts.
 * Remove resizing handles (because now have images that would show).
 * random="true" option for quizzes.
 * Free-form input ([textentry]) with suggestions/hints.
 *
 * Version 2.27 2015-01-05
 * Toolbar option - keep "next" button active.
 * Just count targets, not labels.
 * Feedback interleaved with choices, optional.
 *
 * Version 2.26 2014-12-21
 * Look for WP content filter-created divs, rewrite only that HTML.
 * Take xqwiz sizing div out of flow.
 *
 * Version 2.25 2014-12-16
 * Fix search for any [qwiz] shortcode.
 *
 * Version 2.24 2014-12-15
 * Make $ (= jQuery) private.
 *
 * Version 2.22 2014-12-07
 * Multiple targets for a single label.
 * Tolerate whitespace before [h].
 * Fix check for paragraph with header plus something else -- don't delete.
 * Reinstate containment for labels -- by table size.
 * qtarget_sibs-... instead of text_target_wrapper (except for backwards compatibility).
 * Don't allow draggable labels to be "underneath" already-placed labels.
 *
 * Version 2.21 2014-12-02
 * Workaround for Firefox 33.1 problem with long regular expression and long
 * string in intro parse.
 *
 * Version 2.20 2014-11-20
 * Handle "smart quotes" in attributes.
 *
 * Version 2.19 2014-11-19
 * Add "Q #1/4" to labeled diagram progress.
 *
 * Version 2.16 2014-11-12
 * Delete <br> in header.
 *
 * Version 2.15 2014-11-09
 * Nicer qwiz icon, hover effect.  Hide icon with flip.
 * Ignore empty paragraphs when no [i]: handle multiple paragraphs.
 * Fix choice highlighting when multiple choices within one paragraph.
 * Handle left- and right-double-quotes in labels="top", etc.
 *
 * Version 2.14 2014-11-04
 * Restore missing double quote -- couldn't split on labeled diagrams.
 *
 * Version 2.12 2014-11-03
 * Distinguish qwiz from qdeck in hiding icon.
 * Feedback padding - don't overlap icon.
 *
 * Version 2.11 2014-11-03
 * New classes for labeled-diagram target/label borders (avoid "flash").
 * Ignore empty paragraphs (with "&nbsp;") in intro without "[i]".
 * Qwiz icon/link on intro or first question only.
 * If labeled diagram is wide, reset qwiz div/borders to match.
 * 'div.container' as content option.
 * Use class "qtarget_assocNNN..." instead of data-...; some implementations
 * eat data-...
 *
 * Version 2.10 2014-10-28
 * Fix topic= for labeled diagram questions.
 * Add labels="top", etc. options for labeled diagram questions.
 *
 * Version 2.09 2014-10-05
 * Fix "Mode" not showing after labeled diagram.
 * Labeled diagram not "correct" until labels placed correctly on first try.
 * A few more strings for internationalization.
 *
 * Version 2.08 2014-10-05
 * Add internationalization - use .po and .mo files.
 * Add div.post-entry as page content location.
 *
 * Version 2.07 2014-10-01
 * Suppress errors, delete source in page/post excerpts.
 *
 * Version 2.06 2014-09-30
 * Bug fix - lost "next" button.
 *
 * Version 2.05 2014-09-29
 * Apply gray-out to label children, too (overwrite specific settings).
 *
 * Version 2.04 2014-09-29
 * Labels list vertical-align top.
 * Fix label placement progress when multiple quizzes.
 * -webkit-user-select none - improves Android Chrome drag.
 * [qwizdemo] tags.
 *
 * Version 2.03 2014-09-26
 * Vertical-center labels in targets.
 *
 * Version 2.02 2014-09-21
 * Re-initialize diagrams (to clone of orig) on restart.
 * Restart button correct in sinqle-question labeled diagram.
 *
 * Version 2.01 2014-09-16
 * Fix highlighting of choices when no intro.
 * If question with only one choice, "Show the answer" button, not radio.
 *
 * Version 2.00 2014-09-14
 * "Took n tries" feedback on labeled diagram.
 * Border around labels; labels bulleted.
 *
 * Version 1.1b05 2014-09-12
 * Make WordPress consistent in use of standard box-sizing model.
 *
 * Version 1.1b03 2014-09-07
 * Labeled-diagrams capability, including interactive editing.
 * Chrome on Mac: fallback for Flashcards; others: prevent sub/sup showing
 * through.
 *
 * Version 1.01 2014-08-16
 * Remove <p>s and headers that contain only [!] ... [/!] comments.  Paragraph
 * marks that remained after comments were deleted were taking space.
 *
 * Version 1.0 2014-07-31
 * Initial WordPress release.
 */

// Do-nothing function for old IE.
if (! window.console) {
   window.console = {log: function(){} };
}


// =============================================================================
// Isolate namespace.
qwiz_ = {};
var qwizf = function () {
// =============================================================================
//
var qname = 'qwiz_';

// Debug settings.
var debug = [];
debug.push (false);    // 0 - general.
debug.push (false);    // 1 - radio/choices html.
debug.push (false);    // 2 - feedback html.
debug.push (false);    // 3 - old/new html dump.
debug.push (false);    // 4 - question tags/topics.
debug.push (false);    // 5 - unused.
debug.push (false);    // 6 - [textentry] / autocomplete.
debug.push (false);    // 7 - Enter -> click.
debug.push (false);    // 8 - Drag and drop.
debug.push (false);    // 9 - [hangman].
debug.push (false);    // 10 - unused.
debug.push (false);    // 11 - use_dataset.
debug.push (false);    // 12 - QWizard.

var $ = jQuery;

// Publicly available.
this.no_intro_b = [];
this.qwizard_b = false;
this.processing_complete_b = false;
this.qrecord_b = false;
this.preview = false;

// Private data, but global to this qwiz instance.
var q = this;
var qqc;

var content;
var default_use_dict;
var default_use_terms;
var hint_timeout_sec;
var default_hangman_max_hints;
var post_id;
var correct;
var incorrect;
var errmsgs = [];

var n_qwizzes = 0;
var qwizzled_b;

var qwizdata = [];

var header_html;

var drag_and_drop_initialized_b = false;
var try_again_obj = '';
var $label_clicked = [];
var $prev_label_clicked = [];
var ignore_label_click_b = false;

var next_button_active_b = false;

var textentry_b = false;
var loaded_metaphone_js_b = false;

// Object (singular and plural) of arrays of term-metaphone pairs.
// Constant across quizzes.
var default_textentry_terms_metaphones;

// (qwizdata[i_qwiz].textentry_terms_metaphones are quiz-specific terms given
// with [terms]...[/terms].)

// These vary with quiz, and are set up anew for each [textentry] question.
var current_question_textentry_terms_metaphones = {};

var textentry_answers = {};
var textentry_answer_metaphones = {};

var textentry_matches = {};
var lc_textentry_matches = {};
var textentry_i_qwiz;

var Tcheck_answer_message;
var show_hint_timeout = {};


var scroll_detect_i_qwiz;
var panel_exit_mobile_open_b = false;
var panel_exit_mobile_just_closed_b;

var non_mobile_scrollLeft;
var non_mobile_scrollTop;

var qw;
var set_qwizard_data_b = false;

// -----------------------------------------------------------------------------
$ (document).ready (function () {

   qqc = qwiz_qcards_common;
   if (debug[0]) {
      console.log ('[qwiz.js > document ready] typeof (document_qwizard_user_page):', typeof (document_qwizard_user_page));
   }
   correct = [T ('Good!'), T ('Correct!'), T ('Excellent!'), T ('Great!')];
   incorrect = [T ('No.'), T ('No, that\'s not correct.'), T ('Sorry, that\'s not correct.')];

   // Do only if we're not on WordPress editing page and we're not on qwizard
   // user/editing page (qwiz_init will be called in that case once the user/
   // editing page has had a chance to grab the source shortcodes).
   if (typeof (document_qwizard_user_page) == 'undefined'
               && window.location.href.indexOf ('action=edit') == -1 
                          && window.location.href.indexOf ('post-new') == -1) {
      q.qwiz_init ();
   }
});


// -----------------------------------------------------------------------------
this.qwiz_init = function (skip_error_check_f) {

   // The identifier -- including qualifiers like "#" -- of the page content (that
   // perhaps contains inline quizzes) on WordPress.  Multiple-entries default
   // set in qwiz-online-quizzes-wp-plugin.php: div.entry-content, div.post-entry,
   // div.container.  Apparently themes can change this; these have come up so far.
   // Body default for stand-alone use.
   content                   = qqc.get_qwiz_param ('content', 'body');
   default_use_dict          = qqc.get_qwiz_param ('use_dict', 'true');
   default_use_terms         = qqc.get_qwiz_param ('use_terms', 'true');
   default_hangman_max_hints = parseInt (qqc.get_qwiz_param ('hangman_hints', 2));
   hint_timeout_sec          = qqc.get_qwiz_param ('hint_timeout_sec', 20);
   post_id                   = qqc.get_qwiz_param ('post_id', 0);
   q.qwizcards_version       = qqc.get_qwiz_param ('qwizcards_version', '');
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

   if (n_qwizzes) {

      // If on mobile, show expand-to-full-screen icon and clickable target on
      // all quizzes.
      if (qqc.is_mobile ()) {
         $ ('.go-mobile-qwiz').show ();
      }
      for (var i_qwiz=0; i_qwiz<n_qwizzes; i_qwiz++) {

         // If quiz subject to recording, set flag to record start times on
         // first interaction of logged-in user with quiz.
         if (qwizdata[i_qwiz].qrecord_id) {
            qwizdata[i_qwiz].record_start_b = true;
         }

         // If no intro for a quiz or single-question quiz, move immediately to
         // first question.
         if (q.no_intro_b[i_qwiz] || qwizdata[i_qwiz].n_questions == 1) {
            q.next_question (i_qwiz);
         }
      }

      if (q.preview && ! q.qwizard_b) {
         init_preview (0);
      }
   }
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

   // Look for [qwiz] and [/qwiz] that are only thing inside parents (e.g.,
   // <p>[qwiz]</p>).  Replace with "unwrapped" content if so.
   $ ('p:contains("qwiz"), :header:contains("qwiz")').each (function () {
      var tag_htm = $ (this).html ();
      if (tag_htm.search (/\s*\[\/{0,1}qwiz[^\]]*\]\s*/m) == 0) {
         $ (this).replaceWith (tag_htm);
      }
   });

   // We're either going to deal with HTML (stand-alone version) or divs (added
   // by WordPress content filter).  The divs allow us to replace content
   // specific to qwiz/qdeck -- avoid clobbering any events bound to remaining
   // html by other plugins.  See if there are such divs.  WP content filter
   // always adds at least one empty div, so don't have to do HTML branch.
   var div_html_selector = '';
   var $qwiz_divs= $ ('div.qwiz_wrapper');
   var $fallback_wrappers = $ ('div.qwiz_wrapper_fallback');
   if ($qwiz_divs.length) {
      div_html_selector = 'div.qwiz_wrapper';

      // Hide fallback wrappers.
      $fallback_wrappers.css ({display: 'none'});
   } else {

      // If there are no fallback wrappers, need to add style so they'll show
      // if they're inserted into the page later.
      if ($fallback_wrappers.length == 0) {
         var style =   '<style type="text/css">\n'
                     +    '.qwiz_wrapper_fallback_visible {\n'
                     +       'visibility: visible;\n'
                     +    '}\n'
                     + '</style>\n';
         $ ('head').append (style);
      }
      div_html_selector = content;
   }

   // Read appropriate divs, look for qwiz shortcodes, loop over shortcode
   // pairs.
   var i_qwiz = 0;
   $ (div_html_selector).each (function () {
      var htm = $ (this).html ();
      if (! htm) {

         //errmsgs.push ('Did not find page content (looking for div "' + content + '")');
      } else {

         // See if there is a qwiz or qwizzes.
         var qwiz_pos = htm.indexOf ('[qwiz');
         if (qwiz_pos != -1) {

            // Remove and save text inside [qwizdemo] ... [/qwizdemo] pairs.
            // Replace with <qwizdemo></qwizdemo> pairs as placeholder.
            var qwizdemo_re = new RegExp ('\\[qwizdemo\\][\\s\\S]*?\\[\\/qwizdemo\\]', 'gm');
            var qwizdemos = htm.match (qwizdemo_re);
            var n_qwizdemos = 0;
            if (qwizdemos) {
               n_qwizdemos = qwizdemos.length;
               htm = htm.replace (qwizdemo_re, '<qwizdemo></qwizdemo>');
               if (debug[0]) {
                  console.log ('[process_html] n_qwizdemos: ', n_qwizdemos);
               }
            }

            // Delete comments -- don't want to process [qwiz][/qwiz] pairs or any other
            // qwiz-related tags that are in comments.
            var new_htm = htm.replace (/<!--[\s\S]*?-->/gm, '');

            // Take out any remaining [!]...[\!] comments (those that were not
            // inside paragraph or header elements).
            new_htm = new_htm.replace (/\[!+\][\s\S]*?\[\/!+\]/gm, '');

            // Check that there are pairs.
            var local_n_qwizzes = 0;
            var do_not_process_htm = check_qwiz_tag_pairs (new_htm);
            if (do_not_process_htm) {
               new_htm = do_not_process_htm;
            } else {

               // Get text, including beginning and ending tags.  "." does not
               // match line-ends (!), so use the whitespace/not-whitespace
               // construct.  Non-greedy search, global, multiline.
               qwizzled_b = false;
               var qwiz_matches = new_htm.match (/\[qwiz[\s\S]*?\[\/qwiz\]/gm);
               if (qwiz_matches) {
                  local_n_qwizzes = qwiz_matches.length;
                  if (debug[0]) {
                     console.log ('[process_html] local_n_qwizzes: ', local_n_qwizzes);
                     console.log ('               qwiz_matches[0]: ', qwiz_matches[0]);
                  }

                  // Loop over qwiz-tag pairs.
                  for (ii_qwiz=0; ii_qwiz<local_n_qwizzes; ii_qwiz++) {
                     var new_qwiz_html = q.process_qwiz_pair (qwiz_matches[ii_qwiz], i_qwiz);

                     // Let's take out <p...> and <h...> from before [qwiz].
                     new_htm = new_htm.replace (/(<[ph][^>]*>\s*)*?\[qwiz[\s\S]*?\[\/qwiz\]/m, new_qwiz_html);
                     i_qwiz++;
                  }
                  if (debug[3]) {
                     console.log ('[process_html] new_htm:', new_htm);
                  }
               }
            }

            // Restore examples, but without [qwizdemo] ... [/qwizdemo] tags.
            //                               0----+----1    ----+----1-
            for (var i_qwizdemo=0; i_qwizdemo< n_qwizdemos; i_qwizdemo++) {
               var qwizdemo_i = qwizdemos[i_qwizdemo];
               var len = qwizdemo_i.length;
               qwizdemo_i = qwizdemo_i.substring (10, len - 11);
               new_htm = new_htm.replace ('<qwizdemo></qwizdemo>', qwizdemo_i);
            }

            // Replace content html.
            $ (this).html (new_htm);

            // Mouseenter for this quiz records it as the active qwiz.
            $ (this).find ('div.qwiz')
               .on ('mouseenter',
                    function (e) {

                       // Gets off after usermenu open/close.  Make sure get
                       // container div.
                       if (e.target.tagName.toLowerCase () == 'div'
                                              && e.target.className == 'qwiz') {
                          document_active_qwiz_qdeck = e.target;
                       } else {
                          var $qwizdiv = $ (e.target).parents ('div.qwiz');
                          if ($qwizdiv.length) {
                             document_active_qwiz_qdeck = $qwizdiv[0];
                          }
                       }
                       if (debug[7]) {
                          console.log ('[qwiz mouseenter] e.target:', e.target);
                          console.log ('[qwiz mouseenter] document_active_qwiz_qdeck:', document_active_qwiz_qdeck);
                       }
                   });

            // Waited to do check_registered so can update sharing href of qwiz
            // icon.  Also, record/update number of cards.
            $ (this).find ('div.qwiz').each (function () {
               var id = $ (this)[0].id;
               var ii_qwiz = parseInt (id.substr (4), 10);
               var qrecord_id = $ (this).attr ('qrecord_id');
               if (qrecord_id) {
                  qrecord_id = qqc.replace_smart_quotes (qrecord_id);
                  var n_questions = qwizdata[ii_qwiz].n_questions;
                  var data = {qwiz_qdeck: 'qwiz', n_questions_cards: n_questions};
                  qqc.jjax (qname, ii_qwiz, qrecord_id, 'check_registered', data);
               }
            });
         }

         // If wrapper divs, unwrap.
         if ($qwiz_divs.length) {
            $ (this).contents ().unwrap ();
         }
      }
      n_qwizzes = i_qwiz;
   });

   // Set up Enter-key intercept -- trigger appropriate button press
   // (Next question, Check answer, Login).
   qqc.init_enter_intercept ();

   // If any quizzes subject to recording, set user menus -- if this comes after
   // check_session_id () callback, it will properly set the menus (while the
   // callback may not have worked if the html hadn't been set at that time).
   if (q.qrecord_b) {
      qqc.set_user_menus_and_icons ();
   }

   // If any [textentry] free-form input, set up autocomplete.
   if (textentry_b) {

      // If this is stand-alone version, and qcard_ present, wait until it's
      // done (since re-writes body html).
      if (content == 'body' && typeof (qcard_) != 'undefined') {
         var n_tries = 0;

         // ................................................
         var run_init_textentry_autocomplete = function () {
            var ok_b = false;
            console.log ('[run_init_textentry_autocomplete]', n_tries);
            if (qcard_.processing_complete_b || n_tries > 30) {
               console.log ('[run_init_textentry_autocomplete] OK');
               q.init_textentry_autocomplete ($ ('body'));
               ok_b = true;
            }

            // Do every 10th of a second until success.
            if (! ok_b) {
               setTimeout (run_init_textentry_autocomplete, 100);
               n_tries++;
            }
         }
         // ................................................

         run_init_textentry_autocomplete ();
      } else {
         q.init_textentry_autocomplete ($ ('body'));
      }

   }

   // Set flag just in case.
   q.processing_complete_b = true;
}


// -----------------------------------------------------------------------------
// Show all questions at once.
function init_preview (i_qwiz) {

   // Each question needs border, sizing.  So apply whole-quiz class.  Also add
   // class to do some spacing.  When mouseover a question, set i_question.
   // Show all.
   $ ('#qwiz' + i_qwiz + ' div.qwizq').addClass ('qwiz qwizq_preview')
                                      .on ('mouseenter', q.set_i_qwiz_i_question)
                                      .show ();

   // Hide overall quiz border.
   $ ('#qwiz' + i_qwiz).css ({border: 'none'});

   // Show intro if set, and give it qwiz class.
   if (! q.no_intro_b[i_qwiz]) {
      $ ('div.intro-qwiz' + i_qwiz).addClass ('qwiz qwizq_preview').show ();
   }

   // Set summary, summary/exit, and add classes.
   q.display_summary_and_exit (i_qwiz);
   $ ('#summary-qwiz' + i_qwiz).addClass ('qwiz qwizq_preview').show ();

   // Don't show "Next question" or "Start quiz" ever.
   $ ('#next_button-qwiz' + i_qwiz).remove ();

   // Initialize each question.
   var n_questions = qwizdata[i_qwiz].n_questions;
   for (var i_question=0; i_question<n_questions; i_question++) {
      q.display_question (i_qwiz, i_question, false);
   }
}


// -----------------------------------------------------------------------------
this.set_i_qwiz_i_question = function () {
   if (debug[0]) {
      console.log ('[set_i_qwiz_i_question] this:', this);
   }

   // Looks like qwiz0-q0.
   var id = this.id;
   var i_qwiz = id.match (/qwiz([^-]+)/)[1];
   var i_question = id.match (/-q(.+)/)[1];
   qwizdata[i_qwiz].i_question = i_question;
}


// -----------------------------------------------------------------------------
this.init_qwizzled = function ($content, i_qwiz, i_question) {
   if (debug[0]) {
      console.log ('[init_qwizzled] i_qwiz:', i_qwiz);
   }

   // Targets no longer draggable (from qwizzled create/edit step).
   // Also reset borders.  Give each target a unique ID (so can see if correctly
   // labeled on first try) -- but give text-target siblings the same ID.
   sibs = {};
   var t_id;
   var ii = 0;
   $content.find ('div.qwizzled_canvas .qwizzled_target').each (function () {
      var $this = $ (this);
      $this.removeClass ('ui-draggable ui-draggable-handle').css ({'border-style': 'dotted', 'border-color': 'gray'});
      var classes = $this.attr ('class');
      var m = classes.match (/qtarget_sib-([0-9]+)/);
      if (m) {
         var sib = m[1];
         if (sibs[sib]) {

            // Have already seen sibling of this target.  Use that ID.
            t_id = sibs[sib];
         } else {

            // This is new.  Create new ID and save.
            t_id = 't' + ii;
            sibs[sib] = t_id;
            ii++;
         }
      } else {
         t_id = 't' + ii;
         ii++;
      }
      $this.attr ('id', t_id);

      // Also, make targets clickable (along with labels; provides alternative
      // to drag and drop).  Click is about same as label-drop.  Act on click
      // only if target still droppable.
      $this.on ('click', function (event) {
                               if (debug[8]) {
                                  console.log ('[target clicked] $ (event.target):', $ (event.target));
                               }
                               var $target = $ (event.target);

                               // Label sitting on a target may get the click
                               // event focus.  Ignore.
                               if ($target.hasClass ('qwizzled_target')) {
                                  if (! $target.droppable ('option', 'disabled')) {
                                     q.label_dropped ($target);
                                  }
                               }
                            });
   });

   // Labels clickable also (alternative to drag).
   $content.find ('td.qwizzled_labels div.qwizzled_label').each (function () {
      $ (this).on ('click', function (event) {
                               if (debug[8]) {
                                  console.log ('[label clicked] $ (event.target).html ():', $ (event.target).html ());
                               }
                               if (ignore_label_click_b) {
                                  ignore_label_click_b = false;
                               } else {
                                  var $label;
                                  if (event.target.tagName.toLowerCase () == 'div') {
                                     $label = $ (event.target);
                                  } else {
                                     $label = $ (event.target).parents ('div.qwizzled_label');
                                  }

                                  // Record label clicked, unhighlight others
                                  // (all), highlight this one, 
                                  var ii_qwiz = $label[0].id.match (/qwiz([^-]+)/)[1];
                                  $label_clicked[ii_qwiz] = $label;
                                  var $td_qwizzled_labels = $label.parents ('td.qwizzled_labels');
                                  $td_qwizzled_labels.find ('.qwizzled_highlight_label').removeClass ('label_click_highlight');
                                  $td_qwizzled_labels.find ('.qwizzled_label_head').hide ();
                                  $td_qwizzled_labels.find ('.qwizzled_label_head_label_clicked').show ();
                                  $label.find ('.qwizzled_highlight_label').addClass ('label_click_highlight');
                                  q.label_dragstart ($label, true);
                               }
                            });
   });

   // Remove resizing handle divs.
   $content.find ('div.qwizzled_canvas div.ui-resizable-handle').remove ();

   // Image-linked targets need border-width.
   $content.find ('div.qwizzled_image div.qwizzled_target').css ('border-width', '2px');

   // Eliminate label borders.
   $content.find ('.qwizzled_highlight_label').css ('border', 'none');

   // Everything within label (such as <strong> or <sup>) needs to override
   // WordPress word-wrap: break-word setting.
   $content.find ('.qwizzled_highlight_label *').css ('word-wrap', 'normal');

   // (Setting up drag-and-drop here doesn't stick -- perhaps WordPress cancels
   // events.  Done by init_drag_and_drop () when first mouseover a qwizzled
   // question div.)

   // Don't let WordPress resize images on small screens.  Get size from image
   // wrapper, assign to image (and eliminate sizes= and srcset= attributes).
   // Do for each wrapper.
   $content.find ('div.qwizzled_image').each (function () {
      var wrapper_width  = $ (this).width ();
      var wrapper_height = $ (this).height ();

      // Assign width and height to image, and remove unwanted attributes.
      $ (this).find ('img').attr ('width', wrapper_width).attr ('height', wrapper_height)
                           .removeAttr ('sizes').removeAttr ('srcset');
   });

   q.init_qwizzled2 ($content, i_qwiz, i_question);
}


// -----------------------------------------------------------------------------
this.init_qwizzled2 = function ($content, i_qwiz, i_question) {

   // Save deep copy of qwizzled question -- in case restart quiz.
   // Also see if quiz has non-default width.
   var initial_width = $ ('#xqwiz' + i_qwiz).outerWidth ();
   if (debug[0]) {
      console.log ('[init_qwizzled2] i_qwiz:', i_qwiz, ', i_question:', i_question, ', initial_width:', initial_width);
   }
   if (initial_width) {
      qwizdata[i_qwiz].initial_width = initial_width;
   }
   if (! qwizdata[i_qwiz].$qwizzled) {
      qwizdata[i_qwiz].$qwizzled = {};
   }
   var qwizq_id = 'qwiz' + i_qwiz + '-q' + i_question;
   qwizdata[i_qwiz].$qwizzled[qwizq_id] = $content.clone (true);
}


// -----------------------------------------------------------------------------
this.init_textentry_autocomplete = function ($scope) {
   if (debug[6]) {
      console.log ('[init_textentry_autocomplete]');
   }

   $scope.find ('input.qwiz_textentry').autocomplete ({
      source:        find_matching_terms,
      close:         menu_closed,
      open:          menu_shown,
      select:        q.item_selected
   });

   $scope.find ('input.qwiz_textentry').keyup (menu_closed);

   // Single-char textentry.
   $scope.find ('input.qwiz_single_char_entry').keyup (single_char_textentry_keyup);
}


// -----------------------------------------------------------------------------
this.label_dragstart = function ($label, label_clicked_b) {

   var i_qwiz = $label[0].id.match (/qwiz([^-]+)/)[1];
   if (label_clicked_b) {
      if (debug[8]) {
         console.log ('[label_dragstart] $label_clicked[i_qwiz].html():', $label_clicked[i_qwiz].html());
      }
   } else {

      // Drag -- remove highlight, reset message, turn off click.
      if ($label_clicked[i_qwiz]) {
         $label_clicked[i_qwiz].find ('.qwizzled_highlight_label').removeClass ('label_click_highlight');
         var $td_qwizzled_labels = $label.parents ('td.qwizzled_labels');
         $td_qwizzled_labels.find ('.qwizzled_label_head').hide ();
         $td_qwizzled_labels.find ('.qwizzled_label_head_standard').show ();
         $label_clicked[i_qwiz] = '';
      }
      $prev_label_clicked[i_qwiz] = 0;
   }

   // Reset things only if flag is set indicating a label was incorrectly
   // placed.
   if (try_again_obj && $prev_label_clicked[i_qwiz] !== $label_clicked[i_qwiz]) {
      var local_try_again_obj = try_again_obj;
      try_again_obj = '';

      if (debug[8]) {
         console.log ('[label_dragstart] $label.html():', $label.html());
         console.log ('[label_dragstart] local_try_again_obj:', local_try_again_obj);
         console.log ('[label_dragstart] local_try_again_obj.$label.attr (\'id\'):', local_try_again_obj.$label.attr ('id'));
      }

      // Reset background of incorrectly-placed label.
      local_try_again_obj.$label.find ('.qwizzled_highlight_label').css ({background: ''});
      local_try_again_obj.$label.find ('.qwizzled_highlight_label img').css ({outline: ''});

      // If dragging a label other than the one that was incorrectly placed,
      // move the incorrectly-placed label back to list.
      if (local_try_again_obj.$label.attr ('id') != $label.attr ('id')) {
         local_try_again_obj.$label.animate ({left: '0px', top: '0px'}, {duration: 750});
      }

      // Reset feedback.
      local_try_again_obj.$feedback.hide ();

      // Make target droppable again.
      local_try_again_obj.$target.droppable ('option', 'disabled', false);
   }
   $prev_label_clicked[i_qwiz] = '';
}


// -----------------------------------------------------------------------------
this.label_dropped = function ($target, $label) {

   if (debug[8]) {
      console.log ('[label_dropped]: $target:', $target, ', $label:', $label);
   }
   if ($label) {

      // Drop triggers click -- flag to ignore.
      ignore_label_click_b = true;

      // If qwizard, and tooltip exists, re-enable.
      /* DKTMP DEDRAG
      if (q.qwizard_b) {
         $qwizzled_highlight_label = $label.children ();
         if ($qwizzled_highlight_label.tooltip ('instance')) {
            if (debug[8]) {
               console.log ('[label_dropped] $qwizzled_highlight_label:', $qwizzled_highlight_label);
            }
            $qwizzled_highlight_label.tooltip ('enable');
         }
      }
      */

   } else {

      // No label -- must have been click rather than drop.  See if a label
      // was clicked.
      var $qwizq = $target.parents ('div.qwizq');
      var i_qwiz = $qwizq[0].id.match (/qwiz([^-]+)/)[1];
      if ($label_clicked[i_qwiz]) {

         // Yes - use that label.  Reset message.
         if (debug[8]) {
            console.log ('[label_dropped]: $label_clicked[i_qwiz]:', $label_clicked[i_qwiz]);
         }
         $label = $label_clicked[i_qwiz];
         var $td_qwizzled_labels = $label.parents ('td.qwizzled_labels');
         $td_qwizzled_labels.find ('.qwizzled_label_head').hide ();
         var standard_mobile = document_qwiz_mobile ? 'mobile' : 'standard';
         $td_qwizzled_labels.find ('.qwizzled_label_head_' + standard_mobile).show ();
      } else {

         // Target click, but no label click.  Ignore.
         return false;
      }
   }

   // Remove highlighting if there.
   $label.find ('.qwizzled_highlight_label').removeClass ('label_click_highlight');

   // Is this the right target?  Get the association id from the label class.
   // If no matching class, use data () (backwards compatibility).
   var classes = $label.attr ('class');
   var m = classes.match (/qtarget_assoc([0-9]+)/);
   var assoc_id;
   if (m) {
      assoc_id = m[1];
   } else {
      assoc_id = $label.data ('label_target_id');
   }
   if (debug[8]) {
      console.log ('[label_dropped] $target:', $target, ', assoc_id:', assoc_id);
   }

   // Get label id (so know which feedback to show).  Looks like
   // label-qwiz0-q0-a0.  Feedback id looks like qwiz0-q0-a0x.
   var label_id = $label.attr ('id');
   var feedback_selector = '#' + label_id.substr (6);
   var fields = feedback_selector.split ('-');
   var question_selector = fields[0] + '-' + fields[1];
   var i_qwiz = fields[0].substr (5);
   var i_question = fields[1].substr (1);
   if (debug[8]) {
      console.log ('[label_dropped] question_selector:', question_selector);
   }

   // If reporting usage, and haven't done so already for this quiz, increment
   // counter.
   if (post_id != 0 && ! qwizdata[i_qwiz].usage_incremented_b) {
      qqc.increment_usage ('quiz', i_qwiz, post_id);
      qwizdata[i_qwiz].usage_incremented_b = true;
   }

   // If recording and this is first interaction (no-intro, single-question
   // quiz) record as start time.
   if (qwizdata[i_qwiz].record_start_b && document_qwiz_user_logged_in_b) {
      qwizdata[i_qwiz].record_start_b = false;
      var data = {qrecord_id_ok: qwizdata[i_qwiz].qrecord_id_ok, type: 'start'};
      qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'record_response', data);
   }

   // If no separate intro page, and this is first question, hide qwiz icon.
   if (i_question == 0 && (q.no_intro_b[i_qwiz]
                                     || qwizdata[i_qwiz].n_questions == 1)) {
      $ ('div.qwiz div#icon_qwiz' + i_qwiz).hide ();
   }

   // Increment number of tries.
   qwizdata[i_qwiz].n_label_attempts++;
   // Hide previous feedback, if any.
   $ ('[id^=qwiz' + i_qwiz + '-q' + i_question + '-a]').hide ();

   var qwizq_id = '#qwiz' + i_qwiz + '-q' + i_question;
   var correct_b = false;

   // If recording, and haven't gotten text yet, collect image source and
   // label texts.
   if (qwizdata[i_qwiz].qrecord_id && document_qwiz_user_logged_in_b) {
      if (! qwizdata[i_qwiz].q_and_a_text[i_question]) {
         var img_src = $ (qwizq_id + ' div.qwizzled_image img').attr ('src');
         var q_and_a_text;
         if (img_src) {
            q_and_a_text = img_src;
         }
         $ (qwizq_id + ' div.qwizzled_label').each (function () {
                                                       var label_text = $ (this).html ();
                                                       if (label_text) {
                                                          q_and_a_text += '\t' + label_text;
                                                       }
                                                    });
         q_and_a_text = qqc.remove_tags_eols (q_and_a_text);
         qwizdata[i_qwiz].q_and_a_text[i_question] = q_and_a_text;
      }
   }

   // Label correctly placed?  That is, does the target have this id as a class?
   // (Note: not using id= because WordPress eats ids).
   var finished_diagram_b = false;
   if ($target.hasClass ('qwizzled_target-' + assoc_id)) {
      if (debug[8]) {
         console.log ('[label_dropped] feedback_selector:', feedback_selector + 'c');
         console.log ('[label_dropped] qwizdata[i_qwiz].n_questions:', qwizdata[i_qwiz].n_questions);
      }

      // Yes.  Show positive feedback for this label.
      $ (feedback_selector + 'c').show ();

      place_label ($target, $label);

      // Increment number of labels correctly placed.  See if done with
      // diagram.
      qwizdata[i_qwiz].n_labels_correct++;
      if (qwizdata[i_qwiz].n_labels_correct == qwizdata[i_qwiz].n_label_targets) {

         // Done with labeled diagram.  Show summary.
         finished_diagram_b = true;
         var n_tries = qwizdata[i_qwiz].n_label_attempts;
         var n_label_targets = qwizdata[i_qwiz].n_label_targets;
         correct_b = n_tries == n_label_targets;
         var qwizzled_summary;
         if (correct_b) {
            qwizzled_summary = 'You placed all of the items correctly on the first try!';
         } else {
            qwizzled_summary = Tplural ('It took you one try', 'It took you %s tries', n_tries) + ' ' + Tplural ('to place this label correctly', 'to place these labels correctly', n_label_targets) + '.';
            qwizzled_summary = qwizzled_summary.replace ('%s', qqc.number_to_word (n_tries));
         }
         $ (qwizq_id + '-ff').html (qwizzled_summary).show ();
         if (qwizdata[i_qwiz].n_questions > 1 || qwizdata[i_qwiz].use_dataset) {

            // Consider correct only if all labels properly placed on first
            // try.  Don't do if qwizard.
            if (! q.qwizard_b) {
               qwizdata[i_qwiz].answered_correctly[i_question] = correct_b;
               if (correct_b) {
                  qwizdata[i_qwiz].n_correct++;
               } else {

                  // Record number of incorrect responses.
                  qwizdata[i_qwiz].n_incorrect++;
               }
               update_topic_statistics (i_qwiz, i_question, correct_b);
            }

            // Show next-button.
            update_progress_show_next (i_qwiz);
         } else {
            $ (qwizq_id + ' td.qwizzled_feedback').append (qwizdata[i_qwiz].finished_diagram_div);

            // Update progress bar.
            display_qwizzled_progress (i_qwiz);
         }
      } else {

         // Was this the first try for this target?  If so, record that was
         // correctly-placed on first try.  (Last-filled target doesn't count,
         // since it's the only choice left!)
         var target_id = $target.attr ('id');
         if (typeof (qwizdata[i_qwiz].correct_on_try1[i_question]) == 'undefined') {
            qwizdata[i_qwiz].correct_on_try1[i_question] = {};
         }
         if (! qwizdata[i_qwiz].correct_on_try1[i_question][target_id]) {
            qwizdata[i_qwiz].correct_on_try1[i_question][target_id] = 1;
         }

         // Update progress bar.
         display_qwizzled_progress (i_qwiz);
      }
   } else {
      if (debug[8]) {
         console.log ('[label_dropped] feedback_selector:', feedback_selector + 'x');
         console.log ('[label_dropped] qwizdata[i_qwiz].n_questions:', qwizdata[i_qwiz].n_questions);
      }

      // Incorrectly placed (or incorrect target clicked -- if so, place label
      // on clicked target).
      if ($label_clicked[i_qwiz]) {

         // Offset gives coords relative to document.
         var target_offset = $target.offset ();
         var target_x = target_offset.left;
         var target_y = target_offset.top;

         // Get original position of label.
         var label_x = $label_clicked[i_qwiz].data ('label_x')
         var label_y = $label_clicked[i_qwiz].data ('label_y')
         if (debug[8]) {
            console.log ('[label_dropped] target_x:', target_x, ', target_y:', target_y);
            console.log ('[label_dropped] label_x:', label_x, ', label_y:', label_y);
         }

         $label.css ({left: (target_x - label_x) + 'px',
                      top:  (target_y - label_y) + 'px'});

         // Reset for next click.
         $label_clicked[i_qwiz] = '';
      }

      // Set label background red.
      $label.find ('.qwizzled_highlight_label').css ({background: '#FF8080'});
      $label.find ('.qwizzled_highlight_label img').css ({outline: '2px solid #FF8080'});

      // Show feedback.
      var $feedback = $ (feedback_selector + 'x');
      $feedback.show ();

      // Set indicator to reset things if drag or click another label; record
      // which label dropped, etc.
      try_again_obj = { $label: $label, $feedback:  $feedback, $target: $target};

      // Make target no longer droppable -- starting drag while over the
      // target seems to count as a "drop".  Will re-enable droppability in
      // label_dragstart ().
      $target.droppable ('option', 'disabled', true);

      // Record that label was not correctly placed on first try.
      var target_id = $target.attr ('id');
      if (typeof (qwizdata[i_qwiz].correct_on_try1[i_question]) == 'undefined') {
         qwizdata[i_qwiz].correct_on_try1[i_question] = {};
      }
      qwizdata[i_qwiz].correct_on_try1[i_question][target_id] = -1;
   }

   // If recording, record all label placements -- correct and incorrect.
   // Want to record: label, dropped-in-target-for-label.
   if (qwizdata[i_qwiz].qrecord_id && document_qwiz_user_logged_in_b) {
      var label = $label.find ('span.qwizzled_highlight_label').html ();
      label = qqc.remove_tags_eols (label);

      var classes = $target.attr ('class')
      var target_assoc_id = classes.match (/qwizzled_target-([0-9]*)/)[1];
      var target_label = $ (qwizq_id).find ('div.qtarget_assoc' + target_assoc_id).find ('span.qwizzled_highlight_label').html ();

      // Or older style...
      if (! target_label) {
         target_label = $ (qwizq_id).find ('div.qwizzled_label[data-label_target_id="' + target_assoc_id + '"]').find ('span.qwizzled_highlight_label').html ();
      }

      target_label = qqc.remove_tags_eols (target_label);
      var data = {q_and_a_text: qwizdata[i_qwiz].q_and_a_text[i_question],
                  i_question:   qwizdata[i_qwiz].dataset_id[i_question],
                  unit:         qwizdata[i_qwiz].unit[i_question],
                  type:         'labeled_diagram',
                  response:     label + '\t' + target_label,
                  correct_b:    ''};
      qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'record_response', data);

      // Also, if finished diagram, record that as separate entry.
      if (finished_diagram_b) {
         var data = {q_and_a_text: qwizdata[i_qwiz].q_and_a_text[i_question],
                     i_question:   qwizdata[i_qwiz].dataset_id[i_question], 
                     unit:         qwizdata[i_qwiz].unit[i_question], 
                     type:         'labeled_diagram',
                     response:     'done',
                     correct_b:    correct_b ? 1 : ''};
         qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'record_response', data);
      }
   }
}


// -----------------------------------------------------------------------------
function place_labels (i_qwiz, i_question, qwizq_id) {
   if (debug[0]) {
      console.log ('[place_labels] i_qwiz:', i_qwiz, ', i_question:', i_question, ', qwizq_id:, ', qwizq_id);
   }

   // On this time around, put in place those labels that were correctly
   // placed on a target on the first try in the previous go-around.
   for (var target_id in qwizdata[i_qwiz].correct_on_try1[i_question]) {
      if (qwizdata[i_qwiz].correct_on_try1[i_question][target_id] == 1) {
         var $target = $ ('div#' + qwizq_id + ' div#' + target_id);
         if ($target.length == 0) {
            $target = $ ('div#' + qwizq_id + ' span#' + target_id).first ();
         }

         // Get associated label.
         var classes = $target.attr ('class');
         var m = classes.match (/qwizzled_target-([0-9]+)/);
         var assoc_id;
         if (m) {
            assoc_id = m[1];
         }
         if (debug[8]) {
            console.log ('[place_labels] $target:', $target, ', assoc_id:', assoc_id);
         }
         var $label = $ ('td.qwizzled_labels div.qtarget_assoc' + assoc_id);

         // Or older style...
         if (! $label.length) {
            $label = $ ('div#' + qwizq_id).find ('td.qwizzled_labels div.qwizzled_label[data-label_target_id="' + assoc_id + '"]');
         }

         place_label ($target, $label);

         // And record "placed".
         qwizdata[i_qwiz].n_labels_correct++;
         qwizdata[i_qwiz].n_label_attempts++;
      } else {

         // New chance at correct-on-first-try for others.
         qwizdata[i_qwiz].correct_on_try1[i_question][target_id] = 0;
      }
   }

   // Update progress.
   display_qwizzled_progress (i_qwiz);
}


// -----------------------------------------------------------------------------
function place_label ($target, $label) {

   // Do-it-myself snap to target.  Make copy of label into child of the
   // target.  Clone false arg says do not copy events (namely, dragging
   // effect).
   var $label_copy = $label.clone (false);
   if (q.qwizard_b) {

      // Remove editor from placed copy; get rid of id (which is editor-
      // specific).  Add class to indicate needs update of content if
      // original label changed.
      $editable = $label_copy.find ('.qwiz_editable');
      $editable.removeAttr ('id')
               .removeAttr ('contenteditable')
               .removeClass ('qwiz_editable')
               .addClass ('qwizzled_label_placed');
      if (debug[12]) {
         console.log ('[place_label] $editable:', $editable);
      }
   }
   $label_copy.appendTo ($target);
   $label_copy.css ({position: 'absolute', left: '4px', top: '50%', height: 'auto', width: '100%', transform: 'translateY(-50%)'});
   $label_copy.removeClass ('qwizzled_label_unplaced');
   $label_copy.find ('.qwizzled_highlight_label').css ('cursor', 'default');

   // Move original label back to original position.
   $label.css ({left: '0px', top: '0px'});

   // See if multiple targets for this label.
   var multiple_targets_b = false;
   var classes = $label.attr ('class');
   m = classes.match (/qwizzled_n_targets([0-9]*)/);
   if (m) {
      multiple_targets_b = true;

      // Either decrement targets remaining, or, if only one left, remove
      // class.
      var current_n_targets = m[0];
      var n_targets = parseInt (m[1], 10);
      if (n_targets == 2) {

         // Will be only one left.  Can treat as "normal".  Remove class.
         $label.removeClass (current_n_targets);
      } else {

         // Decrement.  Set flag, remove existing class, add decremented
         // class.
         var new_class = 'qwizzled_n_targets' + (--n_targets);
         $label.removeClass (current_n_targets).addClass (new_class);
      }
   }

   // If not multiple targets, disable drag of original label, and remove
   // class to signal no re-enable.  Also remove cursor css.
   // Gray-out (apply to children, too, in case need to overcome default),
   // move to original position.
   if (! q.qwizard_b && ! multiple_targets_b) {
      if (debug[8]) {
         console.log ('[place_label] (draggable disable) $label[0]:', $label[0]);
      }
      $label.css ({color: 'lightgray', left: '0px', top: '0px'});
      $label.find ('*').css ({color: 'lightgray'});
      $label.find ('.qwizzled_highlight_label').css ('cursor', 'default');
      $label.removeClass ('qwizzled_label_unplaced');

      // This if-error-do-nothing "try" shouldn't be necessary, but won't hurt.
      if (! q.qwizard_b) {
         try {
            $label.draggable ('disable');
         } catch (e) {}
      }
   }

   // This target no longer droppable.  If div, just this.  If span (text
   // target, possibly with multiple spans) find relevant siblings.
   if (! q.qwizard_b) {
      if ($target[0].tagName.toLowerCase () == 'div') {
         $target.droppable ('option', 'disabled', true);
      } else {
         var classes = $target.attr ('class');
         var m = classes.match (/qtarget_sib-[0-9]+/);
         if (m) {
            $ ('span.' + m[0]).droppable ('option', 'disabled', true);
         } else {

            // Backwards compatibility -- assume they're in a wrapper span.
            $target.siblings ('span').andSelf ().droppable ('option', 'disabled', true);
         }
      }
   }
}


// -----------------------------------------------------------------------------
this.process_qwiz_pair = function (htm, i_qwiz, existing_quiz_f) {
   if (existing_quiz_f) {

      // Called from qwizard.js to process/parse quiz shortcodes.
      qw = qwizard;
      n_qwizzes = 1;
      set_qwizard_data_b = true;
      q.qwizard_b = true;
      q.no_intro_b = [];
   }

   // Data object for this qwiz.
   qwizdata[i_qwiz] = {};
   qwizdata[i_qwiz].answered_correctly = [];
   qwizdata[i_qwiz].n_correct   = 0;
   qwizdata[i_qwiz].n_incorrect = 0;
   qwizdata[i_qwiz].i_question  = -1;
   qwizdata[i_qwiz].initial_width = 500;
   qwizdata[i_qwiz].use_dataset = '';
   qwizdata[i_qwiz].dataset_id = {};
   qwizdata[i_qwiz].use_dataset_question_ids = {};
   qwizdata[i_qwiz].align = '';
   qwizdata[i_qwiz].qrecord_id = '';
   qwizdata[i_qwiz].qrecord_id_ok = 'check credit';
   qwizdata[i_qwiz].information_question_b = {};
   qwizdata[i_qwiz].unit = [];

   var m = htm.match (/\[qwiz([^\]]*)\]/m);
   var qwiz_tag   = m[0];
   var attributes = m[1];
   qwiz_tag   = qqc.replace_smart_quotes (qwiz_tag);
   attributes = qqc.replace_smart_quotes (attributes);

   if (debug[0]) {
      console.log ('[process_qwiz_pair] qwiz_tag: ', qwiz_tag);
      console.log ('[process_qwiz_pair] attributes: ', attributes);
   }
   if (set_qwizard_data_b) {
      qw.set_qwizard_data ('qwiz_deck_attributes', attributes);
   }
   var use_dataset_questions_b = false;

   // See if use_dataset quiz.
   var use_dataset = get_attr (qwiz_tag, 'use_dataset');
   if (use_dataset) {
      qwizdata[i_qwiz].use_dataset = use_dataset;

      // See if no dataset intro.
      var dataset_intro_f = get_attr (qwiz_tag, 'dataset_intro') != 'false';
      qwizdata[i_qwiz].dataset_intro_f = dataset_intro_f;

      // See if random question order (default is not).
      qwizdata[i_qwiz].random_b = get_attr (qwiz_tag, 'random') == 'true';

      // See if a display name is given.  First, may include style info.
      // Encode that so can parse out.
      var m = qwiz_tag.match (/\sstyle\s*=\s*"[^"]+"/gm);
      if (m) {
         var len = m.length;
         for (var i=0; i<len; i++) {
            var encoded_style = encodeURIComponent (m[i]);
            qwiz_tag = qwiz_tag.replace (m[i], encoded_style);
         }
      }
      var display_name = get_attr (qwiz_tag, 'display_name');
      if (display_name) {
         qwizdata[i_qwiz].use_dataset_options_display_name = decodeURIComponent (display_name);

         // Delete display_name="..." from qwiz_tag -- so won't contaminate
         // final html created in create_qwiz_divs ().
         var qwiz_tag = qwiz_tag.replace (/\sdisplay_name\s*=\s*"[^"]*?"/, '');
      }

      // Restore any remaining style info to plain HTML.
      qwiz_tag = decodeURIComponent (qwiz_tag);
   }

   // Alignment.  Default = left.  If center or right, set.
   var align = get_attr (attributes, 'align');
   if (align == 'center' || align == 'right') {
      qwizdata[i_qwiz].align = align;
   }

   // If "qrecord_id=..." present, parse out database ID.
   var qrecord_id = get_attr (attributes, 'qrecord_id');
   if (qrecord_id) {

      // Set flag indicating this quiz subject to recording.  (Will get unset
      // by check_registered returned JavaScript if not registered.)
      qwizdata[i_qwiz].qrecord_id = qrecord_id;

      // Set up array to save question text.
      qwizdata[i_qwiz].q_and_a_text = {};

      // If haven't checked already, see if user already logged in (get session
      // ID in cookie, see if still valid).
      if (! q.qrecord_b) {
         q.qrecord_b = true;
         if (typeof (document_qwiz_user_logged_in_b) == 'undefined'
                              || document_qwiz_user_logged_in_b == 'not ready') {
            qqc.check_session_id (i_qwiz);
         }
      }
   }

   // If "unit=..." present, set as default for questions in this quiz.
   var unit = get_attr (attributes, 'unit');
   if (unit) {
      qwizdata[i_qwiz].default_unit = unit.replace (/\s/g, '_');
      if (set_qwizard_data_b) {
         qw.set_qwizard_data ('default_unit', unit);
      }
   } else {
      qwizdata[i_qwiz].default_unit = 'null';
   }

   var new_htm = '';
   var no_intro_i_b = false;

   // Is qwiz encoded?  Decode if necessary.  Turns tag into plain '[qwiz]'.
   //htm = decode_qwiz (htm, qwiz_tag);

   // Capture any initial closing tags after [qwiz ...] -- will put them in
   // front of <div> that replaces [qwiz ...].
   var m = htm.match (/\[qwiz[^\]]*\]((<\/[^>]+>\s*)*)/m, '');
   if (m) {
      var initial_closing_tags = m[1];
      new_htm += initial_closing_tags;
      if (debug[0]) {
         console.log ('[process_qwiz_pair] initial_closing_tags: ', initial_closing_tags);
      }
   }

   // Delete [qwiz], any initial closing tags.
   htm = htm.replace (/\[qwiz[^\]]*\]((<\/[^>]+>\s*)*)/m, '');

   // Take off closing "[/qwiz]".
   var len = htm.length;
   htm = htm.substring (0, len-7);

   // Delete any initial whitespace.
   htm = qqc.trim (htm);

   // See how many questions (needed if re-writing quiz for qwizard.js).
   // Make sure there's at least one question (unless use_dataset or qwizard
   // set up).
   m = htm.match (/\[(q|<code><\/code>q)([^\]]*)\]/gm);
   var n_questions = m ? m.length : 0;
   if (! use_dataset && ! q.qwizard_b && n_questions == 0) {
      errmsgs.push (T ('Did not find question tags ("[q]") for') + ' qwiz ' + (i_qwiz + 1));
      header_html = '';
   } else {

      // Look for [terms]...[/terms] and/or [add_terms]...[/add_terms] pairs.
      // Parse, and delete.  Include opening tags in front and closing tags
      // after.
      htm = qqc.process_inline_textentry_terms (htm, 'terms', qwizdata, i_qwiz);
      errmsgs = errmsgs.concat (qwizdata.additional_errmsgs);
      htm = qqc.process_inline_textentry_terms (htm, 'add_terms', qwizdata, i_qwiz);
      errmsgs = errmsgs.concat (qwizdata.additional_errmsgs);

      // See if html up to first shortcode is just whitespace, including empty
      // paragraphs.  Limit to first 2000 characters.
      var whitespace = qqc.parse_html_block (htm.substr (0, 2000), ['^'], ['[h]', '[i]', '[q]', '[q '], '[<code></code>q', 'return whitespace');
      if (whitespace) {

         // Yes, delete it.
         htm = htm.replace (whitespace, '');
      }

      // See if header.  Sets header_html global variable.
      htm = process_header (htm, i_qwiz, 0, true);
      if (set_qwizard_data_b && header_html != 'NA') {
         qw.set_qwizard_data ('header_text', header_html);
      }

      // See if intro.  Limit search to first 5000 characters.  Include [x] as
      // a "next" tag in case use_dataset (no questions) or qwizard with no
      // questions.
      var intro_html = qqc.parse_html_block (htm.substr (0, 5000), ['[i]'], ['[q]', '[q ', '[<code></code>q', '<div class="qwizzled_question', '[x]']);

      // See if no [i].
      if (intro_html == 'NA') {

         // No [i] -- intro may be text before [q].  See if there is.  Add flag
         // to ignore &nbsp; (empty paragraph).
         intro_html = qqc.parse_html_block (htm.substr (0, 5000), ['^'], ['[q]', '[q ', '[<code></code>q', '<div class="qwizzled_question', '[x]'], true);

         // If just tags and whitespace, then no intro, unless this is a
         // use_dataset= quiz, which always has at least a "Start quiz" button.
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

         // There is an [i].  Error if text before [i].  Exclude <br...> or
         // <img...> or <span class="qwizard_placeholder">
         var htmx = htm.substr (0, 200);
         htmx = qqc.trim (htmx);
         var i_pos = qqc.opening_tag_shortcode_pos ('[i]', htmx);
         htmx = htmx.substr (i_pos, 5);
         var intro_htmlx = intro_html.replace (/<br[^>]*>/g, '');
         intro_htmlx = qqc.trim (intro_htmlx).substr (0, 5);
         if (htmx != intro_htmlx) {
            errmsgs.push (T ('Text before intro') + ' [i] - qwiz ' + (i_qwiz + 1));
         }

         // Delete [i] from intro.
         intro_html = intro_html.replace ('[i]', '');

         // If there's an unmatched </p> or the like near the beginning, add a
         // matching opening tag.
         intro_html = qqc.balance_closing_tag (intro_html);
      }

      // If there's an intro, or an intro may be added interactively via the
      // wizard, create intro div.
      if (! no_intro_i_b || q.qwizard_b) {
         if (debug[0]) {
            console.log ('[process_qwiz_pair] intro_html:', intro_html);
         }
         new_htm += '<div class="intro-qwiz' + i_qwiz + ' qwiz-intro qwiz_editable">'
                  +    qqc.decode_image_tags (intro_html)
                  + '</div>\n';
         if (set_qwizard_data_b && intro_html) {
            qw.set_qwizard_data ('intro_text', intro_html);
         }
      }

      // If there's exit text, capture (with opening tags) for summary div, and
      // delete.
      var exit_html = qqc.parse_html_block (htm, ['[x]'], []);
      if (exit_html != 'NA') {
         exit_html = exit_html.replace (/\[x\]/, '');
         if (set_qwizard_data_b) {
            qw.set_qwizard_data ('exit_text', exit_html);
         }

         // Error if a [q] tag inside exit text.
         if (exit_html.search (/\[q[ \]]|<div class="qwizzled_question/) != -1) {
            errmsgs.push ('[x] ' + T ('(exit text) must be last'));
         } else {

            // Delete exit text from htm.
            var i_pos_exit_opening = qqc. opening_tag_shortcode_pos ('[x]', htm);
            htm = htm.substr (0, i_pos_exit_opening);
         }
      } else {
         exit_html = '';
      }

      // If not using a dataset, may be specific questions from various datasets.
      // If so, save questions html.
      if (! use_dataset) {
         if (htm.search (/use_dataset_question\s*=\s*/) != -1) {
            use_dataset_questions_b = true;
            qwizdata[i_qwiz].use_dataset_questions_htm = htm;
         }
      }

      if (use_dataset || use_dataset_questions_b) {

         // Set up div within which to place questions when downloaded.
         new_htm +=   '<div id="dataset_questions-qwiz' + i_qwiz + '">'
                    + '</div>';
      } else {
         if (n_questions == 0) {

            // Qwizard, initially.  Create placeholder --first question will
            // be added after this.
            qwizdata[i_qwiz].n_questions = 0;
            new_htm += '<div id="qwiz' + i_qwiz + '-q-1" class="qwizq">'
                       + '</div>';
         } else {
            qwizdata[i_qwiz].n_questions = n_questions;
            new_htm = q.process_questions (htm, new_htm, i_qwiz);
         }
      }
   }
   q.no_intro_b.push (no_intro_i_b);

   // First qwiz tag becomes opening div for box around qwiz.  Add additional
   // div elements (progress, login div, summary div, "next" button).
   new_htm = create_qwiz_divs (i_qwiz, qwiz_tag, new_htm, exit_html);

   //if (debug[3]) {
   //   console.log ('[process_qwiz_pair] new_htm: ', new_htm);
   //}

   if (q.qwizard_b) {

      // Called from qwizard.js - return error messages to qwizard (won't
      // always be used).
      qwizard.errmsgs = errmsgs;
   }
   set_qwizard_data_b = false;

   return new_htm;
}


// -----------------------------------------------------------------------------
this.process_questions = function (htm, new_htm, i_qwiz, i_qwizard_question) {

   // i_qwizard_question is set if called from qwizard.js.
   if (typeof (i_qwizard_question) != 'undefined') {
      number_first_question = i_qwizard_question;
   } else {
      number_first_question = 0;
   }

   // May be from use_dataset= retrieval.  Delete qwizcard comments, if any.
   // DKTMP -- may leave empty paragraphs.
   // Leave comments in place if from qwizard.js.
   if (! set_qwizard_data_b) {
      if (/\[!/.test (htm)) {
         htm = htm.replace (/\[!+\][\s\S]*?\[\/!+\]/gm, '');
      }
   }

   // question_html -- everything from first [q] on.
   var question_html = htm.match (/(\[q [^\]]*\]|<div class="qwizzled_question|\[q\])[\s\S]*/m)[0];

   // Find attributes, if any, for each question (topic=, unit=).  First get
   // array of shortcodes.
   var question_shortcodes = question_html.match (/\[(<code><\/code>)*q([^\]]*)\]/gm);
   if (debug[4] || debug[11]) {
      console.log ('[process_questions] question_shortcodes: ', question_shortcodes);
   }

   // Set up list of topic/topics each question.
   n_questions = question_shortcodes.length;
   qwizdata[i_qwiz].question_topics = new Array (n_questions);

   // If wizard, need to know which questions are multiple-choice (because may
   // be in-progress, with only one choice so far).
   if (q.qwizard_b) {
      qwizdata[i_qwiz].qwizard_multiple_choice_b = [];
   }

   // Set up lists of all units and topics.
   qwizdata[i_qwiz].units  = [];
   qwizdata[i_qwiz].topics = [];

   // Capture any opening tags before each "[q...] tag.
   var matches = htm.match (/(<[^\/][^>]*>\s*)*?(\[q[ \]]|\[<code><\/code>q)/gm);
   var q_opening_tags = [];
   var n_q_opening_tags = matches.length;
   for (var i_tag=0; i_tag<n_q_opening_tags; i_tag++) {
      var q_opening_tag = matches[i_tag];
      q_opening_tag = q_opening_tag.replace (/\[q[ \]]|\[<code><\/code>q|<div class="qwizzled_question|<div class="qwizzled_canvas/gm, '');

      // Don't include <img ... /> and <input ... /> tags and anything in front.
      q_opening_tag = q_opening_tag.replace (/[\s\S]*<(img|input)[^>]+>/, '');
      q_opening_tags.push (q_opening_tag);
   }
   if (debug[0] || debug[11]) {
      console.log ('[process_questions] q_opening_tags: ', q_opening_tags);
      console.log ('[process_questions] question_html: ', question_html);
   }

   // Take off initial [q] or [q topic=...] or <div class="qwizzled_question">
   // or <div class="qwizzled_question qwiz_editable">
   // Save flag for which.
   var first_q_qwizzled_b = question_html.substr (0, 2) != '[q';
   if (first_q_qwizzled_b) {
      question_html = question_html.replace (/<div class="qwizzled_question[^>]*>/, '');
   } else {
      var start = question_html.indexOf (']') + 1;
      question_html = question_html.substr (start);
   }

   // Split into individual items.  First split on qwizzled_question divs.
   // Find class="qwizzled_question" and "qwizzled_question qwiz_editable" but not
   // "qwizzled_question_bottom_border_title".
   var qwizzled_pieces = question_html.split (/<div class="qwizzled_question[^_][^>]*>/);
   if (debug[0] || debug[11]) {
      console.log ('[process_questions] qwizzled_pieces.length:', qwizzled_pieces.length);
   }
   var questions_html = [];
   if (qwizzled_pieces.length == 1) {

      // No splits.  Split on [q].
      var q_split = question_html.split (/\[q [^\]]*\]|\[<code><\/code>q [^\]]*\]|\[q\]|\[<code><\/code>q\]/);
      var i_qbeg = 0;
      if (first_q_qwizzled_b) {

         // Put first and second qsplit pieces back together (with the q).
         questions_html.push (q_split[0] + '[q]' + q_split[1]);
         i_qbeg = 2;
      }

      // Regular questions, if any.
      for (var i_q=i_qbeg; i_q<q_split.length; i_q++) {
         questions_html.push (q_split[i_q]);
      }
   } else if (qwizzled_pieces.length > 1) {
      if (first_q_qwizzled_b) {

         // Split each piece on regular [q]s, including old-style (with
         // <code></code>).  Put first and second pieces back together in
         // each case.
         for (var i_qwizzled=0; i_qwizzled<qwizzled_pieces.length; i_qwizzled++) {

            // Note: regular expression /\[(<code><\/code)*q... didn't work --
            // caused extra splits.
            var q_split = qwizzled_pieces[i_qwizzled].split (/\[q [^\]]*\]|\[<code><\/code>q [^\]]*\]|\[q\]|\[<code><\/code>q\]/);
            questions_html.push (q_split[0] + '[q]' + q_split[1]);

            // Additional, if any.
            for (var i_q=2; i_q<q_split.length; i_q++) {
               questions_html.push (q_split[i_q]);
            }
         }
      } else {

         // First piece before a qwizzled question is all regular questions.
         var q_split =  qwizzled_pieces[0].split (/\[q [^\]]*\]|\[q\]/);
         for (var i_q=0; i_q<q_split.length; i_q++) {
            questions_html.push (q_split[i_q]);
         }

         // Split remaining pieces on regular [q]s.  Put first and second
         // pieces back together in each case.
         for (var i_qwizzled=1; i_qwizzled<qwizzled_pieces.length; i_qwizzled++) {
            var q_split = qwizzled_pieces[i_qwizzled].split (/\[q [^\]]*\]|\[<code><\/code>q [^\]]*\]|\[q\]|\[<code><\/code>q\]/);
            questions_html.push (q_split[0] + '[q]' + q_split[1]);

            // Additional, if any.
            for (var i_q=2; i_q<q_split.length; i_q++) {
               questions_html.push (q_split[i_q]);
            }
         }
      }
   }

   if (q.qwizard_b) {
      if (set_qwizard_data_b) {
         qw.set_qwizard_data ('n_questions', n_questions);
      }
   } else {
      qwizdata[i_qwiz].n_questions = n_questions;
   }
   if (debug[0] || debug[11]) {
      console.log ('[process_questions] n_questions:', n_questions);
      console.log ('[process_questions] questions_html:', questions_html.join ('\n================================================\n'));
   }

   // Create a div for each.
   var question_divs = [];
   var question_div;
   var questions_w_topics_b = false;
   for (var ii=0; ii<n_questions; ii++) {
      var i_question = ii + number_first_question;

      // Look at the attributes for this question.
      var question_shortcode;
      if (typeof (i_qwizard_question) != 'undefined') {
         question_shortcode = question_shortcodes[0];
      } else {
         question_shortcode = question_shortcodes[i_question];
      }
      question_topic = process_question_attributes (i_qwiz, i_question, question_shortcode, i_qwizard_question);
      if (question_topic) {
         questions_w_topics_b = true;
      }

      // See if hangman-style entry.
      if (questions_html[ii].indexOf ('[hangman') != -1) {
         question_div = process_hangman (i_qwiz, i_question,
                                         questions_html[ii],
                                         q_opening_tags[ii]);

      // See if free-form entry.
      } else if (questions_html[ii].indexOf ('[textentry') != -1) {
         question_div = process_textentry (i_qwiz, i_question,
                                          questions_html[ii],
                                          q_opening_tags[ii]);

      // See if multiple-choice question.
      } else if (questions_html[ii].search (/\[c\]|\[c\*\]/m) != -1) {

         // Regular multiple-choice question.
         question_div = process_multiple_choice (i_qwiz, i_question,
                                                 questions_html[ii],
                                                 q_opening_tags[ii]);

      } else if (questions_html[ii].search (/<div[^>]+class=".*?qwizzled_label/m) != -1) {

         // Labels.
         qwizzled_b = true;
         qwizdata[i_qwiz].qwizzled_b = true;
         question_div = process_qwizzled (i_qwiz, i_question,
                                          questions_html[ii],
                                          q_opening_tags[ii],
                                          question_shortcodes[ii]);
         if (qwizdata[i_qwiz].correct_on_try1) {
            qwizdata[i_qwiz].correct_on_try1[i_question] = {};
         } else {
            qwizdata[i_qwiz].correct_on_try1 = [];
         }
      } else {

         // "Question" has neither choices or labels.  We'll treat it as an
         // "information-only question".  Set flag to show "Next question"
         // button right away.  Error if no text at all -- check by deleting
         // tags, "&nbsp;", and whitespace.
         var question_html_wo_tags_whitespace = questions_html[ii].replace (/<[^>]+>|&nbsp;|\s/gm, '');
         if (! question_html_wo_tags_whitespace) {
            errmsgs.push (T ('Question is completely blank') + ' - qwiz ' + (i_qwiz + 1) + ', ' + T ('question') + ' ' + (i_question + 1));
         } else {
            qwizdata[i_qwiz].information_question_b[i_question] = true;
         }

         if (set_qwizard_data_b) {
            qw.questions_cards[i_question].type = 'information_only';

            // Include opening tags -- formatting -- with question text, so
            // qwizard will save (and allow changes to) formatting.
            qw.questions_cards[i_question].question_text = q_opening_tags[ii] + questions_html[ii];
         }

         // Wrap in div for this qwiz and question.
         question_div = '<div id="qwiz' + i_qwiz + '-q' + i_question + '" class="qwizq">\n'
                    +      '<div class="qwiz-question qwiz_editable">'
                    +          q_opening_tags[ii] + questions_html[ii]
                    +      '</div>'
                    +   '</div>';
      }
      question_divs.push (question_div);
   }
   new_htm += question_divs.join ('\n');

   if (questions_w_topics_b) {

      // If any topics given, and any questions without topics, set their
      // topic to "Other".  Do so in check_questions_have_topics () -- after
      // we know whether some questions are information-only.
      if (debug[4]) {
         console.log ('[process_questions] topics: ' + qwizdata[i_qwiz].topics.join ('; '));
      }

      // Set up statistics by topic.  Object of objects (list of lists).  Done
      // in check_questions_have_topics ().
   }
   if (set_qwizard_data_b) {
      qw.unit_names = qwizdata[i_qwiz].units;
   }

   // Check that if any questions have topics, all do (except information-
   // only questions).
   if (qwizdata[i_qwiz].topics.length) {
      check_questions_have_topics (i_qwiz);
      if (set_qwizard_data_b) {
         qw.topic_names = qwizdata[i_qwiz].topics;
      }
   }

   if (debug[3] || debug[11]) {
      console.log ('[process_questions] new_htm: ', new_htm);
   }
   if (debug[12]) {
      console.log ('[process_questions] errmsgs: ', errmsgs.join ('\n'));
   }

   return new_htm;
}


// -----------------------------------------------------------------------------
/*
function decode_qwiz (htm, qwiz_tag) {

   // Get html after [qwiz] tag and before [/qwiz] tag.
   htm = htm.substring (qwiz_tag.length, htm.length-7);
   while (true) {

      // See if non-base64 character (blank, for now) in html.
      var cpos = htm.indexOf (' ');
      if (cpos != -1) {
         break;
      } else {
         htm = atob (htm);
      }
   }

   // Add back [qwiz] [/qwiz] tags.
   htm = '[qwiz]' + htm + '[/qwiz]';

   return htm;
}
*/


// -----------------------------------------------------------------------------
// Divs at top of question (qwiz itself, progress), and at bottom "next".
function create_qwiz_divs (i_qwiz, qwiz_tag, htm, exit_html) {

   // Capture any style info or other attributes provided.
   var m = qwiz_tag.match (/\[qwiz([^\]]*)\]/m);
   var attributes = m[1];
   if (debug[0]) {
      console.log ('[create_qwiz_divs] attributes: ', attributes);
   }

   // If non-default width set, set flag.  qrecord_id attribute handled
   // earlier, in process_qwiz_pair ().
   attributes = qqc.replace_smart_quotes (attributes);
   var non_default_width_b = attributes.search (/[\s;"]width/m) != -1;


   // If "repeat_incorrect=..." present, parse out true/false.
   var repeat_incorrect_value = get_attr (attributes, 'repeat_incorrect');
   qwizdata[i_qwiz].repeat_incorrect_b = repeat_incorrect_value != 'false';
   if (debug[0]) {
      console.log ('[create_qwiz_divs] repeat_incorrect_value:', repeat_incorrect_value, ', repeat_incorrect_b:', qwizdata[i_qwiz].repeat_incorrect_b);
   }

   // If "random=..." present, parse out true/false.
   var random = get_attr (attributes, 'random');
   qwizdata[i_qwiz].random_b = random == 'true';
   if (debug[0]) {
      console.log ('[create_qwiz_divs] random:', random, ', random_b:', qwizdata[i_qwiz].random_b);
   }

   // Undisplayed version of qwiz div, so can measure default width if need to.
   // Keep out of flow.  (Don't let margins, padding take up room.)
   var top_html = [];
   if (non_default_width_b) {
      var xattributes = attributes.replace (/(style\s*=\s*"[^"]*)/, '$1; position: absolute;');

      // Correct double ";;" if we've done that.
      xattributes = xattributes.replace (/;\s*;/g, ';');
      top_html.push ('<div id="xqwiz' + i_qwiz + '" class="xqwiz" ' + xattributes + '></div>\n');
   }

   // This qwiz opening div.  If align=, add appropriate margin css to style.
   // Add style= if not there.  Then delete align=... from attributes.
   if (qwizdata[i_qwiz].align) {
      var margin = '';
      if (qwizdata[i_qwiz].align == 'center') {
         margin = 'margin: auto;';
      } else {
         margin = 'margin-left: auto;';
      }
      m = attributes.match (/style\s*=\s*"[^"]*/m);
      if (m) {
         attributes = attributes.replace (/(style\s*=\s*"[^"]*)/m, '$1' + '; ' + margin);

         // Correct double ";;" if we've done that.
         attributes = attributes.replace (/;\s*;/g, ';');
      } else {

         // No style=.  Add.
         attributes += ' style="' + margin + '"';
      }
      attributes = attributes.replace (/align\s*=\s*"[^"]*"/, '');
      if (debug[0]) {
         console.log ('[create_qwiz_divs] attributes: ', attributes);
      }
   }
   top_html.push ('<div id="qwiz' + i_qwiz + '" class="qwiz" ' + attributes + '>');

   // Exit mobile mode panel and slide-in icon.
   top_html.push (   '<div id="overlay-exit-mobile-qwiz' + i_qwiz + '" class="overlay-exit-mobile-qwiz" onclick="' + qname + '.close_panel_exit_mobile(this)">');
   top_html.push (      '<div id="panel-exit-mobile-qwiz' + i_qwiz + '" class="panel-exit-mobile-qwiz">');
   top_html.push (         '<button onclick="' + qname + '.exit_mobile (' + i_qwiz + ')">');
   top_html.push (            'Back to page view');
   top_html.push (         '</button>');
   top_html.push (         '<br />');
   top_html.push (         '<span>');
   top_html.push (            '(To return to this full-screen view, tap ');
   top_html.push (            '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAk0lEQVR4nI3QMQ6EIBAF0BG2YLiGtjRcgt7EcBfDhShtbLwBHIgCJrPFbrGJqPvrl/k/MzAzPOUFAMYYRCSiaZpijGckAAARSynM3BVf1FpTSkkpQwiXaBzHnLNzbtu2Lhr+GS4exSUyxqzrCgDLssDnBefM87zv+3EcRHS3yVpba0XElFK/znsvhNBal1LuLv3mDbu1OYLB67+mAAAAAElFTkSuQmCC" />');
   top_html.push (            ')');
   top_html.push (         '</span>');
   top_html.push (         '<div class="panel-icon-exit-mobile-qwiz"></div>');
   top_html.push (      '</div>');
   top_html.push (   '</div>');
   top_html.push (   '<div id="icon-exit-mobile-qwiz' + i_qwiz + '" class="icon-exit-mobile-qwiz" onclick="' + qname + '.open_panel_exit_mobile (' + i_qwiz + ')"></div>');


   // Header div.  If no header, hide.
   var style = '';
   if (header_html == '' || header_html == 'NA' || header_html.indexOf ('Enter header text') != -1) {
      style = ' style="display: none;"';
   }
   top_html.push ('<div class="header-qwiz' + i_qwiz + ' qwiz-header qwiz_editable"' + style + '>');
   top_html.push (    header_html);
   top_html.push ('</div>');
   top_html = top_html.join ('\n');

   // ..........................................................................
   // Mode and progress divs.  (Set up in any case, in case single-question
   // qwiz consisting of a labeled diagram.)
   var learn_mode_title = T ('Learn mode: questions repeat until answered correctly.');
   var test_mode_title  = T ('Test mode: incorrectly-answered questions do not repeat.');
   var mode;
   var title;
   if (qwizdata[i_qwiz].repeat_incorrect_b) {
      mode = T ('Learn');
      title = learn_mode_title + ' ' + test_mode_title;
   } else {
      mode = T ('Test');
      title = test_mode_title + ' ' + learn_mode_title;
   }
   var progress_div_html = [];
   progress_div_html.push ('<div class="qwiz-progress-container">');

   // "Go-mobile" icon.  First, large clickable target positioned absolutely,
   // centered on go-mobile icon.
   progress_div_html.push (   '<div class="go-mobile-qwiz go-mobile-qwiz' + i_qwiz + '" onclick="' + qname + '.go_mobile (' + i_qwiz + ')" title="Full-screen view">');
   progress_div_html.push (   '</div>');

   // Image is in the regular flow (float left, though).
   progress_div_html.push (   '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAk0lEQVR4nI3QMQ6EIBAF0BG2YLiGtjRcgt7EcBfDhShtbLwBHIgCJrPFbrGJqPvrl/k/MzAzPOUFAMYYRCSiaZpijGckAAARSynM3BVf1FpTSkkpQwiXaBzHnLNzbtu2Lhr+GS4exSUyxqzrCgDLssDnBefM87zv+3EcRHS3yVpba0XElFK/znsvhNBal1LuLv3mDbu1OYLB67+mAAAAAElFTkSuQmCC" class="go-mobile-qwiz go-mobile-qwiz' + i_qwiz + '" />');

   // "Exit-mobile" icon and image, too.
   progress_div_html.push (   '<div class="exit-mobile-qwiz exit-mobile-qwiz' + i_qwiz + '" onclick="' + qname + '.exit_mobile (' + i_qwiz + ')" title="Exit full-screen view">');
   progress_div_html.push (   '</div>');
   progress_div_html.push (   '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACFQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbdFIwQAAAAp0Uk5TAA8fLz9Pf5/P76Y8vMQAAABISURBVAjXY6gQYGBgbGfoanJg1VjBILEqgW1VIwMTiFJgYElzYEkLYEAFzCBBAwbGWQlsKwUYJFYmsM1qZOhqdGCWWMEAMQwA1XERIiyHr7wAAAAASUVORK5CYII=" class="exit-mobile-qwiz exit-mobile-qwiz' + i_qwiz + '" />');

   progress_div_html.push (   '<div id="mode-qwiz' + i_qwiz + '" class="qwiz-mode" title="' + title + '">');
   progress_div_html.push (      'Mode: ' + mode);
   progress_div_html.push (   '</div>');

   if (qwizdata[i_qwiz].qrecord_id) {

      // Set up pull-down arrow for user menu login/logout, etc.  Right end of
      // progress bar.  Add class if this quiz doesn't have an intro/start
      // button or is single-question quiz.
      var addclass = '';
      if (q.no_intro_b[i_qwiz] || qwizdata[i_qwiz].n_questions == 1) {
         addclass = ' qwiz-usermenu_icon_no_intro';
      }
      progress_div_html.push ('<div id="usermenu_icon-qwiz' + i_qwiz + '" class="qwiz-usermenu_icon' + addclass + '" onmouseover="' + qname + '.show_usermenu (' + i_qwiz + ')" onclick="' + qname + '.show_usermenu (' + i_qwiz + ')">');
      progress_div_html.push (   '&#x25bc;');
      progress_div_html.push ('</div>');

      // Add user menu div.  Don't populate until after start/login.
      progress_div_html.push ('<div id="usermenu-qwiz' + i_qwiz + '" class="qq-usermenu qwiz-usermenu">');
      progress_div_html.push ('</div>');
   }

   // Div for progress numbers.
   progress_div_html.push (   '<div id="progress-qwiz' + i_qwiz + '" class="qwiz-progress">');
   progress_div_html.push (   '</div>');

   // Close container.
   progress_div_html.push (   '<div style="clear: both;"></div>');
   progress_div_html.push ('</div>\n');

   progress_div_html = progress_div_html.join ('\n');

   // ..........................................................................
   // Login div, if quiz may be recorded, or if use_dataset.
   var login_div = '';
   if (qwizdata[i_qwiz].qrecord_id || qwizdata[i_qwiz].use_dataset) {
      login_div =  '<div id="qwiz_login-qwiz' + i_qwiz + '" class="qwiz-login">\n'
                 + '</div>';
   }


   // ..........................................................................
   var bottom_html = '';
   qwizdata[i_qwiz].finished_diagram_div
                         =  '<div id="finished_diagram-qwiz' + i_qwiz + '">\n'
                          +    exit_html
                          + '</div>\n';
   if (   qwizdata[i_qwiz].n_questions > 1 
       || qwizdata[i_qwiz].use_dataset
       || qwizdata[i_qwiz].use_dataset_questions_htm || q.qwizard_b) {

      // Summary div.  If exit text, replace "[restart]", if there, with restart
      // button html plus (initially-non-displayed) "exit-mobile-mode" button.
      // If no exit text, just add non-displayed "exit-mobile-mode" button.
      // If use_dataset= quiz, add [restart] if not there.
      if (qwizdata[i_qwiz].use_dataset) {
         if (exit_html.indexOf ('[restart]') == -1) {
            exit_html += '<br />[restart]';
         }
      }
      if (exit_html) {
         exit_html = create_restart_button (i_qwiz, exit_html);
      }
      bottom_html +=   '<div id="summary-qwiz' + i_qwiz + '" class="qwiz-summary">\n'
                     +    '<div id="summary_report-qwiz' + i_qwiz + '">'
                     +    '</div>\n'
                     +    '<div id="qwiz_exit-qwiz' + i_qwiz + '" class="qwiz-exit qwiz_editable">'
                     +        exit_html
                     +    '</div>\n'

                     // Initially-non-displayed "exit-mobile-mode" button.
                     +    '<button class="summary_exit_mobile_qwiz" onclick="' + qname + '.exit_mobile (' + i_qwiz + ')">\n'
                     +       'Return to page view'
                     +    '</button>\n'
                     + '</div>\n';
   } else {

      // Single-question quiz.  If labeled diagram, save exit text for feedback
      // area.  If not labeled diagram, don't take any space with progress bar.
      if (qwizdata[i_qwiz].qwizzled_b) {
         if (exit_html) {
            exit_html = create_restart_button (i_qwiz, exit_html);
         }
      } else if (! qwizdata[i_qwiz].qrecord_id && ! qqc.is_mobile () && ! q.qwizard_b) {

         // Discard progress div if quiz won't be recorded (which requires menu
         // icon) and not mobile device (which requires "expand-to-mobile" icon).
         progress_div_html = '';
      }
   }

   // "Next" button.  Begins as "Start quiz" button.  If quiz may be recorded,
   // and user not logged in, go to login rather than first question (if hasn't
   // declined).
   bottom_html +=  '<div class="next_button" id="next_button-qwiz' + i_qwiz + '">\n'
                 + '   <button class="qbutton" onclick="' + qname + '.next_question (' + i_qwiz + ')">'
                 +        '<span id="next_button_text-qwiz' + i_qwiz + '">'
                 +           T ('Start quiz')
                 +        '</span>'
                 +    '</button>\n'
                 + '</div>\n';


   style = '';
   if (qqc.get_qwiz_param ('beta')) {
      style = 'style = "background: red;"';
   }
   bottom_html += '<div class="icon_qwiz" id="icon_qwiz' + i_qwiz + '" ' + style + '>';
   var icon_qwiz = qqc.get_qwiz_param ('icon_qwiz');
   if (icon_qwiz != 'Not displayed') {
      var title = 'Want to use this quiz in your own class?';
      if (icon_qwiz != 'Icon only') {

         // If qrecord_id, sharing, href will be reset by jjax call to
         // check_registered.php.
         var share_loc = qqc.get_qwiz_param ('server_loc', 'http://qwizcards.com/admin').replace ('admin', 'share');
         bottom_html += '<a href="' + share_loc + '" style="box-shadow: none;" target="_blank">';
      } else {
         title += '  See qwizcards.com/share';
      }
      bottom_html += '<img class="icon_qwiz" style="border: none;" title="' + title + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAIAAAALACogAAAABnRSTlMA/wD/AP83WBt9AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABP0lEQVR4nGP8//8/AymAiSTV5GhgwSZ4rcRrxRooW3futlBnJDlGND/cXzXVccFLVP0oepiwqtZJyH2wrenBtogQBgYGhsv9q15j9cO1qTDVW8JEGRgYGBi0PJ0YGBgYrjzCpuH+qv1rGBgYGHQLoaoZGBgYlOTEGRgYGB68uY+h4fXuQy8ZGBgYnLSRvXjv0UsGBgYGBRFFdA1Prm+6x8DAwBBio4XsyO37GBgYGHTkEHaixYO4mszrWTl1CjmH7iMcKe5nhdAAi4cnL6/A3HbrHgMDw56pJ0QYIOHr5JgmgzASZoOFdggDAwPDy03HRCEhs6YJEne6c0uQHYkUcXt76pL3oTqQQbxqVjay8Sh+cC5pmuuEpkFMWQZNBCNpwMDrWTmT2+5hCCu54EqtomkVLjqYwgoiuGzACWifgQDhK2rq5bcX2gAAAABJRU5ErkJggg==" />';
      if (icon_qwiz != 'Icon only') {
         bottom_html += '</a>';
      }
   }
   bottom_html += '</div>';


   // Add opening and closing html.
   htm = top_html + progress_div_html + login_div
         + htm + bottom_html
         + '</div>\n';  // This qwiz closing div.

   return htm;
}


// -----------------------------------------------------------------------------
function get_login_html (i_qwiz, add_team_member_f, cancel_f) {

   add_team_member_f = add_team_member_f ? 1 : 0;
   var onfocus = 'onfocus="jQuery (\'#qwiz_login-qwiz' + i_qwiz + ' p.login_error\').hide ()"';

   var login_div_html = '';
   login_div_html +=
      '<p>';
   if (add_team_member_f) {
      login_div_html +=
         '<strong>' + T ('Add team member') + '</strong>';
   } else {
      login_div_html +=
         '<strong>' + T ('Record score/credit?') + '</strong>';
   }
   login_div_html +=
      '</p>\n'
     +   '<table border="0" align="center" width="100%">'
     +      '<tr>'
     +         '<td>'
     +            '<label for="qwiz_username-qwiz' + i_qwiz + '">'+ T ('User name') + '</label>'
     +         '</td>'
     +         '<td>'
     +            '<input type="text" id="qwiz_username-qwiz' + i_qwiz + '" ' + onfocus + ' />'
     +         '</td>'
     +      '</tr>'
     +      '<tr>'
     +         '<td>'
     +            '<label for="qwiz_password-qwiz' + i_qwiz + '">'+ T ('Password') + '</label>'
     +         '</td>'
     +         '<td>'
     +            '<input type="password" id="qwiz_password-qwiz' + i_qwiz + '" ' + onfocus + ' />'
     +         '</td>'
     +      '</tr>'
     +      '<tr>'
     +         '<td style="text-align: right;">'
     +            '<span class="qwiz-remember" title="' + T ('Save preference (do not use on shared computer)') + '"><label><span><input type="checkbox" /></span>&nbsp;' + T ('Remember') + '</label></span>'
     +         '</td>'
     +         '<td>'
     +            '<button class="qbutton login_button" onclick="' + qname + '.login (' + i_qwiz + ',' + add_team_member_f + ')">'
     +               T ('Login')
     +            '</button>'
     +            '&ensp;'
     +            '<button class="qbutton" onclick="' + qname + '.no_login (' + i_qwiz + ',' + add_team_member_f + ')">';
   if (add_team_member_f || cancel_f) {
      login_div_html +=
                     T ('Cancel');
   } else {
      login_div_html +=
                    T ('No thanks');
   }
   login_div_html +=
                 '</button>'
     +         '</td>'
     +      '</tr>';
             
   if (! add_team_member_f) {
      login_div_html +=
            '<tr>'
     +         '<td>'
     +         '</td>'
     +         '<td>'
     +            '<span class="qwiz-register-forgot">'
     +               '<a href="' + qqc.get_qwiz_param ('secure_server_loc', 'https://host359.hostmonster.com/~whereisq/qwiz/admin') + '/new_ind_student_account" target="_blank" title="Create an account to track what you\'ve accomplished\nwith quizzes and flashcards">'
     +                  T ('Register') + '</a>'
     +               '&ensp; '
     +               '<a href="' + qqc.get_qwiz_param ('server_loc', 'http://qwizcards.com/admin') + '/password_reset_request" target="_blank">'
     +                  T ('Forgot password?') + '</a>'
     +            '</span>'
     +         '</td>'
     +      '</tr>'
   }
   login_div_html +=
         '</table>\n'
     +   '<p class="login_error">'
     +      T ('Login incorrect. Please try again')
     +   '</p>\n';

   return login_div_html;
}


// -----------------------------------------------------------------------------
function create_restart_button (i_qwiz, exit_html) {
   var label;
   if (qwizdata[i_qwiz].use_dataset && qwizdata[i_qwiz].dataset_intro_f) {
      label = T ('Practice more questions');
   } else {
      label = T ('Take the quiz again');
   }
   var restart_button_html =
                       '<button class="qbutton qwiz_restart" onclick="' + qname + '.restart_quiz (' + i_qwiz + ')">'
                     +    label
                     + '</button>';
   exit_html = exit_html.replace (/\[restart\]/, restart_button_html);

   return exit_html;
}


// -----------------------------------------------------------------------------
function process_question_attributes (i_qwiz, i_question, question_shortcode, i_qwizard_question) {

   if (set_qwizard_data_b) {
      if (typeof (i_qwizard_question) == 'undefined') {
         i_qwizard_question = i_question;
      }
      qw.questions_cards[i_qwizard_question] = {};
   }

   // Set to defaults first.
   qwizdata[i_qwiz].dataset_id[i_question] = i_question;
   qwizdata[i_qwiz].unit[i_question] = qwizdata[i_qwiz].default_unit;

   // Find attributes, if any.
   var m = question_shortcode.match (/\[(<code><\/code>)*q([^\]]*)\]/m);
   var attributes = m[2];
   if (attributes) {
      attributes = qqc.replace_smart_quotes (attributes);
      if (set_qwizard_data_b) {
         qw.questions_cards[i_qwizard_question].question_attributes = attributes;
      }

      // See if marked as multiple-choice question in qwizard.js -- may only
      // have one choice -- a question in progress.
      if (q.qwizard_b) {
         qwizdata[i_qwiz].qwizard_multiple_choice_b[i_question] = get_attr (attributes, 'multiple_choice') == 'true';
      }

      // Look for "topic=" attribute.
      var question_topics = get_attr (attributes, 'topic');
      if (! question_topics) {
         question_topics = get_attr (attributes, 'topics');
      }
      if (question_topics) {
         if (debug[4]) {
            console.log ('[process_question_attributes] question_topics: ', question_topics);
         }
         if (set_qwizard_data_b) {
            qw.questions_cards[i_qwizard_question].topic = question_topics;
         }

         // Multiple topics for a question - separated by semicolon (and
         // optional space).  Split into array.
         question_topics = question_topics.split (/; */);

         // Replace whitespace with underscores; add topics to list of topics if not
         // already in list.
         for (var i=0; i<question_topics.length; i++) {
            question_topics[i] = question_topics[i].replace (/\s/g, '_');
            var topic = question_topics[i];
            if (qwizdata[i_qwiz].topics.indexOf (topic) == -1) {
               qwizdata[i_qwiz].topics.push (topic);
            }
         }
         qwizdata[i_qwiz].question_topics[i_question] = question_topics;
      }

      // Look for dataset_id= attribute.  Default: i_question.
      var dataset_id = get_attr (attributes, 'dataset_id');
      if (dataset_id) {
         qwizdata[i_qwiz].dataset_id[i_question] = dataset_id;
      }

      // Look for unit= attribute.
      var unit = get_attr (attributes, 'unit');
      if (unit) {
         qwizdata[i_qwiz].unit[i_question] = unit;
         if (set_qwizard_data_b) {
            qw.questions_cards[i_qwizard_question].unit = unit;
         }

         // Add unit to list of units if not already in list.
         if (qwizdata[i_qwiz].units.indexOf (unit) == -1) {
            qwizdata[i_qwiz].units.push (unit);
         }
      }

      // Is this a specific question from a dataset?
      var use_dataset_question_id = get_attr (attributes, 'use_dataset_question');
      if (use_dataset_question_id) {
         qwizdata[i_qwiz].use_dataset_question_ids[i_question] = use_dataset_question_id;
         qwizdata[i_qwiz].dataset_id[i_question]               = use_dataset_question_id;
      }
   }

   return question_topics;
}


// -----------------------------------------------------------------------------
function check_questions_have_topics (i_qwiz) {

   // Look for non-information questions -- if such a question does not have any
   // topics, add topic "Other".
   var add_other_b = false;
   for (var i_question=0; i_question<qwizdata[i_qwiz].n_questions; i_question++) {
      if (! qwizdata[i_qwiz].information_question_b[i_question]) {
         if (! qwizdata[i_qwiz].question_topics[i_question]) {
            qwizdata[i_qwiz].question_topics[i_question] = ['Other'];
            add_other_b = true;
         }
      }
   }
   if (add_other_b) {
      if (qwizdata[i_qwiz].topics.indexOf ('Other') == -1) {
         qwizdata[i_qwiz].topics.push ('Other');
      }
   }

   if (debug[4]) {
      console.log ('[check_questions_have_topics] qwizdata[i_qwiz].question_topics:', qwizdata[i_qwiz].question_topics);
   }
   // Set up statistics by topic.  Object of objects (list of lists).
   qwizdata[i_qwiz].topic_statistics = {};
   var n_topics = qwizdata[i_qwiz].topics.length;
   for (var i_topic=0; i_topic<n_topics; i_topic++) {
      var topic = qwizdata[i_qwiz].topics[i_topic];
      qwizdata[i_qwiz].topic_statistics[topic] = {};
      qwizdata[i_qwiz].topic_statistics[topic].n_correct = 0;
      qwizdata[i_qwiz].topic_statistics[topic].n_incorrect = 0;
   }
}


// -----------------------------------------------------------------------------
this.restart_quiz = function (i_qwiz) {

   // Hide summary report and exit-mobile-mode button, if showing.
   var $summary = $ ('#summary-qwiz' + i_qwiz);
   $summary.hide ();
   $summary.find ('button.summary_exit_mobile_qwiz').hide ();

   // Hide "Got it" and "Need more practice" buttons, if any.
   $ ('#qwiz' + i_qwiz).find ('div.show_answer_got_it_or_not').hide ();

   qwizdata[i_qwiz].n_correct = 0;
   qwizdata[i_qwiz].n_incorrect = 0;
   if (qwizdata[i_qwiz].use_dataset) {
      qwizdata[i_qwiz].information_question_b = {};
      qwizdata[i_qwiz].hangman_answer = '';
      qwizdata[i_qwiz].textentry = '';
   }
   q.display_progress (i_qwiz);

   // Reset qwizzled divs to original state (cloned in init_qwizzled2 ()).
   for (var qwizzled_div_id in qwizdata[i_qwiz].$qwizzled) {
      $ ('div#' + qwizzled_div_id).replaceWith (qwizdata[i_qwiz].$qwizzled[qwizzled_div_id]);

      // For reasons beyond me, it's necessary to re-initialize the cloned
      // object.
      qwizdata[i_qwiz].$qwizzled[qwizzled_div_id] = $ ('div#' + qwizzled_div_id).clone (true);
   }
   if (qwizdata[i_qwiz].qwizzled_b) {
      qwizdata[i_qwiz].correct_on_try1 = [];
   }

   // For good measure (especially restart of use_dataset= quiz), make sure all
   // questions hidden.
   $ ('#qwiz' + i_qwiz).find ('div.qwizq').hide ();

   var n_questions = qwizdata[i_qwiz].n_questions;
   for (var i_question=0; i_question<n_questions; i_question++) {
      qwizdata[i_qwiz].answered_correctly[i_question] = '';
   }

   var n_topics = qwizdata[i_qwiz].topics.length;
   for (var i_topic=0; i_topic<n_topics; i_topic++) {
      var topic = qwizdata[i_qwiz].topics[i_topic];
      qwizdata[i_qwiz].topic_statistics[topic].n_correct = 0;
      qwizdata[i_qwiz].topic_statistics[topic].n_incorrect = 0;
   }
   qwizdata[i_qwiz].i_question = -1;
   if (qwizdata[i_qwiz].qrecord_id && document_qwiz_user_logged_in_b) {
      qwizdata[i_qwiz].record_start_b = false;
      var data = {qrecord_id_ok: qwizdata[i_qwiz].qrecord_id_ok, type: 'start'};
      qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'record_response', data);
   }
   q.next_question (i_qwiz, true);
};


// -----------------------------------------------------------------------------
this.next_question = function (i_qwiz, no_login_b) {

   var i_question = qwizdata[i_qwiz].i_question;

   var qwiz_id = 'qwiz' + i_qwiz;

   var n_questions = qwizdata[i_qwiz].n_questions;
   if (debug[0]) {
      console.log ('[next_question] i_question: ', i_question, ', n_questions: ', n_questions);
   }

   // If width was explicitly set (to accommodate large labeled diagram), set
   // back to non-default width or unset.  Unset width if mobile view.
   if (document_qwiz_mobile) {
      $ ('#' + qwiz_id).css ('width', '');
   } else {
      if (qwizdata[i_qwiz].width_reset) {
         if ($ ('#xqwiz' + i_qwiz).length) {
            $ ('#' + qwiz_id).css ('width', qwizdata[i_qwiz].initial_width + 'px');
         } else {
            $ ('#' + qwiz_id).css ('width', '');
         }
         qwizdata[i_qwiz].width_reset = false;
      }
   }

   // If was displaying intro and more than one question or use_dataset= quiz --
   // came from "Start quiz" button.  Flag to do switch to mobile.
   var start_quiz_b = false;
   if (i_question == -1) {
      if (qwizdata[i_qwiz].use_dataset || qwizdata[i_qwiz].use_dataset_questions_htm || n_questions > 1 || q.qwizard_b) {
         if (! q.no_intro_b[i_qwiz] || qwizdata[i_qwiz].use_dataset_questions_htm) {
            start_quiz_b = true;

            // See if already checked login.
            if (! no_login_b && ! q.qwizard_b) {

               // Not already checked.  If quiz may be recorded, and user not
               // logged in, go to login rather than first question (if user
               // hasn't declined).
               if (qwizdata[i_qwiz].qrecord_id) {
                  var user_logged_in_b
                     =    typeof (document_qwiz_user_logged_in_b) != 'undefined'
                                               && document_qwiz_user_logged_in_b
                       && typeof (document_qwiz_username) != 'undefined';
                  if (   user_logged_in_b
                      || (   typeof (document_qwiz_declined_login_b) != 'undefined'
                          && document_qwiz_declined_login_b)) {
                     if (user_logged_in_b) {

                        // If more than [default 40] minutes since last login,
                        // confirm continue.
                        var now_sec = new Date ().getTime ()/1000.0;
                        var login_timeout_min = qqc.get_qwiz_param ('login_timeout_min', 40);
                        var check_team_b = true;
                        if (now_sec > document_qwiz_current_login_sec + login_timeout_min*60) {
                           check_team_b = false;
                           var a_team = '';
                           if (document_qwiz_team_b) {
                              a_team = ' ' + T ('a team') + ':';
                           }
                           if (confirm (T ('You are logged in as') + a_team + ' ' + document_qwiz_username + '.\n' + T ('Do you want to continue?  (Click "Cancel" to sign out)'))) {
                              document_qwiz_current_login_sec = now_sec;
                           } else {
                              qqc.sign_out ();
                              document_qwiz_user_logged_in_b = false;
                           }
                        }

                        // If logged in as team, check if want to continue as team.
                        if (check_team_b && document_qwiz_team_b) {

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
                        qwizdata[i_qwiz].record_start_b = false;
                        if (document_qwiz_user_logged_in_b) {
                           var data = {qrecord_id_ok: qwizdata[i_qwiz].qrecord_id_ok, type: 'start'};
                           qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'record_response', data);
                        }
                     }
                  } else {
                     q.display_login (i_qwiz);
                     return false;
                  }
               }
            }

            // If use_dataset= quiz, show units/topics options screen.  If
            // dataset_intro="false", go straight to loading dataset questions.
            if (qwizdata[i_qwiz].use_dataset || qwizdata[i_qwiz].use_dataset_questions_htm) {
               if (qwizdata[i_qwiz].dataset_intro_f) {
                  q.display_login (i_qwiz, false, 'use_dataset_options');
               } else {
                  qqc.get_dataset_questions (qwizdata[i_qwiz].use_dataset, qname,
                                             i_qwiz, qwizdata[i_qwiz].qrecord_id,
                                             [], [], 10000, 'spaced_repetition',
                                             qwizdata[i_qwiz].random_b,
                                             qwizdata[i_qwiz].use_dataset_questions_htm);
               }
            }
         }
         q.next_question_from_intro (i_qwiz); 

      } else {

         // Don't show mode.
         $ ('#mode-' + qwiz_id).css ('visibility', 'hidden');

         // If qwizard, need to hide intro if there.
         /* DKTMP
         if (q.qwizard_b && ! q.no_intro_b[i_qwiz]) {
            $ ('#intro-' + qwiz_id).hide ();
         }
         */
      }

   } else {

      // Hide previous question.
      var qwizq_id = qwiz_id + '-q' + i_question;
      $ ('#' + qwizq_id).hide ();
      if (document_qwiz_mobile) {
         $ ('#mobile_' + qwizq_id).hide ();
      }
   }

   // If qwizard, initially (no questions), nothing more.
   if (n_questions == 0) {
      if (debug[0]) {
         console.log ('[next_question] n_questions:', n_questions);
      }
      return;
   }

   // Hide "next" button until user makes a choice.
   // question"
   if (! next_button_active_b) {
      $ ('#next_button-' + qwiz_id).hide ();

      // Record state.
      qwizdata[i_qwiz].next_button_show_b = false;
   }

   // If had been displaying "information question," set as "correct" so don't
   // return to it.  Reset text of next-button.
   if (i_question != -1) {
      if (qwizdata[i_qwiz].information_question_b[i_question]) {
         $ ('#next_button_text-qwiz' + i_qwiz).html (T ('Next question'));
         if (! q.qwizard_b) {
            qwizdata[i_qwiz].answered_correctly[i_question] = true;
            qwizdata[i_qwiz].n_correct++;
            q.display_progress (i_qwiz);
         }
      }
   }

   if (! (qwizdata[i_qwiz].use_dataset && i_question == -1)) {

      // Next question -- if repeating incorrect, keep running through
      // questions until all answered correctly.  If done, show summary/exit
      // text.
      var n_done = qwizdata[i_qwiz].n_correct;
      if (! qwizdata[i_qwiz].repeat_incorrect_b) {
         n_done += qwizdata[i_qwiz].n_incorrect;
      }
      if (debug[0]) {
         console.log ('[next_question] n_done:', n_done, ', n_questions:', n_questions);
      }
      if (n_done == n_questions) {
         q.display_summary_and_exit (i_qwiz);
      } else {

         // If random order, start at random place to look for next not-yet-
         // answered-correctly question.
         if (! q.qwizard_b && qwizdata[i_qwiz].random_b) {
            i_question = Math.floor (Math.random () * n_questions);
         }
         while (true) {
            i_question++;
            if (i_question >= n_questions) {
               i_question = 0;
            }
            if (! qwizdata[i_qwiz].answered_correctly[i_question]) {
               break;
            }
         }
         qwizdata[i_qwiz].i_question = i_question;

         q.display_question (i_qwiz, i_question, start_quiz_b);

         // If qwizard, use go_to_question2 () to hide any previous menus, show
         // relevant menus for this question, highlight in accordion panel
         // question list.  Update progress now.
         if (q.qwizard_b) {
            qwizard.set_qwizard_data ('i_question', i_question);
            qwizard.go_to_question2 ();
            q.display_progress (i_qwiz);
         }
      }
   }
};


// -----------------------------------------------------------------------------
this.next_question_from_intro = function (i_qwiz) {

   // If no questions (qwizard, initially), do nothing.
   if (qwizdata[i_qwiz].n_questions == 0) {
      return;
   }

   // Hide intro (intro -- if any -- shows with the question of a single-
   // question quiz).
   $ ('.intro-qwiz' + i_qwiz).hide ();

   // If intro was showing, can hide qwiz icon now.
   if (! q.no_intro_b[i_qwiz]) {
      $ ('#icon_qwiz' + i_qwiz).hide ();
   }

   // After "Start quiz", button is left-aligned.
   $ ('#next_button-qwiz' + i_qwiz).css ('text-align', 'left');

   // Also, show progress and change button text.  Only if more than one
   // question in quiz.  For use_dataset= quizzes, need to wait for 
   // questions to load (display_progress () called from
   // qqc.receive_and_place_dataset_questions ()).
   if (! qwizdata[i_qwiz].use_dataset) {
      q.display_progress (i_qwiz, true);
   }
   $ ('#next_button_text-qwiz' + i_qwiz).html (T ('Next question'));
}


// -----------------------------------------------------------------------------
this.display_question = function (i_qwiz, i_question, start_quiz_b) {
   var qwizq_id = 'qwiz' + i_qwiz + '-q' + i_question;

   // Hide feedback in case previously displayed.  jQuery operator "^=" is for
   // "startswith."
   var $qwizq = $ ('div#' + qwizq_id);
   if (debug[0]) {
      console.log ('[display_question] start_quiz_b:', start_quiz_b);
      console.log ('[display_question] $qwizq:', $qwizq);
   }
   $qwizq.find ('[id^=' + qwizq_id + '-a]').hide ();

   // And for mobile version, if exists.
   var $mobile_qwizq = $ ('div#mobile_' + qwizq_id);
   $mobile_qwizq.find ('[id^=mobile_' + qwizq_id + '-a]').hide ();

   // Do regular and mobile versions have any <br name="qwiz_img" ... /> tags?
   // Set back to <img... /> tags.
   var $qwiz_img = $qwizq.find ('input[name="qwiz_img"]');
   if ($qwiz_img.length) {
      $qwiz_img.changeElements ('img');
      $mobile_qwizq.find ('input[name="qwiz_img"]').changeElements ('img');
   }


   // See if labeled diagram.
   var qwizzled_b = $qwizq.hasClass ('qwizzled');
   if (qwizzled_b) {

      // If labeled diagram not previously initialized, do initializations:
      // targets no longer draggable, size image wrappers, labels, targets
      // clickable (as an alternative to dragging).
      if (! qwizdata[i_qwiz].$qwizzled) {
         qwizdata[i_qwiz].$qwizzled = {};
      }
      if (typeof (qwizdata[i_qwiz].$qwizzled[qwizq_id]) == 'undefined') {
         if (q.qwizard_b) {
            q.init_qwizzled2 ($qwizq, i_qwiz, i_question);
         } else {
            q.init_qwizzled ($qwizq, i_qwiz, i_question);
         }
      }

      // Reset progress bar counts.
      qwizdata[i_qwiz].n_labels_correct = 0;
      qwizdata[i_qwiz].n_label_attempts = 0;

      // If previously-answered incorrectly, restore state.
      if (qwizdata[i_qwiz].answered_correctly[i_question] === false) {
         $qwizq.replaceWith (qwizdata[i_qwiz].$qwizzled[qwizq_id]);

         // replaceWith () clobbers; need to reset.
         var $qwizq = $ ('div#' + qwizq_id);

         // As in restart_quiz (), re-initialize the cloned object.
         qwizdata[i_qwiz].$qwizzled[qwizq_id] = $ ('div#' + qwizq_id).clone (true);

         // Also, put into place labels that were previously placed correctly.
         // These delays (to make sure any asynchronous preliminaries get done
         // first) may not be necessary, but they won't hurt.
         var delay_init_drag_and_drop = function () {
            if (debug[8]) {
               console.log ('[display_question > delay_init_drag_and_drop] i_qwiz:', i_qwiz, ', i_question:', i_question);
            }
            q.init_drag_and_drop ($qwizq[0]);
         };
         // DKTMP DEDRAG.  Don't do in qwizard.
         if (! q.qwizard_b) {
            setTimeout (delay_init_drag_and_drop, 100);
         }

         var delay_place_labels = function () {
            place_labels (i_qwiz, i_question, qwizq_id);
         };
         setTimeout (delay_place_labels, 200);
      }

      // This collects multiple spans (text targets) if they're spread across
      // a text target.  If don't have qtarget_sib... just count, but de-dup
      // sibs.
      var n_label_targets = 0;
      var target_count = {};
      $qwizq.find ('span.qwizzled_target').not ('.decoy').each (function () {
         var classes = $ (this).attr ('class');
         var m = classes.match (/qtarget_sib-[0-9]*/);
         if (m) {
            var qwizzled_target_assoc_id = m[0];
            target_count[qwizzled_target_assoc_id] = 1;
         } else {

            // Backwards compatibility.
            m = classes.match (/qwizzled_target-[0-9]*/);
            if (m) {
               var qwizzled_target_assoc_id = m[0];
               target_count[qwizzled_target_assoc_id] = 1;
            } else {
               n_label_targets++;
            }
         }
      });

      // Regular targets.  No de-dup necessary.
      n_label_targets += $qwizq.find ('div.qwizzled_target').not ('.decoy').length;

      qwizdata[i_qwiz].n_label_targets = n_label_targets + Object.keys (target_count).length;
      display_qwizzled_progress (i_qwiz);
   }

   // If starting quiz and on mobile screen, switch to full-screen view for
   // quiz container, and mobile-responsive version of question/choices.
   if (start_quiz_b && qqc.is_mobile ()) {
      q.go_mobile (i_qwiz);
   } else if (document_qwiz_mobile) {

      // Mobile version of question if there is one.
      var $mobile_qwizq = $ ('#mobile_qwiz' + i_qwiz + '-q' + i_question);
      if ($mobile_qwizq.length) {
         $mobile_qwizq.show ();
      } else {
         $qwizq.show ();
      }

      // Scroll to top in any case.
      window.scrollTo (0, 1);
   } else {

      // Display regular version of question.
      if (debug[0]) {
         console.log ('[display_question] $qwizq:', $qwizq);
      }
      // For some reason show () didn't do the job on qwizzled question in
      // Chrome.
      $qwizq.css ('display', 'block');

      // If qwizard, and editor hasn't been initiated for editable fields in
      // this question, do so.
      if (q.qwizard_b) {
         if ($qwizq.find ('div[contenteditable]').length == 0) {
            qwizard.init_tinymce ('div#' + qwizq_id + ' .qwiz_editable');

            // DKTMP
            // Also, add interactive tooltip separately to each answer choice
            // text span.
            //qwizard.create_multiple_choice_tooltips ($qwizq.find ('span.qwiz-choice.qwiz_editable'));

            // If "show-me-the-answer" question, reset button text -- tinyMCE
            // initialization seems to clobber.  Give init_tinymce () a chance
            // to complete.
            var delay_reset = function () {
               qwizard.reset_show_me_button_text (i_question);
            }
            setTimeout (delay_reset, 200);

         }
      }
   }

   if (qwizzled_b) {

      // If layout table is wider than default qwiz width (defines border),
      // set wider for now.  Get width of table.  Add 10px for border and
      // padding of qwiz div.
      var table_width = 10 + $qwizq.find ('table.qwizzled_table').outerWidth ();
      if (debug[0]) {
         console.log ('[display_question] table_width:', table_width, ', initial_width:', qwizdata[i_qwiz].initial_width);
      }

      // Don't do if mobile view.
      if (! document_qwiz_mobile 
                              && table_width > qwizdata[i_qwiz].initial_width) {
         $ ('#qwiz' + i_qwiz).css ('width', table_width + 'px');

         // Set flag to reset width on next question.
         qwizdata[i_qwiz].width_reset = true;
      }
      if (q.qwizard_b) {

         // Set up label tooltips and disable browser context menu on labels.
         var $labels = $qwizq.find ('.qwizzled_highlight_label');
         /* DKTMP DEDRAG
         qwizard.create_label_tooltips ($labels);
         qwizard.disable_browser_context_menu ($labels);
         */
         $labels.addClass ('no_move');
      }
   } else {

      // See if this is a [textentry] question that uses terms.
      if (qwizdata[i_qwiz].textentry && qwizdata[i_qwiz].textentry[i_question]) {
         var $textentry = $ ('#textentry-qwiz' + i_qwiz + '-q' + i_question);
         if (! qwizdata[i_qwiz].textentry[i_question].textentry_suggest_b) {

            // No-suggestions textentry question.  Enable check-answer button
            // from the get-go.
            var $check_answer = $ ('#textentry_check_answer_div-qwiz' + i_qwiz + '-q' + i_question);
            $check_answer.find ('button.textentry_check_answer').removeClass ('qbutton_disabled').addClass ('qbutton');
            qwizdata[i_qwiz].check_answer_disabled_b = false;
            $check_answer.show ();
         } else if (! qwizdata[i_qwiz].textentry[i_question].single_char_b) {

            // .................................................................
            // [textentry] question.
            // Use terms given with [terms]...[/terms] for this quiz; otherwise
            // load default terms if haven't done so already.
            if (qwizdata[i_qwiz].terms) {

               // Only do this once per quiz.
               if (! qwizdata[i_qwiz].textentry_terms_metaphones) {
                  qwizdata[i_qwiz].textentry_terms_metaphones = qqc.process_textentry_terms (qwizdata[i_qwiz].terms);
               }
            } else {
               if (! default_textentry_terms_metaphones) {
                  var plugin_url = qqc.get_qwiz_param ('url', './');
                  var terms_data = qqc.get_textentry_terms (plugin_url + 'terms.txt', qwizdata);
                  default_textentry_terms_metaphones = qqc.process_textentry_terms (terms_data);
               }
            }

            // Also need to process additional terms for this quiz, if any.
            // Only do once per quiz.
            if (qwizdata[i_qwiz].add_terms) {
               if (! qwizdata[i_qwiz].add_textentry_terms_metaphones) {
                  qwizdata[i_qwiz].add_textentry_terms_metaphones = qqc.process_textentry_terms (qwizdata[i_qwiz].add_terms);
               }
            }


            qwizdata[i_qwiz].check_answer_disabled_b = true;
            qwizdata[i_qwiz].textentry_n_hints = 0;

            // Calculate metaphones of answers -- both correct and incorrect  --
            // up to first blank following a non-blank.
            textentry_answers[i_qwiz] = qwizdata[i_qwiz].textentry[i_question].answers;
            textentry_answer_metaphones[i_qwiz]
               = textentry_answers[i_qwiz].map (function (answer) {
                                                   answer = answer.replace (/\s*(\S+)\s.*/, '\$1');
                                                   return qqc.metaphone (answer);
                                                })

            if (qwizdata[i_qwiz].textentry[i_question].use_terms_b) {

               // List of terms (term, metaphone pairs) for this question: (1) default
               // or specific to this qwiz; plus (2) additional terms for this quiz,
               // if any; and (3) answers (correct and incorrect) for this question.
               // Singular or plural in each case.
               var singular_plural;
               if (qwizdata[i_qwiz].textentry[i_question].textentry_plural_b) {
                  singular_plural = 'plural';
               } else {
                  singular_plural = 'singular';
               }

               // (1) Quiz-specific or default.
               if (qwizdata[i_qwiz].terms) {
                  current_question_textentry_terms_metaphones[i_qwiz]
                     = qwizdata[i_qwiz].textentry_terms_metaphones[singular_plural];
               } else {
                  current_question_textentry_terms_metaphones[i_qwiz]
                     = default_textentry_terms_metaphones[singular_plural];
               }

               // (2) Additional.
               if (qwizdata[i_qwiz].add_terms) {
                  current_question_textentry_terms_metaphones[i_qwiz]
                     = current_question_textentry_terms_metaphones[i_qwiz]
                          .concat (qwizdata[i_qwiz].add_textentry_terms_metaphones[singular_plural]);
               }
            } else {
               current_question_textentry_terms_metaphones[i_qwiz] = [];
            }

            // (3) Answers.
            var textentry_answers_metaphones
               = textentry_answers[i_qwiz].map (function (answer) {
                                           return [answer, qqc.metaphone (answer)];
                                        });
            if (debug[6]) {
               console.log ('[display_question] textentry_answers_metaphones: ', textentry_answers_metaphones);
            }
            current_question_textentry_terms_metaphones[i_qwiz]
                  = current_question_textentry_terms_metaphones[i_qwiz]
                                         .concat (textentry_answers_metaphones);

            // Sort and de-dupe.
            current_question_textentry_terms_metaphones[i_qwiz]
               = qqc.sort_dedupe_terms_metaphones (current_question_textentry_terms_metaphones[i_qwiz]);

            if (debug[6]) {
               console.log ('[display_question] current_question_textentry_terms_metaphones[i_qwiz].length: ', current_question_textentry_terms_metaphones[i_qwiz].length);
               console.log ('[display_question] current_question_textentry_terms_metaphones[i_qwiz].slice (0, 10): ', current_question_textentry_terms_metaphones[i_qwiz].slice (0, 10));
               var i_start = current_question_textentry_terms_metaphones[i_qwiz].length - 10;
               if (i_start > 0) {
                  console.log ('[display_question] current_question_textentry_terms_metaphones[i_qwiz].slice (' + i_start + '): ', current_question_textentry_terms_metaphones[i_qwiz].slice (i_start));
               }
            }

            // Set minlength for autocomplete suggestions for this question.
            var question = qwizdata[i_qwiz].textentry[i_question];
            var minlength = question.textentry_minlength;
            var correct_answer_length = question.first_correct_answer.length;
            if (correct_answer_length < minlength) {
               minlength = correct_answer_length;
            }

            // For qwizard, not yet initialized.
            if (q.qwizard_b && ! $textentry.autocomplete ('instance')) {
               q.init_textentry_autocomplete ($qwizq);
            }
            $textentry.autocomplete ('option', 'minLength', minlength);

            // Set placeholder now.  Also reset "Check answer" button.
            var placeholder;
            var check_answer;
            if (minlength <= 1) {
               placeholder = T ('Type a letter/number');
               check_answer = T ('Type a letter');
            } else {
               minlength = Math.max (minlength, 3);
               placeholder = T ('Type %s+ letters/numbers, then select');
               placeholder = placeholder.replace ('%s', minlength);

               check_answer = T ('Type %s+ letters');
               check_answer = check_answer.replace ('%s', minlength);
            }
            $textentry.attr ('placeholder', placeholder);
            $ ('#textentry_check_answer_div-qwiz' + i_qwiz + '-q' + i_question + ' button.textentry_check_answer').html (check_answer);

            // Save.
            qwizdata[i_qwiz].check_answer = check_answer;

            // Needed in find_matching_terms ().
            question.textentry_minlength = minlength;

            // Show "Check answer" and "Hint" buttons.  "Check answer" starts out
            // gray (but not actually disabled, so click provides alert message).
            var $check_answer = $ ('#textentry_check_answer_div-qwiz' + i_qwiz + '-q' + i_question);
            $check_answer.find ('button.textentry_check_answer').removeClass ('qbutton').addClass ('qbutton_disabled');
            qwizdata[i_qwiz].check_answer_disabled_b = true;
            $check_answer.show ();

            // Hint starts out not visible.  If first question of no-intro quiz,
            // set up for mouseenter to start timeout.
            if (i_question == 0 && (q.no_intro_b[i_qwiz]
                                           || qwizdata[i_qwiz].n_questions == 1)) {
               $ ('div#qwiz' + i_qwiz).attr ('onmouseenter', qname + '.start_hint_timeout (' + i_qwiz + ')');
            } else {

               // Otherwise, start timeout now (with question display).
               q.start_hint_timeout (i_qwiz);
            }
         }

         // Reset value of textentry box, if there is one, and also reenable in
         // case still disabled (after quiz restart).
         if ($textentry.length) {
            $textentry.val ('').removeAttr ('disabled');

            // Set focus to textentry box.  Don't do if first question and no
            // intro (avoid scrolling page to this quiz).  Focus can trigger
            // scroll > panel open in mobile view, so set flag not to open
            // panel.
            if (i_question != 0 || ! q.no_intro_b[i_qwiz]) {
               panel_exit_mobile_just_closed_b = true;
               if (! q.preview) {
                  $textentry.focus ();
               }
            }
         }
      } else {

         if (qwizdata[i_qwiz].information_question_b[i_question]) {

            // "Information-only question."  Reset next-button to "Continue".
            // Show button, record state, set as "correct" so don't return to it.
            $ ('#next_button_text-qwiz' + i_qwiz).html (T ('Continue'));
            position_show_next_button (i_qwiz);
            qwizdata[i_qwiz].next_button_show_b = true;
         } else if (qwizdata[i_qwiz].hangman_answer && qwizdata[i_qwiz].hangman_answer[i_question]) {
            $hangman = $qwizq.find ('div.qwiz_hangman');

            // Initial entry - just underscores for each letter.
            var hangman_final_entry = qwizdata[i_qwiz].hangman_final_entry[i_question]
            var hangman_current_entry = hangman_final_entry.replace (/>[a-z0-9]</gi, '>&ensp;<');
            qwizdata[i_qwiz].hangman_current_entry[i_question] = hangman_current_entry.replace (/>&ensp;</g, '>\t<');
            $hangman.find ('div.entry').html (hangman_current_entry);

            // Enable input in case previously disabled.  Reset incorrect
            // characters, number of hints, enable hint button.
            $hangman.find ('input').removeAttr ('disabled');
            qwizdata[i_qwiz].hangman_incorrect_chars[i_question] = '';
            qwizdata[i_qwiz].hangman_incorrect_chars_before_hint[i_question] = 3;
            qwizdata[i_qwiz].hangman_n_hints = 0;
            $ ('#hangman_hint-qwiz' + i_qwiz + '-q' + i_question)
               .removeAttr ('disabled')
               .removeClass ('qbutton_disabled')
               .addClass ('qbutton');

            // Reset hangman status, hide message in case was shown.
            var msg;
            var hangman_answer = qwizdata[i_qwiz].hangman_answer[i_question];
            if (hangman_answer.search (/[a-z]/i) != -1) {
               msg = T ('Type letters in the box');
            } else {
               msg = T ('Type numbers in the box');
            }
            $hangman.find ('div.hangman_status').html ('<span class="type_letters">' + msg + '</span>');
            $qwizq.find ('div.qwiz_hangman_msg').hide ();

            // Set focus to hangman input box.  Don't do if first question and
            // no intro (avoid scrolling page to this quiz).  Focus can trigger
            // scroll > panel open in mobile view, so set flag not to open panel.
            // In mobile view (at least in Android default browswer), highlights
            // input box and doesn't respond to first letter, so deselect.
            if ((i_question != 0 || ! q.no_intro_b[i_qwiz])) {
               panel_exit_mobile_just_closed_b = true;
               var $hangman_input = $qwizq.find ('div.qwiz_hangman input');
               $hangman_input.focus ();
               $hangman_input[0].setSelectionRange (0, 0);
            }
         } else {

            // ....................................................................
            // Multiple-choice question.
            // Enable radio clicks in case previously disabled for this question.
            // Also, show radios unclicked.
            $ ('input[name=' + qwizq_id + ']').removeAttr ('disabled').prop ('checked', false);

            // For mobile version, make sure all choices showing.
            $ ('#mobile_' + qwizq_id + ' li.mobile_choice').show ();

            // In case one-choice "show the answer" button previously disabled,
            // or hidden, enable and show.
            $qwizq.find ('button.show_the_answer').removeAttr ('disabled').show ();

            if (! q.qwizard_b) {
               // Re-enable highlight choices on mouseover, cursor to indicate
               // clickable.
               $ ('.choices-' + qwizq_id).on ('mouseover', function () {
                  $ (this).css ({'cursor': 'pointer', 'color': '#045FB4'})
               }).on ('mouseout', function () {;
                  $ (this).css ({'cursor': 'text', 'color': 'black'})
               });
            }
         }
      }
   }
}


// -----------------------------------------------------------------------------
this.go_mobile = function (i_qwiz) {

   // Quiz container: save style, remove style, change class to mobile.
   var $qwiz = $ ('#qwiz' + i_qwiz);
   qwizdata[i_qwiz].qwiz_style = $qwiz.attr ('style');
   $qwiz.removeAttr ('style').removeClass ('qwiz').addClass ('qwiz-mobile');

   // Place quiz div directly into body, absolutely positioned at top.  Record
   // current scroll position, then scroll to top (plus one pixel so can scroll
   // down for panel).  First put a placeholder div in so know where to put
   // qwiz div back!
   $qwiz.after ('<div id="qwiz_div_placeholder"></div>');
   non_mobile_scrollLeft = $ (document).scrollLeft ();
   non_mobile_scrollTop  = $ (document).scrollTop ();
   $qwiz.appendTo ('body');
   window.scrollTo (0, 1);

   // If any labeled diagrams in this quiz, change label header/message.
   $qwiz.find ('.qwizzled_label_head_standard').hide ();
   $qwiz.find ('.qwizzled_label_head_mobile').show ();

   // Mobile version of question if there is one.  Otherwise, show regular
   // question.  Don't do if on login or summary.
   var i_question = qwizdata[i_qwiz].i_question;
   if (i_question < qwizdata[i_qwiz].n_questions && ! qwizdata[i_qwiz].login_show_b) {
      var qwizq_id = 'qwiz' + i_qwiz + '-q' + i_question;
      var $qwizq = $ ('#' + qwizq_id);
      var $mobile_qwizq = $ ('#mobile_qwiz' + i_qwiz + '-q' + i_question);
      if ($mobile_qwizq.length) {
         $mobile_qwizq.show ();
         $qwizq.hide ();
      } else {
         $qwizq.show ();
      }
   }

   // If labeled diagram question, reset "original" label positions (since
   // relative to document, and position in document now very different!).
   if (qwizdata[i_qwiz].$qwizzled && qwizdata[i_qwiz].$qwizzled[qwizq_id]) {
      reset_label_positions ($qwizq);

      // Also, unset width -- just use screen width.
      $qwiz.css ('width', '');
   }

   // Hide go-mobile icon and clickable target.
   $ ('.go-mobile-qwiz' + i_qwiz).hide ();

   // Show exit-mobile icon and clickable target.
   $ ('.exit-mobile-qwiz' + i_qwiz).show ();

   // Hide Learn/test mode.
   $ ('#mode-qwiz' + i_qwiz).hide ();

   // Show exit-mobile slider icon.
   $ ('#icon-exit-mobile-qwiz' + i_qwiz).show ();

   // Show summary report "Return to page view" button.
   $ ('#summary-qwiz' + i_qwiz).find ('button.summary_exit_mobile_qwiz').show ();

   // Detect window scroll - if scroll to top, show slide-in panel for exit-
   // mobile-mode button.  Flag so ignore initiating trigger.
   scroll_detect_i_qwiz = -1;
   $ (window).on ('scroll',   
                  function () {
                     //console.log ('[go_mobile > scroll] $ (window).scrollTop ():', $ (window).scrollTop ());
                     if (scroll_detect_i_qwiz != -1) {
                        var scrollTop = $ (window).scrollTop ();
                        if (scrollTop == 0) {

                           // If just closed panel, assume don't want to reopen
                           // it just yet.
                           if (panel_exit_mobile_just_closed_b) {
                              window.scrollTo ($ (window).scrollLeft (), 1);
                              panel_exit_mobile_just_closed_b = false;
                           } else {

                              // Show panel and set flag.
                              q.open_panel_exit_mobile (i_qwiz);
                           }
                        } else if (panel_exit_mobile_open_b) {

                           // Any scroll will close panel (as will click).
                           q.close_panel_exit_mobile ($ ('#overlay-exit-mobile-qwiz' + i_qwiz)[0]);
                        } else if (scrollTop != 1) {
                           
                           // Any other user scroll means OK to open panel when
                           // scroll to top (scrollTop 1 assumed to be panel
                           // close scroll, which triggers scroll event).
                           panel_exit_mobile_just_closed_b = false;
                        }
                     }
                  });
   scroll_detect_i_qwiz = i_qwiz;

   // Don't let click on "Return to page view" trigger close_panel_exit_mobile ().
   $ ('#panel-exit-mobile-qwiz' + i_qwiz + ' button')
      .click (function (event) {
                 event.stopPropagation ();
              });

   // Set global var.
   document_qwiz_mobile = 'mobile_';
}


// -----------------------------------------------------------------------------
this.open_panel_exit_mobile = function (i_qwiz) {

   $ ('#overlay-exit-mobile-qwiz' + i_qwiz)
      .show ()
      .animate ({top: '0px'}, 500);
   panel_exit_mobile_open_b = true;

   // Also hide default slide-icon.
   $ ('#icon-exit-mobile-qwiz' + i_qwiz).hide ();
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
this.exit_mobile = function (i_qwiz) {

   // Quiz container: restore style, change class to standard.
   var $qwiz = $ ('#qwiz' + i_qwiz);
   $qwiz.attr ('style', qwizdata[i_qwiz].qwiz_style)
        .removeClass ('qwiz-mobile')
        .addClass ('qwiz');

   // If non-default width for this quiz, reset.
   if ($ ('#xqwiz' + i_qwiz).length) {
      $ ('#' + qwiz_id).css ('width', qwizdata[i_qwiz].initial_width + 'px');
   }

   // Place quiz back into content.  Scroll back to previous position.
   $ ('#qwiz_div_placeholder').replaceWith ($qwiz);
   window.scrollTo (non_mobile_scrollLeft, non_mobile_scrollTop);

   // Reset exit panel.
   $ ('#overlay-exit-mobile-qwiz' + i_qwiz).css ({top: '-100px', display: 'none'});

   // Turn off scroll detect.
   $ (window).off ('scroll');

   // If any labeled diagrams in this quiz, change label header/message.
   $qwiz.find ('.qwizzled_label_head_standard').show ();
   $qwiz.find ('.qwizzled_label_head_mobile').hide ();

   var i_question = qwizdata[i_qwiz].i_question;
   var qwizq_id = 'qwiz' + i_qwiz + '-q' + i_question;
   var $qwizq = $ ('#' + qwizq_id);
   if (i_question >= 0 && i_question < qwizdata[i_qwiz].n_questions
                                          && ! qwizdata[i_qwiz].login_show_b) {

      // Hide mobile version of question if there is one.
      var $mobile_qwizq = $ ('#mobile_qwiz' + i_qwiz + '-q' + i_question);
      $mobile_qwizq.hide ();

      // Show regular version.
      $qwizq.show ();
   }

   // If labeled diagram, accommodate large images, etc. and reset label
   // positions.
   if (qwizdata[i_qwiz].$qwizzled && qwizdata[i_qwiz].$qwizzled[qwizq_id]) {
      var table_width = 10 + $qwizq.find ('table.qwizzled_table').outerWidth ();
      if (table_width > qwizdata[i_qwiz].initial_width) {
         $qwiz.css ('width', table_width + 'px');

         // Set flag to reset width on next question.
         qwizdata[i_qwiz].width_reset = true;
      }
      reset_label_positions ($qwizq);
   }

   // Hide exit-mobile slider icon (easier just to hide them all).
   $ ('div.icon-exit-mobile-qwiz, div.icon-panel-exit-mobile-qwiz').hide ();

   // Hide exit-mobile icon (in progress bar).
   $ ('.exit-mobile-qwiz').hide ();

   // Also hide summary exit-mobile button.
   $ ('button.summary_exit_mobile_qwiz').hide ();

   // If still on mobile device, show go-mobile icon and clickable target, and
   // learn/test mode.
   if (qqc.is_mobile ()) {
      $ ('.go-mobile-qwiz' + i_qwiz).show ();
      $ ('#mode-qwiz' + i_qwiz).show ();
   }

   // Unset global vars.
   document_qwiz_mobile = '';
   panel_exit_mobile_just_closed_b = false;
}


// -----------------------------------------------------------------------------
function reset_label_positions ($qwizq) {
   if (debug[8]) {
      console.log ('[reset_label_positions] $qwizq:', $qwizq);
   }
   $qwizq.find ('td.qwizzled_labels div.qwizzled_label').each (function () {

      // Use <li> position, in case label has been dragged.
      var label_offset = $ (this).parents ('li').offset ();
      if (debug[8]) {
         console.log ('[reset_label_positions] label_offset:', label_offset);
      }
      $ (this).data ('label_x', label_offset.left).data ('label_y', label_offset.top);
   });
}


// -----------------------------------------------------------------------------
this.start_hint_timeout = function (i_qwiz) {

   // Only execute this function once for this question.
   $ ('div#qwiz' + i_qwiz).removeAttr ('onmouseenter');

   var i_question = qwizdata[i_qwiz].i_question;
   var $check_answer = $ ('#textentry_check_answer_div-qwiz' + i_qwiz + '-q' + i_question);
   if (debug[0]) {
      console.log ('[start_hint_timeout] $check_answer.length:', $check_answer.length);
   }

   // Closure for setTimeout ().
   var show_hint_button = function () {
      $check_answer.find ('button.qwiz_textentry_hint')
         .removeAttr ('disabled')
         .html ('Hint').show ();
   }
   $check_answer.find ('button.qwiz_textentry_hint').html ('Hint').hide ();
   if (hint_timeout_sec >= 0) {
      show_hint_timeout[i_qwiz] = setTimeout (show_hint_button, hint_timeout_sec*1000);
   }
}


// -----------------------------------------------------------------------------
function process_multiple_choice (i_qwiz, i_question, htm, opening_tags) {

   // Create alternate divs -- desktop and mobile.
   var desktop_htm;
   var remaining_htm;
   var q_and_a_text;

   // Span for default indented paragraph style for choices.  Want this ahead of
   // any opening tags user put in before first "[c]".
   var choices_html = '';
   var span_pos = qqc.opening_tag_shortcode_pos ('([c]|[c*])', htm);
   if (span_pos == htm.length) {
      errmsgs.push (T ('Did not find choices ("[c]") for') + ' qwiz ' + (i_qwiz + 1) + ', ' + T ('question') + ' ' + (i_question + 1));
      desktop_htm = '';
      remaining_htm = '';
   } else {
      var question_htm = htm.substr (0, span_pos);
      if (debug[0]) {
         console.log ('[process_multiple_choice] span_pos: ', span_pos);
         console.log ('[process_multiple_choice] question_htm: ', question_htm);
      }

      // If quiz subject to recording, save question html -- without tags.
      // Also, replace non-breaking spaces and EOLs with space, multiple spaces
      // with single space, trim.
      if (qwizdata[i_qwiz].qrecord_id) {
         q_and_a_text = qqc.remove_tags_eols (question_htm);
         qwizdata[i_qwiz].q_and_a_text[i_question] = q_and_a_text;
      }

      if (set_qwizard_data_b) {
         qw.questions_cards[i_question].type = 'multiple_choice';

         // Include opening tags -- formatting -- with question text, so
         // qwizard will save (and allow changes to) formatting.
         qw.questions_cards[i_question].question_text = opening_tags + question_htm;
      }

      // Wrap in div for this qwiz and question.
      desktop_htm =   '<div id="qwiz' + i_qwiz + '-q' + i_question + '" class="qwizq">\n'
                    +    '<div class="qwiz-question qwiz_editable">'
                    +       opening_tags + question_htm
                    +    '</div>';

      if (debug[1]) {
         console.log ('[process_multiple_choice] desktop_htm: ', desktop_htm);
      }

      remaining_htm = htm.substr (span_pos);

      // Include paragraph-close -- without this, if there's a paragraph-close
      // within the choices that corresponds to a previous unclosed paragraph,
      // then the next span won't work.
      // DKTMP
      //choices_html = '</p><span class="qwiz-choices">';
      choices_html = '</p>';
   }

   // Do choice tags.  Change [c] to radio button, enclose text in span to
   // highlight on mouseover.  Choice text includes opening tags and
   // corresponding closing tags (if any), up to next [c] tag or first [f] tag.
   // Count choice tags.
   var choice_tags = htm.match (/\[c\*{0,1}\]/gm);
   var n_choices = 0;
   if (choice_tags) {
      n_choices = choice_tags.length;
   }
   if (debug[0]) {
      console.log ('[process_multiple_choice] n_choices: ', n_choices);
   }
   if (set_qwizard_data_b) {
      qw.questions_cards[i_question].n_choices = n_choices;
      qw.questions_cards[i_question].choices   = [];
      qw.questions_cards[i_question].feedbacks = [];
   }

   var n_correct = 0;

   var choice_start_tags = ['[c]', '[c*]'];
   var choice_next_tags  = ['[c]', '[c*]', '[x]'];

   var got_feedback_b = false;
   var i_fx = -1;
   var feedback_divs  = [];   // Feedback div for desktop.
   var feedback_items = [];   // Plain html for mobile.
   var choice_items   = [];   // "
   var i_choice_correct = 0;
   for (var i_choice=0; i_choice<n_choices; i_choice++) {

      // Find choice text -- from opening tags through [c] or [c*] up to
      // opening tags for next tag.  Delete it from remaining_htm.
      var choice_html = qqc.parse_html_block (remaining_htm, choice_start_tags,
                                              choice_next_tags);
      remaining_htm = remaining_htm.substr (choice_html.length);

      // See if there's feedback within the choice html.  Take it out of the
      // choice html.
      var r = process_feedback_item (choice_html, i_qwiz, i_question, i_choice);
      choice_html  = r.choice_html;

      if (r.feedback_div) {

         // If this is the last choice, and didn't previously get feedback
         // with choices, then may have all feedback items together following
         // choice items (backwards compatibility) or, if only one feedback
         // item, use same feedback for all choices.
         if (i_choice == n_choices-1 && ! got_feedback_b && n_choices != 1) {

            // Assume just got feedback for the first choice.
            feedback_divs[0] = r.feedback_div;
            feedback_items[0] = r.feedback_item_html;
            var n_feedback_items = 1;

            // If feedback given with [fx], save index.
            if (r.fx_b) {
               i_fx = 0;

               // [fx] does not count as an "item".
               n_feedback_items = 0;
            }

            // Look for rest.
            for (var i_feedback=1; i_feedback<n_choices; i_feedback++) {
               var r = process_feedback_item (choice_html, i_qwiz, i_question,
                                              i_feedback);
               choice_html  = r.choice_html;
               if (! r.feedback_div) {
                  break;
               }
               feedback_divs[i_feedback] = r.feedback_div;
               feedback_items[i_feedback] = r.feedback_item_html;
               if (r.fx_b) {
                  if (i_fx == -1) {
                     i_fx = i_feedback;
                  } else {
                     errmsgs.push (T ('Got more than one [fx]') + ': qwiz ' + (1 + i_qwiz) + ', ' + T('question') + ' ' + (1 + i_question));
                  }
               } else {

                  // [fx] does not count as an "item".
                  n_feedback_items++;
               }
            }

            // Either got just one feedback item (which we'll interpret as
            // applying to the last choice), or should get one item for each
            // choice.
            if (n_feedback_items == 1 || i_fx != -1) {

               // Move that item to the last choice.
               feedback_divs[n_choices-1] = feedback_divs[0];
               feedback_divs[0] = '';
               feedback_items[n_choices-1] = feedback_items[0];
               feedback_items[0] = '';
               if (i_fx == 0) {
                  i_fx = n_choices - 1;
               }
            } else {

               // Check got them all.
               if (n_feedback_items != n_choices) {
                  errmsgs.push (T ('Number of feedback items does not match number of choices') + ': qwiz ' + (1 + i_qwiz) + ', ' + T('question') + ' ' + (1 + i_question));
               } else {

                  // First feedback item needs to have ID updated to indicate
                  // really belongs to first choice.
                  feedback_divs[0] = feedback_divs[0].replace (/(qwiz[0-9]+-q[0-9]+-a)[0-9]+/, '\$10');
               }
            }
         } else {

            // Create a div for the feedback we just processed.
            got_feedback_b = true;
            if (r.fx_b) {
               if (i_fx == -1) {
                  i_fx = feedback_divs.length;
               } else {
                  errmsgs.push (T ('Got more than one [fx]') + ': qwiz ' + (1 + i_qwiz) + ', ' + T('question') + ' ' + (1 + i_question));
               }
            }
            feedback_divs.push (r.feedback_div);
            feedback_items.push (r.feedback_item_html);

            // Check that there's not more than one feedback item accompanying
            // this (not-last) choice.
            var r = process_feedback_item (choice_html, i_qwiz, i_question,
                                           i_feedback);
            if (r.feedback_div) {
               errmsgs.push (T ('More than one feedback shortcode [f] or [fx] given with a choice') + ': qwiz ' + (1 + i_qwiz) + ', ' + T ('question') + ' ' + (1 + i_question) + ', ' + T ('choice') + ' ' + (1 + i_choice));
            }
         }
      } else {

         // No feedback given for this choice.  Record with empty "div".
         feedback_divs.push ('');
         feedback_items.push ('');
      }
      if (debug[2]) {
         console.log ('[process_multiple_choice] feedback_divs:', feedback_divs);
      }

      // Save for mobile.
      var choice_item = choice_html.replace (/\[c\*{0,1}\]/m, '');
      choice_items.push (choice_item);
      if (n_choices > 1 
            || (q.qwizard_b 
                   && qwizdata[i_qwiz].qwizard_multiple_choice_b[i_question])) {

         // Replace [c] or [c*] with radio button.  Start span for choice text
         // (separate from radio button).
         var r = create_radio_button_html (i_qwiz, i_question, i_choice,
                                           choice_tags[i_choice]);
         if (r.correct) {
            n_correct++;
            i_choice_correct = i_choice;
         }
         choice_html = choice_html.replace (/\[c\*{0,1}\]/m, r.htm + '<span class="qwiz-choice qwiz_editable" data-i_choice="' + i_choice + '">');

         // Assemble with span to make choice clickable and highlight on
         // mouseover.  If starts with a paragraph or header tag, but does not
         // end with corresponding closing tag, move the span _after_ the
         // opening tag.
         if (choice_html.substr (0, 2) == '<p' || choice_html.substr (0, 2) == '<h') {
            var len = choice_html.length;

            // len - 4 is third character from end. </p> </h1>
            //                                      4321 54321
            if (choice_html.substr (len - 4, 3) != '</p'
                && choice_html.substr (len - 5, 3) != '</h') {
               var end_opening_tag_pos = choice_html.indexOf ('>');
               if (end_opening_tag_pos != -1) {
                  choices_html += choice_html.substr (0, end_opening_tag_pos + 1);
                  choice_html = choice_html.substr (end_opening_tag_pos + 1);
               }
            } else {

               // End choice text span inside the closing tag.
               choice_html = choice_html.replace (/<\/(p|h[1-6])>$/, '</span>$&');
            }
         }

         // End choice text span.
         choice_html += '</span>';

         // For qwizard, save what's inside the span as the choice text.
         if (set_qwizard_data_b) {
            var m = choice_html.match (/<span class="qwiz-choice[^>]+>(.*?)<\/span>/);
            qw.questions_cards[i_question].choices[i_choice] = m[1];
         }

         var qwiz_question = 'qwiz' + i_qwiz + '-q' + i_question;
         var qwiz_question_choice = qwiz_question + '-a' + i_choice;
         var style = '';
         if (q.qwizard_b) {
            style = ' style="cursor: text;"';
         }
         choices_html += '<span class="choices-' + qwiz_question + ' choice-' + qwiz_question_choice + ' qwiz-choices" onclick="' + qname + '.process_choice (\'' + qwiz_question_choice + '\')" data-i_choice="' + i_choice + '"' + style + '>\n'
                      +     '<span class="qwiz-choice" data-i_choice="' + i_choice + '">'
                      +        choice_html
                      +     '</span>'
                      + '</span>';
      } else {

         // Only one choice - do as regular button rather than radio.  Click
         // goes to "Got-it/Repeat" choice presentation, unless it's a one-
         // question quiz.  Left margin to stay clear of Qwiz icon on first page.
         choice_html = choice_html.replace (/\[c\*{0,1}\]/m, '');
         n_correct = 1;
         var onclick;
         if (qwizdata[i_qwiz].n_questions == 1) {
            onclick = qname + '.process_choice (\'qwiz' + i_qwiz + '-q' + i_question + '-a0\', true)';
         } else {
            onclick = qname + '.show_answer_got_it_or_not (' + i_qwiz + ', ' + i_question + ', this)';
         }
         var button_label = choice_html;
         if (button_label.indexOf ('[show_me_placeholder]') != -1) {
            button_label = 'Show me the answer';
         }
         choices_html += '<button class="qbutton show_the_answer qwiz-choice qwiz_editable" data-i_choice="0" style="margin-left: 20px;" onclick="' + onclick + '">';
         choices_html +=    button_label;
         choices_html += '</button>\n';

         if (set_qwizard_data_b) {
            qw.questions_cards[i_question].type = 'show_me';
            qw.questions_cards[i_question].choices[i_choice] = choice_html;
         }

         // Require feedback for "Show-the-answer" type question.
         if (! feedback_divs[0]) {
            errmsgs.push (T ('Feedback [f] is required for a one-choice question') + ': qwiz ' + (1 + i_qwiz) + ', ' + T ('question') + ' ' + (1 + i_question));
         }
      }
   }

   // Close span for default indented paragraph style for choices.
   if (set_qwizard_data_b) {

      // Let qwizard know choices are "inline" if no paragraph, heading, or
      // break tags in choices span (except at beginning).
      if (debug[12]) {
         console.log ('[process_multiple_choice] choices_html:', choices_html);
      }
      // Skip any at beginning (before first sub-span).  First look past
      // '</p><span class="qwiz-choices">'.
      //  0----+----1----+----2----+----3
      var pos_sub_span1 = choices_html.substr (31).indexOf ('<span');
      if (pos_sub_span1 != -1) {
         if (choices_html.substr (31 + pos_sub_span1).search (/<p|<h[1-6]|<br/) == -1) {
            qw.questions_cards[i_question].choices_inline = true;
         }
      }
   }
   desktop_htm += choices_html;

   // Include clearing div in case image floating left or right (needed to
   // expand parent div and its border).
   desktop_htm += '<div style="clear: both;"></div>\n';

   if (debug[1]) {
      console.log ('[process_multiple_choice] desktop_htm: ', desktop_htm);
   }

   // Check that one and only one choice is marked correct.
   if (n_correct == 0) {
      errmsgs.push (T ('No choice was marked correct') + ': qwiz ' + (1 + i_qwiz) + ', ' + T ('question') + ' ' + (1 + i_question));
   } else if (n_correct > 1) {
      errmsgs.push (T ('More than one choice was marked correct') + ': qwiz ' + (1 + i_qwiz) + ', ' + T ('question') + ' ' + (1 + i_question));
   } else {
      if (set_qwizard_data_b) {
         qw.questions_cards[i_question].correct_choice = i_choice_correct;
      }
   }

   // ..........................................................................
   // If got [fx], use that feedback for all empty feedback items except correct
   // choice.  Otherwise, create canned feedback for any empty feedback items.
   for (var i_choice=0; i_choice<n_choices; i_choice++) {
      if (! feedback_divs[i_choice]) {
         if (i_fx != -1 && i_choice != i_choice_correct) {

            // Reset ID to match choice.
            feedback_divs[i_choice] = feedback_divs[i_fx].replace (/(qwiz[0-9]+-q[0-9]+-a)[0-9]+/, '\$1' + i_choice);
         } else {
            var response = q.canned_feedback (i_choice == i_choice_correct);
            feedback_divs[i_choice]
                               = create_feedback_div_html (i_qwiz, i_question,
                                                           i_choice, response);
            feedback_items[i_choice] = response;
            //DKTMP
            //if (set_qwizard_data_b) {
            //   qw.questions_cards[i_question].feedbacks[i_choice] = response;
            //}
         }
      }
   }

   // Add feedback divs to html string.
   feedback_divs = feedback_divs.join ('\n');
   desktop_htm += feedback_divs;

   if (set_qwizard_data_b) {
      for (var i_choice=0; i_choice<n_choices; i_choice++) {
         qw.questions_cards[i_question].feedbacks[i_choice] = feedback_items[i_choice];
      }
   }

   // If "show-the-answer" (single-choice) question, buttons for "Got it" and
   // "Need more practice".
   if (n_choices == 1 && (qwizdata[i_qwiz].n_questions > 1 || qwizdata[i_qwiz].use_dataset)) {
      desktop_htm += create_got_it_or_not ('', i_qwiz, i_question);
   }
   if (debug[2]) {
      console.log ('[process_multiple_choice] desktop_htm: ', desktop_htm);
   }

   // Close question div.
   desktop_htm += '</div>\n';

   // Assemble mobile div.
   var qwiz_question = 'mobile_qwiz' + i_qwiz + '-q' + i_question;
   var mobile_htm = [];
   mobile_htm.push ('<div id="mobile_qwiz' + i_qwiz + '-q' + i_question + '" class="qwizq-mobile">\n');
   mobile_htm.push (   opening_tags + question_htm);
   mobile_htm.push (   '<ul class="mobile_choices">');
   for (var i_choice=0; i_choice<n_choices; i_choice++) {
      var qwiz_question_choice = qwiz_question + '-a' + i_choice;
      var data_correct = i_choice == i_choice_correct ? 'data-correct="1"' : '';

      // If "show-the-answer" (single-choice) question, different processing,
      // unless a single-question quiz.
      var onclick;
      if (n_choices > 1 || qwizdata[i_qwiz].n_questions == 1) {
         onclick = qname + '.process_choice (\'' + qwiz_question_choice + '\')';
      } else {
         onclick = qname + '.show_answer_got_it_or_not (' + i_qwiz + ', ' + i_question + ', this)';
      }
      mobile_htm.push (    '<li id="choice-' + qwiz_question_choice + '" class="mobile_choice" onclick="' + onclick  + '" ' + data_correct + '>');
      mobile_htm.push (       '<div class="mobile_choice">');
      mobile_htm.push (          choice_items[i_choice]);
      mobile_htm.push (       '</div>');
      mobile_htm.push (    '</li>');
   }
   mobile_htm.push (   '</ul>');
   mobile_htm.push (   '<div style="clear: both;"></div>');

   // Mobile version of feedback divs.
   mobile_htm.push (feedback_divs.replace (/id="qwiz/gm, 'id="mobile_qwiz'));
   mobile_htm.push ('</div>');

   // Also, if "show-the-answer" (single-choice) question, buttons for "Got it"
   // and "Need more practice".
   if (n_choices == 1 && (qwizdata[i_qwiz].n_questions > 1 || qwizdata[i_qwiz].use_dataset)) {
      mobile_htm.push (create_got_it_or_not ('mobile_', i_qwiz, i_question));
   }

   mobile_htm = mobile_htm.join ('\n');

   // Return both divs.
   return desktop_htm + '\n' + mobile_htm;
}


// -----------------------------------------------------------------------------
function process_textentry (i_qwiz, i_question, htm, opening_tags) {

   // If this is first textentry question for this quiz, create data object.
   // Also set flag to initialize autocomplete or single-char capture.
   if (! qwizdata[i_qwiz].textentry) {
      qwizdata[i_qwiz].textentry = {};
      textentry_b = true;
   }

   // Capture text up to first [c] or [c*], not including opening tags before.
   var m = htm.match (/([\s\S]*?)(<[^\/][^>]*>\s*)*?\[c\*{0,1}\]/m);
   var question_text = '';
   if (m) {
      question_text = m[1];
   } else {
      errmsgs.push (T ('No answer-word given') + ': qwiz ' + (1 + i_qwiz) + ', ' + T ('question') + ' ' + (1 + i_question));
   }

   // If recording, save.
   if (qwizdata[i_qwiz].qrecord_id) {

      // Replace [textentry] shortcode with _______.
      var q_and_a_text = question_text.replace (/\[textentry[^\]]*\]/, '_________');
      qwizdata[i_qwiz].q_and_a_text[i_question] = qqc.remove_tags_eols (q_and_a_text);
   }

   if (set_qwizard_data_b) {
      qw.questions_cards[i_question].type = 'textentry';

      // Include opening tags -- formatting -- with question text, so qwizard
      // will save (and allow changes to) formatting.
      qw.questions_cards[i_question].question_text = opening_tags + question_text;
      qw.questions_cards[i_question].choices = [];
      qw.questions_cards[i_question].correct_choice_fs = [];
      qw.questions_cards[i_question].feedbacks = [];
   }

   // Wrap in div for this qwiz and question.
   var new_htm =   '<div id="qwiz' + i_qwiz + '-q' + i_question + '" class="qwizq">\n';
   if (q.qwizard_b) {
      new_htm +=      '<div class="qwiz-question qwiz-question-textentry qwiz-part1 qwiz-inline qwiz_editable">\n';
   }
   new_htm +=            opening_tags + htm;

   // See if attributes: plurals, minlength, etc.
   var textentry_plural_b = false;
   var textentry_suggest_b = true;
   var textentry_minlength = 3;
   var use_dict_b  = default_use_dict == 'true';
   var use_terms_b = default_use_terms == 'true';
   var single_char_b = false;
   var m = new_htm.match (/\[textentry([^\]]*)\]/m);
   var attributes = '';
   if (m) {
      attributes = m[1];
      if (attributes) {

         // Look for "plural=" attribute.  Match regular double-quote, or
         // left- or right-double-quote.
         attributes = qqc.replace_smart_quotes (attributes);
         textentry_plural_b = get_attr (attributes, 'plural') == 'true';

         // "suggest=" attribute.  False will override everything else.
         textentry_suggest_b = get_attr (attributes, 'suggest') != 'false';

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
      qw.questions_cards[i_question].type = single_char_b ? 'one_letter_answer' : 'textentry';
      qw.questions_cards[i_question].textentry_attributes = attributes;
   }

   // Look for first [c], including any opening tags.  Choices -->
   // remaining_htm.
   //DKTMP
   //var c_pos = new_htm.search (/\s*(<[^\/][^>]*>\s*)*?\[c\*{0,1}\]/m);
   var c_pos = qqc.opening_tag_shortcode_pos ('([c*]|[c])', new_htm);
   var remaining_htm = new_htm.substr (c_pos);
   new_htm = new_htm.substr (0, c_pos);

   // Replace [textentry] with input textbox.  Placeholder will be set later (in
   // display_question ()).
   var classname;
   var style;
   if (single_char_b) {
      classname = classname = 'qwiz_single_char_entry';
      style     = 'style="width: 2rem;" ';
   } else if (textentry_suggest_b) {
      classname = 'qwiz_textentry';
      style     = 'style="width: 18em;" ';
   } else {
      classname = 'qwiz_textentry_no_suggest';
      style     = 'style="width: 18em;" ';
   }
   var input = '<input type="text" id="textentry-qwiz' + i_qwiz + '-q' + i_question + '" class="' + classname + '" ' + style + 'onfocus="' + qname + '.set_textentry_i_qwiz (event, this)" />';

   // If qwizard, editable div comes in two pieces -- before and after textentry
   // input field.
   if (q.qwizard_b) {
      input =  '</div>'
             + input
             + '<div class="qwiz-question qwiz-question-textentry qwiz-part2 qwiz-inline qwiz_editable">';

      // If the piece after [textentry] and before [c] includes a stranded
      // </p>, delete.
      var m = new_htm.match (/\[textentry.*(<p|<\/p>)/);
      if (m) {
         if (m[1] == '</p>') {
            var part = m[0];
            var new_part = part.replace ('</p>', '');
            new_htm = new_htm.replace (part, new_part);
         }
      }
   }
   new_htm = new_htm.replace (/\[textentry[^\]]*\]/, input);
   if (q.qwizard_b) {

      // Close part 2 of class="qwiz-question editable" div.
      new_htm += '</div>\n';
   }

   // Add check-answer and hint buttons for each question.
   new_htm +=  '<div id="textentry_check_answer_div-qwiz' + i_qwiz + '-q' + i_question + '" class="textentry_check_answer_div">\n'
             + '   <button class="qbutton_disabled textentry_check_answer" title="' + Tcheck_answer_message + '" onclick="' + qname + '.textentry_check_answer (' + i_qwiz + ')">'
             +        T ('Check answer')
             +    '</button>\n'
             +    '&emsp;\n'
             +    '<button class="qbutton qwiz_textentry_hint" style="display: none; font-size: 11px; padding: 2px 2px; border-radius: 5px;" onclick="' + qname + '.textentry_hint (' + i_qwiz + ')" disabled>'
             +        T ('Hint')
             +    '</button>\n'
             + '</div>\n';

   // Look for choices and feedback (interleaved only, feedback optional).
   // Save as data, delete here.
   var n_correct = 0;

   var choice_start_tags = ['[c]', '[c*]'];
   var choice_next_tags  = ['[c]', '[c*]', '[x]'];

   var got_feedback_b = false;
   var feedback_divs = [];

   // Choices.  Object for this question set to array of choices.
   qwizdata[i_qwiz].textentry[i_question] = {};
   qwizdata[i_qwiz].textentry[i_question].choices = [];
   qwizdata[i_qwiz].textentry[i_question].textentry_plural_b = textentry_plural_b;
   qwizdata[i_qwiz].textentry[i_question].textentry_suggest_b = textentry_suggest_b;
   qwizdata[i_qwiz].textentry[i_question].textentry_minlength = textentry_minlength;
   qwizdata[i_qwiz].textentry[i_question].use_terms_b = use_terms_b;
   qwizdata[i_qwiz].textentry[i_question].use_dict_b = use_dict_b;
   qwizdata[i_qwiz].textentry[i_question].single_char_b = single_char_b;
   qwizdata[i_qwiz].textentry[i_question].choices_correct = [];
   qwizdata[i_qwiz].textentry[i_question].answers = [];
   qwizdata[i_qwiz].textentry[i_question].first_correct_answer = '';
   qwizdata[i_qwiz].check_answer_disabled_b = true;

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
      var r = process_feedback_item (choice_html, i_qwiz, i_question, i_choice);
      choice_html  = r.choice_html;
      var feedback_item_html = '';

      if (r.feedback_div) {
         got_feedback_b = true;
         feedback_divs.push (r.feedback_div);
         feedback_item_html = r.feedback_item_html;

         // Check that there's not more than one feedback item accompanying
         // this choice.
         var r = process_feedback_item (choice_html, i_qwiz, i_question,
                                        i_choice);
         if (r.feedback_div) {
            errmsgs.push (T ('More than one feedback shortcode [f] given with choice') + ': qwiz ' + (1 + i_qwiz) + ', ' + T ('question') + ' ' + (1 + i_question) + ', ' + T ('choice') + ' ' + (1 + i_choice));
         }
      } else {

         // No feedback given for this choice.  Record with empty "div".
         feedback_divs.push ('');
      }
      if (set_qwizard_data_b) {
         qw.questions_cards[i_question].feedbacks[i_choice] = feedback_item_html;
      }

      // Parse choice data.  [c] or [c*] followed by semicolon-separated list
      // of potential answers.
      var correct_b = choice_html.search (/\[c\*\]/) != -1;
      if (correct_b) {
         n_correct++;
      }

      // Delete up through [c] or [c*].
      choice_html = choice_html.replace (/.*\[c\*{0,1}\]/m, '');

      // Delete any tags and EOLs and non-breaking spaces.  Don't do if still
      // qwizard placeholder.
      if (! (q.qwizard_b && choice_html.indexOf ('placeholder') != -1)) {
         choice_html = choice_html.replace (/<[^>]+>|\n|&nbsp;/g, '');
      }

      // Error if just blanks and semicolons.
      if (choice_html.replace (';', '').search (/\S/) == -1) {
         errmsgs.push (T ('No word(s) given for [textentry] choice') + ' - qwiz ' + (i_qwiz + 1) + ', ' + T ('question') + ' ' + (1 + i_question) + ', ' + T ('choice') + ' ' + (1 + i_choice));
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
         if (correct_b) {
            errmsgs.push (T ('For [textentry] question, wildcard choice ("*", for any other user entry) cannot be marked correct "[c*]"'));
         }
         /*
         if (feedback_divs[i_choice] == '') {
            errmsgs.push (T ('For [textentry] question, wildcard choice ("*", for any other user entry) must be accompanied by feedback "[f]"'));
         }
         */
      }

      // Save these, associated with this choice.
      qwizdata[i_qwiz].textentry[i_question].choices.push (nonblank_alts);
      qwizdata[i_qwiz].textentry[i_question].choices_correct.push (correct_b);
      if (set_qwizard_data_b) {
         qw.questions_cards[i_question].choices.push (nonblank_alts.join (';'));
         qw.questions_cards[i_question].correct_choice_fs.push (correct_b ? 1 : 0);
      }

      // Save first correct answer -- for hint.
      if (correct_b) {
         if (nonblank_alts.length && qwizdata[i_qwiz].textentry[i_question].first_correct_answer == '') {
            qwizdata[i_qwiz].textentry[i_question].first_correct_answer = nonblank_alts[0];
         }
      }

      // Also save as simple array for this question.  Make sure no duplicates
      // (wouldn't want same answer to be both correct and incorrect!).
      var n_alts = nonblank_alts.length;
      for (var i=0; i<n_alts; i++) {
         if (qwizdata[i_qwiz].textentry[i_question].answers.indexOf (nonblank_alts[i]) != -1
                                           && nonblank_alts != 'Enter word') {
            errmsgs.push (T ('Answer given in more than one choice') + ': ' + nonblank_alts[i] + ' - qwiz ' + (i_qwiz + 1) + ', ' + T ('question') + ' ' + (1 + i_question) + ', ' + T ('choice') + ' ' + (1 + i_choice));
         }
      }
      qwizdata[i_qwiz].textentry[i_question].answers
                 = qwizdata[i_qwiz].textentry[i_question].answers.concat (nonblank_alts);
      i_choice++;
   }
   if (set_qwizard_data_b) {
      qw.questions_cards[i_question].n_choices = i_choice;
   }

   // If default choice not given, add it.
   if (! default_choice_given_b) {
      i_choice++;
      qwizdata[i_qwiz].textentry[i_question].choices.push (['*']);
      qwizdata[i_qwiz].textentry[i_question].choices_correct.push (false);
      if (set_qwizard_data_b) {
         qw.questions_cards[i_question].choices.push ('*');
         qw.questions_cards[i_question].correct_choice_fs.push (0);
         qw.questions_cards[i_question].n_choices = i_choice;
      }
   }
   var n_choices = i_choice;

   // Include clearing div in case image floating left or right (needed to
   // expand parent div and its border).
   new_htm += '<div style="clear: both;"></div>\n';

   // Check that got at least one correct choice.
   if (n_correct == 0) {
      errmsgs.push (T ('No choice was marked correct') + ': qwiz ' + (1 + i_qwiz) + ', ' + T ('question') + ' ' + (1 + i_question));
   }

   // ..........................................................................
   // Create canned feedback for any empty feedback items
   for (var i_choice=0; i_choice<n_choices; i_choice++) {
      if (! feedback_divs[i_choice]) {
         var response = q.canned_feedback (qwizdata[i_qwiz].textentry[i_question].choices_correct[i_choice]);
         feedback_divs[i_choice] = create_feedback_div_html (i_qwiz, i_question,
                                                             i_choice, response);
         if (set_qwizard_data_b) {
            qw.questions_cards[i_question].feedbacks[i_choice] = response;
         }
      }
   }

   // Add feedback divs to html string.
   new_htm += feedback_divs.join ('\n');
   if (debug[2]) {
      console.log ('[process_textentry] new_htm: ', new_htm);
   }

   // Close question div.
   new_htm += '</div>\n';

   return new_htm;
}


// -----------------------------------------------------------------------------
function process_hangman (i_qwiz, i_question, htm, opening_tags) {

   // Capture text up to opening tags, if any, before first [c] or [c*].
   var m = htm.match (/([\s\S]*?)(<[^\/][^>]*>\s*)*?\[c\*{0,1}\]/m);
   var question_text = '';
   if (m) {
      var question_text = m[1];
   }

   // If recording, save.
   if (qwizdata[i_qwiz].qrecord_id) {

      // Replace [hangman] shortcode with _______.
      q_and_a_text = question_text.replace (/\[hangman[^\]]*\]/, '_________');
      qwizdata[i_qwiz].q_and_a_text[i_question] = qqc.remove_tags_eols (q_and_a_text);
   }
   var hangman_max_hints = default_hangman_max_hints;

   // Look for "hint=" attribute.
   var m = htm.match (/\[hangman([^\]]*)\]/m);
   var attributes = '';
   if (m) {
      attributes = m[1];
      if (attributes) {
         attributes = qqc.replace_smart_quotes (attributes);
         var hints = get_attr (attributes, 'hints');
         if (hints) {
            if (hints.search (/[^0-9]/) == -1) {
               hangman_max_hints = parseInt (hints);
            } else {
               errmsgs.push (T ('"hints" for [hangman] should be a number') + ': qwiz ' + (1 + i_qwiz) + ', ' + T ('question') + ' ' + (1 + i_question));
            }
         }
      }
   }
   if (set_qwizard_data_b) {
      qw.questions_cards[i_question].type = 'hangman';
      qw.questions_cards[i_question].hangman_attributes = attributes;

      // Include opening tags -- formatting -- with question text, so qwizard
      // will save (and allow changes to) formatting.
      qw.questions_cards[i_question].question_text = opening_tags + question_text;
      qw.questions_cards[i_question].choices = [];
      qw.questions_cards[i_question].feedbacks = [];
   }


   // Look for first [c], including opening tags.
   var question_htm;
   var c_pos = qqc.opening_tag_shortcode_pos ('[c*{0,1}]', htm);
   if (c_pos == htm.length) {
      errmsgs.push (T ('Did not get [c] or [c*] (hangman answer) with [hangman]') + ': qwiz ' + (1 + i_qwiz) + ', ' + T ('question') + ' ' + (1 + i_question));
      c_pos = 0;
      question_htm = htm;
   } else {
      question_htm = htm.substr (0, c_pos);
   }
   question_htm = opening_tags + question_htm;

   // If [hangman] is inside paragraph or header, close previous and start new,
   // give both inline-block style, and wrap whole thing in div that replicates
   // paragraph's or header's style (handles "text-align=center", for example).
   // Look backwards from [hangman].  If first thing you come to is </p or </h,
   // then you're OK.  If first thing you come to is <p or <h, then do
   // modification.  Doesn't work with qwizard editing fields, so don't do.
   if (! q.qwizard_b) {
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
   }

   // Hangman answer.  Start with [c] or [c*].  Make sure only one.
   var remaining_htm = htm.substr (c_pos);
   var choice_start_tags = ['[c]', '[c*]'];
   var choice_next_tags  = ['[c]', '[c*]', '[x]'];

   var got_feedback_b = false;
   var feedback_divs = [];

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

      // See if there's feedback within the choice html.
      var r = process_feedback_item (choice_html, i_qwiz, i_question, i_choice);
      choice_html  = r.choice_html;

      if (r.feedback_div) {
         got_feedback_b = true;

         feedback_divs.push (r.feedback_div);
         if (set_qwizard_data_b) {
            qw.questions_cards[i_question].feedbacks[i_choice] = r.feedback_item_html;
         }

         // Check that there's not more than one feedback item accompanying
         // this choice.
         var r = process_feedback_item (choice_html, i_qwiz, i_question,
                                        i_choice);
         if (r.feedback_div) {
            errmsgs.push (T ('More than one feedback shortcode [f] given with hangman answer') + ': qwiz ' + (1 + i_qwiz) + ', ' + T ('question') + ' ' + (1 + i_question) + ', ' + T ('choice') + ' ' + (1 + i_choice));
         }
      } else {

         // No feedback given for this choice.  Record with empty "div".
         feedback_divs.push ('');
      }

      // Get hangman answer.
      var hangman_match = choice_html.match (/\[c\*{0,1}\]([^\[]*)/m);
      if (hangman_match) {
         hangman_answer = hangman_match[1];

         // Delete any tags and EOLs and non-breaking spaces.
         hangman_answer = hangman_answer.replace (/<[^>]+>|\n|&nbsp;/g, '');
         hangman_answer = qqc.trim (hangman_answer);
         hangman_answer_length = hangman_answer.length;
         if (debug[0]) {
            console.log ('[process_hangman] hangman_answer:', hangman_answer);
         }
      }
      i_choice++;
   }
   if (i_choice > 1) {
      errmsgs.push (T ('More than one hangman answer ([c] or [c*]) given') + ': qwiz ' + (1 + i_qwiz) + ', ' + T ('question') + ' ' + (1 + i_question));
   }

   // Save the answer.
   if (! qwizdata[i_qwiz].hangman_answer) {
      qwizdata[i_qwiz].hangman_answer                      = {};
      qwizdata[i_qwiz].hangman_final_entry                 = {};
      qwizdata[i_qwiz].hangman_current_entry               = {};
      qwizdata[i_qwiz].hangman_incorrect_chars             = {};
      qwizdata[i_qwiz].hangman_incorrect_chars_before_hint = {};
      qwizdata[i_qwiz].hangman_max_hints                   = {};
      qwizdata[i_qwiz].hangman_n_hints = 0;
   }
   qwizdata[i_qwiz].hangman_answer[i_question] = hangman_answer;
   if (set_qwizard_data_b) {
      qw.questions_cards[i_question].choices[0] = hangman_answer;
   }
   qwizdata[i_qwiz].hangman_max_hints[i_question] = hangman_max_hints;

   // Thin-space-separated characters, individually underscored (except for
   // non-alpha characters).
   var hangman_final_entry = qqc.create_hangman_entry (hangman_answer);

   // Save.  Substitute a single character (tab) for &ensp; in saved value.
   qwizdata[i_qwiz].hangman_final_entry[i_question]   = hangman_final_entry;

   // Create canned feedback if item not given.
   if (! feedback_divs[0]) {
      var response = q.canned_feedback (true);
      feedback_divs[0] = create_feedback_div_html (i_qwiz, i_question, 0, response);
      if (set_qwizard_data_b) {
         qw.questions_cards[i_question].feedbacks[0] = response;
      }
   }

   // Wrap in div for this qwiz and question.
   var new_htm =   '<div id="qwiz' + i_qwiz + '-q' + i_question + '" class="qwizq">\n';
   if (q.qwizard_b) {
      new_htm +=      '<div class="qwiz-question qwiz-question-hangman qwiz-part1 qwiz-inline qwiz_editable">\n';
   }
   new_htm +=            question_htm;

   // Just en-spaces for input value -- so user can click anywhere in input
   // text box.
   var hint_class = hangman_max_hints ? ' qwiz_hangman_w_hint' : '';
   var input_value = new Array (hangman_answer_length).join ('&ensp;');
   var hangman_div =   '<div class="qwiz_hangman' + hint_class + '">'
                     +    '<div class="entry">'
                     +    '</div>'
                     +    '<input type="text" onkeyup="' + qname + '.hangman_keyup (this, event,\' ' + input_value + '\', ' + i_qwiz + ', ' + i_question + ')" value="' + input_value + '" />';
   if (hangman_max_hints) {
      var title;
      if (hangman_max_hints < hangman_answer.replace (/[a-z0-9]/i, '').length) {
         title = ' title="' + T ('You can get') + ' ' + qqc.number_to_word (hangman_max_hints) + ' ' + T ('hint') + ' ' + Tplural ('letter', 'letters', hangman_max_hints) + ', ' + T ('but your answer will count as incorrect') + '"';
      } else {
         title = ' title="' + T ('You can get hints, but your answer will count as incorrect') + '"';
      }
      hangman_div   +=     '<button id="hangman_hint-qwiz' + i_qwiz + '-q' + i_question+ '" class="qbutton hangman_hint" onclick="' + qname + '.hangman_hint (' + i_qwiz + ', ' + i_question + ')"' + title + '>'
                     +        T ('Hint')
                     +    '</button>\n';
   }
   hangman_div      +=    '<div class="hangman_status">'
                     +    '</div>'
                     + '</div>'

   // If qwizard, editable div comes in two pieces -- before and after textentry
   // input field.
   if (q.qwizard_b) {
      hangman_div =  '</div>'
                   + hangman_div
                   + '<div class="qwiz-question qwiz-question-hangman qwiz-part2 qwiz-inline qwiz_editable">';

      // If the piece after [hangman] includes a stranded </p>, delete.
      var m = new_htm.match (/\[hangman.*(<p|<\/p>)/);
      if (m) {
         if (m[1] == '</p>') {
            var part = m[0];
            var new_part = part.replace ('</p>', '');
            new_htm = new_htm.replace (part, new_part);
         }
      }
      new_htm +=     '</div>';

   }
   new_htm = new_htm.replace (/\[hangman[^\]]*\]/, hangman_div);
   if (debug[0]) {
      console.log ('[process_hangman] new_htm:', new_htm);
   }

   // Include clearing div in case image floating left or right (needed to
   // expand parent div and its border).
   new_htm += '<div style="clear: both;"></div>\n';

   // Add feedback div.
   new_htm += feedback_divs.join ('\n');

   // Add hangman message div.
   new_htm += '<div class="qwiz_hangman_msg"></div>';

   // Close question div.
   new_htm += '</div>';

   return new_htm;
}


// -----------------------------------------------------------------------------
this.hangman_keyup = function (input_el, event, default_value, i_qwiz, i_question) {

   // If no separate intro page, and this is first question, hide qwiz icon.
   if (i_question == 0 && (   q.no_intro_b[i_qwiz]
                           || qwizdata[i_qwiz].n_questions == 1)) {
      $ ('div.qwiz div#icon_qwiz' + i_qwiz).hide ();
   }

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
   var current_entry = qwizdata[i_qwiz].hangman_current_entry[i_question];
   var final_entry   = qwizdata[i_qwiz].hangman_final_entry[i_question];

   // Loop over characters.
   var n_chars = keychars.length;
   for (var i=0; i<n_chars; i++) {
      var keychar = keychars[i];
      var break_f = update_hangman_input (keychar, current_entry, final_entry,
                                          i_qwiz, i_question, input_el);
      if (break_f) {
         break;
      }
   }

   // Show status; only first 8 incorrect letters.
   if (qwizdata[i_qwiz].hangman_incorrect_chars[i_question]) {
      var hangman_incorrect_chars_before_hint
             = qwizdata[i_qwiz].hangman_incorrect_chars_before_hint[i_question];
      var hangman_incorrect_chars_display
         = qqc.create_hangman_incorrect_chars_display (qwizdata[i_qwiz].hangman_incorrect_chars[i_question],
                                                       hangman_incorrect_chars_before_hint);
      $ (input_el).parents ('div.qwiz_hangman').find ('div.hangman_status').html (hangman_incorrect_chars_display);
   } else {
      $ (input_el).parents ('div.qwiz_hangman').find ('div.hangman_status').html ('');
   }

   return true;
}


// -----------------------------------------------------------------------------
function update_hangman_input (keychar, current_entry, final_entry,
                               i_qwiz, i_question, input_el, hint_f) {
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

   var hangman_incorrect_chars = qwizdata[i_qwiz].hangman_incorrect_chars[i_question];
   if (good_char_b) {
      qwizdata[i_qwiz].hangman_current_entry[i_question] = current_entry;
      var local_current_entry = current_entry.replace (/\t/g, '&ensp;');
      $ (input_el).parents ('div.qwiz_hangman').find ('div.entry').html (local_current_entry);

      // Did this character complete the hangman (all <u>\t</u> filled in)?
      var done_f = current_entry.indexOf ('<u>\t</u>') == -1;
      if (done_f) {

         // Yes.  Don't accept further input.
         $ (input_el).attr ('disabled', true);

         // "Correct" if three or fewer incorrect characters and no hints.
         var correct_b = hangman_incorrect_chars.length <= 3 
                                       && qwizdata[i_qwiz].hangman_n_hints == 0;
         if (! q.qwizard_b) {
            qwizdata[i_qwiz].answered_correctly[i_question] = correct_b;
         }
         if (correct_b) {

            // Show feedback.
            $ ('#qwiz' + i_qwiz + '-q' + i_question + '-a0').show ();

            // Record statistics.
            if (! q.qwizard_b) {
               qwizdata[i_qwiz].n_correct++;
            }
         } else {

            // Not correct.  Show message.
            var msg;
            if (qwizdata[i_qwiz].repeat_incorrect_b) {
               msg = T ('Now you\'ve got it, but remember your answer -- you\'ll see this question again soon.');
            } else {
               msg = T ('Sorry, you entered more than three incorrect letters.');
            }
            $ ('div#qwiz' + i_qwiz + '-q' + i_question + ' div.qwiz_hangman_msg').html (msg).show ();

            // Statistics.
            if (! q.qwizard_b) {
               qwizdata[i_qwiz].n_incorrect++;
            }
         }

         // Blur focus on entry textbox -- so <Return> can bubble to
         // trigger next-button click.
         input_el.blur ();

         // If recording, jjax call.
         if (qwizdata[i_qwiz].qrecord_id && document_qwiz_user_logged_in_b) {
            var hangman_answer = qwizdata[i_qwiz].hangman_answer[i_question];
            var data = {q_and_a_text: qwizdata[i_qwiz].q_and_a_text[i_question],
                        i_question:   qwizdata[i_qwiz].dataset_id[i_question],
                        unit:         qwizdata[i_qwiz].unit[i_question],
                        type:         'hangman',
                        response:     hangman_answer,
                        correct_b:    correct_b ? 1 : ''};
            qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'record_response', data);
         }

         // If topics, statistics by topics this question.
         update_topic_statistics (i_qwiz, i_question, correct_b);

         update_progress_show_next (i_qwiz);

         // Exit loop over characters.
         break_f = true;
      }
   } else {

      // Letter incorrect.  Update status.  Do if not already there.
      keychar = keychar.toLowerCase ();
      if (hangman_incorrect_chars.indexOf (keychar) == -1) {
         hangman_incorrect_chars += keychar;
      }
      qwizdata[i_qwiz].hangman_incorrect_chars[i_question] = hangman_incorrect_chars;
      if (debug[9]) {
         console.log ('[hangman_keyup] hangman_incorrect_chars:', hangman_incorrect_chars);
      }
   }

   return break_f;
}


// -----------------------------------------------------------------------------
this.hangman_hint = function (i_qwiz, i_question) {

   // Allow two hints -- each hint gives first unfilled-blank letter.
   qwizdata[i_qwiz].hangman_n_hints++;
   if (qwizdata[i_qwiz].hangman_n_hints > qwizdata[i_qwiz].hangman_max_hints[i_question]) {
      return false;
   } else if (qwizdata[i_qwiz].hangman_n_hints == qwizdata[i_qwiz].hangman_max_hints[i_question]) {

      // Disable hint button.
      $ ('#hangman_hint-qwiz' + i_qwiz + '-q' + i_question)
         .attr ('disabled', true)
         .removeClass ('qbutton')
         .addClass ('qbutton_disabled');
   } else {

      // Show incorrect characters from here on with red background.
      qwizdata[i_qwiz].hangman_incorrect_chars_before_hint[i_question]
                  = qwizdata[i_qwiz].hangman_incorrect_chars[i_question].length;
   }

   // Get correct answer.
   var hangman_answer = qwizdata[i_qwiz].hangman_answer[i_question];

   // Get current entry and find position -- in answer -- of first still-blank
   // letter.  Hangman characters in answer are A-Z, a-z, and 0-9.  Hangman
   // characters in current entry are between <u></u> pairs (either character
   // or \t -- indicates blank).
   var current_entry = qwizdata[i_qwiz].hangman_current_entry[i_question];
   var matches = current_entry.match (/<u>.<\/u>/g);
   var i_pos = matches.indexOf ('<u>\t</u>');
   if (debug[9]) {
      console.log ('[hangman_hint] matches:', matches);
      console.log ('[hangman_hint] i_pos:', i_pos);
   }

   if (i_pos != -1) {
      var final_entry = qwizdata[i_qwiz].hangman_final_entry[i_question];

      // Extract the corresponding character.
      matches = final_entry.match (/<u>.<\/u>/g);
      var hint_char = matches[i_pos][3];

      // Substitute in to current input.
      var qwizq_id = 'qwiz' + i_qwiz + '-q' + i_question;
      var $qwizq = $ ('div#' + qwizq_id);
      var $hangman_input = $qwizq.find ('div.qwiz_hangman input');
      var input_el = $hangman_input[0];
      update_hangman_input (hint_char, current_entry, final_entry, 
                            i_qwiz, i_question, input_el, true);
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

   // Get i_qwiz from id.  Looks like "textentry-qwiz0-q0".
   var id = input_el.id;
   var i_qwiz = id.match (/qwiz([0-9]+)/)[1];
   if (debug[6]) {
      console.log ('[single_char_textentry_keyup] i_qwiz:', i_qwiz);
   }

   // Process answer -- same logic as textentry.
   q.textentry_check_answer (i_qwiz, true);
}


// -----------------------------------------------------------------------------
function process_feedback_item (choice_html, i_qwiz, i_question, i_choice) {

   var feedback_start_tags = ['[f]', '[fx]'];
   var feedback_next_tags  = ['[f]', '[fx]', '[x]'];

   if (debug[2]) {
      console.log ('[process_feedback_item] choice_html: ', choice_html);
   }
   var feedback_item_html = qqc.parse_html_block (choice_html, feedback_start_tags,
                                                  feedback_next_tags);
   var feedback_div = '';
   var fx_b;
   if (feedback_item_html != 'NA') {

      // Yes.  Take out of the choice html.
      choice_html = choice_html.replace (feedback_item_html, '');
      if (debug[2]) {
         console.log ('[process_feedback_item] feedback_item_html: ', feedback_item_html);
      }

      // Set flag if [fx].
      fx_b = feedback_item_html.indexOf ('[fx]') != -1;

      // Delete [f] or [fx].
      feedback_item_html = feedback_item_html.replace (/\[fx{0,1}\]/, '');
      feedback_div = create_feedback_div_html (i_qwiz, i_question, i_choice,
                                               feedback_item_html)
   } else {
      feedback_item_html = '';
   }
   if (debug[2]) {
      console.log ('[process_feedback_item] feedback_div:', feedback_div);
      console.log ('[process_feedback_item] choice_html: ', choice_html);
      console.log ('[process_feedback_item] fx_b:        ', fx_b);
   }

   return {'feedback_div':       feedback_div,
           'choice_html':        choice_html,
           'feedback_item_html': feedback_item_html,
           'fx_b':               fx_b};
}


// -----------------------------------------------------------------------------
function process_qwizzled (i_qwiz, i_question, question_htm, opening_tags,
                           question_shortcode) {

   if (debug[0]) {
      console.log ('[process_qwizzled] question_htm: ', question_htm);
   }

   // Labeled diagram.  First see that has been properly processed by qwizzled:
   // no unwrapped labels, and that each label has been associated with a
   // target.
   // DKTMP
   // ...

   // See if labels placement specified by "attribute", e.g., [q labels="top"].
   // Default is "right".  Find attributes, if any.
   var labels_position = '';
   var m = question_shortcode.match (/\[(<code><\/code>)*q([^\]]*)\]/m);
   if (m) {
      var attributes = m[2];
      if (attributes) {

         // Look for "labels=" attribute.  Match regular double-quote, or
         // left- or right-double-quote.
         attributes = qqc.replace_smart_quotes (attributes);
         labels_position = get_attr (attributes, 'labels');
         labels_position = labels_position.toLowerCase ();
         if (debug[0]) {
            console.log ('[process_qwizzled] labels_position:', labels_position);
         }
      }
   }

   // Begin with standard question div, plus beginning of layout table --
   // "canvas" on left, labels on right, and feedback below both.
   // canvas div will get put into <td>...</td>.
   var new_htm  = '<div id="qwiz' + i_qwiz + '-q' + i_question + '" '
   // DKTMP DEDRAG
   if (! q.qwizard_b) {
      new_htm     +=   'onmouseover="' + qname + '.init_drag_and_drop (this)" ';
   }
   new_htm +=          'class="qwizq qwizzled">'
             +    '<table class="qwizzled_table">'
             +    '<tr>' + question_htm;
   if (debug[0]) {
      console.log ('[process_qwizzled] new_htm: ', new_htm);
   }

   // Turn "canvas" div into table cell.  Find extent of div.
   var canvas_div_pos = new_htm.indexOf ('<div class="qwizzled_canvas');
   if (canvas_div_pos == -1) {
      errmsgs.push (T ('Did not find target "drop-zones" for labels.  Please check that all labels and target "drop zones" were correctly processed and saved during the edit of this page.') + '  qwiz ' + (i_qwiz + 1) + ', ' + T ('question') + ' ' + (i_question + 1));
      return '';
   }
   var div_html = qqc.find_matching_block (new_htm.substr (canvas_div_pos));
   if (! div_html) {
      errmsgs.push ('Did not find end of image area.  Please check that all labels and target "drop zones" were correctly processed and saved during the edit of this page.');
      return '';
   }
   if (set_qwizard_data_b) {
      qw.questions_cards[i_question].type = 'labeled_diagram';
      qw.questions_cards[i_question].question_text = div_html;
      qw.questions_cards[i_question].labels = [];
      qw.questions_cards[i_question].feedback_corrects = [];
      qw.questions_cards[i_question].feedback_incorrects = [];
   }
   var remaining_htm = new_htm.substr (canvas_div_pos + div_html.length);
   new_htm = new_htm.substr (0, canvas_div_pos + div_html.length);

   // Wrap qwizzled_canvas div in <td>...</td>.  Add id to be able to identify
   // qwizard tinyMCE editor.  Add similar class for sake of
   // qwizard.init_tinymce ().  Keep remaining classes.
   var qwizq_id = 'qwizzled_canvas-qwiz' + i_qwiz + '-q' + i_question;
   var td_canvas = '<td><div id="' + qwizq_id + '"' + div_html.substring (4) + '</td>';
   td_canvas = td_canvas.replace ('class="', 'class="' + qwizq_id + ' ');
   // DKTMP - q_and_a_text

   // Add on label cell and feedback cell.
   var td_labels_style = '';
   if (labels_position == 'left') {
      td_labels_style = ' style="padding-right: 5px;"'
   }
   var td_labels_add_class = '';
   if (labels_position != 'top' && labels_position != 'bottom') {
      td_labels_add_class = ' qwizzled_labels_left_right';
   }
   var td_labels   = '<td class="qwizzled_labels' + td_labels_add_class + '"' + td_labels_style + '>'
                   +    '<div class="qwizzled_labels_border">'
                   +        'Q-LABELS-Q'
                   +        '<div style="clear: both;"></div>\n'
                   +    '</div>'
                   + '</td>';
   var td_feedback = '<td class="qwizzled_feedback" colspan="2">QWIZZLED-FEEDBACK-Q</td>';
                 //+ '</tr>'
                 //+ '</table>';

   // Different table setups (after first "<tr">, already in new_htm, above.
   var table_html;
   if (labels_position == "top") {
      table_html =            td_labels + '</tr>'
                   + '<tr>' + td_canvas + '</tr>';
   } else if (labels_position == "bottom") {
      table_html =            td_canvas + '</tr>'
                   + '<tr>' + td_labels + '</tr>';
   } else if (labels_position == "left") {
      table_html =            td_labels + td_canvas + '</tr>';
                   + '<tr>' + td_canvas + '</tr>';
   } else {

      // Default ("right").
      table_html =            td_canvas + td_labels + '</tr>';
                   + '<tr>' + td_canvas + '</tr>';
   }
   if (debug[0]) {
      console.log ('[process_qwizzled] table_html.substr (0, 100):', table_html.substr (0, 100));
   }

   // Feedback is always below.  Finish table.
   table_html +=      '<tr>' + td_feedback + '</tr>'
                 + '</table>';

   new_htm = new_htm.replace (div_html, table_html);

   // Take out the (possibly "encoded", if old style) [q].
   new_htm = new_htm.replace (/\[(<code><\/code>)*q[^\]]*\]/, '');

   if (debug[0]) {
      console.log ('[process_qwizzled] new_htm:', new_htm);
      console.log ('[process_qwizzled] remaining_htm:', remaining_htm);
   }

   // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
   // Process labels and feedback -- feedback is optional, but must immediately
   // follow label, if given.  Do label by label -- look for feedback associated
   // with each.  First take out [<code></code>l] (old style) or [l].
   remaining_htm = remaining_htm.replace (/\[(<code><\/code>)*l\]/gm, '');
   var label_divs = [];
   var i_label = 0;
   while (true) {
      var label_div_pos = remaining_htm.search (/<div[^>]+class=".*?qwizzled_label/m);
      if (label_div_pos == -1) {
         break;
      }
      var label_div = qqc.find_matching_block (remaining_htm.substr (label_div_pos));
      if (debug[0]) {
         console.log ('[process_qwizzled] label_div:', label_div);
      }

      // Number the labels with id.  Make bulleted list.  Skip initial <div>
      // new opening div with id, here), but keep closing </div>.
      var new_label_div = '<li><div id="label-qwiz' + i_qwiz + '-q' + i_question + '-a' + i_label + '"'
                          + label_div.substr (4) + '</li>';
      label_divs.push (new_label_div);
      if (set_qwizard_data_b) {
         qw.questions_cards[i_question].labels.push (label_div);
      }

      remaining_htm = remaining_htm.replace (label_div, '');
      i_label++;
   }
   if (debug[0]) {
      console.log ('[process_qwizzled] label_divs:', label_divs);
   }

   // Put labels in labels area.
   var label_head =   '<p class="qwizzled_label_head qwizzled_label_head_standard">Move each item to its correct <span class="qwizzled_target_border">place</span></p>\n' 
                    + '<p class="qwizzled_label_head qwizzled_label_head_mobile">Click an item, then its correct <span class="qwizzled_target_border">place</span></p>\n' 
                    + '<p class="qwizzled_label_head qwizzled_label_head_label_clicked">Click the correct <span class="qwizzled_target_border">place</span> for the label</p>';
   var ul;
   if (labels_position == "top" || labels_position == "bottom") {
      ul = '<ul class="qwizzled_labels qwizzled_labels_inline">';
   } else {
      ul = '<ul class="qwizzled_labels qwizzled_labels_std">';
   }
   new_htm = new_htm.replace ('Q-LABELS-Q', label_head + ul + label_divs.join ('\n') + '</ul>');

   // ..........................................................................
   // Process feedback -- [f*] (label correctly placed) and [fx] (label not
   // correctly placed).
   var feedback_html = remaining_htm;
   var feedback_divs = [];
   var feedback_start_tags = ['[f*]', '[fx]'];
   var feedback_next_tags =  ['[f*]', '[fx]', '[x]'];
   var i_item = 0;
   while (true) {
      var feedback_item_html
                       = qqc.parse_html_block (feedback_html, feedback_start_tags,
                                               feedback_next_tags);
      if (feedback_item_html == 'NA') {
         break;
      }

      // Take item out of remaining html.
      feedback_html = feedback_html.replace (feedback_item_html, '');

      // Flag which are correct and which not.
      var c_x;
      if (feedback_item_html.search (/\[f\*\]/) != -1) {
         c_x = 'c';
      } else {
         c_x = 'x';
      }

      // Delete [f*] or [fx].
      feedback_item_html = feedback_item_html.replace (/\[f[\*x]\]/, '');

      if (debug[2]) {
         console.log ('[process_qwizzled] feedback_item_html: ', feedback_item_html);
      }

      // Create a div for each.
      feedback_divs.push (
            create_feedback_div_html (i_qwiz, i_question, parseInt (i_item/2, 10),
                                      feedback_item_html, c_x)
      );

      if (set_qwizard_data_b) {
         if (c_x == 'c') {
            qw.questions_cards[i_question].feedback_corrects.push (feedback_item_html);
         } else {
            qw.questions_cards[i_question].feedback_incorrects.push (feedback_item_html);
         }
      }
      i_item++;
   }
   if (debug[0]) {
      console.log ('[process_qwizzled] feedback_divs:', feedback_divs);
      console.log ('[process_qwizzled] feedback_html:', feedback_html);
   }

   // Take the question closing div off the last item.
   var n_feedback_items = feedback_divs.length;
   feedback_divs[n_feedback_items - 1] = feedback_divs[n_feedback_items - 1].replace (/<\/div>\s*/m, '')

   // Check that number of feedback items corresponds to number of labels.
   var n_labels = label_divs.length;
   if (n_labels*2 != n_feedback_items) {
      errmsgs.push (T ('Number of feedback items') + ' (' + n_feedback_items + ') ' + T ('does not match number of labels') + ' (' + n_labels + '): qwiz ' + (1 + i_qwiz) + ', question ' + (1 + i_question) + ' labeled diagram' + '\n'
                    + '(' + T ('There should be two feedback items -- correct and incorrect -- for each label') + ')');
   }

   // Add finished-diagram feedback div.
   var htm = '<div class="qwiz-feedback" id="qwiz' + i_qwiz + '-q' + i_question + '-ff"></div>\n';
   feedback_divs.push (htm);

   new_htm = new_htm.replace ('QWIZZLED-FEEDBACK-Q', feedback_divs.join (''));

   // Close question div.
   new_htm += '</div>\n';

   if (set_qwizard_data_b) {
      qw.questions_cards[i_question].n_labels = n_labels;
   }

   if (debug[2]) {
      console.log ('[process_qwizzled] new_htm: ', new_htm)
   }

   return new_htm;
}


// -----------------------------------------------------------------------------
this.init_drag_and_drop = function (qwizq_elm) {

   if (debug[0]) {
      console.log ('[init_drag_and_drop] qwizq_elm:', qwizq_elm);
   }
   var $qwizq = $ (qwizq_elm);

   // Do this only once for this qwizzled question.  Remove attribute.
   $qwizq.removeAttr ('onmouseover');

   $qwizq.find ('td.qwizzled_labels div.qwizzled_label').each (function () {
      if (debug[0] || debug[8]) {
         console.log ('[init_drag_and_drop] $ (this):', $ (this));
         console.log ('[init_drag_and_drop] \'td.qwizzled_labels div.qwizzled_label\':', $ (this)[0]);
      }

      // Save position relative to document with label.
      var label_offset = $ (this).offset ();
      if (debug[8]) {
         console.log ('[init_drag_and_drop] label_offset:', label_offset);
      }
      $ (this).data ('label_x', label_offset.left).data ('label_y', label_offset.top);

      $ (this).draggable ({
         containment:   $ (this).parents ('table.qwizzled_table'),
         start:         function (event, ui) {

                           // If label previously incorrectly placed, reset
                           // things ("try again").
                           q.label_dragstart ($ (this));
                        },
         /* DKTMP DEDRAG
         stop:          function (event, ui) {
                           // If qwizard, and has a tooltip, re-enable.
                           if (q.qwizard_b) {
                              $qwizzled_highlight_label = $ (this).children ();
                              if ($qwizzled_highlight_label.tooltip ('instance')) {
                                 if (debug[8]) {
                                    console.log ('[init_drag_and_drop > drag stop] $qwizzled_highlight_label:', $qwizzled_highlight_label);
                                 }
                                 $qwizzled_highlight_label.tooltip ('enable');
                              }
                           }
                        },
         */
      }).addClass ('qwizzled_label_unplaced');
   });

   // Targets as drop zones.  Droppable when pointer over target.
   $qwizq.find ('.qwizzled_target').droppable ({
      accept:           '.qwizzled_label',
      hoverClass:       'qwizzled_target_hover',
      drop:             function (event, ui) {

                           // Provide feedback, next-step options.
                           q.label_dropped ($ (this), ui.draggable);
                        },
      tolerance:        'pointer',
   });
}


// -----------------------------------------------------------------------------
// If [h] (or [H]), capture header tag/text, including opening tags before
// [h], up to intro ([i]) if allowed, or question ([q]).  Delete header from
// intro.
function process_header (htm, i_qwiz, i_question, intro_b) {
   var qtags = ['[h]'];
   var qnext_tags = ['[q]', '[q ', '<div class="qwizzled_question'];
   if (intro_b != undefined) {
      qnext_tags.push ('[i]');
   }

   // Global variable.  Limit to first 1000 characters.
   header_html = qqc.parse_html_block (htm.substr (0, 1000), qtags, qnext_tags, true);
   if (header_html != 'NA' && header_html != '') {

      // Error if text before [h].  Exclude < br...> or <img...> or
      // <span class="qwizard_placeholder">
      var htmx = htm.substr (0, 200);
      htmx = qqc.trim (htmx);
      var i_pos = qqc.opening_tag_shortcode_pos ('[h]', htmx);
      htmx = htmx.substr (i_pos, 5);
      var header_htmlx = header_html.replace (/<br[^>]*>/g, '');
      header_htmlx = qqc.trim (header_htmlx).substr (0, 5);
      if (htmx != header_htmlx) {
         errmsgs.push (T ('Text before header') + ' [h] - qwiz ' + (i_qwiz + 1));
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

   return htm;
}


// -----------------------------------------------------------------------------
this.display_summary_and_exit = function (i_qwiz) {

   var report_html = [];

   // Overall.
   var n_questions = qwizdata[i_qwiz].n_questions;
   var n_correct   = qwizdata[i_qwiz].n_correct;
   var n_incorrect = qwizdata[i_qwiz].n_incorrect;

   if (qwizdata[i_qwiz].repeat_incorrect_b) {
      
      var quiz_set = qwizdata[i_qwiz].use_dataset && qwizdata[i_qwiz].dataset_intro_f ? 'set' : 'quiz';
      report_html.push ('<p><b>' + T ('Congratulations, you\'re done!') + '</b></p>');
      if (n_incorrect == 0) {
         report_html.push ('<p>' + T ('In this') + ' ' + qqc.number_to_word (n_questions) + '-' + T ('question') + ' ' + T (quiz_set) + ', ' + T ('you answered every question correctly on the first try!') + '</p>');
      } else {
         report_html.push ('<p>' + T('In finishing this') + ' ' + qqc.number_to_word (n_questions) + '-' + T ('question') + ' ' + T (quiz_set) + ', ' + T ('you entered') + ' ' + qqc.number_to_word (n_incorrect) + ' ' + T ('incorrect') + ' ' + Tplural ('answer', 'answers', n_incorrect) + '.</p>');
      }
   } else {
      if (n_incorrect == 0) {
         report_html.push ('<p>' + T ('Congratulations, you answered all questions correctly') + '.</p>');
      } else {
         report_html.push ('<p>' + T ('Your score is') + ' ' + qqc.number_to_word (n_correct) + ' ' + T ('out of') + ' ' + qqc.number_to_word (n_questions) + ' ' + T ('questions') + '.</p>');
      }
   }

   // By topic.
   var n_topics = 0;
   if (qwizdata[i_qwiz].topics) {
      n_topics = qwizdata[i_qwiz].topics.length;
   }
   if (n_topics == 1) {
      var topic = qwizdata[i_qwiz].topics[0];
      if (topic != 'Other') {
         var all_both_n;
         if (n_questions == 1) {
            report_html.push ('<p>The question was about topic &ldquo;' + topic + '.&rdquo;</p>');
         } else {

            if (n_questions == 2) {
               all_both_n = T ('Both');
            } else {
               all_both_n = T ('All') + ' '+ qqc.number_to_word (n_questions);
            }
            report_html.push ('<p>' + all_both_n + ' ' + Tplural ('question', 'questions', n_questions) + ' were about topic &ldquo;' + topic + '.&rdquo;</p>');
         }
      }
   } else if (n_topics > 1 && n_incorrect > 0) {

      // We'll show only topics where user got some incorrect.  See which.
      var incorrect_topics = [];
      for (var i_topic=0; i_topic<n_topics; i_topic++) {
         var topic = qwizdata[i_qwiz].topics[i_topic];
         var n_topic_correct = qwizdata[i_qwiz].topic_statistics[topic].n_correct;
         var n_topic_incorrect = qwizdata[i_qwiz].topic_statistics[topic].n_incorrect;
         var n_topic_items = n_topic_correct + n_topic_incorrect;
         if (n_topic_incorrect > 0) {
            var topic_text = '<strong>' + topic + '</strong>: ' + qqc.number_to_word (n_topic_items) + ' ' + Tplural ('question', 'questions', n_topic_items) + ', ' + qqc.number_to_word (n_topic_incorrect) + ' ' + T ('incorrect');
            incorrect_topics.push (topic_text);
         }
      }
      var n_incorrect_topics = incorrect_topics.length;
      var topic_list_html = '<p class="topic_list">';
      if (n_incorrect_topics > 1) {
         topic_list_html += T ('These are the topics of questions that you answered incorrectly') + ':<br />';
         for (var i=0; i<n_incorrect_topics; i++) {
            incorrect_topics[i] = '&bull; ' + incorrect_topics[i];
         }
      } else {
         topic_list_html += T ('The topic of the only question you answered incorrectly is' + ' ');
      }
      topic_list_html += incorrect_topics.join ('; ') + '.';
      topic_list_html += '</p>';
      report_html.push (topic_list_html);
   }

   // Place in report div.
   $ ('#summary_report-qwiz' + i_qwiz).html (report_html.join ('\n'));

   // If qwizard, and editor hasn't been initiated for exit text, do so.
   var $summary = $ ('#summary-qwiz' + i_qwiz);
   if (q.qwizard_b) {
      if ($summary.find ('div[contenteditable]').length == 0) {
         qwizard.init_tinymce ('div#qwiz_exit-qwiz' + i_qwiz + '.qwiz_editable');
      }
   }

   // Show summary div.  Set i_question as indicator for re-display if login.
   var $qwiz_img = $summary.find ('input[name="qwiz_img"]');
   if ($qwiz_img.length) {
      $qwiz_img.changeElements ('img');
   }
   $summary.show ();
   qwizdata[i_qwiz].i_question = n_questions;
}


// -----------------------------------------------------------------------------
function check_qwiz_tag_pairs (htm) {
   var new_htm = '';

   // Match "[qwiz]" or "[/qwiz]".
   var matches = htm.match (/\[qwiz|\[\/qwiz\]/gm);
   if (matches) {
      var n_tags = matches.length;
      var error_b = false;

      if (n_tags % 2 != 0) {
         error_b = true;
      } else {

         // Check proper pairs.
         for (var i=0; i<n_tags; i++) {
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
      if (error_b) {

         // If we're inside an excerpt, no error.  Delete from '[qwiz]' up to
         // '<p class="more-link' if possible,  In any event non-null return
         // signals not to process.
         if (htm.indexOf ('more-link') != -1) {

            var pos_qwiz = htm.indexOf ('[qwiz');
            var pos_more = htm.search (/<[pa] class="more-link/);
            if (pos_more != -1) {
               new_htm = htm.substring (0, pos_qwiz) + htm.substr (pos_more);
            } else {
               new_htm = htm;
            }
         } else {
            alert (T ('Unmatched [qwiz] - [/qwiz] pairs.'));
         }
      }
   }

   return new_htm;
}


// -----------------------------------------------------------------------------
function create_radio_button_html (i_qwiz, i_question, i_choice, choice_tag) {
   var htm = '';

   // Data attribute to mark correct choice.
   var data_correct = '';
   var correct = 0;
   if (choice_tag == '[c*]') {
      data_correct = 'data-correct="1" ';
      correct = 1;
   }
   var title = '';
   var onclick = ' onclick="' + qname + '.process_choice (\'qwiz' + i_qwiz + '-q' + i_question + '-a' + i_choice + '\')"';
   if (q.qwizard_b) {
      title = ' title="Click to see feedback for this answer choice"';
   }
   htm += '<input type="radio" id="radio-qwiz' + i_qwiz + '-q' + i_question + '-a' + i_choice + '" name="qwiz' + i_qwiz + '-q' + i_question + '" ' + data_correct + ' style="border: none;"' + onclick + title + ' />\n';

   if (debug[1]) {
      console.log ('[create_radio_button_html] htm: ', htm);
   }

   return {'correct': correct,
           'htm':     htm};
}


// -----------------------------------------------------------------------------
this.process_choice = function (feedback_id, correct_b, got_it_more_practice_b) {

   // Hide others, show this one.
   // feedback_id looks like:  qwiz0-q0-a0   or  mobile_qwiz0-q0-a0
   //                          (qwiz #, question #, answer #).
   // Identify quiz and question.  Greedy search matches to final "-".
   var matches = feedback_id.match (/(.*)-/);
   var qwizq_id = matches[1];

   // Qwiz number.  Non-greedy search.
   var qwiz_id = feedback_id.match (/(qwiz.*?)-/)[1];
   i_qwiz = parseInt (qwiz_id.substr (4), 10);
   if (debug[0]) {
      console.log ('[process_choice] feedback_id: ', feedback_id, ', qwizq_id: ', qwizq_id, ', i_qwiz: ', i_qwiz);
   }

   // If reporting usage, and haven't done so already for this quiz, increment
   // counter.
   if (post_id != 0 && ! qwizdata[i_qwiz].usage_incremented_b) {
      qqc.increment_usage ('quiz', i_qwiz, post_id);
      qwizdata[i_qwiz].usage_incremented_b = true;
   }

   // If recording and this is first interaction (no-intro, single-question
   // quiz) record as start time.
   if (qwizdata[i_qwiz].record_start_b && document_qwiz_user_logged_in_b) {
      qwizdata[i_qwiz].record_start_b = false;
      var data = {qrecord_id_ok: qwizdata[i_qwiz].qrecord_id_ok, type: 'start'};
      qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'record_response', data);
   }

   // If mobile, hide choices except the one picked, then show feedback.
   var disabled;
   var mobile_b = feedback_id.substr (0, 6) == 'mobile';
   if (mobile_b) {
      $ ('#' + qwizq_id + ' li.mobile_choice').hide ();
      $ ('#' + qwizq_id + ' .qwiz-feedback').hide ();
      $ ('#' + feedback_id).show ();
      $choice = $ ('#choice-' + feedback_id);
      correct_b = !! $choice.data ('correct');
      $choice.show ();
      disabled = '';
   } else {
      disabled = $ ('input[name=' + qwizq_id + ']').attr ('disabled');
   }

   // Don't do if already disabled.
   if (disabled != 'disabled') {

      // If mobile, process regular choices, too, in case user exits mobile
      // mode.  mobile_qwiz0...
      //        0----+----1
      if (mobile_b) {
         feedback_id = feedback_id.substr (7);
         qwizq_id    = qwizq_id.substr (7);
      }
      $ ('#' + qwizq_id + ' .qwiz-feedback').hide ();
      $ ('#' + feedback_id).show ();

      // In case clicked on text rather than radio, show radio as clicked.
      // If "show-the-answer" question, substituted button for radio, so skip.
      // In "show-the-answer" case, correct_b set via argument.
      var elm = document.getElementById ('radio-' + feedback_id);
      if (elm) {

         elm.checked = true;

         // Don't disable further radio clicks if qwizard.
         if (! q.qwizard_b) {
            $ ('input[name=' + qwizq_id + ']').attr ('disabled', true);
         }

         // Also, don't show pointer cursor on paragraphs, and turn off highlighting.
         $ ('.choices-' + qwizq_id).on('mouseover', function () {
            $ (this).css ({'cursor': 'text', 'color': 'black'})
         });

         // undefined -> boolean false.
         correct_b = !! $ ('#radio-' + feedback_id).data ('correct');
      }

      // Record statistics.  Don't do if qwizard.
      var i_question = feedback_id.match (/-q([0-9]+)-/)[1];
      if (! q.qwizard_b) {
         qwizdata[i_qwiz].answered_correctly[i_question] = correct_b;
         if (correct_b) {
            qwizdata[i_qwiz].n_correct++;
         } else {

            // Record number of incorrect responses.
            qwizdata[i_qwiz].n_incorrect++;
         }
      }

      // If recording, jjax call.
      if (qwizdata[i_qwiz].qrecord_id && document_qwiz_user_logged_in_b) {

         // Include which choice was made and text of choice.  Take tags out
         // of choice text and replace non-breaking spaces and EOLs with space,
         // multiple spaces with single space, trim.
         var i_choice = feedback_id.match(/-a([0-9]+)$/)[1];
         var choice_text = $ ('#' + qwizq_id + ' .choice-' + feedback_id).html ();
         if (choice_text) {
            choice_text = qqc.remove_tags_eols (choice_text);
         } else {

            // Must be a "show-the-answer" question/button.  Get button text
            // and feedback text.
            choice_text = qqc.remove_tags_eols ($ ('#' + qwizq_id + ' button.qbutton').html ())
                          + '\t'
                          + qqc.remove_tags_eols ($ ('#' + feedback_id).html ());
         }

         // Delay this a bit (in case race with record-start, above).
         var delay_jjax = function () {
            var data = {q_and_a_text: qwizdata[i_qwiz].q_and_a_text[i_question],
                        i_question:   qwizdata[i_qwiz].dataset_id[i_question],
                        unit:         qwizdata[i_qwiz].unit[i_question],
                        type:         'multiple_choice',
                        response:     choice_text,
                        i_choice:     i_choice,
                        correct_b:    correct_b ? 1 : ''};
            qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'record_response', data);
         }
         setTimeout (delay_jjax, 1000);
      }

      // If topics, statistics by topics this question.
      update_topic_statistics (i_qwiz, i_question, correct_b);

      // If no separate intro page, hide qwiz icon now.
      if (i_question == 0 && (q.no_intro_b[i_qwiz]
                                        || qwizdata[i_qwiz].n_questions == 1)) {
         $ ('div.qwiz div#icon_qwiz' + i_qwiz).hide ();
      }

      // Update progress and show next button -- only if more than one question.
      // If "show-the-answer" question (user clicked either "Got it" or "Need
      // more practice"), update progress and move to next question.
      if (qwizdata[i_qwiz].n_questions > 1 || qwizdata[i_qwiz].use_dataset) {
         if (got_it_more_practice_b) {

            // Hide "Got it" and "Need more practice" buttons.
            $ ('#' + document_qwiz_mobile + 'show_answer_got_it_or_not-qwiz' + i_qwiz + '-q' + i_question).hide ();

            // Show the "show-the-answer" button in case come around again.
            $ ('#qwiz' + i_qwiz + '-q' + i_question).find ('button.show_the_answer').show ();

            // Do this later if qwizard.
            if (! q.qwizard_b) {
               q.display_progress (i_qwiz);
            }
            q.next_question (i_qwiz);
         } else {
            update_progress_show_next (i_qwiz);
         }
      }
   }
};


// -----------------------------------------------------------------------------
// "Show-the-answer" button clicked (in a multi-question quiz).  Show feedback
// and present "Got it" and "Need more practice" buttons in place of "Next
// question".
this.show_answer_got_it_or_not = function (i_qwiz, i_question, show_me_button_el) {

   // Hide "show the answer" button.
   if (! q.qwizard_b) {
      show_me_button_el.style.display = 'none';
   }

   // Show feedback.
   $ ('#' + document_qwiz_mobile + 'qwiz' + i_qwiz + '-q' + i_question + '-a0').show ();

   // Show "Got it" and "Need more practice" buttons.
   $ ('#' + document_qwiz_mobile + 'show_answer_got_it_or_not-qwiz' + i_qwiz + '-q' + i_question).show ();
}


// -----------------------------------------------------------------------------
function create_got_it_or_not (mobile_, i_qwiz, i_question) {

   var htm = '';
   htm += '<div id="' + mobile_ + 'show_answer_got_it_or_not-qwiz' + i_qwiz + '-q' + i_question + '" class="show_answer_got_it_or_not">\n';
   htm +=    '<button class="qbutton" onclick="' + qname + '.process_choice (\'qwiz' + i_qwiz + '-q' + i_question + '-a0\', true, true)">\n';
   htm +=       T ('Got it!');
   htm +=    '</button>\n';
   htm +=    '&emsp;';
   htm +=    '<button class="qbutton" onclick="' + qname + '.process_choice (\'qwiz' + i_qwiz + '-q' + i_question + '-a0\', false, true)">\n';
   htm +=       T ('Need more practice');
   htm +=    '</button>\n';
   htm += '</div>\n';

   return htm;
}


// -----------------------------------------------------------------------------
function update_topic_statistics (i_qwiz, i_question, correct_b) {
   var question_topics = qwizdata[i_qwiz].question_topics[i_question];
   if (question_topics) {
      for (var ii=0; ii<question_topics.length; ii++) {
         var topic = question_topics[ii];
         if (correct_b) {
            qwizdata[i_qwiz].topic_statistics[topic].n_correct++;
         } else {
            qwizdata[i_qwiz].topic_statistics[topic].n_incorrect++;
         }
      }
   }
}


// -----------------------------------------------------------------------------
function update_progress_show_next (i_qwiz) {
   if (qwizdata[i_qwiz].n_questions > 1 || qwizdata[i_qwiz].use_dataset) {
      q.display_progress (i_qwiz);

      // "Next" button.  If finished, change text.
      var n_done = qwizdata[i_qwiz].n_correct;
      if (! qwizdata[i_qwiz].repeat_incorrect_b) {
         n_done += qwizdata[i_qwiz].n_incorrect;
      }
      if (n_done == qwizdata[i_qwiz].n_questions) {
         $ ('#next_button_text-qwiz' + i_qwiz).html (T ('View summary report'));

         // If recording, and either a use_dataset="..." quiz (in which case
         // the php script will check whether all questions have now been 
         // completed correctly) or a regular quiz where all questions have
         // been answered correctly, then check -- and if all questions 
         // correct -- record first completion time for sake of leaderboard
         // data.  Wait a bit so previous correct answer can be recorded.
         if (qwizdata[i_qwiz].qrecord_id && document_qwiz_user_logged_in_b) {
            if (   qwizdata[i_qwiz].use_dataset 
                || qwizdata[i_qwiz].repeat_incorrect_b
                || qwizdata[i_qwiz].n_incorrect == 0  ) {

               // Closure.
               var wait_completed = function () {
                  var data = {type: 'completed'};
                  qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'record_response', data);
               }
               setTimeout (wait_completed, 2000);
            }
         }
      }

      // If mobile, update position in case some window change (e.g.,
      // orientation).
      position_show_next_button (i_qwiz);

      // Record state.
      qwizdata[i_qwiz].next_button_show_b = true;
   }
}


// -----------------------------------------------------------------------------
this.display_progress = function (i_qwiz, came_from_start_b) {
   if (debug[0]) {
      console.log ('[display_progress] qwizdata[i_qwiz].i_question:', qwizdata[i_qwiz].i_question, ', came_from_start_b:', came_from_start_b);
   }

   var progress_html;
   var n_attempts = qwizdata[i_qwiz].n_correct + qwizdata[i_qwiz].n_incorrect;
   var n_done = qwizdata[i_qwiz].n_correct;
   if (! qwizdata[i_qwiz].repeat_incorrect_b) {
      n_done += qwizdata[i_qwiz].n_incorrect;
   }

   if (q.qwizard_b) {
      if (qwizdata[i_qwiz].i_question == -1 && ! came_from_start_b) {
         progress_html = T ('Questions in this quiz:') + ' ' + qwizdata[i_qwiz].n_questions;
      } else {
         var display_i_question = qwizdata[i_qwiz].i_question + 1;
         if (came_from_start_b) {
            display_i_question++;
         }
         progress_html = 'Question ' + display_i_question + ' of ' + qwizdata[i_qwiz].n_questions;
      }
   } else {
      var n_to_go = qwizdata[i_qwiz].n_questions - n_done;
      if (n_attempts == 0) {
         progress_html = T ('Questions in this quiz:') + ' ' + n_to_go;
      } else {
         var questions;
         var incorrect;
         if (document_qwiz_mobile) {
            questions = T ('Qs');
            incorrect = T ('not');
         } else {
            questions = T ('questions');
            incorrect = T ('incorrect');
         }
         progress_html = qwizdata[i_qwiz].n_questions + ' ' + questions + ', ' + n_attempts + ' ' + Tplural ('response', 'responses', n_attempts) + ', ' + qwizdata[i_qwiz].n_correct + ' ' + T ('correct') + ', ' + qwizdata[i_qwiz].n_incorrect + ' ' + incorrect + ', ' + n_to_go + ' ' + T ('to go');
      }
   }
   $ ('#progress-qwiz' + i_qwiz).html (progress_html).show ();
}


// -----------------------------------------------------------------------------
function display_qwizzled_progress (i_qwiz) {

   var i_question  = qwizdata[i_qwiz].i_question + 1;
   var n_questions = qwizdata[i_qwiz].n_questions;
   var progress_html = '';
   if (n_questions > 1) {
      progress_html = 'Q #' + i_question + '/' + n_questions + '; ';
   }
   progress_html += 'Correctly labeled ' + qwizdata[i_qwiz].n_labels_correct + ' out of ' + qwizdata[i_qwiz].n_label_targets + ' items';

   // Do show () in case single-question qwiz.
   $ ('#progress-qwiz' + i_qwiz).html (progress_html).show ();
}


// -----------------------------------------------------------------------------
function create_feedback_div_html (i_qwiz, i_question, i_item, item, c_x) {

   var local_c_x = '';
   if (c_x != undefined) {
      local_c_x = c_x;
   }
   var htm = '<div id="qwiz' + i_qwiz + '-q' + i_question + '-a' + i_item + local_c_x + '" class="qwiz-feedback">\n';
   if (! local_c_x) {
      htm += '<hr style="margin: 0px;" />\n';
   }
   var classname = '';
   if (local_c_x) {

      // Qwizzled feedback.
      if (local_c_x == 'c') {
         classname = 'qwizzled-correct_feedback';
      } else {
         classname = 'qwizzled-incorrect_feedback';
      }
      htm += '<div class="' + classname + ' qwiz_editable" data-i_choice="' + i_item + '">' + item + '</div>';
   } else {

      // Multiple-choice question feedback.
      htm += '<span class="qwiz-feedback-span qwiz_editable" data-i_choice="' + i_item + '">' + item + '</span>';
   }

   // Include clearing div in case image floating left or right.
   htm += '<div style="clear: both;"></div>\n';
   htm += '</div>\n';
   if (debug[2]) {
      console.log ('[create_feedback_div_html] htm: ', htm)
   }

   return htm;
}


// -----------------------------------------------------------------------------
this.canned_feedback = function (correct_b) {

   var response;
   if (correct_b) {
      var i = Math.floor (Math.random () * correct.length);
      response = correct[i];
   } else {
      var i = Math.floor (Math.random () * incorrect.length);
      response = incorrect[i];
   }
   response = '<p><strong>' + response + '</strong></p>';

   if (debug[0]) {
      console.log ('[canned_feedback] response:', response);
   }
   return response;
}


// -----------------------------------------------------------------------------
var find_matching_terms = function (request, response) {

   // If no separate intro page, and this is first question, hide qwiz icon.
   var i_question = qwizdata[textentry_i_qwiz].i_question;
   if (i_question == 0 && (   q.no_intro_b[textentry_i_qwiz]
                           || qwizdata[textentry_i_qwiz].n_questions == 1)) {
      $ ('div.qwiz div#icon_qwiz' + textentry_i_qwiz).hide ();
   }

   var entry = request.term.toLowerCase ();
   var entry_metaphone = qqc.metaphone (entry);
   if (debug[6]) {
      console.log ('[find_matching_terms] entry_metaphone; ', entry_metaphone);
   }

   // See if first character of entry metaphone matches first character of any
   // answer metaphone.  If so, determine shortest answer metaphone that
   // matches.
   var required_entry_length = 100;
   var required_metaphone_length = 100;
   var minlength = qwizdata[textentry_i_qwiz].textentry[i_question].textentry_minlength;
   for (var i=0; i<textentry_answer_metaphones[textentry_i_qwiz].length; i++) {
      if (entry[0] == textentry_answers[textentry_i_qwiz][i][0].toLowerCase ()) {
         required_entry_length = Math.min (required_entry_length, textentry_answers[textentry_i_qwiz][i].length);
         if (debug[6]) {
            console.log ('[find_matching_terms] entry[0]:', entry[0], ', textentry_answers[textentry_i_qwiz][i][0]:', textentry_answers[textentry_i_qwiz][i][0]);
         }
      }
      if (entry_metaphone[0] == textentry_answer_metaphones[textentry_i_qwiz][i][0]) {
         required_metaphone_length = Math.min (required_metaphone_length, textentry_answer_metaphones[textentry_i_qwiz][i].length);
         if (debug[6]) {
            console.log ('[find_matching_terms] textentry_answer_metaphones[textentry_i_qwiz][i]:', textentry_answer_metaphones[textentry_i_qwiz][i], ', required_metaphone_length:', required_metaphone_length);
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
      textentry_matches[textentry_i_qwiz] = [];
      lc_textentry_matches[textentry_i_qwiz] = [];
      find_matching_terms2 (response, deduped_entry);

   } else {
      if (debug[6]) {
         console.log ('[find_matching_terms] request.term:', request.term,', entry_metaphone:', entry_metaphone, ', entry_metaphone.length:', entry_metaphone.length);
      }

      // Combine words from terms lists with those from full dictionary.  First,
      // terms lists.
      textentry_matches[textentry_i_qwiz]
            = $.map (current_question_textentry_terms_metaphones[textentry_i_qwiz],
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
         console.log ('[find_matching_terms] textentry_matches[textentry_i_qwiz]:', textentry_matches[textentry_i_qwiz])
      }

      // Add dictionary result, unless flag set.
      if (qwizdata[textentry_i_qwiz].textentry[i_question].use_dict_b) {

         // Add terms to dictionary processing.
         var plural_f = qwizdata[textentry_i_qwiz].textentry[i_question].textentry_plural_b ? 1 : 0;
         var data =   'action='           + 'textentry_suggestions'
                    + '&entry='           + encodeURIComponent (entry)
                    + '&entry_metaphone=' + encodeURIComponent (entry_metaphone)
                    + '&n_hints='         + qwizdata[textentry_i_qwiz].textentry_n_hints
                    + '&terms='           + encodeURIComponent (JSON.stringify (textentry_matches[textentry_i_qwiz]))
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
                           textentry_matches[textentry_i_qwiz] = data;
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

   if (textentry_matches[textentry_i_qwiz].length) {
      lc_textentry_matches[textentry_i_qwiz]
         = textentry_matches[textentry_i_qwiz].map (function (item) {
                                                       return item.toLowerCase ();
                                                    });
      if (debug[6]) {
         console.log ('[find_matching_terms2] textentry_matches[textentry_i_qwiz]:', textentry_matches[textentry_i_qwiz]);
      }
   }

   // If entry length is minlength (default 3) or more, and matches-list does
   // not include first correct answer, and haven't used up hints, enable hint.
   if (debug[6]) {
      console.log ('[find_matching_terms2] deduped_entry.length: ', deduped_entry.length, ', textentry_matches[textentry_i_qwiz].length: ', textentry_matches[textentry_i_qwiz].length, ', qwizdata[textentry_i_qwiz].textentry_n_hints: ', qwizdata[textentry_i_qwiz].textentry_n_hints);
   }
   var i_question = qwizdata[textentry_i_qwiz].i_question;
   var minlength = qwizdata[textentry_i_qwiz].textentry[i_question].textentry_minlength;
   if (deduped_entry.length >= minlength && qwizdata[textentry_i_qwiz].textentry_n_hints < 5) {
      var lc_first_correct_answer = qwizdata[textentry_i_qwiz].textentry[i_question].first_correct_answer.toLowerCase ();
      if (typeof (lc_textentry_matches[textentry_i_qwiz]) == 'undefined'
            || lc_textentry_matches[textentry_i_qwiz].indexOf (lc_first_correct_answer) == -1) {
         $ ('#textentry_check_answer_div-qwiz' + textentry_i_qwiz + '-q' + i_question + ' button.qwiz_textentry_hint')
            .removeAttr ('disabled')
            .removeClass ('qbutton_disabled')
            .addClass ('qbutton').show ();
         if (q.qwizard_b) {
            $ ('#qwiz' + textentry_i_qwiz + '-q' + i_question + ' .qwiz-feedback').hide ();
         }
      }
   }
   response (textentry_matches[textentry_i_qwiz]);
}


// -----------------------------------------------------------------------------
// When menu closed: if current entry doesn't fully match anything on the last
// set of matches, disable "Check answer".
function menu_closed (e) {

   var lc_entry = e.target.value.toLowerCase ();
   var i_question = qwizdata[textentry_i_qwiz].i_question;

   // Since triggered by keyup, if entry is shorter than number of hints (user
   // has deleted characters), restore to hint value.
   var n_hints = qwizdata[textentry_i_qwiz].textentry_n_hints;
   if (lc_entry.length < n_hints) {
      var textentry_hint_val = qwizdata[textentry_i_qwiz].textentry[i_question].first_correct_answer.substr (0, n_hints);
      e.target.value = textentry_hint_val;
   }

   // Do only if "Check answer" not already disabled.
   if (! qwizdata[textentry_i_qwiz].check_answer_disabled_b) {
      if (debug[6]) {
         console.log ('[menu_closed] textentry_matches[textentry_i_qwiz]: ', textentry_matches[textentry_i_qwiz]);
      }
      if (typeof (lc_textentry_matches[textentry_i_qwiz]) == 'undefined'
           || lc_textentry_matches[textentry_i_qwiz].indexOf (lc_entry) == -1) {
         $ ('#textentry_check_answer_div-qwiz' + textentry_i_qwiz + '-q' + i_question + ' button.textentry_check_answer')
            .removeClass ('qbutton')
            .addClass ('qbutton_disabled')
            .html (qwizdata[textentry_i_qwiz].check_answer);
         qwizdata[textentry_i_qwiz].check_answer_disabled_b = true;
         if (q.qwizard_b) {
            $ ('#qwiz' + textentry_i_qwiz + '-q' + i_question + ' .qwiz-feedback').hide ();
         }
      }
   }

   // Since done on keyup (that is, if any typing), cancel automatic
   // presentation (if in progress) if have minlength characters.
   // Do only if there is a timeout in progress.
   if (show_hint_timeout[textentry_i_qwiz]) {
      var $textentry = $ ('#textentry-qwiz' + textentry_i_qwiz + '-q' + i_question);
      var n_chars = $textentry.val ().length;

      var minlength = qwizdata[textentry_i_qwiz].textentry[i_question].textentry_minlength;
      if (n_chars >= minlength) {
         clearTimeout (show_hint_timeout[textentry_i_qwiz]);
         show_hint_timeout[textentry_i_qwiz] = 0;
      }
   }
}


// -----------------------------------------------------------------------------
// When suggestion menu shown: (1) if the matches list shown includes the first
// correct answer, then set flag that hint not needed; (2) if current entry
// _fully_ matches anything on the matches list shown, then enable "Check
// answer"; otherwise disable "Check answer".
function menu_shown (e) {

   // If recording and this is first interaction (no-intro, single-question
   // quiz), record as start time.
   if (qwizdata[textentry_i_qwiz].record_start_b && document_qwiz_user_logged_in_b) {
      qwizdata[textentry_i_qwiz].record_start_b = false;
      var data = {qrecord_id_ok: qwizdata[textentry_i_qwiz].qrecord_id_ok, type: 'start'};
      qqc.jjax (qname, textentry_i_qwiz, qwizdata[textentry_i_qwiz].qrecord_id, 'record_response', data);
   }

   // Lowercase entry and matches list.
   var lc_entry = e.target.value.toLowerCase ();

   // Does matches list include first correct answer?
   var i_question = qwizdata[textentry_i_qwiz].i_question;
   var lc_first_correct_answer = qwizdata[textentry_i_qwiz].textentry[i_question].first_correct_answer.toLowerCase ();
   if (lc_textentry_matches[textentry_i_qwiz].indexOf (lc_first_correct_answer) != -1) {
      $ ('#textentry_check_answer_div-qwiz' + textentry_i_qwiz + '-q' + i_question + ' button.qwiz_textentry_hint')
         .attr ('disabled', true)
         .removeClass ('qbutton')
         .addClass ('qbutton_disabled');
   }
   if (lc_textentry_matches[textentry_i_qwiz].indexOf (lc_entry) != -1) {
      $ ('#textentry_check_answer_div-qwiz' + textentry_i_qwiz + '-q' + i_question + ' button.textentry_check_answer')
         .removeClass ('qbutton_disabled')
         .addClass ('qbutton')
         .html (T ('Check answer'));
      qwizdata[textentry_i_qwiz].check_answer_disabled_b = false;
   } else {
      $ ('#textentry_check_answer_div-qwiz' + textentry_i_qwiz + '-q' + i_question + ' button.textentry_check_answer')
         .removeClass ('qbutton')
         .addClass ('qbutton_disabled')
         .html (qwizdata[textentry_i_qwiz].check_answer);
      qwizdata[textentry_i_qwiz].check_answer_disabled_b = true;
   }
}


// -----------------------------------------------------------------------------
this.textentry_check_answer = function (i_qwiz, single_char_b, qwizard_i_choice) {
   var i_question = qwizdata[i_qwiz].i_question;
   var $textentry = $ ('#textentry-qwiz' + i_qwiz + '-q' + i_question);
   if (debug[6]) {
      entry = $textentry.val ();
      console.log ('[textentry_check_answer] $textentry.val ():', $textentry.val ());
   }


   if (! qwizdata[i_qwiz].textentry[i_question].textentry_suggest_b) {

      // No-suggestions question.  If nothing entered, do nothing.  First, if
      // recording, and this is first interaction (no-intro, single-question
      // quiz), record as start time.
      if (qwizdata[i_qwiz].record_start_b && document_qwiz_user_logged_in_b) {
         qwizdata[i_qwiz].record_start_b = false;
         var data = {qrecord_id_ok: qwizdata[i_qwiz].qrecord_id_ok, type: 'start'};
         qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'record_response', data);
      }

      var entry = $textentry.val ().toLowerCase ();
      if (entry == '') {
         return false;
      }
   }
   if (! single_char_b) {
      if (! q.qwizard_b) {
         if (qwizdata[i_qwiz].check_answer_disabled_b) {
            alert (Tcheck_answer_message);

            // Show hint button.
            $ ('#textentry_check_answer_div-qwiz' + i_qwiz + '-q' + i_question + ' button.qwiz_textentry_hint')
               .removeAttr ('disabled')
               .removeClass ('qbutton_disabled')
               .addClass ('qbutton').show ();
            return;
         }

         // Hide "Check answer" button div.
         $ ('#textentry_check_answer_div-qwiz' + i_qwiz + '-q' + i_question).hide ();
      }
   }

   // Blur entry so jQuery knows to hide suggestion list -- in case "Check
   // answer" triggered with <Enter>.
   $textentry.blur ();

   // Disable further entry.
   if (! q.qwizard_b) {
      $textentry.attr ('disabled', true);
   }

   // See if entry among choices; identify default choice ("*").
   var entry = $textentry.val ().toLowerCase ();
   var i_choice = -1;
   var correct_b = false;
   var n_choices = qwizdata[i_qwiz].textentry[i_question].choices.length;
   var i_default_choice;
   for (var i=0; i<n_choices; i++) {
      var alts = qwizdata[i_qwiz].textentry[i_question].choices[i];
      if (alts[0] == '*') {
         i_default_choice = i;
      } else {
         var ok_f = false;
         if (q.qwizard_b && typeof (qwizard_i_choice) != 'undefined') {
            if (alts == 'Enter word' && i == qwizard_i_choice) {
               ok_f = true;
            }
         }
         if (! ok_f) {
            var lc_alts = alts.map (function (item) {
                                       return item.toLowerCase ();
                                    });
            ok_f = lc_alts.indexOf (entry) != -1;
         }
         if (ok_f) {

            // Yes, this one.  Correct?
            correct_b = qwizdata[i_qwiz].textentry[i_question].choices_correct[i];
            i_choice = i;
            break;
         }
      }
   }
   if (i_choice == -1) {
      i_choice = i_default_choice;
   }

   // Show feedback.
   $ ('#qwiz' + i_qwiz + '-q' + i_question + '-a' + i_choice).show ();

   // Update statistics.
   if (! q.qwizard_b) {
      qwizdata[i_qwiz].answered_correctly[i_question] = correct_b;
      if (correct_b) {
         qwizdata[i_qwiz].n_correct++;
      } else {

         // Record number of incorrect responses.
         qwizdata[i_qwiz].n_incorrect++;
      }

      // If reporting usage, and haven't done so already for this quiz, increment
      // counter.
      if (post_id != 0 && ! qwizdata[i_qwiz].usage_incremented_b) {
         qqc.increment_usage ('quiz', i_qwiz, post_id);
         qwizdata[i_qwiz].usage_incremented_b = true;
      }

      // If recording, jjax call.
      if (qwizdata[i_qwiz].qrecord_id && document_qwiz_user_logged_in_b) {

         // Include text entered.
         var data = {q_and_a_text: qwizdata[i_qwiz].q_and_a_text[i_question],
                     i_question:   qwizdata[i_qwiz].dataset_id[i_question],
                     unit:         qwizdata[i_qwiz].unit[i_question],
                     type:         'textentry', 
                     response:     entry,
                     i_choice:     -1,
                     correct_b:    correct_b ? 1 : ''};
         qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'record_response', data);
      }
      update_topic_statistics (i_qwiz, i_question, correct_b);
   }

   // Update progress and show next button -- only if more than one question.
   update_progress_show_next (i_qwiz);
}


// -----------------------------------------------------------------------------
// Provide first letters of first correct answer as hint.
this.textentry_hint = function (i_qwiz) {

   // Cancel any previous timer.
   clearTimeout (show_hint_timeout[i_qwiz]);
   show_hint_timeout[i_qwiz] = 0;

   qwizdata[i_qwiz].textentry_n_hints++;

   var i_question = qwizdata[i_qwiz].i_question;
   var textentry_hint_val = qwizdata[i_qwiz].textentry[i_question].first_correct_answer.substr (0, qwizdata[i_qwiz].textentry_n_hints);

   // Also show suggestions for hint, if any.
   $ ('#textentry-qwiz' + i_qwiz + '-q' + i_question).val (textentry_hint_val).focus ().trigger ('keydown');

   // Disable hint button, reset label.
   $ ('#textentry_check_answer_div-qwiz' + i_qwiz + '-q' + i_question + ' button.qwiz_textentry_hint').attr ('disabled', true)
      .removeClass ('qbutton')
      .addClass ('qbutton_disabled')
      .html ('Another hint');

   // But set timer to show again.  Closure.
   var $check_answer = $ ('#textentry_check_answer_div-qwiz' + i_qwiz+ '-q' + i_question );
   var show_hint_button = function () {
      $check_answer.find ('button.qwiz_textentry_hint')
         .removeAttr ('disabled')
         .addClass ('qbutton')
         .removeClass ('qbutton_disabled');
   }
   if (hint_timeout_sec >= 0) {
      show_hint_timeout[i_qwiz] = setTimeout (show_hint_button, hint_timeout_sec*1000);
   }
}


// -----------------------------------------------------------------------------
this.set_textentry_i_qwiz = function (e, input_el) {

   // See which quiz this is.  Save in global (private) variable.
   // id looks like textentry-qwiz0-q0
   var id = input_el.id;
   textentry_i_qwiz = id.match (/[0-9]+/)[0];
   if (debug[6]) {
      console.log ('[set_textentry_i_qwiz] textentry_i_qwiz: ', textentry_i_qwiz);
   }
   // Don't propagate click.
   e.stopPropagation ();

   // Also, if qwizard, hide any feedback already showing.
   if (q.qwizard_b) {
      var qwizq = id.match (/qwiz.*/)[0];
      $ ('#' + qwizq + ' .qwiz-feedback').hide ();
   }
}


// -----------------------------------------------------------------------------
// When item selected, enable check answer and set text.
this.item_selected = function () {
   var i_question = qwizdata[textentry_i_qwiz].i_question;
   $ ('#textentry_check_answer_div-qwiz' + textentry_i_qwiz + '-q' + i_question + ' button.textentry_check_answer')
      .removeClass ('qbutton_disabled')
      .addClass ('qbutton')
      .html (T ('Check answer'));
   qwizdata[textentry_i_qwiz].check_answer_disabled_b = false;
}


// -----------------------------------------------------------------------------
this.keep_next_button_active = function () {
   next_button_active_b = true;
   $ ('.next_button').show ();
}


// -----------------------------------------------------------------------------
function position_show_next_button (i_qwiz) {
   var $next_button = $ ('#next_button-qwiz' + i_qwiz);
   $next_button.show ();
}


// -----------------------------------------------------------------------------
this.display_login = function (i_qwiz, add_team_member_f, progress_bars_use_dataset_options) {
   if (! progress_bars_use_dataset_options) {
      progress_bars_use_dataset_options = '';
   }

   // Close menu in case came from there.
   $ ('#usermenu-qwiz' + i_qwiz).hide ();

   if (! add_team_member_f && ! progress_bars_use_dataset_options) {

      // Stop any bouncing icons (no-intro quizzes/flashcard decks) bouncing.
      $ ('div.qwiz-usermenu_icon_no_intro').removeClass ('qwiz-icon-bounce');
   }

   var i_question = qwizdata[i_qwiz].i_question;
   if (i_question == -1) {

      // Hide intro (intro -- if any -- shows with the question of a single-
      // question quiz).
      $ ('.intro-qwiz' + i_qwiz).hide ();

      // If intro was showing, can hide qwiz icon now.
      if (! q.no_intro_b[i_qwiz]) {
         $ ('div.qwiz div#icon_qwiz' + i_qwiz).hide ();
      }
   } else if (i_question >= qwizdata[i_qwiz].n_questions) {

      // Hide summary.
      $ ('#summary-qwiz' + i_qwiz).hide ();
   } else {

      // Don't show textentry "Check answer" button if showing.  Record state.
      $textentry_check_answer_div = $ ('#textentry_check_answer_div-qwiz' + i_qwiz + '-q' + i_question);
      if ($textentry_check_answer_div.is (':visible')) {
         $textentry_check_answer_div.hide ();
         qwizdata[i_qwiz].textentry_check_answer_show_b = true;
      } else {
         qwizdata[i_qwiz].textentry_check_answer_show_b = false;
      }

      // Hide current question -- regular and mobile version, if there.
      var qwizq_id = 'qwiz' + i_qwiz + '-q' + qwizdata[i_qwiz].i_question;
      $ ('#' + qwizq_id + ', #' + document_qwiz_mobile + qwizq_id).hide ();
   }

   // Don't show next button.
   $ ('#next_button-qwiz' + i_qwiz).hide ();

   if (progress_bars_use_dataset_options == 'progress_bars'
                        || progress_bars_use_dataset_options == 'leaderboard') {

      // Gets data, callback sets html.
      qqc.create_progress_bars (qname, qwizdata, i_qwiz, progress_bars_use_dataset_options);
   } else if (progress_bars_use_dataset_options == 'use_dataset_options') {
      qqc.create_use_dataset_options (qname, qwizdata, i_qwiz);
   } else {
      $ ('#qwiz_login-qwiz' + i_qwiz).html (get_login_html (i_qwiz, add_team_member_f)).show ();

      $ ('#qwiz_username-qwiz' + i_qwiz).focus ();
   }

   // Set indicator that login is displayed.
   qwizdata[i_qwiz].login_show_b = true;
}


// -----------------------------------------------------------------------------
this.login = function (i_qwiz, add_team_member_f) {

   add_team_member_f = add_team_member_f ? 1 : 0;

   // In case previously declined login option, unset cookie and local flag.
   $.removeCookie ('qwiz_declined_login', {path: '/'});
   document_qwiz_declined_login_b = false;

   // Have we got username and password?
   var username_obj = $ ('#qwiz_username-qwiz' + i_qwiz);
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

   var password_obj = $ ('#qwiz_password-qwiz' + i_qwiz);
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
      remember_f = $ ('#qwiz_login-qwiz' + i_qwiz + ' input[type="checkbox"]').prop('checked') ? 1 : 0;
      document_qwiz_remember_f = remember_f;
   }

   // Do jjax call.
   var data = {username: username, sha3_password: sha3_password, remember_f: remember_f, add_team_member_f: add_team_member_f};
   if (add_team_member_f) {
      data.previous_username = document_qwiz_username;
   }
   qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'login', data);
}


// -----------------------------------------------------------------------------
this.login_ok = function (i_qwiz, session_id, remember_f) {

   // Success.  Create session cookie, valid for this session, or -- if flag
   // set -- 1 day, good for whole site.  Value set by server.  Callback
   // script also saves session ID as global (document) variable
   // document_qwiz_session_id.
   var options = {path: '/'};
   if (remember_f == 1) {
      options.expires = 1;
   }
   $.cookie ('qwiz_session_id', document_qwiz_session_id, options);

   // Set flag, record time.
   document_qwiz_user_logged_in_b = true;
   document_qwiz_current_login_sec = new Date ().getTime ()/1000.0;
   if (debug[0]) {
      console.log ('[login_ok] document_qwiz_current_login_sec:', document_qwiz_current_login_sec);
   }

   // Set user menus.
   qqc.set_user_menus_and_icons ();

   // Hide login.
   $ ('#qwiz_login-qwiz' + i_qwiz).hide ();

   // Unset indicator that login is displayed.
   qwizdata[i_qwiz].login_show_b = false;

   // If recording any quizzes, reset flag to record start times on first
   // interaction with quizzes.
   if (q.qrecord_b) {
      for (var ii_qwiz=0; ii_qwiz<n_qwizzes; ii_qwiz++) {
         if (qwizdata[ii_qwiz].qrecord_id) {
            qwizdata[ii_qwiz].record_start_b = true;
         }

         // Also, set indicator to re-check whether (new?) user will get
         // credit for each quiz.
         if (qwizdata[ii_qwiz].qrecord_id) {
            qwizdata[ii_qwiz].qrecord_id_ok = 'check credit';
         }
      }
   }

   var i_question = qwizdata[i_qwiz].i_question;
   if (i_question == -1) {

      // Go to first question or, if was on dataset_units_topics card, back to
      // that.
      q.next_question (i_qwiz);
   } else {

      // Re-display current question or summary.
      redisplay_current_question (i_qwiz, i_question);

      // Record start.
      qwizdata[i_qwiz].record_start_b = false;
      var data = {qrecord_id_ok: qwizdata[i_qwiz].qrecord_id_ok, type: 'start'};
      qqc.jjax (qname, i_qwiz, qwizdata[i_qwiz].qrecord_id, 'record_response', data);

      // Show next button if was showing.  If mobile, update position.
      if (qwizdata[i_qwiz].next_button_show_b) {
         position_show_next_button (i_qwiz);
      }

      // Show textentry "Check answer" button if was showing.
      if (qwizdata[i_qwiz].textentry_check_answer_show_b) {
         $ ('#textentry_check_answer_div-qwiz' + i_qwiz + '-q' + i_question).show ();
      }
   }
}


// -----------------------------------------------------------------------------
this.login_not_ok = function (i_qwiz) {

   // Invalid login.  Error message.
   $ ('#qwiz_login-qwiz' + i_qwiz + ' p.login_error').show ();
   if (debug[0]) {
      console.log ('[login_not_ok] $ (\'#qwiz_login-qwiz' + i_qwiz + ' p.login_error\'):', $ ('#qwiz_login-qwiz' + i_qwiz + ' p.login_error'));
   }
}


// -----------------------------------------------------------------------------
this.no_login = function (i_qwiz, add_team_member_f, progress_bars_f) {

   // Skip login.  Hide login.  If checkbox checked, set cookie and local flag
   // to skip in the future.
   if (! (add_team_member_f || progress_bars_f)) {
      if ($ ('#qwiz_login-qwiz' + i_qwiz + ' input[type="checkbox"]').prop('checked')) {
         $.cookie ('qwiz_declined_login', 1, {path: '/'});
         document_qwiz_declined_login_b = true;
      }

      // Stop any bouncing icons (no-intro quizzes) bouncing.
      $ ('div.qwiz-usermenu_icon_no_intro').removeClass ('qwiz-icon-bounce');
   }

   // Hide login.
   $ ('#qwiz_login-qwiz' + i_qwiz).hide ();

   // Unset indicator that login is displayed.
   qwizdata[i_qwiz].login_show_b = false;

   // If on intro, go to next question.  Otherwise, show current question
   // or summary.
   var i_question = qwizdata[i_qwiz].i_question;
   if (i_question == -1) {
      q.next_question (i_qwiz, true);
   } else {

      // Re-display current question or summary.
      redisplay_current_question (i_qwiz, i_question);

      // Show next button if was showing.
      if (qwizdata[i_qwiz].next_button_show_b) {
         position_show_next_button (i_qwiz);
      }

      // Show textentry "Check answer" button if was showing.
      if (qwizdata[i_qwiz].textentry_check_answer_show_b) {
         $ ('#textentry_check_answer_div-qwiz' + i_qwiz + '-q' + i_question).show ();
      }
   }

   return false;
}


// -----------------------------------------------------------------------------
this.icon_no_login = function (i_qwiz, add_team_member_f) {

   // Stop icon from bouncing.  If checkbox checked, set cookie and local flag
   // to skip bouncing/login in the future.
   $ ('div.qwiz-usermenu_icon_no_intro').removeClass ('qwiz-icon-bounce');

   if (! add_team_member_f) {
      if ($ ('#usermenu-qwiz' + i_qwiz + ' input[type="checkbox"]').prop('checked')) {
         $.cookie ('qwiz_declined_login', 1, {path: '/'});
         document_qwiz_declined_login_b = true;
      }
   }

   // Close menu.
   $ ('#usermenu-qwiz' + i_qwiz).hide ();
}


// -----------------------------------------------------------------------------
function redisplay_current_question (i_qwiz, i_question) {

   // If mobile view and there's a mobile version of question, display that,
   // otherwise regular version.
   if (i_question < qwizdata[i_qwiz].n_questions) {
      if (document_qwiz_mobile) {
         var $mobile_qwizq = $ ('#mobile_qwiz' + i_qwiz + '-q' + i_question);
         if ($mobile_qwizq.length) {
            $mobile_qwizq.show ();
         } else {
            $ ('#qwiz' + i_qwiz + '-q' + i_question).show ();
         }
      } else {
         $ ('#qwiz' + i_qwiz + '-q' + i_question).show ();
      }
   } else {
      $ ('#summary-qwiz' + i_qwiz).show ();
   }
}


// -----------------------------------------------------------------------------
this.show_usermenu = function (i_qwiz) {
   $ ('#usermenu-qwiz' + i_qwiz).show ().mouseleave (function () {
                                                        $ (this).hide ();
                                                     });
}


// -----------------------------------------------------------------------------
function get_attr (htm, attr_name) {
   var attr_value = qqc.get_attr (htm, attr_name, qwizdata);
   errmsgs = errmsgs.concat (qwizdata.additional_errmsgs);

   return attr_value;
}


// -----------------------------------------------------------------------------
this.get_qwizdata = function (i_qwiz, variable) {

   return qwizdata[i_qwiz][variable];
}


// -----------------------------------------------------------------------------
this.set_qwizdata = function (i_qwiz, variable, value) {
   if (i_qwiz == -1) {
      var s = variable + ' = ' + value;
      eval (s);
   } else {
      qwizdata[i_qwiz][variable] = value;
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


// -----------------------------------------------------------------------------
function inarray0 (array_of_arrays, query) {
   var len = array_of_arrays.length;
   for (var i=0; i<len; i++) {
      if (array_of_arrays[i][0] == query) {
         return true;
      }
   }

   return false;
}


// =============================================================================
// Close - isolate namespace.
};


// -----------------------------------------------------------------------------
qwizf.call (qwiz_);

