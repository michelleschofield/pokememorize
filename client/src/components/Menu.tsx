import { FaBars } from 'react-icons/fa';
import { MenuItemDisplay } from './MenuItemDisplay.tsx';
import { useState } from 'react';

export type MenuItem = {
  name: string;
  iconUrl: string;
  path: string;
};

type Props = {
  menuItems: MenuItem[];
};
export function Menu({ menuItems }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {!isOpen && <FaBars onClick={() => setIsOpen(true)} />}
      {isOpen && (
        <div className="flex absolute bg-red-600 text-white top-0 left-0">
          <nav
            className={`inline-block py-2 pl-4 flex flex-col ${
              isOpen ? 'w-64' : 'w-0'
            }`}>
            <FaBars onClick={() => setIsOpen(false)} size="40" />
            <ul>
              {menuItems.map((menu) => (
                <MenuItemDisplay key={menu.name} menuItem={menu} />
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
