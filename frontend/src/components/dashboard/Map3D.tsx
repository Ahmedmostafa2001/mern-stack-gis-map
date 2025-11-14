import dynamic from 'next/dynamic';
import type { Map3DProps } from '@/types/DashboardType';

// Dynamic import, client-only
const Map3DViewer = dynamic(() => import('./Map3DViewerInner'), { ssr: false });

export default function Map3D(props: Map3DProps) {
  return <Map3DViewer {...props} />;
}
