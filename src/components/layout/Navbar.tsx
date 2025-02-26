import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { t } = useTranslation();
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold">HR Core</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
