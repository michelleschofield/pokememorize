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
          <button onClick={() => setIsOpen(true)} className="cursor-pointer">
            <FaBars size="30" />
          </button>
        </div>
      )}
      {isOpen && (
        <div className="absolute flex top-0 left-0 w-full">
          <div className="flex bg-red-600 text-white  h-screen">
            <nav
              className={`py-2 pl-4 flex flex-col items-end ${
                isOpen ? 'w-64' : 'w-0'
              }`}>
              <button onClick={() => setIsOpen(false)} className="px-2">
                <FaBars size="40" />
              </button>
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
