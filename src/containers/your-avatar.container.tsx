import type { AvatarSize } from 'design-system/avatar';
import { Avatar } from 'design-system/avatar';
import React from 'react';
import { getYourUserProfile } from 'actions/get-your-user-profile.action';
import { useYourUserProfileState } from 'store/your-user-profile';

interface YourAvatarContainerProps {
  size: AvatarSize;
}

const alt = `Your avatar`;

const YourAvatarContainer = ({ size }: YourAvatarContainerProps) => {
  const yourUserProfile = useYourUserProfileState();

  React.useEffect(() => {
    getYourUserProfile();
  }, []);

  if (yourUserProfile.is !== `ok`) {
    return <Avatar size={size} alt={alt} />;
  }

  return yourUserProfile.user?.avatar ? (
    <Avatar
      size={size}
      key={yourUserProfile.user.avatar[size].id}
      src={yourUserProfile.user.avatar[size].src}
      alt={alt}
    />
  ) : yourUserProfile.user?.displayName ? (
    <Avatar
      size={size}
      char={yourUserProfile.user.displayName.charAt(0)}
      alt={alt}
    />
  ) : (
    <Avatar size={size} alt={alt} />
  );
};

export { YourAvatarContainer };
