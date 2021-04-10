

imports.package.init({
  name: 'com.github.brainstormtrooper.gnome-emailer',
  version: '0.2.4',
  prefix: '/usr/local',
  libdir: 'lib',
});


const Gettext = imports.gettext;

const Emailer = imports.Emailer;

Gettext.bindtextdomain('gnome-emailer-0.1', '/usr/share/locale');
Gettext.textdomain('gnome-emailer-0.1');


// Run the application
// app = new GNOMEeMailer();
// app.application.run(ARGV);
// app.application.run(ARGV)([imports.system.programInvocationName].concat(ARGV));
// For technical reasons, this is the proper way you should start your application
(new Emailer.GNOMEeMailer()).application.run([imports.system.programInvocationName].concat(ARGV));

