app_resource_src = gnome.compile_resources(
  app_id + '.src',
  app_id + '.src.gresource.xml',
  gresource_bundle: true,
  install: true,
  install_dir : pkgdatadir
)

app_launcher = configure_file(
  output : app_command,
  input : app_id + '.in',
  configuration: app_configuration
)

install_data(app_launcher,
  install_dir: pkgdatadir,
  install_mode: 'rwxr-xr-x'
)

run_target('run',
  command: app_launcher,
  depends: app_resource_src
)
