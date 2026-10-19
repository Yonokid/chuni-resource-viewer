import * as React from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import VersionSelect from "@/app/Components/VersionSelect";
import { PageContainer } from "@toolpad/core/PageContainer";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <DashboardLayout slots={{ toolbarActions: VersionSelect }}>
      <PageContainer>{props.children}</PageContainer>
    </DashboardLayout>
  );
}
