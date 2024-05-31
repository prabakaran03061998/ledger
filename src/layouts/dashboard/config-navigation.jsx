import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Accounts',
    path: '/account',
    icon: icon('ic_user'),
  },
  {
    title: 'transaction',
    path: '/transaction',
    icon: icon('ic_transaction'),
  },
];

export default navConfig;
