import React from 'react';

export type TileSize = 'small' | 'medium' | 'wide' | 'large';

export interface AppProps {
  windowId: string;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<AppProps>;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  singleton: boolean;
  tileSize: TileSize;
}
