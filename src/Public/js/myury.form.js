/**
 * The MyURY Standard Form JavaScript Tools
 * This file initialises jQuery validation, autocompletes and other resources
 * needed for a MyURY Form
 */

window.MyURYForm = {
  gCheckedValue: null,
  setUpMemberFields: function() {
    /**
     * Initialises the Member autocomplete pickers where necessary
     */
    $('fieldset.myuryfrm input.member-autocomplete').each(function() {
      $(this).autocomplete({
        minLength: 3,
        source: myury.makeURL('MyURY', 'a-findmember'),
        select: function(event, ui) {
          $(this).val(ui.item.fname + ' ' + ui.item.sname);
          $('#' + $(this).attr('id').replace(/-ui$/, '')).val(ui.item.memberid);
          return false;
        },
        //Prevent the field blanking out when an item is given focus
        focus: function(event, ui) {
          return false;
        }
      })
              .data("ui-autocomplete")._renderItem = function(ul, item) {
        return $('<li></li>').data('item.autocomplete', item)
                .append('<a>' + item.fname + ' ' + item.sname + '</a>')
                .appendTo(ul);
      };

      //If there's an existing value, load it in
      val = $('#' + $(this).attr('id').replace(/-ui$/, '')).val();
      console.log(val);
      if (typeof val != 'undefined' && val != '') {
        $.ajax({
          url: myury.makeURL('MyURY', 'a-membernamefromid'),
          data: {term: $('#' + $(this).attr('id').replace(/-ui$/, '')).val()},
          context: this,
          success: function(data) {
            console.log($(this));
            $(this).val(data);
          }
        });
      }
    });
  },
  setUpTrackFields: function() {
    /**
     * Initialises the Track autocomplete pickers where necessary
     */
    $('fieldset.myuryfrm input.track-autocomplete').each(function() {
      $(this).autocomplete({
        minLength: 3,
        source: myury.makeURL('MyURY', 'a-findtrack'),
        select: function(event, ui) {
          $(this).val(ui.item.title);
          $('#' + $(this).attr('id').replace(/-ui$/, '')).val(ui.item.trackid);
          return false;
        },
        //Prevent the field blanking out when an item is given focus
        focus: function(event, ui) {
          return false;
        }
      })
              .data("ui-autocomplete")._renderItem = function(ul, item) {
        return $('<li></li>').data('item.autocomplete', item)
                .append('<a>' + item.title + '<br><span style="font-size:.8em">' + item.artist + '</span></a>')
                .appendTo(ul);
      };

      //If there's an existing ID value, load it in
      if ($(this).val() === '' && $('#' + $(this).attr('id').replace(/-ui$/, '')).val() !== '') {
        $.ajax({
          url: myury.makeURL('MyURY', 'a-findtrack'),
          data: {id: $('#' + $(this).attr('id').replace(/-ui$/, '')).val()},
          context: this,
          success: function(data) {
            $(this).val(data.title);
          }
        });
      }
    });
  },
  setUpArtistFields: function() {
    /**
     * Initialises the Artist autocomplete pickers where necessary
     */
    $('fieldset.myuryfrm input.artist-autocomplete').each(function() {
      $(this).autocomplete({
        minLength: 3,
        source: myury.makeURL('MyURY', 'a-findartist'),
        select: function(event, ui) {
          $(this).val(ui.item.title);
          $('#' + $(this).attr('id').replace(/-ui$/, '')).val(ui.item.artistid);
          return false;
        },
        //Prevent the field blanking out when an item is given focus
        focus: function(event, ui) {
          return false;
        }
      })
              .data("ui-autocomplete")._renderItem = function(ul, item) {
        return $('<li></li>').data('item.autocomplete', item)
                .append('<a>' + item.title + '</a>')
                .appendTo(ul);
      };
    });
  },
  setUpAlbumFields: function() {
    /**
     * Initialises the Album autocomplete pickers where necessary
     */
    $('fieldset.myuryfrm input.album-autocomplete').each(function() {
      $(this).autocomplete({
        minLength: 3,
        source: myury.makeURL('MyURY', 'a-findalbum'),
        select: function(event, ui) {
          $(this).val(ui.item.title);
          $('#' + $(this).attr('id').replace(/-ui$/, '')).val(ui.item.recordid);
          return false;
        },
        //Prevent the field blanking out when an item is given focus
        focus: function(event, ui) {
          return false;
        }
      })
              .data("ui-autocomplete")._renderItem = function(ul, item) {
        return $('<li></li>').data('item.autocomplete', item)
                .append('<a>' + item.title + '</a>')
                .appendTo(ul);
      }
      
      //If there's an existing ID value, load it in
      if ($(this).val() === '' && $('#' + $(this).attr('id').replace(/-ui$/, '')).val() !== '') {
        $.ajax({
          url: myury.makeURL('MyURY', 'a-findalbum'),
          data: {id: $('#' + $(this).attr('id').replace(/-ui$/, '')).val()},
          context: this,
          success: function(data) {
            $(this).val(data.title);
          }
        });
      }
    });
  },
  setUpTimePickers: function() {
    /**
     * Initialises the Time pickers where necessary
     * @todo Make stepminute customisable?
     */
    $('fieldset.myuryfrm input.time').timepicker({
      stepMinute: 15
    });
  },
  validate: function() {
    /**
     * Validation
     */
    $('fieldset.myuryfrm form').validate({
      errorClass: 'ui-state-error',
      errorPlacement: function(error, element) {
        error.addClass('label-nofloat').appendTo(element.parent('div'));
      },
      submitHandler: function(form) {
        $(form).children('input[type=submit]').attr('disabled', 'disabled');
        form.submit();
      }
    });
  },
  /**
   * Sets up those pretty week drag-drop select fields. I wrote it, but don't understand it.
   */
  setUpWeekSelectFields: function() {
    $('table.myuryfrmfield-weeklycheck').disableSelection();
    $.each($('table.myuryfrmfield-weeklycheck td'), function() {
      $(this).on('mousedown', function() {
        if (MyURYForm.gCheckedValue === null) {
         /**
          * Start a drag selection. Invert the state of the selected checkbox,
          * and set a variable define what other checkboxes selected should be
          * configured to (checked or unchecked). This variable is also
          * used to mark dragging as active.
          */
         var input = $(this).children('input[type=checkbox]').first();
         input.prop('checked', !input.prop('checked'));
         MyURYForm.gCheckedValue = input.prop('checked');
        }
      }).on('mouseenter', function() {
        //Is there an active dragging event?
        if (MyURYForm.gCheckedValue === null) return; //Nope.
        $(this).children('input[type=checkbox]').prop('checked', MyURYForm.gCheckedValue);
      }).on('click', function(e) {
        //Stop the default click handler running - it unselects boxes.
        e.preventDefault();
      });
    }
    );
    
    //Initialise this to the whole page, otherwise mouseup outside the table makes a mess
    $(document).on('mouseup', function(){
        //End the dragging event
        MyURYForm.gCheckedValue = null;
      })
  },
  setUpTinyMCEFields: function() {
    /**
     * Initialises TinyMCE fields
     */
    if (typeof tinymce !== 'undefined') {
      tinymce.init({
        selector: "textarea.myury-form-tinymce",
        plugins: "anchor autolink charmap code contextmenu fullscreen hr image link lists media tabfocus table wordcount"
      });
      /**
       * Initialises the Date pickers where necessary
       */
      $('fieldset.myuryfrm input.date').datepicker({
        dateFormat: "dd/mm/yy"
      });
    }
  },
  setUpDateTimePickerFields: function() {
    /**
     * Initialises the Datetime pickers where necessary
     * @todo Make stepminute customisable?
     */
    $('fieldset.myuryfrm input.datetime').datetimepicker({
      dateFormat: "yy-mm-dd",
      timeFormat: "hh:mm:ss",
      stepMinute: 15
    });
  },
  setUpCheckboxGroups: function() {
    /**
     * Setup Checkbox Group select all / select none
     */
    $('fieldset a.checkgroup-all').click(function() {
      $(this).parents('fieldset:first').find('input[type=checkbox]').each(function() {
        $(this).attr('checked', 'checked');
      });
    });
    $('fieldset a.checkgroup-none').click(function() {
      $(this).parents('fieldset:first').find('input[type=checkbox]').each(function() {
        $(this).attr('checked', null);
      });
    });
  },
  setUpRepeatingSets: function() {
    //Set up tabular repeating sets
    $('.myury-form-add-row-button').on('click', function() {
      var new_id = $(this).attr('nextvalue');

      $('#' + $(this).attr('id').replace(/add-to-/, '') + ' tbody tr:first').clone()
        .addClass(parseInt(new_id) % 2 == 0 ? 'odd' : 'even')
        .find('input').each(function() {
        $(this).val('').attr('id', function(_, id) {
          return id.replace(/0/, new_id)
        });
      }).end().appendTo('#' + $(this).attr('id').replace(/add-to-/, '') + ' tbody');
      
      MyURYForm.setUpArtistFields();
      MyURYForm.setUpMemberFields();
      MyURYForm.setUpTrackFields();
      MyURYForm.setUpTimePickers();
      
      $(this).attr('nextvalue', parseInt(new_id)+1);
    });
    $('button.myuryfrm-remove-row').button({icons: {primary: "ui-icon-trash"}, text: false}).on('click', function() {
      $(this).closest('tr').remove();
      return false;
    });
    //And the dataTable that contains them
    $('table.myuryfrm-repeaterset-container').dataTable({
      bSort: true,
      bJQueryUI: true,
      bPaginate: false,
      bFilter: false
    }
    );
  },
  setUpFileProgress: function() {
    /**
     * Sets up the progress bar for file upload progress
     */
    if ($('#APC_UPLOAD_PROGRESS').length !== 0) {
      $('form').on('submit', function() {
        $('.myuryfrm-file-upload-progress').progressbar({value:false});
        //Poke the server for upload progress status
        setInterval(MyURYForm.pollFileProgress, 2500);
      });
    }
  },
  pollFileProgress: function() {
    $.ajax({
      url: myury.makeURL('MyURY', 'a-getuploadprogress', {
        id: $('#APC_UPLOAD_PROGRESS').val()
      }),
      success: function(data) {
        console.log(data);
      }
    });
  },
  init: function() {
    MyURYForm.setUpRepeatingSets();
    MyURYForm.setUpTinyMCEFields();
    MyURYForm.setUpDateTimePickerFields();
    MyURYForm.setUpTimePickers();
    MyURYForm.setUpMemberFields();
    MyURYForm.setUpTrackFields();
    MyURYForm.setUpArtistFields();
    MyURYForm.setUpAlbumFields();
    MyURYForm.setUpWeekSelectFields();
    MyURYForm.setUpCheckboxGroups();
    MyURYForm.setUpFileProgress();
    MyURYForm.validate();
  }
};

$(document).ready(function() {
  MyURYForm.init();
});