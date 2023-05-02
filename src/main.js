

imports.package.init({
  name: 'com.github.brainstormtrooper.facteur',
  version: '0.9.0',
  prefix: '/usr/share',
  libdir: 'lib',
});


const Gettext = imports.gettext;

const Emailer = imports.Emailer;

Gettext.bindtextdomain('facteur-0.5', '/usr/share/locale');
Gettext.textdomain('facteur-0.5');

// eslint-disable-next-line max-len
(new Emailer.Facteur()).run([imports.system.programInvocationName].concat(ARGV));
