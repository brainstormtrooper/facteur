/**
UI for displaying html message interface
*/
const { GLib, Gtk, Gio, GtkSource, WebKit, GObject, Pango, PangoCairo } = imports.gi;
const Cairo = imports.cairo;
const Gettext = imports.gettext;
const myTemplate = imports.lib.template;
const Template = new imports.object.Template.Template();

const myMessage = new imports.object.Message.Message();
const myModal = new imports.UI.Modal.UImodal();
const Data = imports.object.Data;
const appData = new Data.Data();
const myFile = imports.lib.file;


var widgetAttachment = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'widgetAttachment',
  Template: 'resource:///io/github/brainstormtrooper/facteur/widgetAttachment.ui',
  InternalChildren: ['filename', 'deleteButton', 'fileId', 'inlineButton', 'row2']
},
class widgetAttachment extends Gtk.Box {
  _init () {
    super._init();
    
  }
});

var contentMain = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'contentMain',
  Template: 'resource:///io/github/brainstormtrooper/facteur/contentMain.ui',
  InternalChildren: ['textView', 'expanderBox', 'htmlSourceView', 'htmlPreview', 'saveButton', 'addLinkEntry', 'cAttachSideButton',
  'cImportButton', 'addAttachmentButton', 'mediaScroll', 'mediaListBox', 'addLinkButton', 'attachmentsBox', 'attachmentsListBox', 'attachmentListExpander',
  'mediaTabLabel', 'AttachmentsTabLabel', 'VariablesTabLabel', 'contentSidebarNotebook']
},
class contentMain extends Gtk.Box {
  _init () {
    super._init();
    
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
        this.htmlPreview.load_html(this.previewAttachments(this.htmlBuffer.text), null);
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
        widget = this.mediaListBox.get_first_child();
        while (widget && widget == this.mediaListBox.get_first_child()) {
          this.mediaListBox.remove(widget);
          widget = this.mediaListBox.get_first_child();
        }
        const media = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'webm'];
        const currLinks = appData.get('LINKS');
        const imgLinks = Template.extractImages(appData.get('HTML'), this.assetpath);

        imgLinks.forEach((lob) => {
          const imgbox = new Gtk.Box({orientation: 'vertical', spacing: 6});
          const top = new Gtk.Box({orientation: 'horizontal', spacing: 6});
          const bottom = new Gtk.Box({orientation: 'horizontal', spacing: 6});
          const imgNameLabel = new Gtk.Label({label: myFile.nameFromPath(lob.link)});
          let fptxt;
          if (lob.fullpath) {
            fptxt = lob.fullpath;
          } else {
            fptxt = '';
          }
          const imgPathInput = new Gtk.Entry({text: fptxt, editable: false});
          let imgFindBtn, imgStatusLabel;
          if (lob.imgstatus == 'not found') {
            imgFindBtn = new Gtk.Button({label: 'Find'});
            imgFindBtn.connect('clicked', () => {

              try {
                const props = {
                  title: `Find ${myFile.nameFromPath(lob.link)}`,
                  foldername: this.assetpath
                }
                myFile.fileOpen(props, (res) => {
                  this.assetpath = res.get_parent().get_path();
                  const lpath = res.get_path();
                   try {
                    // open file
                    const file = Gio.File.new_for_path(lpath);
                    const [ok, contents, x] = file.load_contents(null);
                    const aid = appData.setInlineAttachment(Template.attachContents(myFile.nameFromPath(lob.link), contents), true);
                    Template.pathToCid(lob.link, aid);
                    this._updateUI();
                    this.App.emit('update_attachments', true);
                  } catch (error) {
                    myModal.showOpenModal('Error', error.message, this.App);
                  }
                  return true;
                });

              } catch (error) {
                log(error);
              }
            });
          } else if (lob.imgstatus == 'local') {
            imgStatusLabel = new Gtk.Label({label: lob.imgstatus});
            try {
              // open file
              const file = Gio.File.new_for_path(lob.fullpath);
              const [ok, contents, x] = file.load_contents(null);
              const aid = appData.setInlineAttachment(Template.attachContents(myFile.nameFromPath(lob.link), contents), true);
              Template.pathToCid(lob.link, aid);
              this._updateUI();

              return;
              // this.App.emit('update_attachments', true);
            } catch (error) {
              myModal.showOpenModal('Error', error.message, this.App);
            }
          } else {
            imgStatusLabel = new Gtk.Label({label: lob.imgstatus});
          }
          top.append(imgNameLabel);
          if(imgStatusLabel) {
            top.append(imgStatusLabel);
          } else {
            top.append(imgFindBtn);
          }
          bottom.append(imgPathInput);
          imgbox.append(top);
          imgbox.append(bottom);

          this.mediaListBox.append(imgbox);

        });

        const currAttachments = appData.get('ATTACHMENTS');
        currAttachments.forEach(attachment => {
          const aw = new widgetAttachment();
          aw._filename.set_text(attachment.fileName);
          aw._inlineButton.set_active(attachment.inline);
          aw._fileId.set_text(attachment.id);
          aw._deleteButton.connect('clicked', () => {
            appData.deleteAttachment(attachment.id);
            this.App.emit('update_attachments', true);
          });
          aw._inlineButton.connect('toggled', () => {
            appData.setInlineAttachment(attachment.id, aw._inlineButton.get_active());
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
            myStr = myStr.replaceAll(slug, inline);
          }
        });
        
        return myStr;
      }

      _buildUI () {
        this.App = Gio.Application.get_default();
        this.contentMain = new contentMain();

        this.expanderBox = this.contentMain._expanderBox;
        this.textView = this.contentMain._textView;
        this.htmlSourceView = this.contentMain._htmlSourceView;
        this.htmlPreview = this.contentMain._htmlPreview;
        this.saveButton = this.contentMain._saveButton;
        this.cAttachSideButton = this.contentMain._cAttachSideButton;
        this.cImportButton = this.contentMain._cImportButton;
        this.extractButton = this.contentMain._extractButton;
        this.newAttachmentButton = this.contentMain._addAttachmentButton;
        this.newLinkButton = this.contentMain._addLinkButton;
        this.addLinkEntry = this.contentMain._addLinkEntry;
        this.attachmentListExpander = this.contentMain._attachmentListExpander;
        this.attachmentsListBox = this.contentMain._attachmentsListBox;
        this.attachmentsBox = this.contentMain._attachmentsBox;
        this.contentSidebarNotebook = this.contentMain._contentSidebarNotebook; // test setting properties on notebook tab/header bar...
        this.mediaTabLabel = this.contentMain._mediaTabLabel; // test mediatab label rotation with pango
        this.AttachmentsTabLabel = this.contentMain._AttachmentsTabLabel;
        this.VariablesTabLabel = this.contentMain._VariablesTabLabel;
        this.mediaListBox = this.contentMain._mediaListBox;
        this.mediaScroll = this.contentMain._mediaScroll;

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

        // drawing area test

        const tabs = [
          {
            widget: this.mediaTabLabel,
            wclass: 'mediaTabLabel',
            tabtext: 'Images',
            w: -1,
            h: -1
          },
          {
            widget: this.AttachmentsTabLabel,
            wclass: 'AttachmentsTabLabel',
            tabtext: 'Attachments',
            w: -1,
            h: -1
          },
          {
            widget: this.VariablesTabLabel,
            wclass: 'VariablesTabLabel',
            tabtext: 'Variables',
            w: -1,
            h: -1
          }
        ];

        // First pass: measure text

        tabs.forEach(mytab => {

          const draw_vertical_text = (drawing_area, cr, width, height, data) => {
            const context = drawing_area.get_pango_context();
            const layout = Pango.Layout.new(context);
            layout.set_text(mytab.tabtext, -1);

            const font_description = Pango.FontDescription.from_string("Adwaita Sans 11");
            layout.set_font_description(font_description);

            const [w_text, h_text] = layout.get_pixel_size();

            cr.rotate(-Math.PI / 2);  // Rotate 90° counter-clockwise
            cr.moveTo(-w_text, 0);   // Align to upper-left (axis are swapped)
            cr.setSourceRGBA(0, 0, 0, 1.0);  // Black
            PangoCairo.show_layout(cr, layout);
          }

          const context = mytab.widget.get_pango_context();
          const temp_layout = Pango.Layout.new(context);
          temp_layout.set_text(mytab.tabtext, -1);
          const font_description = Pango.FontDescription.from_string("Adwaita Sans 11");
          temp_layout.set_font_description(font_description);
          const [w_text, h_text] = temp_layout.get_pixel_size();
          mytab.w = h_text;    // swap for vertical orientation
          mytab.h = w_text;    // swap for vertical orientation
          mytab.widget.set_size_request(mytab.w, mytab.h);

          // Set the draw function for actual drawing
          mytab.widget.set_draw_func(draw_vertical_text);

          mytab.widget.set_halign(Gtk.Align.START);
          mytab.widget.set_valign(Gtk.Align.START);
        });







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


        //
        // Need to hide revealer box child
        //
        this.attachmentsBox.set_visible(false);
        this.cAttachSideButton.connect('clicked', () => {
          this.attachmentListExpander.add_css_class('cRevealer');
          this.attachmentsBox.set_visible(!this.attachmentsBox.get_visible());
          this.attachmentListExpander.set_reveal_child(!this.attachmentListExpander.get_reveal_child());
        });

        this.newLinkButton.connect('clicked', () => {
          Template.addLink(this.addLinkEntry.get_text());
          this.App.emit('update_attachments', true);
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
                myModal.showOpenModal('Warning', Gettext.gettext('Your mailing exceeds 20MB and may not be received by all recipients.'), this.App);
              }
              this.App.emit('update_attachments', true);
            });
          } catch (error) {
            log(error);
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
                  this.App.emit('update_attachments', true);
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
          this.App.emit('update_attachments', true);
          if (myMessage.weight(this.textBuffer.text, this.htmlBuffer.text) > 20971520) {
            myModal.showOpenModal('Warning', Gettext.gettext('Your mailing exceeds 20MB and may not be received by all recipients.'), this.App);
          }
        });

        
        return this.contentMain;
      }
    },
);
