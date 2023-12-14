import React from 'react';
import SaveOnCloudButton from './save-on-cloud-button';
import { authStoreActions } from 'store/auth/auth.store';

const SignInTrigger = () => {
  return <SaveOnCloudButton onClick={() => authStoreActions.signIn(`popup`)} />;
};

export default SignInTrigger;
