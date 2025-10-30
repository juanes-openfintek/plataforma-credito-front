'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import decryptData from '../../helpers/decryptData';
import OnboardingFlow from '../../components/organisms/OnboardingFlow/OnboardingFlow';

const UserOnboardingPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const encryptedUser = session?.user;
  const decryptedUser = useMemo(() => {
    if (typeof encryptedUser !== 'string') return null;
    try {
      return decryptData(encryptedUser);
    } catch (error) {
      console.error('Error al descifrar la sesion:', error);
      return null;
    }
  }, [encryptedUser]);

  const userId = decryptedUser?.uid ?? decryptedUser?.id ?? decryptedUser?._id ?? null;

  if (status === 'loading') {
    return <div className='p-8 text-center'>Cargando informacion...</div>;
  }

  if (!decryptedUser || !decryptedUser?.token || !userId) {
    return (
      <div className='p-8 text-center'>
        Debes iniciar sesion para completar el onboarding.
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-20 pb-12 px-4 md:px-6 lg:px-8 bg-white'>
      <div className='max-w-4xl mx-auto'>
        <OnboardingFlow
          userId={userId}
          onComplete={() => router.push('/usuario/creditos')}
        />
      </div>
    </div>
  );
};

export default UserOnboardingPage;


