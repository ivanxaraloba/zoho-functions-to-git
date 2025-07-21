import React, { ReactNode, ComponentType } from 'react';

import { TypographyH2 } from '../typography/typography-h2';
import Description from '../ui/description';

type AppTabHeaderProps = {
  label: ReactNode;
  description?: ReactNode;
  right?: ReactNode;
};

export function AppTabHeader({ label, description, right }: AppTabHeaderProps) {
  return (
    <div className="border-b py-10">
      <TypographyH2>{label}</TypographyH2>
      <div className="flex items-center">
        {description && (
          <div className="mt-4 flex flex-col gap-2">
            {description}
          </div>
        )}
        {right && (
          <div className="ml-auto flex items-center gap-3">
            {right}
          </div>
        )}
      </div>
    </div>
  );
}

type IconProps = {
  className?: string;
};

type IconComponent = ComponentType<IconProps>;

type WithIconProps = {
  icon?: IconComponent;
  children: ReactNode;
};

export function AppTabDescription({ icon: Icon, children }: WithIconProps) {
  return (
    <Description className="flex max-w-2xl items-center gap-2 ">
      {Icon && <Icon className="size-3" />}
      {children}
    </Description>
  );
}

export function AppTabContent({ icon: Icon, children }: WithIconProps) {
  return <div className="mt-10 flex flex-col gap-4">{children}</div>;
}

export function AppTabContentHead({ icon: Icon, children }: WithIconProps) {
  return <div className="flex w-full items-center gap-4">{children}</div>;
}

export function AppTabContentBody({ icon: Icon, children }: WithIconProps) {
  return <div className="grid grid-cols-3 gap-x-10 rounded-2xl">{children}</div>;
}

export function AppTabContentMissing({ icon: Icon, children }: WithIconProps) {
  return <div className="mt-10">{children}</div>;
}
