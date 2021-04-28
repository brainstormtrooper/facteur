

imports.package.init({
  name: 'com.github.brainstormtrooper.gnome-emailer',
  version: '0.3.0',
  prefix: '/usr/local',
  libdir: 'lib',
});


const Gettext = imports.gettext;

const Emailer = imports.Emailer;

Gettext.bindtextdomain('gnome-emailer-0.1', '/usr/share/locale');
Gettext.textdomain('gnome-emailer-0.1');

// eslint-disable-next-line max-len
(new Emailer.GNOMEeMailer()).run([imports.system.programInvocationName].concat(ARGV));
