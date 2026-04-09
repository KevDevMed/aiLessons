import { useWindowStore } from '../../stores/useWindowStore';
import Window from './Window';

export default function WindowLayer() {
  const order = useWindowStore((s) => s.order);

  return (
    <>
      {order.map((id, index) => (
        <Window key={id} windowId={id} zIndex={100 + index} />
      ))}
    </>
  );
}
