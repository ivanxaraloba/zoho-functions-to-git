'use client';

import React, { useState } from 'react';

import { useProject } from '@/providers/project-provider';

import MainContainer from '@/components/layout/main-container';

import TabFunctions from './tab';

export default function Page({ params }: { params: { username: string } }) {
  const { username } = params;
  const project = useProject();

  return (
    <MainContainer
      breadcrumbs={[
        {
          label: 'Projects',
          href: '/projects',
        },
        {
          label: project?.name || '',
          href: `/projects/${project?.username}`,
        },
        {
          label: 'Zoho CRM',
        },
      ]}
    >
      <TabFunctions username={username} />
    </MainContainer>
  );
}
