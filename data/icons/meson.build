icon = 'com.github.brainstormtrooper.facteur.svg'


scalable_icondir = join_paths('hicolor', 'scalable', 'apps')
install_data (
  join_paths(scalable_icondir, icon),
  install_dir: join_paths(get_option('datadir'), 'icons', scalable_icondir)
)

symbolic_icondir = join_paths('hicolor', 'symbolic', 'apps')
install_data (
  join_paths(symbolic_icondir, 'com.github.brainstormtrooper.facteur-symbolic.svg'),
  install_dir: join_paths(get_option('datadir'), 'icons', symbolic_icondir),
  rename: '@0@-symbolic.svg'.format(app_id)
)
