import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/login-form';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <LoginForm />
    </main>
  );
}