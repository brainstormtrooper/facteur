#!/usr/bin/gjs


const Gettext = imports.gettext;

const Emailer = imports.Emailer;

Gettext.bindtextdomain('facteur-0.5', '/usr/share/locale');
Gettext.textdomain('facteur-0.5');

function main(ARGV) {
  // eslint-disable-next-line max-len
  (new Emailer.Facteur()).run([imports.system.programInvocationName].concat(ARGV));
}

