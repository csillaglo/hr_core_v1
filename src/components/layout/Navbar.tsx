import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              HR Core
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={signOut}
              className="ml-4 px-4 py-2 rounded bg-red-500 text-white"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
