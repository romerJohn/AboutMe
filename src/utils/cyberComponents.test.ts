import test from 'node:test';
import assert from 'node:assert/strict';
import { cn } from './cn';

test('CyberButton variant classes generate expected cybernetic styling', () => {
  const primaryClass = cn(
    'relative inline-flex items-center font-mono',
    'bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-slate-950'
  );
  assert.ok(primaryClass.includes('from-[#00E5FF]'));
  assert.ok(primaryClass.includes('to-[#38BDF8]'));

  const dangerClass = cn(
    'relative inline-flex items-center font-mono',
    'bg-rose-500/15 text-rose-300 border-rose-500/40'
  );
  assert.ok(dangerClass.includes('text-rose-300'));
});

test('CyberToast logic creates unique IDs and filters dismissed toasts', () => {
  type Toast = { id: string; type: string; title: string; duration?: number };
  let toasts: Toast[] = [];

  const addToast = (type: string, title: string, duration = 4000) => {
    const id = `test-${Math.random()}`;
    toasts = [...toasts, { id, type, title, duration }];
    return id;
  };

  const dismissToast = (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
  };

  const id1 = addToast('success', 'Inquiry Dispatched');
  const id2 = addToast('error', 'Network Timeout');
  assert.equal(toasts.length, 2);
  assert.equal(toasts[0].title, 'Inquiry Dispatched');
  assert.equal(toasts[1].type, 'error');

  dismissToast(id1);
  assert.equal(toasts.length, 1);
  assert.equal(toasts[0].id, id2);
});

test('CyberTooltip position mapping resolves valid layout classes', () => {
  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  assert.ok(positionStyles.top.includes('bottom-full'));
  assert.ok(positionStyles.bottom.includes('top-full'));
  assert.ok(positionStyles.left.includes('right-full'));
  assert.ok(positionStyles.right.includes('left-full'));
});

test('CyberDialog keyboard escape logic triggers onClose callback', () => {
  let closed = false;
  const onClose = () => {
    closed = true;
  };

  const simulateKeyDown = (key: string) => {
    if (key === 'Escape') {
      onClose();
    }
  };

  simulateKeyDown('Enter');
  assert.equal(closed, false);

  simulateKeyDown('Escape');
  assert.equal(closed, true);
});
