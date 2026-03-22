import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guideSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Kom i gang',
      items: ['kom-i-gang/installasjon', 'kom-i-gang/oppsett', 'kom-i-gang/bambu-cloud'],
    },
    {
      type: 'category',
      label: 'Funksjoner',
      items: ['funksjoner/oversikt', 'funksjoner/filament', 'funksjoner/historikk', 'funksjoner/scheduler', 'funksjoner/controls'],
    },
    {
      type: 'category',
      label: 'Avansert',
      items: ['avansert/api', 'avansert/arkitektur', 'avansert/docker', 'avansert/plugins'],
    },
  ],
  kbSidebar: [
    'kb/intro',
    {
      type: 'category',
      label: 'Filamenter',
      items: ['kb/filamenter/pla', 'kb/filamenter/petg', 'kb/filamenter/abs', 'kb/filamenter/tpu', 'kb/filamenter/nylon', 'kb/filamenter/kompositt'],
    },
    {
      type: 'category',
      label: 'Byggplater',
      items: ['kb/byggplater/oversikt', 'kb/byggplater/cool-plate', 'kb/byggplater/engineering-plate', 'kb/byggplater/high-temp-plate', 'kb/byggplater/textured-pei'],
    },
    {
      type: 'category',
      label: 'Vedlikehold',
      items: ['kb/vedlikehold/dyse', 'kb/vedlikehold/plate', 'kb/vedlikehold/ams', 'kb/vedlikehold/smoring'],
    },
    {
      type: 'category',
      label: 'Feilsøking',
      items: ['kb/feilsoking/heft', 'kb/feilsoking/warping', 'kb/feilsoking/stringing'],
    },
  ],
};

export default sidebars;
