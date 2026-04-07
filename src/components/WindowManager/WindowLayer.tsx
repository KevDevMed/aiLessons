import { useWindowStore } from '../../stores/useWindowStore';
import Window from './Window';

export default function WindowLayer() {
  const windows = useWindowStore((s) => s.windows);
  const order = useWindowStore((s) => s.order);

  return (
    <>
      {order.map((id, index) => {
        const win = windows[id];
        if (!win || win.isMinimized) return null;

        return (
          <Window
            key={win.id}
            win={win}
            zIndex={100 + index}
          />
        );
      })}
    </>
  );
}
