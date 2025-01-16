import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import HomePage from '../components/HomePage.vue';
import Profile from '@/components/Profile.vue';
import VerifyEmail from '../components/VerifyEmail.vue';
import RequestResetPassword from '@/components/RequestResetPassword.vue';
import ResetPassword from '@/components/ResetPassword.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/home', name: 'Home', component: HomePage, meta: { requiresAuth: true } },
  { path: '/profile/:id', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/auth/verify', name: 'VerifyEmail', component: VerifyEmail },
  { path: '/request-reset-password', name: 'RequestResetPassword', component: RequestResetPassword },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
