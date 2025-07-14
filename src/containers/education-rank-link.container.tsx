import { AppNavLink } from "components/app-nav-link";
import React from "react";
import { BiTrophy } from "react-icons/bi";
import { meta } from "../../meta";

const EducationRankLinkContainer = () => {
  return (
    <AppNavLink
      title="Go to education rank"
      className="hidden md:flex"
      to={meta.routes.education.rank}
    >
      <BiTrophy size={20} className="mr-2 shrink-0" />
      <span className="font-semibold">Education Rank</span>
    </AppNavLink>
  );
};

export { EducationRankLinkContainer };
