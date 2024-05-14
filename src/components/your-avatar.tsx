import c from 'classnames';
import { UserAvatarVariantKey, UserAvatarVariantObj } from 'models/user';
import React from 'react';
import { BiQuestionMark } from 'react-icons/bi';
import { yourProfileStoreSelectors } from 'store/your-profile/your-profile.store';

interface YourAvatarProps {
  size: UserAvatarVariantKey;
  h: UserAvatarVariantObj['h'];
  w: UserAvatarVariantObj['w'];
}

const iconSizesLookup: Record<UserAvatarVariantKey, number> = {
  tn: 24,
  sm: 28,
  md: 32,
  lg: 40,
};

const YourAvatar = ({ size, h, w }: YourAvatarProps) => {
  const yourProfileStore = yourProfileStoreSelectors.useState();
  const iconSize = iconSizesLookup[size];

  if (yourProfileStore.is !== `ok`) {
    return <BiQuestionMark size={iconSize} />;
  }

  return yourProfileStore.user?.avatar ? (
    <img
      referrerPolicy="no-referrer"
      className={`h-[${h}px] w-[${w}px] rounded-full shadow-lg`}
      src={yourProfileStore.user.avatar[size].src}
      alt="Your avatar"
    />
  ) : yourProfileStore.user?.displayName ? (
    <span
      className={c(
        `capitalize`,
        {
          'text-xl': size === `tn` || size === `sm`,
        },
        {
          'text-2xl': size === `md`,
        },
        { 'text-3xl': size === `lg` },
      )}
    >
      {yourProfileStore.user?.displayName.charAt(0)}
    </span>
  ) : (
    <BiQuestionMark size={iconSize} />
  );
};

export { YourAvatar };
