import { getYourAccountAct } from "acts/get-your-account.act";
import { getYourUserProfileAct } from "acts/get-your-user-profile.act";
import type { AvatarSize } from "design-system/avatar";
import { Avatar } from "design-system/avatar";
import React from "react";
import { useYourUserProfileState } from "store/your-user-profile";

interface YourAvatarContainerProps {
  size: AvatarSize;
}

const alt = `Your avatar`;

const YourAvatarContainer = ({ size }: YourAvatarContainerProps) => {
  const yourUserProfile = useYourUserProfileState();

  React.useEffect(() => {
    getYourUserProfileAct();
    getYourAccountAct();
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
