import type { AvatarSize } from 'design-system/avatar';
import { Avatar } from 'design-system/avatar';
import React from 'react';
import { getYourUserProfile } from 'actions/get-your-user-profile.action';
import { useYourProfileState } from 'store/your-profile';

interface YourAvatarContainerProps {
  size: AvatarSize;
}

const alt = `Your avatar`;

const YourAvatarContainer = ({ size }: YourAvatarContainerProps) => {
  const yourProfile = useYourProfileState();

  React.useEffect(() => {
    getYourUserProfile();
  }, []);

  if (yourProfile.is !== `ok`) {
    return <Avatar size={size} alt={alt} />;
  }

  return yourProfile.user?.avatar ? (
    <Avatar
      size={size}
      key={yourProfile.user.avatar[size].id}
      src={yourProfile.user.avatar[size].src}
      alt={alt}
    />
  ) : yourProfile.user?.displayName ? (
    <Avatar
      size={size}
      char={yourProfile.user.displayName.charAt(0)}
      alt={alt}
    />
  ) : (
    <Avatar size={size} alt={alt} />
  );
};

export { YourAvatarContainer };
