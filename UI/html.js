/**
UI for displaying html message interface
*/
// const GtkText = imports.gi.GtkText;
const GtkSource = imports.gi.GtkSource;
const myContent = imports.object.Content; // import awesome.js from current directory
const Content = new myContent.Content();
// this.mailing = new Mailing.UImailing();

const UIhtml = new Lang.Class ({
  Name: 'UIhtml',

  _updateUI: function () {
    print("updating html content...");
    let len = encodeURI(HTML).split(/%..|./).length - 1;
    this.htmlBuffer.set_text(HTML, len);
    len = encodeURI(TEXT).split(/%..|./).length - 1;
    this.textBuffer.set_text(TEXT, len);
  },

  _buildUI: function () {
    const vBox = new Gtk.VBox({spacing: 6});
    const hBox = new Gtk.HBox();
    const scrollText = new Gtk.ScrolledWindow({ vexpand: true });
    const scrollHtml = new Gtk.ScrolledWindow({ vexpand: true });
    const scrollPrev = new Gtk.ScrolledWindow({ vexpand: true });
    const buttonBox = new Gtk.HBox();
  	// const checkbutton = new Gtk.CheckButton({label: "Use HTML"});
  	const button = new Gtk.Button({label: "Save"});
  	const notebook = new Gtk.Notebook();
  	const pageText = new Gtk.VBox({spacing: 6});
  	const pageHtml = new Gtk.VBox({spacing: 6});
  	this.textBuffer = new Gtk.TextBuffer();
  	const messageText = new Gtk.TextView({ buffer: this.textBuffer, editable: true });
  	const htmlNotebook = new Gtk.Notebook();
    const pageCode = new Gtk.VBox({spacing: 6});
  	const pagePreview = new Gtk.VBox({spacing: 6});
  	const langManager = new GtkSource.LanguageManager();
  	this.htmlBuffer = new GtkSource.Buffer({ language: langManager.get_language('html') });
  	const messagehtml = new GtkSource.View({ buffer: this.htmlBuffer });
  	const webView = new Webkit.WebView({ vexpand: true });
    const choosebutton = new Gtk.FileChooserButton({title:'Select a Template'});
    const chooselabel = new Gtk.Label({ halign: Gtk.Align.START, label: 'Open a file...'});


    choosebutton.set_action(Gtk.FileChooserAction.OPEN);

    choosebutton.connect('file-set', async () => {
        const path = choosebutton.get_file().get_path();
        // do something with path

        const content = await Content.Import(path);
        // print('Changed is : ' + content);
        const len = encodeURI(content).split(/%..|./).length - 1;
        this.htmlBuffer.set_text(content, len);
        //print('================= \n imported : \n' + data.csvstr );

    });


    this.htmlBuffer.connect('changed', () => {
      webView.load_html(this.htmlBuffer.text, null);
    });

    webView.load_html('<h1>bob</h1><p>this is text</p>', null);
    htmlNotebook.append_page(pagePreview, new Gtk.Label({label: "Preview"}));
    htmlNotebook.append_page(pageCode, new Gtk.Label({label: "Code"}));
    scrollText.add(messageText);
    scrollHtml.add(messagehtml);
    scrollPrev.add(webView);
    pageCode.pack_start(scrollHtml, true, true, 0);
    pagePreview.pack_start(scrollPrev, true, true, 0);
  	pageHtml.pack_start(htmlNotebook, true, true, 0);
  	pageText.pack_start(scrollText, true, true, 0);
  	hBox.pack_start(chooselabel, false, false, 0);
  	hBox.pack_start(choosebutton, false, false, 0);
    vBox.pack_start(hBox, false, false, 0);
    notebook.append_page(pageText, new Gtk.Label({label: "Plain text"}));
    notebook.append_page(pageHtml, new Gtk.Label({label: "Html content"}));
    vBox.pack_start(notebook, true, true, 0);
    buttonBox.pack_end(button, false, false, 0);
    vBox.pack_start(buttonBox, false, false, 0);

    button.connect('clicked', () => {
      HTML = this.htmlBuffer.text;
      TEXT = this.textBuffer.text;
    });

    return vBox;
  },

});
