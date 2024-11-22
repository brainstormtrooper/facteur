project('facteur', 'c',
  version: '0.20.2',
  meson_version: '>= 0.63.0'
)


# datadir = '/share'
# prefix = '/usr'

app_id = 'io.github.brainstormtrooper.facteur'

gnome = import('gnome')
intl = import('i18n')

gjs = find_program('gjs')
GETTEXT_PACKAGE = app_id

app_configuration = configuration_data()

app_configuration.set('GJS', gjs.full_path())
app_configuration.set('PACKAGE_NAME', app_id)
app_configuration.set('PACKAGE_VERSION', meson.project_version())
app_configuration.set('prefix', get_option('prefix'))

pkgdatadir = join_paths(get_option('datadir'), app_id)
app_configuration.set('libdir', join_paths(get_option('prefix'), get_option('libdir')))
app_configuration.set('pkgdatadir', pkgdatadir)

bindir = get_option('bindir')


subdir('data')
subdir('src')
subdir('po')
# meson.add_install_script('meson/meson_post_install.py')
gnome.post_install(
  glib_compile_schemas: true,
  gtk_update_icon_cache: true,
  update_desktop_database: false
)
