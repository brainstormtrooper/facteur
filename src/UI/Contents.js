/**
UI for displaying html message interface
*/
const { Gtk, Gio, GtkSource, WebKit: Webkit, GObject } = imports.gi;
const Gettext = imports.gettext;
const myTemplate = imports.object.Template;
const Template = new myTemplate.Template();
const Data = imports.object.Data;
const appData = new Data.Data();

var UIcontents = GObject.registerClass( // eslint-disable-line
    {
      GTypeName: 'UIcontents',
      Signals: {
        'Logger': {
          param_types: [GObject.TYPE_STRING],
        },
      },
    },
    class UIcontents extends GObject.Object {
      _init () {
        super._init();
      }

      _updateUI () {
        let len = encodeURI(appData.get('HTML')).split(/%..|./).length - 1;
        this.htmlBuffer.set_text(appData.get('HTML'), len);
        len = encodeURI(appData.get('TEXT')).split(/%..|./).length - 1;
        this.textBuffer.set_text(appData.get('TEXT'), len);
      }

      _buildUI () {
        const vBox = new Gtk.Box(
            { orientation: Gtk.Orientation.VERTICAL, spacing: 6 },
        );
        const hBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
        const scrollText = new Gtk.ScrolledWindow({ vexpand: true });
        const scrollHtml = new Gtk.ScrolledWindow({ vexpand: true });
        const scrollPrev = new Gtk.ScrolledWindow({ vexpand: true });
        const buttonBox = new Gtk.Box(
            { orientation: Gtk.Orientation.HORIZONTAL },
        );
        const button = new Gtk.Button({ label: Gettext.gettext('Save') });
        const notebook = new Gtk.Notebook();
        const pageText = new Gtk.Box(
            { orientation: Gtk.Orientation.VERTICAL, spacing: 6 },
        );
        const pageHtml = new Gtk.Box(
            { orientation: Gtk.Orientation.VERTICAL, spacing: 6 },
        );
        this.textBuffer = new Gtk.TextBuffer();
        const messageText = new Gtk.TextView(
            { buffer: this.textBuffer, editable: true },
        );
        const htmlNotebook = new Gtk.Notebook();
        const pageCode = new Gtk.Box(
            { orientation: Gtk.Orientation.VERTICAL, spacing: 6 },
        );
        const pagePreview = new Gtk.Box(
            { orientation: Gtk.Orientation.VERTICAL, spacing: 6 },
        );
        const langManager = new GtkSource.LanguageManager();
        this.htmlBuffer = new GtkSource.Buffer(
            { language: langManager.get_language('html') },
        );
        const messagehtml = new GtkSource.View({ buffer: this.htmlBuffer });
        const webView = new Webkit.WebView({ vexpand: true });


        const fileChooser = new Gtk.FileDialog();
        this.choosebutton = new Gtk.Button({
          label: Gettext.gettext('Open a file'),
        });

        this.choosebutton.connect('clicked', async () => {
          fileChooser.open(this.App._window, null , async (res) => {
            const content = await fileChooser.open_finish(res);
            const len = encodeURI(content).split(/%..|./).length - 1;
            this.htmlBuffer.set_text(content, len);
          });
        });


        this.htmlBuffer.connect('changed', () => {
          webView.load_html(this.htmlBuffer.text, null);
        });

        const defhtmlstr = '<h1>Hi!</h1><p>this is text</p>';
        const len = encodeURI(defhtmlstr).split(/%..|./).length - 1;
        this.htmlBuffer.set_text(defhtmlstr, len);
        webView.load_html(this.htmlBuffer.text, null);
        htmlNotebook.append_page(pagePreview, new Gtk.Label(
            { label: Gettext.gettext('Preview') },
        ));
        htmlNotebook.append_page(pageCode, new Gtk.Label(
            { label: Gettext.gettext('Code') },
        ));
        scrollText.set_child(messageText);
        scrollHtml.set_child(messagehtml);
        scrollPrev.set_child(webView);
        pageCode.prepend(scrollHtml);
        pagePreview.prepend(scrollPrev);
        pageHtml.prepend(htmlNotebook);
        pageText.prepend(scrollText);
        hBox.prepend(this.choosebutton);
        vBox.prepend(hBox);
        notebook.append_page(pageText, new Gtk.Label(
            { label: Gettext.gettext('Plain text') },
        ));
        notebook.append_page(pageHtml, new Gtk.Label(
            { label: Gettext.gettext('HTML Content') },
        ));
        vBox.prepend(notebook);
        buttonBox.append(button);
        vBox.prepend(buttonBox);

        button.connect('clicked', () => {
          appData.set('HTML', this.htmlBuffer.text);
          appData.set('TEXT', this.textBuffer.text);
        });

        return vBox;
      }
    },
);
