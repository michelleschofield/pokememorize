import { Link } from 'react-router-dom';
import { type MenuItem } from './Menu';

type Props = {
  menuItem: MenuItem;
};

export function MenuItemDisplay({ menuItem }: Props) {
  const { name, path, iconUrl } = menuItem;
  return (
    <li className="inline-block  w-full">
      <Link className="w-full flex items-center justify-end py-2" to={path}>
        <img className="w-8 h-8" src={iconUrl} />
        <p className="px-2">{name}</p>
      </Link>
      <div className="w-full bg-white rounded-l-full h-1"></div>
    </li>
  );
}