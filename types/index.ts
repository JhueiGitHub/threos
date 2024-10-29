// types/index.ts
interface FlowContent {
  wallpaper?: string | null;
  dockIcons: Array<{
    id: string;
    name: string;
    image: string;
  }>;
}

interface ConstellationConfig {
  id: string;
  appId: string;
  flow: {
    id: string;
    name: string;
    type: "CORE" | "APP" | "CUSTOM";
    content: FlowContent;
    useFlowId: string | null;
    streamId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface Constellation {
  id: string;
  name: string;
  isActive: boolean;
  userId: string;
  configs: ConstellationConfig[];
  createdAt: Date;
  updatedAt: Date;
}
