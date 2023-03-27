// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'profile',
    path: '/dashboard/profile',
    icon: icon('ic_user'),
  },
  {
    title: 'create a team',
    path: '/dashboard/create',
    icon: icon('ic_cart'),
  },
  {
    title: 'my teams',
    path: '/dashboard/my_teams',
    icon: icon('ic_blog'),
  },
];

export default navConfig;
