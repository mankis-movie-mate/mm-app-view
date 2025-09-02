import { Spinner } from './Spinner';

export function FullScreenLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/80 text-white backdrop-blur-sm">
      <Spinner className="h-12 w-12 border-4" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
