
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

var UImodal = new Lang.Class({
    Name: 'UImodal',

    showOpenModal: function(message) {

        let label, modal, contentArea, button, actionArea;
      
        label = new Gtk.Label({
            label: message,
            vexpand: true
        });
      
        modal = new Gtk.Dialog({ 
            default_height: 150,
            default_width: 200,
            modal: true,
            transient_for: app._window,
            title: 'Error',
            use_header_bar: false
        });
      
        modal.connect('response', function() {
            modal.destroy();
        });
      
        contentArea = modal.get_content_area();
        contentArea.add(label);
      
        button = Gtk.Button.new_with_label ('OK');
        button.connect ("clicked", () => {
            modal.destroy();
        });
      
        actionArea = modal.get_action_area();
        actionArea.add(button);
      
        modal.show_all();
      }
})