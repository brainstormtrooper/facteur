project('facteur', 'c',
  version: '0.9.0',
  meson_version: '>= 1.0.0'
)


datadir = '/usr/share'
prefix = '/usr'


app_command = 'facteur'
app_id = 'com.github.brainstormtrooper.facteur'
app_configuration = configuration_data()
app_configuration.set('GJS', find_program('gjs').path())
# app_configuration.set('PACKAGE_NAME', meson.project_name())
app_configuration.set('PACKAGE_NAME', app_id)
app_configuration.set('PACKAGE_VERSION', meson.project_version())
app_configuration.set('prefix', prefix)
pkgdatadir = join_paths(datadir, meson.project_name())
# app_configuration.set('libdir', prefix, get_option('libdir')))
app_configuration.set('libdir', datadir)
app_configuration.set('pkgdatadir', pkgdatadir)
gnome = import('gnome')
intl = import('i18n')

# config_h = configuration_data()
GETTEXT_PACKAGE = app_id
app_configuration.set_quoted('GETTEXT_PACKAGE', GETTEXT_PACKAGE)
app_configuration.set_quoted('LOCALEDIR', join_paths(prefix, get_option('localedir')))
configure_file(
  output: 'config.h',
  configuration: app_configuration,
)
add_global_arguments([
  '-DHAVE_CONFIG_H',
  '-I' + meson.build_root(),
], language: 'c')







subdir('src')
# subdir('src/lib')
# subdir('src/ui')
# subdir('src/object')
subdir('data')
subdir('po')
meson.add_install_script('meson/meson_post_install.py')
# rpm = import('rpm')
# rpm.generate_spec_template()
