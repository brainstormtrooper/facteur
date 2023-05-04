/**
UI for displaying html message interface
*/
const { Gtk, Gio, GtkSource, WebKit, GObject } = imports.gi;
const Gettext = imports.gettext;
const myTemplate = imports.object.Template;
const Template = new myTemplate.Template();
const Data = imports.object.Data;
const appData = new Data.Data();
const myFile = imports.lib.file;


// const contentsfile = Gio.File.new_for_path('data/contentMain.ui');
// const [, contentTemplate] = contentsfile.load_contents(null);

var contentMain = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'contentMain',
  Template: 'resource:///com/github/brainstormtrooper/facteur/contentMain.ui',
  // Children: [],
  InternalChildren: ['textView', 'htmlSourceView', 'htmlPreview', 'saveButton', 'cImportButton']
},
class contentMain extends Gtk.Box {
  _init () {
    super._init();
    // Gtksource.init();
    
  }
});


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
        GObject.type_ensure(GtkSource.View);
        GObject.type_ensure(WebKit.WebView);
        

      }

      _updateUI () {
        let len = encodeURI(appData.get('HTML')).split(/%..|./).length - 1;
        this.htmlBuffer.set_text(appData.get('HTML'), len);
        len = encodeURI(appData.get('TEXT')).split(/%..|./).length - 1;
        this.textBuffer.set_text(appData.get('TEXT'), len);
      }

      _buildUI () {
        
        this.contentMain = new contentMain();

        this.textView = this.contentMain._textView;
        this.htmlSourceView = this.contentMain._htmlSourceView;
        this.htmlPreview = this.contentMain._htmlPreview;
        this.saveButton = this.contentMain._saveButton;
        this.cImportButton = this.contentMain._cImportButton;

        this.textBuffer = new Gtk.TextBuffer();
        const langManager = new GtkSource.LanguageManager();
        this.htmlBuffer = new GtkSource.Buffer(
          { language: langManager.get_language('html') },
        );

        this.textView.set_buffer(this.textBuffer);
        this.htmlSourceView.set_buffer(this.htmlBuffer);

        this.htmlBuffer.connect('changed', () => {
          this.htmlPreview.load_html(this.htmlBuffer.text, null);
        });

        const defhtmlstr = '<h1>Hi!</h1><p>this is text</p>';
        const len = encodeURI(defhtmlstr).split(/%..|./).length - 1;
        this.htmlBuffer.set_text(defhtmlstr, len);
        this.htmlPreview.load_html(this.htmlBuffer.text, null);

        this.cImportButton.connect('clicked', () => {
          const props = {
            title: 'Select A Template'
          }
          try {
            myFile.fileOpen(props, (res) => {
              const td = new TextDecoder();
              const [, contents] = res.load_contents(null);
              const myTemplate = td.decode(contents);
              const len = encodeURI(myTemplate).split(/%..|./).length - 1;
              this.htmlBuffer.set_text(myTemplate, len);
            });
          } catch (error) {
            
          }
        });

        this.saveButton.connect('clicked', () => {
          appData.set('HTML', this.htmlBuffer.text);
          appData.set('TEXT', this.textBuffer.text);
        });

        
        return this.contentMain;
      }
    },
);
