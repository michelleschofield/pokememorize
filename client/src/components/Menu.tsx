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
export function Menu({ menuItems }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="transition-all ease-in-out grow z-10">
      {!isOpen && (
        <div className="grow">
          <FaBars size="30" onClick={() => setIsOpen(true)} />
        </div>
      )}
      {isOpen && (
        <div className="absolute flex top-0 left-0 w-full">
          <div className="flex bg-red-600 text-white  h-screen">
            <nav
              className={`py-2 pl-4 flex flex-col ${isOpen ? 'w-64' : 'w-0'}`}>
              <FaBars onClick={() => setIsOpen(false)} size="40" />
              <ul>
                {menuItems.map((item) => (
                  <MenuItemDisplay
                    onClick={() => setIsOpen(false)}
                    key={item.name}
                    menuItem={item}
                  />
                ))}
              </ul>
            </nav>
          </div>
          <div
            onClick={() => setIsOpen(false)}
            className="w-full h-screen bg-gray-600/25"></div>
        </div>
      )}
    </div>
  );
}
