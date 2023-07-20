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

var widgetAttachment = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'widgetAttachment',
  Template: 'resource:///io/github/brainstormtrooper/facteur/widgetAttachment.ui',
  // Children: ['attachment', 'contentMain'],
  InternalChildren: ['filename', 'deleteButton', 'fileId', 'inlineButton']
},
class widgetAttachment extends Gtk.Box {
  _init () {
    super._init();
    // Gtksource.init();
    
  }
});

var contentMain = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'contentMain',
  Template: 'resource:///io/github/brainstormtrooper/facteur/contentMain.ui',
  // Children: ['attachment', 'contentMain'],
  InternalChildren: ['textView', 'htmlSourceView', 'htmlPreview', 'saveButton', 'cImportButton', 'addAttachmentButton', 'attachmentsListBox']
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
        'update_attachments': {
          param_types: [GObject.TYPE_BOOLEAN],
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

      updateAttachments () {
        let widget = this.attachmentsListBox.get_first_child();
        while (widget && widget == this.attachmentsListBox.get_first_child()) {
          this.attachmentsListBox.remove(widget);
          widget = this.attachmentsListBox.get_first_child();
        }

        const currAttachments = appData.get('ATTACHMENTS');
        currAttachments.forEach(attachment => {
          const aw = new widgetAttachment();
          aw._filename.set_text(attachment.fileName);
          aw._inlineButton.set_active(attachment.inline);
          aw._fileId.set_text(attachment.id);
          aw._deleteButton.connect('clicked', () => {
            appData.deleteAttachment(attachment.fileName);
            this.App.emit('update_attachments', true);
          });
          aw._inlineButton.connect('toggled', () => {
            appData.setInlineAttachment(attachment.fileName, aw._inlineButton.get_active());
            this.App.emit('update_attachments', true);
          });
          this.attachmentsListBox.append(aw);
        });
      }

      previewAttachments (html) {
        let myStr = html
        appData._data.ATTACHMENTS.forEach(ao => {
          if (ao.inline) {
            const slug = `cid:${ao.id}`;
            const [type, uncertain] = Gio.content_type_guess(ao.fileName, null)
            const inline = `data:${type};base64,${ao.contents}`;
            myStr = myStr.replace(slug, inline);
          }
        });

        return myStr;
      }

      _buildUI () {
        this.App = Gio.Application.get_default();
        this.contentMain = new contentMain();

        this.textView = this.contentMain._textView;
        this.htmlSourceView = this.contentMain._htmlSourceView;
        this.htmlPreview = this.contentMain._htmlPreview;
        this.saveButton = this.contentMain._saveButton;
        this.cImportButton = this.contentMain._cImportButton;
        this.newAttachmentButton = this.contentMain._addAttachmentButton;
        this.attachmentsListBox = this.contentMain._attachmentsListBox

        this.textBuffer = new Gtk.TextBuffer();
        const langManager = new GtkSource.LanguageManager();
        this.htmlBuffer = new GtkSource.Buffer(
          { language: langManager.get_language('html') },
        );

        this.textView.set_buffer(this.textBuffer);
        this.htmlSourceView.set_buffer(this.htmlBuffer);

        this.htmlBuffer.connect('changed', () => {
          this.htmlPreview.load_html(this.previewAttachments(this.htmlBuffer.text), null);
        });

        const defhtmlstr = '<h1>Hi!</h1><p>this is text</p>';
        const len = encodeURI(defhtmlstr).split(/%..|./).length - 1;
        this.htmlBuffer.set_text(defhtmlstr, len);
        this.htmlPreview.load_html(this.htmlBuffer.text, null);

        this.newAttachmentButton.connect('clicked', () => {
          const props = {
            title: 'Select An Attachment'
          }
          try {
            myFile.fileOpen(props, (res) => {
              Template.addAttachment(res);
              this.App.emit('update_attachments', true);
            });
          } catch (error) {
            
          }
        });

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
