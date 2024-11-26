import type { AvatarSize } from 'design-system/avatar';
import { Avatar } from 'design-system/avatar';
import React from 'react';
import { yourProfileStoreSelectors } from 'store/your-profile/your-profile.store';
import { getYourUserProfileAct } from 'acts/get-your-user-profile.act';

interface YourAvatarContainerProps {
  size: AvatarSize;
}

const alt = `Your avatar`;

const YourAvatarContainer = ({ size }: YourAvatarContainerProps) => {
  const yourProfileStore = yourProfileStoreSelectors.useState();

  React.useEffect(() => {
    getYourUserProfileAct();
  }, []);

  if (yourProfileStore.is !== `ok`) {
    return <Avatar size={size} alt={alt} />;
  }

  return yourProfileStore.user?.avatar ? (
    <Avatar
      size={size}
      key={yourProfileStore.user.avatar[size].id}
      src={yourProfileStore.user.avatar[size].src}
      alt={alt}
    />
  ) : yourProfileStore.user?.displayName ? (
    <Avatar
      size={size}
      char={yourProfileStore.user.displayName.charAt(0)}
      alt={alt}
    />
  ) : (
    <Avatar size={size} alt={alt} />
  );
};

export { YourAvatarContainer };
