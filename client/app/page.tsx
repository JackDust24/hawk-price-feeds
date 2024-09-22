import PriceForm from './components/PriceForm';
import { RealTimeUpdates } from './components/Pusher';
import { MockTrigger } from './components/mock/MockTrigger';

export default function Home() {
  return (
    <div className='flexfont-[family-name:var(--font-geist-sans)]'>
      <main className='flex min-h-screen h-full bg-gray-100 items-center justify-center p-24'>
        <div className='flex flex-col gap-8 items-center justify-center text-center space-y-8'>
          <RealTimeUpdates />
        </div>
      </main>
      <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'>
        FOOTER
      </footer>
    </div>
  );
}
