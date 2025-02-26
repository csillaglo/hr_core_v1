import { useTranslation } from 'react-i18next';

export const Dashboard = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
    </div>
  );
};
