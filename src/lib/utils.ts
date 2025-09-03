import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const IS_DEV = process.env.NEXT_PUBLIC_NODE_ENV === 'development';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(err: unknown): string {
  if (hasUserMessage(err)) {
    return err.userMessage;
  }
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return 'An unknown error occurred';
}

export function hasStringMessage(e: unknown): e is { message: string } {
  return typeof e === 'object' && e !== null && 'message' in e;
}
export function hasStatus(e: unknown): e is { status: number } {
  return typeof e === 'object' && e !== null && 'status' in e;
}
export function hasErrorCode(e: unknown): e is { errorCode: number } {
  return typeof e === 'object' && e !== null && 'errorCode' in e;
}

type UserMessageError = { userMessage: string };

function hasUserMessage(e: unknown): e is UserMessageError {
  return (
    typeof e === 'object' &&
    e !== null &&
    'userMessage' in e &&
    typeof (e as { userMessage: unknown }).userMessage === 'string'
  );

}
