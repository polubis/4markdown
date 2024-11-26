// try {
//   setStatus({ pending: true, error: null, profile: null }); // State reset
//   const profile = await getUserProfile(); // Loading profile
//   setStatus({ pending: false, profile, error: null }); // Handling ok case
// } catch (error: unknown) {
//   setStatus({ pending: false, error, profile: null }); // Handling error case
// }

import React from 'react';
// Displays and loads list of users
type User = {
  id: number;
  name: string;
};

type UserProfileResult = {
  loading: boolean;
  error: Error | null;
  profile: User | null;
};

const UsersContainer = () => {
  const [result, setResult] = React.useState<UserProfileResult>({
    loading: false,
    error: null,
    profile: null,
  });

  React.useEffect(() => {
    const loadUserProfile = async (): Promise<void> => {
      try {
        setStatus({ pending: true, error: null, profile: null }); // State reset
        const profile = await getYourUserProfile(); // Loading profile
        setStatus({ pending: false, profile, error: null }); // Handling ok case
      } catch (error: unknown) {
        setStatus({ pending: false, error, profile: null }); // Handling error case
      }
    };

    loadUserProfile();
  }, []);

  if (result.loading) return <Spinner />;

  if (result.error) return <GenericErrorMessage />;

  return <UserProfile profile={result.profile} />;
};
