import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from '../components/auth/RequireAuth';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route path="/" element={<HomePage />} />
        
        {/* HR Admin routes */}
        <Route element={<RequireAuth allowedRoles={['hr_admin', 'company_admin', 'superadmin']} />}>
          <Route path="/employees/*" element={<EmployeeRoutes />} />
          <Route path="/departments/*" element={<DepartmentRoutes />} />
        </Route>

        {/* Company Admin routes */}
        <Route element={<RequireAuth allowedRoles={['company_admin', 'superadmin']} />}>
          <Route path="/settings/*" element={<SettingsRoutes />} />
        </Route>
      </Route>
    </Routes>
  );
};
