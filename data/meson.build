data_resource = gnome.compile_resources(app_id + '.data',
  app_id + '.data.gresource.xml',
  source_dir: '.',
  gresource_bundle: true,
  install: true,
  install_dir : pkgdatadir)

appsdir = join_paths(get_option('datadir'), 'applications')
desktop = intl.merge_file(
  input : app_id + '.desktop.in',
  output : app_id + '.desktop',
  po_dir : '../po',
  type : 'desktop',
  install: true,
  install_dir: appsdir
)

gsettingsdir = join_paths(get_option('datadir'), 'glib-2.0', 'schemas')
gsettings_schema = app_id + '.gschema.xml'
install_data(gsettings_schema, install_dir : gsettingsdir)
# meson.add_install_script('../meson/meson_post_install.py')

local_schemas = configure_file(copy: true,
  input: gsettings_schema,
  output: gsettings_schema)

gnome.compile_schemas(
  build_by_default: true,
  depend_files: local_schemas
)

appdatadir = join_paths(get_option('datadir'), 'appdata')
appdata = intl.merge_file(
  input : app_id + '.appdata.xml.in',
  output : app_id + '.appdata.xml',
  po_dir : '../po',
  type : 'xml',
  install: true,
  install_dir: appdatadir
)
app_configuration.set('bindir', bindir)
dbusservicedir = join_paths(get_option('datadir'), 'dbus-1', 'services')
dbus_service = configure_file(
  configuration : app_configuration,
  input : app_id + '.service.in',
  output : app_id + '.service',
  install : true,
  install_dir : dbusservicedir
)


subdir('icons')
