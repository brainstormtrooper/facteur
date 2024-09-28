/**
UI for displaying html message interface
*/
const { GLib, Gtk, Gio, GtkSource, WebKit, GObject } = imports.gi;
const Gettext = imports.gettext;
const myTemplate = imports.lib.template;
const Template = new imports.object.Template.Template();

const myMessage = new imports.object.Message.Message();
const myModal = new imports.UI.Modal.UImodal();
const Data = imports.object.Data;
const appData = new Data.Data();
const myFile = imports.lib.file;


// const contentsfile = Gio.File.new_for_path('data/contentMain.ui');
// const [, contentTemplate] = contentsfile.load_contents(null);


var modalExtract = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'modalExtract',
  Template: 'resource:///io/github/brainstormtrooper/facteur/modalExtract.ui',
  // Children: ['attachment', 'contentMain'],
  InternalChildren: ['extractCheckAllBtn', 'extractScroll']
},
class modalExtract extends Gtk.Box {
  _init () {
    super._init();
    // Gtksource.init();
  }


});

var widgetExtract = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'widgetExtract',
  Template: 'resource:///io/github/brainstormtrooper/facteur/widgetExtract.ui',
  // Children: ['attachment', 'contentMain'],
  InternalChildren: ['filenameLabel', 'filestatusLabel']
},
class widgetExtract extends Gtk.Box {
  _init () {
    super._init();
    // Gtksource.init();
    
  }
});

var widgetAttachment = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'widgetAttachment',
  Template: 'resource:///io/github/brainstormtrooper/facteur/widgetAttachment.ui',
  // Children: ['attachment', 'contentMain'],
  InternalChildren: ['filename', 'deleteButton', 'fileId', 'inlineButton', 'row2']
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
  InternalChildren: ['textView', 'htmlSourceView', 'htmlPreview', 'saveButton', 'addLinkEntry',
  'cImportButton', 'addAttachmentButton', 'extractButton', 'addLinkButton', 'attachmentsListBox']
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
        this.assetpath = '~/';
      }

      _updateUI () {
        this.App = Gio.Application.get_default();
        let len = encodeURI(appData.get('HTML')).split(/%..|./).length - 1;
        this.htmlBuffer.set_text(appData.get('HTML'), len);
        len = encodeURI(appData.get('TEXT')).split(/%..|./).length - 1;
        this.textBuffer.set_text(appData.get('TEXT'), len);
        this.saveButton.remove_css_class('suggested-action');
      }

      updateAttachments () {
        let widget = this.attachmentsListBox.get_first_child();
        while (widget && widget == this.attachmentsListBox.get_first_child()) {
          this.attachmentsListBox.remove(widget);
          widget = this.attachmentsListBox.get_first_child();
        }
        const media = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'webm'];
        const currAttachments = appData.get('ATTACHMENTS');
        const currLinks = appData.get('LINKS');
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
          const ext = attachment.fileName.split('.').pop();
          if (!media.includes(ext)) {
            
            aw.remove(aw._row2);
          }
          
          aw.add_css_class('card');
          this.attachmentsListBox.append(aw);
        });
        currLinks.forEach(link => {
          const linkRow = new Gtk.Box({orientation: 'horizontal', spacing: 6});
          const linkText = new Gtk.Entry({text: link, editable: false});
          const linkDel = new Gtk.Button({ icon_name: 'edit-delete-symbolic'});
          linkDel.connect('clicked', () => {
            appData.deleteLink(link);
            this.App.emit('update_attachments', true);
          });
          linkRow.append(linkText);
          linkRow.append(linkDel);
          linkRow.add_css_class('card');
          this.attachmentsListBox.append(linkRow);
        });
      }

      previewAttachments (html) {
        let myStr = html
        appData._data.ATTACHMENTS.forEach(ao => {
          if (ao.inline) {
            const slug = `cid:${ao.id}`;
            const [type, uncertain] = Gio.content_type_guess(ao.fileName, null);
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
        this.extractButton = this.contentMain._extractButton;
        this.newAttachmentButton = this.contentMain._addAttachmentButton;
        this.newLinkButton = this.contentMain._addLinkButton;
        this.addLinkEntry = this.contentMain._addLinkEntry;
        this.attachmentsListBox = this.contentMain._attachmentsListBox

        var linkRow = GObject.registerClass(
          {
            GTypeName: 'linkRow',
          },
          class linkRow extends GObject.Object {
            _init(chk, info, imgstatus) {
              super._init();
              this.status = imgstatus;
              this.chk = chk;
              this.info = info;
            }
          }
        );


        this.textBuffer = new Gtk.TextBuffer();
        const langManager = new GtkSource.LanguageManager();
        this.htmlBuffer = new GtkSource.Buffer(
          { language: langManager.get_language('html') },
        );

        this.textView.set_buffer(this.textBuffer);
        this.htmlSourceView.set_buffer(this.htmlBuffer);

        this.textBuffer.connect('changed', () => {
          this.saveButton.add_css_class('suggested-action');
        });

        this.htmlBuffer.connect('changed', () => {
          this.saveButton.add_css_class('suggested-action');
          this.htmlPreview.load_html(this.previewAttachments(this.htmlBuffer.text), null);
        });

        const defhtmlstr = '<h1>Hi!</h1><p>this is text</p>';
        const len = encodeURI(defhtmlstr).split(/%..|./).length - 1;
        this.htmlBuffer.set_text(defhtmlstr, len);
        this.htmlPreview.load_html(this.htmlBuffer.text, null);
        this.saveButton.remove_css_class('suggested-action');


        this.newLinkButton.connect('clicked', () => {
          Template.addLink(this.addLinkEntry.get_text());
          this.App.emit('update_attachments', true);
        });

        /**
         * Open a modal with a list of found images and allow
         * user to select which ones to extract.
         */
        this.extractButton.connect('clicked', () => {
          this.extractable = [];


          const _saveExtract = async () => {
            try {
              const solved = await Template.doExtract(this.extractable);
              Promise.allSettled(solved).then(reses => {
                console.log('reses : ', reses);
                this.App.emit('update_attachments', true);
                const len = encodeURI(appData.get('HTML')).split(/%..|./).length - 1;
                this.htmlBuffer.set_text(appData.get('HTML'), len);
                this.saveButton.remove_css_class('suggested-action');
              }).catch(e => {
                console.log(e);
              });
              
            } catch (error) {
              console.log(error);
            }
            
          }

          

          const listStore = new Gio.ListStore(linkRow);
          const selection = new Gtk.MultiSelection();
          selection.set_model(listStore);
          const lTreeView = new Gtk.ColumnView(selection);
          // this.rScrolledWindow.set_child(this.rTreeView);
          lTreeView.set_model(selection);

          const extModal = new modalExtract();
          // 'extractCheckAllBtn', 'extractScroll'
          const extractScroll = extModal._extractScroll;
          extractScroll.set_child(lTreeView);
          
          const chkFact = new Gtk.SignalListItemFactory();
          chkFact.connect("setup", (widget, item) => {
            const chkbtn = new Gtk.CheckButton();
            chkbtn.connect("toggled", (w) => {
              console.log(w.get_active());
              if (w.get_active()) {
                this.extractable.push(w.get_name());
              } else {
                // const i = this.extractable.indexOf(widget.get_name());
                this.extractable = this.extractable.filter(link => link !== w.get_name());
              }
              console.log(this.extractable);
            });
            item.set_child(chkbtn);
          });
          chkFact.connect("bind", (widget, item) => {
            const chkbtn = item.get_child();

            const obj = item.get_item();
            chkbtn.set_name(obj.chk);
            if (obj.status == 'notfound') {
              chkbtn.set_active(true);
              if (!this.extractable.includes(obj.chk)) {
                this.extractable.push(obj.chk);
              }
            }
          });
          
          const infoFact = new Gtk.SignalListItemFactory();
          infoFact.connect("setup", (widget, item) => {

            const modalLine = new widgetExtract();
            // 'checkbutton', 'filenameLabel'

            // const box = new Gtk.Box();
            item.set_child(modalLine);
          });
          infoFact.connect("bind", (widget, item) => {
            const w = item.get_child();
            const obj = item.get_item();
            // const w = box.get_first_cild();
            const filestatusLabel = w._filestatusLabel;
            const filenameLabel = w._filenameLabel;
            filenameLabel.set_text(obj.info);
            filestatusLabel.set_text(obj.status);
          });

          const chkCol = new Gtk.ColumnViewColumn({
            title: 'Select',
            factory: chkFact
          });

          const infoCol = new Gtk.ColumnViewColumn({
            title: 'Image',
            factory: infoFact
          });

          lTreeView.append_column(chkCol);
          lTreeView.append_column(infoCol);
          const imgLinks = Template.extractImages(appData.get('HTML'));
          imgLinks.forEach((link) => {
            let imgstatus = 'remote';
            let lpath = link;
            let mylink = new Promise((resolve, reject) => {
              //
              // Make sure local links are reachable
              //
              console.log('is it remote? : ', myFile.isremote(link));
              if (myFile.isremote(link) == false) { 
                const [exists, fullpath] = myFile.localExists(link, this.assetpath);
                if (exists) {
                  imgstatus = 'local';
                  lpath = fullpath;
                  resolve([imgstatus, {'key': link, 'path': lpath}]);
                } else {
                  //
                  // Prompt to find file
                  //
                  const props = {
                    title: `Locate ${link}`,
                    foldername: this.assetpath
                  }
                  try {
                    myFile.fileOpen(props, (res) => {
                      this.assetpath = res.get_parent().get_path();
                      lpath = res.get_path();
                      console.log('link after open : ', lpath);
                      imgstatus = 'local';
                      resolve([imgstatus, {'key': link, 'path': lpath}]);
                    });
                    
                  } catch (error) {
                    //
                    // Need to log error
                    //
                    imgstatus = 'notfound';
                    reject([imgstatus, {'key': link, 'path': lpath}]);
                  }
                }
              } else {
                resolve(['remote', {'key': link, 'path': lpath}]);
              }
            });
            // console.log('mylink at constructor : ', mylink);
            mylink.then(l => {
              console.log('mylink at constructor : ', l[1]);
              const row = new linkRow(GLib.base64_encode(JSON.stringify(l[1])), myFile.nameFromPath(l[1]['path']), l[0]);
              listStore.append(row);
            }).catch(l => {
              console.log('error link : ', l);
              const row = new linkRow(GLib.base64_encode(JSON.stringify(l[1])), myFile.nameFromPath(l[1]['path']), l[0]);
              listStore.append(row);
            });
            
          });


          const props = {
            title: 'Embed Images',
            label: 'Choose images to embed.',
            content: extModal,
            window: this.App._window,
            saveHandler: _saveExtract
          };
          myModal.doModal(props);

          // https://stackoverflow.com/questions/43716020/gjs-synchronous-get-http-request
          // https://stackoverflow.com/questions/14806981/using-gjs-how-can-you-make-an-async-http-request-to-download-a-file-in-chunks
          console.log('extract clicked');
        });

        this.newAttachmentButton.connect('clicked', () => {
          const props = {
            title: 'Select An Attachment'
          }
          try {
            myFile.fileOpen(props, (res) => {
              try {
                Template.addAttachment(res);
              } catch (error) {
                myModal.showOpenModal('Error', error.message, this.App);
              }
              if (myMessage.weight(this.textBuffer.text, this.htmlBuffer.text) > 20971520) {
                myModal.showOpenModal('Warning', Gettext.gettext('Your mailing exceeds 20MB and may not be received by all reipients.'), this.App);
              }
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
              this.assetpath = res.get_parent().get_path();
              const td = new TextDecoder('utf-8');
              const [, contents] = res.load_contents(null);
              const myTemplate = td.decode(contents);
              const len = encodeURI(myTemplate).split(/%..|./).length - 1;
              
              try {
                let [ok, ] = GLib.utf8_validate(myTemplate);
                if (ok) {
                  this.htmlBuffer.set_text(myTemplate, len);
                } else {
                  myModal.showOpenModal('Error', Gettext.gettext('Template is not a valid utf8 text file.'), this.App);
                }
              } catch (error) {
                console.error(error);
                myModal.showOpenModal('Error', Gettext.gettext('Template is not a valid utf8 text file.'), this.App);
              }
              
            });
          } catch (error) {
            myModal.showOpenModal('Error', error.message, this.App);
          }
        });

        this.saveButton.connect('clicked', () => {
          this.saveButton.remove_css_class('suggested-action');

          appData.set('HTML', this.htmlBuffer.get_text(
            this.htmlBuffer.get_start_iter(),
            this.htmlBuffer.get_end_iter(),
            true
          ));
          appData.set('TEXT', this.textBuffer.get_text(
            this.textBuffer.get_start_iter(),
            this.textBuffer.get_end_iter(),
            true
          ));
          if (myMessage.weight(this.textBuffer.text, this.htmlBuffer.text) > 20971520) {
            myModal.showOpenModal('Warning', Gettext.gettext('Your mailing exceeds 20MB and may not be received by all reipients.'), this.App);
          }
        });

        
        return this.contentMain;
      }
    },
);
