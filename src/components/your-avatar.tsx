import { UserAvatarVariantKey, UserAvatarVariantObj } from 'models/user';
import React from 'react';
import { BiQuestionMark } from 'react-icons/bi';
import { yourProfileStoreSelectors } from 'store/your-profile/your-profile.store';

interface YourAvatarProps {
  size: UserAvatarVariantKey;
  h: UserAvatarVariantObj['h'];
  w: UserAvatarVariantObj['w'];
}

const YourAvatar = ({ size, h, w }: YourAvatarProps) => {
  const yourProfileStore = yourProfileStoreSelectors.useOk();

  return yourProfileStore.user?.avatar ? (
    <img
      referrerPolicy="no-referrer"
      className={`h-[${h}px] w-[${w}px] rounded-full shadow-lg`}
      src={yourProfileStore.user.avatar[size].src}
      alt="Your avatar"
    />
  ) : (
    <span className="text-xl capitalize">
      {yourProfileStore.user?.displayName ? (
        yourProfileStore.user?.displayName.charAt(0)
      ) : (
        <BiQuestionMark size={24} />
      )}
    </span>
  );
};

export { YourAvatar };
