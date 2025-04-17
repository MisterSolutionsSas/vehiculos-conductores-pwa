// src/utils/withAuth.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      }
    }, []);

    return <Component {...props} />;
  };
}