/**
UI for displaying html message interface
*/

const GtkSource = imports.gi.GtkSource;
  // const myData = imports.object.Data; // import awesome.js from current directory
	//this.mailing = new Mailing.UImailing();

const UIhtml = new Lang.Class ({
    Name: 'UIhtml',
    	// Build the application's UI

    _buildUI: function () {
      const vBox = new Gtk.VBox({spacing: 6});
      const hBox = new Gtk.HBox();
      const buttonBox = new Gtk.HBox();
    	// const checkbutton = new Gtk.CheckButton({label: "Use HTML"});
    	const button = new Gtk.Button({label: "Save"});
    	const notebook = new Gtk.Notebook();
    	const pageText = new Gtk.VBox({spacing: 6});
    	const pageHtml = new Gtk.VBox({spacing: 6});
    	const messageText = new GtkSource.View();
    	const htmlNotebook = new Gtk.Notebook();
      const pageCode = new Gtk.VBox({spacing: 6});
    	const pagePreview = new Gtk.VBox({spacing: 6});
    	const htmlBuffer = new GtkSource.Buffer();
    	const messagehtml = new GtkSource.View({ buffer: htmlBuffer });
    	const webView = new Webkit.WebView({ vexpand: true });
      const choosebutton = new Gtk.FileChooserButton({title:'Select a Template'});
      const chooselabel = new Gtk.Label({ halign: Gtk.Align.START, label: 'Open a file...'});


      choosebutton.set_action(Gtk.FileChooserAction.OPEN);

      choosebutton.connect('file-set', Lang.bind(this, function() {
          const path = this.choosebutton.get_file().get_path();
          // do something with path

          // this.data.Import(path);
          print('Changed is : ' + path);
          //print('================= \n imported : \n' + data.csvstr );

      }));


      htmlBuffer.connect('changed', () => {
        webView.load_html(htmlBuffer.text, null);
      });

      webView.load_html('<h1>bob</h1><p>this is text</p>', null);
      htmlNotebook.append_page(pagePreview, new Gtk.Label({label: "Preview"}));
      htmlNotebook.append_page(pageCode, new Gtk.Label({label: "Code"}));
      pageCode.pack_start(messagehtml, true, true, 0);
      pagePreview.pack_start(webView, true, true, 0);
    	pageHtml.pack_start(htmlNotebook, true, true, 0);
    	pageText.pack_start(messageText, true, true, 0);
    	hBox.pack_start(chooselabel, false, false, 0);
    	hBox.pack_start(choosebutton, false, false, 0);
      vBox.pack_start(hBox, false, false, 0);
      notebook.append_page(pageText, new Gtk.Label({label: "Plain text"}));
      notebook.append_page(pageHtml, new Gtk.Label({label: "Html content"}));
      vBox.pack_start(notebook, true, true, 0);
      buttonBox.pack_end(button, false, false, 0);
      vBox.pack_start(buttonBox, false, false, 0);

      return vBox;
    },

});
