import React from "react";
import Logo from "~/assets/logo.svg";

type CardProps = {
  withLogo?: boolean;
  title?: string;
  subtitle?: string;
};

export default function Card({
  withLogo,
  title,
  subtitle,
  children,
}: React.PropsWithChildren<CardProps>) {
  return (
    <div className="justify-cent mx-auto flex w-max flex-col rounded-lg bg-white px-8 py-9 shadow-card">
      {(title || subtitle || withLogo) && (
        <div className="mb-4 flex flex-col">
          {withLogo && (
            <img src={Logo} className="mb-6 w-10" alt="Simpledo Logo" />
          )}
          {title && (
            <h3 className="text-[22px] font-bold leading-[normal] text-darkBlueGrey">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-coolGray2 mt-1.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
