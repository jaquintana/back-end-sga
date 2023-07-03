const { I18n } = require('i18n');
const path = require('path');

const i18n = new I18n({
  locales: ['en', 'es-419'],
  //directory: path.join('./', 'locales'),
  register: global,
  staticCatalog: {
    'es-419': require('./locales/es.json'),
    'en': require('./locales/en.json'),
  },

});


module.exports = i18n;