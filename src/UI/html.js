/**
UI for displaying html message interface
*/
const Lang = imports.lang;
const Gtk = imports.gi.Gtk;
const GtkSource = imports.gi.GtkSource;
const Webkit = imports.gi.WebKit2;
const Gettext = imports.gettext;
const myContent = imports.object.Content;
const Content = new myContent.Content();

var UIhtml = new Lang.Class({
  Name: 'UIhtml',

  _updateUI: function () {
    app.ui.results._LOG("updating html content...");
    let len = encodeURI(app.Data.HTML).split(/%..|./).length - 1;
    this.htmlBuffer.set_text(app.Data.HTML, len);
    len = encodeURI(app.Data.TEXT).split(/%..|./).length - 1;
    this.textBuffer.set_text(app.Data.TEXT, len);
  },

  _buildUI: function () {
    const vBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });
    const hBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
    const scrollText = new Gtk.ScrolledWindow({ vexpand: true });
    const scrollHtml = new Gtk.ScrolledWindow({ vexpand: true });
    const scrollPrev = new Gtk.ScrolledWindow({ vexpand: true });
    const buttonBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
    const button = new Gtk.Button({ label: Gettext.gettext('Save') });
    const notebook = new Gtk.Notebook();
    const pageText = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });
    const pageHtml = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });
    this.textBuffer = new Gtk.TextBuffer();
    const messageText = new Gtk.TextView({ buffer: this.textBuffer, editable: true });
    const htmlNotebook = new Gtk.Notebook();
    const pageCode = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });
    const pagePreview = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });
    const langManager = new GtkSource.LanguageManager();
    this.htmlBuffer = new GtkSource.Buffer({ language: langManager.get_language('html') });
    const messagehtml = new GtkSource.View({ buffer: this.htmlBuffer });
    const webView = new Webkit.WebView({ vexpand: true });
    const choosebutton = new Gtk.FileChooserButton({ title: Gettext.gettext('Select a template') });
    const chooselabel = new Gtk.Label({ halign: Gtk.Align.START, label: Gettext.gettext('Open a file') });


    choosebutton.set_action(Gtk.FileChooserAction.OPEN);

    choosebutton.connect('file-set', async () => {
      const path = choosebutton.get_file().get_path();
      // do something with path
      app.ui.results._LOG(`Importing template from : ${path}`);
      const content = await Content.Import(path);
      const len = encodeURI(content).split(/%..|./).length - 1;
      this.htmlBuffer.set_text(content, len);

    });


    this.htmlBuffer.connect('changed', () => {
      webView.load_html(this.htmlBuffer.text, null);
    });

    webView.load_html('<h1>Hi!</h1><p>this is text</p>', null);
    htmlNotebook.append_page(pagePreview, new Gtk.Label({ label: Gettext.gettext('Preview') }));
    htmlNotebook.append_page(pageCode, new Gtk.Label({ label: Gettext.gettext('Code') }));
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
    notebook.append_page(pageText, new Gtk.Label({ label: Gettext.gettext('Plain text') }));
    notebook.append_page(pageHtml, new Gtk.Label({ label: Gettext.gettext('HTML Content') }));
    vBox.pack_start(notebook, true, true, 0);
    buttonBox.pack_end(button, false, false, 0);
    vBox.pack_start(buttonBox, false, false, 0);

    button.connect('clicked', () => {
      app.Data.HTML = this.htmlBuffer.text;
      app.Data.TEXT = this.textBuffer.text;
    });

    return vBox;
  },

});
