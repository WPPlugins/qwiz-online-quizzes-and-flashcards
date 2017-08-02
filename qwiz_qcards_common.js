// Document globals.
var document_qwiz_declined_login_b    = 'not ready';
var document_qwiz_user_logged_in_b    = 'not ready';
var document_qwiz_remember_f          = false;
var document_qwiz_current_login_sec   = 0;
var document_active_qwiz_qdeck        = '';
var document_qwiz_independent_taker_f = '';
var document_qwiz_class_id            = '';
var document_qwiz_login_timeout;
var document_qwiz_team_b              = false;
var document_qwiz_mobile_enabled      = 'Enabled';
var document_qwiz_mobile              = '';
var document_qwiz_bubblebar_enabled_b = true;


// =============================================================================
// Isolate namespace.
qwiz_qcards_common = {};
var qwiz_qcards_common_f = function () {

// Check jQuery presence.
if (typeof (jQuery) == 'undefined') {
   alert (qqc.T ('jQuery JavaScript library not loaded.  Use Settings > Qwizcards > Force jQuery load\n'
          + 'to enable quizzes and flashcards'));
}

var $ = jQuery;

var qqc = this;
var qqcname = 'qwiz_qcards_common';

var jjax_script_no = 0;
var head = 'not ready';

var server_loc = 'not ready';
var secure_server_loc;

var plugin_url;
var icon_expand_src = 'not ready';
var icon_collapse_src;

var use_dataset_options_html = {};
var use_dataset_options_display_name = {};
var progress_bars_leaderboard = {};
var refresh_leaderboard_timeout = {};

var dataset_questions_countdown_timeout = {};

var debug = [];
debug[0]  = false;    // General.
debug[5]  = false;    // find_matching_block ().
debug[7]  = false;    // Enter -> click.
debug[9]  = false;    // [hangman].
debug[10] = false;    // parse_html_block ().
debug[11] = false;    // use_dataset.
debug[12] = false;    // Progress bars/leaderboard.

// -----------------------------------------------------------------------------
$ (document).ready (function () {

   // Set flag to skip login if cookie set.
   document_qwiz_declined_login_b = $.cookie ('qwiz_declined_login');

   head = document.getElementsByTagName ('head')[0];
   if (debug[0]) {
      console.log ('[qwiz_qcards_common ready] head:', head);
   }

   // Specific to wplms plugin: if "Start course" button present, add response
   // to click event: timeout to initialize quizzes and decks if not already
   // done.
   var $start_course_button = $ ('a.unit.unit_button');
   var button_label = $start_course_button.html ();
   if (button_label && button_label.toLowerCase () == 'start course') {
      var delay_init = function () {

         if ($ ('div.qwiz_wrapper_fallback').is (':visible')) {
            qwiz_.qwiz_init ();
         }
         if ($ ('div.qdeck_wrapper_fallback').is (':visible')) {
            qcard_.qdeck_init ();
            flipping_cards_part2 ();
         }
      }
      $start_course_button.click (function () {
         setTimeout (delay_init, 3000);
      });
   }

});


// -----------------------------------------------------------------------------
this.jjax = function (qname, i_qwiz, qrecord_id, dest, data) {

   // Add script to this page -- sends/receives via src=.
   // Set head if not initialized -- somehow jjax can get called ahead of 
   // $ (document).ready ().
   if (head == 'not ready') {
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
         if (head) {
            head.removeChild (script);
         } else {
            document.body.removeChild (script);
         }
      } catch (e) {
         console.log ('[jjax] script_id:', script_id, ', script:', script);
      }
   }
   var script = document.createElement ('script');
   script.id = script_id;
   script.setAttribute ('charset', 'utf-8');

   // Always send qname, i_qwiz and qrecord_id (qwiz database id).
   var send_data = '?';
   if (data) {
      for (var property in data) {
         send_data += property + '=' + encodeURIComponent (data[property]) + '&'
      }
   }
   send_data += 'qname=' + qname + '&i_qwiz=' + i_qwiz + '&qrecord_id=' + encodeURIComponent (qrecord_id);

   // Add something unique each time, so IE will re-retrieve javascript!
   var msec = new Date ().getTime();
   send_data += '&msec=' + msec;

   // Send session id, if set.
   if (typeof (document_qwiz_session_id) != 'undefined') {
      send_data += '&qwiz_session_id=' + encodeURIComponent (document_qwiz_session_id);
   }

   if (server_loc == 'not ready') {
      server_loc        = qqc.get_qwiz_param ('server_loc', 'http://qwizcards.com/admin');
      secure_server_loc = qqc.get_qwiz_param ('secure_server_loc', 'https://host359.hostmonster.com/~whereisq/qwiz/admin');
   }
   var local_server_loc;
   if (dest == 'login') {
      local_server_loc = secure_server_loc;
   } else {
      local_server_loc = server_loc;
   }
   script.src = local_server_loc + '/' + dest + '.php' + send_data;
   if (debug[0]) {
      console.log ('[jjax] data:', data);
      console.log ('[jjax] script.src:', script.src);
   }

   if (head) {
      head.appendChild (script);
   } else {
      document.body.appendChild (script);
   }
}


// -----------------------------------------------------------------------------
this.check_session_id = function (i_qwiz) {

   // Get cookie, check if still valid (server call).  If undefined, change
   // to null string (so don't pass string 'undefined' to php).
   var cookie_session_id = $.cookie ('qwiz_session_id');
   if (debug[0]) {
      console.log ('[check_session_id] cookie_session_id:', cookie_session_id);
   }
   if (! cookie_session_id) {
      document_qwiz_user_logged_in_b = false;
   } else {
      var data = {cookie_session_id: cookie_session_id};
      qqc.jjax ('', i_qwiz, '', 'check_session_id', data);
   }
}


// -----------------------------------------------------------------------------
this.set_user_menus_and_icons = function (sign_out_f) {
   var htm = '';
   var icon_color;

   // See if logged in.
   if (typeof (document_qwiz_user_logged_in_b) != 'undefined'
                                   && document_qwiz_user_logged_in_b === true) {

      // Yes.  Show login name.
      htm +=    '<div>'
             +     qqc.T ('Logged in as') + ' <strong>' + document_qwiz_username + '</strong>'
             +  '</div>';

      // Menu item for additional team-member login.
      if (! document_qwiz_independent_taker_f) {
         htm +=    '<div>'
                +     '<a href="javascript: qname.display_login (i_qwiz, true)">'
                +         qqc.T ('Add team member')
                +     '</a>'
                +  '</div>';
      }

      // Menu item for scores.
      if (server_loc == 'not ready') {
         server_loc = qqc.get_qwiz_param ('server_loc', 'http://qwizcards.com/admin');
      }
      htm +=    '<div>'
             +     '<a href="' + server_loc + '/index?student_view=1&time=' + document_qwiz_session_id + '" target="_blank">'
             +      qqc.T ('My scores')
             +     '</a>'
             +  '</div>';

      // Menu item for progress bars.
      htm +=    '<div>'
             +     '<a href="javascript: qname.display_login (i_qwiz, false, \'progress_bars\')">'
             +         qqc.T ('My progress')
             +     '</a>'
             +         '/'
             +     '<a href="javascript: qname.display_login (i_qwiz, false, \'leaderboard\')">'
             +         qqc.T ('Leaderboard')
             +     '</a>'
             +  '</div>';

      // Menu item for account admin page - change username, change email, 
      // change password.
      htm +=    '<div>'
             +     '<a href="' + server_loc + '/my_account?time=' + document_qwiz_session_id + '" target="_blank" title="' + qqc.T ('View/edit login name, password, ...') + '">'
             +         qqc.T ('My account - settings')
             +     '</a>'
             +  '</div>';

      // Menu item for logout.
      htm +=    '<div>'
             +      qqc.T ('Not') + ' ' + document_qwiz_username + '? '
             +     '<a href="javascript: ' + qqcname + '.sign_out ()">'
             +         qqc.T ('Sign out')
             +     '</a>'
             +  '</div>';

      icon_color = 'green';

      // Since logged in, no animation for no-intro quizzes icon.
      $ ('div.qwiz-usermenu_icon_no_intro').removeClass ('qwiz-icon-bounce');

   } else {

      // Not logged in.
      // Note: breaks before and after items -- make logged-out menu as big as
      // logged-in menu, so when click "Sign out" cursor is still on menu (and
      // mouseleave will work).
      // Login menu item.
      htm +=    '<br />'
             +  '<div>'
             +     '<a href="javascript: qname.display_login (i_qwiz)">'
             +        '<strong>' + qqc.T ('Log in') + '</strong> ' + qqc.T ('to record/get credit')
             +     '</a>'
             +  '</div>';

      // "No thanks" item.
      htm +=    '<div>'
             +     ' <span class="qwiz-remember" title="' + qqc.T ('Skip login in the future') + '"><label class="qwiz_label"><span><input type="checkbox" /></span> ' + qqc.T ('Remember') + '</label></span> &nbsp;'
             +     '<a href="javascript: qname.icon_no_login (i_qwiz)">'
             +        '<strong>' + qqc.T ('No thanks') + '</strong>'
             +     '</a>'
             +  '</div>';

      // Can show leaderboard even if user is not logged in.
      htm +=    '<div>'
             +  '<br />'
             +     '<a href="javascript: qname.display_login (i_qwiz, false, \'leaderboard\')">'
             +         qqc.T ('Leaderboard')
             +     '</a>'
             +  '</div>'
             +  '<br />';

      icon_color = 'black';

      // Not logged in.  No-intro quizzes get animated icon if user has not
      // declined login.
      if (document_qwiz_declined_login_b == 'not ready') {
         document_qwiz_declined_login_b = $.cookie ('qwiz_declined_login');
      }
      if (! sign_out_f && ! document_qwiz_declined_login_b) {
         $ ('div.qwiz-usermenu_icon_no_intro').addClass ('qwiz-icon-bounce');
      }
   }

   // All quiz user menus (every quiz with qrecord_id).
   var qwiz_htm = htm.replace (/qname/g, 'qwiz_');
   $ ('div.qwiz-usermenu').each (function () {

                                    // Get qwiz number from id - looks like
                                    // usermenu-qwiz0.
                                    // 0----+----1---
                                    var id = $ (this).attr ('id');
                                    var i_qwiz = id.substr (13);
                                    $ (this).html (qwiz_htm.replace (/i_qwiz/g, i_qwiz));
                                 });

   // And all flashcard deck user menus (every deck with qrecord_id).
   var qdeck_htm = htm.replace (/qname/g, 'qcard_');
   $ ('div.qdeck-usermenu').each (function () {

                                    // Get deck number from id - looks like
                                    // usermenu-qdeck0.
                                    // 0----+----1----
                                    var id = $ (this).attr ('id');
                                    var i_deck = id.substr (14);
                                    $ (this).html (qdeck_htm.replace (/i_qwiz/g, i_deck));
                                 });


   // Also set icons visible, color based on login state.
   $ ('div.qwiz-usermenu_icon').css ({visibility: 'visible', color: icon_color});

   // Also see if any divs that replaced [qscores] shortcodes -- set html for 
   // link to login/view scores.
   $qscores = $ ('span.qscores');
   if ($qscores.length) {
      qqc.set_qscore_menus ($qscores);
   }
}


// -----------------------------------------------------------------------------
this.sign_out = function () {

   // Delete cookie, unset flag.
   $.removeCookie ('qwiz_session_id', {path: '/'});
   document_qwiz_user_logged_in_b = false;

   // Remove session ID from DB table.
   var data = {session_id: document_qwiz_session_id, table: 'session_id'};
   qqc.jjax ('', -1, '', 'delete_session_id', data);

   // Reset menus to reflect current (logged-out) state.  Flag to NOT start
   // bouncing icons.
   qqc.set_user_menus_and_icons (true);
}


// -----------------------------------------------------------------------------
this.set_qscore_menus = function ($qscores) {
   if (server_loc == 'not ready') {
      server_loc        = qqc.get_qwiz_param ('server_loc', 'http://qwizcards.com/admin');
      secure_server_loc = qqc.get_qwiz_param ('secure_server_loc', 'https://host359.hostmonster.com/~whereisq/qwiz/admin');
   }

   // See if logged in.
   var htm;
   if (typeof (document_qwiz_user_logged_in_b) != 'undefined'
                                    && document_qwiz_user_logged_in_b === true) {
      htm = '<a href="' + secure_server_loc + '/index.php?student_view=1&time=' + document_qwiz_session_id + '" target="_blank">'
      htm += qqc.T ('View scores');
   } else {

      // Not logged in.  Secure page for login.
      htm = '<a href="' + secure_server_loc + '/student_login.php" target="_blank">'
      htm += qqc.T ('Login/View scores');
   }
   htm += '</a>';
   $qscores.html (htm);
}


// -----------------------------------------------------------------------------
this.create_progress_bars = function (qname, qdata, i_qwiz, local_progress_bars_leaderboard) {

   // Save which tab shown first for this quiz/deck.
   progress_bars_leaderboard[qname + i_qwiz] = local_progress_bars_leaderboard;

   // Show spinner.
   plugin_url = qqc.get_qwiz_param ('url', './');
   var spinner_url = plugin_url + 'images/spinner40x40.gif';
   var htm = '<img src="' + spinner_url + '" class="qwiz_center_xy" style="margin-top: 100px;" />';
   if (qname) {
      var login_div = qqc.$get_login_div (qname, i_qwiz);
      login_div.html (htm).show ();
   }

   // If not logged in, leaderboard only.
   if (typeof (document_qwiz_user_logged_in_b) == 'undefined'
                                          || ! document_qwiz_user_logged_in_b) {
      var data = {not_logged_in_f:  1,
                  qname:            qname,
                  i_qwiz:           i_qwiz,
                  qrecord_id:       qdata[i_qwiz].qrecord_id};
      qqc.create_progress_bars3 (data);
      return false;
   }

   // If haven't yet checked whether this quiz/deck OK for this student, do
   // so now (sets document_qwiz_class_id; also counts as start of this quiz/
   // deck).
   if (qdata[i_qwiz].record_start_b && document_qwiz_user_logged_in_b) {
      qdata[i_qwiz].record_start_b = false;
      var now_sec = new Date ().getTime ()/1000.0;
      var data = {qrecord_id_ok: qdata[i_qwiz].qrecord_id_ok,
                  type:          'start',
                  now_sec:       now_sec, 
                  callback:      'create_progress_bars2'};
      var record_dest = qname == 'qwiz_' ? 'record_response' : 'record_qcard';
      qqc.jjax (qname, i_qwiz, qdata[i_qwiz].qrecord_id, record_dest, data);
   } else {
      qqc.create_progress_bars2 (qname, i_qwiz, qdata[i_qwiz].qrecord_id);
   }
}


// -----------------------------------------------------------------------------
this.create_progress_bars2 = function (qname, i_qwiz, qrecord_id) {


   // Get qwiz_deck scores, units, number of questions for this user.
   // DKTMP - issue: what if user in more than one class?
   if (document_qwiz_independent_taker_f) {
      document_qwiz_class_id = 'independent_student';
   }
   var data = {'jjax_progress_only_f':    1,
               'jjax_progress_qrecord_id':qrecord_id,
               'qname':                   qname,
               'i_qwiz':                  i_qwiz,
               'username':                document_qwiz_username,
               'current_username':        document_qwiz_username,
               'class_name':              document_qwiz_class_id,
               'current_class_id':        document_qwiz_class_id,
               'maker_id':                0,
               'school_id':               document_qwiz_school_id,
               'class_by_id_or_name':     'class_by_id',
               'table_class':             'start_finish_etc',
               'qrecord_id':              'students_across_quizzes_decks'};

   // Callback is create_progress_bars3 ().
   qqc.jjax (qname, i_qwiz, '', 'get_student_results', data);
}


// -----------------------------------------------------------------------------
// Create progress bars tab (if logged in) and leaderboard tab -- populate
// progress bars now (if logged in), leaderboard when tab clicked first time
// (or now, if not logged in).
this.create_progress_bars3 = function (data) {
   if (debug[12]) {
      console.log ('[create_progress_bars3] data:', data);
   }

   var logged_in_b = ! data.not_logged_in_f;
   var qname       = data.qname;
   var i_qwiz      = data.i_qwiz;
   var qrecord_id  = data.qrecord_id;

   // Remaining data not set if only doing leaderboard (when not logged in).
   if (logged_in_b) {
      var progress_units         = data.progress_units;
      var unit_best_n_corrects   = data.unit_best_n_corrects;
      var unit_n_questions       = data.unit_n_questions;
      var unit_n_qattempts       = data.unit_n_qattempts;

      var course_best_n_corrects = data.course_best_n_corrects;
      var course_n_questions     = data.course_n_questions;
      var course_n_qattempts     = data.course_n_qattempts;

      if (course_n_questions == 0) {
         course_n_questions = course_n_qattempts;
      }
   }

   var htm = [];

   // Tabs.
   htm.push ('<div id="progress_bars_leaderboard_tabs_' + qname + i_qwiz + '" class="progress_bars_leaderboard_tabs">');
   htm.push ('<ul>');
   if (logged_in_b) {
   htm.push (   '<li>');
   htm.push (      '<a href="#progress_bars_tab_' + qname + i_qwiz + '">');
   htm.push (         'Progress');
   htm.push (      '</a>');
   htm.push (   '</li>');
   }
   htm.push (   '<li>');
   htm.push (      '<a href="#leaderboard_tab_' + qname + i_qwiz + '">');
   htm.push (         'Leaderboard');
   htm.push (      '</a>');
   htm.push (   '</li>');
   htm.push ('</ul>');

   if (logged_in_b) {
   // .......................................................
   // Progress-bars tab.
   htm.push ('<div id="progress_bars_tab_' + qname + i_qwiz + '">');

   // Initially: show progress for first partially-complete unit, or whole
   // course if no units defined.
   var select_id;
   htm.push ('<table class="unit_progress_bars">');

   // Show unit progress bars only if units besides "Other" and
   // "(excluded)".
   var n_units = progress_units.length;
   var show_units_progress_bar_f = false;
   for (var i=0; i<n_units; i++) {
      if (! (progress_units[i] == 'Other' || progress_units[i] == '(excluded)')) {
         show_units_progress_bar_f = true;
      }
   }
   var unit_n_qs = {}
   if (show_units_progress_bar_f) {

      // If n_questions not recorded for a quiz or deck, use number attempted.
      for (var unit in unit_n_questions) {
         if (unit_n_questions[unit] == 0) {
            unit_n_qs[unit] = unit_n_qattempts[unit];
         } else {
            unit_n_qs[unit] = unit_n_questions[unit];
         }
      }

      for (var i=0; i<n_units; i++) {
         var unit = progress_units[i];

         // Don't show "(excluded)" in list.
         if (unit != '(excluded)') {
            if (typeof (unit_best_n_corrects[unit]) == 'undefined') {
               unit_best_n_corrects[unit] = 0;
            }
            var label = unit_best_n_corrects[unit] + '/' + unit_n_qs[unit];
            htm.push ('<tr>');
            htm.push (   '<td>');
            htm.push (      progress_units[i]);
            htm.push (   '</td>');
            htm.push (   '<td>');

            var div_id    = 'unit_progress_bar-' + qname + i_qwiz + '-unit' + i;
            htm.push (      '<div id="' + div_id + '" class="unit_progress_bars"><div class="progress-label"></div></div>');
            htm.push (   '</td>');
            htm.push ('</tr>');
         }
      }
   }
   if (n_units) {
      htm.push ('<tr>');
      htm.push (   '<td colspan="2">');
      htm.push (      '<hr style="margin: 2px 0 0;" />');
      htm.push (   '</td>');
      htm.push ('</tr>');
   }
   htm.push (   '<tr>');
   htm.push (      '<td>');
   if (qname == 'qwiz_') {
      htm.push (      '<b>Whole quiz</b>');
   } else if (qname == 'qcard_') {
      htm.push (      '<b>Whole deck</b>');
   } else if (document_qwiz_independent_taker_f) {
      htm.push (      '<b>All quizzes/decks tried</b>');
   } else {
      htm.push (      '<b>Course</b>');
   }
   htm.push (      '</td>');
   htm.push (      '<td>');
   var div_id = 'course_progress_bar-' + qname + i_qwiz;
   htm.push (         '<div id="' + div_id + '" class="unit_progress_bars"><div class="progress-label"></div></div>');
   htm.push (      '</td>');
   htm.push (   '</tr>');
   htm.push ('</table>');

   // Only for within-quiz/within deck display (code shared).
   if (qname) {

      // Details: link to "My scores".
      htm.push ('Details: <a href="' + server_loc + '/index?student_view=1&time=' + document_qwiz_session_id + '" target="_blank">');
      htm.push (qqc.T ('My scores') + '</a>');

      // Return-to-quiz/deck button.
      htm.push ('<button class="qbutton exit_progress_bars" style="float: right;" onclick="' + qname + '.no_login (' + i_qwiz + ', false, true, event)">');
      htm.push (   'Continue');
      htm.push ('</button>');
   }

   // Close progress-bars tab.
   htm.push ('</div>');
   }

   // .......................................................
   // Leaderboard tab.  Will be populated when activated.
   htm.push ('<div id="leaderboard_tab_' + qname + i_qwiz + '" class="leaderboard">');
   htm.push ('</div>');

   // Close overall tabs container (id="progress_bars_leaderboard_tabs_ ...).
   htm.push ('</div>');

   // Sharing code between here and index.php.
   var selector;
   if (! qname) {
      selector = '#progress_bars' + i_qwiz;
   } else if (qname == 'qwiz_') {
      selector = '#qwiz_login-qwiz' + i_qwiz;
   } else {
      selector = 'div.qcard_card-qdeck' + i_qwiz + ' div.qcard-front div.qcard_content_size';
   }

   var $progress_div = $ (selector);
   $progress_div.html (htm.join ('\n')).show ();

   // Initialize tabs.  See which shown first.  If leaderboard, get data;
   // otherwise, get leaderboard data/html the first time the leaderboard tab
   // is activated.
   var i_tab = 0;
   if (progress_bars_leaderboard[qname + i_qwiz] == 'leaderboard') {
      i_tab = 1;
      qqc.jjax (qname, i_qwiz, qrecord_id, 'get_leaderboard_data', '')
   }
   $ ('#progress_bars_leaderboard_tabs_' + qname + i_qwiz).tabs ({
               active:   i_tab,
               activate: function (event, ui) {
                            if (ui.newPanel.hasClass ('leaderboard')) {
                               if (ui.newPanel.html () == '\n') {

                                  // Get leaderboard data.  Callback is
                                  // create_leaderboard_html ().
                                  if (debug[12]) {
                                     console.log ('[create_progress_bars3 > leaderboard activate] qrecord_id:', qrecord_id);
                                  }
                                  qqc.jjax (qname, i_qwiz, qrecord_id, 'get_leaderboard_data', '')
                               }
                            }
                         }
   });

   if (logged_in_b) {
      if (n_units > 1) {

         // Set jQuery progress for each progress bar.
         // Find first partially-complete unit.  Set selection to that unit.
         for (var i=0; i<n_units; i++) {
            var unit = progress_units[i];
            if (unit != '(excluded)') {
               var percent_complete = parseInt (100*unit_best_n_corrects[unit]/unit_n_qs[unit]);
               var $unit_progress_bar = $ ('#unit_progress_bar-' + qname + i_qwiz + '-unit' + i);
               $unit_progress_bar.progressbar ({
                  value:   percent_complete
               });
               var label = unit_best_n_corrects[unit] + '/' + unit_n_qs[unit];
               $unit_progress_bar.find ('div.progress-label').text (label);
            }
         }

      }
      var $course_progress_bar = $ ('#course_progress_bar-' + qname + i_qwiz);
      var percent_complete = parseInt (100*course_best_n_corrects/course_n_questions);
      $course_progress_bar.progressbar ({
         value:   percent_complete
      });
      var label = course_best_n_corrects + '/' + course_n_questions;
      $course_progress_bar.find ('div.progress-label').text (label);
   }
}


// -----------------------------------------------------------------------------
this.create_leaderboard_html = function (data) {
   var show_speed_f = false;
   if (debug[12]) {
      console.log ('[create_leaderboard_html] data:', data);
   }
   var qname       = data.qname;
   var i_qwiz      = data.i_qwiz;
   var qrecord_id  = data.qrecord_id;
   var n_questions = data.n_questions;
   var opt_out_f   = data.opt_out_f;
   var takers      = data.takers;
   var refresh_sec = data.refresh_sec;

   // Organize data into sortable array.
   var leaderdata = [];
   for (var school_id_taker_id in takers) {
      var taker = takers[school_id_taker_id];
      var username = taker['username'];
      var start_sec = 0;
      var completed_sec = 0;
      var n_correct = 0;
      var first_correct_sec = 0;
      if (taker['start']) {
         start_sec = taker['start'];
      }
      if (taker['completed']) {
         completed_sec = taker['completed'];
      }
      if (taker['n_correct']) {
         n_correct = taker['n_correct'];
         first_correct_sec = taker['first_correct'];
      }

      // In case for some reason start time not recorded.
      if (! start_sec) {
         start_sec = first_correct_sec;
      }

      // Elapsed time is either from start through when first completed if
      // completed, or through now.
      var elapsed_sec = '';
      if (show_speed_f) {
         if (completed_sec) {
            elapsed_sec = completed_sec - start_sec;
         } else {
            var now_sec = parseInt (new Date ().getTime ()/1000.0 + 0.5);
            elapsed_sec = now_sec - start_sec;
         }

         // Metric: speed.
         var n_correct_per_sec = 0;
         if (elapsed_sec) {
            n_correct_per_sec = n_correct/elapsed_sec;
         }
      }
      leaderdata.push ([n_correct_per_sec, username, n_correct, elapsed_sec])
   }

   // For numeric sort, need comparison function.  Want descending order.
   /*
   leaderdata.sort (function (a, b) {
                       return b[0] - a[0];
                    });
   */
   // Alt: sort in descending order by number of questions.
   leaderdata.sort (function (a, b) {
                       return b[2] - a[2];
                    });
   if (debug[12]) {
      console.log ('[create_leaderboard_html] leaderdata:', leaderdata);
   }

   var n_leaders = leaderdata.length;

   var htm = [];

   if (n_leaders == 0) {
      htm.push ('<br /><h3>[No recent data available]</h3><br />');
      htm.push ('<button class="qbutton exit_progress_bars" style="float: right;" onclick="' + qname + '.no_login (' + i_qwiz + ', false, true, event)">');
      htm.push (   'Continue');
      htm.push ('</button>');
      $ ('#leaderboard_tab_' + qname + i_qwiz).html (htm.join ('\n'));
      return;
   }
   //htm.push ('<div style="text-align: left; font-weight: normal;">In order by <i>speed</i></div>');

   htm.push ('<div style="max-height: 175px; overflow: auto;">');
   htm.push ('<table class="leaderboard">');
   htm.push (   '<thead>');
   htm.push (      '<th>');
   htm.push (      'Name');
   htm.push (      '</th>');

   // Number correct.
   var correct_card  = qname == 'qwiz_' ? 'correct' : 'card';
   var correct_cards = qname == 'qwiz_' ? 'correct' : 'cards';
   htm.push (      '<th class="qwiz_center">');
   htm.push (         'No. ' + correct_cards);
   htm.push (      '</th>');

   // Speed.
   if (show_speed_f) {
      var label;
      if (n_questions < 60) {
         label = 'Speed: min:sec<br />per ' + correct_card;
      } else if (n_questions < 200) {
         label = 'Speed: ' + correct_cards + '<br />per hour';
      } else {
         label = 'Speed: ' + correct_cards + '<br />per day';
      }
      plugin_url = qqc.get_qwiz_param ('url', './');
      var info = '<img src="' + plugin_url + 'images/info_icon.png" style="cursor: help;" title="Over time since first started quiz/deck">';
      htm.push (      '<th class="qwiz_center">');
      htm.push (         label + info);
      htm.push (      '</th>');
   }

   htm.push (   '</thead>');

   htm.push (   '<tbody>');

   for (var i=0; i<n_leaders; i++) {

      // Name.  Take off @ and after, if there.
      username = leaderdata[i][1].replace (/@.*/, '');
      htm.push (   '<tr>');
      htm.push (      '<td>');
      htm.push (         username);
      htm.push (      '</td>');

      var n_correct = leaderdata[i][2];
      var elapsed_sec = leaderdata[i][3];

      // Questions correct.
      htm.push (      '<td class="qwiz_center">');
      htm.push (         n_correct);
      htm.push (      '</td>');

      // Speed -- either minutes:sec/question, questions/hour, or
      // questions/day, depending on number of questions in quiz.
      if (show_speed_f) {
         var display;
         if (n_questions < 60) {

            // mm:ss/question.
            if (n_correct != 0) {
               var s_per_q = parseInt (elapsed_sec/n_correct + 0.5);
               var mm = parseInt (s_per_q/60.0);
               var ss = s_per_q % 60.0;
               if (ss < 10) {
                  ss = '0' + ss;
               }
               display = '' + mm + ':' + ss;
            } else {
               display = '&ndash;';
            }
         } else if (n_questions < 200) {

            // Questions/hour.  Round to one or two decimal places.
            var q_per_h = n_correct/(elapsed_sec/3600.0);
            if (q_per_h < 0.1) {
               q_per_h = parseInt (q_per_h*100.0 + 0.5)/100.0;
            } else {
               q_per_h = parseInt (q_per_h*10.0 + 0.5)/10.0;
            }
            display = q_per_h;
         } else {

            // Questions/day.  Round to one or two decimal places.
            var q_per_d = n_correct/(elapsed_sec/(24*3600));
            if (q_per_d < 0.1) {
               q_per_d = parseInt (q_per_d*100.0 + 0.5)/100.0;
            } else {
               q_per_d = parseInt (q_per_d*10.0 + 0.5)/10.0;
            }
            display = q_per_d;
         }
         htm.push (      '<td class="qwiz_center">');
         htm.push (         display);
         htm.push (      '</td>');
      }

      htm.push ('   </tr>');
   }
   htm.push (   '<tbody>');
   htm.push ('</table>');
   htm.push ('</div>');

   // Auto-refresh options.
   htm.push ('<div class="refresh_leaderboard">');
   htm.push (   'Refresh every');
   htm.push (   '<select onchange="' + qqcname + '.refresh_leaderboard_change (this, \'' + qname + '\', ' + i_qwiz + ', \'' + qrecord_id + '\')">');

   var options = ['', '5', '10', '15', '30', '60'];
   var n_options = options.length;
   for (var i=0; i<n_options; i++) {
      var selected = refresh_sec == options[i] ? ' selected' : '';
      htm.push (   '<option value="' + options[i] + '"' + selected + '>');
      htm.push (     options[i]);
      htm.push (  '</option>');
   }
   htm.push (   '</select>');
   htm.push (   ' seconds');
   htm.push ('</div>');

   // Return-to-quiz/deck button.
   htm.push ('<button class="qbutton exit_progress_bars" style="float: right;" onclick="' + qname + '.no_login (' + i_qwiz + ', false, true, event)">');
   htm.push (   'Continue');
   htm.push ('</button>');

   // Opt-in/out checkbox and feedback.  Only if logged in.
   if (typeof (document_qwiz_user_logged_in_b) != 'undefined'
                                   && document_qwiz_user_logged_in_b === true) {
      var checked = opt_out_f ? ' checked' : '';
      htm.push ('<div class="leaderboard_opt_out" title="Do not show your name in list">');
      htm.push (   '<label class="qwiz_label">');
      htm.push (      '<input type="checkbox" onclick="qwiz_qcards_common.update_leaderboard_opt_out (\'' + qname + '\',' + i_qwiz + ', this)" ' + checked + ' />');
      htm.push (      'Opt out');
      htm.push (   '</label>');
      htm.push ('</div>');
      htm.push ('<div style="clear: both;"></div>');
      htm.push ('<div id="leaderboard_opt_out_feedback' + qname + i_qwiz + '" class="leaderboard_opt_out_feedback">');
      htm.push (   'Preference saved');
      htm.push ('</div>');
   }

   $ ('#leaderboard_tab_' + qname + i_qwiz).html (htm.join ('\n'));
}


// -----------------------------------------------------------------------------
this.refresh_leaderboard_change = function (select_el, qname, i_qwiz, qrecord_id) {

   // Clear any previous setting.
   if (typeof (refresh_leaderboard_timeout[i_qwiz]) != 'undefined') {
      clearTimeout (refresh_leaderboard_timeout[i_qwiz]);
   }

   var refresh_sec = select_el.value;
   if (refresh_sec) {

      // Closure.
      var refresh_leaderboard_later = function () {
         qqc.jjax (qname, i_qwiz, qrecord_id, 'get_leaderboard_data', {refresh_sec: refresh_sec});
         refresh_leaderboard_timeout[i_qwiz] = setTimeout (refresh_leaderboard_later, refresh_sec*1000);
      }
      refresh_leaderboard_timeout[i_qwiz] = setTimeout (refresh_leaderboard_later, refresh_sec*1000);
   }
}



// -----------------------------------------------------------------------------
this.update_leaderboard_opt_out = function (qname, i_qwiz, checkbox_el) {
   var opt_out_f = checkbox_el.checked ? 1 : 0;
   qqc.jjax (qname, i_qwiz, '', 'update_leaderboard_opt_out', {opt_out_f: opt_out_f});
}


// -----------------------------------------------------------------------------
this.create_use_dataset_options = function (qname, qdata, i_qwiz) {

   // No progress div, yet.
   if (qname == 'qwiz_') {
      $ ('#progress-qwiz' + i_qwiz).html ('');
   } else {
      $ ('#progress-qdeck' + i_qwiz).html ('');
   }

   // Show spinner.
   plugin_url = qqc.get_qwiz_param ('url', './');
   var spinner_url = plugin_url + 'images/spinner40x40.gif';
   var htm = '<img src="' + spinner_url + '" class="qwiz_center_xy" style="margin-top: 100px;" />';
   var $use_dataset_options_div = qqc.$get_login_div (qname, i_qwiz);
   $use_dataset_options_div.html (htm).show ();

   // Save html, if there, in private global var.  Needs to be specific to this
   // quiz/deck.
   use_dataset_options_html[qname + i_qwiz]         = qdata[i_qwiz].use_dataset_options_html;
   use_dataset_options_display_name[qname + i_qwiz] = qdata[i_qwiz].use_dataset_options_display_name;

   // If haven't yet checked whether this quiz/deck OK for this student, do
   // so now (sets document_qwiz_class_id; also counts as start of this quiz/
   // deck).
   var qrecord_id = '';
   if (document_qwiz_user_logged_in_b) {
      qrecord_id = qdata[i_qwiz].qrecord_id;
   }
   var dataset = qdata[i_qwiz].use_dataset;
   if (qdata[i_qwiz].record_start_b && document_qwiz_user_logged_in_b) {
      qdata[i_qwiz].record_start_b = false;
      var now_sec = new Date ().getTime ()/1000.0;
      var data = {qrecord_id_ok: qdata[i_qwiz].qrecord_id_ok,
                  type:          'start',
                  now_sec:       now_sec, 
                  dataset:       dataset,
                  qrecord_id:    qrecord_id,
                  callback:      'create_use_dataset_options2'};
      var record_dest = qname == 'qwiz_' ? 'record_response' : 'record_qcard';
      qqc.jjax (qname, i_qwiz, qrecord_id, record_dest, data);
   } else {
      qqc.create_use_dataset_options2 (qname, i_qwiz, dataset, qrecord_id);
   }
}


// -----------------------------------------------------------------------------
this.create_use_dataset_options2 = function (qname, i_qwiz, dataset, qrecord_id) {

   // Get units, topics, numbers of questions each, how many done by this user
   // for this dataset.
   if (debug[11]) {
      console.log ('[create_use_dataset_options2] dataset:', dataset, ', qrecord_id:', qrecord_id);
   }

   // If restarting ("Practice more questions"), and not logged in, don't need
   // to re-retrieve "questions correct" -- doesn't change.
   if (use_dataset_options_html[qname + i_qwiz]) {
      if (! document_qwiz_user_logged_in_b) {
         qqc.create_use_dataset_options3 ('', qname, i_qwiz);
         return false;
      }
   }
   var qwiz_session_id = '';
   if (typeof (document_qwiz_session_id) != 'undefined') {
      qwiz_session_id = document_qwiz_session_id;
   }
   var data = {qname:            qname,
               i_qwiz_qdeck:     i_qwiz,
               dataset:          dataset,
               qwiz_session_id:  qwiz_session_id};

   // Callback is create_use_dataset_options3 ().
   qqc.jjax (qname, i_qwiz, qrecord_id, 'get_dataset_units_topics', data);
}


// -----------------------------------------------------------------------------
this.create_use_dataset_options3 = function (data, qname, i_qwiz) {
   if (debug[11]) {
      console.log ('[create_use_dataset_options3] data:', data);
   }

   // If qname given, called from create_use_dataset_options2 in case where
   // update is not needed or from receive_and_place_dataset_questions ().  Use
   // saved HTML.
   if (qname) {
      var $use_dataset_options_div = qqc.$get_login_div (qname, i_qwiz);
      $use_dataset_options_div.html (use_dataset_options_html[qname + i_qwiz]).show ();
      return false;
   }

   var qname           = data.qname;
   var i_qwiz          = data.i_qwiz_qdeck;
   var qrecord_id      = data.qrecord_id;
   var dataset         = data.dataset;
   var units           = data.units;
   var topics          = data.topics;
   var n_qss           = data.n_questions_by_unit_topic;
   var n_cgs           = data.n_correct_by_unit_topic;
   var n_units_topics  = units.length;

   var $use_dataset_options_div = qqc.$get_login_div (qname, i_qwiz);
   if (n_units_topics == 0) {
      var msg;
      if (qname == 'qwiz_') {
         msg = 'You have completed all questions correctly';
      } else {
         msg = 'You have marked all cards &ldquo;Got-it&rdquo;';
      }
      $use_dataset_options_div.html ('<br /><b>' + msg + '</b>').show ();
      return false;
   }

   // Create counts of questions by unit and topic, and number correct/got-it.
   // Do in reverse order.
   var n_qs_by_unit_topic = {};
   var n_cg_by_unit_topic = {};
   var n_unit_qss = {};
   var n_unit_cgs = {};
   var n_qs = 0;
   var prev_unit = units[n_units_topics-1];
   if (! prev_unit) {
      prev_unit = 'Other';
   }
   var n_unit_qs = 0;
   var n_unit_cg = 0;
   for (var i=n_units_topics-1; i>=0; i--) {
      var n_cg = n_cgs[i] === null ? 0 : parseInt (n_cgs[i]);

      // Reset nulls to "Other".
      if (! units[i]) {
         units[i] = 'Other';
      }
      if (! topics[i]) {
         topics[i] = 'Other';
      }
      var unit_topic_class = units[i] + '__' + topics[i];
      unit_topic_class = unit_topic_class.replace (/[^a-z0-9]/gi, '_');
      n_qs_by_unit_topic[unit_topic_class] = n_qss[i];
      n_cg_by_unit_topic[unit_topic_class] = n_cg;
      if (units[i] != prev_unit) {
         var prev_unit_class = prev_unit.replace (/[^a-z0-9]/gi, '_');
         n_unit_qss[prev_unit_class] = n_unit_qs;
         n_unit_cgs[prev_unit_class] = n_unit_cg;
         n_unit_qs = 0;
         n_unit_cg = 0;
         prev_unit = units[i];
      }
      n_unit_qs += parseInt (n_qss[i]);
      n_unit_cg += n_cg;

      // Total.
      n_qs += n_qss[i];

   }

   // Finish first unit.
   var unit_class = units[0].replace (/[^a-z0-9]/gi, '_');
   n_unit_qss[unit_class] = n_unit_qs;
   n_unit_cgs[unit_class] = n_unit_cg;

   // If already have html, put in place and update unit counts (preserves
   // expand/collapse and checked/not-checked state).
   var $use_dataset_options_div = qqc.$get_login_div (qname, i_qwiz);
   if (use_dataset_options_html[qname + i_qwiz]) {

      // Put in place.
      $use_dataset_options_div.html (use_dataset_options_html[qname + i_qwiz]).show ();

      // First set all to zero (in case any topics/units completed; those are
      // not returned).
      $ ('#dataset_units_topics-' + qname + i_qwiz + ' td.nquestions').html ('0');
      $ ('#dataset_units_topics-' + qname + i_qwiz + ' td.ncorrect').html ('0');

      // Now do updates.
      for (var unit_class in n_unit_qss) {
         $ ('#dataset_units_topics-' + qname + i_qwiz + ' td.nquestions.' + unit_class).html (n_unit_qss[unit_class]);
         $ ('#dataset_units_topics-' + qname + i_qwiz + ' td.ncorrect.'   + unit_class).html (n_unit_cgs[unit_class]);
      }
      for (var unit_topic_class in n_qs_by_unit_topic) {
         $ ('#dataset_units_topics-' + qname + i_qwiz + ' td.nquestions.' + unit_topic_class).html (n_qs_by_unit_topic[unit_topic_class]);
         $ ('#dataset_units_topics-' + qname + i_qwiz + ' td.ncorrect.'   + unit_topic_class).html (n_cg_by_unit_topic[unit_topic_class]);
      }

      return false;
   }

   // Get expand/collapse icon URLs.
   if (icon_expand_src == 'not ready') {
      plugin_url = qqc.get_qwiz_param ('url', './');
      icon_expand_src   = plugin_url + 'images/icon_expand.gif';
      icon_collapse_src = plugin_url + 'images/icon_collapse.gif';
   }

   var htm = [];
   var display_name = dataset;
   if (use_dataset_options_display_name[qname + i_qwiz]) {
      display_name = use_dataset_options_display_name[qname + i_qwiz];
   }
   var questions_cards = qname == 'qwiz_' ? 'questions' : 'cards';
   htm.push ('<div class="use_dataset_options_header">' + display_name + '</div>');
   htm.push ('<p class="use_dataset_options">Pick the type of ' + questions_cards + ' you want to practice</p>');

   htm.push ('<table id="dataset_units_topics-' + qname + i_qwiz + '" class="dataset_units_topics" align="center">');
   htm.push (   '<tr>');

   // Column: expand/collapse icon.
   htm.push (      '<th>');
   htm.push (      '</th>');

   // Column: choose this unit.  In header: toggle all.  Default: all checked.
   htm.push (      '<th>');
   htm.push (         '<input type="checkbox" onclick="qwiz_qcards_common.dataset_units_topics_toggle_all (this)" checked />');
   htm.push (      '</th>');

   // Unit.
   htm.push (      '<th>');
   htm.push (         'Unit');
   htm.push (      '</th>');

   // Topic.
   htm.push (      '<th>');
   htm.push (         'Topic');
   htm.push (      '</th>');

   // Number of questions/cards.
   htm.push (      '<th style="text-align: right;">');
   if (qname == 'qwiz_') {
      htm.push (      'No. Qs');
   } else {
      htm.push (      'No. cards');
   }
   htm.push (      '</th>');

   // Number of questions/cards correct.
   if (qrecord_id && document_qwiz_user_logged_in_b) {
      htm.push (      '<th style="text-align: right;">');
      if (qname == 'qwiz_') {
         htm.push (      'No. correct');
      } else {
         htm.push (      'No. &ldquo;Got-it&rdquo;');
      }
      htm.push (      '</th>');
   }

   htm.push (   '</tr>');

   var prev_unit = '';
   var i_unit = -1;
   var i_units = [];
   for (var i=0; i<n_units_topics; i++) {
      var unit  = units[i];
      var topic = topics[i];
      if (unit != prev_unit) {
         i_unit++;

         // New unit - new collapsible section.
         prev_unit = unit;
         var unit_id = qname + i_qwiz + '-unit' + i_unit;
         htm.push ('<tr id="' + unit_id + '" class="unit_head">');

         // Column: expand/collapse unit icon.  Starts out as expand.
         htm.push (   '<td style="padding-right: 5px;">');
         htm.push (      '<img src="' + icon_expand_src + '" class="expand expand_collapse" onclick="qwiz_qcards_common.dataset_unit_expand_collapse (this)" title="' + qqc.T ('Show/hide topics in this unit') + '" />');
         htm.push (   '</td>');

         // Column: toggle topics this unit.
         htm.push (   '<td>');
         htm.push (      '<input type="checkbox" onclick="qwiz_qcards_common.dataset_unit_toggle_topics (this)" title="' + qqc.T ('Select/deselect all topics in this unit') + '" checked />');
         htm.push (   '</td>');

         // Two columns: unit.
         htm.push (   '<td colspan="2" class="unit">');
         htm.push (      unit);
         htm.push (   '</td>');

         // Unit questions.
         var unit_class = unit.replace (/[^a-z0-9]/gi, '_');
         htm.push (   '<td class="qwiz_center nquestions ' + unit_class + '">');
         htm.push (      n_unit_qss[unit_class]);
         htm.push (   '</td>');

         // Number of questions/cards correct.
         if (qrecord_id && document_qwiz_user_logged_in_b) {
            htm.push (   '<td class="qwiz_center ncorrect ' + unit_class + '">');
            htm.push (      n_unit_cgs[unit_class]);
            htm.push (   '</td>');
         }

         htm.push ('</tr>');
      }

      // Topic this unit.  Start out hidden.
      htm.push ('<tr class="unit_topic unit_topic' + i_unit + '" data-unit="' + unit + '">');

      // No expand/collapse.
      htm.push (   '<td>');
      htm.push (   '</td>');

      // Selection checkbox.
      var id = qname + i_qwiz + '-unit_topic' + i;
      htm.push (   '<td>');
      htm.push (      '<input type="checkbox" id="' + id + '" checked />');
      htm.push (   '</td>');

      // Unit: indent.
      htm.push (   '<td>');
      htm.push (   '</td>');

      // Topic.
      htm.push (   '<td class="topic">');
      htm.push (      topic);
      htm.push (   '</td>');

      // Questions/cards.
      var unit_topic_class = (unit + '__' + topic);
      unit_topic_class = unit_topic_class.replace (/[^a-z0-9]/gi, '_');
      htm.push (   '<td class="qwiz_center nquestions ' + unit_topic_class + '">');
      htm.push (      n_qs_by_unit_topic[unit_topic_class]);
      htm.push (   '</td>');

      // Number of questions/cards correct.
      if (qrecord_id && document_qwiz_user_logged_in_b) {
         htm.push (   '<td class="qwiz_center ncorrect ' + unit_topic_class + '">');
         htm.push (      n_cg_by_unit_topic[unit_topic_class]);
         htm.push (   '</td>');
      }

      htm.push ('</tr>');
   }
   htm.push ('</table>');

   // ..........................................................................
   var info;
   if (qname == 'qwiz_') {
      info = 'Note: questions that you miss will be repeated within this session';
   } else {
      info = 'Note: cards that you mark &ldquo;Need more practice&rdquo; will be repeated within this session';
   }
   htm.push ('<p class="use_dataset_options">');
   htm.push (   'Maximum ' + questions_cards + ' to practice in this session:');

   htm.push (   '<select id="dataset_max_q">');
   var opts = [10, 20, 30, 50, 100];
   if (debug[11]) {
      opts.unshift (3);
   }
   var selected = '';
   var n_opts = opts.length;
   for (var i=0; i<n_opts; i++) {
      if (opts[i] >= n_qs) {
         selected = selected ? '' : ' selected';
         htm.push ('<option' + selected + '>');
         htm.push (   n_qs);
         htm.push ('</option>');
         break;
      } else {
         if (opts[i] == 30) {
            selected = ' selected';
         }
         htm.push ('<option' + selected + '>');
         htm.push (   opts[i]);
         htm.push ('</option>');
      }
   }
   htm.push (   '</select>');

   htm.push (   '<img src="' + plugin_url + 'images/info_icon.png" style="cursor: help;" title="' + info + '">');
   htm.push ('</p>');

   // ..........................................................................
   if (qrecord_id && document_qwiz_user_logged_in_b) {
      htm.push ('<span class="use_dataset_options">');
      htm.push (   'Do ' + questions_cards + ': &ensp;');
      htm.push ('</span>');
      htm.push ('<label class="qwiz_label use_dataset_options">');
      var title;
      if (qname == 'qwiz_') {
         title = 'Priority is questions you answered incorrectly and new questions';
      } else {
         title = 'Priority is cards you marked &ldquo;need more practice&rdquo and new cards;';
      }
      title += ', but other ' + questions_cards + ' will sometimes be presented for reinforcement';
      htm.push (   '<input type="radio" name="spaced_repetition" class="qwiz_radio_smaller" value="spaced_repetition" checked />Spaced repetition<img src="' + plugin_url + 'images/info_icon.png" style="cursor: help;" title="'+ title + '" /> &ensp;');
      htm.push ('</label>');
      htm.push ('<label class="qwiz_label use_dataset_options">');
      htm.push (   '<input type="radio" name="spaced_repetition" class="qwiz_radio_smaller" value="new" />New&ensp;');
      htm.push ('</label>');
      htm.push ('<label class="qwiz_label use_dataset_options">');
      var label = qname == 'qwiz_' ? 'Incorrect' : '&ldquo;Need more practice&rdquo;';
      htm.push (   '<input type="radio" name="spaced_repetition" class="qwiz_radio_smaller" value="incorrect" />' + label + ' &ensp;');
      htm.push ('</label>');
      htm.push ('<label class="qwiz_label use_dataset_options">');
      htm.push (   '<input type="radio" name="spaced_repetition" class="qwiz_radio_smaller" value="all" />All');
      htm.push ('</label>');
      htm.push ('<br />');
   }

   // ..........................................................................
   htm.push ('<button class="qbutton begin_practice" onclick="qwiz_qcards_common.begin_dataset_quiz_deck (\'' + dataset + '\', \'' + qname + '\', ' + i_qwiz + ', \'' + qrecord_id + '\')">');
   htm.push (   'Begin practice');
   htm.push ('</button>');
   htm.push ('<br />');
   htm.push ('<br />');
   $use_dataset_options_div.html (htm.join ('\n')).show ();
}


// -----------------------------------------------------------------------------
this.set_login_expiry = function () {

   if (debug[0]) {
      console.log ('[set_login_expiry]');
   }

   // Clear any previous timeout.
   clearTimeout (document_qwiz_login_timeout);

   // Start new timeout -- 24 hours.
   document_qwiz_login_timeout = setTimeout ('qwiz_qcards_common.login_expired ()', 24*3600*1000);
}


// -----------------------------------------------------------------------------
this.login_expired = function () {

   // Reset variable, reset menus.
   document_qwiz_user_logged_in_b = false;
   qqc.set_user_menus_and_icons ();

   // Alert user.
   alert (qqc.T ('Qwizcards login session expired.  Please log in again'));
}


// -----------------------------------------------------------------------------
this.is_mobile = function () {
   var mobile_b = document_qwiz_mobile_enabled && window.innerWidth < 961;

   return mobile_b
}


// -----------------------------------------------------------------------------
this.process_textentry_terms = function (data) {
   if (debug[0]) {
      console.log ('process_textentry_terms] data:', data.substr (0, 50), '...');
   }

   terms = {singular: [], plural: []};

   // One per line, and/or semicolon-separated.
   var terms_base = data.split (/\n|;/);
   var n_terms = terms_base.length;
   for (var i=0; i<n_terms; i++) {
      var term_i_singular;
      var term_i_plural;
      var term_i = terms_base[i];

      // Ignore blank lines.
      if (term_i.search (/\S/) == -1) {
         continue;
      }
      var i_pos_slash = term_i.indexOf ('/');
      if (i_pos_slash == -1) {

         // No slash.  For plural, if already ends in "es", do nothing.  If ends
         // in "y", substitute "ies"; if ends in "s" or "sh" or "ch", add "es";
         // if ends in "x", do nothing; otherwise, just add "s".
         term_i_singular = term_i;
         var i_last = term_i.length - 1;
         var last_char = term_i[i_last];
         var last_2_chars = term_i.substr (i_last - 1);
         if (last_2_chars == 'es') {
            term_i_plural = term_i;
         } else if (last_char == 'y') {
            term_i_plural = term_i.substr (0, i_last) + 'ies';
         } else if (last_char == 's' || last_2_chars == 'sh' || last_2_chars == 'ch') {
            term_i_plural = term_i + 'es';
         } else if (last_char == 'x') {
            term_i_plural = term_i;
         } else {
            term_i_plural = term_i + 's';
         }
      } else {

         // Slash.  Either plural form given (after slash), or there is no
         // plural form (nothing after slash).
         term_i_singular = term_i.substr (0, i_pos_slash);
         if (i_pos_slash == term_i.length-1) {
            term_i_plural = term_i.substr (0, i_pos_slash);
         } else {
            term_i_plural = term_i.substr (i_pos_slash+1);
         }
      }
      terms.singular.push ([term_i_singular, qqc.metaphone (term_i_singular)]);
      terms.plural.push   ([term_i_plural,   qqc.metaphone (term_i_plural)]);
   }

   return terms;
}


// -----------------------------------------------------------------------------
this.process_inline_textentry_terms = function (htm, terms_add_terms, qdata, i_q) {

   qdata.additional_errmsgs = [];

   // Allow multiple [add_terms]...[/add_terms] pairs.
   var multiple_b = terms_add_terms == 'add_terms';
   var r_local = extract_delete_shortcode_content (htm, terms_add_terms, multiple_b, qdata);
   if (r_local.content == 'NA') {
      return htm;
   }
   var terms_htm = [r_local.content];
   var anchor_re = new RegExp ('<a.*?href="([^"]*)"[\\s\\S]*?<\\/a>', 'm');

   // Extract link URLs, if there (may be multiple).
   while (true) {
      var m = terms_htm[0].match (anchor_re);
      if (! m) {
         break;
      } else {

         // Download linked-file content.
         var terms_url = m[1];
         var terms_data = qqc.get_textentry_terms (terms_url, qdata);
         if (terms_data) {

            // If linked file not .txt, look for [terms]...[/terms] shortcodes, get
            // content.
            if (terms_url.substr (terms_url.length - 4) != '.txt') {
               /*
               if (debug[5]) {
                  console.log ('[process_inline_textentry_terms] terms_url: ', terms_url);
                  console.log ('[process_inline_textentry_terms] terms_data.substr (0, 100): ', terms_data.substr (0, 100));
               }
               */
               r_remote = extract_delete_shortcode_content (terms_data, 'terms', false, qdata);
               if (r_remote.content == 'NA') {
                  qdata.additional_errmsgs.push (qqc.T ('Did not find [terms]...[/terms] shortcode pair in file') + ' ' + terms_url);
               } else {
                  terms_htm.push (r_remote.content);
               }
            } else {

               // Is .txt file. If [terms] present, parse content between shortcode
               // pairs.  Otherwise, use whole thing.
               if (terms_data.indexOf ('[terms]') != -1) {
                  r_remote = extract_delete_shortcode_content (terms_data, 'terms', false, qdata);
                  if (r_remote.content == 'NA') {
                     qdata.additional_errmsgs.push (qqc.T ('Did not find [terms]...[/terms] shortcode pair in file') + ' ' + terms_url);
                  } else {
                     terms_htm.push (r_remote.content);
                  }
               } else {
                  terms_htm.push (terms_data);
               }
            }
         }

         // Delete <a ... </a> from initial (local, not remote) terms_htm.
         terms_htm[0] = terms_htm[0].replace (anchor_re, '');
      }
   }
   terms_htm = terms_htm.join ('');

   // Replace tags and nonbreaking spaces with EOLs.
   terms_htm = terms_htm.replace (/<[^>]+>|&nbsp;/g, '\n');

   // Save for this quiz -- processed when get to first [textentry], in
   // process_textentry_terms ().
   qdata[i_q][terms_add_terms] = terms_htm;

   // Return htm with shortcodes and content/tags removed.
   return r_local.htm;
}


// -----------------------------------------------------------------------------
function extract_delete_shortcode_content (htm, shortcode, multiple_b, qdata) {

   var content = [];

   var opening_shortcode = '[' + shortcode + ']';
   var closing_shortcode = '[/' + shortcode + ']';

   while (true) {
      var opening_pos = htm.indexOf (opening_shortcode);
      if (opening_pos == -1) {
         break;
      } else {

         var closing_pos = htm.indexOf (closing_shortcode);
         if (closing_pos < opening_pos) {
            qdata.additional_errmsgs.push (opening_shortcode + ' ' + qqc.T ('found, but not') + ' ' + closing_shortcode);
         } else {

            // Find shortcodes, including opening and closing tags.
            var terms_re = new RegExp ('(<[^\\/][^>]*>\\s*)*?\\[' + shortcode + '\\]([\\s\\S]*?)\\[\\/' + shortcode + '\\]((<\\/[^>]+>\\s*)*)', 'm');
            var m = htm.substr (opening_pos).match (terms_re);
            content.push (m[2]);

            // Delete from htm.
            htm = htm.replace (terms_re, '');
         }
      }
      if (! multiple_b) {
         break;
      }
   }
   if (content.length) {
      content = content.join ('');
   } else {
      content = 'NA';
   }

   return {'htm': htm, 'content': content};
}


// -----------------------------------------------------------------------------
// Sort and de-dupe array of terms-metaphone pairs.
this.sort_dedupe_terms_metaphones = function (terms_metaphones) {

   // Sort on terms (zeroth element of each pair).
   var locale = window.navigator.userLanguage || window.navigator.language;
   terms_metaphones.sort (function (a, b) {
      return a[0].toLowerCase ().localeCompare (b[0].toLowerCase (), locale, {numeric: true});
   });

   // De-dupe.
   var deduped_terms_metaphones = [terms_metaphones[0]];
   var len = terms_metaphones.length;
   for (var i=1; i<len; i++) {
      if (terms_metaphones[i][0] != terms_metaphones[i-1][0]) {
         deduped_terms_metaphones.push (terms_metaphones[i]);
      }
   }

   return deduped_terms_metaphones;
}


// -----------------------------------------------------------------------------
this.get_textentry_terms = function (terms_url, qdata) {
   if (debug[0]) {
      console.log ('[get_textentry_terms] terms_url:', terms_url);
   }

   var error_b = false;
   var terms_data = '';

   // Don't do asynchronously -- question can get displayed before have terms!
   $.ajax ({
      type:       'GET',
      async:      false,
      url:        terms_url,
      dataType:   'text',
      error:      function (xhr, desc, exceptionobj) {
                     qdata.additional_errmsgs.push (qqc.T ('Could not read terms file') + ': ' + terms_url);
                     error_b = true;
                  },
      success:    function (data) {
                     terms_data = data;
                  }
   });
   if (! error_b) {
      if (! terms_data) {
         qdata.additional_errmsgs.push (qqc.T ('No data read from terms file') + ': ' + terms_url);
      }
   }
   return terms_data;
}


// -----------------------------------------------------------------------------
this.create_hangman_entry = function (entry) {
   var n_chars = 0;
   if (entry) {
      n_chars = entry.length;
   }
   var chars = [];
   for (var i=0; i<n_chars; i++) {
      if (entry[i].match (/[a-z0-9]/i)) {

         // Alpha characters get underlined.  Very thin space to separate
         // underlines.
         chars.push ('<u>' + entry[i] + '</u>&hairsp;');
      } else if (entry[i] == ' ') {

         // Blanks -- non-underlined en-space blanks.
         chars.push ('&ensp;&hairsp;');
      } else {

         // Punctuation - keep, but not underlined.
         chars.push (entry[i] + '&hairsp;');
      }
   }
   var entry = chars.join ('');
   if (debug[9]) {
      console.log ('[create_hangman_entry] entry:', entry);
   }

   return  entry;
}


// -----------------------------------------------------------------------------
this.create_hangman_incorrect_chars_display = function (incorrect_chars, incorrect_chars_before_hint) {

   var n_incorrect = incorrect_chars.length;

   // Show three allowed, up to eight not-allowed.
   var display = [];
   if (incorrect_chars_before_hint == 0) {
      display.push ('<div class="hangman_incorrect_letters_exceeded inline-block entry">');
   } else {
      display.push ('<div class="hangman_incorrect_letters_allowed inline-block entry">');
   }
   for (var i=0; i<11; i++) {
      var chr_spacer = i < n_incorrect ? incorrect_chars[i] : '<span class="qwiz_spacer">x</span>';
      display.push (chr_spacer);
      if (i + 1 == incorrect_chars_before_hint) {
         display.push ('</div><div class="hangman_incorrect_letters_exceeded inline-block entry">');
      }
   }
   display.push ('</div>');
   display = 'Incorrect: ' + display.join ('');

   return display;
}


// -----------------------------------------------------------------------------
this.setCharAt = function (str, index, chr) {
   if (index > str.length-1)  return str;
   return str.substr (0,index) + chr + str.substr (index+1);
}


// -----------------------------------------------------------------------------
this.make_inline = function (htm, i_pos) {

   // Capture tag that we have.
   var htm_substr = htm.substr (i_pos);
   var tag_htm = htm_substr.match (/<[hp][^>]*>/)[0];
   var tagname = tag_htm[1];
   if (tagname == 'h') {
      tagname += tag_htm[2];
   }

   // Add attribute to tag that we captured.
   var new_tag = qqc.add_attr_value ('style', 'display: inline;', tag_htm);
   if (debug[9]) {
      console.log ('[make_inline] new_tag:', new_tag);
   }

   var new_htm_substr = htm_substr.replace (tag_htm, new_tag);

   // Preface this with a div with same attributes as the tag that we captured.
   var new_div = new_tag.replace (tagname, 'div');
   new_htm_substr = new_div + new_htm_substr;

   // Find the current closing tag (</p> or </h1>, say) and add </div> close.
   // If closing tag not there, add </div>.
   var pat = '</' + tagname + '>';
   if (new_htm_substr.search (pat) != -1) {
      new_htm_substr = new_htm_substr.replace (pat, pat + '</div>');
   } else {
      new_htm_substr += '</div>';
   }

   htm = htm.substr (0, i_pos) + new_htm_substr;

   // Add a closing tag; add tag with attribute after [hangman].
   var closing_tag = '</' + tagname + '>';
   new_tag = '<' + tagname + ' style="display: inline;">';
   htm = htm.replace ('[hangman]', closing_tag + '[hangman]' + new_tag);


   return htm;
}


// -----------------------------------------------------------------------------
// Add a value to an attribute, if attribute there already, or add attribute
// and value.
this.add_attr_value = function (attr, value, attributes) {
   var re = new RegExp (attr + '\\s*=\\s*["\']', 'im');
   var m = attributes.match (re);
   if (m) {

      // Add only if particular value not already there.
      if (attributes.search (value) == -1) {
         attributes = attributes.replace (re, m[0] + value + ' ');
      }
   } else {
      attributes = attributes.replace ('>', ' ' + attr + '="' + value + '">');
   }
   if (debug[0]) {
      console.log ('[add_attr_value] attributes:', attributes);
   }

   return attributes;
}


// -----------------------------------------------------------------------------
// Take tags out of text and replace non-breaking spaces and EOLs with space,
// multiple spaces with single space, trim.
this.remove_tags_eols = function (htm) {
   if (htm) {
      htm = qqc.trim (htm.replace (/<[^>]+>/g, '').replace (/\n|&nbsp;/g, ' ').replace (/ {2,}/g, ' '));
   }

   return htm;
}


// -----------------------------------------------------------------------------
this.init_enter_intercept = function () {

   // For page, listen for keydown.  If Enter, trigger one of the appropriate
   // buttons, based on which is currently visible.
   $ ('html').off ();
   $ ('html').on ('keydown',
                  function (e) {
                     if (document_active_qwiz_qdeck && e.keyCode == 13) {
                        if (debug[7]) {
                            console.log ('[init_enter_intercept] document_active_qwiz_qdeck:', document_active_qwiz_qdeck);
                            console.log ('[init_enter_intercept] e.target:', e.target);
                        }

                        // If <Enter> in <input> or <textarea> that is NOT qwiz/
                        // qdeck-related, ignore.
                        var tagname = e.target.tagName.toLowerCase ();
                        if (tagname == 'input' || tagname == 'textarea') {
                           var id = e.target.id.toLowerCase ();
                           if (id.indexOf ('qwiz') == -1
                                                && id.indexOf ('qdeck') == -1) {
                              return false;
                           }
                        }
                        if (e.target.className.indexOf ('user_html') != -1) {
                           var id = e.target.id.toLowerCase ();
                           if (id.indexOf ('qwiz') == -1
                                                && id.indexOf ('qdeck') == -1) {
                              return false;
                           }
                        }
                        var $document_active_qwiz_qdeck = $ (document_active_qwiz_qdeck);
                        if (document_active_qwiz_qdeck.className.toLowerCase ().indexOf ('qcard_window') == -1) {

                           // Quiz.
                           if ($document_active_qwiz_qdeck.find ('div.next_button').is (':visible')) {
                              if (debug[7]) {
                                 console.log ('[init_enter_intercept] qwiz next_button trigger');
                                 console.log ('[init_enter_intercept] $document_active_qwiz_qdeck.find (\'div.next_button button\'):', $document_active_qwiz_qdeck.find ('div.next_button button'));
                              }
                              $document_active_qwiz_qdeck.find ('div.next_button button').trigger ('click');
                           } else if ($document_active_qwiz_qdeck.find ('div.textentry_check_answer_div').is (':visible')) {
                              if (debug[7]) {
                                  console.log ('[init_enter_intercept] qwiz check_answer trigger');
                              }
                              $document_active_qwiz_qdeck.find ('div.textentry_check_answer_div button.textentry_check_answer').trigger ('click');
                           } else if ($document_active_qwiz_qdeck.find ('button.login_button').is (':visible')) {
                              if (debug[7]) {
                                  console.log ('[init_enter_intercept] qwiz login_button trigger');
                              }
                              $document_active_qwiz_qdeck.find ('div.qwiz-login button.login_button').trigger ('click');
                           } else if ($document_active_qwiz_qdeck.find ('button.begin_practice').is (':visible')) {
                              if (debug[7]) {
                                  console.log ('[init_enter_intercept] qwiz begin_practice trigger');
                              }
                              $document_active_qwiz_qdeck.find ('div.qwiz-login button.begin_practice').trigger ('click');
                           } else if ($document_active_qwiz_qdeck.find ('button.exit_progress_bars').is (':visible')) {
                              if (debug[7]) {
                                  console.log ('[init_enter_intercept] qwiz exit_progress_bars trigger');
                              }
                              $document_active_qwiz_qdeck.find ('div.qwiz-login button.exit_progress_bars').trigger ('click');
                           }
                        } else if (! qcard_.qwizard_b) {

                           // Flashcard deck (as long as not editing).  If
                           // <Enter> while "Flip" button has focus, don't do
                           // (but allow bubble).
                           if (e.target.className.indexOf ('flip') != -1) {
                              return;
                           }

                           // Do login first, because don't check visibility of
                           // "Check answer".
                           if ($document_active_qwiz_qdeck.find ('button.login_button').is (':visible')) {
                              if (debug[7]) {
                                  console.log ('[init_enter_intercept] qdeck login_button trigger');
                              }
                              $document_active_qwiz_qdeck.find ('button.login_button').trigger ('click');
                           } else if ($document_active_qwiz_qdeck.find ('button.begin_practice').is (':visible')) {
                              if (debug[7]) {
                                  console.log ('[init_enter_intercept] qdeck begin_practice trigger');
                              }
                              $document_active_qwiz_qdeck.find ('div.button.begin_practice').trigger ('click');
                           } else if ($document_active_qwiz_qdeck.find ('button.exit_progress_bars').is (':visible')) {
                              if (debug[7]) {
                                  console.log ('[init_enter_intercept] qdeck exit_progress_bars trigger');
                              }
                              $document_active_qwiz_qdeck.find ('button.exit_progress_bars').trigger ('click');
                           } else if ($document_active_qwiz_qdeck.find ('div.qcard_next_buttons button.flip.qbutton').length) {

                              // "Check answer button will not have "qbutton" (instead,
                              // has "qbutton_disabled" until active.  Same button for
                              // regular card and textentry input.
                              if (debug[7]) {
                                  console.log ('[init_enter_intercept] qdeck Check answer trigger');
                                  console.log ('[init_enter_intercept] find:', $document_active_qwiz_qdeck.find ('div.qcard_next_buttons button.flip'));
                              }
                              $document_active_qwiz_qdeck.find ('div.qcard_next_buttons button.flip').trigger ('click');
                           }
                        }
                     }
                  });
}


// -----------------------------------------------------------------------------
this.$get_login_div = function (qname, i_qwiz) {
   var selector;
   if (qname == 'qwiz_') {
      selector = '#qwiz_login-qwiz' + i_qwiz;

      // Also, no progress div, yet.
      $ ('#progress-qwiz' + i_qwiz).html ('');
   } else {
      selector = 'div.qcard_card-qdeck' + i_qwiz + ' div.qcard-front div.qcard_content_size';
      $ ('#progress-qdeck' + i_qwiz).html ('');
   }

   return $ (selector);
}


// -----------------------------------------------------------------------------
this.get_attr = function (htm, attr_name, qdata) {

   qdata.additional_errmsgs = [];
   var attr_value = '';

   // get_attr () is always preceded by replace_smart_quotes (), so can just
   // handle regular quotes.
   var attr_re = new RegExp ('(\\s|^)' + attr_name + '\\s*=\\s*("([^"]+)")*', 'm');
   var attr_match = htm.match (attr_re);
   if (attr_match) {
      if (attr_match[3]) {
         attr_value = qqc.trim (attr_match[3]);
      } else {
         qdata.additional_errmsgs.push (qqc.T ('Did not get value (inside double quotation marks) with') + ' ' + attr_name + qqc.T (' in') + ' ' + htm);
      }
   }

   return attr_value;
}


// -----------------------------------------------------------------------------
// Find position in html string of a shortcode, including opening tags before
// the shortcode.  <img ... /> and <input... /> don't count!  Nor does 
// <span class="qwizard_placeholder"> or <br> or <br />.
this.opening_tag_shortcode_pos = function (shortcode_pat, htm) {

   // Escape "[", "]" and "*".
   var shortcode_pat = shortcode_pat.replace (/([\[\]\*])/g, '\\$1');

   var opening_tags_re_txt = '(<[^\\/][^>]*>\\s*)*?' + shortcode_pat + '[\\s\\S]*';
   var opening_tags_re = new RegExp (opening_tags_re_txt);

   var i_pos = htm.search (opening_tags_re);

   if (i_pos == -1) {
      i_pos = htm.length;
   } else {

      // We want to exclude <img ...> and <span class="qwizard_placeholder">
      // tags before the shortcode.  First exclude shortcode and after, then
      // look for (last of) either of these.  Others?  DKTMP
      var shortcode_re = new RegExp (shortcode_pat);
      var shortcode_pos = htm.search (shortcode_re);

      var repeat_b = false;
      var img_pos = htm.substring (i_pos, shortcode_pos).lastIndexOf ('<img');
      if (img_pos != -1) {
         i_pos += img_pos + 3;
         repeat_b = true;
      }
      var input_pos = htm.substring (i_pos, shortcode_pos).lastIndexOf ('<input');
      if (input_pos != -1) {
         i_pos += input_pos + 3;
         repeat_b = true;
      }
      var qp_pos = htm.substring (i_pos, shortcode_pos).lastIndexOf ('<span class="qwizard_placeholder">');
      if (qp_pos != -1) {
         i_pos += qp_pos + 3;
         repeat_b = true;
      }
      var break_pos = htm.substring (i_pos, shortcode_pos).lastIndexOf ('<br');
      if (break_pos != -1) {
         i_pos += break_pos + 3;
         repeat_b = true;
      }

      // If found image or qwizard placeholder or break, repeat the procedure.
      if (repeat_b) {
         var ii_pos = htm.substr (i_pos).search (opening_tags_re);
         i_pos += ii_pos;
      }
   }

   return i_pos;
}


// -----------------------------------------------------------------------------
this.replace_smart_quotes = function (string) {
   var new_string = string.replace (/[\u201C\u201D\u2033]/gm, '"');
   var new_string = new_string.replace (/[\u2018\u2019]/gm, "'");

   return new_string;
}


// If there's an unmatched </p> or the like near the beginning, add a matching
// opening tag.
// -----------------------------------------------------------------------------
this.balance_closing_tag = function (s) {
   var i_pos_close_tag = s.search (/<\/[ph]/);
   if (i_pos_close_tag != -1) {

      //                 </h2>
      // i_pos_close_tag + 012--
      var open_phx;
      var close_phx = s.substr (i_pos_close_tag + 2, 2);
      if (close_phx.substr (1) == '>') {
         open_phx = '<p';
      } else {
         open_phx = '<' + close_phx;
      }

      // Add only if there's no matching opening tag BEFORE the closing tag.
      var re = new RegExp (open_phx);
      var i_pos_open_phx = s.search (re);
      if (i_pos_open_phx == -1 || i_pos_open_phx > i_pos_close_tag) {
         s = open_phx + '>' + s;
      }
   }

   return s;
}


// -----------------------------------------------------------------------------
var number_word;
this.number_to_word = function (number) {
   if (! number_word) {
      number_word = [qqc.T ('zero'), qqc.T ('one'), qqc.T ('two'), qqc.T ('three'), qqc.T ('four'), qqc.T ('five'), qqc.T ('six'), qqc.T ('seven'), qqc.T ('eight'), qqc.T ('nine'), qqc.T ('ten')];
   }
   var word;
   if (number > 10) {
      word = number;
   } else {
      word = number_word[number];
   }

   return word;
}


// -----------------------------------------------------------------------------
this.number_to_ordinal_word = function (n, capitalize_b) {
   ordinal_words = ['zeroth', 
                    'first', 'second', 'third', 'fourth', 'fifth',
                    'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
                    'eleventh', 'twelfth', 'thirteenth'];
   var ordinal_word;
   if (n < 14) {
      ordinal_word = ordinal_words[n];
   } else {
      var units_place = n % 10;
      if (units_place == 1) {
         ordinal_word = '' + n + 'st';
      } else if (units_place == 2) {
         ordinal_word = '' + n + 'nd';
      } else if (units_place == 3) {
         ordinal_word = '' + n + 'rd';
      } else {
         ordinal_word = '' + n + 'th';
      }
   }
   if (capitalize_b) {
      ordinal_word = ordinal_word.substr (0, 1).toUpperCase () + ordinal_word.substr (1);
   }

   return ordinal_word;
}


// -----------------------------------------------------------------------------
this.Tplural = function (word, plural_word, n) {
   var new_word;
   if (n == 1) {
      new_word = word;
   } else {
      new_word = plural_word;
   }

   return qqc.T (new_word);
}


// -----------------------------------------------------------------------------
this.T = function (string) {

   var t_string = '';

   // Translation, if available.
   if (typeof (qwiz_params) != 'undefined') {
      if (typeof (qwiz_params.T) != 'undefined') {
         if (typeof (qwiz_params.T[string]) != 'undefined') {
            t_string = qwiz_params.T[string];
         }
      }
   } else if (typeof (qwizzled_params) != 'undefined') {
      if (typeof (qwizzled_params.T) != 'undefined') {
         if (typeof (qwizzled_params.T[string]) != 'undefined') {
            t_string = qwizzled_params.T[string];
         }
      }
   }
   if (t_string == '') {

      // Translation not available.  Just use default string.
      t_string = string;
   }

   return t_string;
}


// -----------------------------------------------------------------------------
/*
function T (string) {
   return qqc.T (string);
}
*/


// -----------------------------------------------------------------------------
this.get_qwiz_param = function (key, default_value) {

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
this.trim = function (s) {
   if (s) {
      s = s.toString ();
      if ('a'.trim) {
         s = s.trim ();
      } else {
         s = s.replace (/^\s+|\s+$/g, '');
      }
   }

   return s;
}


// -----------------------------------------------------------------------------
this.add_script = function (script_url) {
   var script = document.createElement ('script');
   script.setAttribute ('charset', 'utf-8');
   script.src = script_url;

   var head = [];
   try {
      var head = $ ('head');
   } catch (e) {}
   if (head.length) {
      head.append (script);
   } else {
      $ ('body').append (script);
   }
}


// -----------------------------------------------------------------------------
this.increment_usage = function (quiz_deck, i_qwiz_deck, post_id) {

   // 'action' corresponds to wp_ajax_increment_qwiz_deck_usage in
   // qwiz-online-quizzes-wp-plugin.php.
   var data = {action:        'increment_qwiz_deck_usage',
               quiz_deck:     quiz_deck,
               i_qwiz_deck:   i_qwiz_deck,
               post_id:       post_id};

   var ajaxurl = qqc.get_qwiz_param ('ajaxurl', '');
   if (debug[0]) {
      console.log ('[increment_usage] data:', data);
      console.log ('[increment_usage] ajaxurl:', ajaxurl);
   }

   if (ajaxurl) {
      $.ajax ({
         type:       'POST',
         url:        ajaxurl,
         data:       data,
         success:    function (response) {
                        if (debug[0]) {
                           console.log ('[increment_usage] typeof (response):', typeof (response));
                           console.log ('[increment_usage] response.substr (0, 100):', response.substr (0, 100));
                        }
                     }
      });
   }
}


// -----------------------------------------------------------------------------
this.dataset_units_topics_toggle_all = function (checkbox_el) {
   $ (checkbox_el).parents ('table.dataset_units_topics').find ('input:checkbox').prop ('checked', checkbox_el.checked);

   // Set attribute for sake of html save (in begin_dataset_quiz_deck ()).
   if (checkbox_el.checked) {
      $ (checkbox_el).attr ('checked', true);
   } else {
      $ (checkbox_el).removeAttr ('checked');
   }
}


// -----------------------------------------------------------------------------
this.dataset_unit_toggle_topics = function (checkbox_el) {
   var unit_id = $ (checkbox_el).parents ('tr.unit_head').attr ('id');
   var m = unit_id.match (/-unit([0-9]+)/);
   var i_unit = m[1];
   $ (checkbox_el).parents ('table.dataset_units_topics').find ('tr.unit_topic' + i_unit + ' input:checkbox').prop ('checked', checkbox_el.checked);

   // Set attribute for sake of html save (in begin_dataset_quiz_deck ()).
   if (checkbox_el.checked) {
      $ (checkbox_el).attr ('checked', true);
   } else {
      $ (checkbox_el).removeAttr ('checked');
   }
}


// -----------------------------------------------------------------------------
this.dataset_unit_expand_collapse = function (icon_el) {
   $icon_el = $ (icon_el);
   var unit_id = $icon_el.parents ('tr.unit_head').attr ('id');
   var m = unit_id.match (/-unit([0-9]+)/);
   var i_unit = m[1];
   var $unit_topics = $icon_el.parents ('table.dataset_units_topics').find ('tr.unit_topic' + i_unit);
   var expand_f = $icon_el.hasClass ('expand');
   if (expand_f) {
      $icon_el.removeClass ('expand').addClass ('collapse').attr ('src', icon_collapse_src);
      $unit_topics.show ();
   } else {
      $icon_el.removeClass ('collapse').addClass ('expand').attr ('src', icon_expand_src);
      $unit_topics.hide ();
   }
}


// -----------------------------------------------------------------------------
this.begin_dataset_quiz_deck = function (dataset, qname, i_qwiz, qrecord_id) {

   // See which units/topics.
   var selected_units  = [];
   var selected_topics = [];
   $ ('#dataset_units_topics-' + qname + i_qwiz + ' tr.unit_topic').each (function () {
      var $checkbox = $ (this).find ('input:checkbox');
      if ($checkbox.prop ('checked')) {
         var unit  = $ (this).data ('unit');
         var topic = $ (this).find ('td.topic').html ();
         selected_units.push (qqc.trim (unit));
         selected_topics.push (qqc.trim (topic));

         // If any topic selected, make sure that unit checkbox is checked.
         $ (this).prev ('tr.unit_head').find ('input:checkbox').prop ('checked', true);
      }
   });

   if (debug[11]) {
      console.log ('[begin_dataset_quiz_deck] selected_units:', selected_units)
      console.log ('[begin_dataset_quiz_deck] selected_topics:', selected_topics)
   }

   if (selected_units.length == 0) {
      alert (qqc.T ('Please select at least one unit/topic'));
      return false;
   }

   // Separate loop over all checkboxes -- set checked attribute to reflect
   // current state for sake of save, below.
   $ ('#dataset_units_topics-' + qname + i_qwiz + ' input:checkbox').each (function () {
      var $checkbox = $ (this);
      if ($checkbox.prop ('checked')) {
         $checkbox.attr ('checked', true);
      } else {
         $checkbox.removeAttr ('checked');
      }
   });

   // Save menu html.  Also get whether random question order.
   var selector;
   var random_b;
   var $use_dataset_options_div = qqc.$get_login_div (qname, i_qwiz);
   use_dataset_options_html[qname + i_qwiz] = $use_dataset_options_div.html ();
   if (qname == 'qwiz_') {
      qwiz_.set_qwizdata (i_qwiz, 'use_dataset_options_html', use_dataset_options_html[qname + i_qwiz]);
      random_b = qwiz_.get_qwizdata (i_qwiz, 'random_b');
   } else {
      qcard_.set_deckdata (i_qwiz, 'use_dataset_options_html', use_dataset_options_html[qname + i_qwiz]);
      random_b = qcard_.get_deckdata (i_qwiz, 'random_b');
   }

   var n_questions_in_set = $ ('#dataset_max_q').val ();
   var questions_to_do = $ ('input[name="spaced_repetition"]:checked').val ();
   qqc.get_dataset_questions (dataset, qname, i_qwiz, qrecord_id,
                              selected_units, selected_topics,
                              n_questions_in_set, questions_to_do, random_b);
}


// -----------------------------------------------------------------------------
this.get_dataset_questions = function (dataset, qname, i_qwiz_qdeck, qrecord_id,
                                       units, topics, n_questions_in_set,
                                       questions_to_do, random_b,
                                       use_dataset_questions_htm) {

   // Show spinner and -- after a while -- countdown.
   var questions_cards = qname == 'qwiz_' ? 'questions' : 'cards';
   plugin_url = qqc.get_qwiz_param ('url', './');
   var spinner_url = plugin_url + 'images/spinner40x40.gif';
   var htm =   '<div id="dataset_questions_spinner-' + qname + i_qwiz_qdeck + '" style="margin-top: 100px;" >'
             +    'Getting ' + questions_cards + ' from Qwizcards server...<br />'
             +    '<img src="' + spinner_url + '" class="qwiz_center_xy" />'
             +    '<br />'
             + '</div>'
             + '<p id="dataset_questions_countdown_display-' + qname + i_qwiz_qdeck + '" style="text-align: center;">'
             + '</p>';
   var $use_dataset_options_div = qqc.$get_login_div (qname, i_qwiz_qdeck);
   $use_dataset_options_div.html (htm).show ();
   var delay_start_dataset_questions_countdown = function () {
      start_dataset_questions_countdown (qname, i_qwiz_qdeck);
   }
   dataset_questions_countdown_timeout[qname + i_qwiz_qdeck] = setTimeout (delay_start_dataset_questions_countdown, 5000);

   // Go via local WordPress server so question source can be passed through
   // "the_content" filter.
   // 'action' corresponds to wp_ajax_get_dataset_questions in
   // qwiz-online-quizzes-wp-plugin.php.
   var qwiz_session_id = '';
   if (typeof (document_qwiz_session_id) != 'undefined') {
      qwiz_session_id = document_qwiz_session_id;
   }
   var page_url = window.location.href;
   var data = {action:              'get_dataset_questions',
               dataset:             dataset,
               qname:               qname,
               i_qwiz_qdeck:        i_qwiz_qdeck,
               qrecord_id:          qrecord_id,
               units:               btoa (JSON.stringify (units)),
               topics:              btoa (JSON.stringify (topics)),
               n_questions_in_set:  n_questions_in_set,
               questions_to_do:     questions_to_do,
               random_f:            random_b,
               qwiz_session_id:     qwiz_session_id,
               page_url:            page_url};
   if (use_dataset_questions_htm) {

      // Parse out dataset-question IDs, pass to get_dataset_questions.php.
      var attr = qname == 'qwiz_' ? 'use_dataset_question' : 'use_dataset_card';
      var use_dataset_question_ids = parse_dataset_question_ids (use_dataset_questions_htm, attr);
      data.use_dataset_question_ids = btoa (JSON.stringify (use_dataset_question_ids));
   }

   var ajaxurl = qqc.get_qwiz_param ('ajaxurl', '');
   if (debug[11]) {
      console.log ('[get_dataset_questions] data:', data);
      console.log ('[get_dataset_questions] ajaxurl:', ajaxurl);
   }

   if (ajaxurl) {
      $.ajax ({
         type:       'POST',
         url:        ajaxurl,
         data:       data,
         success:    receive_and_place_dataset_questions
      });
   }
}


// -----------------------------------------------------------------------------
function receive_and_place_dataset_questions (response) {

   // Load response (html of qwiz/qdeck content), have qwiz.js or qwizcards.js
   // process, place in relevant div, and go to first question/card.
   if (debug[11]) {
      console.log ('[receive_and_place_dataset_questions] response:', response);
   }

   // Callback from qwiz-online-quizzes-wp-plugin.php
   //                                          > wp_ajax_get_dataset_questions.
   var ok_f = response['ok_f'];
   if (ok_f == 0) {
      alert ('Permission denied (see qwizcards.com/admin/manage_datasets.php)');
      return false;
   }

   var n_questions             = response['n_questions'];
   var questions_html          = response['questions_html'];
   var qname                   = response['qname'];
   var i_qwiz_qdeck            = response['i_qwiz_qdeck'];
   var use_dataset_questions_f = response['use_dataset_questions_f'];

   // Stop countdown.
   clearTimeout (dataset_questions_countdown_timeout[qname + i_qwiz_qdeck]);

   if (n_questions == 0) {
      var questions_cards = qname == 'qwiz_' ? 'questions' : 'cards';
      alert (qqc.T ('There are no ' + questions_cards + ' available of the type you selected'));

      // Re-display units/topics menu.
      qqc.create_use_dataset_options3 ('', qname, i_qwiz_qdeck);
      return false;
   }

   // Things like hints="0" can come back as hints=&#8221;0&#8222;, so convert
   // back to characters.
   questions_html = decodeHtmlEntities (questions_html);

   if (qname == 'qwiz_') {
      if (use_dataset_questions_f == 1) {

         // Get the html for all the questions in this qwiz, insert the html
         // for those questions that came from a dataset.
         var htm = qwiz_.get_qwizdata (i_qwiz_qdeck, 'use_dataset_questions_htm');
         questions_html = insert_dataset_questions (htm, questions_html, qname);
      } else {

         // Questions separated by '[qQq]' (per get_dataset_questions_v2.php).  Split into array.
         // Take out separator.
         questions_html = questions_html.replace (/\[qQq\]/g, '');
      }

      // Process html.
      var new_htm = qwiz_.process_questions (questions_html, '', i_qwiz_qdeck);
      qwiz_.display_progress (i_qwiz_qdeck);
      var $login_div = $ ('#qwiz_login-qwiz' + i_qwiz_qdeck).hide ();
      var $questions = $ ('#dataset_questions-qwiz' + i_qwiz_qdeck);
      $questions.html (new_htm);

      // Initialize textentry_autocomplete fields, if any.
      qwiz_.init_textentry_autocomplete ($questions);

      // Make WordPress audio player, if any, visible.
      $questions.find ('.wp-audio-shortcode').css ({visibility: 'visible'});

      // Display first question.
      qwiz_.set_qwizdata (i_qwiz_qdeck, 'login_show_b', false);
      qwiz_.set_qwizdata (i_qwiz_qdeck, 'i_question', 0);
      qwiz_.display_question (i_qwiz_qdeck, 0, true);
   } else {
      if (use_dataset_questions_f == 1) {

         // Get the html for all the cards in this deck, insert the html
         // for those cards that came from a dataset.
         var htm = qcard_.get_deckdata (i_qwiz_qdeck, 'use_dataset_card_html');
         questions_html = insert_dataset_questions (htm, questions_html, qname);
      } else {
         questions_html = questions_html.replace (/\[qQq\]/g, '');
      }

      // Process shortcodes -- save data in deckdata[] arrays.
      var card_tags = questions_html.match (/\[q[^\]]*\]/gm);
      var n_cards = card_tags.length;
      qcard_.process_card_attributes (i_qwiz_qdeck, card_tags);
      var q_opening_tags = new Array (n_cards).fill ('');
      qcard_.process_cards (questions_html, i_qwiz_qdeck);
      qcard_.set_deckdata (i_qwiz_qdeck, 'n_cards', n_cards);
      qcard_.set_deckdata (i_qwiz_qdeck, 'n_to_go', n_cards);
      $ ('#qcard_next_buttons-qdeck' + i_qwiz_qdeck).css ('visibility', 'visible');

      if (use_dataset_questions_f == 0 || qcard_.no_intro_b[i_qwiz_qdeck] || n_cards == 1) {
         qcard_.set_deckdata (i_qwiz_qdeck, 'no_flip_b', false);
         qcard_.start_deck2 (i_qwiz_qdeck);
      } else {
         qcard_.set_deckdata (i_qwiz_qdeck, 'no_flip_b', true);

         var intro_html = qcard_.get_deckdata (i_qwiz_qdeck, 'intro_html');
         qcard_.$card_front (i_qwiz_qdeck, -1).html (intro_html);

         qcard_.qwiz_icon_stop_propagation (i_qwiz_qdeck);
         qcard_.set_container_width_height (i_qwiz_qdeck);
      }
   }
}


// -----------------------------------------------------------------------------
function insert_dataset_questions (htm, questions_html, qname) {

   // questions_html is string, questions separated by '[qQq]' (per
   // get_dataset_questions_v2.php).  Split into array.
   var dataset_questions = questions_html.split ('[qQq]');

   // Get ID of each question returned from dataset(s).
   var n_dataset_questions = dataset_questions.length;
   var dataset_question_is = {};
   for (var i=0; i<n_dataset_questions; i++) {

      // Returns an array (of one element in this case).  Get element, add to
      // new array.
      var dataset_question_id = parse_dataset_question_ids (dataset_questions[i], 'dataset_id')[0];
      dataset_question_is[dataset_question_id] = i;
   }
   // In htm, dataset questions look like
   // [q use_dataset_question="8q_dataset|8ef432a9"]
   // or [q use_dataset_card="8q_dataset|8ef432a9"].  Find each, replace with
   // html from dataset.
   var matches = htm.match (/\[q use_dataset_(question|card)\s*=\s*\S[^\]]+/g);
   var n_dataset_questions = matches.length;
   for (ii=0; ii<n_dataset_questions; ii++) {
      var attribute = qqc.replace_smart_quotes (matches[ii]);
      var dataset_question_id = attribute.match (/"([^"]+)/)[1];
      var i = dataset_question_is[dataset_question_id];

      // Replace with html from dataset.
      htm = htm.replace (/\[q use_dataset_(question|card)\s*=\s*\S[^\]]+\]/, dataset_questions[i]);
   }
   // Switch dataset_id= to use_dataset_question= throughout so qwizard can
   // distinguish.
   var attr = qname == 'qwiz_' ? 'use_dataset_question' : 'use_dataset_card';
   htm = htm.replace (/dataset_id/g, attr);

   return htm;
}


// -----------------------------------------------------------------------------
function parse_dataset_question_ids (htm, attr) {
   var re = new RegExp (attr + '\\s*=\\s*\\S[^\\]]+', 'g')
   var matches = htm.match (re);
   var n_use_dataset_questions = matches.length;
   var use_dataset_question_ids = [];
   for (i=0; i<n_use_dataset_questions; i++) {
      var attribute = qqc.replace_smart_quotes (matches[i]);
      var use_dataset_question_id = attribute.match (/"([^"]+)/)[1];
      use_dataset_question_ids.push (use_dataset_question_id);
   }

   return use_dataset_question_ids;
}


// -----------------------------------------------------------------------------
function start_dataset_questions_countdown (qname, i_qwiz_deck) {

   // Show countdown timer.
   var $dataset_questions_countdown_display = $ ('#dataset_questions_countdown_display-' + qname + i_qwiz_deck);
   var seconds_remaining = 16;
   var dataset_questions_countdown = function () {
      seconds_remaining--;
      if (seconds_remaining > 0) {
         var text = 'Trying for ' + seconds_remaining + ' more ' + qqc.Tplural ('second', 'seconds', seconds_remaining) + '...';
         $dataset_questions_countdown_display.html (text);
         dataset_questions_countdown_timeout[qname + i_qwiz_deck] = setTimeout (dataset_questions_countdown, 1000);
      } else {
         $ ('#dataset_questions_spinner-' + qname + i_qwiz_deck).css ({visibility: 'hidden'});
         var questions_cards = qname == 'qwiz_' ? 'questions' : 'cards';
         var text = 'Sorry, could not get ' + questions_cards;
         $dataset_questions_countdown_display.html (text);
      }
   }
   dataset_questions_countdown ();
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
this.parse_html_block = function (htm, shortcodes, next_shortcodes, ignore_nbsp_b) {
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
// Whatever this block of htm starts with ("<div", for example), find htm up to
// matching close ("</div>" in this case).  If no matching close, return null
// string.
this.find_matching_block = function (htm) {

   var htm_block = '';

   // Look through for opening/closing tags.
   var len = htm.length;
   var i = 0;
   var i_level = 0;
   var tags = [];
   var expecting_slash_p_b = false;
   while (i < len) {
      if (htm[i] == '<') {

         // Ignore old-style breaks and horizontal rules.
         if (htm.substr (i, 4) == '<br>' || htm.substr (i, 4) == '<hr>') {
            i += 3;
            continue;

         // Ignore comments.
         } else if (htm.substr (i, 4) == '<!--') {
            i += 4;
            continue;

         } else if (   htm.substr (i, 4) == '<img' 
                    || htm.substr (i, 6) == '<input' 
                    || htm.substr (i, 3) == '<br' 
                    || htm.substr (i, 3) == '<hr' ) {

            // Images and input appear to be old-style (end with '>', not '/>').
            // Do <br ...> and <hr ...> here, too.  Search for end (handles
            // '/>', too).
            i += 3;
            while (i < len) {
               i++;
               if (htm[i] == '>') {
                  break;
               }
            }
            continue
         } else if (htm.substr (i, 2) == '<p') {

            // If already expecting </p>, continue at same level.  
            if (expecting_slash_p_b) {
               i++;
               continue;
            }

            // Set flag that we're expecting </p>.
            expecting_slash_p_b = true;
         }
         i++;
         if (htm[i] == '/') {

            // If </div> while expecting </p>, extra level up.
            // If got the </p>, unset flag.
            if (htm.substr (i, 4) == '/div') {
               if (expecting_slash_p_b) {
                  i_level--;
                  expecting_slash_p_b = false;
               }
            } else if (htm.substr (i, 2) == '/p') {
               expecting_slash_p_b = false;
            }

            // See that closing tag matches opening tag at this level.  First
            // capture closing tag.
            i_level--;
            i++;
            var closing_tag = '';
            while (i < len) {
               if (htm[i] == '>') {
                  break;
               }
               closing_tag += htm[i];
               i++;
            }

            // If closing tag doesn't match, don't consider it a closing tag
            // (undo i_level change).
            if (debug[5]) {
               console.log ('[find_matching_block] i_level: ', i_level, ', closing_tag:', closing_tag, ', tags:', tags.slice (0, i_level+1));
            }
            if (closing_tag != tags[i_level]) {
               if (debug[5]) {
                  console.log ('XXX');
               }
               i_level++;
            }
            if (i_level <= 0) {

               // This is closing tag.
               htm_block = htm.substring (0, i);
               while (i < len) {
                  if (htm[i] == '>') {
                     break;
                  }
                  htm_block += htm[i];
               }
               htm_block += '>';
               break;
            }
         } else {

            // Record opening tag at this level.
            var tag_i_level = '';
            while (i < len) {
               if (htm[i] == '>' || /\s/.test (htm[i])) {
                  break
               }
               tag_i_level += htm[i];
               i++;
            }
            tags[i_level] = tag_i_level;
            if (debug[5]) {
               console.log ('[find_matching_block] (new_level) tag_i_level:', tag_i_level, ', (followed by): ', htm.substr (i+1, 30));
               console.log ('[find_matching_block] tags:', tags.slice (0, i_level+1));
            }
            i_level++;
         }
      } else if (htm[i] == '/') {

         // Takes cares of <br /> and <hr /> (just in case at this point).
         i++;
         if (htm[i] == '>') {
            i_level--;
         }
      }
      i++;
   }
   if (debug[5]) {
      console.log ('[find_matching_block] htm_block:', htm_block);
   }

   return htm_block;
}


// -----------------------------------------------------------------------------
this.select_placeholder = function ($edit_field) {
   if (debug[0]) {
      console.log ('[select_placeholder] $edit_field:', $edit_field);
   }
   var $placeholder = $edit_field.find ('span.qwizard_placeholder');
   if ($placeholder.length == 0) {
      if (debug[0]) {
         console.log ('[select_placeholder] $placeholder.length: 0');
      }
      return;
   }

   // Closure so can wait a bit for TinyMCE setup, etc., to finish.
   var delay_select = function () {
      var placeholder_el = $placeholder[0];
      var id = $edit_field.attr ('id');
      var ed = tinyMCE.get (id);
      if (debug[0]) {
         console.log ('[select_placeholder] ed:', ed);
      }
      if (ed.selection) {
         ed.selection.select (ed.dom.select('span')[0]);
      }

      // Re-establish event for decks (edit field "re-used" for each new card).
      if (id.substr (0, 5) == 'qcard') {
         $edit_field.off ('keydown').off ('click');
         var replace_w_space_b = $edit_field[0].tagName.toLowerCase () == 'span';
         $edit_field.on ('click keydown', function (e) {
                             qwizard.remove_placeholder (e, $edit_field, replace_w_space_b);
                          });
      }

      // Wait a bit for selection process to finish before re-enabling
      // bubblebar.
      setTimeout ('document_qwiz_bubblebar_enabled_b = true', 200);
   }

   // Don't let selection process pop up bubblebar.
   document_qwiz_bubblebar_enabled_b = false;

   // Wait for card setup to finish.
   setTimeout (delay_select, 500);
}


// -----------------------------------------------------------------------------
function select_text (text_el) {
   if (document.body.createTextRange) {
      var range = document.body.createTextRange ();
      range.moveToElementText (text_el);
      range.select ();
   } else if (window.getSelection) {
      var selection = window.getSelection ();
      var range = document.createRange ();
      range.selectNodeContents (text_el);
      selection.removeAllRanges ();
      selection.addRange (range);
   }
}


// -----------------------------------------------------------------------------
function decodeHtmlEntities (str) {
   return str.replace (/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode (dec);
   });
}


// -----------------------------------------------------------------------------
this.encodeHtmlEntities = function (str) {
   var buf = [];
   for (var i=str.length-1; i>=0; i--) {
      buf.unshift (['&#', str[i].charCodeAt (), ';'].join (''));
   }

   return buf.join ('');
}


// -----------------------------------------------------------------------------
this.addSlashes = function (str) {
   return (str + '').replace(/[\\"']/g, '\\$&').replace (/\n/g, '\\n').replace(/\u0000/g, '\\0');
}


// -----------------------------------------------------------------------------
this.decode_image_tags = function (htm) {
   htm = htm.replace (/<input[^>]+?name="qwiz_img"/g, '<img');

   return htm;
}


// -----------------------------------------------------------------------------
// Note: doesn't keep content (which is OK for images).
$.fn.changeElements = function (newType) {
   var newElements = [];

   $ (this).each (function () {
      var attrs = {};

      $.each (this.attributes, function (idx, attr) {
         attrs[attr.nodeName] = attr.nodeValue;
      });

      var newElement = $ ("<" + newType + "/>", attrs);
      $ (this).replaceWith (newElement);
   });

   return $ (newElements);
}


// -----------------------------------------------------------------------------
this.metaphone = function (word, max_phonemes) {
  //  discuss at: http://phpjs.org/functions/metaphone/
  // original by: Greg Frazier
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Rafal Kukawski (http://kukawski.pl)
  //   example 1: metaphone('Gnu');
  //   returns 1: 'N'
  //   example 2: metaphone('bigger');
  //   returns 2: 'BKR'
  //   example 3: metaphone('accuracy');
  //   returns 3: 'AKKRS'
  //   example 4: metaphone('batch batcher');
  //   returns 4: 'BXBXR'

  var type = typeof word;

  if (type === 'undefined' || type === 'object' && word !== null) {
    return null; // weird!
  }

  // infinity and NaN values are treated as strings
  if (type === 'number') {
    if (isNaN(word)) {
      word = 'NAN';
    } else if (!isFinite(word)) {
      word = 'INF';
    }
  }

  if (max_phonemes < 0) {
    return false;
  }

  max_phonemes = Math.floor(+max_phonemes) || 0;

  // alpha depends on locale, so this var might need an update
  // or should be turned into a regex
  // for now assuming pure a-z
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    vowel = 'AEIOU',
    soft = 'EIY',
    leadingNonAlpha = new RegExp('^[^' + alpha + ']+');

  word = typeof word === 'string' ? word : '';
  word = word.toUpperCase()
    .replace(leadingNonAlpha, '');

  if (!word) {
    return '';
  }

  var is = function(p, c) {
    return c !== '' && p.indexOf(c) !== -1;
  };

  var i = 0,
    cc = word.charAt(0), // current char. Short name, because it's used all over the function
    nc = word.charAt(1), // next char
    nnc, // after next char
    pc, // previous char
    l = word.length,
    meta = '',
    // traditional is an internal param that could be exposed
    // for now let it be a local var
    traditional = true;

  switch (cc) {
    case 'A':
      meta += nc === 'E' ? nc : cc;
      i += 1;
      break;
    case 'G':
    case 'K':
    case 'P':
      if (nc === 'N') {
        meta += nc;
        i += 2;
      }
      break;
    case 'W':
      if (nc === 'R') {
        meta += nc;
        i += 2;
      } else if (nc === 'H' || is(vowel, nc)) {
        meta += 'W';
        i += 2;
      }
      break;
    case 'X':
      meta += 'S';
      i += 1;
      break;
    case 'E':
    case 'I':
    case 'O':
    case 'U':
      meta += cc;
      i++;
      break;
  }

  for (; i < l && (max_phonemes === 0 || meta.length < max_phonemes); i += 1) {
    cc = word.charAt(i);
    nc = word.charAt(i + 1);
    pc = word.charAt(i - 1);
    nnc = word.charAt(i + 2);

    if (cc === pc && cc !== 'C') {
      continue;
    }

    switch (cc) {
      case 'B':
        if (pc !== 'M') {
          meta += cc;
        }
        break;
      case 'C':
        if (is(soft, nc)) {
          if (nc === 'I' && nnc === 'A') {
            meta += 'X';
          } else if (pc !== 'S') {
            meta += 'S';
          }
        } else if (nc === 'H') {
          meta += !traditional && (nnc === 'R' || pc === 'S') ? 'K' : 'X';
          i += 1;
        } else {
          meta += 'K';
        }
        break;
      case 'D':
        if (nc === 'G' && is(soft, nnc)) {
          meta += 'J';
          i += 1;
        } else {
          meta += 'T';
        }
        break;
      case 'G':
        if (nc === 'H') {
          if (!(is('BDH', word.charAt(i - 3)) || word.charAt(i - 4) === 'H')) {
            meta += 'F';
            i += 1;
          }
        } else if (nc === 'N') {
          if (is(alpha, nnc) && word.substr(i + 1, 3) !== 'NED') {
            meta += 'K';
          }
        } else if (is(soft, nc) && pc !== 'G') {
          meta += 'J';
        } else {
          meta += 'K';
        }
        break;
      case 'H':
        if (is(vowel, nc) && !is('CGPST', pc)) {
          meta += cc;
        }
        break;
      case 'K':
        if (pc !== 'C') {
          meta += 'K';
        }
        break;
      case 'P':
        meta += nc === 'H' ? 'F' : cc;
        break;
      case 'Q':
        meta += 'K';
        break;
      case 'S':
        if (nc === 'I' && is('AO', nnc)) {
          meta += 'X';
        } else if (nc === 'H') {
          meta += 'X';
          i += 1;
        } else if (!traditional && word.substr(i + 1, 3) === 'CHW') {
          meta += 'X';
          i += 2;
        } else {
          meta += 'S';
        }
        break;
      case 'T':
        if (nc === 'I' && is('AO', nnc)) {
          meta += 'X';
        } else if (nc === 'H') {
          meta += '0';
          i += 1;
        } else if (word.substr(i + 1, 2) !== 'CH') {
          meta += 'T';
        }
        break;
      case 'V':
        meta += 'F';
        break;
      case 'W':
      case 'Y':
        if (is(vowel, nc)) {
          meta += cc;
        }
        break;
      case 'X':
        meta += 'KS';
        break;
      case 'Z':
        meta += 'S';
        break;
      case 'F':
      case 'J':
      case 'L':
      case 'M':
      case 'N':
      case 'R':
        meta += cc;
        break;
    }
  }

  return meta;

  /*
  "    abc", "ABK", // skip leading whitespace
  "1234.678!@abc", "ABK", // skip leading non-alpha chars
  "aero", "ER", // leading 'a' followed by 'e' turns into 'e'
  "air", "AR", // leading 'a' turns into 'e', other vowels ignored
  // leading vowels added to result
  "egg", "EK",
  "if", "IF",
  "of", "OF",
  "use", "US",
  // other vowels ignored
  "xAEIOU", "S",
  // GN, KN, PN become 'N'
  "gnome", "NM",
  "knight", "NFT",
  "pneumatic", "NMTK",
  // leading 'WR' becomes 'R'
  "wrong", "RNK",
  // leading 'WH+vowel" becomes 'W'
  "wheel", "WL",
  // leading 'X' becomes 'S', 'KS' otherwise
  "xerox", "SRKS",
  "exchange", "EKSXNJ",
  // duplicate chars, except 'C' are ignored
  "accuracy", "AKKRS",
  "blogger", "BLKR",
  "fffound", "FNT",
  // ignore 'B' if after 'M'
  "billboard", "BLBRT",
  "symbol", "SML",
  // 'CIA' -> 'X'
  "special", "SPXL",
  // 'SC[IEY]' -> 'C' ignored
  "science", "SNS",
  // '[^S]C' -> 'C' becomes 'S'
  "dance", "TNS",
  // 'CH' -> 'X'
  "change", "XNJ",
  "school", "SXL",
  // 'C' -> 'K'
  "micro", "MKR",
  // 'DGE', 'DGI', DGY' -> 'J'
  // 'T' otherwise
  "bridge", "BRJ",
  "pidgin", "PJN",
  "edgy", "EJ",
  "handgun", "HNTKN",
  "draw", "TR",
  //'GN\b' 'GNED' -> ignore 'G'
  "sign", "SN",
  "signed", "SNT",
  "signs", "SKNS",
  // [^G]G[EIY] -> 'J'...
  "agency", "AJNS",
  // 'GH' -> 'F' if not b--gh, d--gh, h--gh
  "night", "NFT",
  "bright", "BRT",
  "height", "HT",
  "midnight", "MTNT",
  // 'K' otherwise
  "jogger", "JKR",
  // '[^CGPST]H[AEIOU]' -> 'H', ignore otherwise
  "horse", "HRS",
  "adhere", "ATHR",
  "mahjong", "MJNK",
  "fight", "FFT", // interesting
  "ghost", "FST",
  // 'K' -> 'K' if not after 'C'
  "ski", "SK",
  "brick", "BRK",
  // 'PH' -> 'F'
  "phrase", "FRS",
  // 'P.' -> 'P'
  "hypnotic", "PNTK",
  "topnotch", "TPNX",
  // 'Q' -> 'K'
  "quit", "KT",
  "squid", "SKT",
  // 'SIO', 'SIA', 'SH' -> 'X'
  "version", "FRXN",
  "silesia", "SLX",
  "enthusiasm", "EN0XSM",
  "shell", "XL",
  // 'S' -> 'S' in other cases
  "spy", "SP",
  "system", "SSTM",
  // 'TIO', 'TIA' -> 'X'
  "ratio", "RX",
  "nation", "NXN",
  "spatial", "SPXL",
  // 'TH' -> '0'
  "the", "0",
  "nth", "N0",
  "truth", "TR0",
  // 'TCH' -> ignore 'T'
  "watch", "WX",
  // 'T' otherwise
  "vote", "FT",
  "tweet", "TWT",
  // 'V' -> 'F'
  "evolve", "EFLF",
  // 'W' -> 'W' if followed by vowel
  "rewrite", "RRT",
  "outwrite", "OTRT",
  "artwork", "ARTWRK",
  // 'X' -> 'KS' if not first char
  "excel", "EKSSL",
  // 'Y' -> 'Y' if followed by vowel
  "cyan", "SYN",
  "way", "W",
  "hybrid", "BRT",
  // 'Z' -> 'S'
  "zip", "SP",
  "zoom", "SM",
  "jazz", "JS",
  "zigzag", "SKSK",
  "abc abc", "ABKBK" // eventhough there are two words, second 'a' is ignored
  */
}


// =============================================================================
// Close - isolate namespace.
};


// -----------------------------------------------------------------------------
qwiz_qcards_common_f.call (qwiz_qcards_common);


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


